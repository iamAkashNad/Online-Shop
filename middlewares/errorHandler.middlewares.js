const pageNotFound = (req, res) => {
    res.status(404).render("common/404");
};

const expressDefaultErrorHandler = (error, req, res, next) => {
    console.log(error.message);
    res.status(500).render("common/500");
};

module.exports = {
    pageNotFound: pageNotFound,
    expressDefaultErrorHandler: expressDefaultErrorHandler,
};
