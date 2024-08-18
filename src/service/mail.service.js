require('dotenv').config();
const nodemailer = require('nodemailer');
const ApiError = require('../exceptions/api.exception');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Activate medication-intake-tracker-app account',
        text: '',
        html: `
              <div>
                <h1>To activate go to link below</h1>
                <a href="${link}">${link}</a>
              </div>
            `,
      });
    } catch (error) {
      console.error('Error sending activation email:', error);
      throw ApiError.BadRequest('Failed to send activation email');
    }
  }
}

module.exports = new MailService();
