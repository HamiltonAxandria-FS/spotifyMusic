const express = require("express");
const router = express.Router();
const axios = require("axios");
const { checkToken, searchSpotify } = require("../controllers/route_controller");
const Token = require("../models/token");
require("dotenv").config();

const clientSecret = process.env.clientSecret
const clientID = process.env.clientID
const REDIRECT_URI = process.env.redirectUri
const tokenUrl = "https://accounts.spotify.com/api/token";


//console.log('from routes')


function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async function getAccessToken(code) {
    try {
      const response = await axios({
        method: 'POST',
        url: tokenUrl,
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientID}:${clientSecret}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      return response.data.access_token;
    } catch (error) {
      console.error("Error exchanging code for access token:", error);
      throw error;
    }
  }

  // login first 
router.get("/login", (req, res) => {
    console.log('attempting login');
    const clientID = process.env.clientID

  const queryParams = new URLSearchParams({
    response_type: "code",
    client_id: clientID,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}&redirect_uri=${REDIRECT_URI}`);
});


//Callback
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:3000/auth/callback',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientID}:${clientSecret}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log(response.data);

    const tokenData = response.data; 

    const token = new Token({
      token: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    });

    await token.save();

    res.status(200).send("Token saved successfully");
  } catch (error) {
    console.error("Error exchanging code for access token:", error);
    res.status(500).send("Internal Server Error");
  }
});

//search
router.get('/search', async (req, res) => {
  const { title, artist, album } = req.query;

  if (!title || !artist || !album) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const result = await searchSpotify(title, artist, genre);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


  

module.exports = router;
