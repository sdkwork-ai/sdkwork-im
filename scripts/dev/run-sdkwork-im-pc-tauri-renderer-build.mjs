#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const imPcAppRoot = path.resolve(scriptDir, '../../apps/sdkwork-im-pc');
const viteBuildScript = path.join(scriptDir, 'run-vite-cli.mjs');

// The desktop host embeds the standalone renderer output only. Pin the Vite
// mode so an ambient SDKWORK_DEPLOYMENT_PROFILE/SDKWORK_ENVIRONMENT (for
// example cloud.production in CI) cannot move the build to dist/cloud/prod
// while tauri.conf.json embeds dist/standalone/prod.
const DESKTOP_RENDERER_MODE = 'standalone.production';
const forwardedArgs = process.argv.slice(2);
const modeArgs = forwardedArgs.some((arg) => arg === '--mode' || arg.startsWith('--mode='))
  ? forwardedArgs
  : [...forwardedArgs, '--mode', DESKTOP_RENDERER_MODE];

process.chdir(imPcAppRoot);
process.argv = [
  process.argv[0],
  viteBuildScript,
  'build',
  ...modeArgs,
];

await import(pathToFileURL(viteBuildScript).href);
