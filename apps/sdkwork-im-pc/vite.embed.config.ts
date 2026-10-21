/**
 * Embed bundle build: one self-contained IIFE a host page loads at runtime to
 * mount an IM surface.
 *
 * The configuration reuses the application's resolve aliases, Tailwind
 * pipeline, and definitions, then swaps the HTML application build for a
 * library entry so the host never compiles IM sources or installs IM
 * dependencies. React and every other dependency are bundled: the host page
 * owns no module table entry for this bundle.
 */
import { defineConfig, type UserConfig } from 'vite';
import baseExport from './vite.config';

const EMBED_OUT_DIR = 'dist-embed';

export default defineConfig(async (env) => {
  const base: UserConfig = typeof baseExport === 'function' ? await baseExport(env) : baseExport;
  return {
    ...base,
    // A library bundle has no Vite HTML pipeline to inject the production
    // `process.env.NODE_ENV` define, so React's dev branch would stay in the
    // artifact and throw "process is not defined" in a browser. Bake the
    // define (and an empty env object) into the bundle.
    define: {
      ...base.define,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env': '{}',
    },
    build: {
      ...base.build,
      outDir: EMBED_OUT_DIR,
      emptyOutDir: true,
      copyPublicDir: false,
      lib: {
        entry: 'src/embed/main.tsx',
        formats: ['iife'],
        name: 'SdkworkImEmbed',
        fileName: () => 'im-pc-embed.js',
      },
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  };
});
