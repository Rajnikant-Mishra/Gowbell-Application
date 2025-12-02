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
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./Exam.module.css";
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
//     {options.map((option, index) => (
//       <MenuItem key={index} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const ExaminationForm = () => {
//   // State variables
//   const [schools, setSchools] = useState([]);
//   const [selectedSchoolId, setSelectedSchoolId] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [examDate, setExamDate] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Location data states
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);

//   // Selected location values
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   // Filtered location options
//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);

//   // Classes and Subjects states
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

//   // Fetch classes data
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         if (response.data && Array.isArray(response.data)) {
//           setClasses(
//             response.data.map((cls) => ({
//               value: cls.id, // e.g., "01", "02", "03"
//               label: cls.name,
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch subjects data
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         if (response.data && Array.isArray(response.data)) {
//           setSubjects(
//             response.data.map((sub) => ({
//               value: sub.id, // e.g., "gimo", "sijo"
//               label: sub.name,
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   //country
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

//         // ✅ Set India as default selected country
//         const india = countriesRes.data.find(
//           (country) => country.name?.toLowerCase().trim() === "india"
//         );
//         if (india) {
//           setSelectedCountry(india.id);
//         }
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//         setCountries([]);
//         setStates([]);
//         setDistricts([]);
//         setCities([]);
//       }
//     };

//     fetchLocationData();
//   }, []);

//   // Function to fetch schools based on location filters
//   const fetchSchoolsByLocation = async () => {
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
//             name: school.name,
//             country_name: location.country,
//             state_name: location.state,
//             district_name: location.district,
//             city_name: location.city,
//             school_code: school.school_code,
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
//   };

//   // Handle country change
//   useEffect(() => {
//     if (selectedCountry && Array.isArray(states)) {
//       const filtered = states.filter(
//         (state) => state.country_id === selectedCountry
//       );
//       setFilteredStates(filtered);
//     } else {
//       setFilteredStates([]);
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolId("");
//     setSchools([]);
//   }, [selectedCountry, states]);

//   // Handle state change
//   useEffect(() => {
//     if (selectedState && Array.isArray(districts)) {
//       const filtered = districts.filter(
//         (district) => district.state_id === selectedState
//       );
//       setFilteredDistricts(filtered);
//     } else {
//       setFilteredDistricts([]);
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolId("");
//     setSchools([]);
//   }, [selectedState, districts]);

//   // Handle district change
//   useEffect(() => {
//     if (selectedDistrict && Array.isArray(cities)) {
//       const filtered = cities.filter(
//         (city) => city.district_id === selectedDistrict
//       );
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities([]);
//     }
//     setSelectedCity("");
//     setSelectedSchoolId("");
//     setSchools([]);
//   }, [selectedDistrict, cities]);

//   // Handle city change
//   useEffect(() => {
//     if (selectedCity) {
//       fetchSchoolsByLocation();
//     } else {
//       setSchools([]);
//       setSelectedSchoolId("");
//     }
//   }, [selectedCity]);

//   // Handle school change
//   const handleSchoolChange = (e) => {
//     setSelectedSchoolId(e.target.value);
//   };

//   // Handle classes change
//   const handleClassesChange = (event) => {
//     setSelectedClassIds(event.target.value); // Stores array like ["01", "02", "03"]
//   };

//   // Handle subjects change
//   const handleSubjectsChange = (event) => {
//     setSelectedSubjectIds(event.target.value); // Stores array like ["gimo", "sijo"]
//   };

//   // Prepare options for dropdowns with null checks
//   const countryOptions = Array.isArray(countries)
//     ? countries.map((country) => ({
//         value: country.id,
//         label: country.name,
//       }))
//     : [];
//   const stateOptions = Array.isArray(filteredStates)
//     ? filteredStates.map((state) => ({
//         value: state.id,
//         label: state.name,
//       }))
//     : [];
//   const districtOptions = Array.isArray(filteredDistricts)
//     ? filteredDistricts.map((district) => ({
//         value: district.id,
//         label: district.name,
//       }))
//     : [];
//   const cityOptions = Array.isArray(filteredCities)
//     ? filteredCities.map((city) => ({
//         value: city.id,
//         label: city.name,
//       }))
//     : [];

//   // Handle exam date change
//   const handleExamDateChange = (event) => {
//     setExamDate(event.target.value);
//   };

//   // Handle save button click
//   const handleSave = async () => {
//     if (
//       !selectedSchoolId ||
//       !examDate ||
//       selectedClassIds.length === 0 ||
//       selectedSubjectIds.length === 0
//     ) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Unauthorized",
//         text: "Please log in to create an exam.",
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       });
//       return;
//     }

//     const session_id = localStorage.getItem("currentSessionId");
//     if (!session_id) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "No Session Selected",
//         text: "Please select a session from the header.",
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       });
//       return;
//     }

//     const examData = {
//       school_id: selectedSchoolId,
//       level: selectedLevel,
//       exam_date: examDate,
//       classes_id: JSON.stringify(selectedClassIds), // Stores as ["01", "02", "03"]
//       subjects_id: JSON.stringify(selectedSubjectIds), // Stores as ["gimo", "sijo"]
//       country: selectedCountry,
//       state: selectedState,
//       district: selectedDistrict,
//       city: selectedCity,
//       session_id: session_id, // Include session_id from localStorage
//     };

//     try {
//       setIsLoading(true);
//       setError(null);
//       await axios.post(`${API_BASE_URL}/api/e1/create-exam`, examData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: "Exam created successfully!",
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       });
//       navigate("/examList");
//       // Reset form
//       setSelectedSchoolId("");
//       setSelectedLevel("");
//       setExamDate("");
//       setSelectedClassIds([]);
//       setSelectedSubjectIds([]);
//     } catch (error) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error",
//         text:
//           error.response?.data?.error ||
//           "Failed to create exam. Please try again.",
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[
//             { name: "Exam", link: "/examList" },
//             { name: "Create Exam Schedule" },
//           ]}
//         />
//       </div>
//       <Container
//         component="main"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         <Paper
//           className={styles.main}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={styles.formTitle} sx={{ mb: 4 }}>
//             Create Exam Schedule
//           </Typography>
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               {/* Location fields */}
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
//               {/* School Dropdown */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchoolId}
//                   options={schools.map((school) => ({
//                     value: school.id,
//                     label: `${school.name} ${
//                       school.school_code ? `(${school.school_code})` : ""
//                     }`,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               {/* Classes Multi-Select Dropdown */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel id="classes-label">Classes</InputLabel>
//                   <Select
//                     labelId="classes-label"
//                     id="classes-select"
//                     multiple
//                     value={selectedClassIds}
//                     onChange={handleClassesChange}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((value) => {
//                           const selectedClass = classes.find(
//                             (c) => c.value === value
//                           );
//                           return (
//                             <Chip
//                               key={value}
//                               label={
//                                 selectedClass ? selectedClass.label : value
//                               }
//                               size="small"
//                             />
//                           );
//                         })}
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
//               {/* Subjects Multi-Select Dropdown */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel id="subjects-label">Subjects</InputLabel>
//                   <Select
//                     labelId="subjects-label"
//                     id="subjects-select"
//                     multiple
//                     value={selectedSubjectIds}
//                     onChange={handleSubjectsChange}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((value) => {
//                           const selectedSubject = subjects.find(
//                             (s) => s.value === value
//                           );
//                           return (
//                             <Chip
//                               key={value}
//                               label={
//                                 selectedSubject ? selectedSubject.label : value
//                               }
//                               size="small"
//                             />
//                           );
//                         })}
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
//               {/* Level Dropdown */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Level"
//                   value={selectedLevel}
//                   options={[
//                     { value: "Level 1", label: "Level 1" },
//                     { value: "Level 2", label: "Level 2" },
//                     { value: "Level 3", label: "Level 3" },
//                     { value: "Level 4", label: "Level 4" },
//                   ]}
//                   onChange={(e) => setSelectedLevel(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               {/* Exam Date Input */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="Exam Date"
//                   type="date"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   value={examDate}
//                   onChange={handleExamDateChange}
//                   disabled={isLoading}
//                 />
//               </Grid>
//             </Grid>
//           </form>
//           {/* Error message */}
//           {error && (
//             <Typography color="error" variant="body2" sx={{ mt: 2 }}>
//               {error}
//             </Typography>
//           )}
//           {/* Save Button */}
//           <Box
//             className={styles.buttonContainer}
//             sx={{ display: "flex", gap: 2, mt: 4 }}
//           >
//             <ButtonComp
//               variant="contained"
//               color="primary"
//               style={{ marginTop: "20px" }}
//               onClick={handleSave}
//               disabled={
//                 !selectedSchoolId ||
//                 !examDate ||
//                 selectedClassIds.length === 0 ||
//                 selectedSubjectIds.length === 0 ||
//                 isLoading
//               }
//               text={isLoading ? "Processing..." : "Submit"}
//               sx={{ flexGrow: 1 }}
//             />
//             <ButtonComp
//               text="Cancel"
//               type="button"
//               sx={{ flexGrow: 1 }}
//               onClick={() => navigate("/examList")}
//               disabled={isLoading}
//             />
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;

//========================================================================================================

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
//   CircularProgress,
//   Autocomplete,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./Exam.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import debounce from "lodash.debounce";

// // Reusable Dropdown
// const Dropdown = ({ label, value, options, onChange, disabled, loading }) => (
//   <TextField
//     select
//     label={label}
//     variant="outlined"
//     fullWidth
//     margin="normal"
//     size="small"
//     value={value}
//     onChange={onChange}
//     disabled={disabled || loading}
//     SelectProps={{
//       MenuProps: { PaperProps: { style: { maxHeight: 250 } } },
//     }}
//   >
//     {loading ? (
//       <MenuItem disabled>
//         <CircularProgress size={20} />
//       </MenuItem>
//     ) : options.length === 0 ? (
//       <MenuItem disabled>No options</MenuItem>
//     ) : (
//       options.map((option) => (
//         <MenuItem key={option.value} value={option.value}>
//           {option.label}
//         </MenuItem>
//       ))
//     )}
//   </TextField>
// );

// const ExaminationForm = () => {
//   const navigate = useNavigate();

//   // === State ===
//   const [schools, setSchools] = useState([]);
//   const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [examDate, setExamDate] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Location
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

//   // Classes & Subjects
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

//   const [locationLoading, setLocationLoading] = useState(false);
//   const [schoolLoading, setSchoolLoading] = useState(false);

//   // === Fetch Classes & Subjects ===
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           Array.isArray(res.data)
//             ? res.data.map((c) => ({ value: c.id, label: c.name }))
//             : []
//         );
//       } catch (e) {
//         console.error(e);
//       }
//     };
//     const fetchSubjects = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(
//           Array.isArray(res.data)
//             ? res.data.map((s) => ({ value: s.id, label: s.name }))
//             : []
//         );
//       } catch (e) {
//         console.error(e);
//       }
//     };
//     Promise.all([fetchClasses(), fetchSubjects()]);
//   }, []);

//   // === Fetch All Location Data Once ===
//   useEffect(() => {
//     const fetchAllLocations = async () => {
//       setLocationLoading(true);
//       try {
//         const [cRes, sRes, dRes, ciRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//         ]);

//         setCountries(Array.isArray(cRes.data) ? cRes.data : []);
//         setStates(Array.isArray(sRes.data) ? sRes.data : []);
//         setDistricts(Array.isArray(dRes.data) ? dRes.data : []);
//         setCities(Array.isArray(ciRes.data) ? ciRes.data : []);

//         const india = cRes.data.find(
//           (c) => c.name?.toLowerCase().trim() === "india"
//         );
//         if (india) setSelectedCountry(india.id);
//       } catch (e) {
//         console.error(e);
//         Swal.fire({
//           icon: "error",
//           title: "Failed to load locations",
//           toast: true,
//           position: "top-end",
//           timer: 1500,
//         });
//       } finally {
//         setLocationLoading(false);
//       }
//     };
//     fetchAllLocations();
//   }, []);

//   // === Filter States ===
//   useEffect(() => {
//     if (selectedCountry && states.length) {
//       const filtered = states.filter((s) => s.country_id === selectedCountry);
//       setFilteredStates(filtered);
//     } else {
//       setFilteredStates([]);
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolIds([]);
//     setSchools([]);
//   }, [selectedCountry, states]);

//   // === Filter Districts ===
//   useEffect(() => {
//     if (selectedState && districts.length) {
//       const filtered = districts.filter((d) => d.state_id === selectedState);
//       setFilteredDistricts(filtered);
//     } else {
//       setFilteredDistricts([]);
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolIds([]);
//     setSchools([]);
//   }, [selectedState, districts]);

//   // === Filter Cities ===
//   useEffect(() => {
//     if (selectedDistrict && cities.length) {
//       const filtered = cities.filter((c) => c.district_id === selectedDistrict);
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities([]);
//     }
//     setSelectedCity("");
//   }, [selectedDistrict, cities]);

//   // === Debounced School Fetch ===
//   const fetchSchools = useCallback(
//     debounce(async (filters) => {
//       if (!filters.state) {
//         setSchools([]);
//         return;
//       }

//       setSchoolLoading(true);
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/get/school-filter`, {
//           params: {
//             country: filters.country || null,
//             state: filters.state || null,
//             district: filters.district || null,
//             city: filters.city || null,
//           },
//         });

//         if (res.data.success) {
//           const list = res.data.data.flatMap((loc) =>
//             loc.schools.map((s) => ({
//               id: s.id,
//               name: s.name,
//               school_code: s.school_code,
//             }))
//           );
//           setSchools(list);
//         } else {
//           setSchools([]);
//         }
//       } catch (e) {
//         console.error(e);
//         setSchools([]);
//       } finally {
//         setSchoolLoading(false);
//       }
//     }, 400),
//     []
//   );

//   useEffect(() => {
//     fetchSchools({
//       country: selectedCountry,
//       state: selectedState,
//       district: selectedDistrict,
//       city: selectedCity,
//     });
//   }, [
//     selectedState,
//     selectedDistrict,
//     selectedCity,
//     selectedCountry,
//     fetchSchools,
//   ]);

//   // === Handle School Change with "All Schools" ===
//   const handleSchoolChange = (e, values) => {
//     const allOption = values.find((v) => v.id === "ALL_SCHOOLS");

//     if (allOption) {
//       const allIds = schools.map((s) => s.id);
//       setSelectedSchoolIds(allIds);
//     } else {
//       setSelectedSchoolIds(values.map((v) => v.id));
//     }
//   };

//   const handleClassesChange = (e) => {
//     setSelectedClassIds(e.target.value);
//   };

//   const handleSubjectsChange = (e) => {
//     setSelectedSubjectIds(e.target.value);
//   };

//   const handleExamDateChange = (e) => {
//     setExamDate(e.target.value);
//   };

//   const handleSave = async () => {
//     if (
//       selectedSchoolIds.length === 0 ||
//       !examDate ||
//       selectedClassIds.length === 0 ||
//       selectedSubjectIds.length === 0
//     ) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     const session_id = localStorage.getItem("currentSessionId");

//     if (!token) {
//       Swal.fire({
//         icon: "error",
//         title: "Unauthorized",
//         text: "Please log in.",
//         toast: true,
//         position: "top-end",
//         timer: 1000,
//         customClass: { popup: "small-swal" },
//       });
//       return;
//     }
//     if (!session_id) {
//       Swal.fire({
//         icon: "error",
//         title: "No Session",
//         text: "Select a session from header.",
//         toast: true,
//         position: "top-end",
//         timer: 1000,
//         customClass: { popup: "small-swal" },
//       });
//       return;
//     }

//     const payload = {
//       school_id: JSON.stringify(selectedSchoolIds),
//       level: selectedLevel,
//       exam_date: examDate,
//       classes_id: JSON.stringify(selectedClassIds),
//       subjects_id: JSON.stringify(selectedSubjectIds),
//       country: selectedCountry,
//       state: selectedState,
//       district: selectedDistrict,
//       city: selectedCity,
//       session_id,
//     };

//     setIsLoading(true);
//     setError(null);
//     try {
//       await axios.post(`${API_BASE_URL}/api/e1/create-exam`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: `Exam created for ${selectedSchoolIds.length} school(s)!`,
//         toast: true,
//         position: "top-end",
//         timer: 1000,
//         customClass: { popup: "small-swal" },
//       });
//       navigate("/examList");
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.response?.data?.error || "Failed to create exam.",
//         toast: true,
//         position: "top-end",
//         timer: 1500,
//         customClass: { popup: "small-swal" },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // === Options ===
//   const countryOptions = countries.map((c) => ({ value: c.id, label: c.name }));
//   const stateOptions = filteredStates.map((s) => ({
//     value: s.id,
//     label: s.name,
//   }));
//   const districtOptions = filteredDistricts.map((d) => ({
//     value: d.id,
//     label: d.name,
//   }));
//   const cityOptions = filteredCities.map((c) => ({
//     value: c.id,
//     label: c.name,
//   }));

//   const schoolOptions =
//     schools.length > 0
//       ? [
//           { id: "ALL_SCHOOLS", name: "All Schools", school_code: "" },
//           ...schools,
//         ]
//       : [];

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[
//             { name: "Exam", link: "/examList" },
//             { name: "Create Exam Schedule" },
//           ]}
//         />
//       </div>

//       <Container sx={{ display: "flex", justifyContent: "center" }}>
//         <Paper
//           className={styles.main}
//           elevation={3}
//           sx={{ p: 3, width: "100%", maxWidth: 1200 }}
//         >
//           <Typography className={styles.formTitle} sx={{ mb: 4 }}>
//             Create Exam Schedule
//           </Typography>

//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               {/* Location */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                   loading={locationLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry}
//                   loading={locationLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState}
//                   loading={locationLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict}
//                   loading={locationLoading}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               {/* School - MULTIPLE + ALL SCHOOLS + BLUE CHIPS */}

//               <Grid item xs={12} sm={6} md={3}>
//                 <Autocomplete
//                   multiple
//                   options={schoolOptions}
//                   getOptionLabel={(opt) =>
//                     opt.id === "ALL_SCHOOLS"
//                       ? "All Schools"
//                       : `${opt.name} ${
//                           opt.school_code ? `(${opt.school_code})` : ""
//                         }`
//                   }
//                   loading={schoolLoading}
//                   value={
//                     selectedSchoolIds.length === schools.length &&
//                     schools.length > 0
//                       ? [{ id: "ALL_SCHOOLS", name: "All Schools" }]
//                       : schools.filter((s) => selectedSchoolIds.includes(s.id))
//                   }
//                   onChange={handleSchoolChange}
//                   disabled={!selectedState || schoolLoading}
//                   renderTags={(value, getTagProps) => {
//                     if (value.some((v) => v.id === "ALL_SCHOOLS")) {
//                       return [
//                         <Chip
//                           key="all"
//                           label={`All Schools (${schools.length})`}
//                           size="small"
//                           sx={{
//                             backgroundColor: "#1230ae",
//                             color: "white",
//                             fontWeight: 600,
//                             "& .MuiChip-deleteIcon": {
//                               color: "rgba(255,255,255,0.8)",
//                               "&:hover": { color: "white" },
//                             },
//                           }}
//                           {...getTagProps({ index: 0 })}
//                         />,
//                       ];
//                     }
//                     return value.map((option, index) => (
//                       <Chip
//                         key={option.id}
//                         label={`${option.name} ${
//                           option.school_code ? `(${option.school_code})` : ""
//                         }`}
//                         size="small"
//                         sx={{
//                           backgroundColor: "#1230ae",
//                           color: "white",
//                           fontWeight: 500,
//                           "& .MuiChip-deleteIcon": {
//                             color: "rgba(255,255,255,0.7)",
//                             "&:hover": { color: "white" },
//                           },
//                         }}
//                         {...getTagProps({ index })}
//                       />
//                     ));
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Schools"
//                       variant="outlined"
//                       size="small"
//                       margin="normal"
//                       fullWidth
//                       placeholder={
//                         selectedState
//                           ? "Search or select 'All Schools'"
//                           : "Select State first"
//                       }
//                       InputProps={{
//                         ...params.InputProps,
//                         endAdornment: (
//                           <>
//                             {schoolLoading ? (
//                               <CircularProgress size={20} />
//                             ) : null}
//                             {params.InputProps.endAdornment}
//                           </>
//                         ),
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>

//               {/* Classes */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel>Classes</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedClassIds}
//                     onChange={handleClassesChange}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((v) => {
//                           const cls = classes.find((c) => c.value === v);
//                           return (
//                             <Chip
//                               key={v}
//                               label={cls?.label || v}
//                               size="small"
//                               sx={{
//                                 backgroundColor: "#1230ae",
//                                 color: "white",
//                                 fontWeight: 500,
//                                 "& .MuiChip-deleteIcon": {
//                                   color: "rgba(255,255,255,0.7)",
//                                   "&:hover": { color: "white" },
//                                 },
//                               }}
//                             />
//                           );
//                         })}
//                       </Box>
//                     )}
//                   >
//                     {classes.map((c) => (
//                       <MenuItem key={c.value} value={c.value}>
//                         {c.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* Subjects */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel>Subjects</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedSubjectIds}
//                     onChange={handleSubjectsChange}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((v) => {
//                           const sub = subjects.find((s) => s.value === v);
//                           return (
//                             <Chip
//                               key={v}
//                               label={sub?.label || v}
//                               size="small"
//                               sx={{
//                                 backgroundColor: "#1230ae",
//                                 color: "white",
//                                 fontWeight: 500,
//                                 "& .MuiChip-deleteIcon": {
//                                   color: "rgba(255,255,255,0.7)",
//                                   "&:hover": { color: "white" },
//                                 },
//                               }}
//                             />
//                           );
//                         })}
//                       </Box>
//                     )}
//                   >
//                     {subjects.map((s) => (
//                       <MenuItem key={s.value} value={s.value}>
//                         {s.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* Level */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Level"
//                   value={selectedLevel}
//                   options={[
//                     { value: "Level 1", label: "Level 1" },
//                     { value: "Level 2", label: "Level 2" },
//                     { value: "Level 3", label: "Level 3" },
//                     { value: "Level 4", label: "Level 4" },
//                   ]}
//                   onChange={(e) => setSelectedLevel(e.target.value)}
//                 />
//               </Grid>

//               {/* Exam Date */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="Exam Date"
//                   type="date"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   value={examDate}
//                   onChange={handleExamDateChange}
//                   disabled={isLoading}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           {error && (
//             <Typography color="error" variant="body2" sx={{ mt: 2 }}>
//               {error}
//             </Typography>
//           )}

//           <Box
//             className={styles.buttonContainer}
//             sx={{ display: "flex", gap: 2, mt: 4 }}
//           >
//             <ButtonComp
//               variant="contained"
//               color="primary"
//               onClick={handleSave}
//               disabled={
//                 selectedSchoolIds.length === 0 ||
//                 !examDate ||
//                 selectedClassIds.length === 0 ||
//                 selectedSubjectIds.length === 0 ||
//                 isLoading
//               }
//               text={isLoading ? "Processing..." : "Submit"}
//               sx={{ flexGrow: 1 }}
//             />
//             <ButtonComp
//               text="Cancel"
//               onClick={() => navigate("/examList")}
//               disabled={isLoading}
//               sx={{ flexGrow: 1 }}
//             />
//           </Box>
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
  Select,
  InputLabel,
  FormControl,
  Chip,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./Exam.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import debounce from "lodash.debounce";

// Reusable Dropdown
const Dropdown = ({ label, value, options, onChange, disabled, loading }) => (
  <TextField
    select
    label={label}
    variant="outlined"
    fullWidth
    margin="normal"
    size="small"
    value={value}
    onChange={onChange}
    disabled={disabled || loading}
    SelectProps={{
      MenuProps: { PaperProps: { style: { maxHeight: 250 } } },
    }}
  >
    {loading ? (
      <MenuItem disabled>
        <CircularProgress size={20} />
      </MenuItem>
    ) : options.length === 0 ? (
      <MenuItem disabled>No options</MenuItem>
    ) : (
      options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))
    )}
  </TextField>
);

const ExaminationForm = () => {
  const navigate = useNavigate();

  // === State ===
  const [schools, setSchools] = useState([]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Location
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

  // Classes & Subjects
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const [locationLoading, setLocationLoading] = useState(false);
  const [schoolLoading, setSchoolLoading] = useState(false);

  // === Helper: Should City be hidden? ===
  const hideCity = ["Level 2", "Level 3", "Level 4"].includes(selectedLevel);

  // === Fetch Classes & Subjects ===
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/class`);
        setClasses(
          Array.isArray(res.data)
            ? res.data.map((c) => ({ value: c.id, label: c.name }))
            : []
        );
      } catch (e) {
        console.error(e);
      }
    };
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/subject`);
        setSubjects(
          Array.isArray(res.data)
            ? res.data.map((s) => ({ value: s.id, label: s.name }))
            : []
        );
      } catch (e) {
        console.error(e);
      }
    };
    Promise.all([fetchClasses(), fetchSubjects()]);
  }, []);

  // === Fetch All Location Data Once ===
  useEffect(() => {
    const fetchAllLocations = async () => {
      setLocationLoading(true);
      try {
        const [cRes, sRes, dRes, ciRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);

        setCountries(Array.isArray(cRes.data) ? cRes.data : []);
        setStates(Array.isArray(sRes.data) ? sRes.data : []);
        setDistricts(Array.isArray(dRes.data) ? dRes.data : []);
        setCities(Array.isArray(ciRes.data) ? ciRes.data : []);

        const india = cRes.data.find(
          (c) => c.name?.toLowerCase().trim() === "india"
        );
        if (india) setSelectedCountry(india.id);
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: "error",
          title: "Failed to load locations",
          toast: true,
          position: "top-end",
          timer: 1500,
        });
      } finally {
        setLocationLoading(false);
      }
    };
    fetchAllLocations();
  }, []);

  // === Filter States ===
  useEffect(() => {
    if (selectedCountry && states.length) {
      const filtered = states.filter((s) => s.country_id === selectedCountry);
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSchools([]);
  }, [selectedCountry, states]);

  // === Filter Districts ===
  useEffect(() => {
    if (selectedState && districts.length) {
      const filtered = districts.filter((d) => d.state_id === selectedState);
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSchools([]);
  }, [selectedState, districts]);

  // === Filter Cities ===
  useEffect(() => {
    if (selectedDistrict && cities.length) {
      const filtered = cities.filter((c) => c.district_id === selectedDistrict);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
    setSelectedCity("");
  }, [selectedDistrict, cities]);

  // === Debounced School Fetch ===
  const fetchSchools = useCallback(
    debounce(async (filters) => {
      if (!filters.state) {
        setSchools([]);
        return;
      }

      setSchoolLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/get/school-filter`, {
          params: {
            country: filters.country || null,
            state: filters.state || null,
            district: filters.district || null,
            city: filters.city || null,
          },
        });

        if (res.data.success) {
          const list = res.data.data.flatMap((loc) =>
            loc.schools.map((s) => ({
              id: s.id,
              name: s.name,
              school_code: s.school_code,
            }))
          );
          setSchools(list);
        } else {
          setSchools([]);
        }
      } catch (e) {
        console.error(e);
        setSchools([]);
      } finally {
        setSchoolLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    fetchSchools({
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
      city: selectedCity,
    });
  }, [
    selectedState,
    selectedDistrict,
    selectedCity,
    selectedCountry,
    fetchSchools,
  ]);

  // === Handle School Change with "All Schools" ===
  const handleSchoolChange = (e, values) => {
    const allOption = values.find((v) => v.id === "ALL_SCHOOLS");

    if (allOption) {
      const allIds = schools.map((s) => s.id);
      setSelectedSchoolIds(allIds);
    } else {
      setSelectedSchoolIds(values.map((v) => v.id));
    }
  };

  const handleClassesChange = (e) => {
    setSelectedClassIds(e.target.value);
  };

  const handleSubjectsChange = (e) => {
    setSelectedSubjectIds(e.target.value);
  };

  const handleExamDateChange = (e) => {
    setExamDate(e.target.value);
  };

  // === Handle Level Change + Clear City if needed ===
  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    setSelectedLevel(newLevel);

    // Clear city when switching to Level 2, 3, or 4
    if (["Level 2", "Level 3", "Level 4"].includes(newLevel)) {
      setSelectedCity("");
    }
  };

  const handleSave = async () => {
    if (
      selectedSchoolIds.length === 0 ||
      !examDate ||
      selectedClassIds.length === 0 ||
      selectedSubjectIds.length === 0
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const session_id = localStorage.getItem("currentSessionId");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in.",
        toast: true,
        position: "top-end",
        timer: 1000,
        customClass: { popup: "small-swal" },
      });
      return;
    }
    if (!session_id) {
      Swal.fire({
        icon: "error",
        title: "No Session",
        text: "Select a session from header.",
        toast: true,
        position: "top-end",
        timer: 1000,
        customClass: { popup: "small-swal" },
      });
      return;
    }

    const payload = {
      school_id: JSON.stringify(selectedSchoolIds),
      level: selectedLevel,
      exam_date: examDate,
      classes_id: JSON.stringify(selectedClassIds),
      subjects_id: JSON.stringify(selectedSubjectIds),
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
      city: hideCity ? null : selectedCity, // Don't send city if hidden
      session_id,
    };

    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/api/e1/create-exam`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Exam created for ${selectedSchoolIds.length} school(s)!`,
        toast: true,
        position: "top-end",
        timer: 1000,
        customClass: { popup: "small-swal" },
      });
      navigate("/examList");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to create exam.",
        toast: true,
        position: "top-end",
        timer: 1500,
        customClass: { popup: "small-swal" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // === Options ===
  const countryOptions = countries.map((c) => ({ value: c.id, label: c.name }));
  const stateOptions = filteredStates.map((s) => ({
    value: s.id,
    label: s.name,
  }));
  const districtOptions = filteredDistricts.map((d) => ({
    value: d.id,
    label: d.name,
  }));
  const cityOptions = filteredCities.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const schoolOptions =
    schools.length > 0
      ? [
          { id: "ALL_SCHOOLS", name: "All Schools", school_code: "" },
          ...schools,
        ]
      : [];

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Exam", link: "/examList" },
            { name: "Create Exam Schedule" },
          ]}
        />
      </div>

      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          className={styles.main}
          elevation={3}
          sx={{ p: 3, width: "100%", maxWidth: 1200 }}
        >
          <Typography className={styles.formTitle} sx={{ mb: 4 }}>
            Create Exam Schedule
          </Typography>

          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* Level */}
              <Grid item xs={12} sm={3} md={3}>
                <Dropdown
                  label="Level"
                  value={selectedLevel}
                  options={[
                    { value: "Level 1", label: "Level 1" },
                    { value: "Level 2", label: "Level 2" },
                    { value: "Level 3", label: "Level 3" },
                    { value: "Level 4", label: "Level 4" },
                  ]}
                  onChange={handleLevelChange}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {/* Location */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Country"
                  value={selectedCountry}
                  options={countryOptions}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  loading={locationLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={stateOptions}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                  loading={locationLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={districtOptions}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                  loading={locationLoading}
                />
              </Grid>

              {/* City - Conditionally Rendered */}
              {!hideCity && (
                <Grid item xs={12} sm={6} md={3}>
                  <Dropdown
                    label="City"
                    value={selectedCity}
                    options={cityOptions}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedDistrict}
                    loading={locationLoading}
                  />
                </Grid>
              )}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* School - MULTIPLE + ALL SCHOOLS + BLUE CHIPS */}
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  multiple
                  options={schoolOptions}
                  getOptionLabel={(opt) =>
                    opt.id === "ALL_SCHOOLS"
                      ? "All Schools"
                      : `${opt.name} ${
                          opt.school_code ? `(${opt.school_code})` : ""
                        }`
                  }
                  loading={schoolLoading}
                  value={
                    selectedSchoolIds.length === schools.length &&
                    schools.length > 0
                      ? [{ id: "ALL_SCHOOLS", name: "All Schools" }]
                      : schools.filter((s) => selectedSchoolIds.includes(s.id))
                  }
                  onChange={handleSchoolChange}
                  disabled={!selectedState || schoolLoading}
                  renderTags={(value, getTagProps) => {
                    if (value.some((v) => v.id === "ALL_SCHOOLS")) {
                      return [
                        <Chip
                          key="all"
                          label={`All Schools (${schools.length})`}
                          size="small"
                          sx={{
                            backgroundColor: "#1230ae",
                            color: "white",
                            fontWeight: 600,
                            "& .MuiChip-deleteIcon": {
                              color: "rgba(255,255,255,0.8)",
                              "&:hover": { color: "white" },
                            },
                          }}
                          {...getTagProps({ index: 0 })}
                        />,
                      ];
                    }
                    return value.map((option, index) => (
                      <Chip
                        key={option.id}
                        label={`${option.name} ${
                          option.school_code ? `(${option.school_code})` : ""
                        }`}
                        size="small"
                        sx={{
                          backgroundColor: "#1230ae",
                          color: "white",
                          fontWeight: 500,
                          "& .MuiChip-deleteIcon": {
                            color: "rgba(255,255,255,0.7)",
                            "&:hover": { color: "white" },
                          },
                        }}
                        {...getTagProps({ index })}
                      />
                    ));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Schools"
                      variant="outlined"
                      size="small"
                      margin="normal"
                      fullWidth
                      placeholder={
                        selectedState
                          ? "Search or select 'All Schools'"
                          : "Select State first"
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {schoolLoading ? (
                              <CircularProgress size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Classes */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Classes</InputLabel>
                  <Select
                    multiple
                    value={selectedClassIds}
                    onChange={handleClassesChange}
                    label="Classes"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((v) => {
                          const cls = classes.find((c) => c.value === v);
                          return (
                            <Chip
                              key={v}
                              label={cls?.label || v}
                              size="small"
                              sx={{
                                backgroundColor: "#1230ae",
                                color: "white",
                                fontWeight: 500,
                                "& .MuiChip-deleteIcon": {
                                  color: "rgba(255,255,255,0.7)",
                                  "&:hover": { color: "white" },
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {classes.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Subjects */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Subjects</InputLabel>
                  <Select
                    multiple
                    value={selectedSubjectIds}
                    onChange={handleSubjectsChange}
                    label="Subjects"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((v) => {
                          const sub = subjects.find((s) => s.value === v);
                          return (
                            <Chip
                              key={v}
                              label={sub?.label || v}
                              size="small"
                              sx={{
                                backgroundColor: "#1230ae",
                                color: "white",
                                fontWeight: 500,
                                "& .MuiChip-deleteIcon": {
                                  color: "rgba(255,255,255,0.7)",
                                  "&:hover": { color: "white" },
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {subjects.map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Exam Date */}
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

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Box
            className={styles.buttonContainer}
            sx={{ display: "flex", gap: 2, mt: 4 }}
          >
            <ButtonComp
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={
                selectedSchoolIds.length === 0 ||
                !examDate ||
                selectedClassIds.length === 0 ||
                selectedSubjectIds.length === 0 ||
                isLoading
              }
              text={isLoading ? "Processing..." : "Submit"}
              sx={{ flexGrow: 1 }}
            />
            <ButtonComp
              text="Cancel"
              onClick={() => navigate("/examList")}
              disabled={isLoading}
              sx={{ flexGrow: 1 }}
            />
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
