const express = require("express");
const ContentType = require("../models/contentType");
const ContentTypeRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


ContentTypeRoute.get("/list", async (req, res) => {
    try {
        const ContentTypeList = await ContentType.find({});
        message = {
            error: false,
            message: "ContentType list",
            data: ContentTypeList,
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

ContentTypeRoute.post("/create", async (req, res) => {
	try {
        const ContentTypeData = new ContentType(req.body);
        const result = await ContentTypeData.save();
        message = {
            error: false,
            message: "ContentType Added Successfully!",
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

ContentTypeRoute.get("/detail/:ContentTypeId", async (req, res) => {
	try {
		const ContentTypeData = await ContentType.findOne({ _id: req.params.ContentTypeId });
		if (ContentTypeData.length != 0) {
			message = {
				error: false,
				message: "ContentType Data Found!",
				data: ContentTypeData,
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
			message: "ContentType not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

ContentTypeRoute.patch("/update/:ContentTypeId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await ContentType.updateOne({ _id: req.params.ContentTypeId }, req.body);
		message = {
			error: false,
			message: "ContentType Updated Successfully!"
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

ContentTypeRoute.delete("/delete/:ContentTypeId", isAuthenticate, async (req, res) => {
	try {
		const result = await ContentType.deleteOne({ _id: req.params.ContentTypeId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "ContentType deleted successfully!",
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


module.exports = ContentTypeRoute;