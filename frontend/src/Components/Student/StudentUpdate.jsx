import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import styles from "./Student.module.css";
import ButtonComp from "../School/CommonComp/ButtonComp";
import TextInput from "../School/CommonComp/TextInput";
import SelectDrop from "../School/CommonComp/SelectDrop";
import Mainlayout from "../Layouts/Mainlayout";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    school_name: "",
    student_name: "",
    class_name: "",
    student_section: "",
    mobile_number: "",
    whatsapp_number: "",
    student_subject: "",
  });

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch school options
        const schoolResponse = await fetch("http://localhost:5000/api/get/schools");
        const schoolData = await schoolResponse.json();
        setSchoolOptions(schoolData.map(school => ({
          value: school.school_name,
          label: school.school_name,
        })));

        // Fetch class options
        const classResponse = await fetch("http://localhost:5000/api/master");
        const classData = await classResponse.json();
        setClassOptions(classData.map(item => ({
          value: item.name,
          label: item.name,
        })));

        // Fetch subject options
        const subjectResponse = await fetch("http://localhost:5000/api/subject");
        const subjectData = await subjectResponse.json();
        setSubjectOptions(subjectData.map(subject => ({
          value: subject.name,
          label: subject.name,
        })));

        // Fetch student data
        const studentResponse = await fetch(`http://localhost:5000/api/get/student/${id}`);
        if (!studentResponse.ok) throw new Error("Student data not found");
        const studentData = await studentResponse.json();
        setFormData({
          school_name: studentData.school_name || "",
          student_name: studentData.student_name || "",
          class_name: studentData.class_name || "",
          student_section: studentData.student_section || "",
          mobile_number: studentData.mobile_number || "",
          whatsapp_number: studentData.whatsapp_number || "",
          student_subject: studentData.student_subject || "",
        });
      } catch (error) {
        console.error("Error loading data", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load data. Please try again.",
          timer: 2000,
        });
      }
    };

    fetchData();
  }, [id]);

  // Section options
  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).includes("") || !formData.school_name || !formData.student_name) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required!",
        timer: 2000,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/get/student/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Student details updated successfully!",
          timer: 2000,
        });
        navigate("/studentList");
      } else {
        throw new Error("Failed to update student details");
      }
    } catch (error) {
      console.error("Error updating student details", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating student details.",
        timer: 2000,
      });
    }
  };

  return (
    <Mainlayout>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <Typography className={`${styles.formTitle} mb-4`}>
            Update Student Details
          </Typography>
          <form className={styles.formContent} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <SelectDrop
                  label="School Name"
                  name="school_name"
                  options={schoolOptions}
                  value={formData.school_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextInput
                  className={styles.textInput}
                  label="Student Name"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class"
                  name="class_name"
                  options={classOptions}
                  value={formData.class_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Section"
                  name="student_section"
                  options={sectionOptions}
                  value={formData.student_section}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextInput
                  label="Mobile Number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  type="tel"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextInput
                  label="Whatsapp Number"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  type="tel"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Subject"
                  name="student_subject"
                  options={subjectOptions}
                  value={formData.student_subject}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box
              className={`${styles.buttonContainer} gap-2 mt-3`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp
                text="Update"
                type="submit"
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/studentList")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}
