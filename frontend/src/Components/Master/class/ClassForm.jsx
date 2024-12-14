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
      .post("http://localhost:5000/api/master", { name, status })
      .then((response) => {
        // Success: Show success alert and redirect
        Swal.fire({
          title: "Success!",
          text: `Class "${name}" created successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/class"); // Redirect after the user clicks OK
        });
      })
      .catch((error) => {
        // Error: Show error alert
        Swal.fire({
          title: "Error!",
          text: "There was an issue creating the Class. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error creating Class:", error);
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
            Create New Class
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Class Name"
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
                  style: { fontSize: "14px" },
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" },
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
