import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Paper,
  Typography,
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
import Mainlayout from "../Layouts/Mainlayout";
import Breadcrumb from "../CommonButton/Breadcrumb";
import styles from "./examReport.module.css";
import axios from "axios";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import MedalsWinnersList from "../Reports/MedalwinnerList";
import { createRoot } from "react-dom/client";

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
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [students, setStudents] = useState([]);
  const [schoolAddress, setSchoolAddress] = useState("");
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
          Array.isArray(response.data)
            ? response.data.map((cls) => ({ value: cls.id, label: cls.name }))
            : []
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
          Array.isArray(response.data)
            ? response.data.map((sub) => ({ value: sub.id, label: sub.name }))
            : []
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
      const response = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        {
          params: filters,
        }
      );
      if (response.data.success) {
        const schoolList =
          response.data.data?.flatMap(
            (location) =>
              location.schools?.map((school) => ({
                id: school.id,
                school_name: school.name,
                country_name: location.country,
                state_name: location.state,
                district_name: location.district,
                city_name: location.city,
              })) || []
          ) || [];
        setSchools(schoolList);
        if (schoolList.length === 0) {
          toast.warn("No schools found for the selected location.");
        }
      } else {
        setSchools([]);
        toast.error(response.data.message || "No schools found.");
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setSchools([]);
      toast.error(error.response?.data?.message || "Failed to fetch schools.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch students
  const fetchStudents = useCallback(
    async (updatePending = false) => {
      if (
        !selectedSchool ||
        !selectedClassIds.length ||
        !selectedSubjectIds.length
      ) {
        setStudents([]);
        setTotalCount(0);
        setFetchError(null);
        return;
      }

      try {
        setIsLoading(true);
        const classIds = selectedClassIds.map(Number);
        const subjectIds = selectedSubjectIds.map(Number);

        if (classIds.some(isNaN) || subjectIds.some(isNaN)) {
          throw new Error("Invalid class or subject ID.");
        }

        const schoolResponse = await axios.get(
          `${API_BASE_URL}/api/get/schools/${selectedSchool}`
        );
        const fetchedSchoolAddress =
          schoolResponse.data?.school_address || "N/A";
        setSchoolAddress(fetchedSchoolAddress);

        const studentResponse = await axios.post(
          `${API_BASE_URL}/api/getFilteredStudentreceipt`,
          {
            schoolId: selectedSchool,
            classIds,
            subjectIds,
            updatePending,
          }
        );

        const fetchedStudents = Array.isArray(studentResponse.data.students)
          ? studentResponse.data.students
          : [];
        const updatedStudents = fetchedStudents.map((student) => ({
          ...student,
          student_subject: Array.isArray(student.student_subject)
            ? student.student_subject
            : [student.subject_name] || ["N/A"],
          status: student.status || "N/A",
          school_address: fetchedSchoolAddress,
        }));

        setStudents(updatedStudents);
        setTotalCount(
          studentResponse.data.totalCount || updatedStudents.length
        );
        setFetchError(null);
        // toast.success(
        //   studentResponse.data.message || "Students fetched successfully."
        // );
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch students or school data.";
        setFetchError(errorMessage);
        setStudents([]);
        setTotalCount(0);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSchool, selectedClassIds, selectedSubjectIds]
  );



  // Handle Download PDF
  const handleDownloadPDF = async () => {
    if (
      !selectedSchool ||
      !selectedClassIds.length ||
      !selectedSubjectIds.length
    ) {
      toast.error(
        "Please select school, classes, and subjects to download PDF"
      );
      return;
    }

    if (students.length === 0) {
      toast.error("No student data available to download");
      return;
    }

    // Group percentages by subject and class for cutoff calculation
    const classSubjectPercentages = selectedClassIds.reduce((acc, classId) => {
      const className =
        classes.find((cls) => cls.value === classId)?.label || classId;
      acc[className] = selectedSubjectIds.reduce((subAcc, subjectId) => {
        const subjectName =
          subjects.find((sub) => sub.value === subjectId)?.label || "N/A";
        subAcc[subjectName] = students
          .filter(
            (student) =>
              student.class_name === className &&
              student.student_subject.includes(subjectName)
          )
          .map((student) => {
            const perc = student.percentage;
            const parsedPerc =
              typeof perc === "number" ? perc : parseFloat(perc);
            return !isNaN(parsedPerc) && parsedPerc >= 60 ? parsedPerc : 0;
          })
          .filter((p) => p !== 0);
        return subAcc;
      }, {});
      return acc;
    }, {});

    // Calculate cutoff percentages per subject and class
    const classCutoff = selectedClassIds.flatMap((classId) => {
      const className =
        classes.find((cls) => cls.value === classId)?.label || classId;
      return selectedSubjectIds.map((subjectId) => {
        const subjectName =
          subjects.find((sub) => sub.value === subjectId)?.label || "N/A";
        const percentages =
          classSubjectPercentages[className][subjectName] || [];
        const sortedPercentages = [...new Set(percentages)].sort(
          (a, b) => b - a
        );

        return {
          class: className,
          subjects: subjectName,
          gold:
            sortedPercentages[0] !== undefined
              ? sortedPercentages[0].toFixed(2) + "%"
              : "N/A",
          silver:
            sortedPercentages[1] !== undefined
              ? sortedPercentages[1].toFixed(2) + "%"
              : "N/A",
          bronze:
            sortedPercentages[2] !== undefined
              ? sortedPercentages[2].toFixed(2) + "%"
              : "N/A",
        };
      });
    });

    // Prepare winners list filtered by selected classes
    const winnersList = students
      .filter((student) =>
        selectedClassIds.includes(
          classes.find((cls) => cls.label === student.class_name)?.value
        )
      )
      .map((student, index) => ({
        slNo: index + 1,
        school: student.school_id,
        name: student.student_name || "N/A",
        rollNo: student.roll_no || "N/A",
        class: student.class_name || "N/A",
        subject: student.student_subject?.join(", ") || "N/A",
        fullMarks: student.full_mark || "N/A",
        securedMarks: student.mark_secured || "N/A",
        percentage: student.percentage || "N/A",
        ranking: student.ranking || "N/A",
        medal: student.medals || "N/A",
        certificate: student.certificate || "N/A",
        remarks: student.remarks || "",
      }));

    const getLocationName = (id, dataArray) => {
      const item = dataArray.find((item) => item.id === id);
      return item ? item.name : "N/A";
    };

    const countryName = getLocationName(selectedCountry, countries);
    const stateName = getLocationName(selectedState, states);
    const districtName = getLocationName(selectedDistrict, districts);
    const cityName = getLocationName(selectedCity, cities);

    const subjectNames = selectedSubjectIds.map(
      (id) => subjects.find((sub) => sub.value === id)?.label || "N/A"
    );

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;

    // Render each subject on a separate page
    for (let i = 0; i < subjectNames.length; i++) {
      const subjectName = subjectNames[i];

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      const component = (
        <MedalsWinnersList
          winnersList={winnersList}
          classCutoff={classCutoff.filter(
            (cutoff) => cutoff.subjects === subjectName
          )}
          schoolName={
            schools.find((s) => s.id === selectedSchool)?.school_name || "N/A"
          }
          schoolAddress={schoolAddress}
          classId={selectedClassIds.join(",")}
          subjectIds={selectedSubjectIds}
          subjectNames={[subjectName]} // Render only this subject
          country={countryName}
          state={stateName}
          district={districtName}
          city={cityName}
          singleSubject={subjectName}
        />
      );

      const root = createRoot(container);
      root.render(component);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) {
        doc.addPage();
      }

      let heightLeft = imgHeight;
      let position = 10;

      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

      // Handle pagination for large content within a subject
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

      document.body.removeChild(container);
      root.unmount();
    }

    doc.save(
      `Result_${
        schools.find((s) => s.id === selectedSchool)?.school_name || "School"
      }_Classes${selectedClassIds.join("_")}_Subjects${subjectNames.join(
        "_"
      )}.pdf`
    );
  };

  const debouncedFetchStudents = useCallback(debounce(fetchStudents, 500), [
    fetchStudents,
  ]);

  useEffect(() => {
    debouncedFetchStudents();
    return () => debouncedFetchStudents.cancel();
  }, [debouncedFetchStudents]);

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
    setSchoolAddress("");
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
    setSchoolAddress("");
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
    setSchoolAddress("");
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
    setSchoolAddress("");
  }, [selectedCity]);

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

  const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
  const handleClassChange = (e) => setSelectedClassIds(e.target.value);
  const handleSubjectChange = (e) => setSelectedSubjectIds(e.target.value);

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

  // Filter students based on selected classes
  const filteredStudents = students.filter((student) =>
    selectedClassIds.includes(
      classes.find((cls) => cls.label === student.class_name)?.value
    )
  );

  // Calculate classCutoff for display in the UI
  const classCutoff = selectedClassIds.flatMap((classId) => {
    const className =
      classes.find((cls) => cls.value === classId)?.label || classId;
    return selectedSubjectIds.map((subjectId) => {
      const subjectName =
        subjects.find((sub) => sub.value === subjectId)?.label || "N/A";
      const percentages = filteredStudents
        .filter(
          (student) =>
            student.class_name === className &&
            student.student_subject.includes(subjectName)
        )
        .map((student) => {
          const perc = student.percentage;
          const parsedPerc = typeof perc === "number" ? perc : parseFloat(perc);
          return !isNaN(parsedPerc) && parsedPerc >= 60 ? parsedPerc : 0;
        })
        .filter((p) => p !== 0);
      const sortedPercentages = [...new Set(percentages)].sort((a, b) => b - a);

      return {
        class: className,
        subjects: subjectName,
        gold:
          sortedPercentages[0] !== undefined
            ? sortedPercentages[0].toFixed(2) + "%"
            : "N/A",
        silver:
          sortedPercentages[1] !== undefined
            ? sortedPercentages[1].toFixed(2) + "%"
            : "N/A",
        bronze:
          sortedPercentages[2] !== undefined
            ? sortedPercentages[2].toFixed(2) + "%"
            : "N/A",
      };
    });
  });

  const paginatedStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Mainlayout>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Exam Result Report", link: "" }]} />
      </div>
      <Container component="main" maxWidth="xl">
        <Paper
          className={`${styles.main}`}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={`${styles.formTitle} mb-4`} variant="h5">
            Exam Result Report
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
                    value: school.id,
                    label: `${school.school_name}`,
                  }))}
                  onChange={handleSchoolChange}
                  disabled={isLoading || !selectedCity}
                />
                {isLoading && <Typography>Loading schools...</Typography>}
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
                  label="Subjects"
                  value={selectedSubjectIds}
                  options={subjects}
                  onChange={handleSubjectChange}
                  disabled={isLoading || !selectedSchool}
                  multiple
                />
              </Grid>
            </Grid>
          </form>

          <Box mt={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" gutterBottom>
               
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadPDF}
                  disabled={isLoading || filteredStudents.length === 0}
                >
                  {isLoading ? "Processing..." : "Download PDF"}
                </Button>
              </Box>
            </Box>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#1d53ddff", }}>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Student</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Class</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Subject</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Roll No</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Full Mark</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Mark Secure</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Percentage</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Ranking</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Medal</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Remark</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}> Certificate</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Level</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={13} align="center">
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
                      <TableCell align="center">
                        {student.level || "N/A"}
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
                    <TableCell colSpan={13} align="center">
                      {selectedSchool &&
                      selectedClassIds.length &&
                      selectedSubjectIds.length
                        ? "No students found for the selected criteria"
                        : "Please select school, classes, and subjects to view students"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {filteredStudents.length > 0 && (
              <Box mt={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Box display="flex" alignItems="center">
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
                    <Typography
                      sx={{ ml: 1 }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Records per page
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="textSecondary">
                    Showing {filteredStudents.length} of {totalCount} records
                    (Page {page} of {Math.ceil(totalCount / pageSize)})
                  </Typography>

                  <Box display="flex" alignItems="center">
                    <Button
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      className={styles.paginationButton}
                    >
                      <UilAngleLeftB />
                    </Button>
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
                          <Button
                            onClick={() => setPage(pg)}
                            className={`${styles.paginationButton} ${
                              page === pg ? styles.activePage : ""
                            }`}
                          >
                            {pg}
                          </Button>
                        </React.Fragment>
                      ))}
                    <Button
                      onClick={handleNextPage}
                      disabled={page === Math.ceil(totalCount / pageSize)}
                      className={styles.paginationButton}
                    >
                      <UilAngleRightB />
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
