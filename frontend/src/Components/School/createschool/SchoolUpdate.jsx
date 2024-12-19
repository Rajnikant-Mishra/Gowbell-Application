import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import { FaPhoneAlt, FaTrash, FaWhatsapp } from "react-icons/fa";
import Swal from "sweetalert2";
import "animate.css";
import { RxCross2 } from "react-icons/rx";
import styles from "./School.module.css";
import TextInput from "../CommonComp/TextInput";
import SelectDrop from "../CommonComp/SelectDrop";
import Mainlayout from "../../Layouts/Mainlayout";
import ButtonComp from "../CommonComp/ButtonComp";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams to fetch school ID
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";

export default function SchoolForm() {
  const { id } = useParams(); // Fetching school ID from URL
  const [formData, setFormData] = useState({
    board: "",
    school_name: "",
    school_email: "",
    school_contact_number: "",
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
    classes: [], // Ensure it's an empty array initially
  });

  // States for dropdown options
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const navigate = useNavigate();
  const inputRef = useRef(null);

  const boardOptions = [
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    // { value: "State Board", label: "State Board" },
  ];
  const pincodeOptions = [
    { value: "100015", label: "100015" },
    { value: "100025", label: "100025" },
    { value: "100035", label: "100035" },
  ];


  //classes codes ----------------------------------------------------------//
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
  ];

  const handleChange = (e, newValue) => {
    const { name } = e.target;

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

  
  // Fetch states dynamically
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${ API_BASE_URL }/api/states/`);
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  // Fetch school data for editing when ID is available
  useEffect(() => {
    if (id) {
      const fetchSchoolData = async () => {
        try {
          const response = await axios.get(
            `${ API_BASE_URL }/api/get/schools/${id}`
          );
          setFormData(response.data); // Pre-fill form with fetched data
        } catch (error) {
          console.error("Error fetching school data:", error);
        }
      };
      fetchSchoolData();
    }
  }, [id]);

  // Fetch districts based on selected state
  useEffect(() => {
    if (formData.state) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `${ API_BASE_URL }/api/districts/?state_id=${formData.state}`
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
            `${ API_BASE_URL }/api/cities/?district_id=${formData.district}`
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

  // Handle form submission (update)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { id, school_code, created_at, updated_at, ...payload } = { ...formData };
  
    try {
      console.log("Submitting data: ", payload);
  
      const response = await axios.put(
        `${ API_BASE_URL }/api/get/schools/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      // Display success notification
     Swal.fire({
               position: "top-end",
               icon: "success",
               title: "Success!",
               text: `school updated successfully!`,
               showConfirmButton: false,
               timer: 1000,
               timerProgressBar: true,
               toast: true,
               background: "#fff",
               customClass: {
                 popup: "small-swal",
               },
             }).then(() => navigate("/schoolList"));
    } catch (error) {
      console.error("Error during update: ", error.response?.data || error);
  
      // Check for validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
  
        // Display each validation error as a toast
        validationErrors.forEach((message) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Validation Error",
            text: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            toast: true,
          });
        });
      } else {
        // Generic error handling
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.message ||
            "An error occurred while updating the school.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
        });
      }
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
              {/* School Contact Number, State, District */}
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
                  options={states.map((state) => ({
                    value: String(state.name), 
                    label: state.name,
                  }))}
                  value={formData.state}
                  onChange={
                    (e) =>
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
                    value: String(district.name),
                    label: district.name,
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
              {/* City, Pincode */}
              <Grid item xs={12} sm={6} md={2}>
               
                 <SelectDrop
                  label="City"
                  name="city"
                  options={cities.map((city) => ({
                    value: String(city.name),
                    label: city.name,
                  }))}
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <SelectDrop
                  label="Pincode"
                  name="pincode"
                  options={pincodeOptions}
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
              className={`${styles.buttonContainer} gap-2 mt-3`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp
                text="Submit"
                type="submit"
                onClick={handleSubmit}
                disabled={false}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/school-create")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
