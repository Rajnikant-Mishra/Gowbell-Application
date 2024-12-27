import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Card,
  CardContent,
  Autocomplete,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CreateCountry = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryList = response.data.map((country) => ({
          value: country.name.common,
          label: country.name.common,
        }));
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries.");
      }
    };
    fetchCountries();
  }, []);


  const handleCountryChange = (e, value) => {
    setSelectedCountry(value);
    const isValidCountry = countries.some((country) => country.value === value);
    if (!isValidCountry) {
      setError("Invalid country name. Please select a valid country.");
    } else {
      setError("");
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCountry) {
      // toast.error("Please select a country.");
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "error",
        text: `Please select a country.`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
      return;
    }
    if (error) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/countries/`);
      const existingCountries = response.data;
      const isDuplicate = existingCountries.some(
        (country) =>
          country.name.toLowerCase() === selectedCountry.toLowerCase()
      );
      if (isDuplicate) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Duplicate Country Name",
          text: `The country "${selectedCountry}" already exists.`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/countries/`, {
          name: selectedCountry,
          status,
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Country "${selectedCountry}" created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
        setTimeout(() => navigate("/country"), 1000);
      }
    } catch (error) {
      console.error("Error creating country:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: "Oops! There was an issue. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
    }
  };
  return (
    <Mainlayout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Country", link: "/country" },
            { name: "Create Country" },
          ]}
        />
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
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ marginBottom: 5 }}
            >
              Create New Country
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    options={countries.map((country) => country.value)}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!error}
                        InputLabelProps={{
                          style: { fontSize: "14px" },
                        }}
                      />
                    )}
                    freeSol
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Status"
                      size="small"
                      inputProps={{
                        style: { fontSize: "14px" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                      style={{ fontSize: "14px" }}
                    >
                      <MenuItem value="active" style={{ fontSize: "14px" }}>
                        Active
                      </MenuItem>
                      <MenuItem value="inactive" style={{ fontSize: "14px" }}>
                        Inactive
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box className={` gap-2 `} sx={{ display: "flex", gap: 2 }}>
                  <ButtonComp
                      text="Cancel"
                      type="button"
                      sx={{ flexGrow: 1 }}
                      onClick={() => navigate("/country")}
                    />
                    <ButtonComp
                      text="Submit"
                      type="submit"
                      onClick={handleSubmit}
                      disabled={false}
                      sx={{ flexGrow: 1 }}
                    />
                  
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Box>
      </Container>
    </Mainlayout>
  );
};
export default CreateCountry;