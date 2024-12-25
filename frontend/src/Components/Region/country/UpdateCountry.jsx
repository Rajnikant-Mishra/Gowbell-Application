// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import {
//   Container,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   Grid,
//   Typography,
//   FormControl,
//   InputLabel,
//   Autocomplete,
//   CardContent,
//   Box,
// } from "@mui/material";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";
// const UpdateCountry = () => {
//   const [name, setName] = useState("");
//   const [status, setStatus] = useState("active");
//   const [selectedCountry, setSelectedCountry] = useState(null); // Add selectedCountry state
//   const [countries, setCountries] = useState([]); // Store country list
//   const { id } = useParams();
//   const navigate = useNavigate();
//   useEffect(() => {
//     // Fetch country details
//     axios
//       .get(`${API_BASE_URL}/api/countries/${id}`)
//       .then((response) => {
//         setName(response.data.name);
//         setStatus(response.data.status);
//         setSelectedCountry(response.data.name); // Set initial selected country
//       })
//       .catch((error) => {
//         console.error("Error fetching country:", error);
//       });
//     // Fetch all countries
//     axios
//       .get(`${API_BASE_URL}/api/countries`)
//       .then((response) => {
//         const countryOptions = response.data.map((country) => ({
//           label: country.name,
//           value: country.name,
//         }));
//         setCountries(countryOptions);
//       })
//       .catch((error) => {
//         console.error("Error fetching countries:", error);
//       });
//   }, [id]);
//   const handleCountryChange = (event, newValue) => {
//     setSelectedCountry(newValue); // Update selected country
//     setName(newValue); // Sync name with selected country
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .put(`${API_BASE_URL}/api/countries/${id}`, { name, status })
//       .then((response) => {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: `Country "${name}" updated successfully!`,
//           showConfirmButton: false,
//           timer: 1000,
//           toast: true,
//           customClass: {
//             popup: "small-swal",
//           },
//         }).then(() => {
//           navigate("/country");
//         });
//       })
//       .catch((error) => {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error",
//           text: "Country name already exists!",
//           showConfirmButton: false,
//           timer: 3000,
//           toast: true,
//           customClass: {
//             popup: "small-swal",
//           },
//         });
//         console.error("Error updating country:", error);
//       });
//   };
//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[
//               { name: "Country", link: "/country" },
//               { name: "Update Country" },
//             ]}
//           />
//         </div>
//       </div>
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             marginTop: 3,
//             padding: 3,
//             borderRadius: 2,
//             boxShadow: 3,
//             backgroundColor: "#fff",
//           }}
//         >
//           <CardContent>
//             <Typography
//               variant="h4"
//               gutterBottom
//               align="center"
//               sx={{ marginBottom: 5 }}
//             >
//               Update Country
//             </Typography>
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <Autocomplete
//                     value={selectedCountry}
//                     onChange={handleCountryChange}
//                     options={countries.map((country) => country.value)}
//                     freeSolo // Allows typing custom values
//                     size="small"
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Country"
//                         variant="outlined"
//                         fullWidth
//                         required
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth required>
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                       value={status}
//                       onChange={(e) => setStatus(e.target.value)}
//                       label="Status"
//                       size="small"
//                     >
//                       <MenuItem value="active">Active</MenuItem>
//                       <MenuItem value="inactive">Inactive</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Box sx={{ display: "flex", gap: 2 }}>
//                     <ButtonComp
//                       text="Submit"
//                       type="submit"
//                       onClick={handleSubmit}
//                       disabled={false}
//                       sx={{ flexGrow: 1 }}
//                     />
//                     <ButtonComp
//                       text="Cancel"
//                       type="button"
//                       sx={{ flexGrow: 1 }}
//                       onClick={() => navigate("/country")}
//                     />
//                   </Box>
//                 </Grid>
//               </Grid>
//             </form>
//           </CardContent>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };
// export default UpdateCountry;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Autocomplete,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCountry = () => {
  const { id } = useParams(); // Get the country ID from the URL params
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch existing country details for editing
  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/countries/${id}`);
        const countryData = response.data;
        setSelectedCountry(countryData.name);
        setStatus(countryData.status);
      } catch (error) {
        console.error("Error fetching country details:", error);
        toast.error("Failed to load country details.");
      }
    };

    fetchCountryDetails();
  }, [id]);

  // Fetch all countries for Autocomplete
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryList = response.data.map((country) => ({
          value: country.name.common,
          label: country.name.common,
        }));
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries.");
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = (e, value) => {
    setSelectedCountry(value);
    const isValidCountry = countries.some((country) => country.value === value);
    if (!isValidCountry) {
      setError("Invalid country name. Please select a valid country.");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCountry) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: `Please select a country.`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
      return;
    }

    if (error) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      // Fetch existing countries
      const response = await axios.get(`${API_BASE_URL}/api/countries/`);
      const existingCountries = response.data;

      // Check for duplicate (ignoring the current country being edited)
      const isDuplicate = existingCountries.some(
        (country) =>
          country.name.toLowerCase() === selectedCountry.toLowerCase() &&
          country.id !== id // Exclude current country's ID
      );

      if (isDuplicate) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Duplicate Country Name",
          text: `The country "${selectedCountry}" already exists.`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
        return;
      }

      // Update the country in the database
      await axios.put(`${API_BASE_URL}/api/countries/${id}`, {
        name: selectedCountry,
        status,
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Country "${selectedCountry}" updated successfully!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });

      setTimeout(() => navigate("/country"), 1000);
    } catch (error) {
      console.error("Error updating country:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: "Oops! There was an issue. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
    }
  };

  return (
    <Mainlayout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Country", link: "/country" },
            { name: "Edit Country" },
          ]}
        />
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 4,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ marginBottom: 5 }}
            >
              Edit Country
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    options={countries.map((country) => country.value)}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!error}
                        helperText={error}
                        InputLabelProps={{
                          style: { fontSize: "14px" },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Status"
                      size="small"
                      inputProps={{
                        style: { fontSize: "14px" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                      style={{ fontSize: "14px" }}
                    >
                      <MenuItem value="active" style={{ fontSize: "14px" }}>
                        Active
                      </MenuItem>
                      <MenuItem value="inactive" style={{ fontSize: "14px" }}>
                        Inactive
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box className={` gap-2 `} sx={{ display: "flex", gap: 2 }}>
                    <ButtonComp
                      text="Update"
                      type="submit"
                      sx={{ flexGrow: 1 }}
                    />
                    <ButtonComp
                      text="Cancel"
                      type="button"
                      sx={{ flexGrow: 1 }}
                      onClick={() => navigate("/country")}
                    />
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default EditCountry;
