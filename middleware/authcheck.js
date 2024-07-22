/** @format */

const jwt = require("jsonwebtoken");

const isAuthenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader;
  if (token == null) return res.status(401).send();
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, user) => {
    if (err) return res.status(403).send();
    req.user = user;
    next();
  });
};

module.exports = isAuthenticate;
