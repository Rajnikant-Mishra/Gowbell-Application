import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
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
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";

const CreateDistrict = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]); // Filtered states for the selected country
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const navigate = useNavigate();

  // Fetch all countries and states on component mount
  useEffect(() => {
    // Fetch countries
    axios
      .get(`${API_BASE_URL}/api/countries/`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });

    // Fetch states
    axios
      .get(`${API_BASE_URL}/api/states/`)
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedState) {
      Swal.fire({
        title: "Warning!",
        text: "Please select a state.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const districtData = {
      name,
      status,
      country_id: selectedCountry, // Store selected country ID as country_id
      state_id: selectedState, // Store selected state ID as state_id
    };

    axios
      .post(`${API_BASE_URL}/api/districts/`, districtData)
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `District "${name}" created successfully!`,
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
          text: "There was an issue creating the District. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "small-swal",
          },
        });
        console.error("Error creating District:", error);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "district", link: "/district" },
              { name: "Create district" },
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
            Create New District
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Country Dropdown */}
            <FormControl fullWidth margin="normal" required>
              {/* <InputLabel>Select Country</InputLabel> */}
              <TextField
                select
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
              </TextField>
            </FormControl>

            {/* State Dropdown */}
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
                onChange={(e) => setSelectedState(e.target.value)}
                label="Select State *"
                size="small"
                InputProps={{
                  style: { fontSize: "14px" }, // Adjust input text size
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" }, // Adjust label size
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
              </TextField>
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
                style: { fontSize: "14px" }, // Adjust input text size
              }}
              InputLabelProps={{
                style: { fontSize: "14px" }, // Adjust label size
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
                  style: { fontSize: "14px" }, // Adjust input text size
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" }, // Adjust label size
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

export default CreateDistrict;
