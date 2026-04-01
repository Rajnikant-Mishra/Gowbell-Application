// import React, { useEffect, useState, useMemo } from "react";
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
// import "../../Common-Css/DeleteSwal.css";
// import "../../Common-Css/Swallfire.css";
// import CreateButton from "../../CommonButton/CreateButton";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [Role, setRoleDetails] = useState({});
//   const gridApiRef = React.useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   // Fetch roleDetails from localStorage
//   useEffect(() => {
//     const storedRoleDetails = JSON.parse(localStorage.getItem("roleDetails"));
//     if (storedRoleDetails) {
//       setRoleDetails(storedRoleDetails);
//     }
//   }, []);

//   // Fetch subject data with pagination
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/subject`)
//       .then(async (response) => {
//         const formattedData = await Promise.all(
//           response.data.map(async (record) => {
//             try {
//               // Fetch user details based on created_by field
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               const userName = userResponse.data.username;

//               return {
//                 ...record,
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: userName, // Adding username to the record
//               };
//             } catch (error) {
//               console.error(
//                 `Error fetching user data for ID ${record.created_by}`,
//                 error
//               );
//               return {
//                 ...record,
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: "Unknown", // Fallback value in case of an error
//               };
//             }
//           })
//         );

//         setRecords(formattedData);
//         setFilteredRecords(formattedData);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the records!", error);
//       });
//   }, []);

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

//   // Handle delete
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
//           .delete(`${API_BASE_URL}/api/subject/${id}`)
//           .then(() => {
//             setRecords((prev) => prev.filter((record) => record.id !== id));
//             setTotalRecords((prev) => prev - 1);
//             setTotalPages(Math.ceil((totalRecords - 1) / pageSize));
//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The subject has been deleted.",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting subject:", error);
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text: "There was an issue deleting the subject.",
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
//         headerName: "NAME",
//         field: "name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed fixed width
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
//         // Removed fixed width
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed fixed width
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed fixed width
//       },
//       {
//         headerName: "UPDATED AT",
//         field: "updated_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed fixed width
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         // Removed fixed width
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             {Role.permissions?.includes("UilEditAlt") && (
//               <Link to={`/subject/update/${params.data.id}`}>
//                 <UilEditAlt
//                   style={{
//                     color: "#1230AE",
//                     cursor: "pointer",
//                     fontSize: "18px",
//                   }}
//                 />
//               </Link>
//             )}
//             {Role.permissions?.includes("UilTrashAlt") && (
//               <UilTrashAlt
//                 onClick={() => handleDelete(params.data.id)}
//                 style={{
//                   color: "#FF8787",
//                   cursor: "pointer",
//                   fontSize: "18px",
//                 }}
//               />
//             )}
//           </div>
//         ),
//       },
//     ],
//     [Role]
//   );

//   // Default column settings
//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       flex: 1, // Allow columns to stretch proportionally
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
//   );

//   // Auto-size strategy for dynamic column widths
//   const autoSizeStrategy = useMemo(
//     () => ({
//       type: "fitGridWidth", // Fit columns to grid width
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

//   // Pagination controls
//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   // Custom theme
//   const customTheme = {
//     "--ag-font-size": "14px",
//     "--ag-row-height": "40px",
//     "--ag-header-background-color": "#1230AE",
//     "--ag-header-foreground-color": "#FFFFFF",
//     "--ag-grid-size": "6px",
//     "--ag-cell-horizontal-padding": "8px",
//     fontFamily: "'Nunito', sans-serif",
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
//           <Breadcrumb data={[{ name: "Subject" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/subject/create"} />
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
//                     fontFamily: "'Nunito', sans-serif",
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
//                     fontFamily: "'Nunito', sans-serif",
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
//                 <label style={{ fontFamily: "'Nunito', sans-serif" }}>
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: "'Nunito', sans-serif",
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
//                     fontFamily: "'Nunito', sans-serif",
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
//                             fontFamily: "'Nunito', sans-serif",
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
//                           fontFamily: "'Nunito', sans-serif",
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
//                     fontFamily: "'Nunito', sans-serif",
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
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import CreateButton from "../../CommonButton/CreateButton";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";

export default function ClassDataTable() {
  // ← renamed for clarity (was StudentDataTable)
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const pageSizes = [10, 20, 50, 100];

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fetch classes + enrich with created_by username
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/subject`); // ← change endpoint as needed
        const rawData = res.data;

        // Enrich with user info (like your affiliate example)
        const formatted = await Promise.all(
          rawData.map(async (cls) => {
            try {
              const userRes = await axios.get(
                `${API_BASE_URL}/api/u1/users/${cls.created_by}`,
              );
              return {
                ...cls,
                created_at: formatTimestamp(cls.created_at),
                updated_at: formatTimestamp(cls.updated_at || cls.created_at),
                created_by_name: userRes.data.username || "—",
              };
            } catch (err) {
              console.warn(`Failed to fetch user ${cls.created_by}`, err);
              return {
                ...cls,
                created_at: formatTimestamp(cls.created_at),
                updated_at: formatTimestamp(cls.updated_at || cls.created_at),
                created_by_name: "Unknown",
              };
            }
          }),
        );

        setClasses(formatted);
        setFilteredClasses(formatted);
        setTotalRecords(formatted.length);
      } catch (error) {
        console.error("Failed to load classes:", error);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Failed to load classes",
          showConfirmButton: false,
          timer: 2200,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClasses(classes);
      setTotalRecords(classes.length);
      setPage(1);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = classes.filter((cls) =>
      [cls.name, cls.code, cls.created_by_name, cls.status].some((val) =>
        val?.toLowerCase().includes(term),
      ),
    );

    setFilteredClasses(filtered);
    setTotalRecords(filtered.length);
    setPage(1);
  }, [searchTerm, classes]);

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const paginated = filteredClasses.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete class?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#666",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axios
        .delete(`${API_BASE_URL}/api/subject/${id}`)
        .then(() => {
          setClasses((prev) => prev.filter((c) => c.id !== id));
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Affiliated deleted",
            showConfirmButton: false,
            timer: 1800,
          });
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Delete failed",
            timer: 2200,
          });
        });
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
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
        <Breadcrumb data={[{ name: "Subject" }]} />
        <CreateButton link="/subject/create" />
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
          placeholder="Search by name, code, status, created by..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            <p style={{ marginTop: 16, color: "#555" }}>Loading classes...</p>
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 520, overflowX: "auto", boxShadow: "none" }}
            >
              <Table stickyHeader sx={{ minWidth: 1100, border: "none" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{ bgcolor: "rgb(17 61 236)", color: "white" }}
                    >
                      <Checkbox sx={{ color: "white" }} size="small" />
                    </TableCell>
                    {[
                      "SUBJECT",
                      "STATUS",
                      "CREATED BY",
                      "CREATED AT",
                      "UPDATED AT",
                      "ACTION",
                    ].map((title) => (
                      <TableCell
                        key={title}
                        sx={{
                          bgcolor: "rgb(17 61 236)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "13.5px",
                          whiteSpace: "nowrap",
                          textAlign: title === "ACTION" ? "center" : "left",
                        }}
                      >
                        {title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginated.map((cls) => (
                    <TableRow
                      key={cls.id}
                      hover
                      sx={{ "&:hover": { bgcolor: "rgba(0,0,0,0.03)" } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox size="small" />
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>
                        {cls.name || "—"}
                      </TableCell>

                      <TableCell sx={{ fontSize: "13px" }}>
                        {cls.status || "Active"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>
                        {cls.created_by_name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>
                        {cls.created_at}
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>
                        {cls.updated_at}
                      </TableCell>
                      <TableCell align="center">
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "center",
                          }}
                        >
                          <Link to={`/subject/update/${cls.id}`}>
                            <UilEditAlt
                              style={{ color: "#1230AE", fontSize: 22 }}
                            />
                          </Link>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(cls.id)}
                          >
                            <UilTrashAlt
                              style={{ color: "#e74c3c", fontSize: 22 }}
                            />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
              {/* Page size selector */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
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
                  }}
                >
                  {pageSizes.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
                <span style={{ color: "#555", fontSize: "14px" }}>
                  rows per page
                </span>
              </div>

              {/* Summary & Pagination buttons */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <span style={{ color: "#666" }}>
                  {totalRecords === 0
                    ? "No records"
                    : `${startIndex + 1}–${Math.min(startIndex + pageSize, totalRecords)} of ${totalRecords}`}
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  <IconButton
                    size="small"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <UilAngleLeftB />
                  </IconButton>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 || p === totalPages || Math.abs(p - page) <= 2,
                    )
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && p > arr[idx - 1] + 1 && <span>...</span>}
                        <button
                          onClick={() => setPage(p)}
                          style={{
                            minWidth: "32px",
                            height: "32px",
                            borderRadius: "6px",
                            border: "1px solid",
                            borderColor: page === p ? "#1976d2" : "#ddd",
                            background: page === p ? "#1976d2" : "white",
                            color: page === p ? "white" : "#333",
                            fontWeight: page === p ? "bold" : "normal",
                          }}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}

                  <IconButton
                    size="small"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <UilAngleRightB />
                  </IconButton>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Mainlayout>
  );
}
