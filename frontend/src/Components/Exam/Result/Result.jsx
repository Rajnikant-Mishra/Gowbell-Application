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
  const [loading, setLoading] = useState(false); // Reused for API call

  // Fetch paginated data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/all-results`, {
          params: { page: currentPage, limit: pageSize },
        });
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
  }, [currentPage, pageSize]);

  // Handle Generate Medal List
  const handleGenerateMedalList = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/update-pending-percentages`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based auth, consistent with your uploadStudentsData
          },
        }
      );
      if (response.data.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Medal List Generated",
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          window.location.reload(); // Reload to refresh table with updated medals
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Generation Failed",
          text: response.data.message || "Failed to generate medal list.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        text:
          error.response?.data?.message ||
          "An error occurred while generating the medal list.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Handle row deletion
  const handleDelete = (id) => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "custom-swal-popup", // Add custom class to the popup
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the delete request
        axios
          .delete(`${API_BASE_URL}/api/result/${id}`)
          .then((response) => {
            // Update the state after successful deletion
            setRecords((prevCountries) =>
              prevCountries.filter((country) => country.id !== id)
            );
            setFilteredRecords((prevFiltered) =>
              prevFiltered.filter((country) => country.id !== id)
            );
            // Show a success alert
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: `The student has been deleted.`,
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: {
                popup: "small-swal",
              },
            }).then(() => {
              // Reload the page after alert is shown
              navigate(0);
            });
          })
          .catch((error) => {
            console.error("Error deleting country:", error);
            // Show an error alert if deletion fails
            Swal.fire(
              "Error!",
              "There was an issue deleting the country.",
              "error"
            );
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
  // const parseCSVData = (csvFile) => {
  //   Papa.parse(csvFile, {
  //     complete: (result) => {
  //       const students = result.data.map((row) => ({
  //         school_name: row.school_name?.trim() || "",
  //         student_name: row.student_name?.trim() || "",
  //         class_name: row.class_name?.trim() || "",
  //         roll_no: row.roll_no?.trim() || "",
  //         full_mark: parseInt(row.full_mark) || 0,
  //         mark_secured: parseInt(row.mark_secured) || 0,
  //         subject: row.subject?.trim() || "",
  //         level: row.level?.trim() || "",
  //       }));
  //       uploadStudentsData(students);
  //     },
  //     header: true,
  //     skipEmptyLines: true,
  //   });
  // };

  const parseCSVData = (csvFile) => {
    Papa.parse(csvFile, {
      complete: (result) => {
        const students = result.data.map((row) => ({
          school_name: row.school_name?.trim() || "",
          student_name: row.student_name?.trim() || "",
          class_name: formatClassName(row.class_name?.trim() || ""),
          roll_no: row.roll_no?.trim() || "",
          full_mark: parseInt(row.full_mark) || 0,
          mark_secured: parseInt(row.mark_secured) || 0,
          subject: row.subject?.trim() || "",
          level: row.level?.trim() || "",
        }));
        uploadStudentsData(students);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  // Helper function to format class name with leading zero for single digits
  const formatClassName = (className) => {
    // Check if className is a single digit number
    if (/^\d$/.test(className)) {
      return `0${className}`;
    }
    return className;
  };

  // Function to upload students data to backend
  const uploadStudentsData = async (students) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/upload-results`,
        { students },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text:
          error.response?.data?.message || "An error occurred during upload.",
      });
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle download button click (Download CSV file)
  const handleDownloadClick = () => {
    const headers = [
      "school_name",
      "student_name",
      "class_name",
      "roll_no",
      "full_mark",
      "mark_secured",
      "level",
      "subject",
    ];

    const rows = [
      [
        "Green Valley High School",
        "Alice Johnson",
        "01",
        "7656010200",
        "500",
        "450",
        "1",
        "math",
      ],
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((field) => {
            if (
              typeof field === "string" &&
              (field.includes(",") || field.includes('"'))
            ) {
              return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_results_sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "Result List" }]} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "auto",
            gap: "10px",
          }}
        >
          {/* Generate Medal List Button
          <button
            onClick={handleGenerateMedalList}
            disabled={loading}
            className="d-flex justify-content-center align-items-center"
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              padding: "26px 12px",
              height: "27px",
              fontSize: "14px",
              borderRadius: "5px",
              color: "#1230AE",
              background: "transparent",
              border: "none",
              fontFamily: '"Poppins", sans-serif',  
            }}
          >
            {loading ? "Generating..." : "Generate Medal List"}
          </button> */}

          {/* Bulk Action */}
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
                    />
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
            <CreateButton link="/result-create" className="MY-AUTO" />
          </div>
        </div>
      </div>
      <div className={`${styles.tablecont} mt-0`}>
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
                "School",
                "Student",
                "Class",
                "subject",
                "Roll No",
                "Full Mark",
                "Mark Secured",
                "level",
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
              <th>Action</th>
            </tr>
          </thead>
          <tr
            className={styles.filterRow}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
            {[
              "School",
              "Student",
              "Class",
              "subject",
              "Roll No",
              "Full Mark",
              "Mark Secured",
              "level",
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
                <td>{row.school_name}</td>
                <td>{row.student_name}</td>
                <td>{row.class_id}</td>
                <td>{row.subject_id}</td>
                <td>{row.roll_no}</td>
                <td>{row.full_mark}</td>
                <td>{row.mark_secured}</td>

                <td>{row.level}</td>

                <td>
                  <div className={styles.actionButtons}>
                    <Link to={`/result/update/${row.id}`}>
                      <UilEditAlt className={styles.FaEdit} />
                    </Link>
                    <UilTrashAlt
                      onClick={() => handleDelete(row.id)}
                      className={`${styles.FaTrash}`}
                    />
                  </div>
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
                setCurrentPage(1);
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

          <div className={`${styles.pagination} my-auto`}>
            <button
              onClick={handlePreviousPage}
              disabled={!prevPage}
              className={styles.paginationButton}
            >
              <UilAngleLeftB />
            </button>

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
