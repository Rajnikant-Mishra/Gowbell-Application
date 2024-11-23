import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import styles from "./Student.module.css";
import ButtonComp from "../School/CommonComp/ButtonComp";
import TextInput from "../School/CommonComp/TextInput";
import SelectDrop from "../School/CommonComp/SelectDrop";
import Mainlayout from "../Layouts/Mainlayout";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // import useNavigate

export default function StudentForm() {
  const [formData, setFormData] = useState({
    school_name: "",
    student_name: "",
    class_name: "",
    student_section: "",
    mobile_number: "",
    whatsapp_number: "",
    student_subject: "",
  });

  const [schoolOptions, setSchoolOptions] = useState([]); // state for school options
  const [classOptions, setClassOptions] = useState([]); // state for class options
  const [subjectOptions, setSubjectOptions] = useState([]); // state for subject options
  const navigate = useNavigate(); // initialize useNavigate

  useEffect(() => {
    // Fetch school data when the component mounts
    const fetchSchools = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get/schools"); // API endpoint for schools
        if (response.ok) {
          const data = await response.json();
          // Set school options dynamically
          const options = data.map((school) => ({
            value: school.school_name,
            label: school.school_name,
          }));
          setSchoolOptions(options);
        } else {
          throw new Error("Failed to fetch school data");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load school data.",
          timer: 2000,
        });
      }
    };

    // Fetch class data
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/master"); // API endpoint for class options
        if (response.ok) {
          const data = await response.json();
          const options = data.map((item) => ({
            value: item.name, // Assuming the response has a "class_name" field
            label: item.name,
          }));
          setClassOptions(options);
        } else {
          throw new Error("Failed to fetch class data");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load class data.",
          timer: 2000,
        });
      }
    };

    // Fetch subject data
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/subject"); // API endpoint for subjects
        if (response.ok) {
          const data = await response.json();
          const options = data.map((subject) => ({
            value: subject.name, // Assuming the response has a "subject_name" field
            label: subject.name,
          }));
          setSubjectOptions(options);
        } else {
          throw new Error("Failed to fetch subject data");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load subject data.",
          timer: 2000,
        });
      }
    };

    fetchSchools();
    fetchClasses();
    fetchSubjects();
  }, []);

  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form Validation
    if (
      !formData.school_name ||
      !formData.student_name ||
      !formData.class_name ||
      !formData.student_section ||
      !formData.mobile_number ||
      !formData.whatsapp_number ||
      !formData.student_subject
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required!",
        timer: 2000,
      });
      return;
    }

    // Making API call to submit form data
    try {
      const response = await fetch("http://localhost:5000/api/get/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Student registered successfully!",
          timer: 2000,
        });

        // Navigate to the student list page after successful registration
        navigate("/studentList");

        setFormData({
          school_name: "",
          student_name: "",
          class_name: "",
          student_section: "",
          mobile_number: "",
          whatsapp_number: "",
          student_subject: "",
        });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while submitting the form.",
        timer: 2000,
      });
    }
  };

  return (
    <Mainlayout>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <div>
            <Typography className={`${styles.formTitle} mb-4`}>
              Student Registration Form
            </Typography>
          </div>
          <form className={styles.formContent} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <SelectDrop
                  label="School Name"
                  name="school_name"
                  options={schoolOptions} // Use dynamic school options here
                  value={formData.school_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextInput
                  className={styles.textInput}
                  label="Student Name"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class"
                  name="class_name"
                  options={classOptions} // Use dynamic class options here
                  value={formData.class_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Section"
                  name="student_section"
                  options={sectionOptions}
                  value={formData.student_section}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextInput
                  label="Mobile Number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  type="tel"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextInput
                  label="Whatsapp Number"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  type="tel"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Subject"
                  name="student_subject"
                  options={subjectOptions} // Use dynamic subject options here
                  value={formData.student_subject}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box
              className={`${styles.buttonContainer} gap-2 mt-3`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp
                text="Submit"
                type="submit"
                disabled={false}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                className={styles.cancelbtn}
                type="button"
                disabled={false}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
