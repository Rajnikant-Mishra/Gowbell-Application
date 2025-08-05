
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentForm() {
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Selected location states
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Schools state
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");

  const validationSchema = Yup.object({
    school_id: Yup.string().required("School is required"),
    student_name: Yup.string().required("Student Name is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    city: Yup.string().required("City is required"),
    class_id: Yup.string().required("Class Name is required"),
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
    approved: Yup.boolean(),
    approved_by: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      school_id: "",
      student_name: "",
      country: "",
      state: "",
      district: "",
      city: "",
      class_id: "",
      student_section: "",
      mobile_number: "",
      whatsapp_number: "",
      student_subject: [],
      approved: false, // Added default value
      approved_by: null, // Added default value
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
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

        const responseData = await response.json();

        if (response.ok) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Success!",
            text: responseData.message || "Student created successfully!",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          });
          // Reset form fields
          formik.resetForm();
          setSelectedSchool("");
          setSelectedCountry("");
          setSelectedState("");
          setSelectedDistrict("");
          setSelectedCity("");
        } else {
          throw new Error(responseData.message || "Failed to create student");
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
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Fetch schools based on location filters
  const fetchSchoolsByLocation = async (filters) => {
    if (
      !filters.country ||
      !filters.state ||
      !filters.district ||
      !filters.city
    ) {
      setSchools([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        {
          params: filters,
        }
      );
      if (response.data.success) {
        const schoolList = response.data.data.flatMap((location) =>
          location.schools.map((school) => ({
            id: school.id,
            school_name: school.name,
            country_name: location.country,
            state_name: location.state,
            district_name: location.district,
            city_name: location.city,
          }))
        );
        setSchools(schoolList);
      } else {
        setSchools([]);
        toast.error("No schools found for the selected location.");
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setSchools([]);
      toast.error("Failed to fetch schools.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch class options
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/class`);
        setClassOptions(
          response.data.map((cls) => ({
            value: cls.id,
            label: cls.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to fetch classes.");
      }
    };
    fetchClasses();
  }, []);

  // Fetch subject options
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/subject`);
        setSubjectOptions(
          response.data.map((subject) => ({
            value: subject.id,
            label: subject.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to fetch subjects.");
      }
    };
    fetchSubjects();
  }, []);

  // Location filter effects
  useEffect(() => {
    if (selectedCountry) {
      setFilteredStates(
        states.filter((state) => state.country_id === selectedCountry)
      );
      fetchSchoolsByLocation({ country: selectedCountry });
      formik.setFieldValue("state", "");
      formik.setFieldValue("district", "");
      formik.setFieldValue("city", "");
      formik.setFieldValue("school_id", "");
      setSelectedSchool("");
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState) {
      setFilteredDistricts(
        districts.filter((district) => district.state_id === selectedState)
      );
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
      });
      formik.setFieldValue("district", "");
      formik.setFieldValue("city", "");
      formik.setFieldValue("school_id", "");
      setSelectedSchool("");
    }
    setSelectedDistrict("");
    setSelectedCity("");
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      setFilteredCities(
        cities.filter((city) => city.district_id === selectedDistrict)
      );
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
      });
      formik.setFieldValue("city", "");
      formik.setFieldValue("school_id", "");
      setSelectedSchool("");
    }
    setSelectedCity("");
  }, [selectedDistrict, cities]);

  useEffect(() => {
    if (selectedCity) {
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
        city: selectedCity,
      });
      formik.setFieldValue("school_id", "");
      setSelectedSchool("");
    }
  }, [selectedCity]);

  // Fetch initial location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [countriesRes, statesRes, districtsRes, citiesRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/countries`),
            axios.get(`${API_BASE_URL}/api/states`),
            axios.get(`${API_BASE_URL}/api/districts`),
            axios.get(`${API_BASE_URL}/api/cities/all/c1`),
          ]);
        setCountries(
          Array.isArray(countriesRes?.data) ? countriesRes.data : []
        );
        setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
        setDistricts(
          Array.isArray(districtsRes?.data) ? districtsRes.data : []
        );
        setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
      } catch (error) {
        console.error("Error fetching location data:", error);
        toast.error("Failed to fetch location data.");
      }
    };
    fetchLocationData();
  }, []);

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

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.school_name,
  }));

  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];

  return (
    <Mainlayout>
      <ToastContainer />
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
              {/* Location fields */}
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Country"
                  name="country"
                  options={countryOptions}
                  value={formik.values.country}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSelectedCountry(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                  fullWidth
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="State"
                  name="state"
                  options={stateOptions}
                  value={formik.values.state}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSelectedState(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.country || isLoading}
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
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSelectedDistrict(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.state || isLoading}
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
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSelectedCity(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.district || isLoading}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  fullWidth
                />
              </Grid>

              {/* School and student fields */}
              <Grid item xs={12} sm={6} md={6}>
                <SelectDrop
                  label="School Name"
                  name="school_id"
                  options={schoolOptions}
                  value={formik.values.school_id}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSelectedSchool(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.school_id && Boolean(formik.errors.school_id)
                  }
                  helperText={
                    formik.touched.school_id && formik.errors.school_id
                  }
                  fullWidth
                  disabled={!formik.values.city || isLoading}
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
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class"
                  name="class_id"
                  options={classOptions}
                  value={formik.values.class_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.class_id &&
                    Boolean(formik.errors.class_id)
                  }
                  helperText={
                    formik.touched.class_id && formik.errors.class_id
                  }
                  fullWidth
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="WhatsApp Number"
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
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Autocomplete
                  multiple
                  id="student_subject"
                  options={subjectOptions}
                  value={formik.values.student_subject.map((item) => ({
                    value: item,
                    label:
                      subjectOptions.find((opt) => opt.value === item)?.label ||
                      item,
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
                  renderOption={(props, option, { selected }) => {
                    const { key, ...rest } = props;
                    return (
                      <li key={key} {...rest}>
                        <Checkbox
                          checked={formik.values.student_subject.includes(
                            option.value
                          )}
                          color="primary"
                        />
                        {option.label}
                      </li>
                    );
                  }}
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
                  disabled={isLoading}
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
                disabled={isLoading}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/studentList")}
                disabled={isLoading}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
