// import React, { useEffect, useState, useCallback } from "react";
// import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
// import {
//   UilTrashAlt,
//   UilEditAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
//   UilDownloadAlt,
//   UilInfoCircle,
// } from "@iconscout/react-unicons";
// import Button from "@mui/material/Button";
// import Mainlayout from "../../Layouts/Mainlayout";
// import styles from "../../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router-dom";
// import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import CreateButton from "../../../Components/CommonButton/CreateButton";
// import { Menu } from "@mui/material";
// import excelImg from "../../../../public/excell-img.png";
// import Papa from "papaparse";
// import { debounce } from "lodash";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     column: "",
//     direction: "asc",
//   });
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [checkedRows, setCheckedRows] = useState({});
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [students, setStudents] = useState([]);
//   const [schools, setSchools] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const navigate = useNavigate();

//   // Debounced filter function
//   const debouncedFilter = useCallback(
//     debounce((value, column) => {
//       const filtered = records.filter((row) =>
//         (row[column.toLowerCase()] || "")
//           .toString()
//           .toLowerCase()
//           .includes(value)
//       );
//       setFilteredRecords(filtered);
//       setCurrentPage(1);
//     }, 300),
//     [records]
//   );

//   // Fetch schools and results data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const schoolsResponse = await axios.get(
//           `${API_BASE_URL}/api/get/all-schools`
//         );
//         const schoolsData = Array.isArray(schoolsResponse.data)
//           ? schoolsResponse.data
//           : [];
//         setSchools(schoolsData);

//         const response = await axios.get(`${API_BASE_URL}/api/all-results`, {
//           params: { page: currentPage, limit: pageSize },
//         });
//         const { students, totalRecords, totalPages } = response.data;

//         const updatedStudents = await Promise.all(
//           students.map(async (student) => {
//             const classResponse = await axios.get(
//               `${API_BASE_URL}/api/class/${student.class_id}`
//             );
//             const subjectResponse = await axios.get(
//               `${API_BASE_URL}/api/subject/${student.subject_id}`
//             );
//             const school = schoolsData.find((s) => s.id === student.school_id);

//             return {
//               ...student,
//               class_name: classResponse.data.name || "Unknown Class",
//               subject_name: subjectResponse.data.name || "Unknown Subject",
//               school_name: school ? school.school_name : "Unknown School",
//             };
//           })
//         );

//         setStudents(updatedStudents);
//         setRecords(updatedStudents);
//         setFilteredRecords(updatedStudents);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: error.response?.data?.message || "Failed to fetch data.",
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//         if (error.response?.status === 401) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, pageSize, navigate]);

//   const handlePreviousPage = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       customClass: { popup: "custom-swal-popup" },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${API_BASE_URL}/api/result/${id}`, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           })
//           .then(() => {
//             setStudents((prev) => prev.filter((student) => student.id !== id));
//             setFilteredRecords((prev) =>
//               prev.filter((student) => student.id !== id)
//             );
//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The student has been deleted.",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting student:", error);
//             Swal.fire({
//               icon: "error",
//               title: "Error",
//               text:
//                 error.response?.data?.message ||
//                 "There was an issue deleting the student.",
//               toast: true,
//               position: "top-end",
//               showConfirmButton: false,
//               timer: 2000,
//             });
//           });
//       }
//     });
//   };

//   const handleFilter = (event, column) => {
//     const value = event.target.value.toLowerCase();
//     debouncedFilter(value, column);
//   };

//   const handleSort = (column) => {
//     let direction = "asc";
//     if (sortConfig.column === column && sortConfig.direction === "asc") {
//       direction = "desc";
//     }

//     const sortedData = [...filteredRecords].sort((a, b) => {
//       const aValue = a[column.toLowerCase()];
//       const bValue = b[column.toLowerCase()];
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return direction === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//       return direction === "asc" ? aValue - bValue : bValue - aValue;
//     });

//     setFilteredRecords(sortedData);
//     setSortConfig({ column, direction });
//   };

//   const getSortIcon = (column) => {
//     const isActive = sortConfig.column === column;
//     const isAsc = sortConfig.direction === "asc";
//     return (
//       <div className={styles.sortIconsContainer}>
//         <FaCaretUp
//           className={`${styles.sortIcon} ${
//             isActive && isAsc ? styles.activeSortIcon : ""
//           }`}
//         />
//         <FaCaretDown
//           className={`${styles.sortIcon} ${
//             isActive && !isAsc ? styles.activeSortIcon : ""
//           }`}
//         />
//       </div>
//     );
//   };

//   const handleRowCheck = (id) => {
//     setCheckedRows((prev) => {
//       const newCheckedRows = { ...prev };
//       if (newCheckedRows[id]) {
//         delete newCheckedRows[id];
//       } else {
//         newCheckedRows[id] = true;
//       }
//       return newCheckedRows;
//     });
//   };

//   const handleSelectAll = () => {
//     if (isAllChecked) {
//       setCheckedRows({});
//     } else {
//       const allChecked = filteredRecords.reduce((acc, row) => {
//         acc[row.id] = true;
//         return acc;
//       }, {});
//       setCheckedRows(allChecked);
//     }
//     setIsAllChecked(!isAllChecked);
//   };

//   useEffect(() => {
//     setIsAllChecked(filteredRecords.every((row) => checkedRows[row.id]));
//   }, [checkedRows, filteredRecords]);

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
//     const nameRegex = /^[A-Za-z0-9\s-]+$/;
//     const errors = [];

//     // Validate required fields with trimming
//     if (
//       !student.school_name ||
//       typeof student.school_name !== "string" ||
//       !nameRegex.test(student.school_name.trim())
//     ) {
//       errors.push(
//         `Invalid school_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//       );
//     }
//     if (
//       !student.student_name ||
//       typeof student.student_name !== "string" ||
//       !nameRegex.test(student.student_name.trim())
//     ) {
//       errors.push(
//         `Invalid student_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//       );
//     }
//     if (
//       !student.class_name ||
//       typeof student.class_name !== "string" ||
//       !nameRegex.test(student.class_name.trim())
//     ) {
//       errors.push(
//         `Invalid class_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//       );
//     }
//     if (
//       !student.subject ||
//       typeof student.subject !== "string" ||
//       !nameRegex.test(student.subject.trim())
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
//       !["level-1", "level-2", "level-3"].includes(student.level.trim())
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

//   const parseCSVData = (csvFile) => {
//     setUploadProgress(30);
//     Papa.parse(csvFile, {
//       complete: async (result) => {
//         setUploadProgress(50);
//         const students = result.data
//           .filter((row) => Object.values(row).some((val) => val && val.trim()))
//           .map((row, index) => {
//             const school = schools.find(
//               (s) => s.school_name === (row.school_name?.trim() || "")
//             );
//             return {
//               school_name: row.school_name?.trim() || "", // Keep school_name for backend
//               student_name: row.student_name?.trim() || "",
//               class_name: formatClassName(row.class_name?.trim() || ""),
//               roll_no: row.roll_no?.trim() || "",
//               full_mark: parseInt(row.full_mark) || null,
//               mark_secured: parseInt(row.mark_secured) || null,
//               subject: row.subject?.trim() || "",
//               level: row.level?.trim() || "",
//               __rowIndex: index + 2,
//             };
//           });

//         // Check for duplicates
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

//         // Validate school names against known schools
//         const invalidSchools = uniqueStudents.filter(
//           (student) =>
//             !schools.find((s) => s.school_name === student.school_name)
//         );
//         if (invalidSchools.length > 0) {
//           Swal.fire({
//             icon: "error",
//             title: "Invalid School Names",
//             html: `Some school names do not match known schools:<br>${invalidSchools
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
//       <div style="text-align: left; font-size: 16px;">
//         The following entries are duplicates and will update existing records:
//         <ul style="margin-top: 10px; padding-left: 20px; text-align: left;">
//           ${duplicates.map((item) => `<li>${item}</li>`).join("")}
//         </ul>
//         <p style="margin-top: 15px;"><strong>Do you want to proceed?</strong></p>
//       </div>
//     `,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "✅ Proceed",
//             cancelButtonText: "❌ Cancel",
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
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

//   const validateAndUpload = (students) => {
//     // Client-side validation
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

//     // Remove temporary __rowIndex before uploading
//     const cleanStudents = students.map(({ __rowIndex, ...rest }) => rest);
//     uploadStudentsData(cleanStudents);
//   };

//   const formatClassName = (className) => {
//     if (/^\d$/.test(className)) {
//       return `0${className}`;
//     }
//     return className;
//   };

//   const uploadStudentsData = async (students) => {
//     setUploadProgress(70);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/upload-results`,
//         { students },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       setUploadProgress(100);
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success",
//         text: response.data.message || "Students uploaded successfully.",
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
//         "level-1",
//       ],
//       [
//         "SUNRISE ACADEMY",
//         "Jane Smith",
//         "02",
//         "",
//         "100",
//         "90",
//         "MATH",
//         "level-2",
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

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "Result List" }]} />
//         <div style={{ display: "flex", gap: "10px" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <div
//               onClick={handleClick}
//               style={{
//                 cursor: "pointer",
//                 padding: "14px 12px",
//                 display: "flex",
//                 alignItems: "center",
//                 height: "27px",
//                 fontSize: "14px",
//                 borderRadius: "5px",
//                 color: "#1230AE",
//                 fontFamily: '"Poppins", sans-serif',
//               }}
//               aria-label="Bulk Action Menu"
//             >
//               <img
//                 src={excelImg}
//                 alt="Upload"
//                 style={{ width: "20px", height: "20px", marginRight: "8px" }}
//               />
//               Bulk Action
//             </div>
//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//               anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//               transformOrigin={{ vertical: "top", horizontal: "left" }}
//             >
//               <div
//                 style={{ padding: "10px", fontFamily: "Poppins, sans-serif" }}
//               >
//                 <div style={{ display: "flex", gap: "6px" }}>
//                   <Button
//                     onClick={handleUploadClick}
//                     style={{
//                       fontSize: "13px",
//                       backgroundColor: "#4A4545",
//                       color: "white",
//                     }}
//                     aria-label="Upload CSV"
//                   >
//                     <img
//                       src={excelImg}
//                       alt="Upload"
//                       style={{
//                         width: "20px",
//                         height: "20px",
//                         marginRight: "8px",
//                       }}
//                     />
//                     Upload CSV
//                   </Button>
//                   <Button
//                     onClick={handleDownloadClick}
//                     style={{
//                       fontSize: "13px",
//                       backgroundColor: "#28a745",
//                       color: "white",
//                     }}
//                     aria-label="Download Sample File"
//                   >
//                     <UilDownloadAlt style={{ marginRight: "8px" }} />
//                     Download Sample File
//                   </Button>
//                 </div>
//                 <div className="mt-2">
//                   <p style={{ color: "#4A4545" }} className="fw-bold mb-0">
//                     Note:{" "}
//                     <UilInfoCircle
//                       style={{ height: "16px", width: "16px", color: "blue" }}
//                     />
//                   </p>
//                   <ol
//                     style={{
//                       fontSize: "10px",
//                       paddingLeft: "15px",
//                       color: "gray",
//                     }}
//                   >
//                     <li>
//                       Download the sample CSV file to understand the required
//                       format.
//                     </li>
//                     <li>
//                       Ensure all required fields (school_name, student_name,
//                       class_name, subject) are filled.
//                     </li>
//                     <li>
//                       Use only letters, numbers, spaces, or hyphens for names.
//                     </li>
//                     <li>Save the file in CSV format before uploading.</li>
//                     <li>
//                       Verify school names match existing records in the system.
//                     </li>
//                     <li>
//                       Duplicates will update existing records based on unique
//                       constraints.
//                     </li>
//                   </ol>
//                 </div>
//               </div>
//             </Menu>
//             <input
//               id="fileInput"
//               type="file"
//               accept=".csv"
//               style={{ display: "none" }}
//               onChange={handleFileChange}
//             />
//           </div>
//           <CreateButton link="/result-create" />
//         </div>
//       </div>
//       <div className={`${styles.tablecont} mt-0`}>
//         {loading && <div>Loading data...</div>}
//         {uploadProgress > 0 && uploadProgress < 100 && (
//           <div style={{ marginBottom: "10px" }}>
//             <progress
//               value={uploadProgress}
//               max="100"
//               style={{ width: "100%" }}
//             />
//             <p>Uploading: {uploadProgress}%</p>
//           </div>
//         )}
//         <table
//           className={`${styles.table}`}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow}`}>
//               <th>
//                 <Checkbox
//                   checked={isAllChecked}
//                   onChange={handleSelectAll}
//                   aria-label="Select All"
//                 />
//               </th>
//               {[
//                 "School",
//                 "Student",
//                 "Class",
//                 "Subject",
//                 "Roll No",
//                 "Full Mark",
//                 "Mark Secured",
//                 "Level",
//               ].map((col) => (
//                 <th
//                   key={col}
//                   className={styles.sortableHeader}
//                   onClick={() => handleSort(col)}
//                   style={{ cursor: "pointer" }}
//                   aria-label={`Sort by ${col}`}
//                 >
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span>{col.toUpperCase()}</span>
//                     {getSortIcon(col)}
//                   </div>
//                 </th>
//               ))}
//               <th>ACTION</th>
//             </tr>
//             <tr className={styles.filterRow}>
//               <th></th>
//               {[
//                 "school_name",
//                 "student_name",
//                 "class_name",
//                 "subject_name",
//                 "roll_no",
//                 "full_mark",
//                 "mark_secured",
//                 "level",
//               ].map((col) => (
//                 <th key={col}>
//                   <div className={styles.inputContainer}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                       type="text"
//                       placeholder={`Search ${col.replace("_", " ")}`}
//                       onChange={(e) => handleFilter(e, col)}
//                       className={styles.filterInput}
//                       aria-label={`Filter ${col.replace("_", " ")}`}
//                     />
//                   </div>
//                 </th>
//               ))}
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredRecords.map((row) => (
//               <tr key={row.id} className={styles.dataRow}>
//                 <td>
//                   <Checkbox
//                     checked={!!checkedRows[row.id]}
//                     onChange={() => handleRowCheck(row.id)}
//                     aria-label={`Select row ${row.id}`}
//                   />
//                 </td>
//                 <td>{row.school_name}</td>
//                 <td>{row.student_name}</td>
//                 <td>{row.class_name}</td>
//                 <td>{row.subject_name}</td>
//                 <td>{row.roll_no}</td>
//                 <td>{row.full_mark}</td>
//                 <td>{row.mark_secured}</td>
//                 <td>{row.level}</td>
//                 <td>
//                   <div className={styles.actionButtons}>
//                     <Link
//                       to={`/result/update/${row.id}`}
//                       aria-label={`Edit student ${row.student_name}`}
//                     >
//                       <UilEditAlt className={styles.FaEdit} />
//                     </Link>
//                     <UilTrashAlt
//                       onClick={() => handleDelete(row.id)}
//                       className={`${styles.FaTrash}`}
//                       aria-label={`Delete student ${row.student_name}`}
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="d-flex justify-content-between flex-wrap mt-2">
//           <div
//             className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//           >
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(parseInt(e.target.value, 10));
//                 setCurrentPage(1);
//               }}
//               className={styles.pageSizeSelect}
//               aria-label="Select page size"
//             >
//               {[10, 20, 50, 100].map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//             <p className="my-auto text-secondary">data per Page</p>
//           </div>
//           <div className="my-auto">
//             <p className="my-auto text-secondary">
//               {totalRecords} records, Page {currentPage} of {totalPages}
//             </p>
//           </div>
//           <div className={`${styles.pagination} my-auto`}>
//             <button
//               onClick={handlePreviousPage}
//               disabled={currentPage === 1}
//               className={styles.paginationButton}
//               aria-label="Previous page"
//             >
//               <UilAngleLeftB />
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1)
//               .filter(
//                 (pg) =>
//                   pg === 1 ||
//                   pg === totalPages ||
//                   Math.abs(pg - currentPage) <= 2
//               )
//               .map((pg, index, array) => (
//                 <React.Fragment key={pg}>
//                   {index > 0 && pg > array[index - 1] + 1 && (
//                     <span className={styles.ellipsis}>...</span>
//                   )}
//                   <button
//                     onClick={() => setCurrentPage(pg)}
//                     className={`${styles.paginationButton} ${
//                       currentPage === pg ? styles.activePage : ""
//                     }`}
//                     aria-label={`Go to page ${pg}`}
//                   >
//                     {pg}
//                   </button>
//                 </React.Fragment>
//               ))}
//             <button
//               onClick={handleNextPage}
//               disabled={currentPage === totalPages}
//               className={styles.paginationButton}
//               aria-label="Next page"
//             >
//               <UilAngleRightB />
//             </button>
//           </div>
//         </div>
//       </div>
//     </Mainlayout>
//   );
// }




// import React, { useEffect, useState, useMemo, useCallback } from "react";
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
// import CreateButton from "../../../Components/CommonButton/CreateButton";
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
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [schools, setSchools] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const navigate = useNavigate();
//   const open = Boolean(anchorEl);
//   const gridApiRef = React.useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   // Debounced filter function
//   const debouncedFilter = useCallback(
//     debounce((value) => {
//       setSearchTerm(value);
//       setPage(1);
//     }, 300),
//     []
//   );

//   // Fetch schools and results data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch schools for validation
//         const schoolsResponse = await axios.get(
//           `${API_BASE_URL}/api/get/all-schools`
//         );
//         const schoolsData = Array.isArray(schoolsResponse.data)
//           ? schoolsResponse.data
//           : [];
//         setSchools(schoolsData);

//         // Fetch student results
//         const response = await axios.get(`${API_BASE_URL}/api/all-results`, {
//           params: { page, limit: pageSize, search: searchTerm },
//         });
//         const { students, totalRecords, totalPages } = response.data;

//         const updatedStudents = await Promise.all(
//           students.map(async (student) => {
//             try {
//               const classResponse = await axios.get(
//                 `${API_BASE_URL}/api/class/${student.class_id}`
//               );
//               const subjectResponse = await axios.get(
//                 `${API_BASE_URL}/api/subject/${student.subject_id}`
//               );
//               const school = schoolsData.find((s) => s.id === student.school_id);

//               return {
//                 ...student,
//                 class_name: classResponse.data.name || "Unknown Class",
//                 subject_name: subjectResponse.data.name || "Unknown Subject",
//                 school_name: school ? school.school_name : "Unknown School",
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
//               };
//             }
//           })
//         );

//         setRecords(updatedStudents);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);

//         // Auto-size columns after data update
//         if (gridApiRef.current) {
//           gridApiRef.current.autoSizeAllColumns();
//         }
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
//       }
//     };

//     fetchData();
//   }, [page, pageSize, searchTerm, navigate]);

//   // Handle delete action
//   const handleDelete = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       showCancelButton: true,
//       confirmButtonColor: "#3085D6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       customClass: { popup: "custom-swal-popup" },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${API_BASE_URL}/api/result/${id}`, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           })
//           .then(() => {
//             setRecords((prev) => prev.filter((record) => record.id !== id));
//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The student has been deleted.",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting student:", error);
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text:
//                 error.response?.data?.message ||
//                 "There was an issue deleting the student.",
//               showConfirmButton: false,
//               timer: 2000,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           });
//       }
//     });
//   };

//   // Handle row selection
//   const onSelectionChanged = () => {
//     if (gridApiRef.current) {
//       const selectedNodes = gridApiRef.current.getSelectedNodes();
//       setSelectedRows(selectedNodes.map((node) => node.data));
//     }
//   };

//   // Column definitions
//   const columnDefs = useMemo(
//     () => [

//       {
//         headerName: "SCHOOL",
//         field: "school_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 200,
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value,
//       },
//       {
//         headerName: "STUDENT",
//         field: "student_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 180,
//       },
//       {
//         headerName: "CLASS",
//         field: "class_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "SUBJECT",
//         field: "subject_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "ROLL NO",
//         field: "roll_no",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "FULL MARK",
//         field: "full_mark",
//         sortable: true,
//         filter: "agNumberColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "MARK SECURED",
//         field: "mark_secured",
//         sortable: true,
//         filter: "agNumberColumnFilter",
//         width: 120,
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
//         width: 100,
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
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
//   );

//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.autoSizeAllColumns();
//   };

//   const onFilterChanged = (params) => {
//     if (gridApiRef.current) {
//       const filterModel = gridApiRef.current.getFilterModel();
//       const searchValue = Object.values(filterModel)
//         .map((filter) => filter.filter)
//         .filter((value) => value && value.trim() !== "")
//         .join(" ")
//         .trim();
//       debouncedFilter(searchValue);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

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
//   const genericNameRegex = /^[A-Za-z0-9\s-]+$/;
//   const schoolNameRegex = /^[A-Za-z0-9\s.,-]+$/; // allows ., - and spaces
//   const errors = [];

//   if (
//     !student.school_name ||
//     typeof student.school_name !== "string" ||
//     !schoolNameRegex.test(student.school_name.trim())
//   ) {
//     errors.push(
//       `Invalid school_name at row ${rowIndex}: Must contain only letters, numbers, spaces, dots (.), commas (,), or hyphens (-) and cannot be empty.`
//     );
//   }

//   if (
//     !student.student_name ||
//     typeof student.student_name !== "string" ||
//     !genericNameRegex.test(student.student_name.trim())
//   ) {
//     errors.push(
//       `Invalid student_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//     );
//   }

//   if (
//     !student.class_name ||
//     typeof student.class_name !== "string" ||
//     !genericNameRegex.test(student.class_name.trim())
//   ) {
//     errors.push(
//       `Invalid class_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//     );
//   }

//   if (
//     !student.subject ||
//     typeof student.subject !== "string" ||
//     !genericNameRegex.test(student.subject.trim())
//   ) {
//     errors.push(
//       `Invalid subject at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
//     );
//   }

//   if (student.roll_no && !/^[A-Za-z0-9-]+$/.test(student.roll_no.trim())) {
//     errors.push(
//       `Invalid roll_no at row ${rowIndex}: Must contain only letters, numbers, or hyphens.`
//     );
//   }

//   if (
//     student.mark_secured != null &&
//     (isNaN(Number(student.mark_secured)) || Number(student.mark_secured) < 0)
//   ) {
//     errors.push(
//       `Invalid mark_secured at row ${rowIndex}: Must be a non-negative number.`
//     );
//   }

//   if (
//     student.full_mark != null &&
//     (isNaN(Number(student.full_mark)) || Number(student.full_mark) <= 0)
//   ) {
//     errors.push(
//       `Invalid full_mark at row ${rowIndex}: Must be a positive number.`
//     );
//   }

//   if (
//     student.mark_secured != null &&
//     student.full_mark != null &&
//     Number(student.mark_secured) > Number(student.full_mark)
//   ) {
//     errors.push(
//       `Mark secured (${student.mark_secured}) exceeds full mark (${student.full_mark}) at row ${rowIndex}.`
//     );
//   }

//   if (
//     student.level &&
//     !["level-1", "level-2", "level-3"].includes(student.level.trim())
//   ) {
//     errors.push(
//       `Invalid level at row ${rowIndex}: Must be one of level-1, level-2, level-3.`
//     );
//   }

//   return errors;
// };


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
//             html: `Some school names do not match known schools:<br>${invalidSchools
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

//   const formatClassName = (className) => {
//     if (/^\d$/.test(className)) {
//       return `0${className}`;
//     }
//     return className;
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
//         text: response.data.message || "Students uploaded successfully.",
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
//         "level-1",
//       ],
//       [
//         "SUNRISE ACADEMY",
//         "Jane Smith",
//         "02",
//         "",
//         "100",
//         "90",
//         "MATH",
//         "level-2",
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
//               fontFamily: '"Poppins", sans-serif',
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
//               <div className="mt-2">
//                 <p style={{ color: "#4A4545" }} className="fw-bold mb-0">
//                   Note: <UilInfoCircle style={{ height: "16px", width: "16px", color: "blue" }} />
//                 </p>
//                 <ol
//                   style={{
//                     fontSize: "10px",
//                     paddingLeft: "15px",
//                     color: "gray",
//                   }}
//                 >
//                   <li>Download the sample CSV file to understand the required format.</li>
//                   <li>Ensure all required fields (school_name, student_name, class_name, subject) are filled.</li>
//                   <li>Use only letters, numbers, spaces, or hyphens for names.</li>
//                   <li>Save the file in CSV format before uploading.</li>
//                   <li>Verify school names match existing records in the system.</li>
//                   <li>Duplicates will update existing records based on unique constraints.</li>
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
//           <div>Loading...</div>
//         ) : (
//           <>
//             {uploadProgress > 0 && uploadProgress < 100 && (
//               <div style={{ marginBottom: "10px" }}>
//                 <progress value={uploadProgress} max="100" style={{ width: "100%" }} />
//                 <p>Uploading: {uploadProgress}%</p>
//               </div>
//             )}
//             <div
//               className="ag-theme-alpine"
//               style={{ height: "500px", width: "100%", overflowX: "auto" }}
//             >
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 rowSelection="multiple"
//                 onSelectionChanged={onSelectionChanged}
//                 theme={customTheme}
//                 suppressClearFilterOnColumnChange={true}
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
//                     fontFamily: '"Poppins", sans-serif',
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
//                     fontFamily: '"Poppins", sans-serif',
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
//                       fontFamily: '"Poppins", sans-serif',
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
//                     fontFamily: '"Poppins", sans-serif',
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
//                             fontFamily: '"Poppins", sans-serif',
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
//                           fontFamily: '"Poppins", sans-serif',
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
//                     fontFamily: '"Poppins", sans-serif',
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


import React, { useEffect, useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";
import { Menu, MenuItem, Button } from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../../Components/CommonButton/CreateButton";
import excelImg from "../../../../public/excell-img.png";
import Papa from "papaparse";
import { debounce } from "lodash";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [schools, setSchools] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const gridApiRef = React.useRef(null);
  const pageSizes = [10, 20, 50, 100];

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(1);
    }, 300),
    []
  );

  // Fetch schools and results data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch schools for validation
        const schoolsResponse = await axios.get(
          `${API_BASE_URL}/api/get/all-schools`
        );
        const schoolsData = Array.isArray(schoolsResponse.data)
          ? schoolsResponse.data
          : [];
        setSchools(schoolsData);

        // Fetch student results
        const response = await axios.get(`${API_BASE_URL}/api/all-results`, {
          params: { page, limit: pageSize, search: searchTerm },
        });
        const { students, totalRecords, totalPages } = response.data;

        const updatedStudents = await Promise.all(
          students.map(async (student) => {
            try {
              const classResponse = await axios.get(
                `${API_BASE_URL}/api/class/${student.class_id}`
              );
              const subjectResponse = await axios.get(
                `${API_BASE_URL}/api/subject/${student.subject_id}`
              );
              const school = schoolsData.find((s) => s.id === student.school_id);

              return {
                ...student,
                class_name: classResponse.data.name || "Unknown Class",
                subject_name: subjectResponse.data.name || "Unknown Subject",
                school_name: school ? school.school_name : "Unknown School",
              };
            } catch (error) {
              console.error(
                `Failed to fetch details for student ID: ${student.id}`,
                error
              );
              return {
                ...student,
                class_name: "Unknown Class",
                subject_name: "Unknown Subject",
                school_name: "Unknown School",
              };
            }
          })
        );

        setRecords(updatedStudents);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);

        // Auto-size columns after data update
        if (gridApiRef.current) {
          gridApiRef.current.autoSizeAllColumns();
        }
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

  // Handle delete action
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "custom-swal-popup" },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/api/result/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The student has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting student:", error);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text:
                error.response?.data?.message ||
                "There was an issue deleting the student.",
              showConfirmButton: false,
              timer: 2000,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          });
      }
    });
  };

  // Handle row selection
  const onSelectionChanged = () => {
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();
      setSelectedRows(selectedNodes.map((node) => node.data));
    }
  };

  // Column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "SCHOOL",
        field: "school_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 200,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value,
      },
      {
        headerName: "STUDENT",
        field: "student_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "CLASS",
        field: "class_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "SUBJECT",
        field: "subject_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 120,
      },
      {
        headerName: "ROLL NO",
        field: "roll_no",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "FULL MARK",
        field: "full_mark",
        sortable: true,
        filter: "agNumberColumnFilter",
        width: 120,
      },
      {
        headerName: "MARK SECURED",
        field: "mark_secured",
        sortable: true,
        filter: "agNumberColumnFilter",
        minWidth: 120,
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
        width: 100,
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link to={`/result/update/${params.data.id}`}>
              <UilEditAlt
                style={{
                  color: "#1230AE",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              />
            </Link>
            <UilTrashAlt
              onClick={() => handleDelete(params.data.id)}
              style={{ color: "#FF8787", cursor: "pointer", fontSize: "18px" }}
            />
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 100,
      suppressFilterResetOnColumnChange: true,
    }),
    []
  );

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.autoSizeAllColumns();
  };

  const onFilterChanged = (params) => {
    if (gridApiRef.current) {
      const filterModel = gridApiRef.current.getFilterModel();
      const searchValue = Object.values(filterModel)
        .map((filter) => filter.filter)
        .filter((value) => value && value.trim() !== "")
        .join(" ")
        .trim();
      debouncedFilter(searchValue);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // CSV Handling
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

  const validateStudentData = (student, rowIndex) => {
    const genericNameRegex = /^[A-Za-z0-9\s-]+$/;
    const schoolNameRegex = /^[A-Za-z0-9\s.,-]+$/; // allows ., - and spaces
    const errors = [];

    if (
      !student.school_name ||
      typeof student.school_name !== "string" ||
      !schoolNameRegex.test(student.school_name.trim())
    ) {
      errors.push(
        `Invalid school_name at row ${rowIndex}: Must contain only letters, numbers, spaces, dots (.), commas (,), or hyphens (-) and cannot be empty.`
      );
    }

    if (
      !student.student_name ||
      typeof student.student_name !== "string" ||
      !genericNameRegex.test(student.student_name.trim())
    ) {
      errors.push(
        `Invalid student_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
      );
    }

    if (
      !student.class_name ||
      typeof student.class_name !== "string" ||
      !genericNameRegex.test(student.class_name.trim())
    ) {
      errors.push(
        `Invalid class_name at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
      );
    }

    if (
      !student.subject ||
      typeof student.subject !== "string" ||
      !genericNameRegex.test(student.subject.trim())
    ) {
      errors.push(
        `Invalid subject at row ${rowIndex}: Must contain only letters, numbers, spaces, or hyphens and cannot be empty.`
      );
    }

    if (student.roll_no && !/^[A-Za-z0-9-]+$/.test(student.roll_no.trim())) {
      errors.push(
        `Invalid roll_no at row ${rowIndex}: Must contain only letters, numbers, or hyphens.`
      );
    }

    if (
      student.mark_secured != null &&
      (isNaN(Number(student.mark_secured)) || Number(student.mark_secured) < 0)
    ) {
      errors.push(
        `Invalid mark_secured at row ${rowIndex}: Must be a non-negative number.`
      );
    }

    if (
      student.full_mark != null &&
      (isNaN(Number(student.full_mark)) || Number(student.full_mark) <= 0)
    ) {
      errors.push(
        `Invalid full_mark at row ${rowIndex}: Must be a positive number.`
      );
    }

    if (
      student.mark_secured != null &&
      student.full_mark != null &&
      Number(student.mark_secured) > Number(student.full_mark)
    ) {
      errors.push(
        `Mark secured (${student.mark_secured}) exceeds full mark (${student.full_mark}) at row ${rowIndex}.`
      );
    }

    if (
      student.level &&
      !["level-1", "level-2", "level-3"].includes(student.level.trim())
    ) {
      errors.push(
        `Invalid level at row ${rowIndex}: Must be one of level-1, level-2, level-3.`
      );
    }

    return errors;
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
            __rowIndex: index + 2,
          }));

        const uniqueStudents = [];
        const seen = new Set();
        const duplicates = [];
        students.forEach((student) => {
          const key = `${student.student_name}-${student.school_name}-${student.class_name}-${student.subject}`;
          if (seen.has(key)) {
            duplicates.push(
              `Duplicate entry at row ${student.__rowIndex}: ${student.student_name} (${key})`
            );
          } else {
            seen.add(key);
            uniqueStudents.push(student);
          }
        });

        const invalidSchools = uniqueStudents.filter(
          (student) =>
            !schools.find((s) => s.school_name === student.school_name)
        );
        if (invalidSchools.length > 0) {
          Swal.fire({
            icon: "error",
            title: "Invalid School Names",
            html: `Some school names do not match known schools:<br>${invalidSchools
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

  const formatClassName = (className) => {
    if (/^\d$/.test(className)) {
      return `0${className}`;
    }
    return className;
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
        }
      );

      setUploadProgress(100);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success",
        text: response.data.message || "Students uploaded successfully.",
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
        "level-1",
      ],
      [
        "SUNRISE ACADEMY",
        "Jane Smith",
        "02",
        "",
        "100",
        "90",
        "MATH",
        "level-2",
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
              : field
          )
          .join(",")
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

  const customTheme = {
    "--ag-font-size": "14px",
    "--ag-row-height": "40px",
    "--ag-header-background-color": "#1230AE",
    "--ag-header-foreground-color": "#FFFFFF",
    "--ag-grid-size": "6px",
    "--ag-cell-horizontal-padding": "8px",
    fontFamily: "'Poppins', sans-serif",
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
              fontFamily: '"Poppins", sans-serif',
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
              <div className="mt-2">
                <p style={{ color: "#4A4545" }} className="fw-bold mb-0">
                  Note: <UilInfoCircle style={{ height: "16px", width: "16px", color: "blue" }} />
                </p>
                <ol
                  style={{
                    fontSize: "10px",
                    paddingLeft: "15px",
                    color: "gray",
                  }}
                >
                  <li>Download the sample CSV file to understand the required format.</li>
                  <li>Ensure all required fields (school_name, student_name, class_name, subject) are filled.</li>
                  <li>Use only letters, numbers, spaces, or hyphens for names.</li>
                  <li>Save the file in CSV format before uploading.</li>
                  <li>Verify school names match existing records in the system.</li>
                  <li>Duplicates will update existing records based on unique constraints.</li>
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
          padding: "1.5%",
          borderRadius: "5px",
          marginTop: "0",
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginBottom: "10px" }}>
                <progress value={uploadProgress} max="100" style={{ width: "100%" }} />
                <p>Uploading: {uploadProgress}%</p>
              </div>
            )}
            <div
              className="ag-theme-alpine"
              style={{ height: "500px", width: "100%", overflowX: "auto" }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={records}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                pagination={false}
                suppressPaginationPanel={true}
                animateRows={true}
                onFilterChanged={onFilterChanged}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
                theme={customTheme}
                suppressClearFilterOnColumnChange={true}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginTop: "8px",
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
                  data per Page
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
                <label style={{ fontFamily: "Nunito, sans-serif" }}>
                  <p
                    style={{
                      margin: "auto",
                      color: "#6C757D",
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "14px",
                    }}
                  >
                    {totalRecords} of {page}-{totalPages}
                  </p>
                </label>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (pg) =>
                      pg === 1 || pg === totalPages || Math.abs(pg - page) <= 2
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
                          backgroundColor: page === pg ? "#007BFF" : "#F5F5F5",
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
                  disabled={page === totalPages}
                  style={{
                    backgroundColor:
                      page === totalPages ? "#E0E0E0" : "#F5F5F5",
                    color: page === totalPages ? "#aaa" : "#333",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                    padding: "3px 3.5px",
                    width: "33px",
                    height: "30px",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
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
        )}
      </div>
    </Mainlayout>
  );
}