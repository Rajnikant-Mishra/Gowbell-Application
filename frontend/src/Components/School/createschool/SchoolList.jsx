//->23.05.25
import React, { useEffect, useState, useMemo } from "react";
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
  UilEye,
} from "@iconscout/react-unicons";
import { Menu, MenuItem } from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../../Components/CommonButton/CreateButton";
import excelImg from "../../../../public/excell-img.png";
import Papa from "papaparse";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const gridApiRef = React.useRef(null);
  const pageSizes = [10, 20, 50, 100];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const schoolResponse = await axios.get(
          `${API_BASE_URL}/api/get/schools`,
          {
            params: { page, limit: pageSize, search: searchTerm },
          }
        );

        const { schools, totalRecords, totalPages } = schoolResponse.data;

        const formattedData = await Promise.all(
          schools.map(async (record) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const { username, role } = userResponse.data;

              let roleName = "Unknown Role";
              try {
                const roleResponse = await axios.get(
                  `${API_BASE_URL}/api/r1/role/${role}`
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
              };
            } catch (userError) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                userError
              );
              return {
                ...record,
                created_by: "Unknown User (Unknown Role)",
              };
            }
          })
        );

        setRecords(formattedData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching school data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Failed to fetch school data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchTerm]);

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
        axios
          .delete(`${API_BASE_URL}/api/get/schools/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The school has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting school:", error);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text: "There was an issue deleting the school.",
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

  const parseCSVData = (csvData) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const schools = result.data.map((row) => ({
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
          vice_principal_whatsapp: row.vice_principal_whatsapp?.trim() || null,
          manager_name: row.manager_name?.trim() || null,
          manager_contact_number: row.manager_contact_number?.trim() || null,
          manager_whatsapp_number: row.manager_whatsapp_number?.trim() || null,
          first_incharge_name: row.first_incharge_name?.trim() || null,
          first_incharge_number: row.first_incharge_number?.trim() || null,
          first_incharge_whatsapp: row.first_incharge_whatsapp?.trim() || null,
          second_incharge_name: row.second_incharge_name?.trim() || null,
          second_incharge_number: row.second_incharge_number?.trim() || null,
          second_incharge_whatsapp:
            row.second_incharge_whatsapp?.trim() || null,
          junior_student_strength: row.junior_student_strength?.trim() || null,
          senior_student_strength: row.senior_student_strength?.trim() || null,
          classes: row.classes?.trim()
            ? row.classes.split(",").map((c) => c.trim())
            : null,
          status: row.status?.trim() || null,
          created_by: row.created_by?.trim() || "admin",
          updated_by: row.updated_by?.trim() || "admin",
        }));
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
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
      },
    });
  };

  const uploadSchoolsData = async (schools) => {
    if (!Array.isArray(schools) || schools.length === 0) {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "No Data",
        text: "Please upload a valid CSV file with school data.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/get/school/bulk-upload`,
        schools,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      if (response.data.errors && response.data.errors.length > 0) {
        // Display each error in a separate Swal toast
        response.data.errors.forEach((error, index) => {
          setTimeout(() => {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: `Error in ${error.school || "Unnamed School"}`,
              text: error.error,
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          }, index * 4500); // Stagger toasts by 4.5 seconds to avoid overlap
        });
      } else {
        // Success case: no errors
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Successfully uploaded ${response.data.insertedCount} schools.`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        }).then(() => {
          navigate(0);
        });
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || "An error occurred during upload.";
      const errors = error.response?.data?.errors || [];

      if (errors.length > 0) {
        // Display each error in a separate Swal toast
        errors.forEach((err, index) => {
          setTimeout(() => {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: `Error in ${err.school || "Unnamed School"}`,
              text: err.error,
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          }, index * 4500); // Stagger toasts by 4.5 seconds
        });
      } else {
        // General server error
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: errorMessage,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
      }
    }
  };

  const handleDownloadClick = () => {
    const headers = [
      "board",
      "school_name",
      "school_address",
      "pincode",
      "country",
      "state",
      "district",
      "city",
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
      "junior_student_strength",
      "senior_student_strength",
      "classes",
      "status",
    ];
    const rows = [
      [
        "CBSE",
        "ABC School",
        "BBSR Tankapani",
        "411001",
        "India",
        "Odisha",
        "Cuttack",
        "Aliabad",
        "abc@example.com",
        "Dr. Anil Kumar",
        "7991048546",
        "7991048546",
        "08012345678",
        "Priya Sharma",
        "Ravi Patel",
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
        "400",
        "500",
        "1",
        "active",
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
      console.error("Error updating Approved:", error);
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

  const columnDefs = useMemo(
    () => [
      {
        headerName: "BOARD",
        field: "board",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value,
      },
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
        headerName: "SCHOOL CODE",
        field: "school_code",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 170,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value,
      },
      {
        headerName: "EMAIL",
        field: "school_email",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "CONTACT",
        field: "school_contact_number",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "COUNTRY",
        field: "country_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "STATE",
        field: "state_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "DISTRICT",
        field: "district_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CITY",
        field: "city_name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "PINCODE",
        field: "pincode",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "STATUS",
        field: "status",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        valueFormatter: (params) => {
          const value = params.value;
          if (!value) return "";
          return value.charAt(0).toUpperCase() + value.slice(1);
        },
      },
      {
        headerName: "APPROVAL",
        field: "status_approved",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
        cellRenderer: (params) => {
          const row = params.data;
          return (
            <div
              style={{
                overflow: "visible",
                position: "relative",
                zIndex: 1,
              }}
            >
              <select
                value={row.status_approved || "pending"}
                onChange={(e) =>
                  handleStatusApprovedChange(row.id, e.target.value)
                }
                style={{
                  padding: "4px 8px",
                  border: "none",
                  minWidth: "100px",
                  background: "transparent",
                  color:
                    row.status_approved === "approved"
                      ? "green"
                      : row.status_approved === "rejected"
                      ? "orange"
                      : "red",
                  cursor: "pointer",
                  appearance: "auto",
                }}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          );
        },
      },
      {
        headerName: "APPROVED BY",
        field: "approved_by",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
        cellStyle: { fontWeight: "bold" },
        valueFormatter: (params) => {
          const value = params.value;
          if (!value) return "";
          return value.charAt(0).toUpperCase() + value.slice(1);
        },
      },
      {
        headerName: "ACTION",
        field: "action",
        sortable: false,
        filter: false,
        width: 140,
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link to={`/school/update/${params.data.id}`}>
              <UilEditAlt
                style={{
                  color: "#1230AE",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              />
            </Link>

            {/* View icon */}
            <Link to={`/school/view/${params.data.id}`}>
              <UilEye
                style={{
                  color: "#127e2bff", // green for view
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
    [handleStatusApprovedChange, handleDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: "agTextColumnFilter",
      sortable: true,
      // floatingFilter: true,
      minWidth: 100,
      suppressFilterResetOnColumnChange: true, // Prevent filter reset
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
      setPage(1); // Reset to first page on filter change
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
          <Breadcrumb data={[{ name: "School" }]} />
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
                theme={customTheme}
                suppressClearFilterOnColumnChange={true} // Prevent filter clearing
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
