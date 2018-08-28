import { join } from 'path';
import * as slash from 'slash';
import { argv } from 'yargs';

import {
  BuildType,
  ExtendPackages,
  InjectableDependency,
  SourceMapExplorerOutputFormat
} from './seed.config.interfaces';

/**
 * The enumeration of available environments.
 * @type {Environments}
 */
export const BUILD_TYPES: BuildType = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'prod'
};


/**
 * This class represents the basic configuration of the seed.
 * It provides the following:
 * - Constants for directories, ports, versions etc.
 * - Injectable NPM dependencies
 * - Injectable application assets
 * - Temporary editor files to be ignored by the watcher and asset builder
 * - SystemJS configuration
 * - Autoprefixer configuration
 * - BrowserSync configuration
 * - Utilities
 */
export class SeedConfig {
  /**
   * The port where the application will run.
   * The default port is `5555`, which can be overriden by the  `--port` flag when running `npm start`.
   * @type {number}
   */
  PORT = argv['port'] || 5555;

  /**
   * The root folder of the project (up two levels from the current directory).
   */
  PROJECT_ROOT = join(__dirname, '../..');

  /**
   * The current build type.
   * The default build type is `dev`, which can be overriden by the `--build-type dev|prod` flag when running `npm start`.
   */
  BUILD_TYPE = getBuildType();

  /**
   * The flag to determine preserving source maps on build or not.
   * The default value is `false`, which can be overriden by the `--preserve-source-maps` flag when running `npm start`.
   */
  PRESERVE_SOURCE_MAPS = argv['preserve-source-maps'] || false;

  /**
   * The flag for the debug option of the application.
   * The default value is `false`, which can be overriden by the `--debug` flag when running `npm start`.
   * @type {boolean}
   */
  DEBUG = argv['debug'] || false;

  /**
   * The port where the documentation application will run.
   * The default docs port is `4003`, which can be overriden by the `--docs-port` flag when running `npm start`.
   * @type {number}
   */
  DOCS_PORT = argv['docs-port'] || 4003;

  /**
   * The path for the base of the application at runtime.
   * The default path is based on the environment '/',
   * which can be overriden by the `--base` flag when running `npm start`.
   * @type {string}
   */
  APP_BASE = argv['base'] || '/';

  /**
   * The base path of node modules.
   * @type {string}
   */
  NPM_BASE = slash(join('.', this.APP_BASE, 'node_modules/'));

  /**
   * The build interval which will force the TypeScript compiler to perform a typed compile run.
   * Between the typed runs, a typeless compile is run, which is typically much faster.
   * For example, if set to 5, the initial compile will be typed, followed by 5 typeless runs,
   * then another typed run, and so on.
   * If a compile error is encountered, the build will use typed compilation until the error is resolved.
   * The default value is `0`, meaning typed compilation will always be performed.
   * @type {number}
   */
  TYPED_COMPILE_INTERVAL = 0;

  /**
   * The base folder of the applications source files.
   * @type {string}
   */
  APP_SRC = 'src';

  /**
   * The name of the TypeScript project file
   * @type {string}
   */
  APP_PROJECTNAME = 'tsconfig.json';

  /**
   * The directory of the applications tools
   * @type {string}
   */
  TOOLS_DIR = 'tools';

  /**
   * The directory of the tasks provided by the seed.
   */
  SEED_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'seed');

  /**
   * Seed tasks which are composition of other tasks.
   */
  SEED_COMPOSITE_TASKS = join(
    process.cwd(),
    this.TOOLS_DIR,
    'config',
    'seed.tasks.json'
  );

  /**
   * Project tasks which are composition of other tasks
   * and aim to override the tasks defined in
   * SEED_COMPOSITE_TASKS.
   */
  PROJECT_COMPOSITE_TASKS = join(
    process.cwd(),
    this.TOOLS_DIR,
    'config',
    'project.tasks.json'
  );

  /**
   * The destination folder for the generated documentation.
   * @type {string}
   */
  DOCS_DEST = 'docs';

  /**
   * The base folder for built files.
   * @type {string}
   */
  DIST_DIR = 'dist';

  /**
   * The folder for built files in the `dev` environment.
   * @type {string}
   */
  DEV_DEST = `${this.DIST_DIR}/dev`;

  /**
   * The folder for the built files in the `prod` environment.
   * @type {string}
   */
  PROD_DEST = `${this.DIST_DIR}/prod`;

  /**
   * The folder for temporary files.
   * @type {string}
   */
  TMP_DIR = `${this.DIST_DIR}/tmp`;

  /**
   * The folder for the built files, corresponding to the current environment.
   * @type {string}
   */
  APP_DEST = this.BUILD_TYPE === BUILD_TYPES.DEVELOPMENT
    ? this.DEV_DEST
    : this.PROD_DEST;

  /**
   * The version of the application as defined in the `package.json`.
   */
  VERSION = appVersion();

  /**
   * The required NPM version to run the application.
   * @type {string}
   */
  VERSION_NPM = '2.14.2';

  /**
   * The required NodeJS version to run the application.
   * @type {string}
   */
  VERSION_NODE = '4.0.0';

  /**
   * Enable tslint emit error by setting env variable FORCE_TSLINT_EMIT_ERROR
   * @type {boolean}
   */
  FORCE_TSLINT_EMIT_ERROR = !!process.env.FORCE_TSLINT_EMIT_ERROR;

  /**
   * Extra paths for the gulp process to watch for to trigger compilation.
   * @type {string[]}
   */
  EXTRA_WATCH_PATHS: string[] = [];

  /**
   * Defines the template config.
   */
  TEMPLATE_CONFIG = {
    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    escape: /<%-([\s\S]+?)%>/g,

    /**
     * Used to detect code to be evaluated.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    evaluate: /<%([\s\S]+?)%>/g,

    /**
     * Used to detect `data` property values to inject.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    interpolate: /<%=([\s\S]+?)%>/g,

    /**
     * Used to reference the data object in the template text.
     *
     * @memberOf _.templateSettings
     * @type {string}
     */
    variable: ''
  };

  /**
   * The list of NPM dependcies to be injected in the `index.html`.
   * @type {InjectableDependency[]}
   */
  NPM_DEPENDENCIES: InjectableDependency[] = [
  ];

  /**
   * The list of editor temporary files to ignore in watcher and asset builder.
   * @type {string[]}
   */
  TEMP_FILES: string[] = ['**/*___jb_tmp___', '**/*~'];

  /**
   * List of directories to include in commonjs
   * @type {string[]}
   */
  ROLLUP_INCLUDE_DIR: string[] = ['node_modules/**'];

  /**
  * List of named export Object key value pairs
  * key: dependencie file
  * value: exported Objects
  */
  ROLLUP_NAMED_EXPORTS: any[] = [];

  /**
   * Returns the array of injectable dependencies (npm dependencies and assets).
   * @return {InjectableDependency[]} The array of npm dependencies and assets.
   */
  get DEPENDENCIES(): InjectableDependency[] {
    return normalizeDependencies(
      this.NPM_DEPENDENCIES.filter(filterDependency.bind(null, this.BUILD_TYPE))
    );
  }
  /**
   * Configurations for NPM module configurations. Add to or override in project.config.ts.
   * @type {any}
   */
  PLUGIN_CONFIGS: any = {};

  /**
   * Generates the query string which should be appended to the end of the URLs in dev mode.
   */
  QUERY_STRING_GENERATOR = () => {
    return Date.now().toString();
  }

  /**
   * Returns the configuration object for NPM module configurations.
   */
  private get _PLUGIN_CONFIGS(): any {
    /**
     * The BrowserSync configuration of the application.
     * The default open behavior is to open the browser. To prevent the browser from opening use the `--b`  flag when
     * running `npm start` (tested with serve.dev).
     * Example: `npm start -- --b`
     * @return {any}
     */
    let defaults = {
      // Note: you can customize the location of the file
      'environment-config': join(this.PROJECT_ROOT, this.TOOLS_DIR, 'env')
    };

    this.mergeObject(defaults, this.PLUGIN_CONFIGS);

    return defaults;
  }

  /**
   * Recursively merge source onto target.
   * @param {any} target The target object (to receive values from source)
   * @param {any} source The source object (to be merged onto target)
   */
  mergeObject(target: any, source: any) {
    const deepExtend = require('deep-extend');
    deepExtend(target, source);
  }

  /**
   * Locate a plugin configuration object by plugin key.
   * @param {any} pluginKey The object key to look up in PLUGIN_CONFIGS.
   */
  getPluginConfig(pluginKey: string): any {
    if (this._PLUGIN_CONFIGS[pluginKey]) {
      return this._PLUGIN_CONFIGS[pluginKey];
    }
    return null;
  }

  /**
 * Convert named rollup array to object
 */
  getRollupNamedExports() {
    let namedExports = {};
    this.ROLLUP_NAMED_EXPORTS.map(namedExport => {
      namedExports = Object.assign(namedExports, namedExport);
    });
    return namedExports;
  }
}

/**
 * Normalizes the given `deps` to skip globs.
 * @param {InjectableDependency[]} deps - The dependencies to be normalized.
 */
export function normalizeDependencies(deps: InjectableDependency[]) {
  deps
    .filter((d: InjectableDependency) => !/\*/.test(d.src)) // Skip globs
    .forEach((d: InjectableDependency) => (d.src = require.resolve(d.src)));
  return deps;
}

/**
 * Returns if the given dependency is used in the given environment.
 * @param  {string}               env - The environment to be filtered for.
 * @param  {InjectableDependency} d   - The dependency to check.
 * @return {boolean}                    `true` if the dependency is used in this environment, `false` otherwise.
 */
function filterDependency(type: string, d: InjectableDependency): boolean {
  const t = d.buildType || d.env;
  d.buildType = t;
  if (!t) {
    d.buildType = Object.keys(BUILD_TYPES).map(k => BUILD_TYPES[k]);
  }
  if (!(d.buildType instanceof Array)) {
    (<any>d).env = [d.buildType];
  }
  return d.buildType.indexOf(type) >= 0;
}

/**
 * Returns the applications version as defined in the `package.json`.
 * @return {number} The applications version.
 */
function appVersion(): number | string {
  var pkg = require('../../package.json');
  return pkg.version;
}

/**
 * Returns the application build type.
 */
function getBuildType() {
  let type = (argv['build-type'] || argv['env'] || '').toLowerCase();
  let base: string[] = argv['_'];
  let prodKeyword = !!base
    .filter(o => o.indexOf(BUILD_TYPES.PRODUCTION) >= 0)
    .pop();
  if ((base && prodKeyword) || type === BUILD_TYPES.PRODUCTION) {
    return BUILD_TYPES.PRODUCTION;
  } else {
    return BUILD_TYPES.DEVELOPMENT;
  }
}
