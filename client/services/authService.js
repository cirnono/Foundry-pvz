// server/services/authService.js

exports.getNonce = (req, res) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  res.json({ nonce });
};
