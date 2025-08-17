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
// } from "@mui/material";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import AttendanceSheet from "../Attendance/HtmlAttendance";

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
//   const [selectedClassId, setSelectedClassId] = useState("");
//   const [selectedSubjectId, setSelectedSubjectId] = useState("");
//   const [examDate, setExamDate] = useState("");
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
//     setSelectedClassId("");
//     setSelectedSubjectId("");
//     setExamDate("");
//     setStudents([]);
//     setTotalCount(0);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassId("");
//     setSelectedSubjectId("");
//     setExamDate("");
//     setStudents([]);
//     setTotalCount(0);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassId("");
//     setSelectedSubjectId("");
//     setExamDate("");
//     setStudents([]);
//     setTotalCount(0);
//   }, [selectedDistrict, cities]);

//   // Fetch schools by location
//   const fetchSchoolsByLocation = useCallback(async () => {
//     if (
//       !selectedCountry ||
//       !selectedState ||
//       !selectedDistrict ||
//       !selectedCity
//     ) {
//       setSchools([]);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setFetchError(null);
//       const response = await axios.get(
//         `${API_BASE_URL}/api/get/school-filter`,
//         {
//           params: {
//             country: selectedCountry,
//             state: selectedState,
//             district: selectedDistrict,
//             city: selectedCity,
//           },
//         }
//       );

//       if (response.data.success) {
//         const schoolList = response.data.data.flatMap((location) =>
//           location.schools.map((school) => ({
//             id: school.id,
//             school_name: school.name,
//             country_name: location.country,
//             state_name: location.state,
//             district_name: location.district,
//             city_name: location.city,
//           }))
//         );
//         setSchools(schoolList);
//       } else {
//         setSchools([]);
//         Swal.fire({
//           icon: "warning",
//           title: "No Schools Found",
//           text: "No schools found for the selected location.",
//           confirmButtonColor: "#d33",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setFetchError("Failed to fetch schools");
//       setSchools([]);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch schools. Please try again.",
//         confirmButtonColor: "#d33",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

//   useEffect(() => {
//     if (selectedCountry && selectedState && selectedDistrict && selectedCity) {
//       fetchSchoolsByLocation();
//     }
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
//       if (selectedSchool && selectedClassId && selectedSubjectId) {
//         try {
//           setIsLoading(true);
//           setFetchError(null);
//           const response = await axios.post(
//             `${API_BASE_URL}/api/get/student-attendance`,
//             {
//               schoolId: selectedSchool,
//               classList: [selectedClassId],
//               subjectList: [selectedSubjectId],
//             }
//           );

//           const mappedStudents = (response.data.students || []).map(
//             (student, index) => ({
//               id: index + 1,
//               rollNo:
//                 student.roll_no ||
//                 `OR0829-06-${student.section || "A"}-${index + 1}`,
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
//   }, [selectedSchool, selectedClassId, selectedSubjectId]);

//   // Options for dropdowns
//   const dropdownOptions = {
//     countries: countries.map((c) => ({ value: c.id, label: c.name })),
//     states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
//     districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
//     cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
//     schools: schools.map((s) => ({
//       value: s.id,
//       label: `${s.school_name} (${s.city_name || ""})`,
//     })),
//     classes: classes.map((c) => ({ value: c.id, label: c.name })),
//     subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
//   };

//   // PDF generation
//   const handleGeneratePDF = async () => {
//     if (totalCount === 0) {
//       Swal.fire({
//         icon: "warning",
//         title: "No Students",
//         text: "No students found for the selected criteria.",
//       });
//       return;
//     }

//     if (!examDate) {
//       Swal.fire({
//         icon: "warning",
//         title: "Exam Date Required",
//         text: "Please select an exam date to generate the attendance sheet.",
//       });
//       return;
//     }

//     const hiddenDiv = document.createElement("div");
//     hiddenDiv.style.position = "absolute";
//     hiddenDiv.style.left = "-9999px";
//     document.body.appendChild(hiddenDiv);

//     const { createRoot } = await import("react-dom/client");
//     const root = createRoot(hiddenDiv);

//     const selectedSubjectName =
//       subjects.find((s) => s.id === selectedSubjectId)?.name || "";
//     const selectedClassName =
//       classes.find((c) => c.id === selectedClassId)?.name || "";
//     const schoolDetails = schools.find((s) => s.id === selectedSchool);

//     root.render(
//       <AttendanceSheet
//         studentData={students}
//         subject={selectedSubjectName}
//         className={selectedClassName}
//         schoolName={schoolDetails?.school_name || selectedSchool}
//         schoolAddress={
//           schoolDetails
//             ? `${schoolDetails.city_name}, ${schoolDetails.district_name}, ${schoolDetails.state_name}, ${schoolDetails.country_name}`
//             : "Unknown Address"
//         }
//         schoolCode="OR0829"
//         examDate={examDate}
//         srsSection={students[0]?.section || "A"}
//         allottedSec={students[0]?.section || "A"}
//         totalStudents={totalCount}
//       />
//     );

//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const canvas = await html2canvas(hiddenDiv, {
//       scale: 2,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/jpeg", 0.1);
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const imgWidth = pageWidth - 20;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     doc.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
//     doc.save(`${schoolDetails?.school_name || "School"}_Attendance_Sheet.pdf`);

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
//                 <Dropdown
//                   label="Class"
//                   value={selectedClassId}
//                   options={dropdownOptions.classes}
//                   onChange={(e) => setSelectedClassId(e.target.value)}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Subject"
//                   value={selectedSubjectId}
//                   options={dropdownOptions.subjects}
//                   onChange={(e) => setSelectedSubjectId(e.target.value)}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="Exam Date"
//                   type="date"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={examDate}
//                   onChange={(e) => setExamDate(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//             </Grid>

//             <Box mt={3} mb={3}>
//               {totalCount > 0 ? (
//                 <Typography variant="h6" color="primary">
//                   Total Students: {totalCount}
//                 </Typography>
//               ) : (
//                 selectedSchool &&
//                 selectedClassId &&
//                 selectedSubjectId && (
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
//                   !selectedClassId ||
//                   !selectedSubjectId ||
//                   !examDate ||
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
//   Chip,
// } from "@mui/material";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import AttendanceSheet from "../Attendance/HtmlAttendance";

// // Reusable Dropdown Component
// const Dropdown = ({ label, value, options, onChange, disabled, multiple }) => (
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
//     SelectProps={{
//       multiple,
//       renderValue: (selected) =>
//         multiple && Array.isArray(selected) ? (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//             {selected.map((value) => (
//               <Chip
//                 key={value}
//                 label={
//                   options.find((option) => option.value === value)?.label ||
//                   value
//                 }
//                 size="small"
//               />
//             ))}
//           </Box>
//         ) : (
//           options.find((option) => option.value === selected)?.label || selected
//         ),
//     }}
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
//   const [examDate, setExamDate] = useState("");
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
//     setExamDate("");
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
//     setExamDate("");
//     setStudents([]);
//     setTotalCount(0);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassIds([]);
//     setSelectedSubjectIds([]);
//     setExamDate("");
//     setStudents([]);
//     setTotalCount(0);
//   }, [selectedDistrict, cities]);

//   // Fetch schools by location
//   const fetchSchoolsByLocation = useCallback(async () => {
//     if (
//       !selectedCountry ||
//       !selectedState ||
//       !selectedDistrict ||
//       !selectedCity
//     ) {
//       setSchools([]);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setFetchError(null);
//       const response = await axios.get(
//         `${API_BASE_URL}/api/get/school-filter`,
//         {
//           params: {
//             country: selectedCountry,
//             state: selectedState,
//             district: selectedDistrict,
//             city: selectedCity,
//           },
//         }
//       );

//       if (response.data.success) {
//         const schoolList = response.data.data.flatMap((location) =>
//           location.schools.map((school) => ({
//             id: school.id,
//             school_name: school.name,
//             country_name: location.country,
//             state_name: location.state,
//             district_name: location.district,
//             city_name: location.city,
//           }))
//         );
//         setSchools(schoolList);
//       } else {
//         setSchools([]);
//         Swal.fire({
//           icon: "warning",
//           title: "No Schools Found",
//           text: "No schools found for the selected location.",
//           confirmButtonColor: "#d33",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setFetchError("Failed to fetch schools");
//       setSchools([]);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch schools. Please try again.",
//         confirmButtonColor: "#d33",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

//   useEffect(() => {
//     if (selectedCountry && selectedState && selectedDistrict && selectedCity) {
//       fetchSchoolsByLocation();
//     }
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
//               schoolId: selectedSchool,
//               classList: selectedClassIds,
//               subjectList: selectedSubjectIds,
//             }
//           );

//           const mappedStudents = (response.data.students || []).map(
//             (student, index) => ({
//               id: index + 1,
//               rollNo:
//                 student.roll_no ||
//                 `OR0829-06-${student.section || "A"}-${index + 1}`,
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
//       value: s.id,
//       label: `${s.school_name} (${s.city_name || ""})`,
//     })),
//     classes: classes.map((c) => ({ value: c.id, label: c.name })),
//     subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
//   };

//   // PDF generation
//   const handleGeneratePDF = async () => {
//     if (totalCount === 0) {
//       Swal.fire({
//         icon: "warning",
//         title: "No Students",
//         text: "No students found for the selected criteria.",
//       });
//       return;
//     }

//     if (!examDate) {
//       Swal.fire({
//         icon: "warning",
//         title: "Exam Date Required",
//         text: "Please select an exam date to generate the attendance sheet.",
//       });
//       return;
//     }

//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     const schoolDetails = schools.find((s) => s.id === selectedSchool);
//     const selectedClassNames = selectedClassIds
//       .map((id) => classes.find((c) => c.id === id)?.name || "")
//       .filter(Boolean)
//       .join(", ");

//     const hiddenDiv = document.createElement("div");
//     hiddenDiv.style.position = "absolute";
//     hiddenDiv.style.left = "-9999px";
//     document.body.appendChild(hiddenDiv);

//     const { createRoot } = await import("react-dom/client");
//     const root = createRoot(hiddenDiv);

//     for (let i = 0; i < selectedSubjectIds.length; i++) {
//       const subjectId = selectedSubjectIds[i];
//       const subjectName = subjects.find((s) => s.id === subjectId)?.name || "";

//       root.render(
//         <AttendanceSheet
//           studentData={students}
//           subject={subjectName}
//           className={selectedClassNames}
//           schoolName={schoolDetails?.school_name || selectedSchool}
//           schoolAddress={
//             schoolDetails
//               ? `${schoolDetails.city_name}, ${schoolDetails.district_name}, ${schoolDetails.state_name}, ${schoolDetails.country_name}`
//               : "Unknown Address"
//           }
//           schoolCode="OR0829"
//           examDate={examDate}
//           srsSection={students[0]?.section || "A"}
//           allottedSec={students[0]?.section || "A"}
//           totalStudents={totalCount}
//         />
//       );

//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const canvas = await html2canvas(hiddenDiv, {
//         scale: 2,
//         useCORS: true,
//       });

//       const imgData = canvas.toDataURL("image/jpeg", 0.1);
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();
//       const imgWidth = pageWidth - 20;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       if (i > 0) {
//         doc.addPage();
//       }

//       doc.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
//     }

//     doc.save(`${schoolDetails?.school_name || "School"}_Attendance_Sheet.pdf`);

//     root.unmount();
//     document.body.removeChild(hiddenDiv);

//     Swal.fire({
//       icon: "success",
//       title: "PDF Generated",
//       text: "The attendance sheet has been generated successfully with separate pages for each subject.",
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
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={dropdownOptions.states}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry || isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={dropdownOptions.districts}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState || isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={dropdownOptions.cities}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict || isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={dropdownOptions.schools}
//                   onChange={(e) => setSelectedSchool(e.target.value)}
//                   disabled={isLoading || !selectedCity}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Classes"
//                   value={selectedClassIds}
//                   options={dropdownOptions.classes}
//                   onChange={(e) => setSelectedClassIds(e.target.value)}
//                   disabled={isLoading || !selectedSchool}
//                   multiple={true}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Subjects"
//                   value={selectedSubjectIds}
//                   options={dropdownOptions.subjects}
//                   onChange={(e) => setSelectedSubjectIds(e.target.value)}
//                   disabled={isLoading || !selectedSchool}
//                   multiple={true}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="Exam Date"
//                   type="date"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={examDate}
//                   onChange={(e) => setExamDate(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                   disabled={isLoading || !selectedSchool}
//                 />
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
//                   selectedClassIds.length === 0 ||
//                   selectedSubjectIds.length === 0 ||
//                   !examDate ||
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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
const Dropdown = ({ label, value, options, onChange, disabled, multiple }) => (
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
    SelectProps={{
      multiple,
      renderValue: (selected) =>
        multiple && Array.isArray(selected) ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={
                  options.find((option) => option.value === value)?.label ||
                  value
                }
                size="small"
              />
            ))}
          </Box>
        ) : (
          options.find((option) => option.value === selected)?.label || selected
        ),
    }}
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
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [examDate, setExamDate] = useState("");
  const [studentDataByClassSubject, setStudentDataByClassSubject] = useState(
    []
  );
  const [canGeneratePDF, setCanGeneratePDF] = useState(false);

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
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setExamDate("");
    setStudentDataByClassSubject([]);
    setCanGeneratePDF(false);
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setExamDate("");
    setStudentDataByClassSubject([]);
    setCanGeneratePDF(false);
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setExamDate("");
    setStudentDataByClassSubject([]);
    setCanGeneratePDF(false);
  }, [selectedDistrict, cities]);

  // Fetch schools by location
  const fetchSchoolsByLocation = useCallback(async () => {
    if (
      !selectedCountry ||
      !selectedState ||
      !selectedDistrict ||
      !selectedCity
    ) {
      setSchools([]);
      return;
    }

    try {
      setIsLoading(true);
      setFetchError(null);
      const response = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        {
          params: {
            country: selectedCountry,
            state: selectedState,
            district: selectedDistrict,
            city: selectedCity,
          },
        }
      );

      if (response.data.success) {
        const schoolList = response.data.data.flatMap((location) =>
          location.schools.map((school) => ({
            id: school.id,
            school_name: school.name,
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
      setFetchError("Failed to fetch schools");
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
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  useEffect(() => {
    if (selectedCountry && selectedState && selectedDistrict && selectedCity) {
      fetchSchoolsByLocation();
    }
  }, [
    selectedCountry,
    selectedState,
    selectedDistrict,
    selectedCity,
    fetchSchoolsByLocation,
  ]);

  // Fetch students for each class-subject combination
  useEffect(() => {
    const fetchStudents = async () => {
      if (
        selectedSchool &&
        selectedClassIds.length > 0 &&
        selectedSubjectIds.length > 0
      ) {
        try {
          setIsLoading(true);
          setFetchError(null);
          const studentData = [];

          // Fetch students for each class-subject combination
          for (const classId of selectedClassIds) {
            for (const subjectId of selectedSubjectIds) {
              const response = await axios.post(
                `${API_BASE_URL}/api/get/student-attendance`,
                {
                  schoolId: selectedSchool,
                  classList: [classId],
                  subjectList: [subjectId],
                }
              );

              const className =
                classes.find((c) => c.id === classId)?.name || "Unknown Class";
              const subjectName =
                subjects.find((s) => s.id === subjectId)?.name ||
                "Unknown Subject";

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

              studentData.push({
                classId,
                className,
                subjectId,
                subjectName,
                students: mappedStudents,
                totalCount: response.data.totalCount || 0,
              });
            }
          }

          setStudentDataByClassSubject(studentData);
          setCanGeneratePDF(
            studentData.some((data) => data.students.length > 0)
          );

          if (studentData.every((data) => data.students.length === 0)) {
            Swal.fire({
              icon: "warning",
              title: "No Students Found",
              text: "No students found for the selected classes and subjects.",
              confirmButtonColor: "#d33",
            });
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setFetchError("Failed to fetch students");
          setStudentDataByClassSubject([]);
          setCanGeneratePDF(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch students. Please try again.",
            confirmButtonColor: "#d33",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setStudentDataByClassSubject([]);
        setCanGeneratePDF(false);
      }
    };

    fetchStudents();
  }, [selectedSchool, selectedClassIds, selectedSubjectIds, classes, subjects]);

  // Options for dropdowns
  const dropdownOptions = {
    countries: countries.map((c) => ({ value: c.id, label: c.name })),
    states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
    districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
    cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
    schools: schools.map((s) => ({
      value: s.id,
      label: `${s.school_name} (${s.city_name || ""})`,
    })),
    classes: classes.map((c) => ({ value: c.id, label: c.name })),
    subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
  };

  // PDF generation
  const handleGeneratePDF = async () => {
    if (!canGeneratePDF) {
      Swal.fire({
        icon: "warning",
        title: "No Students",
        text: "No students found for the selected criteria. Please select valid classes and subjects.",
      });
      return;
    }

    if (!examDate) {
      Swal.fire({
        icon: "warning",
        title: "Exam Date Required",
        text: "Please select an exam date to generate the attendance sheet.",
      });
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const schoolDetails = schools.find((s) => s.id === selectedSchool);
    const hiddenDiv = document.createElement("div");
    hiddenDiv.style.position = "absolute";
    hiddenDiv.style.left = "-9999px";
    document.body.appendChild(hiddenDiv);

    const { createRoot } = await import("react-dom/client");
    const root = createRoot(hiddenDiv);

    for (let i = 0; i < studentDataByClassSubject.length; i++) {
      const { className, subjectName, students, totalCount } =
        studentDataByClassSubject[i];

      if (students.length === 0) continue; // Skip empty student lists

      root.render(
        <AttendanceSheet
          studentData={students}
          subject={subjectName}
          className={className}
          schoolName={schoolDetails?.school_name || selectedSchool}
          schoolAddress={
            schoolDetails
              ? `${schoolDetails.city_name}, ${schoolDetails.district_name}, ${schoolDetails.state_name}, ${schoolDetails.country_name}`
              : "Unknown Address"
          }
          schoolCode="OR0829"
          examDate={examDate}
          srsSection={students[0]?.section || "A"}
          allottedSec={students[0]?.section || "A"}
          totalStudents={totalCount}
        />
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(hiddenDiv, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.1);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) {
        doc.addPage();
      }

      doc.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
    }

    doc.save(`${schoolDetails?.school_name || "School"}_Attendance_Sheet.pdf`);

    root.unmount();
    document.body.removeChild(hiddenDiv);

    Swal.fire({
      icon: "success",
      title: "PDF Generated",
      text: "The attendance sheets have been generated successfully with separate pages for each class-subject combination.",
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
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={dropdownOptions.states}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry || isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={dropdownOptions.districts}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState || isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="City"
                  value={selectedCity}
                  options={dropdownOptions.cities}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDistrict || isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="School"
                  value={selectedSchool}
                  options={dropdownOptions.schools}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  disabled={isLoading || !selectedCity}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Classes"
                  value={selectedClassIds}
                  options={dropdownOptions.classes}
                  onChange={(e) => setSelectedClassIds(e.target.value)}
                  disabled={isLoading || !selectedSchool}
                  multiple={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Subjects"
                  value={selectedSubjectIds}
                  options={dropdownOptions.subjects}
                  onChange={(e) => setSelectedSubjectIds(e.target.value)}
                  disabled={isLoading || !selectedSchool}
                  multiple={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Exam Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={isLoading || !selectedSchool}
                />
              </Grid>
            </Grid>

            <Box mt={3} mb={3}>
              {studentDataByClassSubject.length > 0 ? (
                <Typography variant="h6" color="primary">
                  (Total Students: {studentDataByClassSubject[0]?.totalCount})
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
                onClick={handleGeneratePDF}
                disabled={
                  !selectedSchool ||
                  selectedClassIds.length === 0 ||
                  selectedSubjectIds.length === 0 ||
                  !examDate ||
                  isLoading ||
                  !canGeneratePDF
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
