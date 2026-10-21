#!/usr/bin/env node
// Commercial gate wrapper: builds on apps/sdkwork-im-pc/dist, serves production shell on
// Explicit PLAYWRIGHT_PC_* ports are honored; otherwise the OS allocates free local ports.

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  assertPortAvailable,
  createOwnedProcessLifecycle,
  findAvailablePort,
  findAvailablePortPair,
  parseTcpPort,
  waitForOwnedHttpOk,
} from './sdkwork-im-pc-playwright-runner.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const pcRoot = path.join(repoRoot, 'apps', 'sdkwork-im-pc');
const browserDistEnvironmentAlias = {
  development: 'dev',
  test: 'test',
  staging: 'staging',
  demo: 'demo',
  production: 'prod',
};
const browserDistProfile = (process.env.SDKWORK_DEPLOYMENT_PROFILE ?? 'standalone').trim() === 'cloud'
  ? 'cloud'
  : 'standalone';
const browserDistEnvironment = browserDistEnvironmentAlias[
  (process.env.SDKWORK_ENVIRONMENT ?? 'production').trim()
] ?? 'prod';
const distRoot = path.join(pcRoot, 'dist', browserDistProfile, browserDistEnvironment);
const distIndex = path.join(distRoot, 'index.html');
const serverEntry = path.join(pcRoot, 'dist', 'server.cjs');
const embedBundle = path.join(pcRoot, 'dist-embed', 'im-pc-embed.js');
const pnpmExecutable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const commandShell = process.platform === 'win32';
const configuredE2ePort = process.env.PLAYWRIGHT_PC_PORT
  ? parseTcpPort(process.env.PLAYWRIGHT_PC_PORT, 'PLAYWRIGHT_PC_PORT')
  : null;
const configuredComponentPort = process.env.PLAYWRIGHT_PC_COMPONENT_PORT
  ? parseTcpPort(process.env.PLAYWRIGHT_PC_COMPONENT_PORT, 'PLAYWRIGHT_PC_COMPONENT_PORT')
  : null;
const componentServerEntry = path.join(repoRoot, 'scripts', 'dev', 'run-sdkwork-im-pc-vite-dev.mjs');
const lifecycle = createOwnedProcessLifecycle();
const useProcessGroup = process.platform !== 'win32';

assert.equal(
  fs.existsSync(distIndex),
  true,
  'apps/sdkwork-im-pc/dist/<profile>/<env>/index.html must exist; run pnpm build in apps/sdkwork-im-pc first',
);
assert.equal(
  fs.existsSync(serverEntry),
  true,
  'apps/sdkwork-im-pc/dist/server.cjs must exist; run pnpm build in apps/sdkwork-im-pc first',
);
assert.equal(
  fs.existsSync(embedBundle),
  true,
  'apps/sdkwork-im-pc/dist-embed/im-pc-embed.js must exist; run pnpm run build:embed in apps/sdkwork-im-pc first',
);

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = lifecycle.track(spawn(command, args, {
      detached: useProcessGroup,
      stdio: 'inherit',
      shell: commandShell,
      ...options,
    }), { processGroup: useProcessGroup });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`));
    });
  });
}

async function main() {
  await lifecycle.run(async ({ signal }) => {
    let e2ePort = configuredE2ePort;
    let componentPort = configuredComponentPort;
    if (e2ePort === null && componentPort === null) {
      [e2ePort, componentPort] = await findAvailablePortPair();
    } else {
      e2ePort ??= await findAvailablePort({ host: '0.0.0.0' });
      if (componentPort === null) {
        for (let attempt = 0; attempt < 20; attempt += 1) {
          const candidate = await findAvailablePort({ host: '127.0.0.1' });
          if (candidate !== e2ePort) {
            componentPort = candidate;
            break;
          }
        }
        assert.notEqual(componentPort, null, 'unable to allocate a distinct component port');
      }
    }
    const e2eBaseUrl = `http://127.0.0.1:${e2ePort}`;
    const componentBaseUrl = `http://127.0.0.1:${componentPort}`;
    assert.notEqual(
      e2ePort,
      componentPort,
      'PLAYWRIGHT_PC_PORT and PLAYWRIGHT_PC_COMPONENT_PORT must be different',
    );
    await Promise.all([
      assertPortAvailable({
        host: '0.0.0.0',
        port: e2ePort,
        readinessHosts: ['127.0.0.1'],
      }),
      assertPortAvailable({ host: '127.0.0.1', port: componentPort }),
    ]);
    if (signal.aborted) {
      return;
    }

    const server = lifecycle.track(spawn(process.execPath, [serverEntry], {
      cwd: pcRoot,
      detached: useProcessGroup,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: String(e2ePort),
      },
      shell: false,
      stdio: 'inherit',
      windowsHide: true,
    }), { processGroup: useProcessGroup });
    const componentServer = lifecycle.track(spawn(
      process.execPath,
      [componentServerEntry, '--strictPort'],
      {
        cwd: pcRoot,
        detached: useProcessGroup,
        env: {
          ...process.env,
          SDKWORK_IM_PC_DEV_HOST: '127.0.0.1',
          SDKWORK_IM_PC_DEV_PORT: String(componentPort),
        },
        shell: false,
        stdio: 'ignore',
        windowsHide: true,
      },
    ), { processGroup: useProcessGroup });
    await Promise.all([
      waitForOwnedHttpOk({
        child: server,
        url: `${e2eBaseUrl}/`,
        verifyResponse: ({ body, headers }) => (
          headers['x-content-type-options'] === 'nosniff'
          && /<div\s+id=["']root["']/u.test(body)
        ),
      }),
      waitForOwnedHttpOk({
        child: componentServer,
        url: `${componentBaseUrl}/e2e/fixtures/conversation-list-harness.html?count=1`,
        verifyResponse: ({ body }) => body.includes('Conversation list virtualization harness'),
      }),
    ]);
    await runCommand(pnpmExecutable, ['exec', 'playwright', 'test'], {
      cwd: pcRoot,
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: e2eBaseUrl,
        PLAYWRIGHT_COMPONENT_BASE_URL: componentBaseUrl,
      },
    });
    if (!signal.aborted) {
      console.log('sdkwork-im PC Playwright e2e passed');
    }
  });
}

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) {
  await main();
}
