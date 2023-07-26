const User = require("../models/user.model");

const getUserImage = async (req, res, next) => {
  let user = res.locals.userStatus;
  if (!user) return next();
  const userObj = new User(user);
  try {
    user = await userObj.findUserByEmail();
  } catch (error) {
    return next(error);
  }
  const userImage = user.image;
  res.locals.userImage = userImage;
  res.locals.userImagePath =
    "/public/static/essential/assets/userimages/" + userImage;
  next();
};

module.exports = getUserImage;
