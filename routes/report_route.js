const express = require("express");

//models
const Task = require("../models/task");
const TeamMember = require("../models/team_member");

//middleware
const isAuthenticate = require("../middleware/authcheck");

//route
const ReportRoute = express.Router();

//admin report
/**
 * report by client
 * @param clientId
 * 
 */
ReportRoute.get("/client/:clientId/get", async (req, res) => {
    try {
        const populate = [
            {
                path: "contentType",
                select: "name"
            },
            {
                path: "primaryTopic",
                select: "name"
            },
            {
                path: "project",
                select: "name"
            },
            {
                path: "client",
                select: "name"
            },
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ];
        let articles = await Task.find({ client: req.params.clientId }).populate(populate);
        
        //article filter
        const greaterThan = req.query.from; 
        const lessThan = req.query.to;
        const contentType = req.query.contentType;
        if(lessThan && greaterThan) {
            articles = articles.filter( e => {
                let words = Number(e.contentDetail.wordCount);
                return (words >= greaterThan && words <= lessThan)
            } );
        }
        if(contentType) {
            articles = articles.filter( e => e.contentType.name === contentType );
        }

        if (articles.length) {
            message = {
                error: false,
                message: "Task Data Found!",
                data: articles,
            };
        } else {
            message = {
                error: true,
                message: "No Data Found!"
            };
        }
        res.status(200).send(message);
    } catch (error) {
        message = {
            error: true,
            message: "Operation failed!"
        };
        res.status(500).send(message);
    }
})

/**
 * report by client
 * @param writerId
 * 
 */
ReportRoute.get("/writer/:writerId/get", async (req, res) => {
    try {
        const populate = [
            {
                path: "contentType",
            },
            {
                path: "primaryTopic",
            },
            {
                path: "project",
                select: "name"
            },
            {
                path: "client",
                select: "name"
            },
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ]
        let articles = await Task.find({ writer: req.params.writerId }).populate(populate);
    
        //article filter
        const greaterThan = req.query.from; 
        const lessThan = req.query.to;
        const contentType = req.query.contentType;
        if(lessThan && greaterThan) {
            articles = articles.filter( e => {
                let words = Number(e.contentDetail.wordCount);
                return (words >= greaterThan && words <= lessThan)
            } );
        }
        if(contentType) {
            articles = articles.filter( e => e.contentType.name === contentType );
        }
        if (articles.length) {
            message = {
                error: false,
                message: "Task Data Found!",
                data: articles,
            };
        } else {
            message = {
                error: true,
                message: "No Data Found!"
            };
        }
        res.status(200).send(message);
    } catch (error) {
        message = {
            error: true,
            message: "Operation failed!"
        };
        res.status(500).send(message);
    }
})

//writer leaderboard report
ReportRoute.get("/writer-leaderboard/get", async (req, res) => {
    try {
        const populate = [
            {
                path: "contentType",
            },
            {
                path: "primaryTopic",
            },
            {
                path: "project",
                select: "name"
            },
            {
                path: "client",
                select: "name"
            },
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ]
        let articles = [];
    
        //article filter
        if (req.query.range) {
			var start = new Date();
			var end = new Date();
			switch (req.query.range) {
				case "daily":
					start.setDate(start.getDate()-1)
					break;
				case "weekly":
					start.setDate(end.getDate()-6);
					break;
				case "monthly":
					start.setDate(end.getDate()-29);
					break;
				case "yearly":
					start.setDate(end.getDate()-364);
					break;
			
				default:
					start.setDate(end.getDate()-9999);
					break;
			}
			articles = await Task.find({ submittedAt: 
				{
					$gte: start.toISOString(), 
					$lte: end.toISOString()
				}
			}).populate(populate).select("-contentDetail.mainContent");
		} else {
            articles = await Task.find({}).populate(populate).select("-contentDetail.mainContent");
        }

        if (articles.length) {
            message = {
                error: false,
                message: "Task Data Found!",
                data: articles,
            };
        } else {
            message = {
                error: true,
                message: "No Data Found!"
            };
        }
        res.status(200).send(message);
    } catch (error) {
        message = {
            error: true,
            message: "Operation failed!"
        };
        res.status(500).send(message);
    }
})

//client report
ReportRoute.get("/client/:clientId/data", async (req, res) => {
    try {
        
        const populate = [
            {
                path: "contentType",
                select: "name"
            },
            {
                path: "primaryTopic",
                select: "name"
            },
            {
                path: "project",
                select: "name"
            },
            {
                path: "client",
                select: "name"
            },
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ];
        let articles = await Task.find({ client: req.params.clientId }).populate(populate);

        //article filter
        if (req.query.keyword) {
            articles = await Task.find({ $and: [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { client: req.params.clientId }
            ]}).populate(populate);
        }
        if (req.query.status) {
            articles = await Task.find({$and: [
                { client: req.params.clientId },
                { status: req.query.status }
            ]}).populate(populate);
        }
        if (req.query.contentType) {
            articles = await Task.find({$and: [
                { client: req.params.clientId },
                { contentType: req.query.contentType }
            ]}).populate(populate);
        }
        if (req.query.date) {
            var start = new Date(req.query.date);
			var end = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            end.setDate(start.getDate()+1);
            articles = await Task.find({$and: [
                { client: req.params.clientId },
                { submittedAt: 
                    {
                        $gte: start, 
                        $lte: end
                    }
                }
            ]}).populate(populate);
        }
        if (req.query.range) {
			var start = new Date();
			var end = new Date();
			switch (req.query.range) {
				case "daily":
					start.setDate(start.getDate()-1)
					break;
				case "weekly":
					start.setDate(end.getDate()-6);
					break;
				case "monthly":
					start.setDate(end.getDate()-29);
					break;
				case "yearly":
					start.setDate(end.getDate()-364);
					break;
			
				default:
					start.setDate(end.getDate()-9999);
					break;
			}
			articles = await Task.find({$and: [
                { client: req.params.clientId },
                { 
                    submittedAt: {
                        $gte: start.toISOString(), 
                        $lte: end.toISOString()
                    }
                }
            ]}).populate(populate).select("-contentDetail.mainContent");
		}

        if (articles.length) {
            message = {
                error: false,
                message: "Task Data Found!",
                data: articles,
            };
        } else {
            message = {
                error: true,
                message: "No Data Found!"
            };
        }
        res.status(200).send(message);
    } catch (error) {
        message = {
            error: true,
            message: "Operation failed!"
        };
        res.status(500).send(message);
    }
})

//writer report
ReportRoute.get("/writer/:writerId/data", async (req, res) => {
    try {
        
        const populate = [
            {
                path: "contentType",
                select: "name"
            },
            {
                path: "primaryTopic",
                select: "name"
            },
            {
                path: "project",
                select: "name"
            },
            {
                path: "client",
                select: "name"
            },
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ];
        let articles = await Task.find({ writer: req.params.writerId }).populate(populate);

        //article filter
        if (req.query.keyword) {
            articles = await Task.find({ $and: [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { writer: req.params.writerId }
            ]}).populate(populate);
        }
        if (req.query.status) {
            articles = await Task.find({$and: [
                { writer: req.params.writerId },
                { status: req.query.status }
            ]}).populate(populate);
        }
        if (req.query.contentType) {
            articles = await Task.find({$and: [
                { writer: req.params.writerId },
                { contentType: req.query.contentType }
            ]}).populate(populate);
        }
        if (req.query.date) {
            var start = new Date(req.query.date);
			var end = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            end.setDate(start.getDate()+1);
            articles = await Task.find({$and: [
                { writer: req.params.writerId },
                { submittedAt: 
                    {
                        $gte: start.toISOString(), 
                        $lt: end.toISOString()
                    }
                }
            ]}).populate(populate);
        }
        if (req.query.range) {
			var start = new Date();
			var end = new Date();
			switch (req.query.range) {
				case "daily":
					start.setDate(start.getDate()-1)
					break;
				case "weekly":
					start.setDate(end.getDate()-6);
					break;
				case "monthly":
					start.setDate(end.getDate()-29);
					break;
				case "yearly":
					start.setDate(end.getDate()-364);
					break;
			
				default:
					start.setDate(end.getDate()-9999);
					break;
			}
			articles = await Task.find({$and: [
                { writer: req.params.writerId },
                { 
                    submittedAt: {
                        $gte: start.toISOString(), 
                        $lte: end.toISOString()
                    }
                }
            ]}).populate(populate).select("-contentDetail.mainContent");
		}

        if (articles.length) {
            message = {
                error: false,
                message: "Task Data Found!",
                data: articles,
            };
        } else {
            message = {
                error: true,
                message: "No Data Found!"
            };
        }
        res.status(200).send(message);
    } catch (error) {
        message = {
            error: true,
            message: "Operation failed!"
        };
        res.status(500).send(message);
    }
})

//client report for laste 6months
ReportRoute.get("/client/last-six-month/:clientId", async (req, res) => {
    try {
        
        const populate = [
            {
                path: "contentType",
                select: "name"
            },
            {
                path: "primaryTopic",
                select: "name"
            },
            {
                path: "project",
                select: "name"
            },
            {
                path: "client",
                select: "name"
            },
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ];
        //last 6 months including this month
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var today = new Date();
        var months = [];
        var articles = [];

        for(var i = 0; i < 6; i ++) {
            let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            let e = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            articles = await Task.find({$and: [
                { client: req.params.clientId },
                { submittedAt: 
                    {
                        $gte: d.toISOString(), 
                        $lte: e.toISOString()
                    }
                }
            ]}).populate(populate);
            months.push({name: monthNames[d.getMonth()], start: d.toISOString(), end: e.toISOString(), articles});
        }

        message = {
            error: false,
            message: "Task Data Found!",
            data: months,
        };
        res.status(200).send(message);
    } catch (error) {
        message = {
            error: true,
            message: "Operation failed!"
        };
        res.status(500).send(message);
    }
})

//client writer for laste 6months
ReportRoute.get("/writer/last-six-month/:writerId", async (req, res) => {
    try {
        
        const populate = [
            {
                path: "contentType",
                select: "name"
            },
            {
                path: "primaryTopic",
                select: "name"
            },
            {
                path: "project",
                select: "name"
            },
            {
                path: "client",
                select: "name"
            },
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ];
        //last 6 months including this month
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var today = new Date();
        var months = [];
        var articles = [];

        for(var i = 0; i < 6; i ++) {
            let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            let e = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            articles = await Task.find({$and: [
                { writer: req.params.writerId },
                { submittedAt: 
                    {
                        $gte: d.toISOString(), 
                        $lte: e.toISOString()
                    }
                }
            ]}).populate(populate);
            months.push({name: monthNames[d.getMonth()], start: d.toISOString(), end: e.toISOString(), articles});
        }

        message = {
            error: false,
            message: "Task Data Found!",
            data: months,
        };
        res.status(200).send(message);
    } catch (error) {
        message = {
            error: true,
            message: "Operation failed!"
        };
        res.status(500).send(message);
    }
})

module.exports = ReportRoute