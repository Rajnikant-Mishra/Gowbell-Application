// // backend/config/db.js
// import  mysql from "mysql2";
// import  dotenv from "dotenv";

// dotenv.config();

// export const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,  
//   dateStrings: true // <-- add this
// });


// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL Database!");
// });



import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true // keeps DATETIME/TIMESTAMP as string
});

// Optional test
try {
  const conn = await db.getConnection();
  console.log("✅ Connected to MySQL Database!");
  conn.release();
} catch (err) {
  console.error("❌ Database connection failed:", err);
}

