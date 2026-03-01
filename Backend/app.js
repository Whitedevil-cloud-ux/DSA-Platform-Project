const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoutes");
const userRoute = require("./Routes/UserRoutes");
const submissionRoute = require("./Routes/SubmissionRoutes");
const dailyPlanRoute = require("./Routes/DailyPlanRoutes");
const streakRoute = require("./Routes/StreakRoutes");
const feedbackRoute = require("./Routes/feedbackRoutes");
const insightRoute = require("./Routes/InsightRoutes");
const patternInsightRoute = require("./Routes/PatternInsightRoutes");
const dashboardRoute = require("./Routes/DashboardRoutes");
const problemRoute = require("./Routes/ProblemRoutes");
const analyticsRoute = require("./Routes/AnalyticsRoutes");
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 8080; 

mongoose
    .connect(MONGO_URL, {
        dbName: "dsaPlatform",
    })
    .then(() => console.log("MongoDB is connected successfully"))
    .catch((err) => console.error(err));

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

app.use("/", authRoute);
app.use("/api/user", userRoute);
app.use("/api/submissions", submissionRoute);
app.use("/api/daily-plan", dailyPlanRoute);
app.use("/api/streak", streakRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/user", insightRoute);
app.use("/api/user", patternInsightRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/problems", problemRoute);
app.use("/api/analytics", analyticsRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});