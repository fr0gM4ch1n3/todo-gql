import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';

import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

const resolvers = mergeResolvers(
    fileLoader(path.join(__dirname, './**/*.resolver.*'))
);
const typeDefs = mergeTypes(
    fileLoader(path.join(__dirname, './**/*.type.*')),
    { all: true }
);

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
