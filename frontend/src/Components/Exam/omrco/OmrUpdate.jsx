import React, { useState, useEffect, useCallback } from "react";
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
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import jsPDF from "jspdf";
import "jspdf-autotable";
import OMRSheet50 from "./OMRSheet50";
import OMRSheet60 from "./OMRSheet60";
import ReactDOM from "react-dom";
import html2canvas from "html2canvas";

// Reusable Dropdown Component
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
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

const UpdateExaminationForm = () => {
  // State declarations
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get OMR schedule ID from URL params

  // Location states
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

  // Classes and Subjects states (using IDs)
  const [classes, setClasses] = useState([]); // {id, name}
  const [subjects, setSubjects] = useState([]); // {id, name}
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch initial data (countries, states, districts, cities, classes, subjects)
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [
          countriesRes,
          statesRes,
          districtsRes,
          citiesRes,
          classesRes,
          subjectsRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
          axios.get(`${API_BASE_URL}/api/class`),
          axios.get(`${API_BASE_URL}/api/subject`),
        ]);

        if (isMounted) {
          setCountries(countriesRes.data || []);
          setStates(statesRes.data || []);
          setDistricts(districtsRes.data || []);
          setCities(citiesRes.data || []);
          setClasses(
            (classesRes.data || []).map((cls) => ({
              id: cls.id,
              name: cls.name,
            }))
          );
          setSubjects(
            (subjectsRes.data || []).map((sub) => ({
              id: sub.id,
              name: sub.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setFetchError("Failed to load initial data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch OMR schedule data by ID
  useEffect(() => {
    const fetchOmrData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/omr/get/${id}`);
        const omrData = response.data;

        // Populate form fields with fetched data
        setSelectedCountry(
          countries.find((c) => c.name === omrData.country)?.id || ""
        );
        setSelectedState(
          states.find((s) => s.name === omrData.state)?.id || ""
        );
        setSelectedDistrict(
          districts.find((d) => d.name === omrData.district)?.id || ""
        );
        setSelectedCity(cities.find((c) => c.name === omrData.city)?.id || "");
        setSelectedSchool(omrData.school || "");
        setSelectedClassIds(
          omrData.classes
            ?.map((clsName) => classes.find((c) => c.name === clsName)?.id)
            .filter(Boolean) || []
        );
        setSelectedSubjectIds(
          omrData.subjects
            ?.map((subName) => subjects.find((s) => s.name === subName)?.id)
            .filter(Boolean) || []
        );
        setSelectedLevel(omrData.level || "");
        setSelectedModel(omrData.mode || "");
        setExamDate(omrData.exam_date || "");
        setTotalCount(omrData.student_count || 0);
      } catch (error) {
        console.error("Error fetching OMR data:", error);
        setFetchError("Failed to load OMR schedule data");
      } finally {
        setIsLoading(false);
      }
    };

    if (
      countries.length &&
      states.length &&
      districts.length &&
      cities.length &&
      classes.length &&
      subjects.length
    ) {
      fetchOmrData();
    }
  }, [id, countries, states, districts, cities, classes, subjects]);

  // Location filtering effects
  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    if (!states.find((s) => s.id === selectedState)) {
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedCity("");
      setSelectedSchool("");
    }
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    if (!districts.find((d) => d.id === selectedDistrict)) {
      setSelectedDistrict("");
      setSelectedCity("");
      setSelectedSchool("");
    }
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    if (!cities.find((c) => c.id === selectedCity)) {
      setSelectedCity("");
      setSelectedSchool("");
    }
  }, [selectedDistrict, cities]);

  // Fetch schools
  const fetchSchoolsByLocation = useCallback(async (filters) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/get/filter`, {
        params: filters,
      });
      if (response.data.success) {
        const schoolList = response.data.data.flatMap((location) =>
          location.schools.map((school) => ({
            school_name: school,
            country_name: location.country,
            state_name: location.state,
            district_name: location.district,
            city_name: location.city,
          }))
        );
        setSchools(schoolList);
        setFetchError(null);
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setFetchError("Failed to fetch schools");
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const filters = {
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
      city: selectedCity,
    };
    if (selectedCountry) fetchSchoolsByLocation(filters);
  }, [
    selectedCountry,
    selectedState,
    selectedDistrict,
    selectedCity,
    fetchSchoolsByLocation,
  ]);

  // Fetch student count
  const fetchStudentCount = useCallback(async () => {
    if (
      !selectedSchool ||
      !selectedClassIds.length ||
      !selectedSubjectIds.length
    ) {
      setTotalCount(0);
      setFetchError(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/get/student/filter`,
        {
          schoolName: selectedSchool,
          classList: selectedClassIds,
          subjectList: selectedSubjectIds,
        }
      );

      console.log("Student filter response:", response.data);
      setTotalCount(response.data.totalCount || 0);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching student count:", error);
      setFetchError("Failed to fetch student count");
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSchool, selectedClassIds, selectedSubjectIds]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchStudentCount, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchStudentCount]);

  // Handle Update
  // const handleUpdate = async () => {
  //   if (!totalCount) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "No Students",
  //       text: "Please select valid criteria with available students",
  //     });
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/api/get/student/filter`,
  //       {
  //         schoolName: selectedSchool,
  //         classList: selectedClassIds,
  //         subjectList: selectedSubjectIds,
  //       }
  //     );

  //     console.log("Student data for PDF:", response.data.students);

  //     if (!response.data.students?.length) {
  //       throw new Error("No student data received");
  //     }

  //     // Extract and validate student IDs
  //     const studentIds = response.data.students
  //       .filter((student) => {
  //         if (!student.id || isNaN(student.id)) {
  //           console.warn(
  //             `Student ${
  //               student.student_name || "unknown"
  //             } missing or invalid ID, skipping`
  //           );
  //           return false;
  //         }
  //         return true;
  //       })
  //       .map((student) => Number(student.id)); // Ensure IDs are numbers

  //     if (!studentIds.length) {
  //       throw new Error("No valid student IDs found");
  //     }

  //     // Validate payload fields
  //     const countryName = countries.find((c) => c.id === selectedCountry)?.name;
  //     const stateName = filteredStates.find(
  //       (s) => s.id === selectedState
  //     )?.name;
  //     const districtName = filteredDistricts.find(
  //       (d) => d.id === selectedDistrict
  //     )?.name;
  //     const cityName = filteredCities.find((c) => c.id === selectedCity)?.name;

  //     if (!countryName || !stateName || !districtName || !cityName) {
  //       throw new Error(
  //         "Missing location data (country, state, district, or city)"
  //       );
  //     }

  //     if (!selectedLevel || !selectedModel) {
  //       throw new Error("Level or Mode is not selected");
  //     }

  //     await generatePDF(response.data.students);

  //     const payload = {
  //       id, // Include the OMR schedule ID
  //       country: countryName,
  //       state: stateName,
  //       district: districtName,
  //       city: cityName,
  //       school: selectedSchool,
  //       classes: selectedClassIds.map(
  //         (id) =>
  //           classes.find((c) => c.id === id)?.name || `Unknown Class ${id}`
  //       ),
  //       subjects: selectedSubjectIds.map(
  //         (id) =>
  //           subjects.find((s) => s.id === id)?.name || `Unknown Subject ${id}`
  //       ),
  //       student_count: studentIds.length,
  //       level: selectedLevel,
  //       mode: selectedModel,
  //       generation_date: new Date().toISOString(),
  //       exam_date: examDate || new Date().toISOString().split("T")[0],
  //       students: JSON.stringify(studentIds), // Send array of student IDs
  //     };

  //     console.log("Payload to /api/omr/update:", payload);

  //     await axios.put(`${API_BASE_URL}/api/omr/update/${id}`, payload);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: `OMR schedule updated successfully with ${studentIds.length} students`,
  //     });
  //     navigate("/omr-list");
  //   } catch (error) {
  //     console.error("Error in handleUpdate:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Failed to update OMR schedule",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleUpdate = async () => {
    if (!totalCount) {
      Swal.fire({
        icon: "warning",
        title: "No Students",
        text: "Please select valid criteria with available students",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: "Generating OMR Schedule...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/get/student/filter`,
        {
          schoolName: selectedSchool,
          classList: selectedClassIds,
          subjectList: selectedSubjectIds,
        }
      );

      console.log("Student data for PDF:", response.data.students);

      if (!response.data.students?.length) {
        throw new Error("No student data received");
      }

      // Extract and validate student IDs
      const studentIds = response.data.students
        .filter((student) => {
          if (!student.id || isNaN(student.id)) {
            console.warn(
              `Student ${
                student.student_name || "unknown"
              } missing or invalid ID, skipping`
            );
            return false;
          }
          return true;
        })
        .map((student) => Number(student.id)); // Ensure IDs are numbers

      if (!studentIds.length) {
        throw new Error("No valid student IDs found");
      }

      // Validate payload fields
      const countryName = countries.find((c) => c.id === selectedCountry)?.name;
      const stateName = filteredStates.find(
        (s) => s.id === selectedState
      )?.name;
      const districtName = filteredDistricts.find(
        (d) => d.id === selectedDistrict
      )?.name;
      const cityName = filteredCities.find((c) => c.id === selectedCity)?.name;

      if (!countryName || !stateName || !districtName || !cityName) {
        throw new Error(
          "Missing location data (country, state, district, or city)"
        );
      }

      if (!selectedLevel || !selectedModel) {
        throw new Error("Level or Mode is not selected");
      }

      await generatePDF(response.data.students);

      const payload = {
        id, // Include the OMR schedule ID
        country: countryName,
        state: stateName,
        district: districtName,
        city: cityName,
        school: selectedSchool,
        classes: selectedClassIds.map(
          (id) =>
            classes.find((c) => c.id === id)?.name || `Unknown Class ${id}`
        ),
        subjects: selectedSubjectIds.map(
          (id) =>
            subjects.find((s) => s.id === id)?.name || `Unknown Subject ${id}`
        ),
        student_count: studentIds.length,
        level: selectedLevel,
        mode: selectedModel,
        generation_date: new Date().toISOString(),
        exam_date: examDate || new Date().toISOString().split("T")[0],
        students: JSON.stringify(studentIds), // Send array of student IDs
      };

      console.log("Payload to /api/omr/update:", payload);

      await axios.put(`${API_BASE_URL}/api/omr/update/${id}`, payload);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `OMR schedule updated successfully with ${studentIds.length} students`,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "View OMR List",
        timer: 3000, // Auto-close after 3 seconds
        timerProgressBar: true, // Show progress bar
        showClass: {
          popup: "animate__animated animate__fadeInDown", // Animation for popup
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp", // Animation for closing
        },
      }).then(() => {
        navigate("/omr-list"); // Navigate after the success alert closes
      });
    } catch (error) {
      console.error("Error in handleUpdate:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          error.message ||
          "Failed to update OMR schedule",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // PDF Generation - Include studentId prop
  const generatePDF = async (students) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let validStudents = 0;
    for (let i = 0; i < students.length; i++) {
      if (
        !students[i].id ||
        !students[i].student_name ||
        !students[i].roll_no ||
        !students[i].class_name
      ) {
        console.warn(
          `Skipping invalid student data at index ${i}:`,
          students[i]
        );
        continue;
      }

      validStudents++;
      if (validStudents > 1) doc.addPage();
      const OMRComponent = getOMRSheetComponent(students[i].class_name);
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "210mm";
      tempDiv.style.height = "298mm";
      document.body.appendChild(tempDiv);

      // Calculate subject IDs based on subject_names if available, otherwise use selectedSubjectIds
      const subjectIds = students[i].subject_names
        ? students[i].subject_names
            .split(",")
            .map((name) => {
              const subject = subjects.find((s) => s.name === name.trim());
              return subject ? subject.id : name;
            })
            .filter(Boolean)
            .join(", ")
        : selectedSubjectIds.join(", ");

      // Calculate class ID based on class_name
      const classId = students[i].class_name
        ? (() => {
            const cls = classes.find((c) => c.name === students[i].class_name);
            return cls ? cls.id : students[i].class_name;
          })()
        : selectedClassIds[0]; // Fallback to first selected class ID

      ReactDOM.render(
        <OMRComponent
          schoolName={selectedSchool}
          student={students[i].student_name}
          studentId={students[i].id}
          level={selectedLevel}
          subject={students[i].subject_names || ""}
          subjectIds={subjectIds}
          className={students[i].class_name}
          classId={classId}
          date={examDate || new Date().toLocaleDateString()}
          rollNumber={students[i].roll_no}
        />,
        tempDiv
      );

      await html2canvas(tempDiv, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.1);
        const imgWidth = doc.internal.pageSize.getWidth() - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
        document.body.removeChild(tempDiv);
      });
    }

    if (validStudents === 0) {
      throw new Error("No valid student data to generate PDF");
    }

    doc.save(
      `OMR_Sheets_${selectedSchool.replace(/ /g, "_")}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  };

  const getOMRSheetComponent = (className) => {
    const lowerClasses = ["01", "02", "03", "1", "2", "3"];
    const classNumber = className ? className.replace(/\D/g, "") : "";
    return lowerClasses.includes(classNumber) ? OMRSheet50 : OMRSheet60;
  };

  // Options
  const dropdownOptions = {
    countries: countries.map((c) => ({ value: c.id, label: c.name })),
    states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
    districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
    cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
    schools: schools.map((s) => ({
      value: s.school_name,
      label: `${s.school_name} (${s.city_name || ""})`,
    })),
    classes: classes.map((c) => ({ value: c.id, label: c.name })),
    subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
    levels: [
      { value: "1", label: "Level 1" },
      { value: "2", label: "Level 2" },
      { value: "3", label: "Level 3" },
      { value: "4", label: "Level 4" },
    ],
    modes: [
      { value: "Online", label: "Online" },
      { value: "Offline", label: "Offline" },
    ],
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[{ name: "OMR", link: "/omr-list" }, { name: "Update OMR" }]}
        />
      </div>
      <Container component="main" maxWidth="">
        <Paper
          className={styles.main}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={`${styles.formTitle} mb-4`}>
            Update OMR Schedule
          </Typography>
          {fetchError && (
            <Typography color="error" className="mb-3">
              {fetchError}
            </Typography>
          )}
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Country"
                  value={selectedCountry}
                  options={dropdownOptions.countries}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={dropdownOptions.states}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry || isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={dropdownOptions.districts}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState || isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="City"
                  value={selectedCity}
                  options={dropdownOptions.cities}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDistrict || isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="School"
                  value={selectedSchool}
                  options={dropdownOptions.schools}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  disabled={isLoading || !selectedCity}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Classes</InputLabel>
                  <Select
                    multiple
                    value={selectedClassIds}
                    onChange={(e) => setSelectedClassIds(e.target.value)}
                    label="Classes"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => (
                          <Chip
                            key={id}
                            label={classes.find((c) => c.id === id)?.name || id}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Subjects</InputLabel>
                  <Select
                    multiple
                    value={selectedSubjectIds}
                    onChange={(e) => setSelectedSubjectIds(e.target.value)}
                    label="Subjects"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => (
                          <Chip
                            key={id}
                            label={
                              subjects.find((s) => s.id === id)?.name || id
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {subjects.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Level"
                  value={selectedLevel}
                  options={dropdownOptions.levels}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Mode"
                  value={selectedModel}
                  options={dropdownOptions.modes}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Box mt={3} mb={3}>
              {totalCount > 0 ? (
                <Typography variant="h6" color="primary">
                  Total Students: {totalCount}
                </Typography>
              ) : (
                selectedSchool &&
                selectedClassIds.length > 0 &&
                selectedSubjectIds.length > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    No students found matching the criteria
                  </Typography>
                )
              )}
            </Box>

            <Box
              className={`${styles.buttonContainer} gap-2 mt-4`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                disabled={
                  !selectedSchool ||
                  !selectedClassIds.length ||
                  !selectedSubjectIds.length ||
                  !selectedLevel ||
                  !selectedModel ||
                  isLoading ||
                  !totalCount
                }
                text={isLoading ? "Processing..." : "Download OMR Schedule"}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                onClick={() => navigate("/omr-list")}
                disabled={isLoading}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </form>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default UpdateExaminationForm;
