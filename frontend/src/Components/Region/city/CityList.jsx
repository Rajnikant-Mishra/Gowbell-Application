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
// import "../../Common-Css/DeleteSwal.css";
// import "../../Common-Css/Swallfire.css";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [states, setStates] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   // Format timestamp
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

//   // Fetch cities
//   useEffect(() => {
//     const fetchCities = async () => {
//       if (
//         districts.length === 0 ||
//         states.length === 0 ||
//         countries.length === 0
//       )
//         return;

//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/cities/`, {
//           params: { page, limit: pageSize, search: searchTerm },
//         });

//         const { cities, totalRecords, totalPages, currentPage } = response.data;

//         const formattedData = await Promise.all(
//           cities.map(async (record) => {
//             const district = districts.find((d) => d.id === record.district_id);
//             const state = district
//               ? states.find((s) => s.id === district.state_id)
//               : null;
//             const country = state
//               ? countries.find((c) => c.id === state.country_id)
//               : null;

//             let userName = "Unknown";
//             if (record.created_by) {
//               try {
//                 const { data } = await axios.get(
//                   `${API_BASE_URL}/api/u1/users/${record.created_by}`
//                 );
//                 userName = data.username || "Unknown";
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
//               created_by: userName,
//               created_at: formatTimestamp(record.created_at),
//               updated_at: formatTimestamp(record.updated_at),
//             };
//           })
//         );

//         setRecords(formattedData);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error("Error fetching cities:", error);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: "Failed to fetch city data.",
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCities();
//   }, [districts, states, countries, page, pageSize, searchTerm]);

//   // Handle delete
//   // const handleDelete = (id) => {
//   //   Swal.fire({
//   //     title: "Are you sure?",
//   //     text: "You won't be able to revert this!",
//   //     showCancelButton: true,
//   //     confirmButtonColor: "#3085D6",
//   //     cancelButtonColor: "#d33",
//   //     confirmButtonText: "Yes, delete it!",
//   //     customClass: { popup: "custom-swal-popup" },
//   //   }).then((result) => {
//   //     if (result.isConfirmed) {
//   //       axios
//   //         .delete(`${API_BASE_URL}/api/cities/${id}`)
//   //         .then(() => {
//   //           setRecords((prev) => prev.filter((record) => record.id !== id));
//   //           setTotalRecords((prev) => prev - 1);
//   //           Swal.fire({
//   //             position: "top-end",
//   //             icon: "success",
//   //             title: "Success!",
//   //             text: "The city has been deleted.",
//   //             showConfirmButton: false,
//   //             timer: 1000,
//   //             timerProgressBar: true,
//   //             toast: true,
//   //             background: "#fff",
//   //             customClass: { popup: "small-swal" },
//   //           });
//   //         })
//   //         .catch((error) => {
//   //           console.error("Error deleting city:", error);
//   //           Swal.fire({
//   //             position: "top-end",
//   //             icon: "error",
//   //             title: "Error!",
//   //             text: "There was an issue deleting the city.",
//   //             showConfirmButton: false,
//   //             timer: 2000,
//   //             toast: true,
//   //             background: "#fff",
//   //             customClass: { popup: "small-swal" },
//   //           });
//   //         });
//   //     }
//   //   });
//   // };

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
//         const token = localStorage.getItem("token");
//         if (!token) {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Error!",
//             text: "Authentication token is missing.",
//             showConfirmButton: false,
//             timer: 1500,
//             timerProgressBar: true,
//             toast: true,
//             background: "#fff",
//             customClass: { popup: "small-swal" },
//           });
//           return;
//         }

//         axios
//           .delete(`${API_BASE_URL}/api/cities/${id}`, {
//             headers: { Authorization: `Bearer ${token}` }, // Added token here
//           })
//           .then(() => {
//             setRecords((prev) => prev.filter((record) => record.id !== id));
//             setTotalRecords((prev) => prev - 1);

//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The city has been deleted.",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting city:", error);
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text:
//                 error.response?.data?.error ||
//                 "There was an issue deleting the city.",
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

//   // Column definitions
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "COUNTRY",
//         field: "country_id",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed width
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value,
//       },
//       {
//         headerName: "STATE",
//         field: "state_id",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed width
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value,
//       },
//       {
//         headerName: "DISTRICT",
//         field: "district_id",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed width
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value,
//       },
//       {
//         headerName: "CITY",
//         field: "name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed width
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value,
//       },
//       {
//         headerName: "STATUS",
//         field: "status",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed width
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : params.value,
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed width
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : params.value,
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed width
//       },
//       {
//         headerName: "UPDATED AT",
//         field: "updated_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed width
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         // Removed width
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Link to={`/region/update/${params.data.id}`}>
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

//   // Default column definitions
//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       flex: 1, // Allow columns to stretch and fill available space
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
//   );

//   // Auto-size strategy for responsive columns
//   const autoSizeStrategy = useMemo(
//     () => ({
//       type: "fitGridWidth", // Automatically fit columns to the grid's width
//     }),
//     []
//   );

//   // Handle grid ready
//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.setAutoSizeStrategy(autoSizeStrategy); // Apply auto-size strategy
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

//       setSearchTerm(searchValue);
//       setPage(1);
//     }
//   };

//   // Handle pagination
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
//           <Breadcrumb data={[{ name: "Region Setup" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/region/create"} />
//         </div>
//       </div>
//       <div
//         style={{
//           background: "white",
//           padding: "1.5%",
//           borderRadius: "5px",
//           marginTop: "0",
//           width: "100%", // Ensure container takes full width
//         }}
//       >
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <div
//               className="ag-theme-alpine"
//               style={{ height: "500px", width: "100%" }} // Full width for grid
//             >
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 autoSizeStrategy={autoSizeStrategy} // Apply auto-size strategy
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
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
//                 <label style={{ fontFamily: "'Poppins', sans-serif" }}>
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: "'Poppins', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {totalRecords} records, Page {page} of {totalPages}
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
//                           fontFamily: '"Poppins", sans-serif',
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
  FaCaretDown,
  FaCaretUp,
  FaSearch,
} from "react-icons/fa";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";

import Mainlayout from "../../Layouts/Mainlayout";
import styles from "./../../CommonTable/DataTable.module.css";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";

import Checkbox from "@mui/material/Checkbox";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../CommonButton/CreateButton";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ column: "", direction: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const pageSizes = [10, 20, 50, 100];

  // Fetch supporting data
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/districts/`).then(res => setDistricts(res.data));
    axios.get(`${API_BASE_URL}/api/states/`).then(res => setStates(res.data));
    axios.get(`${API_BASE_URL}/api/countries/`).then(res => setCountries(res.data));
  }, []);

  // Fetch Cities
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cities/`, {
          params: { page, limit: pageSize },
        });

        const { cities } = response.data;

        const formattedData = await Promise.all(
          cities.map(async (record) => {
            const district = districts.find(d => d.id === record.district_id);
            const state = district ? states.find(s => s.id === district.state_id) : null;
            const country = state ? countries.find(c => c.id === state.country_id) : null;

            let userName = "Unknown";
            if (record.created_by) {
              try {
                const { data } = await axios.get(`${API_BASE_URL}/api/u1/users/${record.created_by}`);
                userName = data.username || "Unknown";
              } catch (e) {}
            }

            return {
              ...record,
              country_id: country?.name || "Unknown",
              state_id: state?.name || "Unknown",
              district_id: district?.name || "Unknown",
              created_by: userName,
              created_at: new Date(record.created_at).toLocaleString("en-GB"),
              updated_at: new Date(record.updated_at).toLocaleString("en-GB"),
            };
          })
        );

        setRecords(formattedData);
        setFilteredRecords(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (districts.length && states.length && countries.length) fetchCities();
  }, [districts, states, countries, page, pageSize]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#1230AE",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "custom-swal-popup" },
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        axios.delete(`${API_BASE_URL}/api/cities/${id}`, { headers: { Authorization: `Bearer ${token}` } })
          .then(() => {
            setRecords(prev => prev.filter(r => r.id !== id));
            setFilteredRecords(prev => prev.filter(r => r.id !== id));
            Swal.fire({ position: "top-end", icon: "success", title: "Deleted!", timer: 1000, toast: true });
          })
          .catch(() => Swal.fire("Error!", "Failed to delete.", "error"));
      }
    });
  };

  const handleFilter = (e, column) => {
    const value = e.target.value.toLowerCase();
    const filtered = records.filter(row => 
      (row[column] || "").toString().toLowerCase().includes(value)
    );
    setFilteredRecords(filtered);
    setPage(1);
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column) direction = sortConfig.direction === "asc" ? "desc" : "asc";

    const sortedData = [...filteredRecords].sort((a, b) => {
      const valA = a[column], valB = b[column];
      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return direction === "asc" ? valA - valB : valB - valA;
    });

    setFilteredRecords(sortedData);
    setSortConfig({ column, direction });
  };

  const getSortIcon = (column) => {
    const isActive = sortConfig.column === column;
    const isAsc = sortConfig.direction === "asc";
    return (
      <div className={styles.sortIconsContainer}>
        <FaCaretUp className={`${styles.sortIcon} ${isActive && isAsc ? styles.activeSortIcon : ""}`} onClick={(e) => { e.stopPropagation(); handleSort(column); }} />
        <FaCaretDown className={`${styles.sortIcon} ${isActive && !isAsc ? styles.activeSortIcon : ""}`} onClick={(e) => { e.stopPropagation(); handleSort(column); }} />
      </div>
    );
  };

  const currentRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Region Setup" }]} />
        <CreateButton link="/region/create" />
      </div>

      <div className={`${styles.tablecont} mt-0`}>
        <table className={`${styles.table}`} style={{ fontFamily: "Nunito, sans-serif" }}>
          <thead>
            <tr className={styles.headerRow}>
              <th><Checkbox /></th>
              {["country_id", "state_id", "district_id", "name", "status", "created_by", "created_at", "updated_at"].map((col) => (
                <th
                  key={col}
                  className={styles.sortableHeader}
                  onClick={() => handleSort(col)}
                  style={{ cursor: "pointer", backgroundColor: "#f0f4ff" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ textTransform: "capitalize" }}>
                      {col.replace("_id", "").replace("_", " ")}
                    </span>
                    {getSortIcon(col)}
                  </div>
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>

          <tr className={styles.filterRow}>
            <th></th>
            {["country_id", "state_id", "district_id", "name", "status", "created_by", "created_at", "updated_at"].map((col) => (
              <th key={col}>
                <div className={styles.inputContainer}>
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder={`Search ${col.replace("_id", "").replace("_", " ")}`}
                    onChange={(e) => handleFilter(e, col)}
                    className={styles.filterInput}
                  />
                </div>
              </th>
            ))}
            <th></th>
          </tr>

          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ textAlign: "center", padding: "50px", color: "#666" }}>Loading...</td></tr>
            ) : (
              currentRecords.map((row) => (
                <tr key={row.id} className={styles.dataRow}>
                  <td><Checkbox /></td>
                  <td>{row.country_id}</td>
                  <td>{row.state_id}</td>
                  <td>{row.district_id}</td>
                  <td>{row.name}</td>
                  <td>{row.status}</td>
                  <td>{row.created_by}</td>
                  <td style={{ color: "#0d6efd", fontWeight: "500" }}>{row.created_at}</td>   {/* ← Colored Created At */}
                  <td style={{ color: "#6c757d" }}>{row.updated_at}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link to={`/region/update/${row.id}`}>
                        <UilEditAlt style={{ color: "#1230AE", fontSize: "18px", cursor: "pointer" }} />
                      </Link>
                      <UilTrashAlt
                        onClick={() => handleDelete(row.id)}
                        style={{ color: "#FF5252", fontSize: "18px", cursor: "pointer" }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between flex-wrap mt-3 align-items-center">
          <div className={`${styles.pageSizeSelector} d-flex align-items-center`}>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }}
              className={styles.pageSizeSelect}
            >
              {pageSizes.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
            <span className="ms-2 text-secondary">data per Page</span>
          </div>

          <div className="text-secondary">
            {filteredRecords.length} of {page} - {Math.ceil(filteredRecords.length / pageSize)}
          </div>

          <div className={`${styles.pagination} my-auto`}>
            <button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1} className={styles.paginationButton}>
              <UilAngleLeftB />
            </button>

            {Array.from({ length: Math.ceil(filteredRecords.length / pageSize) }, (_, i) => i + 1)
              .filter(pg => pg === 1 || pg === Math.ceil(filteredRecords.length / pageSize) || Math.abs(pg - page) <= 2)
              .map((pg) => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`${styles.paginationButton} ${page === pg ? styles.activePage : ""}`}
                >
                  {pg}
                </button>
              ))}

            <button onClick={() => page < Math.ceil(filteredRecords.length / pageSize) && setPage(page + 1)} disabled={page === Math.ceil(filteredRecords.length / pageSize)} className={styles.paginationButton}>
              <UilAngleRightB />
            </button>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}