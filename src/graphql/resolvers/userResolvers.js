const User = require("../../models/userSchema");

const getUser = async (_, { id }, { redis }) => {
  try {
    const cachedUser = await redis.hgetall(`user:${args.id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    const user = await User.findOne({ _id: id });
    if (!user) return "User not found";
    redis.hmset(`user:${user._id}`, user.toObject());
    return user;
  } catch (error) {
    return new Error(error);
  }
};

const allUsers = async (_, args, { redis }) => {
  try {
    const cachedUsers = await redis.hgetall("users");
    if (cachedUsers) {
      return Object.values(cachedUsers).map((user) => JSON.parse(user));
    }
    const users = await User.find();
    users.map((user) => {
      redis.hmset(`user:${user._id}`, user.toObject());
    });
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
    getUser,
    allUsers,
  },

  Mutation: {
    loginUser,
  },
};

module.exports = userResolvers;
