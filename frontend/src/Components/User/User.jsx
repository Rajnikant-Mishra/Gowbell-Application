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
//   MenuItem, // Add this import
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import axios from "axios";

// const CreateUserForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     role: "",
//     phone: "",
//     password: "",
//     confirm_password: "",
//   });
//   const [roles, setRoles] = useState([]); // State to store roles
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch roles from API
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/r1/role`)
//       .then((response) => {
//         setRoles(response.data); // Assume API returns roles as [{ id: 1, role_name: "Admin" }, ...]
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, [API_BASE_URL]);

//   // Handle change in dropdown
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value, // Store the selected role_id
//     });
//   };

//   // Handle form submission
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
//       const response = await fetch(`${API_BASE_URL}/api/u1/users`, {
//         method: "POST",
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
//           title: "User created successfully!",

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
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="First Name"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   size="small"
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
//                   value={formData.role} // This binds the role_id to the dropdown
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                   required
//                 >
//                   {roles.map((role) => (
//                     <MenuItem key={role.id} value={role.id}>
//                       {role.role_name} {/* Display the role_name */}
//                     </MenuItem>
//                   ))}
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
//                 text="Submit"
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

// export default CreateUserForm;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import {
  TextField,
  Button,
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
  const [isSubmitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch roles from API
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

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
        .required("Username is required")
        .test("unique-name", "username  already exists.", async (value) => {
          if (!value) return true; // Skip validation if field is empty
          try {
            const { data: existingUser} = await axios.get(
              `${API_BASE_URL}/api/u1/users`
            );
            return !existingUser.some(
              (user) => user.username.toLowerCase() === value.toLowerCase()
            );
          } catch (error) {
            console.error("Error checking duplicate username:", error);
            return false; // Assume duplicate if there's an error
          }
        }),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .test("unique-name", "email name already exists.", async (value) => {
          if (!value) return true; // Skip validation if field is empty
          try {
            const { data: existingEmail} = await axios.get(
              `${API_BASE_URL}/api/u1/users`
            );
            return !existingEmail.some(
              (user) => user.email.toLowerCase() === value.toLowerCase()
            );
          } catch (error) {
            console.error("Error checking duplicate email name:", error);
            return false; // Assume duplicate if there's an error
          }
        }),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
        .required("Password is required")
        .min(5, "Password must be at least 5 characters"),
    confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
});


  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/u1/users`, values);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User created successfully!",
        showConfirmButton: false,
        timer: 1000,
        toast: true,
      });
      resetForm();
      navigate("/user-list");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Something went wrong!",
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
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
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
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Username"
                      name="username"
                      fullWidth
                      size="small"
                      InputProps={{
                        style: { fontSize: "14px" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Email"
                      name="email"
                      fullWidth
                      size="small"
                      InputProps={{
                        style: { fontSize: "14px" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Phone Number"
                      name="phone"
                      fullWidth
                      size="small"
                      InputProps={{
                        style: { fontSize: "14px" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
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
                        InputProps={{
                          style: { fontSize: "14px" },
                        }}
                        InputLabelProps={{
                          style: { fontSize: "14px" },
                        }}
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
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Password"
                      name="password"
                      type="password"
                      fullWidth
                      size="small"
                      InputProps={{
                        style: { fontSize: "14px" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Confirm Password"
                      name="confirm_password"
                      type="password"
                      fullWidth
                      size="small"
                      InputProps={{
                        style: { fontSize: "14px" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                    />
                    <ErrorMessage
                      name="confirm_password"
                      component="div"
                      style={{ color: "red", fontSize: "0.8em" }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
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



