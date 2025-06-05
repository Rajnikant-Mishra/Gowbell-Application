// src/components/DataTable.js
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import styles from "./../../CommonTable/DataTable.module.css";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";
import Checkbox from "@mui/material/Checkbox";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import CreateButton from "../../CommonButton/CreateButton";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig"; // Ensure this points to your backend (e.g., http://localhost:3000)

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

  // Fetch questions from the backend
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/q1/question`)
      .then((response) => {
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setRecords(response.data);
          setFilteredRecords(response.data);
        } else {
          console.error("Unexpected API response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  // Handle delete action
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
        axios
          .delete(`${API_BASE_URL}/api/q1/question/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((q) => q.id !== id));
            setFilteredRecords((prev) => prev.filter((q) => q.id !== id));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The question has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting question:", error);
            Swal.fire(
              "Error!",
              "There was an issue deleting the question.",
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
    let direction =
      sortConfig.column === column && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    let sortedData = [...filteredRecords].sort((a, b) => {
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

  // Sort icon rendering
  const getSortIcon = (column) => {
    const isActive = sortConfig.column === column;
    const isAsc = sortConfig.direction === "asc";
    return (
      <div className={styles.sortIconsContainer}>
        <FaCaretUp
          className={`${styles.sortIcon} ${
            isActive && isAsc ? styles.activeSortIcon : ""
          }`}
          onClick={() => handleSort(column)}
        />
        <FaCaretDown
          className={`${styles.sortIcon} ${
            isActive && !isAsc ? styles.activeSortIcon : ""
          }`}
          onClick={() => handleSort(column)}
        />
      </div>
    );
  };

  // Pagination controls
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < Math.ceil(filteredRecords.length / pageSize)) setPage(page + 1);
  };

  const currentRecords = Array.isArray(filteredRecords)
    ? filteredRecords.slice((page - 1) * pageSize, page * pageSize)
    : [];

  // Checkbox handling
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

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedRows({});
    } else {
      const allChecked = filteredRecords.reduce((acc, row) => {
        acc[row.id] = true;
        return acc;
      }, {});
      setCheckedRows(allChecked);
    }
    setIsAllChecked(!isAllChecked);
  };

  useEffect(() => {
    if (Array.isArray(filteredRecords) && filteredRecords.length > 0) {
      setIsAllChecked(filteredRecords.every((row) => checkedRows[row.id]));
    } else {
      setIsAllChecked(false);
    }
  }, [checkedRows, filteredRecords]);

  // Define columns based on your questions table
  const columns = ["school_name", "set_name"];

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "Questions List" }]} />
        </div>
        <div>
          <CreateButton link="/question-create" />
        </div>
      </div>

      <div className={`${styles.tablecont} mt-0`}>
        <table
          className={styles.table}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <thead>
            <tr className={`${styles.headerRow} pt-0 pb-0`}>
              <th>
                <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className={styles.sortableHeader}
                  onClick={() => handleSort(col)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{col.replace("_", " ").toUpperCase()}</span>
                    {getSortIcon(col)}
                  </div>
                </th>
              ))}
              <th>Action</th>
            </tr>
            <tr
              className={styles.filterRow}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <th></th>
              {columns.map((col) => (
                <th key={col}>
                  <div className={styles.inputContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder={`Search ${col.replace("_", " ")}`}
                      onChange={(e) => handleFilter(e, col)}
                      className={styles.filterInput}
                    />
                  </div>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((row) => (
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
                  <td>{row.set_name}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link to={`/question/update/${row.id}`}>
                        <UilEditAlt className={styles.FaEdit} />
                      </Link>
                      <UilTrashAlt
                        onClick={() => handleDelete(row.id)}
                        className={styles.FaTrash}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 2}>No questions found</td>
              </tr>
            )}
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
            <p className="my-auto text-secondary">data per Page</p>
          </div>
          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <p className="my-auto text-secondary">
              {filteredRecords.length} of {page}-
              {Math.ceil(filteredRecords.length / pageSize)}
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
