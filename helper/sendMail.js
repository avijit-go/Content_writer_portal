/** @format */

require("dotenv").config();

const EventEmitter = require("events");
const event = new EventEmitter();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// These id's and secrets should come from .env file.
const FROM_EMAIL = process.env.FROM_EMAIL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (req, res) => {
  try {
    console.log(req);
    if (req.email && req.subject && req.text && req.html) {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: FROM_EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      // let randomPassword = Math.random().toString(36).slice(2);
      const mailOptions = {
        from: FROM_EMAIL,
        to: req.email,
        subject: req.subject,
        text: req.text,
        html: req.html,
      };

      const result = await transport.sendMail(mailOptions);
      message = {
        error: false,
        message: "Email sent successfully",
        data: result,
      };
    } else {
      message = {
        error: true,
        message: "All fields are required",
      };
    }
  } catch (error) {
    message = {
      error: true,
      message: "Operation failed",
      data: error,
    };
  }
  return message;
};

module.exports = sendMail;
