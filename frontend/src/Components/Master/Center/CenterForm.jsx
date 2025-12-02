// import React, { useState } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Stack,
//   Paper,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Mainlayout from "../../Layouts/Mainlayout";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import Breadcrumb from "../../CommonButton/Breadcrumb";

// function App() {
//   const [formData, setFormData] = useState({
//     center_name: "",
//     center_code: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 🧩 Step 1: Frontend validation
//     const name = formData.center_name.trim();

//     if (!name) {
//       Swal.fire({
//         icon: "warning",
//         title: "Validation Error",
//         text: "Center name is required!",
//       });
//       return;
//     }

//     try {
//       // 🧠 Step 2: Send request to backend
//       const response = await fetch(`${API_BASE_URL}/api/center/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ center_name: name }),
//       });

//       // 🧩 Step 3: Parse JSON safely
//       const data = await response.json().catch(() => ({}));

//       // 🧠 Step 4: Handle backend response
//       if (response.ok) {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: `Center "${name}" created successfully.`,
//           showConfirmButton: false,
//           timer: 1200,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         });

//         // Reset form
//         setFormData({ center_name: "", center_code: "" });
//       } else {
//         // Backend error message
//         const message =
//           data?.message ||
//           (response.status === 400
//             ? "Invalid data provided."
//             : "Something went wrong!");

//         Swal.fire({
//           icon: "error",
//           text: message,
//         });
//       }
//     } catch (error) {
//       // 🧩 Step 5: Network / unexpected error
//       Swal.fire({
//         icon: "error",
//         title: "Network Error",
//         text: "Unable to connect to the server!",
//       });
//     }
//   };

//   return (
//     <Mainlayout>
//       <div role="presentation">
//         <Breadcrumb
//           data={[
//             { name: "Center", link: "/center-list" },
//             { name: "Create Center" },
//           ]}
//         />
//       </div>
//       <Container maxWidth="sm" sx={{ mt: 10 }}>
//         <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
//           <Typography variant="h5" align="center" gutterBottom>
//             Create New Center
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit}>
//             <Stack spacing={3}>
//               <TextField
//                 label="Center Name"
//                 name="center_name"
//                 value={formData.center_name}
//                 onChange={handleChange}
//                 fullWidth
//                 size="small"
//                 InputProps={{
//                   style: { fontSize: "14px" },
//                 }}
//                 InputLabelProps={{
//                   style: { fontSize: "14px" },
//                 }}
//                 required
//               />
//               <Box className="gap-2 mt-4" sx={{ display: "flex", gap: 2 }}>
//                 <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
//                 <ButtonComp
//                   text="Cancel"
//                   type="button"
//                   sx={{ flexGrow: 1 }}
//                   onClick={() => navigate("/center-list")}
//                 />
//               </Box>
//             </Stack>
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// }

// export default App;



import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  Stack,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import Breadcrumb from "../../CommonButton/Breadcrumb";

function CreateCenter() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    center_name: "",
    center_code: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { center_name, center_code, address } = formData;

    // 🧩 Frontend validation
    if (!center_name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Center name is required!",
      });
      return;
    }

    try {
      // 🧠 API call
      const response = await fetch(`${API_BASE_URL}/api/center/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          center_name: center_name.trim(),
          center_code: center_code.trim() || null,
          address: address.trim() || null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Center "${center_name}" created successfully.`,
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });

        // Reset form
        setFormData({ center_name: "", center_code: "", address: "" });

        // Redirect after short delay
        setTimeout(() => navigate("/center-list"), 1200);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            data?.message ||
            (response.status === 400
              ? "Invalid data provided."
              : "Something went wrong!"),
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server!",
      });
    }
  };

  return (
    <Mainlayout>
      {/* Breadcrumb navigation */}
      <div role="presentation">
        <Breadcrumb
          data={[
            { name: "Center", link: "/center-list" },
            { name: "Create Center" },
          ]}
        />
      </div>

      {/* Main form container */}
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Create New Center
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Center Name */}
              <TextField
                label="Center Name"
                name="center_name"
                value={formData.center_name}
                onChange={handleChange}
                fullWidth
                size="small"
                InputProps={{ style: { fontSize: "14px" } }}
                InputLabelProps={{ style: { fontSize: "14px" } }}
                required
              />

              {/* Optional: Center Code */}
              {/* Optional: Address */}
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                size="small"
                multiline
                minRows={2}
                InputProps={{ style: { fontSize: "14px" } }}
                InputLabelProps={{ style: { fontSize: "14px" } }}
              />

              {/* Buttons */}
              <Box
                className="gap-2 mt-4"
                sx={{ display: "flex", gap: 2, justifyContent: "center" }}
              >
                <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
                <ButtonComp
                  text="Cancel"
                  type="button"
                  onClick={() => navigate("/center-list")}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
}

export default CreateCenter;
