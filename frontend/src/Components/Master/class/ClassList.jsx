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
// import CreateButton from "../../CommonButton/CreateButton";
// import "../../Common-Css/DeleteSwal.css";
// import "../../Common-Css/Swallfire.css";

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

//   // Fetch roleDetails from localStorage
//   useEffect(() => {
//     const storedRoleDetails = JSON.parse(localStorage.getItem("roleDetails"));
//     if (storedRoleDetails) {
//       setRoleDetails(storedRoleDetails);
//     }
//   }, []);

//   // Fetch class data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class-paginate`, {
//           params: { page, limit: pageSize, search: searchTerm },
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
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               const { username, role } = userResponse.data;

//               const roleResponse = await axios.get(
//                 `${API_BASE_URL}/api/r1/role/${role}`
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

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       customClass: {
//         popup: "custom-swal-popup",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${API_BASE_URL}/api/class/${id}`)
//           .then(() => {
//             setRecords((prev) => prev.filter((record) => record.id !== id));
//             Swal.fire({
//               position: "top-end",
//               icon: "success",
//               title: "Success!",
//               text: "The class has been deleted.",
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
//             console.error("Error deleting class:", error);
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text: "There was an issue deleting the class.",
//               showConfirmButton: false,
//               timer: 2000,
//               toast: true,
//               background: "#fff",
//               customClass: {
//                 popup: "small-swal",
//               },
//             });
//           });
//       }
//     });
//   };

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "NAME",
//         field: "name",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 200,
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
//         width: 120,
//       },
//       {
//         headerName: "CREATED BY",
//         field: "created_by",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 200,
//         valueFormatter: (params) =>
//           params.value
//             ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
//             : "",
//       },
//       {
//         headerName: "CREATED AT",
//         field: "created_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 180,
//       },
//       {
//         headerName: "UPDATED AT",
//         field: "updated_at",
//         sortable: true,
//         filter: "agTextColumnFilter",
//         width: 180,
//       },
//       {
//         headerName: "ACTION",
//         field: "action",
//         sortable: false,
//         filter: false,
//         width: 120,
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
//               <Link to={`/class/update/${params.data.id}`}>
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
//     [Role, handleDelete]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: "agTextColumnFilter",
//       sortable: true,
//       minWidth: 100,
//       suppressFilterResetOnColumnChange: true,
//     }),
//     []
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
//           <Breadcrumb data={[{ name: "Class" }]} />
//         </div>
//         <div>
//           <CreateButton link={"/class/create"} />
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
//                 rowData={records}
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
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [Role, setRoleDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const pageSizes = [10, 20, 50, 100];
  const gridApiRef = React.useRef(null);

  // Fetch roleDetails from localStorage
  useEffect(() => {
    const storedRoleDetails = JSON.parse(localStorage.getItem("roleDetails"));
    if (storedRoleDetails) {
      setRoleDetails(storedRoleDetails);
    }
  }, []);

  // Fetch class data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/class-paginate`, {
          params: { page, limit: pageSize, search: searchTerm },
        });
        console.log("API Response:", response.data); // Debug log
        const {
          classes,
          totalRecords,
          totalPages,
          currentPage,
          nextPage,
          prevPage,
          itemsPerPage,
        } = response.data;

        if (!classes || !Array.isArray(classes)) {
          throw new Error("Invalid classes data received from API");
        }

        const offset = (currentPage - 1) * itemsPerPage;
        const formattedData = await Promise.all(
          classes.map(async (record, index) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const { username, role } = userResponse.data;

              const roleResponse = await axios.get(
                `${API_BASE_URL}/api/r1/role/${role}`
              );
              const { role_name } = roleResponse.data;

              return {
                sl_no: offset + index + 1,
                ...record,
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: `${username} (${role_name})`,
              };
            } catch (userRoleError) {
              console.error("Error fetching user/role data:", userRoleError);
              return {
                sl_no: offset + index + 1,
                ...record,
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: "Unknown User (Unknown Role)",
              };
            }
          })
        );

        setRecords(formattedData);
        setTotalRecords(totalRecords || 0);
        setTotalPages(totalPages || 0);
        console.log("Formatted Records:", formattedData); // Debug log
      } catch (error) {
        console.error("Error fetching class records:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Failed to fetch class data.",
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "custom-swal-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/api/class/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The class has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: {
                popup: "small-swal",
              },
            });
          })
          .catch((error) => {
            console.error("Error deleting class:", error);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text: "There was an issue deleting the class.",
              showConfirmButton: false,
              timer: 2000,
              toast: true,
              background: "#fff",
              customClass: {
                popup: "small-swal",
              },
            });
          });
      }
    });
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "NAME",
        field: "name",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed fixed width
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value,
      },
      {
        headerName: "STATUS",
        field: "status",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed fixed width
      },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed fixed width
        valueFormatter: (params) =>
          params.value
            ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
            : "",
      },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed fixed width
      },
      {
        headerName: "UPDATED AT",
        field: "updated_at",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed fixed width
      },
      {
        headerName: "ACTION",
        field: "action",
        sortable: false,
        filter: false,
        // Removed fixed width
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Role.permissions?.includes("UilEditAlt") && (
              <Link to={`/class/update/${params.data.id}`}>
                <UilEditAlt
                  style={{
                    color: "#1230AE",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                />
              </Link>
            )}
            {Role.permissions?.includes("UilTrashAlt") && (
              <UilTrashAlt
                onClick={() => handleDelete(params.data.id)}
                style={{
                  color: "#FF8787",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              />
            )}
          </div>
        ),
      },
    ],
    [Role]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 100,
      flex: 1, // Allow columns to stretch and fill available space
      suppressFilterResetOnColumnChange: true,
    }),
    []
  );

  const autoSizeStrategy = useMemo(
    () => ({
      type: "fitGridWidth", // Automatically fit columns to the grid's width
    }),
    []
  );

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.setAutoSizeStrategy(autoSizeStrategy); // Apply auto-size strategy
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
          <Breadcrumb data={[{ name: "Class" }]} />
        </div>
        <div>
          <CreateButton link={"/class/create"} />
        </div>
      </div>
      <div
        style={{
          background: "white",
          padding: "1.5%",
          borderRadius: "5px",
          marginTop: "0",
          width: "100%", // Ensure container takes full width
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div
              className="ag-theme-alpine"
              style={{ height: "500px", width: "100%" }} // Full width for grid
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={records}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                autoSizeStrategy={autoSizeStrategy} // Apply auto-size strategy
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                }}
              >
                <label style={{ fontFamily: "'Nunito', sans-serif" }}>
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