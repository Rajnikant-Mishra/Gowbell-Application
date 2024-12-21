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
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const CreateCity = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]); // List of countries
  const [states, setStates] = useState([]); // All states
  const [districts, setDistricts] = useState([]); // All districts
  const [filteredStates, setFilteredStates] = useState([]); // Filtered states based on country
  const [filteredDistricts, setFilteredDistricts] = useState([]); // Filtered districts based on state
  const [selectedCountry, setSelectedCountry] = useState(""); // Selected country ID
  const [selectedState, setSelectedState] = useState(""); // Selected state ID
  const [selectedDistrict, setSelectedDistrict] = useState(""); // Selected district ID
  const navigate = useNavigate();

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/countries/`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Fetch states when country is selected and filter them
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`${API_BASE_URL}/api/states?countryId=${selectedCountry}`)
        .then((response) => {
          const stateData = response.data;
          setStates(stateData);
          setFilteredStates(stateData); // Initially set the filtered states to all states for the selected country
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    } else {
      setStates([]);
      setFilteredStates([]); // Clear filtered states when no country is selected
    }
  }, [selectedCountry]);

  // Filter states based on selected country
  useEffect(() => {
    if (selectedCountry) {
      const filtered = states.filter(
        (state) => state.country_id === selectedCountry
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]); // Clear filtered states if no country is selected
    }
  }, [selectedCountry, states]);

  // Fetch districts when state is selected and filter them
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`${API_BASE_URL}/api/districts?stateId=${selectedState}`)
        .then((response) => {
          const districtData = response.data;
          setDistricts(districtData);
          setFilteredDistricts(districtData); // Set the filtered districts to all districts for the selected state
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    } else {
      setDistricts([]);
      setFilteredDistricts([]); // Clear filtered districts when no state is selected
    }
  }, [selectedState]);

  // Filter districts based on selected state
  useEffect(() => {
    if (selectedState) {
      const filtered = districts.filter(
        (district) => district.state_id === selectedState
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]); // Clear filtered districts if no state is selected
    }
  }, [selectedState, districts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${API_BASE_URL}/api/cities/`, {
        name,
        status,
        country_id: selectedCountry,
        state_id: selectedState,
        district_id: selectedDistrict,
      })
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `City "${name}" created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/city");
        });
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorMessage = error.response.data.error;

          // Check if the error is related to a duplicate city
          if (errorMessage.includes("City already exists")) {
            Swal.fire({
              // title: "Error!",
              // text: `A city with the same name already exists in this district.`,
              // icon: "error",
              // confirmButtonText: "OK",
              position: "top-end",
              icon: "error",
              title: "Error!",
              text: `A city with the same name already exists in this district`,
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
            Swal.fire({
              title: "Error!",
              text: "There was an issue creating the city. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        console.error("Error creating city:", error);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "City", link: "/city" }, { name: "Create City" }]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 5,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create New City
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Country selection input */}
            <FormControl fullWidth margin="normal" required>
              <TextField
                select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)} // Update selected country ID
                label="Select Country"
                size="small"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            {/* State selection input */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  disabled={!selectedCountry}
                >
                  <TextField
                    select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)} // Update selected state ID
                    label="Select State"
                    size="small"
                  >
                    {filteredStates.map((state) => (
                      <MenuItem key={state.id} value={state.id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              {/* District selection input */}
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  disabled={!selectedState}
                >
                  <TextField
                    select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)} // Update selected district ID
                    label="Select District"
                    size="small"
                  >
                    {filteredDistricts.map((district) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>

            {/* City Name Field */}
            <Grid container spacing={2} alignItems="center">
              {/* City Name Field */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  margin="normal"
                  size="small"
                  inputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                  style={{ fontSize: "14px" }}
                />
              </Grid>

              {/* Status Field */}
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" required>
                  <TextField
                    select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    label="Status"
                    size="small"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </FormControl>
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
                onClick={() => navigate("/city")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateCity;
