import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Mainlayout from "../Layouts/Mainlayout";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import ReactPaginate from "react-paginate";
import 'font-awesome/css/font-awesome.min.css';
import styles from "../CommonTable/DataTable.module.css"; // Make sure you have this file

export default function DataTable() {
  const [records, setRecords] = useState([]); // Holds all records
  const [filteredRecords, setFilteredRecords] = useState([]); // Holds filtered records
  const [filters, setFilters] = useState({
    subject: "",

    // board: "",
    // name: "",
    // school_email: "",
    // school_contact_number: "",
    // state: "",
    // district: "",
    // city: "",
    // pincode: "",
  }); // Stores the values of filters per column

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    axios.get(`${API_BASE_URL}/api/all-results`,) // Your API URL here
      .then((response) => {
        setRecords(response.data);
        setFilteredRecords(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the records!", error);
      });
  }, []);

  // Filter the records based on the filters
  useEffect(() => {
    if (!Array.isArray(records.students)) {
        console.warn("Records is not an array:", records);
        return;
      }
      const filtered = records.students.filter((row) => {
        return Object.keys(filters).every((column) => {
          const filterValue = filters[column].toLowerCase().trim();
    
          if (!filterValue) return true; // Skip empty filters
    
          return row[column]
            ? row[column].toString().toLowerCase().includes(filterValue)
            : false;
        });
      });
    
      setFilteredRecords(filtered);
    }, [filters, records]);

  // Handle filter input change
  const handleFilterChange = (e, column) => {
    setFilters({
      ...filters,
      [column]: e.target.value,
    });
  };

  // Handle page changes
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(0); // Reset to first page when page size changes
  };

  // Get current records based on pagination
  const currentRecords = Array.isArray(filteredRecords)
  ? filteredRecords.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  : [];

  const searchContainer = {
    position: 'relative',
    display: 'inline-block',
  };

  // Mapping of column keys to user-friendly names
  const columnHeaders = {
    student_name: "name",
    class: "class",
    roll_no: "roll",
    full_mark: "fullmark",
    mark_secured: "marksecured",
    percentage: "percentage",
    medals: "medals",
    certificate: "certificate",
    level: "level",
    subject: "subject",
    remarks: "remarks",
};
  return (
    <Mainlayout>
      <div className="data-filter d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "Exam Report", link: "/school-list" }]} // Adjusted link
          />
        </div>
      </div>

      {/* Table displaying filtered records */}
      <div className="table-responsive bg-white p-3 rounded shadow-sm">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              {/* Table headers with dynamic names */}
              {Object.keys(columnHeaders).map((col) => (
                <th key={col} style={{ padding: "8px", textAlign: "left", textTransform:"capitalize"}}>
                  {columnHeaders[col]} {/* User-friendly column names */}
                  <div className="line-container" style={{
                    border: 'none',
                    height: '6px',
                    background: 'linear-gradient(to right,rgb(255, 255, 255),rgba(99, 159, 161, 0.44))',
                    borderRadius: '5px',
                    width: '100%',
                    margin: '5px auto',
                    padding: '0px'
                  }}>
                      <hr className="gradient-line" />
                   </div>                  
                   {/* Filter input for each column */}
                  <div className="d-flex flex-column" style={searchContainer}>
                    <input
                      type="text"
                      placeholder= {columnHeaders[col]}
                      value={filters[col]}
                      className="form-control"
                      onChange={(e) => handleFilterChange(e, col)} // Filter update per column
                      style={{
                        margin: "3px 6px 3px 2px",
                        padding: "5px",
                        width: "100%", // You can adjust width to suit the design
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: '6px'
                      }}
                    />
                    <span
                      className="bi bi-search search-icon"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        fontSize: '14px',
                        // backgroundColor: '#ADD8E6',
                        padding: '4.7px',
                        marginRight: '-11px',
                        // borderRadius: '4px',
                        color: 'gray',
                        // borderEndEndRadius: '4px',
                        // borderTopRightRadius: '4px',
                        borderLeft:' 1px solid #ddd'
                      }}
                    ></span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-data">
          
            {currentRecords.length > 0 ? (
              currentRecords.map((row, index) => (
                <tr key={index}>
                <td>{row.student_name}</td>
                <td>{row.class}</td>
                <td>{row.roll_no}</td>
                <td>{row.full_mark}</td>
                <td>{row.mark_secured}</td>
                <td>{row.percentage}</td>
                <td>{row.medals}</td>
                <td>{row.certificate}</td>
                <td>{row.level}</td>
                <td>{row.subject}</td>
                <td>{row.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Show Total Records */}
        <div className={`${styles.totalRecordsInfo} d-flex justify-content-between align-items-center flex-wrap mt-2`}>
  {/* Left Side - Page Size Selector */}
  <div className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}>
    <select
      value={pageSize}
      onChange={handlePageSizeChange}
      className={styles.pageSizeSelector}
    >
      {[10, 20, 50, 100].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
    <p className="my-auto text-secondary">data per Page</p>
  </div>

  {/* Middle - Total Records Info */}
  <span className="text-center flex-grow-1 text-md-center">
    Showing {currentRecords.length} of {filteredRecords.length} records
  </span>

  {/* Right Side - Pagination */}
  <div className={styles.pagination}>
    <ReactPaginate
      previousLabel={<i className="fa fa-chevron-left"></i>}
      nextLabel={<i className="fa fa-chevron-right"></i>}
      breakLabel={"..."}
      pageCount={Math.ceil(filteredRecords.length / pageSize)}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={styles.paginationContainer}
      activeClassName={styles.activePage}
      disabledClassName={styles.disabledPage}
    />
  </div>
</div>
      </div>
    </Mainlayout>
  );
}
