// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   UilTrashAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
//   UilEye,
//   UilEditAlt,
// } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import CreateButton from "../../CommonButton/CreateButton";
// import Swal from "sweetalert2";
// import activeDownload from "../../../../public/download-active.png";
// import inActiveDownload from "../../../../public/download-inactive.png";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   // const [loading, setLoading] = useState(false);
//   const [rowSelection, setRowSelection] = useState({});
//   const navigate = useNavigate();
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];

//   const [schoolMap, setSchoolMap] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Fetch school data once
//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/get/all-schools`);
//         const data = await res.json();

//         const list = Array.isArray(data) ? data : data.data || [];
//         const map = Object.fromEntries(list.map((s) => [s.id, s.school_name]));

//         setSchoolMap(map);
//       } catch (err) {
//         console.error("Failed to fetch schools:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchools();
//   }, []);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/omr/omr-data`, {
//           params: { page, limit: pageSize, search: searchTerm },
//         });
//         const { data, totalRecords, totalPages } = response.data;
//         setRecords(data);
//         setTotalRecords(totalRecords || data.length);
//         setTotalPages(totalPages || Math.ceil(data.length / pageSize));
//       } catch (error) {
//         console.error("Error fetching OMR data:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to fetch OMR data.",
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [page, pageSize, searchTerm]);

//   // Handle download
//   const handleDownload = async (id, school) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/omr/download/by-id/${id}`,
//         { responseType: "blob" },
//       );

//       const contentDisposition = response.headers["content-disposition"];
//       const filename = contentDisposition
//         ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") ||
//           `${school}_${id}.pdf`
//         : `${school}_${id}.pdf`;

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: `PDF for ${school} downloaded successfully.`,
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text:
//           error.response?.status === 404
//             ? "PDF file not found."
//             : "Failed to download PDF.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }
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
//         const token = localStorage.getItem("token");
//         if (!token) {
//           Swal.fire({
//             icon: "error",
//             title: "Error!",
//             text: "Authentication token is missing.",
//             toast: true,
//             position: "top-end",
//             showConfirmButton: false,
//             timer: 1500,
//           });
//           return;
//         }

//         axios
//           .delete(`${API_BASE_URL}/api/omr/omr-data/${id}`, {
//             headers: { Authorization: `Bearer ${token}` }, // Added token here
//           })
//           .then(() => {
//             setRecords((prev) => prev.filter((record) => record.id !== id));
//             setTotalRecords((prev) => prev - 1);
//             setTotalPages(Math.ceil((totalRecords - 1) / pageSize));

//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The OMR has been deleted.",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//           })
//           .catch((error) => {
//             console.error("Error deleting OMR:", error);
//             Swal.fire({
//               icon: "error",
//               title: "Error",
//               text:
//                 error.response?.data?.error ||
//                 "There was an issue deleting the OMR data.",
//               toast: true,
//               position: "top-end",
//               showConfirmButton: false,
//               timer: 1500,
//             });
//           });
//       }
//     });
//   };

//   // Column definitions for AG Grid
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "SCHOOL(S)",
//         field: "school_id",
//         width: 300,
//         valueGetter: (params) => {
//           const ids = Array.isArray(params.data.school_id)
//             ? params.data.school_id
//             : [params.data.school_id];

//           if (loading) return "Loading...";

//           // Map IDs to names and handle missing ones
//           const names = ids.map((id) => schoolMap[id] || "Not Found");
//           return names.join(", ");
//         },
//       },
//       {
//         headerName: "COUNTRY",
//         field: "country",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "STATE",
//         field: "state",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "DISTRICT",
//         field: "district",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 130,
//       },
//       {
//         headerName: "CITY",
//         field: "city",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 130,
//       },
//       {
//         headerName: "SUBJECTS",
//         field: "subjects",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) =>
//           Array.isArray(params.value) ? params.value.join(", ") : params.value,
//       },
//       {
//         headerName: "CLASSES",
//         field: "classes",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 150,
//         valueFormatter: (params) =>
//           Array.isArray(params.value) ? params.value.join(", ") : params.value,
//       },
//       {
//         headerName: "TOTAL STUDENTS",
//         field: "student_count",
//         sortable: true,
//         filter: "agNumberColumnFilter",
//         width: 150,
//       },
//       {
//         headerName: "LEVEL",
//         field: "level",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 120,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         width: 150,
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Link to={`/omr/view/${params.data.id}`}>
//               <UilEye style={{ color: "#1230AE", cursor: "pointer" }} />
//             </Link>
//             <UilTrashAlt
//               onClick={() => handleDelete(params.data.id)}
//               style={{ color: "#FF8787", cursor: "pointer" }}
//             />
//             {/* <span
//               onClick={
//                 params.data.status === "Active"
//                   ? () => handleDownload(params.data.id, params.data.school)
//                   : undefined
//               }
//               style={{
//                 cursor:
//                   params.data.status === "Active" ? "pointer" : "allowed",
//               }}
//               title={
//                 params.data.status === "Inactive"
//                   ? "Download disabled: Status is inactive"
//                   : "Download PDF"
//               }
//             >
//               <img
//                 src={
//                   params.data.status === "Active"
//                     ? activeDownload
//                     : inActiveDownload
//                 }
//                 alt="Download"
//                 height="20px"
//                 width="20px"
//               />
//             </span> */}

//             {/* <span
//               onClick={() => handleDownload(params.data.id, params.data.school)}
//               style={{ cursor: "pointer" }}
//               title="Download PDF"
//             >
//               <img
//                 src={activeDownload}
//                 alt="Download"
//                 height="20px"
//                 width="20px"
//               />
//             </span> */}
//             <span
//               onClick={
//                 params.data.status === "Active"
//                   ? () => handleDownload(params.data.id, params.data.school)
//                   : undefined
//               }
//               style={{
//                 cursor:
//                   params.data.status === "Active" ? "pointer" : "not-allowed",
//                 opacity: params.data.status === "Active" ? 1 : 0.5,
//               }}
//               title={
//                 params.data.status === "Inactive"
//                   ? "Download disabled: Status is inactive"
//                   : "Download PDF"
//               }
//             >
//               <img
//                 src={
//                   params.data.status === "Active"
//                     ? activeDownload
//                     : inActiveDownload
//                 }
//                 alt="Download"
//                 height="20px"
//                 width="20px"
//               />
//             </span>
//           </div>
//         ),
//       },
//     ],
//     [handleDelete],
//   );

//   // Default column definitions
//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       sortable: true,
//       filter: true,
//       minWidth: 100,
//     }),
//     [],
//   );

//   // Handle grid ready
//   const onGridReady = (params) => {
//     gridApiRef.current = params.api;
//     params.api.autoSizeAllColumns();
//   };

//   // Handle filter changes for global search
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

//   // Handle row selection
//   const onSelectionChanged = () => {
//     const selectedRows = gridApiRef.current.getSelectedRows();
//     const newSelection = {};
//     selectedRows.forEach((row) => {
//       newSelection[row.id] = true;
//     });
//     setRowSelection(newSelection);
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
//         <Breadcrumb data={[{ name: "OMR" }]} />
//         <CreateButton link="/omr-create" />
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
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 rowSelection="multiple"
//                 onSelectionChanged={onSelectionChanged}
//                 suppressRowClickSelection={true}
//                 theme={customTheme}
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
//                   items per page
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
//                 <p
//                   style={{
//                     margin: "auto",
//                     color: "#6C757D",
//                     fontFamily: "'Poppins', sans-serif",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Showing {records.length} of {totalRecords} items
//                 </p>
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

import React, { useEffect, useState } from "react";
import {
  UilTrashAlt,
  UilEye,
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
import Breadcrumb from "../../CommonButton/Breadcrumb";
import CreateButton from "../../CommonButton/CreateButton";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import activeDownload from "../../../../public/download-active.png";
import inActiveDownload from "../../../../public/download-inactive.png";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [schoolMap, setSchoolMap] = useState({});

  // Checkbox states
  const [checkedRows, setCheckedRows] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);

  const pageSizes = [10, 20, 50, 100];

  // Fetch schools once
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/get/all-schools`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        const map = Object.fromEntries(list.map((s) => [s.id, s.school_name]));
        setSchoolMap(map);
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    };

    fetchSchools();
  }, []);

  // Fetch OMR data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/omr/omr-data`, {
          params: { page, limit: pageSize, search: searchTerm },
        });

        const { data, totalRecords, totalPages } = response.data;

        // Enrich school names
        const enriched = data.map((record) => {
          const schoolIds = Array.isArray(record.school_id)
            ? record.school_id
            : [record.school_id];

          const schoolNames = schoolIds
            .map((id) => schoolMap[id] || "Not Found")
            .join(", ");

          return {
            ...record,
            school_names: schoolNames,
          };
        });

        setRecords(enriched);
        setTotalRecords(totalRecords || data.length);
        setTotalPages(totalPages || Math.ceil(data.length / pageSize));
      } catch (error) {
        console.error("Error fetching OMR data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch OMR data.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchTerm, schoolMap]);

  // Handle download
  const handleDownload = async (id, school) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/omr/download/by-id/${id}`,
        { responseType: "blob" },
      );

      const contentDisposition = response.headers["content-disposition"];
      const filename =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `${school || "school"}_${id}.pdf`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `PDF for ${school || "school"} downloaded successfully.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.status === 404
            ? "PDF file not found."
            : "Failed to download PDF.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Handle delete
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
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Authentication token is missing.",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        axios
          .delete(`${API_BASE_URL}/api/omr/omr-data/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setTotalRecords((prev) => prev - 1);
            setTotalPages(Math.ceil((totalRecords - 1) / pageSize));

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The OMR has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting OMR:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                error.response?.data?.error ||
                "There was an issue deleting the OMR data.",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1500,
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
        <Breadcrumb data={[{ name: "OMR" }]} />
        <CreateButton link="/omr-create" />
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
          placeholder="Search by school, subject, city..."
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
            <p style={{ marginTop: 20, color: "#555" }}>Loading OMR data...</p>
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
              <Table stickyHeader sx={{ minWidth: 1200, border: "none" }}>
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
                      "School",
                      "Country",
                      "State",
                      "District",
                      "City",
                      "Subjects",
                      "Classes",
                      "Total Students",
                      "Level",
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
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} align="center" sx={{ py: 8 }}>
                        No OMR records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((row, index) => (
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
                        <TableCell>
                          {(page - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell>{row.school_names || "—"}</TableCell>
                        <TableCell>{row.country || "—"}</TableCell>
                        <TableCell>{row.state || "—"}</TableCell>
                        <TableCell>{row.district || "—"}</TableCell>
                        <TableCell>{row.city || "—"}</TableCell>
                        <TableCell>
                          {Array.isArray(row.subjects)
                            ? row.subjects.join(", ")
                            : row.subjects || "—"}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(row.classes)
                            ? row.classes.join(", ")
                            : row.classes || "—"}
                        </TableCell>
                        <TableCell>{row.student_count || "—"}</TableCell>
                        <TableCell>{row.level || "—"}</TableCell>
                        <TableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              justifyContent: "center",
                            }}
                          >
                            <Link to={`/omr/view/${row.id}`}>
                              <UilEye
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

                            <span
                              onClick={
                                row.status === "Active"
                                  ? () =>
                                      handleDownload(
                                        row.id,
                                        row.school_names || "school",
                                      )
                                  : undefined
                              }
                              style={{
                                cursor:
                                  row.status === "Active"
                                    ? "pointer"
                                    : "not-allowed",
                                opacity: row.status === "Active" ? 1 : 0.5,
                              }}
                              title={
                                row.status === "Inactive"
                                  ? "Download disabled: Status is inactive"
                                  : "Download PDF"
                              }
                            >
                              <img
                                src={
                                  row.status === "Active"
                                    ? activeDownload
                                    : inActiveDownload
                                }
                                alt="Download"
                                height="22"
                                width="22"
                              />
                            </span>
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
