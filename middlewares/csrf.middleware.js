const { v4: getID } = require("uuid");

const csrf = (req, res, next) => {
  if (req.method === "GET") {
    const csrfToken = getID();
    // console.log("I am Executed!");
    res.locals.csrfToken = csrfToken;
    req.session.csrfToken = csrfToken;
  } else {
    if (req.query._csrf) {
      if (req.session.csrfToken !== req.query._csrf) {
        return next(new Error("csrf atteck!"));
      }
    } else if (req.body._csrf) {
      if (req.session.csrfToken !== req.body._csrf) {
        return next(new Error("csrf atteck!"));
      }
    } else {
      return next(new Error("csrf atteck!"));
    }
  }
  next();
};

module.exports = csrf;
