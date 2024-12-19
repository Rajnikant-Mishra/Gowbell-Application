import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  CircularProgress,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import {API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css"

const UpdateCity = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL }/api/countries/`)
      .then((response) => {
        setCountries(response.data);
        setLoading(false); // Stop loading after countries are fetched
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setLoading(false);
      });
  }, []);

  // Fetch city data for the given cityId
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL }/api/cities/${id}`)
        .then((response) => {
          const cityData = response.data;
          setName(cityData.name);
          setStatus(cityData.status);
          setSelectedCountry(cityData.country_id);
          setSelectedState(cityData.state_id);
          setSelectedDistrict(cityData.district_id);
        })
        .catch((error) => {
          console.error("Error fetching city data:", error);
        });
    }
  }, [id]);

  // Fetch states when country is selected
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`${API_BASE_URL }/api/states?countryId=${selectedCountry}`)
        .then((response) => {
          setStates(response.data);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`${API_BASE_URL }/api/districts?stateId=${selectedState}`)
        .then((response) => {
          setDistricts(response.data);
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

    if (!name || !selectedCountry || !selectedState || !selectedDistrict) {
      Swal.fire({
        title: "Error!",
        text: "Please fill all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    axios
      .put(`${API_BASE_URL }/api/cities/${id}`, {
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
                  text: `City "${name}" updated successfully!`,
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
          text: "There was an issue updating the city. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error updating city:", error);
      });
  };

  if (loading) {
    return (
      <Mainlayout>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Container>
      </Mainlayout>
    );
  }

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
            marginTop: 4,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Update City
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Country selection input */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Country</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
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
            <Grid container spacing={2}>
              {/* State selection input */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
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
                        {state.name} ({state.districtCount || 0} Districts)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* District selection input */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
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

              {/* Status Dropdown */}
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
              disabled={!selectedDistrict}
            >
              Update
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateCity;
