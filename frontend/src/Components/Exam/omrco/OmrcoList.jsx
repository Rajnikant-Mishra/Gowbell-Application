import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import {
  UilTrashAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilEye,
  UilEditAlt,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import styles from "./../../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import CreateButton from "../../CommonButton/CreateButton";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

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

  const pageSizes = [10, 20, 50, 100];
  const columns = [
    { label: "SCHOOL", key: "school" },
    { label: "COUNTRY", key: "country" },
    { label: "STATE", key: "state" },
    { label: "DISTRICT", key: "district" },
    { label: "CITY", key: "city" },
    { label: "SUBJECTS", key: "subjects" },
    { label: "CLASSES", key: "classes" },
    { label: "TOTAL STUDENTS", key: "student_count" },
    { label: "LEVEL", key: "level" },
    { label: "ACTION", key: "action" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/omr/omr-data`);
        setRecords(response.data.data);
        setFilteredRecords(response.data.data);
      } catch (error) {
        console.error("Error fetching OMR data:", error);
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
          .delete(`${API_BASE_URL}/api/omr/omr-data/${id}`)
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
              text: `The omr has been deleted.`,
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

  const handleFilter = (event, key) => {
    const value = event.target.value.toLowerCase();
    const filtered = records.filter((row) => {
      const cellValue = Array.isArray(row[key])
        ? row[key].join(", ")
        : row[key]?.toString().toLowerCase() || "";
      return cellValue.includes(value);
    });
    setFilteredRecords(filtered);
    setPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    const sortedData = [...filteredRecords].sort((a, b) => {
      const aValue = Array.isArray(a[key]) ? a[key].join(", ") : a[key];
      const bValue = Array.isArray(b[key]) ? b[key].join(", ") : b[key];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    });

    setFilteredRecords(sortedData);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    const isActive = sortConfig.key === key;
    const isAsc = sortConfig.direction === "asc";
    return (
      <div className={styles.sortIconsContainer}>
        <FaCaretUp
          className={`${styles.sortIcon} ${
            isActive && isAsc ? styles.activeSortIcon : ""
          }`}
        />
        <FaCaretDown
          className={`${styles.sortIcon} ${
            isActive && !isAsc ? styles.activeSortIcon : ""
          }`}
        />
      </div>
    );
  };

  const handlePreviousPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () =>
    page < Math.ceil(filteredRecords.length / pageSize) && setPage(page + 1);

  const currentRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleRowCheck = (id) => {
    setCheckedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    setIsAllChecked(filteredRecords.every((row) => checkedRows[row.id]));
  }, [checkedRows, filteredRecords]);

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "OMR" }]} />
        <CreateButton link="/omr-create" />
      </div>

      <div className={`${styles.tablecont} mt-0`}>
        <table
          className={styles.table}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <thead>
            <tr className={`${styles.headerRow} pt-0 pb-0`}>
              <th>
                <Checkbox
                  checked={isAllChecked}
                  onChange={() => {
                    const newChecked = {};
                    if (!isAllChecked) {
                      filteredRecords.forEach((row) => {
                        newChecked[row.id] = true;
                      });
                    }
                    setCheckedRows(newChecked);
                  }}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={styles.sortableHeader}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{col.label}</span>
                    {getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>

            <tr className={styles.filterRow}>
              <th></th>
              {columns.map((col) => (
                <th key={col.key}>
                  <div className={styles.inputContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder={`Search ${col.label}`}
                      onChange={(e) => handleFilter(e, col.key)}
                      className={styles.filterInput}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((row) => (
              <tr key={row.id} className={styles.dataRow}>
                <td>
                  <Checkbox
                    checked={!!checkedRows[row.id]}
                    onChange={() => handleRowCheck(row.id)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={`${row.id}-${col.key}`}>
                    {col.key === "action" ? (
                      <>
                        <div className={styles.actionButtons}>
                          <Link to={`/omr/view/${row.id}`}>
                            <UilEye className={styles.FaEdit} />
                          </Link>
                          <UilTrashAlt
                            onClick={() => handleDelete(row.id)}
                            className={`${styles.FaTrash} text-danger cursor-pointer`}
                            style={{ width: "25px", height: "25px" }}
                          />
                          {/* <Link to={`/omr/update/${row.id}`}>
                            <UilEditAlt className={styles.FaEdit} />
                          </Link> */}
                        </div>
                      </>
                    ) : Array.isArray(row[col.key]) ? (
                      row[col.key].join(", ")
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
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
                setPageSize(Number(e.target.value));
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
            <p className="my-auto text-secondary">items per page</p>
          </div>

          <div className="my-auto">
            <p className="text-secondary">
              Showing {currentRecords.length} of {filteredRecords.length} items
            </p>
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
