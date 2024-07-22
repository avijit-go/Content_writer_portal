const express = require("express");
const Client = require("../models/client");
const Project = require("../models/project");
const TeamMember = require("../models/team_member");
const Task = require("../models/task");
const TaskFeedback = require("../models/task_feedback");

const DashboardRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");

DashboardRoute.get("/admin", isAuthenticate, async (req, res) => {
    try {
        const activeClient = await Client.count({ status: true });
        const inactiveClient = await Client.count({ status: false });
        const totalProject = await Project.count();
        const teamMembers = await TeamMember.find({}).populate("designation");
        const tasks = await Task.count();
        message = {
            error: false,
            message: "Dashboard data",
            data: {
                activeClient,
                inactiveClient,
                totalProject,
                writer: teamMembers.filter( e => e.designation.name === 'Content Writer' ).length,
                editor: teamMembers.filter( e => e.designation.name === 'Editor' ).length,
                projectManager: teamMembers.filter( e => e.designation.name === 'Project Manager' ).length,
                tasks
            },
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

DashboardRoute.get("/client/:clientId", isAuthenticate, async (req, res) => {
    try {
        const totalProject = await Project.find({ client: req.params.clientId }).count();
        const activeProject = await Project.find({ status: true, client: req.params.clientId }).count();
        const inactiveProject = await Project.find({ status: false, client: req.params.clientId }).count();
        const completedProject = await Project.find({ completed: true, client: req.params.clientId }).count();
        const totalTask = await Task.find({ client: req.params.clientId }).count();
        message = {
            error: false,
            message: "Dashboard data",
            data: {
                totalProject,
                activeProject,
                inactiveProject,
                completedProject,
                totalTask,
            },
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

DashboardRoute.get("/feedbacks", isAuthenticate, async (req, res) => {
    try {
        const feedbacks = await TaskFeedback.find({}).populate(
            [
                {
                    path: "task",
                    select: "title writer editor projectManager"
                },
                {
                    path: "teamMember",
                    select: "firstName lastName designation",
                    populate: {
                        path: "designation",
                        select: "-_id name"
                    }
                },
            ]
        )
        const tasks = await Task.find({})
        message = {
            error: false,
            message: "Dashboard data",
            data: {
                feedbacks,
                tasks
            }
        };
        res.status(200).send(message);
    } catch (error) {
        message = {
            error: true,
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
})

module.exports = DashboardRoute;