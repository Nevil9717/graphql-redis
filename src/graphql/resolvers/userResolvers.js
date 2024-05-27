// const { combineResolvers } = require("graphql-resolvers");
const User = require("../../models/userSchema");

const getUsers = async () => {
  try {
    const users = await User.find();
    if (!users) return "User not found";
    return users;
  } catch (error) {
    return new Error(error);
  }
};
const loginUser = async (_, { input }) => {
  const { email, password } = input;
  try {
    const user = await User.findOne({ email });
    if (!user) return new Error("User Not Found");
    const isPasswordMatch = await user.isPasswordCorrect(password);
    if (!isPasswordMatch) return new Error("Incorrect Password");
    const token = await user.generateToken();
    return { token };
  } catch (error) {
    return new Error(error);
  }
};
const userResolvers = {
  Query: {
    getUsers,
  },

  Mutation: {
    loginUser,
  },
};

module.exports = userResolvers;
