import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import {
  UilTrashAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import styles from "../../CommonTable/DataTable.module.css";
import "../../Common-Css/Swallfire.css";
import Checkbox from "@mui/material/Checkbox";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../CommonButton/CreateButton";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [items, setItems] = useState({}); // State to store item id to name mapping
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const pageSizes = [10, 20, 50, 100];

  useEffect(() => {
    // Fetch subitems
    axios
      .get(`${API_BASE_URL}/api/s1/all`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];

        // Format timestamps
        const formattedData = data.map((record) => ({
          ...record,
          created_at: formatTimestamp(record.created_at),
          updated_at: formatTimestamp(record.updated_at),
        }));

        setRecords(formattedData);
        setFilteredRecords(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching subitems!", error);
        setRecords([]);
        setFilteredRecords([]);
      });

    // Fetch items to map item_id to item name
    axios
      .get(`${API_BASE_URL}/api/t1/items`)
      .then((response) => {
        const itemData = Array.isArray(response.data) ? response.data : [];
        const itemMap = itemData.reduce((acc, item) => {
          acc[item.id] = item.name; // Assuming item has 'id' and 'name' fields
          return acc;
        }, {});
        setItems(itemMap);
      })
      .catch((error) => {
        console.error("Error fetching items!", error);
        setItems({});
      });
  }, []);

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

  useEffect(() => {
    if (Array.isArray(filteredRecords) && filteredRecords.length > 0) {
      if (filteredRecords.every((row) => checkedRows[row.id])) {
        setIsAllChecked(true);
      } else {
        setIsAllChecked(false);
      }
    } else {
      setIsAllChecked(false);
    }
  }, [checkedRows, filteredRecords]);

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
          .delete(`${API_BASE_URL}/api/s1/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setFilteredRecords((prev) =>
              prev.filter((record) => record.id !== id)
            );
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The item has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting:", error);
            Swal.fire(
              "Error!",
              "There was an issue deleting the item.",
              "error"
            );
          });
      }
    });
  };

  const handleFilter = (event, column) => {
    const value = event.target.value.toLowerCase();
    const filtered = records.filter((row) => {
      if (column === "Item") {
        // Filter by item name
        const itemName = items[row.item_id] || "";
        return itemName.toLowerCase().includes(value);
      }
      return (row[column] || "").toString().toLowerCase().includes(value);
    });
    setFilteredRecords(filtered);
    setPage(1);
  };

  const handleSort = (column) => {
    let direction =
      sortConfig.column === column && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    let sortedData = [...filteredRecords];
    sortedData.sort((a, b) => {
      let aValue = column === "Item" ? items[a.item_id] || "" : a[column];
      let bValue = column === "Item" ? items[b.item_id] || "" : b[column];

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

  const currentRecords = Array.isArray(filteredRecords)
    ? filteredRecords.slice((page - 1) * pageSize, page * pageSize)
    : [];

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

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "SubItem" }]} />
        </div>
        <div>
          <CreateButton link={"/create-subitem"} />
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
              {["Item", "Sub Item", "created at", "updated at"].map((col) => (
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
            <tr
              className={styles.filterRow}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
              {["Item", "Sub Item", "created at", "updated at"].map((col) => (
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
          </thead>
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
                <td>{items[row.item_id] || row.item_id}</td>{" "}
                {/* Display item name */}
                <td>{row.name}</td>
                <td>{row.created_at}</td>
                <td>{row.updated_at}</td>
                <td>
                  <div className={styles.actionButtons}>
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
            <p className={`my-auto text-secondary`}>data per Page</p>
          </div>
          <div className="my-0 d-flex justify-content-center align-items-center my-auto">
            <label
              htmlFor="pageSize"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <p className={`my-auto text-secondary`}>
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
