import React, { useEffect, useState } from "react";
import {
  FaCaretDown,
  FaCaretUp,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import Mainlayout from "../../../Layouts/Mainlayout";
import styles from "./DataTable.module.css";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sampleData = [
    {
      id: 1,
      name: "Tiger Nixon",
      position: "System Architect",
      office: "Edinburgh",
      age: 61,
      startDate: "2011-04-25",
      salary: "$320,800",
    },
    {
      id: 2,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: 63,
      startDate: "2011-07-25",
      salary: "$170,750",
    },
    {
      id: 3,
      name: "Ashton Cox",
      position: "Junior Technical Author",
      office: "San Francisco",
      age: 66,
      startDate: "2009-01-12",
      salary: "$86,000",
    },
    {
      id: 4,
      name: "Cedric Kelly",
      position: "Senior Javascript Developer",
      office: "Edinburgh",
      age: 22,
      startDate: "2012-03-29",
      salary: "$433,060",
    },
    {
      id: 5,
      name: "Airi Satou",
      position: "Accountant",
      office: "Tokyo",
      age: 33,
      startDate: "2008-11-28",
      salary: "$162,700",
    },
    {
      id: 6,
      name: "Brielle Williamson",
      position: "Integration Specialist",
      office: "New York",
      age: 61,
      startDate: "2012-12-02",
      salary: "$372,000",
    },
    {
      id: 7,
      name: "Herrod Chandler",
      position: "Sales Assistant",
      office: "San Francisco",
      age: 59,
      startDate: "2012-08-06",
      salary: "$137,500",
    },
    {
      id: 8,
      name: "Rhona Davidson",
      position: "Integration Specialist",
      office: "Tokyo",
      age: 55,
      startDate: "2010-10-14",
      salary: "$327,900",
    },
    {
      id: 9,
      name: "Colleen Hurst",
      position: "Javascript Developer",
      office: "San Francisco",
      age: 39,
      startDate: "2009-09-15",
      salary: "$205,500",
    },
    {
      id: 10,
      name: "Sonya Frost",
      position: "Software Engineer",
      office: "Edinburgh",
      age: 23,
      startDate: "2008-12-13",
      salary: "$103,600",
    },
    {
      id: 11,
      name: "Jena Gaines",
      position: "Office Manager",
      office: "London",
      age: 30,
      startDate: "2009-03-11",
      salary: "$90,560",
    },
    {
      id: 12,
      name: "Quinn Flynn",
      position: "Support Lead",
      office: "Edinburgh",
      age: 22,
      startDate: "2013-03-03",
      salary: "$342,000",
    },
    {
      id: 13,
      name: "Charde Marshall",
      position: "Regional Director",
      office: "San Francisco",
      age: 36,
      startDate: "2008-10-16",
      salary: "$470,600",
    },
    {
      id: 14,
      name: "Haley Kennedy",
      position: "Senior Marketing Designer",
      office: "London",
      age: 43,
      startDate: "2012-12-18",
      salary: "$313,500",
    },
    {
      id: 15,
      name: "Tatyana Fitzpatrick",
      position: "Regional Director",
      office: "London",
      age: 19,
      startDate: "2010-03-17",
      salary: "$385,750",
    },
    {
      id: 16,
      name: "Michael Silva",
      position: "Marketing Designer",
      office: "London",
      age: 66,
      startDate: "2012-11-27",
      salary: "$198,500",
    },
    {
      id: 17,
      name: "Paul Byrd",
      position: "Chief Financial Officer (CFO)",
      office: "New York",
      age: 64,
      startDate: "2010-06-09",
      salary: "$725,000",
    },
    {
      id: 18,
      name: "Gloria Little",
      position: "Systems Administrator",
      office: "New York",
      age: 59,
      startDate: "2009-04-10",
      salary: "$237,500",
    },
    {
      id: 19,
      name: "Bradley Greer",
      position: "Software Engineer",
      office: "London",
      age: 41,
      startDate: "2012-10-13",
      salary: "$132,000",
    },
    {
      id: 20,
      name: "Diana Wade",
      position: "Customer Support",
      office: "Edinburgh",
      age: 40,
      startDate: "2010-11-25",
      salary: "$374,500",
    },
  ];

  useEffect(() => {
    setRecords(sampleData);
    setFilteredRecords(sampleData);
  }, []);

  const handleFilter = (event, column) => {
    const value = event.target.value.toLowerCase();
    const filtered = records.filter((row) =>
      (row[column] || "").toString().toLowerCase().includes(value)
    );
    setFilteredRecords(filtered);
    setPage(1); // Reset to page 1 after filtering
  };

  const handleSort = (column) => {
    let direction = "asc"; // Default to ascending (small to big)

    if (sortConfig.column === column) {
      // Toggle the direction when clicking on the same column
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    let sortedData = [...filteredRecords];
    sortedData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue) // Ascending (small to big)
          : bValue.localeCompare(aValue); // Descending (big to small)
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
            e.stopPropagation(); // Prevent header click event
            handleSort(column);
          }}
        />
        <FaCaretDown
          className={`${styles.sortIcon} ${
            isActive && !isAsc ? styles.activeSortIcon : ""
          }`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent header click event
            handleSort(column);
          }}
        />
      </div>
    );
  };

  // const resetSortAndFilter = () => {
  //   setFilteredRecords(records); // Reset filters
  //   setSortConfig({ column: "", direction: "asc" }); // Reset sorting
  //   setPage(1); // Reset to the first page
  // };

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

  return (
    <Mainlayout>
      {/* Page Size Selector */}
      <div className={styles.pageSizeSelector}>
        <label
          htmlFor="pageSize"
          style={{ fontFamily: "Nunito, sans-serif", marginRight: "10px" }}
        >
          Records per page:
        </label>
        <select
          id="pageSize"
          style={{ fontFamily: "Nunito, sans-serif" }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1); // Reset to page 1 when changing page size
          }}
          className={styles.pageSizeDropdown}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <table
        className={`${styles.table} `}
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <thead>
          <tr
            className={styles.headerRow}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <th>#</th>
            {["name", "position", "office", "age", "startDate", "salary"].map(
              (col) => (
                <th key={col} className={styles.sortableHeader}>
                  <p className="d-flex justify-content-between">
                    <p>{col.charAt(0).toUpperCase() + col.slice(1)}</p>
                    <span>{getSortIcon(col)}</span>
                  </p>
                </th>
              )
            )}
            <th>Action</th>
          </tr>
        </thead>
        <tr
          className={styles.filterRow}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <th style={{ fontFamily: "Nunito, sans-serif" }}></th>
          {["name", "position", "office", "age", "startDate", "salary"].map(
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
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.position}</td>
              <td>{row.office}</td>
              <td>{row.age}</td>
              <td>{row.startDate}</td>
              <td>{row.salary}</td>
              <td className="gap-3 d-flex">
                <FaEdit className={`${styles.FaEdit}`} />
                <FaTrash className={`${styles.FaTrash}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        {Array.from(
          { length: Math.ceil(filteredRecords.length / pageSize) },
          (_, i) => i + 1
        ).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`${styles.paginationButton} ${
              pg === page ? styles.activePage : ""
            }`}
          >
            {pg}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={page === Math.ceil(filteredRecords.length / pageSize)}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </Mainlayout>
  );
}
