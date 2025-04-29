// import React from "react";
// import logo from "../../../../public/logo GOWBELL.png";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   Grid,
// } from "@mui/material";

// // Data for Medals Tally
// const medalsTally = [
//   { medal: "Gold", quantity: 5 },
//   { medal: "Silver", quantity: 8 },
//   { medal: "Bronze", quantity: 8 },
// ];

// // Data for Class and Subject Wise Cutoff Percentage
// const classCutoff = [
//   { class: 1, gold: 96, silver: 84, bronze: 66 },
//   { class: 2, gold: 96, silver: 74, bronze: 66 },
//   { class: 3, gold: 86, silver: 94, bronze: 85 },
//   { class: 4, gold: 73, silver: 63, bronze: "NILL" },
//   { class: 5, gold: 83, silver: 71, bronze: 57 },
//   { class: 6, gold: 83, silver: 71, bronze: 57 },
//   { class: 7, gold: "NILL", silver: "NILL", bronze: "NILL" },
//   { class: 8, gold: "NILL", silver: "NILL", bronze: "NILL" },
//   { class: 9, gold: "NILL", silver: "NILL", bronze: "NILL" },
// ];

// // Data for Winners List
// const winnersList = [
//   {
//     slNo: 1,
//     name: "Abhisek Prasad Panda",
//     rollNo: "017252",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: 33,
//     percentage: 66,
//     medal: "Bronze",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 2,
//     name: "Ashirwad Madhur Das",
//     rollNo: "017253",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: 42,
//     percentage: 84,
//     medal: "Silver",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 3,
//     name: "Aryan Prasad Mohapatra",
//     rollNo: "017254",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: 32,
//     percentage: 64,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 4,
//     name: "Kumar Adivik",
//     rollNo: "017255",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: "N/A",
//     percentage: "N/A",
//     medal: "N/A",
//     certificate: "N/A",
//   },
//   {
//     slNo: 5,
//     name: "Prativa Behera",
//     rollNo: "017256",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: "N/A",
//     percentage: "N/A",
//     medal: "N/A",
//     certificate: "N/A",
//   },
//   {
//     slNo: 6,
//     name: "Rishika Jena",
//     rollNo: "017257",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: 27,
//     percentage: 54,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 7,
//     name: "Saaniya Mohanty",
//     rollNo: "017258",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: 43,
//     percentage: 86,
//     medal: "Gold",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 8,
//     name: "Soumya Ranjan Nayak",
//     rollNo: "017259",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: 22,
//     percentage: 44,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 9,
//     name: "U. Gayatri",
//     rollNo: "017260",
//     class: 1,
//     fullMarks: 50,
//     securedMarks: 18,
//     percentage: 36,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 10,
//     name: "Bidyansu Mangaraj",
//     rollNo: "017261",
//     class: 2,
//     fullMarks: 50,
//     securedMarks: 24,
//     percentage: 48,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 11,
//     name: "Himadri Tanaya Khuntia",
//     rollNo: "017262",
//     class: 2,
//     fullMarks: 50,
//     securedMarks: 16,
//     percentage: 32,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 12,
//     name: "Himasu Sekhar Ananta Tripathy",
//     rollNo: "017263",
//     class: 2,
//     fullMarks: 50,
//     securedMarks: 24,
//     percentage: 48,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 13,
//     name: "Jamnensh Baral",
//     rollNo: "017264",
//     class: 2,
//     fullMarks: 50,
//     securedMarks: 34,
//     percentage: 68,
//     medal: "Silver",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 14,
//     name: "Krishna Rajalaxmi",
//     rollNo: "017265",
//     class: 2,
//     fullMarks: 50,
//     securedMarks: 22,
//     percentage: 44,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 15,
//     name: "Sai Harshita Jena",
//     rollNo: "017266",
//     class: 2,
//     fullMarks: 50,
//     securedMarks: 28,
//     percentage: 56,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 16,
//     name: "Sritishree Ray",
//     rollNo: "017267",
//     class: 2,
//     fullMarks: 50,
//     securedMarks: 33,
//     percentage: 66,
//     medal: "Bronze",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 17,
//     name: "Swayam Prakash Parida",
//     rollNo: "017268",
//     class: 2,
//     fullMarks: 50,
//     securedMarks: 38,
//     percentage: 76,
//     medal: "Gold",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 18,
//     name: "Aditya Sahoo",
//     rollNo: "017269",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: 38,
//     percentage: 76,
//     medal: "Silver",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 19,
//     name: "Mahesh Sahoo",
//     rollNo: "017270",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: 47,
//     percentage: 94,
//     medal: "Gold",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 20,
//     name: "Omm Prakash Mohanta",
//     rollNo: "017271",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: "N/A",
//     percentage: "N/A",
//     medal: "N/A",
//     certificate: "N/A",
//   },
//   {
//     slNo: 21,
//     name: "Priyansee Samantaray",
//     rollNo: "017272",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: 48,
//     percentage: 96,
//     medal: "Silver",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 22,
//     name: "Raghunath Nayak",
//     rollNo: "017273",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: 43,
//     percentage: 86,
//     medal: "Gold",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 23,
//     name: "Rittish Tapoo",
//     rollNo: "017274",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: 47,
//     percentage: 94,
//     medal: "N/A",
//     certificate: "N/A",
//   },
//   {
//     slNo: 24,
//     name: "Shreyanshree Choudhury",
//     rollNo: "017275",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: 38,
//     percentage: 76,
//     medal: "Silver",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 25,
//     name: "Shreyansh Mallick",
//     rollNo: "017276",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: 38,
//     percentage: 76,
//     medal: "Silver",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 26,
//     name: "Vanya Ganjahat",
//     rollNo: "017277",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: "N/A",
//     percentage: "N/A",
//     medal: "N/A",
//     certificate: "N/A",
//   },
//   {
//     slNo: 27,
//     name: "Yashaswini Mohanty",
//     rollNo: "017278",
//     class: 3,
//     fullMarks: 50,
//     securedMarks: "N/A",
//     percentage: "N/A",
//     medal: "N/A",
//     certificate: "N/A",
//   },
//   {
//     slNo: 28,
//     name: "A.J. Yush",
//     rollNo: "017279",
//     class: 4,
//     fullMarks: 60,
//     securedMarks: 44,
//     percentage: 73,
//     medal: "Gold",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 29,
//     name: "Anushka Das",
//     rollNo: "017280",
//     class: 4,
//     fullMarks: 60,
//     securedMarks: 24,
//     percentage: 40,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
//   {
//     slNo: 30,
//     name: "Mohammad Asmad",
//     rollNo: "017281",
//     class: 4,
//     fullMarks: 60,
//     securedMarks: 33,
//     percentage: 55,
//     medal: "N/A",
//     certificate: "Certificate of Achievement",
//   },
// ];

// const MedalsWinnersList = () => {
//   return (
//       <Box
//         sx={{ p: 3, fontFamily: "Arial, sans-serif", backgroundColor: "white" }}
//       >
//         {/* {/ First Row: Logo, Heading, and L-1 Results /} */}
//         <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//           <Grid item xs={2}>
//             <img src={logo} alt="Logo" width="150px" height="50px" />
//           </Grid>
//           <Grid item xs={8}>
//             <Typography
//               variant="h5"
//               align="center"
//               sx={{
//                 fontWeight: "bold",
//                 color: "black",
//                 fontFamily: "Arial, sans-serif",
//                 fontSize: "1.3rem",
//               }}
//             >
//               GOWBELL INTERNATIONAL MATHEMATICS OLYMPIAD (2024-25)
//               {/* Gowbell International Mathematics Olympiad (2024-25) */}
//             </Typography>
//           </Grid>
//           <Grid item xs={2} sx={{ textAlign: "right" }}>
//             <Box
//               sx={{
//                 backgroundColor: "#1E3A8A", // Dark blue background
//                 color: "#FFFFFF", // White text
//                 padding: "4px 8px",
//                 fontFamily: "Arial, sans-serif",
//                 fontWeight: "bold",
//                 display: "inline-block",
//               }}
//             >
//               L-1 Results
//             </Box>
//           </Grid>
//         </Grid>

        
//         <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
//           {/* {/ First Column: School Name and Medals Tally in one div /} */}
//           <Grid item xs={4}>
//             <Box sx={{ display: "flex", flexDirection: "column" }}>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: "bold",
//                   color: "#1E3A8A",
//                   mx: "auto",
//                   fontFamily: "Arial, sans-serif",
//                   mb: 1, // Margin bottom to separate from the table
//                   fontSize: "1.4rem",
//                 }}
//               >
//                 ST. XAVIER PUBLIC SCHOOL
//               </Typography>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: "bold",
//                   color: "#000000",
//                   fontFamily: "Arial, sans-serif",
//                   fontSize: "0.8rem",
//                   mx: "auto",

//                   mb: 1, // Margin bottom to separate from the table
//                 }}
//               >
//                 (UNIT-4 BHUBANESWAR-KHORDHA)
//               </Typography>
//               <Box border={1}>
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontWeight: "bold",
//                     fontFamily: "Arial, sans-serif",
//                     color: "#000000",
//                     textAlign: "center",
//                   }}
//                 >
//                   Medals Tally
//                 </Typography>
//                 <Table
//                   size="small"
//                   sx={{ width: "100%", mx: "auto", border: "none" }}
//                 >
//                   <TableBody>
//                     <TableRow>
//                       <TableCell
//                         sx={{
//                           fontFamily: "Arial, sans-serif",
//                           fontWeight: "bold",
//                           textAlign: "center",
//                           border: "none",
//                           padding: "4px",
//                         }}
//                       >
//                         MEDALS
//                       </TableCell>
//                       <TableCell
//                         align="right"
//                         sx={{
//                           fontFamily: "Arial, sans-serif",
//                           fontWeight: "bold",
//                           textAlign: "center",
//                           border: "none",
//                           padding: "4px",
//                         }}
//                       >
//                         QUANTITY
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                   <TableBody>
//                     {medalsTally.map((row) => (
//                       <TableRow key={row.medal}>
//                         <TableCell
//                           sx={{
//                             fontFamily: "Arial, sans-serif",
//                             fontWeight: "bold",
//                             border: "none",
//                             textAlign: "center",
//                             padding: "4px",
//                           }}
//                         >
//                           {row.medal}
//                         </TableCell>
//                         <TableCell
//                           align="right"
//                           sx={{
//                             fontFamily: "Arial, sans-serif",
//                             textAlign: "center",
//                             border: "none",
//                             padding: "4px",
//                           }}
//                         >
//                           {row.quantity}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Box>
//             </Box>
//           </Grid>

          
//           <Grid item xs={4}>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: "bold",
//                 fontFamily: "Arial, sans-serif",
//                 color: "#000000",
//                 textAlign: "center",
//               }}
//             >
//               {/* Medals Winners List */}
//               MEDALS WINNERS LIST
//             </Typography>
//           </Grid>

          
//           <Grid item xs={4}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 border: "1px solid black",
//                 textAlign: "center",
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: "bold",
//                   fontFamily: "Arial, sans-serif",
//                   color: "#000000",
//                   fontSize: "0.95rem",
//                 }}
//               >
//                 Class and Subject Wise Cutoff Percentage
//               </Typography>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: "bold",
//                   fontFamily: "Arial, sans-serif",
//                   color: "#000000",
//                   fontSize: "0.95rem",
//                   textAlign: "center",
//                 }}
//               >
//                 Medals
//               </Typography>
//               <Table
//                 size="small"
//                 sx={{ width: "300px", mx: "auto", border: "none" }}
//               >
//                 <TableHead>
//                   <TableRow>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         fontWeight: "bold",
//                         border: "none",
//                         textAlign: "center",
//                         padding: "4px",
//                       }}
//                     >
//                       Class
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         fontWeight: "bold",
//                         border: "none",
//                         textAlign: "center",
//                         padding: "4px",
//                       }}
//                     >
//                       Gold
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         fontWeight: "bold",
//                         border: "none",
//                         textAlign: "center",
//                         padding: "4px",
//                       }}
//                     >
//                       Silver
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         fontWeight: "bold",
//                         border: "none",
//                         textAlign: "center",
//                         padding: "4px",
//                       }}
//                     >
//                       Bronze
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {classCutoff.map((row) => (
//                     <TableRow key={row.class}>
//                       <TableCell
//                         sx={{
//                           fontFamily: "Arial, sans-serif",
//                           border: "none",
//                           padding: "4px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {row.class}
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           fontFamily: "Arial, sans-serif",
//                           border: "none",
//                           padding: "4px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {row.gold}
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           fontFamily: "Arial, sans-serif",
//                           border: "none",
//                           padding: "4px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {row.silver}
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           fontFamily: "Arial, sans-serif",
//                           border: "none",
//                           padding: "4px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {row.bronze}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Grid>
//         </Grid>

        
//         <TableContainer
//           component={Paper}
//           sx={{ py: "20px", borderRadius: "none", boxShadow: "none" }}
//         >
//           <Table sx={{ border: "none" }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Sl. No
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Student's Name
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Roll No
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Class
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Full Marks
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Secured Marks
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Percentage
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Medals Achievement
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     fontWeight: "bold",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   Certificate of Achievement
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {winnersList.map((row) => (
//                 <TableRow key={row.slNo}>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.slNo}.
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.name}
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.rollNo}
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.class}
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.fullMarks}
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.securedMarks}
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.percentage}
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.medal}
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     {row.certificate}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
    
//   );
// };

// export default MedalsWinnersList;

import React from "react";
import logo from "../../../../public/logo GOWBELL.png"; // Adjust path as needed
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
} from "@mui/material";

const MedalsWinnersList = ({
  medalsTally,
  classCutoff,
  winnersList,
  schoolName,
  classId,
  subjectId,
}) => {
  return (
    <Box
      sx={{ p: 3, fontFamily: "Arial, sans-serif", backgroundColor: "white" }}
    >
      {/* First Row: Logo, Heading, and L-1 Results */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={2}>
          <img src={logo} alt="Logo" width="150px" height="50px" />
        </Grid>
        <Grid item xs={8}>
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "black",
              fontFamily: "Arial, sans-serif",
              fontSize: "1.3rem",
            }}
          >
            GOWBELL INTERNATIONAL MATHEMATICS OLYMPIAD (2024-25)
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: "right" }}>
          <Box
            sx={{
              backgroundColor: "#1E3A8A",
              color: "#FFFFFF",
              padding: "4px 8px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            L-1 Results
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
        {/* School Name and Medals Tally */}
        <Grid item xs={4}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#1E3A8A",
                mx: "auto",
                fontFamily: "Arial, sans-serif",
                mb: 1,
                fontSize: "1.4rem",
              }}
            >
              {schoolName || "ST. XAVIER PUBLIC SCHOOL"}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#000000",
                fontFamily: "Arial, sans-serif",
                fontSize: "0.8rem",
                mx: "auto",
                mb: 1,
              }}
            >
              (UNIT-4 BHUBANESWAR-KHORDHA)
            </Typography>
            <Box border={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Arial, sans-serif",
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                Medals Tally
              </Typography>
              <Table size="small" sx={{ width: "100%", mx: "auto", border: "none" }}>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        textAlign: "center",
                        border: "none",
                        padding: "4px",
                      }}
                    >
                      MEDALS
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        textAlign: "center",
                        border: "none",
                        padding: "4px",
                      }}
                    >
                      QUANTITY
                    </TableCell>
                  </TableRow>
                  {medalsTally.map((row) => (
                    <TableRow key={row.medal}>
                      <TableCell
                        sx={{
                          fontFamily: "Arial, sans-serif",
                          fontWeight: "bold",
                          border: "none",
                          textAlign: "center",
                          padding: "4px",
                        }}
                      >
                        {row.medal}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontFamily: "Arial, sans-serif",
                          textAlign: "center",
                          border: "none",
                          padding: "4px",
                        }}
                      >
                        {row.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
              color: "#000000",
              textAlign: "center",
            }}
          >
            MEDALS WINNERS LIST
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid black",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontFamily: "Arial, sans-serif",
                color: "#000000",
                fontSize: "0.95rem",
              }}
            >
              Class and Subject Wise Cutoff Percentage
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontFamily: "Arial, sans-serif",
                color: "#000000",
                fontSize: "0.95rem",
                textAlign: "center",
              }}
            >
              Medals
            </Typography>
            <Table size="small" sx={{ width: "300px", mx: "auto", border: "none" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                      border: "none",
                      textAlign: "center",
                      padding: "4px",
                    }}
                  >
                    Class
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                      border: "none",
                      textAlign: "center",
                      padding: "4px",
                    }}
                  >
                    Gold
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                      border: "none",
                      textAlign: "center",
                      padding: "4px",
                    }}
                  >
                    Silver
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                      border: "none",
                      textAlign: "center",
                      padding: "4px",
                    }}
                  >
                    Bronze
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classCutoff.map((row) => (
                  <TableRow key={row.class}>
                    <TableCell
                      sx={{
                        fontFamily: "Arial, sans-serif",
                        border: "none",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      {row.class}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Arial, sans-serif",
                        border: "none",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      {row.gold}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Arial, sans-serif",
                        border: "none",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      {row.silver}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Arial, sans-serif",
                        border: "none",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      {row.bronze}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ py: "20px", borderRadius: "none", boxShadow: "none" }}
      >
        <Table sx={{ border: "none" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Sl. No
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Student's Name
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Roll No
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Full Marks
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Secured Marks
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Percentage
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Medals Achievement
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  border: "none",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                Certificate of Achievement
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {winnersList.map((row) => (
              <TableRow key={row.slNo}>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.slNo}.
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.rollNo}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.class}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.fullMarks}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.securedMarks}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.percentage}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.medal}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Arial, sans-serif",
                    border: "none",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {row.certificate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MedalsWinnersList;