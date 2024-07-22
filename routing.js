const express = require("express");
const router = express.Router();


const tokenRouter = require("./routes/token_route");
const adminRouter = require("./routes/admin_route");
const settingRouter = require("./routes/settings_route");
const dashboardRouter = require("./routes/dashboard_routes");
const clientRouter = require("./routes/client_route");
const projectRouter = require("./routes/project_route");
const projectProgressRouter = require("./routes/project_progress_route");
const campaignRouter = require("./routes/campaign_route");
const designationRouter = require("./routes/designation_route");
const teamMemberRouter = require("./routes/team_member_route");
const contentTypeRouter = require("./routes/content_type_route");
const primaryTopicRouter = require("./routes/primary_topic_route");
const TaskRouter = require("./routes/task_route");
const TaskFeedbackRouter = require("./routes/task_feedback_route");
const TaskTimelineRouter = require("./routes/task_timeline_route");
const trainingVideoRouter = require("./routes/training_video_route");
const mailRouter = require("./routes/mailing");
const reportRouter = require("./routes/report_route");

router.use("/token", tokenRouter);
router.use("/admin", adminRouter);
router.use("/setting", settingRouter);
router.use("/dashboard", dashboardRouter);
router.use("/client", clientRouter);
router.use("/project", projectRouter);
router.use("/project-progress", projectProgressRouter);
router.use("/campaign", campaignRouter);
router.use("/designation", designationRouter);
router.use("/team-member", teamMemberRouter);
router.use("/content-type", contentTypeRouter);
router.use("/primary-topic", primaryTopicRouter);
router.use("/task", TaskRouter);
router.use("/task-feedback", TaskFeedbackRouter);
router.use("/task-timeline", TaskTimelineRouter);
router.use("/training-video", trainingVideoRouter);
router.use("/mail", mailRouter);
router.use("/report", reportRouter);

module.exports = router;