// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Grid,
//   Autocomplete,
//   Checkbox,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import styles from "./School.module.css";
// import Swal from "sweetalert2";
// import Mainlayout from "../../Layouts/Mainlayout";
// import { RxCross2 } from "react-icons/rx";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import SelectDrop from "./SelectDrop";

// // Validation Schema using Yup
// const validationSchema = Yup.object({
//   board: Yup.string().required("Board is required"),
//   school_name: Yup.string()
//     .required("School Name is required")
//     .matches(/^[a-zA-Z0-9\s]*$/, "Special characters are not allowed"),
//   school_email: Yup.string()
//     .email("Invalid email")
//     .required("Email is required"),
//   school_contact_number: Yup.string()
//     .required("Contact is required")
//     .matches(/^[0-9]{10}$/, "Invalid contact number"),
//   state: Yup.string().required("State is required"),
//   district: Yup.string().required("District is required"),
//   city: Yup.string().required("City is required"),
//   pincode: Yup.string()
//     .required("Pincode is required")
//     .matches(/^[0-9]{6}$/, "Invalid pincode"),
//   principal_name: Yup.string().required("Principal Name is required"),
//   principal_contact_number: Yup.string()
//     .required("Principal Contact Number is required")
//     .matches(/^[0-9]{10}$/, "Invalid contact number"),
//   principal_whatsapp: Yup.string()
//     .required("Whatsapp Number is required")
//     .matches(/^[0-9]{10}$/, "Invalid whatsapp number"),
//   vice_principal_name: Yup.string().required("Vice Principal Name is required"),
//   vice_principal_contact_number: Yup.string()
//     .required("Vice Principal Contact Number is required")
//     .matches(/^[0-9]{10}$/, "Invalid contact number"),
//   vice_principal_whatsapp: Yup.string()
//     .required("Vice Principal Whatsapp Number is required")
//     .matches(/^[0-9]{10}$/, "Invalid whatsapp number"),
//   student_strength: Yup.number()
//     .required("Student Strength is required")
//     .positive("Student Strength must be positive"),
//   classes: Yup.array().min(1, "At least one class is required"),
//   status: Yup.string().required("Status is required"),
// });

// export default function UpdateSchoolForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);

//   // Formik initialization
//   const formik = useFormik({
//     initialValues: {
//       board: "",
//       school_name: "",
//       school_email: "",
//       school_contact_number: "",
//       school_landline_number: "",
//       state: "",
//       district: "",
//       city: "",
//       pincode: "",
//       principal_name: "",
//       principal_contact_number: "",
//       principal_whatsapp: "",
//       vice_principal_name: "",
//       vice_principal_contact_number: "",
//       vice_principal_whatsapp: "",
//       student_strength: "",
//       classes: [],
//       status: "Active",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const response = await axios.put(
//           `${API_BASE_URL}/api/get/schools/${id}`,
//           values,
//           {
//             headers: { "Content-Type": "application/json" },
//           }
//         );

//         Swal.close();

//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: "School updated successfully!",
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         }).then(() => {
//           navigate("/schoolList");
//         });
//       } catch (error) {
//         Swal.close();
//         console.error("Error details:", error.response?.data || error.message);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: error.response?.data?.error || "An unexpected error occurred.",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//           customClass: {
//             popup: "small-swal",
//           },
//           background: "#fff",
//         });
//       }
//     },
//   });

//   // Fetch existing school data
//   useEffect(() => {
//     const fetchSchoolData = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/api/get/schools/${id}`
//         );
//         const schoolData = response.data;
//         console.log("Fetched school data:", schoolData); // Debugging line

//         formik.setValues({
//           board: schoolData.board || "",
//           school_name: schoolData.school_name || "",
//           school_email: schoolData.school_email || "",
//           school_contact_number: schoolData.school_contact_number || "",
//           school_landline_number: schoolData.school_landline_number || "",
//           state: schoolData.state || "",
//           district: schoolData.district || "",
//           city: schoolData.city || "",
//           pincode: schoolData.pincode || "",
//           principal_name: schoolData.principal_name || "",
//           principal_contact_number: schoolData.principal_contact_number || "",
//           principal_whatsapp: schoolData.principal_whatsapp || "",
//           vice_principal_name: schoolData.vice_principal_name || "",
//           vice_principal_contact_number:
//             schoolData.vice_principal_contact_number || "",
//           vice_principal_whatsapp: schoolData.vice_principal_whatsapp || "",
//           student_strength: schoolData.student_strength || "",
//           classes: schoolData.classes || [],
//           status: schoolData.status || "Active",
//         });

//         // Set the filtered districts and cities based on the fetched state and district
//         const selectedState = schoolData.state;
//         const selectedDistrict = schoolData.district;

//         if (selectedState) {
//           const filteredDistricts = districts.filter(
//             (district) => district.state_id === selectedState
//           );
//           setFilteredDistricts(filteredDistricts);
//         }

//         if (selectedDistrict) {
//           const filteredCities = cities.filter(
//             (city) => city.district_id === selectedDistrict
//           );
//           setFilteredCities(filteredCities);
//         }
//       } catch (error) {
//         console.error("Error fetching school data:", error);
//       }
//     };
//     fetchSchoolData();
//   }, [id, districts, cities]);

//   // Fetch states, districts, and cities
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/states/`);
//         setStates(response.data);
//       } catch (error) {
//         console.error("Error fetching states:", error);
//       }
//     };
//     fetchStates();
//   }, []);

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/districts/`);
//         setDistricts(response.data);
//       } catch (error) {
//         console.error("Error fetching districts:", error);
//       }
//     };
//     fetchDistricts();
//   }, []);

//   useEffect(() => {
//     const fetchCities = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/cities/`);
//         setCities(response.data);
//       } catch (error) {
//         console.error("Error fetching cities:", error);
//       }
//     };
//     fetchCities();
//   }, []);

//   // Filter districts and cities based on selected state and district
//   useEffect(() => {
//     if (formik.values.state) {
//       const filtered = districts.filter(
//         (district) => district.state_id === formik.values.state
//       );
//       setFilteredDistricts(filtered);
//     } else {
//       setFilteredDistricts([]);
//     }
//     formik.setFieldValue("district", "");
//     formik.setFieldValue("city", "");
//   }, [formik.values.state, districts]);

//   useEffect(() => {
//     if (formik.values.district) {
//       const filtered = cities.filter(
//         (city) => city.district_id === formik.values.district
//       );
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities([]);
//     }
//     formik.setFieldValue("city", "");
//   }, [formik.values.district, cities]);

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[
//               { name: "School", link: "/schoolList" },
//               { name: "Update School" },
//             ]}
//           />
//         </div>
//       </div>
//       <Box className={`${styles.formContainer} container-fluid pt-5`}>
//         <div className={styles.formBox}>
//           <div>
//             <Typography className={`${styles.formTitle} mb-4`}>
//               Update School Registration Form
//             </Typography>
//           </div>
//           <form onSubmit={formik.handleSubmit} className={styles.formContent}>
//             <Grid container spacing={2}>
//               {/* Board Name */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <SelectDrop
//                   label="Board Name"
//                   name="board"
//                   options={[
//                     { value: "CBSE", label: "CBSE" },
//                     { value: "ICSE", label: "ICSE" },
//                   ]}
//                   value={formik.values.board}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.board && Boolean(formik.errors.board)}
//                   helperText={formik.touched.board && formik.errors.board}
//                   fullWidth
//                 />
//               </Grid>

//               {/* School Name */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="School Name"
//                   name="school_name"
//                   value={formik.values.school_name}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.school_name &&
//                     Boolean(formik.errors.school_name)
//                   }
//                   helperText={
//                     formik.touched.school_name && formik.errors.school_name
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* School Email */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="School Email"
//                   name="school_email"
//                   value={formik.values.school_email}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.school_email &&
//                     Boolean(formik.errors.school_email)
//                   }
//                   helperText={
//                     formik.touched.school_email && formik.errors.school_email
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* School Contact Number */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <TextField
//                   label="School Contact Number"
//                   name="school_contact_number"
//                   value={formik.values.school_contact_number}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.school_contact_number &&
//                     Boolean(formik.errors.school_contact_number)
//                   }
//                   helperText={
//                     formik.touched.school_contact_number &&
//                     formik.errors.school_contact_number
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* School Landline Number */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <TextField
//                   label="Landline Number"
//                   name="school_landline_number"
//                   value={formik.values.school_landline_number}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   fullWidth
//                 />
//               </Grid>

//               {/* State Dropdown */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="State"
//                   name="state"
//                   options={states.map((state) => ({
//                     value: state.id,
//                     label: state.name,
//                   }))}
//                   value={formik.values.state}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={formik.touched.state && Boolean(formik.errors.state)}
//                   helperText={formik.touched.state && formik.errors.state}
//                   fullWidth
//                 />
//               </Grid>

//               {/* District Dropdown */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="District"
//                   name="district"
//                   options={filteredDistricts.map((district) => ({
//                     value: district.id,
//                     label: district.name,
//                   }))}
//                   value={formik.values.district}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.district && Boolean(formik.errors.district)
//                   }
//                   helperText={formik.touched.district && formik.errors.district}
//                   fullWidth
//                   disabled={!formik.values.state}
//                 />
//               </Grid>

//               {/* City Dropdown */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="City"
//                   name="city"
//                   options={filteredCities.map((city) => ({
//                     value: city.id,
//                     label: city.name,
//                   }))}
//                   value={formik.values.city}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={formik.touched.city && Boolean(formik.errors.city)}
//                   helperText={formik.touched.city && formik.errors.city}
//                   fullWidth
//                   disabled={!formik.values.district}
//                 />
//               </Grid>

//               {/* Pincode */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <TextField
//                   label="Pincode"
//                   name="pincode"
//                   value={formik.values.pincode}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.pincode && Boolean(formik.errors.pincode)
//                   }
//                   helperText={formik.touched.pincode && formik.errors.pincode}
//                   fullWidth
//                 />
//               </Grid>

//               {/* Principal Name */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Principal Name"
//                   name="principal_name"
//                   value={formik.values.principal_name}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.principal_name &&
//                     Boolean(formik.errors.principal_name)
//                   }
//                   helperText={
//                     formik.touched.principal_name &&
//                     formik.errors.principal_name
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* Principal Contact Number */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Contact Number"
//                   name="principal_contact_number"
//                   value={formik.values.principal_contact_number}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.principal_contact_number &&
//                     Boolean(formik.errors.principal_contact_number)
//                   }
//                   helperText={
//                     formik.touched.principal_contact_number &&
//                     formik.errors.principal_contact_number
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* Principal Whatsapp Number */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Whatsapp Number"
//                   name="principal_whatsapp"
//                   value={formik.values.principal_whatsapp}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.principal_whatsapp &&
//                     Boolean(formik.errors.principal_whatsapp)
//                   }
//                   helperText={
//                     formik.touched.principal_whatsapp &&
//                     formik.errors.principal_whatsapp
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* Vice Principal Name */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Vice Principal Name"
//                   name="vice_principal_name"
//                   value={formik.values.vice_principal_name}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.vice_principal_name &&
//                     Boolean(formik.errors.vice_principal_name)
//                   }
//                   helperText={
//                     formik.touched.vice_principal_name &&
//                     formik.errors.vice_principal_name
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* Vice Principal Contact Number */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Contact Number"
//                   name="vice_principal_contact_number"
//                   value={formik.values.vice_principal_contact_number}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.vice_principal_contact_number &&
//                     Boolean(formik.errors.vice_principal_contact_number)
//                   }
//                   helperText={
//                     formik.touched.vice_principal_contact_number &&
//                     formik.errors.vice_principal_contact_number
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* Vice Principal Whatsapp Number */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Whatsapp Number"
//                   name="vice_principal_whatsapp"
//                   value={formik.values.vice_principal_whatsapp}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.vice_principal_whatsapp &&
//                     Boolean(formik.errors.vice_principal_whatsapp)
//                   }
//                   helperText={
//                     formik.touched.vice_principal_whatsapp &&
//                     formik.errors.vice_principal_whatsapp
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* Student Strength */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Student Strength"
//                   name="student_strength"
//                   value={formik.values.student_strength}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={
//                     formik.touched.student_strength &&
//                     Boolean(formik.errors.student_strength)
//                   }
//                   helperText={
//                     formik.touched.student_strength &&
//                     formik.errors.student_strength
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* Select Classes */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <Autocomplete
//                   multiple
//                   id="classes"
//                   options={[
//                     { value: "LKG", label: "LKG" },
//                     { value: "UKG", label: "UKG" },
//                     { value: "Class 1", label: "Class 1" },
//                     { value: "Class 2", label: "Class 2" },
//                     { value: "Class 3", label: "Class 3" },
//                     { value: "Class 4", label: "Class 4" },
//                     { value: "Class 5", label: "Class 5" },
//                     { value: "Class 6", label: "Class 6" },
//                     { value: "Class 7", label: "Class 7" },
//                     { value: "Class 8", label: "Class 8" },
//                     { value: "Class 9", label: "Class 9" },
//                     { value: "Class 10", label: "Class 10" },
//                     { value: "Class 11", label: "Class 11" },
//                     { value: "Class 12", label: "Class 12" },
//                   ]}
//                   value={
//                     Array.isArray(formik.values.classes) // Check if classes is an array
//                       ? formik.values.classes.map((classItem) => ({
//                           value: classItem,
//                           label: classItem,
//                         }))
//                       : [] // Fallback to empty array
//                   }
//                   onChange={(e, newValue) => {
//                     formik.setFieldValue(
//                       "classes",
//                       newValue.map((item) => item.value)
//                     );
//                   }}
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={formik.values.classes.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newClasses = formik.values.classes.filter(
//                               (item) => item !== option.value
//                             );
//                             formik.setFieldValue("classes", newClasses);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Classes"
//                       placeholder="Choose classes"
//                       variant="outlined"
//                       size="small"
//                       error={
//                         formik.touched.classes && Boolean(formik.errors.classes)
//                       }
//                       helperText={
//                         formik.touched.classes && formik.errors.classes
//                       }
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>

//               {/* Status Dropdown */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <SelectDrop
//                   label="Status"
//                   name="status"
//                   options={[
//                     { value: "Active", label: "Active" },
//                     { value: "Inactive", label: "Inactive" },
//                   ]}
//                   value={formik.values.status}
//                   onChange={formik.handleChange}
//                   size="small"
//                   InputProps={{
//                     className: styles.inputField,
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.8rem",
//                     },
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontFamily: "Nunito, sans-serif",
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                     },
//                   }}
//                   error={formik.touched.status && Boolean(formik.errors.status)}
//                   helperText={formik.touched.status && formik.errors.status}
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>

//             <Box
//               className={`${styles.buttonContainer} gap-2 mt-4`}
//               sx={{ display: "flex", gap: 2 }}
//             >
//               <ButtonComp
//                 text="Update"
//                 type="submit"
//                 disabled={false}
//                 sx={{ flexGrow: 1 }}
//               />
//               <ButtonComp
//                 text="Cancel"
//                 type="button"
//                 sx={{ flexGrow: 1 }}
//                 onClick={() => navigate("/schoolList")}
//               />
//             </Box>
//           </form>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Autocomplete,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

// Validation Schema using Yup (same as create form)
const validationSchema = Yup.object({
  board: Yup.string().required("Board is required"),
  school_name: Yup.string().required("School name is required"),
  school_email: Yup.string()
    .email("Invalid email format")
    .required("School email is required"),
  school_contact_number: Yup.string()
    .required("Contact number is required")
    .matches(/^\d{10}$/, "Invalid contact number"),
  school_landline_number: Yup.string().nullable(),
  school_address: Yup.string()
    .required("School address is required")
    .min(5, "Address must be at least 5 characters"),
  state: Yup.string().required("State is required"),
  district: Yup.string().required("District is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^[0-9]{6}$/, "Invalid pincode"),
  principal_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .required("Principal Name is required"),
  principal_contact_number: Yup.string()
    .required("Principal Contact Number is required")
    .matches(/^\d{10}$/, "Invalid contact number"),
  principal_whatsapp: Yup.string()
    .required("Principal WhatsApp Number is required")
    .matches(/^\d{10}$/, "Invalid WhatsApp number"),
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
  junior_student_strength: Yup.number()
    .required("Junior Student Strength is required")
    .positive("Must be a positive number")
    .integer("Must be a whole number"),
  senior_student_strength: Yup.number()
    .required("Senior Student Strength is required")
    .positive("Must be a positive number")
    .integer("Must be a whole number"),
  classes: Yup.array().min(1, "At least one class is required"),
  status: Yup.string().required("Status is required"),
});

export default function SchoolUpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the school ID from URL params
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  // Fetch school data based on ID
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

        const response = await axios.get(
          `${API_BASE_URL}/api/get/schools/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const schoolData = response.data;

        // Transform classes array if it's stored as a string in the database
        const classesArray = Array.isArray(schoolData.classes)
          ? schoolData.classes
          : schoolData.classes
          ? JSON.parse(schoolData.classes)
          : [];

        setInitialValues({
          ...schoolData,
          classes: classesArray,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching school data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch school data. Please try again.",
        });
        navigate("/schoolList");
      }
    };

    fetchSchoolData();
  }, [id, navigate]);

  // Fetch states, districts, and cities
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

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/districts/`);
        setDistricts(response.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cities/all/c1`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Filter districts and cities based on selected state and district
  useEffect(() => {
    if (initialValues?.state) {
      const filtered = districts.filter(
        (district) => district.state_id === initialValues.state
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  }, [initialValues?.state, districts]);

  useEffect(() => {
    if (initialValues?.district) {
      const filtered = cities.filter(
        (city) => city.district_id === initialValues.district
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [initialValues?.district, cities]);

  // Formik initialization (will be called after initialValues are set)
  const formik = useFormik({
    enableReinitialize: true, // Important for updating form when initialValues change
    initialValues: initialValues || {
      board: "",
      school_name: "",
      school_email: "",
      school_contact_number: "",
      school_landline_number: "",
      school_address: "",
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

        const response = await axios.put(
          `${API_BASE_URL}/api/get/schools/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
        console.error("Error updating school:", error);

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
              {/* Board Name */}
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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

              {/* School Contact Number */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="School Contact Number"
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

              {/* State Dropdown */}
              <Grid item xs={12} sm={6} md={2}>
                <SelectDrop
                  label="State"
                  name="state"
                  options={states.map((state) => ({
                    value: state.id,
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
              <Grid item xs={12} sm={6} md={2}>
                <SelectDrop
                  label="District"
                  name="district"
                  options={filteredDistricts.map((district) => ({
                    value: district.id,
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
              <Grid item xs={12} sm={6} md={2}>
                <SelectDrop
                  label="City"
                  name="city"
                  options={filteredCities.map((city) => ({
                    value: city.id,
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

              {/* Pincode */}
              <Grid item xs={12} sm={6} md={2}>
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
                  label="Contact Number"
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
                  label="Whatsapp Number"
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
                  label="Contact Number"
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
                  label="Whatsapp Number"
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
                  label="Contact Number"
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
                  label="Whatsapp Number"
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
                  label="Contact Number"
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
                  label="Whatsapp Number"
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
                  label="Contact Number"
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
                  label="Whatsapp Number"
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
                  options={[
                    { value: "NURSERY-UKG", label: "NURSERY-UKG" },
                    { value: "NURSERY-CLASS-12 ", label: "NURSERY-CLASS-12 " },
                    { value: " NURSERY-CLASS-8 ", label: " NURSERY-CLASS-8 " },
                    { value: "LKG-CLASS-10  ", label: "LKG-CLASS-10  " },
                    { value: "LKG-CLASS-12", label: "LKG-CLASS-12" },
                    { value: "LKG-CLASS-8", label: "LKG-CLASS-8" },
                  ]}
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

              {/* testarea */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="School Address "
                  name="school_address"
                  value={formik.values.school_address}
                  onChange={formik.handleChange}
                  size="small"
                  multiline // Enables textarea mode
                  minRows={3} // Adjust the number of visible rows
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
