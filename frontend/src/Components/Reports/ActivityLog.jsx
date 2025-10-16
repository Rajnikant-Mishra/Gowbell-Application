
// import React, { useState, useEffect } from "react";
// import {
//   UilCalendarAlt,
//   UilUser,
//   UilLocationPinAlt,
//   UilAngleLeftB,
//   UilAngleRightB,
//   UilSearch,
// } from "@iconscout/react-unicons";
// import Mainlayout from "../Layouts/Mainlayout";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import styles from "./activitylog.module.css";

// const ActivityLog = () => {
//   const [activities, setActivities] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const pageSizes = [5, 10, 20, 50];

//   // ✅ Get current session ID from localStorage
//   const sessionId = localStorage.getItem("currentSessionId") || null;

//   // --- Fetch Activity Logs from backend ---
//   const fetchActivities = async () => {
//     setLoading(true);
//     try {
//       const query = new URLSearchParams({
//         search: searchTerm,
//         page,
//         limit: pageSize,
//         session_id: sessionId || "", // ✅ include session_id in request
//       }).toString();

//       const response = await fetch(`${API_BASE_URL}/api/ac1/activities?${query}`);
//       if (!response.ok) throw new Error("Failed to fetch activities");

//       const data = await response.json();

//       // If backend returns array only
//       if (Array.isArray(data)) {
//         setActivities(data);
//         setTotalRecords(data.length);
//         setTotalPages(1);
//       } else {
//         // If backend returns metadata + activities
//         setActivities(data.activities || []);
//         setTotalPages(data.totalPages || 1);
//         setTotalRecords(data.totalRecords || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch whenever page, pageSize, or searchTerm changes
//   useEffect(() => {
//     fetchActivities();
//   }, [page, pageSize, searchTerm, sessionId]);

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "Activity Log" }]} />
//       </div>

//       <div className={styles.midSection}>
//         <div className={styles.activityLog}>
//           {/* 🔍 Search Box */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-start",
//               marginBottom: "10px",
//             }}
//           >
//             <div
//               style={{ position: "relative", width: "370px", marginLeft: "-21px" }}
//             >
//               <input
//                 type="text"
//                 placeholder="Search activity..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setPage(1);
//                 }}
//                 style={{
//                   width: "100%",
//                   padding: "8px 32px 8px 10px",
//                   border: "1px solid #ccc",
//                   borderRadius: "5px",
//                   outline: "none",
//                   fontFamily: "'Nunito', sans-serif",
//                 }}
//               />
//               <UilSearch
//                 style={{
//                   position: "absolute",
//                   right: "8px",
//                   top: "8px",
//                   color: "#007BFF",
//                 }}
//               />
//             </div>
//           </div>

//           {/* 🧾 Table Section */}
//           <div style={{ overflowX: "auto" }}>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 borderRadius: "6px",
//                 overflow: "hidden",
//                 fontFamily: "'Nunito', sans-serif",
//               }}
//             >
//               <thead>
//                 <tr
//                   style={{
//                     backgroundColor: "#1230ae",
//                     color: "#fff",
//                     textAlign: "left",
//                   }}
//                 >
//                   <th style={{ padding: "10px" }}>Activity</th>
//                   <th style={{ padding: "10px" }}>
//                     <UilCalendarAlt style={{ marginRight: "5px" }} />
//                     Date
//                   </th>
//                   <th style={{ padding: "10px" }}>
//                     <UilUser style={{ marginRight: "5px" }} />
//                     User
//                   </th>
//                   <th style={{ padding: "10px" }}>
//                     <UilLocationPinAlt style={{ marginRight: "5px" }} />
//                     IP Address
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       style={{
//                         textAlign: "center",
//                         padding: "15px",
//                         color: "#999",
//                       }}
//                     >
//                       Loading activities...
//                     </td>
//                   </tr>
//                 ) : activities.length > 0 ? (
//                   activities.map((item, index) => (
//                     <tr
//                       key={index}
//                       style={{
//                         borderBottom: "1px solid #e0e0e0",
//                         backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
//                       }}
//                     >
//                       <td style={{ padding: "10px", color: "#333" }}>
//                         {item.activity}
//                       </td>
//                       <td style={{ padding: "10px", color: "#555" }}>
//                         {item.created_at}
//                       </td>
//                       <td style={{ padding: "10px", color: "#555" }}>
//                         {item.user_name}
//                       </td>
//                       <td style={{ padding: "10px", color: "#555" }}>
//                         {item.ip_address}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       style={{
//                         textAlign: "center",
//                         padding: "15px",
//                         color: "#999",
//                       }}
//                     >
//                       No matching records found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* 📄 Pagination Section */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               flexWrap: "wrap",
//               marginTop: "8px",
//             }}
//           >
//             {/* Page Size Selector */}
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 gap: "10px",
//               }}
//             >
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   const selectedSize = parseInt(e.target.value, 10);
//                   setPageSize(selectedSize);
//                   setPage(1);
//                 }}
//                 style={{
//                   width: "55px",
//                   padding: "0px 5px",
//                   height: "30px",
//                   fontSize: "14px",
//                   border: "1px solid rgb(225, 220, 220)",
//                   borderRadius: "2px",
//                   color: "#564545",
//                   fontWeight: "bold",
//                   outline: "none",
//                   transition: "all 0.3s ease",
//                   fontFamily: "'Nunito', sans-serif",
//                 }}
//               >
//                 {pageSizes.map((size) => (
//                   <option key={size} value={size}>
//                     {size}
//                   </option>
//                 ))}
//               </select>
//               <p
//                 style={{
//                   margin: "auto",
//                   color: "#6C757D",
//                   fontFamily: "'Nunito', sans-serif",
//                   fontSize: "14px",
//                 }}
//               >
//                 data per Page
//               </p>
//             </div>

//             {/* Records Info */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 margin: "auto",
//               }}
//             >
//               <p
//                 style={{
//                   margin: "auto",
//                   color: "#6C757D",
//                   fontFamily: "'Nunito', sans-serif",
//                   fontSize: "14px",
//                 }}
//               >
//                 {totalRecords} records, Page {page} of {totalPages || 1}
//               </p>
//             </div>

//             {/* Pagination Buttons */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <button
//                 onClick={handlePreviousPage}
//                 disabled={page === 1}
//                 style={{
//                   backgroundColor: page === 1 ? "#E0E0E0" : "#F5F5F5",
//                   color: page === 1 ? "#aaa" : "#333",
//                   border: "1px solid #ccc",
//                   borderRadius: "7px",
//                   padding: "3px 3.5px",
//                   width: "33px",
//                   height: "30px",
//                   cursor: page === 1 ? "not-allowed" : "pointer",
//                   transition: "all 0.3s ease",
//                   margin: "0 4px",
//                   fontFamily: "'Nunito', sans-serif",
//                 }}
//               >
//                 <UilAngleLeftB />
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter(
//                   (pg) =>
//                     pg === 1 || pg === totalPages || Math.abs(pg - page) <= 2
//                 )
//                 .map((pg, index, array) => (
//                   <React.Fragment key={pg}>
//                     {index > 0 && pg > array[index - 1] + 1 && (
//                       <span
//                         style={{
//                           color: "#aaa",
//                           fontSize: "14px",
//                           fontFamily: "'Nunito', sans-serif",
//                         }}
//                       >
//                         ...
//                       </span>
//                     )}
//                     <button
//                       onClick={() => setPage(pg)}
//                       style={{
//                         backgroundColor: page === pg ? "#1230ae" : "#F5F5F5",
//                         color: page === pg ? "#fff" : "#333",
//                         border:
//                           page === pg ? "1px solid #0056B3" : "1px solid #ccc",
//                         borderRadius: "7px",
//                         padding: "4px 13.5px",
//                         height: "30px",
//                         cursor: "pointer",
//                         transition: "all 0.3s ease",
//                         margin: "0 4px",
//                         fontWeight: page === pg ? "bold" : "normal",
//                         fontFamily: "'Nunito', sans-serif",
//                         fontSize: "14px",
//                       }}
//                     >
//                       {pg}
//                     </button>
//                   </React.Fragment>
//                 ))}

//               <button
//                 onClick={handleNextPage}
//                 disabled={page === totalPages}
//                 style={{
//                   backgroundColor:
//                     page === totalPages ? "#E0E0E0" : "#F5F5F5",
//                   color: page === totalPages ? "#aaa" : "#333",
//                   border: "1px solid #ccc",
//                   borderRadius: "7px",
//                   padding: "3px 3.5px",
//                   width: "33px",
//                   height: "30px",
//                   cursor: page === totalPages ? "not-allowed" : "pointer",
//                   transition: "all 0.3s ease",
//                   margin: "0 4px",
//                   fontFamily: "'Nunito', sans-serif",
//                 }}
//               >
//                 <UilAngleRightB />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Mainlayout>
//   );
// };

// export default ActivityLog;


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
// import Mainlayout from "../Layouts/Mainlayout";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import CreateButton from "../CommonButton/CreateButton";
// import "../Common-Css/DeleteSwal.css";
// import "../Common-Css/Swallfire.css";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [Role, setRoleDetails] = useState({});
//   const [loading, setLoading] = useState(false);
//   const pageSizes = [10, 20, 50, 100];
//   const gridApiRef = React.useRef(null);



//   // Fetch class data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token"); // Get token from storage

//         const response = await axios.get(`${API_BASE_URL}/api/class-paginate`, {
//           params: { page, limit: pageSize, search: searchTerm },
//           headers: { Authorization: `Bearer ${token}` }, // ✅ Add token here
//         });

//         console.log("API Response:", response.data); // Debug log
//         const {
//           classes,
//           totalRecords,
//           totalPages,
//           currentPage,
//           nextPage,
//           prevPage,
//           itemsPerPage,
//         } = response.data;

//         if (!classes || !Array.isArray(classes)) {
//           throw new Error("Invalid classes data received from API");
//         }

//         const offset = (currentPage - 1) * itemsPerPage;
//         const formattedData = await Promise.all(
//           classes.map(async (record, index) => {
//             try {
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`,
//                 { headers: { Authorization: `Bearer ${token}` } } // ✅ Add token here too
//               );
//               const { username, role } = userResponse.data;

//               const roleResponse = await axios.get(
//                 `${API_BASE_URL}/api/r1/role/${role}`,
//                 { headers: { Authorization: `Bearer ${token}` } } // ✅ And here
//               );
//               const { role_name } = roleResponse.data;

//               return {
//                 sl_no: offset + index + 1,
//                 ...record,
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: `${username} (${role_name})`,
//               };
//             } catch (userRoleError) {
//               console.error("Error fetching user/role data:", userRoleError);
//               return {
//                 sl_no: offset + index + 1,
//                 ...record,
//                 created_at: formatTimestamp(record.created_at),
//                 updated_at: formatTimestamp(record.updated_at),
//                 created_by: "Unknown User (Unknown Role)",
//               };
//             }
//           })
//         );

//         setRecords(formattedData);
//         setTotalRecords(totalRecords || 0);
//         setTotalPages(totalPages || 0);
//         console.log("Formatted Records:", formattedData); // Debug log
//       } catch (error) {
//         console.error("Error fetching class records:", error);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: "Failed to fetch class data.",
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



//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "ACTIVITY",
//         field: "activity",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed fixed width
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
//         // Removed fixed width
//       },
//       {
//         headerName: "USER",
//         field: "user_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         // Removed fixed width
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
//         // Removed fixed width
//       },
    
//     ],
//     [Role]
//   );

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

//   const autoSizeStrategy = useMemo(
//     () => ({
//       type: "fitGridWidth", // Automatically fit columns to the grid's width
//     }),
//     []
//   );

//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.setAutoSizeStrategy(autoSizeStrategy); // Apply auto-size strategy
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

import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
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

  const pageSizes = [10, 20, 50, 100];
  const gridApiRef = React.useRef(null);

  // ✅ Format timestamp
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

  // ✅ Fetch Activity Log data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const sessionId = localStorage.getItem("currentSessionId") || null;

        // Build query string
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

        console.log("API Response:", response.data);

        const {
          activities,
          totalRecords,
          totalPages,
          currentPage,
          itemsPerPage,
        } = response.data;

        if (!activities || !Array.isArray(activities)) {
          throw new Error("Invalid activities data received from API");
        }

        const offset = (currentPage - 1) * itemsPerPage;
        const formattedData = activities.map((record, index) => ({
          sl_no: offset + index + 1,
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

  // ✅ Column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "ACTIVITY",
        field: "activity",
        sortable: true,
        filter: "agTextColumnFilter",
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value,
      },
      {
        headerName: "DATE",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "USER",
        field: "user_name",
        sortable: true,
        filter: "agTextColumnFilter",
        valueFormatter: (params) =>
          params.value
            ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
            : "",
      },
      {
        headerName: "IP ADDRESS",
        field: "ip_address",
        sortable: true,
        filter: "agTextColumnFilter",
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
      flex: 1,
      suppressFilterResetOnColumnChange: true,
    }),
    []
  );

  const autoSizeStrategy = useMemo(
    () => ({
      type: "fitGridWidth",
    }),
    []
  );

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.setAutoSizeStrategy(autoSizeStrategy);
  };

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

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const customTheme = {
    "--ag-font-size": "14px",
    "--ag-row-height": "40px",
    "--ag-header-background-color": "#1230AE",
    "--ag-header-foreground-color": "#FFFFFF",
    "--ag-grid-size": "6px",
    "--ag-cell-horizontal-padding": "8px",
    fontFamily: "'Nunito', sans-serif",
  };

  // ✅ JSX Layout
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
          padding: "1.5%",
          borderRadius: "5px",
          marginTop: "0",
          width: "100%",
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div
              className="ag-theme-alpine"
              style={{ height: "500px", width: "100%" }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={records}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                autoSizeStrategy={autoSizeStrategy}
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

            {/* Pagination Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {/* Page size selector */}
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
                    fontFamily: "'Nunito', sans-serif",
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
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  data per Page
                </p>
              </div>

              {/* Record count */}
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
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {totalRecords} records, Page {page} of {totalPages}
                </p>
              </div>

              {/* Pagination buttons */}
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
                    fontFamily: "'Nunito', sans-serif",
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
                            fontFamily: "'Nunito', sans-serif",
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
                          fontFamily: "'Nunito', sans-serif",
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
                    fontFamily: "'Nunito', sans-serif",
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
