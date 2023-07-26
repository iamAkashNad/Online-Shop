const adminSecurity = (req, res, next) => {
    if(!res.locals.userStatus || !res.locals.userStatus.isAdmin) {
        return res.status(403).render("common/403");
    }
    next();
};

module.exports = adminSecurity;
