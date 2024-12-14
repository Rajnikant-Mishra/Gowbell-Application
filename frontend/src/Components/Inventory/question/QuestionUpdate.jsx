import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams for dynamic routing
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  Container,
  Typography,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";

const UpdateQuestionForm = () => {
  const { id } = useParams(); // Get the ID from the route params
  const [paper_name, setName] = useState("");
  const [exam_level, setExam_level] = useState("");
  const [quantity, setQuantity] = useState("");
  const [class_name, setClassName] = useState("");
  const [masterData, setMasterData] = useState([]);
  const navigate = useNavigate();

  // Fetch master data for the "Choose Class" dropdown
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/master")
      .then((response) => setMasterData(response.data))
      .catch((error) => console.error("Error fetching master data:", error));
  }, []);

  // Fetch question data for the given ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/get/question/${id}`)
      .then((response) => {
        const { paper_name, exam_level, quantity, class_name } = response.data;
        setName(paper_name);
        setExam_level(exam_level);
        setQuantity(quantity);
        setClassName(class_name);
      })
      .catch((error) => console.error("Error fetching question data:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(quantity) || quantity <= 0) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid quantity.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Send a PUT request to update the question
    axios
      .put(`http://localhost:5000/api/get/question/${id}`, {
        paper_name,
        exam_level,
        quantity,
        class_name,
      })
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: `Question updated successfully.`,
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/question");
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text:
            error.response?.data?.message ||
            "There was an issue updating the question. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error updating question:", error);
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
            Update Question
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
              <TextField
                select
                value={class_name}
                onChange={(e) => setClassName(e.target.value)}
                label="Select Class"
                required
                size="small"
                InputProps={{
                  style: { fontSize: "14px" },
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" },
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
              <TextField
                select
                value={exam_level}
                onChange={(e) => setExam_level(e.target.value)}
                label="Exam Level"
                required
                size="small"
                InputProps={{
                  style: { fontSize: "14px" },
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" },
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
                style: { fontSize: "14px" },
              }}
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (!value || /^[0-9]*$/.test(value)) {
                  setQuantity(value);
                }
              }}
              required
              variant="outlined"
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ backgroundColor: "#8fd14f", marginTop: 3 }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateQuestionForm;
