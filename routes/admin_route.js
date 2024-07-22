/** @format */

require("dotenv").config();
const express = require("express");
const app = express();

const Admin = require("../models/admin");
const adminRoute = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticate = require("../middleware/authcheck");
const checkAdmin = require("../middleware/adminCheck");
const generateAccessToken = require("../helper/generateAccessToken");
const sendMail = require("../helper/sendMail");

adminRoute.get("/all", isAuthenticate, async (req, res) => {
  try {
    const adminData = await Admin.find({});
    message = {
      error: false,
      message: "All admins list",
      data: adminData,
    };
    res.status(200).send(message);
  } catch (err) {
    message = {
      error: true,
      message: "operation failed!",
      data: err,
    };
    res.status(200).send(message);
  }
});

adminRoute.post("/create", async (req, res) => {
  try {
    if (req.body.password === req.body.confirmPassword) {
      const adminData = new Admin(req.body);
      const result = await adminData.save();
      message = {
        error: false,
        message: "Admin Added Successfully!",
        data: result,
      };
      res.status(201).send(message);
    } else {
      message = {
        error: true,
        message: "password confirmation does not match!",
      };
      res.status(200).send(message);
    }
  } catch (err) {
    message = {
      error: true,
      message: "Operation Failed!",
      data: err,
    };
    res.status(200).send(message);
  }
});

adminRoute.patch(
  "/update-profile/:AdminId",
  checkAdmin.authenticate,
  async (req, res) => {
    try {
      delete req.body.email;
      delete req.body.password;
      const result = await Admin.updateOne(
        { _id: req.params.AdminId },
        req.body
      );
      const adminData = await Admin.findOne({ _id: req.params.AdminId });
      adminData.password = "";
      message = {
        error: false,
        message: "Admin profile Updated Successfully!",
        data: adminData,
      };
      res.status(200).send(message);
    } catch (err) {
      message = {
        error: true,
        message: "Operation Failed!",
        data: err,
      };
      res.status(200).send(message);
    }
  }
);

adminRoute.patch(
  "/change-password/:AdminId",
  isAuthenticate,
  async (req, res) => {
    try {
      if (req.body.old_password && req.body.password) {
        const adminData = await Admin.findOne({ _id: req.params.AdminId });
        if (adminData === null) {
          message = {
            error: true,
            message: "Admin not found!",
          };
          return res.status(200).send(message);
        } else {
          passwordCheck = await bcrypt.compare(
            req.body.old_password,
            adminData.password
          );
          if (passwordCheck) {
            const result = await Admin.updateOne(
              { _id: req.params.AdminId },
              { password: req.body.password }
            );
            message = {
              error: false,
              message: "admin password updated!",
            };
            return res.status(200).send(message);
          } else {
            message = {
              error: true,
              message: "Old password is not correct!",
            };
            return res.status(200).send(message);
          }
        }
      } else {
        message = {
          error: true,
          message: "Old password, new password are required!",
        };
        return res.status(200).send(message);
      }
    } catch (err) {
      message = {
        error: true,
        message: "Operation Failed!",
        data: err,
      };
      res.status(200).send(message);
    }
  }
);

adminRoute.patch("/forget-password", async (req, res) => {
  try {
    if (req.body.email) {
      const randomPassword = Math.random().toString(36).slice(2);
      const adminData = await Admin.findOneAndUpdate(
        { email: req.body.email },
        { password: randomPassword },
        { new: true }
      );
      if (adminData === null) {
        message = {
          error: true,
          message: "Admin not found!",
        };
        return res.status(200).send(message);
      } else {
        const email = {
          email: req.body.email,
          subject: "Writer Portal - Reset Password",
          text: "Password reset for admin",
          html: `Your new password is <b>${randomPassword}</b> <br> N.B. Please change your password after login`,
        };
        const mailSending = await sendMail(email);
        message = {
          error: false,
          message: "admin password updated!",
          adminData,
          email: mailSending,
          text: email,
        };
        return res.status(200).send(message);
      }
    } else {
      message = {
        error: true,
        message: "Email is required",
      };
      return res.status(200).send(message);
    }
  } catch (err) {
    message = {
      error: true,
      message: "Operation Failed!",
      data: err,
    };
    res.status(200).send(message);
  }
});

adminRoute.post("/login", async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      adminData = await Admin.findOne({ email: req.body.email });
      if (adminData === null) {
        message = {
          error: true,
          message: "wrong email!",
        };
        return res.status(200).send(message);
      } else {
        passwordCheck = await bcrypt.compare(
          req.body.password,
          adminData.password
        );
        if (passwordCheck) {
          if (adminData.status === true) {
            //generate access and refresh token
            adminData.password = "";
            const user = { data: adminData };
            const accessToken = await generateAccessToken(user);
            const refreshToken = await jwt.sign(
              user,
              process.env.REFRESH_TOKEN_KEY
            );

            message = {
              error: false,
              message: "admin logged in!",
              data: [
                adminData,
                { accessToken: accessToken, refreshToken: refreshToken },
              ],
            };
            return res.status(200).send(message);
          } else {
            message = {
              error: true,
              message: "admin is in active!",
            };
            return res.status(403).send(message);
          }
        } else {
          message = {
            error: true,
            message: "wrong password!",
          };
          return res.status(200).send(message);
        }
      }
    } else {
      res.status(200).send({
        message: "Email and Password are required.",
      });
    }
  } catch (err) {
    message = {
      error: true,
      message: "Operation Failed!",
      data: err,
    };
    res.status(200).send(message);
  }
});

module.exports = adminRoute;
