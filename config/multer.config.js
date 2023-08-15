const multer = require("multer");
const { v4: getId } = require("uuid");

const multerConfig = (folderPath) => {
    const storageObj = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, getId() + "-" + file.originalname);
        },
        destination: folderPath
    });
    const fileFilter = (req, file, cb) => {
        if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg")
            cb(null, true);
        else {
            cb(null, false);
            req.wrongFileUpload = true;
        }
    };
    return multer({ storage: storageObj, fileFilter });
};

module.exports = multerConfig;
