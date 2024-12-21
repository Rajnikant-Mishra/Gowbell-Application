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
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const CreateCountry = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Sending the POST request to the server
    axios
      .post(`${API_BASE_URL}/api/subject`, { name, status })
      .then((response) => {
        // Success: Show success alert and redirect
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Subject "${name}" created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/subject"); // Redirect after success
        });
      })
      .catch((error) => {
        // Error: Show error alert
        if (error.response && error.response.data.error === "Subject with this name already exists") {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: `Subject name "${name}" already exists.`,
            showConfirmButton: false,
            timer: 2000,
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
            text: "There was an issue creating the subject. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        console.error("Error creating subject:", error);
      });
  };
  

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Subject", link: "/subject" },
              { name: "Create Subject" },
            ]}
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
            Create New Subject
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="subject Name"
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
                TextField
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
                text="Submit"
                type="submit"
                disabled={false}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/subject")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateCountry;
