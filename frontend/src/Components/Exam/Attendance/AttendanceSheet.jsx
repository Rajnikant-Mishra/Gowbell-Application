// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   MenuItem,
//   Box,
//   Select,
//   InputLabel,
//   FormControl,
//   Chip,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";

// // Reusable Dropdown Component
// const Dropdown = ({ label, value, options, onChange, disabled }) => (
//   <TextField
//     select
//     label={label}
//     variant="outlined"
//     fullWidth
//     margin="normal"
//     size="small"
//     value={value}
//     onChange={onChange}
//     disabled={disabled}
//   >
//     {options.map((option) => (
//       <MenuItem key={option.value} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   // State declarations
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [fetchError, setFetchError] = useState(null);
//   const navigate = useNavigate();

//   // Location states
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);

//   // Classes and Subjects states (using IDs)
//   const [classes, setClasses] = useState([]); // {id, name}
//   const [subjects, setSubjects] = useState([]); // {id, name}
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);

//   // Fetch initial data
//   useEffect(() => {
//     let isMounted = true;

//     const fetchInitialData = async () => {
//       try {
//         setIsLoading(true);
//         const [
//           countriesRes,
//           statesRes,
//           districtsRes,
//           citiesRes,
//           classesRes,
//           subjectsRes,
//         ] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           axios.get(`${API_BASE_URL}/api/class`),
//           axios.get(`${API_BASE_URL}/api/subject`),
//         ]);

//         if (isMounted) {
//           setCountries(countriesRes.data || []);
//           setStates(statesRes.data || []);
//           setDistricts(districtsRes.data || []);
//           setCities(citiesRes.data || []);
//           setClasses(
//             (classesRes.data || []).map((cls) => ({
//               id: cls.id,
//               name: cls.name,
//             }))
//           );
//           setSubjects(
//             (subjectsRes.data || []).map((sub) => ({
//               id: sub.id,
//               name: sub.name,
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setFetchError("Failed to load initial data");
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     fetchInitialData();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Location filtering effects
//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedDistrict, cities]);

//   // Fetch schools
//   const fetchSchoolsByLocation = useCallback(async (filters) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/get/filter`, {
//         params: filters,
//       });
//       if (response.data.success) {
//         const schoolList = response.data.data.flatMap((location) =>
//           location.schools.map((school) => ({
//             school_name: school,
//             country_name: location.country,
//             state_name: location.state,
//             district_name: location.district,
//             city_name: location.city,
//           }))
//         );
//         setSchools(schoolList);
//         setFetchError(null);
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setFetchError("Failed to fetch schools");
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const filters = {
//       country: selectedCountry,
//       state: selectedState,
//       district: selectedDistrict,
//       city: selectedCity,
//     };
//     if (selectedCountry) fetchSchoolsByLocation(filters);
//   }, [
//     selectedCountry,
//     selectedState,
//     selectedDistrict,
//     selectedCity,
//     fetchSchoolsByLocation,
//   ]);

//   // Options
//   const dropdownOptions = {
//     countries: countries.map((c) => ({ value: c.id, label: c.name })),
//     states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
//     districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
//     cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
//     schools: schools.map((s) => ({
//       value: s.school_name,
//       label: `${s.school_name} (${s.city_name || ""})`,
//     })),
//     classes: classes.map((c) => ({ value: c.id, label: c.name })),
//     subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[ { name: "Attendance" }]}
//         />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={styles.main}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             Create Attendance
//           </Typography>
//           {fetchError && (
//             <Typography color="error" className="mb-3">
//               {fetchError}
//             </Typography>
//           )}
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={dropdownOptions.countries}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={dropdownOptions.states}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry || isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={dropdownOptions.districts}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState || isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={dropdownOptions.cities}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict || isLoading}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={dropdownOptions.schools}
//                   onChange={(e) => setSelectedSchool(e.target.value)}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Classes</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedClassIds}
//                     onChange={(e) => setSelectedClassIds(e.target.value)}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => (
//                           <Chip
//                             key={id}
//                             label={classes.find((c) => c.id === id)?.name || id}
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {classes.map((cls) => (
//                       <MenuItem key={cls.id} value={cls.id}>
//                         {cls.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Subjects</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedSubjectIds}
//                     onChange={(e) => setSelectedSubjectIds(e.target.value)}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => (
//                           <Chip
//                             key={id}
//                             label={
//                               subjects.find((s) => s.id === id)?.name || id
//                             }
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {subjects.map((sub) => (
//                       <MenuItem key={sub.id} value={sub.id}>
//                         {sub.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>

//             <Box mt={3} mb={3}>
//               {totalCount > 0 ? (
//                 <Typography variant="h6" color="primary">
//                   Total Students: {totalCount}
//                 </Typography>
//               ) : (
//                 selectedSchool &&
//                 selectedClassIds.length > 0 &&
//                 selectedSubjectIds.length > 0 && (
//                   <Typography variant="body2" color="textSecondary">
//                     No students found matching the criteria
//                   </Typography>
//                 )
//               )}
//             </Box>

//             <Box
//               className={`${styles.buttonContainer} gap-2 mt-4`}
//               sx={{ display: "flex", gap: 2 }}
//             >
//               <ButtonComp
//                 variant="contained"
//                 color="primary"

//                 disabled={
//                   !selectedSchool ||
//                   !selectedClassIds.length ||
//                   !selectedSubjectIds.length ||
//                   isLoading ||
//                   !totalCount
//                 }
//                 text={isLoading ? "Processing..." : "Generate PDF"}
//                 sx={{ flexGrow: 1 }}
//               />
//               <ButtonComp
//                 text="Cancel"
//                 onClick={() => navigate("/examList")}
//                 disabled={isLoading}
//                 sx={{ flexGrow: 1 }}
//               />
//             </Box>
//           </form>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   MenuItem,
//   Box,
//   Select,
//   InputLabel,
//   FormControl,
//   Chip,
// } from "@mui/material";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas"; // Import html2canvas
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import AttendanceSheet from "../Attendance/HtmlAttendance"; // Import HtmlAttendance (AttendanceSheet)

// // Reusable Dropdown Component
// const Dropdown = ({ label, value, options, onChange, disabled }) => (
//   <TextField
//     select
//     label={label}
//     variant="outlined"
//     fullWidth
//     margin="normal"
//     size="small"
//     value={value}
//     onChange={onChange}
//     disabled={disabled}
//   >
//     {options.map((option) => (
//       <MenuItem key={option.value} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   // State declarations
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [fetchError, setFetchError] = useState(null);
//   const navigate = useNavigate();

//   // Location states
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);

//   // Classes and Subjects states
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [students, setStudents] = useState([]);

//   // Fetch initial data
//   useEffect(() => {
//     let isMounted = true;

//     const fetchInitialData = async () => {
//       try {
//         setIsLoading(true);
//         const [
//           countriesRes,
//           statesRes,
//           districtsRes,
//           citiesRes,
//           classesRes,
//           subjectsRes,
//         ] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           axios.get(`${API_BASE_URL}/api/class`),
//           axios.get(`${API_BASE_URL}/api/subject`),
//         ]);

//         if (isMounted) {
//           setCountries(countriesRes.data || []);
//           setStates(statesRes.data || []);
//           setDistricts(districtsRes.data || []);
//           setCities(citiesRes.data || []);
//           setClasses(
//             (classesRes.data || []).map((cls) => ({
//               id: cls.id,
//               name: cls.name,
//             }))
//           );
//           setSubjects(
//             (subjectsRes.data || []).map((sub) => ({
//               id: sub.id,
//               name: sub.name,
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setFetchError("Failed to load initial data");
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     fetchInitialData();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Location filtering effects
//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassIds([]);
//     setSelectedSubjectIds([]);
//     setStudents([]);
//     setTotalCount(0);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassIds([]);
//     setSelectedSubjectIds([]);
//     setStudents([]);
//     setTotalCount(0);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassIds([]);
//     setSelectedSubjectIds([]);
//     setStudents([]);
//     setTotalCount(0);
//   }, [selectedDistrict, cities]);

//   // Fetch schools
//   const fetchSchoolsByLocation = useCallback(async (filters) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/get/filter`, {
//         params: filters,
//       });
//       if (response.data.success) {
//         const schoolList = response.data.data.flatMap((location) =>
//           location.schools.map((school) => ({
//             school_name: school,
//             country_name: location.country,
//             state_name: location.state,
//             district_name: location.district,
//             city_name: location.city,
//           }))
//         );
//         setSchools(schoolList);
//         setFetchError(null);
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setFetchError("Failed to fetch schools");
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const filters = {
//       country: selectedCountry,
//       state: selectedState,
//       district: selectedDistrict,
//       city: selectedCity,
//     };
//     if (selectedCountry) fetchSchoolsByLocation(filters);
//   }, [
//     selectedCountry,
//     selectedState,
//     selectedDistrict,
//     selectedCity,
//     fetchSchoolsByLocation,
//   ]);

//   // Fetch students for attendance
//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (
//         selectedSchool &&
//         selectedClassIds.length > 0 &&
//         selectedSubjectIds.length > 0
//       ) {
//         try {
//           setIsLoading(true);
//           setFetchError(null);
//           const response = await axios.post(
//             `${API_BASE_URL}/api/get/student-attendance`,
//             {
//               schoolName: selectedSchool,
//               classList: selectedClassIds,
//               subjectList: selectedSubjectIds,
//             }
//           );

//           // Map API response to match HtmlAttendance studentData structure
//           const mappedStudents = (response.data.students || []).map(
//             (student, index) => ({
//               id: index + 1,
//               rollNo: student.roll_no || `OR0829-06-${student.section || "A"}-${
//                 index + 1
//               }`,
//               section: student.section || "A",
//               name: student.student_name || "Unknown",
//               remarks: "",
//             })
//           );

//           setStudents(mappedStudents);
//           setTotalCount(response.data.totalCount || 0);

//           if (response.data.classNames) {
//             setClasses((prev) =>
//               prev.map((cls) => ({
//                 id: cls.id,
//                 name:
//                   response.data.classNames.find((c) => c.id === cls.id)
//                     ?.class_name || cls.name,
//               }))
//             );
//           }
//           if (response.data.subjectNames) {
//             setSubjects((prev) =>
//               prev.map((sub) => ({
//                 id: sub.id,
//                 name:
//                   response.data.subjectNames.find((s) => s.id === sub.id)
//                     ?.subject_name || sub.name,
//               }))
//             );
//           }
//         } catch (error) {
//           console.error("Error fetching students:", error);
//           setFetchError("Failed to fetch students");
//           setStudents([]);
//           setTotalCount(0);
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         setStudents([]);
//         setTotalCount(0);
//       }
//     };

//     fetchStudents();
//   }, [selectedSchool, selectedClassIds, selectedSubjectIds]);

//   // Options for dropdowns
//   const dropdownOptions = {
//     countries: countries.map((c) => ({ value: c.id, label: c.name })),
//     states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
//     districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
//     cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
//     schools: schools.map((s) => ({
//       value: s.school_name,
//       label: `${s.school_name} (${s.city_name || ""})`,
//     })),
//     classes: classes.map((c) => ({ value: c.id, label: c.name })),
//     subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
//   };

//   // PDF generation using HtmlAttendance
//   const handleGeneratePDF = async () => {
//     if (totalCount === 0) {
//       Swal.fire({
//         icon: "warning",
//         title: "No Students",
//         text: "No students found for the selected criteria.",
//       });
//       return;
//     }

//     // Create a hidden container to render HtmlAttendance
//     const hiddenDiv = document.createElement("div");
//     hiddenDiv.style.position = "absolute";
//     hiddenDiv.style.left = "-9999px";
//     document.body.appendChild(hiddenDiv);

//     // Render HtmlAttendance in the hidden div using ReactDOM
//     const { createRoot } = await import("react-dom/client");
//     const root = createRoot(hiddenDiv);

//     // Prepare data for HtmlAttendance
//     const selectedSubjectNames = selectedSubjectIds
//       .map((id) => subjects.find((s) => s.id === id)?.name)
//       .join(", ");
//     const selectedClassName = selectedClassIds
//       .map((id) => classes.find((c) => c.id === id)?.name)
//       .join(", ");
//     const schoolDetails = schools.find((s) => s.school_name === selectedSchool);

//     // Render the AttendanceSheet component
//     root.render(
//       <AttendanceSheet
//         studentData={students}
//         subject={selectedSubjectNames}
//         className={selectedClassName}
//         schoolName={selectedSchool}
//         schoolAddress={
//           schoolDetails
//             ? `${schoolDetails.city_name}, ${schoolDetails.district_name}, ${schoolDetails.state_name}, ${schoolDetails.country_name}`
//             : "Unknown Address"
//         }
//         schoolCode="OR0829" // Adjust as needed
//         examDate="28th November, 2024" // Adjust as needed
//         srsSection={students[0]?.section || "A"} // Adjust as needed
//         allottedSec={students[0]?.section || "A"} // Adjust as needed
//         totalStudents={totalCount}
//       />
//     );

//     // Wait for rendering to complete
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     // Capture the rendered content as an image using html2canvas
//     const canvas = await html2canvas(hiddenDiv, {
//       scale: 2, // Increase resolution
//       useCORS: true, // Handle cross-origin images
//     });

//     const imgData = canvas.toDataURL("image/png");

//     // Initialize jsPDF
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const imgWidth = pageWidth - 20; // 10mm margin on each side
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     // Add the image to the PDF
//     doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

//     // Save the PDF
//     doc.save(`${selectedSchool}_Attendance_Sheet.pdf`);

//     // Clean up
//     root.unmount();
//     document.body.removeChild(hiddenDiv);

//     Swal.fire({
//       icon: "success",
//       title: "PDF Generated",
//       text: "The attendance sheet has been generated successfully.",
//     });
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "Attendance" }]} />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={styles.main}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             Create Attendance
//           </Typography>
//           {fetchError && (
//             <Typography color="error" className="mb-3">
//               {fetchError}
//             </Typography>
//           )}
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={dropdownOptions.countries}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={dropdownOptions.states}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry || isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={dropdownOptions.districts}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState || isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={dropdownOptions.cities}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict || isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={dropdownOptions.schools}
//                   onChange={(e) => setSelectedSchool(e.target.value)}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Classes</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedClassIds}
//                     onChange={(e) => setSelectedClassIds(e.target.value)}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => (
//                           <Chip
//                             key={id}
//                             label={classes.find((c) => c.id === id)?.name || id}
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {classes.map((cls) => (
//                       <MenuItem key={cls.id} value={cls.id}>
//                         {cls.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Subjects</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedSubjectIds}
//                     onChange={(e) => setSelectedSubjectIds(e.target.value)}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => (
//                           <Chip
//                             key={id}
//                             label={
//                               subjects.find((s) => s.id === id)?.name || id
//                             }
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {subjects.map((sub) => (
//                       <MenuItem key={sub.id} value={sub.id}>
//                         {sub.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>

//             <Box mt={3} mb={3}>
//               {totalCount > 0 ? (
//                 <Typography variant="h6" color="primary">
//                   Total Students: {totalCount}
//                 </Typography>
//               ) : (
//                 selectedSchool &&
//                 selectedClassIds.length > 0 &&
//                 selectedSubjectIds.length > 0 && (
//                   <Typography variant="body2" color="textSecondary">
//                     No students found matching the criteria
//                   </Typography>
//                 )
//               )}
//             </Box>

//             <Box
//               className={`${styles.buttonContainer} gap-2 mt-4`}
//               sx={{ display: "flex", gap: 2 }}
//             >
//               <ButtonComp
//                 variant="contained"
//                 color="primary"
//                 onClick={handleGeneratePDF}
//                 disabled={
//                   !selectedSchool ||
//                   !selectedClassIds.length ||
//                   !selectedSubjectIds.length ||
//                   isLoading ||
//                   totalCount === 0
//                 }
//                 text={isLoading ? "Processing..." : "Generate PDF"}
//                 sx={{ flexGrow: 1 }}
//               />
//             </Box>
//           </form>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import AttendanceSheet from "../Attendance/HtmlAttendance";

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

const ExaminationForm = () => {
  // State declarations
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

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

  // Classes and Subjects states
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [students, setStudents] = useState([]);

  // Fetch initial data
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

  // Location filtering effects
  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedClassId("");
    setSelectedSubjectId("");
    setStudents([]);
    setTotalCount(0);
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedClassId("");
    setSelectedSubjectId("");
    setStudents([]);
    setTotalCount(0);
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedClassId("");
    setSelectedSubjectId("");
    setStudents([]);
    setTotalCount(0);
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

  // Fetch students for attendance
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedSchool && selectedClassId && selectedSubjectId) {
        try {
          setIsLoading(true);
          setFetchError(null);
          const response = await axios.post(
            `${API_BASE_URL}/api/get/student-attendance`,
            {
              schoolName: selectedSchool,
              classList: [selectedClassId],
              subjectList: [selectedSubjectId],
            }
          );

          // Map API response to match HtmlAttendance studentData structure
          const mappedStudents = (response.data.students || []).map(
            (student, index) => ({
              id: index + 1,
              rollNo:
                student.roll_no ||
                `OR0829-06-${student.section || "A"}-${index + 1}`,
              section: student.section || "A",
              name: student.student_name || "Unknown",
              remarks: "",
            })
          );

          setStudents(mappedStudents);
          setTotalCount(response.data.totalCount || 0);

          if (response.data.classNames) {
            setClasses((prev) =>
              prev.map((cls) => ({
                id: cls.id,
                name:
                  response.data.classNames.find((c) => c.id === cls.id)
                    ?.class_name || cls.name,
              }))
            );
          }
          if (response.data.subjectNames) {
            setSubjects((prev) =>
              prev.map((sub) => ({
                id: sub.id,
                name:
                  response.data.subjectNames.find((s) => s.id === sub.id)
                    ?.subject_name || sub.name,
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setFetchError("Failed to fetch students");
          setStudents([]);
          setTotalCount(0);
        } finally {
          setIsLoading(false);
        }
      } else {
        setStudents([]);
        setTotalCount(0);
      }
    };

    fetchStudents();
  }, [selectedSchool, selectedClassId, selectedSubjectId]);

  // Options for dropdowns
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
  };

  // PDF generation using HtmlAttendance
  const handleGeneratePDF = async () => {
    if (totalCount === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Students",
        text: "No students found for the selected criteria.",
      });
      return;
    }

    // Create a hidden container to render HtmlAttendance
    const hiddenDiv = document.createElement("div");
    hiddenDiv.style.position = "absolute";
    hiddenDiv.style.left = "-9999px";
    document.body.appendChild(hiddenDiv);

    // Render HtmlAttendance in the hidden div using ReactDOM
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(hiddenDiv);

    // Prepare data for HtmlAttendance
    const selectedSubjectName =
      subjects.find((s) => s.id === selectedSubjectId)?.name || "";
    const selectedClassName =
      classes.find((c) => c.id === selectedClassId)?.name || "";
    const schoolDetails = schools.find((s) => s.school_name === selectedSchool);

    // Render the AttendanceSheet component
    root.render(
      <AttendanceSheet
        studentData={students}
        subject={selectedSubjectName}
        className={selectedClassName}
        schoolName={selectedSchool}
        schoolAddress={
          schoolDetails
            ? `${schoolDetails.city_name}, ${schoolDetails.district_name}, ${schoolDetails.state_name}, ${schoolDetails.country_name}`
            : "Unknown Address"
        }
        schoolCode="OR0829"
        examDate="28th November, 2024"
        srsSection={students[0]?.section || "A"}
        allottedSec={students[0]?.section || "A"}
        totalStudents={totalCount}
      />
    );

    // Wait for rendering to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Capture the rendered content as an image using html2canvas
    const canvas = await html2canvas(hiddenDiv, {
      scale: 2,
      useCORS: true,
    });

    // const imgData = canvas.toDataURL("image/png");
    const imgData = canvas.toDataURL("image/jpeg", 0.1);
    // Initialize jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the image to the PDF
    doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    // Save the PDF
    doc.save(`${selectedSchool}_Attendance_Sheet.pdf`);

    // Clean up
    root.unmount();
    document.body.removeChild(hiddenDiv);

    Swal.fire({
      icon: "success",
      title: "PDF Generated",
      text: "The attendance sheet has been generated successfully.",
    });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Attendance" }]} />
      </div>
      <Container component="main" maxWidth="">
        <Paper
          className={styles.main}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={`${styles.formTitle} mb-4`}>
            Create Attendance
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
                <Dropdown
                  label="Class"
                  value={selectedClassId}
                  options={dropdownOptions.classes}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  disabled={isLoading || !selectedSchool}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Subject"
                  value={selectedSubjectId}
                  options={dropdownOptions.subjects}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  disabled={isLoading || !selectedSchool}
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
                selectedClassId &&
                selectedSubjectId && (
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
                onClick={handleGeneratePDF}
                disabled={
                  !selectedSchool ||
                  !selectedClassId ||
                  !selectedSubjectId ||
                  isLoading ||
                  totalCount === 0
                }
                text={isLoading ? "Processing..." : "Generate PDF"}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </form>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
