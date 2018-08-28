import { Server } from 'http';
import * as express from 'express';
import * as compression from 'compression';
import * as expressBunyanLogger from 'express-bunyan-logger';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { schema } from './graphql';

class App {
  public server: express.Express;
  public ws: Server;

  constructor() {
    this.server = express();

    this.server.use(expressBunyanLogger());
    this.server.use('*', cors({ origin: '*' }));
    this.server.use(compression({
      level: 1,
      memLevel: 9
    }));

    this.server.use('/graphql', bodyParser.json(), graphqlExpress({
      schema
    }));

    this.server.use('/graphiql', graphiqlExpress(req => ({
      endpointURL: '/graphql',
      subscriptionsEndpoint: `${req.protocol === 'https' ? 'wss' : 'ws'}://${req.get('host')}/subscriptions`,
      tracing: true,
      cacheControl: true
    })));

    // We wrap the express server so that we can attach the WebSocket for subscriptions
    this.ws = createServer(this.server);
  }

  public listen(port: number, callback?: (err: any) => void) {
    this.ws.listen(port, (err: any) => {
      // Set up the WebSocket for handling GraphQL subscriptions
      const x = new SubscriptionServer({
        execute,
        subscribe,
        schema
      }, {
          server: this.ws,
          path: '/subscriptions',
        });

      if (callback instanceof Function) {
        callback(err);
      }
    });
  }
}

export default new App();
