

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

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch inventory records with pagination and search
//         const inventoryResponse = await axios.get(
//           `${API_BASE_URL}/api/v1/inventory-paginate`,
//           {
//             params: { page, limit: pageSize, search: searchTerm },
//           }
//         );
//         const { inventory, totalRecords, totalPages } = inventoryResponse.data;

//         // Create maps for faster lookup
//         const itemsMap = {};
//         itemsData.forEach((item) => {
//           itemsMap[item.id] = item.name;
//         });

//         const subItemsMap = {};
//         subItemsData.forEach((subItem) => {
//           subItemsMap[subItem.id] = subItem.name;
//         });

//         // Format inventory data
//         const formattedData = await Promise.all(
//           inventory.map(async (record) => {
//             try {
//               const userResponse = await axios.get(
//                 `${API_BASE_URL}/api/u1/users/${record.created_by}`
//               );
//               const userName = userResponse.data.username;

//               return {
//                 ...record,
//                 date: record.date ? record.date.split("T")[0] : "", // Format date
//                 created_by: userName,
//                 item: itemsMap[record.item] || "Unknown Item",
//                 sub_item: subItemsMap[record.sub_item] || "Unknown Sub Item",
//               };
//             } catch (userError) {
//               console.error(
//                 `Failed to fetch user details for created_by: ${record.created_by}`,
//                 userError
//               );
//               return {
//                 ...record,
//                 date: record.date ? record.date.split("T")[0] : "",
//                 created_by: "Unknown User",
//                 item: itemsMap[record.item] || "Unknown Item",
//                 sub_item: subItemsMap[record.sub_item] || "Unknown Sub Item",
//               };
//             }
//           })
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
//           text: "Failed to fetch inventory data.",
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
//           .delete(`${API_BASE_URL}/api/v1/inventory/${id}`)
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
//               text: "There was an issue deleting the inventory.",
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
//         // Removed width to allow auto-sizing
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
//         // Removed width to allow auto-sizing
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
//     [handleDelete]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       filter: true,
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
//                     fontFamily: '"Poppins", sans-serif',
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


import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import CreateButton from "../../Components/CommonButton/CreateButton";
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
  const gridApiRef = useRef(null);
  const pageSizes = [10, 20, 50, 100];
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch inventory records with pagination and search
        const inventoryResponse = await axios.get(
          `${API_BASE_URL}/api/v1/inventory-paginate`,
          {
            params: { page, limit: pageSize, search: searchTerm },
          }
        );
        const { inventory, totalRecords, totalPages } = inventoryResponse.data;

        // Format inventory data
        const formattedData = await Promise.all(
          inventory.map(async (record) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const userName = userResponse.data.username;

              return {
                ...record,
                date: record.date ? record.date.split("T")[0] : "",
                created_by: userName,
              };
            } catch (userError) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                userError
              );
              return {
                ...record,
                date: record.date ? record.date.split("T")[0] : "",
                created_by: "Unknown User",
              };
            }
          })
        );

        setRecords(formattedData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Failed to fetch inventory data.",
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
          .delete(`${API_BASE_URL}/api/v1/inventory/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The inventory has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting inventory:", error);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text: "There was an issue deleting the inventory.",
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
        headerName: "DATE",
        field: "date",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "INVOICE NO",
        field: "invoice_no",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "ITEMS",
        field: "item",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "SUB ITEM",
        field: "sub_item",
        sortable: true,
        filter: "agTextColumnFilter",
      },
        {
        headerName: "SUB ITEM NAME",
        field: "sub_item_name",
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "QUANTITY",
        field: "quantity",
        sortable: true,
        filter: "agNumberColumnFilter",
        width: 120,
      },
      {
        headerName: "UNIT",
        field: "unit",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "PRICE",
        field: "price",
        sortable: true,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "SUPPLIER",
        field: "manufacturer_details",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) =>
          params.value
            ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
            : "",
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
            <Link to={`/inventory/${params.data.id}`}>
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
    [handleDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: true,
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

      setSearchTerm(searchValue);
      setPage(1);
    }
  };

  const onSelectionChanged = () => {
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();
      const newSelection = {};
      selectedNodes.forEach((node) => {
        newSelection[node.data.id] = true;
      });
      setRowSelection(newSelection);
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
        <div role="presentation">
          <Breadcrumb data={[{ name: "Inventory" }]} />
        </div>
        <div>
          <CreateButton link={"/create-inventory"} />
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
                rowData={records}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                pagination={false}
                suppressPaginationPanel={true}
                animateRows={true}
                onFilterChanged={onFilterChanged}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
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
                    fontFamily: "'Poppins', sans-serif",
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
                    fontFamily: "'Poppins', sans-serif",
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
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    {totalRecords} of {page}-{totalPages}
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
                    fontFamily: "'Poppins', sans-serif",
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
                            fontFamily: "'Poppins', sans-serif",
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
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        {pg}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  onClick={handleNextPage}
                  disabled={totalPages}
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
                    fontFamily: "'Poppins', sans-serif",
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