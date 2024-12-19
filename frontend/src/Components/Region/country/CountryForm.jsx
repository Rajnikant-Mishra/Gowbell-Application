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
import Breadcrumb from "../../CommonButton/Breadcrumb";
import {API_BASE_URL } from "../../ApiConfig/APIConfig"
import "../../Common-Css/Swallfire.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateCountry = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Sending the POST request to the server
    axios
      .post(`${API_BASE_URL}/api/countries/`, { name, status })
      .then((response) => {
        // Success: Show SweetAlert2 success notification
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Country "${name}" created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
        
  
        setTimeout(() => navigate("/country"), 1000); // Redirect after success
      })
      .catch((error) => {
        // Error: Show SweetAlert2 error notification
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
        console.error("Error creating country:", error);
      });
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
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "Country", link: "/country" }, { name: "Create Country" }]}
          />
        </div>
      </div>
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
