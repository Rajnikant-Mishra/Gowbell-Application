import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
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

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const gridApiRef = useRef(null);
  const pageSizes = [10, 20, 50, 100];

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Date";
    }
  };

  const sizeColumnsToFit = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.sizeColumnsToFit();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching exams with params:", {
          page,
          limit: pageSize,
          search: searchTerm,
        });
        const examResponse = await axios.get(
          `${API_BASE_URL}/api/e1/get-exams-paginate`,
          {
            params: { page, limit: pageSize, search: searchTerm },
          }
        );

        console.log("Exam API response:", examResponse.data);

        const {
          exams = [],
          totalRecords = 0,
          totalPages = 0,
        } = examResponse.data || {};

        if (!Array.isArray(exams)) {
          throw new Error("Expected 'exams' to be an array");
        }

        const formattedData = await Promise.all(
          exams.map(async (record) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/u1/users/${record.created_by}`
              );
              const userName = userResponse.data?.username || "Unknown User";
              return {
                ...record,
                exam_date: record.exam_date
                  ? record.exam_date.split("T")[0]
                  : "",
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: userName,
              };
            } catch (userError) {
              console.error(
                `Failed to fetch user details for created_by: ${record.created_by}`,
                userError
              );
              return {
                ...record,
                exam_date: record.exam_date
                  ? record.exam_date.split("T")[0]
                  : "",
                created_at: formatTimestamp(record.created_at),
                updated_at: formatTimestamp(record.updated_at),
                created_by: "Unknown User",
              };
            }
          })
        );

        setRecords(formattedData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);

        setTimeout(sizeColumnsToFit, 0);
      } catch (error) {
        console.error(
          "Error fetching exam data:",
          error.message,
          error.response
        );
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: `Failed to fetch exam data: ${error.message}`,
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchTerm, sizeColumnsToFit]);

  const handleDelete = useCallback(
    (id) => {
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
            .delete(`${API_BASE_URL}/api/e1/delete-exam/${id}`)
            .then(() => {
              setRecords((prev) => prev.filter((record) => record.id !== id));
              setTimeout(sizeColumnsToFit, 0);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Success!",
                text: "The exam has been deleted.",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                toast: true,
                background: "#fff",
                customClass: { popup: "small-swal" },
              });
            })
            .catch((error) => {
              console.error("Error deleting exam:", error.message);
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: `There was an issue deleting the exam: ${error.message}`,
                showConfirmButton: false,
                timer: 2000,
                toast: true,
                background: "#fff",
                customClass: { popup: "small-swal" },
              });
            });
        }
      });
    },
    [sizeColumnsToFit]
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: "SCHOOL NAME",
        field: "school_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value.toUpperCase()
            : params.value || "",
      },
      {
        headerName: "CLASS",
        field: "class_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueGetter: (params) => params.data.class_name?.join(", ") || "",
      },
      {
        headerName: "SUBJECTS",
        field: "subject_name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueGetter: (params) => params.data.subject_name?.join(", ") || "",
      },
      {
        headerName: "LEVEL",
        field: "level",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 80,
      },
      {
        headerName: "DATE FORM",
        field: "exam_date",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
      },
      {
        headerName: "CREATED BY",
        field: "created_by",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueFormatter: (params) =>
          params.value
            ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
            : "",
      },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 120,
      },
      {
        headerName: "ACTION",
        field: "action",
        sortable: false,
        filter: false,
        minWidth: 80,
        cellRenderer: (params) => (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link to={`/exam/update/${params.data.id}`}>
              <UilEditAlt
                style={{
                  color: "#1230AE",
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
    [handleDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: "agTextColumnFilter",
      sortable: true,
      minWidth: 80,
      flex: 1,
      suppressFilterResetOnColumnChange: true,
    }),
    []
  );

  const onGridReady = useCallback(
    (params) => {
      gridApiRef.current = params.api;
      sizeColumnsToFit();
    },
    [sizeColumnsToFit]
  );

  const onFilterChanged = useCallback(
    (params) => {
      if (gridApiRef.current) {
        const filterModel = gridApiRef.current.getFilterModel();
        const searchValue = Object.values(filterModel)
          .map((filter) => filter.filter)
          .filter((value) => value && value.trim() !== "")
          .join(" ")
          .trim();

        console.log("Filter changed, new search term:", searchValue);
        setSearchTerm(searchValue);
        setPage(1);
        setTimeout(sizeColumnsToFit, 0);
      }
    },
    [sizeColumnsToFit]
  );

  const handlePreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
      setTimeout(sizeColumnsToFit, 0);
    }
  }, [page, sizeColumnsToFit]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
      setTimeout(sizeColumnsToFit, 0);
    }
  }, [page, totalPages, sizeColumnsToFit]);

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
          <Breadcrumb data={[{ name: "Exam" }]} />
        </div>
        <div>
          <CreateButton link={"/exam"} />
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
                rowSelection="multiple"
                suppressRowClickSelection={true}
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
                    setTimeout(sizeColumnsToFit, 0);
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
                          setTimeout(sizeColumnsToFit, 0);
                        }}
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
