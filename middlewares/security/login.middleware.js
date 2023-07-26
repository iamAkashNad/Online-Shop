const lockForgotVarification = (req, res, next) => {
    if(!req.session.verificationCode || !req.session.account)
        return res.status(404).render("common/404");
    next();
};

const backToUserProfile = (req, res, next) => {
    if(res.locals.userStatus) return res.redirect("/user/profile");
    next();
};

module.exports = { lockForgotVarification, backToUserProfile };