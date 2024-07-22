const express = require("express");
const Client = require("../models/client");
const ClientRoute = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticate = require("../middleware/authcheck");
const generateAccessToken = require("../helper/generateAccessToken");
const sendMail = require("../helper/sendMail");


ClientRoute.get("/list", async (req, res) => {
    try {
        const ClientList = await Client.find({});
        message = {
            error: false,
            message: "Client list",
            data: ClientList,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

ClientRoute.post("/create", async (req, res) => {
	try {
        const userExisted = await Client.findOne({$or: [ { email: req.body.email }, { phone: req.body.phone } ]});

        if (userExisted) {
            message = {
                error: true,
                message: "Client already exist!"
            };
        } else {
            const ClientData = new Client(req.body);
            const result = await ClientData.save();
            message = {
                error: false,
                message: "Client Added Successfully!",
                data: result,
            };
        }
        res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});

ClientRoute.get("/detail/:ClientId", async (req, res) => {
	try {
		const ClientData = await Client.findOne({ _id: req.params.ClientId });
		if (ClientData.length != 0) {
			message = {
				error: false,
				message: "Client Data Found!",
				data: ClientData,
			};
		} else {
			message = {
				error: true,
				message: "No Data Found!",
			};
		}
		res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "Client not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

ClientRoute.post("/login", async (req, res) => {
	try {
        if (req.body.email && req.body.password) {
            ClientData = await Client.findOne({ email: req.body.email });
            if (ClientData === null) {
                message = {
                    error: true,
                    message: "wrong email!"
                }
                return res.status(200).send(message);
            } else {
                passwordCheck = await bcrypt.compare(req.body.password, ClientData.password);
                if (passwordCheck) {
                  if (ClientData.status === true) {
                    //generate access and refresh token
                    ClientData.password = "";
                    const user = {data: ClientData};
                    const accessToken = await generateAccessToken(user);
                    const refreshToken = await jwt.sign(user, process.env.REFRESH_TOKEN_KEY);
					
                    message = {
                        error: false,
                        message: "Client logged in!",
                        data: [ClientData, {accessToken: accessToken, refreshToken: refreshToken}]
                    }
                    return res.status(200).send(message);
                  } else {
                    message = {
                        error: true,
                        message: "Client is in active!"
                    }
                    return res.status(200).send(message);
                  }
                } else {
                    message = {
                        error: true,
                        message: "wrong password!"
                    }
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

ClientRoute.patch("/change-password/:ClientId", isAuthenticate, async (req, res) => {
	try {
		if (req.body.old_password && req.body.password) {
            const ClientData = await Client.findOne({ _id: req.params.ClientId });
            if (ClientData === null) {
                message = {
                    error: true,
                    message: "Team Member not found!"
                }
                return res.status(400).send(message);
            } else {
                passwordCheck = await bcrypt.compare(req.body.old_password, ClientData.password);
                if (passwordCheck) {
                    const result = await Client.updateOne({ _id: req.params.ClientId }, {password:req.body.password});
                    message = {
                        error: false,
                        message: "Team Member password updated!"
                    }
                    return res.status(200).send(message);
                } else {
                    message = {
                        error: true,
                        message: "Old password is not correct!"
                    }
                    return res.status(400).send(message);
                }
            }
        } else {
            message = {
                error: true,
                message: "Old password, new password are required!"
            }
            return res.status(400).send(message);
        }
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(400).send(message);
	}
});

ClientRoute.patch("/forget-password", async (req, res) => {
	try {
		if (req.body.email) {
            const randomPassword = Math.random().toString(36).slice(2);
            const clientData = await Client.findOneAndUpdate({ email: req.body.email }, { password: randomPassword }, {new:true});
            if (clientData === null) {
                message = {
                    error: true,
                    message: "User not found!"
                }
                return res.status(200).send(message);
            } else {
                const email = {
                    email: req.body.email,
                    subject: "Writer Portal - Reset Password",
                    text: "Password reset for User",
                    html: `Your new password is <b>${randomPassword}</b> <br> N.B. Please change your password after login`
                }
                const mailSending = await sendMail(email);
                message = {
                    error: false,
                    message: "User password updated!",
                    clientData,
                    email: mailSending,
					text: email
                }
                return res.status(200).send(message);
            }
        } else {
            message = {
                error: true,
                message: "Email is required"
            }
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

ClientRoute.post("/get-otp", async (req, res) => {
	try {
        const userExisted = await Client.findOne({$or: [ { email: req.body.email }, { phone: req.body.phone } ]});

        if (userExisted) {
			const otpData = {
				emailOtp: 1234,
				mobileOtp: 4321
			}
			const result = await Client.updateOne({ _id: userExisted._id }, otpData);
			
            message = {
                error: false,
                message: "Otp received!",
				data: otpData
            };
        } else {
            message = {
                error: true,
                message: "Client not found!",
                data: result,
            };
        }
        res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});

ClientRoute.post("/reset-password", async (req, res) => {
	try {
        const userExisted = await Client.findOne({$or: [ { email: req.body.email }, { phone: req.body.phone } ]});
		if (userExisted) {
			if (userExisted.emailOtp === req.body.otp || userExisted.mobileOtp === req.body.otp) {
			
				const result = await Client.updateOne({ _id: userExisted._id }, {password: req.body.password});
				
				message = {
					error: false,
					message: "Password reset successful",
				};
			} else {
				message = {
					error: true,
					message: "OTP does not match"
				};
			}
		} else {
			message = {
				error: true,
				message: "User does not exist"
			};
		}
        
        res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});

ClientRoute.patch("/update/:ClientId", isAuthenticate, async (req, res) => {
	try {
        delete req.body.email;
        delete req.body.phone;
 
		const result = await Client.findOneAndUpdate({ _id: req.params.ClientId }, req.body, {new: true});
		message = {
			error: false,
			message: "Client Updated Successfully!",
			data: result
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
});

ClientRoute.delete("/delete/:ClientId", isAuthenticate, async (req, res) => {
	try {
		const result = await Client.deleteOne({ _id: req.params.ClientId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "Client deleted successfully!",
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Operation failed!",
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

ClientRoute.get("/search", async (req, res) => {
	try {
		let ClientData = [];
        if (req.query.q) {
            ClientData = await Client.find({}).or([
				{ name: { $regex:req.query.q, $options: 'i' } }, 
				{ company: { $regex:req.query.q, $options: 'i' } }, 
				{ email: { $regex:req.query.q, $options: 'i' } }
			]);
        }
        // if (req.query.mobile) {
        //     ClientData = await Client.find({phone: req.query.mobile});
        // }
		if (ClientData.length != 0) {
			message = {
				error: false,
				message: "Client Data Found!",
				data: ClientData,
			};
		} else {
			message = {
				error: true,
				message: "No Data Found!",
			};
		}
		res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "Client not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

module.exports = ClientRoute;