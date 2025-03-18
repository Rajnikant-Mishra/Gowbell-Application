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
import Button from "@mui/material/Button";

import Mainlayout from "../Layouts/Mainlayout";
import styles from "../CommonTable/DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import ButtonComp from "../CommonButton/ButtonComp";

import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/DeleteSwal.css";
import "../Common-Css/Swallfire.css";
import CreateButton from "../../Components/CommonButton/CreateButton";
import { Menu, MenuItem } from "@mui/material";
// import excelImg from "../../../public/excell-img.png";
// import Papa from "papaparse"; // Import Papaparse for CSV parsing

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
        // Fetch inventory records
        const inventoryResponse = await axios.get(
          `${API_BASE_URL}/api/v1/inventory`
        );
        const inventoryData = inventoryResponse.data;

        // Fetch user details for each record
        const formattedData = await Promise.all(
          inventoryData.map(async (record) => {
            const userResponse = await axios.get(
              `${API_BASE_URL}/api/u1/users/${record.created_by}`
            );
            const userName = userResponse.data.username; 
            return {
              ...record,
              date: record.date.split("T")[0], // Format date
              created_by: userName, // Add the user's name
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
          .delete(`${API_BASE_URL}/api/v1/inventory/${id}`)
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
              text: `The inventory has been deleted.`,
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
            console.error("Error deleting inventory:", error);
            // Show an error alert if deletion fails
            Swal.fire(
              "Error!",
              "There was an issue deleting the inventory.",
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

  // const currentRecords = filteredRecords.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );
  const currentRecords = Array.isArray(filteredRecords)
    ? filteredRecords.slice((page - 1) * pageSize, page * pageSize)
    : [];

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

  //breadcrumb codes

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

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "Inventory" }]} />
        </div>
        <div>
          <CreateButton link={"/create-inventory"} />
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
                "date",
                "created_by",
                "item",
                "quantity",
                "unit",
                "remarks",
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
            {["date", "created_by", "item", "quantity", "unit", "remarks"].map(
              (col) => (
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
              )
            )}
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
                <td>{row.date}</td>
                <td>{row.created_by}</td>
                <td>{row.item}</td>
                <td>{row.quantity}</td>
                <td>{row.unit}</td>
                <td>{row.remarks}</td>

                <td>
                  <div className={styles.actionButtons}>
                    <Link to={`/inventory/${row.id}`}>
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
