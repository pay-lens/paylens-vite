// Node Packages
import cluster from 'node:cluster';
import fs from 'node:fs';
import { availableParallelism } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

// Express Packages
import express from 'express';
import session from 'express-session';

// Util Packages
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';

// Constants
const totalWorkers = process.env.WORKERS || availableParallelism();
const port = process.env.PORT || 5173;
const hostname = process.env.HOST || '0.0.0.0';

// Times in ms
const oneYear = 3600000 * 24 * 365;

// Vite settings
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isTest = process.env.VITEST;
process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop';

// Function to resolve paths
const resolve = (resPath) => path.resolve(__dirname, resPath);

// Function to handle production settings
async function handleProd(app, indexProd) {
  console.log('indexProd', indexProd);
  app.use((await import('compression')).default());
  app.use(
    (await import('serve-static')).default(resolve('dist/client'), {
      index: false,
    })
  );
}

// Function to handle development settings
async function handleDev(app, root, hmrPort) {
  const vite = await (
    await import('vite')
  ).createServer({
    root,
    logLevel: isTest ? 'error' : 'info',
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: {
        port: hmrPort,
      },
    },
    appType: 'custom',
  });
  app.use(vite.middlewares);
  return vite;
}

// Function to handle requests
function handleRequests(app, isProd, indexProd, vite) {
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;
      if (isProd) {
        template = indexProd;
        /* eslint-disable import/no-unresolved */
        render = (await import('../dist/server/entry-server.jsx')).render;
      } else {
        template = fs.readFileSync(resolve('../index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('./src/entry-server.jsx')).render;
      }

      const context = {};
      const appHtml = render(url, context);

      if (context.url) {
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
}

// Function to handle compression
function handleCompression(app) {
  app.use(
    compression({
      chunkSize: 16384,
      level: 9,
    })
  );
}

// Function to handle session
function handleSession(app) {
  const sessionId = uuidv4().replace(/-/g, '');
  app.use(
    session({
      secret: process.env.SESSION || sessionId,
      name: 'node-template',
      proxy: true,
      resave: true,
      saveUninitialized: true,
      maxAge: oneYear,
      cookie: {
        secure: true,
      },
    })
  );
}

// Function to create the server
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort
) {
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : '';

  global.app = express();

  if (isProd) {
    await handleProd(global.app, indexProd);
  } else {
    const vite = await handleDev(global.app, root, hmrPort);
    handleRequests(global.app, isProd, indexProd, vite);
  }

  handleCompression(global.app);
  handleSession(global.app);

  return { app: global.app };
}

// Function to handle worker exit
function handleWorkerExit(worker, code, signal) {
  console.log(`worker ${worker.process.pid} died`);

  if (signal) {
    console.log('worker was killed by signal: ', signal);
  } else if (code !== 0) {
    console.log('worker exited with error code: ', code);
  }
}

// Function to start the server
function startServer(app) {
  app.listen(port, (error) => {
    if (error) {
      console.error('Error in server setup', error);
    }

    if (cluster.worker.id === totalWorkers) {
      console.log('\n--------------------------------');
      console.log('Application started successfully');
      console.log(`http://${hostname}:${port}`);
      console.log(`${totalWorkers} workers running`);
      console.log('--------------------------------\n');
    }
  });
}

// Function to handle unexpected errors
function handleUnexpectedErrors() {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception', error);
  });
}

(() => {
  // Don't create the server if running test
  if (isTest) {
    return;
  }

  // On primary cluster fork our workers cluster to run multiple instances of Node.js that can
  // distribute workloads among their application threads.
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalWorkers; i++) {
      cluster.fork();
    }

    cluster.on('exit', handleWorkerExit);
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    createServer().then(({ app }) => startServer(app));

    console.log(`Worker ${process.pid} started`);

    handleUnexpectedErrors();
  }
})();
