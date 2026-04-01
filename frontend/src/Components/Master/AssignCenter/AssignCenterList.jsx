// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   useCallback,
//   useRef,
// } from "react";
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

// export default function AssignCenterDataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   const sizeColumnsToFit = useCallback(() => {
//     if (gridApiRef.current) {
//       gridApiRef.current.sizeColumnsToFit();
//     }
//   }, []);

//   // ✅ Fetch Data
//   const fetchAssignCenters = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${API_BASE_URL}/api/assign-center?page=${page}&limit=${pageSize}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const { data, total } = res.data;
//       setRecords(data);
//       setTotalRecords(total);
//       setTotalPages(Math.ceil(total / pageSize));
//     } catch (err) {
//       console.error("Error fetching Assign Centers:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Failed!",
//         text: "Unable to load assign center data.",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [page, pageSize]);

//   useEffect(() => {
//     fetchAssignCenters();
//   }, [fetchAssignCenters]);

//   // ✅ Delete Function
//   const handleDelete = useCallback(
//     (id) => {
//       Swal.fire({
//         title: "Are you sure?",
//         text: "You won’t be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`${API_BASE_URL}/api/assign-center/${id}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             Swal.fire({
//               icon: "success",
//               title: "Deleted!",
//               text: "Assign center deleted successfully.",
//               timer: 1000,
//               showConfirmButton: false,
//             });
//             fetchAssignCenters();
//           } catch (error) {
//             Swal.fire({
//               icon: "error",
//               title: "Error!",
//               text: "Unable to delete assign center.",
//               timer: 1500,
//               showConfirmButton: false,
//             });
//           }
//         }
//       });
//     },
//     [fetchAssignCenters]
//   );

//   // ✅ Column Definitions
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "COUNTRY",
//         field: "country_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100,
//       },
//       {
//         headerName: "STATE",
//         field: "state_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100,
//       },
//       {
//         headerName: "DISTRICT",
//         field: "district_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 120,
//       },
//       {
//         headerName: "CITY",
//         field: "city_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100,
//       },
//       {
//         headerName: "ASSIGN CENTER NAME",
//         field: "assign_center_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 180,
//       },
//       {
//         headerName: "SCHOOLS",
//         field: "schools",
//         minWidth: 200,
//         valueGetter: (params) =>
//           params.data.schools?.map((s) => s.name).join(", ") || "No Schools",
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 150,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Link to={`/center-assign-form/${params.data.id}`}>
//               <UilEditAlt style={{ color: "#1230AE", cursor: "pointer" }} />
//             </Link>
//             <UilTrashAlt
//               onClick={() => handleDelete(params.data.id)}
//               style={{ color: "#FF8787", cursor: "pointer" }}
//             />
//           </div>
//         ),
//       },
//     ],
//     [handleDelete]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       sortable: true,
//       filter: "agTextColumnFilter",
//       flex: 1,
//       minWidth: 100,
//     }),
//     []
//   );

//   const onGridReady = useCallback((params) => {
//     gridApiRef.current = params.api;
//     sizeColumnsToFit();
//   }, [sizeColumnsToFit]);

//   const handlePreviousPage = useCallback(() => {
//     if (page > 1) setPage(page - 1);
//   }, [page]);

//   const handleNextPage = useCallback(() => {
//     if (page < totalPages) setPage(page + 1);
//   }, [page, totalPages]);

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
//         <Breadcrumb data={[{ name: "Assign Center" }]} />
//         <CreateButton link="/center-assign-form" />
//       </div>

//       <div
//         style={{
//           background: "white",
//           padding: "1.5%",
//           borderRadius: "5px",
//         }}
//       >
//         {loading ? (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <div
//               style={{
//                 border: "4px solid #f3f3f3",
//                 borderTop: "4px solid #1230AE",
//                 borderRadius: "50%",
//                 width: "24px",
//                 height: "24px",
//                 animation: "spin 1s linear infinite",
//               }}
//             />
//             <span>Loading...</span>
//           </div>
//         ) : (
//           <>
//             <div className="ag-theme-alpine" style={{ height: 500 }}>
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={records}
//                 defaultColDef={defaultColDef}
//                 onGridReady={onGridReady}
//                 animateRows={true}
//                 suppressPaginationPanel={true}
//                 theme={customTheme}
//               />
//             </div>

//             {/* Pagination */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginTop: "10px",
//               }}
//             >
//               <div>
//                 <select
//                   value={pageSize}
//                   onChange={(e) => {
//                     setPageSize(parseInt(e.target.value));
//                     setPage(1);
//                   }}
//                 >
//                   {pageSizes.map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>{" "}
//                 per page
//               </div>
//               <div>
//                 <button onClick={handlePreviousPage} disabled={page === 1}>
//                   <UilAngleLeftB />
//                 </button>
//                 <span style={{ margin: "0 10px" }}>
//                   Page {page} of {totalPages}
//                 </span>
//                 <button
//                   onClick={handleNextPage}
//                   disabled={page === totalPages}
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




import React, { useEffect, useState, useCallback } from "react";
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

export default function AssignedCenterDataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);           // ← assigned centers
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
      hour12: true,
    });
  };

  // Fetch assigned centers
  const fetchAssignedCenters = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.get(
        `${API_BASE_URL}/api/assign-center`,
        {
          params: {
            page,
            limit: pageSize,
            search: searchTerm.trim() || undefined,   // only send if non-empty
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data, total } = res.data;

      const formatted = (data || []).map((item, index) => ({
        ...item,
        sl_no: (page - 1) * pageSize + index + 1,
        created_at: formatTimestamp(item.created_at),
        updated_at: formatTimestamp(item.updated_at || item.updatedAt),
        // Adjust field names based on your actual response
        center_name: item.center_name || item.name || "—",
        assigned_to: item.assigned_to_name || item.user_name || item.email || "—",
        created_by: item.created_by_username || item.created_by || "—",
      }));

      setRecords(formatted);
      setTotalRecords(total || 0);
      setTotalPages(Math.ceil((total || 0) / pageSize));
    } catch (err) {
      console.error("Error fetching assigned centers:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to load assigned centers",
        showConfirmButton: false,
        timer: 2200,
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    fetchAssignedCenters();
  }, [fetchAssignedCenters]);

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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This assigned center will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        axios
          .delete(`${API_BASE_URL}/api/assign-center/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setRecords((prev) => prev.filter((r) => r.id !== id));
            setIsAllChecked(false);
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Assigned center deleted",
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
              showConfirmButton: false,
              timer: 2200,
            });
          });
      }
    });
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
        <Breadcrumb data={[{ name: "Assigned Centers" }]} />
        <CreateButton link="/assign-center/create" /> {/* ← adjust route if needed */}
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
          placeholder="Search by center name, user, email..."
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
            <p style={{ marginTop: 20, color: "#555" }}>Loading assigned centers...</p>
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
                      "COUNTRY",
                      "STATE",
                      "DISTRICT",
                      "CITY",
                      "ASSIGN CENTER NAME",
                      "SCHOOLS",
                      "CREATED AT",
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
                          textAlign: title === "Action" ? "center" : "left",
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
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        No assigned centers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((row) => (
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
                        <TableCell>{row.country_name}</TableCell>
                        <TableCell>{row.state_name}</TableCell>
                        <TableCell>{row.district_name}</TableCell>
                        <TableCell>{row.city_name}</TableCell>
                          <TableCell>{row.assign_center_name}</TableCell>
                        <TableCell>{row.created_at}</TableCell>
                        <TableCell>{row.updated_at || "—"}</TableCell>
                        <TableCell align="center">
                          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                            <Link to={`/assign-center/update/${row.id}`}>
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

            {/* Pagination Controls */}
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