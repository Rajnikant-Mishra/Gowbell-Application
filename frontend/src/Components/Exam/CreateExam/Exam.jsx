import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./Exam.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

// Reusable Dropdown Component
const Dropdown = ({ label, value, options, onChange, disabled }) => (
  <TextField
    select
    label={label}
    variant="outlined"
    fullWidth
    margin="normal"
    size="small"
    value={value}
    onChange={onChange}
    disabled={disabled}
  >
    {options.map((option, index) => (
      <MenuItem key={index} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
);

const ExaminationForm = () => {
  // State variables
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/get/schools`);
        setSchools(response.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setError("Failed to fetch schools. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  // Fetch classes when a school is selected
  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedSchool) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/get/students-by-classes?school_name=${selectedSchool}`
          );
          const classNames = response.data.map((item) => item.class_name);
          setClasses(classNames);
        } catch (error) {
          console.error("Error fetching classes:", error);
          setError("Failed to fetch classes. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchClasses();
  }, [selectedSchool]);

  // Fetch subjects when a class is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedSchool && selectedClass) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/get/students-by-subjects?school_name=${selectedSchool}&class_name=${selectedClass}`
          );
          const subjectNames = response.data.map(
            (item) => item.student_subject
          );
          setSubjects(subjectNames);
        } catch (error) {
          console.error("Error fetching subjects:", error);
          setError("Failed to fetch subjects. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchSubjects();
  }, [selectedSchool, selectedClass]);

  // Fetch students when a subject is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedSchool && selectedClass && selectedSubject) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/get/students-by-all?school_name=${selectedSchool}&class_name=${selectedClass}&student_subject=${selectedSubject}`
          );
          setStudents(response.data);
        } catch (error) {
          console.error("Error fetching students:", error);
          setError("Failed to fetch students. Please try again.");
          setStudents([]); // Clear students on error
          setSelectedSubject(""); // Reset subject selection
          setSelectedClass(""); // Reset class selection
          setSelectedSchool(""); // Reset school selection
        } finally {
          setIsLoading(false);
        }
      } else {
        setStudents([]); // Clear students if any condition is not met
      }
    };
    fetchStudents();
  }, [selectedSchool, selectedClass, selectedSubject]);

  // Handle school selection
  const handleSchoolChange = (event) => {
    setSelectedSchool(event.target.value);
    setSelectedClass("");
    setSelectedSubject("");
    setStudents([]);
  };

  // Handle class selection
  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setSelectedSubject("");
    setStudents([]);
  };

  // Handle subject selection
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  // Handle exam date change
  const handleExamDateChange = (event) => {
    setExamDate(event.target.value);
  };

  // Handle save button click
  const handleSave = async () => {
    if (!selectedSchool || !selectedClass || !selectedSubject || !examDate) {
      setError("Please select school, class, subject, and exam date.");
      return;
    }

    const examData = {
      exam_code: `EXAM-${Date.now()}`, // Generate a unique exam code
      school: selectedSchool,
      class_name: selectedClass,
      subject: selectedSubject,
      level: selectedLevel,
      exam_date: examDate,
      students: students.map((student) => ({
        student_name: student.student_name,
        roll_number: student.roll_no,
        class: student.class_name,
        full_mark: 100, // Assuming full marks are 100
        subject: student.student_subject,
      })),
    };

    try {
      setIsLoading(true);
      setError(null);
      await axios.post(`${API_BASE_URL}/api/e1/create-exam`, examData);
      // setSnackbarMessage("Exam and students created successfully!");
      // setSnackbarOpen(true);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `exam   created successfully!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });

      navigate("/examList");

      // Reset form after successful submission
      setSelectedSchool("");
      setSelectedClass("");
      setSelectedSubject("");
      setSelectedLevel("");
      setExamDate("");
      setStudents([]);
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
      setError("Failed to save exam data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Exam", link: "/examList" },
            { name: "Exam Schedule" },
          ]}
        />
      </div>
      <Container  component="main" maxWidth="">
        <Paper className={`${styles.main}`} elevation={3} style={{ padding: "20px", marginTop: "16px" }}>
          <Typography className={`${styles.formTitle} mb-4`}>
            Examination Form
          </Typography>

          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* School Dropdown */}
              <Grid item xs={12} sm={6} md={4}>
                <Dropdown
                  label="School"
                  value={selectedSchool}
                  options={schools.map((school) => school.school_name)}
                  onChange={handleSchoolChange}
                  disabled={false}
                />
              </Grid>

              {/* Class Dropdown */}
              <Grid item xs={12} sm={6} md={4}>
                <Dropdown
                  label="Class"
                  value={selectedClass}
                  options={classes}
                  onChange={handleClassChange}
                  disabled={!selectedSchool}
                />
              </Grid>

              {/* Subject Dropdown */}
              <Grid item xs={12} sm={6} md={4}>
                <Dropdown
                  label="Subject"
                  value={selectedSubject}
                  options={subjects}
                  onChange={handleSubjectChange}
                  disabled={!selectedClass}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {/* Level Dropdown */}
              <Grid item xs={12} sm={6} md={4}>
                <Dropdown
                  label="Level"
                  value={selectedLevel}
                  options={["Level 1", "Level 2", "Level 3", "Level 4"]}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  disabled={false}
                />
              </Grid>

              {/* Exam Date Input */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Exam Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={examDate}
                  onChange={handleExamDateChange}
                />
              </Grid>
            </Grid>
          </form>

          {/* Student Table */}
          {isLoading ? (
            <CircularProgress
              style={{ margin: "20px auto", display: "block" }}
            />
          ) : selectedSchool &&
            selectedClass &&
            selectedSubject &&
            students.length > 0 ? (
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Roll No</TableCell>
                    <TableCell>Full Mark</TableCell>
                    <TableCell>Subject</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.roll_no}>
                      <TableCell>{student.student_name}</TableCell>
                      <TableCell>{student.class_name}</TableCell>
                      <TableCell>{student.roll_no}</TableCell>
                      <TableCell>100</TableCell>
                      <TableCell>{student.student_subject}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              variant="body1"
              style={{ marginTop: "20px", textAlign: "center" }}
            >
              No students found for the selected criteria.
            </Typography>
          )}

          {/* Save Button */}
          <Box
            className={`${styles.buttonContainer} gap-2 mt-4`}
            sx={{ display: "flex", gap: 2 }}
          >
            <ButtonComp
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              onClick={handleSave}
              disabled={
                !selectedSchool ||
                !selectedClass ||
                !selectedSubject ||
                !examDate
              }
              text="Submit"
              sx={{ flexGrow: 1 }}
            />
            <ButtonComp
              text="Cancel"
              type="button"
              sx={{ flexGrow: 1 }}
              onClick={() => navigate("/examList")}
            />
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
