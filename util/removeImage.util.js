const fse = require("fs-extra");

const rootDir = require("./getRootDir.util");

const removeImageFromServer = async (imageDir, image) => {
    await fse.remove(`${rootDir}/public/${imageDir}/${image}`);
};

module.exports = removeImageFromServer;
