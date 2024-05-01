const mongoose = require("mongoose");

// create a schema
const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

//collection part

// export the connect function
module.exports = mongoose.model("Login", loginSchema)