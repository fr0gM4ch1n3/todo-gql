import 'source-map-support/register';
import * as bunyan from 'bunyan';

if (process.env.NODE_ENV !== 'production') {
  require('longjohn');
}

const log = bunyan.createLogger({
  name: 'app'
});

import app2 from './app2';

const port2 = +process.env.PORT2 || 4001;

app2.listen(port2, (err: any) => {
  if (err) {
    throw err;
  }

  return log.info(`server is listening on ${port2}`);
});
