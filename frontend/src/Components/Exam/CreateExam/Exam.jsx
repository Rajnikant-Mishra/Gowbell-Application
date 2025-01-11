import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  MenuItem,
} from "@mui/material";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Mainlayout from "../../Layouts/Mainlayout";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../Common-Css/Swallfire.css";

const ExamForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    school: "",
    class_name: "",
    level: "",
    date_from: "",
    date_to: "",
  });

  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/get/schools`);
        setSchools(response.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/class`);
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/e1/exams`,
        formData
      );

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Exam schedule created successfully!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      }).then(() => {
        navigate("/examList");
      });

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }

      setFormData({
        school: "",
        class_name: "",
        level: "",
        date_from: "",
        date_to: "",
      });
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Exam", link: "/examList" },
            { name: "Exam Schedule" },
          ]}
        />
      </div>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 600,
          margin: "auto",
          marginTop: 5,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Exam
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="School"
              name="school"
              value={formData.school}
              onChange={handleChange}
              fullWidth
              margin="dense"
              size="small"
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

            <Grid
              container
              spacing={2}
              marginBottom={1}
              marginTop={-1}
              sx={{ display: "flex", flexWrap: "wrap" }}
            >
              <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                <TextField
                  select
                  label="Class"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                >
                  {classes.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.name}>
                      {classItem.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                <TextField
                  label="Level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date From"
                  name="date_from"
                  type="date"
                  value={formData.date_from}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: { fontSize: "14px" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date To"
                  name="date_to"
                  type="date"
                  value={formData.date_to}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: { fontSize: "14px" },
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/examList")}
              />
            </Box>
          </form>
        </CardContent>
      </Card>
    </Mainlayout>
  );
};

export default ExamForm;
