import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
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

const EditArea = () => {
  const { id } = useParams(); // Get the area ID from URL params
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

  // Fetch country, state, district, and city data as before
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/countries/`)
      .then((response) => setCountries(response.data));
    axios
      .get(`${API_BASE_URL}/api/states/`)
      .then((response) => setStates(response.data));
    axios
      .get(`${API_BASE_URL}/api/districts/`)
      .then((response) => setDistricts(response.data));
    axios
      .get(`${API_BASE_URL}/api/cities/`)
      .then((response) => setCities(response.data));
  }, []);

  // Filter states based on selected country
  useEffect(() => {
    if (selectedCountry) {
      setFilteredStates(
        states.filter((state) => state.country_id === selectedCountry)
      );
    } else {
      setFilteredStates([]);
    }
    setSelectedState("");
    setFilteredDistricts([]);
    setSelectedDistrict("");
    setFilteredCities([]);
    setSelectedCity("");
  }, [selectedCountry, states]);

  // Filter districts based on selected state
  useEffect(() => {
    if (selectedState) {
      setFilteredDistricts(
        districts.filter((district) => district.state_id === selectedState)
      );
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict("");
    setFilteredCities([]);
    setSelectedCity("");
  }, [selectedState, districts]);

  // Filter cities based on selected district
  useEffect(() => {
    if (selectedDistrict) {
      setFilteredCities(
        cities.filter((city) => city.district_id === selectedDistrict)
      );
    } else {
      setFilteredCities([]);
    }
    setSelectedCity("");
  }, [selectedDistrict, cities]);

  // Fetch the area data by ID for editing
  // useEffect(() => {
  //   if (id) {
  //     axios
  //       .get(`${API_BASE_URL}/api/areas/${id}`)
  //       .then((response) => {
  //         const area = response.data;
  //         setName(area.name);
  //         setStatus(area.status);
  //         setSelectedCountry(area.country_id);
  //         setSelectedState(area.state_id);
  //         setSelectedDistrict(area.district_id);
  //         setSelectedCity(area.city_id);
  //       })
  //       .catch((error) => console.error("Error fetching area data:", error));
  //   }
  // }, [id]);
  // Fetch the area data by ID for editing
useEffect(() => {
  if (id) {
    axios
      .get(`${API_BASE_URL}/api/areas/${id}`)
      .then((response) => {
        const area = response.data;

        setName(area.name);
        setStatus(area.status);

        // Set all selections
        setSelectedCountry(area.country_id);
        setSelectedState(area.state_id);
        setSelectedDistrict(area.district_id);
        setSelectedCity(area.city_id);

        // Filter dependent dropdowns sequentially
        const filteredStates = states.filter(
          (state) => state.country_id === area.country_id
        );
        setFilteredStates(filteredStates);

        const filteredDistricts = districts.filter(
          (district) => district.state_id === area.state_id
        );
        setFilteredDistricts(filteredDistricts);

        const filteredCities = cities.filter(
          (city) => city.district_id === area.district_id
        );
        setFilteredCities(filteredCities);
      })
      .catch((error) => console.error("Error fetching area data:", error));
  }
}, [id, states, districts, cities]); // Ensure states, districts, and cities are available


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for update
    const data = {
      name,
      status,
      country_id: selectedCountry,
      state_id: selectedState,
      district_id: selectedDistrict,
      city_id: selectedCity,
    };

    // Check if all required fields are filled
    if (
      name === "" ||
      selectedCountry === "" ||
      selectedState === "" ||
      selectedDistrict === "" ||
      selectedCity === ""
    ) {
      Swal.fire({
        // title: "Error!",
        // text: "All fields must be filled out to update the area.",
        // icon: "error",
        // confirmButtonText: "OK",
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: `All fields must be filled out to update the area.`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
      return;
    }

    // Make the PUT request to update the area
    axios
      .put(`${API_BASE_URL}/api/areas/${id}`, data) // Use PUT to update the data
      .then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Area "${name}" updated successfully!`,
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
        // Handle errors during update, such as duplicate area names or validation issues
        if (error.response && error.response.status === 400) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text:
            error.response.data.error ||
              "There was an issue updating the area. Please try again.",
            showConfirmButton: false,
            timer: 1000,
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
            text: "There was an issue updating the area. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        console.error("Error updating area:", error);
      });
  };

  return (
    <Mainlayout>
      <Breadcrumb
        data={[{ name: "Area", link: "/area" }, { name: "Edit Area" }]}
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
            Edit Area
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
                  inputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                  style={{ fontSize: "14px" }}
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

export default EditArea;
