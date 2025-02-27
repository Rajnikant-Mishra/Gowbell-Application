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
// import Swal from "sweetalert2"; // Import SweetAlert2
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";

// const CreateCountry = () => {
//   const [name, setName] = useState("");
//   const [status, setStatus] = useState("active");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Sending the POST request to the server
//     axios
//       .post(`${API_BASE_URL}/api/affiliated`, { name, status })
//       .then((response) => {
//         // Success: Show success alert and redirect
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: `Affiliated "${name}" created successfully!`,
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         }).then(() => {
//           navigate("/affiliated"); // Redirect after the user clicks OK
//         });
//       })
//       .catch((error) => {
//         if (error.response && error.response.data.error) {
//           // Check for duplicate entry error from backend
//           if (error.response.data.error.includes("already exists")) {
//             Swal.fire({
//               position: "top-end",
//               icon: "error",
//               title: "Error!",
//               text: `Affiliated name "${name}" already exists.`,
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               toast: true,
//               background: "#fff",
//               customClass: {
//                 popup: "small-swal",
//               },
//             });
//           } else {
//             // General error handling
//             Swal.fire({
//               title: "Error!",
//               text: "There was an issue creating the affiliated. Please try again.",
//               icon: "error",
//               confirmButtonText: "OK",
//             });
//           }
//         } else {
//           // If error response is not available, show a generic error message
//           Swal.fire({
//             title: "Error!",
//             text: "There was an issue creating the affiliated. Please try again.",
//             icon: "error",
//             confirmButtonText: "OK",
//           });
//         }
//         console.error("Error creating affiliated:", error);
//       });
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[
//               { name: "Affiliated", link: "/affiliated" },
//               { name: "Create Affiliated" },
//             ]}
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
//             Create Affiliated
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="affiliated  Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               variant="outlined"
//               margin="normal"
//               size="small"
//               InputProps={{
//                 style: { fontSize: "14px" }, // Adjust input text size
//               }}
//               InputLabelProps={{
//                 style: { fontSize: "14px" }, // Adjust label size
//               }}
//             />
//             <FormControl fullWidth margin="normal" required>
//               {/* <InputLabel>Status</InputLabel> */}
//               <TextField
//                 select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 label="Status"
//                 variant="outlined"
//                 size="small"
//                 InputProps={{
//                   style: { fontSize: "14px" }, // Adjust input text size
//                 }}
//                 InputLabelProps={{
//                   style: { fontSize: "14px" }, // Adjust label size
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
//                 onClick={() => navigate("/affiliated")}
//               />
//             </Box>
//           </form>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default CreateCountry;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  Typography,
  Box,
  Container,
} from "@mui/material";
import Swal from "sweetalert2"; // Import SweetAlert2
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be less than or equal to 255 characters")
    .required("affiliated is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Name can only contain letters and numbers")
    .test("unique-name", "Affiliated name already exists.", async (value) => {
      if (!value) return true; // Skip validation if field is empty
      try {
        const { data: existingAffiliates } = await axios.get(
          `${API_BASE_URL}/api/affiliated`
        );
        return !existingAffiliates.some(
          (affiliate) => affiliate.name.toLowerCase() === value.toLowerCase()
        );
      } catch (error) {
        console.error("Error checking duplicate affiliated name:", error);
        return false; // Assume duplicate if there's an error
      }
    }),
  status: Yup.string()
    .oneOf(
      ["active", "inactive"],
      "Status must be either 'active' or 'inactive'"
    )
    .required("Status is required"),
});

const CreateCountry = () => {
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    axios
      .post(`${API_BASE_URL}/api/affiliated`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is sent
        },
      })
      .then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Affiliated ${values.name} created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/affiliated"); // Redirect after success
        });
      })
      .catch((error) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: "There was an issue creating the affiliated. Please try again.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });

        console.error("Error creating affiliated:", error);
      });
};


  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Affiliated", link: "/affiliated" },
              { name: "Create Affiliated" },
            ]}
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
            Create Affiliated
          </Typography>
          <Formik
            initialValues={{ name: "", status: "active" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <TextField
                  fullWidth
                  label="Affiliated Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="name"
                  variant="outlined"
                  margin="normal"
                  size="small"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                />
                <FormControl fullWidth margin="normal" required>
                  <TextField
                    select
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="status"
                    label="Status"
                    variant="outlined"
                    size="small"
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                    InputProps={{
                      style: { fontSize: "14px" }, // Adjust input text size
                    }}
                    InputLabelProps={{
                      style: { fontSize: "14px" }, // Adjust label size
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </FormControl>
                <Box className={` gap-2 mt-4`} sx={{ display: "flex", gap: 2 }}>
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
                    onClick={() => navigate("/affiliated")}
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

export default CreateCountry;
