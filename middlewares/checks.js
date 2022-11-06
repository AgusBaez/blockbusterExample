const jwt = require("jsonwebtoken");

const checkLoggedUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      const e = new Error("Unauthorized(401)");
      res.status(401).send("Not authorized, try to log in");
      return next(e);
    } else {
      req.user = decoded.payload.usuario;
      return next();
    }
  } catch (error) {
    console.log(error);
    error = new Error("User Not logged in");
    error.status = 401;
    return res.redirect("/login");
  }
};

module.exports = {
  //checkAdmin,
  checkLoggedUser,
};
