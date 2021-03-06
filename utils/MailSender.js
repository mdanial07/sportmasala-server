'use strict'
const nodemailer = require('nodemailer')

class MailSender {
    /**
     * sendMail
     * Sends html emails to specified email address(es)
     * @param {string} to
     * @param {string} subject
     * @param {string} html
     */
    async sendMail(to, subject, html) {
        let transporter = await MailSender.prototype.createTransporter()
        let mailOptions = {
            from: '"E-Booket" <ebooket1@gmail.com>',
            to: to,
            subject: subject,
            html: html
        }
        let response = await transporter.sendMail(mailOptions)
        console.log(response);
        return response
    }

    /**
     * createTransporter
     * Creates a nodemailer test account and transporter and returns a promise to resolve
     * when the transporter is created.
     */
    async createTransporter() {
        let testAccount = await nodemailer.createTestAccount();
        return new Promise((resolve, reject) => {
            nodemailer.createTestAccount((err, account) => {
                let transporter = nodemailer.createTransport({
                    // host: 'smtp.ethereal.email',
                    // secure: false,
                    service: 'Gmail',
                    // host: 'smtp.gmail.com',
                    // port: 587,
                    auth: {
                        user: 'ebooket1@gmail.com',
                        pass: 'Bluewhale#123'
                    }
                })
                if (err) { reject(err) } else resolve(transporter)
            })
        })
    }
}

const mailSender = new MailSender()
module.exports = { mailSender }
