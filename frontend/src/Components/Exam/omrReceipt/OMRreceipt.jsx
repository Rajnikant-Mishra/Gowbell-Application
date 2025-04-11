// import React, { useState, useEffect } from "react";
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
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";

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
//     {options.map((option, index) => (
//       <MenuItem key={index} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedRollNo, setSelectedRollNo] = useState("");
//   const [students, setStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

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

//   const navigate = useNavigate();

//   // Fetch initial data
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const [countriesRes, statesRes, districtsRes, citiesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           ]);
//         setCountries(
//           Array.isArray(countriesRes?.data) ? countriesRes.data : []
//         );
//         setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
//         setDistricts(
//           Array.isArray(districtsRes?.data) ? districtsRes.data : []
//         );
//         setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     };
//     fetchLocationData();
//   }, []);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           response.data.map((cls) => ({ value: cls.name, label: cls.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(
//           response.data.map((sub) => ({ value: sub.name, label: sub.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch schools by location
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
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
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Save student data to /api/omr-receipt
//   const saveStudentData = async (studentData) => {
//     try {
//       // If studentData is an array, map through it; otherwise, handle single object
//       const studentsToSave = Array.isArray(studentData)
//         ? studentData
//         : [studentData];

//       const promises = studentsToSave.map(async (student) => {
//         const payload = {
//           school_name: student.school_name || selectedSchool || "",
//           student_name: student.student_name || "",
//           roll_no: student.roll_no || selectedRollNo || "",
//           class_name: student.class_name || selectedClasses[0] || "", // Take first class if multiple
//           student_section: student.student_section || "",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject.join(",")
//             : student.student_subject || selectedSubjects.join(",") || "",
//           mobile_number: student.mobile_number || "",
//           status: student.status || "pending",
//         };

//         // Ensure all required fields are present
//         const requiredFields = [
//           "school_name",
//           "student_name",
//           "roll_no",
//           "class_name",
//           "student_section",
//           "student_subject",
//         ];
//         const missingFields = requiredFields.filter(
//           (field) => !payload[field] || payload[field].trim() === ""
//         );

//         if (missingFields.length > 0) {
//           console.warn(
//             `Missing required fields for student: ${missingFields.join(", ")}`
//           );
//           return null;
//         }

//         return axios.post(`${API_BASE_URL}/api/omr-receipt`, payload);
//       });

//       const responses = await Promise.all(promises);
//       responses.forEach((response, index) => {
//         if (response && response.data.success) {
//           console.log(
//             `Student ${index + 1} saved successfully:`,
//             response.data
//           );
//         } else {
//           console.warn(`Failed to save student ${index + 1}:`, response?.data);
//         }
//       });
//     } catch (error) {
//       console.error(
//         "Error saving data to /api/omr-receipt:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   // Fetch students based on selected criteria
//   const fetchStudents = async () => {
//     if (
//       !selectedSchool ||
//       selectedClasses.length === 0 ||
//       selectedSubjects.length === 0
//     ) {
//       setStudents([]);
//       return;
//     }

//     const payload = {
//       school_name: selectedSchool,
//       class_names: selectedClasses,
//       subjects: selectedSubjects,
//       ...(selectedRollNo && { roll_no: selectedRollNo }),
//     };

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/filter`,
//         payload
//       );
//       if (response.data.success && Array.isArray(response.data.data)) {
//         const updatedStudents = response.data.data.map((student) => ({
//           ...student,
//           status:
//             student.roll_no === selectedRollNo && selectedRollNo
//               ? "active"
//               : "inactive",
//           // Ensure student_subject is an array or convert it
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject
//             : student.student_subject?.split(",") || [],
//         }));
//         setStudents(updatedStudents);

//         // Save the fetched data to /api/omr-receipt if roll_no is provided
//         if (selectedRollNo) {
//           await saveStudentData(updatedStudents);
//         }
//       } else {
//         console.warn("No students found:", response.data);
//         setStudents([]);
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching students:",
//         error.response?.data || error.message
//       );
//       setStudents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Trigger fetchStudents when roll number or other criteria change
//   useEffect(() => {
//     fetchStudents();
//   }, [selectedSchool, selectedClasses, selectedSubjects, selectedRollNo]);

//   // Location change handlers
//   useEffect(() => {
//     if (selectedCountry) {
//       setFilteredStates(
//         states.filter((state) => state.country_id === selectedCountry)
//       );
//       fetchSchoolsByLocation({ country: selectedCountry });
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       setFilteredDistricts(
//         districts.filter((district) => district.state_id === selectedState)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//       });
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       setFilteredCities(
//         cities.filter((city) => city.district_id === selectedDistrict)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     }
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedDistrict, cities]);

//   useEffect(() => {
//     if (selectedCity) {
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//       });
//     }
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCity]);

//   // Handlers
//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleClassesChange = (event) => setSelectedClasses(event.target.value);
//   const handleSubjectsChange = (event) =>
//     setSelectedSubjects(event.target.value);
//   const handleRollNoChange = (e) => setSelectedRollNo(e.target.value);

//   // Dropdown options
//   const countryOptions = countries.map((country) => ({
//     value: country.id,
//     label: country.name,
//   }));
//   const stateOptions = filteredStates.map((state) => ({
//     value: state.id,
//     label: state.name,
//   }));
//   const districtOptions = filteredDistricts.map((district) => ({
//     value: district.id,
//     label: district.name,
//   }));
//   const cityOptions = filteredCities.map((city) => ({
//     value: city.id,
//     label: city.name,
//   }));

//   // Status style
//   const getStatusStyle = (status) => ({
//     color: status === "active" ? "green" : "red",
//     fontWeight: "bold",
//   });

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={`${styles.main}`}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             OMR Receipt
//           </Typography>
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={schools.map((school) => ({
//                     value: school.school_name,
//                     label: `${school.school_name} ${
//                       school.city_name ? `(${school.city_name})` : ""
//                     }`,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel id="classes-label">Classes</InputLabel>
//                   <Select
//                     labelId="classes-label"
//                     multiple
//                     value={selectedClasses}
//                     onChange={handleClassesChange}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((value) => (
//                           <Chip
//                             key={value}
//                             label={
//                               classes.find((c) => c.value === value)?.label ||
//                               value
//                             }
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {classes.map((cls) => (
//                       <MenuItem key={cls.value} value={cls.value}>
//                         {cls.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel id="subjects-label">Subjects</InputLabel>
//                   <Select
//                     labelId="subjects-label"
//                     multiple
//                     value={selectedSubjects}
//                     onChange={handleSubjectsChange}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((value) => (
//                           <Chip
//                             key={value}
//                             label={
//                               subjects.find((s) => s.value === value)?.label ||
//                               value
//                             }
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {subjects.map((sub) => (
//                       <MenuItem key={sub.value} value={sub.value}>
//                         {sub.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="Roll Number (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={selectedRollNo}
//                   onChange={handleRollNoChange}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           {/* Students Table */}
//           <Box mt={4}>
//             <Typography variant="h6" gutterBottom>
//               Students
//             </Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>School</TableCell>
//                   <TableCell>Student</TableCell>
//                   <TableCell>Roll No</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Section</TableCell>
//                   <TableCell>Subject</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       Loading students...
//                     </TableCell>
//                   </TableRow>
//                 ) : students.length > 0 ? (
//                   students.map((student, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{student.school_name || "N/A"}</TableCell>
//                       <TableCell>{student.student_name || "N/A"}</TableCell>
//                       <TableCell>{student.roll_no || "N/A"}</TableCell>
//                       <TableCell>{student.class_name || "N/A"}</TableCell>
//                       <TableCell>{student.student_section || "N/A"}</TableCell>
//                       <TableCell>
//                         {student.student_subject
//                           ? student.student_subject
//                               .map(
//                                 (subject) =>
//                                   subject.charAt(0).toUpperCase() +
//                                   subject.slice(1)
//                               )
//                               .join(", ")
//                           : "N/A"}
//                       </TableCell>
//                       <TableCell>{student.mobile_number || "N/A"}</TableCell>
//                       <TableCell style={getStatusStyle(student.status)}>
//                         {student.status || "N/A"}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       {selectedSchool &&
//                       selectedClasses.length > 0 &&
//                       selectedSubjects.length > 0
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class, and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

// import React, { useState, useEffect } from "react";
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
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TablePagination,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";

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
//     {options.map((option, index) => (
//       <MenuItem key={index} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedRollNo, setSelectedRollNo] = useState("");
//   const [students, setStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Pagination states
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

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

//   const navigate = useNavigate();

//   // Fetch initial data
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const [countriesRes, statesRes, districtsRes, citiesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           ]);
//         setCountries(
//           Array.isArray(countriesRes?.data) ? countriesRes.data : []
//         );
//         setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
//         setDistricts(
//           Array.isArray(districtsRes?.data) ? districtsRes.data : []
//         );
//         setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     };
//     fetchLocationData();
//   }, []);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           response.data.map((cls) => ({ value: cls.name, label: cls.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(
//           response.data.map((sub) => ({ value: sub.name, label: sub.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch schools by location
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
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
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Save student data to /api/omr-receipt
//   const saveStudentData = async (studentData) => {
//     try {
//       const studentsToSave = Array.isArray(studentData)
//         ? studentData
//         : [studentData];

//       const promises = studentsToSave.map(async (student) => {
//         const payload = {
//           school_name: student.school_name || selectedSchool || "",
//           student_name: student.student_name || "",
//           roll_no: student.roll_no || selectedRollNo || "",
//           class_name: student.class_name || selectedClasses[0] || "",
//           student_section: student.student_section || "",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject.join(",")
//             : student.student_subject || selectedSubjects.join(",") || "",
//           mobile_number: student.mobile_number || "",
//           status: student.status || "pending",
//         };

//         const requiredFields = [
//           "school_name",
//           "student_name",
//           "roll_no",
//           "class_name",
//           "student_section",
//           "student_subject",
//         ];
//         const missingFields = requiredFields.filter(
//           (field) => !payload[field] || payload[field].trim() === ""
//         );

//         if (missingFields.length > 0) {
//           console.warn(
//             `Missing required fields for student: ${missingFields.join(", ")}`
//           );
//           return null;
//         }

//         return axios.post(`${API_BASE_URL}/api/omr-receipt`, payload);
//       });

//       const responses = await Promise.all(promises);
//       responses.forEach((response, index) => {
//         if (response && response.data.success) {
//           console.log(
//             `Student ${index + 1} saved successfully:`,
//             response.data
//           );
//         } else {
//           console.warn(`Failed to save student ${index + 1}:`, response?.data);
//         }
//       });
//     } catch (error) {
//       console.error(
//         "Error saving data to /api/omr-receipt:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   // Fetch students based on selected criteria
//   const fetchStudents = async () => {
//     if (
//       !selectedSchool ||
//       selectedClasses.length === 0 ||
//       selectedSubjects.length === 0
//     ) {
//       setStudents([]);
//       return;
//     }

//     const payload = {
//       school_name: selectedSchool,
//       class_names: selectedClasses,
//       subjects: selectedSubjects,
//       ...(selectedRollNo && { roll_no: selectedRollNo }),
//     };

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/filter`,
//         payload
//       );
//       if (response.data.success && Array.isArray(response.data.data)) {
//         const updatedStudents = response.data.data.map((student) => ({
//           ...student,
//           status:
//             student.roll_no === selectedRollNo && selectedRollNo
//               ? "success"
//               : "pending",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject
//             : student.student_subject?.split(",") || [],
//         }));
//         setStudents(updatedStudents);

//         if (selectedRollNo) {
//           await saveStudentData(updatedStudents);
//         }
//       } else {
//         console.warn("No students found:", response.data);
//         setStudents([]);
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching students:",
//         error.response?.data || error.message
//       );
//       setStudents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, [selectedSchool, selectedClasses, selectedSubjects, selectedRollNo]);

//   // Location change handlers
//   useEffect(() => {
//     if (selectedCountry) {
//       setFilteredStates(
//         states.filter((state) => state.country_id === selectedCountry)
//       );
//       fetchSchoolsByLocation({ country: selectedCountry });
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       setFilteredDistricts(
//         districts.filter((district) => district.state_id === selectedState)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//       });
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       setFilteredCities(
//         cities.filter((city) => city.district_id === selectedDistrict)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     }
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedDistrict, cities]);

//   useEffect(() => {
//     if (selectedCity) {
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//       });
//     }
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCity]);

//   // Handlers
//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleClassesChange = (event) => setSelectedClasses(event.target.value);
//   const handleSubjectsChange = (event) =>
//     setSelectedSubjects(event.target.value);
//   const handleRollNoChange = (e) => setSelectedRollNo(e.target.value);

//   // Pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Dropdown options
//   const countryOptions = countries.map((country) => ({
//     value: country.id,
//     label: country.name,
//   }));
//   const stateOptions = filteredStates.map((state) => ({
//     value: state.id,
//     label: state.name,
//   }));
//   const districtOptions = filteredDistricts.map((district) => ({
//     value: district.id,
//     label: district.name,
//   }));
//   const cityOptions = filteredCities.map((city) => ({
//     value: city.id,
//     label: city.name,
//   }));

//   // Status style
//   const getStatusStyle = (status) => ({
//     color: status === "success" ? "green" : "red",
//     fontWeight: "bold",
//   });

//   // Calculate totals
//   const totalPending = students.filter(
//     (student) => student.status === "pending"
//   ).length;
//   const totalSuccess = students.filter(
//     (student) => student.status === "success"
//   ).length;

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={`${styles.main}`}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             OMR Receipt
//           </Typography>
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={schools.map((school) => ({
//                     value: school.school_name,
//                     label: `${school.school_name} ${
//                       school.city_name ? `(${school.city_name})` : ""
//                     }`,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel id="classes-label">Classes</InputLabel>
//                   <Select
//                     labelId="classes-label"
//                     multiple
//                     value={selectedClasses}
//                     onChange={handleClassesChange}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((value) => (
//                           <Chip
//                             key={value}
//                             label={
//                               classes.find((c) => c.value === value)?.label ||
//                               value
//                             }
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {classes.map((cls) => (
//                       <MenuItem key={cls.value} value={cls.value}>
//                         {cls.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel id="subjects-label">Subjects</InputLabel>
//                   <Select
//                     labelId="subjects-label"
//                     multiple
//                     value={selectedSubjects}
//                     onChange={handleSubjectsChange}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((value) => (
//                           <Chip
//                             key={value}
//                             label={
//                               subjects.find((s) => s.value === value)?.label ||
//                               value
//                             }
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {subjects.map((sub) => (
//                       <MenuItem key={sub.value} value={sub.value}>
//                         {sub.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="Roll Number (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={selectedRollNo}
//                   onChange={handleRollNoChange}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           {/* Students Table */}
//           <Box mt={4}>
//             <Typography variant="h6" gutterBottom>
//               Students
//             </Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>School</TableCell>
//                   <TableCell>Student</TableCell>
//                   <TableCell>Roll No</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Section</TableCell>
//                   <TableCell>Subject</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       Loading students...
//                     </TableCell>
//                   </TableRow>
//                 ) : students.length > 0 ? (
//                   students
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((student, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{student.school_name || "N/A"}</TableCell>
//                         <TableCell>{student.student_name || "N/A"}</TableCell>
//                         <TableCell>{student.roll_no || "N/A"}</TableCell>
//                         <TableCell>{student.class_name || "N/A"}</TableCell>
//                         <TableCell>
//                           {student.student_section || "N/A"}
//                         </TableCell>
//                         <TableCell>
//                           {student.student_subject
//                             ? student.student_subject
//                                 .map(
//                                   (subject) =>
//                                     subject.charAt(0).toUpperCase() +
//                                     subject.slice(1)
//                                 )
//                                 .join(", ")
//                             : "N/A"}
//                         </TableCell>
//                         <TableCell>{student.mobile_number || "N/A"}</TableCell>
//                         <TableCell style={getStatusStyle(student.status)}>
//                           {student.status || "N/A"}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       {selectedSchool &&
//                       selectedClasses.length > 0 &&
//                       selectedSubjects.length > 0
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class, and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>

//             {/* Summary and Pagination Row */}
//             {students.length > 0 && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mt={2}
//               >
//                 <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                   Total Pending: {totalPending} | Total Success: {totalSuccess}
//                 </Typography>

//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25]}
//                   component="div"
//                   count={students.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//               </Box>
//             )}
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   MenuItem,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TablePagination,
//   Autocomplete,
//   Checkbox,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import { RxCross2 } from "react-icons/rx";

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
//     {options.map((option, index) => (
//       <MenuItem key={index} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedRollNo, setSelectedRollNo] = useState("");
//   const [students, setStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Pagination states
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

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

//   // Ref for Roll Number input
//   const rollNoRef = useRef(null);

//   const navigate = useNavigate();

//   // Fetch initial data
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const [countriesRes, statesRes, districtsRes, citiesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           ]);
//         setCountries(
//           Array.isArray(countriesRes?.data) ? countriesRes.data : []
//         );
//         setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
//         setDistricts(
//           Array.isArray(districtsRes?.data) ? districtsRes.data : []
//         );
//         setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     };
//     fetchLocationData();
//   }, []);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           response.data.map((cls) => ({ value: cls.name, label: cls.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(
//           response.data.map((sub) => ({ value: sub.name, label: sub.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch schools by location
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
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
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, [selectedSchool, selectedClasses, selectedSubjects, selectedRollNo]);

//   // Location change handlers
//   useEffect(() => {
//     if (selectedCountry) {
//       setFilteredStates(
//         states.filter((state) => state.country_id === selectedCountry)
//       );
//       fetchSchoolsByLocation({ country: selectedCountry });
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       setFilteredDistricts(
//         districts.filter((district) => district.state_id === selectedState)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//       });
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       setFilteredCities(
//         cities.filter((city) => city.district_id === selectedDistrict)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     }
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedDistrict, cities]);

//   useEffect(() => {
//     if (selectedCity) {
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//       });
//     }
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCity]);

//   // Focus Roll Number input when subjects change
//   useEffect(() => {
//     if (
//       selectedSubjects.length > 0 &&
//       rollNoRef.current &&
//       !isLoading &&
//       selectedSchool
//     ) {
//       rollNoRef.current.focus();
//     }
//   }, [selectedSubjects, isLoading, selectedSchool]);

//   // Dropdown options
//   const countryOptions = countries.map((country) => ({
//     value: country.id,
//     label: country.name,
//   }));
//   const stateOptions = filteredStates.map((state) => ({
//     value: state.id,
//     label: state.name,
//   }));
//   const districtOptions = filteredDistricts.map((district) => ({
//     value: district.id,
//     label: district.name,
//   }));
//   const cityOptions = filteredCities.map((city) => ({
//     value: city.id,
//     label: city.name,
//   }));

//   // Save student data
//   const saveStudentData = async (studentData) => {
//     try {
//       const studentsToSave = Array.isArray(studentData)
//         ? studentData
//         : [studentData];
//       const promises = studentsToSave.map(async (student) => {
//         const payload = {
//           school_name: student.school_name || selectedSchool || "",
//           student_name: student.student_name || "",
//           roll_no: student.roll_no || selectedRollNo || "",
//           class_name: student.class_name || selectedClasses[0] || "",
//           student_section: student.student_section || "",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject.join(",")
//             : student.student_subject || selectedSubjects.join(",") || "",
//           mobile_number: student.mobile_number || "",
//           status: student.status || "pending",
//         };

//         const requiredFields = [
//           "school_name",
//           "student_name",
//           "roll_no",
//           "class_name",
//           "student_section",
//           "student_subject",
//         ];
//         const missingFields = requiredFields.filter(
//           (field) => !payload[field] || payload[field].trim() === ""
//         );

//         if (missingFields.length > 0) {
//           console.warn(`Missing required fields: ${missingFields.join(", ")}`);
//           return null;
//         }

//         return axios.post(`${API_BASE_URL}/api/omr-receipt`, payload);
//       });

//       const responses = await Promise.all(promises);
//       responses.forEach((response, index) => {
//         if (response && response.data.success) {
//           console.log(
//             `Student ${index + 1} saved successfully:`,
//             response.data
//           );
//         }
//       });
//     } catch (error) {
//       console.error(
//         "Error saving data:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   // Fetch students
//   const fetchStudents = async () => {
//     if (
//       !selectedSchool ||
//       selectedClasses.length === 0 ||
//       selectedSubjects.length === 0
//     ) {
//       setStudents([]);
//       return;
//     }

//     const payload = {
//       school_name: selectedSchool,
//       class_names: selectedClasses,
//       subjects: selectedSubjects,
//       ...(selectedRollNo && { roll_no: selectedRollNo }),
//     };

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/filter/omr-receipt`,
//         payload
//       );
//       if (response.data.success && Array.isArray(response.data.data)) {
//         const updatedStudents = response.data.data.map((student) => ({
//           ...student,
//           status:
//             student.roll_no === selectedRollNo && selectedRollNo
//               ? "success"
//               : "pending",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject
//             : student.student_subject?.split(",") || [],
//         }));
//         setStudents(updatedStudents);
//         if (selectedRollNo) await saveStudentData(updatedStudents);
//       } else {
//         setStudents([]);
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching students:",
//         error.response?.data || error.message
//       );
//       setStudents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handlers
//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleRollNoChange = (e) => setSelectedRollNo(e.target.value);
//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Status style
//   const getStatusStyle = (status) => ({
//     color: status === "success" ? "green" : "red",
//     fontWeight: "bold",
//   });

//   // Calculate totals
//   const totalPending = students.filter(
//     (student) => student.status === "pending"
//   ).length;
//   const totalSuccess = students.filter(
//     (student) => student.status === "success"
//   ).length;

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={`${styles.main}`}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             OMR Receipt
//           </Typography>
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={schools.map((school) => ({
//                     value: school.school_name,
//                     label: `${school.school_name} ${
//                       school.city_name ? `(${school.city_name})` : ""
//                     }`,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="classes"
//                   options={classes}
//                   value={selectedClasses.map((classItem) => ({
//                     value: classItem,
//                     label: classItem,
//                   }))}
//                   onChange={(e, newValue) => {
//                     setSelectedClasses(newValue.map((item) => item.value));
//                   }}
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedClasses.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newClasses = selectedClasses.filter(
//                               (item) => item !== option.value
//                             );
//                             setSelectedClasses(newClasses);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Classes"
//                       placeholder="Choose classes"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="subjects"
//                   options={subjects}
//                   value={selectedSubjects.map((subjectItem) => ({
//                     value: subjectItem,
//                     label: subjectItem,
//                   }))}
//                   onChange={(e, newValue) => {
//                     setSelectedSubjects(newValue.map((item) => item.value));
//                   }}
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedSubjects.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newSubjects = selectedSubjects.filter(
//                               (item) => item !== option.value
//                             );
//                             setSelectedSubjects(newSubjects);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Subjects"
//                       placeholder="Choose subjects"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   inputRef={rollNoRef}
//                   label="Roll Number (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={selectedRollNo}
//                   onChange={handleRollNoChange}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           {/* Students Table */}
//           <Box mt={4}>
//             <Typography variant="h6" gutterBottom>
//               Students
//             </Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>School</TableCell>
//                   <TableCell>Student</TableCell>
//                   <TableCell>Roll No</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Section</TableCell>
//                   <TableCell>Subject</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       Loading students...
//                     </TableCell>
//                   </TableRow>
//                 ) : students.length > 0 ? (
//                   students
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((student, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{student.school_name || "N/A"}</TableCell>
//                         <TableCell>{student.student_name || "N/A"}</TableCell>
//                         <TableCell>{student.roll_no || "N/A"}</TableCell>
//                         <TableCell>{student.class_name || "N/A"}</TableCell>
//                         <TableCell>
//                           {student.student_section || "N/A"}
//                         </TableCell>
//                         <TableCell>
//                           {student.student_subject
//                             ? student.student_subject
//                                 .map(
//                                   (subject) =>
//                                     subject.charAt(0).toUpperCase() +
//                                     subject.slice(1)
//                                 )
//                                 .join(", ")
//                             : "N/A"}
//                         </TableCell>
//                         <TableCell>{student.mobile_number || "N/A"}</TableCell>
//                         <TableCell style={getStatusStyle(student.status)}>
//                           {student.status || "N/A"}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       {selectedSchool &&
//                       selectedClasses.length > 0 &&
//                       selectedSubjects.length > 0
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class, and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>

//             {students.length > 0 && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mt={2}
//               >
//                 <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                   Total Pending: {totalPending} | Total Success: {totalSuccess}
//                 </Typography>
//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25]}
//                   component="div"
//                   count={students.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//               </Box>
//             )}
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   MenuItem,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TablePagination,
//   Autocomplete,
//   Checkbox,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import { RxCross2 } from "react-icons/rx";

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
//     {options.map((option, index) => (
//       <MenuItem key={index} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedRollNo, setSelectedRollNo] = useState("");
//   const [students, setStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

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

//   const rollNoRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const [countriesRes, statesRes, districtsRes, citiesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           ]);
//         setCountries(
//           Array.isArray(countriesRes?.data) ? countriesRes.data : []
//         );
//         setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
//         setDistricts(
//           Array.isArray(districtsRes?.data) ? districtsRes.data : []
//         );
//         setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     };
//     fetchLocationData();
//   }, []);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           response.data.map((cls) => ({ value: cls.name, label: cls.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(
//           response.data.map((sub) => ({ value: sub.name, label: sub.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
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
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, [selectedSchool, selectedClasses, selectedSubjects, selectedRollNo]);

//   useEffect(() => {
//     if (selectedCountry) {
//       setFilteredStates(
//         states.filter((state) => state.country_id === selectedCountry)
//       );
//       fetchSchoolsByLocation({ country: selectedCountry });
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       setFilteredDistricts(
//         districts.filter((district) => district.state_id === selectedState)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//       });
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       setFilteredCities(
//         cities.filter((city) => city.district_id === selectedDistrict)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     }
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedDistrict, cities]);

//   useEffect(() => {
//     if (selectedCity) {
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//       });
//     }
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCity]);

//   useEffect(() => {
//     if (
//       selectedSubjects.length > 0 &&
//       rollNoRef.current &&
//       !isLoading &&
//       selectedSchool
//     ) {
//       rollNoRef.current.focus();
//     }
//   }, [selectedSubjects, isLoading, selectedSchool]);

//   const countryOptions = countries.map((country) => ({
//     value: country.id,
//     label: country.name,
//   }));
//   const stateOptions = filteredStates.map((state) => ({
//     value: state.id,
//     label: state.name,
//   }));
//   const districtOptions = filteredDistricts.map((district) => ({
//     value: district.id,
//     label: district.name,
//   }));
//   const cityOptions = filteredCities.map((city) => ({
//     value: city.id,
//     label: city.name,
//   }));

//   const saveStudentData = async (studentData) => {
//     try {
//       const studentsToSave = Array.isArray(studentData)
//         ? studentData
//         : [studentData];
//       const promises = studentsToSave.map(async (student) => {
//         const payload = {
//           school_name: student.school_name || selectedSchool || "",
//           student_name: student.student_name || "",
//           roll_no: student.roll_no || selectedRollNo || "",
//           class_name: student.class_name || selectedClasses[0] || "",
//           student_section: student.student_section || "",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject.join(",")
//             : student.student_subject || selectedSubjects.join(",") || "",
//           mobile_number: student.mobile_number || "",
//           status: student.status || "pending",
//         };

//         const requiredFields = [
//           "school_name",
//           "student_name",
//           "roll_no",
//           "class_name",
//           "student_section",
//           "student_subject",
//         ];
//         const missingFields = requiredFields.filter(
//           (field) => !payload[field] || payload[field].trim() === ""
//         );

//         if (missingFields.length > 0) {
//           console.warn(`Missing required fields: ${missingFields.join(", ")}`);
//           return null;
//         }

//         return axios.post(`${API_BASE_URL}/api/omr-receipt`, payload);
//       });

//       const responses = await Promise.all(promises);
//       responses.forEach((response, index) => {
//         if (response && response.data.success) {
//           console.log(
//             `Student ${index + 1} saved successfully:`,
//             response.data
//           );
//         }
//       });
//     } catch (error) {
//       console.error(
//         "Error saving data:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const fetchStudents = async () => {
//     if (
//       !selectedSchool ||
//       selectedClasses.length === 0 ||
//       selectedSubjects.length === 0
//     ) {
//       setStudents([]);
//       return;
//     }

//     const payload = {
//       school_name: selectedSchool,
//       class_names: selectedClasses,
//       subjects: selectedSubjects,
//       ...(selectedRollNo && { roll_no: selectedRollNo }),
//     };

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/filter/omr-receipt`,
//         payload
//       );
//       if (response.data.success && Array.isArray(response.data.data)) {
//         const updatedStudents = response.data.data.map((student) => ({
//           ...student,
//           status:
//             student.status === "success"
//               ? "success"
//               : student.roll_no === selectedRollNo && selectedRollNo
//               ? "success"
//               : "pending",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject
//             : student.student_subject?.split(",") || [],
//         }));
//         setStudents(updatedStudents);
//         if (selectedRollNo) await saveStudentData(updatedStudents);
//       } else {
//         setStudents([]);
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching students:",
//         error.response?.data || error.message
//       );
//       setStudents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleRollNoChange = (e) => setSelectedRollNo(e.target.value);
//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const getStatusStyle = (status) => ({
//     color: status === "success" ? "green" : "red",
//     fontWeight: "bold",
//   });

//   const totalPending = students.filter(
//     (student) => student.status === "pending"
//   ).length;
//   const totalSuccess = students.filter(
//     (student) => student.status === "success"
//   ).length;
//   const totalStudents = students.length;

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={`${styles.main}`}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             OMR Receipt
//           </Typography>
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={schools.map((school) => ({
//                     value: school.school_name,
//                     label: `${school.school_name} ${
//                       school.city_name ? `(${school.city_name})` : ""
//                     }`,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="classes"
//                   options={classes}
//                   value={selectedClasses.map((classItem) => ({
//                     value: classItem,
//                     label: classItem,
//                   }))}
//                   onChange={(e, newValue) => {
//                     setSelectedClasses(newValue.map((item) => item.value));
//                   }}
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedClasses.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newClasses = selectedClasses.filter(
//                               (item) => item !== option.value
//                             );
//                             setSelectedClasses(newClasses);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Classes"
//                       placeholder="Choose classes"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="subjects"
//                   options={subjects}
//                   value={selectedSubjects.map((subjectItem) => ({
//                     value: subjectItem,
//                     label: subjectItem,
//                   }))}
//                   onChange={(e, newValue) => {
//                     setSelectedSubjects(newValue.map((item) => item.value));
//                   }}
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedSubjects.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newSubjects = selectedSubjects.filter(
//                               (item) => item !== option.value
//                             );
//                             setSelectedSubjects(newSubjects);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Subjects"
//                       placeholder="Choose subjects"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   inputRef={rollNoRef}
//                   label="Roll Number (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={selectedRollNo}
//                   onChange={handleRollNoChange}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           <Box mt={4}>
//             <Typography variant="h6" gutterBottom>
//               Students
//             </Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>School</TableCell>
//                   <TableCell>Student</TableCell>
//                   <TableCell>Roll No</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Section</TableCell>
//                   <TableCell>Subject</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       Loading students...
//                     </TableCell>
//                   </TableRow>
//                 ) : students.length > 0 ? (
//                   students
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((student, index) => (
//                       <TableRow key={student.roll_no || index}>
//                         <TableCell>{student.school_name || "N/A"}</TableCell>
//                         <TableCell>{student.student_name || "N/A"}</TableCell>
//                         <TableCell>{student.roll_no || "N/A"}</TableCell>
//                         <TableCell>{student.class_name || "N/A"}</TableCell>
//                         <TableCell>
//                           {student.student_section || "N/A"}
//                         </TableCell>
//                         <TableCell>
//                           {student.student_subject
//                             ? student.student_subject
//                                 .map(
//                                   (subject) =>
//                                     subject.charAt(0).toUpperCase() +
//                                     subject.slice(1)
//                                 )
//                                 .join(", ")
//                             : "N/A"}
//                         </TableCell>
//                         <TableCell>{student.mobile_number || "N/A"}</TableCell>
//                         <TableCell style={getStatusStyle(student.status)}>
//                           {student.status || "N/A"}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       {selectedSchool &&
//                       selectedClasses.length > 0 &&
//                       selectedSubjects.length > 0
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class, and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//             {students.length > 0 && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mt={2}
//                 px={2}
//               >
//                 <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                   Total Students: {totalStudents} | Success: {totalSuccess} |
//                   Pending: {totalPending}
//                 </Typography>
//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25, 50]}
//                   component="div"
//                   count={students.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   labelRowsPerPage="Rows per page:"
//                   showFirstButton
//                   showLastButton
//                 />
//               </Box>
//             )}
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

//==============================================================================

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   MenuItem,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TablePagination,
//   Autocomplete,
//   Checkbox,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import { RxCross2 } from "react-icons/rx";

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
//     {options.map((option, index) => (
//       <MenuItem key={index} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedRollNo, setSelectedRollNo] = useState("");
//   const [students, setStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalCount, setTotalCount] = useState(0);

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

//   const rollNoRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch initial location data
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const [countriesRes, statesRes, districtsRes, citiesRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//         ]);
//         setCountries(Array.isArray(countriesRes?.data) ? countriesRes.data : []);
//         setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
//         setDistricts(Array.isArray(districtsRes?.data) ? districtsRes.data : []);
//         setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     };
//     fetchLocationData();
//   }, []);

//   // Fetch classes
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(response.data.map((cls) => ({ value: cls.name, label: cls.name })));
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch subjects
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(response.data.map((sub) => ({ value: sub.name, label: sub.name })));
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch schools based on location filters
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/get/filter`, { params: filters });
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
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch students when filters change
//   useEffect(() => {
//     fetchStudents();
//   }, [selectedSchool, selectedClasses, selectedSubjects, selectedRollNo]);

//   // Location filter effects
//   useEffect(() => {
//     if (selectedCountry) {
//       setFilteredStates(states.filter((state) => state.country_id === selectedCountry));
//       fetchSchoolsByLocation({ country: selectedCountry });
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       setFilteredDistricts(districts.filter((district) => district.state_id === selectedState));
//       fetchSchoolsByLocation({ country: selectedCountry, state: selectedState });
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       setFilteredCities(cities.filter((city) => city.district_id === selectedDistrict));
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     }
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedDistrict, cities]);

//   useEffect(() => {
//     if (selectedCity) {
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//       });
//     }
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCity]);

//   // Auto-focus roll number field when subjects are selected
//   useEffect(() => {
//     if (selectedSubjects.length > 0 && rollNoRef.current && !isLoading && selectedSchool) {
//       rollNoRef.current.focus();
//     }
//   }, [selectedSubjects, isLoading, selectedSchool]);

//   // Dropdown options
//   const countryOptions = countries.map((country) => ({ value: country.id, label: country.name }));
//   const stateOptions = filteredStates.map((state) => ({ value: state.id, label: state.name }));
//   const districtOptions = filteredDistricts.map((district) => ({ value: district.id, label: district.name }));
//   const cityOptions = filteredCities.map((city) => ({ value: city.id, label: city.name }));

//   // Save student data to backend
//   const saveStudentData = async (studentData) => {
//     try {
//       const studentsToSave = Array.isArray(studentData) ? studentData : [studentData];
//       const promises = studentsToSave.map(async (student) => {
//         const payload = {
//           school_name: student.school_name || selectedSchool || "",
//           student_name: student.student_name || "",
//           roll_no: student.roll_no || selectedRollNo || "",
//           class_name: student.class_name || selectedClasses[0] || "",
//           student_section: student.student_section || "",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject.join(",")
//             : student.student_subject || selectedSubjects.join(",") || "",
//           mobile_number: student.mobile_number || "",
//           status: student.status || "pending",
//         };

//         const requiredFields = ["school_name", "student_name", "roll_no", "class_name", "student_subject"];
//         const missingFields = requiredFields.filter((field) => !payload[field] || payload[field].trim() === "");

//         if (missingFields.length > 0) {
//           console.warn(`Missing required fields: ${missingFields.join(", ")}`);
//           return null;
//         }

//         return axios.post(`${API_BASE_URL}/api/omr-receipt`, payload);
//       });

//       const responses = await Promise.all(promises);
//       responses.forEach((response, index) => {
//         if (response?.data.success) {
//           console.log(`Student ${index + 1} saved successfully:`, response.data);
//         }
//       });
//     } catch (error) {
//       console.error("Error saving data:", error.response?.data || error.message);
//     }
//   };

//   // Fetch students from backend
//   const fetchStudents = async () => {
//     if (!selectedSchool || selectedClasses.length === 0 || selectedSubjects.length === 0) {
//       setStudents([]);
//       setTotalCount(0);
//       return;
//     }

//     const payload = {
//       school_name: selectedSchool,
//       class_names: selectedClasses,
//       subjects: selectedSubjects,
//       ...(selectedRollNo && { roll_no: selectedRollNo }),
//     };

//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/get/filter/omr-receipt`, payload);
//       if (response.data.success && Array.isArray(response.data.data)) {
//         const updatedStudents = response.data.data.map((student) => ({
//           ...student,
//           status: student.status || (student.roll_no === selectedRollNo && selectedRollNo ? "success" : "pending"),
//           student_subject: Array.isArray(student.student_subject) ? student.student_subject : [student.student_subject],
//         }));
//         setStudents(updatedStudents);
//         setTotalCount(response.data.total_count || updatedStudents.length);
//         if (selectedRollNo) await saveStudentData(updatedStudents);
//       } else {
//         setStudents([]);
//         setTotalCount(0);
//       }
//     } catch (error) {
//       console.error("Error fetching students:", error.response?.data || error.message);
//       setStudents([]);
//       setTotalCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Event handlers
//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleRollNoChange = (e) => setSelectedRollNo(e.target.value);
//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Status styling
//   const getStatusStyle = (status) => ({
//     color: status === "success" ? "green" : "red",
//     fontWeight: "bold",
//   });

//   // Calculate totals
//   const totalPending = students.filter((student) => student.status === "pending").length;
//   const totalSuccess = students.filter((student) => student.status === "success").length;
//   const totalStudents = students.length;

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper className={`${styles.main}`} elevation={3} style={{ padding: "20px", marginTop: "16px" }}>
//           <Typography className={`${styles.formTitle} mb-4`}>OMR Receipt</Typography>
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={schools.map((school) => ({
//                     value: school.school_name,
//                     label: `${school.school_name} ${school.city_name ? `(${school.city_name})` : ""}`,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="classes"
//                   options={classes}
//                   value={selectedClasses.map((classItem) => ({ value: classItem, label: classItem }))}
//                   onChange={(e, newValue) => setSelectedClasses(newValue.map((item) => item.value))}
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) => option.value === value.value}
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox checked={selectedClasses.includes(option.value)} color="primary" />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{ marginLeft: "6px", cursor: "pointer", fontWeight: "bold", color: "white" }}
//                           onClick={() => {
//                             const newClasses = selectedClasses.filter((item) => item !== option.value);
//                             setSelectedClasses(newClasses);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Classes"
//                       placeholder="Choose classes"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{ ...params.InputProps, style: { fontSize: "0.8rem", padding: "6px 12px", fontFamily: "Poppins" } }}
//                       InputLabelProps={{ style: { fontSize: "0.85rem", lineHeight: "1.5", fontFamily: "Poppins", fontWeight: "bolder" } }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="subjects"
//                   options={subjects}
//                   value={selectedSubjects.map((subjectItem) => ({ value: subjectItem, label: subjectItem }))}
//                   onChange={(e, newValue) => setSelectedSubjects(newValue.map((item) => item.value))}
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) => option.value === value.value}
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox checked={selectedSubjects.includes(option.value)} color="primary" />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{ marginLeft: "6px", cursor: "pointer", fontWeight: "bold", color: "white" }}
//                           onClick={() => {
//                             const newSubjects = selectedSubjects.filter((item) => item !== option.value);
//                             setSelectedSubjects(newSubjects);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Subjects"
//                       placeholder="Choose subjects"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{ ...params.InputProps, style: { fontSize: "0.8rem", padding: "6px 12px", fontFamily: "Poppins" } }}
//                       InputLabelProps={{ style: { fontSize: "0.85rem", lineHeight: "1.5", fontFamily: "Poppins", fontWeight: "bolder" } }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   inputRef={rollNoRef}
//                   label="Roll Number (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={selectedRollNo}
//                   onChange={handleRollNoChange}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           <Box mt={4}>
//             <Typography variant="h6" gutterBottom>Students</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>School</TableCell>
//                   <TableCell>Student</TableCell>
//                   <TableCell>Roll No</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Section</TableCell>
//                   <TableCell>Subject</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">Loading students...</TableCell>
//                   </TableRow>
//                 ) : students.length > 0 ? (
//                   students
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((student, index) => (
//                       <TableRow key={student.roll_no || index}>
//                         <TableCell>{student.school_name || "N/A"}</TableCell>
//                         <TableCell>{student.student_name || "N/A"}</TableCell>
//                         <TableCell>{student.roll_no || "N/A"}</TableCell>
//                         <TableCell>{student.class_name || "N/A"}</TableCell>
//                         <TableCell>{student.student_section || "N/A"}</TableCell>
//                         <TableCell>
//                           {student.student_subject.length > 0
//                             ? student.student_subject
//                                 .map((subject) => subject.charAt(0).toUpperCase() + subject.slice(1))
//                                 .join(", ")
//                             : "N/A"}
//                         </TableCell>
//                         <TableCell>{student.mobile_number || "N/A"}</TableCell>
//                         <TableCell style={getStatusStyle(student.status)}>
//                           {student.status || "N/A"}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       {selectedSchool && selectedClasses.length > 0 && selectedSubjects.length > 0
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class, and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//             {students.length > 0 && (
//               <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={2}>
//                 <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                   Total Students: {totalCount} | Success: {totalSuccess} | Pending: {totalPending}
//                 </Typography>
//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25, 50]}
//                   component="div"
//                   count={totalCount}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   labelRowsPerPage="Rows per page:"
//                   showFirstButton
//                   showLastButton
//                 />
//               </Box>
//             )}
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

//----------------------------------------------------------------------------------
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   MenuItem,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Autocomplete,
//   Checkbox,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import { RxCross2 } from "react-icons/rx";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";

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
//     {options.map((option, index) => (
//       <MenuItem key={index} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedRollNo, setSelectedRollNo] = useState("");
//   const [students, setStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1); // Changed to start from 1
//   const [pageSize, setPageSize] = useState(5);
//   const pageSizes = [5, 10, 25, 50];
//   const [totalCount, setTotalCount] = useState(0);

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

//   const rollNoRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch initial location data
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const [countriesRes, statesRes, districtsRes, citiesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           ]);
//         setCountries(
//           Array.isArray(countriesRes?.data) ? countriesRes.data : []
//         );
//         setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
//         setDistricts(
//           Array.isArray(districtsRes?.data) ? districtsRes.data : []
//         );
//         setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     };
//     fetchLocationData();
//   }, []);

//   // Fetch classes
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           response.data.map((cls) => ({ value: cls.name, label: cls.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch subjects
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(
//           response.data.map((sub) => ({ value: sub.name, label: sub.name }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch schools based on location filters
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
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
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch students when filters change
//   useEffect(() => {
//     fetchStudents();
//   }, [selectedSchool, selectedClasses, selectedSubjects, selectedRollNo]);

//   // Location filter effects
//   useEffect(() => {
//     if (selectedCountry) {
//       setFilteredStates(
//         states.filter((state) => state.country_id === selectedCountry)
//       );
//       fetchSchoolsByLocation({ country: selectedCountry });
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       setFilteredDistricts(
//         districts.filter((district) => district.state_id === selectedState)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//       });
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       setFilteredCities(
//         cities.filter((city) => city.district_id === selectedDistrict)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     }
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedDistrict, cities]);

//   useEffect(() => {
//     if (selectedCity) {
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//       });
//     }
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCity]);

//   // Auto-focus roll number field when subjects are selected
//   useEffect(() => {
//     if (
//       selectedSubjects.length > 0 &&
//       rollNoRef.current &&
//       !isLoading &&
//       selectedSchool
//     ) {
//       rollNoRef.current.focus();
//     }
//   }, [selectedSubjects, isLoading, selectedSchool]);

//   // Dropdown options
//   const countryOptions = countries.map((country) => ({
//     value: country.id,
//     label: country.name,
//   }));
//   const stateOptions = filteredStates.map((state) => ({
//     value: state.id,
//     label: state.name,
//   }));
//   const districtOptions = filteredDistricts.map((district) => ({
//     value: district.id,
//     label: district.name,
//   }));
//   const cityOptions = filteredCities.map((city) => ({
//     value: city.id,
//     label: city.name,
//   }));

//   // Save student data to backend
//   const saveStudentData = async (studentData) => {
//     try {
//       const studentsToSave = Array.isArray(studentData)
//         ? studentData
//         : [studentData];
//       const promises = studentsToSave.map(async (student) => {
//         const payload = {
//           school_name: student.school_name || selectedSchool || "",
//           student_name: student.student_name || "",
//           roll_no: student.roll_no || selectedRollNo || "",
//           class_name: student.class_name || selectedClasses[0] || "",
//           student_section: student.student_section || "",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject.join(",")
//             : student.student_subject || selectedSubjects.join(",") || "",
//           mobile_number: student.mobile_number || "",
//           status: student.status || "pending",
//         };

//         const requiredFields = [
//           "school_name",
//           "student_name",
//           "roll_no",
//           "class_name",
//           "student_subject",
//         ];
//         const missingFields = requiredFields.filter(
//           (field) => !payload[field] || payload[field].trim() === ""
//         );

//         if (missingFields.length > 0) {
//           console.warn(`Missing required fields: ${missingFields.join(", ")}`);
//           return null;
//         }

//         return axios.post(`${API_BASE_URL}/api/omr-receipt`, payload);
//       });

//       const responses = await Promise.all(promises);
//       responses.forEach((response, index) => {
//         if (response?.data.success) {
//           console.log(
//             `Student ${index + 1} saved successfully:`,
//             response.data
//           );
//         }
//       });
//     } catch (error) {
//       console.error(
//         "Error saving data:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   // Fetch students from backend
//   // const fetchStudents = async () => {
//   //   if (
//   //     !selectedSchool ||
//   //     selectedClasses.length === 0 ||
//   //     selectedSubjects.length === 0
//   //   ) {
//   //     setStudents([]);
//   //     setTotalCount(0);
//   //     return;
//   //   }

//   //   const payload = {
//   //     school_name: selectedSchool,
//   //     class_names: selectedClasses,
//   //     subjects: selectedSubjects,
//   //     ...(selectedRollNo && { roll_no: selectedRollNo }),
//   //   };

//   //   setIsLoading(true);
//   //   try {
//   //     const response = await axios.post(
//   //       `${API_BASE_URL}/api/get/filter/omr-receipt`,
//   //       payload
//   //     );
//   //     if (response.data.success && Array.isArray(response.data.data)) {
//   //       const updatedStudents = response.data.data.map((student) => ({
//   //         ...student,
//   //         status:
//   //           student.status ||
//   //           (student.roll_no === selectedRollNo && selectedRollNo
//   //             ? "success"
//   //             : "pending"),
//   //         student_subject: Array.isArray(student.student_subject)
//   //           ? student.student_subject
//   //           : student.student_subject
//   //           ? [student.student_subject]
//   //           : [],
//   //       }));
//   //       setStudents(updatedStudents);
//   //       setTotalCount(response.data.total_subject_count || updatedStudents.length);
//   //       if (selectedRollNo) await saveStudentData(updatedStudents);
//   //     } else {
//   //       setStudents([]);
//   //       setTotalCount(0);
//   //     }
//   //   } catch (error) {
//   //     console.error(
//   //       "Error fetching students:",
//   //       error.response?.data || error.message
//   //     );
//   //     setStudents([]);
//   //     setTotalCount(0);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const fetchStudents = useCallback(async () => {
//     if (!selectedSchool || !selectedClassIds.length || !selectedSubjectIds.length) {
//       setTotalCount(0);
//       setFetchError(null);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axios.post(`${API_BASE_URL}/api/get/filter/omr-receipt`, {
//         schoolName: selectedSchool,
//         classList: selectedClassIds,
//         subjectList: selectedSubjectIds,
//       });

//       setTotalCount(response.data.totalCount || 0);
//       setFetchError(null);
//     } catch (error) {
//       console.error("Error fetching student count:", error);
//       setFetchError("Failed to fetch student count");
//       setTotalCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedSchool, selectedClassIds, selectedSubjectIds]);

//   // Event handlers
//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleRollNoChange = (e) => setSelectedRollNo(e.target.value);
//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };
//   const handleNextPage = () => {
//     if (page < Math.ceil(totalCount / pageSize)) setPage(page + 1);
//   };

//   // Status styling
//   const getStatusStyle = (status) => ({
//     color: status === "success" ? "green" : "red",
//     fontWeight: "bold",
//   });

//   // Calculate totals
//   const totalPending = students.filter(
//     (student) => student.status === "pending"
//   ).length;
//   const totalSuccess = students.filter(
//     (student) => student.status === "success"
//   ).length;
//   const totalStudents = students.length;

//   // Paginated students
//   const paginatedStudents = students.slice(
//     (page - 1) * pageSize,
//     (page - 1) * pageSize + pageSize
//   );

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={`${styles.main}`}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             OMR Receipt
//           </Typography>
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={schools.map((school) => ({
//                     value: school.school_name,
//                     label: `${school.school_name} ${
//                       school.city_name ? `(${school.city_name})` : ""
//                     }`,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="classes"
//                   options={classes}
//                   value={selectedClasses.map((classItem) => ({
//                     value: classItem,
//                     label: classItem,
//                   }))}
//                   onChange={(e, newValue) =>
//                     setSelectedClasses(newValue.map((item) => item.value))
//                   }
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedClasses.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newClasses = selectedClasses.filter(
//                               (item) => item !== option.value
//                             );
//                             setSelectedClasses(newClasses);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Classes"
//                       placeholder="Choose classes"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="subjects"
//                   options={subjects}
//                   value={selectedSubjects.map((subjectItem) => ({
//                     value: subjectItem,
//                     label: subjectItem,
//                   }))}
//                   onChange={(e, newValue) =>
//                     setSelectedSubjects(newValue.map((item) => item.value))
//                   }
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedSubjects.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newSubjects = selectedSubjects.filter(
//                               (item) => item !== option.value
//                             );
//                             setSelectedSubjects(newSubjects);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Subjects"
//                       placeholder="Choose subjects"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   inputRef={rollNoRef}
//                   label="Roll Number (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={selectedRollNo}
//                   onChange={handleRollNoChange}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           <Box mt={4}>
//             <Typography variant="h6" gutterBottom>
//               Students
//             </Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>School</TableCell>
//                   <TableCell>Student</TableCell>
//                   <TableCell>Roll No</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Section</TableCell>
//                   <TableCell>Subject</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       Loading students...
//                     </TableCell>
//                   </TableRow>
//                 ) : paginatedStudents.length > 0 ? (
//                   paginatedStudents.map((student, index) => (
//                     <TableRow key={student.roll_no || index}>
//                       <TableCell>{student.school_name || "N/A"}</TableCell>
//                       <TableCell>{student.student_name || "N/A"}</TableCell>
//                       <TableCell>{student.roll_no || "N/A"}</TableCell>
//                       <TableCell>{student.class_name || "N/A"}</TableCell>
//                       <TableCell>{student.student_section || "N/A"}</TableCell>
//                       <TableCell>
//                         {student.student_subject.length > 0
//                           ? student.student_subject
//                               .map(
//                                 (subject) =>
//                                   subject.charAt(0).toUpperCase() +
//                                   subject.slice(1)
//                               )
//                               .join(", ")
//                           : "N/A"}
//                       </TableCell>
//                       <TableCell>{student.mobile_number || "N/A"}</TableCell>
//                       <TableCell style={getStatusStyle(student.status)}>
//                         {student.status || "N/A"}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       {selectedSchool &&
//                       selectedClasses.length > 0 &&
//                       selectedSubjects.length > 0
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class, and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//             {students.length > 0 && (
//               <Box mt={2}>
//                 <div className="d-flex justify-content-between flex-wrap mt-2">
//                   <div
//                     className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//                   >
//                     <select
//                       value={pageSize}
//                       onChange={(e) => {
//                         const selectedSize = parseInt(e.target.value, 10);
//                         setPageSize(selectedSize);
//                         setPage(1);
//                       }}
//                       className={styles.pageSizeSelect}
//                     >
//                       {pageSizes.map((size) => (
//                         <option key={size} value={size}>
//                           {size}
//                         </option>
//                       ))}
//                     </select>
//                     <p className="my-auto text-secondary">data per Page</p>
//                   </div>

//                   <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//                     <label style={{ fontFamily: "Nunito, sans-serif" }}>
//                       <p className="my-auto text-secondary">
//                         {students.length} of {page}-
//                         {Math.ceil(students.length / pageSize)}
//                       </p>
//                     </label>
//                   </div>

//                   <div className={`${styles.pagination} my-auto`}>
//                     <button
//                       onClick={handlePreviousPage}
//                       disabled={page === 1}
//                       className={styles.paginationButton}
//                     >
//                       <UilAngleLeftB />
//                     </button>

//                     {Array.from(
//                       { length: Math.ceil(students.length / pageSize) },
//                       (_, i) => i + 1
//                     )
//                       .filter(
//                         (pg) =>
//                           pg === 1 ||
//                           pg === Math.ceil(students.length / pageSize) ||
//                           Math.abs(pg - page) <= 2
//                       )
//                       .map((pg, index, array) => (
//                         <React.Fragment key={pg}>
//                           {index > 0 && pg > array[index - 1] + 1 && (
//                             <span className={styles.ellipsis}>...</span>
//                           )}
//                           <button
//                             onClick={() => setPage(pg)}
//                             className={`${styles.paginationButton} ${
//                               page === pg ? styles.activePage : ""
//                             }`}
//                           >
//                             {pg}
//                           </button>
//                         </React.Fragment>
//                       ))}

//                     <button
//                       onClick={handleNextPage}
//                       disabled={page === Math.ceil(students.length / pageSize)}
//                       className={styles.paginationButton}
//                     >
//                       <UilAngleRightB />
//                     </button>
//                   </div>
//                 </div>
//                 <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
//                   Total Student OMR: {totalCount}   |   Total Receipt: {totalSuccess}   |
//                   Pending: {totalPending}
//                 </Typography>
//               </Box>
//             )}
//             {/* total_subject_count */}
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

//=======================================================================================

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   MenuItem,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Autocomplete,
//   Checkbox,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import { RxCross2 } from "react-icons/rx";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";

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
//     {options.map((option, index) => (
//       <MenuItem key={index} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]); // Updated to IDs
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]); // Updated to IDs
//   const [selectedRollNo, setSelectedRollNo] = useState("");
//   const [students, setStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const pageSizes = [5, 10, 25, 50];
//   const [totalCount, setTotalCount] = useState(0);
//   const [fetchError, setFetchError] = useState(null); // Added fetchError state

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

//   const rollNoRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch initial location data
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const [countriesRes, statesRes, districtsRes, citiesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           ]);
//         setCountries(
//           Array.isArray(countriesRes?.data) ? countriesRes.data : []
//         );
//         setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
//         setDistricts(
//           Array.isArray(districtsRes?.data) ? districtsRes.data : []
//         );
//         setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     };
//     fetchLocationData();
//   }, []);

//   // Fetch classes (assuming API returns { id, name })
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           response.data.map((cls) => ({ value: cls.id, label: cls.name })) // Updated to use IDs
//         );
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch subjects (assuming API returns { id, name })
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(
//           response.data.map((sub) => ({ value: sub.id, label: sub.name })) // Updated to use IDs
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch schools based on location filters
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
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
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch students when filters change
//   useEffect(() => {
//     fetchStudents();
//   }, [selectedSchool, selectedClassIds, selectedSubjectIds, selectedRollNo]);

//   // Location filter effects
//   useEffect(() => {
//     if (selectedCountry) {
//       setFilteredStates(
//         states.filter((state) => state.country_id === selectedCountry)
//       );
//       fetchSchoolsByLocation({ country: selectedCountry });
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       setFilteredDistricts(
//         districts.filter((district) => district.state_id === selectedState)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//       });
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       setFilteredCities(
//         cities.filter((city) => city.district_id === selectedDistrict)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     }
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedDistrict, cities]);

//   useEffect(() => {
//     if (selectedCity) {
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//       });
//     }
//     setSelectedSchool("");
//     setSelectedRollNo("");
//     setStudents([]);
//   }, [selectedCity]);

//   // Auto-focus roll number field when subjects are selected
//   useEffect(() => {
//     if (
//       selectedSubjectIds.length > 0 &&
//       rollNoRef.current &&
//       !isLoading &&
//       selectedSchool
//     ) {
//       rollNoRef.current.focus();
//     }
//   }, [selectedSubjectIds, isLoading, selectedSchool]);

//   // Dropdown options
//   const countryOptions = countries.map((country) => ({
//     value: country.id,
//     label: country.name,
//   }));
//   const stateOptions = filteredStates.map((state) => ({
//     value: state.id,
//     label: state.name,
//   }));
//   const districtOptions = filteredDistricts.map((district) => ({
//     value: district.id,
//     label: district.name,
//   }));
//   const cityOptions = filteredCities.map((city) => ({
//     value: city.id,
//     label: city.name,
//   }));

//   // Save student data to backend
//   const saveStudentData = async (studentData) => {
//     try {
//       const studentsToSave = Array.isArray(studentData)
//         ? studentData
//         : [studentData];
//       const promises = studentsToSave.map(async (student) => {
//         const payload = {
//           school_name: student.school_name || selectedSchool || "",
//           student_name: student.student_name || "",
//           roll_no: student.roll_no || selectedRollNo || "",
//           class_name: student.class_name || classes.find(cls => cls.value === selectedClassIds[0])?.label || "",
//           student_section: student.student_section || "",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject.join(",")
//             : student.student_subject || subjects.filter(sub => selectedSubjectIds.includes(sub.value)).map(sub => sub.label).join(",") || "",
//           mobile_number: student.mobile_number || "",
//           status: student.status || "pending",
//         };

//         const requiredFields = [
//           "school_name",
//           "student_name",
//           "roll_no",
//           "class_name",
//           "student_subject",
//         ];
//         const missingFields = requiredFields.filter(
//           (field) => !payload[field] || payload[field].trim() === ""
//         );

//         if (missingFields.length > 0) {
//           console.warn(`Missing required fields: ${missingFields.join(", ")}`);
//           return null;
//         }

//         return axios.post(`${API_BASE_URL}/api/omr-receipt`, payload);
//       });

//       const responses = await Promise.all(promises);
//       responses.forEach((response, index) => {
//         if (response?.data.success) {
//           console.log(
//             `Student ${index + 1} saved successfully:`,
//             response.data
//           );
//         }
//       });
//     } catch (error) {
//       console.error(
//         "Error saving data:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   // Fetch students
//   const fetchStudents = useCallback(async () => {
//     if (!selectedSchool || !selectedClassIds.length || !selectedSubjectIds.length) {
//       setStudents([]);
//       setTotalCount(0);
//       setFetchError(null);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axios.post(`${API_BASE_URL}/api/get/filter/omr-receipt`, {
//         schoolName: selectedSchool,
//         classList: selectedClassIds,
//         subjectList: selectedSubjectIds,
//         ...(selectedRollNo && { roll_no: selectedRollNo }), // Added roll_no support
//       });

//       const fetchedStudents = response.data.students || [];
//       const updatedStudents = fetchedStudents.map((student) => ({
//         ...student,
//         status: student.status || (student.roll_no === selectedRollNo && selectedRollNo ? "success" : "pending"),
//         student_subject: Array.isArray(student.student_subject)
//           ? student.student_subject
//           : student.subject_names
//           ? student.subject_names.split(", ")
//           : [],
//       }));

//       setStudents(updatedStudents);
//       setTotalCount(response.data.totalCount || updatedStudents.length);
//       setFetchError(null);

//       if (selectedRollNo && updatedStudents.length > 0) {
//         await saveStudentData(updatedStudents);
//       }
//     } catch (error) {
//       console.error("Error fetching students:", error.response?.data || error.message);
//       setFetchError("Failed to fetch students");
//       setStudents([]);
//       setTotalCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedSchool, selectedClassIds, selectedSubjectIds, selectedRollNo]);

//   // Event handlers
//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleRollNoChange = (e) => setSelectedRollNo(e.target.value);
//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };
//   const handleNextPage = () => {
//     if (page < Math.ceil(totalCount / pageSize)) setPage(page + 1);
//   };

//   // Status styling
//   const getStatusStyle = (status) => ({
//     color: status === "success" ? "green" : "red",
//     fontWeight: "bold",
//   });

//   // Calculate totals
//   const totalPending = students.filter((student) => student.status === "pending").length;
//   const totalSuccess = students.filter((student) => student.status === "success").length;
//   const totalStudents = students.length;

//   // Paginated students
//   const paginatedStudents = students.slice(
//     (page - 1) * pageSize,
//     (page - 1) * pageSize + pageSize
//   );

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={`${styles.main}`}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             OMR Receipt
//           </Typography>
//           {fetchError && (
//             <Typography color="error" sx={{ mb: 2 }}>
//               {fetchError}
//             </Typography>
//           )}
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={schools.map((school) => ({
//                     value: school.school_name,
//                     label: `${school.school_name} ${
//                       school.city_name ? `(${school.city_name})` : ""
//                     }`,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="classes"
//                   options={classes}
//                   value={selectedClassIds.map((classId) => ({
//                     value: classId,
//                     label: classes.find((cls) => cls.value === classId)?.label || classId,
//                   }))}
//                   onChange={(e, newValue) =>
//                     setSelectedClassIds(newValue.map((item) => item.value))
//                   }
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) => option.value === value.value}
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedClassIds.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newClasses = selectedClassIds.filter(
//                               (item) => item !== option.value
//                             );
//                             setSelectedClassIds(newClasses);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Classes"
//                       placeholder="Choose classes"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
//                 <Autocomplete
//                   multiple
//                   id="subjects"
//                   options={subjects}
//                   value={selectedSubjectIds.map((subjectId) => ({
//                     value: subjectId,
//                     label: subjects.find((sub) => sub.value === subjectId)?.label || subjectId,
//                   }))}
//                   onChange={(e, newValue) =>
//                     setSelectedSubjectIds(newValue.map((item) => item.value))
//                   }
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) => option.value === value.value}
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedSubjectIds.includes(option.value)}
//                         color="primary"
//                       />
//                       {option.label}
//                     </li>
//                   )}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <span
//                         {...getTagProps({ index })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "white",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {option.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "white",
//                           }}
//                           onClick={() => {
//                             const newSubjects = selectedSubjectIds.filter(
//                               (item) => item !== option.value
//                             );
//                             setSelectedSubjectIds(newSubjects);
//                           }}
//                         />
//                       </span>
//                     ))
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Subjects"
//                       placeholder="Choose subjects"
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         ...params.InputProps,
//                         style: {
//                           fontSize: "0.8rem",
//                           padding: "6px 12px",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           lineHeight: "1.5",
//                           fontFamily: "Poppins",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   inputRef={rollNoRef}
//                   label="Roll Number (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={selectedRollNo}
//                   onChange={handleRollNoChange}
//                   disabled={isLoading || !selectedSchool}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           <Box mt={4}>
//             <Typography variant="h6" gutterBottom>
//               Students
//             </Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>School</TableCell>
//                   <TableCell>Student</TableCell>
//                   <TableCell>Roll No</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Section</TableCell>
//                   <TableCell>Subject</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       Loading students...
//                     </TableCell>
//                   </TableRow>
//                 ) : paginatedStudents.length > 0 ? (
//                   paginatedStudents.map((student, index) => (
//                     <TableRow key={student.roll_no || index}>
//                       <TableCell>{student.school_name || "N/A"}</TableCell>
//                       <TableCell>{student.student_name || "N/A"}</TableCell>
//                       <TableCell>{student.roll_no || "N/A"}</TableCell>
//                       <TableCell>{student.class_name || "N/A"}</TableCell>
//                       <TableCell>{student.student_section || "N/A"}</TableCell>
//                       <TableCell>
//                         {student.student_subject?.length > 0
//                           ? student.student_subject
//                               .map(
//                                 (subject) =>
//                                   subject.charAt(0).toUpperCase() + subject.slice(1)
//                               )
//                               .join(", ")
//                           : "N/A"}
//                       </TableCell>
//                       <TableCell>{student.mobile_number || "N/A"}</TableCell>
//                       <TableCell style={getStatusStyle(student.status)}>
//                         {student.status || "N/A"}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       {selectedSchool && selectedClassIds.length > 0 && selectedSubjectIds.length > 0
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class, and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//             {students.length > 0 && (
//               <Box mt={2}>
//                 <div className="d-flex justify-content-between flex-wrap mt-2">
//                   <div
//                     className={`${styles.pageSizeSelector} d-flex flex-wrap my-auto`}
//                   >
//                     <select
//                       value={pageSize}
//                       onChange={(e) => {
//                         const selectedSize = parseInt(e.target.value, 10);
//                         setPageSize(selectedSize);
//                         setPage(1);
//                       }}
//                       className={styles.pageSizeSelect}
//                     >
//                       {pageSizes.map((size) => (
//                         <option key={size} value={size}>
//                           {size}
//                         </option>
//                       ))}
//                     </select>
//                     <p className="my-auto text-secondary">data per Page</p>
//                   </div>

//                   <div className="my-0 d-flex justify-content-center align-items-center my-auto">
//                     <label style={{ fontFamily: "Nunito, sans-serif" }}>
//                       <p className="my-auto text-secondary">
//                         {students.length} of {page}-
//                         {Math.ceil(totalCount / pageSize)}
//                       </p>
//                     </label>
//                   </div>

//                   <div className={`${styles.pagination} my-auto`}>
//                     <button
//                       onClick={handlePreviousPage}
//                       disabled={page === 1}
//                       className={styles.paginationButton}
//                     >
//                       <UilAngleLeftB />
//                     </button>

//                     {Array.from(
//                       { length: Math.ceil(totalCount / pageSize) },
//                       (_, i) => i + 1
//                     )
//                       .filter(
//                         (pg) =>
//                           pg === 1 ||
//                           pg === Math.ceil(totalCount / pageSize) ||
//                           Math.abs(pg - page) <= 2
//                       )
//                       .map((pg, index, array) => (
//                         <React.Fragment key={pg}>
//                           {index > 0 && pg > array[index - 1] + 1 && (
//                             <span className={styles.ellipsis}>...</span>
//                           )}
//                           <button
//                             onClick={() => setPage(pg)}
//                             className={`${styles.paginationButton} ${
//                               page === pg ? styles.activePage : ""
//                             }`}
//                           >
//                             {pg}
//                           </button>
//                         </React.Fragment>
//                       ))}

//                     <button
//                       onClick={handleNextPage}
//                       disabled={page === Math.ceil(totalCount / pageSize)}
//                       className={styles.paginationButton}
//                     >
//                       <UilAngleRightB />
//                     </button>
//                   </div>
//                 </div>
//                 <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
//                   Total Student OMR: {totalCount} | Total Receipt: {totalSuccess} |
//                   Pending: {totalPending}
//                 </Typography>
//               </Box>
//             )}
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  Autocomplete,
  Checkbox,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import { RxCross2 } from "react-icons/rx";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";

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
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [selectedRollNo, setSelectedRollNo] = useState("");
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

  const rollNoRef = useRef(null);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch students when filters change
  useEffect(() => {
    fetchStudents();
  }, [selectedSchool, selectedClassIds, selectedSubjectIds, selectedRollNo]);

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
    setSelectedRollNo("");
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
    setSelectedRollNo("");
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
    setSelectedRollNo("");
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
    setSelectedRollNo("");
    setStudents([]);
  }, [selectedCity]);

  // Auto-focus roll number field when subjects are selected
  useEffect(() => {
    if (
      selectedSubjectIds.length > 0 &&
      rollNoRef.current &&
      !isLoading &&
      selectedSchool
    ) {
      rollNoRef.current.focus();
    }
  }, [selectedSubjectIds, isLoading, selectedSchool]);

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

  // Save student data to backend
  const saveStudentData = async (studentData) => {
    try {
      const studentsToSave = Array.isArray(studentData)
        ? studentData
        : [studentData];
      const promises = studentsToSave.map(async (student) => {
        const payload = {
          school_name: student.school_name || selectedSchool || "",
          student_name: student.student_name || "",
          roll_no: student.roll_no || selectedRollNo || "",
          class_name:
            student.class_name ||
            classes.find((cls) => cls.value === selectedClassIds[0])?.label ||
            "",
          student_section: student.student_section || "",
          student_subject: Array.isArray(student.student_subject)
            ? student.student_subject.join(",")
            : student.student_subject ||
              subjects
                .filter((sub) => selectedSubjectIds.includes(sub.value))
                .map((sub) => sub.label)
                .join(",") ||
              "",
          mobile_number: student.mobile_number || "",
          status: student.status || "pending",
        };

        const requiredFields = [
          "school_name",
          "student_name",
          "roll_no",
          "class_name",
          "student_subject",
        ];
        const missingFields = requiredFields.filter(
          (field) => !payload[field] || payload[field].trim() === ""
        );

        if (missingFields.length > 0) {
          console.warn(`Missing required fields: ${missingFields.join(", ")}`);
          return null;
        }

        return axios.post(`${API_BASE_URL}/api/omr-receipt`, payload);
      });

      const responses = await Promise.all(promises);
      responses.forEach((response, index) => {
        if (response?.data.success) {
          console.log(
            `Student ${index + 1} saved successfully:`,
            response.data
          );
        }
      });
    } catch (error) {
      console.error(
        "Error saving data:",
        error.response?.data || error.message
      );
    }
  };

  // Fetch students
  const fetchStudents = useCallback(async () => {
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
      let rollnoclasssubject = null;
      if (
        selectedRollNo &&
        selectedClassIds.length === 1 &&
        selectedSubjectIds.length === 1
      ) {
        rollnoclasssubject = `${selectedRollNo}-${selectedClassIds[0]}-${selectedSubjectIds[0]}`;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/get/filter/omr-receipt`,
        {
          schoolName: selectedSchool,
          classList: selectedClassIds,
          subjectList: selectedSubjectIds,
          ...(rollnoclasssubject && { rollnoclasssubject }), // Include rollnoclasssubject if constructed
          ...(selectedRollNo &&
            !rollnoclasssubject && { roll_no: selectedRollNo }), // Fallback to roll_no if rollnoclasssubject isn't used
        }
      );

      const fetchedStudents = response.data.students || [];
      const updatedStudents = fetchedStudents.map((student) => {
        let status = student.status || "pending";

        // If rollnoclasssubject is used, check roll number, class, and subject match
        if (rollnoclasssubject) {
          const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");
          const subjectsMatch = Array.isArray(student.student_subject)
            ? student.student_subject.includes(
                subjects.find((sub) => sub.value === Number(subjectId))?.label
              )
            : student.subject_names
                ?.split(", ")
                .includes(
                  subjects.find((sub) => sub.value === Number(subjectId))?.label
                );
          if (
            student.roll_no === rollNo &&
            student.class_name ===
              classes.find((cls) => cls.value === Number(classId))?.label &&
            subjectsMatch
          ) {
            status = "success";
          }
        }
        // Fallback to roll_no only check if rollnoclasssubject isn't used
        else if (student.roll_no === selectedRollNo && selectedRollNo) {
          status = "success";
        }

        return {
          ...student,
          status,
          student_subject: Array.isArray(student.student_subject)
            ? student.student_subject
            : student.subject_names
            ? student.subject_names.split(", ")
            : [],
        };
      });

      setStudents(updatedStudents);
      setTotalCount(response.data.totalCount || updatedStudents.length);
      setFetchError(null);

      if (selectedRollNo && updatedStudents.length > 0) {
        await saveStudentData(updatedStudents);
      }
    } catch (error) {
      console.error(
        "Error fetching students:",
        error.response?.data || error.message
      );
      setFetchError("Failed to fetch students");
      setStudents([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedSchool,
    selectedClassIds,
    selectedSubjectIds,
    selectedRollNo,
    classes,
    subjects,
    saveStudentData,
  ]);



  // Event handlers
  const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
  const handleRollNoChange = (e) => setSelectedRollNo(e.target.value);
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < Math.ceil(totalCount / pageSize)) setPage(page + 1);
  };

  // Status styling
  const getStatusStyle = (status) => ({
    color: status === "success" ? "green" : "red",
    fontWeight: "bold",
  });

  // Calculate totals
  const totalPending = students.filter(
    (student) => student.status === "pending"
  ).length;
  const totalSuccess = students.filter(
    (student) => student.status === "success"
  ).length;
  const totalStudents = students.length;

  // Paginated students
  const paginatedStudents = students.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
      </div>
      <Container component="main" maxWidth="">
        <Paper
          className={`${styles.main}`}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={`${styles.formTitle} mb-4`}>
            OMR Receipt
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
              <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
                <Autocomplete
                  multiple
                  id="classes"
                  options={classes}
                  value={selectedClassIds.map((classId) => ({
                    value: classId,
                    label:
                      classes.find((cls) => cls.value === classId)?.label ||
                      classId,
                  }))}
                  onChange={(e, newValue) =>
                    setSelectedClassIds(newValue.map((item) => item.value))
                  }
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        checked={selectedClassIds.includes(option.value)}
                        color="primary"
                      />
                      {option.label}
                    </li>
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <span
                        {...getTagProps({ index })}
                        style={{
                          backgroundColor: "#90D14F",
                          color: "white",
                          borderRadius: "2px",
                          padding: "4px 6px",
                          fontSize: "12px",
                          margin: "2px",
                          display: "inline-flex",
                          alignItems: "center",
                          fontFamily: "Poppins",
                        }}
                      >
                        {option.label}
                        <RxCross2
                          size={12}
                          style={{
                            marginLeft: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "white",
                          }}
                          onClick={() => {
                            const newClasses = selectedClassIds.filter(
                              (item) => item !== option.value
                            );
                            setSelectedClassIds(newClasses);
                          }}
                        />
                      </span>
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Classes"
                      placeholder="Choose classes"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        style: {
                          fontSize: "0.8rem",
                          padding: "6px 12px",
                          fontFamily: "Poppins",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.85rem",
                          lineHeight: "1.5",
                          fontFamily: "Poppins",
                          fontWeight: "bolder",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ mt: 2 }}>
                <Autocomplete
                  multiple
                  id="subjects"
                  options={subjects}
                  value={selectedSubjectIds.map((subjectId) => ({
                    value: subjectId,
                    label:
                      subjects.find((sub) => sub.value === subjectId)?.label ||
                      subjectId,
                  }))}
                  onChange={(e, newValue) =>
                    setSelectedSubjectIds(newValue.map((item) => item.value))
                  }
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        checked={selectedSubjectIds.includes(option.value)}
                        color="primary"
                      />
                      {option.label}
                    </li>
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <span
                        {...getTagProps({ index })}
                        style={{
                          backgroundColor: "#90D14F",
                          color: "white",
                          borderRadius: "2px",
                          padding: "4px 6px",
                          fontSize: "12px",
                          margin: "2px",
                          display: "inline-flex",
                          alignItems: "center",
                          fontFamily: "Poppins",
                        }}
                      >
                        {option.label}
                        <RxCross2
                          size={12}
                          style={{
                            marginLeft: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "white",
                          }}
                          onClick={() => {
                            const newSubjects = selectedSubjectIds.filter(
                              (item) => item !== option.value
                            );
                            setSelectedSubjectIds(newSubjects);
                          }}
                        />
                      </span>
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Subjects"
                      placeholder="Choose subjects"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        style: {
                          fontSize: "0.8rem",
                          padding: "6px 12px",
                          fontFamily: "Poppins",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.85rem",
                          lineHeight: "1.5",
                          fontFamily: "Poppins",
                          fontWeight: "bolder",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  inputRef={rollNoRef}
                  label="Roll Number (Optional)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={selectedRollNo}
                  onChange={handleRollNoChange}
                  disabled={isLoading || !selectedSchool}
                />
              </Grid>
            </Grid>
          </form>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Students
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>School</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, index) => (
                    <TableRow key={student.roll_no || index}>
                      <TableCell>{student.school_name || "N/A"}</TableCell>
                      <TableCell>{student.student_name || "N/A"}</TableCell>
                      <TableCell>{student.roll_no || "N/A"}</TableCell>
                      <TableCell>{student.class_name || "N/A"}</TableCell>
                      <TableCell>{student.student_section || "N/A"}</TableCell>
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
                      <TableCell>{student.mobile_number || "N/A"}</TableCell>
                      <TableCell style={getStatusStyle(student.status)}>
                        {student.status || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      {selectedSchool &&
                      selectedClassIds.length > 0 &&
                      selectedSubjectIds.length > 0
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
                <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
                  Total Issue: [ {totalCount} ] | Total Received: {" "}
                  [{totalSuccess}] | Pending: [{totalPending}]
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
