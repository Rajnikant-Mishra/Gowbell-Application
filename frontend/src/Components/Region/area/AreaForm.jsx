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
      .get("http://localhost:5000/api/countries/")
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states based on selected country
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`http://localhost:5000/api/states?countryId=${selectedCountry}`)
        .then((response) => setStates(response.data))
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [selectedCountry]);

  // Fetch districts based on selected state
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`http://localhost:5000/api/districts?stateId=${selectedState}`)
        .then((response) => setDistricts(response.data))
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedState]);

  // Fetch cities based on selected district
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`http://localhost:5000/api/cities?districtId=${selectedDistrict}`)
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
      .post("http://localhost:5000/api/areas/", data)
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: `Area "${name}" created successfully.`,
          icon: "success",
          timer: 1000, // Auto close after 2 seconds
          timerProgressBar: true,
          showConfirmButton: false,
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
      <Container maxWidth="sm" sx={{ height: "800px" }}>
        <Box
          sx={{
            marginTop: 7,
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
              <InputLabel>Select Country</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                label="Select Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
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
                  <InputLabel>Select State</InputLabel>
                  <Select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    label="Select State"
                  >
                    {states.map((state) => (
                      <MenuItem key={state.id} value={state.id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
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
                  <InputLabel>Select District</InputLabel>
                  <Select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    label="Select District"
                  >
                    {districts.map((district) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </Select>
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
                  <InputLabel>Select City</InputLabel>
                  <Select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    label="Select City"
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Area Name input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Area Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ marginBottom: 0 }}
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
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            {/* Submit button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 3,
                padding: "8px 17px",
                fontSize: "1rem",
                backgroundColor: "#8fd14f",
                "&:hover": { backgroundColor: "#7ec13f" },
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
