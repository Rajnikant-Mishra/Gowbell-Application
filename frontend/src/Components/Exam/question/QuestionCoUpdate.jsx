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
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

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
      .get(`${API_BASE_URL}/api/get/question`)
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => console.error("Error fetching questions:", error));

    axios
      .get(`${API_BASE_URL}/api/get/schools`)
      .then((response) => {
        setSchools(response.data);
      })
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  // Fetch data for the selected ID
  // useEffect(() => {
  //   if (id) {
  //     axios
  //       .get(`${API_BASE_URL}/api/co/question/${id}`) // Fetch data for the given ID
  //       .then((response) => {
  //         const data = response.data;
  //         setQuestionName(data.question_name);
  //         setExamDate(data.exam_date);
  //         setSchoolName(data.school_name_co);
  //         setTrackingNo(data.tracking_no);
  //         setQuantity(data.quantity_co);
  //       })
  //       .catch((error) =>
  //         console.error("Error fetching question details:", error)
  //       );
  //   }
  // }, [id]);
  // Fetch data for the selected ID
useEffect(() => {
  if (id) {
    axios
      .get(`${API_BASE_URL}/api/co/question/${id}`) // Fetch data for the given ID
      .then((response) => {
        const data = response.data;
        // Format exam_date to YYYY-MM-DD if it exists
        const formattedExamDate = data.exam_date ? data.exam_date.split("T")[0] : "";

        setQuestionName(data.question_name || "");
        setExamDate(formattedExamDate);
        setSchoolName(data.school_name_co || "");
        setTrackingNo(data.tracking_no || "");
        setQuantity(data.quantity_co || "");
      })
      .catch((error) =>
        console.error("Error fetching question details:", error)
      );
  }
}, [id]);


  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending the PUT request to update the data
    axios
      .put(`${API_BASE_URL}/api/co/question/${id}`, {
        question_name: questionName,
        exam_date: examDate,
        school_name_co: schoolName,
        tracking_no: trackingNo,
        quantity_co: quantity,
      })
      .then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `C0-question updated successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Question", link: "/question-list" },
              { name: "UpdateQuestion" },
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
            Update Question
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" size="small">
              <TextField
                label="Question paper"
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
              ></TextField>
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
              onChange={(e) => {
                const value = e.target.value;
                // Allow only alphanumeric characters
                const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
                setTrackingNo(sanitizedValue);
              }}
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
                style: { fontSize: "14px" },
              }}
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
            />
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
                onClick={() => navigate("/question-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateBookForm;
