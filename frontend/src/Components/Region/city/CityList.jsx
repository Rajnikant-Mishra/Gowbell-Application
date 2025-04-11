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

//   const [districts, setDistricts] = useState([]);
//   const [states, setStates] = useState([]);
//   const [countries, setCountries] = useState([]);

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

//   // Fetch districts
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/districts/`)
//       .then((response) => {
//         setDistricts(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching districts!", error);
//       });
//   }, []);

//   // Fetch states
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/states/`)
//       .then((response) => {
//         setStates(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching states!", error);
//       });
//   }, []);

//   // Fetch countries
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/countries/`)
//       .then((response) => {
//         setCountries(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching countries!", error);
//       });
//   }, []);

//   useEffect(() => {
//     let { page = 1, limit = 10 } = pagination; // Assuming you have a pagination state
//     axios
//       .get(`${API_BASE_URL}/api/cities?page=${page}&limit=${limit}`)
//       .then(async (response) => {
//         const { data, totalCities, totalPages } = response.data; // Ensure backend returns pagination data

//         const formattedData = await Promise.all(
//           data.map(async (record) => {
//             const district = districts.find((d) => d.id === record.district_id);
//             const state = states.find((s) => s.id === district?.state_id);
//             const country = countries.find((c) => c.id === state?.country_id);

//             // Fetch user data based on created_by ID
//             let userName = "Unknown";
//             if (record.created_by) {
//               try {
//                 const userResponse = await axios.get(
//                   `${API_BASE_URL}/api/u1/users/${record.created_by}`
//                 );
//                 userName = userResponse.data.username || "Unknown";
//               } catch (error) {
//                 console.error(
//                   `Error fetching user ${record.created_by}`,
//                   error
//                 );
//               }
//             }

//             return {
//               ...record,
//               district_id: district?.name || "Unknown",
//               state_id: state?.name || "Unknown",
//               country_id: country?.name || "Unknown",
//               created_by: userName, // Show username instead of ID
//               created_at: formatTimestamp(record.created_at),
//               updated_at: formatTimestamp(record.updated_at),
//             };
//           })
//         );

//         setRecords(formattedData);
//         setFilteredRecords(formattedData);
//         setPagination({ ...pagination, totalCities, totalPages }); // Update pagination state
//       })
//       .catch((error) => {
//         console.error("Error fetching cities!", error);
//       });
//   }, [districts, states, countries, pagination.page, pagination.limit]); // Re-run when pagination changes

//   const handlePreviousPage = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
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
//           .delete(`${API_BASE_URL}/api/cities/${id}`)
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
//               text: `The city has been deleted.`,
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

//   // Handle filtering
//   const handleFilter = (event, column) => {
//     const value = event.target.value.toLowerCase();
//     const filtered = records.filter((row) =>
//       (row[column] || "").toString().toLowerCase().includes(value)
//     );
//     setFilteredRecords(filtered);
//     setPage(1);
//   };

//   // Handle sorting
//   const handleSort = (column) => {
//     let direction = "asc";
//     if (sortConfig.column === column) {
//       direction = sortConfig.direction === "asc" ? "desc" : "asc";
//     }

//     const sortedData = [...filteredRecords].sort((a, b) => {
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
//           <Breadcrumb data={[{ name: "Region Setup" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/city/create"} />
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
//                 "country",
//                 "state",
//                 "district",
//                 "city",
//                 "status",
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
//               "country",
//               "state",
//               "district",
//               "city",
//               "status",
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
//                 <td>{row.country_id}</td>
//                 <td>{row.state_id}</td>
//                 <td>{row.district_id}</td>
//                 <td>{row.name}</td>

//                 <td>{row.status}</td>
//                 <td>{row.created_by}</td>
//                 <td>{row.created_at}</td>
//                 <td>{row.updated_at}</td>

//                 <td>
//                   <div className={styles.actionButtons}>
//                     {/* <FaEdit Link to={`/update/${row.id}`} className={`${styles.FaEdit}`} /> */}
//                     <Link to={`/city/update/${row.id}`}>
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

import React, { useEffect, useState } from "react";
import {
  FaCaretDown,
  FaCaretUp,
  FaEdit,
  FaTrash,
  FaSearch,
  FaHome,
  FaPlus,
} from "react-icons/fa";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";

import Mainlayout from "../../Layouts/Mainlayout";
import styles from "./../../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import ButtonComp from "../../CommonButton/ButtonComp";
import { Breadcrumbs } from "@mui/material";
import { styled, emphasize } from "@mui/material/styles";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";
import CreateButton from "../../CommonButton/CreateButton";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCities: 0,
    totalPages: 0,
  });

  const pageSizes = [10, 20, 50, 100];
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [totalCities, setTotalCities] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  // Fetch districts
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/districts/`)
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching districts!", error);
      });
  }, []);

  // Fetch states
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/states/`)
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching states!", error);
      });
  }, []);

  // Fetch countries
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/countries/`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries!", error);
      });
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cities/`, {
          params: {
            page: pagination.page,
            limit: pagination.limit,
          },
        });
  
        const {
          cities,
          currentPage,
          nextPage,
          prevPage,
          totalPages,
          totalRecords,
        } = response.data;
  
        const formattedData = await Promise.all(
          cities.map(async (record) => {
            const district = districts.find((d) => d.id === record.district_id);
            const state = district ? states.find((s) => s.id === district.state_id) : null;
            const country = state ? countries.find((c) => c.id === state.country_id) : null;
  
            // Fetch username for created_by
            let userName = "Unknown";
            if (record.created_by) {
              try {
                const { data } = await axios.get(`${API_BASE_URL}/api/u1/users/${record.created_by}`);
                userName = data.username || "Unknown";
              } catch (error) {
                console.error(`Error fetching user ${record.created_by}`, error);
              }
            }
  
            return {
              ...record,
              district_id: district?.name || "Unknown",
              state_id: state?.name || "Unknown",
              country_id: country?.name || "Unknown",
              created_by: userName,
              created_at: formatTimestamp(record.created_at),
              updated_at: formatTimestamp(record.updated_at),
            };
          })
        );
  
        // **Update state correctly**
        setCities(formattedData);
        setRecords(formattedData);
        setFilteredRecords(formattedData);
        setTotalCities(totalRecords);
        setTotalPages(totalPages);
        setNextPage(nextPage);
        setPrevPage(prevPage);
        setPagination((prev) => ({ ...prev, page: currentPage }));
      } catch (error) {
        console.error("Error fetching cities!", error);
      }
    };
  
    if (districts.length > 0 && states.length > 0 && countries.length > 0) {
      fetchCities();
    }
  }, [districts, states, countries, pagination.page, pagination.limit]);
  

  const handleNextPage = () => {
    if (nextPage) {
      setPagination((prev) => ({ ...prev, page: nextPage }));
    }
  };

  const handlePreviousPage = () => {
    if (prevPage) {
      setPagination((prev) => ({ ...prev, page: prevPage }));
    }
  };

  const handleDelete = (id) => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "custom-swal-popup", // Add custom class to the popup
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the delete request
        axios
          .delete(`${API_BASE_URL}/api/cities/${id}`)
          .then((response) => {
            // Update the state after successful deletion
            setRecords((prevCountries) =>
              prevCountries.filter((country) => country.id !== id)
            );
            setFilteredRecords((prevFiltered) =>
              prevFiltered.filter((country) => country.id !== id)
            );

            // delete Show a success alert
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: `The city has been deleted.`,
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
            console.error("Error deleting country:", error);
            // Show an error alert if deletion fails
            Swal.fire(
              "Error!",
              "There was an issue deleting the country.",
              "error"
            );
          });
      }
    });
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

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "Region Setup" }]} />
        </div>
        <div>
          <CreateButton link={"/region/create"} />
        </div>
      </div>
      <div className={`${styles.tablecont} mt-0`}>
        <table
          className={`${styles.table} `}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <thead>
            <tr className={`${styles.headerRow} pt-0 pb-0`}>
              <th>
                <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
              </th>
              {[
                "country",
                "state",
                "district",
                "city",
                "status",
                "created_by",
                "created_at",
                "updated_at",
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
              <th>Action</th>
            </tr>
          </thead>
          <tr
            className={styles.filterRow}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
            {[
              "country",
              "state",
              "district",
              "city",
              "status",
              "created_by",
              "created_at",
              "updated_at",
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
            {cities.map((row) => (
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
                <td>{row.country_id}</td>
                <td>{row.state_id}</td>
                <td>{row.district_id}</td>
                <td>{row.name}</td>

                <td>{row.status}</td>
                <td>{row.created_by}</td>
                <td>{row.created_at}</td>
                <td>{row.updated_at}</td>

                <td>
                  <div className={styles.actionButtons}>
                    {/* <FaEdit Link to={`/update/${row.id}`} className={`${styles.FaEdit}`} /> */}
                    <Link to={`/city/update/${row.id}`}>
                      <UilEditAlt className={styles.FaEdit} />
                    </Link>
                    <UilTrashAlt
                      onClick={() => handleDelete(row.id)}
                      className={`${styles.FaTrash}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between flex-wrap mt-2">
          {/* Page Size Selector */}
          <div
            className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
          >
            <select
              value={pagination.limit}
              onChange={(e) => {
                setPagination((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value, 10),
                  page: 1,
                }));
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

          {/* Total Records Display */}
          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <label
              htmlFor="pageSize"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <p className="my-auto text-secondary">
                {totalCities} records, Page {currentPage} of {totalPages}
              </p>
            </label>
          </div>

          {/* Pagination Navigation */}
          <div className={`${styles.pagination} my-auto`}>
            {/* Previous Page Button */}
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
                  Math.abs(pg - pagination.page) <= 2
              )
              .map((pg, index, array) => (
                <React.Fragment key={pg}>
                  {index > 0 && pg > array[index - 1] + 1 && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                  <button
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: pg }))
                    }
                    className={`${styles.paginationButton} ${
                      pagination.page === pg ? styles.activePage : ""
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
