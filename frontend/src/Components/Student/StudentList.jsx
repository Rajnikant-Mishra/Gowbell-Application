// import React, { useEffect, useState, useMemo, useRef } from "react";
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
// import { Menu, MenuItem } from "@mui/material";
// import Mainlayout from "../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router-dom";
// import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import CreateButton from "../../Components/CommonButton/CreateButton";
// import excelImg from "../../../public/excell-img.png";
// import Papa from "papaparse";
// import "../Common-Css/DeleteSwal.css";
// import "../Common-Css/Swallfire.css";

// export default function DataTable() {
//   const [students, setStudents] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [checkedRows, setCheckedRows] = useState({});
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     return new Date(timestamp).toLocaleString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   // Fetch student data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/get/student`, {
//           params: { page, limit: pageSize, search: searchTerm },
//         });

//         const { students, totalRecords, totalPages } = response.data;

//         // Fetch user, class, and subject details for each student
//         const formattedData = await Promise.all(
//           students.map(async (record) => {
//             try {
//               // Fetch user details for created_by
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               const userName = userResponse.data.username;

//               // Fetch class details
//               let className = "Unknown Class";
//               if (record.class_name) {
//                 try {
//                   const classResponse = await axios.get(
//                     `${API_BASE_URL}/api/class/${record.class_name}`
//                   );
//                   className = classResponse.data.name || "Unknown Class";
//                 } catch (error) {
//                   console.error(
//                     `Failed to fetch class details for class_id: ${record.class_name}`,
//                     error
//                   );
//                 }
//               }

//               // Fetch subject details
//               let subjectNames = ["Unknown Subject"];
//               try {
//                 let subjectIds = [];
//                 if (typeof record.student_subject === "string") {
//                   try {
//                     subjectIds = JSON.parse(record.student_subject || "[]");
//                   } catch (e) {
//                     console.error(
//                       `Invalid JSON for student_subject: ${record.student_subject}`,
//                       e
//                     );
//                   }
//                 } else if (Array.isArray(record.student_subject)) {
//                   subjectIds = record.student_subject;
//                 }

//                 if (subjectIds.length > 0) {
//                   subjectNames = await Promise.all(
//                     subjectIds.map(async (subjectId) => {
//                       try {
//                         const subjectResponse = await axios.get(
//                           `${API_BASE_URL}/api/subject/${subjectId}`
//                         );
//                         return subjectResponse.data.name || "Unknown Subject";
//                       } catch (error) {
//                         console.error(
//                           `Failed to fetch subject details for subject_id: ${subjectId}`,
//                           error
//                         );
//                         return "Unknown Subject";
//                       }
//                     })
//                   );
//                 }
//               } catch (error) {
//                 console.error(
//                   `Error processing student_subject for record: ${record.id}`,
//                   error
//                 );
//               }

//               return {
//                 ...record,
//                 student_subject: subjectNames,
//                 class_name: className,
//                 created_by: userName,
//                 updated_by: userName,
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//               };
//             } catch (error) {
//               console.error(
//                 `Failed to fetch user details for created_by: ${record.created_by}`,
//                 error
//               );
//               return {
//                 ...record,
//                 student_subject: ["Unknown Subject"],
//                 class_name: "Unknown Class",
//                 created_by: "Unknown User",
//                 updated_by: "Unknown User",
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//               };
//             }
//           })
//         );

//         setStudents(formattedData);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: "Failed to fetch student data.",
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounceTimeout = setTimeout(() => {
//       fetchData();
//     }, 500);

//     return () => clearTimeout(debounceTimeout);
//   }, [page, pageSize, searchTerm]);

//   // Handle row deletion
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
//           .delete(`${API_BASE_URL}/api/get/student/${id}`)
//           .then(() => {
//             setStudents((prev) => prev.filter((student) => student.id !== id));
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
//               text: "There was an issue deleting the student.",
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

//   // Handle checkbox selection
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

//   const handleSelectAll = (params) => {
//     if (isAllChecked) {
//       setCheckedRows({});
//       params.api.deselectAll();
//     } else {
//       const allChecked = students.reduce((acc, row) => {
//         acc[row.id] = true;
//         return acc;
//       }, {});
//       setCheckedRows(allChecked);
//       params.api.selectAll();
//     }
//     setIsAllChecked(!isAllChecked);
//   };

//   // Bulk upload and CSV download
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

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.type !== "text/csv") {
//         Swal.fire({
//           position: "top-end",
//           icon: "warning",
//           title: "Invalid File",
//           text: "Please upload a valid CSV file.",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         });
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = () => {
//         const csvData = reader.result;
//         parseCSVData(csvData);
//       };
//       reader.readAsText(file);
//     }
//   };

//   const formatClassName = (className) => {
//     if (/^\d$/.test(className)) {
//       return `0${className}`;
//     }
//     return className;
//   };

//   const parseCSVData = (csvFile) => {
//     Papa.parse(csvFile, {
//       complete: (result) => {
//         if (!Array.isArray(result.data) || result.data.length === 0) {
//           Swal.fire({
//             position: "top-end",
//             icon: "warning",
//             title: "Invalid File",
//             text: "CSV file is empty or invalid.",
//             showConfirmButton: false,
//             timer: 2000,
//             toast: true,
//           });
//           return;
//         }

//         const students = result.data.map((row) => ({
//           school_name: row.school_name?.trim() || "",
//           student_name: row.student_name?.trim() || "",
//           class_name: formatClassName(row.class_name?.trim() || ""),
//           student_section: row.student_section?.trim() || "",
//           mobile_number: row.mobile_number?.trim() || "",
//           whatsapp_number: row.whatsapp_number?.trim() || "",
//           student_subject: row.student_subject
//             ? row.student_subject.split(",").map((s) => s.trim())
//             : [],
//           country: row.country?.trim() || "",
//           state: row.state?.trim() || "",
//           district: row.district?.trim() || "",
//           city: row.city?.trim() || "",
//         }));

//         uploadStudentsData(students);
//       },
//       header: true,
//       skipEmptyLines: true,
//     });
//   };

//   const uploadStudentsData = async (students) => {
//     if (!Array.isArray(students) || students.length === 0) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error",
//         text: "No student data to upload.",
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//       });
//       return;
//     }
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Unauthorized. Please log in again.");
//       }

//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/student/bulk-upload`,
//         students,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Upload Successful",
//         text: `Successfully uploaded ${response.data.insertedCount} students.`,
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       }).then(() => {
//         window.location.reload();
//       });
//     } catch (error) {
//       console.error("Upload Error:", error);
//       let errorMessage = "An error occurred.";
//       if (error.response?.data) {
//         const { message, errors } = error.response.data;
//         if (errors) {
//           if (typeof errors === "object" && !Array.isArray(errors)) {
//             errorMessage = Object.values(errors).join("\n");
//           } else if (Array.isArray(errors)) {
//             errorMessage = errors
//               .map((err) => err.message || "Unknown error")
//               .join("\n");
//           }
//         } else {
//           errorMessage = message || errorMessage;
//         }
//       }
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Upload Failed",
//         text: errorMessage,
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadClick = () => {
//     const headers = [
//       "school_name",
//       "student_name",
//       "class_name",
//       "student_section",
//       "mobile_number",
//       "whatsapp_number",
//       "student_subject",
//       "country",
//       "state",
//       "district",
//       "city",
//       "approved",
//       "approved_by",
//     ];
//     const rows = [
//       [
//         "ABC School",
//         "Alice Johnson",
//         "01",
//         "A",
//         "1234567890",
//         "1234567890",
//         "math",
//         "India",
//         "Odisha",
//         "Cuttack",
//         "Aliabad",
//         "false",
//         "null",
//       ],
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...rows.map((row) => row.join(",")),
//     ].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "studentdata.csv";
//     link.click();
//     handleClose();
//   };

//   // AG-Grid column definitions
//   const columnDefs = useMemo(
//     () => [

//       {
//         headerName: "SCHOOL",
//         field: "school_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) => params.value?.toUpperCase() || "",
//       },
//       {
//         headerName: "STUDENT",
//         field: "student_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) => params.value?.toUpperCase() || "",
//       },
//       {
//         headerName: "ROLL NUMBER",
//         field: "roll_no",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "CLASS",
//         field: "class_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "SECTION",
//         field: "student_section",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 100,
//       },
//       {
//         headerName: "MOBILE NUMBER",
//         field: "mobile_number",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 130,
//       },
//       {
//         headerName: "SUBJECT",
//         field: "student_subject",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) =>
//           Array.isArray(params.value) ? params.value.join(", ") : "",
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "UPDATED BY",
//         field: "updated_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//       },
//       {
//         headerName: "UPDATED AT",
//         field: "updated_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         width: 100,
//         cellRenderer: (params) => (
//           <div
//             Rhode
//             Island
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Link to={`/student/update/${params.data.id}`}>
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
//       // floatingFilter: true,
//       minWidth: 100,
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
//       setSearchTerm(searchValue);
//       setPage(1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
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
//           <Breadcrumb data={[{ name: "Student" }]} />
//         </div>
//         <div style={{ display: "flex", gap: "10px" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               padding: "10px",
//               borderRadius: "15px",
//             }}
//           >
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
//                 fontFamily: "'Poppins', sans-serif",
//               }}
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
//                 style={{
//                   fontFamily: "Poppins, sans-serif",
//                   padding: "0px 10px",
//                 }}
//               >
//                 <div style={{ display: "flex", gap: "6px" }}>
//                   <button
//                     type="button"
//                     className="btn"
//                     onClick={handleUploadClick}
//                     style={{
//                       fontSize: "13px",
//                       backgroundColor: "#4A4545",
//                       color: "white",
//                     }}
//                   >
//                     <img
//                       src={excelImg}
//                       alt="Upload"
//                       style={{
//                         width: "30px",
//                         height: "30px",
//                         marginRight: "8px",
//                       }}
//                     />
//                     Upload Excel
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-success"
//                     onClick={handleDownloadClick}
//                     style={{ fontSize: "13px" }}
//                   >
//                     <UilDownloadAlt /> Download Sample File
//                   </button>
//                 </div>
//                 <div className="mt-2">
//                   <p style={{ color: "#4A4545" }} className="fw-bold mb-0">
//                     Note:
//                     <UilInfoCircle
//                       style={{ height: "20px", width: "20px", color: "blue" }}
//                     />
//                   </p>
//                   <ol
//                     style={{
//                       fontSize: "10px",
//                       paddingLeft: "10px",
//                       color: "gray",
//                     }}
//                   >
//                     <li>Click Download Sample File to get the template.</li>
//                     <li>Fill in the data as per the given columns.</li>
//                     <li>Save the file in Excel format (XLSX or CSV).</li>
//                     <li>Use Upload Excel to bulk upload your data.</li>
//                     <li>
//                       Ensure all required fields are filled correctly to avoid
//                       errors.
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
//           <CreateButton link="/student-create" />
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
//             <div
//               className="ag-theme-alpine"
//               style={{ height: "500px", width: "100%", overflowX: "auto" }}
//             >
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={students}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 theme={customTheme}
//                 rowSelection="multiple"
//                 onSelectionChanged={(params) => {
//                   const selectedRows = params.api.getSelectedRows();
//                   const newCheckedRows = selectedRows.reduce((acc, row) => {
//                     acc[row.id] = true;
//                     return acc;
//                   }, {});
//                   setCheckedRows(newCheckedRows);
//                   setIsAllChecked(selectedRows.length === students.length);
//                 }}
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
//                     setPageSize(parseInt(e.target.value, 10));
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





// import React, { useEffect, useState, useMemo, useRef } from "react";
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
// import { Menu, MenuItem } from "@mui/material";
// import Mainlayout from "../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router-dom";
// import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import CreateButton from "../../Components/CommonButton/CreateButton";
// import excelImg from "../../../public/excell-img.png";
// import Papa from "papaparse";
// import "../Common-Css/DeleteSwal.css";
// import "../Common-Css/Swallfire.css";

// export default function DataTable() {
//   const [students, setStudents] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [checkedRows, setCheckedRows] = useState({});
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     return new Date(timestamp).toLocaleString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   // Fetch student data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/get/student`, {
//           params: { page, limit: pageSize, search: searchTerm },
//         });

//         const { students, totalRecords, totalPages } = response.data;

//         // Fetch user, class, and subject details for each student
//         const formattedData = await Promise.all(
//           students.map(async (record) => {
//             try {
//               // Fetch user details for created_by
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               const userName = userResponse.data.username;

//               // Fetch class details
//               let className = "Unknown Class";
//               if (record.class_name) {
//                 try {
//                   const classResponse = await axios.get(
//                     `${API_BASE_URL}/api/class/${record.class_name}`
//                   );
//                   className = classResponse.data.name || "Unknown Class";
//                 } catch (error) {
//                   console.error(
//                     `Failed to fetch class details for class_id: ${record.class_name}`,
//                     error
//                   );
//                 }
//               }

//               // Fetch subject details
//               let subjectNames = ["Unknown Subject"];
//               try {
//                 let subjectIds = [];
//                 if (typeof record.student_subject === "string") {
//                   try {
//                     subjectIds = JSON.parse(record.student_subject || "[]");
//                   } catch (e) {
//                     console.error(
//                       `Invalid JSON for student_subject: ${record.student_subject}`,
//                       e
//                     );
//                   }
//                 } else if (Array.isArray(record.student_subject)) {
//                   subjectIds = record.student_subject;
//                 }

//                 if (subjectIds.length > 0) {
//                   subjectNames = await Promise.all(
//                     subjectIds.map(async (subjectId) => {
//                       try {
//                         const subjectResponse = await axios.get(
//                           `${API_BASE_URL}/api/subject/${subjectId}`
//                         );
//                         return subjectResponse.data.name || "Unknown Subject";
//                       } catch (error) {
//                         console.error(
//                           `Failed to fetch subject details for subject_id: ${subjectId}`,
//                           error
//                         );
//                         return "Unknown Subject";
//                       }
//                     })
//                   );
//                 }
//               } catch (error) {
//                 console.error(
//                   `Error processing student_subject for record: ${record.id}`,
//                   error
//                 );
//               }

//               return {
//                 ...record,
//                 student_subject: subjectNames,
//                 class_name: className,
//                 created_by: userName,
//                 updated_by: userName,
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//               };
//             } catch (error) {
//               console.error(
//                 `Failed to fetch user details for created_by: ${record.created_by}`,
//                 error
//               );
//               return {
//                 ...record,
//                 student_subject: ["Unknown Subject"],
//                 class_name: "Unknown Class",
//                 created_by: "Unknown User",
//                 updated_by: "Unknown User",
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//               };
//             }
//           })
//         );

//         setStudents(formattedData);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: "Failed to fetch student data.",
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounceTimeout = setTimeout(() => {
//       fetchData();
//     }, 500);

//     return () => clearTimeout(debounceTimeout);
//   }, [page, pageSize, searchTerm]);

//   // Handle row deletion
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
//           .delete(`${API_BASE_URL}/api/get/student/${id}`)
//           .then(() => {
//             setStudents((prev) => prev.filter((student) => student.id !== id));
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
//               text: "There was an issue deleting the student.",
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

//   // Handle checkbox selection
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

//   const handleSelectAll = (params) => {
//     if (isAllChecked) {
//       setCheckedRows({});
//       params.api.deselectAll();
//     } else {
//       const allChecked = students.reduce((acc, row) => {
//         acc[row.id] = true;
//         return acc;
//       }, {});
//       setCheckedRows(allChecked);
//       params.api.selectAll();
//     }
//     setIsAllChecked(!isAllChecked);
//   };

//   // Bulk upload and CSV download
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

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.type !== "text/csv") {
//         Swal.fire({
//           position: "top-end",
//           icon: "warning",
//           title: "Invalid File",
//           text: "Please upload a valid CSV file.",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         });
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = () => {
//         const csvData = reader.result;
//         parseCSVData(csvData);
//       };
//       reader.readAsText(file);
//     }
//   };

//   const formatClassName = (className) => {
//     if (/^\d$/.test(className)) {
//       return `0${className}`;
//     }
//     return className;
//   };

//   const parseCSVData = (csvFile) => {
//     Papa.parse(csvFile, {
//       complete: (result) => {
//         if (!Array.isArray(result.data) || result.data.length === 0) {
//           Swal.fire({
//             position: "top-end",
//             icon: "warning",
//             title: "Invalid File",
//             text: "CSV file is empty or invalid.",
//             showConfirmButton: false,
//             timer: 2000,
//             toast: true,
//           });
//           return;
//         }

//         const students = result.data
//           .filter((row) => {
//             const schoolName = row.school_name?.trim();
//             const studentName = row.student_name?.trim();
//             const className = row.class_name?.trim();
//             return schoolName && studentName && className;
//           })
//           .map((row) => ({
//             school_name: row.school_name?.trim() || "",
//             student_name: row.student_name?.trim() || "",
//             class_name: formatClassName(row.class_name?.trim() || ""),
//             student_section: row.student_section?.trim() || null,
//             mobile_number: row.mobile_number?.trim() || null,
//             whatsapp_number: row.whatsapp_number?.trim() || null,
//             student_subject: row.student_subject
//               ? row.student_subject
//                   .split(",")
//                   .map((s) => s.trim())
//                   .filter((s) => s)
//               : [],
//             country: row.country?.trim() || "",
//             state: row.state?.trim() || "",
//             district: row.district?.trim() || "",
//             city: row.city?.trim() || "",
//             approved: row.approved
//               ? row.approved.trim().toLowerCase() === "true"
//               : false,
//             approved_by: row.approved_by?.trim() || null,
//           }));

//         if (students.length === 0) {
//           Swal.fire({
//             position: "top-end",
//             icon: "warning",
//             title: "Invalid Data",
//             text: "No valid student records found in the CSV file. Ensure school_name, student_name, and class_name are non-empty.",
//             showConfirmButton: false,
//             timer: 3000,
//             toast: true,
//           });
//           return;
//         }

//         uploadStudentsData(students);
//       },
//       header: true,
//       skipEmptyLines: true,
//     });
//   };

//   const uploadStudentsData = async (students) => {
//     if (!Array.isArray(students) || students.length === 0) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error",
//         text: "No student data to upload.",
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//       });
//       return;
//     }
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Unauthorized. Please log in again.");
//       }

//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/student/bulk-upload`,
//         students,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Upload Successful",
//         text: `Successfully uploaded ${response.data.insertedCount} students.`,
//         showConfirmButton: false,
//         timer: 1500,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       }).then(() => {
//         window.location.reload();
//       });
//     } catch (error) {
//       console.error("Upload Error:", error);
//       let errorMessage = "An error occurred while uploading students.";
//       if (error.response?.data) {
//         const { message, errors } = error.response.data;
//         if (errors) {
//           if (typeof errors === "object" && !Array.isArray(errors)) {
//             // Handle inconsistencies (e.g., mismatched school_name, class_name)
//             errorMessage = Object.entries(errors)
//               .map(([field, msg]) => `${field}: ${msg}`)
//               .filter((msg, index, self) => self.indexOf(msg) === index) // Remove duplicates
//               .join("\n");
//           } else if (Array.isArray(errors)) {
//             // Handle group-specific errors (e.g., School not found)
//             errorMessage = Array.from(
//               new Set(
//                 errors.map((err) => `${err.group || "General"}: ${err.message}`)
//               )
//             ).join("\n");
//           } else {
//             errorMessage = message || errorMessage;
//           }
//         } else {
//           errorMessage = message || errorMessage;
//         }
//       } else if (error.message.includes("School not found")) {
//         errorMessage =
//           "The specified school_name does not exist in the database.";
//       }
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Upload Failed",
//         text: errorMessage,
//         showConfirmButton: false,
//         timer: 3000,
//         toast: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadClick = () => {
//     const headers = [
//       "school_name",
//       "student_name",
//       "class_name",
//       "student_section",
//       "mobile_number",
//       "whatsapp_number",
//       "student_subject",
//       "country",
//       "state",
//       "district",
//       "city",
//       "approved",
//       "approved_by",
//     ];
//     const rows = [
//       [
//         "ABC School",
//         "Alice Johnson",
//         "01",
//         "A",
//         "1234567890",
//         "1234567890",
//         "GIMO",
//         "India",
//         "Odisha",
//         "Cuttack",
//         "Aliabad",
//         "false",
//         "admin",
//       ],
      
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...rows.map((row) => row.join(",")),
//     ].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "studentdata.csv";
//     link.click();
//     handleClose();
//   };

//   // AG-Grid column definitions
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "SCHOOL",
//         field: "school_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) => params.value?.toUpperCase() || "",
//       },
//       {
//         headerName: "STUDENT",
//         field: "student_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) => params.value?.toUpperCase() || "",
//       },
//       {
//         headerName: "ROLL NUMBER",
//         field: "roll_no",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "CLASS",
//         field: "class_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "SECTION",
//         field: "student_section",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 100,
//       },
//       {
//         headerName: "MOBILE NUMBER",
//         field: "mobile_number",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 130,
//       },
//       {
//         headerName: "SUBJECT",
//         field: "student_subject",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) =>
//           Array.isArray(params.value) ? params.value.join(", ") : "",
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "UPDATED BY",
//         field: "updated_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//       },
//       {
//         headerName: "UPDATED AT",
//         field: "updated_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
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
//             <Link to={`/student/update/${params.data.id}`}>
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
//       setSearchTerm(searchValue);
//       setPage(1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
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
//       {/* <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "16px",
//         }}
//       >
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "Student" }]} />
//         </div>
//         <div style={{ display: "flex", gap: "10px" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               padding: "10px",
//               borderRadius: "15px",
//             }}
//           >
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
//                 fontFamily: "'Poppins', sans-serif",
//               }}
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
//                 style={{
//                   fontFamily: "Poppins, sans-serif",
//                   padding: "0px 10px",
//                 }}
//               >
//                 <div style={{ display: "flex", gap: "6px" }}>
//                   <button
//                     type="button"
//                     className="btn"
//                     onClick={handleUploadClick}
//                     style={{
//                       fontSize: "13px",
//                       backgroundColor: "#4A4545",
//                       color: "white",
//                     }}
//                   >
//                     <img
//                       src={excelImg}
//                       alt="Upload"
//                       style={{
//                         width: "30px",
//                         height: "30px",
//                         marginRight: "8px",
//                       }}
//                     />
//                     Upload Excel
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-success"
//                     onClick={handleDownloadClick}
//                     style={{ fontSize: "13px" }}
//                   >
//                     <UilDownloadAlt /> Download Sample File
//                   </button>
//                 </div>
//                 <div className="mt-2">
//                   <p style={{ color: "#4A4545" }} className="fw-bold mb-0">
//                     Note:
//                     <UilInfoCircle
//                       style={{ height: "20px", width: "20px", color: "blue" }}
//                     />
//                   </p>
//                   <ol
//                     style={{
//                       fontSize: "10px",
//                       paddingLeft: "10px",
//                       color: "gray",
//                     }}
//                   >
//                     <li>Click Download Sample File to get the template.</li>
//                     <li>Fill in the data as per the given columns.</li>
//                     <li>Save the file in Excel format (XLSX or CSV).</li>
//                     <li>Use Upload Excel to bulk upload your data.</li>
//                     <li>
//                       Ensure required fields (school_name, student_name, class_name) are non-empty.
//                     </li>
//                     <li>
//                       school_name must match an existing school in the database.
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
//           <CreateButton link="/student-create" />
//         </div>
//       </div> */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "16px",
//         }}
//       >
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "Student" }]} />
//         </div>
//         <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "10px",
//               flexDirection: "column",
//               borderRadius: "15px",
//             }}
//           >
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
//                 textDecoration: "none",
//                 fontFamily: '"Poppins", sans-serif',
//               }}
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
//               style={{ padding: "0px", margin: "0px" }}
//             >
//               <div
//                 style={{
//                   fontFamily: "Poppins, sans-serif",
//                   gap: "15px",
//                   borderRadius: "10px",
//                   padding: "0px 10px",
//                 }}
//               >
//                 <div style={{ display: "flex", gap: "6px" }}>
//                   <button
//                     type="button"
//                     style={{
//                       fontSize: "13px",
//                       backgroundColor: "#4A4545",
//                       color: "white",
//                       fontWeight: "500",
//                       border: "none",
//                       padding: "6px 12px",
//                       borderRadius: "4px",
//                     }}
//                     onClick={handleUploadClick}
//                   >
//                     <img
//                       src={excelImg}
//                       alt="Upload"
//                       style={{
//                         width: "30px",
//                         height: "30px",
//                         marginRight: "8px",
//                       }}
//                     />
//                     Upload Excel
//                   </button>
//                   <button
//                     type="button"
//                     style={{
//                       fontSize: "13px",
//                       backgroundColor: "#28A745",
//                       color: "white",
//                       fontWeight: "500",
//                       border: "none",
//                       padding: "6px 12px",
//                       borderRadius: "4px",
//                     }}
//                     onClick={handleDownloadClick}
//                   >
//                     <UilDownloadAlt /> Download Sample File
//                   </button>
//                 </div>
//                 <div style={{ marginTop: "8px" }}>
//                   <p
//                     style={{
//                       color: "#4A4545",
//                       fontWeight: "bold",
//                       marginBottom: "0",
//                     }}
//                   >
//                     Note:
//                     <UilInfoCircle
//                       style={{ height: "20px", width: "20px", color: "blue" }}
//                     />
//                   </p>
//                   <ol
//                     style={{
//                       fontSize: "10px",
//                       paddingLeft: "10px",
//                       color: "gray",
//                     }}
//                   >
//                     <li>Click Download Sample File to get the template.</li>
//                     <li>Fill in the data as per the given columns.</li>
//                     <li>Save the file in Excel format (XLSX or CSV).</li>
//                     <li>Use Upload Excel to bulk upload your data.</li>
//                     <li>
//                       Ensure all required fields are filled correctly to avoid
//                       errors.
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
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "45px",
//             }}
//           >
//             <CreateButton link="/student-create" style={{ margin: "auto" }} />
//           </div>
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
//             <div
//               className="ag-theme-alpine"
//               style={{ height: "500px", width: "100%", overflowX: "auto" }}
//             >
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={students}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 theme={customTheme}
//                 rowSelection="multiple"
//                 onSelectionChanged={(params) => {
//                   const selectedRows = params.api.getSelectedRows();
//                   const newCheckedRows = selectedRows.reduce((acc, row) => {
//                     acc[row.id] = true;
//                     return acc;
//                   }, {});
//                   setCheckedRows(newCheckedRows);
//                   setIsAllChecked(selectedRows.length === students.length);
//                 }}
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
//                     setPageSize(parseInt(e.target.value, 10));
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


import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { Menu, MenuItem } from "@mui/material";
import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import CreateButton from "../../Components/CommonButton/CreateButton";
import excelImg from "../../../public/excell-img.png";
import Papa from "papaparse";
import "../Common-Css/DeleteSwal.css";
import "../Common-Css/Swallfire.css";

export default function DataTable() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false); // New state for search loading
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const gridApiRef = useRef(null);
  const pageSizes = [10, 20, 50, 100];

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Fetch student data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSearchLoading(true); // Show search loading
      try {
        const response = await axios.get(`${API_BASE_URL}/api/get/student`, {
          params: { page, limit: pageSize, search: searchTerm },
        });

        const { students, totalRecords, totalPages } = response.data;

        // Fetch user, class, and subject details for each student
        const formattedData = await Promise.all(
          students.map(async (record) => {
            try {
              // Fetch user details for created_by
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const userName = userResponse.data.username;

              // Fetch class details
              let className = "Unknown Class";
              if (record.class_name) {
                try {
                  const classResponse = await axios.get(
                    `${API_BASE_URL}/api/class/${record.class_name}`
                  );
                  className = classResponse.data.name || "Unknown Class";
                } catch (error) {
                  console.error(
                    `Failed to fetch class details for class_id: ${record.class_name}`,
                    error
                  );
                }
              }

              // Fetch subject details
              let subjectNames = ["Unknown Subject"];
              try {
                let subjectIds = [];
                if (typeof record.student_subject === "string") {
                  try {
                    subjectIds = JSON.parse(record.student_subject || "[]");
                  } catch (e) {
                    console.error(
                      `Invalid JSON for student_subject: ${record.student_subject}`,
                      e
                    );
                  }
                } else if (Array.isArray(record.student_subject)) {
                  subjectIds = record.student_subject;
                }

                if (subjectIds.length > 0) {
                  subjectNames = await Promise.all(
                    subjectIds.map(async (subjectId) => {
                      try {
                        const subjectResponse = await axios.get(
                          `${API_BASE_URL}/api/subject/${subjectId}`
                        );
                        return subjectResponse.data.name || "Unknown Subject";
                      } catch (error) {
                        console.error(
                          `Failed to fetch subject details for subject_id: ${subjectId}`,
                          error
                        );
                        return "Unknown Subject";
                      }
                    })
                  );
                }
              } catch (error) {
                console.error(
                  `Error processing student_subject for record: ${record.id}`,
                  error
                );
              }

              return {
                ...record,
                student_subject: subjectNames,
                class_name: className,
                created_by: userName,
                updated_by: userName,
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
              };
            } catch (error) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                error
              );
              return {
                ...record,
                student_subject: ["Unknown Subject"],
                class_name: "Unknown Class",
                created_by: "Unknown User",
                updated_by: "Unknown User",
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
              };
            }
          })
        );

        setStudents(formattedData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching student data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Failed to fetch student data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } finally {
        setLoading(false);
        setSearchLoading(false); // Hide search loading
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [page, pageSize, searchTerm]);

  // Handle row deletion
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "custom-swal-popup" },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/api/get/student/${id}`)
          .then(() => {
            setStudents((prev) => prev.filter((student) => student.id !== id));
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
              text: error.response?.data?.error || "There was an issue deleting the student.",
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

  // Handle checkbox selection
  const handleRowCheck = (id) => {
    setCheckedRows((prev) => {
      const newCheckedRows = { ...prev };
      if (newCheckedRows[id]) {
        delete newCheckedRows[id];
      } else {
        newCheckedRows[id] = true;
      }
      return newCheckedRows;
    });
  };

  const handleSelectAll = (params) => {
    if (isAllChecked) {
      setCheckedRows({});
      params.api.deselectAll();
    } else {
      const allChecked = students.reduce((acc, row) => {
        acc[row.id] = true;
        return acc;
      }, {});
      setCheckedRows(allChecked);
      params.api.selectAll();
    }
    setIsAllChecked(!isAllChecked);
  };

  // Bulk upload and CSV download
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "text/csv") {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Invalid File",
          text: "Please upload a valid CSV file.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result;
        parseCSVData(csvData);
      };
      reader.readAsText(file);
    }
  };

  const formatClassName = (className) => {
    if (/^\d$/.test(className)) {
      return `0${className}`;
    }
    return className;
  };

  const parseCSVData = (csvFile) => {
    Papa.parse(csvFile, {
      complete: (result) => {
        if (!Array.isArray(result.data) || result.data.length === 0) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Invalid File",
            text: "CSV file is empty or invalid.",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
          });
          return;
        }

        const students = result.data
          .filter((row) => {
            const schoolName = row.school_name?.trim();
            const studentName = row.student_name?.trim();
            const className = row.class_name?.trim();
            return schoolName && studentName && className;
          })
          .map((row) => ({
            school_name: row.school_name?.trim() || "",
            student_name: row.student_name?.trim() || "",
            class_name: formatClassName(row.class_name?.trim() || ""),
            student_section: row.student_section?.trim() || null,
            mobile_number: row.mobile_number?.trim() || null,
            whatsapp_number: row.whatsapp_number?.trim() || null,
            student_subject: row.student_subject
              ? row.student_subject
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s)
              : [],
            country: row.country?.trim() || "",
            state: row.state?.trim() || "",
            district: row.district?.trim() || "",
            city: row.city?.trim() || "",
            approved: row.approved
              ? row.approved.trim().toLowerCase() === "true"
              : false,
            approved_by: row.approved_by?.trim() || null,
          }));

        if (students.length === 0) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Invalid Data",
            text: "No valid student records found in the CSV file. Ensure school_name, student_name, and class_name are non-empty.",
            showConfirmButton: false,
            timer: 3000,
            toast: true,
          });
          return;
        }

        uploadStudentsData(students);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const uploadStudentsData = async (students) => {
    if (!Array.isArray(students) || students.length === 0) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: "No student data to upload.",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized. Please log in again.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/get/student/bulk-upload`,
        students,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Upload Successful",
        text: `Successfully uploaded ${response.data.insertedCount} students.`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Upload Error:", error);
      let errorMessage = "An error occurred while uploading students.";
      if (error.response?.data) {
        const { message, errors } = error.response.data;
        if (errors) {
          if (typeof errors === "object" && !Array.isArray(errors)) {
            errorMessage = Object.entries(errors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .filter((msg, index, self) => self.indexOf(msg) === index)
              .join("\n");
          } else if (Array.isArray(errors)) {
            errorMessage = Array.from(
              new Set(
                errors.map((err) => `${err.group || "General"}: ${err.message}`)
              )
            ).join("\n");
          } else {
            errorMessage = message || errorMessage;
          }
        } else {
          errorMessage = message || errorMessage;
        }
      } else if (error.message.includes("School not found")) {
        errorMessage =
          "The specified school_name does not exist in the database.";
      }
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Upload Failed",
        text: errorMessage,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = () => {
    const headers = [
      "school_name",
      "student_name",
      "class_name",
      "student_section",
      "mobile_number",
      "whatsapp_number",
      "student_subject",
      "country",
      "state",
      "district",
      "city",
      "approved",
      "approved_by",
    ];
    const rows = [
      [
        "ABC School",
        "Alice Johnson",
        "01",
        "A",
        "1234567890",
        "1234567890",
        "GIMO",
        "India",
        "Odisha",
        "Cuttack",
        "Aliabad",
        "false",
        "admin",
      ],
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "studentdata.csv";
    link.click();
    handleClose();
  };

  // AG-Grid column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "SCHOOL",
        field: "school_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) => params.value?.toUpperCase() || "",
      },
      {
        headerName: "STUDENT",
        field: "student_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) => params.value?.toUpperCase() || "",
      },
      {
        headerName: "ROLL NUMBER",
        field: "roll_no",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CLASS",
        field: "class_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "SECTION",
        field: "student_section",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "MOBILE NUMBER",
        field: "mobile_number",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "SUBJECT",
        field: "student_subject",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) =>
          Array.isArray(params.value) ? params.value.join(", ") : "",
      },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "UPDATED BY",
        field: "updated_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "UPDATED AT",
        field: "updated_at",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
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
            <Link to={`/student/update/${params.data.id}`}>
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
      setSearchTerm(searchValue);
      setPage(1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
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
          <Breadcrumb data={[{ name: "Student" }]} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              flexDirection: "column",
              borderRadius: "15px",
            }}
          >
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
                textDecoration: "none",
                fontFamily: '"Poppins", sans-serif',
              }}
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
              style={{ padding: "0px", margin: "0px" }}
            >
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  gap: "15px",
                  borderRadius: "10px",
                  padding: "0px 10px",
                }}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    style={{
                      fontSize: "13px",
                      backgroundColor: "#4A4545",
                      color: "white",
                      fontWeight: "500",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                    }}
                    onClick={handleUploadClick}
                  >
                    <img
                      src={excelImg}
                      alt="Upload"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "8px",
                      }}
                    />
                    Upload Excel
                  </button>
                  <button
                    type="button"
                    style={{
                      fontSize: "13px",
                      backgroundColor: "#28A745",
                      color: "white",
                      fontWeight: "500",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                    }}
                    onClick={handleDownloadClick}
                  >
                    <UilDownloadAlt /> Download Sample File
                  </button>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <p
                    style={{
                      color: "#4A4545",
                      fontWeight: "bold",
                      marginBottom: "0",
                    }}
                  >
                    Note:
                    <UilInfoCircle
                      style={{ height: "20px", width: "20px", color: "blue" }}
                    />
                  </p>
                  <ol
                    style={{
                      fontSize: "10px",
                      paddingLeft: "10px",
                      color: "gray",
                    }}
                  >
                    <li>Click Download Sample File to get the template.</li>
                    <li>Fill in the data as per the given columns.</li>
                    <li>Save the file in Excel format (XLSX or CSV).</li>
                    <li>Use Upload Excel to bulk upload your data.</li>
                    <li>
                      Ensure all required fields are filled correctly to avoid
                      errors.
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
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "45px",
            }}
          >
            <CreateButton link="/student-create" style={{ margin: "auto" }} />
          </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="spinner" style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #1230AE",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              animation: "spin 1s linear infinite"
            }} />
            <span>Loading...</span>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <>
            <div
              className="ag-theme-alpine"
              style={{ height: "500px", width: "100%", overflowX: "auto", position: "relative" }}
            >
              {searchLoading && (
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <div className="spinner" style={{
                    border: "3px solid #f3f3f3",
                    borderTop: "3px solid #1230AE",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    animation: "spin 1s linear infinite"
                  }} />
                  <span>Searching...</span>
                </div>
              )}
              <AgGridReact
                columnDefs={columnDefs}
                rowData={students}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                pagination={false}
                suppressPaginationPanel={true}
                animateRows={true}
                onFilterChanged={onFilterChanged}
                theme={customTheme}
                rowSelection="multiple"
                onSelectionChanged={(params) => {
                  const selectedRows = params.api.getSelectedRows();
                  const newCheckedRows = selectedRows.reduce((acc, row) => {
                    acc[row.id] = true;
                    return acc;
                  }, {});
                  setCheckedRows(newCheckedRows);
                  setIsAllChecked(selectedRows.length === students.length);
                }}
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
                    setPageSize(parseInt(e.target.value, 10));
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
                    fontFamily: "'Poppins', sans-serif",
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
                    fontFamily: "'Poppins', sans-serif",
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
                      fontFamily: "'Poppins', sans-serif",
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
                    fontFamily: "'Poppins', sans-serif",
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
                            fontFamily: "'Poppins', sans-serif",
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
                          fontFamily: "'Poppins', sans-serif",
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
                    fontFamily: "'Poppins', sans-serif",
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