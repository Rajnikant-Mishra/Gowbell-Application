// // StudentReport.jsx
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

// export default function StudentReport() {
//   const [records, setRecords] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [sortConfig, setSortConfig] = useState({
//     column: "id",
//     direction: "asc",
//   });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [filters, setFilters] = useState({});
//   const pageSizes = [10, 20, 50, 100];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch student data from the API with pagination, sorting, and filtering
//         const response = await axios.get(`${API_BASE_URL}/api/get/student`, {
//           params: {
//             page,
//             limit: pageSize,
//             sortColumn: sortConfig.column,
//             sortDirection: sortConfig.direction,
//             filter: JSON.stringify(filters),
//           },
//         });

//         const students = response.data.students;

//         // Process each student record to fetch class and subject details
//         const enrichedStudents = await Promise.all(
//           students.map(async (record) => {
//             // Fetch class details for class_id
//             let className = "Unknown Class"; // Fallback for class name
//             if (record.class_name) {
//               try {
//                 const classResponse = await axios.get(
//                   `${API_BASE_URL}/api/class/${record.class_name}`
//                 );
//                 className = classResponse.data.name || "Unknown Class";
//               } catch (error) {
//                 console.error(
//                   `Failed to fetch class details for class_id: ${record.class_id}`,
//                   error
//                 );
//               }
//             }

//             // Fetch subject details for student_subject
//             let subjectNames = ["Unknown Subject"]; // Fallback for subject names
//             try {
//               // Handle student_subject as array or JSON string
//               let subjectIds = [];
//               if (typeof record.student_subject === "string") {
//                 try {
//                   subjectIds = JSON.parse(record.student_subject || "[]");
//                 } catch (e) {
//                   console.error(
//                     `Invalid JSON for student_subject: ${record.student_subject}`,
//                     e
//                   );
//                 }
//               } else if (Array.isArray(record.student_subject)) {
//                 subjectIds = record.student_subject;
//               }

//               // Fetch subject details for each ID
//               if (subjectIds.length > 0) {
//                 subjectNames = await Promise.all(
//                   subjectIds.map(async (subjectId) => {
//                     try {
//                       const subjectResponse = await axios.get(
//                         `${API_BASE_URL}/api/subject/${subjectId}`
//                       );
//                       return subjectResponse.data.name || "Unknown Subject";
//                     } catch (error) {
//                       console.error(
//                         `Failed to fetch subject details for subject_id: ${subjectId}`,
//                         error
//                       );
//                       return "Unknown Subject";
//                     }
//                   })
//                 );
//               }
//             } catch (error) {
//               console.error(
//                 `Error processing student_subject for record: ${record.id}`,
//                 error
//               );
//             }

//             // Return enriched record with className and subjectNames
//             return {
//               ...record,

//               student_subject: subjectNames, // Store as array of subject names
//               class_name: className,
//             };
//           })
//         );

//         // Update state with enriched student data
//         setRecords(enrichedStudents);
//         setTotalPages(response.data.totalPages);
//       } catch (error) {
//         console.error("There was an error fetching the records!", error);
//       }
//     };

//     fetchData();
//   }, [page, pageSize, sortConfig, filters]);

//   const handleFilter = (event, column) => {
//     const value = event.target.value;
//     setFilters((prev) => ({ ...prev, [column]: value }));
//     setPage(1);
//   };

//   const handleSort = (column) => {
//     let direction = "asc";
//     if (sortConfig.column === column) {
//       direction = sortConfig.direction === "asc" ? "desc" : "asc";
//     }
//     setSortConfig({ column, direction });
//     setPage(1);
//   };

//   const getSortIcon = (column) => {
//     const isActive = sortConfig.column === column;
//     const isAsc = sortConfig.direction === "asc";
//     return (
//       <div className={styles.sortIconsContainer}>
//         <FaCaretUp
//           className={`${styles.sortIcon} ${
//             isActive && isAsc ? styles.activeSortIcon : ""
//           }`}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleSort(column);
//           }}
//         />
//         <FaCaretDown
//           className={`${styles.sortIcon} ${
//             isActive && !isAsc ? styles.activeSortIcon : ""
//           }`}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleSort(column);
//           }}
//         />
//       </div>
//     );
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [checkedRows, setCheckedRows] = useState({});

//   const handleRowCheck = (id) => {
//     setCheckedRows((prev) => {
//       const newCheckedRows = { ...prev };
//       if (newCheckedRows[id]) {
//         delete newCheckedRows[id];
//       } else {
//         newCheckedRows[id] = true;
//       }
//       return newCheckedRows;
//     });
//   };

//   const handleSelectAll = () => {
//     if (isAllChecked) {
//       setCheckedRows({});
//     } else {
//       const allChecked = records.reduce((acc, row) => {
//         acc[row.id] = true;
//         return acc;
//       }, {});
//       setCheckedRows(allChecked);
//     }
//     setIsAllChecked(!isAllChecked);
//   };

//   useEffect(() => {
//     if (records.every((row) => checkedRows[row.id])) {
//       setIsAllChecked(true);
//     } else {
//       setIsAllChecked(false);
//     }
//   }, [checkedRows, records]);

//   // PDF and Excel export (unchanged)
//   const [exportType, setExportType] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleExportClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleExportClose = () => {
//     setAnchorEl(null);
//   };

//   //report pdf
//   const exportPDF = () => {
//     const doc = new jsPDF();
//     let yPosition = 20;

//     const groupedBySchool = records.reduce((acc, row) => {
//       if (!acc[row.school_name]) acc[row.school_name] = [];
//       acc[row.school_name].push(row);
//       return acc;
//     }, {});

//     const headers = [
//       "Student Name",
//       "Class Name",
//       "Section",
//       "Mobile Number",
//       "Subject",
//     ];
//     const headerXPositions = [10, 50, 90, 110, 140];
//     const columnWidths = [40, 40, 20, 30, 60];

//     Object.keys(groupedBySchool).forEach((schoolName) => {
//       // Add light blue header background
//       doc.setFillColor(173, 216, 230); // Light blue color
//       doc.rect(5, yPosition - 8, 200, 12, "F"); // Background rectangle

//       // School name with enhanced styling
//       doc.setFontSize(16);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(0, 0, 139); // Dark blue text
//       doc.text(schoolName, 10, yPosition);
//       yPosition += 15;

//       // Table header with light gray background
//       doc.setFillColor(240, 240, 240);
//       doc.rect(5, yPosition - 5, 200, 8, "F");

//       doc.setFontSize(10);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(0, 0, 0); // Reset to black
//       headers.forEach((header, index) => {
//         doc.text(header, headerXPositions[index], yPosition);
//       });
//       yPosition += 5;
//       doc.setLineWidth(0.5);
//       doc.line(10, yPosition, 190, yPosition);
//       yPosition += 5;

//       doc.setFont("helvetica", "normal");
//       groupedBySchool[schoolName].forEach((row, rowIndex) => {
//         // Alternate row background for better readability
//         if (rowIndex % 2 === 0) {
//           doc.setFillColor(245, 245, 245);
//           doc.rect(5, yPosition - 5, 200, 10, "F");
//         }

//         const rowData = [
//           row.student_name,
//           row.class_name,
//           row.student_section,
//           row.mobile_number,
//           row.student_subject,
//         ];
//         rowData.forEach((data, index) => {
//           doc.text(data.toString(), headerXPositions[index], yPosition, {
//             maxWidth: columnWidths[index],
//           });
//         });
//         yPosition += 10;

//         if (yPosition > 270) {
//           doc.addPage();
//           yPosition = 20;
//           doc.setFillColor(240, 240, 240);
//           doc.rect(5, yPosition - 5, 200, 8, "F");
//           doc.setFontSize(10);
//           doc.setFont("helvetica", "bold");
//           headers.forEach((header, index) => {
//             doc.text(header, headerXPositions[index], yPosition);
//           });
//           yPosition += 5;
//           doc.setLineWidth(0.5);
//           doc.line(10, yPosition, 190, yPosition);
//           yPosition += 5;
//           doc.setFont("helvetica", "normal");
//         }
//       });

//       yPosition += 10;
//       if (yPosition > 270) {
//         doc.addPage();
//         yPosition = 20;
//       }
//     });

//     doc.save("school_report.pdf");
//     handleExportClose();
//   };

//   const exportExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(records);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "School Report");
//     XLSX.writeFile(wb, "school_report.xlsx");
//     handleExportClose();
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "Student Report" }]} />
//         </div>
//         <div className="d-flex justify-content-end">
//           <Box display="flex" justifyContent="flex-end" p={0}>
//             <Button onClick={handleExportClick} variant="contained">
//               Export <FaCaretDown />
//             </Button>
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleExportClose}
//             >
//               <MenuItem onClick={exportPDF}>Export as PDF</MenuItem>
//               <MenuItem onClick={exportExcel}>Export as Excel</MenuItem>
//             </Menu>
//           </Box>
//         </div>
//       </div>

//       <div className={`${styles.tablecont} mt-3`}>
//         <table
//           className={`${styles.table}`}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow} pt-0 pb-0`}>
//               <th>
//                 <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
//               </th>
//               {[
//                 "school_name",
//                 "student_name",
//                 "class_name",
//                 "student_section",
//                 "mobile_number",
//                 "student_subject",
//               ].map((col) => (
//                 <th
//                   key={col}
//                   className={styles.sortableHeader}
//                   onClick={() => handleSort(col)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span>
//                       {col.charAt(0).toUpperCase() +
//                         col.slice(1).replace("_", " ")}
//                     </span>
//                     {getSortIcon(col)}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//             <tr
//               className={styles.filterRow}
//               style={{ fontFamily: "Nunito, sans-serif" }}
//             >
//               <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
//               {[
//                 "school_name",
//                 "student_name",
//                 "class_name",
//                 "student_section",
//                 "mobile_number",
//                 "student_subject",
//               ].map((col) => (
//                 <th key={col}>
//                   <div className={styles.inputContainer}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                       type="text"
//                       placeholder={`Search ${col.replace("_", " ")}`}
//                       onChange={(e) => handleFilter(e, col)}
//                       className={styles.filterInput}
//                     />
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {records.map((row) => (
//               <tr
//                 key={row.id}
//                 className={styles.dataRow}
//                 style={{ fontFamily: "Nunito, sans-serif" }}
//               >
//                 <td>
//                   <Checkbox
//                     checked={!!checkedRows[row.id]}
//                     onChange={() => handleRowCheck(row.id)}
//                   />
//                 </td>
//                 <td>{row.school_name}</td>
//                 <td>{row.student_name}</td>
//                 <td>{row.class_name}</td>
//                 <td>{row.student_section}</td>
//                 <td>{row.mobile_number}</td>
//                 {/* <td>{row.student_subject}</td> */}
//                 <td>
//                   {Array.isArray(row.student_subject)
//                     ? row.student_subject.map((subject) => subject).join(", ")
//                     : JSON.parse(row.student_subject || "[]")
//                         .map((subject) => subject)
//                         .join(", ")}
//                 </td>
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
//             <p className={`my-auto text-secondary`}>data per Page</p>
//           </div>

//           <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//             <label
//               htmlFor="pageSize"
//               style={{ fontFamily: "Nunito, sans-serif" }}
//             >
//               <p className={`my-auto text-secondary`}>
//                 Page {page} of {totalPages}
//               </p>
//             </label>
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

export default function StudentReport() {
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
        const response = await axios.get(`${API_BASE_URL}/api/get/student`, {
          params: { page, limit: pageSize, search: searchTerm },
        });

        const { students, totalRecords, totalPages } = response.data;

        const formattedData = await Promise.all(
          students.map(async (record) => {
            try {
              let className = "Unknown Class";
              if (record.class_name) {
                try {
                  const classResponse = await axios.get(
                    `${API_BASE_URL}/api/class/${record.class_name}`
                  );
                  className = classResponse.data.name || "Unknown Class";
                } catch (error) {
                  console.error(
                    `Failed to fetch class details for class_id: ${record.class_name}`,
                    error
                  );
                }
              }

              let subjectNames = ["Unknown Subject"];
              try {
                let subjectIds = [];
                if (typeof record.student_subject === "string") {
                  try {
                    subjectIds = JSON.parse(record.student_subject || "[]");
                  } catch (e) {
                    console.error(
                      `Invalid JSON for student_subject: ${record.student_subject}`,
                      e
                    );
                  }
                } else if (Array.isArray(record.student_subject)) {
                  subjectIds = record.student_subject;
                }

                if (subjectIds.length > 0) {
                  subjectNames = await Promise.all(
                    subjectIds.map(async (subjectId) => {
                      try {
                        const subjectResponse = await axios.get(
                          `${API_BASE_URL}/api/subject/${subjectId}`
                        );
                        return subjectResponse.data.name || "Unknown Subject";
                      } catch (error) {
                        console.error(
                          `Failed to fetch subject details for subject_id: ${subjectId}`,
                          error
                        );
                        return "Unknown Subject";
                      }
                    })
                  );
                }
              } catch (error) {
                console.error(
                  `Error processing student_subject for record: ${record.id}`,
                  error
                );
              }

              return {
                ...record,
                student_subject: subjectNames.join(", "),
                class_name: className,
              };
            } catch (error) {
              console.error(`Error processing record: ${record.id}`, error);
              return {
                ...record,
                student_subject: "Unknown Subject",
                class_name: "Unknown Class",
              };
            }
          })
        );

        setRecords(formattedData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching student data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Failed to fetch student data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [page, pageSize, searchTerm]);

  const columnDefs = useMemo(
    () => [
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
        headerName: "STUDENT NAME",
        field: "student_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "CLASS NAME",
        field: "class_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "SECTION",
        field: "student_section",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "MOBILE NUMBER",
        field: "mobile_number",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "SUBJECTS",
        field: "student_subject",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 200,
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
    const doc = new jsPDF();
    let yPosition = 20;

    const groupedBySchool = records.reduce((acc, row) => {
      if (!acc[row.school_name]) acc[row.school_name] = [];
      acc[row.school_name].push(row);
      return acc;
    }, {});

    const headers = [
      "Student Name",
      "Class Name",
      "Section",
      "Mobile Number",
      "Subjects",
    ];
    const headerXPositions = [10, 50, 90, 110, 140];
    const columnWidths = [40, 40, 20, 30, 60];

    Object.keys(groupedBySchool).forEach((schoolName) => {
      doc.setFillColor(173, 216, 230);
      doc.rect(5, yPosition - 8, 200, 12, "F");
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 139);
      doc.text(schoolName, 10, yPosition);
      yPosition += 15;

      doc.setFillColor(240, 240, 240);
      doc.rect(5, yPosition - 5, 200, 8, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      headers.forEach((header, index) => {
        doc.text(header, headerXPositions[index], yPosition);
      });
      yPosition += 5;
      doc.setLineWidth(0.5);
      doc.line(10, yPosition, 190, yPosition);
      yPosition += 5;

      doc.setFont("helvetica", "normal");
      groupedBySchool[schoolName].forEach((row, rowIndex) => {
        if (rowIndex % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(5, yPosition - 5, 200, 10, "F");
        }

        const rowData = [
          row.student_name,
          row.class_name,
          row.student_section,
          row.mobile_number,
          row.student_subject,
        ];
        rowData.forEach((data, index) => {
          doc.text(data.toString(), headerXPositions[index], yPosition, {
            maxWidth: columnWidths[index],
          });
        });
        yPosition += 10;

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          doc.setFillColor(240, 240, 240);
          doc.rect(5, yPosition - 5, 200, 8, "F");
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          headers.forEach((header, index) => {
            doc.text(header, headerXPositions[index], yPosition);
          });
          yPosition += 5;
          doc.setLineWidth(0.5);
          doc.line(10, yPosition, 190, yPosition);
          yPosition += 5;
          doc.setFont("helvetica", "normal");
        }
      });

      yPosition += 10;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("student_report.pdf");
    setAnchorEl(null);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Report");
    XLSX.writeFile(wb, "student_report.xlsx");
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
          <Breadcrumb data={[{ name: "Student Report" }]} />
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