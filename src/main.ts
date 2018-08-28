import 'source-map-support/register';
import * as Raven from 'raven';
import * as bunyan from 'bunyan';

Raven
  .config('https://e500a810f55545818c228fe01af550eb:e6bd5cbc38554096afd24b6653719539@sentry.flauschangriff.ga/4', {
    autoBreadcrumbs: {
      'console': true,  // console logging
      'http': true,     // http and https requests
    }
  })
  .install();

process.on('uncaughtException', (err: any) => {
  Raven.captureException(err);
});

if (process.env.NODE_ENV !== 'production') {
  require('longjohn');
}

const log = bunyan.createLogger({
  name: 'app'
});

import app2 from './app2';

const port2 = +process.env.PORT2 || 4001;

app2.server.use(Raven.requestHandler());
// // Optional fallthrough error handler
// app.server.use(function onError(err, req, res, next) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end(res.sentry + '\n');
// });

app2.server.use(Raven.errorHandler() as any);

app2.listen(port2, (err: any) => {
  if (err) {
    throw err;
  }

  return log.info(`server is listening on ${port2}`);
});
