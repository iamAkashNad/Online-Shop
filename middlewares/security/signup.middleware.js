const User = require("../../models/user.model");

const lockSignupVarification = (req, res, next) => {
    if(!req.session.verificationCode || !req.session.account || !req.session.image)
        return res.status(404).render("common/404");
    next();
};

module.exports = { lockSignupVarification };
