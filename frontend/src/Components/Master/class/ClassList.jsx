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
// import styles from "./../../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import ButtonComp from "../../CommonButton/ButtonComp";
// import { Breadcrumbs } from "@mui/material";
// import { styled, emphasize } from "@mui/material/styles";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/DeleteSwal.css";
// import "../../Common-Css/Swallfire.css";
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

//   // useEffect(() => {
//   //   // Fetch data from the API when the component mounts
//   //   axios
//   //     .get(`${ API_BASE_URL }/api/class`) // Your API URL here
//   //     .then((response) => {
//   //       setRecords(response.data);
//   //       setFilteredRecords(response.data);
//   //     })
//   //     .catch((error) => {
//   //       console.error("There was an error fetching the records!", error);
//   //     });
//   // }, []);
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
//     axios
//       .get(`${API_BASE_URL}/api/class`)
//       .then(async (response) => {
//         const formattedData = await Promise.all(
//           response.data.map(async (record) => {
//             const userResponse = await axios.get(
//               `${API_BASE_URL}/api/u1/users/${record.created_by}`
//             );
//             const userName = userResponse.data.username;

//             return {
//               ...record,
//               created_at: formatTimestamp(record.created_at),
//               updated_at: formatTimestamp(record.updated_at),
//               created_by: userName, // Adding username to the record
//             };
//           })
//         );

//         setRecords(formattedData);
//         setFilteredRecords(formattedData);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the records!", error);
//       });
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
//           .delete(`${API_BASE_URL}/api/class/${id}`)
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
//               text: `The class has been deleted.`,
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
//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "Class" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/class/create"} />
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
//               {["class", "status","created_by", "created_at", "updated_at"].map((col) => (
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
//             {["class", "status","created_by", "created_at", "updated_at"].map((col) => (
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
//                 <td>{row.name}</td>
//                 <td>{row.status}</td>
//                 <td>{row.created_by}</td>
//                 <td>{row.created_at}</td>
//                 <td>{row.updated_at}</td>

//                 <td>
//                   <div className={styles.actionButtons}>
//                     {/* <FaEdit Link to={`/update/${row.id}`} className={`${styles.FaEdit}`} /> */}
//                     <Link to={`/class/update/${row.id}`}>
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




// import React, { useEffect, useState } from "react";
// import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
// import {
//   UilTrashAlt,
//   UilEditAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
// } from "@iconscout/react-unicons";

// import Mainlayout from "../../Layouts/Mainlayout";
// import styles from "./../../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import { Link } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/DeleteSwal.css";
// import "../../Common-Css/Swallfire.css";
// import CreateButton from "../../CommonButton/CreateButton";
// import axios from "axios";
// import Swal from "sweetalert2";

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
//     axios
//       .get(`${API_BASE_URL}/api/class`)
//       .then(async (response) => {
//         const formattedData = await Promise.all(
//           response.data.map(async (record) => {
//             const userResponse = await axios.get(
//               `${API_BASE_URL}/api/u1/users/${record.created_by}`
//             );
//             const userName = userResponse.data.username;

//             return {
//               ...record,
//               created_at: formatTimestamp(record.created_at),
//               updated_at: formatTimestamp(record.updated_at),
//               created_by: userName,
//             };
//           })
//         );

//         setRecords(formattedData);
//         setFilteredRecords(formattedData);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the records!", error);
//       });
//   }, []);

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       customClass: {
//         popup: "custom-swal-popup",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${API_BASE_URL}/api/class/${id}`)
//           .then((response) => {
//             setRecords((prevCountries) =>
//               prevCountries.filter((country) => country.id !== id)
//             );
//             setFilteredRecords((prevFiltered) =>
//               prevFiltered.filter((country) => country.id !== id)
//             );

//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: `The class has been deleted.`,
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
//       let aValue = a[column];
//       let bValue = b[column];

//       // Handle null or undefined values
//       if (aValue == null) aValue = "";
//       if (bValue == null) bValue = "";

//       // Handle date columns (created_at, updated_at)
//       if (column === "created_at" || column === "updated_at") {
//         const dateA = new Date(aValue);
//         const dateB = new Date(bValue);
//         return direction === "asc" ? dateA - dateB : dateB - dateA;
//       }

//       // Handle string columns (name, status, created_by)
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return direction === "asc"
//           ? aValue.localeCompare(bValue, undefined, { sensitivity: "base" })
//           : bValue.localeCompare(aValue, undefined, { sensitivity: "base" });
//       }

//       // Handle numeric columns (e.g., id)
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         return direction === "asc" ? aValue - bValue : bValue - aValue;
//       }

//       // Fallback for mixed or unexpected types
//       return direction === "asc"
//         ? String(aValue).localeCompare(String(bValue))
//         : String(bValue).localeCompare(String(aValue));
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
//           <Breadcrumb data={[{ name: "Class" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/class/create"} />
//         </div>
//       </div>
//       <div className={`${styles.tablecont} mt-0`}>
//         <table
//           className={`${styles.table}`}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow} pt-0 pb-0`}>
//               <th>
//                 <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
//               </th>
//               {["name", "status", "created_by", "created_at", "updated_at"].map(
//                 (col) => (
//                   <th
//                     key={col}
//                     className={styles.sortableHeader}
//                     onClick={() => handleSort(col)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <div className="d-flex justify-content-between align-items-center">
//                       <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
//                       {getSortIcon(col)}
//                     </div>
//                   </th>
//                 )
//               )}
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tr
//             className={styles.filterRow}
//             style={{ fontFamily: "Nunito, sans-serif" }}
//           >
//             <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
//             {["name", "status", "created_by", "created_at", "updated_at"].map(
//               (col) => (
//                 <th key={col}>
//                   <div className={styles.inputContainer}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                       type="text"
//                       placeholder={`Search ${col}`}
//                       onChange={(e) => handleFilter(e, col)}
//                       className={styles.filterInput}
//                     />
//                   </div>
//                 </th>
//               )
//             )}
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
//                 <td>{row.name}</td>
//                 <td>{row.status}</td>
//                 <td>{row.created_by}</td>
//                 <td>{row.created_at}</td>
//                 <td>{row.updated_at}</td>
//                 <td>
//                   <div className={styles.actionButtons}>
//                     <Link to={`/class/update/${row.id}`}>
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
//             <p className={`my-auto text-secondary`}>data per Page</p>
//           </div>

//           <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//             <label
//               htmlFor="pageSize"
//               style={{ fontFamily: "Nunito, sans-serif" }}
//             >
//               <p className={`my-auto text-secondary`}>
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

//================

// import React, { useEffect, useState } from "react";
// import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
// import {
//   UilTrashAlt,
//   UilEditAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
// } from "@iconscout/react-unicons";

// import Mainlayout from "../../Layouts/Mainlayout";
// import styles from "./../../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import { Link } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/DeleteSwal.css";
// import "../../Common-Css/Swallfire.css";
// import CreateButton from "../../CommonButton/CreateButton";
// import axios from "axios";
// import Swal from "sweetalert2";

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
//         // Fetch class data
//         const classResponse = await axios.get(`${API_BASE_URL}/api/class`);
//         const classData = classResponse.data;
  
//         // Format data with user details, role, and timestamps
//         const formattedData = await Promise.all(
//           classData.map(async (record) => {
//             try {
//               // Fetch user data by created_by
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               const { username, role } = userResponse.data; // Extract username and role ID
  
//               // Fetch role data using the role ID
//               const roleResponse = await axios.get(
//                 `${API_BASE_URL}/api/r1/role/${role}`
//               );
//               const { role_name} = roleResponse.data; // Extract role name

//               // Return formatted data with user and role information
//               return {
//                 ...record,
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: `${username} (${role_name})`, // Combine username and role name
              
          
//               };
//             } catch (userRoleError) {
//               console.error("Error fetching user/role data:", userRoleError);
//               // Fallback if there's an error fetching user or role
//               return {
//                 ...record,
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: "Unknown User (Unknown Role)", // Fallback value
                
//               };
//             }
//           })
//         );
  
//         // Set the formatted data to state
//         setRecords(formattedData);
//         setFilteredRecords(formattedData);
//       } catch (error) {
//         console.error("Error fetching class records:", error);
//       }
//     };
  
//     fetchData();
//   }, []);
  

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       customClass: {
//         popup: "custom-swal-popup",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${API_BASE_URL}/api/class/${id}`)
//           .then((response) => {
//             setRecords((prevCountries) =>
//               prevCountries.filter((country) => country.id !== id)
//             );
//             setFilteredRecords((prevFiltered) =>
//               prevFiltered.filter((country) => country.id !== id)
//             );

//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: `The class has been deleted.`,
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
//       let aValue = a[column];
//       let bValue = b[column];

//       // Handle null or undefined values
//       if (aValue == null) aValue = "";
//       if (bValue == null) bValue = "";

//       // Handle date columns (created_at, updated_at)
//       if (column === "created_at" || column === "updated_at") {
//         const dateA = new Date(aValue);
//         const dateB = new Date(bValue);
//         return direction === "asc" ? dateA - dateB : dateB - dateA;
//       }

//       // Handle string columns (name, status, created_by)
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return direction === "asc"
//           ? aValue.localeCompare(bValue, undefined, { sensitivity: "base" })
//           : bValue.localeCompare(aValue, undefined, { sensitivity: "base" });
//       }

//       // Handle numeric columns (e.g., id)
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         return direction === "asc" ? aValue - bValue : bValue - aValue;
//       }

//       // Fallback for mixed or unexpected types
//       return direction === "asc"
//         ? String(aValue).localeCompare(String(bValue))
//         : String(bValue).localeCompare(String(aValue));
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
//           <Breadcrumb data={[{ name: "Class" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/class/create"} />
//         </div>
//       </div>
//       <div className={`${styles.tablecont} mt-0`}>
//         <table
//           className={`${styles.table}`}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow} pt-0 pb-0`}>
//               <th>
//                 <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
//               </th>
//               {["name", "status", "created_by", "created_at", "updated_at",].map(
//                 (col) => (
//                   <th
//                     key={col}
//                     className={styles.sortableHeader}
//                     onClick={() => handleSort(col)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <div className="d-flex justify-content-between align-items-center">
//                       <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
//                       {getSortIcon(col)}
//                     </div>
//                   </th>
//                 )
//               )}
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tr
//             className={styles.filterRow}
//             style={{ fontFamily: "Nunito, sans-serif" }}
//           >
//             <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
//             {["name", "status", "created_by", "created_at", "updated_at"].map(
//               (col) => (
//                 <th key={col}>
//                   <div className={styles.inputContainer}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                       type="text"
//                       placeholder={`Search ${col}`}
//                       onChange={(e) => handleFilter(e, col)}
//                       className={styles.filterInput}
//                     />
//                   </div>
//                 </th>
//               )
//             )}
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
//                 <td>{row.name}</td>
//                 <td>{row.status}</td>
//                 <td>{row.created_by}</td>
//                 <td>{row.created_at}</td>
//                 <td>{row.updated_at}</td>
//                 <td>
//                   <div className={styles.actionButtons}>
//                     <Link to={`/class/update/${row.id}`}>
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
//             <p className={`my-auto text-secondary`}>data per Page</p>
//           </div>

//           <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//             <label
//               htmlFor="pageSize"
//               style={{ fontFamily: "Nunito, sans-serif" }}
//             >
//               <p className={`my-auto text-secondary`}>
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


import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa"; 
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import styles from "./../../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";
import CreateButton from "../../CommonButton/CreateButton";
import axios from "axios";
import Swal from "sweetalert2";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ column: "", direction: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [Role, setRoleDetails] = useState({}); // State for role-based permissions
  const pageSizes = [10, 20, 50, 100];

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

  // Fetch roleDetails from localStorage
  useEffect(() => {
    const storedroleDetails = JSON.parse(localStorage.getItem("roleDetails"));
    if (storedroleDetails) {
      setRoleDetails(storedroleDetails);
    }
  }, []);

  // Fetch class data and enrich with user/role info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await axios.get(`${API_BASE_URL}/api/class`);
        const classData = classResponse.data;

        const formattedData = await Promise.all(
          classData.map(async (record) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const { username, role } = userResponse.data;

              const roleResponse = await axios.get(
                `${API_BASE_URL}/api/r1/role/${role}`
              );
              const { role_name } = roleResponse.data;

              return {
                ...record,
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: `${username} (${role_name})`,
              };
            } catch (userRoleError) {
              console.error("Error fetching user/role data:", userRoleError);
              return {
                ...record,
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: "Unknown User (Unknown Role)",
              };
            }
          })
        );

        setRecords(formattedData);
        setFilteredRecords(formattedData);
      } catch (error) {
        console.error("Error fetching class records:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "custom-swal-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/api/class/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setFilteredRecords((prev) =>
              prev.filter((record) => record.id !== id)
            );

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The class has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: {
                popup: "small-swal",
              },
            });
          })
          .catch((error) => {
            console.error("Error deleting class:", error);
            Swal.fire("Error!", "There was an issue deleting the class.", "error");
          });
      }
    });
  };

  const handleFilter = (event, column) => {
    const value = event.target.value.toLowerCase();
    const filtered = records.filter((row) =>
      (row[column] || "").toString().toLowerCase().includes(value)
    );
    setFilteredRecords(filtered);
    setPage(1);
  };

  const handleSort = (column) => {
    let direction = sortConfig.column === column && sortConfig.direction === "asc" ? "desc" : "asc";

    const sortedData = [...filteredRecords].sort((a, b) => {
      let aValue = a[column] ?? "";
      let bValue = b[column] ?? "";

      if (column === "created_at" || column === "updated_at") {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue, undefined, { sensitivity: "base" })
          : bValue.localeCompare(aValue, undefined, { sensitivity: "base" });
      }

      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setFilteredRecords(sortedData);
    setSortConfig({ column, direction });
  };

  const getSortIcon = (column) => {
    const isActive = sortConfig.column === column;
    const isAsc = sortConfig.direction === "asc";
    return (
      <div className={styles.sortIconsContainer}>
        <FaCaretUp
          className={`${styles.sortIcon} ${isActive && isAsc ? styles.activeSortIcon : ""}`}
          onClick={() => handleSort(column)}
        />
        <FaCaretDown
          className={`${styles.sortIcon} ${isActive && !isAsc ? styles.activeSortIcon : ""}`}
          onClick={() => handleSort(column)}
        />
      </div>
    );
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < Math.ceil(filteredRecords.length / pageSize)) setPage(page + 1);
  };

  const currentRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});

  const handleRowCheck = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedRows({});
    } else {
      const allChecked = filteredRecords.reduce((acc, row) => {
        acc[row.id] = true;
        return acc;
      }, {});
      setCheckedRows(allChecked);
    }
    setIsAllChecked(!isAllChecked);
  };

  useEffect(() => {
    setIsAllChecked(filteredRecords.every((row) => checkedRows[row.id]));
  }, [checkedRows, filteredRecords]);

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "Class" }]} />
        </div>
        <div>
          <CreateButton link={"/class/create"} />
        </div>
      </div>
      <div className={`${styles.tablecont} mt-0`}>
        <table className={`${styles.table}`} style={{ fontFamily: "Nunito, sans-serif" }}>
          <thead>
            <tr className={`${styles.headerRow} pt-0 pb-0`}>
              <th>
                <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
              </th>
              {["name", "status", "created_by", "created_at", "updated_at"].map((col) => (
                <th
                  key={col}
                  className={styles.sortableHeader}
                  onClick={() => handleSort(col)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{col.toUpperCase()}</span>
                    {getSortIcon(col)}
                  </div>
                </th>
              ))}
              <th>Action</th>
            </tr>
            <tr className={styles.filterRow} style={{ fontFamily: "Nunito, sans-serif" }}>
              <th></th>
              {["name", "status", "created_by", "created_at", "updated_at"].map((col) => (
                <th key={col}>
                  <div className={styles.inputContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder={`Search ${col}`}
                      onChange={(e) => handleFilter(e, col)}
                      className={styles.filterInput}
                    />
                  </div>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((row) => (
              <tr key={row.id} className={styles.dataRow} style={{ fontFamily: "Nunito, sans-serif" }}>
                <td>
                  <Checkbox
                    checked={!!checkedRows[row.id]}
                    onChange={() => handleRowCheck(row.id)}
                  />
                </td>
                <td>{row.name}</td>
                <td>{row.status}</td>
                <td>{row.created_by}</td>
                <td>{row.created_at}</td>
                <td>{row.updated_at}</td>
                <td>
                  <div className={styles.actionButtons}>
                    {Role.permissions?.includes("UilEditAlt") && (
                      <Link to={`/class/update/${row.id}`}>
                        <UilEditAlt className={styles.FaEdit} />
                      </Link>
                    )}
                    {Role.permissions?.includes("UilTrashAlt") && (
                      <UilTrashAlt
                        onClick={() => handleDelete(row.id)}
                        className={`${styles.FaTrash}`}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between flex-wrap mt-2">
          <div className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className={styles.pageSizeSelect}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <p className="my-auto text-secondary">data per Page</p>
          </div>
          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <p className="my-auto text-secondary">
              {filteredRecords.length} of {page}-
              {Math.ceil(filteredRecords.length / pageSize)}
            </p>
          </div>
          <div className={`${styles.pagination} my-auto`}>
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={styles.paginationButton}
            >
              <UilAngleLeftB />
            </button>
            {Array.from(
              { length: Math.ceil(filteredRecords.length / pageSize) },
              (_, i) => i + 1
            )
              .filter(
                (pg) =>
                  pg === 1 ||
                  pg === Math.ceil(filteredRecords.length / pageSize) ||
                  Math.abs(pg - page) <= 2
              )
              .map((pg, index, array) => (
                <React.Fragment key={pg}>
                  {index > 0 && pg > array[index - 1] + 1 && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                  <button
                    onClick={() => setPage(pg)}
                    className={`${styles.paginationButton} ${
                      page === pg ? styles.activePage : ""
                    }`}
                  >
                    {pg}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={handleNextPage}
              disabled={page === Math.ceil(filteredRecords.length / pageSize)}
              className={styles.paginationButton}
            >
              <UilAngleRightB />
            </button>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}
