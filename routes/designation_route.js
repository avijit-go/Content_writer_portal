const express = require("express");
const Designation = require("../models/designation");
const DesignationRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


DesignationRoute.get("/list", async (req, res) => {
    try {
        const DesignationList = await Designation.find({});
        message = {
            error: false,
            message: "Designation list",
            data: DesignationList,
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

DesignationRoute.post("/create", async (req, res) => {
	try {
        const DesignationData = new Designation(req.body);
        const result = await DesignationData.save();
        message = {
            error: false,
            message: "Designation Added Successfully!",
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

DesignationRoute.get("/detail/:DesignationId", async (req, res) => {
	try {
		const DesignationData = await Designation.findOne({ _id: req.params.DesignationId });
		if (DesignationData.length != 0) {
			message = {
				error: false,
				message: "Designation Data Found!",
				data: DesignationData,
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
			message: "Designation not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

DesignationRoute.patch("/update/:DesignationId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Designation.updateOne({ _id: req.params.DesignationId }, req.body);
		message = {
			error: false,
			message: "Designation Updated Successfully!"
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

DesignationRoute.delete("/delete/:DesignationId", isAuthenticate, async (req, res) => {
	try {
		const result = await Designation.deleteOne({ _id: req.params.DesignationId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "Designation deleted successfully!",
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


module.exports = DesignationRoute;