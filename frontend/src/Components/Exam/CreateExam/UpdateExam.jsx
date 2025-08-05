import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Box,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./Exam.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
};

const Dropdown = ({ label, value, options, onChange, disabled }) => (
  <TextField
    select
    label={label}
    variant="outlined"
    fullWidth
    margin="normal"
    size="small"
    value={value}
    onChange={onChange}
    disabled={disabled}
  >
    {options.map((option, index) => (
      <MenuItem key={index} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

const ExamUpdatedForm = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  // Fetch location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [countriesRes, statesRes, districtsRes, citiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);
        setCountries(Array.isArray(countriesRes?.data) ? countriesRes.data : []);
        setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
        setDistricts(Array.isArray(districtsRes?.data) ? districtsRes.data : []);
        setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setCountries([]);
        setStates([]);
        setDistricts([]);
        setCities([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch location data. Please try again.",
          confirmButtonColor: "#d33",
        });
      }
    };
    fetchLocationData();
  }, []);

  // Fetch classes data
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/class`);
        if (response.data && Array.isArray(response.data)) {
          setClasses(
            response.data.map((cls) => ({
              value: cls.id,
              label: cls.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      }
    };
    fetchClasses();
  }, []);

  // Fetch subjects data
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/subject`);
        if (response.data && Array.isArray(response.data)) {
          setSubjects(
            response.data.map((sub) => ({
              value: sub.id,
              label: sub.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      if (!id) {
        setError("No exam ID provided.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/e1/get/exam/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const examData = response.data.data || response.data;

        setSelectedSchoolId(examData.school || "");
        setSelectedLevel(examData.level || "");
        setExamDate(formatDateForInput(examData.exam_date));
        setSelectedClassIds(
          examData.classes ? JSON.parse(examData.classes) : []
        );
        setSelectedSubjectIds(
          examData.subjects ? JSON.parse(examData.subjects) : []
        );

        // Set location IDs
        setSelectedCountry(examData.country || "");
        setSelectedState(examData.state || "");
        setSelectedDistrict(examData.district || "");
        setSelectedCity(examData.city || "");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load exam data.");
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to load exam data.",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, [id]);

  // Filter states
  useEffect(() => {
    if (selectedCountry && Array.isArray(states)) {
      const filtered = states.filter((state) => state.country_id === selectedCountry);
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolId("");
    setSchools([]);
  }, [selectedCountry, states]);

  // Filter districts
  useEffect(() => {
    if (selectedState && Array.isArray(districts)) {
      const filtered = districts.filter((district) => district.state_id === selectedState);
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolId("");
    setSchools([]);
  }, [selectedState, districts]);

  // Filter cities
  useEffect(() => {
    if (selectedDistrict && Array.isArray(cities)) {
      const filtered = cities.filter((city) => city.district_id === selectedDistrict);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
    setSelectedCity("");
    setSelectedSchoolId("");
    setSchools([]);
  }, [selectedDistrict, cities]);

  // Fetch schools
  useEffect(() => {
    const fetchSchoolsByLocation = async () => {
      if (!selectedCountry || !selectedState || !selectedDistrict || !selectedCity) {
        setSchools([]);
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/get/school-filter`, {
          params: {
            country: selectedCountry,
            state: selectedState,
            district: selectedDistrict,
            city: selectedCity,
          },
        });
        if (response.data.success) {
          const schoolList = response.data.data.flatMap((location) =>
            location.schools.map((school) => ({
              id: school.id,
              name: school.name,
              country_name: location.country,
              state_name: location.state,
              district_name: location.district,
              city_name: location.city,
            }))
          );
          setSchools(schoolList);
        } else {
          setSchools([]);
          Swal.fire({
            icon: "warning",
            title: "No Schools Found",
            text: "No schools found for the selected location.",
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch schools. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCity) {
      fetchSchoolsByLocation();
    }
  }, [selectedCity]);

  // Handlers
  const handleSchoolChange = (e) => setSelectedSchoolId(e.target.value);
  const handleClassesChange = (e) => setSelectedClassIds(e.target.value);
  const handleSubjectsChange = (e) => setSelectedSubjectIds(e.target.value);
  const handleExamDateChange = (e) => setExamDate(e.target.value);

  // Prepare dropdown options
  const countryOptions = Array.isArray(countries)
    ? countries.map((country) => ({
        value: country.id,
        label: country.name,
      }))
    : [];
  const stateOptions = Array.isArray(filteredStates)
    ? filteredStates.map((state) => ({
        value: state.id,
        label: state.name,
      }))
    : [];
  const districtOptions = Array.isArray(filteredDistricts)
    ? filteredDistricts.map((district) => ({
        value: district.id,
        label: district.name,
      }))
    : [];
  const cityOptions = Array.isArray(filteredCities)
    ? filteredCities.map((city) => ({
        value: city.id,
        label: city.name,
      }))
    : [];

  // Handle update
  const handleUpdate = async () => {
    if (
      !selectedSchoolId ||
      !examDate ||
      selectedClassIds.length === 0 ||
      selectedSubjectIds.length === 0
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to update the exam.",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
      return;
    }

    const examData = {
      school: selectedSchoolId,
      level: selectedLevel,
      exam_date: examDate,
      classes: JSON.stringify(selectedClassIds),
      subjects: JSON.stringify(selectedSubjectIds),
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
      city: selectedCity,
    };

    try {
      setIsLoading(true);
      setError(null);
      await axios.put(`${API_BASE_URL}/api/e1/update-exam/${id}`, examData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: "Exam updated successfully!",
        showConfirmButton: false,
        timer: 1000,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
      navigate("/examList");
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update exam. Please try again.",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Exam", link: "/examList" },
            { name: "Update Exam Schedule" },
          ]}
        />
      </div>
      <Container
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Paper
          className={styles.main}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={styles.formTitle} sx={{ mb: 4 }}>
            Update Exam Schedule
          </Typography>
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* Location fields */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Country"
                  value={selectedCountry}
                  options={countryOptions}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={stateOptions}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={isLoading || !selectedCountry}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={districtOptions}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={isLoading || !selectedState}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="City"
                  value={selectedCity}
                  options={cityOptions}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={isLoading || !selectedDistrict}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {/* School Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="School"
                  value={selectedSchoolId}
                  options={schools.map((school) => ({
                    value: school.id,
                    label: `${school.name} ${school.city_name ? `(${school.city_name})` : ""}`,
                  }))}
                  onChange={handleSchoolChange}
                  disabled={isLoading || !selectedCity}
                />
              </Grid>
              {/* Classes Multi-Select Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="classes-label">Classes</InputLabel>
                  <Select
                    labelId="classes-label"
                    id="classes-select"
                    multiple
                    value={selectedClassIds}
                    onChange={handleClassesChange}
                    label="Classes"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const selectedClass = classes.find((c) => c.value === value);
                          return (
                            <Chip
                              key={value}
                              label={selectedClass ? selectedClass.label : value}
                              size="small"
                            />
                          );
                        })}
                      </Box>
                    )}
                    disabled={isLoading}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.value} value={cls.value}>
                        {cls.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Subjects Multi-Select Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="subjects-label">Subjects</InputLabel>
                  <Select
                    labelId="subjects-label"
                    id="subjects-select"
                    multiple
                    value={selectedSubjectIds}
                    onChange={handleSubjectsChange}
                    label="Subjects"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const selectedSubject = subjects.find((s) => s.value === value);
                          return (
                            <Chip
                              key={value}
                              label={selectedSubject ? selectedSubject.label : value}
                              size="small"
                            />
                          );
                        })}
                      </Box>
                    )}
                    disabled={isLoading}
                  >
                    {subjects.map((sub) => (
                      <MenuItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Level Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Level"
                  value={selectedLevel}
                  options={[
                    { value: "Level 1", label: "Level 1" },
                    { value: "Level 2", label: "Level 2" },
                    { value: "Level 3", label: "Level 3" },
                    { value: "Level 4", label: "Level 4" },
                  ]}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              {/* Exam Date Input */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Exam Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={examDate}
                  onChange={handleExamDateChange}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </form>
          {/* Error message */}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {/* Update and Cancel Buttons */}
          <Box
            className={styles.buttonContainer}
            sx={{ display: "flex", gap: 2, mt: 4 }}
          >
            <ButtonComp
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              onClick={handleUpdate}
              disabled={
                !selectedSchoolId ||
                !examDate ||
                selectedClassIds.length === 0 ||
                selectedSubjectIds.length === 0 ||
                isLoading
              }
              text={isLoading ? "Processing..." : "Update"}
              sx={{ flexGrow: 1 }}
            />
            <ButtonComp
              text="Cancel"
              type="button"
              sx={{ flexGrow: 1 }}
              onClick={() => navigate("/examList")}
              disabled={isLoading}
            />
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExamUpdatedForm;


