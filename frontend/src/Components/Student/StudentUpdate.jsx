import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import styles from "./Student.module.css";
import ButtonComp from "../School/CommonComp/ButtonComp";
import TextInput from "../School/CommonComp/TextInput";
import SelectDrop from "../School/CommonComp/SelectDrop";
import Mainlayout from "../Layouts/Mainlayout";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";

export default function StudentUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    school_name: "",
    student_name: "",
    class_name: "",
    student_section: "",
    mobile_number: "",
    whatsapp_number: "",
    student_subject: "",
  });

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch school options
        const schoolResponse = await fetch(`${ API_BASE_URL }/api/get/schools`);
        const schoolData = await schoolResponse.json();
        setSchoolOptions(schoolData.map(school => ({
          value: school.school_name,
          label: school.school_name,
        })));

        // Fetch class options
        const classResponse = await fetch(`${ API_BASE_URL }/api/master`);
        const classData = await classResponse.json();
        setClassOptions(classData.map(item => ({
          value: item.name,
          label: item.name,
        })));

        // Fetch subject options
        const subjectResponse = await fetch(`${ API_BASE_URL }/api/subject`);
        const subjectData = await subjectResponse.json();
        setSubjectOptions(subjectData.map(subject => ({
          value: subject.name,
          label: subject.name,
        })));

        // Fetch student data
        const studentResponse = await fetch(`${ API_BASE_URL }/api/get/student/${id}`);
        if (!studentResponse.ok) throw new Error("Student data not found");
        const studentData = await studentResponse.json();
        setFormData({
          school_name: studentData.school_name || "",
          student_name: studentData.student_name || "",
          class_name: studentData.class_name || "",
          student_section: studentData.student_section || "",
          mobile_number: studentData.mobile_number || "",
          whatsapp_number: studentData.whatsapp_number || "",
          student_subject: studentData.student_subject || "",
        });
      } catch (error) {
        console.error("Error loading data", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load data. Please try again.",
          timer: 2000,
        });
      }
    };

    fetchData();
  }, [id]);

  // Section options
  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            text: validationResult, // Show the validation error message
            showConfirmButton: true,
            timer: 3000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          });
          return; // Stop further execution on first validation error
        }
      }
  
      // Proceed with API call after validation
      try {
        const response = await fetch(`${ API_BASE_URL }/api/get/student/${id}`, {
          method: "PUT",
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
                    text: `student  updated successfully!`,
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
            popup: "animate__animated animate__shakeX",
            title: "text-danger fw-bold",
            text: "text-dark",
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
              { name: "Update Student" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <Typography className={`${styles.formTitle} mb-4`}>
            Update Student Details
          </Typography>
          <form className={styles.formContent} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <SelectDrop
                  label="School Name"
                  name="school_name"
                  options={schoolOptions}
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
                  options={classOptions}
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
                  options={subjectOptions}
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
                text="Update"
                type="submit"
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1,}}
                onClick={() => navigate("/studentList")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
