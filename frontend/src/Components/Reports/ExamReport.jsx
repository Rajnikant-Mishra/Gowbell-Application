// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import Mainlayout from "../Layouts/Mainlayout";
// import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
// import ReactPaginate from "react-paginate";
// import "font-awesome/css/font-awesome.min.css";
// import styles from "../CommonTable/DataTable.module.css"; // Make sure you have this file

// export default function DataTable() {
//   const [records, setRecords] = useState([]); // Holds all records
//   const [filteredRecords, setFilteredRecords] = useState([]); // Holds filtered records
//   const [filters, setFilters] = useState({
//     subject: "",

//     // board: "",
//     // name: "",
//     // school_email: "",
//     // school_contact_number: "",
//     // state: "",
//     // district: "",
//     // city: "",
//     // pincode: "",
//   }); // Stores the values of filters per column

//   // Pagination States
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     // Fetch data from the API when the component mounts
//     axios
//       .get(`${API_BASE_URL}/api/all-results`) // Your API URL here
//       .then((response) => {
//         setRecords(response.data);
//         setFilteredRecords(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the records!", error);
//       });
//   }, []);

//   // Filter the records based on the filters
//   useEffect(() => {
//     if (!Array.isArray(records.students)) {
//       console.warn("Records is not an array:", records);
//       return;
//     }
//     const filtered = records.students.filter((row) => {
//       return Object.keys(filters).every((column) => {
//         const filterValue = filters[column].toLowerCase().trim();

//         if (!filterValue) return true; // Skip empty filters

//         return row[column]
//           ? row[column].toString().toLowerCase().includes(filterValue)
//           : false;
//       });
//     });

//     setFilteredRecords(filtered);
//   }, [filters, records]);

//   // Handle filter input change
//   const handleFilterChange = (e, column) => {
//     setFilters({
//       ...filters,
//       [column]: e.target.value,
//     });
//   };

//   // Handle page changes
//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   const handlePageSizeChange = (e) => {
//     setPageSize(parseInt(e.target.value, 10));
//     setCurrentPage(0); // Reset to first page when page size changes
//   };

//   // Get current records based on pagination
//   const currentRecords = Array.isArray(filteredRecords)
//     ? filteredRecords.slice(
//         currentPage * pageSize,
//         (currentPage + 1) * pageSize
//       )
//     : [];

//   const searchContainer = {
//     position: "relative",
//     display: "inline-block",
//   };

//   // Mapping of column keys to user-friendly names
//   const columnHeaders = {
//     student_name: "name",
//     class: "class",
//     roll_no: "roll",
//     full_mark: "fullmark",
//     mark_secured: "marksecured",
//     percentage: "percentage",
//     medals: "medals",
//     certificate: "certificate",
//     level: "level",
//     subject: "subject",
//     remarks: "remarks",
//   };
//   return (
//     <Mainlayout>
//       <div className="data-filter d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[{ name: "Exam Report", link: "/school-list" }]} // Adjusted link
//           />
//         </div>
//       </div>

//       {/* Table displaying filtered records */}
//       <div className="table-responsive bg-white p-3 rounded shadow-sm">
//         <table className="table table-bordered table-hover">
//           <thead className="table-light">
//             <tr>
//               {/* Table headers with dynamic names */}
//               {Object.keys(columnHeaders).map((col) => (
//                 <th
//                   key={col}
//                   style={{
//                     padding: "8px",
//                     textAlign: "left",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   {columnHeaders[col]} {/* User-friendly column names */}
//                   <div
//                     className="line-container"
//                     style={{
//                       border: "none",
//                       height: "6px",
//                       background:
//                         "linear-gradient(to right,rgb(255, 255, 255),rgba(99, 159, 161, 0.44))",
//                       borderRadius: "5px",
//                       width: "100%",
//                       margin: "5px auto",
//                       padding: "0px",
//                     }}
//                   >
//                     <hr className="gradient-line" />
//                   </div>
//                   {/* Filter input for each column */}
//                   <div className="d-flex flex-column" style={searchContainer}>
//                     <input
//                       type="text"
//                       placeholder={columnHeaders[col]}
//                       value={filters[col]}
//                       className="form-control"
//                       onChange={(e) => handleFilterChange(e, col)} // Filter update per column
//                       style={{
//                         margin: "3px 6px 3px 2px",
//                         padding: "5px",
//                         width: "100%", // You can adjust width to suit the design
//                         border: "1px solid #ddd",
//                         borderRadius: "4px",
//                         fontSize: "6px",
//                       }}
//                     />
//                     <span
//                       className="bi bi-search search-icon"
//                       style={{
//                         position: "absolute",
//                         top: "50%",
//                         right: "10px",
//                         transform: "translateY(-50%)",
//                         fontSize: "14px",
//                         // backgroundColor: '#ADD8E6',
//                         padding: "4.7px",
//                         marginRight: "-11px",
//                         // borderRadius: '4px',
//                         color: "gray",
//                         // borderEndEndRadius: '4px',
//                         // borderTopRightRadius: '4px',
//                         borderLeft: " 1px solid #ddd",
//                       }}
//                     ></span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="table-data">
//             {currentRecords.length > 0 ? (
//               currentRecords.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.student_name}</td>
//                   <td>{row.class}</td>
//                   <td>{row.roll_no}</td>
//                   <td>{row.full_mark}</td>
//                   <td>{row.mark_secured}</td>
//                   <td>{row.percentage}</td>
//                   <td>{row.medals}</td>
//                   <td>{row.certificate}</td>
//                   <td>{row.level}</td>
//                   <td>{row.subject}</td>
//                   <td>{row.remarks}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" style={{ textAlign: "center" }}>
//                   No records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Show Total Records */}
//         <div
//           className={`${styles.totalRecordsInfo} d-flex justify-content-between align-items-center flex-wrap mt-2`}
//         >
//           {/* Left Side - Page Size Selector */}
//           <div
//             className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//           >
//             <select
//               value={pageSize}
//               onChange={handlePageSizeChange}
//               className={styles.pageSizeSelector}
//             >
//               {[10, 20, 50, 100].map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//             <p className="my-auto text-secondary">data per Page</p>
//           </div>

//           {/* Middle - Total Records Info */}
//           <span className="text-center flex-grow-1 text-md-center">
//             Showing {currentRecords.length} of {filteredRecords.length} records
//           </span>

//           {/* Right Side - Pagination */}
//           <div className={styles.pagination}>
//             <ReactPaginate
//               previousLabel={<i className="fa fa-chevron-left"></i>}
//               nextLabel={<i className="fa fa-chevron-right"></i>}
//               breakLabel={"..."}
//               pageCount={Math.ceil(filteredRecords.length / pageSize)}
//               marginPagesDisplayed={2}
//               pageRangeDisplayed={5}
//               onPageChange={handlePageClick}
//               containerClassName={styles.paginationContainer}
//               activeClassName={styles.activePage}
//               disabledClassName={styles.disabledPage}
//             />
//           </div>
//         </div>
//       </div>
//     </Mainlayout>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
// import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
// import Mainlayout from "../Layouts/Mainlayout";
// import styles from "./../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import axios from "axios";
// import { Menu, MenuItem, Button, Box } from "@mui/material";
// import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";

// export default function StudentReport() {
//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     column: "",
//     direction: "asc",
//   });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const pageSizes = [10, 20, 50, 100];

//   useEffect(() => {
//     // Fetch data from the API when the component mounts
//     axios
//       .get(`${API_BASE_URL}/api/all-results`) // Your API URL here
//       .then((response) => {
//         setRecords(response.data);
//         setFilteredRecords(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the records!", error);
//       });
//   }, []);

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

//   const currentRecords = (
//     Array.isArray(filteredRecords) ? filteredRecords : []
//   ).slice((page - 1) * pageSize, page * pageSize);

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

//   function handleClick(event) {
//     event.preventDefault();
//     console.info("You clicked a breadcrumb.");
//   }

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
//     if (
//       Array.isArray(filteredRecords) &&
//       filteredRecords.every((row) => checkedRows[row.id])
//     ) {
//       setIsAllChecked(true);
//     } else {
//       setIsAllChecked(false);
//     }
//   }, [checkedRows, filteredRecords]);

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "Exams Report" }]} />
//         </div>
//         <div className="d-flex justify-content-end">
//           <div
//             role="presentation"
//             onClick={handleClick}
//             className={`${styles.breadcrumb} my-1`}
//           ></div>
//         </div>
//       </div>

//       <div className={`${styles.tablecont} mt-3`}>
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
//                 "Student",
//                 "Class",
//                 "Subject",
//                 "Roll No",
//                 "Full Mark",
//                 "Mark Secured",
//                 "Percentage",
//                 "Ranking",
//                 "Remarks",
//                 "Medal",
//                 "Certificate",
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
//               {/* <th>Action</th> */}
//             </tr>
//           </thead>
//           <tr
//             className={styles.filterRow}
//             style={{ fontFamily: "Nunito, sans-serif" }}
//           >
//             <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
//             {[
//               "Student",
//               "Class",
//               "Subject",
//               "Roll No",
//               "Full Mark",
//               "Mark Secured",
//               "Percentage",
//               "Ranking",
//               "Remarks",
//               "Medal",
//               "Certificate",
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
//                 <td>{row.student_name}</td>
//                 <td>{row.class_name}</td>
//                 <td>{row.student_subject}</td>
//                 <td>{row.roll_no }</td>
//                 <td>{row.full_mark}</td>
//                 <td>{row.mark_secured}</td>
//                 <td>{row.percentage}</td>
//                 <td>{row.ranking}</td>
//                 <td>{row.remarks}</td>
//                 <td>{row.medals}</td>
//                 <td>{row.certificate}</td>
                
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* pagination */}
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


import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";
import Button from "@mui/material/Button";
import Mainlayout from "../Layouts/Mainlayout";
import styles from "../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import CreateButton from "../../Components/CommonButton/CreateButton";
import { Menu } from "@mui/material";
import excelImg from "../../../public/excell-img.png";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false); // Reused for API call

  // Fetch paginated data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/all-results`, {
          params: { page: currentPage, limit: pageSize },
        });
        const { students, totalRecords, totalPages, nextPage, prevPage } =
          response.data;

        setStudents(students);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      } catch (error) {
        console.error("Error fetching student data:", error);
        Swal.fire("Error", "Failed to fetch student data.", "error");
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

 

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

 
  // Handle filtering
  const handleFilter = (event, column) => {
    const value = event.target.value.toLowerCase();
    const filtered = records.filter((row) =>
      (row[column] || "").toString().toLowerCase().includes(value)
    );
    setFilteredRecords(filtered);
    setPage(1);
  };

  // Handle sorting
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    const sortedData = [...filteredRecords].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
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
          className={`${styles.sortIcon} ${
            isActive && isAsc ? styles.activeSortIcon : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSort(column);
          }}
        />
        <FaCaretDown
          className={`${styles.sortIcon} ${
            isActive && !isAsc ? styles.activeSortIcon : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSort(column);
          }}
        />
      </div>
    );
  };

  const handleRowCheck = (id) => {
    setCheckedRows((prevCheckedRows) => {
      const newCheckedRows = { ...prevCheckedRows };
      if (newCheckedRows[id]) {
        delete newCheckedRows[id]; // Uncheck
      } else {
        newCheckedRows[id] = true; // Check
      }
      return newCheckedRows;
    });
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedRows({}); // Uncheck all rows
    } else {
      const allChecked = filteredRecords.reduce((acc, row) => {
        acc[row.id] = true; // Check all rows
        return acc;
      }, {});
      setCheckedRows(allChecked);
    }
    setIsAllChecked(!isAllChecked);
  };

  useEffect(() => {
    if (filteredRecords.every((row) => checkedRows[row.id])) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [checkedRows, filteredRecords]);

  const navigate = useNavigate();









  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "Exams Report" }]} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "auto",
            gap: "10px",
          }}
        >
        </div>
      </div>
      <div className={`${styles.tablecont} mt-0`}>
        <table
          className={`${styles.table}`}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <thead>
            <tr className={`${styles.headerRow} pt-0 pb-0`}>
              <th>
                <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
              </th>
              {[
                "School",
                "Student",
                "Class",
                "subject",
                "Roll No",
                "Full Mark",
                "Mark Secured",
                "level",
              ].map((col) => (
                <th
                  key={col}
                  className={styles.sortableHeader}
                  onClick={() => handleSort(col)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                    {getSortIcon(col)}
                  </div>
                </th>
              ))}
              
            </tr>
          </thead>
          <tr
            className={styles.filterRow}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
            {[
              "School",
              "Student",
              "Class",
              "subject",
              "Roll No",
              "Full Mark",
              "Mark Secured",
              "level",
            ].map((col) => (
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
          <tbody>
            {students.map((row) => (
              <tr
                key={row.id}
                className={styles.dataRow}
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                <td>
                  <Checkbox
                    checked={!!checkedRows[row.id]}
                    onChange={() => handleRowCheck(row.id)}
                  />
                </td>
                <td>{row.school_name}</td>
                <td>{row.student_name}</td>
                <td>{row.class_id}</td>
                <td>{row.subject_id}</td>
                <td>{row.roll_no}</td>
                <td>{row.full_mark}</td>
                <td>{row.mark_secured}</td>

                <td>{row.level}</td>

                
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between flex-wrap mt-2">
          <div
            className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
          >
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
              className={styles.pageSizeSelect}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <p className="my-auto text-secondary">data per Page</p>
          </div>

          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <label
              htmlFor="pageSize"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <p className="my-auto text-secondary">
                {totalRecords} records, Page {currentPage} of {totalPages}
              </p>
            </label>
          </div>

          <div className={`${styles.pagination} my-auto`}>
            <button
              onClick={handlePreviousPage}
              disabled={!prevPage}
              className={styles.paginationButton}
            >
              <UilAngleLeftB />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (pg) =>
                  pg === 1 ||
                  pg === totalPages ||
                  Math.abs(pg - currentPage) <= 2
              )
              .map((pg, index, array) => (
                <React.Fragment key={pg}>
                  {index > 0 && pg > array[index - 1] + 1 && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(pg)}
                    className={`${styles.paginationButton} ${
                      currentPage === pg ? styles.activePage : ""
                    }`}
                  >
                    {pg}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={handleNextPage}
              disabled={!nextPage}
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
