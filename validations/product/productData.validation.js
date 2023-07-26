const { isFill } = require("../../util/validCredentials.util");

const inputValidation = (title, summary, price, description) => {
    return isFill(title) && isFill(summary) && isFill(price) && isFill(description);
};

module.exports = inputValidation;
