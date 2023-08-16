const fse = require("fs-extra");
const path = require("path");

const rootDir = require("./getRootDir.util");

const removeImageFromServer = async (imageDir, image) => {
  try {
    const filePath = path.join(rootDir, "public", imageDir, image);
    await fse.remove(filePath);
  } catch (error) {}
};

module.exports = removeImageFromServer;
