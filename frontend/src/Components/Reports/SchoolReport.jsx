import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";

import Mainlayout from "../Layouts/Mainlayout";
import styles from "./../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { Menu, MenuItem, Button,  Box } from "@mui/material";

export default function SchoolReport() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pageSizes = [10, 20, 50, 100];

  useEffect(() => {
    // Fetch data from the API when the component mounts
    axios
      .get("http://localhost:5000/api/get/schools") // Your API URL here
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

  const [isAllChecked, setIsAllChecked] = useState(false);

  const [checkedRows, setCheckedRows] = useState({});

  const handleRowCheck = (id) => {
    setCheckedRows((prevCheckedRows) => {
      const newCheckedRows = { ...prevCheckedRows };
      if (newCheckedRows[id]) {
        delete newCheckedRows[id]; // Uncheck
      } else {
        newCheckedRows[id] = true; // Check
      }
      return newCheckedRows;
    });
  };

  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedRows({}); // Uncheck all rows
    } else {
      const allChecked = filteredRecords.reduce((acc, row) => {
        acc[row.id] = true; // Check all rows
        return acc;
      }, {});
      setCheckedRows(allChecked);
    }
    setIsAllChecked(!isAllChecked);
  };

  useEffect(() => {
    if (filteredRecords.every((row) => checkedRows[row.id])) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [checkedRows, filteredRecords]);

  // pdf generate codes--------------------------------------------//

  const [exportType, setExportType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    let yPosition = 10;

    // Add Table Headers
    doc.text(
      "Board | School | Email | Contact | State | District | City | Pincode",
      10,
      yPosition
    );
    yPosition += 10;

    // Add Table Rows
    records.forEach((row) => {
      const rowData = `${row.board} | ${row.school_name} | ${row.school_email} | ${row.school_contact_number} | ${row.state} | ${row.district} | ${row.city} | ${row.pincode}`;
      doc.text(rowData, 10, yPosition);
      yPosition += 10;
    });

    doc.save("school_report.pdf");
    handleExportClose();
  };

  //excell generate codes ----------------------------------------------------------------//
  // const generateExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(filteredRecords);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "School Report");
  //   XLSX.writeFile(wb, "school-report.xlsx");
  // };
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "School Report");

    XLSX.writeFile(wb, "school_report.xlsx");
    handleExportClose();
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-end">
        <div
          role="presentation"
          onClick={handleClick}
          className={`${styles.breadcrumb} my-1`}
        >
         {/* //export button */}
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
          className={`${styles.table} `}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <thead>
            <tr className={`${styles.headerRow} pt-0 pb-0`}>
              <th>
                <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
              </th>
              {[
                "board",
                "school",
                "email",
                "contact",
                "state",
                "district",
                "city",
                "pincode",
              ].map((col) => (
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
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tr
            className={styles.filterRow}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
            {[
              "board",
              "school",
              "email",
              "contact",
              "state",
              "district",
              "city",
              "pincode",
            ].map((col) => (
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
                <td>{row.board}</td>
                <td>{row.school_name}</td>
                <td>{row.school_email}</td>
                <td>{row.school_contact_number}</td>
                <td>{row.state}</td>
                <td>{row.district}</td>
                <td>{row.city}</td>
                <td>{row.pincode}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* pagination */}
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
            data per Page
          </div>
          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <label
              htmlFor="pageSize"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <p className={`  my-auto`}>
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
