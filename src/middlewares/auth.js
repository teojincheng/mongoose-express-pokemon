const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  try {
    console.log("inside try");
    if (!req.cookies.token) {
      console.log("inside line 7");
      throw new Error("You are not authorized");
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    console.log("inside line 11");
    console.log(req.user);
    next();
  } catch (err) {
    console.log("inside error block");
    err.statusCode = 401;
    //can set an error message here.
    next(err);
  }
};

module.exports = { protectRoute };
