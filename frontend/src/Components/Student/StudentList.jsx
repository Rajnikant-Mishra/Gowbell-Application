import React, { useEffect, useState } from "react";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilSearch,
  UilTimes,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Mainlayout from "../Layouts/Mainlayout";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import CreateButton from "../../Components/CommonButton/CreateButton";
import excelImg from "../../../public/excell-img.png";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import Papa from "papaparse";
import "../Common-Css/DeleteSwal.css";
import "../Common-Css/Swallfire.css";

export default function StudentDataTable() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [checkedRows, setCheckedRows] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);

  const navigate = useNavigate();
  const pageSizes = [10, 20, 50, 100];

  // Format timestamp for display
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

  // Fetch student data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSearchLoading(true);

      try {
        const sessionId = localStorage.getItem("currentSessionId") || null;

        // 1️⃣ Fetch all students (with search & pagination)
        const studentResponse = await axios.get(
          `${API_BASE_URL}/api/get/student`,
          {
            params: {
              page,
              limit: pageSize,
              search: searchTerm,
              session_id: sessionId,
            },
          },
        );

        const { students, totalRecords, totalPages } = studentResponse.data;

        // 2️⃣ Fetch all users (created_by / updated_by) once
        const usersResponse = await axios.get(`${API_BASE_URL}/api/u1/users`);
        const usersMap = {};
        usersResponse.data.forEach((u) => {
          usersMap[u.id] = u.username;
        });

        // 3️⃣ Fetch all classes once
        const classesResponse = await axios.get(`${API_BASE_URL}/api/class`);
        const classesMap = {};
        classesResponse.data.forEach((c) => {
          classesMap[c.id] = c.name;
        });

        // 4️⃣ Fetch all subjects once
        const subjectsResponse = await axios.get(`${API_BASE_URL}/api/subject`);
        const subjectsMap = {};
        subjectsResponse.data.forEach((subj) => {
          subjectsMap[subj.id] = subj.name;
        });

        // 5️⃣ Map student data with user/class/subject info
        const formattedData = students.map((record) => {
          // Map subjects
          let subjectNames = [];
          try {
            let subjectIds = [];
            if (typeof record.student_subject === "string") {
              subjectIds = JSON.parse(record.student_subject || "[]");
            } else if (Array.isArray(record.student_subject)) {
              subjectIds = record.student_subject;
            }

            subjectNames = subjectIds.map(
              (id) => subjectsMap[id] || "Unknown Subject",
            );
          } catch (e) {
            subjectNames = ["Unknown Subject"];
          }

          return {
            ...record,
            student_subject: subjectNames,
            class_name: classesMap[record.class_id] || "Unknown Class",
            created_by: usersMap[record.created_by] || "Unknown User",
            updated_by: usersMap[record.updated_by] || "Unknown User",
            created_at: formatTimestamp(record.created_at),
            updated_at: formatTimestamp(record.updated_at),
          };
        });

        setStudents(formattedData);
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
        setSearchLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchData();
    }, 500); // debounce 500ms

    return () => clearTimeout(debounceTimeout);
  }, [page, pageSize, searchTerm]);

  // Listen for session changes
  useEffect(() => {
    const handleSessionChange = () => {
      setPage(1); // Reset to first page on session change
      // The fetchData function will automatically use the new session_id from localStorage
    };
    window.addEventListener("storage", handleSessionChange);
    return () => window.removeEventListener("storage", handleSessionChange);
  }, []);

  // Handle row deletion
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
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Authentication Error",
            text: "Authentication token is missing. Please log in again.",
          });
          return; // 🚫 stop here if no token
        }

        axios
          .delete(`${API_BASE_URL}/api/get/student/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setStudents((prev) => prev.filter((student) => student.id !== id));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The student has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting student:", error);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text:
                error.response?.data?.error ||
                "There was an issue deleting the student.",
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

  // Handle checkbox selection
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

  const handleSelectAll = (params) => {
    if (isAllChecked) {
      setCheckedRows({});
      params.api.deselectAll();
    } else {
      const allChecked = students.reduce((acc, row) => {
        acc[row.id] = true;
        return acc;
      }, {});
      setCheckedRows(allChecked);
      params.api.selectAll();
    }
    setIsAllChecked(!isAllChecked);
  };

  // Bulk upload and CSV download
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
    handleClose();
  };

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
          customClass: { popup: "small-swal" },
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

  const formatClassName = (className) => {
    if (/^\d$/.test(className)) {
      return `0${className}`;
    }
    return className;
  };

  const uploadStudentsData = async (students) => {
    const token = localStorage.getItem("token");
    const CHUNK_SIZE = 100;
    let totalInserted = 0;
    let allErrors = [];

    setLoading(true);

    try {
      for (let i = 0; i < students.length; i += CHUNK_SIZE) {
        const chunk = students.slice(i, i + CHUNK_SIZE);

        try {
          const res = await axios.post(
            `${API_BASE_URL}/api/get/student/bulk-upload`,
            chunk,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          totalInserted += res.data.insertedCount || 0;
          if (res.data.errors?.length) allErrors.push(...res.data.errors);
        } catch (err) {
          const errList = err.response?.data?.errors || [];
          if (errList.length > 0) {
            allErrors.push(...errList);
          } else {
            allErrors.push({
              rowIndex: "?",
              message: err.response?.data?.message || "Upload failed",
            });
          }
        }
      }

      // Success Toast
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `${totalInserted} students uploaded successfully!`,
        toast: true,
        position: "top-end",
        timer: 3000,
      });

      // Show Errors Nicely
      if (allErrors.length > 0) {
        const errorHtml = allErrors
          .map((e) => {
            const row = e.rowIndex || "?";
            const msg = e.message;

            if (
              msg.toLowerCase().includes("roll_no") ||
              msg.includes("Roll No")
            ) {
              return `<div style="color:#e74c3c; font-weight:600;">Row ${row}: ${msg}</div>`;
            }
            if (msg.includes("Aadhaar")) {
              return `<div style="color:#e67e22;">Row ${row}: ${msg}</div>`;
            }
            return `<div>Row ${row}: ${msg}</div>`;
          })
          .join("");

        Swal.fire({
          icon: "warning",
          title: `${allErrors.length} Row(s) Failed`,
          html: `<div style="text-align:left; max-height:400px; overflow:auto; padding:10px;">${errorHtml}</div>`,
          width: 700,
          confirmButtonText: "Close",
        });
      } else {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      Swal.fire(
        "Upload Failed",
        "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // const parseCSVData = (csvText) => {
  //   Papa.parse(csvText, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: (result) => {
  //       const rows = result.data;
  //       if (rows.length === 0) {
  //         Swal.fire("Empty File", "No data found in CSV.", "warning");
  //         return;
  //       }

  //       const sessionId = localStorage.getItem("currentSessionId");
  //       const errors = [];
  //       const validStudents = [];

  //       rows.forEach((row, idx) => {
  //         const rowNum = idx + 2; // Excel row number

  //         // Required fields
  //         if (
  //           !row.school_id?.trim() ||
  //           !row.student_name?.trim() ||
  //           !row.class_id?.trim()
  //         ) {
  //           errors.push(
  //             `Row ${rowNum}: Missing school_id, student_name or class_id`,
  //           );
  //           return;
  //         }

  //         // Aadhaar validation
  //         const aadhaar = row.aadhaar_number?.trim();
  //         if (aadhaar && !/^\d{12}$/.test(aadhaar)) {
  //           errors.push(`Row ${rowNum}: Aadhaar must be exactly 12 digits`);
  //         }

  //         validStudents.push({
  //           school_id: row.school_id.trim(),
  //           student_name: row.student_name.trim(),
  //           class_id: formatClassName(row.class_id.trim()),
  //           student_section: row.student_section?.trim() || null,
  //           roll_no: row.roll_no?.trim() || null, // ← This is the key!
  //           mobile_number: row.mobile_number?.trim() || null,
  //           whatsapp_number: row.whatsapp_number?.trim() || null,
  //           aadhaar_number: aadhaar || null,
  //           student_subject: row.student_subject
  //             ? row.student_subject
  //                 .split(",")
  //                 .map((s) => s.trim())
  //                 .filter(Boolean)
  //             : [],
  //           country: row.country?.trim() || "",
  //           state: row.state?.trim() || "",
  //           district: row.district?.trim() || "",
  //           city: row.city?.trim() || "",
  //           session_id: sessionId,
  //         });
  //       });

  //       if (errors.length > 0) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Invalid Data",
  //           html: errors.map((e) => `<div>• ${e}</div>`).join(""),
  //           width: 600,
  //         });
  //         return;
  //       }

  //       uploadStudentsData(validStudents);
  //     },
  //   });
  // };

  // 2. Change parsing logic (in parseCSVData)

  const parseCSVData = (csvText) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data;
        if (rows.length === 0) {
          Swal.fire("Empty File", "No data found in CSV.", "warning");
          return;
        }

        const sessionId = localStorage.getItem("currentSessionId");
        const errors = [];
        const validStudents = [];

        rows.forEach((row, idx) => {
          const rowNum = idx + 2;

          // Required fields check...
          if (
            !row.school_id?.trim() ||
            !row.student_name?.trim() ||
            !row.class_id?.trim()
          ) {
            errors.push(
              `Row ${rowNum}: Missing school_id, student_name or class_id`,
            );
            return;
          }

          // Collect subjects dynamically
          const subjectKeys = Object.keys(row).filter((key) =>
            key.startsWith("subject_"),
          );
          const subjects = subjectKeys
            .map((key) => row[key]?.trim())
            .filter(Boolean); // remove empty

          // Remove duplicate subjects (optional)
          const uniqueSubjects = [...new Set(subjects)];

          validStudents.push({
            school_id: row.school_id.trim(),
            student_name: row.student_name.trim(),
            class_id: formatClassName(row.class_id.trim()),
            student_section: row.student_section?.trim() || null,
            roll_no: row.roll_no?.trim() || null,
            mobile_number: row.mobile_number?.trim() || null,
            whatsapp_number: row.whatsapp_number?.trim() || null,
            aadhaar_number: row.aadhaar_number?.trim() || null,

            // ← This is the most important change
            student_subject: uniqueSubjects, // array of strings

            country: row.country?.trim() || "",
            state: row.state?.trim() || "",
            district: row.district?.trim() || "",
            city: row.city?.trim() || "",
            session_id: sessionId,
          });
        });

        if (errors.length > 0) {
          Swal.fire({
            icon: "error",
            title: "Invalid Data",
            html: errors.map((e) => `<div>• ${e}</div>`).join(""),
            width: 600,
          });
          return;
        }

        uploadStudentsData(validStudents);
      },
    });
  };

  // const handleDownloadClick = () => {
  //   const headers = [
  //     "school_id",
  //     "student_name",
  //     "class_id",
  //     "student_section",
  //     "roll_no", // ← Manual roll number (optional)
  //     "mobile_number",
  //     "whatsapp_number",
  //     "aadhaar_number",
  //     "student_subject",
  //     "city",
  //     "district",
  //     "state",
  //     "country",
  //   ];

  //   const sampleData = [
  //     // Example with manual roll_no
  //     [
  //       "Gowell School",
  //       "Amit Kumar",
  //       "10",
  //       "A",
  //       "GWL10A01",
  //       "9876543210",
  //       "9876543210",
  //       "111122223333",
  //       "GIMO",
  //       "Cuttack",
  //       "Cuttack",
  //       "Odisha",
  //       "India",
  //     ],
  //   ];

  //   const csvContent = [
  //     headers.join(","),
  //     ...sampleData.map((row) => row.join(",")),
  //   ].join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "student_bulk_upload_template.csv";
  //   link.click();
  //   handleClose(); // close menu
  // };

  // 1. Download sample - change headers & sample data

  const handleDownloadClick = () => {
    const headers = [
      "school_id",
      "student_name",
      "class_id",
      "student_section",
      "mobile_number",
      "whatsapp_number",
      "aadhaar_number",
      "subject_1",
      "subject_2",
      "subject_3",
      "subject_4",
      "subject_5",
      "subject_6",
      "subject_7",
      "city",
      "district",
      "state",
      "country",
    ];

    const sampleData = [
      [
        "Gowell School",
        "Amit Kumar",
        "10",
        "A",
        "9876543210",
        "9876543210",
        "111122223333",
        "GIMO",
        "GISO",
        "GIEO",
        "GIDO",
        "GIKO",
        "JTDO",  
        "CYWO",
        "Cuttack",
        "Cuttack",
        "Odisha",
        "India",
      ],
    ];

    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) => row.map((v) => `"${v}"`).join(",")), // better escaping
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_bulk_upload_template.csv";
    link.click();
    handleClose();
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // ── Render ──────────────────────────────────────────────────

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
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
          <Breadcrumb data={[{ name: "Student" }]} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
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
                style={{ width: "20px", height: "20px", marginRight: "8px" }}
              />
              Bulk Action
            </div>
            {/* <Menu
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
                    style={{
                      fontSize: "13px",
                      backgroundColor: "#4A4545",
                      color: "white",
                      fontWeight: "500",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                    }}
                    onClick={handleUploadClick}
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
                    style={{
                      fontSize: "13px",
                      backgroundColor: "#28A745",
                      color: "white",
                      fontWeight: "500",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                    }}
                    onClick={handleDownloadClick}
                  >
                    <UilDownloadAlt /> Download Sample File
                  </button>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <p
                    style={{
                      color: "#4A4545",
                      fontWeight: "bold",
                      marginBottom: "0",
                    }}
                  >
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
                      Ensure all required fields are filled correctly and
                      <br /> Aadhaar numbers are either empty or exactly 12
                      digits to avoid errors.
                    </li>
                  </ol>
                </div>
              </div>
            </Menu> */}

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                sx: {
                  borderRadius: "10px",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.18)",
                  minWidth: 280,
                  overflow: "hidden",
                },
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  fontFamily: '"Poppins", sans-serif',
                  background: "#fff",
                }}
              >
                {/* Buttons Row */}
                <div
                  style={{ display: "flex", gap: "12px", marginBottom: "10px" }}
                >
                  {/* Upload Button */}
                  <button
                    type="button"
                    style={{
                      fontSize: "13px",
                      backgroundColor: "#4A4545",
                      color: "white",
                      fontWeight: "500",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                    }}
                    onClick={handleUploadClick}
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
                    style={{
                      fontSize: "13px",
                      backgroundColor: "#28A745",
                      color: "white",
                      fontWeight: "500",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                    }}
                    onClick={handleDownloadClick}
                  >
                    <UilDownloadAlt /> Download Sample File
                  </button>
                </div>

                {/* Note Section */}
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    border: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    <UilInfoCircle size="18" color="#2563eb" />
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#333",
                        fontSize: "13px",
                      }}
                    >
                      Important Notes
                    </span>
                  </div>

                  <ol
                    style={{
                      margin: 0,
                      paddingLeft: "18px",
                      fontSize: "12px",
                      color: "#555",
                      lineHeight: 1.5,
                    }}
                  >
                    <li>Download sample file first</li>
                    <li>Don't change column headers</li>
                    <li>Required: school_id, student_name, class_id</li>
                    <li>Aadhaar must be 12 digits or empty</li>
                    <li>Subjects: separate with comma (Math,Science)</li>
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
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "45px",
            }}
          >
            <CreateButton link="/student-create" style={{ margin: "auto" }} />
          </div>
        </div>
      </div>

      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          position: "relative",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, roll no, mobile, aadhaar..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={{ mb: 3, maxWidth: 520 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {searchLoading ? (
                  <CircularProgress size={18} />
                ) : (
                  <UilSearch color="#666" />
                )}
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <UilTimes size="18" color="#888" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "120px 0" }}>
            <CircularProgress size={60} />
            <p style={{ marginTop: 20, color: "#555", fontSize: "15px" }}>
              Loading students data...
            </p>
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 500,
                overflowX: "auto",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Table
                stickyHeader
                sx={{
                  minWidth: 1200,
                  borderTopRightRadius: "5px",
                  border: "none",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{ bgcolor: "rgb(17 61 236)", color: "white" }}
                    >
                      <Checkbox
                        sx={{ color: "white" }}
                        checked={isAllChecked}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    {[
                      "SCHOOL",
                      "STUDENT NAME",
                      "ROLL NUMBER",
                      "CLASS",
                      "SECTION",
                      "MOBILE",
                      "SUBJECTS",
                      "CREATED BY",
                      "UPDATED BY",
                      "CREATED AT",
                      "UPDATED AT",
                      "ACTION",
                    ].map((title) => (
                      <TableCell
                        key={title}
                        sx={{
                          bgcolor: "rgb(17 61 236)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "13.5px",
                          whiteSpace: "nowrap",
                          textAlign: title === "ACTION" ? "center" : "left",
                        }}
                      >
                        {title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {students.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      // sx={{ "&:hover": { bgcolor: "#f8fafc" } }}
                      sx={{
                        "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        <Checkbox
                          checked={!!checkedRows[row.id]}
                          onChange={() => handleRowCheck(row.id)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.school_name?.toUpperCase() || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.student_name?.toUpperCase() || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.roll_no?.toUpperCase() || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.class_name || "-"}
                      </TableCell>
                      <TableCell
                        ssx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.student_section || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.mobile_number || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.student_subject?.join(", ") || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.created_by}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.updated_by}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.created_at}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "none",
                        }}
                      >
                        {row.created_at}
                      </TableCell>

                      <TableCell align="center">
                        <div
                          style={{
                            display: "flex",
                            gap: "18px",
                            justifyContent: "center",
                          }}
                        >
                          <Link to={`/student/update/${row.id}`}>
                            <UilEditAlt
                              style={{ color: "#1230AE", fontSize: 22 }}
                            />
                          </Link>

                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row.id)}
                          >
                            <UilTrashAlt
                              style={{ color: "#e74c3c", fontSize: 22 }}
                            />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
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
                    setSelectedRows([]);
                    setSelectedRowsCount(0);
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
                      pg === 1 || pg === totalPages || Math.abs(pg - page) <= 2,
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
                        onClick={() => {
                          setPage(pg);
                          setSelectedRows([]);
                          setSelectedRowsCount(0);
                        }}
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
