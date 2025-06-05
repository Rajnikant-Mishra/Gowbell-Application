// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons"; // Assuming icons are imported
// import styles from "./../../CommonTable/DataTable.module.css";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";

// const OmrView = () => {
//   const { id } = useParams(); // Get ID from URL
//   const navigate = useNavigate();
//   const [omrData, setOmrData] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1); // Start at 1 to match pagination logic
//   const [pageSize, setPageSize] = useState(10); // Start at 10 rows per page
//   const pageSizes = [5, 10, 25]; // Define available page sizes

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch OMR data
//         const omrResponse = await axios.get(
//           `${API_BASE_URL}/api/omr/get/${id}`
//         );
//         setOmrData(omrResponse.data);

//         // Fetch all students
//         const studentsResponse = await axios.get(
//           `${API_BASE_URL}/api/get/allstudents`
//         );
//         setStudents(studentsResponse.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch data");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // Helper function to get student data as an array of objects
//   const getStudentData = (studentIds) => {
//     if (!studentIds) return [];
//     let ids;
//     try {
//       // Parse studentIds if it's a JSON string; otherwise, assume it's an array
//       ids =
//         typeof studentIds === "string" ? JSON.parse(studentIds) : studentIds;
//     } catch (e) {
//       return [];
//     }
//     if (!Array.isArray(ids)) return [];
//     return ids
//       .map((id) => {
//         const student = students.find(
//           (s) => s.id === id || s.id.toString() === id
//         );
//         return {
//           id,
//           name: student ? student.student_name : `Unknown (ID: ${id})`,
//         };
//       })
//       .filter((student) => student.name); // Filter out any invalid entries
//   };

//   // Pagination handlers
//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     const totalPages = Math.ceil(studentData.length / pageSize);
//     if (page < totalPages) setPage(page + 1);
//   };

//   if (loading)
//     return (
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <Typography variant="h6" color="text.secondary">
//           Loading...
//         </Typography>
//       </Box>
//     );
//   if (error)
//     return (
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <Typography variant="h6" color="error">
//           {error}
//         </Typography>
//       </Box>
//     );
//   if (!omrData)
//     return (
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <Typography variant="h6" color="text.secondary">
//           No data found
//         </Typography>
//       </Box>
//     );

//   const studentData = getStudentData(omrData.students);
//   const filteredRecords = studentData; // Assuming no filtering for now
//   const currentRecords = studentData.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "OMR Details" }]} />
//         </div>
//       </div>
//       <Box sx={{ p: 4, mx: "auto", mt: -4 }}>
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Typography style={{ color: "black" }}>
//                 <strong>School:</strong>{" "}
//                 <strong>{omrData.school || "N/A"}</strong>
//               </Typography>
//             </Grid>
//             <Grid item xs={12}>
//               <Typography style={{ color: "black" }}>
//                 <strong>Classes:</strong>{" "}
//                 {(() => {
//                   try {
//                     const parsed =
//                       typeof omrData.classes === "string"
//                         ? JSON.parse(omrData.classes)
//                         : omrData.classes;
//                     return Array.isArray(parsed) ? parsed.join(", ") : "None";
//                   } catch (err) {
//                     return "None";
//                   }
//                 })()}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography style={{ color: "black" }}>
//                 <strong>Subjects:</strong>{" "}
//                 {(() => {
//                   try {
//                     const parsed =
//                       typeof omrData.subjects === "string"
//                         ? JSON.parse(omrData.subjects)
//                         : omrData.subjects;
//                     return Array.isArray(parsed) ? parsed.join(", ") : "None";
//                   } catch (err) {
//                     return "None";
//                   }
//                 })()}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               {studentData.length > 0 ? (
//                 <>
//                   <TableContainer
//                     component={Paper}
//                     sx={{ mt: 2, borderRadius: 1 }}
//                   >
//                     <Table sx={{ minWidth: 650 }} aria-label="students table">
//                       <TableHead>
//                         <TableRow sx={{ backgroundColor: "primary.light" }}>
//                           <TableCell
//                             sx={{ fontWeight: "bold", color: "white" }}
//                           >
//                             #
//                           </TableCell>
//                           <TableCell
//                             sx={{ fontWeight: "bold", color: "white" }}
//                           >
//                             Student Name
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {currentRecords.map((student, index) => (
//                           <TableRow
//                             key={index}
//                             sx={{
//                               "&:hover": { backgroundColor: "action.hover" },
//                             }}
//                           >
//                             <TableCell>
//                               {(page - 1) * pageSize + index + 1}
//                             </TableCell>
//                             <TableCell>{student.name}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <div className="d-flex justify-content-between flex-wrap mt-2">
//                     <div
//                       className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//                     >
//                       <select
//                         value={pageSize}
//                         onChange={(e) => {
//                           setPageSize(Number(e.target.value));
//                           setPage(1);
//                         }}
//                         className={styles.pageSizeSelect}
//                       >
//                         {pageSizes.map((size) => (
//                           <option key={size} value={size}>
//                             {size}
//                           </option>
//                         ))}
//                       </select>
//                       <p className="my-auto text-secondary">items per page</p>
//                     </div>

//                     <div className="my-auto">
//                       <p className="text-secondary">
//                         Showing {currentRecords.length} of{" "}
//                         {filteredRecords.length} items
//                       </p>
//                     </div>

//                     <div className={`${styles.pagination} my-auto`}>
//                       <button
//                         onClick={handlePreviousPage}
//                         disabled={page === 1}
//                         className={styles.paginationButton}
//                       >
//                         <UilAngleLeftB />
//                       </button>

//                       {Array.from(
//                         {
//                           length: Math.ceil(filteredRecords.length / pageSize),
//                         },
//                         (_, i) => i + 1
//                       )
//                         .filter(
//                           (pg) =>
//                             pg === 1 ||
//                             pg ===
//                               Math.ceil(filteredRecords.length / pageSize) ||
//                             Math.abs(pg - page) <= 2
//                         )
//                         .map((pg, index, array) => (
//                           <React.Fragment key={pg}>
//                             {index > 0 && pg > array[index - 1] + 1 && (
//                               <span className={styles.ellipsis}>...</span>
//                             )}
//                             <button
//                               onClick={() => setPage(pg)}
//                               className={`${styles.paginationButton} ${
//                                 page === pg ? styles.activePage : ""
//                               }`}
//                             >
//                               {pg}
//                             </button>
//                           </React.Fragment>
//                         ))}

//                       <button
//                         onClick={handleNextPage}
//                         disabled={
//                           page === Math.ceil(filteredRecords.length / pageSize)
//                         }
//                         className={styles.paginationButton}
//                       >
//                         <UilAngleRightB />
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <Typography sx={{ mt: 2 }}>None</Typography>
//               )}
//             </Grid>
//           </Grid>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: 3, borderRadius: 1 }}
//             onClick={() => navigate("/omr-list")}
//           >
//             Back to List
//           </Button>
//         </Paper>
//       </Box>
//     </Mainlayout>
//   );
// };
// export default OmrView;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
// import styles from "./../../CommonTable/DataTable.module.css";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";

// const OmrView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [omrData, setOmrData] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const pageSizes = [5, 10, 25];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const omrResponse = await axios.get(
//           `${API_BASE_URL}/api/omr/get/${id}`
//         );
//         setOmrData(omrResponse.data);

//         const studentsResponse = await axios.get(
//           `${API_BASE_URL}/api/get/allstudents`
//         );
//         setStudents(studentsResponse.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch data");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const getStudentData = (studentIds, classes, subjects) => {
//     if (!studentIds || !classes || !subjects) return [];
//     let ids, parsedClasses, parsedSubjects;
//     try {
//       ids =
//         typeof studentIds === "string" ? JSON.parse(studentIds) : studentIds;
//       parsedClasses =
//         typeof classes === "string" ? JSON.parse(classes) : classes;
//       parsedSubjects =
//         typeof subjects === "string" ? JSON.parse(subjects) : subjects;
//       ``;
//     } catch (e) {
//       return [];
//     }
//     if (
//       !Array.isArray(ids) ||
//       !Array.isArray(parsedClasses) ||
//       !Array.isArray(parsedSubjects)
//     )
//       return [];

//     const studentData = [];
//     const seenCombinations = new Set();

//     ids.forEach((id) => {
//       const student = students.find(
//         (s) => s.id === id || s.id.toString() === id
//       );
//       if (!student) return;

//       // Map class name to class ID
//       const className =
//         student.class_name ||
//         parsedClasses[0]?.name ||
//         parsedClasses[0] ||
//         "Unknown";
//       const classValue =
//         parsedClasses.find(
//           (c) => c === className || (c.name && c.name === className)
//         )?.id || className;

//       // Get subject names and map to subject IDs or names
//       const subjectNames = student.subject_names
//         ? student.subject_names.split(",").map((name) => name.trim())
//         : parsedSubjects;
//       const mappedSubjects = subjectNames
//         .map((name) => {
//           const subject = parsedSubjects.find(
//             (s) => s === name || (s.name && s.name === name)
//           );
//           return subject ? subject.name || subject : name;
//         })
//         .filter(Boolean);

//       // Create unique entries for each subject
//       mappedSubjects.forEach((subject) => {
//         const combinationKey = `${id}-${classValue}-${subject}`;
//         if (!seenCombinations.has(combinationKey)) {
//           studentData.push({
//             id,
//             name: student.student_name,
//             class: classValue,
//             subject,
//           });
//           seenCombinations.add(combinationKey);
//         }
//       });
//     });

//     return studentData.filter((data) => data.name);
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     const totalPages = Math.ceil(studentData.length / pageSize);
//     if (page < totalPages) setPage(page + 1);
//   };

//   if (loading)
//     return (
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <Typography variant="h6" color="text.secondary">
//           Loading...
//         </Typography>
//       </Box>
//     );
//   if (error)
//     return (
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <Typography variant="h6" color="error">
//           {error}
//         </Typography>
//       </Box>
//     );
//   if (!omrData)
//     return (
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <Typography variant="h6" color="text.secondary">
//           No data found
//         </Typography>
//       </Box>
//     );

//   const studentData = getStudentData(
//     omrData.students,
//     omrData.classes,
//     omrData.subjects
//   );
//   const filteredRecords = studentData;
//   const currentRecords = studentData.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "OMR Details" }]} />
//         </div>
//       </div>
//       <Box sx={{ p: 4, mx: "auto", mt: -4 }}>
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Typography style={{ color: "black" }}>
//                 <strong>School:</strong>{" "}
//                 <strong>{omrData.school || "N/A"}</strong>
//               </Typography>
//             </Grid>
//             <Grid item xs={12}>
//               {studentData.length > 0 ? (
//                 <>
//                   <TableContainer
//                     component={Paper}
//                     sx={{ mt: 2, borderRadius: 1 }}
//                   >
//                     <Table sx={{ minWidth: 650 }} aria-label="students table">
//                       <TableHead>
//                         <TableRow sx={{ backgroundColor: "primary.light" }}>
//                           <TableCell
//                             sx={{ fontWeight: "bold", color: "white" }}
//                           >
//                             #
//                           </TableCell>
//                           <TableCell
//                             sx={{ fontWeight: "bold", color: "white" }}
//                           >
//                             Student Name
//                           </TableCell>
//                           <TableCell
//                             sx={{ fontWeight: "bold", color: "white" }}
//                           >
//                             Class
//                           </TableCell>
//                           <TableCell
//                             sx={{ fontWeight: "bold", color: "white" }}
//                           >
//                             Subject
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {currentRecords.map((student, index) => (
//                           <TableRow
//                             key={`${student.id}-${student.class}-${student.subject}`}
//                             sx={{
//                               "&:hover": { backgroundColor: "action.hover" },
//                             }}
//                           >
//                             <TableCell>
//                               {(page - 1) * pageSize + index + 1}
//                             </TableCell>
//                             <TableCell>{student.name}</TableCell>
//                             <TableCell>{student.class}</TableCell>
//                             <TableCell>{student.subject}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <div className="d-flex justify-content-between flex-wrap mt-2">
//                     <div
//                       className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//                     >
//                       <select
//                         value={pageSize}
//                         onChange={(e) => {
//                           setPageSize(Number(e.target.value));
//                           setPage(1);
//                         }}
//                         className={styles.pageSizeSelect}
//                       >
//                         {pageSizes.map((size) => (
//                           <option key={size} value={size}>
//                             {size}
//                           </option>
//                         ))}
//                       </select>
//                       <p className="my-auto text-secondary">items per page</p>
//                     </div>
//                     <div className="my-auto">
//                       <p className="text-secondary">
//                         Showing {currentRecords.length} of{" "}
//                         {filteredRecords.length} items
//                       </p>
//                     </div>
//                     <div className={`${styles.pagination} my-auto`}>
//                       <button
//                         onClick={handlePreviousPage}
//                         disabled={page === 1}
//                         className={styles.paginationButton}
//                       >
//                         <UilAngleLeftB />
//                       </button>
//                       {Array.from(
//                         {
//                           length: Math.ceil(filteredRecords.length / pageSize),
//                         },
//                         (_, i) => i + 1
//                       )
//                         .filter(
//                           (pg) =>
//                             pg === 1 ||
//                             pg ===
//                               Math.ceil(filteredRecords.length / pageSize) ||
//                             Math.abs(pg - page) <= 2
//                         )
//                         .map((pg, index, array) => (
//                           <React.Fragment key={pg}>
//                             {index > 0 && pg > array[index - 1] + 1 && (
//                               <span className={styles.ellipsis}>...</span>
//                             )}
//                             <button
//                               onClick={() => setPage(pg)}
//                               className={`${styles.paginationButton} ${
//                                 page === pg ? styles.activePage : ""
//                               }`}
//                             >
//                               {pg}
//                             </button>
//                           </React.Fragment>
//                         ))}
//                       <button
//                         onClick={handleNextPage}
//                         disabled={
//                           page === Math.ceil(filteredRecords.length / pageSize)
//                         }
//                         className={styles.paginationButton}
//                       >
//                         <UilAngleRightB />
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <Typography sx={{ mt: 2 }}>None</Typography>
//               )}
//             </Grid>
//           </Grid>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: 3, borderRadius: 1 }}
//             onClick={() => navigate("/omr-list")}
//           >
//             Back to List
//           </Button>
//         </Paper>
//       </Box>
//     </Mainlayout>
//   );
// };

// export default OmrView;

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Box, Button, Typography } from "@mui/material";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";

const OmrView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [omrData, setOmrData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 25];
  const gridApiRef = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const omrResponse = await axios.get(
          `${API_BASE_URL}/api/omr/get/${id}`
        );
        setOmrData(omrResponse.data);

        const studentsResponse = await axios.get(
          `${API_BASE_URL}/api/get/allstudents`
        );
        setStudents(studentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStudentData = (studentIds, classes, subjects) => {
    if (!studentIds || !classes || !subjects) return [];
    let ids, parsedClasses, parsedSubjects;
    try {
      ids =
        typeof studentIds === "string" ? JSON.parse(studentIds) : studentIds;
      parsedClasses =
        typeof classes === "string" ? JSON.parse(classes) : classes;
      parsedSubjects =
        typeof subjects === "string" ? JSON.parse(subjects) : subjects;
    } catch (e) {
      return [];
    }
    if (
      !Array.isArray(ids) ||
      !Array.isArray(parsedClasses) ||
      !Array.isArray(parsedSubjects)
    )
      return [];

    const studentData = [];
    const seenCombinations = new Set();

    ids.forEach((id) => {
      const student = students.find(
        (s) => s.id === id || s.id.toString() === id
      );
      if (!student) return;

      const className =
        student.class_name ||
        parsedClasses[0]?.name ||
        parsedClasses[0] ||
        "Unknown";
      const classValue =
        parsedClasses.find(
          (c) => c === className || (c.name && c.name === className)
        )?.id || className;

      const subjectNames = student.subject_names
        ? student.subject_names.split(",").map((name) => name.trim())
        : parsedSubjects;
      const mappedSubjects = subjectNames
        .map((name) => {
          const subject = parsedSubjects.find(
            (s) => s === name || (s.name && s.name === name)
          );
          return subject ? subject.name || subject : name;
        })
        .filter(Boolean);

      mappedSubjects.forEach((subject) => {
        const combinationKey = `${id}-${classValue}-${subject}`;
        if (!seenCombinations.has(combinationKey)) {
          studentData.push({
            id,
            name: student.student_name,
            class: classValue,
            subject,
          });
          seenCombinations.add(combinationKey);
        }
      });
    });

    return studentData.filter((data) => data.name);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(studentData.length / pageSize);
    if (page < totalPages) setPage(page + 1);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "#",
        valueGetter: (params) =>
          params.node.rowIndex + 1 + (page - 1) * pageSize,
        width: 80,
        sortable: false,
        filter: false,
      },
      {
        headerName: "STUDENT NAME",
        field: "name",
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "CLASS",
        field: "class",
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "SUBJECT",
        field: "subject",
        sortable: true,
        filter: "agTextColumnFilter",
      },
    ],
    [page, pageSize]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 100,
      flex: 1,
      suppressFilterResetOnColumnChange: true,
    }),
    []
  );

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.autoSizeAllColumns();
  };

  const customTheme = {
    "--ag-font-size": "14px",
    "--ag-row-height": "40px",
    "--ag-header-background-color": "#1230AE",
    "--ag-header-foreground-color": "#FFFFFF",
    "--ag-grid-size": "6px",
    "--ag-cell-horizontal-padding": "8px",
    fontFamily: "'Poppins', sans-serif",
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  if (!omrData)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No data found
        </Typography>
      </Box>
    );

  const studentData = getStudentData(
    omrData.students,
    omrData.classes,
    omrData.subjects
  );
  const currentRecords = studentData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Mainlayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "OMR", link: "/omr-list" }, { name: "OMR Details" }]}
          />
        </div>
      </div>
      <Box sx={{ p: 4, mx: "auto", mt: -4 }}>
        <div
          style={{
            background: "white",
            padding: "1.5%",
            borderRadius: "5px",
            marginTop: "0",
          }}
        >
          <Typography style={{ color: "black", marginBottom: "16px" }}>
            <strong>School:</strong> <strong>{omrData.school || "N/A"}</strong>
          </Typography>
          {studentData.length > 0 ? (
            <>
              <div
                className="ag-theme-alpine"
                style={{ height: "500px", width: "100%", overflowX: "auto" }}
              >
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={currentRecords}
                  onGridReady={onGridReady}
                  defaultColDef={defaultColDef}
                  pagination={false}
                  suppressPaginationPanel={true}
                  animateRows={true}
                  domLayout="autoHeight"
                  theme={customTheme}
                  suppressClearFilterOnColumnChange={true}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  marginTop: "-15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const selectedSize = parseInt(e.target.value, 10);
                      setPageSize(selectedSize);
                      setPage(1);
                    }}
                    style={{
                      width: "55px",
                      padding: "0px 5px",
                      height: "30px",
                      fontSize: "14px",
                      border: "1px solid rgb(225, 220, 220)",
                      borderRadius: "2px",
                      color: "#564545",
                      fontWeight: "bold",
                      outline: "none",
                      transition: "all 0.3s ease",
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    {pageSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <p
                    style={{
                      margin: "auto",
                      color: "#6C757D",
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "14px",
                    }}
                  >
                    items per Page
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "auto",
                  }}
                >
                  <p
                    style={{
                      margin: "auto",
                      color: "#6C757D",
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "14px",
                    }}
                  >
                    Showing {currentRecords.length} of {studentData.length}{" "}
                    items
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    style={{
                      backgroundColor: page === 1 ? "#E0E0E0" : "#F5F5F5",
                      color: page === 1 ? "#aaa" : "#333",
                      border: "1px solid #ccc",
                      borderRadius: "7px",
                      padding: "3px 3.5px",
                      width: "33px",
                      height: "30px",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      margin: "0 4px",
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    <UilAngleLeftB />
                  </button>
                  {Array.from(
                    {
                      length: Math.ceil(studentData.length / pageSize),
                    },
                    (_, i) => i + 1
                  )
                    .filter(
                      (pg) =>
                        pg === 1 ||
                        pg === Math.ceil(studentData.length / pageSize) ||
                        Math.abs(pg - page) <= 2
                    )
                    .map((pg, index, array) => (
                      <React.Fragment key={pg}>
                        {index > 0 && pg > array[index - 1] + 1 && (
                          <span
                            style={{
                              color: "#aaa",
                              fontSize: "14px",
                              fontFamily: '"Poppins", sans-serif',
                            }}
                          >
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setPage(pg)}
                          style={{
                            backgroundColor:
                              page === pg ? "#007BFF" : "#F5F5F5",
                            color: page === pg ? "#fff" : "#333",
                            border:
                              page === pg
                                ? "1px solid #0056B3"
                                : "1px solid #ccc",
                            borderRadius: "7px",
                            padding: "4px 13.5px",
                            height: "30px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            margin: "0 4px",
                            fontWeight: page === pg ? "bold" : "normal",
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: "14px",
                          }}
                        >
                          {pg}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={handleNextPage}
                    disabled={page === Math.ceil(studentData.length / pageSize)}
                    style={{
                      backgroundColor:
                        page === Math.ceil(studentData.length / pageSize)
                          ? "#E0E0E0"
                          : "#F5F5F5",
                      color:
                        page === Math.ceil(studentData.length / pageSize)
                          ? "#aaa"
                          : "#333",
                      border: "1px solid #ccc",
                      borderRadius: "7px",
                      padding: "3px 3.5px",
                      width: "33px",
                      height: "30px",
                      cursor:
                        page === Math.ceil(studentData.length / pageSize)
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.3s ease",
                      margin: "0 4px",
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    <UilAngleRightB />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Typography sx={{ mt: 2 }}>None</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, borderRadius: 1 }}
            onClick={() => navigate("/omr-list")}
          >
            Back to List
          </Button>
        </div>
      </Box>
    </Mainlayout>
  );
};

export default OmrView;
