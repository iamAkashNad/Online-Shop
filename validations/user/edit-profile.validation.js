const { isFill } = require("../../util/validCredentials.util");

const inputDataValidation = (city, country, streetNumber, milestone, pin) => {
  return isFill(city) && isFill(country) && isFill(streetNumber) && isFill(milestone) && isFill(pin);
};

module.exports = inputDataValidation;
