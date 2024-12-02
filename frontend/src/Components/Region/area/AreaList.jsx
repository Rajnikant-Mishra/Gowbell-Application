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

import Mainlayout from "../../Layouts/Mainlayout";
import styles from "./DataTable.module.css";
import Checkbox from "@mui/material/Checkbox";
import ButtonComp from "../../CommonButton/ButtonComp";
import { Breadcrumbs } from "@mui/material";
import { styled, emphasize } from "@mui/material/styles";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

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
    // Fetch data from the API when the component mounts
    axios
      .get("http://localhost:5000/api/areas/") // Your API URL here
      .then((response) => {
        setRecords(response.data);
        setFilteredRecords(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the records!", error);
      });
  }, []);

  const handleDelete = (id) => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the delete request
        axios
          .delete(`http://localhost:5000/api/areas/${id}`)
          .then((response) => {
            // Update the state after successful deletion
            setRecords((prevCountries) =>
              prevCountries.filter((country) => country.id !== id)
            );
            setFilteredRecords((prevFiltered) =>
              prevFiltered.filter((country) => country.id !== id)
            );

            // Show a success alert
            Swal.fire("Deleted!", "The state has been deleted.", "success");
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

  //breadcrumb codes
  const StyledBreadcrumb = styled("span")(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      borderRadius: theme.shape.borderRadius,
      fontFamily: '"Nunito", sans-serif !important',
      fontSize: "14px",

      "&:active": {
        color: "#1230AE",
      },
      "&:hover": {
        color: "#1230AE",
      },
    };
  });

  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

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
      <div className="d-flex justify-content-between align-items-center">
        <div
          role="presentation"
          onClick={handleClick}
          className={`${styles.breadcrumb} my-4`}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <StyledBreadcrumb
              component="a"
              href="#"
              style={{ display: "flex", alignItems: "center" }}
            >
              <FaHome fontSize="small" style={{ marginRight: 4 }} />
              Dashboard
            </StyledBreadcrumb>
            {/* <StyledBreadcrumb component="a" href="#">
              Catalog
            </StyledBreadcrumb> */}
            <StyledBreadcrumb
              onClick={handleClick}
              style={{ display: "flex", alignItems: "center" }}
            >
              Areas
            </StyledBreadcrumb>
          </Breadcrumbs>
        </div>
        <div>
          <ButtonComp
            link="/area/create"
            text={<FaPlus />}
            type={"button"}
            disabled={false}
          />
        </div>
      </div>
      <div className={`${styles.tablecont} mt-0`}>
        <table
          className={`${styles.table} `}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <thead>
            <tr
              className={styles.headerRow}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <th>
                <Checkbox checked={isAllChecked} onChange={handleSelectAll} />
              </th>
              {["name", "created_at", "updated_at"].map((col) => (
                <th key={col} className={styles.sortableHeader}>
                  <p className="d-flex justify-content-between">
                    <p>{col.charAt(0).toUpperCase() + col.slice(1)}</p>
                    <span>{getSortIcon(col)}</span>
                  </p>
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
            {["name", "created_at", "updated_at"].map((col) => (
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
                <td>{row.name}</td>
                <td>{row.created_at}</td>
                <td>{row.updated_at}</td>

                <td>
                  <div className={styles.actionButtons}>
                    {/* <FaEdit Link to={`/update/${row.id}`} className={`${styles.FaEdit}`} /> */}
                    <Link to={`/area/update/${row.id}`}>
                      <FaEdit className={styles.FaEdit} />
                    </Link>
                    <FaTrash
                      onClick={() => handleDelete(row.id)}
                      className={`${styles.FaTrash}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between flex-wrap my-2">
          <div className={`${styles.pageSizeSelector} d-flex flex-wrap`}>
            {pageSizes.map((size) => (
              <ButtonComp
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setPage(1);
                }}
                className={`${styles.pageSizeButton} ${
                  pageSize === size ? styles.activeButton : ""
                }`}
                text={`${size}`}
              />
            ))}
          </div>
          {/* Pagination Information */}
          <div className="my-0 d-flex justify-content-center align-items-center">
            <label
              htmlFor="pageSize"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <p className={`${styles.paginationButton} ${styles.activePage}`}>
                {filteredRecords.length} of {page}-
                {Math.ceil(filteredRecords.length / pageSize)}
              </p>
            </label>
          </div>
          {/* Pagination Buttons */}
          <div className={styles.pagination}>
            <ButtonComp
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={styles.paginationButton}
              text={"Previous"}
            />
            {Array.from(
              { length: Math.ceil(filteredRecords.length / pageSize) },
              (_, i) => i + 1
            ).map((pg) => (
              <ButtonComp
                key={pg}
                text={pg}
                onClick={() => setPage(pg)}
                disabled={false}
                className={pg === page ? styles.activePage : ""}
              >
                {pg}
              </ButtonComp>
            ))}
            <ButtonComp
              onClick={handleNextPage}
              disabled={page === Math.ceil(filteredRecords.length / pageSize)}
              className={styles.paginationButton}
              text={"Next"}
            />
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}
