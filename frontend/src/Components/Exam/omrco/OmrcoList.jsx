// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
// import {
//   UilTrashAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
//   UilEye,
//   UilEditAlt,
//   UilDownloadAlt,
// } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import styles from "./../../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import CreateButton from "../../CommonButton/CreateButton";
// import { FaPlus } from "react-icons/fa";
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
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [checkedRows, setCheckedRows] = useState({});

//   const pageSizes = [10, 20, 50, 100];
//   const columns = [
//     { label: "SCHOOL", key: "school" },
//     { label: "COUNTRY", key: "country" },
//     { label: "STATE", key: "state" },
//     { label: "DISTRICT", key: "district" },
//     { label: "CITY", key: "city" },
//     { label: "SUBJECTS", key: "subjects" },
//     { label: "CLASSES", key: "classes" },
//     { label: "TOTAL STUDENTS", key: "student_count" },
//     { label: "LEVEL", key: "level" },
//     { label: "ACTION", key: "action" },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/omr/omr-data`);
//         setRecords(response.data.data);
//         setFilteredRecords(response.data.data);
//       } catch (error) {
//         console.error("Error fetching OMR data:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to fetch OMR data.",
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//     };
//     fetchData();
//   }, []);

//   const handleDownload = async (id, school) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/omr/download/by-id/${id}`, {
//         responseType: 'blob', // Important for handling binary data
//       });

//       const contentDisposition = response.headers['content-disposition'];
//       const filename = contentDisposition
//         ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || `${school}_${id}.pdf`
//         : `${school}_${id}.pdf`;

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: `PDF for ${school} downloaded successfully.`,
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.status === 404 ? "PDF file not found." : "Failed to download PDF.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }
//   };

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
//           .delete(`${API_BASE_URL}/api/omr/omr-data/${id}`)
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
//               text: `The OMR has been deleted.`,
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
//             console.error("Error deleting OMR:", error);
//             Swal.fire({
//               icon: "error",
//               title: "Error",
//               text: "There was an issue deleting the OMR data.",
//               toast: true,
//               position: "top-end",
//               showConfirmButton: false,
//               timer: 1500,
//             });
//           });
//       }
//     });
//   };

//   const handleFilter = (event, key) => {
//     const value = event.target.value.toLowerCase();
//     const filtered = records.filter((row) => {
//       const cellValue = Array.isArray(row[key])
//         ? row[key].join(", ")
//         : row[key]?.toString().toLowerCase() || "";
//       return cellValue.includes(value);
//     });
//     setFilteredRecords(filtered);
//     setPage(1);
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key) {
//       direction = sortConfig.direction === "asc" ? "desc" : "asc";
//     }

//     const sortedData = [...filteredRecords].sort((a, b) => {
//       const aValue = Array.isArray(a[key]) ? a[key].join(", ") : a[key];
//       const bValue = Array.isArray(b[key]) ? b[key].join(", ") : b[key];

//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return direction === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//       return direction === "asc" ? aValue - bValue : bValue - aValue;
//     });

//     setFilteredRecords(sortedData);
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     const isActive = sortConfig.key === key;
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

//   const handlePreviousPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () =>
//     page < Math.ceil(filteredRecords.length / pageSize) && setPage(page + 1);

//   const currentRecords = filteredRecords.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const handleRowCheck = (id) => {
//     setCheckedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   useEffect(() => {
//     setIsAllChecked(filteredRecords.every((row) => checkedRows[row.id]));
//   }, [checkedRows, filteredRecords]);

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR" }]} />
//         <CreateButton link="/omr-create" />
//       </div>

//       <div className={`${styles.tablecont} mt-0`}>
//         <table
//           className={styles.table}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow} pt-0 pb-0`}>
//               <th>
//                 <Checkbox
//                   checked={isAllChecked}
//                   onChange={() => {
//                     const newChecked = {};
//                     if (!isAllChecked) {
//                       filteredRecords.forEach((row) => {
//                         newChecked[row.id] = true;
//                       });
//                     }
//                     setCheckedRows(newChecked);
//                   }}
//                 />
//               </th>
//               {columns.map((col) => (
//                 <th
//                   key={col.key}
//                   className={styles.sortableHeader}
//                   onClick={() => handleSort(col.key)}
//                 >
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span>{col.label}</span>
//                     {getSortIcon(col.key)}
//                   </div>
//                 </th>
//               ))}
//             </tr>

//             <tr className={styles.filterRow}>
//               <th></th>
//               {columns.map((col) => (
//                 <th key={col.key}>
//                   <div className={styles.inputContainer}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                       type="text"
//                       placeholder={`Search ${col.label}`}
//                       onChange={(e) => handleFilter(e, col.key)}
//                       className={styles.filterInput}
//                     />
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {currentRecords.map((row) => (
//               <tr key={row.id} className={styles.dataRow}>
//                 <td>
//                   <Checkbox
//                     checked={!!checkedRows[row.id]}
//                     onChange={() => handleRowCheck(row.id)}
//                   />
//                 </td>
//                 {columns.map((col) => (
//                   <td key={`${row.id}-${col.key}`}>
//                     {col.key === "action" ? (
//                       <div className={styles.actionButtons}>
//                         <Link to={`/omr/view/${row.id}`}>
//                           <UilEye className={styles.FaEdit} />
//                         </Link>
//                         <UilTrashAlt
//                           onClick={() => handleDelete(row.id)}
//                           className={`${styles.FaTrash} text-danger cursor-pointer`}
//                           style={{ width: "25px", height: "25px" }}
//                         />
//                         <span
//                           onClick={() => handleDownload(row.id, row.school)}
//                           className="cursor-pointer"
//                         >
//                           <UilDownloadAlt className={styles.FaEdit} />
//                         </span>
//                       </div>
//                     ) : Array.isArray(row[col.key]) ? (
//                       row[col.key].join(", ")
//                     ) : (
//                       row[col.key]
//                     )}
//                   </td>
//                 ))}
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
//                 setPageSize(Number(e.target.value));
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
//             <p className="my-auto text-secondary">items per page</p>
//           </div>

//           <div className="my-auto">
//             <p className="text-secondary">
//               Showing {currentRecords.length} of {filteredRecords.length} items
//             </p>
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
// import { useNavigate, Link } from "react-router-dom";
// import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
// import {
//   UilTrashAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
//   UilEye,
//   UilEditAlt,
//   UilDownloadAlt,
// } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import styles from "./../../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import CreateButton from "../../CommonButton/CreateButton";
// import { FaPlus } from "react-icons/fa";
// import activeDownload from "../../../../public/download-active.png";
// import inActiveDownload from "../../../../public/download-inactive.png";
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
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [checkedRows, setCheckedRows] = useState({});

//   const pageSizes = [10, 20, 50, 100];
//   const columns = [
//     { label: "SCHOOL", key: "school" },
//     { label: "COUNTRY", key: "country" },
//     { label: "STATE", key: "state" },
//     { label: "DISTRICT", key: "district" },
//     { label: "CITY", key: "city" },
//     { label: "SUBJECTS", key: "subjects" },
//     { label: "CLASSES", key: "classes" },
//     { label: "TOTAL STUDENTS", key: "student_count" },
//     { label: "LEVEL", key: "level" },
//     { label: "ACTION", key: "action" },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/omr/omr-data`);
//         setRecords(response.data.data);
//         setFilteredRecords(response.data.data);
//       } catch (error) {
//         console.error("Error fetching OMR data:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to fetch OMR data.",
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//     };
//     fetchData();
//   }, []);

//   const handleDownload = async (id, school) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/omr/download/by-id/${id}`,
//         {
//           responseType: "blob", // Important for handling binary data
//         }
//       );

//       const contentDisposition = response.headers["content-disposition"];
//       const filename = contentDisposition
//         ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") ||
//           `${school}_${id}.pdf`
//         : `${school}_${id}.pdf`;

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: `PDF for ${school} downloaded successfully.`,
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text:
//           error.response?.status === 404
//             ? "PDF file not found."
//             : "Failed to download PDF.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }
//   };

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
//           .delete(`${API_BASE_URL}/api/omr/omr-data/${id}`)
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
//               text: `The OMR has been deleted.`,
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
//             console.error("Error deleting OMR:", error);
//             Swal.fire({
//               icon: "error",
//               title: "Error",
//               text: "There was an issue deleting the OMR data.",
//               toast: true,
//               position: "top-end",
//               showConfirmButton: false,
//               timer: 1500,
//             });
//           });
//       }
//     });
//   };

//   const handleFilter = (event, key) => {
//     const value = event.target.value.toLowerCase();
//     const filtered = records.filter((row) => {
//       const cellValue = Array.isArray(row[key])
//         ? row[key].join(", ")
//         : row[key]?.toString().toLowerCase() || "";
//       return cellValue.includes(value);
//     });
//     setFilteredRecords(filtered);
//     setPage(1);
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key) {
//       direction = sortConfig.direction === "asc" ? "desc" : "asc";
//     }

//     const sortedData = [...filteredRecords].sort((a, b) => {
//       const aValue = Array.isArray(a[key]) ? a[key].join(", ") : a[key];
//       const bValue = Array.isArray(b[key]) ? b[key].join(", ") : b[key];

//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return direction === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//       return direction === "asc" ? aValue - bValue : bValue - aValue;
//     });

//     setFilteredRecords(sortedData);
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     const isActive = sortConfig.key === key;
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

//   const handlePreviousPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () =>
//     page < Math.ceil(filteredRecords.length / pageSize) && setPage(page + 1);

//   const currentRecords = filteredRecords.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const handleRowCheck = (id) => {
//     setCheckedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   useEffect(() => {
//     setIsAllChecked(filteredRecords.every((row) => checkedRows[row.id]));
//   }, [checkedRows, filteredRecords]);

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR" }]} />
//         <CreateButton link="/omr-create" />
//       </div>

//       <div className={`${styles.tablecont} mt-0`}>
//         <table
//           className={styles.table}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow} pt-0 pb-0`}>
//               <th>
//                 <Checkbox
//                   checked={isAllChecked}
//                   onChange={() => {
//                     const newChecked = {};
//                     if (!isAllChecked) {
//                       filteredRecords.forEach((row) => {
//                         newChecked[row.id] = true;
//                       });
//                     }
//                     setCheckedRows(newChecked);
//                   }}
//                 />
//               </th>
//               {columns.map((col) => (
//                 <th
//                   key={col.key}
//                   className={styles.sortableHeader}
//                   onClick={() => handleSort(col.key)}
//                 >
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span>{col.label}</span>
//                     {getSortIcon(col.key)}
//                   </div>
//                 </th>
//               ))}
//             </tr>

//             <tr className={styles.filterRow}>
//               <th></th>
//               {columns.map((col) => (
//                 <th key={col.key}>
//                   <div className={styles.inputContainer}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                       type="text"
//                       placeholder={`Search ${col.label}`}
//                       onChange={(e) => handleFilter(e, col.key)}
//                       className={styles.filterInput}
//                     />
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {currentRecords.map((row) => (
//               <tr key={row.id} className={styles.dataRow}>
//                 <td>
//                   <Checkbox
//                     checked={!!checkedRows[row.id]}
//                     onChange={() => handleRowCheck(row.id)}
//                   />
//                 </td>
//                 {columns.map((col) => (
//                   <td key={`${row.id}-${col.key}`}>
//                     {col.key === "action" ? (
//                       <div className={styles.actionButtons}>
//                         <Link to={`/omr/view/${row.id}`}>
//                           <UilEye className={styles.FaEdit} />
//                         </Link>
//                         <UilTrashAlt
//                           onClick={() => handleDelete(row.id)}
//                           className={`${styles.FaTrash} text-danger cursor-pointer`}
//                           style={{ width: "25px", height: "25px" }}
//                         />
//                         <span
//                           onClick={
//                             row.status === "Active"
//                               ? () => handleDownload(row.id, row.school)
//                               : undefined
//                           }
//                           className={`${styles.downloadButton} ${
//                             row.status === "Active"
//                               ? "cursor-pointer"
//                               : styles.disabledButton
//                           }`}
//                           title={
//                             row.status === "Inactive"
//                               ? "Download disabled: Status is inactive"
//                               : "Download PDF"
//                           }
//                         >
//                           {/* <UilDownloadAlt
//                             className={`${styles.FaEdit} ${
//                               row.status === "Inactive"
//                                 ? styles.disabledIcon
//                                 : ""
//                             }`}
//                           /> */}
//                           {row.status === "Inactive" ? (
//                             <img
//                               src={inActiveDownload}
//                               alt=""
//                               height="20px"
//                               width="20px"
//                             />
//                           ) : (
//                             <img
//                               src={activeDownload}
//                               alt=""
//                               height="20px"
//                               width="20px"
//                             />
//                           )}
//                         </span>
//                       </div>
//                     ) : Array.isArray(row[col.key]) ? (
//                       row[col.key].join(", ")
//                     ) : (
//                       row[col.key]
//                     )}
//                   </td>
//                 ))}
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
//                 setPageSize(Number(e.target.value));
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
//             <p className="my-auto text-secondary">items per page</p>
//           </div>

//           <div className="my-auto">
//             <p className="text-secondary">
//               Showing {currentRecords.length} of {filteredRecords.length} items
//             </p>
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

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  UilTrashAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilEye,
  UilEditAlt,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import CreateButton from "../../CommonButton/CreateButton";
import Swal from "sweetalert2";
import activeDownload from "../../../../public/download-active.png";
import inActiveDownload from "../../../../public/download-inactive.png";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const gridApiRef = useRef(null);
  const pageSizes = [10, 20, 50, 100];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/omr/omr-data`, {
          params: { page, limit: pageSize, search: searchTerm },
        });
        const { data, totalRecords, totalPages } = response.data;
        setRecords(data);
        setTotalRecords(totalRecords || data.length);
        setTotalPages(totalPages || Math.ceil(data.length / pageSize));
      } catch (error) {
        console.error("Error fetching OMR data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch OMR data.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, searchTerm]);

  // Handle download
  const handleDownload = async (id, school) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/omr/download/by-id/${id}`,
        { responseType: "blob" }
      );

      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") ||
          `${school}_${id}.pdf`
        : `${school}_${id}.pdf`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `PDF for ${school} downloaded successfully.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.status === 404
            ? "PDF file not found."
            : "Failed to download PDF.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Handle delete
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
          .delete(`${API_BASE_URL}/api/omr/omr-data/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setTotalRecords((prev) => prev - 1);
            setTotalPages(Math.ceil((totalRecords - 1) / pageSize));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The OMR has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting OMR:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "There was an issue deleting the OMR data.",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  // Column definitions for AG Grid
  const columnDefs = useMemo(
    () => [
   
      {
        headerName: "SCHOOL",
        field: "school",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "COUNTRY",
        field: "country",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "STATE",
        field: "state",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "DISTRICT",
        field: "district",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CITY",
        field: "city",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "SUBJECTS",
        field: "subjects",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) =>
          Array.isArray(params.value) ? params.value.join(", ") : params.value,
      },
      {
        headerName: "CLASSES",
        field: "classes",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) =>
          Array.isArray(params.value) ? params.value.join(", ") : params.value,
      },
      {
        headerName: "TOTAL STUDENTS",
        field: "student_count",
        sortable: true,
        filter: "agNumberColumnFilter",
        width: 150,
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
        width: 150,
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link to={`/omr/view/${params.data.id}`}>
              <UilEye style={{ color: "#1230AE", cursor: "pointer" }} />
            </Link>
            <UilTrashAlt
              onClick={() => handleDelete(params.data.id)}
              style={{ color: "#FF8787", cursor: "pointer" }}
            />
            <span
              onClick={
                params.data.status === "Active"
                  ? () => handleDownload(params.data.id, params.data.school)
                  : undefined
              }
              style={{
                cursor: params.data.status === "Active" ? "pointer" : "not-allowed",
              }}
              title={
                params.data.status === "Inactive"
                  ? "Download disabled: Status is inactive"
                  : "Download PDF"
              }
            >
              <img
                src={
                  params.data.status === "Active"
                    ? activeDownload
                    : inActiveDownload
                }
                alt="Download"
                height="20px"
                width="20px"
              />
            </span>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  // Default column definitions
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      minWidth: 100,
    }),
    []
  );

  // Handle grid ready
  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.autoSizeAllColumns();
  };

  // Handle filter changes for global search
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

  // Handle row selection
  const onSelectionChanged = () => {
    const selectedRows = gridApiRef.current.getSelectedRows();
    const newSelection = {};
    selectedRows.forEach((row) => {
      newSelection[row.id] = true;
    });
    setRowSelection(newSelection);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

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
        <Breadcrumb data={[{ name: "OMR" }]} />
        <CreateButton link="/omr-create" />
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
                onSelectionChanged={onSelectionChanged}
                suppressRowClickSelection={true}
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
                  items per page
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
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Showing {records.length} of {totalRecords} items
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