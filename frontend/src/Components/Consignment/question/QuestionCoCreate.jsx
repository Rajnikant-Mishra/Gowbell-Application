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
import "../../Common-Css/Swallfire.css"


const BookForm = () => {
  const [questionName, setQuestionName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [questions, setQuestions] = useState([]);
  const [schools, setSchools] = useState([]);
  const navigate = useNavigate();

  // Fetch dynamic data for questions and schools
  useEffect(() => {
    axios
      .get(`${ API_BASE_URL }/api/get/question`) // Replace with your API endpoint
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => console.error("Error fetching questions:", error));

    axios
      .get(`${ API_BASE_URL }/api/get/schools`) // Replace with your API endpoint
      .then((response) => {
        setSchools(response.data);
      })
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending the POST request to the server
    axios
      .post(`${ API_BASE_URL }/api/co/question`, {
        question_name: questionName,
        exam_date: examDate,
        school_name_co: schoolName,
        tracking_no: trackingNo,
        quantity_co: quantity,
      })
      .then((response) => {
        // Success: Show success alert and redirect
        Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Success!",
                  text: `co-question created successfully!`,
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  toast: true,
                  background: "#fff",
                  customClass: {
                    popup: "small-swal",
                  },
                }).then(() => {
          navigate("/question-list"); // Redirect after the user clicks OK
        });
      })
      .catch((error) => {
        // Error: Show error alert
        Swal.fire({
          title: "Error!",
          text: "There was an issue creating the Question. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error creating question:", error);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Question-Co.", link: "/question-list" },
              { name: "CreateQuestion-Co." },
            ]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 2,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" component="h1" gutterBottom>
            Create Question
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" size="small">
              <TextField
                select
                label="Select the question"
                size="small"
                labelId="paper-name-label"
                id="paper-name-select"
                value={questionName}
                onChange={(e) => setQuestionName(e.target.value)}
                required
                InputProps={{
                  style: { fontSize: "14px" }, // Adjust input text size
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" }, // Adjust label size
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
              // InputLabelProps={{ shrink: true }}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
              InputProps={{
                style: { fontSize: "14px" }, // Adjust input text size
              }}
              InputLabelProps={{shrink: true,
                style: { fontSize: "14px" }, // Adjust label size
              }}
            />
            <FormControl fullWidth margin="normal" size="small">
              {/* <InputLabel>School Name</InputLabel> */}
              <TextField
                select
                label="Select the School Name"
                size="small"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
                
                InputProps={{
                  style: { fontSize: "14px" }, // Adjust input text size
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" }, // Adjust label size
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
                style: { fontSize: "14px" }, // Adjust input text size
              }}
              InputLabelProps={{
                style: { fontSize: "14px" }, // Adjust label size
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
                style: { fontSize: "14px" }, // Adjust input text size
              }}
              InputLabelProps={{
                style: { fontSize: "14px" }, // Adjust label size
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
              Submit
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default BookForm;
