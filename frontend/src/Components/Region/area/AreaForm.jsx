import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import {API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css"

const CreateArea = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL }/api/countries/`)
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states based on selected country
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`${API_BASE_URL }/api/states?countryId=${selectedCountry}`)
        .then((response) => setStates(response.data))
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [selectedCountry]);

  // Fetch districts based on selected state
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`${API_BASE_URL }/api/districts?stateId=${selectedState}`)
        .then((response) => setDistricts(response.data))
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedState]);

  // Fetch cities based on selected district
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`${API_BASE_URL }/api/cities?districtId=${selectedDistrict}`)
        .then((response) => setCities(response.data))
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedDistrict]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure the data to be sent is correct
    const data = {
      name,
      status,
      countryId: selectedCountry,
      stateId: selectedState,
      districtId: selectedDistrict,
      cityId: selectedCity,
    };

    // Sending the POST request to the server
    axios
      .post(`${API_BASE_URL }/api/areas/`, data)
      .then(() => {
        Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Success!",
                  text: `Area "${name}" created successfully!`,
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  toast: true,
                  background: "#fff",
                  customClass: {
                    popup: "small-swal",
                  },
                }).then(() => navigate("/area"));
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "There was an issue creating the area. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error creating area:", error);
      });
  };

  return (
    <Mainlayout>
    <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "Area", link: "/area" }, { name: "Create Area" }]}
          />
        </div>
      </div>
      <Container maxWidth="sm" sx={{ height: "auto" }}>
        <Box
          sx={{
            marginTop: 9,
            padding: 5,
            borderRadius: 2,
            boxShadow: 4,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 1 }}>
            Create New Area
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Country selection */}
            <FormControl
              fullWidth
              size="small"
              margin="normal"
              sx={{ marginBottom: 0 }}
            >
              {/* <InputLabel>Select Country</InputLabel> */}
              <TextField
                select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                label="Select Country"
                size="small"
                InputProps={{
                  style: { fontSize: "14px" }, // Adjust input text size
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" }, // Adjust label size
                }}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <Grid container spacing={2}>
              {/* State selection */}
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  margin="normal"
                  sx={{ marginBottom: 0 }}
                  disabled={!selectedCountry}
                >
                  {/* <InputLabel>Select State</InputLabel> */}
                  <TextField
                    select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    label="Select State"
                    size="small"
                    InputProps={{
                      style: { fontSize: "14px" }, // Adjust input text size
                    }}
                    InputLabelProps={{
                      style: { fontSize: "14px" }, // Adjust label size
                    }}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.id} value={state.id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              {/* District selection */}
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  margin="normal"
                  sx={{ marginBottom: 0 }}
                  disabled={!selectedState}
                >
                  {/* <InputLabel>Select District</InputLabel> */}
                  <TextField
                    select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    label="Select District"
                    size="small"
                    InputProps={{
                      style: { fontSize: "14px" }, // Adjust input text size
                    }}
                    InputLabelProps={{
                      style: { fontSize: "14px" }, // Adjust label size
                    }}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>

            {/* City selection */}
            <Grid container spacing={2}>
              {/* City selection */}
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  margin="normal"
                  sx={{ marginBottom: 0 }}
                  disabled={!selectedDistrict}
                >
                  {/* <InputLabel>Select City</InputLabel> */}
                  <TextField
                    select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    label="Select City"
                    size="small"
                    InputProps={{
                      style: { fontSize: "14px" }, // Adjust input text size
                    }}
                    InputLabelProps={{
                      style: { fontSize: "14px" }, // Adjust label size
                    }}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              {/* Area Name input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Area Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  margin="normal"
                  size="small"
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                />
              </Grid>
            </Grid>

            {/* Status selection */}
            <FormControl
              fullWidth
              size="small"
              margin="normal"
              sx={{ marginBottom: 0 }}
            >
              {/* <InputLabel>Status</InputLabel> */}
              <TextField
                select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
                size="small"
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

            {/* Submit button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: "#8fd14f",
                marginTop: 3,
                height: "36px", // Set the height of the button
                minWidth: "120px", // Ensure the button width doesn't collapse
                padding: "4px 16px", // Adjust padding to make the button smaller
                fontSize: "14px", // Adjust font size for better appearance
                textTransform: "none", // Optional: Prevents the button text from being uppercase
              }}
            >
              Create
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateArea;
