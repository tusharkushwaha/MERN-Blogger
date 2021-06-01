const nodemailer = require("nodemailer");

const sendEmail = (Option) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: Option.to,
        subject: Option.subject,
        html: Option.text,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            // console.log(err);
        }
        else {
            // console.log(info);
        }
    })
}
module.exports = sendEmail;
