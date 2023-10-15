const axios = require("axios");
const querystring = require("querystring");
const Token = require("../models/token");
require("dotenv").config();

const clientID = process.env.clientID
const clientSecret = process.env.clientSecret
const redirectUri = process.env.redirectUri

const createToken = async (authorizationCode) => {
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from( `${clientID} : ${clientSecret}`)
      .toString("base64")}`,
    },
    data: querystring.stringify({
      code: authorizationCode,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  };

  try {
    const response = await axios(authOptions);
    return response.data;
  } catch (error) {
    throw new Error("Error generating access token: " + error.message);
  }
};

const addToken = async (tokenData) => {
  try {
    const token = new Token({
      token: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    });
    await token.save();
  } catch (error) {
    throw new Error("Error adding token to the database: " + error.message);
  }
};

const checkToken = async (req, res) => {
  try {
    const tokens = await Token.find().exec();
    if (tokens.length === 0) {
      return res.status(404).json({ success: false, message: "Token not found" });
    }

    const token = tokens[0];
    const currentTime = Date.now();
    const expired = currentTime - token.tokenExpires;

    if (expired >= 0) {
      const refreshToken = token.refreshToken;
      const tokenData = await createToken(refreshToken);

      const newToken = {
        token: tokenData.access_token,
        refreshToken: refreshToken,
        tokenExpires: Date.now() + tokenData.expires_in * 1000,
      };

      await Token.updateOne({ _id: token._id }, { $set: newToken });
      return res
        .status(200)
        .json({ success: true, message: "Token updated successfully" });
    } else {
      return res.status(200).json({ success: true, message: "Token is still valid" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const search = async (req, res) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          type: 'album,artist,track',
          q: req.query.q,
        },
        headers: {
          'Authorization': `Bearer ${req.token.access_token}`,
          'Content-Type': 'application/json'
        }
      });
  
      res.json(response.data);
    } catch (error) {
      res.json(error);
    }
  }
  

module.exports = { createToken, addToken, checkToken, search };
