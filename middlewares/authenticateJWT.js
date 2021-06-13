const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  //  // console.log(req.headers.authorization);
  //  // console.log(authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWTSECRET, (err, admin) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.admin = admin;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
