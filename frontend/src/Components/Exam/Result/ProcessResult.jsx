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

const ExaminationForm = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
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
    if (!selectedSchool || !selectedClassId || !selectedSubjectId) {
      setStudents([]);
      setTotalCount(0);
      setFetchError(null);
      return;
    }

    try {
      setIsLoading(true);
      const classId = Number(selectedClassId);
      const subjectId = Number(selectedSubjectId);

      if (isNaN(classId) || isNaN(subjectId)) {
        throw new Error("Invalid class or subject ID.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/getFilteredStudentreceipt`,
        {
          schoolName: selectedSchool,
          classId,
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
  }, [selectedSchool, selectedClassId, selectedSubjectId]);

  // Handle Generate Rank
  const handleGenerateRank = async () => {
    if (!selectedSchool || !selectedClassId || !selectedSubjectId) {
      toast.error("Please select school, class, and subject first");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/update-pending-percentages`,
        {
          schoolName: selectedSchool,
          classId: Number(selectedClassId),
          subjectId: Number(selectedSubjectId),
        }
      );

      toast.success(
        response.data.message || "Rank and percentages updated successfully"
      );

      // Refresh student data after updating
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
  // const handleDownloadPDF = () => {
  //   if (!selectedSchool || !selectedClassId || !selectedSubjectId) {
  //     toast.error("Please select school, class, and subject to download PDF");
  //     return;
  //   }

  //   if (students.length === 0) {
  //     toast.error("No student data available to download");
  //     return;
  //   }

  //   const doc = new jsPDF();
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();

  //   // Add Header
  //   doc.setFontSize(18);
  //   doc.text("Student Result Report", pageWidth / 2, 20, { align: "center" });

  //   // Add Filters Info
  //   doc.setFontSize(12);
  //   doc.text(`School: ${selectedSchool}`, 14, 40);
  //   doc.text(
  //     `Class: ${classes.find((cls) => cls.value === selectedClassId)?.label || "N/A"}`,
  //     14,
  //     50
  //   );
  //   doc.text(
  //     `Subject: ${subjects.find((sub) => sub.value === selectedSubjectId)?.label || "N/A"}`,
  //     14,
  //     60
  //   );
  //   doc.text(`Total Students: ${students.length}`, 14, 70);

  //   // Prepare Table Data
  //   const tableColumns = [
  //     "Student",
  //     "Class",
  //     "Subject",
  //     "Roll No",
  //     "Full Mark",
  //     "Mark Secured",
  //     "Percentage",
  //     "Ranking",
  //     "Remarks",
  //     "Medal",
  //     "Certificate",
  //     "Status",
  //   ];

  //   const tableRows = students.map((student) => [
  //     student.student_name || "N/A",
  //     student.class_name || "N/A",
  //     student.student_subject?.length > 0
  //       ? student.student_subject.join(", ")
  //       : "N/A",
  //     student.roll_no || "N/A",
  //     student.full_mark || "N/A",
  //     student.mark_secured || "N/A",
  //     student.percentage || "N/A",
  //     student.ranking || "N/A",
  //     student.remarks || "N/A",
  //     student.medals || "N/A",
  //     student.certificate || "N/A",
  //     student.status || "N/A",
  //   ]);

  //   // Add Table using autoTable
  //   doc.autoTable({
  //     head: [tableColumns],
  //     body: tableRows,
  //     startY: 80,
  //     theme: "grid",
  //     styles: { fontSize: 10, cellPadding: 2 },
  //     headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
  //     alternateRowStyles: { fillColor: [240, 240, 240] },
  //     margin: { top: 80, left: 14, right: 14 },
  //   });

  //   // Add Footer
  //   const finalY = doc.lastAutoTable.finalY + 20;
  //   doc.setFontSize(10);
  //   doc.text(
  //     `Generated on: ${new Date().toLocaleDateString()}`,
  //     14,
  //     finalY > pageHeight - 20 ? pageHeight - 20 : finalY
  //   );

  //   // Save the PDF
  //   doc.save(
  //     `Result_${selectedSchool}_Class${selectedClassId}_Subject${selectedSubjectId}.pdf`
  //   );
  // };
  const handleDownloadPDF = async () => {
    if (!selectedSchool || !selectedClassId || !selectedSubjectId) {
      toast.error("Please select school, class, and subject to download PDF");
      return;
    }

    if (students.length === 0) {
      toast.error("No student data available to download");
      return;
    }

    // Map students to winnersList format
    const winnersList = students.map((student, index) => ({
      slNo: index + 1,
      name: student.student_name || "N/A",
      rollNo: student.roll_no || "N/A",
      class: student.class_name || selectedClassId,
      fullMarks: student.full_mark || "N/A",
      securedMarks: student.mark_secured || "N/A",
      percentage: student.percentage || "N/A",
      medal: student.medals || "N/A",
      certificate: student.certificate || "N/A",
    }));

    // Compute medalsTally (example logic, adjust as needed)
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

    // Compute classCutoff (example logic, adjust as needed)
    const classCutoff = [
      { class: selectedClassId, gold: 90, silver: 80, bronze: 70 }, // Example values
      // Add more classes if needed based on your data
    ];

    // Create a temporary container for rendering the component
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Render MedalsWinnersList to the container
    const component = (
      <MedalsWinnersList
        medalsTally={medalsTally}
        classCutoff={classCutoff}
        winnersList={winnersList}
        schoolName={selectedSchool}
        classId={selectedClassId}
        subjectId={selectedSubjectId}
      />
    );

    // Use ReactDOM to render the component to the container
    const { render } = await import("react-dom");
    render(component, container);

    // Capture the rendered component with html2canvas
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // Adjust for margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the captured image to the PDF
    let heightLeft = imgHeight;
    let position = 10;

    doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

    // Handle multiple pages if content exceeds page height
    heightLeft -= pageHeight - 20;
    while (heightLeft > 0) {
      doc.addPage();
      position = heightLeft - imgHeight;
      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Add footer
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      pageHeight - 10
    );

    // Save the PDF
    doc.save(
      `Result_${selectedSchool}_Class${selectedClassId}_Subject${selectedSubjectId}.pdf`
    );

    // Clean up
    document.body.removeChild(container);
  };

  const debouncedFetchStudents = useCallback(debounce(fetchStudents, 500), [
    fetchStudents,
  ]);

  // Trigger fetch on filter changes
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
  const handleClassChange = (e) => setSelectedClassId(e.target.value);
  const handleSubjectChange = (e) => setSelectedSubjectId(e.target.value);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < Math.ceil(totalCount / pageSize)) setPage(page + 1);
  };

  // Status styling
  const getStatusStyle = (status) => ({
    color: status.toLowerCase() === "success" ? "green" : "red",
    fontWeight: "bold",
  });

  // Paginated students
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
                  label="Class"
                  value={selectedClassId}
                  options={classes}
                  onChange={handleClassChange}
                  disabled={isLoading || !selectedSchool}
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
                <TableRow style={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell>STUDENT</TableCell>
                  <TableCell>CLASS</TableCell>
                  <TableCell>SUBJECT</TableCell>
                  <TableCell>ROLL NO</TableCell>
                  <TableCell>FULL MARK</TableCell>
                  <TableCell>MARK SECURED</TableCell>
                  <TableCell>PERCENTAGE</TableCell>
                  <TableCell>RANKING</TableCell>
                  <TableCell>MEDAL</TableCell>
                  <TableCell>REMARK</TableCell>
                  <TableCell>CERTIFICATE</TableCell>
                  <TableCell>STATUS</TableCell>
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
                      <TableCell>{student.student_name || "N/A"}</TableCell>
                      <TableCell>{student.class_name || "N/A"}</TableCell>
                      <TableCell>
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
                      <TableCell>{student.roll_no || "N/A"}</TableCell>
                      <TableCell>{student.full_mark || "N/A"}</TableCell>
                      <TableCell>{student.mark_secured || "N/A"}</TableCell>
                      <TableCell>{student.percentage || "N/A"}</TableCell>
                      <TableCell>{student.ranking || "N/A"}</TableCell>
                      <TableCell>{student.medals || "N/A"}</TableCell>
                      <TableCell>{student.remarks || "N/A"}</TableCell>
                      <TableCell>{student.certificate || "N/A"}</TableCell>
                      <TableCell style={getStatusStyle(student.status)}>
                        {student.status || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      {selectedSchool && selectedClassId && selectedSubjectId
                        ? "No students found for the selected criteria"
                        : "Please select school, class, and subject to view students"}
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
