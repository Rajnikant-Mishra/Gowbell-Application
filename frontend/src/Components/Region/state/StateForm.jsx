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
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const CreateCountry = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate state in the selected country
    axios
      .get(`${API_BASE_URL}/api/states?country_id=${selectedCountry}`)
      .then((response) => {
        const existingState = response.data.find(
          (state) => state.name.toLowerCase() === name.toLowerCase()
        );

        if (existingState) {
          Swal.fire({
            // title: "Duplicate State",
            // text: `State "${name}" already exists in this country.`,
            // icon: "error",
            // confirmButtonText: "OK",
            position: "top-end",
            icon: "error",
            title: "Duplicate State Name",
            text: `State "${name}" already exists in this country.`,
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

        // Proceed with state creation
        const stateData = {
          name,
          status,
          country_id: selectedCountry,
        };

        axios
          .post(`${API_BASE_URL}/api/states/`, stateData)
          .then((response) => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: `State "${name}" created successfully!`,
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: {
                popup: "small-swal",
              },
            }).then(() => {
              navigate("/state");
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "There was an issue creating the State. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
            console.error("Error creating State:", error);
          });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "There was an issue checking for duplicate states. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error checking for duplicate states:", error);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "state", link: "/state" }, { name: "Create State" }]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 6,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create New State
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              {/* <InputLabel>Select Country</InputLabel> */}
              <TextField
                select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                label="Select Country"
                variant="outlined"
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
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <TextField
              fullWidth
              label="State Name"
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
            <FormControl fullWidth margin="normal" required>
              {/* <InputLabel>Status</InputLabel> */}
              <TextField
                select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
                variant="outlined"
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
            <Box className={` gap-2 mt-4`} sx={{ display: "flex", gap: 2 }}>
            <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/state")}
              />
              <ButtonComp
                text="Submit"
                type="submit"
                disabled={false}
                sx={{ flexGrow: 1 }}
              />
              
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateCountry;
