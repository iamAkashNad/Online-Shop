const getINRCurrency = (req, res, next) => {
    const INR = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });
    res.locals.INR = INR;
    next();
};

module.exports = { getINRCurrency };
