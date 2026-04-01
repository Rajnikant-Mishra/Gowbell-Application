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
// import { Link } from "react-router-dom";
// import Mainlayout from "../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import CreateButton from "../CommonButton/CreateButton";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";

// export default function Role() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const gridApiRef = useRef(null);
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
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/r1/role`);
//         const formattedData = response.data.map((record) => ({
//           ...record,
//           created_at: formatTimestamp(record.created_at),
//         }));
//         setRecords(formattedData);
//       } catch (error) {
//         console.error("Error fetching role data:", error);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: "Failed to fetch role data.",
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//       } finally {
//         setLoading(false);
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
//       customClass: { popup: "custom-swal-popup" },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${API_BASE_URL}/api/r1/role/${id}`)
//           .then(() => {
//             setRecords((prev) => prev.filter((record) => record.id !== id));
//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The role has been deleted.",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting role:", error);
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text: "There was an issue deleting the role.",
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

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "ID",
//         field: "id",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//       },
//       {
//         headerName: "ROLE NAME",
//         field: "role_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 450,
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : params.value,
//       },
//       {
//         headerName: "CRUD PERMISSION",
//         field: "permissions",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 450,
//         valueFormatter: (params) => {
//           const perms = params.value || [];
//           const permStrings = [];
//           if (perms.includes("UilEditAlt")) permStrings.push("Edit");
//           if (perms.includes("UilTrashAlt")) permStrings.push("Delete");
//           return permStrings.join(", ") || "None";
//         },
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 450,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         width: 200,
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Link to={`/role/update/${params.data.id}`}>
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
//     [],
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       suppressFilterResetOnColumnChange: true,
//     }),
//     [],
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

//       const filteredData = records.filter((row) =>
//         Object.values(row).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchValue.toLowerCase()),
//         ),
//       );
//       gridApiRef.current.setRowData(filteredData);
//       setPage(1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < Math.ceil(records.length / pageSize)) setPage(page + 1);
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

//   const currentRecords = records.slice((page - 1) * pageSize, page * pageSize);

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
//           <Breadcrumb data={[{ name: "Role" }]} />
//         </div>
//         <div>
//           <CreateButton link="/role" />
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
//                 rowData={currentRecords}
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
//                     {records.length} of {page}-
//                     {Math.ceil(records.length / pageSize)}
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
//                 {Array.from(
//                   { length: Math.ceil(records.length / pageSize) },
//                   (_, i) => i + 1,
//                 )
//                   .filter(
//                     (pg) =>
//                       pg === 1 ||
//                       pg === Math.ceil(records.length / pageSize) ||
//                       Math.abs(pg - page) <= 2,
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
//                   disabled={page === Math.ceil(records.length / pageSize)}
//                   style={{
//                     backgroundColor:
//                       page === Math.ceil(records.length / pageSize)
//                         ? "#E0E0E0"
//                         : "#F5F5F5",
//                     color:
//                       page === Math.ceil(records.length / pageSize)
//                         ? "#aaa"
//                         : "#333",
//                     border: "1px solid #ccc",
//                     borderRadius: "7px",
//                     padding: "3px 3.5px",
//                     width: "33px",
//                     height: "30px",
//                     cursor:
//                       page === Math.ceil(records.length / pageSize)
//                         ? "not-allowed"
//                         : "pointer",
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





import React, { useEffect, useState } from "react";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilSearch,
  UilTimes,
} from "@iconscout/react-unicons";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";

import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Breadcrumb from "../CommonButton/Breadcrumb";
import CreateButton from "../CommonButton/CreateButton";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/DeleteSwal.css";
import "../Common-Css/Swallfire.css";

export default function Role() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // Missing states that caused the error + checkbox support
  const [searchTerm, setSearchTerm] = useState("");          // ← This fixes your ReferenceError
  const [checkedRows, setCheckedRows] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);

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
      icon: "warning",
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

  // Checkbox handlers
  const handleRowCheck = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedRows({});
      setIsAllChecked(false);
    } else {
      const all = {};
      records.forEach((row) => (all[row.id] = true));
      setCheckedRows(all);
      setIsAllChecked(true);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Client-side filtering + pagination (since API returns all records)
  const filteredRecords = records.filter((row) =>
    Object.values(row).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
  );

  const currentPageRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalFiltered = filteredRecords.length;
  const totalFilteredPages = Math.ceil(totalFiltered / pageSize);

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
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by role name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={{ mb: 3, maxWidth: 520 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <UilSearch color="#666" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <UilTimes size="18" color="#888" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <CircularProgress size={50} />
            <p style={{ marginTop: 20, color: "#555" }}>Loading roles...</p>
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 520,
                overflowX: "auto",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Table stickyHeader sx={{ minWidth: 900, border: "none" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{ bgcolor: "rgb(17 61 236)", color: "white" }}
                    >
                      <Checkbox
                        sx={{ color: "white" }}
                        checked={isAllChecked}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    {[
                      "SL No",
                      
                      "Role Name",
                      "CRUD Permission",
                      "Created At",
                      "Action",
                    ].map((title) => (
                      <TableCell
                        key={title}
                        sx={{
                          bgcolor: "rgb(17 61 236)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "13.5px",
                          whiteSpace: "nowrap",
                          textAlign: title === "Action" ? "center" : "left",
                        }}
                      >
                        {title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentPageRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        No roles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageRecords.map((row, index) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                          borderBottom: "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={!!checkedRows[row.id]}
                            onChange={() => handleRowCheck(row.id)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                       
                        <TableCell>
                          {row.role_name
                            ? row.role_name.charAt(0).toUpperCase() + row.role_name.slice(1)
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {row.permissions?.length
                            ? row.permissions
                                .map((p) => (p === "UilEditAlt" ? "Edit" : p === "UilTrashAlt" ? "Delete" : p))
                                .join(", ")
                            : "None"}
                        </TableCell>
                        <TableCell>{row.created_at || "—"}</TableCell>
                        <TableCell align="center">
                          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                            <Link to={`/role/update/${row.id}`}>
                              <UilEditAlt style={{ color: "#1230AE", fontSize: 22 }} />
                            </Link>
                            <IconButton size="small" onClick={() => handleDelete(row.id)}>
                              <UilTrashAlt style={{ color: "#e74c3c", fontSize: 22 }} />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: "16px",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span style={{ color: "#555", fontSize: "14px" }}>rows per page</span>
              </div>

              <div style={{ color: "#555", fontSize: "14px" }}>
                {totalFiltered} records • Page {page} of {totalFilteredPages || 1}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: page === 1 ? "#f0f0f0" : "#fff",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <UilAngleLeftB />
                </button>

                {Array.from({ length: totalFilteredPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalFilteredPages || Math.abs(p - page) <= 2)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && p > arr[idx - 1] + 1 && <span>...</span>}
                      <button
                        onClick={() => setPage(p)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid",
                          borderColor: page === p ? "#1976d2" : "#ccc",
                          background: page === p ? "#1976d2" : "#fff",
                          color: page === p ? "white" : "#333",
                          fontWeight: page === p ? "bold" : "normal",
                        }}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalFilteredPages, p + 1))}
                  disabled={page === totalFilteredPages || totalFilteredPages === 0}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: page === totalFilteredPages ? "#f0f0f0" : "#fff",
                    cursor: page === totalFilteredPages ? "not-allowed" : "pointer",
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