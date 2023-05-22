const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    console.log("Middelware1");
    const token = req.headers.authorization.split(" ")[1];
    console.log("token=", token);
    if (!token || token === "null") {
      return res.json({ message: "Token is absent" });
    }
    const decoded = jwt.verify(token, config.get("secretKey"));
    req.user = decoded;
    console.log("Middelware2=", decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth Error" });
  }
};
