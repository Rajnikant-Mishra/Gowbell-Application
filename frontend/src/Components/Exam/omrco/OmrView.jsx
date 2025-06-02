import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons"; // Assuming icons are imported
import styles from "./../../CommonTable/DataTable.module.css";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";

const OmrView = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [omrData, setOmrData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Start at 1 to match pagination logic
  const [pageSize, setPageSize] = useState(10); // Start at 10 rows per page
  const pageSizes = [5, 10, 25]; // Define available page sizes

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch OMR data
        const omrResponse = await axios.get(
          `${API_BASE_URL}/api/omr/get/${id}`
        );
        setOmrData(omrResponse.data);

        // Fetch all students
        const studentsResponse = await axios.get(
          `${API_BASE_URL}/api/get/allstudents`
        );
        setStudents(studentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Helper function to get student data as an array of objects
  const getStudentData = (studentIds) => {
    if (!studentIds) return [];
    let ids;
    try {
      // Parse studentIds if it's a JSON string; otherwise, assume it's an array
      ids =
        typeof studentIds === "string" ? JSON.parse(studentIds) : studentIds;
    } catch (e) {
      return [];
    }
    if (!Array.isArray(ids)) return [];
    return ids
      .map((id) => {
        const student = students.find(
          (s) => s.id === id || s.id.toString() === id
        );
        return {
          id,
          name: student ? student.student_name : `Unknown (ID: ${id})`,
        };
      })
      .filter((student) => student.name); // Filter out any invalid entries
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(studentData.length / pageSize);
    if (page < totalPages) setPage(page + 1);
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  if (!omrData)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No data found
        </Typography>
      </Box>
    );

  const studentData = getStudentData(omrData.students);
  const filteredRecords = studentData; // Assuming no filtering for now
  const currentRecords = studentData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb data={[{ name: "OMR Details" }]} />
        </div>
      </div>
      <Box sx={{ p: 4, mx: "auto", mt: -4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography style={{ color: "black" }}>
                <strong>School:</strong>{" "}
                <strong>{omrData.school || "N/A"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography style={{ color: "black" }}>
                <strong>Classes:</strong>{" "}
                {(() => {
                  try {
                    const parsed =
                      typeof omrData.classes === "string"
                        ? JSON.parse(omrData.classes)
                        : omrData.classes;
                    return Array.isArray(parsed) ? parsed.join(", ") : "None";
                  } catch (err) {
                    return "None";
                  }
                })()}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography style={{ color: "black" }}>
                <strong>Subjects:</strong>{" "}
                {(() => {
                  try {
                    const parsed =
                      typeof omrData.subjects === "string"
                        ? JSON.parse(omrData.subjects)
                        : omrData.subjects;
                    return Array.isArray(parsed) ? parsed.join(", ") : "None";
                  } catch (err) {
                    return "None";
                  }
                })()}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {studentData.length > 0 ? (
                <>
                  <TableContainer
                    component={Paper}
                    sx={{ mt: 2, borderRadius: 1 }}
                  >
                    <Table sx={{ minWidth: 650 }} aria-label="students table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "primary.light" }}>
                          <TableCell
                            sx={{ fontWeight: "bold", color: "white" }}
                          >
                            #
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", color: "white" }}
                          >
                            Student Name
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentRecords.map((student, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:hover": { backgroundColor: "action.hover" },
                            }}
                          >
                            <TableCell>
                              {(page - 1) * pageSize + index + 1}
                            </TableCell>
                            <TableCell>{student.name}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                        Showing {currentRecords.length} of{" "}
                        {filteredRecords.length} items
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
                        {
                          length: Math.ceil(filteredRecords.length / pageSize),
                        },
                        (_, i) => i + 1
                      )
                        .filter(
                          (pg) =>
                            pg === 1 ||
                            pg ===
                              Math.ceil(filteredRecords.length / pageSize) ||
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
                        disabled={
                          page === Math.ceil(filteredRecords.length / pageSize)
                        }
                        className={styles.paginationButton}
                      >
                        <UilAngleRightB />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Typography sx={{ mt: 2 }}>None</Typography>
              )}
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, borderRadius: 1 }}
            onClick={() => navigate("/omr-list")}
          >
            Back to List
          </Button>
        </Paper>
      </Box>
    </Mainlayout>
  );
};

export default OmrView;
