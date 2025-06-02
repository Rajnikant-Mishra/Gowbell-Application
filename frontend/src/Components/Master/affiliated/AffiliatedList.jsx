import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import CreateButton from "../../CommonButton/CreateButton";
import "../../Common-Css/DeleteSwal.css";
import "../../Common-Css/Swallfire.css";

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [checkedRows, setCheckedRows] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Role, setRoleDetails] = useState({});
  const pageSizes = [10, 20, 50, 100];
  const gridApiRef = React.useRef(null);

  // Fetch roleDetails from localStorage
  useEffect(() => {
    const storedRoleDetails = JSON.parse(localStorage.getItem("roleDetails"));
    if (storedRoleDetails) {
      setRoleDetails(storedRoleDetails);
    }
  }, []);

  // Format timestamp to match original
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

  // Fetch and format data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/affiliated`)
      .then(async (response) => {
        const formattedData = await Promise.all(
          response.data.map(async (record) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const userName = userResponse.data.username;
              return {
                ...record,
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: userName,
              };
            } catch (error) {
              console.error(
                `Error fetching user data for ID ${record.created_by}`,
                error
              );
              return {
                ...record,
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: "Unknown",
              };
            }
          })
        );
        setRecords(formattedData);
        setFilteredRecords(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Failed to fetch affiliated data.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle row deletion
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
          .delete(`${API_BASE_URL}/api/affiliated/${id}`)
          .then(() => {
            setRecords((prev) => prev.filter((record) => record.id !== id));
            setFilteredRecords((prev) =>
              prev.filter((record) => record.id !== id)
            );
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: "The affiliated record has been deleted.",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: { popup: "small-swal" },
            });
          })
          .catch((error) => {
            console.error("Error deleting record:", error);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text: "There was an issue deleting the record.",
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

  // Column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "NAME",
        field: "name",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed width
      },
      {
        headerName: "STATUS",
        field: "status",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed width
      },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed width
      },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed width
      },
      {
        headerName: "UPDATED AT",
        field: "updated_at",
        sortable: true,
        filter: "agTextColumnFilter",
        // Removed width
      },
      {
        headerName: "ACTION",
        field: "action",
        sortable: false,
        filter: false,
        // Removed width
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Role.permissions?.includes("UilEditAlt") && (
              <Link to={`/affiliated/update/${params.data.id}`}>
                <UilEditAlt
                  style={{
                    color: "#1230AE",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                />
              </Link>
            )}
            {Role.permissions?.includes("UilTrashAlt") && (
              <UilTrashAlt
                onClick={() => handleDelete(params.data.id)}
                style={{
                  color: "#FF8787",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              />
            )}
          </div>
        ),
      },
    ],
    [Role.permissions, handleDelete]
  );

  // Default column settings
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 100,
      flex: 1, // Allow columns to stretch and fill available space
      suppressFilterResetOnColumnChange: true,
    }),
    []
  );

  // Auto-size strategy to fit grid width
  const autoSizeStrategy = useMemo(
    () => ({
      type: "fitGridWidth", // Automatically fit columns to the grid's width
    }),
    []
  );

  // Handle grid initialization
  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.setAutoSizeStrategy(autoSizeStrategy); // Apply auto-size strategy
  };

  // Handle filter changes
  const onFilterChanged = (params) => {
    const filterModel = params.api.getFilterModel();
    const filteredData = records.filter((row) =>
      Object.entries(filterModel).every(([field, filter]) =>
        (row[field] || "")
          .toString()
          .toLowerCase()
          .includes(filter.filter.toLowerCase())
      )
    );
    setFilteredRecords(filteredData);
    setPage(1);
    params.api.setRowData(filteredData);
  };

  // Handle row selection
  const onSelectionChanged = () => {
    const selectedNodes = gridApiRef.current.getSelectedNodes();
    const selectedIds = selectedNodes.map((node) => node.data.id);
    setCheckedRows(
      selectedIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
    );
    setIsAllChecked(
      selectedIds.length === filteredRecords.length &&
        filteredRecords.length > 0
    );
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < Math.ceil(filteredRecords.length / pageSize)) setPage(page + 1);
  };

  // Calculate current records for pagination
  const currentRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Custom theme for AG Grid
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
          <Breadcrumb data={[{ name: "Affiliated" }]} />
        </div>
        <div>
          <CreateButton link={"/affiliated/create"} />
        </div>
      </div>
      <div
        style={{
          background: "white",
          padding: "1.5%",
          borderRadius: "5px",
          marginTop: "0",
          width: "100%", // Ensure container takes full width
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div
              className="ag-theme-alpine"
              style={{ height: "500px", width: "100%" }} // Full width for grid
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={currentRecords}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                autoSizeStrategy={autoSizeStrategy} // Apply auto-size strategy
                pagination={false}
                suppressPaginationPanel={true}
                animateRows={true}
                onFilterChanged={onFilterChanged}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
                theme={customTheme}
                suppressClearFilterOnColumnChange={true}
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
                <label style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <p
                    style={{
                      margin: "auto",
                      color: "#6C757D",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    {filteredRecords.length} of {page}-
                    {Math.ceil(filteredRecords.length / pageSize)}
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
                  disabled={
                    page === Math.ceil(filteredRecords.length / pageSize)
                  }
                  style={{
                    backgroundColor:
                      page === Math.ceil(filteredRecords.length / pageSize)
                        ? "#E0E0E0"
                        : "#F5F5F5",
                    color:
                      page === Math.ceil(filteredRecords.length / pageSize)
                        ? "#aaa"
                        : "#333",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                    padding: "3px 3.5px",
                    width: "33px",
                    height: "30px",
                    cursor:
                      page === Math.ceil(filteredRecords.length / pageSize)
                        ? "not-allowed"
                        : "pointer",
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
