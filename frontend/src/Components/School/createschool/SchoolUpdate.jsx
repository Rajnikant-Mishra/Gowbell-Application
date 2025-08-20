
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./School.module.css";
import Swal from "sweetalert2";
import Mainlayout from "../../Layouts/Mainlayout";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import SelectDrop from "./SelectDrop";

// Validation Schema using Yup
const validationSchema = Yup.object({
  board: Yup.string().required("Board is required"),
  school_name: Yup.string().required("School name is required"),
  // school_email: Yup.string()
  //   .email("Invalid email format"),
  //   .required("School email is required"),
  // school_contact_number: Yup.string()
  //   .required("Contact number is required")
  //   .matches(/^\d{10}$/, "Invalid contact number"),
  school_landline_number: Yup.string().nullable(),
  school_address: Yup.string()
    .required("School address is required")
    .min(5, "Address must be at least 5 characters"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  district: Yup.string().required("District is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^[0-9]{6}$/, "Invalid pincode"),
  // principal_name: Yup.string()
  //   .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
  //   .required("Principal Name is required"),
  // principal_contact_number: Yup.string()
  //   .required("Principal Contact Number is required")
  //   .matches(/^\d{10}$/, "Invalid contact number"),
  // principal_whatsapp: Yup.string()
  //   .required("Principal WhatsApp Number is required")
  //   .matches(/^\d{10}$/, "Invalid WhatsApp number"),
  vice_principal_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .nullable(),
  vice_principal_contact_number: Yup.string()
    .matches(/^\d{10}$/, "Invalid contact number")
    .nullable(),
  vice_principal_whatsapp: Yup.string()
    .matches(/^\d{10}$/, "Invalid WhatsApp number")
    .nullable(),
  manager_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .nullable(),
  manager_contact_number: Yup.string()
    .matches(/^\d{10}$/, "Invalid contact number")
    .nullable(),
  manager_whatsapp_number: Yup.string()
    .matches(/^\d{10}$/, "Invalid WhatsApp number")
    .nullable(),
  first_incharge_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .nullable(),
  first_incharge_number: Yup.string()
    .matches(/^\d{10}$/, "Invalid contact number")
    .nullable(),
  first_incharge_whatsapp: Yup.string()
    .matches(/^\d{10}$/, "Invalid WhatsApp number")
    .nullable(),
  second_incharge_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .nullable(),
  second_incharge_number: Yup.string()
    .matches(/^\d{10}$/, "Invalid contact number")
    .nullable(),
  second_incharge_whatsapp: Yup.string()
    .matches(/^\d{10}$/, "Invalid WhatsApp number")
    .nullable(),
  // junior_student_strength: Yup.number()
  //   .required("Junior Student Strength is required")
  //   .positive("Must be a positive number")
  //   .integer("Must be a whole number"),
  // senior_student_strength: Yup.number()
  //   .required("Senior Student Strength is required")
  //   .positive("Must be a positive number")
  //   .integer("Must be a whole number"),
  // classes: Yup.array().min(1, "At least one class is required"),
  // status: Yup.string().required("Status is required"),
});

export default function SchoolUpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the school ID from URL params

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [classes, setClasses] = useState([]); // New state for dynamic classes
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  // Formik initialization
  const formik = useFormik({
    enableReinitialize: true, // Important for updating form when initialValues change
    initialValues: initialValues || {
      board: "",
      school_name: "",
      school_email: "",
      school_contact_number: "",
      school_landline_number: "",
      school_address: "",
      country: "",
      state: "",
      district: "",
      city: "",
      pincode: "",
      principal_name: "",
      principal_contact_number: "",
      principal_whatsapp: "",
      vice_principal_name: "",
      vice_principal_contact_number: "",
      vice_principal_whatsapp: "",
      manager_name: "",
      manager_contact_number: "",
      manager_whatsapp_number: "",
      first_incharge_name: "",
      first_incharge_number: "",
      first_incharge_whatsapp: "",
      second_incharge_name: "",
      second_incharge_number: "",
      second_incharge_whatsapp: "",
      junior_student_strength: "",
      senior_student_strength: "",
      classes: [],
      status: "Active",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Authentication token is missing. Please log in again.",
          });
          return;
        }

        const loadingSwal = Swal.fire({
          title: "Updating...",
          text: "Please wait while we update the school.",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Convert classes array to JSON string if needed
        const payload = {
          ...values,
          classes: JSON.stringify(values.classes),
        };

        await axios.put(`${API_BASE_URL}/api/get/schools/${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.close();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: "School updated successfully!",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
        }).then(() => {
          navigate("/schoolList");
        });
      } catch (error) {
        Swal.close();
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "An unexpected error occurred.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
        });
      }
    },
  });

  // Fetch school data, location data, and classes
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Please log in again.",
          });
          navigate("/login");
          return;
        }

        // Fetch all data concurrently
        const [schoolRes, countriesRes, statesRes, districtsRes, citiesRes, classesRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/get/schools/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/countries/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/states/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/districts/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/cities/all/c1`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/class`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const schoolData = schoolRes.data;

        // Set location data
        setCountries(countriesRes.data);
        setStates(statesRes.data);
        setDistricts(districtsRes.data);
        setCities(citiesRes.data);

        // Set classes
        const formattedClasses = classesRes.data.map((cls) => ({
          value: cls.name,
          label: cls.name,
        }));
        setClasses(formattedClasses);

        // Transform classes array
        const classesArray = Array.isArray(schoolData.classes)
          ? schoolData.classes
          : schoolData.classes
          ? JSON.parse(schoolData.classes)
          : [];

        // Set initial values
        setInitialValues({
          ...schoolData,
          classes: classesArray,
          country: String(schoolData.country || ""),
          state: String(schoolData.state || ""),
          district: String(schoolData.district || ""),
          city: String(schoolData.city || ""),
          junior_student_strength: String(schoolData.junior_student_strength || ""),
          senior_student_strength: String(schoolData.senior_student_strength || ""),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch data. Please try again.",
          toast: true,
          position: "top-end",
          timer: 2000,
        });
        navigate("/schoolList");
      }
    };

    fetchSchoolData();
  }, [id, navigate]);

  // Filter states, districts, and cities
  useEffect(() => {
    if (formik.values.country) {
      const filtered = states.filter(
        (state) => String(state.country_id) === String(formik.values.country)
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
  }, [formik.values.country, states]);

  useEffect(() => {
    if (formik.values.state) {
      const filtered = districts.filter(
        (district) => String(district.state_id) === String(formik.values.state)
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  }, [formik.values.state, districts]);

  useEffect(() => {
    if (formik.values.district) {
      const filtered = cities.filter(
        (city) => String(city.district_id) === String(formik.values.district)
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [formik.values.district, cities]);

  if (loading || !initialValues) {
    return (
      <Mainlayout>
        <Box
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Typography variant="h6">Loading school data...</Typography>
        </Box>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "School", link: "/schoolList" },
              { name: "Update School" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={styles.formBox}>
          <div>
            <Typography className={`${styles.formTitle} mb-4`}>
              Update School
            </Typography>
          </div>
          <form onSubmit={formik.handleSubmit} className={styles.formContent}>
            <Grid container spacing={2}>
              

              {/* Country Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Country"
                  name="country"
                  options={countries.map((country) => ({
                    value: String(country.id),
                    label: country.name,
                  }))}
                  value={formik.values.country}
                  onChange={formik.handleChange}
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
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                  fullWidth
                />
              </Grid>

              {/* State Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="State"
                  name="state"
                  options={filteredStates.map((state) => ({
                    value: String(state.id),
                    label: state.name,
                  }))}
                  value={formik.values.state}
                  onChange={formik.handleChange}
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
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  fullWidth
                />
              </Grid>

              {/* District Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="District"
                  name="district"
                  options={filteredDistricts.map((district) => ({
                    value: String(district.id),
                    label: district.name,
                  }))}
                  value={formik.values.district}
                  onChange={formik.handleChange}
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
                    formik.touched.district && Boolean(formik.errors.district)
                  }
                  helperText={formik.touched.district && formik.errors.district}
                  fullWidth
                  disabled={!formik.values.state}
                />
              </Grid>

              {/* City Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="City"
                  name="city"
                  options={filteredCities.map((city) => ({
                    value: String(city.id),
                    label: city.name,
                  }))}
                  value={formik.values.city}
                  onChange={formik.handleChange}
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
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  fullWidth
                  disabled={!formik.values.district}
                />
              </Grid>


              {/* Board Name */}
              <Grid item xs={12} sm={6} md={2}>
                <SelectDrop
                  label="Board Name"
                  name="board"
                  options={[
                    { value: "CBSE", label: "CBSE" },
                    { value: "ICSE", label: "ICSE" },
                  ]}
                  value={formik.values.board}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.board && Boolean(formik.errors.board)}
                  helperText={formik.touched.board && formik.errors.board}
                  fullWidth
                />
              </Grid>

              {/* School Name */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="School Name"
                  name="school_name"
                  value={formik.values.school_name}
                  onChange={formik.handleChange}
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
                    formik.touched.school_name &&
                    Boolean(formik.errors.school_name)
                  }
                  helperText={
                    formik.touched.school_name && formik.errors.school_name
                  }
                  fullWidth
                />
              </Grid>

              
              {/* School Email */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="School Email"
                  name="school_email"
                  value={formik.values.school_email}
                  onChange={formik.handleChange}
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
                    formik.touched.school_email &&
                    Boolean(formik.errors.school_email)
                  }
                  helperText={
                    formik.touched.school_email && formik.errors.school_email
                  }
                  fullWidth
                />
              </Grid>

              {/* School Mobile Number */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="School Mobile Number"
                  name="school_contact_number"
                  type="tel"
                  value={formik.values.school_contact_number}
                  onChange={formik.handleChange}
                  onKeyDown={(e) => {
                    if (
                      !/^\d$/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    inputMode: "numeric",
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
                    formik.touched.school_contact_number &&
                    Boolean(formik.errors.school_contact_number)
                  }
                  helperText={
                    formik.touched.school_contact_number &&
                    formik.errors.school_contact_number
                  }
                  fullWidth
                />
              </Grid>


              {/* School Landline Number */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Landline Number"
                  name="school_landline_number"
                  type="tel"
                  value={formik.values.school_landline_number}
                  onChange={formik.handleChange}
                  onKeyDown={(e) => {
                    if (
                      !/^\d$/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    inputMode: "numeric",
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
                    formik.touched.school_landline_number &&
                    Boolean(formik.errors.school_landline_number)
                  }
                  helperText={
                    formik.touched.school_landline_number &&
                    formik.errors.school_landline_number
                  }
                  fullWidth
                />
              </Grid>

               {/* School Address */}
               <Grid item xs={12} sm={6} md={6}>
                <TextField
                  label="School Address"
                  name="school_address"
                  value={formik.values.school_address}
                  onChange={formik.handleChange}
                  size="small"
                  multiline
                  minRows={1}
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
                    formik.touched.school_address &&
                    Boolean(formik.errors.school_address)
                  }
                  helperText={
                    formik.touched.school_address &&
                    formik.errors.school_address
                  }
                  fullWidth
                />
              </Grid>

              {/* Pincode */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
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
                    formik.touched.pincode && Boolean(formik.errors.pincode)
                  }
                  helperText={formik.touched.pincode && formik.errors.pincode}
                  fullWidth
                />
              </Grid>

              {/* Principal Name */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Principal Name"
                  name="principal_name"
                  value={formik.values.principal_name}
                  onChange={formik.handleChange}
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
                    formik.touched.principal_name &&
                    Boolean(formik.errors.principal_name)
                  }
                  helperText={
                    formik.touched.principal_name &&
                    formik.errors.principal_name
                  }
                  fullWidth
                />
              </Grid>

              {/* Principal Contact Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Mobile Number"
                  name="principal_contact_number"
                  value={formik.values.principal_contact_number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      formik.setFieldValue("principal_contact_number", value);
                    }
                  }}
                  size="small"
                  inputMode="numeric"
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
                    formik.touched.principal_contact_number &&
                    Boolean(formik.errors.principal_contact_number)
                  }
                  helperText={
                    formik.touched.principal_contact_number &&
                    formik.errors.principal_contact_number
                  }
                  fullWidth
                />
              </Grid>

              {/* Principal Whatsapp Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="WhatsApp Number"
                  name="principal_whatsapp"
                  value={formik.values.principal_whatsapp}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      formik.setFieldValue("principal_whatsapp", value);
                    }
                  }}
                  size="small"
                  inputMode="numeric"
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
                    formik.touched.principal_whatsapp &&
                    Boolean(formik.errors.principal_whatsapp)
                  }
                  helperText={
                    formik.touched.principal_whatsapp &&
                    formik.errors.principal_whatsapp
                  }
                  fullWidth
                />
              </Grid>

              {/* Vice Principal Name */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Vice Principal Name"
                  name="vice_principal_name"
                  value={formik.values.vice_principal_name}
                  onChange={formik.handleChange}
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
                    formik.touched.vice_principal_name &&
                    Boolean(formik.errors.vice_principal_name)
                  }
                  helperText={
                    formik.touched.vice_principal_name &&
                    formik.errors.vice_principal_name
                  }
                  fullWidth
                />
              </Grid>

              {/* Vice Principal Contact Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Mobile Number"
                  name="vice_principal_contact_number"
                  value={formik.values.vice_principal_contact_number}
                  onChange={formik.handleChange}
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
                    formik.touched.vice_principal_contact_number &&
                    Boolean(formik.errors.vice_principal_contact_number)
                  }
                  helperText={
                    formik.touched.vice_principal_contact_number &&
                    formik.errors.vice_principal_contact_number
                  }
                  fullWidth
                />
              </Grid>

              {/* Vice Principal Whatsapp Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="WhatsApp Number"
                  name="vice_principal_whatsapp"
                  value={formik.values.vice_principal_whatsapp}
                  onChange={formik.handleChange}
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
                    formik.touched.vice_principal_whatsapp &&
                    Boolean(formik.errors.vice_principal_whatsapp)
                  }
                  helperText={
                    formik.touched.vice_principal_whatsapp &&
                    formik.errors.vice_principal_whatsapp
                  }
                  fullWidth
                />
              </Grid>

              {/* Manager Name */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Manager Name"
                  name="manager_name"
                  value={formik.values.manager_name}
                  onChange={formik.handleChange}
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
                    formik.touched.manager_name &&
                    Boolean(formik.errors.manager_name)
                  }
                  helperText={
                    formik.touched.manager_name && formik.errors.manager_name
                  }
                  fullWidth
                />
              </Grid>

              {/* Manager Contact Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Mobile Number"
                  name="manager_contact_number"
                  value={formik.values.manager_contact_number}
                  onChange={formik.handleChange}
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
                    formik.touched.manager_contact_number &&
                    Boolean(formik.errors.manager_contact_number)
                  }
                  helperText={
                    formik.touched.manager_contact_number &&
                    formik.errors.manager_contact_number
                  }
                  fullWidth
                />
              </Grid>

              {/* Manager Whatsapp Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="WhatsApp Number"
                  name="manager_whatsapp_number"
                  value={formik.values.manager_whatsapp_number}
                  onChange={formik.handleChange}
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
                    formik.touched.manager_whatsapp_number &&
                    Boolean(formik.errors.manager_whatsapp_number)
                  }
                  helperText={
                    formik.touched.manager_whatsapp_number &&
                    formik.errors.manager_whatsapp_number
                  }
                  fullWidth
                />
              </Grid>

              {/* 1st Olympiad Incharge Name */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="1st Olympiad Incharge Name"
                  name="first_incharge_name"
                  value={formik.values.first_incharge_name}
                  onChange={formik.handleChange}
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
                    formik.touched.first_incharge_name &&
                    Boolean(formik.errors.first_incharge_name)
                  }
                  helperText={
                    formik.touched.first_incharge_name &&
                    formik.errors.first_incharge_name
                  }
                  fullWidth
                />
              </Grid>

              {/* 1st Olympiad Contact Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Mobile Number"
                  name="first_incharge_number"
                  value={formik.values.first_incharge_number}
                  onChange={formik.handleChange}
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
                    formik.touched.first_incharge_number &&
                    Boolean(formik.errors.first_incharge_number)
                  }
                  helperText={
                    formik.touched.first_incharge_number &&
                    formik.errors.first_incharge_number
                  }
                  fullWidth
                />
              </Grid>

              {/* 1st Olympiad Whatsapp Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="WhatsApp Number"
                  name="first_incharge_whatsapp"
                  value={formik.values.first_incharge_whatsapp}
                  onChange={formik.handleChange}
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
                    formik.touched.first_incharge_whatsapp &&
                    Boolean(formik.errors.first_incharge_whatsapp)
                  }
                  helperText={
                    formik.touched.first_incharge_whatsapp &&
                    formik.errors.first_incharge_whatsapp
                  }
                  fullWidth
                />
              </Grid>

              {/* 2nd Olympiad Incharge Name */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="2nd Olympiad Incharge Name"
                  name="second_incharge_name"
                  value={formik.values.second_incharge_name}
                  onChange={formik.handleChange}
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
                    formik.touched.second_incharge_name &&
                    Boolean(formik.errors.second_incharge_name)
                  }
                  helperText={
                    formik.touched.second_incharge_name &&
                    formik.errors.second_incharge_name
                  }
                  fullWidth
                />
              </Grid>

              {/* 2nd Olympiad Contact Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Mobile Number"
                  name="second_incharge_number"
                  value={formik.values.second_incharge_number}
                  onChange={formik.handleChange}
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
                    formik.touched.second_incharge_number &&
                    Boolean(formik.errors.second_incharge_number)
                  }
                  helperText={
                    formik.touched.second_incharge_number &&
                    formik.errors.second_incharge_number
                  }
                  fullWidth
                />
              </Grid>

              {/* 2nd Olympiad Whatsapp Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="WhatsApp Number"
                  name="second_incharge_whatsapp"
                  value={formik.values.second_incharge_whatsapp}
                  onChange={formik.handleChange}
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
                    formik.touched.second_incharge_whatsapp &&
                    Boolean(formik.errors.second_incharge_whatsapp)
                  }
                  helperText={
                    formik.touched.second_incharge_whatsapp &&
                    formik.errors.second_incharge_whatsapp
                  }
                  fullWidth
                />
              </Grid>

              {/* Junior Student Strength */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="(Jr.)Student Strength"
                  name="junior_student_strength"
                  value={formik.values.junior_student_strength}
                  onChange={formik.handleChange}
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
                    formik.touched.junior_student_strength &&
                    Boolean(formik.errors.junior_student_strength)
                  }
                  helperText={
                    formik.touched.junior_student_strength &&
                    formik.errors.junior_student_strength
                  }
                  fullWidth
                />
              </Grid>

              {/* Senior Student Strength */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="(Sr.)Student Strength"
                  name="senior_student_strength"
                  value={formik.values.senior_student_strength}
                  onChange={formik.handleChange}
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
                    formik.touched.senior_student_strength &&
                    Boolean(formik.errors.senior_student_strength)
                  }
                  helperText={
                    formik.touched.senior_student_strength &&
                    formik.errors.senior_student_strength
                  }
                  fullWidth
                />
              </Grid>

              {/* Select Classes */}
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  multiple
                  id="classes"
                  options={classes}
                  value={formik.values.classes.map((classItem) => ({
                    value: classItem,
                    label: classItem,
                  }))}
                  onChange={(e, newValue) => {
                    formik.setFieldValue(
                      "classes",
                      newValue.map((item) => item.value)
                    );
                  }}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        checked={formik.values.classes.includes(option.value)}
                        color="primary"
                      />
                      {option.label}
                    </li>
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <span
                        {...getTagProps({ index })}
                        style={{
                          backgroundColor: "#90D14F",
                          color: "white",
                          borderRadius: "2px",
                          padding: "4px 6px",
                          fontSize: "12px",
                          margin: "2px",
                          display: "inline-flex",
                          alignItems: "center",
                          fontFamily: "Poppins",
                        }}
                      >
                        {option.label}
                        <RxCross2
                          size={12}
                          style={{
                            marginLeft: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "white",
                          }}
                          onClick={() => {
                            const newClasses = formik.values.classes.filter(
                              (item) => item !== option.value
                            );
                            formik.setFieldValue("classes", newClasses);
                          }}
                        />
                      </span>
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Classes"
                      placeholder="Choose classes"
                      variant="outlined"
                      size="small"
                      error={
                        formik.touched.classes && Boolean(formik.errors.classes)
                      }
                      helperText={
                        formik.touched.classes && formik.errors.classes
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

              {/* Status Dropdown */}
              <Grid item xs={12} sm={6} md={4}>
                <SelectDrop
                  label="Status"
                  name="status"
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                  value={formik.values.status}
                  onChange={formik.handleChange}
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
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
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
                onClick={() => navigate("/schoolList")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}