const removeImageFromServer = require("../util/removeImage.util");

const clearVerificationData = async (req, res, next) => {
    req.session.account = null;
    req.session.verificationCode = null;
    if(req.session.image) {
        try {
            await removeImageFromServer("userimages", req.session.image);
        } catch(error) {}
        req.session.image = null;
    }
    req.session.save(() => { next(); });
};

module.exports = clearVerificationData;
