import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
 
const AgGridTable = ({ rowData, columnDefs }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [10, 20, 50, 100];
 
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: true,
      sortable: true,
      floatingFilter: false,
      minWidth: 100,
    }),
    []
  );
 
  const currentRecords = rowData.slice((page - 1) * pageSize, page * pageSize);
 
  const customTheme = {
    "--ag-font-size": "14px",
    "--ag-row-height": "40px",
    "--ag-header-background-color": "#1230ae",
    "--ag-header-foreground-color": "#ffffff",
    "--ag-grid-size": "6px",
    "--ag-cell-horizontal-padding": "8px",
    fontFamily: "'Poppins', sans-serif",
  };
 
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };
 
  const handleNextPage = () => {
    if (page < Math.ceil(rowData.length / pageSize)) setPage(page + 1);
  };
 
  return (
    <div
      style={{
        background: "white",
        padding: "1.5%",
        borderRadius: "5px",
        marginTop: "0",
      }}
    >
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%", overflowX: "auto" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={currentRecords}
          defaultColDef={defaultColDef}
          pagination={false}
          suppressPaginationPanel={true}
          animateRows={true}
          theme={customTheme}
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
              color: "#6c757d",
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
          <label style={{ fontFamily: "Nunito, sans-serif" }}>
            <p
              style={{
                margin: "auto",
                color: "#6c757d",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
              }}
            >
              {rowData.length} of {page}-{Math.ceil(rowData.length / pageSize)}
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
              backgroundColor: page === 1 ? "#e0e0e0" : "#f5f5f5",
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
            { length: Math.ceil(rowData.length / pageSize) },
            (_, i) => i + 1
          )
            .filter(
              (pg) =>
                pg === 1 ||
                pg === Math.ceil(rowData.length / pageSize) ||
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
                    backgroundColor: page === pg ? "#007bff" : "#f5f5f5",
                    color: page === pg ? "#fff" : "#333",
                    border:
                      page === pg ? "1px solid #0056b3" : "1px solid #ccc",
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
            disabled={page === Math.ceil(rowData.length / pageSize)}
            style={{
              backgroundColor:
                page === Math.ceil(rowData.length / pageSize)
                  ? "#e0e0e0"
                  : "#f5f5f5",
              color:
                page === Math.ceil(rowData.length / pageSize) ? "#aaa" : "#333",
              border: "1px solid #ccc",
              borderRadius: "7px",
              padding: "3px 3.5px",
              width: "33px",
              height: "30px",
              cursor:
                page === Math.ceil(rowData.length / pageSize)
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
    </div>
  );
};
 
export default AgGridTable;