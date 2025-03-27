import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import styles from "./Student.module.css";
import ButtonComp from "../School/CommonComp/ButtonComp";
import Mainlayout from "../Layouts/Mainlayout";
import Swal from "sweetalert2";
import "animate.css";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/Swallfire.css";
import * as Yup from "yup";
import axios from "axios";
import SelectDrop from "../School/createschool/SelectDrop";

export default function StudentForm() {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const navigate = useNavigate();

  // Location data states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  // Filtered location options
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const validationSchema = Yup.object({
    school_name: Yup.string().required("School Name is required"),
    student_name: Yup.string().required("Student Name is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    city: Yup.string().required("City is required"),
    class_name: Yup.string().required("Class Name is required"),
    student_section: Yup.string().required("Section is required"),
    mobile_number: Yup.string()
      .required("Mobile Number is required")
      .matches(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
    whatsapp_number: Yup.string()
      .required("WhatsApp Number is required")
      .matches(/^\d{10}$/, "WhatsApp Number must be exactly 10 digits"),
    student_subject: Yup.array()
      .min(1, "Select at least one subject")
      .required("Subject is required"),
  });

  const formik = useFormik({
    initialValues: {
      school_name: "",
      student_name: "",
      country: "",
      state: "",
      district: "",
      city: "",
      class_name: "",
      student_section: "",
      mobile_number: "",
      whatsapp_number: "",
      student_subject: [],
    },
    validationSchema: validationSchema,
    // onSubmit: async (values) => {
    //   try {
    //     const token = localStorage.getItem("token");

    //     const response = await fetch(`${API_BASE_URL}/api/get/student`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify(values),
    //     });

    //     if (response.ok) {
    //       Swal.fire({
    //         position: "top-end",
    //         icon: "success",
    //         title: "Success!",
    //         text: `Student created successfully!`,
    //         showConfirmButton: false,
    //         timer: 1000,
    //         timerProgressBar: true,
    //         toast: true,
    //         background: "#fff",
    //         customClass: {
    //           popup: "small-swal",
    //         },
    //       }).then(() => {
    //         navigate("/student-create");
    //       });

    //       formik.resetForm();
    //     } else {
    //       throw new Error("Failed to submit form");
    //     }
    //   } catch (error) {
    //     Swal.fire({
    //       position: "top-end",
    //       icon: "error",
    //       title: "Error!",
    //       text: error.message || "An unexpected error occurred.",
    //       showConfirmButton: false,
    //       timer: 1000,
    //       timerProgressBar: true,
    //       toast: true,
    //       background: "#fff",
    //       customClass: {
    //         popup: "small-swal",
    //       },
    //     });
    //   }
    // },
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/get/student`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
          });
          // Reset only specific fields (keep school & location data)
          formik.setValues({
            ...formik.values, // Keep existing values
            student_name: "", // Clear student name
            class_name: "", // Clear class
            student_section: "", // Clear section
            mobile_number: "", // Clear mobile
            whatsapp_number: "", // Clear WhatsApp
            student_subject: [], // Clear subjects
          });
        } else {
          throw new Error("Failed to submit form");
        }
      } catch (error) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.message || "An unexpected error occurred.",
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
    },
  });

  // Handle country change
  useEffect(() => {
    if (formik.values.country) {
      const filtered = states.filter(
        (state) => state.country_id === formik.values.country
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
    formik.setFieldValue("state", "");
    formik.setFieldValue("district", "");
    formik.setFieldValue("city", "");
  }, [formik.values.country, states]);

  // Handle state change
  useEffect(() => {
    if (formik.values.state) {
      const filtered = districts.filter(
        (district) => district.state_id === formik.values.state
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
    formik.setFieldValue("district", "");
    formik.setFieldValue("city", "");
  }, [formik.values.state, districts]);

  // Handle district change
  useEffect(() => {
    if (formik.values.district) {
      const filtered = cities.filter(
        (city) => city.district_id === formik.values.district
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
    formik.setFieldValue("city", "");
  }, [formik.values.district, cities]);

  //school fetch
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

    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/countries/`);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/states/`);
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/districts/`);
        setDistricts(response.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cities/all/c1`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchSchools();
    fetchClasses();
    fetchSubjects();
    fetchCountries();
    fetchStates();
    fetchDistricts();
    fetchCities();
  }, []);

  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];

  // Prepare options for dropdowns
  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: country.name,
  }));

  const stateOptions = filteredStates.map((state) => ({
    value: state.id,
    label: state.name,
  }));

  const districtOptions = filteredDistricts.map((district) => ({
    value: district.id,
    label: district.name,
  }));

  const cityOptions = filteredCities.map((city) => ({
    value: city.id,
    label: city.name,
  }));

  // Handle country change
  useEffect(() => {
    if (formik.values.country) {
      const filtered = states.filter(
        (state) => state.country_id === formik.values.country
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
    formik.setFieldValue("state", "");
    formik.setFieldValue("district", "");
    formik.setFieldValue("city", "");
  }, [formik.values.country, states]);

  // Handle state change
  useEffect(() => {
    if (formik.values.state) {
      const filtered = districts.filter(
        (district) => district.state_id === formik.values.state
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
    formik.setFieldValue("district", "");
    formik.setFieldValue("city", "");
  }, [formik.values.state, districts]);

  // Handle district change
  useEffect(() => {
    if (formik.values.district) {
      const filtered = cities.filter(
        (city) => city.district_id === formik.values.district
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
    formik.setFieldValue("city", "");
  }, [formik.values.district, cities]);

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
              Create Student
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

              {/* Location fields */}
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Country"
                  name="country"
                  options={countryOptions}
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="State"
                  name="state"
                  options={stateOptions}
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.country}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="District"
                  name="district"
                  options={districtOptions}
                  value={formik.values.district}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.state}
                  error={
                    formik.touched.district && Boolean(formik.errors.district)
                  }
                  helperText={formik.touched.district && formik.errors.district}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="City"
                  name="city"
                  options={cityOptions}
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.district}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
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

              <Grid item xs={12} sm={6} md={6}>
                <Autocomplete
                  multiple
                  id="student_subject"
                  options={subjectOptions}
                  value={formik.values.student_subject.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  size="small"
                  onChange={(e, newValue) => {
                    formik.setFieldValue(
                      "student_subject",
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
                        checked={formik.values.student_subject.includes(
                          option.value
                        )}
                        color="primary"
                      />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Subjects"
                      placeholder="Subjects"
                      variant="outlined"
                      error={
                        formik.touched.student_subject &&
                        Boolean(formik.errors.student_subject)
                      }
                      helperText={
                        formik.touched.student_subject &&
                        formik.errors.student_subject
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
