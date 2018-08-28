import * as express from 'express';
import * as fallback from 'express-history-api-fallback';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as openResource from 'open';
import { join, resolve } from 'path';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

/**
 * This utility method is used to watch for the current project files
 * and doing a callback upon change
 */
export function watchAppFiles(path: string, fileChangeCallback: (e: any, done: () => void) => void) {
  let paths: string[] = [
    join(Config.APP_SRC, path)
  ].concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));

  let busyWithCall: boolean = false;
  let changesWaiting: any = null;
  let afterCall = () => {
    busyWithCall = false;
    if (changesWaiting) {
      fileChangeCallback(changesWaiting, afterCall);
      changesWaiting = null;
    }
  };
  plugins.watch(paths, (e: any) => {
    if (busyWithCall) {
      changesWaiting = e;
      return;
    }
    busyWithCall = true;
    fileChangeCallback(e, afterCall);
  });
}

/**
 * Starts a new `express` server, serving the static documentation files.
 */
export function serveDocs() {
  let server = express();

  server.use(
    Config.APP_BASE,
    express.static(resolve(process.cwd(), Config.DOCS_DEST))
  );

  server.listen(Config.DOCS_PORT, () =>
    openResource(getResourceUrl(Config.DOCS_PORT))
  );
}

/**
 * Starts a new `express` server, serving the built files from `dist/prod`.
 */
export function serveProd() {
  let root = resolve(process.cwd(), Config.PROD_DEST);
  let server = express();

  server.use(Config.APP_BASE, express.static(root));

  server.use(fallback('index.html', { root }));

  server.listen(Config.PORT, () =>
    openResource(getResourceUrl(Config.PORT))
  );
}

function getResourceUrl(port: number) {
  return `http://localhost:${port}${Config.APP_BASE}`;
}
