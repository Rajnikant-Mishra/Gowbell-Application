import React, { useState } from "react";
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
import Swal from "sweetalert2"; // Import SweetAlert2

const CreateCountry = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending the POST request to the server
    axios         
      .post("http://localhost:5000/api/countries/", { name, status })
      .then((response) => {
        // Success: Show success alert with a timer
        Swal.fire({
          title: "Success!",
          text: `Country "${name}" created successfully.`,
          icon: "success",
          timer: 1000, // Auto close after 2 seconds
          timerProgressBar: true,
          showConfirmButton: false, // Remove the confirm button
        }).then(() => {
          navigate("/country"); // Redirect after the popup closes
        });

        // Optional: Trigger navigation after timer without waiting for user interaction
        setTimeout(() => navigate("/country"), 2000);
      })
      .catch((error) => {
        // Error: Show error alert
        Swal.fire({
          title: "Error!",
          text: "There was an issue creating the country. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error creating country:", error);
      });
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 13,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create New Country
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Country Name"
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
              <InputLabel>Status</InputLabel>
              <Select
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
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: "#8fd14f",
                marginTop: 3,
                height: "36px", 
                minWidth: "120px", 
                fontSize: "14px", 
                textTransform: "none",
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
