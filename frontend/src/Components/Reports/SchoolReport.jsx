// import React, { useEffect, useState } from "react";
// import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
// import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
// import Mainlayout from "../Layouts/Mainlayout";
// import styles from "./../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import axios from "axios";
// import { jsPDF } from "jspdf";
// import * as XLSX from "xlsx";
// import { Menu, MenuItem, Button, Box } from "@mui/material";
// import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";

// export default function SchoolReport() {
//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [sortConfig, setSortConfig] = useState({
//     column: "",
//     direction: "asc",
//   });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [error, setError] = useState(null);
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [checkedRows, setCheckedRows] = useState({});
//   const [exportType, setExportType] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const pageSizes = [10, 20, 50, 100];

//   useEffect(() => {
//     // Fetch data with pagination
//     axios
//       .get(`${API_BASE_URL}/api/get/schools`, {
//         params: { page, limit: pageSize },
//       })
//       .then((response) => {
//         setRecords(response.data.schools);
//         setFilteredRecords(response.data.schools);
//         setTotalPages(response.data.totalPages);
//         setTotalRecords(response.data.totalRecords);
//         setError(null);
//       })
//       .catch((error) => {
//         console.error("Error fetching records:", error);
//         setError("Failed to load school data. Please try again.");
//       });
//   }, [page, pageSize]);

//   const handleFilter = (event, column) => {
//     const value = event.target.value.toLowerCase();
//     const filtered = records.filter((row) =>
//       (row[column] || "").toString().toLowerCase().includes(value)
//     );
//     setFilteredRecords(filtered);
//     setPage(1); // Reset to first page on filter
//   };

//   const handleSort = (column) => {
//     let direction =
//       sortConfig.column === column && sortConfig.direction === "asc"
//         ? "desc"
//         : "asc";
//     let sortedData = [...filteredRecords].sort((a, b) => {
//       const aValue = a[column];
//       const bValue = b[column];
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return direction === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//       return direction === "asc" ? aValue - bValue : bValue - aValue;
//     });
//     setFilteredRecords(sortedData);
//     setSortConfig({ column, direction });
//   };

//   const getSortIcon = (column) => (
//     <div className={styles.sortIconsContainer}>
//       <FaCaretUp
//         className={`${styles.sortIcon} ${
//           sortConfig.column === column && sortConfig.direction === "asc"
//             ? styles.activeSortIcon
//             : ""
//         }`}
//         onClick={(e) => {
//           e.stopPropagation();
//           handleSort(column);
//         }}
//       />
//       <FaCaretDown
//         className={`${styles.sortIcon} ${
//           sortConfig.column === column && sortConfig.direction === "desc"
//             ? styles.activeSortIcon
//             : ""
//         }`}
//         onClick={(e) => {
//           e.stopPropagation();
//           handleSort(column);
//         }}
//       />
//     </div>
//   );

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   const handleRowCheck = (id) => {
//     setCheckedRows((prev) => {
//       const newChecked = { ...prev };
//       if (newChecked[id]) delete newChecked[id];
//       else newChecked[id] = true;
//       return newChecked;
//     });
//   };

//   const handleSelectAll = () => {
//     if (isAllChecked) {
//       setCheckedRows({});
//     } else {
//       const allChecked = filteredRecords.reduce((acc, row) => {
//         acc[row.id] = true;
//         return acc;
//       }, {});
//       setCheckedRows(allChecked);
//     }
//     setIsAllChecked(!isAllChecked);
//   };

//   useEffect(() => {
//     setIsAllChecked(filteredRecords.every((row) => checkedRows[row.id]));
//   }, [checkedRows, filteredRecords]);

//   const handleExportClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleExportClose = () => {
//     setAnchorEl(null);
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     // Define table columns
//     const headers = [
//       "Board",
//       "School",
//       "Email",
//       "Contact",
//       "State",
//       "District",
//       "City",
//       "Pincode",
//     ];

//     // Map filteredRecords to table data
//     const data = filteredRecords.map((row) => [
//       row.board,
//       row.school_name,
//       row.school_email,
//       row.school_contact_number,
//       row.state_name,
//       row.district_name,
//       row.city_name,
//       row.pincode,
//     ]);

//     // Add title
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0, 51, 102); // Dark blue
//     doc.text("School Report", 14, 15);

//     // Create table with AutoTable
//     doc.autoTable({
//       head: [headers],
//       body: data,
//       startY: 25,
//       theme: "striped", // Modern striped theme
//       styles: {
//         font: "helvetica",
//         fontSize: 9,
//         cellPadding: 3,
//         overflow: "linebreak",
//         minCellHeight: 6,
//       },
//       headStyles: {
//         fillColor: [135, 206, 235], // Sky blue header
//         textColor: [255, 255, 255], // White text
//         fontStyle: "bold",
//         fontSize: 10,
//         halign: "center",
//       },
//       bodyStyles: {
//         textColor: [50, 50, 50], // Dark gray text
//         lineColor: [200, 200, 200], // Light gray borders
//       },
//       alternateRowStyles: {
//         fillColor: [245, 245, 245], // Very light gray for alternate rows
//       },
//       margin: { top: 25, left: 14, right: 14 },
//       columnStyles: {
//         // Auto width is handled by autoTable, but we can set minimum widths
//         0: { minCellWidth: 15 }, // Board
//         1: { minCellWidth: 30 }, // School
//         2: { minCellWidth: 30 }, // Email
//         3: { minCellWidth: 20 }, // Contact
//         4: { minCellWidth: 15 }, // State
//         5: { minCellWidth: 15 }, // District
//         6: { minCellWidth: 15 }, // City
//         7: { minCellWidth: 12 }, // Pincode
//       },
//       didDrawPage: function (data) {
//         // Add page numbers
//         const pageCount = doc.internal.getNumberOfPages();
//         doc.setFontSize(8);
//         doc.setTextColor(100);
//         doc.text(
//           `Page ${data.pageNumber} of ${pageCount}`,
//           doc.internal.pageSize.width - 20,
//           doc.internal.pageSize.height - 10,
//           { align: "right" }
//         );
//       },
//     });

//     // Add footer
//     doc.setFontSize(8);
//     doc.setTextColor(100);
//     doc.text(
//       `Generated on ${new Date().toLocaleDateString()}`,
//       14,
//       doc.internal.pageSize.height - 10
//     );

//     doc.save("school_report.pdf");
//     handleExportClose();
//   };

//   const exportExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(filteredRecords);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "School Report");
//     XLSX.writeFile(wb, "school_report.xlsx");
//     handleExportClose();
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "School Report" }]} />
//         </div>
//         <Box display="flex" justifyContent="flex-end" p={0}>
//           <Button onClick={handleExportClick} variant="contained">
//             Export <FaCaretDown />
//           </Button>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleExportClose}
//           >
//             <MenuItem onClick={exportPDF}>Export as PDF</MenuItem>
//             <MenuItem onClick={exportExcel}>Export as Excel</MenuItem>
//           </Menu>
//         </Box>
//       </div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       <div className={`${styles.tablecont} mt-3`}>
//         <table
//           className={styles.table}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={styles.headerRow}>
//               <th>
//                 <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
//               </th>
//               {[
//                 "board",
//                 "school_name",
//                 "school_email",
//                 "school_contact_number",
//                 "state_name",
//                 "district_name",
//                 "city_name",
//                 "pincode",
//               ].map((col) => (
//                 <th
//                   key={col}
//                   className={styles.sortableHeader}
//                   onClick={() => handleSort(col)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span>
//                       {col.toUpperCase()}
//                     </span>
//                     {getSortIcon(col)}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//             <tr className={styles.filterRow}>
//               <th></th>
//               {[
//                 "board",
//                 "school_name",
//                 "school_email",
//                 "school_contact_number",
//                 "state_name",
//                 "district_name",
//                 "city_name",
//                 "pincode",
//               ].map((col) => (
//                 <th key={col}>
//                   <div className={styles.inputContainer}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                       type="text"
//                       placeholder={`Search ${col.replace(/_/g, " ")}`}
//                       onChange={(e) => handleFilter(e, col)}
//                       className={styles.filterInput}
//                     />
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredRecords.map((row) => (
//               <tr key={row.id} className={styles.dataRow}>
//                 <td>
//                   <Checkbox
//                     checked={!!checkedRows[row.id]}
//                     onChange={() => handleRowCheck(row.id)}
//                   />
//                 </td>
//                 <td>{row.board}</td>
//                 <td>{row.school_name}</td>
//                 <td>{row.school_email}</td>
//                 <td>{row.school_contact_number}</td>
//                 <td>{row.state_name}</td>
//                 <td>{row.district_name}</td>
//                 <td>{row.city_name}</td>
//                 <td>{row.pincode}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="d-flex justify-content-between flex-wrap mt-2">
//           <div
//             className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//           >
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(parseInt(e.target.value, 10));
//                 setPage(1);
//               }}
//               className={styles.pageSizeSelect}
//             >
//               {pageSizes.map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//             <p className="my-auto text-secondary">data per Page</p>
//           </div>

//           <div className="my-0 d-flex justify-content-center align-items-center">
//             <p className="my-auto text-secondary">
//               {totalRecords} records, Page {page} of {totalPages}
//             </p>
//           </div>

//           <div className={`${styles.pagination} my-auto`}>
//             <button
//               onClick={handlePreviousPage}
//               disabled={page === 1}
//               className={styles.paginationButton}
//             >
//               <UilAngleLeftB />
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1)
//               .filter(
//                 (pg) =>
//                   pg === 1 || pg === totalPages || Math.abs(pg - page) <= 2
//               )
//               .map((pg, index, array) => (
//                 <React.Fragment key={pg}>
//                   {index > 0 && pg > array[index - 1] + 1 && (
//                     <span className={styles.ellipsis}>...</span>
//                   )}
//                   <button
//                     onClick={() => setPage(pg)}
//                     className={`${styles.paginationButton} ${
//                       page === pg ? styles.activePage : ""
//                     }`}
//                   >
//                     {pg}
//                   </button>
//                 </React.Fragment>
//               ))}
//             <button
//               onClick={handleNextPage}
//               disabled={page === totalPages}
//               className={styles.paginationButton}
//             >
//               <UilAngleRightB />
//             </button>
//           </div>
//         </div>
//       </div>
//     </Mainlayout>
//   );
// }



import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UilAngleRightB, UilAngleLeftB, UilDownloadAlt } from "@iconscout/react-unicons";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";

export default function SchoolReport() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const gridApiRef = useRef(null);
  const pageSizes = [10, 20, 50, 100];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const schoolResponse = await axios.get(
          `${API_BASE_URL}/api/get/schools`,
          {
            params: { page, limit: pageSize, search: searchTerm },
          }
        );

        const { schools, totalRecords, totalPages } = schoolResponse.data;

        const formattedData = await Promise.all(
          schools.map(async (record) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const { username, role } = userResponse.data;

              let roleName = "Unknown Role";
              try {
                const roleResponse = await axios.get(
                  `${API_BASE_URL}/api/r1/role/${role}`
                );
                roleName = roleResponse.data.role_name || "Unknown Role";
              } catch (roleError) {
                console.error(
                  `Failed to fetch role name for role ID: ${role}`,
                  roleError
                );
              }

              return {
                ...record,
                created_by: `${username} (${roleName})`,
              };
            } catch (userError) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                userError
              );
              return {
                ...record,
                created_by: "Unknown User (Unknown Role)",
              };
            }
          })
        );

        setRecords(formattedData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching school data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Failed to fetch school data.",
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

  const columnDefs = useMemo(
    () => [
      {
        headerName: "BOARD",
        field: "board",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "SCHOOL NAME",
        field: "school_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 200,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value,
      },
      {
        headerName: "EMAIL",
        field: "school_email",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "CONTACT",
        field: "school_contact_number",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "STATE",
        field: "state_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "DISTRICT",
        field: "district_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CITY",
        field: "city_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "PINCODE",
        field: "pincode",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 100,
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

  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const headers = [
      "Board",
      "School Name",
      "Email",
      "Contact",
      "State",
      "District",
      "City",
      "Pincode",
      "Created By",
    ];

    const data = records.map((row) => [
      row.board || "",
      row.school_name || "",
      row.school_email || "",
      row.school_contact_number || "",
      row.state_name || "",
      row.district_name || "",
      row.city_name || "",
      row.pincode || "",
      row.created_by || "",
    ]);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text("School Report", 14, 15);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      theme: "striped",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
        minCellHeight: 6,
      },
      headStyles: {
        fillColor: [135, 206, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        textColor: [50, 50, 50],
        lineColor: [200, 200, 200],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 25, left: 14, right: 14 },
      columnStyles: {
        0: { minCellWidth: 15 }, // Board
        1: { minCellWidth: 30 }, // School Name
        2: { minCellWidth: 30 }, // Email
        3: { minCellWidth: 20 }, // Contact
        4: { minCellWidth: 15 }, // State
        5: { minCellWidth: 15 }, // District
        6: { minCellWidth: 15 }, // City
        7: { minCellWidth: 12 }, // Pincode
        8: { minCellWidth: 25 }, // Created By
      },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      },
    });

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    );

    doc.save("school_report.pdf");
    setAnchorEl(null);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "School Report");
    XLSX.writeFile(wb, "school_report.xlsx");
    setAnchorEl(null);
  };

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
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
          <Breadcrumb data={[{ name: "School Report" }]} />
        </div>
        <div>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleExportClick} variant="contained">
              Export <UilDownloadAlt style={{ marginLeft: "5px" }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleExportClose}
            >
              <MenuItem onClick={exportPDF}>Export as PDF</MenuItem>
              <MenuItem onClick={exportExcel}>Export as Excel</MenuItem>
            </Menu>
          </Box>
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
                    fontFamily: '"Poppins", sans-serif',
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
                    fontFamily: '"Poppins", sans-serif',
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
                      fontFamily: '"Poppins", sans-serif',
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
                    fontFamily: '"Poppins", sans-serif',
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
                            fontFamily: '"Poppins", sans-serif',
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
                          fontFamily: '"Poppins", sans-serif',
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
                    fontFamily: '"Poppins", sans-serif',
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