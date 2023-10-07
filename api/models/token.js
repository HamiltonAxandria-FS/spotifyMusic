const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  tokenExpires: {
    type: Number,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
