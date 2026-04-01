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
// import Mainlayout from "../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import CreateButton from "../../Components/CommonButton/CreateButton";
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
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];
//   const [rowSelection, setRowSelection] = useState({});

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     return new Date(timestamp).toLocaleString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const sessionId = localStorage.getItem("currentSessionId") || null;
//         // Fetch inventory records with pagination, search, and session_id
//         const inventoryResponse = await axios.get(
//           `${API_BASE_URL}/api/v1/inventory-paginate`,
//           {
//             params: {
//               page,
//               limit: pageSize,
//               search: searchTerm,
//               session_id: sessionId,
//             },
//           },
//         );
//         const { inventory, totalRecords, totalPages } = inventoryResponse.data;

//         // Format inventory data
//         const formattedData = await Promise.all(
//           inventory.map(async (record) => {
//             try {
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`,
//               );
//               const userName = userResponse.data.username;

//               return {
//                 ...record,
//                 date: record.date ? record.date.split("T")[0] : "",
//                 created_at: formatTimestamp(record.created_at),
//                 created_by: userName,
//               };
//             } catch (userError) {
//               console.error(
//                 `Failed to fetch user details for created_by: ${record.created_by}`,
//                 userError,
//               );
//               return {
//                 ...record,
//                 date: record.date ? record.date.split("T")[0] : "",
//                 created_at: formatTimestamp(record.created_at),
//                 created_by: "Unknown User",
//               };
//             }
//           }),
//         );

//         setRecords(formattedData);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         console.error("Error fetching inventory data:", error);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text:
//             error.response?.data?.error || "Failed to fetch inventory data.",
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounceTimeout = setTimeout(() => {
//       fetchData();
//     }, 500);

//     return () => clearTimeout(debounceTimeout);
//   }, [page, pageSize, searchTerm]);

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
//         const token = localStorage.getItem("token"); // Get token
//         if (!token) {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Error!",
//             text: "Authentication token is missing.",
//             showConfirmButton: false,
//             timer: 2000,
//             toast: true,
//             background: "#fff",
//             customClass: { popup: "small-swal" },
//           });
//           return;
//         }

//         axios
//           .delete(`${API_BASE_URL}/api/v1/inventory/${id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`, // Include token in headers
//             },
//           })
//           .then(() => {
//             setRecords((prev) => prev.filter((record) => record.id !== id));
//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The inventory has been deleted.",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting inventory:", error);
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text:
//                 error.response?.data?.error ||
//                 "There was an issue deleting the inventory.",
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
//         headerName: "DATE",
//         field: "date",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "INVOICE NO",
//         field: "invoice_no",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 130,
//       },
//       {
//         headerName: "ITEMS",
//         field: "item",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//       },
//       {
//         headerName: "SUB ITEM",
//         field: "sub_item",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "SUB ITEM NAME",
//         field: "sub_item_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//       },
//       {
//         headerName: "QUANTITY",
//         field: "quantity",
//         sortable: true,
//         filter: "agNumberColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "UNIT",
//         field: "unit",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 100,
//       },
//       {
//         headerName: "PRICE",
//         field: "price",
//         sortable: true,
//         filter: "agNumberColumnFilter",
//       },
//       {
//         headerName: "SUPPLIER",
//         field: "manufacturer_details",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) =>
//           params.value
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : "",
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         width: 100,
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Link to={`/inventory/${params.data.id}`}>
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
//     [handleDelete],
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: true,
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

//       setSearchTerm(searchValue);
//       setPage(1);
//     }
//   };

//   const onSelectionChanged = () => {
//     if (gridApiRef.current) {
//       const selectedNodes = gridApiRef.current.getSelectedNodes();
//       const newSelection = {};
//       selectedNodes.forEach((node) => {
//         newSelection[node.data.id] = true;
//       });
//       setRowSelection(newSelection);
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
//           <Breadcrumb data={[{ name: "Inventory" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/create-inventory"} />
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
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <div
//               className="spinner"
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
//             <style>{`
//               @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             `}</style>
//           </div>
//         ) : (
//           <>
//             <div
//               className="ag-theme-alpine"
//               style={{ height: "500px", width: "100%", overflowX: "auto" }}
//             >
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 rowSelection="multiple"
//                 onSelectionChanged={onSelectionChanged}
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
//                 <label style={{ fontFamily: "Nunito, sans-serif" }}>
//                   <p
//                     style={{
//                       margin: "auto",
//                       color: "#6C757D",
//                       fontFamily: "'Poppins', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {totalRecords} of {page}-{totalPages}
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
//                       pg === 1 || pg === totalPages || Math.abs(pg - page) <= 2,
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
//                           fontFamily: "'Poppins', sans-serif",
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

import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import Breadcrumb from "../CommonButton/Breadcrumb";
import CreateButton from "../CommonButton/CreateButton";
import "../Common-Css/DeleteSwal.css";
import "../Common-Css/Swallfire.css";

export default function InventoryDataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);

  const pageSizes = [10, 20, 50, 100];

  // Format timestamp for display (only date part)
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Fetch inventory with debounce
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const sessionId = localStorage.getItem("currentSessionId") || null;

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/inventory-paginate`,
          {
            params: {
              page,
              limit: pageSize,
              search: searchTerm.trim() || undefined,
              session_id: sessionId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const {
          inventory = [],
          totalRecords = 0,
          totalPages = 0,
        } = response.data;

        // Enrich records with username
        const formatted = await Promise.all(
          inventory.map(async (record) => {
            try {
              const userRes = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );
              const username = userRes.data?.username || "—";

              return {
                ...record,
                sl_no: (page - 1) * pageSize + (inventory.indexOf(record) + 1),
                date: record.date ? record.date.split("T")[0] : "—",
                created_at: formatTimestamp(record.created_at),
                created_by: username,
              };
            } catch (userErr) {
              console.warn(
                `Could not fetch user ${record.created_by}`,
                userErr,
              );
              return {
                ...record,
                sl_no: (page - 1) * pageSize + (inventory.indexOf(record) + 1),
                date: record.date ? record.date.split("T")[0] : "—",
                created_at: formatTimestamp(record.created_at),
                created_by: "Unknown",
              };
            }
          }),
        );

        setRecords(formatted);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (err) {
        console.error("Failed to load inventory:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Failed to load inventory",
          text: err.response?.data?.error || "Please try again later.",
          showConfirmButton: false,
          timer: 2200,
        });
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchInventory();
    }, 500);

    return () => clearTimeout(timeout);
  }, [page, pageSize, searchTerm]);

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
      text: "This inventory record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "custom-swal-popup" },
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Authentication Error",
            text: "Token is missing. Please login again.",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
          });
          return;
        }

        axios
          .delete(`${API_BASE_URL}/api/v1/inventory/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setRecords((prev) => prev.filter((r) => r.id !== id));
            setIsAllChecked(false);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Deleted!",
              text: "Inventory record deleted successfully.",
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
          })
          .catch((err) => {
            console.error("Delete failed:", err);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Delete Failed",
              text: err.response?.data?.error || "Something went wrong.",
              showConfirmButton: false,
              timer: 2200,
              toast: true,
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
        <Breadcrumb data={[{ name: "Inventory" }]} />
        <CreateButton link={"/create-inventory"} />
        {/* ← adjust if route is different */}
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
          placeholder="Search by item, description, created by..."
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
            <p style={{ marginTop: 20, color: "#555" }}>Loading inventory...</p>
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
                      "DATE",
                      "INVOICE",
                      "ITEMS", // ← change title if needed
                      "SUB ITEMS",
                      "SUBITEMS NAME",
                      "QUANTITY",
                      "UNIT",
                      "PRICE",
                      "SUPPLIER",
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
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        No inventory records found
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

                        <TableCell>{row.date || "—"}</TableCell>
                        <TableCell>
                          {/* Adjust according to your actual fields */}
                          {row.invoice_no || "—"}
                        </TableCell>
                        <TableCell>{row.item}</TableCell>
                        <TableCell>{row.sub_item}</TableCell>
                        <TableCell>{row.sub_item_name}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell>{row.price}</TableCell>
                        <TableCell>{row.manufacturer_details}</TableCell>
                        <TableCell>{row.created_at}</TableCell>
                        <TableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              justifyContent: "center",
                            }}
                          >
                            <Link to={`/inventory/${row.id}`}>
                              <UilEditAlt
                                style={{ color: "#1230AE", fontSize: 22 }}
                              />
                            </Link>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(row.id)}
                            >
                              <UilTrashAlt
                                style={{ color: "#e74c3c", fontSize: 22 }}
                              />
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
                    fontSize: "14px",
                  }}
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span style={{ color: "#555", fontSize: "14px" }}>
                  rows per page
                </span>
              </div>

              <div style={{ color: "#555", fontSize: "14px" }}>
                {totalRecords} records • Page {page} of {totalPages || 1}
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
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
