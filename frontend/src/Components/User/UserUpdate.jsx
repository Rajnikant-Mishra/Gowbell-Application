// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Mainlayout from "../Layouts/Mainlayout";
// import {
//   TextField,
//   Button,
//   Box,
//   Container,
//   Typography,
//   Grid,
//   MenuItem,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import axios from "axios";

// const UserUpdateForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     role: "",
//     phone: "",
//     password: "",
//     confirm_password: "",
//   });
//   const [roles, setRoles] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams(); // To get user ID from the URL

//   useEffect(() => {
//     // Fetching master data for the "Role" select input
//     axios
//       .get(`${API_BASE_URL}/api/r1/role`)
//       .then((response) => {
//         setRoles(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching master data:", error);
//       });

//     // Fetch user data for the given ID
//     if (id) {
//       axios
//         .get(`${API_BASE_URL}/api/u1/users/${id}`)
//         .then((response) => {
//           setFormData(response.data); // Set user data to formData
//         })
//         .catch((error) => {
//           console.error("Error fetching user data:", error);
//         });
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirm_password) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Passwords do not match",
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/u1/users/${id}`, {
//         method: "PUT", // Change method to PUT for updating
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "User updated successfully!",
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         });
//         navigate("/user-list");
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: data.message || "Something went wrong!",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "An error occurred!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[{ name: "User", link: "/user-list" }, { name: "Update User" }]}
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
//             Update User
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="First Name"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                   required
//                   InputProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                   InputLabelProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   fullWidth
//                   type="email"
//                   size="small"
//                   required
//                   InputProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                   InputLabelProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Phone Number"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                   required
//                   InputProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                   InputLabelProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   select
//                   label="Role"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                   required
//                   InputProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                   InputLabelProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                 >
//                   {roles && roles.length > 0 ? (
//                     roles.map((role) => (
//                       <MenuItem key={role.id} value={role.role_name}>
//                         {role.role_name}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <MenuItem disabled>No roles available</MenuItem>
//                   )}
//                 </TextField>
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   fullWidth
//                   type="password"
//                   size="small"
//                   required
//                   InputProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                   InputLabelProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Confirm Password"
//                   name="confirm_password"
//                   value={formData.confirm_password}
//                   onChange={handleChange}
//                   fullWidth
//                   type="password"
//                   size="small"
//                   required
//                   InputProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                   InputLabelProps={{
//                     style: { fontSize: "14px" },
//                   }}
//                 />
//               </Grid>
//             </Grid>
//             <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//               <ButtonComp
//                 text="Update"
//                 type="submit"
//                 disabled={isLoading}
//                 sx={{ flexGrow: 1 }}
//               />
//               <ButtonComp
//                 text="Cancel"
//                 type="button"
//                 sx={{ flexGrow: 1 }}
//                 onClick={() => navigate("/user-list")}
//               />
//             </Box>
//           </form>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default UserUpdateForm;



// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
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

// const UpdateUserForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [roles, setRoles] = useState([]);
//   const [isRoleLoading, setRoleLoading] = useState(true);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [initialValues, setInitialValues] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     role: "",
//     password: "",
//     confirm_password: "",
//   });

//   // Fetch roles
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/r1/role`)
//       .then((res) => {
//         setRoles(res.data);
//         setRoleLoading(false);
//       })
//       .catch(() => setRoleLoading(false));
//   }, []);

//   // Fetch user data by ID
//   useEffect(() => {
//     if (id) {
//       axios
//         .get(`${API_BASE_URL}/api/u1/users/${id}`)
//         .then((res) => {
//           const user = res.data;
//           setInitialValues({
//             username: user.username || "",
//             email: user.email || "",
//             phone: user.phone || "",
//             role: user.role || "",
//             password: user.password || "", // show existing password if needed
//             confirm_password: user.password || "",
//           });
//           if (user.user_profile_url) {
//             setPreviewImage(`${API_BASE_URL}/${user.user_profile_url}`);
//           }
//         })
//         .catch((err) => console.error("Error fetching user:", err));
//     }
//   }, [id]);

//   const validationSchema = Yup.object({
//     username: Yup.string().required("Username is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     phone: Yup.string().required("Phone number is required"),
//     role: Yup.string().required("Role is required"),
//     password: Yup.string().min(5, "Password must be at least 5 characters"),
//     confirm_password: Yup.string().oneOf(
//       [Yup.ref("password"), null],
//       "Passwords must match"
//     ),
//   });

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const allowed = /jpeg|jpg|png|gif/;
//       const ext = file.name.split(".").pop().toLowerCase();
//       if (!allowed.test(ext)) {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Only image files (jpeg, jpg, png, gif) are allowed!",
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//         return;
//       }
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPreviewImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // const handleSubmit = async (values, { setSubmitting }) => {
//   //   setSubmitting(true);
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("username", values.username);
//   //     formData.append("email", values.email);
//   //     formData.append("phone", values.phone);
//   //     formData.append("role", values.role);
//   //     if (values.password) {
//   //       formData.append("password", values.password);
//   //       formData.append("confirm_password", values.confirm_password);
//   //     }
//   //     if (selectedFile) {
//   //       formData.append("user_profile", selectedFile);
//   //     }

//   //     await axios.put(`${API_BASE_URL}/api/u1/users/${id}`, formData, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //     });

//   //     Swal.fire({
//   //       position: "top-end",
//   //       icon: "success",
//   //       title: "User updated successfully!",
//   //       showConfirmButton: false,
//   //       timer: 1000,
//   //       toast: true,
//   //     });

//   //     navigate("/user-list");
//   //   } catch (error) {
//   //     Swal.fire({
//   //       icon: "error",
//   //       title: error.response?.data?.error || "Something went wrong!",
//   //       showConfirmButton: false,
//   //       timer: 1500,
//   //     });
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

//   const handleSubmit = async (values, { setSubmitting }) => {
//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("username", values.username);
//       formData.append("email", values.email);
//       formData.append("phone", values.phone);
//       formData.append("role", values.role);

//       // Append password only if user entered a new one
//       if (values.password && values.password.trim() !== "") {
//         formData.append("password", values.password);
//         formData.append("confirm_password", values.confirm_password);
//       }

//       // Append image only if selected
//       if (selectedFile) {
//         formData.append("user_profile", selectedFile);
//       }

//       await axios.put(`${API_BASE_URL}/api/u1/users/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "User updated successfully!",
//         showConfirmButton: false,
//         timer: 1000,
//         toast: true,
//       });

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
//           data={[{ name: "User", link: "/user-list" }, { name: "Update User" }]}
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
//             Update User
//           </Typography>
//           <Formik
//             enableReinitialize
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form>
//                 <Grid container spacing={3}>
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
//                         border: "2px dashed #787878ff",
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
//                           Upload Image
//                         </Typography>
//                       )}
//                     </Box>
//                   </Grid>

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
//                   {/* <Grid item xs={12} sm={6}>
//                     <Field
//                       as={TextField}
//                       label="Password"
//                       name="password"
//                       type="text"
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
//                   </Grid> */}

//                   {/* Confirm Password */}
//                   {/* <Grid item xs={12} sm={6}>
//                     <Field
//                       as={TextField}
//                       label="Confirm Password"
//                       name="confirm_password"
//                       type="text"
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
//                   </Grid> */}

//                   {/* Password */}
//                   <Grid item xs={12} sm={6}>
//                     <Field
//                       as={TextField}
//                       label="Password"
//                       name="password"
//                       type="password" // <-- this masks the input
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
//                       type="password" // <-- this masks the input
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
//                 </Grid>

//                 <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
//                   <ButtonComp
//                     text="Update"
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

// export default UpdateUserForm;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const UpdateUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [isRoleLoading, setRoleLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirm_password: "",
  });

  // Fetch roles
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/r1/role`)
      .then((res) => {
        setRoles(res.data);
        setRoleLoading(false);
      })
      .catch(() => setRoleLoading(false));
  }, []);

  // Fetch user data
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL}/api/u1/users/${id}`)
        .then((res) => {
          const user = res.data;
          setInitialValues({
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "",
            password: "",
            confirm_password: "",
          });
          if (user.user_profile) {
            setPreviewImage(`${API_BASE_URL}/profiles/${user.user_profile}`);
          }
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [id]);

  // ✅ Password required validation
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters"),
    confirm_password: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  // Image upload and validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowed = /jpeg|jpg|png|gif/;
      const ext = file.name.split(".").pop().toLowerCase();
      if (!allowed.test(ext)) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Only image files (jpeg, jpg, png, gif) are allowed!",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("role", values.role);
      formData.append("password", values.password);
      formData.append("confirm_password", values.confirm_password);

      // Append image if new selected
      if (selectedFile) {
        formData.append("user_profile", selectedFile);
      }

      await axios.put(`${API_BASE_URL}/api/u1/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User updated successfully!",
        showConfirmButton: false,
        timer: 1200,
        toast: true,
      });

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
          data={[{ name: "User", link: "/user-list" }, { name: "Update User" }]}
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
            Update User
          </Typography>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  {/* Profile Upload */}
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
                        width: 120,
                        height: 120,
                        border: "2px dashed #787878",
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
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
                      label="Phone"
                      name="phone"
                      fullWidth
                      size="small"
                      variant="outlined"
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
                      type="text"
                      fullWidth
                      size="small"
                      variant="outlined"
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
                      type="text"
                      fullWidth
                      size="small"
                      variant="outlined"
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
                    text="Update"
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

export default UpdateUserForm;

