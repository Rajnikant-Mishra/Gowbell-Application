import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import Breadcrumb from "../../CommonButton/Breadcrumb";

const UpdateResultForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the result ID from URL parameters
  const [formData, setFormData] = useState({
    school_name: "",
    student_name: "",
    class_id: "",
    roll_no: "",
    full_mark: "",
    mark_secured: "",
    level: "",
    subject_id: "",
  });
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch result data by ID
  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/get/${id}`);
        console.log("Result API Response:", response.data);
        setFormData(response.data); // Populate form with existing result data
      } catch (error) {
        console.error("Error fetching result:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.error ||
            "Failed to fetch result data. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/class`);
        console.log("Class API Response:", response.data);
        if (Array.isArray(response.data)) {
          setClasses(
            response.data.map((cls) => ({ value: cls.id, label: cls.name }))
          );
        } else {
          console.warn("Class API response is not an array:", response.data);
          setClasses([]);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid class data received from server.",
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.error ||
            "Failed to fetch classes. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/subject`);
        console.log("Subject API Response:", response.data);
        if (Array.isArray(response.data)) {
          setSubjects(
            response.data.map((sub) => ({ value: sub.id, label: sub.name }))
          );
        } else {
          console.warn("Subject API response is not an array:", response.data);
          setSubjects([]);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid subject data received from server.",
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.error ||
            "Failed to fetch subjects. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/api/result/update/${id}`,
        formData
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Result updated successfully!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      }).then(() => {
        navigate("/result-list");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "An error occurred",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Result list", link: "/result-list" },
              { name: "Update Result" },
            ]}
          />
        </div>
      </div>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Update Result Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="School Name"
                name="school_name"
                size="small"
                value={formData.school_name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Student Name"
                name="student_name"
                size="small"
                value={formData.student_name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="class-label">Class</InputLabel>
                <Select
                  labelId="class-label"
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  label="Class"
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select Class</em>
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.value} value={cls.value}>
                      {cls.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Roll Number"
                name="roll_no"
                size="small"
                value={formData.roll_no}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="subject-label">Subject</InputLabel>
                <Select
                  labelId="subject-label"
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleChange}
                  label="Subject"
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select Subject</em>
                  </MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Full Mark"
                name="full_mark"
                type="number"
                size="small"
                value={formData.full_mark}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Mark Secured"
                name="mark_secured"
                type="number"
                size="small"
                value={formData.mark_secured}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Level"
                name="level"
                size="small"
                value={formData.level}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box className="gap-2 mt-4" sx={{ display: "flex", gap: 2 }}>
                <ButtonComp
                  text="Update"
                  type="submit"
                  sx={{ flexGrow: 1 }}
                  disabled={loading}
                />
                <ButtonComp
                  text="Cancel"
                  type="button"
                  sx={{ flexGrow: 1 }}
                  onClick={() => navigate("/result-list")}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Mainlayout>
  );
};

export default UpdateResultForm;