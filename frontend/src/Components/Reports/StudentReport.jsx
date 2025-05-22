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
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     column: "",
//     direction: "asc",
//   });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const pageSizes = [10, 20, 50, 100];

//   useEffect(() => {
//     // Fetch data from the API when the component mounts
//     axios
//       .get(`${ API_BASE_URL }/api/get/allstudents`) // Your API URL here
//       .then((response) => {
//         setRecords(response.data);
//         setFilteredRecords(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the records!", error);
//       });
//   }, []);

//   const handleFilter = (event, column) => {
//     const value = event.target.value.toLowerCase();
//     const filtered = records.filter((row) =>
//       (row[column] || "").toString().toLowerCase().includes(value)
//     );
//     setFilteredRecords(filtered);
//     setPage(1);
//   };

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortConfig.column === column) {
//       direction = sortConfig.direction === "asc" ? "desc" : "asc";
//     }

//     let sortedData = [...filteredRecords];
//     sortedData.sort((a, b) => {
//       const aValue = a[column];
//       const bValue = b[column];
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return direction === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       } else {
//         return direction === "asc" ? aValue - bValue : bValue - aValue;
//       }
//     });

//     setFilteredRecords(sortedData);
//     setSortConfig({ column, direction });
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
//     if (page < Math.ceil(filteredRecords.length / pageSize)) setPage(page + 1);
//   };

//   const currentRecords = filteredRecords.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const [isAllChecked, setIsAllChecked] = useState(false);

//   const [checkedRows, setCheckedRows] = useState({});

//   const handleRowCheck = (id) => {
//     setCheckedRows((prevCheckedRows) => {
//       const newCheckedRows = { ...prevCheckedRows };
//       if (newCheckedRows[id]) {
//         delete newCheckedRows[id]; // Uncheck
//       } else {
//         newCheckedRows[id] = true; // Check
//       }
//       return newCheckedRows;
//     });
//   };

//   function handleClick(event) {
//     event.preventDefault();
//     console.info("You clicked a breadcrumb.");
//   }

//   const handleSelectAll = () => {
//     if (isAllChecked) {
//       setCheckedRows({}); // Uncheck all rows
//     } else {
//       const allChecked = filteredRecords.reduce((acc, row) => {
//         acc[row.id] = true; // Check all rows
//         return acc;
//       }, {});
//       setCheckedRows(allChecked);
//     }
//     setIsAllChecked(!isAllChecked);
//   };

//   useEffect(() => {
//     if (filteredRecords.every((row) => checkedRows[row.id])) {
//       setIsAllChecked(true);
//     } else {
//       setIsAllChecked(false);
//     }
//   }, [checkedRows, filteredRecords]);

//   // pdf generate codes--------------------------------------------//

//   const [exportType, setExportType] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleExportClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleExportClose = () => {
//     setAnchorEl(null);
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     let yPosition = 20;

//     // Group records by school_name
//     const groupedBySchool = records.reduce((acc, row) => {
//       if (!acc[row.school_name]) {
//         acc[row.school_name] = [];
//       }
//       acc[row.school_name].push(row);
//       return acc;
//     }, {});

//     // Define table headers
//     const headers = [
//       "Student Name",
//       "Class Name",
//       "Section",
//       "Mobile Number",
//       "Subject"
//     ];
//     const headerXPositions = [10, 50, 90, 110, 140]; // X positions for each column
//     const columnWidths = [40, 40, 20, 30, 60]; // Widths for each column

//     // Iterate through each school
//     Object.keys(groupedBySchool).forEach((schoolName) => {
//       // Add school name as heading
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text(schoolName, 10, yPosition);
//       yPosition += 10;

//       // Add table headers
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "bold");
//       headers.forEach((header, index) => {
//         doc.text(header, headerXPositions[index], yPosition);
//       });
//       yPosition += 5;

//       // Draw header underline
//       doc.setLineWidth(0.5);
//       doc.line(10, yPosition, 190, yPosition);
//       yPosition += 5;

//       // Add student records for this school
//       doc.setFont("helvetica", "normal");
//       groupedBySchool[schoolName].forEach((row) => {
//         const rowData = [
//           row.student_name,
//           row.class_name,
//           row.student_section,
//           row.mobile_number,
//           row.student_subject
//         ];
//         rowData.forEach((data, index) => {
//           doc.text(data.toString(), headerXPositions[index], yPosition, {
//             maxWidth: columnWidths[index]
//           });
//         });
//         yPosition += 10;

//         // Check if we need a new page
//         if (yPosition > 270) {
//           doc.addPage();
//           yPosition = 20;
//           // Re-add headers on new page
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

//       // Add extra space after each school
//       yPosition += 10;
//       if (yPosition > 270) {
//         doc.addPage();
//         yPosition = 20;
//       }
//     });

//     doc.save("school_report.pdf");
//     handleExportClose();
//   };

//   //excell generate codes ----------------------------------------------------------------//
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
//           <Breadcrumb data={[{ name: "Student Report" }]} />
//         </div>
//         <div className="d-flex justify-content-end">
//         <div
//           role="presentation"
//           onClick={handleClick}
//           className={`${styles.breadcrumb} my-1`}
//         >
//           {/* //export button */}
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
//       </div>

//       <div className={`${styles.tablecont} mt-3`}>
//         <table
//           className={`${styles.table} `}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow} pt-0 pb-0`}>
//               <th>
//                 <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
//               </th>
//               {[
//                 "school name",
//                 "student_name",
//                 "class_name",
//                 "student_section",
//                 "mobile number",
//                 "student_subject",
//               ].map((col) => (
//                 <th
//                   key={col}
//                   className={styles.sortableHeader}
//                   onClick={() => handleSort(col)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
//                     {getSortIcon(col)}
//                   </div>
//                 </th>
//               ))}
//               {/* <th>Action</th> */}
//             </tr>
//           </thead>
//           <tr
//             className={styles.filterRow}
//             style={{ fontFamily: "Nunito, sans-serif" }}
//           >
//             <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
//             {[
//               "school name",
//               "student_name",
//               "class_name",
//               "student_section",
//               "mobile number",
//               "student_subject",
//             ].map((col) => (
//               <th key={col}>
//                 <div className={styles.inputContainer}>
//                   <FaSearch className={styles.searchIcon} />
//                   <input
//                     type="text"
//                     placeholder={`Search ${col}`}
//                     onChange={(e) => handleFilter(e, col)}
//                     className={styles.filterInput}
//                   />
//                 </div>
//               </th>
//             ))}
//           </tr>
//           <tbody>
//             {currentRecords.map((row) => (
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
//                 <td>{row.student_subject}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//          {/* pagination */}
//                <div className="d-flex justify-content-between flex-wrap mt-2">
//                  <div
//                    className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//                  >
//                    <select
//                      value={pageSize}
//                      onChange={(e) => {
//                        const selectedSize = parseInt(e.target.value, 10);
//                        setPageSize(selectedSize);
//                        setPage(1);
//                      }}
//                      className={styles.pageSizeSelect}
//                    >
//                      {pageSizes.map((size) => (
//                        <option key={size} value={size}>
//                          {size}
//                        </option>
//                      ))}
//                    </select>
//                    <p className={`  my-auto text-secondary`}>data per Page</p>
//                  </div>

//                  <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//                    <label
//                      htmlFor="pageSize"
//                      style={{ fontFamily: "Nunito, sans-serif" }}
//                    >
//                      <p className={`  my-auto text-secondary`}>
//                        {filteredRecords.length} of {page}-
//                        {Math.ceil(filteredRecords.length / pageSize)}
//                      </p>
//                    </label>
//                  </div>

//                  <div className={`${styles.pagination} my-auto`}>
//                    <button
//                      onClick={handlePreviousPage}
//                      disabled={page === 1}
//                      className={styles.paginationButton}
//                    >
//                      <UilAngleLeftB />
//                    </button>

//                    {Array.from(
//                      { length: Math.ceil(filteredRecords.length / pageSize) },
//                      (_, i) => i + 1
//                    )
//                      .filter(
//                        (pg) =>
//                          pg === 1 ||
//                          pg === Math.ceil(filteredRecords.length / pageSize) ||
//                          Math.abs(pg - page) <= 2
//                      )
//                      .map((pg, index, array) => (
//                        <React.Fragment key={pg}>
//                          {index > 0 && pg > array[index - 1] + 1 && (
//                            <span className={styles.ellipsis}>...</span>
//                          )}
//                          <button
//                            onClick={() => setPage(pg)}
//                            className={`${styles.paginationButton} ${
//                              page === pg ? styles.activePage : ""
//                            }`}
//                          >
//                            {pg}
//                          </button>
//                        </React.Fragment>
//                      ))}

//                    <button
//                      onClick={handleNextPage}
//                      disabled={page === Math.ceil(filteredRecords.length / pageSize)}
//                      className={styles.paginationButton}
//                    >
//                      <UilAngleRightB />
//                    </button>
//                  </div>
//                </div>
//       </div>
//     </Mainlayout>
//   );
// }

// StudentReport.jsx
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
import Mainlayout from "../Layouts/Mainlayout";
import styles from "./../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";

export default function StudentReport() {
  const [records, setRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    column: "id",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});
  const pageSizes = [10, 20, 50, 100];

  // useEffect(() => {
  //   // Fetch data from the API with pagination, sorting, and filtering
  //   axios
  //     .get(`${API_BASE_URL}/api/get/student`, {
  //       params: {
  //         page,
  //         limit: pageSize,
  //         sortColumn: sortConfig.column,
  //         sortDirection: sortConfig.direction,
  //         filter: JSON.stringify(filters),
  //       },
  //     })
  //     .then((response) => {
  //       setRecords(response.data.students);
  //       setTotalPages(response.data.totalPages);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error fetching the records!", error);
  //     });
  // }, [page, pageSize, sortConfig, filters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student data from the API with pagination, sorting, and filtering
        const response = await axios.get(`${API_BASE_URL}/api/get/student`, {
          params: {
            page,
            limit: pageSize,
            sortColumn: sortConfig.column,
            sortDirection: sortConfig.direction,
            filter: JSON.stringify(filters),
          },
        });

        const students = response.data.students;

        // Process each student record to fetch class and subject details
        const enrichedStudents = await Promise.all(
          students.map(async (record) => {
            // Fetch class details for class_id
            let className = "Unknown Class"; // Fallback for class name
            if (record.class_name) {
              try {
                const classResponse = await axios.get(
                  `${API_BASE_URL}/api/class/${record.class_name}`
                );
                className = classResponse.data.name || "Unknown Class";
              } catch (error) {
                console.error(
                  `Failed to fetch class details for class_id: ${record.class_id}`,
                  error
                );
              }
            }

            // Fetch subject details for student_subject
            let subjectNames = ["Unknown Subject"]; // Fallback for subject names
            try {
              // Handle student_subject as array or JSON string
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

              // Fetch subject details for each ID
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

            // Return enriched record with className and subjectNames
            return {
              ...record,

              student_subject: subjectNames, // Store as array of subject names
              class_name: className,
            };
          })
        );

        // Update state with enriched student data
        setRecords(enrichedStudents);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("There was an error fetching the records!", error);
      }
    };

    fetchData();
  }, [page, pageSize, sortConfig, filters]);

  const handleFilter = (event, column) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [column]: value }));
    setPage(1);
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ column, direction });
    setPage(1);
  };

  const getSortIcon = (column) => {
    const isActive = sortConfig.column === column;
    const isAsc = sortConfig.direction === "asc";
    return (
      <div className={styles.sortIconsContainer}>
        <FaCaretUp
          className={`${styles.sortIcon} ${
            isActive && isAsc ? styles.activeSortIcon : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSort(column);
          }}
        />
        <FaCaretDown
          className={`${styles.sortIcon} ${
            isActive && !isAsc ? styles.activeSortIcon : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSort(column);
          }}
        />
      </div>
    );
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});

  const handleRowCheck = (id) => {
    setCheckedRows((prev) => {
      const newCheckedRows = { ...prev };
      if (newCheckedRows[id]) {
        delete newCheckedRows[id];
      } else {
        newCheckedRows[id] = true;
      }
      return newCheckedRows;
    });
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedRows({});
    } else {
      const allChecked = records.reduce((acc, row) => {
        acc[row.id] = true;
        return acc;
      }, {});
      setCheckedRows(allChecked);
    }
    setIsAllChecked(!isAllChecked);
  };

  useEffect(() => {
    if (records.every((row) => checkedRows[row.id])) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [checkedRows, records]);

  // PDF and Excel export (unchanged)
  const [exportType, setExportType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  //report pdf
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
      "Subject",
    ];
    const headerXPositions = [10, 50, 90, 110, 140];
    const columnWidths = [40, 40, 20, 30, 60];

    Object.keys(groupedBySchool).forEach((schoolName) => {
      // Add light blue header background
      doc.setFillColor(173, 216, 230); // Light blue color
      doc.rect(5, yPosition - 8, 200, 12, "F"); // Background rectangle

      // School name with enhanced styling
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 139); // Dark blue text
      doc.text(schoolName, 10, yPosition);
      yPosition += 15;

      // Table header with light gray background
      doc.setFillColor(240, 240, 240);
      doc.rect(5, yPosition - 5, 200, 8, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Reset to black
      headers.forEach((header, index) => {
        doc.text(header, headerXPositions[index], yPosition);
      });
      yPosition += 5;
      doc.setLineWidth(0.5);
      doc.line(10, yPosition, 190, yPosition);
      yPosition += 5;

      doc.setFont("helvetica", "normal");
      groupedBySchool[schoolName].forEach((row, rowIndex) => {
        // Alternate row background for better readability
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

    doc.save("school_report.pdf");
    handleExportClose();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "School Report");
    XLSX.writeFile(wb, "school_report.xlsx");
    handleExportClose();
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "Student Report" }]} />
        </div>
        <div className="d-flex justify-content-end">
          <Box display="flex" justifyContent="flex-end" p={0}>
            <Button onClick={handleExportClick} variant="contained">
              Export <FaCaretDown />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleExportClose}
            >
              <MenuItem onClick={exportPDF}>Export as PDF</MenuItem>
              <MenuItem onClick={exportExcel}>Export as Excel</MenuItem>
            </Menu>
          </Box>
        </div>
      </div>

      <div className={`${styles.tablecont} mt-3`}>
        <table
          className={`${styles.table}`}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <thead>
            <tr className={`${styles.headerRow} pt-0 pb-0`}>
              <th>
                <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
              </th>
              {[
                "school_name",
                "student_name",
                "class_name",
                "student_section",
                "mobile_number",
                "student_subject",
              ].map((col) => (
                <th
                  key={col}
                  className={styles.sortableHeader}
                  onClick={() => handleSort(col)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      {col.charAt(0).toUpperCase() +
                        col.slice(1).replace("_", " ")}
                    </span>
                    {getSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
            <tr
              className={styles.filterRow}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
              {[
                "school_name",
                "student_name",
                "class_name",
                "student_section",
                "mobile_number",
                "student_subject",
              ].map((col) => (
                <th key={col}>
                  <div className={styles.inputContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder={`Search ${col.replace("_", " ")}`}
                      onChange={(e) => handleFilter(e, col)}
                      className={styles.filterInput}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((row) => (
              <tr
                key={row.id}
                className={styles.dataRow}
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                <td>
                  <Checkbox
                    checked={!!checkedRows[row.id]}
                    onChange={() => handleRowCheck(row.id)}
                  />
                </td>
                <td>{row.school_name}</td>
                <td>{row.student_name}</td>
                <td>{row.class_name}</td>
                <td>{row.student_section}</td>
                <td>{row.mobile_number}</td>
                {/* <td>{row.student_subject}</td> */}
                <td>
                  {Array.isArray(row.student_subject)
                    ? row.student_subject.map((subject) => subject).join(", ")
                    : JSON.parse(row.student_subject || "[]")
                        .map((subject) => subject)
                        .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-between flex-wrap mt-2">
          <div
            className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
          >
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className={styles.pageSizeSelect}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <p className={`my-auto text-secondary`}>data per Page</p>
          </div>

          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <label
              htmlFor="pageSize"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <p className={`my-auto text-secondary`}>
                Page {page} of {totalPages}
              </p>
            </label>
          </div>

          <div className={`${styles.pagination} my-auto`}>
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={styles.paginationButton}
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
                    <span className={styles.ellipsis}>...</span>
                  )}
                  <button
                    onClick={() => setPage(pg)}
                    className={`${styles.paginationButton} ${
                      page === pg ? styles.activePage : ""
                    }`}
                  >
                    {pg}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={styles.paginationButton}
            >
              <UilAngleRightB />
            </button>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}
