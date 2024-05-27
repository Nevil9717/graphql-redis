const { gql } = require("apollo-server-express");

const userTypeDefs = gql`
  type User {
    _id: ID
    firstName: String
    email: String
    password: String
  }
  input UserInput {
    firstName: String!
    email: String!
    password: String!
  }
  input loginInput {
    email: String!
    password: String!
  }

  type loginResult {
    token: String
  }

  type Query {
    getUser(id: String): User
    allUsers: [User]
  }
  type Mutation {
    loginUser(input: loginInput): loginResult
  }
`;

module.exports = userTypeDefs;
