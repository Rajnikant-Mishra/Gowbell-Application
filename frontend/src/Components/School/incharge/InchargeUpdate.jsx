// import React, { useState, useEffect } from "react";
// import { Box, Typography, Grid } from "@mui/material";
// import styles from "../incharge/AssignIncharge.module.css";
// import ButtonComp from "../CommonComp/ButtonComp";
// import TextInput from "../CommonComp/TextInput";
// import SelectDrop from "../CommonComp/SelectDrop";
// import Mainlayout from "../../Layouts/Mainlayout";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";

// export default function UpdateInChargeForm() {
//   const { id } = useParams(); // Get incharge ID from URL params
//   const [formData, setFormData] = useState({
//     school_name: "",
//     incharge_name: "",
//     incharge_dob: "",
//     mobile_number: "",
//     class_from: "",
//     class_to: "",
//   });

//   const [classOptions, setClassOptions] = useState([]);
//   const navigate = useNavigate();

//   // Fetch incharge data and class options on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [inchargeResponse, classResponse] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/get/incharges/${id}`),
//           axios.get(`${API_BASE_URL}/api/class`),
//         ]);

//         // Set form data with the fetched incharge data
//         // if (inchargeResponse.status === 200) {
//         //   setFormData(inchargeResponse.data);
//         // }
//         if (inchargeResponse.status === 200) {
//           const data = inchargeResponse.data;
//           data.incharge_dob = data.incharge_dob.split("T")[0]; // Convert '2024-11-22T18:30:00.000Z' to '2024-11-22'
//           setFormData(data);
//         }

//         // Set class options for the dropdown
//         if (classResponse.status === 200) {
//           const options = classResponse.data.map((item) => ({
//             value: item.name, // Replace `id` with the correct identifier
//             label: item.name,
//           }));
//           setClassOptions(options);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         Swal.fire("Error", "Failed to load data.", "error");
//       }
//     };
//     fetchData();
//   }, [id]);

//   // const handleChange = ({ target: { name, value } }) => {
//   //   setFormData((prev) => ({ ...prev, [name]: value }));
//   // };
//   const handleChange = ({ target: { name, value } }) => {
//       if (name === "incharge_name") {
//         // Disallow special characters
//         const noSpecialCharRegex = /^[a-zA-Z0-9 ]*$/;
//         if (!noSpecialCharRegex.test(value)) {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Invalid Input",
//             text: "Incharge Name cannot contain special characters.",
//             showConfirmButton: false,
//             timer: 4000,
//             timerProgressBar: true,
//             toast: true,
//             customClass: {
//               popup: "small-swal",
//             },
//             background: "#fff",
//           });
//           return;
//         }
//       }

//       setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     // Define fields and labels for validation
//     const fields = [
//       { name: "school_name", label: "School Name" },
//       { name: "incharge_name", label: "Incharge Name" },
//       { name: "incharge_dob", label: "Incharge DOB" },
//       {
//         name: "mobile_number",
//         label: "Mobile Number",
//         validation: validateMobileNumber,
//       },
//       { name: "class_from", label: "Class From" },
//       { name: "class_to", label: "Class To" },
//     ];

//     // Loop through each field and check for missing values
//     for (let field of fields) {
//       if (!formData[field.name]) {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: `${field.label} is required.`,
//           showConfirmButton: false,
//           timer: 4000,
//           timerProgressBar: true,
//           toast: true,
//           customClass: {
//             popup: "small-swal",
//           },
//           background: "#fff",
//         });
//         return; // Stop further processing if a field is missing
//       }

//       // Additional validation for phone number
//       if (
//         field.name === "mobile_number" &&
//         field.validation &&
//         !field.validation(formData[field.name])
//       ) {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: "Mobile Number must be 10 digits.",
//           showConfirmButton: false,
//           timer: 4000,
//           timerProgressBar: true,
//           toast: true,
//           customClass: {
//             popup: "small-swal",
//           },
//           background: "#fff",
//         });
//         return;
//       }
//     }

//     // Format the date before sending it to the server
//     const formattedData = {
//       ...formData,
//       incharge_dob: formData.incharge_dob.split("T")[0], // Converts '2024-11-22T18:30:00.000Z' to '2024-11-22'
//     };

//     try {
//       const response = await axios.put(
//         `${API_BASE_URL}/api/get/incharges/${id}`,
//         formattedData
//       );

//       if (response.status === 200) {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: `Incharge updated successfully!`,
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         });
//         navigate("/inchargeList");
//       }
//     } catch (error) {
//       console.error("Error updating incharge:", error);

//       Swal.fire({
//         icon: "error",
//         title: "Failed to update incharge",
//         text:
//           error.response?.data?.sqlMessage || "An unexpected error occurred.",
//       });
//     }
//   };

//   // Validation function for mobile number
//   const validateMobileNumber = (number) => {
//     // Regex to check if the number is exactly 10 digits
//     const regex = /^[0-9]{10}$/;
//     return regex.test(number);
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[
//               { name: "Incharge", link: "/inchargeList" },
//               { name: "Update Incharge" },
//             ]}
//           />
//         </div>
//       </div>
//       <Box className={`${styles.formContainer} container-fluid pt-5`}>
//         <div className={`${styles.formBox}`}>
//           <Typography className={`${styles.formTitle} mb-4`}>
//             Update In Charge Form
//           </Typography>
//           <form className={styles.formContent} onSubmit={handleUpdate}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={6}>
//                 <TextInput
//                   className={styles.textInput}
//                   label="School Name"
//                   name="school_name"
//                   value={formData.school_name}
//                   onChange={handleChange}
//                   type="text"
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={6}>
//                 <TextInput
//                   className={styles.textInput}
//                   label="Incharge Name"
//                   name="incharge_name"
//                   value={formData.incharge_name}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextInput
//                   name="incharge_dob"
//                   value={formData.incharge_dob}
//                   onChange={handleChange}
//                   type="date"
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextInput
//                   label="Mobile Number"
//                   name="mobile_number"
//                   value={formData.mobile_number}
//                   onChange={handleChange}
//                   type="tel"
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <SelectDrop
//                   label="Class From"
//                   name="class_from"
//                   options={classOptions}
//                   value={formData.class_from}
//                   onChange={(e) =>
//                     handleChange({
//                       target: { name: "class_from", value: e.target.value },
//                     })
//                   }
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <SelectDrop
//                   label="Class To"
//                   name="class_to"
//                   options={classOptions}
//                   value={formData.class_to}
//                   onChange={(e) =>
//                     handleChange({
//                       target: { name: "class_to", value: e.target.value },
//                     })
//                   }
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>
//             <Box
//               className={`${styles.buttonContainer} gap-2 mt-4`}
//               sx={{ display: "flex", gap: 2 }}
//             >
//               <ButtonComp
//                 text="Submit"
//                 type="submit"
//                 disabled={false}
//                 sx={{ flexGrow: 1 }}
//               />
//               <ButtonComp
//                 text="Cancel"
//                 type="button"
//                 sx={{ flexGrow: 1 }}
//                 onClick={() => navigate("/inchargeList")}
//               />
//             </Box>
//           </form>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// }

import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, TextField, MenuItem } from "@mui/material";
import styles from "../incharge/AssignIncharge.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectDrop from "../CommonComp/SelectDrop";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

export default function UpdateInChargeForm() {
  const [classOptions, setClassOptions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [initialValues, setInitialValues] = useState({
    school_name: "",
    incharge_name: "",
    incharge_dob: "",
    mobile_number: "",
    class_from: "",
    class_to: "",
  });

  const { id } = useParams(); // Get the incharge ID from the URL
  const navigate = useNavigate();

  // Fetch class data on component mount
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/class`);
        if (response.status === 200) {
          const options = response.data.map((item) => ({
            value: item.name,
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

  // Fetch schools data on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/get/schools`)
      .then((res) => setSchools(res.data))
      .catch((err) => console.error("Error fetching schools:", err));
  }, []);

  // Fetch incharge data based on ID
  // useEffect(() => {
  //   const fetchInchargeData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_BASE_URL}/api/get/incharges/${id}`
  //       );
  //       if (response.status === 200) {
  //         const inchargeData = response.data;
  //         setInitialValues({
  //           school_name: inchargeData.school_name,
  //           incharge_name: inchargeData.incharge_name,
  //           incharge_dob: inchargeData.incharge_dob,
  //           mobile_number: inchargeData.mobile_number,
  //           class_from: inchargeData.class_from,
  //           class_to: inchargeData.class_to,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching incharge data:", error);
  //       Swal.fire("Error", "Failed to load incharge data.", "error");
  //     }
  //   };
  //   fetchInchargeData();
  // }, [id]);

  useEffect(() => {
    const fetchInchargeData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/get/incharges/${id}`);
        if (response.status === 200) {
          const inchargeData = response.data;
  
          // Ensure 'incharge_dob' is correctly formatted
          const formattedDob = inchargeData.incharge_dob ? inchargeData.incharge_dob.split("T")[0] : "";
  
          // Set state with formatted data
          setInitialValues({
            school_name: inchargeData.school_name || "",
            incharge_name: inchargeData.incharge_name || "",
            incharge_dob: formattedDob,
            mobile_number: inchargeData.mobile_number || "",
            class_from: inchargeData.class_from || "",
            class_to: inchargeData.class_to || "",
          });
        }
      } catch (error) {
        console.error("Error fetching incharge data:", error);
        Swal.fire("Error", "Failed to load incharge data.", "error");
      }
    };
  
    if (id) {
      fetchInchargeData();
    }
  }, [id]); // Only refetch when 'id' changes
  

  //message css
  const helperTextStyle = {
    fontSize: "0.7rem", // Custom font size
    color: "red", // Custom color for error messages
  };

  // Formik initial values and validation schema
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // This allows formik to reinitialize when initialValues change
    validationSchema: Yup.object({
      school_name: Yup.string().required("School Name is required"),
      incharge_name: Yup.string()
        .matches(
          /^[a-zA-Z0-9 ]*$/,
          "Incharge Name cannot contain special characters"
        )
        .required("Incharge Name is required"),
      incharge_dob: Yup.date().required("Incharge DOB is required"),
      mobile_number: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits")
        .required("Mobile Number is required"),
      class_from: Yup.string().required("Class From is required"),
      class_to: Yup.string().required("Class To is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/get/incharges/${id}`,
          values
        );
        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Success!",
            text: "Incharge updated successfully!",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          });
          navigate("/inchargeList");
        }
      } catch (error) {
        console.error("Error updating incharge:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to update incharge",
          text: error.response?.data?.message || "Please try again.",
        });
      }
    },
  });

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Incharge", link: "/inchargeList" },
              { name: "Update Incharge" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <Typography className={`${styles.formTitle} mb-4`}>
            Update In Charge Form
          </Typography>
          <form className={styles.formContent} onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  select
                  fullWidth
                  label="School Name"
                  name="school_name"
                  value={formik.values.school_name}
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
                    formik.touched.school_name &&
                    Boolean(formik.errors.school_name)
                  }
                  helperText={
                    formik.touched.school_name && formik.errors.school_name
                  }
                >
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.school_name}>
                      {school.school_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  className={styles.textInput}
                  label="Incharge Name"
                  name="incharge_name"
                  value={formik.values.incharge_name}
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
                  FormHelperTextProps={{
                    style: helperTextStyle, // Apply centralized style
                  }}
                  error={
                    formik.touched.incharge_name &&
                    Boolean(formik.errors.incharge_name)
                  }
                  helperText={
                    formik.touched.incharge_name && formik.errors.incharge_name
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  name="incharge_dob"
                  value={formik.values.incharge_dob}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="date"
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
                  FormHelperTextProps={{
                    style: helperTextStyle, // Apply centralized style
                  }}
                  error={
                    formik.touched.incharge_dob &&
                    Boolean(formik.errors.incharge_dob)
                  }
                  helperText={
                    formik.touched.incharge_dob && formik.errors.incharge_dob
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
                  type="tel"
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
                  FormHelperTextProps={{
                    style: helperTextStyle, // Apply centralized style
                  }}
                  error={
                    formik.touched.mobile_number &&
                    Boolean(formik.errors.mobile_number)
                  }
                  helperText={
                    formik.touched.mobile_number && formik.errors.mobile_number
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class From"
                  name="class_from"
                  options={classOptions}
                  value={formik.values.class_from}
                  onChange={formik.handleChange}
                  FormHelperTextProps={{
                    style: helperTextStyle, // Apply centralized style
                  }}
                  error={
                    formik.touched.class_from &&
                    Boolean(formik.errors.class_from)
                  }
                  helperText={
                    formik.touched.class_from && formik.errors.class_from
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class To"
                  name="class_to"
                  options={classOptions}
                  value={formik.values.class_to}
                  onChange={formik.handleChange}
                  FormHelperTextProps={{
                    style: helperTextStyle, // Apply centralized style
                  }}
                  error={
                    formik.touched.class_to && Boolean(formik.errors.class_to)
                  }
                  helperText={formik.touched.class_to && formik.errors.class_to}
                  fullWidth
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
                disabled={formik.isSubmitting}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/inchargeList")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
