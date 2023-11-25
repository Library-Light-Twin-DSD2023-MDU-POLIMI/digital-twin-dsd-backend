import { ApolloServer} from "apollo-server-lambda";
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

const baseHandler= server.createHandler();
// HACK i put the mongoose connection here, ideally this should be handled by the digital-twin-api
export const lambdaHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = 
  (event, context, callback) => {
  if (mongoose.connections.length<1) {
     mongoose.connect("mongodb+srv:/application:lol@dsd.iaano1k.mongodb.net/");
  }
  return baseHandler(event,context,callback);
}


