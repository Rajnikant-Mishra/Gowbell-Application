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

const CreateCity = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]); // List of countries
  const [states, setStates] = useState([]); // Filtered states based on country
  const [districts, setDistricts] = useState([]); // Filtered districts based on state
  const [selectedCountry, setSelectedCountry] = useState(""); // Selected country ID
  const [selectedState, setSelectedState] = useState(""); // Selected state ID
  const [selectedDistrict, setSelectedDistrict] = useState(""); // Selected district ID
  const navigate = useNavigate();

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/countries/")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Fetch states for the selected country
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`http://localhost:5000/api/states?countryId=${selectedCountry}`)
        .then((response) => {
          const stateData = response.data.map((state) => ({
            ...state,
            districtCount: 0, // Default district count
          }));
          setStates(stateData);
          setDistricts([]); // Reset districts when country changes
          setSelectedState(""); // Reset selected state
          setSelectedDistrict(""); // Reset selected district

          // Fetch district counts for each state
          stateData.forEach((state) => {
            axios
              .get(`http://localhost:5000/api/districts?stateId=${state.id}`)
              .then((districtResponse) => {
                const districtCount = districtResponse.data.length;
                setStates((prevStates) =>
                  prevStates.map((s) =>
                    s.id === state.id ? { ...s, districtCount } : s
                  )
                );
              })
              .catch((err) =>
                console.error("Error fetching district count:", err)
              );
          });
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    } else {
      setStates([]);
      setDistricts([]);
    }
  }, [selectedCountry]);

  // Fetch districts for the selected state
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`http://localhost:5000/api/districts?stateId=${selectedState}`)
        .then((response) => {
          setDistricts(response.data);
          setSelectedDistrict(""); // Reset selected district
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/cities/", {
        name,
        status,
        country_id: selectedCountry,
        state_id: selectedState,
        district_id: selectedDistrict,
      })
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: `City "${name}" created successfully.`,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/city");
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "There was an issue creating the city. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error creating city:", error);
      });
  };

  return (
    <Mainlayout>
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
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create New City
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Country selection input */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Country</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)} // Update selected country ID
                label="Select Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name} ({country.stateCount || 0} States)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* State selection input */}
            <Grid
              container
              spacing={2}
              style={{ display: "flex", flexWrap: "nowrap" }}
            >
              {/* State selection input */}
              <Grid item xs={6} md={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  disabled={!selectedCountry}
                >
                  <InputLabel>Select State</InputLabel>
                  <Select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)} // Update selected state ID
                    label="Select State"
                  >
                    {states.map((state) => (
                      <MenuItem key={state.id} value={state.id}>
                        {state.name} ({state.districtCount || 0} Districts)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* District selection input */}
              <Grid item xs={6} md={6} style={{ flex: 1 }}>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  disabled={!selectedState}
                >
                  <InputLabel>Select District</InputLabel>
                  <Select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)} // Update selected district ID
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

            <Grid container spacing={2}>
              {/* City Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              {/* Status Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
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
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: "#8fd14f",
                marginTop: 3,
              }}
              // disabled={!selectedDistrict} // Disable submit until district is selected
            >
              Create
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateCity;
