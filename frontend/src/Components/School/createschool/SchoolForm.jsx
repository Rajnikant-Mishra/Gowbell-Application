// import React, { useState, useEffect, useRef } from "react";
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
// import styles from "./School.module.css";
// // import ButtonComp from "../CommonComp/ButtonComp";
// import Swal from "sweetalert2";
// import TextInput from "../CommonComp/TextInput";
// import SelectDrop from "../CommonComp/SelectDrop";
// import Mainlayout from "../../Layouts/Mainlayout";
// import { RxCross2 } from "react-icons/rx";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";

// export default function SchoolForm() {
//   const [formData, setFormData] = useState({
//     board: "",
//     school_name: "",
//     school_email: "",
//     school_contact_number: "",
//     school_landline_number: "",
//     // school_code: "",
//     state: "",
//     district: "",
//     city: "",
//     pincode: "",
//     principal_name: "",

//     principal_contact_number: "",
//     principal_whatsapp: "",
//     vice_principal_name: "",

//     vice_principal_contact_number: "",
//     vice_principal_whatsapp: "",
//     student_strength: "",
//     classes: [],
//     status: "",
//   });

//   const boardOptions = [
//     { value: "CBSE", label: "CBSE" },
//     { value: "ICSE", label: "ICSE" },
//   ];
//   const pincodeOptions = [
//     { value: "100012", label: "100012" },
//     { value: "100022", label: "100022" },
//     { value: "100032", label: "100032" },
//   ];
//   const classOptions = [
//     { value: "LKG", label: "LKG" },
//     { value: "UKG", label: "UKG" },
//     { value: "Class 1", label: "Class 1" },
//     { value: "Class 2", label: "Class 2" },
//     { value: "Class 3", label: "Class 3" },
//     { value: "Class 4", label: "Class 4" },
//     { value: "Class 5", label: "Class 5" },
//     { value: "Class 6", label: "Class 6" },
//     { value: "Class 7", label: "Class 7" },
//     { value: "Class 8", label: "Class 8" },
//     { value: "Class 9", label: "Class 9" },
//     { value: "Class 10", label: "Class 10" },
//     { value: "Class 11", label: "Class 11" },
//     { value: "Class 12", label: "Class 12" },
//   ];
//   const inputRef = useRef(null);
//   const navigate = useNavigate();

//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);

//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);

//   // ✅ Fetch states dynamically
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

//   // ✅ Fetch all districts and filter dynamically based on selected state
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

//   // ✅ Fetch all cities and filter dynamically based on selected district
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

//   // ✅ Filter districts dynamically when a state is selected
//   useEffect(() => {
//     if (formData.state) {
//       const filtered = districts.filter(
//         (district) => district.state_id === formData.state
//       );
//       setFilteredDistricts(filtered);
//     } else {
//       setFilteredDistricts([]);
//     }

//     // Reset district & city when state changes
//     setFormData((prev) => ({
//       ...prev,
//       district: "",
//       city: "",
//     }));
//   }, [formData.state, districts]);

//   // ✅ Filter cities dynamically when a district is selected
//   useEffect(() => {
//     if (formData.district) {
//       const filtered = cities.filter(
//         (city) => city.district_id === formData.district
//       );
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities([]);
//     }

//     // Reset city when district changes
//     setFormData((prev) => ({
//       ...prev,
//       city: "",
//     }));
//   }, [formData.district, cities]);

//   //-------------------------end code of api-------------------------------------------//

//   const handleChange = (e, newValue) => {
//     const { name, value } = e.target;

//     // Regular expression to check for special characters (excluding alphanumeric and spaces)
//     const specialCharRegex = /[^a-zA-Z0-9\s]/;

//     // Validate school_name field
//     if (name === "school_name" && specialCharRegex.test(value)) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Invalid Input",
//         text: "School Name cannot contain special characters.",
//         showConfirmButton: false,
//         timer: 4000,
//         timerProgressBar: true,
//         toast: true,
//         customClass: {
//           popup: "small-swal",
//         },
//         background: "#fff",
//       });
//       return; // Prevent update if special characters are found
//     }

//     if (name === "classes" && newValue !== undefined) {
//       setFormData((prev) => ({
//         ...prev,
//         classes: newValue.map((item) => item.value),
//       }));
//     } else if (name.includes("schoolAddress")) {
//       const addressField = name.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         schoolAddress: {
//           ...prev.schoolAddress,
//           [addressField]: e.target.value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: e.target.value,
//       }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("Submitting formData:", JSON.stringify(formData, null, 2)); // Debug formData

//     // Show processing alert
//     const loadingSwal = Swal.fire({
//       title: "Processing...",
//       text: "Please wait while we create the school.",
//       icon: "info",
//       showConfirmButton: false,
//       willOpen: () => {
//         Swal.showLoading();
//       },
//     });

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/schools`,
//         formData,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       setTimeout(() => {
//         loadingSwal.close();
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: `school created successfully!`,
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
//       }, 1000);
//     } catch (error) {
//       loadingSwal.close();
//       console.error("Error details:", error.response?.data || error.message);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error!",
//         text: error.response?.data?.error || "An unexpected error occurred.",
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//         toast: true,
//         customClass: {
//           popup: "small-swal",
//         },
//         background: "#fff",
//       });
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[
//               { name: "School", link: "/schoolList" },
//               { name: "Create School" },
//             ]}
//           />
//         </div>
//       </div>
//       <Box className={`${styles.formContainer} container-fluid pt-5`}>
//         <div className={`${styles.formBox}`}>
//           <div>
//             <Typography className={`${styles.formTitle} mb-4`}>
//               School Registration Form
//             </Typography>
//           </div>
//           <form onSubmit={handleSubmit} className={styles.formContent}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={4}>
//                 <SelectDrop
//                   className={styles.selectInput}
//                   label="Board Name"
//                   name="board"
//                   options={boardOptions}
//                   value={formData.board}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, board: e.target.value }))
//                   }
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   className={styles.textInput}
//                   label="School Name"
//                   name="school_name"
//                   value={formData.school_name}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   className={styles.textInput}
//                   label="School Email"
//                   name="school_email"
//                   value={formData.school_email}
//                   onChange={handleChange}
//                   type="email"
//                   fullWidth
//                 />
//               </Grid>
//               {/* School Contact Number, */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <TextInput
//                   label="School Contact Number"
//                   name="school_contact_number"
//                   value={formData.school_contact_number}
//                   onChange={handleChange}
//                   type="tel"
//                   fullWidth
//                 />
//               </Grid>
//               {/* School Landline Number */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <TextInput
//                   label="School Landline Number"
//                   name="school_landline_number"
//                   value={formData.school_landline_number}
//                   onChange={handleChange}
//                   type="tel"
//                   fullWidth
//                 />
//               </Grid>

//               {/* State Dropdown */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="State"
//                   name="state"
//                   value={formData.state}
//                   options={states.map((state) => ({
//                     value: state.id, // Use ID for unique identification
//                     label: state.name, // Name for display
//                   }))}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       state: e.target.value,
//                       district: "", // Reset district and city
//                       city: "",
//                     }))
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {/* District Dropdown */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="District"
//                   name="district"
//                   options={filteredDistricts.map((district) => ({
//                     value: district.id, // Use ID for unique identification
//                     label: district.name, // Name for display
//                   }))}
//                   value={formData.district}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       district: e.target.value,
//                       city: "", // Reset city when district changes
//                     }))
//                   }
//                   fullWidth
//                   disabled={!formData.state} // Disable if no state selected
//                 />
//               </Grid>

//               {/* City Dropdown */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="City"
//                   name="city"
//                   options={filteredCities.map((city) => ({
//                     value: city.id, // Use ID for unique identification
//                     label: city.name, // Name for display
//                   }))}
//                   value={formData.city}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       city: e.target.value,
//                     }))
//                   }
//                   fullWidth
//                   disabled={!formData.district} // Disable if no district selected
//                 />
//               </Grid>

//               {/* //pincode */}
//               <Grid item xs={12} sm={6} md={2}>
//                 {/* <SelectDrop
//                   label="Pincode"
//                   name="pincode"
//                   options={pincodeOptions}
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   fullWidth
//                 /> */}
//                 <TextInput
//                   label="Pincode"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               {/* Principal Name, Principal Email-ID */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   label="Principal Name"
//                   name="principal_name"
//                   value={formData.principal_name}
//                   onChange={handleChange}
//                   type="text"
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   label="Contact Number"
//                   name="principal_contact_number"
//                   value={formData.principal_contact_number}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               {/* Whatsapp Number */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   label="Whatsapp Number"
//                   name="principal_whatsapp"
//                   value={formData.principal_whatsapp}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               {/* Vice Principal Details */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   label="Vice Principal Name"
//                   name="vice_principal_name"
//                   value={formData.vice_principal_name}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   label="Contact Number"
//                   name="vice_principal_contact_number"
//                   value={formData.vice_principal_contact_number}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   label="Whatsapp Number"
//                   name="vice_principal_whatsapp"
//                   value={formData.vice_principal_whatsapp}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               {/* Student Strength */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   label="Student Strength"
//                   name="student_strength"
//                   value={formData.student_strength}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               {/* Select Your Classes */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <Autocomplete
//                   multiple
//                   id="classes"
//                   options={classOptions}
//                   value={formData.classes.map((classItem) => ({
//                     value: classItem,
//                     label: classItem,
//                   }))}
//                   size="small"
//                   onChange={(e, newValue) => {
//                     setFormData((prev) => ({
//                       ...prev,
//                       classes: newValue.map((item) => item.value),
//                     }));
//                   }}
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option, { selected }) => (
//                     <li
//                       {...props}
//                       style={{
//                         fontSize: "12px",
//                         padding: "5px 10px",
//                         margin: "0",
//                         lineHeight: "1.5",
//                         fontFamily: "Poppins",
//                       }}
//                     >
//                       <Checkbox
//                         checked={formData.classes.includes(option.value)}
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
//                             const newClasses = formData.classes.filter(
//                               (item) => item !== option.value
//                             );
//                             setFormData((prev) => ({
//                               ...prev,
//                               classes: newClasses,
//                             }));
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
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl fullWidth size="small" variant="outlined">
//                   <InputLabel>Status</InputLabel>
//                   <Select
//                     label="status"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     sx={{ fontSize: "14px" }} // Use sx for consistent styling
//                   >
//                     <MenuItem value="active">Active</MenuItem>
//                     <MenuItem value="inactive">Inactive</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//             {/* Submit and Cancel Buttons */}
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
//                 onClick={() => navigate("/schoolList")}
//               />
//             </Box>
//           </form>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
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
import TextInput from "../CommonComp/TextInput";
// import SelectDrop from "../CommonComp/SelectDrop";
import Mainlayout from "../../Layouts/Mainlayout";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import SelectDrop from "./SelectDrop";

// Validation Schema using Yup
const validationSchema = Yup.object({
  board: Yup.string().required("Board is required"),
  school_name: Yup.string()
    .required("School Name is required")
    .matches(/^[a-zA-Z0-9\s]*$/, "Special characters are not allowed"),
  school_email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  school_contact_number: Yup.string()
    .required("Contact is required")
    .matches(/^[0-9]{10}$/, "Invalid contact number"),
  // school_landline_number: Yup.string()
  //   .required("Landline is required")
  //   .matches(/^[0-9]{10}$/, "Invalid landline number"),
  state: Yup.string().required("State is required"),
  district: Yup.string().required("District is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^[0-9]{6}$/, "Invalid pincode"),
  principal_name: Yup.string().required("Principal Name is required"),
  principal_contact_number: Yup.string()
    .required("Principal Contact Number is required")
    .matches(/^[0-9]{10}$/, "Invalid contact number"),
  principal_whatsapp: Yup.string()
    .required("Whatsapp Number is required")
    .matches(/^[0-9]{10}$/, "Invalid whatsapp number"),
  vice_principal_name: Yup.string().required("Vice Principal Name is required"),
  vice_principal_contact_number: Yup.string()
    .required("Vice Principal Contact Number is required")
    .matches(/^[0-9]{10}$/, "Invalid contact number"),
  vice_principal_whatsapp: Yup.string()
    .required("Vice Principal Whatsapp Number is required")
    .matches(/^[0-9]{10}$/, "Invalid whatsapp number"),
  student_strength: Yup.number()
    .required("Student Strength is required")
    .positive("Student Strength must be positive"),
  classes: Yup.array().min(1, "At least one class is required"),
  status: Yup.string().required("Status is required"),
});

export default function SchoolForm() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      board: "",
      school_name: "",
      school_email: "",
      school_contact_number: "",
      school_landline_number: "",
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
      status: "",
    },
    validationSchema: validationSchema,
    // onSubmit: async (values) => {
    //   try {
    //     const response = await axios.post(
    //       `${API_BASE_URL}/api/get/schools`,
    //       values,
    //       {
    //         headers: { "Content-Type": "application/json" },
    //       }
    //     );

    //     Swal.fire({
    //       position: "top-end",
    //       icon: "success",
    //       title: "Success!",
    //       text: "School created successfully!",
    //       showConfirmButton: false,
    //       timer: 1000,
    //       timerProgressBar: true,
    //       toast: true,
    //       background: "#fff",
    //       customClass: {
    //         popup: "small-swal",
    //       },
    //     }).then(() => {
    //       navigate("/schoolList");
    //     });
    //   } catch (error) {
    //     console.error("Error details:", error.response?.data || error.message);
    //     Swal.fire({
    //       position: "top-end",
    //       icon: "error",
    //       title: "Error!",
    //       text: error.response?.data?.error || "An unexpected error occurred.",
    //       showConfirmButton: false,
    //       timer: 2000,
    //       timerProgressBar: true,
    //       toast: true,
    //       customClass: {
    //         popup: "small-swal",
    //       },
    //       background: "#fff",
    //     });
    //   }
    // },
    onSubmit: async (values) => {
      try {
        // Show processing alert
        const loadingSwal = Swal.fire({
          title: "Processing...",
          text: "Please wait while we create the school.",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
    
        const response = await axios.post(
          `${API_BASE_URL}/api/get/schools`,
          values,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
    
        // Close the loading alert
        Swal.close();
    
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: "School created successfully!",
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
      } catch (error) {
        // Close the loading alert if an error occurs
        Swal.close();
        
        console.error("Error details:", error.response?.data || error.message);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "An unexpected error occurred.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            popup: "small-swal",
          },
          background: "#fff",
        });
      }
    },
    
  });

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
        const response = await axios.get(`${API_BASE_URL}/api/cities/`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Filter districts and cities based on selected state and district
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
              { name: "School", link: "/schoolList" },
              { name: "Create School" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={styles.formBox}>
          <div>
            <Typography className={`${styles.formTitle} mb-4`}>
              School Registration Form
            </Typography>
          </div>
          <form onSubmit={formik.handleSubmit} className={styles.formContent}>
            <Grid container spacing={2}>
              {/* Board Name */}
              {/* <Grid item xs={12} sm={6} md={4}>
                <SelectDrop
                  label="Board Name"
                  name="board"
                  options={[
                    { value: "CBSE", label: "CBSE" },
                    { value: "ICSE", label: "ICSE" },
                  ]}
                  value={formik.values.board}
                  onChange={formik.handleChange}
                  error={formik.touched.board && Boolean(formik.errors.board)}
                  helperText={formik.touched.board && formik.errors.board}
                  fullWidth
                />
              </Grid> */}
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
                  value={formik.values.school_contact_number}
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
                  label="School Landline Number"
                  name="school_landline_number"
                  value={formik.values.school_landline_number}
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
                  // error={
                  //   formik.touched.school_landline_number &&
                  //   Boolean(formik.errors.school_landline_number)
                  // }
                  // helperText={
                  //   formik.touched.school_landline_number &&
                  //   formik.errors.school_landline_number
                  // }
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

              {/* Student Strength */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Student Strength"
                  name="student_strength"
                  value={formik.values.student_strength}
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
                    formik.touched.student_strength &&
                    Boolean(formik.errors.student_strength)
                  }
                  helperText={
                    formik.touched.student_strength &&
                    formik.errors.student_strength
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
                    { value: "LKG", label: "LKG" },
                    { value: "UKG", label: "UKG" },
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
                    { value: "Class 11", label: "Class 11" },
                    { value: "Class 12", label: "Class 12" },
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
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.status && Boolean(formik.errors.status)
                    }
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
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
