import React, { useEffect, useState } from "react";
import {
  FaCaretDown,
  FaCaretUp,
  FaEdit,
  FaTrash,
  FaSearch,
  FaHome,
  FaPlus,
} from "react-icons/fa";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";

import Mainlayout from "../../Layouts/Mainlayout";
import styles from "./../../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import ButtonComp from "../../CommonButton/ButtonComp";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";
import { Menu, MenuItem } from "@mui/material";
import CreateButton from "../../../Components/CommonButton/CreateButton";
import excelImg from "../../../../public/excell-img.png";
import Papa from "papaparse"; // Import Papaparse for CSV parsing

export default function DataTable() {
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
    const fetchData = async () => {
      try {
        // Fetch school records
        const schoolResponse = await axios.get(
          `${API_BASE_URL}/api/get/schools`
        );
        const schoolData = schoolResponse.data;

        // Fetch user details for each school based on created_by
        const formattedData = await Promise.all(
          schoolData.map(async (record) => {
            const userResponse = await axios.get(
              `${API_BASE_URL}/api/u1/users/${record.created_by}`
            );
            const userName = userResponse.data.username;
            return {
              ...record,
              created_by: userName, // Replace created_by ID with username
            };
          })
        );

        setRecords(formattedData);
        setFilteredRecords(formattedData);
      } catch (error) {
        console.error("There was an error fetching the records!", error);
      }
    };

    fetchData();
  }, []);

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
          .delete(`${API_BASE_URL}/api/get/schools/${id}`)
          .then((response) => {
            // Update the state after successful deletion
            setRecords((prevCountries) =>
              prevCountries.filter((country) => country.id !== id)
            );
            setFilteredRecords((prevFiltered) =>
              prevFiltered.filter((country) => country.id !== id)
            );
            // delete Show a success alert
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: `The school has been deleted.`,
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: {
                popup: "small-swal",
              },
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Trigger file selection dialog
  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
    handleClose();
  };

  // Handle file selection change
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

  // // Parse CSV data and map to school objects
  const parseCSVData = (csvData) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("Parsed CSV Data:", result.data);
        // Map CSV rows to school objects as expected by the backend
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
          created_by: row.created_by?.trim() || "admin", // Default to 'admin' if not provided
          updated_by: row.updated_by?.trim() || "admin", // Default to 'admin' if not provided
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

  // Upload the schools data to backend
  // const uploadSchoolsData = async (schools) => {
  //   if (!Array.isArray(schools) || schools.length === 0) {
  //     Swal.fire({
  //       position: "top-end",
  //       icon: "warning",
  //       title: "No Data",
  //       text: "Please upload a valid CSV file with school data.",
  //       showConfirmButton: false,
  //       timer: 3000,
  //       timerProgressBar: true,
  //       toast: true,
  //       background: "#fff",
  //       customClass: { popup: "small-swal" },
  //     });
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const token = localStorage.getItem("token"); // Or however you are storing the token
  //     const response = await axios.post(
  //       `${API_BASE_URL}/api/get/school/bulk-upload`,
  //       schools,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setLoading(false);
  //     Swal.fire({
  //       position: "top-end",
  //       icon: "success",
  //       title: "Success!",
  //       text: `Successfully uploaded ${response.data.affectedRows} schools.`,
  //       showConfirmButton: false,
  //       timer: 1000,
  //       timerProgressBar: true,
  //       toast: true,
  //       background: "#fff",
  //       customClass: { popup: "small-swal" },
  //     }).then(() => {
  //       // Refresh the page or navigate to your school list view
  //       navigate(0);
  //     });
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       position: "top-end",
  //       icon: "error",
  //       title: "Error!",
  //       text: error.response?.data?.message || "An error occurred during upload.",
  //       showConfirmButton: false,
  //       timer: 3000,
  //       timerProgressBar: true,
  //       toast: true,
  //       background: "#fff",
  //       customClass: { popup: "small-swal" },
  //     });
  //   }
  // };
  const validateSchoolData = (schools) => {
    const mandatoryFields = [
      "board",
      "school_name",
      "pincode",
      "school_address",
      "country",
      "state",
      "district",
      "city",
    ];

    const invalidSchools = schools.filter((school) =>
      mandatoryFields.some(
        (field) => !school[field] || school[field].trim() === ""
      )
    );

    return invalidSchools;
  };

  const uploadSchoolsData = async (schools) => {
    if (!Array.isArray(schools) || schools.length === 0) {
      Swal.fire({
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
      return;
    }

    // Validate schools data for mandatory fields
    const invalidSchools = validateSchoolData(schools);
    if (invalidSchools.length > 0) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Invalid Data",
        text: `Some mandatory fields are missing in ${invalidSchools.length} row(s). Please correct and try again.`,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Or however you are storing the token
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
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Successfully uploaded ${response.data.affectedRows} schools.`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      }).then(() => {
        // Refresh the page or navigate to your school list view
        navigate(0);
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message || "An error occurred during upload.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    }
  };

  // Download CSV template for schools
  const handleDownloadClick = () => {
    // Define CSV headers for school data
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
      "principal_contact_number",
      "principal_name",
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

    // Sample row for template purposes
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
        "7991048546",
        "Dr. Anil Kumar",
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
      headers.join(","), // Header row
      ...rows.map((row) => row.join(",")), // Data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "schools_data_template.csv";
    link.click();

    handleClose();
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "School" }]} />
        </div>

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
                // marginLeft: "584px",
                height: "27px",
                fontSize: "14px",
                // border: "0.2px solid white",
                // backgroundColor: "white",
                // boxShadow: "rgba(0, 0, 0, 0.05) 1.95px 1.95px 2.6px",
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
            <CreateButton link="/school-create" className="MY-AUTO" />
          </div>
        </div>
        {/* <div>
          <CreateButton link={"/school-create"} />
        </div> */}
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
                "board",
                "school ",
                "school code",
                "email",
                "contact",
                "country",
                "state",
                "district",
                "city",
                "pincode",
                "status",
                "created by",
              ].map((col) => (
                <th
                  key={col}
                  className={styles.sortableHeader}
                  onClick={() => handleSort(col)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{col.toUpperCase()}</span>
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
              "board",
              "school name",
              "school code",
              "email",
              "contact",
              "country",
              "state",
              "district",
              "city",
              "pincode",
              "status",
              "created by",
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

                <td>
                  {typeof row.board === "string"
                    ? row.board.toUpperCase()
                    : row.board}
                </td>
                <td>
                  {typeof row.school_name === "string"
                    ? row.school_name.toUpperCase()
                    : row.school_name}
                </td>
                <td>
                  {typeof row.school_code === "string"
                    ? row.school_code.toUpperCase()
                    : row.school_code}
                </td>
                <td>{row.school_email}</td>
                <td>{row.school_contact_number}</td>
                <td>{row.country_name}</td>
                <td>{row.state_name}</td>
                <td>{row.district_name}</td>
                <td>{row.city_name}</td>
                <td>{row.pincode}</td>
                <td>{row.status}</td>
                <td>{row.created_by}</td>

                <td>
                  <div className={styles.actionButtons}>
                    {/* <FaEdit Link to={`/update/${row.id}`} className={`${styles.FaEdit}`} /> */}
                    <Link to={`/school/update/${row.id}`}>
                      <UilEditAlt className={styles.FaEdit} />
                    </Link>
                    {/* <Link to="#">
                      <FaEdit className={styles.FaEdit} />
                    </Link> */}
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
