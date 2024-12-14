import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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

const UpdateBookForm = () => {
  const [questionName, setQuestionName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [questions, setQuestions] = useState([]);
  const [schools, setSchools] = useState([]);
  const { id } = useParams(); // Get ID from route params
  const navigate = useNavigate();

  // Fetch dynamic data for questions and schools
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/get/question")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => console.error("Error fetching questions:", error));

    axios
      .get("http://localhost:5000/api/get/schools")
      .then((response) => {
        setSchools(response.data);
      })
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  // Fetch data for the selected ID
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/co/question/${id}`) // Fetch data for the given ID
        .then((response) => {
          const data = response.data;
          setQuestionName(data.question_name);
          setExamDate(data.exam_date);
          setSchoolName(data.school_name_co);
          setTrackingNo(data.tracking_no);
          setQuantity(data.quantity_co);
        })
        .catch((error) => console.error("Error fetching question details:", error));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending the PUT request to update the data
    axios
      .put(`http://localhost:5000/api/co/question/${id}`, {
        question_name: questionName,
        exam_date: examDate,
        school_name_co: schoolName,
        tracking_no: trackingNo,
        quantity_co: quantity,
      })
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: `Question updated successfully.`,
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/question-list"); // Redirect after update
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "There was an issue updating the Question. Please try again.",
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
            marginTop: 6,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" component="h1" gutterBottom>
            Update Question
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" size="small">
              <TextField
                select
                label="Select the question"
                size="small"
                value={questionName}
                onChange={(e) => setQuestionName(e.target.value)}
                required
                InputProps={{
                  style: { fontSize: "14px" },
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              >
                {questions?.length ? (
                  questions.map((question) => (
                    <MenuItem key={question.id} value={question.paper_name}>
                      {question.paper_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No questions available</MenuItem>
                )}
              </TextField>
            </FormControl>

            <TextField
              label="Exam Date"
              type="date"
              fullWidth
              margin="normal"
              size="small"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
              InputProps={{
                style: { fontSize: "14px" },
              }}
              InputLabelProps={{
                shrink: true,
                style: { fontSize: "14px" },
              }}
            />
            <FormControl fullWidth margin="normal" size="small">
              {/* <InputLabel>School Name</InputLabel> */}
              <TextField
                select
                size="small"
                label="Select the School Name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
                
                InputProps={{
                  style: { fontSize: "14px" },
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              >
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.school_name}>
                    {school.school_name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <TextField
              label="Tracking Number"
              fullWidth
              margin="normal"
              size="small"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              required
              InputProps={{
                style: { fontSize: "14px" },
              }}
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              margin="normal"
              size="small"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              InputProps={{
                style: { fontSize: "14px" },
              }}
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: "#8fd14f",
                marginTop: 2,
                height: "36px",
                minWidth: "120px",
                fontSize: "14px",
                textTransform: "none",
              }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateBookForm;
