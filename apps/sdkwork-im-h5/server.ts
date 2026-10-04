import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const HOST = process.env.SDKWORK_IM_H5_SERVER_HOST ?? '0.0.0.0';

function resolveServerPort(): number {
  const value = process.env.SDKWORK_IM_H5_SERVER_PORT?.trim() || '4178';
  const port = Number.parseInt(value, 10);
  if (!/^\d+$/u.test(value) || port < 1 || port > 65_535) {
    throw new Error(`SDKWORK_IM_H5_SERVER_PORT must be a TCP port, received: ${value}`);
  }
  return port;
}

/**
 * Resolves the built client directory.
 *
 * Browser builds land in the canonical `dist/<profile>/<envAlias>` layout
 * (`BROWSER_RUNTIME_ENV_SPEC` / `browser-dist-layout.mjs`: for example
 * `dist/standalone/prod`), never directly under `dist/`, so a bare `dist`
 * root would serve a directory that contains no index.html. The environment
 * segment comes from `SDKWORK_IM_H5_ENVIRONMENT` (default `production`); an
 * explicit `SDKWORK_IM_H5_STATIC_DIST_DIR` wins when an operator mounts a
 * prepared directory.
 */
function resolveStaticDistDir(): string {
  const override = process.env.SDKWORK_IM_H5_STATIC_DIST_DIR?.trim();
  if (override) {
    return path.resolve(override);
  }
  const profile = (process.env.SDKWORK_DEPLOYMENT_PROFILE?.trim() || 'standalone')
    .toLowerCase();
  if (profile !== 'standalone' && profile !== 'cloud') {
    throw new Error(
      `SDKWORK_DEPLOYMENT_PROFILE must be standalone or cloud, received: ${profile}`,
    );
  }
  const environmentAliases: Record<string, string> = {
    development: 'dev',
    test: 'test',
    staging: 'staging',
    demo: 'demo',
    production: 'prod',
  };
  const environment = (process.env.SDKWORK_IM_H5_ENVIRONMENT?.trim() || 'production')
    .toLowerCase();
  const alias = environmentAliases[environment];
  if (!alias) {
    throw new Error(
      `SDKWORK_IM_H5_ENVIRONMENT must be one of ${Object.keys(environmentAliases).join(', ')}, received: ${environment}`,
    );
  }
  const canonicalDir = path.resolve(process.cwd(), 'dist', profile, alias);
  if (fs.existsSync(path.join(canonicalDir, 'index.html'))) {
    return canonicalDir;
  }
  // Legacy layouts (a bare dist/index.html) still serve; anything else fails
  // at startup with the path an operator can inspect.
  const legacyDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(path.join(legacyDir, 'index.html'))) {
    return legacyDir;
  }
  throw new Error(
    `No built H5 client found; expected ${canonicalDir} (or legacy ${legacyDir}) to contain index.html`,
  );
}

async function startServer(): Promise<void> {
  const app = express();
  const port = resolveServerPort();

  app.use(express.json());

  // Vite middleware for development; static dist in production.
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = resolveStaticDistDir();
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, HOST, () => {
    console.log(`[sdkwork-im-h5] server running on http://${HOST}:${port}`);
  });
}

void startServer().catch((error: unknown) => {
  console.error('[sdkwork-im-h5] server startup failed', error);
  process.exit(1);
});
