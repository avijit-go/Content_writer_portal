const mongoose = require("mongoose");
const TeamMember = require("./team_member");
const Project = require("./project");
const Client = require("./client");

const taskSchema = new mongoose.Schema({
    contentClientId: {
        type: String
    },
    contentIdBatch: {
        type: String
    },
	title: {
        type: String,
        required: true
    },
	wordLimit: {
        type: Number,
        required: true
    },
    contentDetail: {
        mainContent: {
            type: String
        },
        articleTitle: {
            type: String
        },
        pageSlug: {
            type: String
        },
        seoTitle: {
            type: String
        },
        contentType: {
            type: String
        },
        bannerImage: {
            type: String
        },
        thumbnailImage: {
            type: String
        },
        metaDescription: {
            type: String
        },
        tags: [
            {
                type: String
            }
        ],
        wordCount: {
            type: Number,
            default: 0
        }
    },
    totalTimeTaken: {
        type: Number,
        default: 0
    },
	contentType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "contentTypes"
    },
	primaryTopic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "primaryTopics"
    },
	otherTopic: {
        type: String
    },
	primaryKeywords: {
        type: Array
    },
	secondaryKeywords: {
        type: Array
    },
	linksRequired: {
        type: Array
    },
	styleGuide: {
        type: String
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Project
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Client,
        required: [true, 'Please provide a valid client']
    },
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: TeamMember,
        required: [true, 'Please provide a valid writer']
    },
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: TeamMember,
        required: [true, 'Please provide a valid editor']
    },
    projectManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: TeamMember,
        required: [true, 'Please provide a valid projectManager']
    },
    startDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    pay: {
        type: Number,
        required: true
    },
    additionalNote: {
        type: String,
        required: true
    },
    timeToComplete: {
        type: Number,
        default: 0,
        required: true
    },
    submitted: {
        type: Boolean
    },
    completed: {
        type: Boolean
    },
    approved: {
        type: Boolean
    },
    submittedAt: {
        type: Date
    },
    approvedAt: {
        type: Date
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Task = new mongoose.model("tasks", taskSchema);

module.exports = Task;
