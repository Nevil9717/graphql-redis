require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const { makeExecutableSchema } = require("@graphql-tools/schema");

// const Redis = require("ioredis");

const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloError,
} = require("apollo-server-core");

// const redis = new Redis();

const typeDefs = require("./graphql/typeDefs/userTypeDefs");
const resolvers = require("./graphql/resolvers/userResolvers");
require("./db/connection");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const getMe = async (req) => {
  const token = req.headers.authorization || "";
  if (!token) return new Error("Not authenticated");
  try {
    const me = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return { me };
  } catch (error) {
    throw new ApolloError("Invalid or expired token.", "UNAUTHENTICATED");
  }
};

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  context: async ({ req }) => {
    const me = await getMe(req);
    return {
      // redis,
      me,
    };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer().then(() => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is Running at: ${port}.`);
  });
});
