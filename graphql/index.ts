import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import mongoose from "mongoose";
import resolvers from "./resolvers/resolvers";
import typeDefs from "./schemas/typeDefs";

// Construct a schema, using GraphQL schema language

const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // install the Playground plugin and set the `introspection` option explicitly to `true`.
  introspection: true,
});


export const lambdaHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = server.createHandler();


/* const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`); */
