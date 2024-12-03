import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import OMRSheet from "./OMRSheet";
import { MdPadding } from "react-icons/md";

const OmrcoForm = ({ refreshData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school_name: "",
    class_from: "",
    class_to: "",
    omr: "",
    date: "",
    exam_level:"",
  });
  const [schools, setSchools] = useState([]);
  const [omrOptions, setOmrOptions] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get/student");
        const data = await response.json();
        setSchools(data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };
    const fetchOmrOptions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get/omr");
        const data = await response.json();
        setOmrOptions(data);
      } catch (error) {
        console.error("Error fetching OMR options:", error);
      }
    };
    fetchSchools();
    fetchOmrOptions();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (
      name === "school_name" ||
      name === "class_from" ||
      name === "class_to"
      
    ) {
      // Only fetch students when all three fields are filled
      if (formData.school_name && formData.class_from && formData.class_to) {
        await fetchStudentDetails();
      }
    }
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!formData.school_name || !formData.class_from || !formData.class_to)
        return;

      try {
        const response = await fetch(
          "http://localhost:5000/api/get/students-by-class",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              school_name: formData.school_name,
              class_from: formData.class_from,
              class_to: formData.class_to,
            }),
          }
        );
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [formData.school_name, formData.class_from, formData.class_to]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if students data is fetched and available
    if (students.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No students found for the selected criteria.",
        timer: 2000,
      });
      return;
    }

    try {
      // Show a loading Swal while generating the PDF
      const loadingSwal = Swal.fire({
        title: "Generating OMR PDFs...",
        text: "Please wait while we generate the PDFs.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const doc = new jsPDF();

      //G       enerate pdf logic codes
      for (const [index, student] of students.entries()) {
        // Create a container element for the OMRSheet
        const container = document.createElement("div");
        container.style.width = "794px"; // Match A4 width at 96 DPI
        container.style.height = "1123px"; // Match A4 height at 96 DPI
        document.body.appendChild(container); // Attach to the DOM to render

        const root = createRoot(container);
        root.render(
          <OMRSheet
            schoolName={formData.school_name}
            classFrom={formData.class_from}
            classTo={formData.class_to}
            student={student}
          />
        );

        // Wait for rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Get the PDF page dimensions
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        // Capture the content as a canvas
        const canvas = await html2canvas(container, {
          width: 794, // A4 width in pixels
          height: 1123, // A4 height in pixels
          scale: 1, // Avoid additional scaling from html2canvas
        });

        // Convert canvas to an image and scale to fit PDF dimensions
        const imgData = canvas.toDataURL("image/png");

        // Use exact PDF page dimensions for the image
        doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Clean up
        root.unmount();
        container.remove();

        if (index < students.length - 1) {
          doc.addPage(); // Add a new page for the next student
        }
      }

      // Save the generated PDF
      doc.save(
        `OMR_${formData.school_name}_${formData.class_from}_to_${formData.class_to}.pdf`
      );

      // Close the loading Swal
      Swal.close();

      // Continue with the backend submission
      const response = await fetch("http://localhost:5000/api/co/omr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          students,
          student_count: students.length,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "OMR entry created, and PDF generated successfully!",
          timer: 2000,
        });
        if (refreshData) refreshData();
        navigate("/omr-list");

        // Reset form and students list
        setFormData({
          school_name: "",
          class_from: "",
          class_to: "",
          exam_level:"",
          omr: "",
          date: "",
        });
        setStudents([]);
      } else {
        throw new Error("Failed to create OMR entry");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to create OMR entry. Please try again.",
        timer: 2000,
      });
      console.error("Error creating OMR entry:", error);
    }
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm" style={{ marginTop: "20px" }}>
        <Card elevation={3}>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              align="center"
              gutterBottom
            >
              Create OMR Entry
            </Typography>
            <form onSubmit={handleSubmit} >
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  select
                  fullWidth
                  label="School Name"
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleChange}
                  variant="outlined"
                  required
                >
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.school_name}>
                      {school.school_name}
                    </MenuItem>
                  ))}
                </TextField>

                <Grid container spacing={2}>
                  {/* Class From */}
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Class From"
                      name="class_from"
                      value={formData.class_from}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    >
                      {schools
                        .filter(
                          (school) =>
                            school.school_name === formData.school_name
                        )
                        .map((school) => (
                          <MenuItem key={school.id} value={school.class_name}>
                            {school.class_name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  {/* Class To */}
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Class To"
                      name="class_to"
                      value={formData.class_to}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    >
                      {schools
                        .filter(
                          (school) =>
                            school.school_name === formData.school_name
                        )
                        .map((school) => (
                          <MenuItem key={school.id} value={school.class_name}>
                            {school.class_name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {/* Exam Level Select */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth >
                      <InputLabel>Exam Level</InputLabel>
                      <Select
                        value={formData.exam_level}
                        onChange={handleChange}
                        label="Exam Level"
                        required
                      >
                        <MenuItem value="level1">Level 1</MenuItem>
                        <MenuItem value="level2">Level 2</MenuItem>
                        <MenuItem value="level3">Level 3</MenuItem>
                        <MenuItem value="level4">Level 4</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* OMR Details Select */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="OMR Details"
                      name="omr"
                      value={formData.omr}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    >
                      {omrOptions.map((omr) => (
                        <MenuItem key={omr.id} value={omr.title}>
                          {omr.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {students.length > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    Total Students: {students.length}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "green", color: "white" }}
                  fullWidth
                >
                  Generate
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Mainlayout>
  );
};

export default OmrcoForm;
