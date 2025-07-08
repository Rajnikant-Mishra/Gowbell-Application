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

// import Mainlayout from "../Layouts/Mainlayout";
// import styles from "./../CommonTable/DataTable.module.css";
// // import "../../Common-Css/DeleteSwal.css";
// import "../Common-Css/Swallfire.css";
// import Checkbox from "@mui/material/Checkbox";
// import ButtonComp from "../CommonButton/ButtonComp";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import CreateButton from "../CommonButton/CreateButton";

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
//       .get(`${API_BASE_URL}/api/r1/role`)
//       .then((response) => {
//         const formattedData = response.data.map((record) => ({
//           ...record,
//           created_at: formatTimestamp(record.created_at),
//           // updated_at: formatTimestamp(record.updated_at),
//         }));

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
//           .delete(`${API_BASE_URL}/api/r1/role/${id}`)
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
//               text: `The role has been deleted.`,
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
//             console.error("Error deleting:", error);
//             // Show an error alert if deletion fails
//             Swal.fire("Error!", "There was an issue deleting.", "error");
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
//           <Breadcrumb data={[{ name: "Role" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/role"} />
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
//               {["id", "name", "Crud Permission", "created_at"].map((col) => (
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
//             {["id", "name", "Crud Permission", "created_at"].map((col) => (
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
//                 <td>{row.id}</td>
//                 <td>{row.role_name}</td>
//                 <td>
//                   {row.permissions.includes("UilEditAlt") && (
//                     <span style={{ color: "blue" }}>Edit</span>
//                   )}
//                   {row.permissions.includes("UilEditAlt") &&
//                     row.permissions.includes("UilTrashAlt") &&
//                     ", "}
//                   {row.permissions.includes("UilTrashAlt") && (
//                     <span style={{ color: "red" }}>Delete</span>
//                   )}
//                 </td>

//                 <td>{row.created_at}</td>

//                 <td>
//                   <div className={styles.actionButtons}>
//                     <Link to={`/role/update/${row.id}`}>
//                       <UilEditAlt className={styles.FaEdit} />
//                     </Link>
//                     {/* <UilTrashAlt
//                       onClick={() => handleDelete(row.id)}
//                       className={`${styles.FaTrash}`}
//                     /> */}
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



import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UilTrashAlt, UilEditAlt, UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "../CommonButton/Breadcrumb";
import CreateButton from "../CommonButton/CreateButton";
import { API_BASE_URL } from "../ApiConfig/APIConfig";

export default function Role() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const gridApiRef = useRef(null);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/r1/role`);
        const formattedData = response.data.map((record) => ({
          ...record,
          created_at: formatTimestamp(record.created_at),
        }));
        setRecords(formattedData);
      } catch (error) {
        console.error("Error fetching role data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Failed to fetch role data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } finally {
        setLoading(false);
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
      customClass: { popup: "custom-swal-popup" },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/api/r1/role/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The role has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting role:", error);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text: "There was an issue deleting the role.",
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

  const columnDefs = useMemo(
    () => [

      {
        headerName: "ID",
        field: "id",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "ROLE NAME",
        field: "role_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
            : params.value,
      },
      {
        headerName: "CRUD PERMISSION",
        field: "permissions",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) => {
          const perms = params.value || [];
          const permStrings = [];
          if (perms.includes("UilEditAlt")) permStrings.push("Edit");
          if (perms.includes("UilTrashAlt")) permStrings.push("Delete");
          return permStrings.join(", ") || "None";
        },
      },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 180,
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
            <Link to={`/role/update/${params.data.id}`}>
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
    []
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

      const filteredData = records.filter((row) =>
        Object.values(row).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      gridApiRef.current.setRowData(filteredData);
      setPage(1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < Math.ceil(records.length / pageSize)) setPage(page + 1);
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

  const currentRecords = records.slice((page - 1) * pageSize, page * pageSize);

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
          <Breadcrumb data={[{ name: "Role" }]} />
        </div>
        <div>
          <CreateButton link="/role" />
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
                rowData={currentRecords}
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
                    {records.length} of {page}-{Math.ceil(records.length / pageSize)}
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
                {Array.from(
                  { length: Math.ceil(records.length / pageSize) },
                  (_, i) => i + 1
                )
                  .filter(
                    (pg) =>
                      pg === 1 ||
                      pg === Math.ceil(records.length / pageSize) ||
                      Math.abs(pg - page) <= 2
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
                  disabled={page === Math.ceil(records.length / pageSize)}
                  style={{
                    backgroundColor:
                      page === Math.ceil(records.length / pageSize)
                        ? "#E0E0E0"
                        : "#F5F5F5",
                    color:
                      page === Math.ceil(records.length / pageSize)
                        ? "#aaa"
                        : "#333",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                    padding: "3px 3.5px",
                    width: "33px",
                    height: "30px",
                    cursor:
                      page === Math.ceil(records.length / pageSize)
                        ? "not-allowed"
                        : "pointer",
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