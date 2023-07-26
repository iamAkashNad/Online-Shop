const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SHOP_EMAIL,
        pass: process.env.SHOP_EMAIL_PASSWORD
    }
});

module.exports = transporter;