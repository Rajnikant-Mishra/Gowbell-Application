// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   useCallback,
//   useRef,
// } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   UilTrashAlt,
//   UilEditAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
//   UilDownloadAlt,
//   UilInfoCircle,
// } from "@iconscout/react-unicons";
// import { Menu, MenuItem, Button } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import CreateButton from "../../CommonButton/CreateButton";
// import excelImg from "../../../../public/excell-img.png";
// import Papa from "papaparse";
// import { debounce } from "lodash";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [schools, setSchools] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const navigate = useNavigate();
//   const open = Boolean(anchorEl);
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return "N/A";
//     try {
//       return new Date(timestamp).toLocaleString("en-US", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true,
//       });
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   // Size columns to fit
//   const sizeColumnsToFit = useCallback(() => {
//     if (gridApiRef.current) {
//       gridApiRef.current.sizeColumnsToFit();
//     }
//   }, []);

//   // Debounced filter function
//   const debouncedFilter = useCallback(
//     debounce((value) => {
//       setSearchTerm(value);
//       setPage(1);
//       setSearchLoading(true);
//     }, 300),
//     []
//   );

//   // Fetch schools and results data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setSearchLoading(true);
//       try {
//         const sessionId = localStorage.getItem("currentSessionId") || null;

//         // Fetch schools for validation
//         const schoolsResponse = await axios.get(
//           `${API_BASE_URL}/api/get/all-schools`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         const schoolsData = Array.isArray(schoolsResponse.data)
//           ? schoolsResponse.data
//           : [];
//         setSchools(schoolsData);

//         // Fetch student results
//         const response = await axios.get(`${API_BASE_URL}/api/all-results`, {
//           params: {
//             page,
//             limit: pageSize,
//             search: searchTerm,
//             session_id: sessionId,
//           },
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });

//         const { students, totalRecords, totalPages } = response.data;

//         if (!Array.isArray(students)) {
//           throw new Error("Expected 'students' to be an array");
//         }

//         const updatedStudents = await Promise.all(
//           students.map(async (student) => {
//             try {
//               const classResponse = await axios.get(
//                 `${API_BASE_URL}/api/class/${student.class_id}`,
//                 {
//                   headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                   },
//                 }
//               );
//               const subjectResponse = await axios.get(
//                 `${API_BASE_URL}/api/subject/${student.subject_id}`,
//                 {
//                   headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                   },
//                 }
//               );
//               const school = schoolsData.find(
//                 (s) => s.id === student.school_id
//               );

//               return {
//                 ...student,
//                 class_name: classResponse.data.name || "Unknown Class",
//                 subject_name: subjectResponse.data.name || "Unknown Subject",
//                 school_name: school ? school.school_name : "Unknown School",
//                 created_at: formatTimestamp(student.created_at),
//               };
//             } catch (error) {
//               console.error(
//                 `Failed to fetch details for student ID: ${student.id}`,
//                 error
//               );
//               return {
//                 ...student,
//                 class_name: "Unknown Class",
//                 subject_name: "Unknown Subject",
//                 school_name: "Unknown School",
//                 created_at: formatTimestamp(student.created_at),
//               };
//             }
//           })
//         );

//         setRecords(updatedStudents);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: error.response?.data?.message || "Failed to fetch data.",
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//         if (error.response?.status === 401) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//         setSearchLoading(false);
//       }
//     };

//     fetchData();
//   }, [page, pageSize, searchTerm, navigate]);

//   // Handle session changes
//   useEffect(() => {
//     const handleSessionChange = () => {
//       setPage(1); // Reset to first page on session change
//     };
//     window.addEventListener("storage", handleSessionChange);
//     return () => window.removeEventListener("storage", handleSessionChange);
//   }, []);

//   // Handle delete action
//   const handleDelete = useCallback(
//     (id) => {
//       Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         showCancelButton: true,
//         confirmButtonColor: "#3085D6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//         customClass: { popup: "custom-swal-popup" },
//       }).then((result) => {
//         if (result.isConfirmed) {
//           const token = localStorage.getItem("token");
//           if (!token) {
//             Swal.fire({
//               icon: "error",
//               title: "Error!",
//               text: "Authentication token is missing.",
//               toast: true,
//               position: "top-end",
//               showConfirmButton: false,
//               timer: 1500,
//             });
//             return;
//           }

//           axios
//             .delete(`${API_BASE_URL}/api/result/${id}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then(() => {
//               setRecords((prev) => prev.filter((record) => record.id !== id));
//               sizeColumnsToFit();
//               Swal.fire({
//                 position: "top-end",
//                 icon: "success",
//                 title: "Success!",
//                 text: "The result has been deleted.",
//                 showConfirmButton: false,
//                 timer: 1000,
//                 timerProgressBar: true,
//                 toast: true,
//                 background: "#fff",
//                 customClass: { popup: "small-swal" },
//               });
//             })
//             .catch((error) => {
//               console.error("Error deleting result:", error);
//               Swal.fire({
//                 position: "top-end",
//                 icon: "error",
//                 title: "Error!",
//                 text:
//                   error.response?.data?.message ||
//                   "There was an issue deleting the result.",
//                 showConfirmButton: false,
//                 timer: 2000,
//                 toast: true,
//                 background: "#fff",
//                 customClass: { popup: "small-swal" },
//               });
//             });
//         }
//       });
//     },
//     [sizeColumnsToFit]
//   );

//   // Handle row selection
//   const onSelectionChanged = useCallback(() => {
//     if (gridApiRef.current) {
//       const selectedNodes = gridApiRef.current.getSelectedNodes();
//       setSelectedRows(selectedNodes.map((node) => node.data));
//     }
//   }, []);

//   // Column definitions
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "SCHOOL",
//         field: "school_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 200,
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value || "N/A",
//       },
//       {
//         headerName: "STUDENT",
//         field: "student_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 180,
//         valueFormatter: (params) => params.value || "N/A",
//       },
//       {
//         headerName: "CLASS",
//         field: "class_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 120,
//         valueFormatter: (params) => params.value || "No Class",
//       },
//       {
//         headerName: "SUBJECT",
//         field: "subject_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 120,
//         valueFormatter: (params) => params.value || "No Subject",
//       },
//       {
//         headerName: "ROLL NO",
//         field: "roll_no",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 120,
//         valueFormatter: (params) => params.value || "N/A",
//       },
//       {
//         headerName: "FULL MARK",
//         field: "full_mark",
//         sortable: true,
//         filter: "agNumberColumnFilter",
//         minWidth: 120,
//         valueFormatter: (params) =>
//           params.value != null ? params.value : "N/A",
//       },
//       {
//         headerName: "MARK SECURED",
//         field: "mark_secured",
//         sortable: true,
//         filter: "agNumberColumnFilter",
//         minWidth: 120,
//         valueFormatter: (params) =>
//           params.value != null ? params.value : "N/A",
//       },
//       {
//         headerName: "LEVEL",
//         field: "level",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 120,
//         valueFormatter: (params) => params.value || "N/A",
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 150,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         minWidth: 100,
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Link to={`/result/update/${params.data.id}`}>
//               <UilEditAlt
//                 style={{
//                   color: "#1230AE",
//                   cursor: "pointer",
//                   fontSize: "18px",
//                 }}
//               />
//             </Link>
//             <UilTrashAlt
//               onClick={() => handleDelete(params.data.id)}
//               style={{ color: "#FF8787", cursor: "pointer", fontSize: "18px" }}
//             />
//           </div>
//         ),
//       },
//     ],
//     [handleDelete]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       flex: 1,
//     }),
//     []
//   );

//   const onGridReady = useCallback(
//     (params) => {
//       gridApiRef.current = params.api;
//       sizeColumnsToFit();
//     },
//     [sizeColumnsToFit]
//   );

//   const onGridSizeChanged = useCallback(() => {
//     sizeColumnsToFit();
//   }, [sizeColumnsToFit]);

//   const onFilterChanged = useCallback(
//     (params) => {
//       if (gridApiRef.current) {
//         const filterModel = gridApiRef.current.getFilterModel();
//         const searchValue = Object.values(filterModel)
//           .map((filter) => filter.filter)
//           .filter((value) => value && value.trim() !== "")
//           .join(" ")
//           .trim();
//         debouncedFilter(searchValue);
//       }
//     },
//     [debouncedFilter]
//   );

//   const handlePreviousPage = useCallback(() => {
//     if (page > 1) setPage(page - 1);
//   }, [page]);

//   const handleNextPage = useCallback(() => {
//     if (page < totalPages) setPage(page + 1);
//   }, [page, totalPages]);

//   // CSV Handling
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUploadClick = () => {
//     document.getElementById("fileInput").click();
//     handleClose();
//   };

//   const validateStudentData = (student, rowIndex) => {
//     const genericNameRegex = /^[A-Za-z0-9\s-]+$/;
//     const schoolNameRegex = /^[A-Za-z0-9\s.,-]+$/; // allows ., - and spaces
//     const errors = [];

//     if (
//       !student.school_name ||
//       typeof student.school_name !== "string" ||
//       !schoolNameRegex.test(student.school_name.trim())
//     ) {
//       errors.push(
//         `Invalid school_name at row ${rowIndex}: Must contain only letters, numbers, spaces, dots (.), commas (,), or hyphens (-) and cannot be empty.`
//       );
//     }

//     if (
//       !student.student_name ||
//       typeof student.student_name !== "string" ||
//       !genericNameRegex.test(student.student_name.trim())
//     ) {
//       errors.push(
//         `Invalid student_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//       );
//     }

//     if (
//       !student.class_name ||
//       typeof student.class_name !== "string" ||
//       !genericNameRegex.test(student.class_name.trim())
//     ) {
//       errors.push(
//         `Invalid class_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//       );
//     }

//     if (
//       !student.subject ||
//       typeof student.subject !== "string" ||
//       !genericNameRegex.test(student.subject.trim())
//     ) {
//       errors.push(
//         `Invalid subject at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//       );
//     }

//     if (student.roll_no && !/^[A-Za-z0-9-]+$/.test(student.roll_no.trim())) {
//       errors.push(
//         `Invalid roll_no at row ${rowIndex}: Must contain only letters, numbers, or hyphens.`
//       );
//     }

//     if (
//       student.mark_secured != null &&
//       (isNaN(Number(student.mark_secured)) || Number(student.mark_secured) < 0)
//     ) {
//       errors.push(
//         `Invalid mark_secured at row ${rowIndex}: Must be a non-negative number.`
//       );
//     }

//     if (
//       student.full_mark != null &&
//       (isNaN(Number(student.full_mark)) || Number(student.full_mark) <= 0)
//     ) {
//       errors.push(
//         `Invalid full_mark at row ${rowIndex}: Must be a positive number.`
//       );
//     }

//     if (
//       student.mark_secured != null &&
//       student.full_mark != null &&
//       Number(student.mark_secured) > Number(student.full_mark)
//     ) {
//       errors.push(
//         `Mark secured (${student.mark_secured}) exceeds full mark (${student.full_mark}) at row ${rowIndex}.`
//       );
//     }

//     if (
//       student.level &&
//       !["Level 1", "Level 2", "Level 3"].includes(student.level.trim())
//     ) {
//       errors.push(
//         `Invalid level at row ${rowIndex}: Must be one of level-1, level-2, level-3.`
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
//         timer: 3000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//       return;
//     }

//     setUploadProgress(10);
//     const reader = new FileReader();
//     reader.onload = () => {
//       parseCSVData(reader.result);
//     };
//     reader.readAsText(file);
//   };

//   const formatClassName = (className) => {
//     if (/^\d$/.test(className)) {
//       return `0${className}`;
//     }
//     return className;
//   };

//   const parseCSVData = (csvFile) => {
//     setUploadProgress(30);
//     Papa.parse(csvFile, {
//       complete: async (result) => {
//         setUploadProgress(50);
//         const students = result.data
//           .filter((row) => Object.values(row).some((val) => val && val.trim()))
//           .map((row, index) => ({
//             school_name: row.school_name?.trim() || "",
//             student_name: row.student_name?.trim() || "",
//             class_name: formatClassName(row.class_name?.trim() || ""),
//             roll_no: row.roll_no?.trim() || "",
//             full_mark: parseInt(row.full_mark) || null,
//             mark_secured: parseInt(row.mark_secured) || null,
//             subject: row.subject?.trim() || "",
//             level: row.level?.trim() || "",
//             session_id: localStorage.getItem("currentSessionId") || null,
//             __rowIndex: index + 2,
//           }));

//         const uniqueStudents = [];
//         const seen = new Set();
//         const duplicates = [];
//         students.forEach((student) => {
//           const key = `${student.student_name}-${student.school_name}-${student.class_name}-${student.subject}`;
//           if (seen.has(key)) {
//             duplicates.push(
//               `Duplicate entry at row ${student.__rowIndex}: ${student.student_name} (${key})`
//             );
//           } else {
//             seen.add(key);
//             uniqueStudents.push(student);
//           }
//         });

//         const invalidSchools = uniqueStudents.filter(
//           (student) =>
//             !schools.find((s) => s.school_name === student.school_name)
//         );
//         if (invalidSchools.length > 0) {
//           Swal.fire({
//             icon: "error",
//             title: "Invalid School Names",
//             html: `school names do not match known schools:<br>${invalidSchools
//               .map((s) => `${s.school_name} (row ${s.__rowIndex})`)
//               .join("<br>")}`,
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
//             title: "⚠️ Duplicate Entries Detected",
//             html: `
//               <div style="text-align: left; font-size: 16px;">
//                 The following entries are duplicates and will update existing records:
//                 <ul style="margin-top: 10px; padding-left: 20px; text-align: left;">
//                   ${duplicates.map((item) => `<li>${item}</li>`).join("")}
//                 </ul>
//                 <p style="margin-top: 15px;"><strong>Do you want to proceed?</strong></p>
//               </div>
//             `,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "✅ Proceed",
//             cancelButtonColor: "#d33",
//             confirmButtonColor: "#3085d6",
//             customClass: { popup: "small-swal" },
//             width: "600px",
//           }).then((result) => {
//             if (result.isConfirmed) {
//               validateAndUpload(uniqueStudents);
//             } else {
//               setUploadProgress(0);
//             }
//           });
//         } else {
//           validateAndUpload(uniqueStudents);
//         }
//       },
//       header: true,
//       skipEmptyLines: true,
//       error: (error) => {
//         Swal.fire({
//           icon: "error",
//           title: "CSV Parsing Error",
//           text: "Failed to parse the CSV file. Please check the file format.",
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 3000,
//         });
//         console.error("CSV Parsing Error:", error);
//         setUploadProgress(0);
//       },
//     });
//   };

//   const validateAndUpload = async (students) => {
//     const validationErrors = [];
//     students.forEach((student) => {
//       const errors = validateStudentData(student, student.__rowIndex);
//       if (errors.length > 0) {
//         validationErrors.push(...errors);
//       }
//     });

//     if (validationErrors.length > 0) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Errors",
//         html: validationErrors.join("<br>"),
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 5000,
//       });
//       setUploadProgress(0);
//       return;
//     }

//     const cleanStudents = students.map(({ __rowIndex, ...rest }) => rest);
//     setUploadProgress(70);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/upload-results`,
//         { students: cleanStudents },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       setUploadProgress(100);
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success",
//         text: response.data.message || "Results uploaded successfully.",
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       }).then(() => {
//         window.location.reload();
//       });
//     } catch (error) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Upload Failed",
//         text:
//           error.response?.data?.message || "An error occurred during upload.",
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//       console.error("Upload Error:", error);
//       setUploadProgress(0);
//     }
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
//     link.download = "student_results_sample.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     handleClose();
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
//           <Breadcrumb data={[{ name: "Result List" }]} />
//         </div>
//         <div style={{ display: "flex", gap: "10px" }}>
//           <div
//             onClick={handleClick}
//             style={{
//               cursor: "pointer",
//               padding: "14px 12px",
//               display: "flex",
//               alignItems: "center",
//               height: "27px",
//               fontSize: "14px",
//               borderRadius: "5px",
//               color: "#1230AE",
//               fontFamily: "'Poppins', sans-serif",
//             }}
//             aria-label="Bulk Action Menu"
//           >
//             <img
//               src={excelImg}
//               alt="Upload"
//               style={{ width: "20px", height: "20px", marginRight: "8px" }}
//             />
//             Bulk Action
//           </div>
//           <Menu
//             anchorEl={anchorEl}
//             open={open}
//             onClose={handleClose}
//             anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//             transformOrigin={{ vertical: "top", horizontal: "left" }}
//           >
//             <div style={{ padding: "10px", fontFamily: "Poppins, sans-serif" }}>
//               <div style={{ display: "flex", gap: "6px" }}>
//                 <Button
//                   onClick={handleUploadClick}
//                   style={{
//                     fontSize: "13px",
//                     backgroundColor: "#4A4545",
//                     color: "white",
//                   }}
//                   aria-label="Upload CSV"
//                 >
//                   <img
//                     src={excelImg}
//                     alt="Upload"
//                     style={{
//                       width: "20px",
//                       height: "20px",
//                       marginRight: "8px",
//                     }}
//                   />
//                   Upload CSV
//                 </Button>
//                 <Button
//                   onClick={handleDownloadClick}
//                   style={{
//                     fontSize: "13px",
//                     backgroundColor: "#28a745",
//                     color: "white",
//                   }}
//                   aria-label="Download Sample File"
//                 >
//                   <UilDownloadAlt style={{ marginRight: "8px" }} />
//                   Download Sample File
//                 </Button>
//               </div>
//               <div style={{ marginTop: "8px" }}>
//                 <p
//                   style={{
//                     color: "#4A4545",
//                     fontWeight: "bold",
//                     marginBottom: "0",
//                   }}
//                 >
//                   Note:{" "}
//                   <UilInfoCircle
//                     style={{ height: "16px", width: "16px", color: "blue" }}
//                   />
//                 </p>
//                 <ol
//                   style={{
//                     fontSize: "10px",
//                     paddingLeft: "15px",
//                     color: "gray",
//                   }}
//                 >
//                   <li>
//                     Download the sample CSV file to understand the required
//                     format.
//                   </li>
//                   <li>
//                     Ensure all required fields (school_name, student_name,
//                     class_name, subject) are filled.
//                   </li>
//                   <li>
//                     Use only letters, numbers, spaces, or hyphens for names.
//                   </li>
//                   <li>Save the file in CSV format before uploading.</li>
//                   <li>
//                     Verify school names match existing records in the system.
//                   </li>
//                   <li>
//                     Duplicates will update existing records based on unique
//                     constraints.
//                   </li>
//                 </ol>
//               </div>
//             </div>
//           </Menu>
//           <input
//             id="fileInput"
//             type="file"
//             accept=".csv"
//             style={{ display: "none" }}
//             onChange={handleFileChange}
//           />
//           <CreateButton link="/result-create" />
//         </div>
//       </div>
//       <div
//         style={{
//           background: "white",
//           padding: "1.5%",
//           borderRadius: "5px",
//           marginTop: "0",
//         }}
//       >
//         {loading ? (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <div
//               className="spinner"
//               style={{
//                 border: "4px solid #f3f3f3",
//                 borderTop: "4px solid #1230AE",
//                 borderRadius: "50%",
//                 width: "24px",
//                 height: "24px",
//                 animation: "spin 1s linear infinite",
//               }}
//             />
//             <span>Loading...</span>
//             <style>{`
//               @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             `}</style>
//           </div>
//         ) : (
//           <>
//             {uploadProgress > 0 && uploadProgress < 100 && (
//               <div style={{ marginBottom: "10px" }}>
//                 <progress
//                   value={uploadProgress}
//                   max="100"
//                   style={{ width: "100%" }}
//                 />
//                 <p>Uploading: {uploadProgress}%</p>
//               </div>
//             )}
//             <div
//               className="ag-theme-alpine"
//               style={{
//                 height: "500px",
//                 width: "100%",
//                 overflowX: "auto",
//                 position: "relative",
//               }}
//             >
//               {searchLoading && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: "10px",
//                     right: "10px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     background: "#fff",
//                     padding: "5px 10px",
//                     borderRadius: "5px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <div
//                     className="spinner"
//                     style={{
//                       border: "3px solid #f3f3f3",
//                       borderTop: "3px solid #1230AE",
//                       borderRadius: "50%",
//                       width: "16px",
//                       height: "16px",
//                       animation: "spin 1s linear infinite",
//                     }}
//                   />
//                   <span>Searching...</span>
//                 </div>
//               )}
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 onGridSizeChanged={onGridSizeChanged}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 rowSelection="multiple"
//                 onSelectionChanged={onSelectionChanged}
//                 theme={customTheme}
//               />
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 marginTop: "8px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   alignItems: "center",
//                   gap: "10px",
//                 }}
//               >
//                 <select
//                   value={pageSize}
//                   onChange={(e) => {
//                     const selectedSize = parseInt(e.target.value, 10);
//                     setPageSize(selectedSize);
//                     setPage(1);
//                   }}
//                   style={{
//                     width: "55px",
//                     padding: "0px 5px",
//                     height: "30px",
//                     fontSize: "14px",
//                     border: "1px solid rgb(225, 220, 220)",
//                     borderRadius: "2px",
//                     color: "#564545",
//                     fontWeight: "bold",
//                     outline: "none",
//                     transition: "all 0.3s ease",
//                     fontFamily: "'Poppins', sans-serif",
//                   }}
//                 >
//                   {pageSizes.map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//                 <p
//                   style={{
//                     margin: "auto",
//                     color: "#6C757D",
//                     fontFamily: "'Poppins', sans-serif",
//                     fontSize: "14px",
//                   }}
//                 >
//                   data per Page
//                 </p>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   margin: "auto",
//                 }}
//               >
//                 <label style={{ fontFamily: "Nunito, sans-serif" }}>
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: "'Poppins', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {totalRecords} of {page}-{totalPages}
//                   </p>
//                 </label>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <button
//                   onClick={handlePreviousPage}
//                   disabled={page === 1}
//                   style={{
//                     backgroundColor: page === 1 ? "#E0E0E0" : "#F5F5F5",
//                     color: page === 1 ? "#aaa" : "#333",
//                     border: "1px solid #ccc",
//                     borderRadius: "7px",
//                     padding: "3px 3.5px",
//                     width: "33px",
//                     height: "30px",
//                     cursor: page === 1 ? "not-allowed" : "pointer",
//                     transition: "all 0.3s ease",
//                     margin: "0 4px",
//                     fontFamily: "'Poppins', sans-serif",
//                   }}
//                 >
//                   <UilAngleLeftB />
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => i + 1)
//                   .filter(
//                     (pg) =>
//                       pg === 1 || pg === totalPages || Math.abs(pg - page) <= 2
//                   )
//                   .map((pg, index, array) => (
//                     <React.Fragment key={pg}>
//                       {index > 0 && pg > array[index - 1] + 1 && (
//                         <span
//                           style={{
//                             color: "#aaa",
//                             fontSize: "14px",
//                             fontFamily: "'Poppins', sans-serif",
//                           }}
//                         >
//                           ...
//                         </span>
//                       )}
//                       <button
//                         onClick={() => setPage(pg)}
//                         style={{
//                           backgroundColor: page === pg ? "#007BFF" : "#F5F5F5",
//                           color: page === pg ? "#fff" : "#333",
//                           border:
//                             page === pg
//                               ? "1px solid #0056B3"
//                               : "1px solid #ccc",
//                           borderRadius: "7px",
//                           padding: "4px 13.5px",
//                           height: "30px",
//                           cursor: "pointer",
//                           transition: "all 0.3s ease",
//                           margin: "0 4px",
//                           fontWeight: page === pg ? "bold" : "normal",
//                           fontFamily: "'Poppins', sans-serif",
//                           fontSize: "14px",
//                         }}
//                       >
//                         {pg}
//                       </button>
//                     </React.Fragment>
//                   ))}
//                 <button
//                   onClick={handleNextPage}
//                   disabled={page === totalPages}
//                   style={{
//                     backgroundColor:
//                       page === totalPages ? "#E0E0E0" : "#F5F5F5",
//                     color: page === totalPages ? "#aaa" : "#333",
//                     border: "1px solid #ccc",
//                     borderRadius: "7px",
//                     padding: "3px 3.5px",
//                     width: "33px",
//                     height: "30px",
//                     cursor: page === totalPages ? "not-allowed" : "pointer",
//                     transition: "all 0.3s ease",
//                     margin: "0 4px",
//                     fontFamily: "'Poppins', sans-serif",
//                   }}
//                 >
//                   <UilAngleRightB />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </Mainlayout>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilSearch,
  UilTimes,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  Button,
} from "@mui/material";

import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../CommonButton/CreateButton";
import excelImg from "../../../../public/excell-img.png";
import Papa from "papaparse";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";

export default function DataTable() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [schools, setSchools] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [checkedRows, setCheckedRows] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);

  const pageSizes = [10, 20, 50, 100];
  const open = Boolean(anchorEl);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Fetch schools + results
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const sessionId = localStorage.getItem("currentSessionId") || null;

        // 1. Fetch schools
        const schoolsRes = await axios.get(
          `${API_BASE_URL}/api/get/all-schools`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const schoolsData = Array.isArray(schoolsRes.data)
          ? schoolsRes.data
          : [];
        setSchools(schoolsData);

        // 2. Fetch results
        const res = await axios.get(`${API_BASE_URL}/api/all-results`, {
          params: {
            page,
            limit: pageSize,
            search: searchTerm.trim() || undefined,
            session_id: sessionId,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        const { students = [], totalRecords = 0, totalPages = 0 } = res.data;

        const updatedStudents = await Promise.all(
          students.map(async (student) => {
            // FIX: Use String comparison to handle ID type mismatch
            const school = schoolsData.find(
              (s) => String(s.id) === String(student.school_id),
            );

            let class_name = "Unknown Class";
            let subject_name = "Unknown Subject";

            try {
              const [classRes, subjectRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/class/${student.class_id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API_BASE_URL}/api/subject/${student.subject_id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
              ]);

              class_name = classRes.data?.name || "Unknown Class";
              subject_name = subjectRes.data?.name || "Unknown Subject";
            } catch (err) {
              console.warn(
                `Failed to load class/subject for student ${student.id}`,
                err,
              );
            }

            return {
              ...student,
              sl_no: (page - 1) * pageSize + (students.indexOf(student) + 1),
              school_name: school
                ? school.school_name?.toUpperCase() || "N/A"
                : "N/A",
              class_name,
              subject_name,
              created_at: formatTimestamp(student.created_at),
            };
          }),
        );

        setRecords(updatedStudents);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Failed to fetch data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchTerm, navigate]);

  // Reset page on session change
  useEffect(() => {
    const handleSessionChange = () => {
      setPage(1);
    };
    window.addEventListener("storage", handleSessionChange);
    return () => window.removeEventListener("storage", handleSessionChange);
  }, []);

  const handleRowCheck = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedRows({});
      setIsAllChecked(false);
    } else {
      const all = {};
      records.forEach((row) => (all[row.id] = true));
      setCheckedRows(all);
      setIsAllChecked(true);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: "Authentication token is missing.",
            toast: true,
            timer: 1500,
          });
          return;
        }

        axios
          .delete(`${API_BASE_URL}/api/result/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setIsAllChecked(false);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The result has been deleted.",
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text:
                error.response?.data?.message ||
                "There was an issue deleting the result.",
              showConfirmButton: false,
              timer: 2000,
              toast: true,
            });
          });
      }
    });
  };

  // ────────────────────────────────────────────────
  // Bulk Action Menu (your exact UI preserved)
  // ────────────────────────────────────────────────

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
    handleClose();
  };

  // ────────────────────────────────────────────────
  // CSV Functions (kept exactly as in your original code)
  // ────────────────────────────────────────────────

  const validateStudentData = (student, rowIndex) => {
    const genericNameRegex = /^[A-Za-z0-9\s-]+$/;
    const schoolNameRegex = /^[A-Za-z0-9\s.,-]+$/;
    const errors = [];

    if (
      !student.school_name ||
      typeof student.school_name !== "string" ||
      !schoolNameRegex.test(student.school_name.trim())
    ) {
      errors.push(
        `Invalid school_name at row ${rowIndex}: Must contain only letters, numbers, spaces, dots (.), commas (,), or hyphens (-) and cannot be empty.`,
      );
    }

    if (
      !student.student_name ||
      typeof student.student_name !== "string" ||
      !genericNameRegex.test(student.student_name.trim())
    ) {
      errors.push(
        `Invalid student_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`,
      );
    }

    if (
      !student.class_name ||
      typeof student.class_name !== "string" ||
      !genericNameRegex.test(student.class_name.trim())
    ) {
      errors.push(
        `Invalid class_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`,
      );
    }

    if (
      !student.subject ||
      typeof student.subject !== "string" ||
      !genericNameRegex.test(student.subject.trim())
    ) {
      errors.push(
        `Invalid subject at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`,
      );
    }

    if (student.roll_no && !/^[A-Za-z0-9-]+$/.test(student.roll_no.trim())) {
      errors.push(
        `Invalid roll_no at row ${rowIndex}: Must contain only letters, numbers, or hyphens.`,
      );
    }

    if (
      student.mark_secured != null &&
      (isNaN(Number(student.mark_secured)) || Number(student.mark_secured) < 0)
    ) {
      errors.push(
        `Invalid mark_secured at row ${rowIndex}: Must be a non-negative number.`,
      );
    }

    if (
      student.full_mark != null &&
      (isNaN(Number(student.full_mark)) || Number(student.full_mark) <= 0)
    ) {
      errors.push(
        `Invalid full_mark at row ${rowIndex}: Must be a positive number.`,
      );
    }

    if (
      student.mark_secured != null &&
      student.full_mark != null &&
      Number(student.mark_secured) > Number(student.full_mark)
    ) {
      errors.push(
        `Mark secured (${student.mark_secured}) exceeds full mark (${student.full_mark}) at row ${rowIndex}.`,
      );
    }

    if (
      student.level &&
      !["Level 1", "Level 2", "Level 3"].includes(student.level.trim())
    ) {
      errors.push(
        `Invalid level at row ${rowIndex}: Must be one of level-1, level-2, level-3.`,
      );
    }

    return errors;
  };

  const formatClassName = (className) => {
    if (/^\d$/.test(className)) {
      return `0${className}`;
    }
    return className;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["text/csv", "application/vnd.ms-excel"].includes(file.type)) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Invalid File",
        text: "Please upload a valid CSV file.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
      return;
    }

    setUploadProgress(10);
    const reader = new FileReader();
    reader.onload = () => {
      parseCSVData(reader.result);
    };
    reader.readAsText(file);
  };

  const parseCSVData = (csvFile) => {
    setUploadProgress(30);
    Papa.parse(csvFile, {
      complete: async (result) => {
        setUploadProgress(50);
        const students = result.data
          .filter((row) => Object.values(row).some((val) => val && val.trim()))
          .map((row, index) => ({
            school_name: row.school_name?.trim() || "",
            student_name: row.student_name?.trim() || "",
            class_name: formatClassName(row.class_name?.trim() || ""),
            roll_no: row.roll_no?.trim() || "",
            full_mark: parseInt(row.full_mark) || null,
            mark_secured: parseInt(row.mark_secured) || null,
            subject: row.subject?.trim() || "",
            level: row.level?.trim() || "",
            session_id: localStorage.getItem("currentSessionId") || null,
            __rowIndex: index + 2,
          }));

        const uniqueStudents = [];
        const seen = new Set();
        const duplicates = [];
        students.forEach((student) => {
          const key = `${student.student_name}-${student.school_name}-${student.class_name}-${student.subject}`;
          if (seen.has(key)) {
            duplicates.push(
              `Duplicate entry at row ${student.__rowIndex}: ${student.student_name} (${key})`,
            );
          } else {
            seen.add(key);
            uniqueStudents.push(student);
          }
        });

        const invalidSchools = uniqueStudents.filter(
          (student) =>
            !schools.find((s) => s.school_name === student.school_name),
        );
        if (invalidSchools.length > 0) {
          Swal.fire({
            icon: "error",
            title: "Invalid School Names",
            html: `school names do not match known schools:<br>${invalidSchools
              .map((s) => `${s.school_name} (row ${s.__rowIndex})`)
              .join("<br>")}`,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
          });
          setUploadProgress(0);
          return;
        }

        if (duplicates.length > 0) {
          Swal.fire({
            title: "⚠️ Duplicate Entries Detected",
            html: `
              <div style="text-align: left; font-size: 16px;">
                The following entries are duplicates and will update existing records:
                <ul style="margin-top: 10px; padding-left: 20px; text-align: left;">
                  ${duplicates.map((item) => `<li>${item}</li>`).join("")}
                </ul>
                <p style="margin-top: 15px;"><strong>Do you want to proceed?</strong></p>
              </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "✅ Proceed",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            customClass: { popup: "small-swal" },
            width: "600px",
          }).then((result) => {
            if (result.isConfirmed) {
              validateAndUpload(uniqueStudents);
            } else {
              setUploadProgress(0);
            }
          });
        } else {
          validateAndUpload(uniqueStudents);
        }
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "CSV Parsing Error",
          text: "Failed to parse the CSV file. Please check the file format.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        console.error("CSV Parsing Error:", error);
        setUploadProgress(0);
      },
    });
  };

  const validateAndUpload = async (students) => {
    const validationErrors = [];
    students.forEach((student) => {
      const errors = validateStudentData(student, student.__rowIndex);
      if (errors.length > 0) {
        validationErrors.push(...errors);
      }
    });

    if (validationErrors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Errors",
        html: validationErrors.join("<br>"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
      });
      setUploadProgress(0);
      return;
    }

    const cleanStudents = students.map(({ __rowIndex, ...rest }) => rest);
    setUploadProgress(70);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/upload-results`,
        { students: cleanStudents },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      setUploadProgress(100);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success",
        text: response.data.message || "Results uploaded successfully.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Upload Failed",
        text:
          error.response?.data?.message || "An error occurred during upload.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
      console.error("Upload Error:", error);
      setUploadProgress(0);
    }
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

    const sampleRows = [
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

    const csvContent = [
      headers.join(","),
      ...sampleRows.map((row) =>
        row
          .map((field) =>
            typeof field === "string" &&
            (field.includes(",") || field.includes('"'))
              ? `"${field.replace(/"/g, '""')}"`
              : field,
          )
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_results_sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

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
          <Breadcrumb data={[{ name: "Result List" }]} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            onClick={handleClick}
            style={{
              cursor: "pointer",
              padding: "14px 12px",
              display: "flex",
              alignItems: "center",
              height: "27px",
              fontSize: "14px",
              borderRadius: "5px",
              color: "#1230AE",
              fontFamily: "'Poppins', sans-serif",
            }}
            aria-label="Bulk Action Menu"
          >
            <img
              src={excelImg}
              alt="Upload"
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
            Bulk Action
          </div>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <div style={{ padding: "10px", fontFamily: "Poppins, sans-serif" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <Button
                  onClick={handleUploadClick}
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#4A4545",
                    color: "white",
                  }}
                  aria-label="Upload CSV"
                >
                  <img
                    src={excelImg}
                    alt="Upload"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                  Upload CSV
                </Button>
                <Button
                  onClick={handleDownloadClick}
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#28a745",
                    color: "white",
                  }}
                  aria-label="Download Sample File"
                >
                  <UilDownloadAlt style={{ marginRight: "8px" }} />
                  Download Sample File
                </Button>
              </div>
              <div style={{ marginTop: "8px" }}>
                <p
                  style={{
                    color: "#4A4545",
                    fontWeight: "bold",
                    marginBottom: "0",
                  }}
                >
                  Note:{" "}
                  <UilInfoCircle
                    style={{ height: "16px", width: "16px", color: "blue" }}
                  />
                </p>
                <ol
                  style={{
                    fontSize: "10px",
                    paddingLeft: "15px",
                    color: "gray",
                  }}
                >
                  <li>
                    Download the sample CSV file to understand the required
                    format.
                  </li>
                  <li>
                    Ensure all required fields (school_name, student_name,
                    class_name, subject) are filled.
                  </li>
                  <li>
                    Use only letters, numbers, spaces, or hyphens for names.
                  </li>
                  <li>Save the file in CSV format before uploading.</li>
                  <li>
                    Verify school names match existing records in the system.
                  </li>
                  <li>
                    Duplicates will update existing records based on unique
                    constraints.
                  </li>
                </ol>
              </div>
            </div>
          </Menu>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <CreateButton link="/result-create" />
        </div>
      </div>

      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by student name, roll no, school, subject..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={{ mb: 3, maxWidth: 520 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <UilSearch color="#666" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <UilTimes size="18" color="#888" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <CircularProgress size={50} />
            <p style={{ marginTop: 20, color: "#555" }}>Loading results...</p>
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 520,
                overflowX: "auto",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Table stickyHeader sx={{ minWidth: 1200, border: "none" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{ bgcolor: "rgb(17 61 236)", color: "white" }}
                    >
                      <Checkbox
                        sx={{ color: "white" }}
                        checked={isAllChecked}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    {[
                      "SCHOOL",
                      "STUDENT",
                      "CLASS",
                      "SUBJECT",
                      "ROLL NO",
                      "FULL MARK",
                      "MARK SECURED",
                      "LEVEL",
                      "CREATED AT",
                      "ACTION",
                    ].map((title) => (
                      <TableCell
                        key={title}
                        sx={{
                          bgcolor: "rgb(17 61 236)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "13.5px",
                          whiteSpace: "nowrap",
                          textAlign: title === "Action" ? "center" : "left",
                        }}
                      >
                        {title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} align="center" sx={{ py: 8 }}>
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                          borderBottom: "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={!!checkedRows[row.id]}
                            onChange={() => handleRowCheck(row.id)}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>{row.school_name}</TableCell>
                        <TableCell>{row.student_name || "—"}</TableCell>
                        <TableCell>{row.class_name}</TableCell>
                        <TableCell>{row.subject_name}</TableCell>
                        <TableCell>{row.roll_no || "—"}</TableCell>
                        <TableCell>{row.full_mark ?? "—"}</TableCell>
                        <TableCell>{row.mark_secured ?? "—"}</TableCell>
                        <TableCell>{row.level || "—"}</TableCell>
                        <TableCell>{row.created_at}</TableCell>
                        <TableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              justifyContent: "center",
                            }}
                          >
                            <Link to={`/result/update/${row.id}`}>
                              <UilEditAlt
                                style={{ color: "#1230AE", fontSize: 22 }}
                              />
                            </Link>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(row.id)}
                            >
                              <UilTrashAlt
                                style={{ color: "#e74c3c", fontSize: 22 }}
                              />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: "16px",
                gap: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span style={{ color: "#555", fontSize: "14px" }}>
                  rows per page
                </span>
              </div>

              <div style={{ color: "#555", fontSize: "14px" }}>
                {totalRecords} records • Page {page} of {totalPages || 1}
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: page === 1 ? "#f0f0f0" : "#fff",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <UilAngleLeftB />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 2,
                  )
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && p > arr[idx - 1] + 1 && <span>...</span>}
                      <button
                        onClick={() => setPage(p)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid",
                          borderColor: page === p ? "#1976d2" : "#ccc",
                          background: page === p ? "#1976d2" : "#fff",
                          color: page === p ? "white" : "#333",
                          fontWeight: page === p ? "bold" : "normal",
                        }}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: page === totalPages ? "#f0f0f0" : "#fff",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  <UilAngleRightB />
                </button>
              </div>
            </div>
          </>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <progress
              value={uploadProgress}
              max="100"
              style={{ width: "60%" }}
            />
            <p style={{ marginTop: 8 }}>Uploading: {uploadProgress}%</p>
          </div>
        )}
      </div>
    </Mainlayout>
  );
}
