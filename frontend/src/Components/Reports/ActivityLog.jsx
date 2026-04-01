
// import React, { useEffect, useState, useMemo } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   UilAngleRightB,
//   UilAngleLeftB,
// } from "@iconscout/react-unicons";
// import Mainlayout from "../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import "../Common-Css/DeleteSwal.css";
// import "../Common-Css/Swallfire.css";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   const pageSizes = [10, 20, 50, 100];
//   const gridApiRef = React.useRef(null);

//   // ✅ Format timestamp
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return "—";
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

//   // ✅ Fetch Activity Log data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         const sessionId = localStorage.getItem("currentSessionId") || null;

//         // Build query string
//         const query = new URLSearchParams({
//           page,
//           limit: pageSize,
//           search: searchTerm,
//           session_id: sessionId || "",
//         }).toString();

//         const response = await axios.get(
//           `${API_BASE_URL}/api/ac1/activities?${query}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         console.log("API Response:", response.data);

//         const {
//           activities,
//           totalRecords,
//           totalPages,
//           currentPage,
//           itemsPerPage,
//         } = response.data;

//         if (!activities || !Array.isArray(activities)) {
//           throw new Error("Invalid activities data received from API");
//         }

//         const offset = (currentPage - 1) * itemsPerPage;
//         const formattedData = activities.map((record, index) => ({
//           sl_no: offset + index + 1,
//           activity: record.activity || "—",
//           user_name: record.user_name || "Unknown",
//           ip_address: record.ip_address || "—",
//           created_at: formatTimestamp(record.created_at),
//           updated_at: record.updated_at
//             ? formatTimestamp(record.updated_at)
//             : "—",
//         }));

//         setRecords(formattedData);
//         setTotalRecords(totalRecords || 0);
//         setTotalPages(totalPages || 0);
//       } catch (error) {
//         console.error("Error fetching activity data:", error);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: "Failed to fetch activity data.",
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

//   // ✅ Column definitions
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "ACTIVITY",
//         field: "activity",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value,
//       },
//       {
//         headerName: "DATE",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "USER",
//         field: "user_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         valueFormatter: (params) =>
//           params.value
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : "",
//       },
//       {
//         headerName: "IP ADDRESS",
//         field: "ip_address",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//     ],
//     []
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       flex: 1,
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
//   );

//   const autoSizeStrategy = useMemo(
//     () => ({
//       type: "fitGridWidth",
//     }),
//     []
//   );

//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.setAutoSizeStrategy(autoSizeStrategy);
//   };

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

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   const customTheme = {
//     "--ag-font-size": "14px",
//     "--ag-row-height": "40px",
//     "--ag-header-background-color": "#1230AE",
//     "--ag-header-foreground-color": "#FFFFFF",
//     "--ag-grid-size": "6px",
//     "--ag-cell-horizontal-padding": "8px",
//     fontFamily: "'Nunito', sans-serif",
//   };

//   // ✅ JSX Layout
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
//           <Breadcrumb data={[{ name: "Activity Log" }]} />
//         </div>
//       </div>

//       <div
//         style={{
//           background: "white",
//           padding: "1.5%",
//           borderRadius: "5px",
//           marginTop: "0",
//           width: "100%",
//         }}
//       >
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <div
//               className="ag-theme-alpine"
//               style={{ height: "500px", width: "100%" }}
//             >
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 autoSizeStrategy={autoSizeStrategy}
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

//             {/* Pagination Footer */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 marginTop: "8px",
//               }}
//             >
//               {/* Page size selector */}
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

//               {/* Record count */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   margin: "auto",
//                 }}
//               >
//                 <p
//                   style={{
//                     margin: "auto",
//                     color: "#6C757D",
//                     fontFamily: "'Nunito', sans-serif",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {totalRecords} records, Page {page} of {totalPages}
//                 </p>
//               </div>

//               {/* Pagination buttons */}
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
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/DeleteSwal.css";
import "../Common-Css/Swallfire.css";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Checkbox states (for consistency with your other tables)
  const [checkedRows, setCheckedRows] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);

  const pageSizes = [10, 20, 50, 100];

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "—";
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

  // Fetch Activity Log data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const sessionId = localStorage.getItem("currentSessionId") || null;

        const query = new URLSearchParams({
          page,
          limit: pageSize,
          search: searchTerm,
          session_id: sessionId || "",
        }).toString();

        const response = await axios.get(
          `${API_BASE_URL}/api/ac1/activities?${query}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const {
          activities,
          totalRecords,
          totalPages,
        } = response.data;

        if (!activities || !Array.isArray(activities)) {
          throw new Error("Invalid activities data received from API");
        }

        const formattedData = activities.map((record, index) => ({
          sl_no: (page - 1) * pageSize + index + 1,
          activity: record.activity || "—",
          user_name: record.user_name || "Unknown",
          ip_address: record.ip_address || "—",
          created_at: formatTimestamp(record.created_at),
          updated_at: record.updated_at
            ? formatTimestamp(record.updated_at)
            : "—",
        }));

        setRecords(formattedData);
        setTotalRecords(totalRecords || 0);
        setTotalPages(totalPages || 0);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Failed to fetch activity data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchTerm]);

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
    setPage(1);
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
          <Breadcrumb data={[{ name: "Activity Log" }]} />
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


        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <CircularProgress size={50} />
            <p style={{ marginTop: 20, color: "#555" }}>Loading activity log...</p>
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
                      "Activity",
                      "Date",
                      "User",
                      "IP Address",
                      
                    ].map((title) => (
                      <TableCell
                        key={title}
                        sx={{
                          bgcolor: "rgb(17 61 236)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "13.5px",
                          whiteSpace: "nowrap",
                          textAlign: "left",
                        }}
                      >
                        {title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        No activity records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((row) => (
                      <TableRow
                        key={row.id || row.sl_no}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                          borderBottom: "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={!!checkedRows[row.id || row.sl_no]}
                            onChange={() => handleRowCheck(row.id || row.sl_no)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{row.sl_no}</TableCell>
                        <TableCell>{row.activity}</TableCell>
                        <TableCell>{row.created_at}</TableCell>
                        <TableCell>{row.user_name}</TableCell>
                        <TableCell>{row.ip_address}</TableCell>
                       
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
                {totalRecords} records • Page {page} of {totalPages || 1}
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

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: page === totalPages ? "#f0f0f0" : "#fff",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
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