import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';
import { makeTsProject, TemplateLocalsBuilder } from '../../utils';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */

export = () => {
  let tsProject = makeTsProject({}, Config.TMP_DIR);
  let src = [
    Config.TOOLS_DIR + '/manual_typings/**/*.d.ts',
    join(Config.TMP_DIR, '**/*.ts')
  ];
  let result = gulp
    .src(src)
    .pipe(plugins.plumber())
    .pipe(tsProject())
    .once('error', function(e: any) {
      this.once('finish', () => process.exit(1));
    });

  return result.js
    .pipe(
      plugins.template(
        new TemplateLocalsBuilder().build(),
        Config.TEMPLATE_CONFIG
      )
    )
    .pipe(gulp.dest(Config.APP_DEST))
    .on('error', (e: any) => {
      console.log(e);
    });
};
