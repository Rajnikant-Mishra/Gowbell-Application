// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Grid,
//   Autocomplete,
//   Checkbox,
// } from "@mui/material";
// import styles from "./formco.module.css";
// import Swal from "sweetalert2";
// import TextInput from "../../School/CommonComp/TextInput";
// import SelectDrop from "../../School/CommonComp/SelectDrop";
// import Mainlayout from "../../Layouts/Mainlayout";
// import { RxCross2 } from "react-icons/rx";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";

// export default function FormCo() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     consignment_id: "",
//     date: "",
//     created_by: "",
//     school_name: "",
//     via: "",
//     vehicle_number: "",
//     driver_name: "",
//     driver_contact_number: "",
//     tracking_number: "",
//     courier_company: "",
//     delivery_date: "",
//     postal_tracking_number: "",
//     postal_name: "",
//     postal_delivery_date: "",
//     goodies: [],
//     remarks: "",
//   });

//   const classOptions = [
//     { value: "Diary", label: "Diary" },
//     { value: "Pen", label: "Pen" },
//     { value: "Tiffin Box", label: "Tiffin Box" },
//     { value: "Flask", label: "Flask" },
//     { value: "Water Bottle", label: "Water Bottle" },
//     { value: "Pencil Box", label: "Pencil Box" },
//   ];
//   const via = [
//     { value: "", label: "--Options--" },
//     { value: "Vehicle", label: "Vehicle" },
//     { value: "Postal", label: "Postal" },
//     { value: "Courier", label: "Courier" },
//   ];
//  const [profileData, setProfileData] = useState({});
//   useEffect(() => {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const userData = JSON.parse(storedUser);
//         setProfileData(userData);
//         setFormData((prev) => ({ ...prev, created_by: userData.username || "" }));
//       } else {
//         navigate("/login");
//       }
//     }, [navigate]);

//   // Auto-generate Consignment ID
//   useEffect(() => {
//     const generateConsignmentId = () => {
//       const prefix = "GB-CNS-";
//       let lastNumber = parseInt(localStorage.getItem("lastConsignmentNumber"), 10) || 0;

//       // Increment the number
//       lastNumber += 1;

//       // Store the updated number in localStorage
//       localStorage.setItem("lastConsignmentNumber", lastNumber);

//       // Format the ID
//       return `${prefix}${String(lastNumber).padStart(4, "0")}`;
//     };

//     const generatedId = generateConsignmentId();
//     setFormData((prevState) => ({
//       ...prevState,
//       consignment_id: generatedId,
//     }));
//   }, []); // Run only on initial render

//   const handleChange = (e, newValue) => {
//     const { name, value } = e.target;

//     const specialCharRegex = /[^a-zA-Z0-9\s]/;

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
//       return;
//     }

//     if (name === "goodies" && newValue !== undefined) {
//       setFormData((prev) => ({
//         ...prev,
//         goodies: newValue.map((item) => item.value),
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: e.target.value,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let errorMessages = [];

//     // Validation: Check if each required field is filled
//     if (!formData.consignment_id) {
//       errorMessages.push("Consignment ID is required.");
//     }
//     if (!formData.date) {
//       errorMessages.push("Date is required.");
//     }
//     if (!formData.via) {
//       errorMessages.push("Via is required.");
//     }
//     if (!formData.school_name) {
//       errorMessages.push("School Name is required.");
//     }
//     if (!formData.remarks) {
//       errorMessages.push("Remarks are required.");
//     }
//     if (!formData.goodies) {
//       errorMessages.push("Goodies are required.");
//     }

//     // If there are validation errors, show them one by one in sequence
//     if (errorMessages.length > 0) {
//       for (let i = 0; i < errorMessages.length; i++) {
//         await Swal.fire({
//           position: "top-end",
//           icon: "warning",
//           title: "Validation Error!",
//           text: errorMessages[i],
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         });
//       }
//       return; // Stop form submission if validation fails
//     }

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/c1/consignments`,
//         formData,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: `Consignment created successfully!`,
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       }).then(() => {
//         navigate("/consignment-list");
//       });
//     } catch (error) {
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
//               { name: "Consignment", link: "/consignment-list" },
//               { name: "CreateConsignment" },
//             ]}
//           />
//         </div>
//       </div>
//       <Box className={`${styles.formContainer} container-fluid pt-5`}>
//         <div className={`${styles.formBox}`}>
//           <div>
//             <Typography className={`${styles.formTitle} mb-4`}>
//               Create Consignment
//             </Typography>
//           </div>
//           <form onSubmit={handleSubmit} className={styles.formContent}>
//             <Grid container spacing={2}>

//               <Grid item xs={12} sm={6} md={2}>
//                 <TextInput
//                   label="Consignment Id"
//                   name="consignment_id"
//                   value={formData.consignment_id}
//                   onChange={handleChange}
//                   fullWidth
//                   disabled
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={2}>
//                 <TextInput
//                   // label="Date"
//                   name="date"
//                   type="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextInput
//                   className={styles.textInput}
//                   label="Created By"
//                   name="created_by"
//                   value={formData.created_by}
//                   onChange={handleChange}
//                   type="text"
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
//                 <SelectDrop
//                   label="Via"
//                   name="via"
//                   value={formData.via}
//                   options={via}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       via: e.target.value,
//                     }))
//                   }
//                   fullWidth
//                 />
//               </Grid>

//               {formData.via === "Vehicle" ? (
//                 <>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       label="Vehicle Number"
//                       name="vehicle_number"
//                       value={formData.vehicle_number}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       label="Driver Name"
//                       name="driver_name"
//                       value={formData.driver_name}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       label="Driver Contact Number"
//                       name="driver_contact_number"
//                       value={formData.driver_contact_number}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                 </>
//               ) : formData.via === "Courier" ? (
//                 <>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       label="Tracking Number"
//                       name="tracking_number"
//                       value={formData.tracking_number}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       label="Courier Company"
//                       name="courier_company"
//                       value={formData.courier_company}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       type="date"
//                       name="delivery_date"
//                       value={formData.delivery_date}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                 </>
//               ) : formData.via === "Postal" ? (
//                 <>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       label="Postal Tracking Number"
//                       name="postal_tracking_number"
//                       value={formData.postal_tracking_number}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       label="Postal Name"
//                       name="postal_name"
//                       value={formData.postal_name}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextInput
//                       type="date"
//                       name="postal_delivery_date"
//                       value={formData.postal_delivery_date}
//                       onChange={handleChange}
//                       fullWidth
//                     />
//                   </Grid>
//                 </>
//               ) : null}

//               <Grid item xs={12} sm={6} md={4}>
//                 <Autocomplete
//                   multiple
//                   id="goodies"
//                   options={classOptions}
//                   value={formData.goodies.map((Item) => ({
//                     value: Item,
//                     label: Item,
//                   }))}
//                   size="small"
//                   onChange={(e, newValue) => {
//                     setFormData((prev) => ({
//                       ...prev,
//                       goodies: newValue.map((item) => item.value),
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
//                         checked={formData.goodies.includes(option.value)}
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
//                             const newgoodies = formData.goodies.filter(
//                               (item) => item !== option.value
//                             );
//                             setFormData((prev) => ({
//                               ...prev,
//                               goodies: newgoodies,
//                             }));
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Goodies"
//                       placeholder="goodies"
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
//                 <TextField
//                   label="Remarks"
//                   name="remarks"
//                   value={formData.remarks}
//                   onChange={handleChange}
//                   fullWidth
//                   multiline
//                   size="small"
//                   rows={1}
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
//                 onClick={() => navigate("/consignment-list")}
//               />
//             </Box>
//           </form>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// }
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Autocomplete,
  Checkbox,
  MenuItem,
  Select,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";
import styles from "./formco.module.css";
import Swal from "sweetalert2";
import TextInput from "../../School/CommonComp/TextInput";
// import SelectDrop from "../../School/CommonComp/SelectDrop";
import Mainlayout from "../../Layouts/Mainlayout";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import SelectDrop from "../../School/createschool/SelectDrop";

export default function FormCo() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    date: Yup.date().required("Date is required"),
    school_name: Yup.string()
      .required("School Name is required")
      .matches(
        /^[a-zA-Z0-9\s]*$/,
        "School Name cannot contain special characters"
      ),
    remarks: Yup.string().required("Remarks are required"),
    via: Yup.string().required("Via is required"),
    goodies: Yup.array()
      .min(1, "At least one goodie is required")
      .required("Goodies are required"),
  });

  const formik = useFormik({
    initialValues: {
      consignment_id: "",
      date: "",
      created_by: "",
      school_name: "",
      via: "",
      vehicle_number: "",
      driver_name: "",
      driver_contact_number: "",
      tracking_number: "",
      courier_company: "",
      delivery_date: "",
      postal_tracking_number: "",
      postal_name: "",
      postal_delivery_date: "",
      goodies: [],
      remarks: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/c1/consignments`,
          values,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Consignment created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/consignment-list");
        });
      } catch (error) {
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

  const classOptions = [
    { value: "Diary", label: "Diary" },
    { value: "Pen", label: "Pen" },
    { value: "Tiffin Box", label: "Tiffin Box" },
    { value: "Flask", label: "Flask" },
    { value: "Water Bottle", label: "Water Bottle" },
    { value: "Pencil Box", label: "Pencil Box" },
  ];

  const via = [
    { value: "", label: "--Options--" },
    { value: "Vehicle", label: "Vehicle" },
    { value: "Postal", label: "Postal" },
    { value: "Courier", label: "Courier" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      formik.setFieldValue("created_by", userData.username || "");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const generateConsignmentId = () => {
      const prefix = "GB-CNS-";
      let lastNumber =
        parseInt(localStorage.getItem("lastConsignmentNumber"), 10) || 0;
      lastNumber += 1;
      localStorage.setItem("lastConsignmentNumber", lastNumber);
      return `${prefix}${String(lastNumber).padStart(4, "0")}`;
    };

    const generatedId = generateConsignmentId();
    formik.setFieldValue("consignment_id", generatedId);
  }, []);

  //scholl api fetches
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/get/schools`) // Adjust API endpoint
      .then((response) => {
        setSchools(response.data); // Assuming response.data is an array of school objects
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
      });
  }, []);

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Consignment", link: "/consignment-list" },
              { name: "CreateConsignment" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <div>
            <Typography className={`${styles.formTitle} mb-4`}>
              Create Consignment
            </Typography>
          </div>
          <form onSubmit={formik.handleSubmit} className={styles.formContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <TextInput
                  label="Consignment Id"
                  name="consignment_id"
                  value={formik.values.consignment_id}
                  onChange={formik.handleChange}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  // label="Date"
                  name="date"
                  type="date"
                  value={formik.values.date}
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  label="Created By"
                  name="created_by"
                  value={formik.values.created_by}
                  onChange={formik.handleChange}
                  fullWidth
                  disabled
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="School Name"
                  name="school_name"
                  value={formik.values.school_name}
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
              </Grid> */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  fullWidth
                  size="small"
                  error={
                    formik.touched.school_name &&
                    Boolean(formik.errors.school_name)
                  }
                >
                  <InputLabel
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    }}
                  >
                    School Name
                  </InputLabel>
                  <Select
                    label="School Name"
                    name="school_name"
                    value={formik.values.school_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    }}
                    className={styles.inputField}
                  >
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.school_name}>
                        {school.school_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.school_name && formik.errors.school_name && (
                    <FormHelperText>{formik.errors.school_name}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SelectDrop
                  label="Via"
                  name="via"
                  value={formik.values.via}
                  options={via}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.via && Boolean(formik.errors.via)}
                  helperText={formik.touched.via && formik.errors.via}
                  fullWidth
                />
              </Grid>
              {formik.values.via === "Vehicle" ? (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Vehicle Number"
                      name="vehicle_number"
                      value={formik.values.vehicle_number}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Driver Name"
                      name="driver_name"
                      value={formik.values.driver_name}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Driver Contact Number"
                      name="driver_contact_number"
                      value={formik.values.driver_contact_number}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : formik.values.via === "Courier" ? (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Tracking Number"
                      name="tracking_number"
                      value={formik.values.tracking_number}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Courier Company"
                      name="courier_company"
                      value={formik.values.courier_company}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      type="date"
                      name="delivery_date"
                      value={formik.values.delivery_date}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : formik.values.via === "Postal" ? (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Postal Tracking Number"
                      name="postal_tracking_number"
                      value={formik.values.postal_tracking_number}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Postal Name"
                      name="postal_name"
                      value={formik.values.postal_name}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      type="date"
                      name="postal_delivery_date"
                      value={formik.values.postal_delivery_date}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : null}
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  multiple
                  id="goodies"
                  options={classOptions}
                  value={formik.values.goodies.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  size="small"
                  onChange={(e, newValue) => {
                    formik.setFieldValue(
                      "goodies",
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
                        checked={formik.values.goodies.includes(option.value)}
                        color="primary"
                      />
                      {option.label}
                    </li>
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <span {...getTagProps({ index })}>
                        {option.label}
                        <RxCross2
                          size={12}
                          onClick={() => {
                            const newGoodies = formik.values.goodies.filter(
                              (item) => item !== option.value
                            );
                            formik.setFieldValue("goodies", newGoodies);
                          }}
                        />
                      </span>
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Goodies"
                      placeholder="goodies"
                      variant="outlined"
                      error={
                        formik.touched.goodies && Boolean(formik.errors.goodies)
                      }
                      helperText={
                        formik.touched.goodies && formik.errors.goodies
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
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.remarks && Boolean(formik.errors.remarks)
                  }
                  helperText={formik.touched.remarks && formik.errors.remarks}
                  fullWidth
                  multiline
                  size="small"
                  rows={1}
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
                onClick={() => navigate("/consignment-list")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
