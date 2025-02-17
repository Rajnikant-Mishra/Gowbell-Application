

import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, TextField } from "@mui/material";
import styles from "./Student.module.css";
import ButtonComp from "../School/CommonComp/ButtonComp";
import TextInput from "../School/CommonComp/TextInput";
// import SelectDrop from "../School/CommonComp/SelectDrop";
import Mainlayout from "../Layouts/Mainlayout";
import Swal from "sweetalert2";
import "animate.css";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/Swallfire.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectDrop from "../School/createschool/SelectDrop";

export default function StudentForm() {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/get/schools`);
        if (response.ok) {
          const data = await response.json();
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

    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/class`);
        if (response.ok) {
          const data = await response.json();
          const options = data.map((item) => ({
            value: item.name,
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

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/subject`);
        if (response.ok) {
          const data = await response.json();
          const options = data.map((subject) => ({
            value: subject.name,
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

  const validationSchema = Yup.object({
    school_name: Yup.string().required("School Name is required"),
    student_name: Yup.string().required("Student Name is required"),
    class_name: Yup.string().required("Class Name is required"),
    student_section: Yup.string().required("Section is required"),
    mobile_number: Yup.string()
      .required("Mobile Number is required")
      .matches(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
    whatsapp_number: Yup.string()
      .required("WhatsApp Number is required")
      .matches(/^\d{10}$/, "WhatsApp Number must be exactly 10 digits"),
    student_subject: Yup.string().required("Subject is required"),
    roll_no: Yup.string().required("Roll Number is required"),
  });

  const formik = useFormik({
    initialValues: {
      school_name: "",
      student_name: "",
      class_name: "",
      student_section: "",
      mobile_number: "",
      whatsapp_number: "",
      student_subject: "",
      roll_no: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/get/student`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Success!",
            text: `Student created successfully!`,
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

          formik.resetForm();
        } else {
          throw new Error("Failed to submit form");
        }
      } catch (error) {
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
    },
  });

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
          <form className={styles.formContent} onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <SelectDrop
                  label="School Name"
                  name="school_name"
                  options={schoolOptions}
                  value={formik.values.school_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.school_name &&
                    Boolean(formik.errors.school_name)
                  }
                  helperText={
                    formik.touched.school_name && formik.errors.school_name
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  className={styles.textInput}
                  label="Student Name"
                  name="student_name"
                  value={formik.values.student_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.student_name &&
                    Boolean(formik.errors.student_name)
                  }
                  helperText={
                    formik.touched.student_name && formik.errors.student_name
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class"
                  name="class_name"
                  options={classOptions}
                  value={formik.values.class_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.class_name &&
                    Boolean(formik.errors.class_name)
                  }
                  helperText={
                    formik.touched.class_name && formik.errors.class_name
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Section"
                  name="student_section"
                  options={sectionOptions}
                  value={formik.values.student_section}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.student_section &&
                    Boolean(formik.errors.student_section)
                  }
                  helperText={
                    formik.touched.student_section &&
                    formik.errors.student_section
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Mobile Number"
                  name="mobile_number"
                  value={formik.values.mobile_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.mobile_number &&
                    Boolean(formik.errors.mobile_number)
                  }
                  helperText={
                    formik.touched.mobile_number && formik.errors.mobile_number
                  }
                  type="tel"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Whatsapp Number"
                  name="whatsapp_number"
                  value={formik.values.whatsapp_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.whatsapp_number &&
                    Boolean(formik.errors.whatsapp_number)
                  }
                  helperText={
                    formik.touched.whatsapp_number &&
                    formik.errors.whatsapp_number
                  }
                  type="tel"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Subject"
                  name="student_subject"
                  options={subjectOptions}
                  value={formik.values.student_subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.student_subject &&
                    Boolean(formik.errors.student_subject)
                  }
                  helperText={
                    formik.touched.student_subject &&
                    formik.errors.student_subject
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Roll Number"
                  name="roll_no"
                  value={formik.values.roll_no}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.roll_no && Boolean(formik.errors.roll_no)
                  }
                  helperText={formik.touched.roll_no && formik.errors.roll_no}
                  type="tel"
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
