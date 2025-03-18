import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Autocomplete,
  Checkbox,
  MenuItem,
  Select,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";
import styles from "./formco.module.css";
import Swal from "sweetalert2";
import TextInput from "../../School/CommonComp/TextInput";
import Mainlayout from "../../Layouts/Mainlayout";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import SelectDrop from "../../School/createschool/SelectDrop";

export default function UpdateConsignmentForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the consignment ID from the URL

  const validationSchema = Yup.object({
    date: Yup.date().required("Date is required"),
    school_name: Yup.string()
      .required("School Name is required")
      .matches(
        /^[a-zA-Z0-9\s]*$/,
        "School Name cannot contain special characters"
      ),
    remarks: Yup.string().required("Remarks are required"),
    via: Yup.string().required("Via is required"),
    goodies: Yup.array()
      .min(1, "At least one goodie is required")
      .required("Goodies are required"),
  });

  const formik = useFormik({
    initialValues: {
      consignment_id: "",
      date: "",
      created_by: "",
      school_name: "",
      via: "",
      vehicle_number: "",
      driver_name: "",
      driver_contact_number: "",
      tracking_number: "",
      courier_company: "",
      delivery_date: "",
      postal_tracking_number: "",
      postal_name: "",
      postal_delivery_date: "",
      goodies: [],
      remarks: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage

        const response = await axios.put(
          `${API_BASE_URL}/api/c1/consignments/${id}`, // Use PUT or PATCH for update
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token
            },
          }
        );

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Consignment updated successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        }).then(() => {
          navigate("/consignment-list");
        });
      } catch (error) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "An unexpected error occurred.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          customClass: { popup: "small-swal" },
          background: "#fff",
        });
      }
    },
  });

  const classOptions = [
    { value: "Diary", label: "Diary" },
    { value: "Pen", label: "Pen" },
    { value: "Tiffin Box", label: "Tiffin Box" },
    { value: "Flask", label: "Flask" },
    { value: "Water Bottle", label: "Water Bottle" },
    { value: "Pencil Box", label: "Pencil Box" },
  ];

  const via = [
    { value: "", label: "--Options--" },
    { value: "Vehicle", label: "Vehicle" },
    { value: "Postal", label: "Postal" },
    { value: "Courier", label: "Courier" },
  ];

  // Fetch consignment data based on ID
  useEffect(() => {
    const fetchConsignmentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/c1/consignments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const consignmentData = response.data;
  
        // Format the date field
        const formattedDate = consignmentData.date
          ? new Date(consignmentData.date).toISOString().split("T")[0]
          : "";
  
        formik.setValues({
          ...consignmentData,
          date: formattedDate, // Ensure date is formatted
          goodies: consignmentData.goodies || [], // Ensure goodies is an array
        });
      } catch (error) {
        console.error("Error fetching consignment data:", error);
      }
    };
  
    fetchConsignmentData();
  }, [id]);
  

  // Fetch schools for the dropdown
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/get/schools`)
      .then((response) => {
        setSchools(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
      });
  }, []);

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Consignment", link: "/consignment-list" },
              { name: "Update Consignment" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <div>
            <Typography className={`${styles.formTitle} mb-4`}>
              Update Consignment
            </Typography>
          </div>
          <form onSubmit={formik.handleSubmit} className={styles.formContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <TextInput
                  label="Consignment Id"
                  name="consignment_id"
                  value={formik.values.consignment_id}
                  onChange={formik.handleChange}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  name="date"
                  type="date"
                  value={formik.values.date}
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  fullWidth
                  size="small"
                  error={
                    formik.touched.school_name &&
                    Boolean(formik.errors.school_name)
                  }
                >
                  <InputLabel
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    }}
                  >
                    School Name
                  </InputLabel>
                  <Select
                    label="School Name"
                    name="school_name"
                    value={formik.values.school_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    }}
                    className={styles.inputField}
                  >
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.school_name}>
                        {school.school_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.school_name && formik.errors.school_name && (
                    <FormHelperText>{formik.errors.school_name}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SelectDrop
                  label="Via"
                  name="via"
                  value={formik.values.via}
                  options={via}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.via && Boolean(formik.errors.via)}
                  helperText={formik.touched.via && formik.errors.via}
                  fullWidth
                />
              </Grid>
              {formik.values.via === "Vehicle" ? (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Vehicle Number"
                      name="vehicle_number"
                      value={formik.values.vehicle_number}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Driver Name"
                      name="driver_name"
                      value={formik.values.driver_name}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Driver Contact Number"
                      name="driver_contact_number"
                      value={formik.values.driver_contact_number}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : formik.values.via === "Courier" ? (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Tracking Number"
                      name="tracking_number"
                      value={formik.values.tracking_number}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Courier Company"
                      name="courier_company"
                      value={formik.values.courier_company}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      type="date"
                      name="delivery_date"
                      value={formik.values.delivery_date}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : formik.values.via === "Postal" ? (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Postal Tracking Number"
                      name="postal_tracking_number"
                      value={formik.values.postal_tracking_number}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Postal Name"
                      name="postal_name"
                      value={formik.values.postal_name}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      type="date"
                      name="postal_delivery_date"
                      value={formik.values.postal_delivery_date}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : null}
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  multiple
                  id="goodies"
                  options={classOptions}
                  value={formik.values.goodies.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  size="small"
                  onChange={(e, newValue) => {
                    formik.setFieldValue(
                      "goodies",
                      newValue.map((item) => item.value)
                    );
                  }}
                  onBlur={formik.handleBlur}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        checked={formik.values.goodies.includes(option.value)}
                        color="primary"
                      />
                      {option.label}
                    </li>
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <span {...getTagProps({ index })}>
                        {option.label}
                        <RxCross2
                          size={12}
                          onClick={() => {
                            const newGoodies = formik.values.goodies.filter(
                              (item) => item !== option.value
                            );
                            formik.setFieldValue("goodies", newGoodies);
                          }}
                        />
                      </span>
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Goodies"
                      placeholder="goodies"
                      variant="outlined"
                      error={
                        formik.touched.goodies && Boolean(formik.errors.goodies)
                      }
                      helperText={
                        formik.touched.goodies && formik.errors.goodies
                      }
                      InputProps={{
                        ...params.InputProps,
                        style: {
                          fontSize: "0.8rem",
                          padding: "6px 12px",
                          fontFamily: "Poppins",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.85rem",
                          lineHeight: "1.5",
                          fontFamily: "Poppins",
                          fontWeight: "bolder",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.remarks && Boolean(formik.errors.remarks)
                  }
                  helperText={formik.touched.remarks && formik.errors.remarks}
                  fullWidth
                  multiline
                  size="small"
                  rows={1}
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
                />
              </Grid>
            </Grid>
            <Box
              className={`${styles.buttonContainer} gap-2 mt-4`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp
                text="Update"
                type="submit"
                disabled={false}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/consignment-list")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}