/**
 * Main express server init module
 *
 * @author Holly Springsteen
 */
// Node Packages
/* eslint-disable @typescript-eslint/no-var-requires */
// const cluster = require('node:cluster');
const fs = require('node:fs');
// const http = require('node:http');
// const { availableParallelism } = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { fileURLToPath } = require('node:url');

// Express Packages
// const express = require('express');
// const session = require('express-session');

// Util Packages
const compression = require('compression');

// Constants
// const numCPUs = process.env.WORKERS || availableParallelism();
// const port = process.env.PORT || 3000;
// const hostname = process.env.HOST || '0.0.0.0';

// Times in ms
// const oneHour = 3600000;
// const oneDay = oneHour * 24;
// const oneYear = oneDay * 365;

// Vite settings
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isTest = process.env.VITEST;
process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop';

/**
 * Create the server for the global.app.
 */
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort
) {
  const resolve = (resPath) => path.resolve(__dirname, resPath);

  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : '';

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  if (isProd) {
    global.app.use((await import('compression')).default());
    global.app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      })
    );
  } else {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    });
    // use vite's connect instance as middleware
    global.app.use(vite.middlewares);
  }

  global.app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;
      if (isProd) {
        template = indexProd;
        // eslint-disable-next-line
        render = (await import('../dist/server/entry-server.jsx')).render;
      } else {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('../index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('./src/entry-server.jsx')).render;
      }

      const context = {};
      const appHtml = render(url, context);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      const html = template.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }

    return null;
  });

  global.app.use(
    compression({
      chunkSize: 16384,
      level: 9,
    })
  );

  return { app: global.app, vite };
}

module.exports = {
  createServer,
};
