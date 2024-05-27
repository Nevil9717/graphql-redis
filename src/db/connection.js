const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_LINK)
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });