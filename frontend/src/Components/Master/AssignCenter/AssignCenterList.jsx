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

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const gridApiRef = useRef(null);
//   const pageSizes = [10, 20, 50, 100];



//   // Size columns to fit
//   const sizeColumnsToFit = useCallback(() => {
//     if (gridApiRef.current) {
//       gridApiRef.current.sizeColumnsToFit();
//     }
//   }, []);



//   // Handle session changes
//   useEffect(() => {
//     const handleSessionChange = () => {
//       setPage(1); // Reset to first page on session change
//     };
//     window.addEventListener("storage", handleSessionChange);
//     return () => window.removeEventListener("storage", handleSessionChange);
//   }, []);


//   // );

//   const handleDelete = useCallback(
//     (id) => {
//       Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//         customClass: { popup: "custom-swal-popup" },
//       }).then((result) => {
//         if (result.isConfirmed) {
//           const token = localStorage.getItem("token");
//           if (!token) {
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text: "Authentication token is missing.",
//               showConfirmButton: false,
//               timer: 2000,
//               toast: true,
//               background: "#fff",
//               customClass: { popup: "small-swal" },
//             });
//             return;
//           }

//           axios
//             .delete(`${API_BASE_URL}/api/e1/delete-exam/${id}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then(() => {
//               setRecords((prev) => prev.filter((record) => record.id !== id));
//               sizeColumnsToFit();
//               Swal.fire({
//                 position: "top-end",
//                 icon: "success",
//                 title: "Success!",
//                 text: "The exam has been deleted.",
//                 showConfirmButton: false,
//                 timer: 1000,
//                 timerProgressBar: true,
//                 toast: true,
//                 background: "#fff",
//                 customClass: { popup: "small-swal" },
//               });
//             })
//             .catch((error) => {
//               console.error("Error deleting exam:", error.message);
//               Swal.fire({
//                 position: "top-end",
//                 icon: "error",
//                 title: "Error!",
//                 text:
//                   error.response?.data?.error ||
//                   `There was an issue deleting the exam: ${error.message}`,
//                 showConfirmButton: false,
//                 timer: 2000,
//                 toast: true,
//                 background: "#fff",
//                 customClass: { popup: "small-swal" },
//               });
//             });
//         }
//       });
//     },
//     [sizeColumnsToFit]
//   );

//   // AG-Grid column definitions
//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "SCHOOL NAME",
//         field: "school_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100,
//         valueFormatter: (params) =>
//           typeof params.value === "string"
//             ? params.value.toUpperCase()
//             : params.value || "N/A",
//       },
//       {
//         headerName: "CLASS",
//         field: "class_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100,
//         valueGetter: (params) =>
//           params.data.class_name?.join(", ") || "No Classes",
//       },
//       {
//         headerName: "SUBJECTS",
//         field: "subject_name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100,
//         valueGetter: (params) =>
//           params.data.subject_name?.join(", ") || "No Subjects",
//       },
//       {
//         headerName: "LEVEL",
//         field: "level",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 80,
//         valueFormatter: (params) => params.value || "N/A",
//       },
//       {
//         headerName: "EXAM DATE",
//         field: "exam_date",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 120,
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 100,
//         valueFormatter: (params) =>
//           params.value
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : "N/A",
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         minWidth: 120,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         minWidth: 80,
//         cellRenderer: (params) => (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Link to={`/exam/update/${params.data.id}`}>
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

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 80,
//       flex: 1,
//     }),
//     []
//   );

//   const onGridReady = useCallback(
//     (params) => {
//       gridApiRef.current = params.api;
//       sizeColumnsToFit();
//     },
//     [sizeColumnsToFit]
//   );

//   const onGridSizeChanged = useCallback(() => {
//     sizeColumnsToFit();
//   }, [sizeColumnsToFit]);

//   const onFilterChanged = useCallback((params) => {
//     if (gridApiRef.current) {
//       const filterModel = gridApiRef.current.getFilterModel();
//       const searchValue = Object.values(filterModel)
//         .map((filter) => filter.filter)
//         .filter((value) => value && value.trim() !== "")
//         .join(" ")
//         .trim();

//       console.log("Filter changed, new search term:", searchValue);
//       setSearchTerm(searchValue);
//       setPage(1);
//     }
//   }, []);

//   const handlePreviousPage = useCallback(() => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   }, [page]);

//   const handleNextPage = useCallback(() => {
//     if (page < totalPages) {
//       setPage(page + 1);
//     }
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
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "Assign Center" }]} />
//         </div>
//         <div style={{ display: "flex", gap: "10px" }}>
//           {/* Placeholder for future bulk action implementation */}
//           {/* <div>Bulk Action (Upload/Download)</div> */}
//           <CreateButton link="/center-assign-form" />
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
//               style={{
//                 height: "500px",
//                 width: "100%",
//                 overflowX: "auto",
//                 position: "relative",
//               }}
//             >
//               {searchLoading && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: "10px",
//                     right: "10px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     background: "#fff",
//                     padding: "5px 10px",
//                     borderRadius: "5px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <div
//                     className="spinner"
//                     style={{
//                       border: "3px solid #f3f3f3",
//                       borderTop: "3px solid #1230AE",
//                       borderRadius: "50%",
//                       width: "16px",
//                       height: "16px",
//                       animation: "spin 1s linear infinite",
//                     }}
//                   />
//                   <span>Searching...</span>
//                 </div>
//               )}
//               <AgGridReact
//                 columnDefs={columnDefs}
//                 rowData={records}
//                 onGridReady={onGridReady}
//                 onGridSizeChanged={onGridSizeChanged}
//                 defaultColDef={defaultColDef}
//                 pagination={false}
//                 suppressPaginationPanel={true}
//                 animateRows={true}
//                 onFilterChanged={onFilterChanged}
//                 rowSelection="multiple"
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



import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../CommonButton/CreateButton";

export default function AssignCenterDataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const gridApiRef = useRef(null);
  const pageSizes = [10, 20, 50, 100];

  const sizeColumnsToFit = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.sizeColumnsToFit();
    }
  }, []);

  // ✅ Fetch Data
  const fetchAssignCenters = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/api/assign-center?page=${page}&limit=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data, total } = res.data;
      setRecords(data);
      setTotalRecords(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      console.error("Error fetching Assign Centers:", err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Unable to load assign center data.",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchAssignCenters();
  }, [fetchAssignCenters]);

  // ✅ Delete Function
  const handleDelete = useCallback(
    (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won’t be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE_URL}/api/assign-center/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Assign center deleted successfully.",
              timer: 1000,
              showConfirmButton: false,
            });
            fetchAssignCenters();
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Unable to delete assign center.",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        }
      });
    },
    [fetchAssignCenters]
  );

  // ✅ Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "COUNTRY",
        field: "country_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
      },
      {
        headerName: "STATE",
        field: "state_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
      },
      {
        headerName: "DISTRICT",
        field: "district_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 120,
      },
      {
        headerName: "CITY",
        field: "city_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
      },
      {
        headerName: "ASSIGN CENTER NAME",
        field: "assign_center_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 180,
      },
      {
        headerName: "SCHOOLS",
        field: "schools",
        minWidth: 200,
        valueGetter: (params) =>
          params.data.schools?.map((s) => s.name).join(", ") || "No Schools",
      },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 150,
      },
      {
        headerName: "ACTION",
        field: "action",
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link to={`/center-assign-form/${params.data.id}`}>
              <UilEditAlt style={{ color: "#1230AE", cursor: "pointer" }} />
            </Link>
            <UilTrashAlt
              onClick={() => handleDelete(params.data.id)}
              style={{ color: "#FF8787", cursor: "pointer" }}
            />
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 100,
    }),
    []
  );

  const onGridReady = useCallback((params) => {
    gridApiRef.current = params.api;
    sizeColumnsToFit();
  }, [sizeColumnsToFit]);

  const handlePreviousPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages]);

  const customTheme = {
    "--ag-font-size": "14px",
    "--ag-row-height": "40px",
    "--ag-header-background-color": "#1230AE",
    "--ag-header-foreground-color": "#FFFFFF",
    "--ag-grid-size": "6px",
    "--ag-cell-horizontal-padding": "8px",
    fontFamily: "'Poppins', sans-serif",
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
        <Breadcrumb data={[{ name: "Assign Center" }]} />
        <CreateButton link="/center-assign-form" />
      </div>

      <div
        style={{
          background: "white",
          padding: "1.5%",
          borderRadius: "5px",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #1230AE",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                animation: "spin 1s linear infinite",
              }}
            />
            <span>Loading...</span>
          </div>
        ) : (
          <>
            <div className="ag-theme-alpine" style={{ height: 500 }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={records}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                animateRows={true}
                suppressPaginationPanel={true}
                theme={customTheme}
              />
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setPage(1);
                  }}
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>{" "}
                per page
              </div>
              <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                  <UilAngleLeftB />
                </button>
                <span style={{ margin: "0 10px" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
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
