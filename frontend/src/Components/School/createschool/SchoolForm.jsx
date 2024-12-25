import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import styles from "./School.module.css";
// import ButtonComp from "../CommonComp/ButtonComp";
import Swal from "sweetalert2";
import TextInput from "../CommonComp/TextInput";
import SelectDrop from "../CommonComp/SelectDrop";
import Mainlayout from "../../Layouts/Mainlayout";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

export default function SchoolForm() {
  const [formData, setFormData] = useState({
    board: "",
    school_name: "",
    school_email: "",
    school_contact_number: "",
    // school_code: "",
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
    student_strength: "",
    classes: [],
  });

  const boardOptions = [
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
  ];
  const pincodeOptions = [
    { value: "100012", label: "100012" },
    { value: "100022", label: "100022" },
    { value: "100032", label: "100032" },
  ];
  const classOptions = [
    { value: "Class 1", label: "Class 1" },
    { value: "Class 2", label: "Class 2" },
    { value: "Class 3", label: "Class 3" },
    { value: "Class 4", label: "Class 4" },
    { value: "Class 5", label: "Class 5" },
    { value: "Class 6", label: "Class 6" },
    { value: "Class 7", label: "Class 7" },
    { value: "Class 8", label: "Class 8" },
    { value: "Class 9", label: "Class 9" },
    { value: "Class 10", label: "Class 10" },
  ];
  const inputRef = useRef(null);
  const navigate = useNavigate();
  //------------------------fetch api codes------------------------------------------//

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Fetch states dynamically
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/states/`);
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  // Fetch districts based on selected state
  useEffect(() => {
    if (formData.state) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/districts/?state_id=${formData.state}`
          );
          setDistricts(response.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  // Fetch cities based on selected district
  useEffect(() => {
    if (formData.district) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/cities/?district_id=${formData.district}`
          );
          setCities(response.data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }
  }, [formData.district]);

  // Filtering districts when a state is selected
  useEffect(() => {
    if (formData.state) {
      const filtered = districts.filter(
        (district) => district.state_id === formData.state
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
    setFormData((prev) => ({
      ...prev,
      district: "",
      city: "",
    }));
  }, [formData.state, districts]);

  // Filtering cities when a district is selected
  useEffect(() => {
    if (formData.district) {
      const filtered = cities.filter(
        (city) => city.district_id === formData.district
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
    setFormData((prev) => ({
      ...prev,
      city: "",
    }));
  }, [formData.district, cities]);

  //-------------------------end code of api-------------------------------------------//

  // const handleChange = (e, newValue) => {
  //   const { name } = e.target;

  //   if (name === "classes" && newValue !== undefined) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       classes: newValue.map((item) => item.value),
  //     }));
  //   } else if (name.includes("schoolAddress")) {
  //     const addressField = name.split(".")[1];
  //     setFormData((prev) => ({
  //       ...prev,
  //       schoolAddress: {
  //         ...prev.schoolAddress,
  //         [addressField]: e.target.value,
  //       },
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: e.target.value,
  //     }));
  //   }
  // };
  const handleChange = (e, newValue) => {
    const { name, value } = e.target;

    // Regular expression to check for special characters (excluding alphanumeric and spaces)
    const specialCharRegex = /[^a-zA-Z0-9\s]/;

    // Validate school_name field
    if (name === "school_name" && specialCharRegex.test(value)) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Invalid Input",
        text: "School Name cannot contain special characters.",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        toast: true,
        customClass: {
          popup: "small-swal",
        },
        background: "#fff",
      });
      return; // Prevent update if special characters are found
    }

    if (name === "classes" && newValue !== undefined) {
      setFormData((prev) => ({
        ...prev,
        classes: newValue.map((item) => item.value),
      }));
    } else if (name.includes("schoolAddress")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        schoolAddress: {
          ...prev.schoolAddress,
          [addressField]: e.target.value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting formData:", JSON.stringify(formData, null, 2)); // Debug formData

    // Show processing alert
    const loadingSwal = Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the school.",
      icon: "info",
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/get/schools`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setTimeout(() => {
        loadingSwal.close();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `school created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/schoolList");
        });
      }, 1000);
    } catch (error) {
      loadingSwal.close();
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
              { name: "School", link: "/schoolList" },
              { name: "Create School" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <div>
            <Typography className={`${styles.formTitle} mb-4`}>
              School Registration Form
            </Typography>
          </div>
          <form onSubmit={handleSubmit} className={styles.formContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <SelectDrop
                  className={styles.selectInput}
                  label="Board Name"
                  name="board"
                  options={boardOptions}
                  value={formData.board}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, board: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  className={styles.textInput}
                  label="School Name"
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  className={styles.textInput}
                  label="School Email"
                  name="school_email"
                  value={formData.school_email}
                  onChange={handleChange}
                  type="email"
                  fullWidth
                />
              </Grid>
              {/* School Contact Number, */}
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="School Contact Number"
                  name="school_contact_number"
                  value={formData.school_contact_number}
                  onChange={handleChange}
                  type="tel"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <SelectDrop
                  label="State"
                  name="state"
                  value={formData.state}
                  options={states.map((state) => ({
                    value: state.id, // Use ID for unique identification
                    label: state.name, // Name for display
                  }))}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <SelectDrop
                  label="District"
                  name="district"
                  options={districts.map((district) => ({
                    value: district.id, // Use ID for unique identification
                    label: district.name, // Name for display
                  }))}
                  value={formData.district}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      district: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <SelectDrop
                  label="City"
                  name="city"
                  options={cities.map((city) => ({
                    value: city.id, // Use ID for unique identification
                    label: city.name, // Name for display
                  }))}
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>

              {/* //pincode */}
              <Grid item xs={12} sm={6} md={2}>
                {/* <SelectDrop
                  label="Pincode"
                  name="pincode"
                  options={pincodeOptions}
                  value={formData.pincode}
                  onChange={handleChange}
                  fullWidth
                /> */}
                <TextInput
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* Principal Name, Principal Email-ID */}
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="Principal Name"
                  name="principal_name"
                  value={formData.principal_name}
                  onChange={handleChange}
                  type="text"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="Contact Number"
                  name="principal_contact_number"
                  value={formData.principal_contact_number}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* Whatsapp Number */}
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="Whatsapp Number"
                  name="principal_whatsapp"
                  value={formData.principal_whatsapp}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* Vice Principal Details */}
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="Vice Principal Name"
                  name="vice_principal_name"
                  value={formData.vice_principal_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="Contact Number"
                  name="vice_principal_contact_number"
                  value={formData.vice_principal_contact_number}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="Whatsapp Number"
                  name="vice_principal_whatsapp"
                  value={formData.vice_principal_whatsapp}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* Student Strength */}
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="Student Strength"
                  name="student_strength"
                  value={formData.student_strength}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* Select Your Classes */}
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  multiple
                  id="classes"
                  options={classOptions}
                  value={formData.classes.map((classItem) => ({
                    value: classItem,
                    label: classItem,
                  }))}
                  size="small"
                  onChange={(e, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      classes: newValue.map((item) => item.value),
                    }));
                  }}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option, { selected }) => (
                    <li
                      {...props}
                      style={{
                        fontSize: "12px",
                        padding: "5px 10px",
                        margin: "0",
                        lineHeight: "1.5",
                        fontFamily: "Poppins",
                      }}
                    >
                      <Checkbox
                        checked={formData.classes.includes(option.value)}
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
                            const newClasses = formData.classes.filter(
                              (item) => item !== option.value
                            );
                            setFormData((prev) => ({
                              ...prev,
                              classes: newClasses,
                            }));
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
            {/* Submit and Cancel Buttons */}
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
