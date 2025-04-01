// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
// import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import styles from "./../../CommonTable/DataTable.module.css";
// import Checkbox from "@mui/material/Checkbox";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import jsPDF from "jspdf";
// // import "jspdf-autotable";
// // import OMRSheet from "./OMRSheet";
// // import ReactDOMServer from "react-dom/server";
// import ReactDOM from "react-dom";
// import { FaPlus } from "react-icons/fa";
// import JsBarcode from "jsbarcode";
// import OMRSheet from "./OMRSheet";
// import OMRSheet1 from "./OMRSheet1";

// export default function DataTable() {
//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     column: "",
//     direction: "asc",
//   });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [checkedRows, setCheckedRows] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("");

//   const pageSizes = [10, 20, 50, 100];

//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/e1/exams-with-student-details`)
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

//   const handleRowCheck = (id) => {
//     setCheckedRows((prevCheckedRows) => {
//       const newCheckedRows = { ...prevCheckedRows };
//       if (newCheckedRows[id]) {
//         delete newCheckedRows[id];
//       } else {
//         newCheckedRows[id] = true;
//       }
//       return newCheckedRows;
//     });
//   };

//   useEffect(() => {
//     if (filteredRecords.every((row) => checkedRows[row.id])) {
//       setIsAllChecked(true);
//     } else {
//       setIsAllChecked(false);
//     }
//   }, [checkedRows, filteredRecords]);

//   const handleGenerateClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleOptionChange = (e) => {
//     setSelectedOption(e.target.value);
//   };

  

//   const handleGeneratePDF = async () => {
//     const selectedRows = filteredRecords.filter((row) => checkedRows[row.id]);

//     if (selectedRows.length === 0) {
//       alert("Please select at least one row to generate the PDF.");
//       return;
//     }

//     // Import html2canvas and jsPDF dynamically
//     const html2canvas = (await import("html2canvas")).default;
//     const jsPDF = (await import("jspdf")).default;

//     // Create a new PDF document
//     const pdf = new jsPDF("p", "mm", "a4");

//     // Process each selected row
//     for (const row of selectedRows) {
//       const { school, level, students, student_name } = row;

//       // Process each student in the row
//       for (const student of students) {
//         // Create a temporary div to render the OMR sheet
//         const tempDiv = document.createElement("div");
//         tempDiv.style.position = "absolute";
//         tempDiv.style.left = "-9999px";
//         document.body.appendChild(tempDiv);

//         // Render the OMRSheet component for this student
//         ReactDOM.render(
//           <OMRSheet
//             schoolName={school}
//             level={level}
//             student={student.student_name}
//             date={new Date().toLocaleDateString()}
//           />,
//           tempDiv
//         );

//         // Wait for the component to render
//         await new Promise((resolve) => setTimeout(resolve, 100));

//         // Convert the HTML to canvas
//         const canvas = await html2canvas(tempDiv, {
//           scale: 2,
//           useCORS: true,
//           allowTaint: true,
//         });

//         // Add the canvas as an image to the PDF
//         const imgData = canvas.toDataURL("image/png");
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size in mm

//         // Clean up
//         document.body.removeChild(tempDiv);

//         // Add a new page if this isn't the last student
//         if (
//           student !== students[students.length - 1] ||
//           row !== selectedRows[selectedRows.length - 1]
//         ) {
//           pdf.addPage();
//         }
//       }
//     }

//     // Save the PDF
//     pdf.save("OMR_Sheets.pdf");
//     setIsModalOpen(false);

//     // Store OMR data in the database
//     await storeOMRData(selectedRows);
//   };

//   //store omr sheet data in dtabase
//   const storeOMRData = async (selectedRows) => {
//     try {
//       const payload = selectedRows.flatMap((row) =>
//         row.students.map((student) => ({
//           school: row.school,
//           level: row.level,
//           student_id: student.student_id,
//           student_name: student.student_name,
//           roll_number: student.roll_number,
//           is_checked: checkedRows[row.id] ? 1 : 0, // Ensure boolean values are properly stored
//         }))
//       );

//       // Send data to the backend
//       const response = await axios.post(
//         `${API_BASE_URL}/api/omr/generator`,
//         payload
//       );

//       if (response.status === 201) {
//         console.log("OMR data stored successfully!");
//       } else {
//         console.error("Failed to store OMR data.");
//       }
//     } catch (error) {
//       console.error("Error storing OMR data:", error);
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "OMR" }]} />
//         </div>
//         <div>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               width: "auto",
//               gap: "10px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: "10px",
//                 flexDirection: "column",
//                 borderRadius: "15px",
//               }}
//             >
//               <div
//                 style={{
//                   cursor: "pointer",
//                   padding: "14px 12px",
//                   display: "flex",
//                   alignItems: "center",
//                   height: "27px",
//                   fontSize: "14px",
//                   borderRadius: "5px",
//                   color: "#1230AE",
//                   textDecoration: "none",
//                   fontFamily: '"Poppins", sans-serif',
//                 }}
//                 onClick={handleGenerateClick}
//               >
//                 <FaPlus />
//                 <span>Generate Omr</span>
//               </div>
//             </div>
//           </div>

//           {isModalOpen && (
//             <div
//               style={{
//                 position: "fixed",
//                 top: "0",
//                 left: "0",
//                 width: "100%",
//                 height: "100%",
//                 backgroundColor: "rgba(0, 0, 0, 0.5)",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <div
//                 style={{
//                   backgroundColor: "#fff",
//                   padding: "20px",
//                   borderRadius: "10px",
//                   width: "300px",
//                   textAlign: "center",
//                   position: "relative",
//                 }}
//               >
//                 {/* Close Button */}
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   style={{
//                     position: "absolute",
//                     top: "10px",
//                     right: "10px",
//                     background: "none",
//                     border: "none",
//                     fontSize: "16px",
//                     cursor: "pointer",
//                     color: "#333",
//                   }}
//                 >
//                   ✖
//                 </button>

//                 <h3>Select Mode</h3>
//                 <select
//                   value={selectedOption || "online"}
//                   onChange={handleOptionChange}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     margin: "10px 0",
//                     borderRadius: "5px",
//                     border: "1px solid #ccc",
//                   }}
//                 >
//                   <option value="online">Online</option>
//                   <option value="offline">Offline</option>
//                 </select>
//                 <button
//                   onClick={() =>
//                     handleGeneratePDF(
//                       filteredRecords.filter((row) => checkedRows[row.id])
//                     )
//                   }
//                   style={{
//                     padding: "10px 20px",
//                     backgroundColor: "#1230ae",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Generate OMR
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className={`${styles.tablecont} mt-0`}>
//         <table
//           className={`${styles.table} `}
//           style={{ fontFamily: "Nunito, sans-serif" }}
//         >
//           <thead>
//             <tr className={`${styles.headerRow} pt-0 pb-0`}>
//               {["id", "school name", "total students", "level"].map((col) => (
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
//             </tr>
//           </thead>
//           <tr
//             className={styles.filterRow}
//             style={{ fontFamily: "Nunito, sans-serif" }}
//           >
//             <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
//             {["id", "school name", "total students", "level"].map((col) => (
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
//             <th></th>
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
//                 <td>{row.school}</td>
//                 <td>{row.student_count}</td>
//                 <td>{row.level}</td>
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
//                 const selectedSize = parseInt(e.target.value, 10);
//                 setPageSize(selectedSize);
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
//             <p className={`  my-auto text-secondary`}>data per Page</p>
//           </div>

//           <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//             <label
//               htmlFor="pageSize"
//               style={{ fontFamily: "Nunito, sans-serif" }}
//             >
//               <p className={`  my-auto text-secondary`}>
//                 {filteredRecords.length} of {page}-
//                 {Math.ceil(filteredRecords.length / pageSize)}
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

//             {Array.from(
//               { length: Math.ceil(filteredRecords.length / pageSize) },
//               (_, i) => i + 1
//             )
//               .filter(
//                 (pg) =>
//                   pg === 1 ||
//                   pg === Math.ceil(filteredRecords.length / pageSize) ||
//                   Math.abs(pg - page) <= 2
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
//               disabled={page === Math.ceil(filteredRecords.length / pageSize)}
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


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import styles from "./../../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import jsPDF from "jspdf";
import { FaPlus } from "react-icons/fa";
import JsBarcode from "jsbarcode";
import ReactDOM from "react-dom";
import OMRSheet from "./OMRSheet";
import OMRSheet1 from "./OMRSheet1";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("online");
  const [selectedBubbleOption, setSelectedBubbleOption] = useState("50"); // New state for bubble selection

  const pageSizes = [10, 20, 50, 100];

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/e1/exams-with-student-details`)
      .then((response) => {
        setRecords(response.data);
        setFilteredRecords(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the records!", error);
      });
  }, []);

  const handleFilter = (event, column) => {
    const value = event.target.value.toLowerCase();
    const filtered = records.filter((row) =>
      (row[column] || "").toString().toLowerCase().includes(value)
    );
    setFilteredRecords(filtered);
    setPage(1);
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    let sortedData = [...filteredRecords];
    sortedData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    setFilteredRecords(sortedData);
    setSortConfig({ column, direction });
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
    if (page < Math.ceil(filteredRecords.length / pageSize)) setPage(page + 1);
  };

  const currentRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleRowCheck = (id) => {
    setCheckedRows((prevCheckedRows) => {
      const newCheckedRows = { ...prevCheckedRows };
      if (newCheckedRows[id]) {
        delete newCheckedRows[id];
      } else {
        newCheckedRows[id] = true;
      }
      return newCheckedRows;
    });
  };

  useEffect(() => {
    if (filteredRecords.every((row) => checkedRows[row.id])) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [checkedRows, filteredRecords]);

  const handleGenerateClick = () => {
    setIsModalOpen(true);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleBubbleOptionChange = (e) => {
    setSelectedBubbleOption(e.target.value);
  };

  const handleGeneratePDF = async () => {
    const selectedRows = filteredRecords.filter((row) => checkedRows[row.id]);

    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate the PDF.");
      return;
    }

    // Import html2canvas and jsPDF dynamically
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    // Create a new PDF document
    const pdf = new jsPDF("p", "mm", "a4");

    // Process each selected row
    for (const row of selectedRows) {
      const { school, level, students } = row;

      // Process each student in the row
      for (const student of students) {
        // Create a temporary div to render the OMR sheet
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        document.body.appendChild(tempDiv);

        // Render the appropriate OMRSheet component based on bubble selection
        ReactDOM.render(
          selectedBubbleOption === "60" ? (
            <OMRSheet1
              schoolName={school}
              level={level}
              student={student.student_name}
              date={new Date().toLocaleDateString()}
            />
          ) : (
            <OMRSheet
              schoolName={school}
              level={level}
              student={student.student_name}
              date={new Date().toLocaleDateString()}
            />
          ),
          tempDiv
        );

        // Wait for the component to render
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Convert the HTML to canvas
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        // Add the canvas as an image to the PDF
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size in mm

        // Clean up
        document.body.removeChild(tempDiv);

        // Add a new page if this isn't the last student
        if (
          student !== students[students.length - 1] ||
          row !== selectedRows[selectedRows.length - 1]
        ) {
          pdf.addPage();
        }
      }
    }

    // Save the PDF
    pdf.save("OMR_Sheets.pdf");
    setIsModalOpen(false);

    // Store OMR data in the database
    await storeOMRData(selectedRows);
  };

  const storeOMRData = async (selectedRows) => {
    try {
      const payload = selectedRows.flatMap((row) =>
        row.students.map((student) => ({
          school: row.school,
          level: row.level,
          student_id: student.student_id,
          student_name: student.student_name,
          roll_number: student.roll_number,
          is_checked: checkedRows[row.id] ? 1 : 0,
          bubble_type: selectedBubbleOption // Store the bubble type
        }))
      );

      // Send data to the backend
      const response = await axios.post(
        `${API_BASE_URL}/api/omr/generator`,
        payload
      );

      if (response.status === 201) {
        console.log("OMR data stored successfully!");
      } else {
        console.error("Failed to store OMR data.");
      }
    } catch (error) {
      console.error("Error storing OMR data:", error);
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "OMR" }]} />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "auto",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                flexDirection: "column",
                borderRadius: "15px",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  padding: "14px 12px",
                  display: "flex",
                  alignItems: "center",
                  height: "27px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  color: "#1230AE",
                  textDecoration: "none",
                  fontFamily: '"Poppins", sans-serif',
                }}
                onClick={handleGenerateClick}
              >
                <FaPlus />
                <span>Generate Omr</span>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  width: "300px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "#333",
                  }}
                >
                  ✖
                </button>

                <h3>Select Options</h3>
                
                {/* Mode Selection */}
                <div style={{ margin: "10px 0" }}>
                  <label style={{ display: "block", textAlign: "left", marginBottom: "5px" }}>
                    Mode:
                  </label>
                  <select
                    value={selectedOption}
                    onChange={handleOptionChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                
                {/* Bubble Selection */}
                <div style={{ margin: "10px 0" }}>
                  <label style={{ display: "block", textAlign: "left", marginBottom: "5px" }}>
                    Bubble Type:
                  </label>
                  <select
                    value={selectedBubbleOption}
                    onChange={handleBubbleOptionChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="50">50 Bubbles</option>
                    <option value="60">60 Bubbles</option>
                  </select>
                </div>
                
                <button
                  onClick={handleGeneratePDF}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1230ae",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Generate OMR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.tablecont} mt-0`}>
        <table
          className={`${styles.table} `}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <thead>
            <tr className={`${styles.headerRow} pt-0 pb-0`}>
              {["id", "school name", "total students", "level"].map((col) => (
                <th
                  key={col}
                  className={styles.sortableHeader}
                  onClick={() => handleSort(col)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                    {getSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tr
            className={styles.filterRow}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
            {["id", "school name", "total students", "level"].map((col) => (
              <th key={col}>
                <div className={styles.inputContainer}>
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder={`Search ${col}`}
                    onChange={(e) => handleFilter(e, col)}
                    className={styles.filterInput}
                  />
                </div>
              </th>
            ))}
            <th></th>
          </tr>
          <tbody>
            {currentRecords.map((row) => (
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
                <td>{row.school}</td>
                <td>{row.student_count}</td>
                <td>{row.level}</td>
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
                const selectedSize = parseInt(e.target.value, 10);
                setPageSize(selectedSize);
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
            <p className={`  my-auto text-secondary`}>data per Page</p>
          </div>

          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <label
              htmlFor="pageSize"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <p className={`  my-auto text-secondary`}>
                {filteredRecords.length} of {page}-
                {Math.ceil(filteredRecords.length / pageSize)}
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

            {Array.from(
              { length: Math.ceil(filteredRecords.length / pageSize) },
              (_, i) => i + 1
            )
              .filter(
                (pg) =>
                  pg === 1 ||
                  pg === Math.ceil(filteredRecords.length / pageSize) ||
                  Math.abs(pg - page) <= 2
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
              disabled={page === Math.ceil(filteredRecords.length / pageSize)}
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