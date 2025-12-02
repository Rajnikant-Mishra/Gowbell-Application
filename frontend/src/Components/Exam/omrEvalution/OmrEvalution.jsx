// import React, { useState, useEffect, useMemo } from "react";
// import Mainlayout from "../../Layouts/Mainlayout";
// import {
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   CircularProgress,
//   Select,
//   MenuItem,
//   Button,
//   Box,
//   Chip,
//   Avatar,
//   Stack,
//   Menu,
//   Tooltip,
// } from "@mui/material";
// import {
//   UilAngleLeftB,
//   UilAngleRightB,
//   UilSortAmountDown,
//   UilSortAmountUp,
//   UilUniversity,
//   UilBookOpen,
//   UilUser,
//   UilLayerGroup,
//   UilDownloadAlt,
//   UilInfoCircle,
// } from "@iconscout/react-unicons";
// import { alpha } from "@mui/material/styles";
// import Papa from "papaparse";
// import axios from "axios";
// import Swal from "sweetalert2";
// import excelImg from "../../../../public/excell-img.png";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";

// const OMRAssignList = () => {
//   const [omrAssign, setOmrAssign] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState("roll_no");
//   const [sortAsc, setSortAsc] = useState(true);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const pageSizes = [5, 10, 15, 20, 50];
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [schools, setSchools] = useState([]);
//   const open = Boolean(anchorEl);

//   // Load data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const storedOmr = JSON.parse(localStorage.getItem("omr_assign")) || [];
//         setOmrAssign(storedOmr);

//         // Fetch schools for validation
//         const schoolsResponse = await axios.get(
//           `${API_BASE_URL}/api/get/all-schools`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setSchools(
//           Array.isArray(schoolsResponse.data) ? schoolsResponse.data : []
//         );
//       } catch (error) {
//         console.error("Error loading data:", error);
//         setOmrAssign([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // Sort logic
//   const sortedData = useMemo(() => {
//     return [...omrAssign].sort((a, b) => {
//       const valA = (a[sortKey] ?? "").toString();
//       const valB = (b[sortKey] ?? "").toString();
//       return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
//     });
//   }, [omrAssign, sortKey, sortAsc]);

//   // Pagination
//   const totalRecords = sortedData.length;
//   const totalPages = Math.ceil(totalRecords / pageSize);
//   const startIdx = (page - 1) * pageSize;
//   const currentData = sortedData.slice(startIdx, startIdx + pageSize);

//   const handleSort = (key) => {
//     if (key === sortKey) setSortAsc(!sortAsc);
//     else {
//       setSortKey(key);
//       setSortAsc(true);
//     }
//   };

//   const handlePreviousPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () => page < totalPages && setPage(page + 1);

//   const getInitials = (name) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // === BULK ACTION MENU ===
//   const handleClick = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleUploadClick = () => {
//     document.getElementById("fileInput").click();
//     handleClose();
//   };

//   const handleDownloadClick = () => {
//     const headers = [
//       "school_name",
//       "student_name",
//       "class_name",
//       "roll_no",
//       "full_mark",
//       "mark_secured",
//       "subject",
//       "level",
//     ];

//     const sampleRows = [
//       [
//         "GREEN VALLEY HIGH SCHOOL",
//         "John Doe",
//         "01",
//         "A12345",
//         "100",
//         "85",
//         "GIMO",
//         "Level 1",
//       ],
//       [
//         "SUNRISE ACADEMY",
//         "Jane Smith",
//         "02",
//         "",
//         "100",
//         "90",
//         "MATH",
//         "Level 2",
//       ],
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...sampleRows.map((row) =>
//         row
//           .map((field) =>
//             typeof field === "string" &&
//             (field.includes(",") || field.includes('"'))
//               ? `"${field.replace(/"/g, '""')}"`
//               : field
//           )
//           .join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "omr_assign_sample.csv";
//     link.click();
//     handleClose();
//   };

//   // === CSV UPLOAD & VALIDATION ===
//   const validateStudentData = (student, rowIndex) => {
//     const genericNameRegex = /^[A-Za-z0-9\s-]+$/;
//     const schoolNameRegex = /^[A-Za-z0-9\s.,-]+$/;
//     const errors = [];

//     if (
//       !student.school_name ||
//       !schoolNameRegex.test(student.school_name.trim())
//     ) {
//       errors.push(`Invalid school_name at row ${rowIndex}`);
//     }
//     if (
//       !student.student_name ||
//       !genericNameRegex.test(student.student_name.trim())
//     ) {
//       errors.push(`Invalid student_name at row ${rowIndex}`);
//     }
//     if (
//       !student.class_name ||
//       !genericNameRegex.test(student.class_name.trim())
//     ) {
//       errors.push(`Invalid class_name at row ${rowIndex}`);
//     }
//     if (!student.subject || !genericNameRegex.test(student.subject.trim())) {
//       errors.push(`Invalid subject at row ${rowIndex}`);
//     }
//     if (student.roll_no && !/^[A-Za-z0-9-]+$/.test(student.roll_no.trim())) {
//       errors.push(`Invalid roll_no at row ${rowIndex}`);
//     }
//     if (
//       student.full_mark != null &&
//       (isNaN(student.full_mark) || student.full_mark <= 0)
//     ) {
//       errors.push(`Invalid full_mark at row ${rowIndex}`);
//     }
//     if (
//       student.mark_secured != null &&
//       (isNaN(student.mark_secured) || student.mark_secured < 0)
//     ) {
//       errors.push(`Invalid mark_secured at row ${rowIndex}`);
//     }
//     if (
//       student.mark_secured != null &&
//       student.full_mark != null &&
//       student.mark_secured > student.full_mark
//     ) {
//       errors.push(`Mark secured exceeds full mark at row ${rowIndex}`);
//     }
//     if (
//       student.level &&
//       !["Level 1", "Level 2", "Level 3"].includes(student.level.trim())
//     ) {
//       errors.push(
//         `Invalid level at row ${rowIndex}: Use Level 1, Level 2, or Level 3`
//       );
//     }

//     return errors;
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!["text/csv", "application/vnd.ms-excel"].includes(file.type)) {
//       Swal.fire({
//         position: "top-end",
//         icon: "warning",
//         title: "Invalid File",
//         text: "Please upload a valid CSV file.",
//         showConfirmButton: false,
//         timer: 4000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//       return;
//     }

//     setUploadProgress(10);
//     const reader = new FileReader();
//     reader.onload = () => parseCSVData(reader.result);
//     reader.readAsText(file);
//   };

//   const formatClassName = (className) =>
//     /^\d$/.test(className) ? `0${className}` : className;

//   const parseCSVData = (csvFile) => {
//     setUploadProgress(30);
//     Papa.parse(csvFile, {
//       complete: async (result) => {
//         setUploadProgress(50);
//         const students = result.data
//           .filter((row) => Object.values(row).some((val) => val && val.trim()))
//           .map((row, i) => ({
//             school_name: row.school_name?.trim() || "",
//             student_name: row.student_name?.trim() || "",
//             class_name: formatClassName(row.class_name?.trim() || ""),
//             roll_no: row.roll_no?.trim() || "",
//             full_mark: parseInt(row.full_mark) || null,
//             mark_secured: parseInt(row.mark_secured) || null,
//             subject: row.subject?.trim() || "",
//             level: row.level?.trim() || "",
//             session_id: localStorage.getItem("currentSessionId") || null,
//             __rowIndex: i + 2,
//           }));

//         const uniqueStudents = [];
//         const seen = new Set();
//         const duplicates = [];
//         students.forEach((s) => {
//           const key = `${s.student_name}-${s.school_name}-${s.class_name}-${s.subject}`;
//           if (seen.has(key)) {
//             duplicates.push(
//               `Duplicate at row ${s.__rowIndex}: ${s.student_name}`
//             );
//           } else {
//             seen.add(key);
//             uniqueStudents.push(s);
//           }
//         });

//         const invalidSchools = uniqueStudents.filter(
//           (s) => !schools.find((sc) => sc.school_name === s.school_name)
//         );
//         if (invalidSchools.length > 0) {
//           Swal.fire({
//             icon: "error",
//             title: "Invalid School Names",
//             html: invalidSchools
//               .map((s) => `${s.school_name} (row ${s.__rowIndex})`)
//               .join("<br>"),
//             toast: true,
//             position: "top-end",
//             showConfirmButton: false,
//             timer: 5000,
//           });
//           setUploadProgress(0);
//           return;
//         }

//         if (duplicates.length > 0) {
//           Swal.fire({
//             title: "Duplicate Entries Detected",
//             html: `
//               <div style="text-align:left;font-size:16px;">
//                 Duplicates will update existing records:<br>
//                 <ul style="margin:10px 0;padding-left:20px;">
//                   ${duplicates.map((d) => `<li>${d}</li>`).join("")}
//                 </ul>
//                 <strong>Proceed?</strong>
//               </div>`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Proceed",
//             cancelButtonColor: "#d33",
//             confirmButtonColor: "#3085d6",
//             width: "600px",
//           }).then((res) =>
//             res.isConfirmed
//               ? validateAndUpload(uniqueStudents)
//               : setUploadProgress(0)
//           );
//         } else {
//           validateAndUpload(uniqueStudents);
//         }
//       },
//       header: true,
//       skipEmptyLines: true,
//       error: () => {
//         Swal.fire({
//           icon: "error",
//           title: "CSV Error",
//           text: "Failed to parse CSV. Check format.",
//           toast: true,
//           position: "top-end",
//           timer: 4000,
//         });
//         setUploadProgress(0);
//       },
//     });
//   };

//   const validateAndUpload = async (students) => {
//     const errors = [];
//     students.forEach((s) =>
//       errors.push(...validateStudentData(s, s.__rowIndex))
//     );

//     if (errors.length > 0) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Failed",
//         html: errors.join("<br>"),
//         toast: true,
//         position: "top-end",
//         timer: 5000,
//       });
//       setUploadProgress(0);
//       return;
//     }

//     const clean = students.map(({ __rowIndex, ...rest }) => rest);
//     setUploadProgress(70);

//     try {
//       await axios.post(
//         `${API_BASE_URL}/api/upload/result/staff`,
//         { students: clean },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       setUploadProgress(100);
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "OMR assignments uploaded!",
//         toast: true,
//         position: "top-end",
//         timer: 4000,
//       }).then(() => window.location.reload());
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Upload Failed",
//         text: err.response?.data?.message || "Try again.",
//         toast: true,
//         position: "top-end",
//         timer: 5000,
//       });
//       setUploadProgress(0);
//     }
//   };

//   return (
//     <Mainlayout>
//       <Box
//         sx={{
//           p: { xs: 2, md: 4 },
//           background: "linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)",
//           minHeight: "100vh",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               fontWeight={800}
//               color="#0a1d56"
//               sx={{
//                 background: "linear-gradient(90deg, #1230ae, #1e90ff)",
//                 backgroundClip: "text",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 fontFamily: "'Poppins', sans-serif",
//               }}
//             >
//               OMR Assignments
//             </Typography>
//             <Typography variant="body2" color="#555">
//               Manage and track student OMR sheet assignments with elegance.
//             </Typography>
//           </Box>

//           {/* === BULK ACTION BUTTON === */}
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <Tooltip title="Bulk Actions" arrow>
//               <div
//                 onClick={handleClick}
//                 style={{
//                   cursor: "pointer",
//                   padding: "10px 14px",
//                   display: "flex",
//                   alignItems: "center",
//                   backgroundColor: "#fff",
//                   borderRadius: "8px",
//                   boxShadow: "0 2px 8px rgba(18,48,174,0.1)",
//                   fontSize: "14px",
//                   fontWeight: 600,
//                   color: "#1230AE",
//                   fontFamily: "'Poppins', sans-serif",
//                 }}
//               >
//                 <img
//                   src={excelImg}
//                   alt="Bulk"
//                   style={{ width: 20, height: 20, marginRight: 8 }}
//                 />
//                 Bulk Action
//               </div>
//             </Tooltip>

//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//               anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//               transformOrigin={{ vertical: "top", horizontal: "right" }}
//               PaperProps={{
//                 sx: {
//                   mt: 1,
//                   borderRadius: 2,
//                   boxShadow: "0 8px 24px rgba(18,48,174,0.15)",
//                   minWidth: 280,
//                 },
//               }}
//             >
//               <Box sx={{ p: 2 }}>
//                 <Stack direction="row" spacing={1} mb={1.5}>
//                   <Button
//                     onClick={handleUploadClick}
//                     startIcon={
//                       <img
//                         src={excelImg}
//                         alt=""
//                         style={{ width: 18, height: 18 }}
//                       />
//                     }
//                     size="small"
//                     sx={{
//                       bgcolor: "#4A4545",
//                       color: "white",
//                       fontSize: "13px",
//                       textTransform: "none",
//                       "&:hover": { bgcolor: "#3a3636" },
//                     }}
//                   >
//                     Upload CSV
//                   </Button>
//                   <Button
//                     onClick={handleDownloadClick}
//                     startIcon={<UilDownloadAlt size={18} />}
//                     size="small"
//                     sx={{
//                       bgcolor: "#28a745",
//                       color: "white",
//                       fontSize: "13px",
//                       textTransform: "none",
//                       "&:hover": { bgcolor: "#218838" },
//                     }}
//                   >
//                     Sample File
//                   </Button>
//                 </Stack>

//                 <Typography
//                   variant="caption"
//                   fontWeight="bold"
//                   color="#4A4545"
//                   display="flex"
//                   alignItems="center"
//                   gap={0.5}
//                   mb={0.5}
//                 >
//                   <UilInfoCircle size={14} style={{ color: "#1230ae" }} /> Note:
//                 </Typography>
//                 <Typography
//                   variant="caption"
//                   color="gray"
//                   component="div"
//                   sx={{ fontSize: "10px", pl: 2 }}
//                 >
//                   <ol style={{ margin: 0, paddingLeft: "16px" }}>
//                     <li>Download sample CSV to see format.</li>
//                     <li>
//                       Required: school_name, student_name, class_name, subject.
//                     </li>
//                     <li>Use letters, numbers, spaces, hyphens only.</li>
//                     <li>Save as CSV before upload.</li>
//                     <li>School names must match system records.</li>
//                     <li>Duplicates will update existing entries.</li>
//                   </ol>
//                 </Typography>
//               </Box>
//             </Menu>

//             <input
//               id="fileInput"
//               type="file"
//               accept=".csv"
//               style={{ display: "none" }}
//               onChange={handleFileChange}
//             />
//           </Box>
//         </Box>

//         {/* === PROGRESS BAR === */}
//         {uploadProgress > 0 && uploadProgress < 100 && (
//           <Box sx={{ mb: 2 }}>
//             <Box
//               sx={{
//                 width: "100%",
//                 bgcolor: "#e0e0e0",
//                 borderRadius: 2,
//                 height: 8,
//                 overflow: "hidden",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: `${uploadProgress}%`,
//                   bgcolor: "#1230ae",
//                   height: "100%",
//                   transition: "width 0.3s",
//                 }}
//               />
//             </Box>
//             <Typography
//               variant="caption"
//               color="#1230ae"
//               sx={{ mt: 0.5, display: "block" }}
//             >
//               Uploading: {uploadProgress}%
//             </Typography>
//           </Box>
//         )}

//         {/* === TABLE === */}
//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", py: 15 }}>
//             <CircularProgress
//               size={60}
//               thickness={5}
//               sx={{ color: "#1230ae" }}
//             />
//           </Box>
//         ) : currentData.length === 0 ? (
//           <Card
//             sx={{
//               p: 6,
//               textAlign: "center",
//               background: "rgba(255,255,255,0.7)",
//               backdropFilter: "blur(10px)",
//               borderRadius: 4,
//             }}
//           >
//             <Typography color="#777" fontStyle="italic">
//               No OMR records found. Start assigning sheets!
//             </Typography>
//           </Card>
//         ) : (
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 4,
//               overflow: "hidden",
//               background: "rgba(255,255,255,0.85)",
//               backdropFilter: "blur(12px)",
//               border: "1px solid rgba(18,48,174,0.15)",
//             }}
//           >
//             <CardContent sx={{ p: 0 }}>
//               <TableContainer>
//                 <Table sx={{ minWidth: 650 }}>
//                   <TableHead>
//                     <TableRow
//                       sx={{
//                         background: "linear-gradient(90deg, #1230ae, #1e40af)",
//                       }}
//                     >
//                       {[
//                         { label: "#", key: "index", icon: null },
//                         {
//                           label: "School",
//                           key: "school_name",
//                           icon: <UilUniversity size={16} />,
//                         },
//                         {
//                           label: "Class",
//                           key: "class_name",
//                           icon: <UilLayerGroup size={16} />,
//                         },
//                         {
//                           label: "Subject",
//                           key: "subject_name",
//                           icon: <UilBookOpen size={16} />,
//                         },
//                         { label: "Roll No", key: "roll_no", icon: null },
//                         {
//                           label: "Student",
//                           key: "student_name",
//                           icon: <UilUser size={16} />,
//                         },
//                         {
//                           label: "Section",
//                           key: "student_section",
//                           icon: null,
//                         },
//                         {
//                           label: "Status",
//                           key: "status",
//                           icon: null,
//                         },
//                       ].map((col) => (
//                         <TableCell
//                           key={col.key}
//                           onClick={() =>
//                             col.key !== "index" && handleSort(col.key)
//                           }
//                           sx={{
//                             cursor: col.key !== "index" ? "pointer" : "default",
//                             color: "white",
//                             fontWeight: 700,
//                             fontSize: "0.95rem",
//                             py: 2.5,
//                             border: "none",
//                             transition: "background 0.2s",
//                             "&:hover":
//                               col.key !== "index"
//                                 ? { background: alpha("#fff", 0.1) }
//                                 : {},
//                           }}
//                         >
//                           <Stack direction="row" alignItems="center" gap={0.5}>
//                             {col.icon}
//                             <span>{col.label}</span>
//                             {sortKey === col.key &&
//                               col.key !== "index" &&
//                               (sortAsc ? (
//                                 <UilSortAmountUp size={16} />
//                               ) : (
//                                 <UilSortAmountDown size={16} />
//                               ))}
//                           </Stack>
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {currentData.map((item, i) => (
//                       <TableRow
//                         key={item.id}
//                         sx={{
//                           "&:hover": { background: "#f0f4ff" },
//                           background: i % 2 === 0 ? "#ffffff" : "#fafbff",
//                           border: "none",
//                         }}
//                       >
//                         <TableCell sx={{ fontWeight: 600, color: "#1230ae" }}>
//                           {startIdx + i + 1}
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             icon={<UilUniversity size={14} />}
//                             label={item.school_name || item.school_id}
//                             size="small"
//                             sx={{
//                               background: alpha("#1230ae", 0.1),
//                               color: "#1230ae",
//                               fontWeight: 600,
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.class_name || item.class_id}
//                             size="small"
//                             color="primary"
//                             variant="outlined"
//                             sx={{ fontWeight: 600 }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Typography fontWeight={600} color="#1e40af">
//                             {item.subject_name || item.subject_id}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.roll_no}
//                             color="secondary"
//                             sx={{
//                               background: alpha("#1230ae", 0.1),
//                               color: "#3a59f5ff",
//                               fontWeight: 700,
//                               fontSize: "0.85rem",
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Stack direction="row" alignItems="center" gap={1.5}>
//                             <Box>
//                               <Typography fontWeight={600} color="#425ef8ff">
//                                 {item.student_name || item.student_id}
//                               </Typography>
//                             </Box>
//                           </Stack>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.student_section || "-"}
//                             size="small"
//                             sx={{
//                               background: alpha("#10b981", 0.15),
//                               color: "#10b981",
//                               fontWeight: 600,
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.status || "-"}
//                             size="small"
//                             sx={{
//                               color: "#eb371cff",
//                             }}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>

//             {/* === PAGINATION === */}
//             {totalRecords > 0 && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   flexWrap: "wrap",
//                   p: 3,
//                   background: "rgba(255,255,255,0.7)",
//                   backdropFilter: "blur(8px)",
//                   borderTop: "1px solid rgba(18,48,174,0.1)",
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <Typography fontWeight={600} color="#1230ae">
//                     Show:
//                   </Typography>
//                   <Select
//                     value={pageSize}
//                     onChange={(e) => {
//                       setPageSize(+e.target.value);
//                       setPage(1);
//                     }}
//                     size="small"
//                     sx={{
//                       width: 80,
//                       fontWeight: 600,
//                       "& .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#1230ae",
//                       },
//                     }}
//                   >
//                     {pageSizes.map((s) => (
//                       <MenuItem key={s} value={s} sx={{ fontWeight: 600 }}>
//                         {s}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   <Typography color="#555">per page</Typography>
//                 </Box>

//                 <Typography color="#666" fontSize="0.9rem" fontWeight={500}>
//                   {totalRecords} records • Page <strong>{page}</strong> of{" "}
//                   <strong>{totalPages}</strong>
//                 </Typography>

//                 <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                   <Button
//                     onClick={handlePreviousPage}
//                     disabled={page === 1}
//                     sx={{
//                       minWidth: 40,
//                       height: 40,
//                       borderRadius: 2,
//                       color: page === 1 ? "#ccc" : "#1230ae",
//                       bgcolor:
//                         page === 1 ? "transparent" : alpha("#1230ae", 0.05),
//                       "&:hover": { bgcolor: alpha("#1230ae", 0.15) },
//                     }}
//                   >
//                     <UilAngleLeftB />
//                   </Button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (pg) =>
//                         pg === 1 ||
//                         pg === totalPages ||
//                         Math.abs(pg - page) <= 2
//                     )
//                     .map((pg, idx, arr) => (
//                       <React.Fragment key={pg}>
//                         {idx > 0 && pg > arr[idx - 1] + 1 && (
//                           <Typography sx={{ px: 1, color: "#aaa" }}>
//                             ...
//                           </Typography>
//                         )}
//                         <Button
//                           onClick={() => setPage(pg)}
//                           variant={pg === page ? "contained" : "text"}
//                           sx={{
//                             minWidth: 40,
//                             height: 40,
//                             borderRadius: 2,
//                             fontWeight: 700,
//                             bgcolor: pg === page ? "#1230ae" : "transparent",
//                             color: pg === page ? "white" : "#1230ae",
//                             "&:hover": {
//                               bgcolor:
//                                 pg === page ? "#0f2c9c" : alpha("#1230ae", 0.1),
//                             },
//                             transition: "background 0.2s",
//                           }}
//                         >
//                           {pg}
//                         </Button>
//                       </React.Fragment>
//                     ))}

//                   <Button
//                     onClick={handleNextPage}
//                     disabled={page === totalPages}
//                     sx={{
//                       minWidth: 40,
//                       height: 40,
//                       borderRadius: 2,
//                       color: page === totalPages ? "#ccc" : "#1230ae",
//                       bgcolor:
//                         page === totalPages
//                           ? "transparent"
//                           : alpha("#1230ae", 0.05),
//                       "&:hover": { bgcolor: alpha("#1230ae", 0.15) },
//                     }}
//                   >
//                     <UilAngleRightB />
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//           </Card>
//         )}
//       </Box>
//     </Mainlayout>
//   );
// };

// export default OMRAssignList;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  Stack,
  Menu,
  Tooltip,
} from "@mui/material";
import {
  UilAngleLeftB,
  UilAngleRightB,
  UilSortAmountDown,
  UilSortAmountUp,
  UilUniversity,
  UilBookOpen,
  UilUser,
  UilLayerGroup,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";
import { alpha } from "@mui/material/styles";
import Papa from "papaparse";
import axios from "axios";
import Swal from "sweetalert2";
import excelImg from "../../../../public/excell-img.png";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";

const OMRAssignList = () => {
  /* ──────────────────────── Core state (unchanged) ──────────────────────── */
  const [omrAssign, setOmrAssign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("roll_no");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 15, 20, 50];
  const [uploadProgress, setUploadProgress] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [schools, setSchools] = useState([]);
  const open = Boolean(anchorEl);

  /* ──────────────────────── NEW upload-status state ──────────────────────── */
  const [checkingRows, setCheckingRows] = useState(new Set()); // keys being checked
  const [rowStatus, setRowStatus] = useState({}); // {key: {status, message}}

  /* ──────────────────────── Load initial data (unchanged) ──────────────────────── */
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("omr_assign")) || [];
        setOmrAssign(stored);

        const res = await axios.get(`${API_BASE_URL}/api/get/all-schools`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSchools(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Load error:", err);
        setOmrAssign([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* ──────────────────────── Helpers ──────────────────────── */
  const makeKey = (s) =>
    `${s.school_id || s.school_name}|${s.class_id || s.class_name}|${
      s.subject_id || s.subject
    }|${s.roll_no}|${s.student_id || s.student_name}`;

  const formatClassName = (c) => (/^\d$/.test(c) ? `0${c}` : c);

  /* ──────────────────────── Sorting & pagination (unchanged) ──────────────────────── */
  const sortedData = useMemo(() => {
    return [...omrAssign].sort((a, b) => {
      const A = (a[sortKey] ?? "").toString();
      const B = (b[sortKey] ?? "").toString();
      return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
    });
  }, [omrAssign, sortKey, sortAsc]);

  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIdx = (page - 1) * pageSize;
  const currentData = sortedData.slice(startIdx, startIdx + pageSize);

  const handleSort = (k) => {
    if (k === sortKey) setSortAsc((v) => !v);
    else {
      setSortKey(k);
      setSortAsc(true);
    }
  };
  const handlePreviousPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  /* ──────────────────────── Bulk menu (unchanged) ──────────────────────── */
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
    handleClose();
  };
  const handleDownloadClick = () => {
    const headers = [
      "school_name",
      "student_name",
      "class_name",
      "roll_no",
      "full_mark",
      "mark_secured",
      "subject",
      "level",
    ];
    const sample = [
      [
        "GREEN VALLEY HIGH SCHOOL",
        "John Doe",
        "01",
        "A12345",
        "100",
        "85",
        "GIMO",
        "Level 1",
      ],
      [
        "SUNRISE ACADEMY",
        "Jane Smith",
        "02",
        "",
        "100",
        "90",
        "MATH",
        "Level 2",
      ],
    ];
    const csv = [
      headers.join(","),
      ...sample.map((r) =>
        r
          .map((f) =>
            typeof f === "string" && (f.includes(",") || f.includes('"'))
              ? `"${f.replace(/"/g, '""')}"`
              : f
          )
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "omr_assign_sample.csv";
    a.click();
    handleClose();
  };

  /* ──────────────────────── CSV validation (unchanged) ──────────────────────── */
  const validateStudentData = (s, idx) => {
    const errors = [];
    const nameRx = /^[A-Za-z0-9\s-]+$/;
    const schoolRx = /^[A-Za-z0-9\s.,-]+$/;

    if (!s.school_name || !schoolRx.test(s.school_name.trim()))
      errors.push(`Invalid school_name at row ${idx}`);
    if (!s.student_name || !nameRx.test(s.student_name.trim()))
      errors.push(`Invalid student_name at row ${idx}`);
    if (!s.class_name || !nameRx.test(s.class_name.trim()))
      errors.push(`Invalid class_name at row ${idx}`);
    if (!s.subject || !nameRx.test(s.subject.trim()))
      errors.push(`Invalid subject at row ${idx}`);
    if (s.roll_no && !/^[A-Za-z0-9-]+$/.test(s.roll_no.trim()))
      errors.push(`Invalid roll_no at row ${idx}`);
    if (s.full_mark != null && (isNaN(s.full_mark) || s.full_mark <= 0))
      errors.push(`Invalid full_mark at row ${idx}`);
    if (s.mark_secured != null && (isNaN(s.mark_secured) || s.mark_secured < 0))
      errors.push(`Invalid mark_secured at row ${idx}`);
    if (
      s.mark_secured != null &&
      s.full_mark != null &&
      s.mark_secured > s.full_mark
    )
      errors.push(`Mark secured exceeds full mark at row ${idx}`);
    if (s.level && !["Level 1", "Level 2", "Level 3"].includes(s.level.trim()))
      errors.push(`Invalid level at row ${idx}`);

    return errors;
  };

  /* ──────────────────────── Backend status check (NEW) ──────────────────────── */
  const checkBackendStatus = useCallback(async (student) => {
    const key = makeKey(student);
    setCheckingRows((s) => new Set(s).add(key));

    try {
      const payload = {
        school_id: student.school_id,
        class_id: student.class_id,
        subject_id: student.subject_id,
        roll_no: student.roll_no,
        student_id: student.student_id,
      };

      const res = await axios.put(
        `${API_BASE_URL}/api/omr-assign/update`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const status = res.data.status || "success";
      setRowStatus((p) => ({ ...p, [key]: { status, message: null } }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Server error";
      setRowStatus((p) => ({ ...p, [key]: { status: "error", message: msg } }));
    } finally {
      setCheckingRows((s) => {
        const n = new Set(s);
        n.delete(key);
        return n;
      });
    }
  }, []);

  /* ──────────────────────── CSV parse & upload (UPGRADED) ──────────────────────── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["text/csv", "application/vnd.ms-excel"].includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File",
        text: "Upload a CSV.",
        toast: true,
        position: "top-end",
        timer: 4000,
      });
      return;
    }
    setUploadProgress(10);
    const r = new FileReader();
    r.onload = () => parseCSV(r.result);
    r.readAsText(file);
  };

  const parseCSV = (txt) => {
    setUploadProgress(30);
    Papa.parse(txt, {
      header: true,
      skipEmptyLines: true,
      complete: async (res) => {
        setUploadProgress(50);
        const raw = res.data
          .filter((r) => Object.values(r).some((v) => v && v.trim()))
          .map((r, i) => ({
            school_name: r.school_name?.trim() || "",
            student_name: r.student_name?.trim() || "",
            class_name: formatClassName(r.class_name?.trim() || ""),
            roll_no: r.roll_no?.trim() || "",
            full_mark: parseInt(r.full_mark) || null,
            mark_secured: parseInt(r.mark_secured) || null,
            subject: r.subject?.trim() || "",
            level: r.level?.trim() || "",
            session_id: localStorage.getItem("currentSessionId") || null,
            __rowIndex: i + 2,
          }));

        // dedupe
        const uniq = [],
          seen = new Set(),
          dups = [];
        raw.forEach((s) => {
          const k = `${s.student_name}-${s.school_name}-${s.class_name}-${s.subject}`;
          if (seen.has(k))
            dups.push(`Duplicate at row ${s.__rowIndex}: ${s.student_name}`);
          else {
            seen.add(k);
            uniq.push(s);
          }
        });

        // school check
        const bad = uniq.filter(
          (s) => !schools.find((sc) => sc.school_name === s.school_name)
        );
        if (bad.length) {
          Swal.fire({
            icon: "error",
            title: "Invalid Schools",
            html: bad
              .map((s) => `${s.school_name} (row ${s.__rowIndex})`)
              .join("<br>"),
            toast: true,
            position: "top-end",
            timer: 5000,
          });
          setUploadProgress(0);
          return;
        }

        // duplicate warning
        if (dups.length) {
          const ok = await Swal.fire({
            title: "Duplicates Detected",
            html: `<div style="text-align:left;">Duplicates will update existing records:<ul style="margin:10px 0;padding-left:20px;">${dups
              .map((d) => `<li>${d}</li>`)
              .join("")}</ul><strong>Proceed?</strong></div>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Proceed",
          });
          if (!ok.isConfirmed) {
            setUploadProgress(0);
            return;
          }
        }

        validateAndUpload(uniq);
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "CSV Error",
          text: "Failed to parse.",
          toast: true,
          position: "top-end",
          timer: 4000,
        });
        setUploadProgress(0);
      },
    });
  };

  const validateAndUpload = async (students) => {
    const errs = [];
    students.forEach((s) => errs.push(...validateStudentData(s, s.__rowIndex)));
    if (errs.length) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        html: errs.join("<br>"),
        toast: true,
        position: "top-end",
        timer: 5000,
      });
      setUploadProgress(0);
      return;
    }

    const clean = students.map(({ __rowIndex, ...rest }) => rest);
    setUploadProgress(70);

    try {
      await axios.post(
        `${API_BASE_URL}/api/upload/result/staff`,
        { students: clean },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUploadProgress(90);
      Swal.fire({
        icon: "info",
        title: "Verifying with server...",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });

      // ---- status check for every row ----
      const checks = clean.map((s) => checkBackendStatus(s));
      await Promise.allSettled(checks);

      setUploadProgress(100);
      Swal.fire({
        icon: "success",
        title: "Upload Complete!",
        text: "All rows processed.",
        toast: true,
        position: "top-end",
        timer: 4000,
      }).then(() => window.location.reload());
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.response?.data?.message || "Try again.",
        toast: true,
        position: "top-end",
        timer: 5000,
      });
      setUploadProgress(0);
    }
  };

  /* ──────────────────────── Status chip renderer (NEW) ──────────────────────── */
  const getStatusChip = (item) => {
    const key = makeKey(item);
    const checking = checkingRows.has(key);
    const st = rowStatus[key];

    if (checking) {
      return (
        <Chip
          label="Checking…"
          size="small"
          sx={{ bgcolor: "#fff3cd", color: "#856404", fontWeight: 600 }}
        />
      );
    }
    if (!st)
      return (
        <Chip
          label={item.status || "-"}
          size="small"
          sx={{ color: "#eb371cff" }}
        />
      );

    if (st.status === "error") {
      return (
        <Tooltip title={st.message} arrow>
          <Chip
            label="Not uploaded"
            size="small"
            sx={{ bgcolor: "#f8d7da", color: "#721c24", fontWeight: 600 }}
          />
        </Tooltip>
      );
    }

    const colors = {
      success: { bg: "#d4edda", txt: "#155724" },
      pending: { bg: "#fff3cd", txt: "#856404" },
    }[st.status] || { bg: "#e2e3e5", txt: "#383d41" };

    return (
      <Chip
        label={st.status}
        size="small"
        sx={{ bgcolor: colors.bg, color: colors.txt, fontWeight: 600 }}
      />
    );
  };

  /* ──────────────────────── Render (only status column changed) ──────────────────────── */
  return (
    <Mainlayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          background: "linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)",
          minHeight: "100vh",
        }}
      >
        {/* ── Header & Bulk menu (unchanged) ── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              color="#0a1d56"
              sx={{
                background: "linear-gradient(90deg, #1230ae, #1e90ff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              OMR Assignments
            </Typography>
            <Typography variant="body2" color="#555">
              Manage and track student OMR sheet assignments with elegance.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Bulk Actions" arrow>
              <div
                onClick={handleClick}
                style={{
                  cursor: "pointer",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(18,48,174,0.1)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1230AE",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <img
                  src={excelImg}
                  alt="Bulk"
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
                Bulk Action
              </div>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(18,48,174,0.15)",
                  minWidth: 280,
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} mb={1.5}>
                  <Button
                    onClick={handleUploadClick}
                    startIcon={
                      <img
                        src={excelImg}
                        alt=""
                        style={{ width: 18, height: 18 }}
                      />
                    }
                    size="small"
                    sx={{
                      bgcolor: "#4A4545",
                      color: "white",
                      fontSize: "13px",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#3a3636" },
                    }}
                  >
                    Upload CSV
                  </Button>
                  <Button
                    onClick={handleDownloadClick}
                    startIcon={<UilDownloadAlt size={18} />}
                    size="small"
                    sx={{
                      bgcolor: "#28a745",
                      color: "white",
                      fontSize: "13px",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#218838" },
                    }}
                  >
                    Sample File
                  </Button>
                </Stack>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="#4A4545"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  mb={0.5}
                >
                  <UilInfoCircle size={14} style={{ color: "#1230ae" }} /> Note:
                </Typography>
                <Typography
                  variant="caption"
                  color="gray"
                  component="div"
                  sx={{ fontSize: "10px", pl: 2 }}
                >
                  <ol style={{ margin: 0, paddingLeft: "16px" }}>
                    <li>Download sample CSV to see format.</li>
                    <li>
                      Required: school_name, student_name, class_name, subject.
                    </li>
                    <li>Use letters, numbers, spaces, hyphens only.</li>
                    <li>Save as CSV before upload.</li>
                    <li>School names must match system records.</li>
                    <li>Duplicates will update existing entries.</li>
                  </ol>
                </Typography>
              </Box>
            </Menu>

            <input
              id="fileInput"
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>
        </Box>

        {/* ── Progress ── */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                width: "100%",
                bgcolor: "#e0e0e0",
                borderRadius: 2,
                height: 8,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${uploadProgress}%`,
                  bgcolor: "#1230ae",
                  height: "100%",
                  transition: "width 0.3s",
                }}
              />
            </Box>
            <Typography
              variant="caption"
              color="#1230ae"
              sx={{ mt: 0.5, display: "block" }}
            >
              Uploading: {uploadProgress}%
            </Typography>
          </Box>
        )}

        {/* ── Table ── */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 15 }}>
            <CircularProgress
              size={60}
              thickness={5}
              sx={{ color: "#1230ae" }}
            />
          </Box>
        ) : currentData.length === 0 ? (
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
            }}
          >
            <Typography color="#777" fontStyle="italic">
              No OMR records found. Start assigning sheets!
            </Typography>
          </Card>
        ) : (
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(18,48,174,0.15)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: "linear-gradient(90deg, #1230ae, #1e40af)",
                      }}
                    >
                      {[
                        { label: "#", key: "index" },
                        {
                          label: "School",
                          key: "school_name",
                          icon: <UilUniversity size={16} />,
                        },
                        {
                          label: "Class",
                          key: "class_name",
                          icon: <UilLayerGroup size={16} />,
                        },
                        {
                          label: "Subject",
                          key: "subject_name",
                          icon: <UilBookOpen size={16} />,
                        },
                        { label: "Roll No", key: "roll_no" },
                        {
                          label: "Student",
                          key: "student_name",
                          icon: <UilUser size={16} />,
                        },
                        { label: "Section", key: "student_section" },
                        { label: "Status", key: "status" },
                      ].map((c) => (
                        <TableCell
                          key={c.key}
                          onClick={() => c.key !== "index" && handleSort(c.key)}
                          sx={{
                            cursor: c.key !== "index" ? "pointer" : "default",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            py: 2.5,
                            border: "none",
                            "&:hover":
                              c.key !== "index"
                                ? { background: alpha("#fff", 0.1) }
                                : {},
                          }}
                        >
                          <Stack direction="row" alignItems="center" gap={0.5}>
                            {c.icon}
                            <span>{c.label}</span>
                            {sortKey === c.key &&
                              c.key !== "index" &&
                              (sortAsc ? (
                                <UilSortAmountUp size={16} />
                              ) : (
                                <UilSortAmountDown size={16} />
                              ))}
                          </Stack>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentData.map((item, i) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          "&:hover": { background: "#f0f4ff" },
                          background: i % 2 === 0 ? "#ffffff" : "#fafbff",
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: "#1230ae" }}>
                          {startIdx + i + 1}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<UilUniversity size={14} />}
                            label={item.school_name || item.school_id}
                            size="small"
                            sx={{
                              background: alpha("#1230ae", 0.1),
                              color: "#1230ae",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.class_name || item.class_id}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600} color="#1e40af">
                            {item.subject_name || item.subject_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.roll_no}
                            color="secondary"
                            sx={{
                              background: alpha("#1230ae", 0.1),
                              color: "#3a59f5ff",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600} color="#425ef8ff">
                            {item.student_name || item.student_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.student_section || "-"}
                            size="small"
                            sx={{
                              background: alpha("#10b981", 0.15),
                              color: "#10b981",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>{getStatusChip(item)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

            {/* ── Pagination (unchanged) ── */}
            {totalRecords > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  p: 3,
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  borderTop: "1px solid rgba(18,48,174,0.1)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight={600} color="#1230ae">
                    Show:
                  </Typography>
                  <Select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(+e.target.value);
                      setPage(1);
                    }}
                    size="small"
                    sx={{
                      width: 80,
                      fontWeight: 600,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1230ae",
                      },
                    }}
                  >
                    {pageSizes.map((s) => (
                      <MenuItem key={s} value={s} sx={{ fontWeight: 600 }}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="#555">per page</Typography>
                </Box>
                <Typography color="#666" fontSize="0.9rem" fontWeight={500}>
                  {totalRecords} records • Page <strong>{page}</strong> of{" "}
                  <strong>{totalPages}</strong>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: 2,
                      color: page === 1 ? "#ccc" : "#1230ae",
                      bgcolor:
                        page === 1 ? "transparent" : alpha("#1230ae", 0.05),
                      "&:hover": { bgcolor: alpha("#1230ae", 0.15) },
                    }}
                  >
                    <UilAngleLeftB />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 || p === totalPages || Math.abs(p - page) <= 2
                    )
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && p > arr[idx - 1] + 1 && (
                          <Typography sx={{ px: 1, color: "#aaa" }}>
                            ...
                          </Typography>
                        )}
                        <Button
                          onClick={() => setPage(p)}
                          variant={p === page ? "contained" : "text"}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: 2,
                            fontWeight: 700,
                            bgcolor: p === page ? "#1230ae" : "transparent",
                            color: p === page ? "white" : "#1230ae",
                            "&:hover": {
                              bgcolor:
                                p === page ? "#0f2c9c" : alpha("#1230ae", 0.1),
                            },
                          }}
                        >
                          {p}
                        </Button>
                      </React.Fragment>
                    ))}

                  <Button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: 2,
                      color: page === totalPages ? "#ccc" : "#1230ae",
                      bgcolor:
                        page === totalPages
                          ? "transparent"
                          : alpha("#1230ae", 0.05),
                      "&:hover": { bgcolor: alpha("#1230ae", 0.15) },
                    }}
                  >
                    <UilAngleRightB />
                  </Button>
                </Box>
              </Box>
            )}
          </Card>
        )}
      </Box>
    </Mainlayout>
  );
};

export default OMRAssignList;
