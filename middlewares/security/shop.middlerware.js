const shopSecurity = (req, res, next) => {
    if(!res.locals.userStatus) {
        return res.status(401).render("common/401");
    }
    next();
};

module.exports = shopSecurity;
