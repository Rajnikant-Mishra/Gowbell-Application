import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";
import { Menu, MenuItem } from "@mui/material";
import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import CreateButton from "../../Components/CommonButton/CreateButton";
import excelImg from "../../../public/excell-img.png";
import Papa from "papaparse";
import "../Common-Css/DeleteSwal.css";
import "../Common-Css/Swallfire.css";

export default function DataTable() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const gridApiRef = useRef(null);
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
        const response = await axios.get(`${API_BASE_URL}/api/get/student`, {
          params: {
            page,
            limit: pageSize,
            search: searchTerm,
            session_id: sessionId,
          },
        });

        const { students, totalRecords, totalPages } = response.data;

        // Fetch user, class, and subject details for each student
        const formattedData = await Promise.all(
          students.map(async (record) => {
            try {
              // Fetch user details for created_by
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const userName = userResponse.data.username;

              // Fetch class details
              let className = "Unknown Class";
              if (record.class_id) {
                try {
                  const classResponse = await axios.get(
                    `${API_BASE_URL}/api/class/${record.class_id}`
                  );
                  className = classResponse.data.name || "Unknown Class";
                } catch (error) {
                  console.error(
                    `Failed to fetch class details for class_id: ${record.class_id}`,
                    error
                  );
                }
              }

              // Fetch subject details
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
                student_subject: subjectNames,
                class_name: className,
                created_by: userName,
                updated_by: userName,
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
              };
            } catch (error) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                error
              );
              return {
                ...record,
                student_subject: ["Unknown Subject"],
                class_name: "Unknown Class",
                created_by: "Unknown User",
                updated_by: "Unknown User",
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
              };
            }
          })
        );

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
    }, 500);

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

  // const parseCSVData = (csvFile) => {
  //   Papa.parse(csvFile, {
  //     complete: (result) => {
  //       if (!Array.isArray(result.data) || result.data.length === 0) {
  //         Swal.fire({
  //           position: "top-end",
  //           icon: "warning",
  //           title: "Invalid File",
  //           text: "CSV file is empty or invalid.",
  //           showConfirmButton: false,
  //           timer: 2000,
  //           toast: true,
  //         });
  //         return;
  //       }

  //       const sessionId = localStorage.getItem("currentSessionId") || null;
  //       const validationErrors = [];
  //       const students = result.data
  //         .filter((row, index) => {
  //           const schoolName = row.school_id?.trim();
  //           const studentName = row.student_name?.trim();
  //           const className = row.class_id?.trim();
  //           // Validate Aadhaar number: either empty or exactly 12 digits
  //           const aadhaar = row.aadhaar_number?.trim();
  //           if (aadhaar && !/^\d{12}$/.test(aadhaar)) {
  //             validationErrors.push(
  //               `Student at Row ${
  //                 index + 2
  //               }: Aadhaar number must be exactly 12 digits`
  //             );
  //             return false; // Exclude invalid rows
  //           }
  //           return schoolName && studentName && className;
  //         })
  //         .map((row) => ({
  //           school_id: row.school_id?.trim() || "",
  //           student_name: row.student_name?.trim() || "",
  //           class_id: formatClassName(row.class_id?.trim() || ""),
  //           student_section: row.student_section?.trim() || null,
  //           mobile_number: row.mobile_number?.trim() || null,
  //           whatsapp_number: row.whatsapp_number?.trim() || null,
  //           aadhaar_number: row.aadhaar_number?.trim() || null,
  //           student_subject: row.student_subject
  //             ? row.student_subject
  //                 .split(",")
  //                 .map((s) => s.trim())
  //                 .filter((s) => s)
  //             : [],
  //           country: row.country?.trim() || "",
  //           state: row.state?.trim() || "",
  //           district: row.district?.trim() || "",
  //           city: row.city?.trim() || "",
  //           approved: row.approved
  //             ? row.approved.trim().toLowerCase() === "true"
  //             : false,
  //           approved_by: row.approved_by?.trim() || null,
  //           session_id: sessionId,
  //         }));

  //       if (validationErrors.length > 0) {
  //         Swal.fire({
  //           position: "top-end",
  //           icon: "error",
  //           title: "Validation Failed",
  //           text: validationErrors.join("\n"),
  //           showConfirmButton: true,
  //           toast: false,
  //           customClass: { popup: "small-swal" },
  //           width: "auto",
  //           whiteSpace: "pre-wrap",
  //         });
  //         return;
  //       }

  //       if (students.length === 0) {
  //         Swal.fire({
  //           position: "top-end",
  //           icon: "warning",
  //           title: "Invalid Data",
  //           text: "No valid student records found in the CSV file. Ensure school_name, student_name, and class_name are non-empty, and Aadhaar numbers are either empty or 12 digits.",
  //           showConfirmButton: false,
  //           timer: 3000,
  //           toast: true,
  //         });
  //         return;
  //       }

  //       uploadStudentsData(students);
  //     },
  //     header: true,
  //     skipEmptyLines: true,
  //   });
  // };

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
          const rowNum = idx + 2; // Excel row number

          // Required fields
          if (
            !row.school_id?.trim() ||
            !row.student_name?.trim() ||
            !row.class_id?.trim()
          ) {
            errors.push(
              `Row ${rowNum}: Missing school_id, student_name or class_id`
            );
            return;
          }

          // Aadhaar validation
          const aadhaar = row.aadhaar_number?.trim();
          if (aadhaar && !/^\d{12}$/.test(aadhaar)) {
            errors.push(`Row ${rowNum}: Aadhaar must be exactly 12 digits`);
          }

          validStudents.push({
            school_id: row.school_id.trim(),
            student_name: row.student_name.trim(),
            class_id: formatClassName(row.class_id.trim()),
            student_section: row.student_section?.trim() || null,
            roll_no: row.roll_no?.trim() || null, // ← This is the key!
            mobile_number: row.mobile_number?.trim() || null,
            whatsapp_number: row.whatsapp_number?.trim() || null,
            aadhaar_number: aadhaar || null,
            student_subject: row.student_subject
              ? row.student_subject
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
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

  // const uploadStudentsData = async (students) => {
  //   if (!Array.isArray(students) || students.length === 0) {
  //     Swal.fire({
  //       position: "top-end",
  //       icon: "error",
  //       title: "Error",
  //       text: "No student data to upload.",
  //       showConfirmButton: false,
  //       timer: 2000,
  //       toast: true,
  //     });
  //     return;
  //   }

  //   const requiredFields = [
  //     "school_id",
  //     "class_id",
  //     "student_section",
  //     "student_name",
  //     "session_id",
  //   ];

  //   // === Local Validation ===
  //   const validationErrors = students.reduce((acc, student, index) => {
  //     const missingFields = requiredFields.filter(
  //       (field) => student[field] == null || student[field] === ""
  //     );
  //     if (missingFields.length > 0) {
  //       acc.push(
  //         `Row ${index + 2}: Missing required fields - ${missingFields.join(
  //           ", "
  //         )}`
  //       );
  //     }
  //     return acc;
  //   }, []);

  //   if (validationErrors.length > 0) {
  //     Swal.fire({
  //       position: "top-end",
  //       icon: "error",
  //       title: "Validation Failed",
  //       html: validationErrors.join("<br>"),
  //       showConfirmButton: true,
  //       customClass: { popup: "small-swal" },
  //       width: "auto",
  //     });
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       throw new Error("Unauthorized. Please log in again.");
  //     }

  //     const CHUNK_SIZE = 100; // ✅ you can adjust (e.g., 200)
  //     const totalChunks = Math.ceil(students.length / CHUNK_SIZE);
  //     let totalInserted = 0;
  //     let allErrors = [];

  //     for (let i = 0; i < students.length; i += CHUNK_SIZE) {
  //       const chunk = students.slice(i, i + CHUNK_SIZE);

  //       try {
  //         const response = await axios.post(
  //           `${API_BASE_URL}/api/get/student/bulk-upload`,
  //           chunk,
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );

  //         totalInserted += response.data.insertedCount || 0;

  //         if (response.data.errors?.length) {
  //           allErrors.push(...response.data.errors);
  //         }

  //         console.log(`Chunk ${i / CHUNK_SIZE + 1}/${totalChunks} uploaded`);
  //       } catch (chunkError) {
  //         console.error(`Chunk ${i / CHUNK_SIZE + 1} failed:`, chunkError);

  //         const { message, errors } = chunkError.response?.data || {};
  //         if (Array.isArray(errors)) {
  //           allErrors.push(...errors);
  //         } else {
  //           allErrors.push({
  //             rowIndex: null,
  //             message: message || "Unknown chunk upload error",
  //           });
  //         }
  //       }
  //     }

  //     // === After all chunks ===
  //     Swal.fire({
  //       position: "top-end",
  //       icon: "success",
  //       title: "Upload Completed",
  //       text: `Successfully uploaded ${totalInserted} students.`,
  //       showConfirmButton: false,
  //       timer: 2000,
  //       toast: true,
  //       background: "#fff",
  //       customClass: { popup: "small-swal" },
  //     });

  //     if (allErrors.length > 0) {
  //       const formattedErrors = allErrors
  //         .map((e) => `Row ${e.rowIndex ?? "?"}: ${e.message}`)
  //         .join("<br>");

  //       Swal.fire({
  //         position: "top-end",
  //         icon: "warning",
  //         title: "Some Records Failed",
  //         html: `<div style="text-align:left;white-space:pre-wrap;">${formattedErrors}</div>`,
  //         showConfirmButton: true,
  //         customClass: { popup: "small-swal" },
  //         width: "auto",
  //       });
  //     } else {
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.error("Upload Error:", error);

  //     let errorTitle = "Upload Failed";
  //     let errorMessage = "An error occurred while uploading students.";

  //     if (error.response?.data) {
  //       const { message, errors } = error.response.data;

  //       if (Array.isArray(errors) && errors.length > 0) {
  //         const formattedErrors = errors
  //           .map((e) => `Row ${e.rowIndex ?? "?"}: ${e.message}`)
  //           .join("<br>");
  //         errorMessage = formattedErrors;
  //       } else if (message) {
  //         errorMessage = message;
  //       }
  //     } else if (error.message.includes("Unauthorized")) {
  //       errorTitle = "Authentication Error";
  //       errorMessage = "Session expired. Please log in again.";
  //     }

  //     Swal.fire({
  //       position: "top-end",
  //       icon: "error",
  //       title: errorTitle,
  //       html: `<div style="text-align:left;white-space:pre-wrap;">${errorMessage}</div>`,
  //       showConfirmButton: true,
  //       customClass: { popup: "small-swal" },
  //       width: "auto",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
            { headers: { Authorization: `Bearer ${token}` } }
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
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleDownloadClick = () => {
  //   const sessionId = localStorage.getItem("currentSessionId") || "";
  //   const headers = [
  //     "school_id",
  //     "student_name",
  //     "class_id",
  //     "student_section",
  //     "mobile_number",
  //     "whatsapp_number",
  //     "aadhaar_number",
  //     "student_subject",
  //     "country",
  //     "state",
  //     "district",
  //     "city",
  //   ];
  //   const rows = [
  //     [
  //       "ABC School",
  //       "Alice Johnson",
  //       "01",
  //       "A",
  //       "1234567890",
  //       "1234567890",
  //       "123456789012",
  //       "GIMO",
  //       "India",
  //       "Odisha",
  //       "Cuttack",
  //       "Aliabad",
  //     ],
  //   ];

  //   const csvContent = [
  //     headers.join(","),
  //     ...rows.map((row) => row.join(",")),
  //   ].join("\n");
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "studentdata.csv";
  //   link.click();
  //   handleClose();
  // };

  const handleDownloadClick = () => {
    const headers = [
      "school_id",
      "student_name",
      "class_id",
      "student_section",
      "roll_no", // ← Manual roll number (optional)
      "mobile_number",
      "whatsapp_number",
      "aadhaar_number",
      "student_subject",
      "country",
      "state",
      "district",
      "city",
    ];

    const sampleData = [
      // Example with manual roll_no
      [
        "Gowell School",
        "Amit Kumar",
        "10",
        "A",
        "GWL10A01",
        "9876543210",
        "9876543210",
        "111122223333",
        "GIMO",
        "India",
        "Odisha",
        "Cuttack",
        "Cuttack",
      ],
    ];

    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_bulk_upload_template.csv";
    link.click();
    handleClose(); // close menu
  };

  // AG-Grid column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "SCHOOL",
        field: "school_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) => params.value?.toUpperCase() || "",
      },
      {
        headerName: "STUDENT",
        field: "student_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) => params.value?.toUpperCase() || "",
      },
      {
        headerName: "ROLL NUMBER",
        field: "roll_no",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CLASS",
        field: "class_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "SECTION",
        field: "student_section",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "MOBILE NUMBER",
        field: "mobile_number",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "SUBJECT",
        field: "student_subject",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) =>
          Array.isArray(params.value) ? params.value.join(", ") : "",
      },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "UPDATED BY",
        field: "updated_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "UPDATED AT",
        field: "updated_at",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
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
            <Link to={`/student/update/${params.data.id}`}>
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
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 100,
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
          padding: "1.5%",
          borderRadius: "5px",
          marginTop: "0",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              className="spinner"
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #1230AE",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                animation: "spin 1s linear infinite",
              }}
            />
            <span>Loading...</span>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <>
            <div
              className="ag-theme-alpine"
              style={{
                height: "500px",
                width: "100%",
                overflowX: "auto",
                position: "relative",
              }}
            >
              {searchLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#fff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    className="spinner"
                    style={{
                      border: "3px solid #f3f3f3",
                      borderTop: "3px solid #1230AE",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span>Searching...</span>
                </div>
              )}
              <AgGridReact
                columnDefs={columnDefs}
                rowData={students}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                pagination={false}
                suppressPaginationPanel={true}
                animateRows={true}
                onFilterChanged={onFilterChanged}
                theme={customTheme}
                rowSelection="multiple"
                onSelectionChanged={(params) => {
                  const selectedRows = params.api.getSelectedRows();
                  const newCheckedRows = selectedRows.reduce((acc, row) => {
                    acc[row.id] = true;
                    return acc;
                  }, {});
                  setCheckedRows(newCheckedRows);
                  setIsAllChecked(selectedRows.length === students.length);
                }}
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
                    setPageSize(parseInt(e.target.value, 10));
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
