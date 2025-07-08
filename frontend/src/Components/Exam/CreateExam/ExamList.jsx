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
// } from "@iconscout/react-unicons";

// import Mainlayout from "../../Layouts/Mainlayout";
// import styles from "../../CommonTable/DataTable.module.css";
// // import "../../Common-Css/DeleteSwal.css";
// import "../../Common-Css/Swallfire.css";
// import Checkbox from "@mui/material/Checkbox";
// import ButtonComp from "../../CommonButton/ButtonComp";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import CreateButton from "../../CommonButton/CreateButton";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     column: "",
//     direction: "asc",
//   });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const pageSizes = [10, 20, 50, 100];

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

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch exam records
//         const examResponse = await axios.get(
//           `${API_BASE_URL}/api/e1/get-exams`
//         );
//         const examData = examResponse.data;

//         // Fetch user details for each exam based on created_by
//         const formattedData = await Promise.all(
//           examData.map(async (record) => {
//             const userResponse = await axios.get(
//               `${API_BASE_URL}/api/u1/users/${record.created_by}`
//             );
//             const userName = userResponse.data.username;
//             return {
//               ...record,
//               exam_date: record.exam_date ? record.exam_date.split("T")[0] : "", // Format exam_date
//               created_at: formatTimestamp(record.created_at),
//               updated_at: formatTimestamp(record.updated_at),
//               created_by: userName, // Replace created_by ID with username
//             };
//           })
//         );

//         setRecords(formattedData);
//         setFilteredRecords(formattedData);
//       } catch (error) {
//         console.error("There was an error fetching the records!", error);
//       }
//     };

//     fetchData();
//   }, []);

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
//           .delete(`${API_BASE_URL}/api/e1/delete-exam/${id}`)
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
//               text: `The exam has been deleted.`,
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

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < Math.ceil(filteredRecords.length / pageSize)) setPage(page + 1);
//   };

//   // const currentRecords = filteredRecords.slice(
//   //   (page - 1) * pageSize,
//   //   page * pageSize
//   // );
//   const currentRecords = Array.isArray(filteredRecords)
//     ? filteredRecords.slice((page - 1) * pageSize, page * pageSize)
//     : [];

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

//   //breadcrumb codes

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

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "Exam" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/exam"} />
//         </div>
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

//                 "school name",
//                 "class",
//                 "subjects",
//                 "level",
//                 "date form",
//                 "created_by",
//                 "created_at",
//                 "updated_at",
//               ].map((col) => (
//                 <th
//                   key={col}
//                   className={styles.sortableHeader}
//                   onClick={() => handleSort(col)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
//                     {getSortIcon(col)}
//                   </div>
//                 </th>
//               ))}
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tr
//             className={styles.filterRow}
//             style={{ fontFamily: "Nunito, sans-serif" }}
//           >
//             <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
//             {[

//               "school name",
//               "class",
//               "subjects",
//               "level",
//               "date form",
//               "created_by",
//               "created_at",
//               "updated_at",
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
//                 <td>{row.school}</td>
//                 <td>{row.classes.join(",")}</td>
//                 <td>{row.subjects.join(",")}</td>
//                 <td>{row.level}</td>
//                 <td>{row.exam_date}</td>
//                 <td>{row.created_by}</td>
//                 <td>{row.created_at}</td>
//                 <td>{row.updated_at}</td>

//                 <td>
//                   <div className={styles.actionButtons}>
//                     {/* <Link to={`/update/${row.id}`}>
//                       <UilEditAlt className={styles.FaEdit} />
//                     </Link> */}
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
//           <div
//             className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//           >
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 const selectedSize = parseInt(e.target.value, 10);
//                 setPageSize(selectedSize);
//                 setPage(1);
//               }}
//               className={styles.pageSizeSelect}
//             >
//               {pageSizes.map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//             <p className={`  my-auto text-secondary`}>data per Page</p>
//           </div>

//           <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//             <label
//               htmlFor="pageSize"
//               style={{ fontFamily: "Nunito, sans-serif" }}
//             >
//               <p className={`  my-auto text-secondary`}>
//                 {filteredRecords.length} of {page}-
//                 {Math.ceil(filteredRecords.length / pageSize)}
//               </p>
//             </label>
//           </div>

//           <div className={`${styles.pagination} my-auto`}>
//             <button
//               onClick={handlePreviousPage}
//               disabled={page === 1}
//               className={styles.paginationButton}
//             >
//               <UilAngleLeftB />
//             </button>

//             {Array.from(
//               { length: Math.ceil(filteredRecords.length / pageSize) },
//               (_, i) => i + 1
//             )
//               .filter(
//                 (pg) =>
//                   pg === 1 ||
//                   pg === Math.ceil(filteredRecords.length / pageSize) ||
//                   Math.abs(pg - page) <= 2
//               )
//               .map((pg, index, array) => (
//                 <React.Fragment key={pg}>
//                   {index > 0 && pg > array[index - 1] + 1 && (
//                     <span className={styles.ellipsis}>...</span>
//                   )}
//                   <button
//                     onClick={() => setPage(pg)}
//                     className={`${styles.paginationButton} ${
//                       page === pg ? styles.activePage : ""
//                     }`}
//                   >
//                     {pg}
//                   </button>
//                 </React.Fragment>
//               ))}

//             <button
//               onClick={handleNextPage}
//               disabled={page === Math.ceil(filteredRecords.length / pageSize)}
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




// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   UilTrashAlt,
//   UilEditAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
// } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import CreateButton from "../../CommonButton/CreateButton";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return "";
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

//   // Fetch data with server-side pagination and search
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         console.log("Fetching exams with params:", {
//           page,
//           limit: pageSize,
//           search: searchTerm,
//         });
//         const examResponse = await axios.get(
//           `${API_BASE_URL}/api/e1/get-exams-paginate`,
//           {
//             params: { page, limit: pageSize, search: searchTerm },
//           }
//         );

//         console.log("Exam API response:", examResponse.data);

//         // Validate response structure
//         const {
//           exams = [],
//           totalRecords = 0,
//           totalPages = 0,
//         } = examResponse.data || {};

//         if (!Array.isArray(exams)) {
//           throw new Error("Expected 'exams' to be an array");
//         }

//         const formattedData = await Promise.all(
//           exams.map(async (record) => {
//             try {
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               console.log(
//                 `User response for ID ${record.created_by}:`,
//                 userResponse.data
//               );
//               const userName = userResponse.data?.username || "Unknown User";
//               return {
//                 ...record,
//                 exam_date: record.exam_date
//                   ? record.exam_date.split("T")[0]
//                   : "",
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: userName,
//               };
//             } catch (userError) {
//               console.error(
//                 `Failed to fetch user details for created_by: ${record.created_by}`,
//                 userError
//               );
//               return {
//                 ...record,
//                 exam_date: record.exam_date
//                   ? record.exam_date.split("T")[0]
//                   : "",
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: "Unknown User",
//               };
//             }
//           })
//         );

//         setRecords(formattedData);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error(
//           "Error fetching exam data:",
//           error.message,
//           error.response
//         );
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: `Failed to fetch exam data: ${error.message}`,
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [page, pageSize, searchTerm]);

//   // Handle delete action
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
//           .delete(`${API_BASE_URL}/api/e1/delete-exam/${id}`)
//           .then(() => {
//             setRecords((prev) => prev.filter((record) => record.id !== id));
//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The exam has been deleted.",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting exam:", error.message);
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text: `There was an issue deleting the exam: ${error.message}`,
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

//   // AG Grid column definitions
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "SCHOOL NAME",
//         field: "school",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value || "",
//       },
//       {
//         headerName: "CLASS",
//         field: "classes",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//         valueGetter: (params) => params.data.classes?.join(", ") || "",
//       },
//       {
//         headerName: "SUBJECTS",
//         field: "subjects",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueGetter: (params) => params.data.subjects?.join(", ") || "",
//       },
//       {
//         headerName: "LEVEL",
//         field: "level",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 100,
//       },
//       {
//         headerName: "DATE FORM",
//         field: "exam_date",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) =>
//           params.value
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : "",
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
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
//             {/* Uncomment and adjust the edit link as needed */}
//             {/* <Link to={`/exam/update/${params.data.id}`}>
//               <UilEditAlt
//                 style={{
//                   color: "#1230AE",
//                   cursor: "pointer",
//                   fontSize: "18px",
//                 }}
//               />
//             </Link> */}
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

//   // AG Grid default column definitions
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

//   // Handle grid initialization
//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.autoSizeAllColumns();
//   };

//   // Handle filter changes
//   const onFilterChanged = (params) => {
//     if (gridApiRef.current) {
//       const filterModel = gridApiRef.current.getFilterModel();
//       const searchValue = Object.values(filterModel)
//         .map((filter) => filter.filter)
//         .filter((value) => value && value.trim() !== "")
//         .join(" ")
//         .trim();

//       console.log("Filter changed, new search term:", searchValue);
//       setSearchTerm(searchValue);
//       setPage(1);
//     }
//   };

//   // Pagination controls
//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   // Custom AG Grid theme
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
//           <Breadcrumb data={[{ name: "Exam" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/exam"} />
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
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 rowSelection="multiple"
//                 suppressRowClickSelection={true}
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





// import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   UilTrashAlt,
//   UilEditAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
// } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import CreateButton from "../../CommonButton/CreateButton";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return "";
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

//   // Resize columns to fit grid width
//   const sizeColumnsToFit = useCallback(() => {
//     if (gridApiRef.current) {
//       gridApiRef.current.sizeColumnsToFit();
//     }
//   }, []);

//   // Fetch data with server-side pagination and search
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         console.log("Fetching exams with params:", {
//           page,
//           limit: pageSize,
//           search: searchTerm,
//         });
//         const examResponse = await axios.get(
//           `${API_BASE_URL}/api/e1/get-exams-paginate`,
//           {
//             params: { page, limit: pageSize, search: searchTerm },
//           }
//         );

//         console.log("Exam API response:", examResponse.data);

//         const {
//           exams = [],
//           totalRecords = 0,
//           totalPages = 0,
//         } = examResponse.data || {};

//         if (!Array.isArray(exams)) {
//           throw new Error("Expected 'exams' to be an array");
//         }

//         const formattedData = await Promise.all(
//           exams.map(async (record) => {
//             try {
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               const userName = userResponse.data?.username || "Unknown User";
//               return {
//                 ...record,
//                 exam_date: record.exam_date
//                   ? record.exam_date.split("T")[0]
//                   : "",
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: userName,
//               };
//             } catch (userError) {
//               console.error(
//                 `Failed to fetch user details for created_by: ${record.created_by}`,
//                 userError
//               );
//               return {
//                 ...record,
//                 exam_date: record.exam_date
//                   ? record.exam_date.split("T")[0]
//                   : "",
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: "Unknown User",
//               };
//             }
//           })
//         );

//         setRecords(formattedData);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);

//         // Resize columns after data is loaded
//         setTimeout(sizeColumnsToFit, 0); // Ensure it runs after render
//       } catch (error) {
//         console.error(
//           "Error fetching exam data:",
//           error.message,
//           error.response
//         );
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: `Failed to fetch exam data: ${error.message}`,
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [page, pageSize, searchTerm, sizeColumnsToFit]);

//   // Handle delete action
//   const handleDelete = useCallback(
//     (id) => {
//       Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//         customClass: { popup: "custom-swal-popup" },
//       }).then((result) => {
//         if (result.isConfirmed) {
//           axios
//             .delete(`${API_BASE_URL}/api/e1/delete-exam/${id}`)
//             .then(() => {
//               setRecords((prev) => prev.filter((record) => record.id !== id));
//               setTimeout(sizeColumnsToFit, 0); // Resize after deletion
//               Swal.fire({
//                 position: "top-end",
//                 icon: "success",
//                 title: "Success!",
//                 text: "The exam has been deleted.",
//                 showConfirmButton: false,
//                 timer: 1000,
//                 timerProgressBar: true,
//                 toast: true,
//                 background: "#fff",
//                 customClass: { popup: "small-swal" },
//               });
//             })
//             .catch((error) => {
//               console.error("Error deleting exam:", error.message);
//               Swal.fire({
//                 position: "top-end",
//                 icon: "error",
//                 title: "Error!",
//                 text: `There was an issue deleting the exam: ${error.message}`,
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

//   // AG Grid column definitions
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "SCHOOL NAME",
//         field: "school",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100, // Replaced width with minWidth
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value || "",
//       },
//       {
//         headerName: "CLASS",
//         field: "classes",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100, // Replaced width with minWidth
//         valueGetter: (params) => params.data.classes?.join(", ") || "",
//       },
//       {
//         headerName: "SUBJECTS",
//         field: "subjects",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100, // Replaced width with minWidth
//         valueGetter: (params) => params.data.subjects?.join(", ") || "",
//       },
//       {
//         headerName: "LEVEL",
//         field: "level",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 80, // Replaced width with minWidth
//       },
//       {
//         headerName: "DATE FORM",
//         field: "exam_date",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100, // Replaced width with minWidth
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100, // Replaced width with minWidth
//         valueFormatter: (params) =>
//           params.value
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : "",
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 120, // Replaced width with minWidth
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         minWidth: 80, // Replaced width with minWidth
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
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

//   // AG Grid default column definitions
//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 80,
//       flex: 1, // Allow columns to stretch evenly
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
//   );

//   // Handle grid initialization
//   const onGridReady = useCallback(
//     (params) => {
//       gridApiRef.current = params.api;
//       sizeColumnsToFit();
//     },
//     [sizeColumnsToFit]
//   );

//   // Handle filter changes
//   const onFilterChanged = useCallback(
//     (params) => {
//       if (gridApiRef.current) {
//         const filterModel = gridApiRef.current.getFilterModel();
//         const searchValue = Object.values(filterModel)
//           .map((filter) => filter.filter)
//           .filter((value) => value && value.trim() !== "")
//           .join(" ")
//           .trim();

//         console.log("Filter changed, new search term:", searchValue);
//         setSearchTerm(searchValue);
//         setPage(1);
//         setTimeout(sizeColumnsToFit, 0); // Resize after filter change
//       }
//     },
//     [sizeColumnsToFit]
//   );

//   // Pagination controls
//   const handlePreviousPage = useCallback(() => {
//     if (page > 1) {
//       setPage(page - 1);
//       setTimeout(sizeColumnsToFit, 0); // Resize after page change
//     }
//   }, [page, sizeColumnsToFit]);

//   const handleNextPage = useCallback(() => {
//     if (page < totalPages) {
//       setPage(page + 1);
//       setTimeout(sizeColumnsToFit, 0); // Resize after page change
//     }
//   }, [page, totalPages, sizeColumnsToFit]);

//   // Custom AG Grid theme
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
//           <Breadcrumb data={[{ name: "Exam" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/exam"} />
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
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 rowSelection="multiple"
//                 suppressRowClickSelection={true}
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
//                     setTimeout(sizeColumnsToFit, 0); // Resize after page size change
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
//                         onClick={() => {
//                           setPage(pg);
//                           setTimeout(sizeColumnsToFit, 0); // Resize after page change
//                         }}
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


import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../CommonButton/CreateButton";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const gridApiRef = useRef(null);
  const pageSizes = [10, 20, 50, 100];

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
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

  // Resize columns to fit grid width
  const sizeColumnsToFit = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.sizeColumnsToFit();
    }
  }, []);

  // Fetch data with server-side pagination and search
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching exams with params:", {
          page,
          limit: pageSize,
          search: searchTerm,
        });
        const examResponse = await axios.get(
          `${API_BASE_URL}/api/e1/get-exams-paginate`,
          {
            params: { page, limit: pageSize, search: searchTerm },
          }
        );

        console.log("Exam API response:", examResponse.data);

        const {
          exams = [],
          totalRecords = 0,
          totalPages = 0,
        } = examResponse.data || {};

        if (!Array.isArray(exams)) {
          throw new Error("Expected 'exams' to be an array");
        }

        const formattedData = await Promise.all(
          exams.map(async (record) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const userName = userResponse.data?.username || "Unknown User";
              return {
                ...record,
                exam_date: record.exam_date
                  ? record.exam_date.split("T")[0]
                  : "",
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: userName,
              };
            } catch (userError) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                userError
              );
              return {
                ...record,
                exam_date: record.exam_date
                  ? record.exam_date.split("T")[0]
                  : "",
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: "Unknown User",
              };
            }
          })
        );

        setRecords(formattedData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);

        // Resize columns after data is loaded
        setTimeout(sizeColumnsToFit, 0); // Ensure it runs after render
      } catch (error) {
        console.error(
          "Error fetching exam data:",
          error.message,
          error.response
        );
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: `Failed to fetch exam data: ${error.message}`,
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchTerm, sizeColumnsToFit]);

  // Handle delete action
  const handleDelete = useCallback(
    (id) => {
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
            .delete(`${API_BASE_URL}/api/e1/delete-exam/${id}`)
            .then(() => {
              setRecords((prev) => prev.filter((record) => record.id !== id));
              setTimeout(sizeColumnsToFit, 0); // Resize after deletion
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Success!",
                text: "The exam has been deleted.",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                toast: true,
                background: "#fff",
                customClass: { popup: "small-swal" },
              });
            })
            .catch((error) => {
              console.error("Error deleting exam:", error.message);
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: `There was an issue deleting the exam: ${error.message}`,
                showConfirmButton: false,
                timer: 2000,
                toast: true,
                background: "#fff",
                customClass: { popup: "small-swal" },
              });
            });
        }
      });
    },
    [sizeColumnsToFit]
  );

  // AG Grid column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "SCHOOL NAME",
        field: "school",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value || "",
      },
      {
        headerName: "CLASS",
        field: "classes",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueGetter: (params) => params.data.classes?.join(", ") || "",
      },
      {
        headerName: "SUBJECTS",
        field: "subjects",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueGetter: (params) => params.data.subjects?.join(", ") || "",
      },
      {
        headerName: "LEVEL",
        field: "level",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 80, // Keep minWidth for minimum sizing
      },
      {
        headerName: "DATE FORM",
        field: "exam_date",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
      },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueFormatter: (params) =>
          params.value
            ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
            : "",
      },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 120, // Keep minWidth for minimum sizing
      },
      {
        headerName: "ACTION",
        field: "action",
        sortable: false,
        filter: false,
        minWidth: 80,
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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

  // AG Grid default column definitions
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 80,
      flex: 1, // Allow columns to stretch evenly
      suppressFilterResetOnColumnChange: true,
    }),
    []
  );

  // Handle grid initialization
  const onGridReady = useCallback(
    (params) => {
      gridApiRef.current = params.api;
      sizeColumnsToFit();
    },
    [sizeColumnsToFit]
  );

  // Handle filter changes
  const onFilterChanged = useCallback(
    (params) => {
      if (gridApiRef.current) {
        const filterModel = gridApiRef.current.getFilterModel();
        const searchValue = Object.values(filterModel)
          .map((filter) => filter.filter)
          .filter((value) => value && value.trim() !== "")
          .join(" ")
          .trim();

        console.log("Filter changed, new search term:", searchValue);
        setSearchTerm(searchValue);
        setPage(1);
        setTimeout(sizeColumnsToFit, 0); // Resize after filter change
      }
    },
    [sizeColumnsToFit]
  );

  // Pagination controls
  const handlePreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
      setTimeout(sizeColumnsToFit, 0); // Resize after page change
    }
  }, [page, sizeColumnsToFit]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
      setTimeout(sizeColumnsToFit, 0); // Resize after page change
    }
  }, [page, totalPages, sizeColumnsToFit]);

  // Custom AG Grid theme
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
          <Breadcrumb data={[{ name: "Exam" }]} />
        </div>
        <div>
          <CreateButton link={"/exam"} />
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
                rowData={records}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                pagination={false}
                suppressPaginationPanel={true}
                animateRows={true}
                onFilterChanged={onFilterChanged}
                rowSelection="multiple"
                suppressRowClickSelection={true}
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
                    setTimeout(sizeColumnsToFit, 0); // Resize after page size change
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
                        onClick={() => {
                          setPage(pg);
                          setTimeout(sizeColumnsToFit, 0); // Resize after page change
                        }}
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
