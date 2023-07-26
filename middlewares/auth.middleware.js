const getAuthStatus = (req, res, next) => {
    res.locals.userStatus = req.session.user;
    next();
};

module.exports = getAuthStatus;
