const { v4: getID } = require("uuid");

const getCode = () => {
    let code;
    while(!code) code = getID().split("-").find(code => code.length >= 5);
    return code;
};

module.exports = { getCode };
