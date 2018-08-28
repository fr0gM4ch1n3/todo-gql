import * as gulp from 'gulp';
import { join } from 'path';
import * as runSequence from 'run-sequence';

import Config from '../../config';
import { watchAppFiles } from '../../utils';

gulp.task('watch.while_deving', function () {
  watchAppFiles('**/!(*.ts)', (e: any, done: any) =>
    runSequence('build.assets', () => { done(); }));
  watchAppFiles('**/(*.ts)', (e: any, done: any) =>
    runSequence('build.dev', () => {
      runSequence('build.js.test', done);
    }));
});

export = (done: any) =>
  runSequence('build.test',
    'watch.while_deving',
    'nodemon',
    done);
