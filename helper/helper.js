const nodemailer = require('nodemailer');
require('dotenv').config();

function sendSuccess(res, statusCode, data, message) {
    res.status(statusCode).send({
        status: 'success',
        data: data,
        message: message
    });
}

function sendFail(res, statusCode, message) {
    res.status(statusCode).send({
        status: 'fail',
        message: message
    });
}

async function sendEmail(to, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: 'no-reply@booktopia.com.vn',
        to: to,
        subject: subject,
        text: text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ' + error);
        throw new Error('Error sending email: ' + error);
    }
}

const Helper = {
    sendSuccess,
    sendFail,
    sendEmail
}

module.exports = Helper;