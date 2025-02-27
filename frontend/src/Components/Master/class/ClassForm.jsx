// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Mainlayout from "../../Layouts/Mainlayout";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Container,
//   Typography,
//   Box,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";

// const CreateClass = () => {
//   const [name, setName] = useState("");
//   const [status, setStatus] = useState("active");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Check for unique class name
//       const { data: existingClasses } = await axios.get(`${API_BASE_URL}/api/class`);
//       const isNameTaken = existingClasses.some((cls) => cls.name === name);

//       if (isNameTaken) {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: `Class name "${name}" already exists.`,
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         });
//         return;
//       }

//       // Create new class
//       const response = await axios.post(`${API_BASE_URL}/api/class`, { name, status });

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: `Class "${name}" created successfully!`,
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       }).then(() => {
//         navigate("/class");
//       });
//     } catch (error) {
//       Swal.fire({
//         title: "Error!",
//         text: "There was an issue creating the Class. Please try again.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//       console.error("Error creating Class:", error);
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[{ name: "Class", link: "/class" }, { name: "Create Class" }]}
//           />
//         </div>
//       </div>
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             marginTop: 8,
//             padding: 3,
//             borderRadius: 2,
//             boxShadow: 3,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
//             Create New Class
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Class Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               variant="outlined"
//               margin="normal"
//               size="small"
//               InputProps={{
//                 style: { fontSize: "14px" },
//               }}
//               InputLabelProps={{
//                 style: { fontSize: "14px" },
//               }}
//             />
//             <FormControl fullWidth margin="normal" required>
//               <TextField
//                 select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 label="Status"
//                 variant="outlined"
//                 size="small"
//                 InputProps={{
//                   style: { fontSize: "14px" },
//                 }}
//                 InputLabelProps={{
//                   style: { fontSize: "14px" },
//                 }}
//               >
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="inactive">Inactive</MenuItem>
//               </TextField>
//             </FormControl>
//             <Box className={` gap-2 mt-4`} sx={{ display: "flex", gap: 2 }}>
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
//                 onClick={() => navigate("/class")}
//               />
//             </Box>
//           </form>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default CreateClass;
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  MenuItem,
  Container,
  Typography,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import "../../Common-Css/Swallfire.css";
const CreateClass = () => {
  const navigate = useNavigate();

  // Validation schema with duplicate validation
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Class name is required.")
      .min(2, "Class name must be at least 2 characters.")
      .max(50, "Class name cannot exceed 50 characters.")
      .matches(
        /^[a-zA-Z0-9 _-]+$/,
        "Class name can only contain letters, numbers, spaces, underscores, and hyphens."
      )
      .test(
        "unique-name",
        "Class name already exists.",
        async (value) => {
          if (!value) return true; // Skip validation if field is empty
          try {
            const { data: existingClasses } = await axios.get(
              `${API_BASE_URL}/api/class`
            );
            return !existingClasses.some(
              (cls) => cls.name.toLowerCase() === value.toLowerCase()
            );
          } catch (error) {
            console.error("Error checking duplicate class name:", error);
            return false; // Assume duplicate if there's an error
          }
        }
      ),
    status: Yup.string().required("Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      status: "active",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
          await axios.post(`${API_BASE_URL}/api/class`, values, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}` // Send user token
              }
          });
  
          Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: `Class ${values.name} created successfully!`,
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: {
                  popup: "small-swal",
              },
          }).then(() => {
              navigate("/class");
          });
      } catch (error) {
          Swal.fire({
              title: "Error!",
              text: "There was an issue creating the Class. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
          });
          console.error("Error creating Class:", error);
      }
  },
  
  });
  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "Class", link: "/class" }, { name: "Create Class" }]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create New Class
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Class Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              variant="outlined"
              margin="normal"
              size="small"
              InputProps={{
                style: { fontSize: "14px" },
              }}
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
            />
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
              variant="outlined"
              margin="normal"
              size="small"
              InputProps={{
                style: { fontSize: "14px" },
              }}
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
            <Box className="gap-2 mt-4" sx={{ display: "flex", gap: 2 }}>
              <ButtonComp
                text="Submit"
                type="submit"
                disabled={formik.isSubmitting}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/class")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateClass;
