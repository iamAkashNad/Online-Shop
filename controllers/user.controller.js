const User = require("../models/user.model");

const removeImage = require("../util/removeImage.util");
const inputValidation = require("../validations/inputData.validation");
const editProfileValidation = require("../validations/user/edit-profile.validation");

const getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findUserById(res.locals.userStatus.userId);
  } catch (error) {
    return next(error);
  }
  res.render("common/profile", { user: user });
};

const getEditUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findUserById(res.locals.userStatus.userId);
  } catch (error) {
    return next(error);
  }
  const inputData = inputValidation.retreiveInputData(req, {
    city: user.address.city,
    country: user.address.country,
    "street-number": user.address.streetNumber,
    milestone: user.address.milestone,
    "postal-code": user.address.postalCode,
  });
  res.render("common/edit-profile", { inputData: inputData });
};

const editUser = async (req, res, next) => {
  const userId = res.locals.userStatus.userId;
  const {
    city,
    country,
    milestone,
    "street-number": streetNumber,
    "postal-code": pin,
  } = req.body;
  if (!editProfileValidation(city, country, streetNumber, milestone, pin) || req.wrongFileUpload) {
    if(req.file) {
      try {
        await removeImage("userimages", req.file.filename);
      } catch(error) {}
    }
    return inputValidation.storeInputData(req, {
        hasError: true,
        message: `Invaild Input - please enter valid ones! 
                  ${ req.wrongFileUpload ? "(Please select an image file for your profile pic. The file you try to upload was not a image.)" : "" }
                  `,
        ...req.body,
    }, () => {
        res.redirect(`/user/edit`);
    });
  }

  const userData = {};
  userData.city = city.trim();
  userData.country = country.trim();
  userData.milestone = milestone.trim();
  userData["street-number"] = streetNumber.trim();
  userData["postal-code"] = pin.trim();

  const user = new User(userData, req.file ? req.file.filename : null);
  try {
    await user.update(userId);
  } catch(error) {
    removeImage("userimages", req.file ? req.file.filename : null).then(() => {
      next(error);
    }).catch((error) => {
      next(error);
    });
    return;
  }

  if(req.file) {
    try {
      await removeImage("userimages", res.locals.userImage);
    } catch(error) {
      return next(error);
    }
  }
  res.redirect(`/user/profile`);
};

module.exports = {
  getUser: getUser,
  getEditUser: getEditUser,
  editUser: editUser,
};
