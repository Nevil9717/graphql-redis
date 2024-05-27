const { merge } = require("lodash");

const userResolvers = require("./userResolvers");

const resolvers = merge(userResolvers);
module.exports = resolvers;
