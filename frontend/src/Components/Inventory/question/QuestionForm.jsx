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

const BookForm = () => {
  const [paper_name, setName] = useState("");
  const [exam_level, setExam_level] = useState("");
  const [quantity, setQuantity] = useState("");
  const [class_name, setClassName] = useState("");
  const [masterData, setMasterData] = useState([]); // State for master data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching master data for the "Choose Class" select input
    axios
      .get("http://localhost:5000/api/master")
      .then((response) => {
        setMasterData(response.data); // Set the master data from the API response
      })
      .catch((error) => {
        console.error("Error fetching master data:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the quantity is a valid number before submitting
    if (isNaN(quantity) || quantity <= 0) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid quantity.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Sending the POST request to the server
    axios
      .post("http://localhost:5000/api/get/question", {
        paper_name,
        exam_level,
        quantity,
        class_name,
      })
      .then((response) => {
        // Success: Show success alert and redirect
        Swal.fire({
          title: "Success!",
          text: `question "${name}" created successfully.`,
          icon: "success",
          timer: 1000, // Auto close after 2 seconds
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/question"); // Redirect after the user clicks OK
        });
      })
      .catch((error) => {
        // Error: Show error alert
        Swal.fire({
          title: "Error!",
          text:
            error.response?.data?.message ||
            "There was an issue creating the question. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error creating question:", error);
      });
  };

  return (
    <Mainlayout>
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
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create Question
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Question Paper Name"
              value={paper_name}
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

            <FormControl fullWidth margin="normal">
              {/* <InputLabel>Choose Class</InputLabel> */}
              <TextField
                select
                value={class_name}
                onChange={(e) => setClassName(e.target.value)}
                label="Select Class"
                required
                size="small"
                InputProps={{
                  style: { fontSize: "14px" }, // Adjust input text size
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" }, // Adjust label size
                }}
              >
                {masterData.map((item) => (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <FormControl fullWidth margin="normal">
              {/* <InputLabel>Exam Level</InputLabel> */}
              <TextField
                select
                value={exam_level}
                onChange={(e) => setExam_level(e.target.value)}
                label="Exam Level"
                required
                size="small"
                InputProps={{
                  style: { fontSize: "14px" }, // Adjust input text size
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" }, // Adjust label size
                }}
              >
                <MenuItem value="level1">Level 1</MenuItem>
                <MenuItem value="level2">Level 2</MenuItem>
                <MenuItem value="level3">Level 3</MenuItem>
                <MenuItem value="level4">Level 4</MenuItem>
              </TextField>
            </FormControl>

            <TextField
              fullWidth
              label="Quantity"
              value={quantity}
              size="small"
              InputProps={{
                style: { fontSize: "14px" }, // Adjust input text size
              }}
              InputLabelProps={{
                style: { fontSize: "14px" }, // Adjust label size
              }}
              onChange={(e) => {
                // Only update state if the value is numeric or empty
                const value = e.target.value;
                if (!value || /^[0-9]*$/.test(value)) {
                  setQuantity(value);
                }
              }}
              required
              variant="outlined"
              margin="normal"
              type="number"
              inputProps={{ min: 0 }} // Prevent negative values
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ backgroundColor: "#8fd14f", marginTop: 3 }}
            >
              Create
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default BookForm;
