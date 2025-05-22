// import React, { useState, useRef, useMemo, useEffect } from "react";
// import Chart from "react-apexcharts";
// import Mainlayout from "../Layouts/Mainlayout";
// import styles from "./Dashboard.module.css";
// import cardimg1 from "../../../public/Path 195.svg";
// import cardimg2 from "../../../public/Path 196.svg";
// import cardimg3 from "../../../public/Path 197.svg";
// import cardimg4 from "../../../public/Path 198.svg";
// import {
//   UilCalendarAlt,
//   UilUser,
//   UilAngleDown,
//   UilAngleLeft,
//   UilAngleRight,
// } from "@iconscout/react-unicons";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   ClientSideRowModelModule,
//   ModuleRegistry,
//   NumberFilterModule,
//   TextFilterModule,
// } from "ag-grid-community";

// // Register AG Grid modules
// ModuleRegistry.registerModules([
//   TextFilterModule,
//   ClientSideRowModelModule,
//   NumberFilterModule,
// ]);

// // Sample data for schools
// const getSchoolData = () => [
//   {
//     id: "S001",
//     schoolName: "Sunrise Academy",
//     country: "USA",
//     state: "California",
//     district: "Los Angeles",
//     city: "Los Angeles",
//     board: "CBSE",
//     totalParticipants: 250,
//     mil: 200,
//     math: 220,
//     english: 230,
//     gk: 190,
//     science: 210,
//   },
//   {
//     id: "S002",
//     schoolName: "Green Valley High",
//     country: "USA",
//     state: "New York",
//     district: "Manhattan",
//     city: "New York City",
//     board: "IB",
//     totalParticipants: 300,
//     mil: 250,
//     math: 280,
//     english: 270,
//     gk: 240,
//     science: 260,
//   },
//   {
//     id: "S003",
//     schoolName: "Blue Ridge School",
//     country: "India",
//     state: "Maharashtra",
//     district: "Pune",
//     city: "Pune",
//     board: "ICSE",
//     totalParticipants: 180,
//     mil: 150,
//     math: 170,
//     english: 160,
//     gk: 140,
//     science: 165,
//   },
//   {
//     id: "S004",
//     schoolName: "Oakwood International",
//     country: "UK",
//     state: "England",
//     district: "London",
//     city: "London",
//     board: "IGCSE",
//     totalParticipants: 220,
//     mil: 180,
//     math: 200,
//     english: 210,
//     gk: 170,
//     science: 190,
//   },
//   {
//     id: "S005",
//     schoolName: "Maple Leaf School",
//     country: "Canada",
//     state: "Ontario",
//     district: "Toronto",
//     city: "Toronto",
//     board: "CBSE",
//     totalParticipants: 270,
//     mil: 220,
//     math: 250,
//     english: 240,
//     gk: 210,
//     science: 230,
//   },
//   {
//     id: "S006",
//     schoolName: "Riverdale High",
//     country: "Australia",
//     state: "Victoria",
//     district: "Melbourne",
//     city: "Melbourne",
//     board: "IB",
//     totalParticipants: 190,
//     mil: 160,
//     math: 180,
//     english: 170,
//     gk: 150,
//     science: 175,
//   },
//   {
//     id: "S007",
//     schoolName: "Starlight Academy",
//     country: "India",
//     state: "Karnataka",
//     district: "Bangalore",
//     city: "Bangalore",
//     board: "CBSE",
//     totalParticipants: 240,
//     mil: 190,
//     math: 210,
//     english: 220,
//     gk: 180,
//     science: 200,
//   },
//   {
//     id: "S008",
//     schoolName: "Horizon School",
//     country: "USA",
//     state: "Texas",
//     district: "Houston",
//     city: "Houston",
//     board: "IB",
//     totalParticipants: 310,
//     mil: 260,
//     math: 290,
//     english: 280,
//     gk: 250,
//     science: 270,
//   },
//   {
//     id: "S009",
//     schoolName: "Evergreen High",
//     country: "India",
//     state: "Delhi",
//     district: "South Delhi",
//     city: "Delhi",
//     board: "ICSE",
//     totalParticipants: 200,
//     mil: 170,
//     math: 190,
//     english: 180,
//     gk: 160,
//     science: 185,
//   },
//   {
//     id: "S010",
//     schoolName: "Bright Future School",
//     country: "UK",
//     state: "England",
//     district: "Manchester",
//     city: "Manchester",
//     board: "IGCSE",
//     totalParticipants: 230,
//     mil: 190,
//     math: 210,
//     english: 200,
//     gk: 180,
//     science: 195,
//   },
//   {
//     id: "S011",
//     schoolName: "Golden Gate Academy",
//     country: "USA",
//     state: "California",
//     district: "San Francisco",
//     city: "San Francisco",
//     board: "CBSE",
//     totalParticipants: 280,
//     mil: 230,
//     math: 260,
//     english: 250,
//     gk: 220,
//     science: 240,
//   },
//   {
//     id: "S012",
//     schoolName: "Silver Oak School",
//     country: "India",
//     state: "Tamil Nadu",
//     district: "Chennai",
//     city: "Chennai",
//     board: "ICSE",
//     totalParticipants: 260,
//     mil: 210,
//     math: 240,
//     english: 230,
//     gk: 200,
//     science: 220,
//   },
//   {
//     id: "S001",
//     schoolName: "Sunrise Academy",
//     country: "USA",
//     state: "California",
//     district: "Los Angeles",
//     city: "Los Angeles",
//     board: "CBSE",
//     totalParticipants: 250,
//     mil: 200,
//     math: 220,
//     english: 230,
//     gk: 190,
//     science: 210,
//   },
//   {
//     id: "S002",
//     schoolName: "Green Valley High",
//     country: "USA",
//     state: "New York",
//     district: "Manhattan",
//     city: "New York City",
//     board: "IB",
//     totalParticipants: 300,
//     mil: 250,
//     math: 280,
//     english: 270,
//     gk: 240,
//     science: 260,
//   },
//   {
//     id: "S003",
//     schoolName: "Blue Ridge School",
//     country: "India",
//     state: "Maharashtra",
//     district: "Pune",
//     city: "Pune",
//     board: "ICSE",
//     totalParticipants: 180,
//     mil: 150,
//     math: 170,
//     english: 160,
//     gk: 140,
//     science: 165,
//   },
//   {
//     id: "S004",
//     schoolName: "Oakwood International",
//     country: "UK",
//     state: "England",
//     district: "London",
//     city: "London",
//     board: "IGCSE",
//     totalParticipants: 220,
//     mil: 180,
//     math: 200,
//     english: 210,
//     gk: 170,
//     science: 190,
//   },
//   {
//     id: "S005",
//     schoolName: "Maple Leaf School",
//     country: "Canada",
//     state: "Ontario",
//     district: "Toronto",
//     city: "Toronto",
//     board: "CBSE",
//     totalParticipants: 270,
//     mil: 220,
//     math: 250,
//     english: 240,
//     gk: 210,
//     science: 230,
//   },
//   {
//     id: "S006",
//     schoolName: "Riverdale High",
//     country: "Australia",
//     state: "Victoria",
//     district: "Melbourne",
//     city: "Melbourne",
//     board: "IB",
//     totalParticipants: 190,
//     mil: 160,
//     math: 180,
//     english: 170,
//     gk: 150,
//     science: 175,
//   },
//   {
//     id: "S007",
//     schoolName: "Starlight Academy",
//     country: "India",
//     state: "Karnataka",
//     district: "Bangalore",
//     city: "Bangalore",
//     board: "CBSE",
//     totalParticipants: 240,
//     mil: 190,
//     math: 210,
//     english: 220,
//     gk: 180,
//     science: 200,
//   },
//   {
//     id: "S008",
//     schoolName: "Horizon School",
//     country: "USA",
//     state: "Texas",
//     district: "Houston",
//     city: "Houston",
//     board: "IB",
//     totalParticipants: 310,
//     mil: 260,
//     math: 290,
//     english: 280,
//     gk: 250,
//     science: 270,
//   },
//   {
//     id: "S009",
//     schoolName: "Evergreen High",
//     country: "India",
//     state: "Delhi",
//     district: "South Delhi",
//     city: "Delhi",
//     board: "ICSE",
//     totalParticipants: 200,
//     mil: 170,
//     math: 190,
//     english: 180,
//     gk: 160,
//     science: 185,
//   },
//   {
//     id: "S010",
//     schoolName: "Bright Future School",
//     country: "UK",
//     state: "England",
//     district: "Manchester",
//     city: "Manchester",
//     board: "IGCSE",
//     totalParticipants: 230,
//     mil: 190,
//     math: 210,
//     english: 200,
//     gk: 180,
//     science: 195,
//   },
//   {
//     id: "S011",
//     schoolName: "Golden Gate Academy",
//     country: "USA",
//     state: "California",
//     district: "San Francisco",
//     city: "San Francisco",
//     board: "CBSE",
//     totalParticipants: 280,
//     mil: 230,
//     math: 260,
//     english: 250,
//     gk: 220,
//     science: 240,
//   },
//   {
//     id: "S012",
//     schoolName: "Silver Oak School",
//     country: "India",
//     state: "Tamil Nadu",
//     district: "Chennai",
//     city: "Chennai",
//     board: "ICSE",
//     totalParticipants: 260,
//     mil: 210,
//     math: 240,
//     english: 230,
//     gk: 200,
//     science: 220,
//   },
//   {
//     id: "S001",
//     schoolName: "Sunrise Academy",
//     country: "USA",
//     state: "California",
//     district: "Los Angeles",
//     city: "Los Angeles",
//     board: "CBSE",
//     totalParticipants: 250,
//     mil: 200,
//     math: 220,
//     english: 230,
//     gk: 190,
//     science: 210,
//   },
//   {
//     id: "S002",
//     schoolName: "Green Valley High",
//     country: "USA",
//     state: "New York",
//     district: "Manhattan",
//     city: "New York City",
//     board: "IB",
//     totalParticipants: 300,
//     mil: 250,
//     math: 280,
//     english: 270,
//     gk: 240,
//     science: 260,
//   },
//   {
//     id: "S003",
//     schoolName: "Blue Ridge School",
//     country: "India",
//     state: "Maharashtra",
//     district: "Pune",
//     city: "Pune",
//     board: "ICSE",
//     totalParticipants: 180,
//     mil: 150,
//     math: 170,
//     english: 160,
//     gk: 140,
//     science: 165,
//   },
//   {
//     id: "S004",
//     schoolName: "Oakwood International",
//     country: "UK",
//     state: "England",
//     district: "London",
//     city: "London",
//     board: "IGCSE",
//     totalParticipants: 220,
//     mil: 180,
//     math: 200,
//     english: 210,
//     gk: 170,
//     science: 190,
//   },
//   {
//     id: "S005",
//     schoolName: "Maple Leaf School",
//     country: "Canada",
//     state: "Ontario",
//     district: "Toronto",
//     city: "Toronto",
//     board: "CBSE",
//     totalParticipants: 270,
//     mil: 220,
//     math: 250,
//     english: 240,
//     gk: 210,
//     science: 230,
//   },
//   {
//     id: "S006",
//     schoolName: "Riverdale High",
//     country: "Australia",
//     state: "Victoria",
//     district: "Melbourne",
//     city: "Melbourne",
//     board: "IB",
//     totalParticipants: 190,
//     mil: 160,
//     math: 180,
//     english: 170,
//     gk: 150,
//     science: 175,
//   },
//   {
//     id: "S007",
//     schoolName: "Starlight Academy",
//     country: "India",
//     state: "Karnataka",
//     district: "Bangalore",
//     city: "Bangalore",
//     board: "CBSE",
//     totalParticipants: 240,
//     mil: 190,
//     math: 210,
//     english: 220,
//     gk: 180,
//     science: 200,
//   },
//   {
//     id: "S008",
//     schoolName: "Horizon School",
//     country: "USA",
//     state: "Texas",
//     district: "Houston",
//     city: "Houston",
//     board: "IB",
//     totalParticipants: 310,
//     mil: 260,
//     math: 290,
//     english: 280,
//     gk: 250,
//     science: 270,
//   },
//   {
//     id: "S009",
//     schoolName: "Evergreen High",
//     country: "India",
//     state: "Delhi",
//     district: "South Delhi",
//     city: "Delhi",
//     board: "ICSE",
//     totalParticipants: 200,
//     mil: 170,
//     math: 190,
//     english: 180,
//     gk: 160,
//     science: 185,
//   },
//   {
//     id: "S010",
//     schoolName: "Bright Future School",
//     country: "UK",
//     state: "England",
//     district: "Manchester",
//     city: "Manchester",
//     board: "IGCSE",
//     totalParticipants: 230,
//     mil: 190,
//     math: 210,
//     english: 200,
//     gk: 180,
//     science: 195,
//   },
//   {
//     id: "S011",
//     schoolName: "Golden Gate Academy",
//     country: "USA",
//     state: "California",
//     district: "San Francisco",
//     city: "San Francisco",
//     board: "CBSE",
//     totalParticipants: 280,
//     mil: 230,
//     math: 260,
//     english: 250,
//     gk: 220,
//     science: 240,
//   },
//   {
//     id: "S012",
//     schoolName: "Silver Oak School",
//     country: "India",
//     state: "Tamil Nadu",
//     district: "Chennai",
//     city: "Chennai",
//     board: "ICSE",
//     totalParticipants: 260,
//     mil: 210,
//     math: 240,
//     english: 230,
//     gk: 200,
//     science: 220,
//   },
//   {
//     id: "S001",
//     schoolName: "Sunrise Academy",
//     country: "USA",
//     state: "California",
//     district: "Los Angeles",
//     city: "Los Angeles",
//     board: "CBSE",
//     totalParticipants: 250,
//     mil: 200,
//     math: 220,
//     english: 230,
//     gk: 190,
//     science: 210,
//   },
//   {
//     id: "S002",
//     schoolName: "Green Valley High",
//     country: "USA",
//     state: "New York",
//     district: "Manhattan",
//     city: "New York City",
//     board: "IB",
//     totalParticipants: 300,
//     mil: 250,
//     math: 280,
//     english: 270,
//     gk: 240,
//     science: 260,
//   },
//   {
//     id: "S003",
//     schoolName: "Blue Ridge School",
//     country: "India",
//     state: "Maharashtra",
//     district: "Pune",
//     city: "Pune",
//     board: "ICSE",
//     totalParticipants: 180,
//     mil: 150,
//     math: 170,
//     english: 160,
//     gk: 140,
//     science: 165,
//   },
//   {
//     id: "S004",
//     schoolName: "Oakwood International",
//     country: "UK",
//     state: "England",
//     district: "London",
//     city: "London",
//     board: "IGCSE",
//     totalParticipants: 220,
//     mil: 180,
//     math: 200,
//     english: 210,
//     gk: 170,
//     science: 190,
//   },
//   {
//     id: "S005",
//     schoolName: "Maple Leaf School",
//     country: "Canada",
//     state: "Ontario",
//     district: "Toronto",
//     city: "Toronto",
//     board: "CBSE",
//     totalParticipants: 270,
//     mil: 220,
//     math: 250,
//     english: 240,
//     gk: 210,
//     science: 230,
//   },
//   {
//     id: "S006",
//     schoolName: "Riverdale High",
//     country: "Australia",
//     state: "Victoria",
//     district: "Melbourne",
//     city: "Melbourne",
//     board: "IB",
//     totalParticipants: 190,
//     mil: 160,
//     math: 180,
//     english: 170,
//     gk: 150,
//     science: 175,
//   },
//   {
//     id: "S007",
//     schoolName: "Starlight Academy",
//     country: "India",
//     state: "Karnataka",
//     district: "Bangalore",
//     city: "Bangalore",
//     board: "CBSE",
//     totalParticipants: 240,
//     mil: 190,
//     math: 210,
//     english: 220,
//     gk: 180,
//     science: 200,
//   },
//   {
//     id: "S008",
//     schoolName: "Horizon School",
//     country: "USA",
//     state: "Texas",
//     district: "Houston",
//     city: "Houston",
//     board: "IB",
//     totalParticipants: 310,
//     mil: 260,
//     math: 290,
//     english: 280,
//     gk: 250,
//     science: 270,
//   },
//   {
//     id: "S009",
//     schoolName: "Evergreen High",
//     country: "India",
//     state: "Delhi",
//     district: "South Delhi",
//     city: "Delhi",
//     board: "ICSE",
//     totalParticipants: 200,
//     mil: 170,
//     math: 190,
//     english: 180,
//     gk: 160,
//     science: 185,
//   },
//   {
//     id: "S010",
//     schoolName: "Bright Future School",
//     country: "UK",
//     state: "England",
//     district: "Manchester",
//     city: "Manchester",
//     board: "IGCSE",
//     totalParticipants: 230,
//     mil: 190,
//     math: 210,
//     english: 200,
//     gk: 180,
//     science: 195,
//   },
//   {
//     id: "S011",
//     schoolName: "Golden Gate Academy",
//     country: "USA",
//     state: "California",
//     district: "San Francisco",
//     city: "San Francisco",
//     board: "CBSE",
//     totalParticipants: 280,
//     mil: 230,
//     math: 260,
//     english: 250,
//     gk: 220,
//     science: 240,
//   },
//   {
//     id: "S012",
//     schoolName: "Silver Oak School",
//     country: "India",
//     state: "Tamil Nadu",
//     district: "Chennai",
//     city: "Chennai",
//     board: "ICSE",
//     totalParticipants: 260,
//     mil: 210,
//     math: 240,
//     english: 230,
//     gk: 200,
//     science: 220,
//   },
// ];

// // Sample data for student results with placeholder images
// const getStudentData = () => [
//   {
//     rollNumber: "R001",
//     name: "Aarav Sharma",
//     schoolName: "Sunrise Academy",
//     mil: 85,
//     math: 92,
//     english: 88,
//     gk: 80,
//     science: 90,
//   },
//   {
//     rollNumber: "R002",
//     name: "Emma Wilson",
//     schoolName: "Green Valley High",
//     mil: 90,
//     math: 95,
//     english: 93,
//     gk: 85,
//     science: 94,
//   },
//   {
//     rollNumber: "R003",
//     name: "Vivaan Patel",
//     schoolName: "Blue Ridge School",
//     mil: 78,
//     math: 82,
//     english: 80,
//     gk: 75,
//     science: 81,
//   },
//   {
//     rollNumber: "R004",
//     name: "Sophie Brown",
//     schoolName: "Oakwood International",
//     mil: 88,
//     math: 90,
//     english: 87,
//     gk: 82,
//     science: 89,
//   },
//   {
//     rollNumber: "R005",
//     name: "Liam Johnson",
//     schoolName: "Maple Leaf School",
//     mil: 92,
//     math: 94,
//     english: 91,
//     gk: 88,
//     science: 93,
//   },
//   {
//     rollNumber: "R006",
//     name: "Isabella Davis",
//     schoolName: "Riverdale High",
//     mil: 80,
//     math: 85,
//     english: 83,
//     gk: 78,
//     science: 84,
//     image: "https://via.placeholder.com/150?text=Isabella",
//   },
//   {
//     rollNumber: "R007",
//     name: "Arjun Reddy",
//     schoolName: "Starlight Academy",
//     mil: 87,
//     math: 89,
//     english: 86,
//     gk: 81,
//     science: 88,
//     image: "https://via.placeholder.com/150?text=Arjun",
//   },
//   {
//     rollNumber: "R008",
//     name: "Noah Martinez",
//     schoolName: "Horizon School",
//     mil: 95,
//     math: 97,
//     english: 94,
//     gk: 90,
//     science: 96,
//     image: "https://via.placeholder.com/150?text=Noah",
//   },
//   {
//     rollNumber: "R009",
//     name: "Ananya Gupta",
//     schoolName: "Evergreen High",
//     mil: 82,
//     math: 86,
//     english: 84,
//     gk: 79,
//     science: 85,
//     image: "https://via.placeholder.com/150?text=Ananya",
//   },
//   {
//     rollNumber: "R010",
//     name: "Oliver Taylor",
//     schoolName: "Bright Future School",
//     mil: 89,
//     math: 91,
//     english: 88,
//     gk: 83,
//     science: 90,
//     image: "https://via.placeholder.com/150?text=Oliver",
//   },
//   {
//     rollNumber: "R011",
//     name: "Mia Anderson",
//     schoolName: "Golden Gate Academy",
//     mil: 93,
//     math: 96,
//     english: 92,
//     gk: 87,
//     science: 94,
//     image: "https://via.placeholder.com/150?text=Mia",
//   },
//   {
//     rollNumber: "R012",
//     name: "Aditya Menon",
//     schoolName: "Silver Oak School",
//     mil: 86,
//     math: 88,
//     english: 85,
//     gk: 80,
//     science: 87,
//     image: "https://via.placeholder.com/150?text=Aditya",
//   },
//   {
//     rollNumber: "R001",
//     name: "Aarav Sharma",
//     schoolName: "Sunrise Academy",
//     mil: 85,
//     math: 92,
//     english: 88,
//     gk: 80,
//     science: 90,
//     image: "https://via.placeholder.com/150?text=Aarav",
//   },
//   {
//     rollNumber: "R002",
//     name: "Emma Wilson",
//     schoolName: "Green Valley High",
//     mil: 90,
//     math: 95,
//     english: 93,
//     gk: 85,
//     science: 94,
//     image: "https://via.placeholder.com/150?text=Emma",
//   },
//   {
//     rollNumber: "R003",
//     name: "Vivaan Patel",
//     schoolName: "Blue Ridge School",
//     mil: 78,
//     math: 82,
//     english: 80,
//     gk: 75,
//     science: 81,
//     image: "https://via.placeholder.com/150?text=Vivaan",
//   },
//   {
//     rollNumber: "R004",
//     name: "Sophie Brown",
//     schoolName: "Oakwood International",
//     mil: 88,
//     math: 90,
//     english: 87,
//     gk: 82,
//     science: 89,
//     image: "https://via.placeholder.com/150?text=Sophie",
//   },
//   {
//     rollNumber: "R005",
//     name: "Liam Johnson",
//     schoolName: "Maple Leaf School",
//     mil: 92,
//     math: 94,
//     english: 91,
//     gk: 88,
//     science: 93,
//     image: "https://via.placeholder.com/150?text=Liam",
//   },
//   {
//     rollNumber: "R006",
//     name: "Isabella Davis",
//     schoolName: "Riverdale High",
//     mil: 80,
//     math: 85,
//     english: 83,
//     gk: 78,
//     science: 84,
//     image: "https://via.placeholder.com/150?text=Isabella",
//   },
//   {
//     rollNumber: "R007",
//     name: "Arjun Reddy",
//     schoolName: "Starlight Academy",
//     mil: 87,
//     math: 89,
//     english: 86,
//     gk: 81,
//     science: 88,
//     image: "https://via.placeholder.com/150?text=Arjun",
//   },
//   {
//     rollNumber: "R008",
//     name: "Noah Martinez",
//     schoolName: "Horizon School",
//     mil: 95,
//     math: 97,
//     english: 94,
//     gk: 90,
//     science: 96,
//     image: "https://via.placeholder.com/150?text=Noah",
//   },
//   {
//     rollNumber: "R009",
//     name: "Ananya Gupta",
//     schoolName: "Evergreen High",
//     mil: 82,
//     math: 86,
//     english: 84,
//     gk: 79,
//     science: 85,
//     image: "https://via.placeholder.com/150?text=Ananya",
//   },
//   {
//     rollNumber: "R010",
//     name: "Oliver Taylor",
//     schoolName: "Bright Future School",
//     mil: 89,
//     math: 91,
//     english: 88,
//     gk: 83,
//     science: 90,
//     image: "https://via.placeholder.com/150?text=Oliver",
//   },
//   {
//     rollNumber: "R011",
//     name: "Mia Anderson",
//     schoolName: "Golden Gate Academy",
//     mil: 93,
//     math: 96,
//     english: 92,
//     gk: 87,
//     science: 94,
//     image: "https://via.placeholder.com/150?text=Mia",
//   },
//   {
//     rollNumber: "R012",
//     name: "Aditya Menon",
//     schoolName: "Silver Oak School",
//     mil: 86,
//     math: 88,
//     english: 85,
//     gk: 80,
//     science: 87,
//     image: "https://via.placeholder.com/150?text=Aditya",
//   },
// ];

// const Dashboard = () => {
//   const scrollWrapperRef = useRef(null);
//   const notificationRefs = useRef([]);
//   const gridRef = useRef(null);

//   const [activeFilter, setActiveFilter] = useState("year");
//   const [schoolData] = useState(getSchoolData());
//   const [studentData] = useState(getStudentData());
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedSubject, setSelectedSubject] = useState("math");

//   // Get top 3 students for the selected subject
//   const topStudents = useMemo(() => {
//     return [...studentData]
//       .sort((a, b) => b[selectedSubject] - a[selectedSubject])
//       .slice(0, 3);
//     }, [studentData, selectedSubject]);
  
//     // Auto-slide effect
//     useEffect(() => {
//       const interval = setInterval(() => {
//         setSliderIndex((prev) => (prev + 1) % topStudents.length);
//       }, 5000); // Change slide every 5 seconds
//       return () => clearInterval(interval);
//     }, [topStudents]);
  
//     // Chart data and options
//     const chartData = {
//       all: [
//         {
//           name: "2020",
//           data: [100, 200, 150, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
//         },
//         {
//           name: "2021",
//           data: [200, 300, 250, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
//         },
//         {
//           name: "2022",
//           data: [300, 400, 350, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
//         },
//         {
//           name: "2023",
//           data: [400, 500, 450, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
//         },
//       ],
//       year: [
//         {
//           name: "2024",
//           data: [250, 300, 200, 400, 300, 350, 480, 550, 450, 400, 300, 200],
//         },
//       ],
//       week: [{ name: "Week", data: [50, 70, 90, 110, 130, 150, 170] }],
//       today: [{ name: "Today", data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }],
//     };
  
//     const handleFilterChange = (filter) => {
//       setActiveFilter(filter);
//     };
  
//     const chartOptions = {
//       chart: { id: "student-participation", toolbar: { show: false } },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           borderRadius: 4,
//           borderRadiusApplication: "end",
//           columnWidth: "25%",
//         },
//       },
//       stroke: { show: false },
//       dataLabels: { enabled: false },
//       xaxis: {
//         categories:
//           activeFilter === "today"
//             ? [
//                 "6 AM",
//                 "8 AM",
//                 "10 AM",
//                 "12 PM",
//                 "2 PM",
//                 "4 PM",
//                 "6 PM",
//                 "8 PM",
//                 "10 PM",
//                 "12 AM",
//               ]
//             : activeFilter === "week"
//             ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
//             : [
//                 "Jan",
//                 "Feb",
//                 "Mar",
//                 "Apr",
//                 "May",
//                 "Jun",
//                 "Jul",
//                 "Aug",
//                 "Sep",
//                 "Oct",
//                 "Nov",
//                 "Dec",
//               ],
//       },
//       fill: {
//         type: "gradient",
//         gradient: {
//           type: "vertical",
//           shadeIntensity: 1,
//           gradientToColors: ["#508FF4"],
//           stops: [0, 100],
//           colorStops: [
//             { offset: 0, color: "#83C9FC", opacity: 1 },
//             { offset: 70, color: "#508FF4", opacity: 1 },
//           ],
//         },
//       },
//       grid: { borderColor: "#F1F1F1" },
//       yaxis: {
//         labels: {
//           formatter: function (val) {
//             return "$ " + val;
//           },
//         },
//       },
//       colors:
//         activeFilter === "all"
//           ? ["#FF5733", "#33B5E5", "#FFBD33", "#7D33FF"]
//           : ["#508FF4"],
//     };
  
//     const chartSeries = chartData[activeFilter];
  
//     const notifications = [
//       {
//         title: "Result uploaded for Science Quiz",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "New school added: The Sunsign High",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Exam Created: Math Olympiad",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Certificates Generated for History",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Certificates Generated for History",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Certificates Generated for History",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Result uploaded for Science Quiz",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "New school added: The Sunsign High",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Exam Created: Math Olympiad",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Certificates Generated for History",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Certificates Generated for History",
//         date: "10-09-2024",
//         author: "By Admin",
//       },
//       {
//         title: "Certificates Generated for History",
//         date: "10-09-2024",
//         author: "By Asarita",
//       },
//     ];
  
//     const handleNextNotification = () => {
//       const nextIndex = (currentIndex + 1) % notifications.length;
//       setCurrentIndex(nextIndex);
//       if (notificationRefs.current[nextIndex]) {
//         notificationRefs.current[nextIndex].scrollIntoView({
//           behavior: "smooth",
//           block: "nearest",
//         });
//       }
//     };
  
//     // AG Grid column definitions for school data
//     const schoolColumnDefs = useMemo(
//       () => [
//         { headerName: "ID", field: "id", width: 100 },
//         { headerName: "School Name", field: "schoolName", width: 200 },
//         { headerName: "Country", field: "country", width: 120 },
//         { headerName: "State", field: "state", width: 120 },
//         { headerName: "District", field: "district", width: 120 },
//         { headerName: "City", field: "city", width: 120 },
//         { headerName: "Board", field: "board", width: 100 },
//         {
//           headerName: "Total Participants",
//           field: "totalParticipants",
//           width: 150,
//           filter: "agNumberColumnFilter",
//         },
//         {
//           headerName: "MIL",
//           field: "mil",
//           width: 100,
//           filter: "agNumberColumnFilter",
//         },
//         {
//           headerName: "Math",
//           field: "math",
//           width: 100,
//           filter: "agNumberColumnFilter",
//         },
//         {
//           headerName: "English",
//           field: "english",
//           width: 100,
//           filter: "agNumberColumnFilter",
//         },
//         {
//           headerName: "GK",
//           field: "gk",
//           width: 100,
//           filter: "agNumberColumnFilter",
//         },
//         {
//           headerName: "Science",
//           field: "science",
//           width: 100,
//           filter: "agNumberColumnFilter",
//         },
//       ],
//       []
//     );
  
//     // Default column properties
//     const defaultColDef = useMemo(
//       () => ({
//         filter: true,
//         sortable: true,
//         resizable: true,
//         minWidth: 100,
//       }),
//       []
//     );
  
//     const popupParent = useMemo(() => document.body, []);
  
//     const inactiveSchools = [
//       {
//         name: "Sunrise Academy",
//         address: "123 Elm Street, Springfield, IL",
//         principal: "Dr. John Smith",
//         vicePrincipal: "Ms. Jane Doe",
//       },
//       {
//         name: "Moonlight High",
//         address: "456 Oak Avenue, Rivertown, CA",
//         principal: "Prof. Emily Brown",
//         vicePrincipal: "Mr. Michael Lee",
//       },
//     ];
  
//     const bestStudents = [
//       {
//         name: "Alice Johnson",
//         schoolName: "Starlight School",
//         rollNumber: "ST123",
//         class: "10A",
//         score: 95,
//       },
//       {
//         name: "Bob Wilson",
//         schoolName: "Bright Future Academy",
//         rollNumber: "BF456",
//         class: "11B",
//         score: 88,
//       },
//       {
//         name: "Clara Davis",
//         schoolName: "Sunrise",
//         score: 92,
//       },
//     ];
  
//     const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
//     const [isStudentTransitioning, setIsStudentTransitioning] = useState(false);
//     const studentAutoSlideRef = useRef(null);
  
//     const handleNextStudent = () => {
//       if (isStudentTransitioning || bestStudents.length <= 1) return;
//       setIsStudentTransitioning(true);
//       setCurrentStudentIndex((prev) => (prev + 1) % bestStudents.length);
//     };
  
//     const handlePrevStudent = () => {
//       if (isStudentTransitioning || bestStudents.length <= 1) return;
//       setIsStudentTransitioning(true);
//       setCurrentStudentIndex((prev) =>
//         prev === 0 ? bestStudents.length - 1 : prev - 1
//       );
//     };
  
//     const handleStudentTransitionEnd = () => {
//       setIsStudentTransitioning(false);
//     };
  
//     useEffect(() => {
//       if (bestStudents.length <= 1) return;
  
//       studentAutoSlideRef.current = setInterval(() => {
//         handleNextStudent();
//       }, 5000);
  
//       return () => clearInterval(studentAutoSlideRef.current);
//     }, [bestStudents.length]);
  
//     const handleStudentMouseEnter = () => {
//       clearInterval(studentAutoSlideRef.current);
//     };
  
//     const handleStudentMouseLeave = () => {
//       if (bestStudents.length <= 1) return;
//       studentAutoSlideRef.current = setInterval(() => {
//         handleNextStudent();
//       }, 5000);
//     };
  
//     const [currentSchoolIndex, setCurrentSchoolIndex] = useState(0);
//     const [isSchoolTransitioning, setIsSchoolTransitioning] = useState(false);
//     const schoolAutoSlideRef = useRef(null);
  
//     const handleNextSchool = () => {
//       if (isSchoolTransitioning || inactiveSchools.length <= 1) return;
//       setIsSchoolTransitioning(true);
//       setCurrentSchoolIndex((prev) => (prev + 1) % inactiveSchools.length);
//     };
  
//     const handlePrevSchool = () => {
//       if (isSchoolTransitioning || inactiveSchools.length <= 1) return;
//       setIsSchoolTransitioning(true);
//       setCurrentSchoolIndex((prev) =>
//         prev === 0 ? inactiveSchools.length - 1 : prev - 1
//       );
//     };
  
//     const handleSchoolTransitionEnd = () => {
//       setIsSchoolTransitioning(false);
//     };
  
//     useEffect(() => {
//       if (inactiveSchools.length <= 1) return;
  
//       schoolAutoSlideRef.current = setInterval(() => {
//         handleNextSchool();
//       }, 5000);
  
//       return () => clearInterval(schoolAutoSlideRef.current);
//     }, [inactiveSchools.length]);
  
//     const handleSchoolMouseEnter = () => {
//       clearInterval(schoolAutoSlideRef.current);
//     };
  
//     const handleSchoolMouseLeave = () => {
//       if (inactiveSchools.length <= 1) return;
//       schoolAutoSlideRef.current = setInterval(() => {
//         handleNextSchool();
//       }, 5000);
//     };
  
//     const inventoryChartData = {
//       series: [500, 300, 200, 100],
//       labels: ["Books", "Stationery", "Equipment", "Others"],
//     };
  
//     const inventoryChartOptions = {
//       chart: { type: "donut", toolbar: { show: false } },
//       labels: ["Books", "Stationery", "Equipment", "Others"],
//       colors: ["#508FF4", "#FF5733", "#33B5E5", "#FFBD33"],
//       dataLabels: {
//         enabled: true,
//         formatter: function (val, opts) {
//           return inventoryChartData.series[opts.seriesIndex];
//         },
//       },
//       legend: { position: "bottom", fontSize: "12px" },
//       plotOptions: { pie: { donut: { size: "65%" } } },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             chart: { width: 200 },
//             legend: { position: "bottom" },
//           },
//         },
//       ],
//     };
  
//     return (
//       <Mainlayout>
//         <div className={styles.dashboardContainer}>
//           <div className={styles.cardsContainer}>
//             <div className={`${styles.card} ${styles.totalExams}`}>
//               <h3>Total Schools</h3>
//               <hr />
//               <div className="d-flex gap-3">
//                 <img src={cardimg1} alt="cardimg1" />
//                 <h1 className="my-auto">403,813</h1>
//               </div>
//             </div>
//             <div className={`${styles.card} ${styles.totalStudents}`}>
//               <h3>Total Students</h3>
//               <hr />
//               <div className="d-flex">
//                 <img src={cardimg2} alt="cardimg2" />
//                 <h1 className="my-auto">4,846</h1>
//               </div>
//             </div>
//             <div className={`${styles.card} ${styles.averageScores}`}>
//               <h3>Average Scores</h3>
//               <hr />
//               <div className="d-flex gap-3">
//                 <img src={cardimg3} alt="cardimg3" />
//                 <h1 className="my-auto">84%</h1>
//               </div>
//             </div>
//             <div className={`${styles.card} ${styles.activeUsers}`}>
//               <h3>Active Users Today</h3>
//               <hr />
//               <div className="d-flex gap-3">
//                 <img src={cardimg4} alt="cardimg4" />
//                 <h1 className="my-auto">48.464131</h1>
//               </div>
//             </div>
//           </div>
  
//           <div className={styles.midSection}>
//             <div className={styles.chartContainer}>
//               <h3>Student Participation</h3>
//               <div className={styles.filterButtons}>
//                 <button
//                   className={activeFilter === "year" ? styles.active : ""}
//                   onClick={() => handleFilterChange("year")}
//                 >
//                   This year
//                 </button>
//                 <button
//                   className={activeFilter === "week" ? styles.active : ""}
//                   onClick={() => handleFilterChange("week")}
//                 >
//                   This week
//                 </button>
//                 <button
//                   className={activeFilter === "today" ? styles.active : ""}
//                   onClick={() => handleFilterChange("today")}
//                 >
//                   Today
//                 </button>
//                 <button
//                   className={activeFilter === "all" ? styles.active : ""}
//                   onClick={() => handleFilterChange("all")}
//                 >
//                   All time
//                 </button>
//               </div>
//               <Chart
//                 options={chartOptions}
//                 series={chartSeries}
//                 type="bar"
//                 height="180"
//               />
//             </div>
  
//             <div className={styles.midSectionSecondDiv}>
//               <div className={styles.prizeContainer}>
//                 <h3>Prize Distribution</h3>
//                 <div
//                   className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
//                 >
//                   <p className="my-auto">Gold</p>
//                   <span>30%</span>
//                 </div>
//                 <div className={styles.prizeItem}>
//                   <div className={styles.progress}>
//                     <div
//                       style={{ width: "30%", backgroundColor: "#F8C900" }}
//                     ></div>
//                   </div>
//                 </div>
//                 <div
//                   className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
//                 >
//                   <p className="my-auto">Silver</p>
//                 <span>45%</span>
//               </div>
//               <div className={styles.prizeItem}>
//                 <div className={styles.progress}>
//                   <div
//                     style={{ width: "45%", backgroundColor: "#C4C4C4" }}
//                   ></div>
//                 </div>
//               </div>
//               <div
//                 className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
//               >
//                 <p className="my-auto">Bronze</p>
//                 <span>25%</span>
//               </div>
//               <div className={styles.prizeItem}>
//                 <div className={styles.progress}>
//                   <div
//                     style={{ width: "25%", backgroundColor: "#8676DE" }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.activityLog}>
//               <h3>Recent Activity Log</h3>
//               <div className={styles.scrollWrapper} ref={scrollWrapperRef}>
//                 <ul className={styles.customlist}>
//                   {notifications.map((item, index) => (
//                     <li
//                       className="d-flex flex-column"
//                       key={index}
//                       ref={(el) => (notificationRefs.current[index] = el)}
//                     >
//                       <span>{item.title}</span>
//                       <div className="d-flex gap-3">
//                         <span className="d-flex">
//                           <UilCalendarAlt
//                             className={`${styles.calender} my-auto`}
//                           />
//                           <p className="my-auto">{item.date}</p>
//                         </span>
//                         <span className="d-flex">
//                           <UilUser className={`${styles.calender} my-auto`} />
//                           <p className="my-auto">{item.author}</p>
//                         </span>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className={styles.notificationButtonDiv}>
//                 <button
//                   onClick={handleNextNotification}
//                   className={styles.scrollButton}
//                 >
//                   <UilAngleDown />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={styles.tablesection}>
//           <h3>School Participation Details</h3>
//           <div
//             id="schoolGrid"
//             className="ag-theme-alpine"
//             style={{ height: "500px", width: "100%" }}
//           >
//             <AgGridReact
//               ref={gridRef}
//               rowData={schoolData}
//               columnDefs={schoolColumnDefs}
//               defaultColDef={defaultColDef}
//               domLayout="normal"
//               popupParent={popupParent}
//               animateRows={true}
//             />
//           </div>
//         </div>

//         <div className={styles.midSection}>
//           <div className={styles.midSectionSecondDiv}>
//             <div className={`${styles.prizeContainer} d-flex flex-row px-0`}>
//               {inactiveSchools.length > 1 && (
//                 <span
//                   onClick={handlePrevSchool}
//                   className={`${styles.carouselArrow} cursor-pointer mr-2`}
//                   disabled={isSchoolTransitioning}
//                 >
//                   <UilAngleLeft className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
//                 </span>
//               )}
//               <div
//                 className={`${styles.recentActivity} relative overflow-hidden h-[200px]`}
//               >
//                 <h3>Inactive Schools</h3>
//                 {inactiveSchools.length === 0 ? (
//                   <p className="text-center text-gray-600 mt-4">
//                     No schools available
//                   </p>
//                 ) : (
//                   <div
//                     className="flex transition-transform duration-500 ease-in-out h-full"
//                     style={{
//                       transform: `translateX(-${
//                         currentSchoolIndex * (100 / inactiveSchools.length)
//                       }%)`,
//                       width: `${inactiveSchools.length * 100}%`,
//                     }}
//                     onTransitionEnd={handleSchoolTransitionEnd}
//                     onMouseEnter={handleSchoolMouseEnter}
//                     onMouseLeave={handleSchoolMouseLeave}
//                   >
//                     {inactiveSchools.map((school, index) => (
//                       <div
//                         key={index}
//                         className="flex-shrink-0 flex items-center justify-center px-2"
//                         style={{ width: `${100 / inactiveSchools.length}%` }}
//                       >
//                         <div className="flex items-center w-full max-w-[200px]">
//                           <div className="bg-white rounded-lg shadow-md w-full hover:shadow-lg transition-shadow duration-300">
//                             <p className="font-semibold text-black text-sm truncate">
//                               {school.name}
//                             </p>
//                             <p className="text-xs text-black truncate">
//                               Address: {school.address}
//                             </p>
//                             <p className="text-xs text-black">
//                               Principal: {school.principal}
//                             </p>
//                             <p className="text-xs text-black">
//                               Vice Principal: {school.vicePrincipal}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               {inactiveSchools.length > 1 && (
//                 <span
//                   onClick={handleNextSchool}
//                   className={`${styles.carouselArrow} cursor-pointer ml-2`}
//                   disabled={isSchoolTransitioning}
//                 >
//                   <UilAngleRight className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
//                 </span>
//               )}
//             </div>
//             <div className={`${styles.prizeContainer} d-flex flex-row px-0`}>
//               {bestStudents.length > 1 && (
//                 <span
//                   onClick={handlePrevStudent}
//                   className={`${styles.carouselArrow} cursor-pointer mr-2`}
//                   disabled={isStudentTransitioning}
//                 >
//                   <UilAngleLeft className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
//                 </span>
//               )}
//               <div
//                 className={`${styles.recentActivity} relative overflow-hidden h-[200px]`}
//               >
//                 <h3>Best Student List</h3>
//                 {bestStudents.length === 0 ? (
//                   <p className="text-center text-gray-600 mt-4">
//                     No students available
//                   </p>
//                 ) : (
//                   <div
//                     className="flex transition-transform duration-500 ease-in-out h-full"
//                     style={{
//                       transform: `translateX(-${
//                         currentStudentIndex * (100 / bestStudents.length)
//                       }%)`,
//                       width: `${bestStudents.length * 100}%`,
//                     }}
//                     onTransitionEnd={handleStudentTransitionEnd}
//                     onMouseEnter={handleStudentMouseEnter}
//                     onMouseLeave={handleStudentMouseLeave}
//                   >
//                     {bestStudents.map((student, index) => (
//                       <div
//                         key={index}
//                         className="flex-shrink-0 flex items-center justify-center px-2"
//                         style={{ width: `${100 / bestStudents.length}%` }}
//                       >
//                         <div className="flex items-center w-full max-w-[200px]">
//                           <div className="bg-white rounded-lg shadow-md w-full hover:shadow-lg transition-shadow duration-300">
//                             <p className="font-semibold text-black text-sm truncate">
//                               {student.name}
//                             </p>
//                             <p className="text-xs text-black truncate">
//                               School: {student.schoolName}
//                             </p>
//                             <p className="text-xs text-black">
//                               Roll: {student.rollNumber}
//                             </p>
//                             <p className="text-xs text-black">
//                               Class: {student.class}
//                             </p>
//                             <p className="text-xs text-black">
//                               Score: {student.score}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               {bestStudents.length > 1 && (
//                 <span
//                   onClick={handleNextStudent}
//                   className={`${styles.carouselArrow} cursor-pointer ml-2`}
//                   disabled={isStudentTransitioning}
//                 >
//                   <UilAngleRight className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className={styles.chartContainer}>
//             <h3 style={{marginBottom:"0"}}>Inventory Management</h3>
//             <Chart
//               options={inventoryChartOptions}
//               series={inventoryChartData.series}
//               type="donut"
//               height="100%"
             
//             />
//           </div>
//         </div>
//       </div>
//     </Mainlayout>
//   );
// };

// export default Dashboard;


import React, { useState, useRef, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import Mainlayout from "../Layouts/Mainlayout";
import styles from "./Dashboard.module.css";
import cardimg1 from "../../../public/Path 195.svg";
import cardimg2 from "../../../public/Path 196.svg";
import cardimg3 from "../../../public/Path 197.svg";
import cardimg4 from "../../../public/Path 198.svg";
import {
  UilCalendarAlt,
  UilUser,
  UilAngleDown,
  UilAngleLeft,
  UilAngleRight,
} from "@iconscout/react-unicons";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
} from "ag-grid-community";
 
// Register AG Grid modules
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
]);
 
// Sample data for schools
const getSchoolData = () => [
  {
    id: "S001",
    schoolName: "Sunrise Academy",
    country: "USA",
    state: "California",
    district: "Los Angeles",
    city: "Los Angeles",
    board: "CBSE",
    totalParticipants: 250,
    mil: 200,
    math: 220,
    english: 230,
    gk: 190,
    science: 210,
  },
  {
    id: "S002",
    schoolName: "Green Valley High",
    country: "USA",
    state: "New York",
    district: "Manhattan",
    city: "New York City",
    board: "IB",
    totalParticipants: 300,
    mil: 250,
    math: 280,
    english: 270,
    gk: 240,
    science: 260,
  },
  {
    id: "S003",
    schoolName: "Blue Ridge School",
    country: "India",
    state: "Maharashtra",
    district: "Pune",
    city: "Pune",
    board: "ICSE",
    totalParticipants: 180,
    mil: 150,
    math: 170,
    english: 160,
    gk: 140,
    science: 165,
  },
  {
    id: "S004",
    schoolName: "Oakwood International",
    country: "UK",
    state: "England",
    district: "London",
    city: "London",
    board: "IGCSE",
    totalParticipants: 220,
    mil: 180,
    math: 200,
    english: 210,
    gk: 170,
    science: 190,
  },
  {
    id: "S005",
    schoolName: "Maple Leaf School",
    country: "Canada",
    state: "Ontario",
    district: "Toronto",
    city: "Toronto",
    board: "CBSE",
    totalParticipants: 270,
    mil: 220,
    math: 250,
    english: 240,
    gk: 210,
    science: 230,
  },
  {
    id: "S006",
    schoolName: "Riverdale High",
    country: "Australia",
    state: "Victoria",
    district: "Melbourne",
    city: "Melbourne",
    board: "IB",
    totalParticipants: 190,
    mil: 160,
    math: 180,
    english: 170,
    gk: 150,
    science: 175,
  },
  {
    id: "S007",
    schoolName: "Starlight Academy",
    country: "India",
    state: "Karnataka",
    district: "Bangalore",
    city: "Bangalore",
    board: "CBSE",
    totalParticipants: 240,
    mil: 190,
    math: 210,
    english: 220,
    gk: 180,
    science: 200,
  },
  {
    id: "S008",
    schoolName: "Horizon School",
    country: "USA",
    state: "Texas",
    district: "Houston",
    city: "Houston",
    board: "IB",
    totalParticipants: 310,
    mil: 260,
    math: 290,
    english: 280,
    gk: 250,
    science: 270,
  },
  {
    id: "S009",
    schoolName: "Evergreen High",
    country: "India",
    state: "Delhi",
    district: "South Delhi",
    city: "Delhi",
    board: "ICSE",
    totalParticipants: 200,
    mil: 170,
    math: 190,
    english: 180,
    gk: 160,
    science: 185,
  },
  {
    id: "S010",
    schoolName: "Bright Future School",
    country: "UK",
    state: "England",
    district: "Manchester",
    city: "Manchester",
    board: "IGCSE",
    totalParticipants: 230,
    mil: 190,
    math: 210,
    english: 200,
    gk: 180,
    science: 195,
  },
  {
    id: "S011",
    schoolName: "Golden Gate Academy",
    country: "USA",
    state: "California",
    district: "San Francisco",
    city: "San Francisco",
    board: "CBSE",
    totalParticipants: 280,
    mil: 230,
    math: 260,
    english: 250,
    gk: 220,
    science: 240,
  },
  {
    id: "S012",
    schoolName: "Silver Oak School",
    country: "India",
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Chennai",
    board: "ICSE",
    totalParticipants: 260,
    mil: 210,
    math: 240,
    english: 230,
    gk: 200,
    science: 220,
  },
];
 
// Sample data for student results
const getStudentData = () => [
  {
    rollNumber: "R001",
    name: "Aarav Sharma",
    schoolName: "Sunrise Academy",
    mil: 85,
    math: 92,
    english: 88,
    gk: 80,
    science: 90,
    class: "10",
    sec: "A",
  },
  {
    rollNumber: "R002",
    name: "Emma Wilson",
    schoolName: "Green Valley High",
    mil: 90,
    math: 95,
    english: 93,
    gk: 85,
    science: 94,
    class: "11",
    sec: "B",
  },
  {
    rollNumber: "R003",
    name: "Vivaan Patel",
    schoolName: "Blue Ridge School",
    mil: 78,
    math: 82,
    english: 80,
    gk: 75,
    science: 81,
    class: "9",
    sec: "C",
  },
  {
    rollNumber: "R004",
    name: "Sophie Brown",
    schoolName: "Oakwood International",
    mil: 88,
    math: 90,
    english: 87,
    gk: 82,
    science: 89,
    class: "10",
    sec: "A",
  },
  {
    rollNumber: "R005",
    name: "Liam Johnson",
    schoolName: "Maple Leaf School",
    mil: 92,
    math: 94,
    english: 91,
    gk: 88,
    science: 93,
    class: "11",
    sec: "B",
  },
  {
    rollNumber: "R006",
    name: "Isabella Davis",
    schoolName: "Riverdale High",
    mil: 80,
    math: 85,
    english: 83,
    gk: 78,
    science: 84,
    class: "10",
    sec: "C",
  },
  {
    rollNumber: "R007",
    name: "Arjun Reddy",
    schoolName: "Starlight Academy",
    mil: 87,
    math: 89,
    english: 86,
    gk: 81,
    science: 88,
    class: "9",
    sec: "A",
  },
  {
    rollNumber: "R008",
    name: "Noah Martinez",
    schoolName: "Horizon School",
    mil: 95,
    math: 97,
    english: 94,
    gk: 90,
    science: 96,
    class: "11",
    sec: "A",
  },
  {
    rollNumber: "R009",
    name: "Ananya Gupta",
    schoolName: "Evergreen High",
    mil: 82,
    math: 86,
    english: 84,
    gk: 79,
    science: 85,
    class: "10",
    sec: "B",
  },
  {
    rollNumber: "R010",
    name: "Oliver Taylor",
    schoolName: "Bright Future School",
    mil: 89,
    math: 91,
    english: 88,
    gk: 83,
    science: 90,
    class: "11",
    sec: "C",
  },
  {
    rollNumber: "R011",
    name: "Mia Anderson",
    schoolName: "Golden Gate Academy",
    mil: 93,
    math: 96,
    english: 92,
    gk: 87,
    science: 94,
    class: "10",
    sec: "A",
  },
  {
    rollNumber: "R012",
    name: "Aditya Menon",
    schoolName: "Silver Oak School",
    mil: 86,
    math: 88,
    english: 85,
    gk: 80,
    science: 87,
    class: "9",
    sec: "B",
  },
];
 
const Dashboard = () => {
  const scrollWrapperRef = useRef(null);
  const notificationRefs = useRef([]);
  const gridRef = useRef(null);
 
  const [activeFilter, setActiveFilter] = useState("year");
  const [schoolData] = useState(getSchoolData());
  const [studentData] = useState(getStudentData());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("math");
 
  // Get top students for the selected subject
  const bestStudents = useMemo(() => {
    return [...studentData]
      .sort((a, b) => b[selectedSubject] - a[selectedSubject])
      .slice(0, 3)
      .map((student) => ({
        name: student.name,
        schoolName: student.schoolName,
        rollNumber: student.rollNumber,
        class: student.class,
        sec: student.sec,
        score: student[selectedSubject],
      }));
  }, [studentData, selectedSubject]);
 
  // Chart data and options
  const chartData = {
    all: [
      {
        name: "2020",
        data: [100, 200, 150, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
      },
      {
        name: "2021",
        data: [200, 300, 250, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
      },
 
 {
        name: "2022",
        data: [300, 400, 350, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
      },
      {
        name: "2023",
        data: [400, 500, 450, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
      },
    ],
    year: [
      {
        name: "2024",
        data: [250, 300, 200, 400, 300, 350, 480, 550, 450, 400, 300, 200],
      },
    ],
    week: [{ name: "Week", data: [50, 70, 90, 110, 130, 150, 170] }],
    today: [{ name: "Today", data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }],
  };
 
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
 
  const chartOptions = {
    chart: { id: "student-participation", toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: "end",
        columnWidth: "25%",
      },
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    xaxis: {
      categories:
        activeFilter === "today"
          ? [
              "6 AM",
              "8 AM",
              "10 AM",
              "12 PM",
              "2 PM",
              "4 PM",
              "6 PM",
              "8 PM",
              "10 PM",
              "12 AM",
            ]
          : activeFilter === "week"
          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          : [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        gradientToColors: ["#508FF4"],
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: "#83C9FC", opacity: 1 },
          { offset: 70, color: "#508FF4", opacity: 1 },
        ],
      },
    },
    grid: { borderColor: "#F1F1F1" },
    yaxis: {
      labels: {
        formatter: function (val) {
          return "$ " + val;
        },
      },
    },
    colors:
      activeFilter === "all"
        ? ["#FF5733", "#33B5E5", "#FFBD33", "#7D33FF"]
        : ["#508FF4"],
  };
 
  const chartSeries = chartData[activeFilter];
 
  const notifications = [
    {
      title: "Result uploaded for Science Quiz",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "New school added: The Sunsign High",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Exam Created: Math Olympiad",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Result uploaded for Science Quiz",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "New school added: The Sunsign High",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Exam Created: Math Olympiad",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Asarita",
    },
  ];
 
  const handleNextNotification = () => {
    const nextIndex = (currentIndex + 1) % notifications.length;
    setCurrentIndex(nextIndex);
    if (notificationRefs.current[nextIndex]) {
      notificationRefs.current[nextIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };
 
  // AG Grid column definitions for school data
  const schoolColumnDefs = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 100 },
      { headerName: "School Name", field: "schoolName", width: 200 },
      { headerName: "Country", field: "country", width: 120 },
      { headerName: "State", field: "state", width: 120 },
      { headerName: "District", field: "district", width: 120 },
      { headerName: "City", field: "city", width: 120 },
      { headerName: "Board", field: "board", width: 100 },
      {
        headerName: "Total Participants",
        field: "totalParticipants",
        width: 150,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "MIL",
        field: "mil",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "Math",
        field: "math",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "English",
        field: "english",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "GK",
        field: "gk",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "Science",
        field: "science",
        width: 100,
        filter: "agNumberColumnFilter",
      },
    ],
    []
  );
 
  // Default column properties
  const defaultColDef = useMemo(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      minWidth: 100,
    }),
    []
  );
 
  const popupParent = useMemo(() => document.body, []);
 
  const inactiveSchools = [
    {
      name: "Sunrise Academy",
      address: "123 Elm Street, Springfield, IL",
      principal: "Dr. John Smith",
      vicePrincipal: "Ms. Jane Doe",
    },
    {
      name: "Moonlight High",
      address: "456 Oak Avenue, Rivertown, CA",
      principal: "Prof. Emily Brown",
      vicePrincipal: "Mr. Michael Lee",
    },
  ];
 
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [isStudentTransitioning, setIsStudentTransitioning] = useState(false);
  const studentAutoSlideRef = useRef(null);
 
  const handleNextStudent = () => {
    if (isStudentTransitioning || bestStudents.length <= 1) return;
    setIsStudentTransitioning(true);
    setCurrentStudentIndex((prev) => (prev + 1) % bestStudents.length);
  };
 
  const handlePrevStudent = () => {
    if (isStudentTransitioning || bestStudents.length <= 1) return;
    setIsStudentTransitioning(true);
    setCurrentStudentIndex((prev) =>
      prev === 0 ? bestStudents.length - 1 : prev - 1
    );
  };
 
  const handleStudentTransitionEnd = () => {
    setIsStudentTransitioning(false);
  };
 
  useEffect(() => {
    if (bestStudents.length <= 1) return;
 
    studentAutoSlideRef.current = setInterval(() => {
      handleNextStudent();
    }, 5000);
 
    return () => clearInterval(studentAutoSlideRef.current);
  }, [bestStudents]);
 
  const handleStudentMouseEnter = () => {
    clearInterval(studentAutoSlideRef.current);
  };
 
  const handleStudentMouseLeave = () => {
    if (bestStudents.length <= 1) return;
    studentAutoSlideRef.current = setInterval(() => {
      handleNextStudent();
    }, 5000);
  };
 
  const [currentSchoolIndex, setCurrentSchoolIndex] = useState(0);
  const [isSchoolTransitioning, setIsSchoolTransitioning] = useState(false);
  const schoolAutoSlideRef = useRef(null);
 
  const handleNextSchool = () => {
    if (isSchoolTransitioning || inactiveSchools.length <= 1) return;
    setIsSchoolTransitioning(true);
    setCurrentSchoolIndex((prev) => (prev + 1) % inactiveSchools.length);
  };
 
  const handlePrevSchool = () => {
    if (isSchoolTransitioning || inactiveSchools.length <= 1) return;
    setIsSchoolTransitioning(true);
    setCurrentSchoolIndex((prev) =>
      prev === 0 ? inactiveSchools.length - 1 : prev - 1
    );
  };
 
  const handleSchoolTransitionEnd = () => {
    setIsSchoolTransitioning(false);
  };
 
  useEffect(() => {
    if (inactiveSchools.length <= 1) return;
 
    schoolAutoSlideRef.current = setInterval(() => {
      handleNextSchool();
    }, 5000);
 
    return () => clearInterval(schoolAutoSlideRef.current);
  }, [inactiveSchools.length]);
 
  const handleSchoolMouseEnter = () => {
    clearInterval(schoolAutoSlideRef.current);
  };
 
  const handleSchoolMouseLeave = () => {
    if (inactiveSchools.length <= 1) return;
    schoolAutoSlideRef.current = setInterval(() => {
      handleNextSchool();
    }, 5000);
  };
 
  const inventoryChartData = {
    series: [500, 300, 200, 100],
    labels: ["Books", "Stationery", "Equipment", "Others"],
  };
 
  const inventoryChartOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: ["Books", "Stationery", "Equipment", "Others"],
    colors: ["#508FF4", "#FF5733", "#33B5E5", "#FFBD33"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return inventoryChartData.series[opts.seriesIndex];
      },
    },
    legend: { position: "bottom", fontSize: "12px" },
    plotOptions: { pie: { donut: { size: "65%" } } },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom" },
        },
      },
    ],
  };
 
  return (
    <Mainlayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.cardsContainer}>
          <div className={`${styles.card} ${styles.totalExams}`}>
            <h3>Total Schools</h3>
            <hr />
            <div className="d-flex gap-3">
              <img src={cardimg1} alt="cardimg1" />
              <h1 className="my-auto">403,813</h1>
            </div>
          </div>
          <div className={`${styles.card} ${styles.totalStudents}`}>
            <h3>Total Students</h3>
            <hr />
            <div className="d-flex">
              <img src={cardimg2} alt="cardimg2" />
              <h1 className="my-auto">4,846</h1>
            </div>
          </div>
          <div className={`${styles.card} ${styles.averageScores}`}>
            <h3>Average Scores</h3>
            <hr />
            <div className="d-flex gap-3">
              <img src={cardimg3} alt="cardimg3" />
              <h1 className="my-auto">84%</h1>
            </div>
          </div>
          <div className={`${styles.card} ${styles.activeUsers}`}>
            <h3>Active Users Today</h3>
            <hr />
            <div className="d-flex gap-3">
              <img src={cardimg4} alt="cardimg4" />
              <h1 className="my-auto">48.464131</h1>
            </div>
          </div>
        </div>
 
 
   <div className={styles.midSection}>
          <div className={styles.chartContainer}>
            <h3>Student Participation</h3>
            <div className={styles.filterButtons}>
              <button
                className={activeFilter === "year" ? styles.active : ""}
                onClick={() => handleFilterChange("year")}
              >
                This year
              </button>
              <button
                className={activeFilter === "week" ? styles.active : ""}
                onClick={() => handleFilterChange("week")}
              >
                This week
              </button>
              <button
                className={activeFilter === "today" ? styles.active : ""}
                onClick={() => handleFilterChange("today")}
              >
                Today
              </button>
              <button
                className={activeFilter === "all" ? styles.active : ""}
                onClick={() => handleFilterChange("all")}
              >
                All time
              </button>
            </div>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height="180"
            />
          </div>
 
          <div className={styles.midSectionSecondDiv}>
            <div className={styles.prizeContainer}>
              <h3>Prize Distribution</h3>
              <div
                className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
              >
                <p className="my-auto">Gold</p>
                <span>30%</span>
              </div>
              <div className={styles.prizeItem}>
                <div className={styles.progress}>
                  <div
                    style={{ width: "30%", backgroundColor: "#F8C900" }}
                  ></div>
                </div>
              </div>
              <div
                className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
              >
                <p className="my-auto">Silver</p>
                <span>45%</span>
              </div>
              <div className={styles.prizeItem}>
                <div className={styles.progress}>
                  <div
                    style={{ width: "45%", backgroundColor: "#C4C4C4" }}
                  ></div>
                </div>
              </div>
              <div
                className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
              >
                <p className="my-auto">Bronze</p>
                <span>25%</span>
              </div>
              <div className={styles.prizeItem}>
                <div className={styles.progress}>
                  <div
                    style={{ width: "25%", backgroundColor: "#8676DE" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className={styles.activityLog}>
              <h3>Recent Activity Log</h3>
              <div className={styles.scrollWrapper} ref={scrollWrapperRef}>
                <ul className={styles.customlist}>
                  {notifications.map((item, index) => (
                    <li
                      className="d-flex flex-column"
                      key={index}
                      ref={(el) => (notificationRefs.current[index] = el)}
                    >
                      <span>{item.title}</span>
                      <div className="d-flex gap-3">
                        <span className="d-flex">
                          <UilCalendarAlt
                            className={`${styles.calender} my-auto`}
                          />
                          <p className="my-auto">{item.date}</p>
                        </span>
                        <span className="d-flex">
                          <UilUser className={`${styles.calender} my-auto`} />
                          <p className="my-auto">{item.author}</p>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.notificationButtonDiv}>
                <button
                  onClick={handleNextNotification}
                  className={styles.scrollButton}
                >
                  <UilAngleDown />
                </button>
              </div>
            </div>
          </div>
        </div>
 
        <div className={styles.tablesection}>
          <h3>School Participation Details</h3>
          <div
            id="schoolGrid"
            className="ag-theme-alpine"
            style={{ height: "500px", width: "100%" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={schoolData}
              columnDefs={schoolColumnDefs}
              defaultColDef={defaultColDef}
              domLayout="normal"
              popupParent={popupParent}
              animateRows={true}
            />
          </div>
        </div>
 
        <div className={styles.midSection}>
          <div className={styles.midSectionSecondDiv}>
            <div className={`${styles.prizeContainer} flex flex-row px-0`}>
              <div className="items-center d-flex flex-row justify-between w-full mx-4 gap-4 mb-4">
                <h3 className="text-lg font-semibold">Inactive Schools</h3>
                <img
                  src="./src/assets/TROPHY.gif"
                  alt="Trophy"
                  style={{ height: "35px" }}
                  CER
                />
              </div>
              <div className="d-flex flex-row">
                {inactiveSchools.length > 1 && (
                  <span
                    onClick={handlePrevSchool}
                    className={`${styles.carouselArrow} cursor-pointer mr-2`}
                    disabled={isSchoolTransitioning}
                  >
                    <UilAngleLeft className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
                  </span>
                )}
                <div
                  className={`${styles.recentActivity} flex column relative overflow-hidden h-[200px]`}
                >
                  {inactiveSchools.length === 0 ? (
                    <p className="text-center text-gray-600 mt-4">
                      No schools available
                    </p>
                  ) : (
                    <div
                      className="flex transition-transform duration-500 ease-in-out h-full"
                      style={{
                        transform: `translateX(-${
                          currentSchoolIndex * (100 / inactiveSchools.length)
                        }%)`,
                        width: `${inactiveSchools.length * 100}%`,
                      }}
                      onTransitionEnd={handleSchoolTransitionEnd}
                      onMouseEnter={handleSchoolMouseEnter}
                      onMouseLeave={handleSchoolMouseLeave}
                    >
                      {inactiveSchools.map((school, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 flex items-center justify-center px-2"
                          style={{ width: `${100 / inactiveSchools.length}%` }}
                        >
                          <div className="flex items-center w-full max-w-[200px]">
                            <div className="bg-white rounded-lg shadow-md w-full hover:shadow-lg transition-shadow duration-300">
                              <h3 className="bold text-black text-sm truncate">
                                {school.name}
                              </h3>
                              <p className={`${styles.inactivefont}`}>
                                {school.address}
                              </p>
                              <p>{school.principal}</p>
                              <p>{school.vicePrincipal}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {inactiveSchools.length > 1 && (
                  <span
                    onClick={handleNextSchool}
                    className={`${styles.carouselArrow} cursor-pointer ml-2`}
                    disabled={isSchoolTransitioning}
                  >
                    <UilAngleRight className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
                  </span>
                )}
              </div>
            </div>
            <div className={`${styles.prizeContainer} flex flex-row px-0`}>
              <div className="items-center d-flex flex-row justify-between w-full mx-4 gap-4 mb-4">
                <h3 className="text-lg font-semibold">Best Student List</h3>
                <img
                  src="./src/assets/STUDENT.gif"
                  alt="Student"
                  style={{ height: "45px" }}
                />
              </div>
              <div className="d-flex flex-row">
                {bestStudents.length > 1 && (
                  <span
                    onClick={handlePrevStudent}
                    className={`${styles.carouselArrow} cursor-pointer mr-2`}
                    disabled={isStudentTransitioning}
                  >
                    <UilAngleLeft className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
                  </span>
                )}
                <div
                  className={`${styles.recentActivity} flex column relative overflow-hidden h-[200px]`}
                >
                  {bestStudents.length === 0 ? (
                    <p className="text-center text-gray-600 mt-4">
                      No students available
                    </p>
                  ) : (
                    <div
                      className="flex transition-transform duration-500 ease-in-out h-full"
                      style={{
                        transform: `translateX(-${
                          currentStudentIndex * (100 / bestStudents.length)
                        }%)`,
                        width: `${bestStudents.length * 100}%`,
                      }}
                      onTransitionEnd={handleStudentTransitionEnd}
                      onMouseEnter={handleStudentMouseEnter}
                      onMouseLeave={handleStudentMouseLeave}
                    >
                      {bestStudents.map((student, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 flex items-center justify-center px-2"
                          style={{ width: `${100 / bestStudents.length}%` }}
                        >
                          <div className="flex items-center w-full max-w-[200px]">
                            <div className="bg-white rounded-lg shadow-md w-full hover:shadow-lg transition-shadow duration-300">
                              <h3 className="bold text-black text-sm truncate">
                                {student.name}
                              </h3>
                              <p className={`${styles.inactivefont}`}>
                                {student.schoolName}
                              </p>
                              <p className="text-[0.75em] leading-[1.5em] text-gray-600 font-poppins flex items-center">
                                {student.class}
                                <span className="text-[0.75em] leading-[1.5em] text-gray-600 font-poppins flex items-center">
                                  {"-" + student.sec}
                                </span>
                              </p>
                              <p className="ml-2 font-medium text-gray-800">
                                {student.rollNumber || "N/A"}
                              </p>
                              <p>{student.score}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {bestStudents.length > 1 && (
                  <span
                    onClick={handleNextStudent}
                    className={`${styles.carouselArrow} cursor-pointer ml-2`}
                    disabled={isStudentTransitioning}
                  >
                    <UilAngleRight className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <h3 style={{ marginBottom: "0" }}>Inventory Management</h3>
            <Chart
              options={inventoryChartOptions}
              series={inventoryChartData.series}
              type="donut"
              height="100%"
            />
          </div>
        </div>
      </div>
    </Mainlayout>
  );
};
 
export default Dashboard;
 
 