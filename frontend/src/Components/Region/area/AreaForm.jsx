import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";

import ButtonComp from "../../School/CommonComp/ButtonComp";

const CreateArea = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/countries/`)
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));

    axios
      .get(`${API_BASE_URL}/api/states/`)
      .then((response) => setStates(response.data))
      .catch((error) => console.error("Error fetching states:", error));

    axios
      .get(`${API_BASE_URL}/api/districts/`)
      .then((response) => setDistricts(response.data))
      .catch((error) => console.error("Error fetching districts:", error));

    axios
      .get(`${API_BASE_URL}/api/cities/`)
      .then((response) => setCities(response.data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const filtered = states.filter(
        (state) => state.country_id === selectedCountry
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
    setSelectedState("");
    setFilteredDistricts([]);
    setSelectedDistrict("");
    setFilteredCities([]);
    setSelectedCity("");
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState) {
      const filtered = districts.filter(
        (district) => district.state_id === selectedState
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict("");
    setFilteredCities([]);
    setSelectedCity("");
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      const filtered = cities.filter(
        (city) => city.district_id === selectedDistrict
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
    setSelectedCity("");
  }, [selectedDistrict, cities]);


  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data to be sent to the backend
    const data = {
      name,
      status,
      country_id: selectedCountry,
      state_id: selectedState,
      district_id: selectedDistrict,
      city_id: selectedCity,
    };

    // Make the POST request to create a new area
    axios
      .post(`${API_BASE_URL}/api/areas/`, data)
      .then((response) => {
        // Success notification
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
        // Handle errors (including duplicate area)
        if (error.response && error.response.status === 400) {
          // Specific error message when the area already exists
          Swal.fire({
            position: "top-end",
            title: "Error!",
            text:
              error.response.data.error ||
              "There was an issue creating the area. Please try again.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          });
        } else {
          // General error handling
          Swal.fire({
            position: "top-end",
            title: "Error!",
            text:
              "server errors",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          });
        }
        console.error("Error creating area:", error);
      });
  };

  return (
    <Mainlayout>
      <Breadcrumb
        data={[{ name: "Area", link: "/area" }, { name: "Create Area" }]}
      />
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Box
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Create New Area
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  size="small"
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Select State"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                  size="small"
                >
                  {filteredStates.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Select District"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                  size="small"
                >
                  {filteredDistricts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Select City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDistrict}
                  size="small"
                >
                  {filteredCities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Area Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>

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
                onClick={() => navigate("/area")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateArea;
