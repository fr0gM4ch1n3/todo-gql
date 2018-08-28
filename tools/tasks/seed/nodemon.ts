import * as gulp from 'gulp';
import * as nodemon from 'gulp-nodemon';
import * as childProcess from 'child_process';
import * as path from 'path';

import Config from '../../config';

// auto open chrome https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj/reviews?hl=en
export = (done: any) => {
  nodemon({
    script: `${Config.APP_DEST}/main.js`,
    execMap: {
      'js': 'node --inspect=0.0.0.0'
    },
    stdout: false
  })
    .on('readable', function () {
      var bunyan = childProcess.fork(
        path.join('.', 'node_modules', 'bunyan', 'bin', 'bunyan'),
        ['--output', 'simple'],
        { silent: true }
      );

      bunyan.stdout.pipe(process.stdout);
      bunyan.stderr.pipe(process.stderr);
      this.stdout.pipe(bunyan.stdin);
      this.stderr.pipe(bunyan.stdin);
    });

  done();
};
