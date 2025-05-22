// import React, { useEffect, useState } from "react";
// import {
//   FaCaretDown,
//   FaCaretUp,
//   FaEdit,
//   FaTrash,
//   FaSearch,
//   FaHome,
//   FaPlus,
// } from "react-icons/fa";
// import {
//   UilTrashAlt,
//   UilEditAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
//   UilDownloadAlt,
//   UilInfoCircle,
// } from "@iconscout/react-unicons";
// import { Menu, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import styles from "./../../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import ButtonComp from "../../CommonButton/ButtonComp";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/DeleteSwal.css";
// import "../../Common-Css/Swallfire.css";
// import CreateButton from "../../../Components/CommonButton/CreateButton";
// import excelImg from "../../../../public/excell-img.png";
// import Papa from "papaparse"; // Import Papaparse for CSV parsing

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     column: "",
//     direction: "asc",
//   });
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [nextPage, setNextPage] = useState(null);
//   const [prevPage, setPrevPage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const pageSizes = [10, 20, 50, 100];

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const schoolResponse = await axios.get(`${API_BASE_URL}/api/get/schools`);
//   //       const schoolData = schoolResponse.data;

//   //       const formattedData = await Promise.all(
//   //         schoolData.map(async (record) => {
//   //           // Fetch user by created_by
//   //           const userResponse = await axios.get(
//   //             `${API_BASE_URL}/api/u1/users/${record.created_by}`
//   //           );
//   //           const { username, role } = userResponse.data; // role is id

//   //           // Fetch role name using role id
//   //           const roleResponse = await axios.get(
//   //             `${API_BASE_URL}/api/r1/role/${role}`
//   //           );
//   //           const { role_name } = roleResponse.data;

//   //           return {
//   //             ...record,
//   //             created_by: `${username} (${role_name})`,
//   //           };
//   //         })
//   //       );

//   //       setRecords(formattedData);
//   //       setFilteredRecords(formattedData);
//   //     } catch (error) {
//   //       console.error("There was an error fetching the records!", error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const schoolResponse = await axios.get(
//           `${API_BASE_URL}/api/get/schools`,
//           {
//             params: { page: currentPage, limit: pageSize }, // ✅ Pagination params
//           }
//         );

//         const { schools, totalRecords, totalPages } = schoolResponse.data;

//         const formattedData = await Promise.all(
//           schools.map(async (record) => {
//             try {
//               // Fetch user details for created_by
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               const { username, role } = userResponse.data; // role = role ID

//               // Fetch role name from role ID
//               let roleName = "Unknown Role";
//               try {
//                 const roleResponse = await axios.get(
//                   `${API_BASE_URL}/api/r1/role/${role}`
//                 );
//                 roleName = roleResponse.data.role_name || "Unknown Role";
//               } catch (roleError) {
//                 console.error(
//                   `Failed to fetch role name for role ID: ${role}`,
//                   roleError
//                 );
//               }

//               return {
//                 ...record,
//                 created_by: `${username} (${roleName})`,
//                 // created_at: formatTimestamp(record.created_at),
//                 // updated_at: formatTimestamp(record.updated_at),
//               };
//             } catch (userError) {
//               console.error(
//                 `Failed to fetch user details for created_by: ${record.created_by}`,
//                 userError
//               );
//               return {
//                 ...record,
//                 created_by: "Unknown User (Unknown Role)",
//                 // created_at: formatTimestamp(record.created_at),
//                 // updated_at: formatTimestamp(record.updated_at),
//               };
//             }
//           })
//         );

//         setRecords(formattedData);
//         setFilteredRecords(formattedData);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error("There was an error fetching the records!", error);
//         Swal.fire("Error", "Failed to fetch school data.", "error");
//       }
//     };

//     fetchData();
//   }, [currentPage, pageSize]); // ✅ Added dependency for pagination

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < Math.ceil(filteredRecords.length / pageSize)) setPage(page + 1);
//   };

//   const handleDelete = (id) => {
//     // Show SweetAlert confirmation dialog
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       // icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       customClass: {
//         popup: "custom-swal-popup", // Add custom class to the popup
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Proceed with the delete request
//         axios
//           .delete(`${API_BASE_URL}/api/get/schools/${id}`)
//           .then((response) => {
//             // Update the state after successful deletion
//             setRecords((prevCountries) =>
//               prevCountries.filter((country) => country.id !== id)
//             );
//             setFilteredRecords((prevFiltered) =>
//               prevFiltered.filter((country) => country.id !== id)
//             );
//             // delete Show a success alert
//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: `The school has been deleted.`,
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: {
//                 popup: "small-swal",
//               },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting country:", error);
//             // Show an error alert if deletion fails
//             Swal.fire(
//               "Error!",
//               "There was an issue deleting the country.",
//               "error"
//             );
//           });
//       }
//     });
//   };

//   const handleFilter = (event, column) => {
//     const value = event.target.value.toLowerCase();
//     const filtered = records.filter((row) =>
//       (row[column] || "").toString().toLowerCase().includes(value)
//     );
//     setFilteredRecords(filtered);
//     setPage(1);
//   };

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortConfig.column === column) {
//       direction = sortConfig.direction === "asc" ? "desc" : "asc";
//     }

//     let sortedData = [...filteredRecords];
//     sortedData.sort((a, b) => {
//       const aValue = a[column];
//       const bValue = b[column];
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return direction === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       } else {
//         return direction === "asc" ? aValue - bValue : bValue - aValue;
//       }
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
//           onClick={(e) => {
//             e.stopPropagation();
//             handleSort(column);
//           }}
//         />
//         <FaCaretDown
//           className={`${styles.sortIcon} ${
//             isActive && !isAsc ? styles.activeSortIcon : ""
//           }`}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleSort(column);
//           }}
//         />
//       </div>
//     );
//   };

//   const currentRecords = filteredRecords.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const [isAllChecked, setIsAllChecked] = useState(false);

//   const [checkedRows, setCheckedRows] = useState({});

//   const handleRowCheck = (id) => {
//     setCheckedRows((prevCheckedRows) => {
//       const newCheckedRows = { ...prevCheckedRows };
//       if (newCheckedRows[id]) {
//         delete newCheckedRows[id]; // Uncheck
//       } else {
//         newCheckedRows[id] = true; // Check
//       }
//       return newCheckedRows;
//     });
//   };

//   const handleSelectAll = () => {
//     if (isAllChecked) {
//       setCheckedRows({}); // Uncheck all rows
//     } else {
//       const allChecked = filteredRecords.reduce((acc, row) => {
//         acc[row.id] = true; // Check all rows
//         return acc;
//       }, {});
//       setCheckedRows(allChecked);
//     }
//     setIsAllChecked(!isAllChecked);
//   };
//   useEffect(() => {
//     if (filteredRecords.every((row) => checkedRows[row.id])) {
//       setIsAllChecked(true);
//     } else {
//       setIsAllChecked(false);
//     }
//   }, [checkedRows, filteredRecords]);

//   //bulk upload for student data---------------------------------//
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   // Trigger file selection dialog
//   const handleUploadClick = () => {
//     document.getElementById("fileInput").click();
//     handleClose();
//   };

//   // Handle file selection change
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

//   // // Parse CSV data and map to school objects
//   const parseCSVData = (csvData) => {
//     Papa.parse(csvData, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (result) => {
//         console.log("Parsed CSV Data:", result.data);
//         // Map CSV rows to school objects as expected by the backend
//         const schools = result.data.map((row) => ({
//           board: row.board?.trim() || undefined,
//           school_name: row.school_name?.trim() || undefined,
//           pincode: row.pincode?.trim() || undefined,
//           school_address: row.school_address?.trim() || undefined,
//           country: row.country?.trim() || undefined,
//           state: row.state?.trim() || undefined,
//           district: row.district?.trim() || undefined,
//           city: row.city?.trim() || undefined,
//           school_email: row.school_email?.trim() || null,
//           principal_contact_number:
//             row.principal_contact_number?.trim() || null,
//           principal_name: row.principal_name?.trim() || null,
//           principal_whatsapp: row.principal_whatsapp?.trim() || null,
//           school_contact_number: row.school_contact_number?.trim() || null,
//           school_landline_number: row.school_landline_number?.trim() || null,
//           vice_principal_name: row.vice_principal_name?.trim() || null,
//           vice_principal_contact_number:
//             row.vice_principal_contact_number?.trim() || null,
//           vice_principal_whatsapp: row.vice_principal_whatsapp?.trim() || null,
//           manager_name: row.manager_name?.trim() || null,
//           manager_contact_number: row.manager_contact_number?.trim() || null,
//           manager_whatsapp_number: row.manager_whatsapp_number?.trim() || null,
//           first_incharge_name: row.first_incharge_name?.trim() || null,
//           first_incharge_number: row.first_incharge_number?.trim() || null,
//           first_incharge_whatsapp: row.first_incharge_whatsapp?.trim() || null,
//           second_incharge_name: row.second_incharge_name?.trim() || null,
//           second_incharge_number: row.second_incharge_number?.trim() || null,
//           second_incharge_whatsapp:
//             row.second_incharge_whatsapp?.trim() || null,
//           junior_student_strength: row.junior_student_strength?.trim() || null,
//           senior_student_strength: row.senior_student_strength?.trim() || null,
//           classes: row.classes?.trim()
//             ? row.classes.split(",").map((c) => c.trim())
//             : null,
//           status: row.status?.trim() || null,
//           created_by: row.created_by?.trim() || "admin", // Default to 'admin' if not provided
//           updated_by: row.updated_by?.trim() || "admin", // Default to 'admin' if not provided
//         }));
//         uploadSchoolsData(schools);
//       },
//       error: (error) => {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: `Failed to parse CSV: ${error.message}`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         });
//       },
//     });
//   };

//   // // Upload the schools data to backend
//   // const validateSchoolData = (schools) => {
//   //   const mandatoryFields = [
//   //     "board",
//   //     "school_name",
//   //     "pincode",
//   //     "school_address",
//   //     "country",
//   //     "state",
//   //     "district",
//   //     "city",
//   //   ];

//   //   const invalidSchools = schools.filter((school) =>
//   //     mandatoryFields.some(
//   //       (field) => !school[field] || school[field].trim() === ""
//   //     )
//   //   );

//   //   return invalidSchools;
//   // };

//   // const uploadSchoolsData = async (schools) => {
//   //   if (!Array.isArray(schools) || schools.length === 0) {
//   //     Swal.fire({
//   //       position: "top-end",
//   //       icon: "warning",
//   //       title: "No Data",
//   //       text: "Please upload a valid CSV file with school data.",
//   //       showConfirmButton: false,
//   //       timer: 3000,
//   //       timerProgressBar: true,
//   //       toast: true,
//   //       background: "#fff",
//   //       customClass: { popup: "small-swal" },
//   //     });
//   //     return;
//   //   }

//   //   // Validate schools data for mandatory fields
//   //   const invalidSchools = validateSchoolData(schools);
//   //   if (invalidSchools.length > 0) {
//   //     Swal.fire({
//   //       position: "top-end",
//   //       icon: "error",
//   //       title: "Invalid Data",
//   //       text: `Some mandatory fields are missing in ${invalidSchools.length} row(s). Please correct and try again.`,
//   //       showConfirmButton: false,
//   //       timer: 6000,
//   //       timerProgressBar: true,
//   //       toast: true,
//   //       background: "#fff",
//   //       customClass: { popup: "small-swal" },
//   //     });
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     const token = localStorage.getItem("token"); // Or however you are storing the token
//   //     const response = await axios.post(
//   //       `${API_BASE_URL}/api/get/school/bulk-upload`,
//   //       schools,
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
//   //     );
//   //     setLoading(false);
//   //     Swal.fire({
//   //       position: "top-end",
//   //       icon: "success",
//   //       title: "Success!",
//   //       text: `Successfully uploaded ${response.data.affectedRows} schools.`,
//   //       showConfirmButton: false,
//   //       timer: 1000,
//   //       timerProgressBar: true,
//   //       toast: true,
//   //       background: "#fff",
//   //       customClass: { popup: "small-swal" },
//   //     }).then(() => {
//   //       // Refresh the page or navigate to your school list view
//   //       navigate(0);
//   //     });
//   //   } catch (error) {
//   //     setLoading(false);
//   //     Swal.fire({
//   //       position: "top-end",
//   //       icon: "error",
//   //       title: "Error!",
//   //       text:
//   //         error.response?.data?.message || "An error occurred during upload.",
//   //       showConfirmButton: false,
//   //       timer: 3000,
//   //       timerProgressBar: true,
//   //       toast: true,
//   //       background: "#fff",
//   //       customClass: { popup: "small-swal" },
//   //     });
//   //   }
//   // };

//   // Validate mandatory fields for each school
//   const validateSchoolData = (schools) => {
//     const mandatoryFields = [
//       "board",
//       "school_name",
//       "pincode",
//       "school_address",
//       "country",
//       "state",
//       "district",
//       "city",
//     ];

//     const invalidSchools = [];

//     schools.forEach((school, index) => {
//       const fieldMessages = [];

//       mandatoryFields.forEach((field) => {
//         if (!school[field] || school[field].toString().trim() === "") {
//           if (["country", "state", "district", "city"].includes(field)) {
//             fieldMessages.push(`Invalid ${field}: ${school[field] || "empty"}`);
//           } else {
//             fieldMessages.push(`Missing ${field}`);
//           }
//         }
//       });

//       if (fieldMessages.length > 0) {
//         invalidSchools.push({
//           index: index + 1, // For user-friendly row numbers
//           messages: fieldMessages,
//         });
//       }
//     });

//     return invalidSchools;
//   };

//   const uploadSchoolsData = async (schools) => {
//     if (!Array.isArray(schools) || schools.length === 0) {
//       return Swal.fire({
//         position: "top-end",
//         icon: "warning",
//         title: "No Data",
//         text: "Please upload a valid CSV file with school data.",
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//     }

//     const invalidSchools = validateSchoolData(schools);

//     if (invalidSchools.length > 0) {
//       const details = invalidSchools.slice(0, 3).map((school) => {
//         const errorList = school.messages
//           .map((msg) => `<li>${msg}</li>`)
//           .join("");
//         return `<li><strong>Row ${school.index}:</strong><ul>${errorList}</ul></li>`;
//       });

//       if (invalidSchools.length > 3) {
//         details.push(`<li>...and ${invalidSchools.length - 3} more rows</li>`);
//       }

//       return Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Invalid Data",
//         html: `<div style="text-align: left;">
//                  <p>Issues found in ${invalidSchools.length} row(s):</p>
//                  <ul style="padding-left: 20px;">${details.join("")}</ul>
//                </div>`,
//         showConfirmButton: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//         width: 500,
//       });
//     }

//     // Proceed with upload if valid
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/school/bulk-upload`,
//         schools,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setLoading(false);
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: `Successfully uploaded ${
//           response.data.affectedRows || schools.length
//         } schools.`,
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       }).then(() => {
//         navigate(0);
//       });
//     } catch (error) {
//       setLoading(false);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error!",
//         text:
//           error.response?.data?.message || "An error occurred during upload.",
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//     }
//   };

//   // Download CSV template for schools
//   const handleDownloadClick = () => {
//     // Define CSV headers for school data
//     const headers = [
//       "board",
//       "school_name",
//       "school_address",
//       "pincode",
//       "country",
//       "state",
//       "district",
//       "city",
//       "school_email",
//       "principal_name",
//       "principal_contact_number",
//       "principal_whatsapp",
//       "school_contact_number",
//       "school_landline_number",
//       "vice_principal_name",
//       "vice_principal_contact_number",
//       "vice_principal_whatsapp",
//       "manager_name",
//       "manager_contact_number",
//       "manager_whatsapp_number",
//       "first_incharge_name",
//       "first_incharge_number",
//       "first_incharge_whatsapp",
//       "second_incharge_name",
//       "second_incharge_number",
//       "second_incharge_whatsapp",
//       "junior_student_strength",
//       "senior_student_strength",
//       "classes",
//       "status",
//     ];

//     // Sample row for template purposes
//     const rows = [
//       [
//         "CBSE",
//         "ABC School",
//         "BBSR Tankapani",
//         "411001",
//         "India",
//         "Odisha",
//         "Cuttack",
//         "Aliabad",
//         "abc@example.com",
//         "Dr. Anil Kumar",
//         "7991048546",
//         "7991048546",
//         "08012345678",
//         "Priya Sharma",
//         "Ravi Patel",
//         "9123456789",
//         "9876543210",
//         "susant",
//         "9898789078",
//         "9898789078",
//         "prasant",
//         "9898789078",
//         "9898789078",
//         "srikant",
//         "9898789078",
//         "9898789078",
//         "400",
//         "500",
//         "1",
//         "active",
//       ],
//     ];

//     const csvContent = [
//       headers.join(","), // Header row
//       ...rows.map((row) => row.join(",")), // Data rows
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "schools_data_template.csv";
//     link.click();

//     handleClose();
//   };

//   //for approval code
//   // const handleStatusApprovedChange = async (id, newStatus) => {
//   //   try {
//   //     const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
//   //     const response = await axios.put(
//   //       `${API_BASE_URL}/api/get/school/${id}/status-approved`,
//   //       { status_approved: newStatus },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     // Update the specific record in state
//   //     setRecords((prevRecords) =>
//   //       prevRecords.map((record) =>
//   //         record.id === id ? { ...record, status_approved: newStatus } : record
//   //       )
//   //     );
//   //     setFilteredRecords((prevFiltered) =>
//   //       prevFiltered.map((record) =>
//   //         record.id === id ? { ...record, status_approved: newStatus } : record
//   //       )
//   //     );

//   //     Swal.fire({
//   //       position: "top-end",
//   //       icon: "success",
//   //       title: "Success!",
//   //       text: "Approval status updated successfully.",
//   //       showConfirmButton: false,
//   //       timer: 1000,
//   //       toast: true,
//   //       background: "#fff",
//   //       customClass: { popup: "small-swal" },
//   //     });
//   //   } catch (error) {
//   //     console.error("Error updating Approved:", error);
//   //     Swal.fire({
//   //       position: "top-end",
//   //       icon: "error",
//   //       title: "Error!",
//   //       text:
//   //         error.response?.data?.message || "Failed to update approval status.",
//   //       showConfirmButton: false,
//   //       timer: 2000,
//   //       toast: true,
//   //       background: "#fff",
//   //       customClass: { popup: "small-swal" },
//   //     });
//   //   }
//   // };
//   const handleStatusApprovedChange = async (id, newStatus) => {
//     try {
//       const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
//       const response = await axios.put(
//         `${API_BASE_URL}/api/get/school/${id}/status-approved`,
//         { status_approved: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Update the specific record in state
//       setRecords((prevRecords) =>
//         prevRecords.map((record) =>
//           record.id === id ? { ...record, status_approved: newStatus } : record
//         )
//       );
//       setFilteredRecords((prevFiltered) =>
//         prevFiltered.map((record) =>
//           record.id === id ? { ...record, status_approved: newStatus } : record
//         )
//       );

//       // 🟢 Dynamic message based on newStatus
//       const statusMessage =
//         newStatus === "approved"
//           ? "Approved"
//           : newStatus === "rejected"
//           ? "Rejected"
//           : "Pending";

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Status Updated!",
//         text: ` ${statusMessage} status updated successfully `,
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//     } catch (error) {
//       console.error("Error updating Approved:", error);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error!",
//         text:
//           error.response?.data?.message || "Failed to update approval status.",
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "School" }]} />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             width: "auto",
//             gap: "10px",
//           }}
//         >
//           {/* //bulk upload */}
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
//                 padding: " 14px 12px",
//                 display: "flex",
//                 alignItems: "center",
//                 // marginLeft: "584px",
//                 height: "27px",
//                 fontSize: "14px",
//                 // border: "0.2px solid white",
//                 // backgroundColor: "white",
//                 // boxShadow: "rgba(0, 0, 0, 0.05) 1.95px 1.95px 2.6px",
//                 borderRadius: "5px",
//                 color: "#1230AE",
//                 textDecoration: "none",
//                 fontFamily: '"Poppins", sans-serif',
//               }}
//             >
//               <img
//                 src={excelImg}
//                 alt="Upload"
//                 style={{
//                   width: "20px",
//                   height: "20px",
//                   marginRight: "8px",
//                 }}
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
//                     />{" "}
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
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{ height: "45px" }}
//           >
//             <CreateButton link="/school-create" className="MY-AUTO" />
//           </div>
//         </div>
//         {/* <div>
//           <CreateButton link={"/school-create"} />
//         </div> */}
//       </div>
//       <div className={`${styles.tablecont} mt-0`}>
//         <table
//           className={`${styles.table} `}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow} pt-0 pb-0`}>
//               <th>
//                 <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
//               </th>
//               {[
//                 "board",
//                 "school ",
//                 "school code",
//                 "email",
//                 "contact",
//                 "country",
//                 "state",
//                 "district",
//                 "city",
//                 "pincode",
//                 "status",
//                 "created by",
//                 "Approval",
//                 "Approved by",
//               ].map((col) => (
//                 <th
//                   key={col}
//                   className={styles.sortableHeader}
//                   onClick={() => handleSort(col)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span>{col.toUpperCase()}</span>
//                     {getSortIcon(col)}
//                   </div>
//                 </th>
//               ))}
//               <th>ACTION</th>
//             </tr>
//           </thead>
//           <tr
//             className={styles.filterRow}
//             style={{ fontFamily: "Nunito, sans-serif" }}
//           >
//             <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
//             {[
//               "board",
//               "school name",
//               "school code",
//               "email",
//               "contact",
//               "country",
//               "state",
//               "district",
//               "city",
//               "pincode",
//               "status",
//               "created by",
//               "Approval",
//               "Approved by",
//             ].map((col) => (
//               <th key={col}>
//                 <div className={styles.inputContainer}>
//                   <FaSearch className={styles.searchIcon} />
//                   <input
//                     type="text"
//                     placeholder={`Search ${col}`}
//                     onChange={(e) => handleFilter(e, col)}
//                     className={styles.filterInput}
//                   />
//                 </div>
//               </th>
//             ))}
//             <th></th>
//           </tr>
//           <tbody>
//             {currentRecords.map((row) => (
//               <tr
//                 key={row.id}
//                 className={styles.dataRow}
//                 style={{ fontFamily: "Nunito, sans-serif" }}
//               >
//                 <td>
//                   <Checkbox
//                     checked={!!checkedRows[row.id]}
//                     onChange={() => handleRowCheck(row.id)}
//                   />
//                 </td>

//                 <td>
//                   {typeof row.board === "string"
//                     ? row.board.toUpperCase()
//                     : row.board}
//                 </td>
//                 <td>
//                   {typeof row.school_name === "string"
//                     ? row.school_name.toUpperCase()
//                     : row.school_name}
//                 </td>
//                 <td>
//                   {typeof row.school_code === "string"
//                     ? row.school_code.toUpperCase()
//                     : row.school_code}
//                 </td>
//                 <td>{row.school_email}</td>
//                 <td>{row.school_contact_number}</td>
//                 <td>{row.country_name}</td>
//                 <td>{row.state_name}</td>
//                 <td>{row.district_name}</td>
//                 <td>{row.city_name}</td>
//                 <td>{row.pincode}</td>
//                 <td>{row.status}</td>
//                 <td>{row.created_by}</td>

//                 {/* <td>
//                   <span
//                     onClick={() => {
//                       if (row.status_approved !== "approved") {
//                         handleStatusApprovedChange(row.id, "approved");
//                       }
//                     }}
//                     style={{
//                       color:
//                         row.status_approved === "approved" ? "green" : "red",
//                       cursor:
//                         row.status_approved !== "approved"
//                           ? "pointer"
//                           : "default",
//                       border: "none",
//                       padding: "4px 8px",
//                       display: "inline-block",
//                     }}
//                   >
//                     {row.status_approved === "approved"
//                       ? "Approved"
//                       : "Pending"}
//                   </span>
//                 </td> */}

//                 <td
//                   style={{
//                     overflow: "visible",
//                     position: "relative",
//                     zIndex: 1,
//                   }}
//                 >
//                   <select
//                     value={row.status_approved || "pending"}
//                     onChange={(e) =>
//                       handleStatusApprovedChange(row.id, e.target.value)
//                     }
//                     style={{
//                       padding: "4px 8px",
//                       borderRadius: "4px",
//                       // border: "1px solid black",
//                       border: "none",
//                       minWidth: "100px",
//                       background: "#fff",
//                       color:
//                         row.status_approved === "approved"
//                           ? "green"
//                           : row.status_approved === "rejected"
//                           ? "orange"
//                           : "red", // <-- color changes here
//                       fontWeight: "bold",
//                     }}
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                 </td>

//                 <td style={{ fontWeight: "bold" }}>{row.approved_by}</td>

//                 <td>
//                   <div className={styles.actionButtons}>
//                     <Link to={`/school/update/${row.id}`}>
//                       <UilEditAlt className={styles.FaEdit} />
//                     </Link>
//                     <UilTrashAlt
//                       onClick={() => handleDelete(row.id)}
//                       className={`${styles.FaTrash}`}
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="d-flex justify-content-between flex-wrap mt-2">
//           {/* Page Size Selector */}
//           <div
//             className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//           >
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(parseInt(e.target.value, 10));
//                 setCurrentPage(1); // Reset to first page
//               }}
//               className={styles.pageSizeSelect}
//             >
//               {[10, 20, 50, 100].map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//             <p className="my-auto text-secondary">data per Page</p>
//           </div>

//           {/* Total Records Display */}
//           <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//             <label
//               htmlFor="pageSize"
//               style={{ fontFamily: "Nunito, sans-serif" }}
//             >
//               <p className="my-auto text-secondary">
//                 {totalRecords} records, Page {currentPage} of {totalPages}
//               </p>
//             </label>
//           </div>

//           {/* Pagination Navigation */}
//           <div className={`${styles.pagination} my-auto`}>
//             {/* Previous Page Button */}
//             <button
//               onClick={handlePreviousPage}
//               disabled={!prevPage}
//               className={styles.paginationButton}
//             >
//               <UilAngleLeftB />
//             </button>

//             {/* Page Numbers with Ellipsis */}
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
//                   >
//                     {pg}
//                   </button>
//                 </React.Fragment>
//               ))}

//             {/* Next Page Button */}
//             <button
//               onClick={handleNextPage}
//               disabled={!nextPage}
//               className={styles.paginationButton}
//             >
//               <UilAngleRightB />
//             </button>
//           </div>
//         </div>
//       </div>
//     </Mainlayout>
//   );
// }

//----------------------------------------------------------------------------------------------------------

import React, { useEffect, useState, useMemo } from "react";
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
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../../Components/CommonButton/CreateButton";
import excelImg from "../../../../public/excell-img.png";
import Papa from "papaparse";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSizes = [10, 20, 50, 100];
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const gridApiRef = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const schoolResponse = await axios.get(
          `${API_BASE_URL}/api/get/schools`,
          {
            params: { page, limit: pageSize }, // Server-side pagination
          }
        );

        const { schools, totalRecords, totalPages } = schoolResponse.data;
        console.log("API Response:", schoolResponse.data);

        const formattedData = await Promise.all(
          schools.map(async (record) => {
            try {
              // Fetch user details for created_by
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const { username, role } = userResponse.data;

              // Fetch role name from role ID
              let roleName = "Unknown Role";
              try {
                const roleResponse = await axios.get(
                  `${API_BASE_URL}/api/r1/role/${role}`
                );
                roleName = roleResponse.data.role_name || "Unknown Role";
              } catch (roleError) {
                console.error(
                  `Failed to fetch role name for role ID: ${role}`,
                  roleError
                );
              }

              return {
                ...record,
                created_by: `${username} (${roleName})`,
              };
            } catch (userError) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                userError
              );
              return {
                ...record,
                created_by: "Unknown User (Unknown Role)",
              };
            }
          })
        );

        setRecords(formattedData);
        setFilteredRecords(formattedData); // Set filteredRecords for consistency
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
        console.log("Formatted Records:", formattedData);
      } catch (error) {
        console.error("Error fetching school data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Failed to fetch school data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

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
          .delete(`${API_BASE_URL}/api/get/schools/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setFilteredRecords((prev) =>
              prev.filter((record) => record.id !== id)
            );
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The school has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting school:", error);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text: "There was an issue deleting the school.",
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

  const parseCSVData = (csvData) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const schools = result.data.map((row) => ({
          board: row.board?.trim() || undefined,
          school_name: row.school_name?.trim() || undefined,
          pincode: row.pincode?.trim() || undefined,
          school_address: row.school_address?.trim() || undefined,
          country: row.country?.trim() || undefined,
          state: row.state?.trim() || undefined,
          district: row.district?.trim() || undefined,
          city: row.city?.trim() || undefined,
          school_email: row.school_email?.trim() || null,
          principal_contact_number:
            row.principal_contact_number?.trim() || null,
          principal_name: row.principal_name?.trim() || null,
          principal_whatsapp: row.principal_whatsapp?.trim() || null,
          school_contact_number: row.school_contact_number?.trim() || null,
          school_landline_number: row.school_landline_number?.trim() || null,
          vice_principal_name: row.vice_principal_name?.trim() || null,
          vice_principal_contact_number:
            row.vice_principal_contact_number?.trim() || null,
          vice_principal_whatsapp: row.vice_principal_whatsapp?.trim() || null,
          manager_name: row.manager_name?.trim() || null,
          manager_contact_number: row.manager_contact_number?.trim() || null,
          manager_whatsapp_number: row.manager_whatsapp_number?.trim() || null,
          first_incharge_name: row.first_incharge_name?.trim() || null,
          first_incharge_number: row.first_incharge_number?.trim() || null,
          first_incharge_whatsapp: row.first_incharge_whatsapp?.trim() || null,
          second_incharge_name: row.second_incharge_name?.trim() || null,
          second_incharge_number: row.second_incharge_number?.trim() || null,
          second_incharge_whatsapp:
            row.second_incharge_whatsapp?.trim() || null,
          junior_student_strength: row.junior_student_strength?.trim() || null,
          senior_student_strength: row.senior_student_strength?.trim() || null,
          classes: row.classes?.trim()
            ? row.classes.split(",").map((c) => c.trim())
            : null,
          status: row.status?.trim() || null,
          created_by: row.created_by?.trim() || "admin",
          updated_by: row.updated_by?.trim() || "admin",
        }));
        uploadSchoolsData(schools);
      },
      error: (error) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: `Failed to parse CSV: ${error.message}`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
      },
    });
  };

  const validateSchoolData = (schools) => {
    const mandatoryFields = [
      "board",
      "school_name",
      "pincode",
      "school_address",
      "country",
      "state",
      "district",
      "city",
    ];
    const invalidSchools = [];
    schools.forEach((school, index) => {
      const fieldMessages = [];
      mandatoryFields.forEach((field) => {
        if (!school[field] || school[field].toString().trim() === "") {
          if (["country", "state", "district", "city"].includes(field)) {
            fieldMessages.push(`Invalid ${field}: ${school[field] || "empty"}`);
          } else {
            fieldMessages.push(`Missing ${field}`);
          }
        }
      });
      if (fieldMessages.length > 0) {
        invalidSchools.push({
          index: index + 1,
          messages: fieldMessages,
        });
      }
    });
    return invalidSchools;
  };

  const uploadSchoolsData = async (schools) => {
    if (!Array.isArray(schools) || schools.length === 0) {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "No Data",
        text: "Please upload a valid CSV file with school data.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    }
    const invalidSchools = validateSchoolData(schools);
    if (invalidSchools.length > 0) {
      const details = invalidSchools.slice(0, 3).map((school) => {
        const errorList = school.messages
          .map((msg) => `<li>${msg}</li>`)
          .join("");
        return `<li><strong>Row ${school.index}:</strong><ul>${errorList}</ul></li>`;
      });
      if (invalidSchools.length > 3) {
        details.push(`<li>...and ${invalidSchools.length - 3} more rows</li>`);
      }
      return Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Invalid Data",
        html: `<div style="text-align: left;">
               <p>Issues found in ${invalidSchools.length} row(s):</p>
               <ul style="padding-left: 20px;">${details.join("")}</ul>
              </div>`,
        showConfirmButton: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
        width: 500,
      });
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/get/school/bulk-upload`,
        schools,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Successfully uploaded ${
          response.data.affectedRows || schools.length
        } schools.`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      }).then(() => {
        navigate(0);
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message || "An error occurred during upload.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    }
  };

  const handleDownloadClick = () => {
    const headers = [
      "board",
      "school_name",
      "school_address",
      "pincode",
      "country",
      "state",
      "district",
      "city",
      "school_email",
      "principal_name",
      "principal_contact_number",
      "principal_whatsapp",
      "school_contact_number",
      "school_landline_number",
      "vice_principal_name",
      "vice_principal_contact_number",
      "vice_principal_whatsapp",
      "manager_name",
      "manager_contact_number",
      "manager_whatsapp_number",
      "first_incharge_name",
      "first_incharge_number",
      "first_incharge_whatsapp",
      "second_incharge_name",
      "second_incharge_number",
      "second_incharge_whatsapp",
      "junior_student_strength",
      "senior_student_strength",
      "classes",
      "status",
    ];
    const rows = [
      [
        "CBSE",
        "ABC School",
        "BBSR Tankapani",
        "411001",
        "India",
        "Odisha",
        "Cuttack",
        "Aliabad",
        "abc@example.com",
        "Dr. Anil Kumar",
        "7991048546",
        "7991048546",
        "08012345678",
        "Priya Sharma",
        "Ravi Patel",
        "9123456789",
        "9876543210",
        "susant",
        "9898789078",
        "9898789078",
        "prasant",
        "9898789078",
        "9898789078",
        "srikant",
        "9898789078",
        "9898789078",
        "400",
        "500",
        "1",
        "active",
      ],
    ];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "schools_data_template.csv";
    link.click();
    handleClose();
  };

  const handleStatusApprovedChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      const response = await axios.put(
        `${API_BASE_URL}/api/get/school/${id}/status-approved`,
        { status_approved: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the specific record in state
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === id ? { ...record, status_approved: newStatus } : record
        )
      );
      setFilteredRecords((prevFiltered) =>
        prevFiltered.map((record) =>
          record.id === id ? { ...record, status_approved: newStatus } : record
        )
      );

      // 🟢 Dynamic message based on newStatus
      const statusMessage =
        newStatus === "approved"
          ? "Approved"
          : newStatus === "rejected"
          ? "Rejected"
          : "Pending";

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Status Updated!",
        text: ` ${statusMessage} status updated successfully `,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    } catch (error) {
      console.error("Error updating Approved:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message || "Failed to update approval status.",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "BOARD",
        field: "board",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value,
      },
      {
        headerName: "SCHOOL NAME",
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
        headerName: "SCHOOL CODE",
        field: "school_code",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 170,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value,
      },
      {
        headerName: "EMAIL",
        field: "school_email",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "CONTACT",
        field: "school_contact_number",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "COUNTRY",
        field: "country_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "STATE",
        field: "state_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "DISTRICT",
        field: "district_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CITY",
        field: "city_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "PINCODE",
        field: "pincode",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "STATUS",
        field: "status",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      // {
      //   headerName: "CREATED BY",
      //   field: "created_by",
      //   sortable: true,
      //   filter: "agTextColumnFilter",
      //   width: 150,
      // },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) => {
          const value = params.value;
          if (!value) return "";
          return value.charAt(0).toUpperCase() + value.slice(1);
        },
      },

      {
        headerName: "APPROVAL",
        field: "status_approved",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        cellRenderer: (params) => {
          const row = params.data;
          return (
            <div
              style={{
                overflow: "visible",
                position: "relative",
                zIndex: 1,
              }}
            >
              <select
                value={row.status_approved || "pending"}
                onChange={(e) =>
                  handleStatusApprovedChange(row.id, e.target.value)
                }
                style={{
                  padding: "4px 8px",
                  border: "none",
                  minWidth: "100px",
                  background: "transparent",
                  color:
                    row.status_approved === "approved"
                      ? "green"
                      : row.status_approved === "rejected"
                      ? "orange"
                      : "red",
                  cursor: "pointer",
                  appearance: "auto", // Ensures default dropdown arrow is visible
                }}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          );
        },
      },
      {
        headerName: "APPROVED BY",
        field: "approved_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
        cellStyle: { fontWeight: "bold" },
        valueFormatter: (params) => {
          const value = params.value;
          if (!value) return "";
          return value.charAt(0).toUpperCase() + value.slice(1);
        },
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
            <Link to={`/school/update/${params.data.id}`}>
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
    [handleStatusApprovedChange, handleDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: true,
      sortable: true,
      floatingFilter: false,
      minWidth: 100,
    }),
    []
  );

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

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
          <Breadcrumb data={[{ name: "School" }]} />
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
            <CreateButton link="/school-create" style={{ margin: "auto" }} />
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
          <div>Loading...</div>
        ) : (
          <>
            <div
              className="ag-theme-alpine"
              style={{ height: "500px", width: "100%", overflowX: "auto" }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={records} // Use records directly as pagination is server-side
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                pagination={false}
                suppressPaginationPanel={true}
                animateRows={true}
                theme={customTheme}
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
