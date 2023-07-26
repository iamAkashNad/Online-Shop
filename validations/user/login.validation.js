const { validPassword, isEmailValid } = require("../../util/validCredentials.util");

const inputDataValidation = (email, password) => {
  return isEmailValid(email) && validPassword(password);
};

module.exports = inputDataValidation;
