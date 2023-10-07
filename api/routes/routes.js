const express = require("express");
const router = express.Router();
const axios = require("axios");


require("dotenv").config();

const clientSecret = process.env.clientSecret
const redirectUri = process.env.redirectUri
const tokenUrl = "https://accounts.spotify.com/api/token";

function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

router.get("/login", (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';
    const clientID = process.env.clientID

  const queryParams = new URLSearchParams({
    response_type: "code",
    client_id: clientID,
    scope: scope,
    redirect_uri: redirectUri,
    state: state
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});


router.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const response = await axios.post(tokenUrl, {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientID,
      client_secret: clientSecret,
    });

    const accessToken = response.data.access_token;


    res.redirect(redirectUri);
  } catch (error) {
    console.error("Error exchanging code for access token:", error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
