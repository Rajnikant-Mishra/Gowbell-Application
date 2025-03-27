// export default UpdateCountry;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be less than or equal to 255 characters")
    .required("Name is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Name can only contain letters and numbers"),
  // .test("unique-name", "Affiliated name already exists.", async (value) => {
  //   if (!value) return true; // Skip validation if field is empty
  //   try {
  //     const { data: existingAffiliates } = await axios.get(
  //       `${API_BASE_URL}/api/affiliated`
  //     );
  //     return !existingAffiliates.some(
  //       (affiliate) => affiliate.name.toLowerCase() === value.toLowerCase()
  //     );
  //   } catch (error) {
  //     console.error("Error checking duplicate affiliated name:", error);
  //     return false; // Assume duplicate if there's an error
  //   }
  // }),
  status: Yup.string()
    .oneOf(
      ["active", "inactive"],
      "Status must be either 'active' or 'inactive'"
    )
    .required("Status is required"),
});

const UpdateCountry = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    name: "",
    status: "active",
  });

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/affiliated/${id}`)
      .then((response) => {
        setInitialValues({
          name: response.data.name,
          status: response.data.status,
        });
      })
      .catch((error) => {
        console.error("Error fetching affiliated:", error);
      });
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(`${API_BASE_URL}/api/affiliated/${id}`, values);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Affiliated "${values.name}" updated successfully!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      }).then(() => {
        navigate("/affiliated"); // Redirect after SweetAlert
      });
    } catch (error) {
      console.error("Error updating affiliated:", error);
      Swal.fire({
        position: "top-end",
        title: "Error!",
        text: "Affiliated name already exists",
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
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Affiliated", link: "/affiliated" },
            { name: "Update Affiliated" },
          ]}
        />
      </div>
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3, marginTop: 7 }}>
          <Typography variant="h4" gutterBottom align="center">
            Update Affiliated
          </Typography>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, handleChange, setFieldValue, errors, touched }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Affiliated Name"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={values.name}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "name",
                              value: e.target.value.toUpperCase(),
                            },
                          })
                        }
                        required
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
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                          label="Status"
                          size="small"
                          error={touched.status && Boolean(errors.status)}
                          InputProps={{
                            style: { fontSize: "14px" },
                          }}
                          InputLabelProps={{
                            style: { fontSize: "14px" },
                          }}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <ButtonComp
                          text="Submit"
                          type="submit"
                          sx={{ flexGrow: 1 }}
                        />
                        <ButtonComp
                          text="Cancel"
                          type="button"
                          sx={{ flexGrow: 1 }}
                          onClick={() => navigate("/affiliated")}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Container>
    </Mainlayout>
  );
};

export default UpdateCountry;
