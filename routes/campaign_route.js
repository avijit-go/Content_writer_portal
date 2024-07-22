const express = require("express");
const Campaign = require("../models/campaign");
const CampaignRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


CampaignRoute.get("/list", async (req, res) => {
    try {
        const CampaignList = await Campaign.find({}).populate(["project", "client"]);
        message = {
            error: false,
            message: "Campaign list",
            data: CampaignList,
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

CampaignRoute.post("/create", async (req, res) => {
	try {
        const CampaignData = new Campaign(req.body);
        const result = await CampaignData.save();
        message = {
            error: false,
            message: "Campaign Added Successfully!",
            data: result,
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

CampaignRoute.get("/detail/:CampaignId", async (req, res) => {
	try {
		const CampaignData = await Campaign.findOne({ _id: req.params.CampaignId }).populate(["project", "client"]);
		if (CampaignData.length != 0) {
			message = {
				error: false,
				message: "Campaign Data Found!",
				data: CampaignData,
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
			message: "Campaign not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

CampaignRoute.patch("/update/:CampaignId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Campaign.updateOne({ _id: req.params.CampaignId }, req.body);
		message = {
			error: false,
			message: "Campaign Updated Successfully!"
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

CampaignRoute.delete("/delete/:CampaignId", isAuthenticate, async (req, res) => {
	try {
		const result = await Campaign.deleteOne({ _id: req.params.CampaignId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "Campaign deleted successfully!",
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

CampaignRoute.get("/search", async (req, res) => {
	try {
		let CampaignData = [];
        if (req.query.q) {
            CampaignData = await Campaign.find({ name: { $regex:req.query.q, $options: 'i' } }).populate(["project", "client"]);
        }
		if (req.query.client) {
            CampaignData = await Campaign.find()
			.populate([
				"project",
				{
					path: "client", 
					match: {
						$or:[ 
							{name: { $regex:req.query.client, $options: 'i' }} 
						]
					}
				}
			]);
			CampaignData = CampaignData.filter( (e) => e.client !== null );
        }
		if (req.query.project) {
            CampaignData = await Campaign.find()
			.populate([
				{
					path: "project", 
					match: {
						$or:[ 
							{name: { $regex:req.query.project, $options: 'i' }} 
						]
					}
				},
				"client"
			]);
			CampaignData = CampaignData.filter( (e) => e.project !== null );
        }
		if (CampaignData.length != 0) {
			message = {
				error: false,
				message: "Client Data Found!",
				data: CampaignData,
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

module.exports = CampaignRoute;