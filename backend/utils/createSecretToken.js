const jwt = require("jsonwebtoken");

createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 7 * 24 * 60 * 60, // expire in 7days ->res.cookie(),maxAge should match 
  });
};

module.exports = { createSecretToken };