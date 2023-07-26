const { isFill, validPassword, isEmailValid } = require("../../util/validCredentials.util");

const inputDataValidation = (
  name,
  email,
  cemail,
  password,
  cpassword,
  city,
  country,
  streetNumber,
  milestone,
  pin
) => {
  return (
    isFill(name) &&
    isEmailValid(email) &&
    isFill(city) &&
    isFill(country) &&
    isFill(milestone) &&
    isFill(streetNumber) &&
    isFill(pin) &&
    email === cemail &&
    validPassword(password) &&
    password === cpassword &&
    email.includes("@") &&
    email.includes(".com")
  );
};

module.exports = inputDataValidation;
