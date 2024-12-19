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
import "../../Common-Css/Swallfire.css"

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
      .get(`${API_BASE_URL}/api/countries/`)
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
        .get(`${API_BASE_URL}/api/states?countryId=${selectedCountry}`)
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
              .get(`${API_BASE_URL}/api/districts?stateId=${state.id}`)
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
        .get(`${API_BASE_URL}/api/districts?stateId=${selectedState}`)
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "City", link: "/city" }, { name: "Update City" }]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 9,
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
              {/* <InputLabel>Select Country</InputLabel> */}
              <TextField
                select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)} // Update selected country ID
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
                    {country.name} ({country.stateCount || 0} States)
                  </MenuItem>
                ))}
              </TextField>
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
                  {/* <InputLabel>Select State</InputLabel> */}
                  <TextField
                    select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)} // Update selected state ID
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
                        {state.name} ({state.districtCount || 0} Districts)
                      </MenuItem>
                    ))}
                  </TextField>
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
                  {/* <InputLabel>Select District</InputLabel> */}
                  <TextField
                    select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)} // Update selected district ID
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
                  size="small"
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                />
              </Grid>

              {/* Status Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
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
                height: "36px", // Set the height of the button
                minWidth: "120px", // Ensure the button width doesn't collapse
                padding: "4px 16px", // Adjust padding to make the button smaller
                fontSize: "14px", // Adjust font size for better appearance
                textTransform: "none", // Optional: Prevents the button text from being uppercase
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
