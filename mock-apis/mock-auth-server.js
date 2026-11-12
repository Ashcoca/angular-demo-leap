
const express = require('express');

const app = express();
app.use(express.json());

const USERS = { trainer: 'training123' };

// base64url helper — JWT parts are base64url-encoded JSON.
const b64url = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString('base64url');

// Same hand-written CORS middleware as the expenses API, one size
// smaller — this API only ever answers POSTs from the browser.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Token payload: WHO (sub) and UNTIL WHEN (exp, one hour).
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  res.json({
    accessToken:
      b64url({ alg: 'none' }) + '.' +
      b64url(payload) + '.teaching-stub-signature',
    refreshToken: 'refresh-not-used-this-week',
  });
});

// Everything else: 404, empty body, same as before.
app.use((req, res) => {
  res.status(404).end();
});

app.listen(3001);
console.log('Auth API on http://localhost:3001');
