import React, { useEffect, useState } from "react";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilDownloadAlt,
  UilInfoCircle,
  UilEye,
  UilFileDownloadAlt,
} from "@iconscout/react-unicons";
import {
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Modal,
  Box,
  Button,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../CommonButton/CreateButton";
import excelImg from "../../../../public/excell-img.png";
import Papa from "papaparse";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const pageSizes = [10, 20, 50, 100];

  // Fetch school data with session_id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔑 Get token
        const sessionId = localStorage.getItem("currentSessionId") || null;

        const schoolResponse = await axios.get(
          `${API_BASE_URL}/api/get/schools`,
          {
            params: {
              page,
              limit: pageSize,
              search: searchTerm,
              session_id: sessionId,
            },
            headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token
          }
        );

        const { schools, totalRecords, totalPages } = schoolResponse.data;

        const formattedData = await Promise.all(
          schools.map(async (record) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`,
                { headers: { Authorization: `Bearer ${token}` } } // ✅ token
              );
              const { username, role } = userResponse.data;

              let roleName = "Unknown Role";
              try {
                const roleResponse = await axios.get(
                  `${API_BASE_URL}/api/r1/role/${role}`,
                  { headers: { Authorization: `Bearer ${token}` } } // ✅ token
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
                updated_by: `${username} (${roleName})`,
              };
            } catch (userError) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                userError
              );
              return {
                ...record,
                created_by: "Unknown User (Unknown Role)",
                updated_by: "Unknown User (Unknown Role)",
              };
            }
          })
        );

        setRecords(formattedData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (error) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Failed to fetch school data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [page, pageSize, searchTerm]);

  // Handle session changes
  useEffect(() => {
    const handleSessionChange = () => {
      setPage(1);
    };
    window.addEventListener("storage", handleSessionChange);
    return () => window.removeEventListener("storage", handleSessionChange);
  }, []);

  // Handle row deletion
  // const handleDelete = (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085D6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //     customClass: { popup: "custom-swal-popup" },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       axios
  //         .delete(`${API_BASE_URL}/api/get/schools/${id}`)
  //         .then(() => {
  //           setRecords((prev) => prev.filter((record) => record.id !== id));
  //           setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
  //           setSelectedRowsCount((prev) => prev - 1);
  //           Swal.fire({
  //             position: "top-end",
  //             icon: "success",
  //             title: "Success!",
  //             text: "The school has been deleted.",
  //             showConfirmButton: false,
  //             timer: 1000,
  //             toast: true,
  //             background: "#fff",
  //             customClass: { popup: "small-swal" },
  //           });
  //         })
  //         .catch((error) => {
  //           Swal.fire({
  //             position: "top-end",
  //             icon: "error",
  //             title: "Error!",
  //             text:
  //               error.response?.data?.error ||
  //               "There was an issue deleting the school.",
  //             showConfirmButton: false,
  //             timer: 2000,
  //             toast: true,
  //             background: "#fff",
  //             customClass: { popup: "small-swal" },
  //           });
  //         });
  //     }
  //   });
  // };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "custom-swal-popup" },
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: "Authentication token is missing.",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            background: "#fff",
            customClass: { popup: "small-swal" },
          });
          return;
        }

        axios
          .delete(`${API_BASE_URL}/api/get/schools/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Add token here
            },
          })
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
            setSelectedRowsCount((prev) => prev - 1);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The school has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text:
                error.response?.data?.error ||
                "There was an issue deleting the school.",
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

  // Handle bulk upload and download
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

  const parseCSVData = (csvData) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const sessionId = localStorage.getItem("currentSessionId") || null;
        const schools = result.data
          .filter((row) => row.school_name?.trim())
          .map((row) => ({
            board: row.board?.trim() || undefined,
            school_name: row.school_name?.trim() || undefined,
            pincode: row.pincode?.trim() || undefined,
            school_address: row.school_address?.trim() || undefined,
            country: row.country?.trim() || undefined,
            state: row.state?.trim() || undefined,
            district: row.district?.trim() || undefined,
            city: row.city?.trim() || undefined,
            school_email: row.school_email?.trim() || null,
            principal_contact_number:
              row.principal_contact_number?.trim() || null,
            principal_name: row.principal_name?.trim() || null,
            principal_whatsapp: row.principal_whatsapp?.trim() || null,
            school_contact_number: row.school_contact_number?.trim() || null,
            school_landline_number: row.school_landline_number?.trim() || null,
            vice_principal_name: row.vice_principal_name?.trim() || null,
            vice_principal_contact_number:
              row.vice_principal_contact_number?.trim() || null,
            vice_principal_whatsapp:
              row.vice_principal_whatsapp?.trim() || null,
            manager_name: row.manager_name?.trim() || null,
            manager_contact_number: row.manager_contact_number?.trim() || null,
            manager_whatsapp_number:
              row.manager_whatsapp_number?.trim() || null,
            first_incharge_name: row.first_incharge_name?.trim() || null,
            first_incharge_number: row.first_incharge_number?.trim() || null,
            first_incharge_whatsapp:
              row.first_incharge_whatsapp?.trim() || null,
            second_incharge_name: row.second_incharge_name?.trim() || null,
            second_incharge_number: row.second_incharge_number?.trim() || null,
            second_incharge_whatsapp:
              row.second_incharge_whatsapp?.trim() || null,
            junior_student_strength:
              row.junior_student_strength?.trim() || null,
            senior_student_strength:
              row.senior_student_strength?.trim() || null,
            classes: row.classes?.trim()
              ? row.classes.split(",").map((c) => c.trim())
              : null,
            status: row.status?.trim() || null,
            session_id: sessionId,
            created_by: row.created_by?.trim() || "admin",
            updated_by: row.updated_by?.trim() || "admin",
          }));

        if (schools.length === 0) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Invalid Data",
            text: "No valid school records found in the CSV file. Ensure school_name is non-empty.",
            showConfirmButton: false,
            timer: 3000,
            toast: true,
          });
          return;
        }

        uploadSchoolsData(schools);
      },
      error: (error) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: `Failed to parse CSV: ${error.message}`,
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
      },
    });
  };

  const uploadSchoolsData = async (schools) => {
    // ——— 1. Empty Check ———
    if (!Array.isArray(schools) || schools.length === 0) {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "No Data",
        text: "Please upload a valid CSV file with school data.",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    }

    // ——— 2. Client-Side Validation (Row Numbers) ———
    // const requiredFields = ["school_name", "session_id"];
    const requiredFields = ["school_name", "session_id"]; // ✅ area_name required
    const clientErrors = [];
    schools.forEach((school, idx) => {
      const missing = requiredFields.filter(
        (f) => !school[f] || school[f] === ""
      );
      if (missing.length > 0) {
        clientErrors.push(`Row ${idx + 2}: Missing → ${missing.join(", ")}`);
      }
    });

    if (clientErrors.length > 0) {
      return Swal.fire({
        position: "top-end",
        icon: "error",
        title: `${clientErrors.length} Validation Error(s)`,
        html: clientErrors.map((e) => `<div>• ${e}</div>`).join(""),
        showConfirmButton: true,
        toast: true,
        customClass: { popup: "small-swal" },
        width: "500px",
      });
    }

    const token = localStorage.getItem("token");
    const chunkSize = 1000;
    const totalChunks = Math.ceil(schools.length / chunkSize);
    const allBackendErrors = []; // ← Collect ALL errors from ALL chunks

    try {
      for (let i = 0; i < schools.length; i += chunkSize) {
        const chunk = schools.slice(i, i + chunkSize);
        const startRow = i + 2; // CSV row = index + 2

        const response = await axios.post(
          `${API_BASE_URL}/api/get/school/bulk-upload`,
          chunk,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
            },
          }
        );

        const chunkIndex = Math.floor(i / chunkSize) + 1;

        // ——— Collect backend errors with correct ROW NUMBER ———
        if (response.data.errors?.length > 0) {
          response.data.errors.forEach((err, idx) => {
            const csvRow = startRow + idx;
            allBackendErrors.push(`Row ${csvRow}: ${err.error}`);
          });
        }

        // ——— Show chunk success (short) ———
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Schools ${chunkIndex}/${totalChunks}`,
          text: `Inserted ${response.data.insertedCount || 0} schools`,
          showConfirmButton: false,
          timer: 1200,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
      }

      // ——— FINAL: Show ALL ERRORS in ONE TOAST ———
      if (allBackendErrors.length > 0) {
        await Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${allBackendErrors.length} Error(s) Found`,
          html: allBackendErrors.map((e) => `<div>• ${e}</div>`).join(""),
          showConfirmButton: true,
          toast: true,
          customClass: { popup: "small-swal" },
          width: "550px",
          heightAuto: false,
        });
      }

      // ——— Final Success ———
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Upload Completed!",
        text: `Total: ${schools.length} schools processed`,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      }).then(() => {
        navigate(0);
      });
    } catch (error) {
      const resp = error.response?.data || {};
      const serverErrors = resp.errors || [];
      const message = resp.message || "Upload failed";

      const errorList =
        serverErrors.length > 0
          ? serverErrors.map((err, idx) => {
              const row = schools.findIndex(
                (s) =>
                  s.school_name === err.school ||
                  (err.error.includes("email") &&
                    s.school_email === err.error.split(": ")[1])
              );
              const csvRow = row >= 0 ? row + 2 : "Unknown";
              return `Row ${csvRow}: ${err.error}`;
            })
          : [`Error: ${message}`];

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Upload Failed",
        html: errorList.map((e) => `<div>• ${e}</div>`).join(""),
        showConfirmButton: true,
        toast: true,
        customClass: { popup: "small-swal" },
        width: "550px",
      });
    }
  };

  const handleDownloadClick = () => {
    const sessionId = localStorage.getItem("currentSessionId") || "";
    const headers = [
      "board",
      "school_name",
      "school_address",
      "city",
      "district",
      "state",
      "country",
      "pincode",
      "school_email",
      "principal_name",
      "principal_contact_number",
      "principal_whatsapp",
      "school_contact_number",
      "school_landline_number",
      "vice_principal_name",
      "vice_principal_contact_number",
      "vice_principal_whatsapp",
      "manager_name",
      "manager_contact_number",
      "manager_whatsapp_number",
      "first_incharge_name",
      "first_incharge_number",
      "first_incharge_whatsapp",
      "second_incharge_name",
      "second_incharge_number",
      "second_incharge_whatsapp",
      "classes",
    ];
    const rows = [
      [
        "CBSE",
        "ABC School",
        "BBSR Tankapani",
        "Aliabad",
        "Cuttack",
        "Odisha",
        "India",
        "411001",
        "abc@example.com",
        "Dr. Anil Kumar",
        "7991048546",
        "7991048546",
        "08012345678",
        "",
        "Priya Sharma",
        "9123456789",
        "9876543210",
        "susant",
        "9898789078",
        "9898789078",
        "prasant",
        "9898789078",
        "9898789078",
        "srikant",
        "9898789078",
        "9898789078",
        "1",
      ],
    ];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "schools_data_template.csv";
    link.click();
    handleClose();
  };

  const handleStatusApprovedChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/api/get/school/${id}/status-approved`,
        { status_approved: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === id ? { ...record, status_approved: newStatus } : record
        )
      );

      const statusMessage =
        newStatus === "approved"
          ? "Approved"
          : newStatus === "rejected"
          ? "Rejected"
          : "Pending";

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Status Updated!",
        text: `${statusMessage} status updated successfully`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message || "Failed to update approval status.",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    }
  };

  const handleGenerateAddress = async () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "No Selection",
        text: "Please select at least one school to generate addresses.",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
      return;
    }

    try {
      const schools = await Promise.all(
        selectedRows.map(async (rowId) => {
          try {
            const response = await axios.get(
              `${API_BASE_URL}/api/get/schools/${rowId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return response.data;
          } catch (error) {
            return null;
          }
        })
      );

      const validSchools = schools.filter((school) => school !== null);

      if (validSchools.length === 0) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "No valid school data retrieved.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
        return;
      }

      setSelectedSchools(validSchools);
      setOpenPopup(true);
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: error.response?.data?.error || "Failed to generate addresses.",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
    }
  };

  // Handle individual row checkbox toggle
  const handleRowCheckboxChange = (id, checked) => {
    setSelectedRows((prev) => {
      const newSelectedRows = checked
        ? [...prev, id]
        : prev.filter((rowId) => rowId !== id);
      setSelectedRowsCount(newSelectedRows.length);
      return newSelectedRows;
    });
  };

  // Handle select all checkbox
  const handleSelectAllChange = (checked) => {
    if (checked) {
      const currentPageIds = records.map((record) => record.id);
      setSelectedRows(currentPageIds);
      setSelectedRowsCount(currentPageIds.length);
    } else {
      setSelectedRows([]);
      setSelectedRowsCount(0);
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      setSelectedRows([]);
      setSelectedRowsCount(0);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      setSelectedRows([]);
      setSelectedRowsCount(0);
    }
  };

  return (
    <Mainlayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "13px",
        }}
      >
        <div role="presentation">
          <Breadcrumb data={[{ name: "School" }]} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              onClick={handleGenerateAddress}
              disabled={selectedRowsCount === 0}
              style={{
                fontSize: "14px",
                backgroundColor:
                  selectedRowsCount === 0 ? "#E0E0E0" : "#28A745",
                color: selectedRowsCount === 0 ? "#aaa" : "white",
                fontWeight: "500",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: selectedRowsCount === 0 ? "not-allowed" : "pointer",
                fontFamily: '"Poppins", sans-serif',
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "32px",
              }}
            >
              <UilFileDownloadAlt /> Generate Address
            </button>
          </div>
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
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "45px",
            }}
          >
            <CreateButton link="/school-create" style={{ margin: "auto" }} />
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
        <div
          style={{
            marginBottom: "13px",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by school name, email, mobile, school code..."
            style={{
              padding: "8px",
              width: "400px",
              border: "1px solid #aba8a8ff",
              borderRadius: "4px",
              fontFamily: '"Poppins", sans-serif',
              fontSize: "14px",
              marginLeft: "3px",
            }}
          />
        </div>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 500,
            overflowX: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Table
            sx={{ minWidth: 1200, borderTopRightRadius: "5px", border: "none" }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#113decff",
                    color: "white",
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "12px",
                    width: 50,
                    textAlign: "center",
                    borderRight: "1px solid rgba(241, 237, 237, 0.1)",
                  }}
                >
                  <Checkbox
                    checked={
                      records.length > 0 &&
                      selectedRows.length === records.length
                    }
                    onChange={(e) => handleSelectAllChange(e.target.checked)}
                    sx={{
                      color: "white",
                      "&.Mui-checked": { color: "white" },
                      transform: "scale(0.8)",
                    }}
                  />
                </TableCell>
                {[
                  "BOARD",
                  "SCHOOL",
                  "CODE",
                  "EMAIL",
                  "CONTACT",
                  "COUNTRY",
                  "STATE",
                  "DISTRICT",
                  "CITY",
                  "PINCODE",
                  "STATUS",
                  "CREATED BY",
                  "APPROVAL",
                  "APPROVED BY",
                  "ACTION",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      bgcolor: "#113decff",
                      color: "white",
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      fontWeight: "bold",
                      textAlign: header === "ACTION" ? "center" : "left",
                      width:
                        header === "SCHOOL"
                          ? 200
                          : header === "ACTION"
                          ? 140
                          : undefined,
                      whiteSpace: "nowrap",
                      borderRight: "1px solid rgba(245, 239, 239, 0.1)",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((row) => (
                <TableRow
                  key={row.id}
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
                      textAlign: "center",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) =>
                        handleRowCheckboxChange(row.id, e.target.checked)
                      }
                      sx={{ transform: "scale(0.8)" }}
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
                    {row.board_name?.toUpperCase() || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.school_name?.toUpperCase() || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.school_code?.toUpperCase() || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.school_email || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.school_contact_number || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.country_name?.toUpperCase() || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.state_name?.toUpperCase() || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.district_name?.toUpperCase() || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.city_name?.toUpperCase() || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.pincode || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.status || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.created_by
                      ? row.created_by.charAt(0).toUpperCase() +
                        row.created_by.slice(1)
                      : ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    <select
                      value={row.status_approved || "pending"}
                      onChange={(e) =>
                        handleStatusApprovedChange(row.id, e.target.value)
                      }
                      style={{
                        padding: "2px 4px",
                        border: "none",
                        minWidth: "80px",
                        background: "transparent",
                        color:
                          row.status_approved === "approved"
                            ? "green"
                            : row.status_approved === "rejected"
                            ? "orange"
                            : "red",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontFamily: '"Poppins", sans-serif',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    {row.approved_by
                      ? row.approved_by.charAt(0).toUpperCase() +
                        row.approved_by.slice(1)
                      : ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      textAlign: "center",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                      borderLeft: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Link to={`/school/update/${row.id}`}>
                        <UilEditAlt
                          style={{
                            color: "#1230AE",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                        />
                      </Link>
                      <Link to={`/school/view/${row.id}`}>
                        <UilEye
                          style={{
                            color: "#127e2bff",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                        />
                      </Link>
                      <UilTrashAlt
                        onClick={() => handleDelete(row.id)}
                        style={{
                          color: "#FF8787",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                    onClick={() => {
                      setPage(pg);
                      setSelectedRows([]);
                      setSelectedRowsCount(0);
                    }}
                    style={{
                      backgroundColor: page === pg ? "#007BFF" : "#F5F5F5",
                      color: page === pg ? "#fff" : "#333",
                      border:
                        page === pg ? "1px solid #0056B3" : "1px solid #ccc",
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
                backgroundColor: page === totalPages ? "#E0E0E0" : "#F5F5F5",
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
      </div>
      <Modal
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        aria-labelledby="school-addresses-modal"
        aria-describedby="school-addresses-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 800,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15)",
            p: 4,
            maxHeight: "80vh",
            background: "linear-gradient(145deg, #d2d4d6ff, #f5f4f4ff)",
          }}
        >
          <style>{`
     @media print {
  body * {
    visibility: hidden;
  }

  #printable-content, #printable-content * {
    visibility: visible;
  }

  #printable-content {
    position: static !important; /* reset modal positioning */
    width: 100%;
    left: 0;
    top: 0;
    text-align: center; /* center align cards */
    
  }

  #printable-scroll {
    overflow: visible !important;
    max-height: none !important;
  }

  /* Each card should start at the TOP of a new page */
  #printable-content > div {
    display: block;
    margin: 0 auto 10pt auto;   /* center horizontally */
    page-break-before: always;  /* force each card on new page */
  }

  #printable-content > div:first-child {
    page-break-before: auto; /* first card won’t leave blank page */
  }
}

    `}</style>

          {/* Header */}
          <div
            id="print-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{ fontFamily: '"Poppins", sans-serif', color: "#1230AE" }}
            >
              School Addresses
            </h2>
            <Button
              variant="contained"
              onClick={() => window.print()}
              sx={{
                backgroundColor: "#28A745",
                "&:hover": { backgroundColor: "#218838" },
                fontFamily: '"Poppins", sans-serif',
                textTransform: "none",
              }}
            >
              Print
            </Button>
          </div>

          {/* Scroll area */}
          <div
            id="printable-scroll"
            style={{
              maxHeight: "65vh",
              overflowY: "auto",
              paddingRight: "8px",
            }}
          >
            <div id="printable-content">
              {selectedSchools.map((school, index) => {
                const contact =
                  school.school_contact_number ||
                  school.principal_contact_number ||
                  "N/A";
                return (
                  <div
                    key={index}
                    style={{
                      width: "100mm",
                      height: "55mm",
                      border: "2px solid #bebebeff",
                      marginBottom: "20pt",
                      pageBreakAfter: "always",
                      fontFamily: '"Poppins", sans-serif',
                      backgroundColor: "#fff",
                      padding: "12pt",
                      borderRadius: "6px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "5pt",
                      boxShadow: "#b6c7caff",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12pt",
                        fontWeight: "bold",
                        color: "#141415ff",
                        margin: 0,
                      }}
                    >
                      To
                    </p>
                    <p
                      style={{
                        fontSize: "12pt",
                        fontWeight: "bold",
                        color: "#141415ff",
                        margin: 0,
                      }}
                    >
                      The Principal
                    </p>
                    <p
                      style={{
                        fontSize: "13pt",
                        fontWeight: "bold",
                        color: "#000",
                        margin: 0,
                        maxWidth: "80mm",
                        overflowWrap: "break-word",
                      }}
                    >
                      {school.school_name || "Unknown"}
                    </p>
                    <p
                      style={{
                        fontSize: "12pt",
                        color: "#333",
                        margin: 0,
                        maxWidth: "80mm",
                        overflowWrap: "break-word",
                      }}
                    >
                      {school.school_address || ""}
                    </p>
                    <p
                      style={{
                        fontSize: "12pt",
                        fontWeight: "bold",
                        color: "#141415ff",
                        margin: 0,
                        maxWidth: "80mm",
                        overflowWrap: "break-word",
                      }}
                    >
                      Contact No: {contact}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Box>
      </Modal>
    </Mainlayout>
  );
}
