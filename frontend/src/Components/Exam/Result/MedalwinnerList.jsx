// import React from "react";
// import logo from "../../../../public/logo GOWBELL.png"; // Adjust path as needed
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

// const MedalsWinnersList = ({
//   medalsTally,
//   classCutoff,
//   winnersList,
//   schoolName,
//   classId,
//   subjectId,
// }) => {
//   return (
//     <Box
//       sx={{ p: 3, fontFamily: "Arial, sans-serif", backgroundColor: "white" }}
//     >
//       {/* First Row: Logo, Heading, and L-1 Results */}
//       <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//         <Grid item xs={2}>
//           <img src={logo} alt="Logo" width="150px" height="50px" />
//         </Grid>
//         <Grid item xs={8}>
//           <Typography
//             variant="h5"
//             align="center"
//             sx={{
//               fontWeight: "bold",
//               color: "black",
//               fontFamily: "Arial, sans-serif",
//               fontSize: "1.3rem",
//             }}
//           >
//             GOWBELL INTERNATIONAL MATHEMATICS OLYMPIAD (2024-25)
//           </Typography>
//         </Grid>
//         <Grid item xs={2} sx={{ textAlign: "right" }}>
//           <Box
//             sx={{
//               backgroundColor: "#1E3A8A",
//               color: "#FFFFFF",
//               padding: "4px 8px",
//               fontFamily: "Arial, sans-serif",
//               fontWeight: "bold",
//               display: "inline-block",
//             }}
//           >
//             L-1 Results
//           </Box>
//         </Grid>
//       </Grid>

//       <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
//         {/* School Name and Medals Tally */}
//         <Grid item xs={4}>
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: "bold",
//                 color: "#1E3A8A",
//                 mx: "auto",
//                 fontFamily: "Arial, sans-serif",
//                 mb: 1,
//                 fontSize: "1.4rem",
//               }}
//             >
//               {schoolName || "ST. XAVIER PUBLIC SCHOOL"}
//             </Typography>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: "bold",
//                 color: "#000000",
//                 fontFamily: "Arial, sans-serif",
//                 fontSize: "0.8rem",
//                 mx: "auto",
//                 mb: 1,
//               }}
//             >
//               (UNIT-4 BHUBANESWAR-KHORDHA)
//             </Typography>
//             <Box border={1}>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: "bold",
//                   fontFamily: "Arial, sans-serif",
//                   color: "#000000",
//                   textAlign: "center",
//                 }}
//               >
//                 Medals Tally
//               </Typography>
//               <Table
//                 size="small"
//                 sx={{ width: "100%", mx: "auto", border: "none" }}
//               >
//                 <TableBody>
//                   <TableRow>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         fontWeight: "bold",
//                         textAlign: "center",
//                         border: "none",
//                         padding: "4px",
//                       }}
//                     >
//                       MEDALS
//                     </TableCell>
//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         fontWeight: "bold",
//                         textAlign: "center",
//                         border: "none",
//                         padding: "4px",
//                       }}
//                     >
//                       QUANTITY
//                     </TableCell>
//                   </TableRow>
//                   {medalsTally.map((row) => (
//                     <TableRow key={row.medal}>
//                       <TableCell
//                         sx={{
//                           fontFamily: "Arial, sans-serif",
//                           fontWeight: "bold",
//                           border: "none",
//                           textAlign: "center",
//                           padding: "4px",
//                         }}
//                       >
//                         {row.medal}
//                       </TableCell>
//                       <TableCell
//                         align="right"
//                         sx={{
//                           fontFamily: "Arial, sans-serif",
//                           textAlign: "center",
//                           border: "none",
//                           padding: "4px",
//                         }}
//                       >
//                         {row.quantity}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Box>
//         </Grid>

//         <Grid item xs={4}>
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: "bold",
//               fontFamily: "Arial, sans-serif",
//               color: "#000000",
//               textAlign: "center",
//             }}
//           >
//             MEDALS WINNERS LIST
//           </Typography>
//         </Grid>

//         <Grid item xs={4}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               border: "1px solid black",
//               textAlign: "center",
//             }}
//           >
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: "bold",
//                 fontFamily: "Arial, sans-serif",
//                 color: "#000000",
//                 fontSize: "0.95rem",
//               }}
//             >
//               Class and Subject Wise Cutoff Percentage
//             </Typography>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: "bold",
//                 fontFamily: "Arial, sans-serif",
//                 color: "#000000",
//                 fontSize: "0.95rem",
//                 textAlign: "center",
//               }}
//             >
//               Medals
//             </Typography>
//             <Table
//               size="small"
//               sx={{ width: "300px", mx: "auto", border: "none" }}
//             >
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       fontWeight: "bold",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     Class
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       fontWeight: "bold",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     Gold
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       fontWeight: "bold",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     Silver
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontFamily: "Arial, sans-serif",
//                       fontWeight: "bold",
//                       border: "none",
//                       textAlign: "center",
//                       padding: "4px",
//                     }}
//                   >
//                     Bronze
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {classCutoff.map((row) => (
//                   <TableRow key={row.class}>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         border: "none",
//                         padding: "4px",
//                         textAlign: "center",
//                       }}
//                     >
//                       {row.class}
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         border: "none",
//                         padding: "4px",
//                         textAlign: "center",
//                       }}
//                     >
//                       {row.gold}
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         border: "none",
//                         padding: "4px",
//                         textAlign: "center",
//                       }}
//                     >
//                       {row.silver}
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontFamily: "Arial, sans-serif",
//                         border: "none",
//                         padding: "4px",
//                         textAlign: "center",
//                       }}
//                     >
//                       {row.bronze}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Box>
//         </Grid>
//       </Grid>

//       <TableContainer
//         component={Paper}
//         sx={{ py: "20px", borderRadius: "none", boxShadow: "none" }}
//       >
//         <Table sx={{ border: "none" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Sl. No
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Student's Name
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Roll No
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Class
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Full Marks
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Secured Marks
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Percentage
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Ranking
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Medals Achievement
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontFamily: "Arial, sans-serif",
//                   fontWeight: "bold",
//                   border: "none",
//                   textAlign: "center",
//                   padding: "4px",
//                 }}
//               >
//                 Certificate of Achievement
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {winnersList.map((row) => (
//               <TableRow key={row.slNo}>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.slNo}.
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.name}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.rollNo}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.class}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.fullMarks}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.securedMarks}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.percentage}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.ranking}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.medal}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     fontFamily: "Arial, sans-serif",
//                     border: "none",
//                     textAlign: "center",
//                     padding: "4px",
//                   }}
//                 >
//                   {row.certificate}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
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
  schoolAddress,
  subjectName,
  classId,
  subjectId,
  country, // New prop
  state, // New prop
  district, // New prop
  city, // New prop
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
            GOWBELL INTERNATIONAL {subjectName} OLYMPIAD (2024-25)
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
              ({schoolAddress || "N/A"} )
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
              <Table
                size="small"
                sx={{ width: "100%", mx: "auto", border: "none" }}
              >
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
            <Table
              size="small"
              sx={{ width: "300px", mx: "auto", border: "none" }}
            >
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
                Ranking
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
                  {row.ranking}
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
