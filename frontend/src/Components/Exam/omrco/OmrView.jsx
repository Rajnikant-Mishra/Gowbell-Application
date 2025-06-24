// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Box, Button, Typography } from "@mui/material";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
// import axios from "axios";
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
//   const gridApiRef = React.useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
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

//       const className =
//         student.class_name ||
//         parsedClasses[0]?.name ||
//         parsedClasses[0] ||
//         "Unknown";
//       const classValue =
//         parsedClasses.find(
//           (c) => c === className || (c.name && c.name === className)
//         )?.id || className;

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

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "#",
//         valueGetter: (params) =>
//           params.node.rowIndex + 1 + (page - 1) * pageSize,
//         width: 80,
//         sortable: false,
//         filter: false,
//       },
//       {
//         headerName: "STUDENT NAME",
//         field: "name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "CLASS",
//         field: "class",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "SUBJECT",
//         field: "subject",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//     ],
//     [page, pageSize]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       flex: 1,
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
//   );

//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.autoSizeAllColumns();
//   };

//   const customTheme = {
//     "--ag-font-size": "14px",
//     "--ag-row-height": "40px",
//     "--ag-header-background-color": "#1230AE",
//     "--ag-header-foreground-color": "#FFFFFF",
//     "--ag-grid-size": "6px",
//     "--ag-cell-horizontal-padding": "8px",
//     fontFamily: "'Poppins', sans-serif",
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
//     omrData.subjects,
//     omrData.level,
//   );
//   const currentRecords = studentData.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   return (
//     <Mainlayout>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "16px",
//         }}
//       >
//         <div role="presentation">
//           <Breadcrumb
//             data={[{ name: "OMR", link: "/omr-list" }, { name: "OMR Details" }]}
//           />
//         </div>
//       </div>
//       <Box sx={{ p: 4, mx: "auto", mt: -4 }}>
//         <div
//           style={{
//             background: "white",
//             padding: "1.5%",
//             borderRadius: "5px",
//             marginTop: "0",
//           }}
//         >
//           <Typography style={{ color: "black", marginBottom: "16px" }}>
//             <strong>School:</strong> <strong>{omrData.school || "N/A"}</strong>
//           </Typography>
//           {studentData.length > 0 ? (
//             <>
//               <div
//                 className="ag-theme-alpine"
//                 style={{ height: "500px", width: "100%", overflowX: "auto" }}
//               >
//                 <AgGridReact
//                   columnDefs={columnDefs}
//                   rowData={currentRecords}
//                   onGridReady={onGridReady}
//                   defaultColDef={defaultColDef}
//                   pagination={false}
//                   suppressPaginationPanel={true}
//                   animateRows={true}
//                   domLayout="autoHeight"
//                   theme={customTheme}
//                   suppressClearFilterOnColumnChange={true}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   marginTop: "-15px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     alignItems: "center",
//                     gap: "10px",
//                   }}
//                 >
//                   <select
//                     value={pageSize}
//                     onChange={(e) => {
//                       const selectedSize = parseInt(e.target.value, 10);
//                       setPageSize(selectedSize);
//                       setPage(1);
//                     }}
//                     style={{
//                       width: "55px",
//                       padding: "0px 5px",
//                       height: "30px",
//                       fontSize: "14px",
//                       border: "1px solid rgb(225, 220, 220)",
//                       borderRadius: "2px",
//                       color: "#564545",
//                       fontWeight: "bold",
//                       outline: "none",
//                       transition: "all 0.3s ease",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     {pageSizes.map((size) => (
//                       <option key={size} value={size}>
//                         {size}
//                       </option>
//                     ))}
//                   </select>
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: '"Poppins", sans-serif',
//                       fontSize: "14px",
//                     }}
//                   >
//                     items per Page
//                   </p>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     margin: "auto",
//                   }}
//                 >
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: '"Poppins", sans-serif',
//                       fontSize: "14px",
//                     }}
//                   >
//                     Showing {currentRecords.length} of {studentData.length}{" "}
//                     items
//                   </p>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <button
//                     onClick={handlePreviousPage}
//                     disabled={page === 1}
//                     style={{
//                       backgroundColor: page === 1 ? "#E0E0E0" : "#F5F5F5",
//                       color: page === 1 ? "#aaa" : "#333",
//                       border: "1px solid #ccc",
//                       borderRadius: "7px",
//                       padding: "3px 3.5px",
//                       width: "33px",
//                       height: "30px",
//                       cursor: page === 1 ? "not-allowed" : "pointer",
//                       transition: "all 0.3s ease",
//                       margin: "0 4px",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     <UilAngleLeftB />
//                   </button>
//                   {Array.from(
//                     {
//                       length: Math.ceil(studentData.length / pageSize),
//                     },
//                     (_, i) => i + 1
//                   )
//                     .filter(
//                       (pg) =>
//                         pg === 1 ||
//                         pg === Math.ceil(studentData.length / pageSize) ||
//                         Math.abs(pg - page) <= 2
//                     )
//                     .map((pg, index, array) => (
//                       <React.Fragment key={pg}>
//                         {index > 0 && pg > array[index - 1] + 1 && (
//                           <span
//                             style={{
//                               color: "#aaa",
//                               fontSize: "14px",
//                               fontFamily: '"Poppins", sans-serif',
//                             }}
//                           >
//                             ...
//                           </span>
//                         )}
//                         <button
//                           onClick={() => setPage(pg)}
//                           style={{
//                             backgroundColor:
//                               page === pg ? "#007BFF" : "#F5F5F5",
//                             color: page === pg ? "#fff" : "#333",
//                             border:
//                               page === pg
//                                 ? "1px solid #0056B3"
//                                 : "1px solid #ccc",
//                             borderRadius: "7px",
//                             padding: "4px 13.5px",
//                             height: "30px",
//                             cursor: "pointer",
//                             transition: "all 0.3s ease",
//                             margin: "0 4px",
//                             fontWeight: page === pg ? "bold" : "normal",
//                             fontFamily: '"Poppins", sans-serif',
//                             fontSize: "14px",
//                           }}
//                         >
//                           {pg}
//                         </button>
//                       </React.Fragment>
//                     ))}
//                   <button
//                     onClick={handleNextPage}
//                     disabled={page === Math.ceil(studentData.length / pageSize)}
//                     style={{
//                       backgroundColor:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "#E0E0E0"
//                           : "#F5F5F5",
//                       color:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "#aaa"
//                           : "#333",
//                       border: "1px solid #ccc",
//                       borderRadius: "7px",
//                       padding: "3px 3.5px",
//                       width: "33px",
//                       height: "30px",
//                       cursor:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "not-allowed"
//                           : "pointer",
//                       transition: "all 0.3s ease",
//                       margin: "0 4px",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     <UilAngleRightB />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <Typography sx={{ mt: 2 }}>None</Typography>
//           )}
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: 3, borderRadius: 1 }}
//             onClick={() => navigate("/omr-list")}
//           >
//             Back to List
//           </Button>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// };
// export default OmrView;

// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Box, Button, Typography } from "@mui/material";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
// import axios from "axios";
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
//   const gridApiRef = React.useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
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

//   const getStudentData = (studentIds, classes, subjects, level) => {
//     if (!studentIds || !classes || !subjects) return [];
//     let ids, parsedClasses, parsedSubjects;
//     try {
//       ids =
//         typeof studentIds === "string" ? JSON.parse(studentIds) : studentIds;
//       parsedClasses =
//         typeof classes === "string" ? JSON.parse(classes) : classes;
//       parsedSubjects =
//         typeof subjects === "string" ? JSON.parse(subjects) : subjects;
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

//       const className =
//         student.class_name ||
//         parsedClasses[0]?.name ||
//         parsedClasses[0] ||
//         "Unknown";
//       const classValue =
//         parsedClasses.find(
//           (c) => c === className || (c.name && c.name === className)
//         )?.id || className;

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

//       mappedSubjects.forEach((subject) => {
//         const combinationKey = `${id}-${classValue}-${subject}`;
//         if (!seenCombinations.has(combinationKey)) {
//           studentData.push({
//             id,
//             name: student.student_name,
//             roll_no: student.roll_no || "N/A",
//             class: classValue,
//             subject,
//             level: level || "N/A",
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

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "#",
//         valueGetter: (params) =>
//           params.node.rowIndex + 1 + (page - 1) * pageSize,
//         width: 80,
//         sortable: false,
//         filter: false,
//       },
//       {
//         headerName: "STUDENT NAME",
//         field: "name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "ROLL NO",
//         field: "roll_no",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "CLASS",
//         field: "class",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "SUBJECT",
//         field: "subject",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "LEVEL",
//         field: "level",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         width: 120,
//         cellRenderer: (params) => (
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={() => navigate(`/student/${params.data.id}`)}
//             sx={{ minWidth: "80px" }}
//           >
//             Download
//           </Button>
//         ),
//       },
//     ],
//     [page, pageSize, navigate]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       flex: 1,
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
//   );

//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.autoSizeAllColumns();
//   };

//   const customTheme = {
//     "--ag-font-size": "14px",
//     "--ag-row-height": "40px",
//     "--ag-header-background-color": "#1230AE",
//     "--ag-header-foreground-color": "#FFFFFF",
//     "--ag-grid-size": "6px",
//     "--ag-cell-horizontal-padding": "8px",
//     fontFamily: "'Poppins', sans-serif",
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
//     omrData.subjects,
//     omrData.level
//   );
//   const currentRecords = studentData.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   return (
//     <Mainlayout>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "16px",
//         }}
//       >
//         <div role="presentation">
//           <Breadcrumb
//             data={[{ name: "OMR", link: "/omr-list" }, { name: "OMR Details" }]}
//           />
//         </div>
//       </div>
//       <Box sx={{ p: 4, mx: "auto", mt: -4 }}>
//         <div
//           style={{
//             background: "white",
//             padding: "1.5%",
//             borderRadius: "5px",
//             marginTop: "0",
//           }}
//         >
//           <Typography style={{ color: "black", marginBottom: "16px" }}>
//             <strong>School:</strong> <strong>{omrData.school || "N/A"}</strong>
//           </Typography>
//           {studentData.length > 0 ? (
//             <>
//               <div
//                 className="ag-theme-alpine"
//                 style={{ height: "500px", width: "100%", overflowX: "auto" }}
//               >
//                 <AgGridReact
//                   columnDefs={columnDefs}
//                   rowData={currentRecords}
//                   onGridReady={onGridReady}
//                   defaultColDef={defaultColDef}
//                   pagination={false}
//                   suppressPaginationPanel={true}
//                   animateRows={true}
//                   domLayout="autoHeight"
//                   theme={customTheme}
//                   suppressClearFilterOnColumnChange={true}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   marginTop: "-15px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     alignItems: "center",
//                     gap: "10px",
//                   }}
//                 >
//                   <select
//                     value={pageSize}
//                     onChange={(e) => {
//                       const selectedSize = parseInt(e.target.value, 10);
//                       setPageSize(selectedSize);
//                       setPage(1);
//                     }}
//                     style={{
//                       width: "55px",
//                       padding: "0px 5px",
//                       height: "30px",
//                       fontSize: "14px",
//                       border: "1px solid rgb(225, 220, 220)",
//                       borderRadius: "2px",
//                       color: "#564545",
//                       fontWeight: "bold",
//                       outline: "none",
//                       transition: "all 0.3s ease",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     {pageSizes.map((size) => (
//                       <option key={size} value={size}>
//                         {size}
//                       </option>
//                     ))}
//                   </select>
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: '"Poppins", sans-serif',
//                       fontSize: "14px",
//                     }}
//                   >
//                     items per Page
//                   </p>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     margin: "auto",
//                   }}
//                 >
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: '"Poppins", sans-serif',
//                       fontSize: "14px",
//                     }}
//                   >
//                     Showing {currentRecords.length} of {studentData.length}{" "}
//                     items
//                   </p>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <button
//                     onClick={handlePreviousPage}
//                     disabled={page === 1}
//                     style={{
//                       backgroundColor: page === 1 ? "#E0E0E0" : "#F5F5F5",
//                       color: page === 1 ? "#aaa" : "#333",
//                       border: "1px solid #ccc",
//                       borderRadius: "7px",
//                       padding: "3px 3.5px",
//                       width: "33px",
//                       height: "30px",
//                       cursor: page === 1 ? "not-allowed" : "pointer",
//                       transition: "all 0.3s ease",
//                       margin: "0 4px",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     <UilAngleLeftB />
//                   </button>
//                   {Array.from(
//                     {
//                       length: Math.ceil(studentData.length / pageSize),
//                     },
//                     (_, i) => i + 1
//                   )
//                     .filter(
//                       (pg) =>
//                         pg === 1 ||
//                         pg === Math.ceil(studentData.length / pageSize) ||
//                         Math.abs(pg - page) <= 2
//                     )
//                     .map((pg, index, array) => (
//                       <React.Fragment key={pg}>
//                         {index > 0 && pg > array[index - 1] + 1 && (
//                           <span
//                             style={{
//                               color: "#aaa",
//                               fontSize: "14px",
//                               fontFamily: '"Poppins", sans-serif',
//                             }}
//                           >
//                             ...
//                           </span>
//                         )}
//                         <button
//                           onClick={() => setPage(pg)}
//                           style={{
//                             backgroundColor:
//                               page === pg ? "#007BFF" : "#F5F5F5",
//                             color: page === pg ? "#fff" : "#333",
//                             border:
//                               page === pg
//                                 ? "1px solid #0056B3"
//                                 : "1px solid #ccc",
//                             borderRadius: "7px",
//                             padding: "4px 13.5px",
//                             height: "30px",
//                             cursor: "pointer",
//                             transition: "all 0.3s ease",
//                             margin: "0 4px",
//                             fontWeight: page === pg ? "bold" : "normal",
//                             fontFamily: '"Poppins", sans-serif',
//                             fontSize: "14px",
//                           }}
//                         >
//                           {pg}
//                         </button>
//                       </React.Fragment>
//                     ))}
//                   <button
//                     onClick={handleNextPage}
//                     disabled={page === Math.ceil(studentData.length / pageSize)}
//                     style={{
//                       backgroundColor:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "#E0E0E0"
//                           : "#F5F5F5",
//                       color:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "#aaa"
//                           : "#333",
//                       border: "1px solid #ccc",
//                       borderRadius: "7px",
//                       padding: "3px 3.5px",
//                       width: "33px",
//                       height: "30px",
//                       cursor:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "not-allowed"
//                           : "pointer",
//                       transition: "all 0.3s ease",
//                       margin: "0 4px",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     <UilAngleRightB />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <Typography sx={{ mt: 2 }}>None</Typography>
//           )}
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: 3, borderRadius: 1 }}
//             onClick={() => navigate("/omr-list")}
//           >
//             Back to List
//           </Button>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// };

// export default OmrView;

//========================

// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Box, Button, Typography } from "@mui/material";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import OMRSheet50 from "./OMRSheet50";
// import OMRSheet60 from "./OMRSheet60";

// const OmrView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [omrData, setOmrData] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [classData, setClassData] = useState([]); // New state for class API data
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const pageSizes = [5, 10, 25];
//   const gridApiRef = React.useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch OMR data
//         const omrResponse = await axios.get(
//           `${API_BASE_URL}/api/omr/get/${id}`
//         );
//         setOmrData(omrResponse.data);

//         // Fetch student data
//         const studentsResponse = await axios.get(
//           `${API_BASE_URL}/api/get/allstudents`
//         );
//         setStudents(studentsResponse.data);

//         // Fetch class data
//         const classResponse = await axios.get(`${API_BASE_URL}/api/class`);
//         setClassData(classResponse.data);

//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch data");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const getStudentData = (studentIds, classes, subjects, level) => {
//     if (!studentIds || !subjects) return [];
//     let ids, parsedClasses, parsedSubjects;
//     try {
//       ids =
//         typeof studentIds === "string" ? JSON.parse(studentIds) : studentIds;
//       parsedClasses = classes
//         ? typeof classes === "string"
//           ? JSON.parse(classes)
//           : classes
//         : [];
//       parsedSubjects =
//         typeof subjects === "string" ? JSON.parse(subjects) : subjects;
//     } catch (e) {
//       return [];
//     }
//     if (!Array.isArray(ids) || !Array.isArray(parsedSubjects)) return [];

//     const studentData = [];
//     const seenCombinations = new Set();

//     ids.forEach((id) => {
//       const student = students.find(
//         (s) => s.id === id || s.id.toString() === id
//       );
//       if (!student) return;

//       // Step 1: Determine className and classValue
//       let className = "Unknown";
//       let classValue = "Unknown";

//       // Prioritize classData from API
//       if (
//         classData.length > 0 &&
//         classData.every((c) => typeof c === "object" && c.id && c.name)
//       ) {
//         if (student.class_id) {
//           const matchedClass = classData.find(
//             (c) =>
//               c.id === student.class_id ||
//               c.id.toString() === student.class_id.toString()
//           );
//           if (matchedClass) {
//             className = matchedClass.name;
//             classValue = matchedClass.id;
//           } else {
//             // Fallback to student.class_name or first class in classData
//             className = student.class_name || classData[0].name || "Unknown";
//             classValue = student.class_name || classData[0].id || "Unknown";
//           }
//         } else if (student.class_name) {
//           const matchedClass = classData.find(
//             (c) => c.name.toLowerCase() === student.class_name.toLowerCase()
//           );
//           if (matchedClass) {
//             className = matchedClass.name;
//             classValue = matchedClass.id;
//           } else {
//             className = student.class_name || classData[0].name || "Unknown";
//             classValue = student.class_name || classData[0].id || "Unknown";
//           }
//         } else {
//           className = classData[0].name || "Unknown";
//           classValue = classData[0].id || "Unknown";
//         }
//       } else if (parsedClasses.length > 0) {
//         // Fallback to omrData.classes if classData is unavailable
//         const isClassObjectArray = parsedClasses.every(
//           (c) => typeof c === "object" && c.id && c.name
//         );
//         if (isClassObjectArray) {
//           if (student.class_id) {
//             const matchedClass = parsedClasses.find(
//               (c) =>
//                 c.id === student.class_id ||
//                 c.id.toString() === student.class_id.toString()
//             );
//             if (matchedClass) {
//               className = matchedClass.name;
//               classValue = matchedClass.id;
//             } else {
//               className =
//                 student.class_name || parsedClasses[0].name || "Unknown";
//               classValue =
//                 student.class_name || parsedClasses[0].id || "Unknown";
//             }
//           } else if (student.class_name) {
//             const matchedClass = parsedClasses.find(
//               (c) => c.name.toLowerCase() === student.class_name.toLowerCase()
//             );
//             if (matchedClass) {
//               className = matchedClass.name;
//               classValue = matchedClass.id;
//             } else {
//               className =
//                 student.class_name || parsedClasses[0].name || "Unknown";
//               classValue =
//                 student.class_name || parsedClasses[0].id || "Unknown";
//             }
//           } else {
//             className = parsedClasses[0].name || "Unknown";
//             classValue = parsedClasses[0].id || "Unknown";
//           }
//         } else {
//           // parsedClasses is an array of strings
//           className = student.class_name || parsedClasses[0] || "Unknown";
//           classValue = className;
//         }
//       } else {
//         // No classData or parsedClasses, use student.class_name
//         className = student.class_name || "Unknown";
//         classValue = className;
//       }

//       // Step 2: Handle subjects
//       const subjectNames = student.subject_names
//         ? student.subject_names.split(",").map((name) => name.trim())
//         : parsedSubjects;
//       const mappedSubjects = subjectNames
//         .map((name) => {
//           const subject = parsedSubjects.find(
//             (s) =>
//               s === name ||
//               (s.name && s.name.toLowerCase() === name.toLowerCase())
//           );
//           return subject ? subject.name || subject : name;
//         })
//         .filter(Boolean);

//       // Step 3: Create student data entries
//       mappedSubjects.forEach((subject) => {
//         const combinationKey = `${id}-${classValue}-${subject}`;
//         if (!seenCombinations.has(combinationKey)) {
//           studentData.push({
//             id,
//             name: student.student_name,
//             roll_no: student.roll_no || "N/A",
//             class: classValue, // Use classValue (ID if available, else name)
//             subject,
//             level: level || "N/A",
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

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "#",
//         valueGetter: (params) =>
//           params.node.rowIndex + 1 + (page - 1) * pageSize,
//         width: 80,
//         sortable: false,
//         filter: false,
//       },
//       {
//         headerName: "STUDENT NAME",
//         field: "name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "ROLL NO",
//         field: "roll_no",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "CLASS",
//         field: "class",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         valueFormatter: (params) => {
//           const classValue = params.value;
//           // Prioritize classData from API
//           if (
//             classData.length > 0 &&
//             classData.every((c) => typeof c === "object" && c.id && c.name)
//           ) {
//             const matchedClass = classData.find(
//               (c) =>
//                 c.id === classValue || c.id.toString() === classValue.toString()
//             );
//             return matchedClass ? matchedClass.name : classValue;
//           }
//           // Fallback to omrData.classes
//           const parsedClasses = omrData?.classes
//             ? typeof omrData.classes === "string"
//               ? JSON.parse(omrData.classes)
//               : omrData.classes
//             : [];
//           if (
//             parsedClasses.length > 0 &&
//             parsedClasses.every((c) => typeof c === "object" && c.id && c.name)
//           ) {
//             const matchedClass = parsedClasses.find(
//               (c) =>
//                 c.id === classValue || c.id.toString() === classValue.toString()
//             );
//             return matchedClass ? matchedClass.name : classValue;
//           }
//           return classValue; // If no object array, classValue is the name
//         },
//       },
//       {
//         headerName: "SUBJECT",
//         field: "subject",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "LEVEL",
//         field: "level",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         width: 120,
//         cellRenderer: (params) => (
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={() => navigate(``)}
//             sx={{ minWidth: "80px" }}
//           >
//             Download
//           </Button>
//         ),
//       },
//     ],
//     [page, pageSize, navigate, omrData, classData]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       flex: 1,
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
//   );

//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.autoSizeAllColumns();
//   };

//   const customTheme = {
//     "--ag-font-size": "14px",
//     "--ag-row-height": "40px",
//     "--ag-header-background-color": "#1230AE",
//     "--ag-header-foreground-color": "#FFFFFF",
//     "--ag-grid-size": "6px",
//     "--ag-cell-horizontal-padding": "8px",
//     fontFamily: "'Poppins', sans-serif",
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
//     omrData.subjects,
//     omrData.level
//   );
//   const currentRecords = studentData.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   return (
//     <Mainlayout>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "16px",
//         }}
//       >
//         <div role="presentation">
//           <Breadcrumb
//             data={[{ name: "OMR", link: "/omr-list" }, { name: "OMR Details" }]}
//           />
//         </div>
//       </div>
//       <Box sx={{ p: 4, mx: "auto", mt: -4 }}>
//         <div
//           style={{
//             background: "white",
//             padding: "1.5%",
//             borderRadius: "5px",
//             marginTop: "0",
//           }}
//         >
//           <Typography style={{ color: "black", marginBottom: "16px" }}>
//             <strong>School:</strong> <strong>{omrData.school || "N/A"}</strong>
//           </Typography>
//           {studentData.length > 0 ? (
//             <>
//               <div
//                 className="ag-theme-alpine"
//                 style={{ height: "500px", width: "100%", overflowX: "auto" }}
//               >
//                 <AgGridReact
//                   columnDefs={columnDefs}
//                   rowData={currentRecords}
//                   onGridReady={onGridReady}
//                   defaultColDef={defaultColDef}
//                   pagination={false}
//                   suppressPaginationPanel={true}
//                   animateRows={true}
//                   domLayout="autoHeight"
//                   theme={customTheme}
//                   suppressClearFilterOnColumnChange={true}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   marginTop: "-15px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     alignItems: "center",
//                     gap: "10px",
//                   }}
//                 >
//                   <select
//                     value={pageSize}
//                     onChange={(e) => {
//                       const selectedSize = parseInt(e.target.value, 10);
//                       setPageSize(selectedSize);
//                       setPage(1);
//                     }}
//                     style={{
//                       width: "55px",
//                       padding: "0px 5px",
//                       height: "30px",
//                       fontSize: "14px",
//                       border: "1px solid rgb(225, 220, 220)",
//                       borderRadius: "2px",
//                       color: "#564545",
//                       fontWeight: "bold",
//                       outline: "none",
//                       transition: "all 0.3s ease",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     {pageSizes.map((size) => (
//                       <option key={size} value={size}>
//                         {size}
//                       </option>
//                     ))}
//                   </select>
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: '"Poppins", sans-serif',
//                       fontSize: "14px",
//                     }}
//                   >
//                     items per Page
//                   </p>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     margin: "auto",
//                   }}
//                 >
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: '"Poppins", sans-serif',
//                       fontSize: "14px",
//                     }}
//                   >
//                     Showing {currentRecords.length} of {studentData.length}{" "}
//                     items
//                   </p>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <button
//                     onClick={handlePreviousPage}
//                     disabled={page === 1}
//                     style={{
//                       backgroundColor: page === 1 ? "#E0E0E0" : "#F5F5F5",
//                       color: page === 1 ? "#aaa" : "#333",
//                       border: "1px solid #ccc",
//                       borderRadius: "7px",
//                       padding: "3px 3.5px",
//                       width: "33px",
//                       height: "30px",
//                       cursor: page === 1 ? "not-allowed" : "pointer",
//                       transition: "all 0.3s ease",
//                       margin: "0 4px",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     <UilAngleLeftB />
//                   </button>
//                   {Array.from(
//                     { length: Math.ceil(studentData.length / pageSize) },
//                     (_, i) => i + 1
//                   )
//                     .filter(
//                       (pg) =>
//                         pg === 1 ||
//                         pg === Math.ceil(studentData.length / pageSize) ||
//                         Math.abs(pg - page) <= 2
//                     )
//                     .map((pg, index, array) => (
//                       <React.Fragment key={pg}>
//                         {index > 0 && pg > array[index - 1] + 1 && (
//                           <span
//                             style={{
//                               color: "#aaa",
//                               fontSize: "14px",
//                               fontFamily: '"Poppins", sans-serif',
//                             }}
//                           >
//                             ...
//                           </span>
//                         )}
//                         <button
//                           onClick={() => setPage(pg)}
//                           style={{
//                             backgroundColor:
//                               page === pg ? "#007BFF" : "#F5F5F5",
//                             color: page === pg ? "#fff" : "#333",
//                             border:
//                               page === pg
//                                 ? "1px solid #0056B3"
//                                 : "1px solid #ccc",
//                             borderRadius: "7px",
//                             padding: "4px 13.5px",
//                             height: "30px",
//                             cursor: "pointer",
//                             transition: "all 0.3s ease",
//                             margin: "0 4px",
//                             fontWeight: page === pg ? "bold" : "normal",
//                             fontFamily: '"Poppins", sans-serif',
//                             fontSize: "14px",
//                           }}
//                         >
//                           {pg}
//                         </button>
//                       </React.Fragment>
//                     ))}
//                   <button
//                     onClick={handleNextPage}
//                     disabled={page === Math.ceil(studentData.length / pageSize)}
//                     style={{
//                       backgroundColor:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "#E0E0E0"
//                           : "#F5F5F5",
//                       color:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "#aaa"
//                           : "#333",
//                       border: "1px solid #ccc",
//                       borderRadius: "7px",
//                       padding: "3px 3.5px",
//                       width: "33px",
//                       height: "30px",
//                       cursor:
//                         page === Math.ceil(studentData.length / pageSize)
//                           ? "not-allowed"
//                           : "pointer",
//                       transition: "all 0.3s ease",
//                       margin: "0 4px",
//                       fontFamily: '"Poppins", sans-serif',
//                     }}
//                   >
//                     <UilAngleRightB />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <Typography sx={{ mt: 2 }}>None</Typography>
//           )}
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: 3, borderRadius: 1 }}
//             onClick={() => navigate("/omr-list")}
//           >
//             Back to List
//           </Button>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// };

// export default OmrView;

import React, { useEffect, useState, useMemo, useRef } from "react";
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
import OMRSheet50 from "./OMRSheet50";
import OMRSheet60 from "./OMRSheet60";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const OmrView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [omrData, setOmrData] = useState(null);
  const [students, setStudents] = useState([]);
  const [classData, setClassData] = useState([]);
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
        const classResponse = await axios.get(`${API_BASE_URL}/api/class`);
        setClassData(classResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getStudentData = (studentIds, classes, subjects, level) => {
    if (!studentIds || !subjects) return [];
    let ids, parsedClasses, parsedSubjects;
    try {
      ids =
        typeof studentIds === "string" ? JSON.parse(studentIds) : studentIds;
      parsedClasses = classes
        ? typeof classes === "string"
          ? JSON.parse(classes)
          : classes
        : [];
      parsedSubjects =
        typeof subjects === "string" ? JSON.parse(subjects) : subjects;
    } catch (e) {
      return [];
    }
    if (!Array.isArray(ids) || !Array.isArray(parsedSubjects)) return [];

    const studentData = [];
    const seenCombinations = new Set();

    ids.forEach((id) => {
      const student = students.find(
        (s) => s.id === id || s.id.toString() === id
      );
      if (!student) return;

      let className = "Unknown";
      let classValue = "Unknown";

      if (
        classData.length > 0 &&
        classData.every((c) => typeof c === "object" && c.id && c.name)
      ) {
        if (student.class_id) {
          const matchedClass = classData.find(
            (c) =>
              c.id === student.class_id ||
              c.id.toString() === student.class_id.toString()
          );
          if (matchedClass) {
            className = matchedClass.name;
            classValue = matchedClass.id;
          } else {
            className = student.class_name || classData[0].name || "Unknown";
            classValue = student.class_name || classData[0].id || "Unknown";
          }
        } else if (student.class_name) {
          const matchedClass = classData.find(
            (c) => c.name.toLowerCase() === student.class_name.toLowerCase()
          );
          if (matchedClass) {
            className = matchedClass.name;
            classValue = matchedClass.id;
          } else {
            className = student.class_name || classData[0].name || "Unknown";
            classValue = student.class_name || classData[0].id || "Unknown";
          }
        } else {
          className = classData[0].name || "Unknown";
          classValue = classData[0].id || "Unknown";
        }
      } else if (parsedClasses.length > 0) {
        const isClassObjectArray = parsedClasses.every(
          (c) => typeof c === "object" && c.id && c.name
        );
        if (isClassObjectArray) {
          if (student.class_id) {
            const matchedClass = parsedClasses.find(
              (c) =>
                c.id === student.class_id ||
                c.id.toString() === student.class_id.toString()
            );
            if (matchedClass) {
              className = matchedClass.name;
              classValue = matchedClass.id;
            } else {
              className =
                student.class_name || parsedClasses[0].name || "Unknown";
              classValue =
                student.class_name || parsedClasses[0].id || "Unknown";
            }
          } else if (student.class_name) {
            const matchedClass = parsedClasses.find(
              (c) => c.name.toLowerCase() === student.class_name.toLowerCase()
            );
            if (matchedClass) {
              className = matchedClass.name;
              classValue = matchedClass.id;
            } else {
              className =
                student.class_name || parsedClasses[0].name || "Unknown";
              classValue =
                student.class_name || parsedClasses[0].id || "Unknown";
            }
          } else {
            className = parsedClasses[0].name || "Unknown";
            classValue = parsedClasses[0].id || "Unknown";
          }
        } else {
          className = student.class_name || parsedClasses[0] || "Unknown";
          classValue = className;
        }
      } else {
        className = student.class_name || "Unknown";
        classValue = className;
      }

      const subjectNames = student.subject_names
        ? student.subject_names.split(",").map((name) => name.trim())
        : parsedSubjects;
      const mappedSubjects = subjectNames
        .map((name) => {
          const subject = parsedSubjects.find(
            (s) =>
              s === name ||
              (s.name && s.name.toLowerCase() === name.toLowerCase())
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
            roll_no: student.roll_no || "N/A",
            class: classValue,
            subject,
            level: level || "N/A",
            class_name: className,
            school_name: student.school_name || omrData?.school || "Unknown",
            subject_ids: student.subject_ids || "Unknown",
            class_id: student.class_id || classValue,
            date: student.date || omrData?.date || "Unknown",
          });
          seenCombinations.add(combinationKey);
        }
      });
    });

    return studentData.filter((data) => data.name);
  };

  const handleDownload = async (studentId, classValue, rowData) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/get/student/${studentId}`
      );
      const apiData = response.data;

      let className = classValue;
      if (
        classData.length > 0 &&
        classData.every((c) => typeof c === "object" && c.id && c.name)
      ) {
        const matchedClass = classData.find(
          (c) =>
            c.id === classValue || c.id.toString() === classValue.toString()
        );
        className = matchedClass ? matchedClass.name : classValue;
      } else if (omrData?.classes) {
        const parsedClasses =
          typeof omrData.classes === "string"
            ? JSON.parse(omrData.classes)
            : omrData.classes;
        if (
          parsedClasses.every((c) => typeof c === "object" && c.id && c.name)
        ) {
          const matchedClass = parsedClasses.find(
            (c) =>
              c.id === classValue || c.id.toString() === classValue.toString()
          );
          className = matchedClass ? matchedClass.name : classValue;
        }
      }

      const useOMR50 = ["01", "02", "03"].includes(className);
      const OMRComponent = useOMR50 ? OMRSheet50 : OMRSheet60;

      const omrProps = {
        schoolName:
          rowData.school_name ||
          apiData.school_name ||
          omrData?.school ||
          "Unknown",
        student: rowData.name || apiData.student_name || "Unknown",
        level: rowData.level || apiData.level || omrData?.level || "N/A",
        subject:
          rowData.subject || apiData.subject_names?.split(",")[0] || "Unknown",
        className: className,
        date: rowData.date || apiData.date || omrData?.date || "Unknown",
        rollNumber: rowData.roll_no || apiData.roll_no || "N/A",
        subjectIds: rowData.subject_ids || apiData.subject_ids || "Unknown",
        classId: rowData.class_id || apiData.class_id || classValue,
      };

      const omrContainer = document.createElement("div");
      omrContainer.style.position = "absolute";
      omrContainer.style.left = "-9999px";
      omrContainer.style.width = "226mm";
      omrContainer.style.padding = "10mm";
      document.body.appendChild(omrContainer);

      const { createRoot } = await import("react-dom/client");
      const root = createRoot(omrContainer);
      root.render(<OMRComponent {...omrProps} />);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(omrContainer, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`omr_sheet_${studentId}_${omrProps.subject}.pdf`);

      root.unmount();
      document.body.removeChild(omrContainer);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate OMR sheet");
    }
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
        headerName: "ROLL NO",
        field: "roll_no",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CLASS",
        field: "class",
        sortable: true,
        filter: "agTextColumnFilter",
        valueFormatter: (params) => {
          const classValue = params.value;
          if (
            classData.length > 0 &&
            classData.every((c) => typeof c === "object" && c.id && c.name)
          ) {
            const matchedClass = classData.find(
              (c) =>
                c.id === classValue || c.id.toString() === classValue.toString()
            );
            return matchedClass ? matchedClass.name : classValue;
          }
          const parsedClasses = omrData?.classes
            ? typeof omrData.classes === "string"
              ? JSON.parse(omrData.classes)
              : omrData.classes
            : [];
          if (
            parsedClasses.length > 0 &&
            parsedClasses.every((c) => typeof c === "object" && c.id && c.name)
          ) {
            const matchedClass = parsedClasses.find(
              (c) =>
                c.id === classValue || c.id.toString() === classValue.toString()
            );
            return matchedClass ? matchedClass.name : classValue;
          }
          return classValue;
        },
      },
      {
        headerName: "SUBJECT",
        field: "subject",
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "LEVEL",
        field: "level",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "ACTION",
        field: "action",
        sortable: false,
        filter: false,
        width: 120,
        cellRenderer: (params) => (
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              handleDownload(params.data.id, params.data.class, params.data)
            }
            sx={{ minWidth: "80px" }}
          >
            Download
          </Button>
        ),
      },
    ],
    [page, pageSize, omrData, classData]
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
    omrData.subjects,
    omrData.level
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
                    { length: Math.ceil(studentData.length / pageSize) },
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
