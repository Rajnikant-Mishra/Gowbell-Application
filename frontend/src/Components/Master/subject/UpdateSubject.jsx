import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  Container,
  Typography,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Subject name must be at least 3 characters")
    .max(255, "Subject name must be less than or equal to 255 characters")
    .required("Subject name is required")
    .matches(/^[A-Za-z ]+$/, "Subject name can only contain letters and spaces"),
  // .test("unique-name", "Subject name already exists.", async (value) => {
  //   if (!value) return true;
  //   try {
  //     const { data: existingSubjects } = await axios.get(
  //       `${API_BASE_URL}/api/subject`
  //     );
  //     return !existingSubjects.some(
  //       (subject) => subject.name.toLowerCase() === value.toLowerCase()
  //     );
  //   } catch (error) {
  //     console.error("Error checking duplicate subject name:", error);
  //     return false;
  //   }
  // }),
  status: Yup.string()
    .oneOf(
      ["active", "inactive"],
      "Status must be either 'active' or 'inactive'"
    )
    .required("Status is required"),
});

const Updatesubject = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract the subject ID from the URL
  const [subjectData, setSubjectData] = useState(null);

  // Fetch subject details on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/subject/${id}`)
      .then((response) => {
        setSubjectData(response.data); // Set subject data to state
      })
      .catch((error) => {
        console.error("Error fetching subject details:", error);
      });
  }, [id]);

  const handleSubmit = (values) => {
    // Sending the PUT request to the server to update the subject
    axios
      .put(`${API_BASE_URL}/api/subject/${id}`, {
        name: values.name,
        status: values.status,
      })
      .then((response) => {
        // Success: Show success alert and redirect
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Subject ${values.name} updated successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/subject"); // Redirect after success
        });
      })
      .catch((error) => {
        // Error: Show error alert Subject name already exists.
        console.error("Error updating subject:", error);
        Swal.fire({
          position: "top-end",
          icon: "Errors",
          title: "Error",
          text: "Subject name already exists",
          icon: "error",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
      });
  };

  // Show a loading state while fetching subject data
  if (!subjectData) {
    return <div>Loading...</div>;
  }

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Subject", link: "/subject" },
              { name: "Update Subject" },
            ]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 13,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Update Subject
          </Typography>
          <Formik
            initialValues={{
              name: subjectData.name,
              status: subjectData.status,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              touched,
              errors,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Subject Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                />
                <FormControl fullWidth margin="normal" required>
                  <TextField
                    select
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Status"
                    variant="outlined"
                    size="small"
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                    InputProps={{
                      style: { fontSize: "14px" },
                    }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </FormControl>
                <Box className={` gap-2 mt-4`} sx={{ display: "flex", gap: 2 }}>
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
                    onClick={() => navigate("/subject")}
                  />
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default Updatesubject;
