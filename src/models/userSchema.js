const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = async function () {
  const payload = {
    _id: this._id,
    email: this.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
