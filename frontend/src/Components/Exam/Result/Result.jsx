import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";
import Button from "@mui/material/Button";
import Mainlayout from "../../Layouts/Mainlayout";
import styles from "../../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../../Components/CommonButton/CreateButton";
import { Menu } from "@mui/material";
import excelImg from "../../../../public/excell-img.png";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);

  // Fetch paginated data from the backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/all-results`);
//         setStudents(response.data.data);
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//         Swal.fire("Error", "Failed to fetch student data.", "error");
//       }
//     };

//     fetchData();
//   }, []);

// Fetch paginated data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/all-results`,
          {
            params: { page: currentPage, limit: pageSize },
          }
        );

        const { students, totalRecords, totalPages, nextPage, prevPage } =
          response.data;

        setStudents(students);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      } catch (error) {
        console.error("Error fetching student data:", error);
        Swal.fire("Error", "Failed to fetch student data.", "error");
      }
    };

    fetchData();
  }, [currentPage, pageSize]); //

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Handle row deletion
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/api/get/student/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setFilteredRecords((prev) =>
              prev.filter((record) => record.id !== id)
            );
            Swal.fire("Deleted!", "The student has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting student:", error);
            Swal.fire("Error", "Failed to delete student.", "error");
          });
      }
    });
  };

  // Handle filtering
  const handleFilter = (event, column) => {
    const value = event.target.value.toLowerCase();
    const filtered = records.filter((row) =>
      (row[column] || "").toString().toLowerCase().includes(value)
    );
    setFilteredRecords(filtered);
    setPage(1);
  };

  // Handle sorting
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    const sortedData = [...filteredRecords].sort((a, b) => {
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

  //bulk upload for student data---------------------------------//
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle file selection and upload
  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
    handleClose();
  };

  // Handle file change (when a file is selected)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "text/csv") {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Invalid File",
          text: "Please upload a valid CSV file.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result;
        parseCSVData(csvData);
      };
      reader.readAsText(file);
    }
  };

  // Function to parse CSV and upload data
  const parseCSVData = (csvFile) => {
    Papa.parse(csvFile, {
      complete: (result) => {
        const students = result.data.map((row) => ({
          student_name: row.student_name?.trim() || "",
          class: row.class?.trim() || "",
          roll_no: row.roll_no?.trim() || "",
          full_mark: parseInt(row.full_mark) || 0,
          mark_secured: parseInt(row.mark_secured) || 0,
          percentage: parseFloat(row.percentage) || 0,
          level: row.level?.trim() || "",
          subject: row.subject?.trim() || "",
          medals: row.medals?.trim() || "None",
          certificate: row.certificate?.trim() || null,
          remarks: row.remarks?.trim() || null,
        }));
        uploadStudentsData(students);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  // Function to upload students data to backend
  const uploadStudentsData = async (students) => {
    setLoading(true); // Set loading state to true
    try {
      // Make the API call to upload student data
      const response = await axios.post(
        `${API_BASE_URL}/api/upload-results`,
        { students },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // Show success notification
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Upload Successful",
        text: `Successfully uploaded ${response.data.insertedCount} students.`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      }).then(() => {
        window.location.reload(); // Reload the page after successful upload
      });
    } catch (error) {
      // Show error notification
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.response?.data?.message || "An error occurred during upload.",
      });
      console.error("Upload Error:", error); // Log the error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  // Handle download button click (Download CSV file)
  const handleDownloadClick = () => {
    // Define CSV headers
    const headers = [
      "student_name",
      "class",
      "roll_no",
      "full_mark",
      "mark_secured",
      "percentage",
      "level",
      "subject",
      "medals",
      "certificate",
      "remarks",
    ];
  
    // Define sample data rows
    const rows = [
      [
        "Alice Johnson",
        "10",
        "A123",
        "500",
        "450",
        "90",
        "1",
        "Math",
        "Gold",
        "Excellence",
        "Outstanding Performance",
      ],
      [
        "Bob Smith",
        "9",
        "B456",
        "500",
        "400",
        "80",
        "2",
        "Science",
        "Silver",
        "Merit",
        "Good Performance",
      ],
      // Add more rows as needed
    ];
  
    // Create CSV content
    const csvContent = [
      headers.join(","), // Header row
      ...rows.map((row) =>
        row
          .map((field) => {
            // Escape fields containing commas or double quotes
            if (typeof field === "string" && (field.includes(",") || field.includes('"'))) {
              return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
          })
          .join(",")
      ), // Data rows
    ].join("\n");
  
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_results_sample.csv"; // Set the file name
    document.body.appendChild(link); // Append the link to the DOM (required for Firefox)
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up by removing the link
  
    // Close the menu (if applicable)
    handleClose();
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "Result" }]} />
        </div>

        {/* //bulk upload */}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "auto",
            gap: "10px",
          }}
        >
          {/* //bulk upload */}
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
              onClick={handleClick}
              style={{
                cursor: "pointer",
                padding: " 14px 12px",
                display: "flex",
                alignItems: "center",
                height: "27px",
                fontSize: "14px",
                borderRadius: "5px",
                color: "#1230AE",
                textDecoration: "none",
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              <img
                src={excelImg}
                alt="Upload"
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                }}
              />
              Bulk Action
            </div>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              style={{ padding: "0px", margin: "0px" }}
            >
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  gap: "15px",
                  borderRadius: "10px",
                  padding: "0px 10px",
                }}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleUploadClick}
                    style={{
                      fontSize: "13px",
                      backgroundColor: "#4A4545",
                      color: "white",
                    }}
                  >
                    <img
                      src={excelImg}
                      alt="Upload"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "8px",
                      }}
                    />{" "}
                    Upload Excel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleDownloadClick}
                    style={{ fontSize: "13px" }}
                  >
                    <UilDownloadAlt /> Download Sample File
                  </button>
                </div>
                <div className="mt-2">
                  <p style={{ color: "#4A4545" }} className="fw-bold mb-0">
                    Note:
                    <UilInfoCircle
                      style={{ height: "20px", width: "20px", color: "blue" }}
                    />
                  </p>
                  <ol
                    style={{
                      fontSize: "10px",
                      paddingLeft: "10px",
                      color: "gray",
                    }}
                  >
                    <li>Click Download Sample File to get the template.</li>
                    <li>Fill in the data as per the given columns.</li>
                    <li>Save the file in Excel format (XLSX or CSV).</li>
                    <li>Use Upload Excel to bulk upload your data.</li>
                    <li>
                      Ensure all required fields are filled correctly to avoid
                      errors.
                    </li>
                  </ol>
                </div>
              </div>
            </Menu>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "45px" }}
          >
            {/* <CreateButton link="/student-create" className="MY-AUTO" /> */}
          </div>
        </div>
      </div>
      <div className={`${styles.tablecont} mt-0`}>
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
                "student",
                "class",
                "roll_no",
                "full_mark",
                "mark_secured",
                "percentage",
                "medals",
                "certificate",
                "level",
                "subject",
                "remarks"
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
             "student",
                "class",
                "roll_no",
                "full_mark",
                "mark_secured",
                "percentage",
                "medals",
                "certificate",
                "level",
                "subject",
                "remarks"
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
            <th></th>
          </tr>
          <tbody>
            {students.map((row) => (
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
                <td>{row.student_name}</td>
                <td>{row.class}</td>
                <td>{row.roll_no}</td>
                <td>{row.full_mark}</td>
                <td>{row.mark_secured}</td>
                <td>{row.percentage}</td>
                <td>{row.medals}</td>
                <td>{row.certificate}</td>
                <td>{row.level}</td>
                <td>{row.subject}</td>
                <td>{row.remarks}</td>
                {/* <td>
                  <div className={styles.actionButtons}>
                    <Link to={`/student/update/${row.id}`}>
                      <UilEditAlt className={styles.FaEdit} />
                    </Link>
                    <UilTrashAlt
                      onClick={() => handleDelete(row.id)}
                      className={`${styles.FaTrash}`}
                    />
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between flex-wrap mt-2">
          {/* Page Size Selector */}
          <div
            className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
          >
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setCurrentPage(1); // Reset to first page
              }}
              className={styles.pageSizeSelect}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <p className="my-auto text-secondary">data per Page</p>
          </div>

          {/* Total Records Display */}
          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <label
              htmlFor="pageSize"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <p className="my-auto text-secondary">
                {totalRecords} records, Page {currentPage} of {totalPages}
              </p>
            </label>
          </div>

          {/* Pagination Navigation */}
          <div className={`${styles.pagination} my-auto`}>
            {/* Previous Page Button */}
            <button
              onClick={handlePreviousPage}
              disabled={!prevPage}
              className={styles.paginationButton}
            >
              <UilAngleLeftB />
            </button>

            {/* Page Numbers with Ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (pg) =>
                  pg === 1 ||
                  pg === totalPages ||
                  Math.abs(pg - currentPage) <= 2
              )
              .map((pg, index, array) => (
                <React.Fragment key={pg}>
                  {index > 0 && pg > array[index - 1] + 1 && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(pg)}
                    className={`${styles.paginationButton} ${
                      currentPage === pg ? styles.activePage : ""
                    }`}
                  >
                    {pg}
                  </button>
                </React.Fragment>
              ))}

            {/* Next Page Button */}
            <button
              onClick={handleNextPage}
              disabled={!nextPage}
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
