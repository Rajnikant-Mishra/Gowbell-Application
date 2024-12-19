import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import styles from "../incharge/AssignIncharge.module.css";
import ButtonComp from "../CommonComp/ButtonComp";
import TextInput from "../CommonComp/TextInput";
import SelectDrop from "../CommonComp/SelectDrop";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";

export default function AssignInChargeForm() {
  const [formData, setFormData] = useState({
    school_name: "",
    incharge_name: "",
    incharge_dob: "",
    mobile_number: "",
    class_from: "",
    class_to: "",
  });

  const [classOptions, setClassOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/master`);
        if (response.status === 200) {
          const options = response.data.map((item) => ({
            value: item.name, // Replace `id` with the correct identifier
            label: item.name,
          }));
          setClassOptions(options);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        Swal.fire("Error", "Failed to load class data.", "error");
      }
    };
    fetchClassData();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Define fields and labels for validation
    const fields = [
      { name: "school_name", label: "School Name" },
      { name: "incharge_name", label: "Incharge Name" },
      { name: "incharge_dob", label: "Incharge DOB" },
      { name: "mobile_number", label: "Mobile Number", validation: validateMobileNumber },
      { name: "class_from", label: "Class From" },
      { name: "class_to", label: "Class To" }
    ];
  
    // Loop through each field and check for missing values
    for (let field of fields) {
      if (!formData[field.name]) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: `${field.label} is required.`,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            popup: "small-swal",
          },
          background: "#fff",
        });
        return; // Stop further processing if a field is missing
      }
  
      // Additional validation for phone number
      if (field.name === "mobile_number" && field.validation && !field.validation(formData[field.name])) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "Mobile Number must be 10 digits.",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            popup: "small-swal",
          },
          background: "#fff",
        });
        return;
      }
    }
  
    try {
      // API request to submit form data ===============================================================//
      const response = await axios.post(
        `${API_BASE_URL}/api/get/incharges`,
        formData
      );
  
      // Check if the response indicates success
      if (response.status === 200 || response.status === 201) {
        // Show success message and reset form
        await Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: "Incharge created successfully!",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
  
        // Clear the form and navigate after successful submission
        setFormData({
          school_name: "",
          incharge_name: "",
          incharge_dob: "",
          mobile_number: "",
          class_from: "",
          class_to: "",
        });
        navigate("/inchargeList");
      } else {
        // Handle unexpected responses
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error assigning incharge:", error);
  
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Failed to assign incharge",
        text: error.response?.data?.message || "Please try again.",
      });
    }
  };
  
  // Validation function for mobile number
  const validateMobileNumber = (number) => {
    // Regex to check if the number is exactly 10 digits
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };
  
  
  

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Incharge", link: "/inchargeList" },
              { name: "Assign Incharge" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <Typography className={`${styles.formTitle} mb-4`}>
            Assign In Charge Form
          </Typography>
          <form className={styles.formContent} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <TextInput
                  className={styles.textInput}
                  label="School Name"
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleChange}
                  type="text"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextInput
                  className={styles.textInput}
                  label="Incharge Name"
                  name="incharge_name"
                  value={formData.incharge_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextInput
                  name="incharge_dob"
                  value={formData.incharge_dob}
                  onChange={handleChange}
                  type="date"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextInput
                  label="Mobile Number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  type="tel"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class From"
                  name="class_from"
                  options={classOptions}
                  value={formData.class_from}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "class_from", value: e.target.value },
                    })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class To"
                  name="class_to"
                  options={classOptions}
                  value={formData.class_to}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "class_to", value: e.target.value },
                    })
                  }
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box
              className={`${styles.buttonContainer} gap-2 mt-4`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
              <ButtonComp
                text="Cancel"
                type="button"
                onClick={() =>
                  setFormData({
                    school_name: "",
                    incharge_name: "",
                    incharge_dob: "",
                    mobile_number: "",
                    class_from: "",
                    class_to: "",
                  })
                }
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
