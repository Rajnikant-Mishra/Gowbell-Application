import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import {
  TextField,
  Box,
  Container,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../Common-Css/Swallfire.css";

// Validation Schema using Yup
const validationSchema = Yup.object({
  school: Yup.string().required("School is required"),
  class_name: Yup.string().required("Class is required"),
  level: Yup.string().required("Level is required"),
  date_from: Yup.date()
    .required("Start date is required")
    .max(Yup.ref('date_to'), "Start date cannot be later than end date"),
  date_to: Yup.date().required("End date is required"),
});

const CreateUserForm = () => {
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch schools data
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/get/schools`);
        const data = await response.json();
        setSchools(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  // Fetch classes data based on selected school
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/class`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (values) => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("school", values.school);
    formDataToSubmit.append("class_name", values.class_name);
    formDataToSubmit.append("level", values.level);
    formDataToSubmit.append("date_from", values.date_from);
    formDataToSubmit.append("date_to", values.date_to);

    try {
      const response = await fetch(`${API_BASE_URL}/api/e1/exams`, {
        method: "POST",
        body: formDataToSubmit,
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Exam schedule created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/examList");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error",
          text: errorData.message || "Something went wrong!",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Unable to connect to the server!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[{ name: "Exam", link: "/examList" }, { name: "Exam Schedule" }]}
        />
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 7,
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Exam Schedule
          </Typography>
          <Formik
            initialValues={{
              school: "",
              class_name: "",
              level: "",
              date_from: "",
              date_to: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* School */}
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>School</InputLabel>
                      <Field
                        as={Select}
                        label="School"
                        name="school"
                        value={values.school}
                        onChange={handleChange}
                        disabled={loading}
                        error={touched.school && Boolean(errors.school)}
                      >
                        {schools.map((school) => (
                          <MenuItem key={school.id} value={school.id}>
                            {school.school_name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="school" component="div" style={{ color: "red" }} />
                    </FormControl>
                  </Grid>
                  {/* Class */}
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>Class</InputLabel>
                      <Field
                        as={Select}
                        label="Class"
                        name="class_name"
                        value={values.class_name}
                        onChange={handleChange}
                        error={touched.class_name && Boolean(errors.class_name)}
                      >
                        {classes.map((classItem) => (
                          <MenuItem key={classItem.id} value={classItem.id}>
                            {classItem.name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="class_name" component="div" style={{ color: "red" }} />
                    </FormControl>
                  </Grid>
                  {/* Level */}
                  <Grid item xs={6}>
                    <TextField
                      label="Level"
                      name="level"
                      value={values.level}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      required
                      error={touched.level && Boolean(errors.level)}
                    />
                    <ErrorMessage name="level" component="div" style={{ color: "red" }} />
                  </Grid>
                  {/* Start Date */}
                  <Grid item xs={6}>
                    <TextField
                      label="Start Date"
                      name="date_from"
                      value={values.date_from}
                      onChange={handleChange}
                      fullWidth
                      type="date"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={touched.date_from && Boolean(errors.date_from)}
                    />
                    <ErrorMessage name="date_from" component="div" style={{ color: "red" }} />
                  </Grid>
                  {/* End Date */}
                  <Grid item xs={6}>
                    <TextField
                      label="End Date"
                      name="date_to"
                      value={values.date_to}
                      onChange={handleChange}
                      fullWidth
                      type="date"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={touched.date_to && Boolean(errors.date_to)}
                    />
                    <ErrorMessage name="date_to" component="div" style={{ color: "red" }} />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <ButtonComp
                    text="Submit"
                    type="submit"
                    sx={{ flexGrow: 1 }}
                    disabled={isSubmitting}
                  />
                  <ButtonComp
                    text="Cancel"
                    type="button"
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/user-list")}
                  />
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateUserForm;
