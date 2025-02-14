// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Mainlayout from "../Layouts/Mainlayout";
// import { TextField, Box, Container, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import "../Common-Css/Swallfire.css";

// const permissionsList = ["View", "Edit", "Delete", "Create", "Disable", "Enable"];

// const CreateRoleForm = () => {
//   const [formData, setFormData] = useState({
//     role_name: "",
//     permissions: []
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "role_name") {
//       if (!/^[a-zA-Z\s]*$/.test(value)) {
//         setError("Only letters and spaces are allowed in the Role field.");
//         return;
//       } else {
//         setError("");
//       }
//     }
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePermissionChange = (event) => {
//     setFormData({ ...formData, permissions: event.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/r1/role`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });
//       if (response.ok) {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: `Role created successfully!`,
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         }).then(() => {
//           navigate("/role-list");
//         });
//       } else {
//         const errorData = await response.json();
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: errorData.message || "Failed to create role.",
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
//     } catch (error) {
//       Swal.fire({
//         title: "Error",
//         text: "An unexpected error occurred.",
//         icon: "error",
//       });
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[{ name: "Role", link: "/role-list" }, { name: "Create Role" }]}
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
//             Create Role
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Role"
//               name="role_name"
//               value={formData.role_name}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               required
//               InputProps={{ style: { fontSize: "14px" } }}
//               InputLabelProps={{ style: { fontSize: "14px" } }}
//               error={!!error}
//               helperText={error}
//             />
//             <FormControl fullWidth size="small" sx={{ mt: 2 }}>
//               <InputLabel>Permissions</InputLabel>
//               <Select
//                 multiple
//                 value={formData.permissions}
//                 onChange={handlePermissionChange}
//                 renderValue={(selected) => selected.join(", ")}
//               >
//                 {permissionsList.map((permission) => (
//                   <MenuItem key={permission} value={permission}>
//                     {permission}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//               <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
//               <ButtonComp
//                 text="Cancel"
//                 type="button"
//                 sx={{ flexGrow: 1 }}
//                 onClick={() => navigate("/role-list")}
//               />
//             </Box>
//           </form>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default CreateRoleForm;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import {
  TextField,
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/Swallfire.css";

const permissionsList = ["View", "Edit", "Delete", "Create", "Disable", "Enable"];

const CreateRoleForm = () => {
  const [formData, setFormData] = useState({
    role_name: "",
    permissions: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role_name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setError("Only letters and spaces are allowed in the Role field.");
        return;
      } else {
        setError("");
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  // Handle Permissions Selection
  const handlePermissionChange = (event) => {
    setFormData({ ...formData, permissions: event.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/r1/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role_name: formData.role_name,
          permissions: JSON.stringify(formData.permissions), // Store as JSON string
        }),
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Role created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/role-list");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: errorData.message || "Failed to create role.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Role", link: "/role-list" }, { name: "Create Role" }]} />
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
            Create Role
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Role Name Input */}
            <TextField
              label="Role"
              name="role_name"
              value={formData.role_name}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              InputProps={{ style: { fontSize: "14px" } }}
              InputLabelProps={{ style: { fontSize: "14px" } }}
              error={!!error}
              helperText={error}
            />

            {/* Permissions Selection */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel>Permissions</InputLabel>
              <Select
                multiple
                value={formData.permissions}
                onChange={handlePermissionChange}
                renderValue={(selected) => selected.join(", ")}
                required
              >
                {permissionsList.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    {permission}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Submit & Cancel Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/role-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateRoleForm;
