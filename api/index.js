const express = require('express');
const app = express();
const axios = require('axios');
const querystring = require('querystring');

require('dotenv').config();

const PORT = process.env.PORT || 8888;
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const redirectUri = process.env.redirectUri;

const state = Math.random().toString(36).substring(7);
const stateKey = 'spotify_auth_state';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(clientID, clientSecret, redirectUri);
});

app.get('/login', (req, res) => {
  res.cookie(stateKey, state);
  const scope = 'user-read-private user-read-email';
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: clientID,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
  })
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
})

app.get('/callback', async (req, res) => {
  try {
    const code = req.query.code;

    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`
      }
    });

    if (tokenResponse.status === 200) {
      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      const queryParams = querystring.stringify({ access_token, refresh_token, expires_in });

      res.redirect(`http://localhost:3000/?${queryParams}`);
    } 
    
    else {
  
      res.status(tokenResponse.status).send(tokenResponse.data);
    }
  } 
  catch (error) {
  
    res.status(500).send('Internal Server Error');
  }
});

app.get('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.query;

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`
        }
      }
    );

    if (response.status === 200) {

      res.json(response.data);
    } 
    else {

      res.status(response.status).json(response.data);
    }
    } 
    catch (error) {
      
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
});


