// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron"; // if you use cron jobs

// -------------------- ROUTE IMPORTS -------------------- //
// Region
import countryRoutes from "./routes/Region/countryRoutes.js";
import stateRoutes from "./routes/Region/stateRoutes.js";
import districtRoutes from "./routes/Region/districtRoutes.js";
import cityRoutes from "./routes/Region/cityRoutes.js";
import areaRoutes from "./routes/Region/areaRoutes.js";

// Master
import masterRoutes from "./routes/Master/classRoutes.js";
import subjectRoutes from "./routes/Master/subjectRoutes.js";
import affiliatedRoutes from "./routes/Master/affiliatedRoutes.js";
import centerRoutes from "./routes/Master/centerRoutes.js";
import assignCenterRoutes from "./routes/Master/assignRoutes.js";
import feeRoute from "./routes/Master/feeRoute.js";

// Inventory
import inventoryRoutes from "./routes/inventory/inventoryRoutes.js";

// School
import SchoolFormRoutes from "./routes/School/SchoolFormRoutes.js";
import inchargeRoutes from "./routes/Incharge/inchargeRoutes.js";

// Student
import studentRoutes from "./routes/Student/studentRoutes.js";

// Exam
import omrRoutes from "./routes/Exam/omrRoutes.js";
import examRoutes from "./routes/Exam/examRoutes.js";
import ResultRoutes from "./models/Results/result.routes.js";
import omrReceiptRoutes from "./routes/Exam/omrReceiptRoutes.js";
import omrAssignRoutes from "./routes/Exam/omrAssignRoutes.js";

// Users & Roles
import userRoutes from "./routes/User/userRoutes.js";
import roleRoutes from "./routes/Role/roleRoutes.js";
import menuRoutes from "./routes/Menu/menuRoutes.js";
import role_menuRoutes from "./routes/configuration/role_menuRoutes.js";

// Attributes & Items
import attributeRoutes from "./routes/attribute/attributeRoutes.js";
import itemRoutes from "./routes/configuration/itemRoutes.js";
import subitem from "./routes/configuration/subitemRoutes.js";

// Questions, Sessions, Dashboard
import questionRoutes from "./routes/question/questionRoutes.js";
import sessionRoutes from "./routes/session/sessionRoutes.js";
import activityRoute from "./routes/dashboard/activityRoute.js";
import dashboardRoute from "./routes/dashboard/dashboardRoute.js";

// Consignment
import consignmentRoutes from "./routes/Consignment/consignmentRoutes.js";
import packingRoutes from "./routes/packing/packingRoutes.js";

// -------------------- APP CONFIG -------------------- //

import resultDocRoutes from "./models/ResultSendMail/resultDocument.routes.js";

dotenv.config();
const app = express();

//1. Allow very large JSON/form data
app.use(express.json({ limit: "1000mb", type: "application/json" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "1000mb",
    parameterLimit: 500000,
  }),
);

// 2. Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

//3. Static folder for file uploads
app.use("/profiles", express.static("profiles"));

app.use("/result", express.static("result"));

// -------------------- ROUTES -------------------- //

// Region
app.use("/api/countries", countryRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/areas", areaRoutes);

// Master
app.use("/api", masterRoutes);
app.use("/api", subjectRoutes);
app.use("/api", affiliatedRoutes);
app.use("/api/center", centerRoutes);
app.use("/api/assign-center", assignCenterRoutes);
app.use("/api/fee", feeRoute);

// Inventory
app.use("/api/v1", inventoryRoutes);

// School
app.use("/api/get", SchoolFormRoutes);
app.use("/api/get", inchargeRoutes);

// Students
app.use("/api/get", studentRoutes);

// Consignment
app.use("/api/c1", consignmentRoutes);
app.use("/api", packingRoutes);

// Role & Users
app.use("/api/r1", roleRoutes);
app.use("/api/u1", userRoutes);

// Exam
app.use("/api/omr", omrRoutes);
app.use("/api/e1", examRoutes);
app.use("/api", ResultRoutes);
app.use("/api/omr-receipt", omrReceiptRoutes);
app.use("/api/omr-assign", omrAssignRoutes);

// Menu
app.use("/api/m1", menuRoutes);
app.use("/api/permission", role_menuRoutes);

// Attributes & Items
app.use("/api/a1", attributeRoutes);
app.use("/api/t1", itemRoutes);
app.use("/api/s1", subitem);

// Questions, Sessions, Dashboard
app.use("/api/q1", questionRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/ac1", activityRoute);
app.use("/api/dashboard", dashboardRoute);

app.use("/api/results", resultDocRoutes);

// -------------------- SERVER -------------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
