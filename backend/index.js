// // backend/server.js
// import express from 'express'
// import  dotenv from "dotenv";
// import  bodyParser from "body-parser";
// import cors from "cors";


// //routes import
// import countryRoutes from './routes/Region/countryRoutes.js';
// import stateRoutes from './routes/Region/stateRoutes.js';
// import districtRoutes from './routes/Region/districtRoutes.js';
// import cityRoutes from './routes/Region/cityRoutes.js';
// import areaRoutes from './routes/Region/areaRoutes.js';

// //master routes
// import masterRoutes from './routes/Master/classRoutes.js';
// import subjectRoutes from './routes/Master/subjectRoutes.js';
// import affiliatedRoutes from './routes/Master/affiliatedRoutes.js';

// //inventory
// import inventoryRoutes from './routes/inventory/inventoryRoutes.js';

// //school
// import SchoolFormRoutes from './routes/School/SchoolFormRoutes.js';
// import inchargeRoutes from './routes/Incharge/inchargeRoutes.js';

// //student\
// import studentRoutes from './routes/Student/studentRoutes.js';


// //exam
// import omrRoutes from './routes/Exam/omrRoutes.js';
// import examRoutes from './routes/Exam/examRoutes.js';
// import ResultRoutes from './routes/Exam/ResultRoutes.js';

// import omrReceiptRoutes from './routes/Exam/omrReceiptRoutes.js';

// //users
// import userRoutes from "./routes/User/userRoutes.js";

// //consignment
// import consignmentRoutes  from './routes/Consignment/consignmentRoutes.js';
// import packingRoutes from './routes/packing/packingRoutes.js';

// //role
// import roleRoutes from './routes/Role/roleRoutes.js';


// //menu
// import menuRoutes from "./routes/Menu/menuRoutes.js";
// import role_menuRoutes from "./routes/configuration/role_menuRoutes.js";

// //attribute
// import attributeRoutes from "./routes/attribute/attributeRoutes.js";

// //items
// import itemRoutes from "./routes/configuration/itemRoutes.js";
// import subitem from "./routes/configuration/subitemRoutes.js";

// const app = express();


// dotenv.config();
// // Your other middlewares and routes
// app.use(express.json());
// app.use(bodyParser.json());



// // Use CORS middleware with specific origin http://localhost:5175/ 
// app.use(cors({
//     origin: "http://localhost:5173", // Allow your frontend's origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
//     credentials: true, // Allow cookies or other credentials if necessary
//   }));
  


// //routes api's fro region
// app.use('/api/countries', countryRoutes);
// app.use('/api/states', stateRoutes);
// app.use('/api/districts', districtRoutes);
// app.use('/api/cities', cityRoutes);
// app.use('/api/areas', areaRoutes);

// // Use the master routes
// app.use('/api', masterRoutes);
// app.use('/api', subjectRoutes);
// app.use('/api', affiliatedRoutes);

// //use the inventory routes
// app.use('/api/v1', inventoryRoutes);


// //use the school routes
// app.use('/api/get',SchoolFormRoutes);
// app.use('/api/get',inchargeRoutes );

// //student
// app.use('/api/get', studentRoutes );

// //consignment
// app.use('/api/c1',consignmentRoutes);
// app.use('/api',packingRoutes);


// //role
// app.use('/api/r1',roleRoutes);

// //user
// app.use('/api/u1', userRoutes);

// //exam
// app.use('/api/omr',omrRoutes);
// app.use('/api/e1',examRoutes);
// app.use('/api',ResultRoutes);
// app.use('/api',omrReceiptRoutes);


// //menu
// app.use('/api/m1',menuRoutes);
// app.use('/api/permission',role_menuRoutes)

// //attribute
// app.use('/api/a1',attributeRoutes);

// //items
// app.use('/api/t1', itemRoutes );
// app.use('/api/s1',subitem );


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// backend/server.js
import express from 'express';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cron from "node-cron"; // <-- Cron added

// Routes import
import countryRoutes from './routes/Region/countryRoutes.js';
import stateRoutes from './routes/Region/stateRoutes.js';
import districtRoutes from './routes/Region/districtRoutes.js';
import cityRoutes from './routes/Region/cityRoutes.js';
import areaRoutes from './routes/Region/areaRoutes.js';

// Master routes
import masterRoutes from './routes/Master/classRoutes.js';
import subjectRoutes from './routes/Master/subjectRoutes.js';
import affiliatedRoutes from './routes/Master/affiliatedRoutes.js';

// Inventory
import inventoryRoutes from './routes/inventory/inventoryRoutes.js';

// School
import SchoolFormRoutes from './routes/School/SchoolFormRoutes.js';
import inchargeRoutes from './routes/Incharge/inchargeRoutes.js';

// Student
import studentRoutes from './routes/Student/studentRoutes.js';

// Exam
import omrRoutes from './routes/Exam/omrRoutes.js';
import examRoutes from './routes/Exam/examRoutes.js';
import ResultRoutes from './routes/Exam/ResultRoutes.js';
import omrReceiptRoutes from './routes/Exam/omrReceiptRoutes.js';


// Users
import userRoutes from "./routes/User/userRoutes.js";

// Consignment
import consignmentRoutes  from './routes/Consignment/consignmentRoutes.js';
import packingRoutes from './routes/packing/packingRoutes.js';

// Role
import roleRoutes from './routes/Role/roleRoutes.js';

// Menu
import menuRoutes from "./routes/Menu/menuRoutes.js";
import role_menuRoutes from "./routes/configuration/role_menuRoutes.js";

// Attribute
import attributeRoutes from "./routes/attribute/attributeRoutes.js";

// Items
import itemRoutes from "./routes/configuration/itemRoutes.js";
import subitem from "./routes/configuration/subitemRoutes.js";

//question
import questionRoutes from "./routes/question/questionRoutes.js";

//session
import sessionRoutes from "./routes/session/sessionRoutes.js";

const app = express();

dotenv.config();

// Middleware
// app.use(express.json());
// app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Routes for Region
app.use('/api/countries', countryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/areas', areaRoutes);

// Master Routes
app.use('/api', masterRoutes);
app.use('/api', subjectRoutes);
app.use('/api', affiliatedRoutes);

// Inventory Routes
app.use('/api/v1', inventoryRoutes);

// School Routes
app.use('/api/get', SchoolFormRoutes);
app.use('/api/get', inchargeRoutes);

// Student Routes
app.use('/api/get', studentRoutes);

// Consignment
app.use('/api/c1', consignmentRoutes);
app.use('/api', packingRoutes);

// Role
app.use('/api/r1', roleRoutes);

// Users
app.use('/api/u1', userRoutes);

// Exam
app.use('/api/omr', omrRoutes);
app.use('/api/e1', examRoutes);
app.use('/api', ResultRoutes);
app.use('/api', omrReceiptRoutes);


// Menu
app.use('/api/m1', menuRoutes);
app.use('/api/permission', role_menuRoutes);

// Attribute
app.use('/api/a1', attributeRoutes);

// Items
app.use('/api/t1', itemRoutes);
app.use('/api/s1', subitem);

//question
app.use('/api/q1', questionRoutes);

//session
app.use('/api/session', sessionRoutes);

// ✅ Cron Job: Runs every day at 1 AM
// cron.schedule('* * * * * *', () => {
//   console.log('🕐 Cron job running ', new Date());

//   // You can add any logic here, for example:
//   // - Clear expired sessions
//   // - Archive old records
//   // - Send email reports
//   // - Auto-generate exam results
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
