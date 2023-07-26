const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const loginValidation = require("../validations/user/login.validation");
const signupValidation = require("../validations/user/signup.validation");
const { storeInputData, retreiveInputData } = require("../validations/inputData.validation");

const removeImage = require("../util/removeImage.util");
const { sendEmail } = require("../util/Emails/sendEmails.util");
const { getCode } = require("../util/getCode.util");
const { isFill, validPassword } = require("../util/validCredentials.util");

const getSignup = (req, res) => {
  const inputData = retreiveInputData(req, {
    hasError: false,
    name: "",
    email: "",
    "confirm-email": "",
    password: "",
    "confirm-password": "",
    city: "",
    milestone: "",
    "street-number": "",
    country: "",
    "postal-code": "",
  });
  res.render("common/signup", { inputData: inputData });
};

const signup = async (req, res, next) => {
  let { name, email, password, city, milestone, country } = req.body;
  let confirmEmail = req.body["confirm-email"];
  let confirmPassword = req.body["confirm-password"];
  let streetNumber = req.body["street-number"];
  let postalCode = req.body["postal-code"];

  if(!req.file) {
    storeInputData(req, {
      hasError: true,
      message: req.wrongFileUpload ? 
                "Provided file is not an image - Please choose an image which will be your profile pic!" : 
                "Profie pic missing - Please add a profile pic of yours!",
      ...req.body
    }, () => {
      res.redirect("/signup");
    });
    return;
  }

  if(!signupValidation(name, email, confirmEmail, password, confirmPassword, city, country, streetNumber, milestone, postalCode)) {
    removeImage("userimages", req.file.filename)
    .then(() => {
      storeInputData(req, {
        hasError: true,
        message: "Invalid Input - Please enter valid input![Note: The password length should be 5-10 and It contains of (A-Z), (a-z), @, &, $, % and # only]",
        ...req.body
      }, () => {
        res.redirect("/signup");
      });
    })
    .catch(error => next(error));
    return;
  }

  const userData = {};
  userData.name = name.trim();
  userData.email = email.trim();
  userData.password = password.trim();
  userData.city = city.trim();
  userData.country = country.trim();
  userData.milestone = milestone.trim();
  userData["street-number"] = streetNumber.trim();
  userData["postal-code"] = postalCode.trim();

  const user = new User(userData, req.file.filename);
  
  let existingUser;
  try {
    existingUser = await user.findUserByEmail();
  } catch(error) {
    return next(error);
  }

  if(existingUser) {
    removeImage("userimages", req.file.filename)
    .then(() => {
       storeInputData(req, {
        hasError: true,
        message: "User already exists - Please choose a different email!",
        ...req.body
      }, () => {
        res.redirect("/signup");
      });
    })
    .catch(error => next(error));
    return;
  }

  const code = getCode();
  
  const hashedCode = await bcrypt.hash(code, 12);

  req.session.verificationCode = hashedCode;
  req.session.account = req.body;
  req.session.image = req.file.filename;

  const emailData = { name, email, code };
  sendEmail("signup-verify", emailData).catch((err) => next(err));

  req.session.save(() => {
    res.redirect("/signup/verify");
  });
};

const getVerifyPage = (req, res) => {
  res.render("common/verify-code", {
    email: req.session.account.email,
    title: "Verification for Signup!",
    page: "signup",
    actionURL: "/signup/verify"
  });
};

const getVerifyCode = async (req, res) => {
  const { account } = req.session;
  const code = getCode();
  const hashedCode = await bcrypt.hash(code, 12);
  req.session.verificationCode = hashedCode;
  req.session.save(() => {
    const emailData = {
      name: account.name,
      email: account.email,
      code
    };
    sendEmail(account.name ? "signup-verify" : "forgot-pass", emailData)
    .then(() => res.json({ success: true, message: "Check your inbox!" }))
    .catch((err) => res.status(500).json({ success: false, message: "Email isn't send..." }));
  });
};

const verifySignup = async (req, res, next) => {
  const { account, verificationCode: code, image } = req.session;
  const submittedCode = req.body.code;

  try {
    const isMatched = await bcrypt.compare(submittedCode, code);
    if(!isMatched) return res.redirect("/signup/cancel");

    const verifyedUser = new User(account, image);
    await verifyedUser.signup();
  } catch(error) {
    return next(error);
  }

  const emailData = {
    email: account.email,
    name: account.name
  };

  sendEmail("signup-ok", emailData).catch((err) => next(err));

  req.session.verificationCode = null;
  req.session.account = null;
  req.session.image = null;

  res.redirect("/login");
};

const cancelSignup = (req, res, next) => {
  const image = req.session.image;

  req.session.verificationCode = null;
  req.session.account = null;
  req.session.image = null;

  removeImage("userimages", image)
  .then(() => {
    res.render("common/cancel-signup");
  }).catch((error) => next(error));
};

const getLogin = (req, res) => {
  const inputData = retreiveInputData(req, {
    email: "",
    password: ""
  });
  res.render("common/login", { inputData: inputData });
};

const getSendCodePageForForgot = (req, res) => {
  const inputData = retreiveInputData(req, {
    hasError: false,
    email: "",
  });
  res.render("common/send-code-to-email", { inputData });
};

const sendVerifyCodeForForgot = (req, res, next) => {
  const { email } = req.body;

  new User({ email }).findUserByEmail().then((user) => {
    if(!user) {
      return storeInputData(req, {
        hasError: true,
        message: "No user found with that given email - Please check there any kind of typo or not!",
        email
      }, 
      () => res.redirect("/login/forgot")
      );
    }
    req.session.account = { email };
    const code = getCode();
  
    bcrypt.hash(code, 12)
    .then((hashedCode) => {
      req.session.verificationCode = hashedCode;
      res.redirect("/login/password/set");
      sendEmail("forgot-pass", { email, code })
      .catch((error) => {});
    })
    .catch(error => next(error));
  })
  .catch((error) => next(error));
};

const getFailedForgotPage = (req, res) => {
  req.session.verificationCode = null;
  req.session.account = null;
  res.render("common/cancel-forgot");
};

const getSetNewPasswordPage = (req, res) => {
  let inputData = retreiveInputData(req, {
    hasError: false,
    password: "",
    "confirm-password": "",
  });
  res.render("common/set-password", { inputData });
};

const resetPasswordAfterVerification = (req, res, next) => {
  const { account, verificationCode: code } = req.session;
  const { password, "confirm-password": confirm_password, code: submittedCode } = req.body;

  bcrypt.compare(submittedCode, code)
  .then((isMatched) => {
    if(!isMatched) return res.redirect("/login/forgot/fail");

    if(!isFill(password) || password !== confirm_password || !validPassword(password)) {
      const newCode = getCode();
      return bcrypt.hash(newCode, 12)
      .then((hashedCode) => {
        req.session.verificationCode = hashedCode;
        sendEmail("forgot-pass", { email: account.email, code: newCode });
        storeInputData(req, {
          hasError: true,
          message: "Please enter a valid password, length of the password must be in the range of [5 - 10]. And you will receive a new OTP to your email for the next time you submit your password.",
          password,
          "confirm-password": confirm_password
        },
        () => {
          res.redirect("/login/password/set");
        });
      });
    }
    
    User.forgotPassword(account.email, password)
    .then(() => {
      sendEmail("forgot-pass-ok", { email: account.email })
      .catch((error) => {});
      res.redirect("/login");
    })
    .catch(error => next(error));
  })
  .catch(error => next(error));
};

const login = async (req, res, next) => {
  const inputData = {
    hasError: true,
    message: "Invalid Credentials - Please enter valid ones!",
    ...req.body
  };
  if(!loginValidation(req.body.email, req.body.password)) {
    storeInputData(req, inputData, () => {
      res.redirect("/login");
    });
    return;
  }

  const user = new User(req.body);
  let result;

  try {
    result = await user.login();
  } catch(error) {
    return next(error);
  }

  if(!result.isLogedIn) {
    storeInputData(req, inputData, () => {
      res.redirect("/login");
    });
    return;
  }

  req.session.user = {
    userId: result.userId,
    email: req.body.email,
    isAdmin: result.isAdmin,
  };

  req.session.save(() => {
    res.redirect(`/user/profile`);
  });
};

const logout = (req, res) => {
  req.session.user = null;
  req.session.save(() => res.redirect("/login"));
}

module.exports = {
  getSignup,
  signup,
  getVerifyPage,
  getVerifyCode,
  verifySignup,
  cancelSignup,
  getLogin,
  getSendCodePageForForgot,
  sendVerifyCodeForForgot,
  getSetNewPasswordPage,
  resetPasswordAfterVerification,
  getFailedForgotPage,
  login,
  logout
};
