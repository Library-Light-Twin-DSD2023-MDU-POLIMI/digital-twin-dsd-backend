// Remove unnecessary imports and code for the final version
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
  Handler,
} from 'aws-lambda';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from '@as-integrations/aws-lambda';
import mongoose from 'mongoose';
import resolvers from './resolvers/resolvers';
import typeDefs from './schemas/typeDefs';

// Construct a schema, using GraphQL schema language

mongoose.connect(
  'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/sandbox'
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

// -------------------- Locally run code -------------------- //

// startStandaloneServer(server).then(({ url }) => console.log(url));

// -------------------- Lambda code -------------------- //

export const lambdaHandler: Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
