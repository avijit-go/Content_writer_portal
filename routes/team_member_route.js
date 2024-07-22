const express = require("express");
const TeamMember = require("../models/team_member");
const TeamMemberRoute = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticate = require("../middleware/authcheck");
const generateAccessToken = require("../helper/generateAccessToken");
const sendMail = require("../helper/sendMail");


TeamMemberRoute.get("/list", async (req, res) => {
    try {
        const TeamMemberList = await TeamMember.find({}).populate(["designation", "reportingTo"]).select("firstName lastName email phone gender type joiningDate salary status createdAt");
        message = {
            error: false,
            message: "TeamMember list",
            data: TeamMemberList,
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

TeamMemberRoute.post("/create", async (req, res) => {
	try {
        const userExisted = await TeamMember.findOne({$or: [ { email: req.body.email }, { phone: req.body.phone } ]});
		req.body.password = 'secret'
		req.body.confirmPassword = 'secret'
        if (userExisted) {
            message = {
                error: true,
                message: "Team member already exist!"
            };
			res.status(200).send(message);
        } else {
			if (req.body.password === req.body.confirmPassword) {
				const TeamMemberData = new TeamMember(req.body);
				const result = await TeamMemberData.save();
				message = {
					error: false,
					message: "TeamMember Added Successfully!",
					data: result,
				};
				res.status(200).send(message);
			} else {
				message = {
					error: true,
					message: "password confirmation does not match!"
				};
				res.status(200).send(message);
			}
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

TeamMemberRoute.get("/detail/:TeamMemberId", async (req, res) => {
	try {
		const TeamMemberData = await TeamMember.findOne({ _id: req.params.TeamMemberId }).populate(["designation", "reportingTo"]);
		if (TeamMemberData.length != 0) {
			message = {
				error: false,
				message: "TeamMember Data Found!",
				data: TeamMemberData,
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
			message: "TeamMember not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

TeamMemberRoute.patch("/update/:TeamMemberId", isAuthenticate, async (req, res) => {
	try {
        delete req.body.email;
        delete req.body.phone;
        
		const result = await TeamMember.findOneAndUpdate({ _id: req.params.TeamMemberId }, req.body, {new: true}).populate(["designation", "reportingTo"]).select("-password");
		message = {
			error: false,
			message: "TeamMember Updated Successfully!",
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

TeamMemberRoute.post("/login", async (req, res) => {
	try {
        if (req.body.email && req.body.password) {
            TeamMemberData = await TeamMember.findOne({ email: req.body.email }).populate(["designation", "reportingTo"]);
            if (TeamMemberData === null) {
                message = {
                    error: true,
                    message: "wrong email!"
                }
                return res.status(200).send(message);
            } else {
                passwordCheck = await bcrypt.compare(req.body.password, TeamMemberData.password);
                if (passwordCheck) {
                  if (TeamMemberData.status === true) {
                    //generate access and refresh token
                    TeamMemberData.password = "";
                    const user = {data: TeamMemberData};
                    const accessToken = await generateAccessToken(user);
                    const refreshToken = await jwt.sign(user, process.env.REFRESH_TOKEN_KEY);
					
                    message = {
                        error: false,
                        message: "TeamMember logged in!",
                        data: [TeamMemberData, {accessToken: accessToken, refreshToken: refreshToken}]
                    }
                    return res.status(200).send(message);
                  } else {
                    message = {
                        error: true,
                        message: "TeamMember is in active!"
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

TeamMemberRoute.patch("/change-password/:TeamMemberId", isAuthenticate, async (req, res) => {
	try {
		if (req.body.old_password && req.body.password) {
            const TeamMemberData = await TeamMember.findOne({ _id: req.params.TeamMemberId });
            if (TeamMemberData === null) {
                message = {
                    error: true,
                    message: "Team Member not found!"
                }
                return res.status(400).send(message);
            } else {
                passwordCheck = await bcrypt.compare(req.body.old_password, TeamMemberData.password);
                if (passwordCheck) {
                    const result = await TeamMember.updateOne({ _id: req.params.TeamMemberId }, {password:req.body.password});
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

TeamMemberRoute.patch("/forget-password", async (req, res) => {
	try {
		if (req.body.email) {
            const randomPassword = Math.random().toString(36).slice(2);
            const teamMemberData = await TeamMember.findOneAndUpdate({ email: req.body.email }, { password: randomPassword }, {new:true});
            if (teamMemberData === null) {
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
                    teamMemberData,
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

TeamMemberRoute.post("/get-otp", async (req, res) => {
	try {
        const userExisted = await TeamMember.findOne({$or: [ { email: req.body.email }, { phone: req.body.phone } ]});

        if (userExisted) {
			const otpData = {
				emailOtp: 1234,
				mobileOtp: 4321
			}
			const result = await TeamMember.updateOne({ _id: userExisted._id }, otpData);
			
            message = {
                error: false,
                message: "Otp received!",
				data: otpData
            };
        } else {
            message = {
                error: true,
                message: "TeamMember not found!",
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

TeamMemberRoute.post("/reset-password", async (req, res) => {
	try {
        const userExisted = await TeamMember.findOne({$or: [ { email: req.body.email }, { phone: req.body.phone } ]});
		if (userExisted) {
			if (userExisted.emailOtp === req.body.otp || userExisted.mobileOtp === req.body.otp) {
			
				const result = await TeamMember.updateOne({ _id: userExisted._id }, {password: req.body.password});
				
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

TeamMemberRoute.delete("/delete/:TeamMemberId", isAuthenticate, async (req, res) => {
	try {
		const result = await TeamMember.deleteOne({ _id: req.params.TeamMemberId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "TeamMember deleted successfully!",
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

TeamMemberRoute.get("/search", async (req, res) => {
	try {
		let TeamMemberData = [];
        if (req.query.q) {
            TeamMemberData = await TeamMember.find({}).or([
				{ firstName: { $regex:req.query.q, $options: 'i' } }, 
				{ lastName: { $regex:req.query.q, $options: 'i' } },
				{ email: { $regex:req.query.q, $options: 'i' } }
			]).populate(["designation", "reportingTo"]);
        }
        if (req.query.desgnation) {
            TeamMemberData = await TeamMember.find()
			.populate([
				{
					path: "designation", 
					match: {
						$or:[ 
							{name: { $regex:req.query.desgnation, $options: 'i' }} 
						]
					}
				},
				"reportingTo"
			]);
			TeamMemberData = TeamMemberData.filter( (e) => e.designation !== null );
        }
        // if (req.query.mobile) {
        //     TeamMemberData = await TeamMember.find({phone: req.query.mobile});
        // }
		if (TeamMemberData.length != 0) {
			message = {
				error: false,
				message: "TeamMember Data Found!",
				data: TeamMemberData,
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
			message: "TeamMember not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

module.exports = TeamMemberRoute;