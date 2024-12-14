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

const CreateCountry = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const stateData = {
      name,
      status,
      country_id: selectedCountry, // Set country_id with the selected country
    };

    axios
      .post("http://localhost:5000/api/states/", stateData)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: `State "${name}" created successfully.`,
          icon: "success",
          timer: 1000, // Auto close after 2 seconds
          timerProgressBar: true,
          showConfirmButton: false,
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
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 11,
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

export default CreateCountry;
