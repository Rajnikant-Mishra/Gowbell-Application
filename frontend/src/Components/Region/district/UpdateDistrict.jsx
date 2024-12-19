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
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";

const UpdateDistrict = () => {
  const { id } = useParams(); // Get districtId from URL params
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]); // Filtered states for the selected country
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(true); // State for loading indicator
  const navigate = useNavigate();

  // Fetch countries and states on component mount
  useEffect(() => {
    setLoading(true);
    // Fetch countries
    axios
      .get(`${API_BASE_URL}/api/countries/`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        Swal.fire({
          title: "Error!",
          text: "Unable to fetch countries data.",
          icon: "error",
        });
      });

    // Fetch states
    axios
      .get(`${API_BASE_URL}/api/states/`)
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
        Swal.fire({
          title: "Error!",
          text: "Unable to fetch states data.",
          icon: "error",
        });
      })
      .finally(() => setLoading(false)); // Set loading to false after fetching
  }, []);

  // Filter states when a country is selected
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

  // Fetch district data when editing
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/districts/${id}`)
      .then((response) => {
        const district = response.data;
        setName(district.name);
        setStatus(district.status);
        setSelectedCountry(district.country_id);
        setSelectedState(district.state_id);
      })
      .catch((error) => {
        console.error("Error fetching district data:", error);
        Swal.fire({
          title: "Error!",
          text: "Unable to fetch district data.",
          icon: "error",
        });
      })
      .finally(() => setLoading(false)); // Set loading to false after fetching
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedState || !selectedCountry) {
      Swal.fire({
        title: "Warning!",
        text: "Please select both country and state.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const districtData = {
      name,
      status,
      country_id: selectedCountry, // Ensure it's a valid number
      state_id: selectedState, // Ensure it's a valid number
    };

    // Log the payload to debug
    console.log(districtData);

    axios
      .put(`${API_BASE_URL}/api/districts/${id}`, districtData)
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `District "${name}" updated successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/district");
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "There was an issue updating the District. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error updating District:", error);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "District", link: "/district" },
              { name: "Update District" },
            ]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 3,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Update District
          </Typography>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Country Dropdown */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Country</InputLabel>
                <Select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  label="Select Country"
                  size="small"
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                >
                  <MenuItem value="" disabled>
                    -- Select Country --
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* State Dropdown */}
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
                  size="small"
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                >
                  <MenuItem value="" disabled>
                    {filteredStates.length === 0
                      ? "No states available for this country"
                      : "-- Select State --"}
                  </MenuItem>
                  {filteredStates.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* District Name Input */}
              <TextField
                fullWidth
                label="District Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
                margin="normal"
                size="small"
                InputProps={{
                  style: { fontSize: "14px" },
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />

              {/* Status Dropdown */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                  size="small"
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ backgroundColor: "#8fd14f", marginTop: 3 }}
              >
                Update
              </Button>
            </form>
          )}
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateDistrict;
