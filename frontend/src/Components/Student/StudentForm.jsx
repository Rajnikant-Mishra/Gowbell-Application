import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import styles from "./Student.module.css";
import ButtonComp from "../School/CommonComp/ButtonComp";
import TextInput from "../School/CommonComp/TextInput";
import SelectDrop from "../School/CommonComp/SelectDrop";
import Mainlayout from "../Layouts/Mainlayout";
import Swal from "sweetalert2";
import "animate.css";
import { useNavigate } from "react-router-dom"; // import useNavigate
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/Swallfire.css";


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
        const response = await fetch(`${API_BASE_URL}/api/get/schools`); // API endpoint for schools
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
        const response = await fetch(`${API_BASE_URL}/api/class`); // API endpoint for class options
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
        const response = await fetch(`${API_BASE_URL}/api/subject`); // API endpoint for subjects
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

    // Define validation rules for each field dynamically
    const validationRules = [
      {
        field: "school_name",
        label: "School Name",
        validate: (value) => !!value || "School Name is required.",
      },
      {
        field: "student_name",
        label: "Student Name",
        validate: (value) => !!value || "Student Name is required.",
      },
      {
        field: "class_name",
        label: "Class Name",
        validate: (value) => !!value || "Class Name is required.",
      },
      {
        field: "mobile_number",
        label: "Mobile Number",
        validate: (value) =>
          /^\d{10}$/.test(value) || "Mobile Number must be exactly 10 digits.",
      },
      {
        field: "whatsapp_number",
        label: "WhatsApp Number",
        validate: (value) =>
          /^\d{10}$/.test(value) ||
          "WhatsApp Number must be exactly 10 digits.",
      },
      {
        field: "student_subject",
        label: "Student subject",
        validate: (value) => !!value || "Student subject is required.",
      },
    ];

    // Iterate through validation rules and check for errors
    for (const { field, validate } of validationRules) {
      const value = formData[field]; // Get field value
      const validationResult = validate(value); // Run validation

      if (validationResult !== true) {
        // Show validation error dynamically
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: validationResult ,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            popup: "small-swal",
          },
          background: "#fff",
        });
        return; // Stop further execution on first validation error
      }
    }

    // Proceed with API call after validation
    try {
      const response = await fetch(`${API_BASE_URL}/api/get/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success - Show success message
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `student created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/studentList");
        });

        // Reset form data after successful submission
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
      // Error - Show error message
      console.error("Error details:", error.response?.data || error.message);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: error.response?.data?.error || "An unexpected error occurred.",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        toast: true,
        customClass: {
          popup: "small-swal",
        },
        background: "#fff",
      });
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Student", link: "/studentList" },
              { name: "Create Student" },
            ]}
          />
        </div>
      </div>
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
              className={`${styles.buttonContainer} gap-2 mt-4`}
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
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/studentList")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
