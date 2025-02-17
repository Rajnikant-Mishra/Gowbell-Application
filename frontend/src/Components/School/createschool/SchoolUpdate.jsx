// import React, { useRef, useState, useEffect } from "react";
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
// import { FaPhoneAlt, FaTrash, FaWhatsapp } from "react-icons/fa";
// import Swal from "sweetalert2";
// import "animate.css";
// import { RxCross2 } from "react-icons/rx";
// import styles from "./School.module.css";
// import TextInput from "../CommonComp/TextInput";
// import SelectDrop from "../CommonComp/SelectDrop";
// import Mainlayout from "../../Layouts/Mainlayout";
// import ButtonComp from "../CommonComp/ButtonComp";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom"; // Added useParams to fetch school ID
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";

// export default function SchoolForm() {
//   const { id } = useParams(); // Fetching school ID from URL
//   const [formData, setFormData] = useState({
//     board: "",
//     school_name: "",
//     school_email: "",
//     school_contact_number: "",
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
//     classes: [], // Ensure it's an empty array initially
//   });

//   // States for dropdown options
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);

//   const navigate = useNavigate();
//   const inputRef = useRef(null);

//   const boardOptions = [
//     { value: "CBSE", label: "CBSE" },
//     { value: "ICSE", label: "ICSE" },
//     // { value: "State Board", label: "State Board" },
//   ];
//   const pincodeOptions = [
//     { value: "100015", label: "100015" },
//     { value: "100025", label: "100025" },
//     { value: "100035", label: "100035" },
//   ];

//   //classes codes ----------------------------------------------------------//
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

//   const handleChange = (e, newValue) => {
//     const { name } = e.target;

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

//   // Fetch states dynamically
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

//   // Fetch school data for editing when ID is available
//   useEffect(() => {
//     if (id) {
//       const fetchSchoolData = async () => {
//         try {
//           const response = await axios.get(
//             `${API_BASE_URL}/api/get/schools/${id}`
//           );
//           setFormData(response.data); // Pre-fill form with fetched data
//         } catch (error) {
//           console.error("Error fetching school data:", error);
//         }
//       };
//       fetchSchoolData();
//     }
//   }, [id]);

//   // Fetch districts based on selected state
//   useEffect(() => {
//     if (formData.state) {
//       const fetchDistricts = async () => {
//         try {
//           const response = await axios.get(
//             `${API_BASE_URL}/api/districts/?state_id=${formData.state}`
//           );
//           setDistricts(response.data);
//         } catch (error) {
//           console.error("Error fetching districts:", error);
//         }
//       };
//       fetchDistricts();
//     } else {
//       setDistricts([]);
//     }
//   }, [formData.state]);

//   // Fetch cities based on selected district
//   useEffect(() => {
//     if (formData.district) {
//       const fetchCities = async () => {
//         try {
//           const response = await axios.get(
//             `${API_BASE_URL}/api/cities/?district_id=${formData.district}`
//           );
//           setCities(response.data);
//         } catch (error) {
//           console.error("Error fetching cities:", error);
//         }
//       };
//       fetchCities();
//     } else {
//       setCities([]);
//     }
//   }, [formData.district]);

//   // Handle form submission (update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { id, school_code, created_at, updated_at, ...payload } = {
//       ...formData,
//     };

//     try {
//       console.log("Submitting data: ", payload);

//       const response = await axios.put(
//         `${API_BASE_URL}/api/get/schools/${id}`,
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       // Display success notification
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: `school updated successfully!`,
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       }).then(() => navigate("/schoolList"));
//     } catch (error) {
//       console.error("Error during update: ", error.response?.data || error);

//       // Check for validation errors
//       if (error.response?.data?.errors) {
//         const validationErrors = error.response.data.errors;

//         // Display each validation error as a toast
//         validationErrors.forEach((message) => {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Validation Error",
//             text: message,
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//             toast: true,
//           });
//         });
//       } else {
//         // Generic error handling
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text:
//             error.response?.data?.message ||
//             "An error occurred while updating the school.",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//         });
//       }
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
//               {/* School Contact Number, State, District */}
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
//               <Grid item xs={12} sm={6} md={2}>
//                 <TextInput
//                   label="Landline Number"
//                   name="school_landline_number"
//                   value={formData.school_landline_number}
//                   onChange={handleChange}
//                   type="tel"
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="State"
//                   name="state"
//                   options={states.map((state) => ({
//                     value: String(state.name),
//                     label: state.name,
//                   }))}
//                   value={formData.state}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       state: e.target.value,
//                     }))
//                   }
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="District"
//                   name="district"
//                   options={districts.map((district) => ({
//                     value: String(district.name),
//                     label: district.name,
//                   }))}
//                   value={formData.district}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       district: e.target.value,
//                     }))
//                   }
//                   fullWidth
//                 />
//               </Grid>
//               {/* City, Pincode */}
//               <Grid item xs={12} sm={6} md={2}>
//                 <SelectDrop
//                   label="City"
//                   name="city"
//                   options={cities.map((city) => ({
//                     value: String(city.name),
//                     label: city.name,
//                   }))}
//                   value={formData.city}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, city: e.target.value }))
//                   }
//                   fullWidth
//                 />
//               </Grid>
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
//               className={`${styles.buttonContainer} gap-2 mt-3`}
//               sx={{ display: "flex", gap: 2 }}
//             >
//               <ButtonComp
//                 text="Submit"
//                 type="submit"
//                 onClick={handleSubmit}
//                 disabled={false}
//                 sx={{ flexGrow: 1 }}
//               />
//               <ButtonComp
//                 text="Cancel"
//                 type="button"
//                 sx={{ flexGrow: 1 }}
//                 onClick={() => navigate("/school-create")}
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

export default function UpdateSchoolForm() {
  const navigate = useNavigate();
  const { id } = useParams();
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
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/get/schools/${id}`,
          values,
          {
            headers: { "Content-Type": "application/json" },
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
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/schoolList");
        });
      } catch (error) {
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

  // // Fetch existing school data
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/get/schools/${id}`
        );
        const schoolData = response.data;
        formik.setValues({
          board: schoolData.board,
          school_name: schoolData.school_name,
          school_email: schoolData.school_email,
          school_contact_number: schoolData.school_contact_number,
          school_landline_number: schoolData.school_landline_number,
          state: schoolData.state,
          district: schoolData.district,
          city: schoolData.city,
          pincode: schoolData.pincode,
          principal_name: schoolData.principal_name,
          principal_contact_number: schoolData.principal_contact_number,
          principal_whatsapp: schoolData.principal_whatsapp,
          vice_principal_name: schoolData.vice_principal_name,
          vice_principal_contact_number:
            schoolData.vice_principal_contact_number,
          vice_principal_whatsapp: schoolData.vice_principal_whatsapp,
          student_strength: schoolData.student_strength,
          classes: schoolData.classes,
          status: schoolData.status,
        });
      } catch (error) {
        console.error("Error fetching school data:", error);
      }
    };
    fetchSchoolData();
  }, [id]);


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

  // // Filter districts and cities based on selected state and district
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
  // Filter districts based on selected state
  

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
              Update School Registration Form
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
                  label="Landline Number"
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
                text="Update"
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
