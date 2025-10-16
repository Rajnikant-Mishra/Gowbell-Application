// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Mainlayout from "../Layouts/Mainlayout";
// import {
//   TextField,
//   Button,
//   Box,
//   Container,
//   Typography,
//   Grid,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const CreateUserForm = () => {
//   const [roles, setRoles] = useState([]);
//   const [isRoleLoading, setRoleLoading] = useState(true);
//   const [isSubmitting, setSubmitting] = useState(false);
//   const navigate = useNavigate();

//   // Fetch roles from API
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/r1/role`)
//       .then((response) => {
//         setRoles(response.data);
//         setRoleLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         setRoleLoading(false);
//       });
//   }, []);

//   // Validation schema using Yup
//   const validationSchema = Yup.object({
//     username: Yup.string()
//         .required("Username is required")
//         .test("unique-name", "username  already exists.", async (value) => {
//           if (!value) return true; // Skip validation if field is empty
//           try {
//             const { data: existingUser} = await axios.get(
//               `${API_BASE_URL}/api/u1/users`
//             );
//             return !existingUser.some(
//               (user) => user.username.toLowerCase() === value.toLowerCase()
//             );
//           } catch (error) {
//             console.error("Error checking duplicate username:", error);
//             return false; // Assume duplicate if there's an error
//           }
//         }),
//     email: Yup.string()
//         .email("Invalid email address")
//         .required("Email is required")
//         .test("unique-name", "email name already exists.", async (value) => {
//           if (!value) return true; // Skip validation if field is empty
//           try {
//             const { data: existingEmail} = await axios.get(
//               `${API_BASE_URL}/api/u1/users`
//             );
//             return !existingEmail.some(
//               (user) => user.email.toLowerCase() === value.toLowerCase()
//             );
//           } catch (error) {
//             console.error("Error checking duplicate email name:", error);
//             return false; // Assume duplicate if there's an error
//           }
//         }),
//     phone: Yup.string().required("Phone number is required"),
//     role: Yup.string().required("Role is required"),
//     password: Yup.string()
//         .required("Password is required")
//         .min(5, "Password must be at least 5 characters"),
//     confirm_password: Yup.string()
//         .oneOf([Yup.ref("password"), null], "Passwords must match")
//         .required("Confirm password is required"),
// });

//   // Handle form submission
//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     setSubmitting(true);
//     try {
//       await axios.post(`${API_BASE_URL}/api/u1/users`, values);
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "User created successfully!",
//         showConfirmButton: false,
//         timer: 1000,
//         toast: true,
//       });
//       resetForm();
//       navigate("/user-list");
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: error.response?.data?.message || "Something went wrong!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[{ name: "User", link: "/user-list" }, { name: "Create User" }]}
//         />
//       </div>
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             mt: 7,
//             p: 2,
//             borderRadius: 2,
//             boxShadow: 3,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h4" align="center" gutterBottom>
//             Create User
//           </Typography>
//           <Formik
//             initialValues={{
//               username: "",
//               email: "",
//               phone: "",
//               role: "",
//               password: "",
//               confirm_password: "",
//             }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form>
//                 <Grid container spacing={2}>
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Username"
//                       name="username"
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                       InputLabelProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                     />
//                     <ErrorMessage
//                       name="username"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Email"
//                       name="email"
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                       InputLabelProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                     />
//                     <ErrorMessage
//                       name="email"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Phone Number"
//                       name="phone"
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                       InputLabelProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                     />
//                     <ErrorMessage
//                       name="phone"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     {isRoleLoading ? (
//                       <CircularProgress size={24} />
//                     ) : (
//                       <Field
//                         as={TextField}
//                         select
//                         label="Role"
//                         name="role"
//                         fullWidth
//                         size="small"
//                         InputProps={{
//                           style: { fontSize: "14px" },
//                         }}
//                         InputLabelProps={{
//                           style: { fontSize: "14px" },
//                         }}
//                       >
//                         {roles.map((role) => (
//                           <MenuItem key={role.id} value={role.id}>
//                             {role.role_name}
//                           </MenuItem>
//                         ))}
//                       </Field>
//                     )}
//                     <ErrorMessage
//                       name="role"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Password"
//                       name="password"
//                       type="password"
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                       InputLabelProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                     />
//                     <ErrorMessage
//                       name="password"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Confirm Password"
//                       name="confirm_password"
//                       type="password"
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                       InputLabelProps={{
//                         style: { fontSize: "14px" },
//                       }}
//                     />
//                     <ErrorMessage
//                       name="confirm_password"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>
//                 </Grid>
//                 <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//                   <ButtonComp
//                     text="Submit"
//                     type="submit"
//                     disabled={isSubmitting}
//                     sx={{ flexGrow: 1 }}
//                   />
//                   <ButtonComp
//                     text="Cancel"
//                     type="button"
//                     sx={{ flexGrow: 1 }}
//                     onClick={() => navigate("/user-list")}
//                   />
//                 </Box>
//               </Form>
//             )}
//           </Formik>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default CreateUserForm;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Mainlayout from "../Layouts/Mainlayout";
// import {
//   TextField,
//   Button,
//   Box,
//   Container,
//   Typography,
//   Grid,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const CreateUserForm = () => {
//   const [roles, setRoles] = useState([]);
//   const [isRoleLoading, setRoleLoading] = useState(true);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const navigate = useNavigate();

//   // Fetch roles from API
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/r1/role`)
//       .then((response) => {
//         setRoles(response.data);
//         setRoleLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         setRoleLoading(false);
//       });
//   }, []);

//   // Validation schema using Yup
//   const validationSchema = Yup.object({
//     username: Yup.string().required("Username is required"),
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//     phone: Yup.string().required("Phone number is required"),
//     role: Yup.string().required("Role is required"),
//     password: Yup.string()
//       .required("Password is required")
//       .min(5, "Password must be at least 5 characters"),
//     confirm_password: Yup.string()
//       .oneOf([Yup.ref("password"), null], "Passwords must match")
//       .required("Confirm password is required"),
//   });

//   // Handle file selection
//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   // Handle form submission
//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     if (!selectedFile) {
//       Swal.fire({
//         icon: "error",
//         title: "Profile image is required!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("username", values.username);
//       formData.append("email", values.email);
//       formData.append("phone", values.phone);
//       formData.append("role", values.role);
//       formData.append("password", values.password);
//       formData.append("confirm_password", values.confirm_password);
//       formData.append("user_profile", selectedFile);

//       await axios.post(`${API_BASE_URL}/api/u1/users`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "User created successfully!",
//         showConfirmButton: false,
//         timer: 1000,
//         toast: true,
//       });

//       resetForm();
//       setSelectedFile(null);
//       navigate("/user-list");
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: error.response?.data?.error || "Something went wrong!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[{ name: "User", link: "/user-list" }, { name: "Create User" }]}
//         />
//       </div>
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             mt: 7,
//             p: 2,
//             borderRadius: 2,
//             boxShadow: 3,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h4" align="center" gutterBottom>
//             Create User
//           </Typography>
//           <Formik
//             initialValues={{
//               username: "",
//               email: "",
//               phone: "",
//               role: "",
//               password: "",
//               confirm_password: "",
//             }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form>
//                 <Grid container spacing={2}>
//                   {/* Username */}
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Username"
//                       name="username"
//                       fullWidth
//                       size="small"
//                     />
//                     <ErrorMessage
//                       name="username"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Email */}
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Email"
//                       name="email"
//                       fullWidth
//                       size="small"
//                     />
//                     <ErrorMessage
//                       name="email"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Phone */}
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Phone Number"
//                       name="phone"
//                       fullWidth
//                       size="small"
//                     />
//                     <ErrorMessage
//                       name="phone"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Role */}
//                   <Grid item xs={6}>
//                     {isRoleLoading ? (
//                       <CircularProgress size={24} />
//                     ) : (
//                       <Field
//                         as={TextField}
//                         select
//                         label="Role"
//                         name="role"
//                         fullWidth
//                         size="small"
//                       >
//                         {roles.map((role) => (
//                           <MenuItem key={role.id} value={role.id}>
//                             {role.role_name}
//                           </MenuItem>
//                         ))}
//                       </Field>
//                     )}
//                     <ErrorMessage
//                       name="role"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Password */}
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Password"
//                       name="password"
//                       type="password"
//                       fullWidth
//                       size="small"
//                     />
//                     <ErrorMessage
//                       name="password"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Confirm Password */}
//                   <Grid item xs={6}>
//                     <Field
//                       as={TextField}
//                       label="Confirm Password"
//                       name="confirm_password"
//                       type="password"
//                       fullWidth
//                       size="small"
//                     />
//                     <ErrorMessage
//                       name="confirm_password"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Profile Image */}
//                   <Grid item xs={12}>
//                     <TextField
//                       type="file"
//                       label="Profile Image"
//                       fullWidth
//                       size="small"
//                       InputLabelProps={{ shrink: true }}
//                       onChange={handleFileChange}
//                     />
//                     {!selectedFile && (
//                       <div style={{ color: "red", fontSize: "0.8em" }}>
//                         Profile image is required
//                       </div>
//                     )}
//                   </Grid>
//                 </Grid>

//                 <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//                   <ButtonComp
//                     text="Submit"
//                     type="submit"
//                     disabled={isSubmitting}
//                     sx={{ flexGrow: 1 }}
//                   />
//                   <ButtonComp
//                     text="Cancel"
//                     type="button"
//                     sx={{ flexGrow: 1 }}
//                     onClick={() => navigate("/user-list")}
//                   />
//                 </Box>
//               </Form>
//             )}
//           </Formik>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default CreateUserForm;

//================================================

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Mainlayout from "../Layouts/Mainlayout";
// import {
//   TextField,
//   Box,
//   Container,
//   Typography,
//   Grid,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const CreateUserForm = () => {
//   const [roles, setRoles] = useState([]);
//   const [isRoleLoading, setRoleLoading] = useState(true);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/r1/role`)
//       .then((response) => {
//         setRoles(response.data);
//         setRoleLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         setRoleLoading(false);
//       });
//   }, []);

//   const validationSchema = Yup.object({
//     username: Yup.string().required("Username is required"),
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//     phone: Yup.string().required("Phone number is required"),
//     role: Yup.string().required("Role is required"),
//     password: Yup.string()
//       .required("Password is required")
//       .min(5, "Password must be at least 5 characters"),
//     confirm_password: Yup.string()
//       .oneOf([Yup.ref("password"), null], "Passwords must match")
//       .required("Confirm password is required"),
//   });

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewImage(null);
//     }
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("username", values.username);
//       formData.append("email", values.email);
//       formData.append("phone", values.phone);
//       formData.append("role", values.role);
//       formData.append("password", values.password);
//       formData.append("confirm_password", values.confirm_password);
//       if (selectedFile) {
//         formData.append("user_profile", selectedFile);
//       }

//       await axios.post(`${API_BASE_URL}/api/u1/users`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "User created successfully!",
//         showConfirmButton: false,
//         timer: 1000,
//         toast: true,
//       });

//       resetForm();
//       setSelectedFile(null);
//       setPreviewImage(null);
//       navigate("/user-list");
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: error.response?.data?.error || "Something went wrong!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[{ name: "User", link: "/user-list" }, { name: "Create User" }]}
//         />
//       </div>
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             mt: 7,
//             p: 4,
//             borderRadius: 3,
//             boxShadow: 4,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h4" align="center" gutterBottom>
//             Create User
//           </Typography>
//           <Formik
//             initialValues={{
//               username: "",
//               email: "",
//               phone: "",
//               role: "",
//               password: "",
//               confirm_password: "",
//             }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form>
//                 <Grid container spacing={3}>
//                   {/* Username */}
//                   <Grid item xs={12} sm={6}>
//                     <Field
//                       as={TextField}
//                       label="Username"
//                       name="username"
//                       fullWidth
//                       size="small"
//                       variant="outlined"
//                       sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//                     />
//                     <ErrorMessage
//                       name="username"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Email */}
//                   <Grid item xs={12} sm={6}>
//                     <Field
//                       as={TextField}
//                       label="Email"
//                       name="email"
//                       fullWidth
//                       size="small"
//                       variant="outlined"
//                       sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//                     />
//                     <ErrorMessage
//                       name="email"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Phone */}
//                   <Grid item xs={12} sm={6}>
//                     <Field
//                       as={TextField}
//                       label="Phone Number"
//                       name="phone"
//                       fullWidth
//                       size="small"
//                       variant="outlined"
//                       sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//                     />
//                     <ErrorMessage
//                       name="phone"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Role */}
//                   <Grid item xs={12} sm={6}>
//                     {isRoleLoading ? (
//                       <CircularProgress size={24} />
//                     ) : (
//                       <Field
//                         as={TextField}
//                         select
//                         label="Role"
//                         name="role"
//                         fullWidth
//                         size="small"
//                         variant="outlined"
//                         sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//                       >
//                         {roles.map((role) => (
//                           <MenuItem key={role.id} value={role.id}>
//                             {role.role_name}
//                           </MenuItem>
//                         ))}
//                       </Field>
//                     )}
//                     <ErrorMessage
//                       name="role"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Password */}
//                   <Grid item xs={12} sm={6}>
//                     <Field
//                       as={TextField}
//                       label="Password"
//                       name="password"
//                       type="password"
//                       fullWidth
//                       size="small"
//                       variant="outlined"
//                       sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//                     />
//                     <ErrorMessage
//                       name="password"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Confirm Password */}
//                   <Grid item xs={12} sm={6}>
//                     <Field
//                       as={TextField}
//                       label="Confirm Password"
//                       name="confirm_password"
//                       type="password"
//                       fullWidth
//                       size="small"
//                       variant="outlined"
//                       sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//                     />
//                     <ErrorMessage
//                       name="confirm_password"
//                       component="div"
//                       style={{ color: "red", fontSize: "0.8em" }}
//                     />
//                   </Grid>

//                   {/* Profile Image */}
//                   <Grid item xs={12}>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       style={{ display: "none" }}
//                       id="profile-upload"
//                       onChange={handleFileChange}
//                     />
//                     <Box
//                       component="label"
//                       htmlFor="profile-upload"
//                       sx={{
//                         width: 100,
//                         height: 100,
//                         border: "2px dashed #ccc",
//                         borderRadius: 2,
//                         overflow: "hidden",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                         "&:hover": { borderColor: "#999" },
//                       }}
//                     >
//                       {previewImage ? (
//                         <img
//                           src={previewImage}
//                           alt="Preview"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                         />
//                       ) : (
//                         <Typography variant="caption" color="textSecondary">
//                           Click to upload
//                         </Typography>
//                       )}
//                     </Box>
//                   </Grid>
//                 </Grid>

//                 <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
//                   <ButtonComp
//                     text="Submit"
//                     type="submit"
//                     disabled={isSubmitting}
//                     sx={{ flexGrow: 1 }}
//                   />
//                   <ButtonComp
//                     text="Cancel"
//                     type="button"
//                     sx={{ flexGrow: 1 }}
//                     onClick={() => navigate("/user-list")}
//                   />
//                 </Box>
//               </Form>
//             )}
//           </Formik>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default CreateUserForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import {
  TextField,
  Box,
  Container,
  Typography,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CreateUserForm = () => {
  const [roles, setRoles] = useState([]);
  const [isRoleLoading, setRoleLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/r1/role`)
      .then((response) => {
        setRoles(response.data);
        setRoleLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setRoleLoading(false);
      });
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Handle file upload with image validation
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     if (!file.type.startsWith("image/")) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Only image files are allowed!",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       return;
  //     }

  //     setSelectedFile(file);

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setSelectedFile(null);
  //     setPreviewImage(null);
  //   }
  // };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowed = /jpeg|jpg|png|gif/;
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowed.test(fileExtension)) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Only image files (jpeg, jpg, png, gif) are allowed!",
          showConfirmButton: false,
          timer: 30000,
        toast: true,
        });
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  // Form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("role", values.role);
      formData.append("password", values.password);
      formData.append("confirm_password", values.confirm_password);
      if (selectedFile) {
        formData.append("user_profile", selectedFile);
      }

      await axios.post(`${API_BASE_URL}/api/u1/users`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User created successfully!",
        showConfirmButton: false,
        timer: 1000,
        toast: true,
      });

      resetForm();
      setSelectedFile(null);
      setPreviewImage(null);
      navigate("/user-list");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.error || "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[{ name: "User", link: "/user-list" }, { name: "Create User" }]}
        />
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 7,
            p: 4,
            borderRadius: 3,
            boxShadow: 4,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Create User
          </Typography>
          <Formik
            initialValues={{
              username: "",
              email: "",
              phone: "",
              role: "",
              password: "",
              confirm_password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>

                    {/* Profile Image */}
                  <Grid item xs={12}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      id="profile-upload"
                      onChange={handleFileChange}
                    />
                    <Box
                      component="label"
                      htmlFor="profile-upload"
                      sx={{
                        width: 100,
                        height: 100,
                        border: "2px dashed #787878ff",
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        "&:hover": { borderColor: "#999" },
                      }}
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          Upload Image
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  {/* Username */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Username"
                      name="username"
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Email"
                      name="email"
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Phone Number"
                      name="phone"
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>

                  {/* Role */}
                  <Grid item xs={12} sm={6}>
                    {isRoleLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Field
                        as={TextField}
                        select
                        label="Role"
                        name="role"
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.role_name}
                          </MenuItem>
                        ))}
                      </Field>
                    )}
                    <ErrorMessage
                      name="role"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Password"
                      name="password"
                      type="password"
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>

                  {/* Confirm Password */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Confirm Password"
                      name="confirm_password"
                      type="password"
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <ErrorMessage
                      name="confirm_password"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  <ButtonComp
                    text="Submit"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ flexGrow: 1 }}
                  />
                  <ButtonComp
                    text="Cancel"
                    type="button"
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/user-list")}
                  />
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateUserForm;
