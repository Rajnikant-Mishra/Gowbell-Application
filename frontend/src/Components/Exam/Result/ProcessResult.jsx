import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import MedalsWinnersList from "../../Exam/Result/MedalwinnerList";
import ReactDOM from "react-dom";

const Dropdown = ({ label, value, options, onChange, disabled, multiple }) => (
  <FormControl fullWidth margin="normal" size="small" disabled={disabled}>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      value={value}
      onChange={onChange}
      multiple={multiple}
      renderValue={(selected) =>
        multiple
          ? options
              .filter((opt) => selected.includes(opt.value))
              .map((opt) => opt.label)
              .join(", ")
          : options.find((opt) => opt.value === selected)?.label || ""
      }
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const ExaminationForm = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]); // Changed to array
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const pageSizes = [5, 10, 25, 50];
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState(null);
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

  const navigate = useNavigate();

  // Fetch initial location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [countriesRes, statesRes, districtsRes, citiesRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/countries`),
            axios.get(`${API_BASE_URL}/api/states`),
            axios.get(`${API_BASE_URL}/api/districts`),
            axios.get(`${API_BASE_URL}/api/cities/all/c1`),
          ]);
        setCountries(
          Array.isArray(countriesRes?.data) ? countriesRes.data : []
        );
        setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
        setDistricts(
          Array.isArray(districtsRes?.data) ? districtsRes.data : []
        );
        setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
      } catch (error) {
        console.error("Error fetching location data:", error);
        toast.error("Failed to fetch location data.");
      }
    };
    fetchLocationData();
  }, []);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/class`);
        setClasses(
          response.data.map((cls) => ({ value: cls.id, label: cls.name }))
        );
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
        toast.error("Failed to fetch classes.");
      }
    };
    fetchClasses();
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/subject`);
        setSubjects(
          response.data.map((sub) => ({ value: sub.id, label: sub.name }))
        );
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
        toast.error("Failed to fetch subjects.");
      }
    };
    fetchSubjects();
  }, []);

  // Fetch schools based on location filters
  const fetchSchoolsByLocation = async (filters) => {
    setIsLoading(true);
    try {
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
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setSchools([]);
      toast.error("Failed to fetch schools.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch students
  const fetchStudents = useCallback(async () => {
    if (!selectedSchool || !selectedClassIds.length || !selectedSubjectId) {
      setStudents([]);
      setTotalCount(0);
      setFetchError(null);
      return;
    }

    try {
      setIsLoading(true);
      const classIds = selectedClassIds.map(Number);
      const subjectId = Number(selectedSubjectId);

      if (classIds.some(isNaN) || isNaN(subjectId)) {
        throw new Error("Invalid class or subject ID.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/getFilteredStudentreceipt`,
        {
          schoolName: selectedSchool,
          classIds, // Send as array
          subjectId,
        }
      );

      const fetchedStudents = response.data.students || [];
      const updatedStudents = fetchedStudents.map((student) => ({
        ...student,
        student_subject: Array.isArray(student.student_subject)
          ? student.student_subject
          : student.subject_names
          ? student.subject_names.split(", ")
          : [student.subject_name || "N/A"],
        status: student.status || "N/A",
      }));

      setStudents(updatedStudents);
      setTotalCount(response.data.totalCount || updatedStudents.length);
      setFetchError(null);
    } catch (error) {
      console.error(
        "Error fetching students:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch students.";
      setFetchError(errorMessage);
      setStudents([]);
      setTotalCount(0);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSchool, selectedClassIds, selectedSubjectId]);

  // Handle Generate Rank
  const handleGenerateRank = async () => {
    if (!selectedSchool || !selectedClassIds.length || !selectedSubjectId) {
      toast.error("Please select school, classes, and subject first");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/update-pending-percentages`,
        {
          schoolName: selectedSchool,
          classIds: selectedClassIds.map(Number), // Send as array
          subjectId: Number(selectedSubjectId),
        }
      );

      toast.success(
        response.data.message || "Rank and percentages updated successfully"
      );

      await fetchStudents();
    } catch (error) {
      console.error("Error updating pending percentages:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to update rankings and percentages";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Download PDF
  // const handleDownloadPDF = async () => {
  //   if (!selectedSchool || !selectedClassIds.length || !selectedSubjectId) {
  //     toast.error("Please select school, classes, and subject to download PDF");
  //     return;
  //   }

  //   if (students.length === 0) {
  //     toast.error("No student data available to download");
  //     return;
  //   }

  //   const winnersList = students.map((student, index) => ({
  //     slNo: index + 1,
  //     name: student.student_name || "N/A",
  //     rollNo: student.roll_no || "N/A",
  //     class: student.class_name || "N/A",
  //     fullMarks: student.full_mark || "N/A",
  //     securedMarks: student.mark_secured || "N/A",
  //     percentage: student.percentage || "N/A",
  //     ranking: student.ranking || "N/A",
  //     medal: student.medals || "N/A",
  //     certificate: student.certificate || "N/A",
  //   }));

  //   const medalsTally = [
  //     { medal: "Gold", quantity: students.filter((s) => s.medals === "Gold").length },
  //     { medal: "Silver", quantity: students.filter((s) => s.medals === "Silver").length },
  //     { medal: "Bronze", quantity: students.filter((s) => s.medals === "Bronze").length },
  //   ];

  //   const classCutoff = selectedClassIds.map((classId) => ({
  //     class: classes.find((cls) => cls.value === classId)?.label || classId,
  //     gold: students.filter((s) => s.medals === "Gold" && s.class_id === classId).length,
  //     silver: students.filter((s) => s.medals === "Silver" && s.class_id === classId).length,
  //     bronze: students.filter((s) => s.medals === "Bronze" && s.class_id === classId).length,
  //   }));

  //   const container = document.createElement("div");
  //   container.style.position = "absolute";
  //   container.style.left = "-9999px";
  //   document.body.appendChild(container);

  //   const component = (
  //     <MedalsWinnersList
  //       medalsTally={medalsTally}
  //       classCutoff={classCutoff}
  //       winnersList={winnersList}
  //       schoolName={selectedSchool}
  //       classId={selectedClassIds.join(",")} // Join for display
  //       subjectId={selectedSubjectId}
  //     />
  //   );

  //   ReactDOM.render(component, container);

  //   const canvas = await html2canvas(container, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");

  //   const doc = new jsPDF({
  //     orientation: "portrait",
  //     unit: "mm",
  //     format: "a4",
  //   });

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();
  //   const imgWidth = pageWidth - 20;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   let heightLeft = imgHeight;
  //   let position = 10;

  //   doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

  //   heightLeft -= pageHeight - 20;
  //   while (heightLeft > 0) {
  //     doc.addPage();
  //     position = heightLeft - imgHeight;
  //     doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
  //   }

  //   doc.setFontSize(10);
  //   doc.text(
  //     `Generated on: ${new Date().toLocaleDateString()}`,
  //     14,
  //     pageHeight - 10
  //   );

  //   doc.save(
  //     `Result_${selectedSchool}_Classes${selectedClassIds.join("_")}_Subject${selectedSubjectId}.pdf`
  //   );

  //   document.body.removeChild(container);
  // };

  // Helper functions to get location names from IDs
  const getLocationName = (id, dataArray) => {
    const item = dataArray.find((item) => item.id === id);
    return item ? item.name : "";
  };

  const handleDownloadPDF = async () => {
    if (!selectedSchool || !selectedClassIds.length || !selectedSubjectId) {
      toast.error("Please select school, classes, and subject to download PDF");
      return;
    }

    if (students.length === 0) {
      toast.error("No student data available to download");
      return;
    }

    const winnersList = students.map((student, index) => ({
      slNo: index + 1,
      name: student.student_name || "N/A",
      rollNo: student.roll_no || "N/A",
      class: student.class_name || "N/A",
      fullMarks: student.full_mark || "N/A",
      securedMarks: student.mark_secured || "N/A",
      percentage: student.percentage || "N/A",
      ranking: student.ranking || "N/A",
      medal: student.medals || "N/A",
      certificate: student.certificate || "N/A",
    }));

    const medalsTally = [
      {
        medal: "Gold",
        quantity: students.filter((s) => s.medals === "Gold").length,
      },
      {
        medal: "Silver",
        quantity: students.filter((s) => s.medals === "Silver").length,
      },
      {
        medal: "Bronze",
        quantity: students.filter((s) => s.medals === "Bronze").length,
      },
    ];

    const classCutoff = selectedClassIds.map((classId) => ({
      class: classes.find((cls) => cls.value === classId)?.label || classId,
      gold: students.filter(
        (s) => s.medals === "Gold" && s.class_id === classId
      ).length,
      silver: students.filter(
        (s) => s.medals === "Silver" && s.class_id === classId
      ).length,
      bronze: students.filter(
        (s) => s.medals === "Bronze" && s.class_id === classId
      ).length,
    }));

    // Get location names
    const countryName = getLocationName(selectedCountry, countries);
    const stateName = getLocationName(selectedState, states);
    const districtName = getLocationName(selectedDistrict, districts);
    const cityName = getLocationName(selectedCity, cities);

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    const component = (
      <MedalsWinnersList
        medalsTally={medalsTally}
        classCutoff={classCutoff}
        winnersList={winnersList}
        schoolName={selectedSchool}
        classId={selectedClassIds.join(",")} // Join for display
        subjectId={selectedSubjectId}
        country={countryName} // Pass location names
        state={stateName}
        district={districtName}
        city={cityName}
      />
    );

    ReactDOM.render(component, container);

    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

    heightLeft -= pageHeight - 20;
    while (heightLeft > 0) {
      doc.addPage();
      position = heightLeft - imgHeight;
      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      pageHeight - 10
    );

    doc.save(
      `Result_${selectedSchool}_Classes${selectedClassIds.join(
        "_"
      )}_Subject${selectedSubjectId}.pdf`
    );

    document.body.removeChild(container);
  };

  const debouncedFetchStudents = useCallback(debounce(fetchStudents, 500), [
    fetchStudents,
  ]);

  useEffect(() => {
    debouncedFetchStudents();
    return () => debouncedFetchStudents.cancel();
  }, [debouncedFetchStudents]);

  // Location filter effects
  useEffect(() => {
    if (selectedCountry) {
      setFilteredStates(
        states.filter((state) => state.country_id === selectedCountry)
      );
      fetchSchoolsByLocation({ country: selectedCountry });
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setStudents([]);
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState) {
      setFilteredDistricts(
        districts.filter((district) => district.state_id === selectedState)
      );
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
      });
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setStudents([]);
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      setFilteredCities(
        cities.filter((city) => city.district_id === selectedDistrict)
      );
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
      });
    }
    setSelectedCity("");
    setSelectedSchool("");
    setStudents([]);
  }, [selectedDistrict, cities]);

  useEffect(() => {
    if (selectedCity) {
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
        city: selectedCity,
      });
    }
    setSelectedSchool("");
    setStudents([]);
  }, [selectedCity]);

  // Dropdown options
  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: country.name,
  }));
  const stateOptions = filteredStates.map((state) => ({
    value: state.id,
    label: state.name,
  }));
  const districtOptions = filteredDistricts.map((district) => ({
    value: district.id,
    label: district.name,
  }));
  const cityOptions = filteredCities.map((city) => ({
    value: city.id,
    label: city.name,
  }));

  // Event handlers
  const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
  const handleClassChange = (e) => setSelectedClassIds(e.target.value); // Handles array
  const handleSubjectChange = (e) => setSelectedSubjectId(e.target.value);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < Math.ceil(totalCount / pageSize)) setPage(page + 1);
  };

  const getStatusStyle = (status) => ({
    color: status.toLowerCase() === "success" ? "green" : "red",
    fontWeight: "bold",
  });

  const paginatedStudents = students.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Mainlayout>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Process Result", link: "" }]} />
      </div>
      <Container component="main" maxWidth="">
        <Paper
          className={`${styles.main}`}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={`${styles.formTitle} mb-4`}>
            Process Result
          </Typography>
          {fetchError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {fetchError}
            </Typography>
          )}
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Country"
                  value={selectedCountry}
                  options={countryOptions}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={stateOptions}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={districtOptions}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="City"
                  value={selectedCity}
                  options={cityOptions}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDistrict}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="School"
                  value={selectedSchool}
                  options={schools.map((school) => ({
                    value: school.school_name,
                    label: `${school.school_name} ${
                      school.city_name ? `(${school.city_name})` : ""
                    }`,
                  }))}
                  onChange={handleSchoolChange}
                  disabled={isLoading || !selectedCity}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Classes"
                  value={selectedClassIds}
                  options={classes}
                  onChange={handleClassChange}
                  disabled={isLoading || !selectedSchool}
                  multiple
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Subject"
                  value={selectedSubjectId}
                  options={subjects}
                  onChange={handleSubjectChange}
                  disabled={isLoading || !selectedSchool}
                />
              </Grid>
            </Grid>
          </form>

          <Box mt={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" gutterBottom>
                Students
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateRank}
                  disabled={isLoading}
                  sx={{ mr: 2 }}
                >
                  {isLoading ? "Processing..." : "Generate Rank"}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadPDF}
                  disabled={isLoading || students.length === 0}
                >
                  {isLoading ? "Processing..." : "Download PDF"}
                </Button>
              </Box>
            </Box>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell align="center">STUDENT</TableCell>
                  <TableCell align="center">CLASS</TableCell>
                  <TableCell align="center">SUBJECT</TableCell>
                  <TableCell align="center">ROLL NO</TableCell>
                  <TableCell align="center">FULL MARK</TableCell>
                  <TableCell align="center">MARK SECURED</TableCell>
                  <TableCell align="center">PERCENTAGE</TableCell>
                  <TableCell align="center">RANKING</TableCell>
                  <TableCell align="center">MEDAL</TableCell>
                  <TableCell align="center">REMARK</TableCell>
                  <TableCell align="center">CERTIFICATE</TableCell>
                  <TableCell align="center">STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, index) => (
                    <TableRow key={student.roll_no || index}>
                      <TableCell align="center">
                        {student.student_name || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.class_name || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.student_subject?.length > 0
                          ? student.student_subject
                              .map(
                                (subject) =>
                                  subject.charAt(0).toUpperCase() +
                                  subject.slice(1)
                              )
                              .join(", ")
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.roll_no || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.full_mark || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.mark_secured || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.percentage || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.ranking || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.medals || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.remarks || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {student.certificate || "N/A"}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={getStatusStyle(student.status)}
                      >
                        {student.status || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      {selectedSchool &&
                      selectedClassIds.length &&
                      selectedSubjectId
                        ? "No students found for the selected criteria"
                        : "Please select school, classes, and subject to view students"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {students.length > 0 && (
              <Box mt={2}>
                <div className="d-flex justify-content-between flex-wrap mt-2">
                  <div
                    className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
                  >
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        const selectedSize = parseInt(e.target.value, 10);
                        setPageSize(selectedSize);
                        setPage(1);
                      }}
                      className={styles.pageSizeSelect}
                    >
                      {pageSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <p className="my-auto text-secondary">data per Page</p>
                  </div>

                  <div className="my-0 d-flex justify-content-center align-items-center my-auto">
                    <label style={{ fontFamily: "Nunito, sans-serif" }}>
                      <p className="my-auto text-secondary">
                        {students.length} of {page}-
                        {Math.ceil(totalCount / pageSize)}
                      </p>
                    </label>
                  </div>

                  <div className={`${styles.pagination} my-auto`}>
                    <button
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      className={styles.paginationButton}
                    >
                      <UilAngleLeftB />
                    </button>

                    {Array.from(
                      { length: Math.ceil(totalCount / pageSize) },
                      (_, i) => i + 1
                    )
                      .filter(
                        (pg) =>
                          pg === 1 ||
                          pg === Math.ceil(totalCount / pageSize) ||
                          Math.abs(pg - page) <= 2
                      )
                      .map((pg, index, array) => (
                        <React.Fragment key={pg}>
                          {index > 0 && pg > array[index - 1] + 1 && (
                            <span className={styles.ellipsis}>...</span>
                          )}
                          <button
                            onClick={() => setPage(pg)}
                            className={`${styles.paginationButton} ${
                              page === pg ? styles.activePage : ""
                            }`}
                          >
                            {pg}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      onClick={handleNextPage}
                      disabled={page === Math.ceil(totalCount / pageSize)}
                      className={styles.paginationButton}
                    >
                      <UilAngleRightB />
                    </button>
                  </div>
                </div>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
