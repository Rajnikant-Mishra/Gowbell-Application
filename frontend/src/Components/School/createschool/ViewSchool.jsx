import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import styles from "./School.module.css";

export default function SchoolViewForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the school ID from URL params
  const [schoolData, setSchoolData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch school data and related information
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Please log in again.",
            toast: true,
            position: "top-end",
            timer: 2000,
          });
          navigate("/login");
          return;
        }

        // Fetch all data concurrently
        const [schoolRes, countriesRes, statesRes, districtsRes, citiesRes, classesRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/get/schools/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/countries/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/states/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/districts/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/cities/all/c1`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/class`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const school = schoolRes.data;
        setSchoolData({
          ...school,
          classes: Array.isArray(school.classes)
            ? school.classes
            : school.classes
            ? JSON.parse(school.classes)
            : [],
        });
        setCountries(countriesRes.data);
        setStates(statesRes.data);
        setDistricts(districtsRes.data);
        setCities(citiesRes.data);
        setClasses(classesRes.data.map((cls) => cls.name));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch school data. Please try again.",
          toast: true,
          position: "top-end",
          timer: 2000,
        });
        navigate("/schoolList");
      }
    };

    fetchSchoolData();
  }, [id, navigate]);

  // Helper function to get name by ID
  const getNameById = (id, list) => {
    const item = list.find((item) => String(item.id) === String(id));
    return item ? item.name : "N/A";
  };

  if (loading || !schoolData) {
    return (
      <Mainlayout>
        <Box
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Typography variant="h6">Loading school data...</Typography>
        </Box>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "School", link: "/schoolList" },
              { name: "View School" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={styles.formBox}>
          <Typography className={`${styles.formTitle} mb-4`}>
            View School Details
          </Typography>
          <Grid container spacing={2}>
            {/* Board Name */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold">Board Name</Typography>
              <Typography variant="body2">{schoolData.board || "N/A"}</Typography>
            </Grid>

            {/* School Name */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="bold">School Name</Typography>
              <Typography variant="body2">{schoolData.school_name || "N/A"}</Typography>
            </Grid>

            {/* School Email */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="bold">School Email</Typography>
              <Typography variant="body2">{schoolData.school_email || "N/A"}</Typography>
            </Grid>

            {/* School Mobile Number */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold">School Mobile Number</Typography>
              <Typography variant="body2">{schoolData.school_contact_number || "N/A"}</Typography>
            </Grid>

            {/* School Landline Number */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold">Landline Number</Typography>
              <Typography variant="body2">{schoolData.school_landline_number || "N/A"}</Typography>
            </Grid>

            {/* School Address */}
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subtitle2" fontWeight="bold">School Address</Typography>
              <Typography variant="body2">{schoolData.school_address || "N/A"}</Typography>
            </Grid>

            {/* Pincode */}
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subtitle2" fontWeight="bold">Pincode</Typography>
              <Typography variant="body2">{schoolData.pincode || "N/A"}</Typography>
            </Grid>

            {/* Country */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="bold">Country</Typography>
              <Typography variant="body2">{getNameById(schoolData.country, countries)}</Typography>
            </Grid>

            {/* State */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="bold">State</Typography>
              <Typography variant="body2">{getNameById(schoolData.state, states)}</Typography>
            </Grid>

            {/* District */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="bold">District</Typography>
              <Typography variant="body2">{getNameById(schoolData.district, districts)}</Typography>
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="bold">City</Typography>
              <Typography variant="body2">{getNameById(schoolData.city, cities)}</Typography>
            </Grid>

            {/* Principal Name */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Principal Name</Typography>
              <Typography variant="body2">{schoolData.principal_name || "N/A"}</Typography>
            </Grid>

            {/* Principal Contact Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Principal Mobile Number</Typography>
              <Typography variant="body2">{schoolData.principal_contact_number || "N/A"}</Typography>
            </Grid>

            {/* Principal Whatsapp Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Principal Whatsapp Number</Typography>
              <Typography variant="body2">{schoolData.principal_whatsapp || "N/A"}</Typography>
            </Grid>

            {/* Vice Principal Name */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Vice Principal Name</Typography>
              <Typography variant="body2">{schoolData.vice_principal_name || "N/A"}</Typography>
            </Grid>

            {/* Vice Principal Contact Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Vice Principal Mobile Number</Typography>
              <Typography variant="body2">{schoolData.vice_principal_contact_number || "N/A"}</Typography>
            </Grid>

            {/* Vice Principal Whatsapp Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Vice Principal Whatsapp Number</Typography>
              <Typography variant="body2">{schoolData.vice_principal_whatsapp || "N/A"}</Typography>
            </Grid>

            {/* Manager Name */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Manager Name</Typography>
              <Typography variant="body2">{schoolData.manager_name || "N/A"}</Typography>
            </Grid>

            {/* Manager Contact Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Manager Mobile Number</Typography>
              <Typography variant="body2">{schoolData.manager_contact_number || "N/A"}</Typography>
            </Grid>

            {/* Manager Whatsapp Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Manager Whatsapp Number</Typography>
              <Typography variant="body2">{schoolData.manager_whatsapp_number || "N/A"}</Typography>
            </Grid>

            {/* 1st Olympiad Incharge Name */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">1st Olympiad Incharge Name</Typography>
              <Typography variant="body2">{schoolData.first_incharge_name || "N/A"}</Typography>
            </Grid>

            {/* 1st Olympiad Contact Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">1st Olympiad Mobile Number</Typography>
              <Typography variant="body2">{schoolData.first_incharge_number || "N/A"}</Typography>
            </Grid>

            {/* 1st Olympiad Whatsapp Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">1st Olympiad Whatsapp Number</Typography>
              <Typography variant="body2">{schoolData.first_incharge_whatsapp || "N/A"}</Typography>
            </Grid>

            {/* 2nd Olympiad Incharge Name */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">2nd Olympiad Incharge Name</Typography>
              <Typography variant="body2">{schoolData.second_incharge_name || "N/A"}</Typography>
            </Grid>

            {/* 2nd Olympiad Contact Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">2nd Olympiad Mobile Number</Typography>
              <Typography variant="body2">{schoolData.second_incharge_number || "N/A"}</Typography>
            </Grid>

            {/* 2nd Olympiad Whatsapp Number */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">2nd Olympiad Whatsapp Number</Typography>
              <Typography variant="body2">{schoolData.second_incharge_whatsapp || "N/A"}</Typography>
            </Grid>

            {/* Junior Student Strength */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold">Junior Student Strength</Typography>
              <Typography variant="body2">{schoolData.junior_student_strength || "N/A"}</Typography>
            </Grid>

            {/* Senior Student Strength */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold">Senior Student Strength</Typography>
              <Typography variant="body2">{schoolData.senior_student_strength || "N/A"}</Typography>
            </Grid>

            {/* Classes */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Classes</Typography>
              <Typography variant="body2">
                {schoolData.classes.length > 0 ? schoolData.classes.join(", ") : "N/A"}
              </Typography>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" fontWeight="bold">Status</Typography>
              <Typography variant="body2">{schoolData.status || "N/A"}</Typography>
            </Grid>
          </Grid>
        </div>
      </Box>
    </Mainlayout>
  );
}