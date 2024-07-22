/** @format */

const jwt = require("jsonwebtoken");

var checkAdmin = {
  authenticate: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader;
    if (token == null) return res.status(401).send();
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, user) => {
      if (err) return res.status(403).send();
      req.user = user;
      console.log({ userId: user?.data?._id, adminId: req.params.AdminId });
      if (user?.data?._id !== req.params.AdminId)
        return res
          .status(200)
          .send({ error: true, message: "401 Unauthorized" });
      next();
    });
  },
};

module.exports = checkAdmin;
