const express = require("express");
const router = express.Router();
const axios = require("axios");
const { checkToken, search } = require("../controllers/route_controller");
require("dotenv").config();

const clientSecret = process.env.clientSecret
const clientID = process.env.clientID
const REDIRECT_URI = process.env.redirectUri
const tokenUrl = "https://accounts.spotify.com/api/token";




console.log('from routes')


function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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



// post login come here (2nd)
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
        redirect_uri: REDIRECT_URI,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientID}:${clientSecret}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error exchanging code for access token:", error);
    res.status(500).send("Internal Server Error");
  }
});


// checks that token ttl is still valid 
router.get('/status', (req, res) => {
    checkToken(req, res);
})


// extra steps
router.get('/search', (req, res) => {
    search(req, res);
})


module.exports = router;
