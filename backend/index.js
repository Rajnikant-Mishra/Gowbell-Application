// backend/server.js
import express from 'express'
import  dotenv from "dotenv";
import  bodyParser from "body-parser";
import cors from "cors";


//routes import
import  authRoutes from "./routes/Admin/authRoutes.js";
import countryRoutes from './routes/Region/countryRoutes.js';
import stateRoutes from './routes/Region/stateRoutes.js';
import districtRoutes from './routes/Region/districtRoutes.js';
import cityRoutes from './routes/Region/cityRoutes.js';
import areaRoutes from './routes/Region/areaRoutes.js';

//master routes
import masterRoutes from './routes/Master/masterRoutes.js';
import subjectRoutes from './routes/Master/subjectRoutes.js';
import affiliatedRoutes from './routes/Master/affiliatedRoutes.js';

//inventory
import bookRoutes from './routes/Inventory/bookRoutes.js';
import questionRoutes from './routes/Inventory/questionRoutes.js';
import omrRoutes from './routes/Inventory/omrRoutes.js';

//school
import SchoolFormRoutes from './routes/School/SchoolFormRoutes.js';
import inchargeRoutes from './routes/Incharge/inchargeRoutes.js';

//student\
import studentRoutes from './routes/Student/studentRoutes.js';

//consignment
import coomrRoutes from './routes/Consignment/co-omrRoutes.js';
import questionCoRoutes from './routes/Consignment/questionCoRoutes.js';



const app = express();



dotenv.config();
// Your other middlewares and routes
app.use(express.json());
app.use(bodyParser.json());



// Use CORS middleware with specific origin
app.use(cors({
    origin: "http://localhost:5173", // Allow your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow cookies or other credentials if necessary
  }));
  



//routes api's fro region
app.use("/api/auth", authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/areas', areaRoutes);

// Use the master routes
app.use('/api', masterRoutes);
app.use('/api', subjectRoutes);
app.use('/api', affiliatedRoutes);

//use the inventory routes
app.use('/api',bookRoutes );
app.use('/api/get', questionRoutes);
app.use('/api/get',omrRoutes);

//use the school routes
app.use('/api/get',SchoolFormRoutes);
app.use('/api/get',inchargeRoutes );

//student
app.use('/api/get', studentRoutes );

//consignment
app.use('/api/co',coomrRoutes);
app.use('/api/co',questionCoRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
