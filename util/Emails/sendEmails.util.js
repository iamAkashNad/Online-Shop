const getEmailSubject = require("./getEmailSubject.util");
const getEmailTamplate = require("./getEmailTamplate.util");
const transporter = require("./getEmailTransporter.util");

const sendEmail = (purpose, data) => {
    const subject = getEmailSubject(purpose, data);
    const html = getEmailTamplate(purpose, data);
    return transporter.sendMail({
        from: "Team wCart <no-reply@wcart.com>",
        to: `<${data.email}>`,
        subject,
        html
    });
};

module.exports = { sendEmail };
