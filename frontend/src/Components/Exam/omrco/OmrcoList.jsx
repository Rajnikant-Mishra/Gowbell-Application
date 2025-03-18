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
// import "jspdf-autotable";
// import OMRSheet from "./OMRSheet";
// import ReactDOMServer from "react-dom/server";
import { FaPlus } from "react-icons/fa";
import JsBarcode from "jsbarcode";

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
  const [selectedOption, setSelectedOption] = useState("");

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

  const handleGeneratePDF = async () => {
    const selectedRows = filteredRecords.filter((row) => checkedRows[row.id]);

    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate the PDF.");
      return;
    }

    // Generate PDF
    const doc = new jsPDF();

    selectedRows.forEach((row, index) => {
      const { school, level, students } = row;

      students.forEach((student, studentIndex) => {
        if (index > 0 || studentIndex > 0) doc.addPage(); // Add a new page per student

        doc.setFontSize(20);
        doc.text(`School: ${school}`, 20, 20);
        doc.text(`Level: ${level}`, 20, 30);

        doc.setFontSize(18);
        doc.text(`Student Name: ${student.student_name}`, 20, 50);
        doc.text(`Roll Number: ${student.roll_number}`, 20, 60);
        doc.text(`Subject: ${student.subject}`, 20, 70);

        // ✅ Generate Barcode
        const canvas = document.createElement("canvas"); // Create a temporary canvas
        JsBarcode(canvas, student.roll_number, {
          format: "CODE128",
          displayValue: true, // Show text below barcode
          width: 1,
          height: 50,
        });

        // Convert barcode to base64 image
        const barcodeImage = canvas.toDataURL("image/png");

        // ✅ Add Barcode to PDF
        doc.addImage(barcodeImage, "PNG", 20, 80, 100, 40); // Adjust position and size

        // ✅ Draw OMR Table below Barcode
        let startY = 130; // Adjusted to fit barcode
        const startX = 20;
        const colWidths = [20, 20, 20, 20, 20];
        const rowHeight = 10;

        doc.setFontSize(12);
        doc.text("Q.No", startX, startY);
        doc.text("A", startX + colWidths[0], startY);
        doc.text("B", startX + colWidths[0] + colWidths[1], startY);
        doc.text(
          "C",
          startX + colWidths[0] + colWidths[1] + colWidths[2],
          startY
        );
        doc.text(
          "D",
          startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
          startY
        );

        // Draw Table Rows
        for (let i = 0; i < 20; i++) {
          let rowY = startY + (i + 1) * rowHeight;
          doc.text(String(i + 1), startX + 5, rowY); // Question Number
          doc.rect(startX, rowY - 8, colWidths[0], rowHeight); // Q.No box
          doc.rect(startX + colWidths[0], rowY - 8, colWidths[1], rowHeight); // A box
          doc.rect(
            startX + colWidths[0] + colWidths[1],
            rowY - 8,
            colWidths[2],
            rowHeight
          ); // B box
          doc.rect(
            startX + colWidths[0] + colWidths[1] + colWidths[2],
            rowY - 8,
            colWidths[3],
            rowHeight
          ); // C box
          doc.rect(
            startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
            rowY - 8,
            colWidths[4],
            rowHeight
          ); // D box
        }
      });
    });

    doc.save("Student_Sheets.pdf"); // Save PDF
    setIsModalOpen(false); // ✅ Close the popup after download

    // Store OMR data in the database
    await storeOMRData(selectedRows);
  };

  //store omr sheet data in dtabase
  const storeOMRData = async (selectedRows) => {
    try {
      const payload = selectedRows.flatMap((row) =>
        row.students.map((student) => ({
          school: row.school,
          level: row.level,
          student_id: student.student_id,
          student_name: student.student_name,
          roll_number: student.roll_number,
          is_checked: checkedRows[row.id] ? 1 : 0, // Ensure boolean values are properly stored
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

                <h3>Select Mode</h3>
                <select
                  value={selectedOption || "online"}
                  onChange={handleOptionChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    margin: "10px 0",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                <button
                  onClick={() =>
                    handleGeneratePDF(
                      filteredRecords.filter((row) => checkedRows[row.id])
                    )
                  }
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1230ae",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
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
