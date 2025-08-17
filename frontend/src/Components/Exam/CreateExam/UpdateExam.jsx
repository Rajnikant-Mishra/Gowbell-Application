
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
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
//     value={value || ""}
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

// const ExamUpdateForm = () => {
//   // State variables
//   const [schools, setSchools] = useState([]);
//   const [selectedSchoolId, setSelectedSchoolId] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [examDate, setExamDate] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Location data states
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   // Classes and Subjects states
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

//   // Fetch all data (locations, classes, subjects, and exam data)
//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setIsLoading(true);

//         // Fetch location data
//         const [countriesRes, statesRes, districtsRes, citiesRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//         ]);

//         setCountries(Array.isArray(countriesRes.data) ? countriesRes.data : []);
//         setStates(Array.isArray(statesRes.data) ? statesRes.data : []);
//         setDistricts(Array.isArray(districtsRes.data) ? districtsRes.data : []);
//         setCities(Array.isArray(citiesRes.data) ? citiesRes.data : []);

//         // Fetch classes and subjects (removed all-schools fetch as schools are always filtered by location)
//         const [classesRes, subjectsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/class`),
//           axios.get(`${API_BASE_URL}/api/subject`),
//         ]);

//         setClasses(
//           Array.isArray(classesRes.data)
//             ? classesRes.data.map((cls) => ({
//                 value: String(cls.id),
//                 label: cls.name,
//               }))
//             : []
//         );
//         setSubjects(
//           Array.isArray(subjectsRes.data)
//             ? subjectsRes.data.map((sub) => ({
//                 value: String(sub.id),
//                 label: sub.name,
//               }))
//             : []
//         );

//         // Fetch exam data
//         if (id) {
//           const token = localStorage.getItem("token");
//           const examRes = await axios.get(`${API_BASE_URL}/api/e1/get/exam/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const examData = examRes.data.data;

//           // Safely parse classes_id and subjects_id
//           let parsedClasses = [];
//           let parsedSubjects = [];
//           try {
//             parsedClasses = examData.classes_id
//               ? JSON.parse(examData.classes_id)
//               : [];
//             parsedSubjects = examData.subjects_id
//               ? JSON.parse(examData.subjects_id)
//               : [];
//           } catch (parseError) {
//             console.error("Error parsing classes_id or subjects_id:", parseError);
//           }

//           // Set form values with type normalization to strings
//           setSelectedSchoolId(String(examData.school_id || ""));
//           setSelectedLevel(examData.level || "");
//           setExamDate(examData.exam_date || "");
//           setSelectedCountry(String(examData.country || ""));
//           setSelectedState(String(examData.state || ""));
//           setSelectedDistrict(String(examData.district || ""));
//           setSelectedCity(String(examData.city || ""));
//           setSelectedClassIds(Array.isArray(parsedClasses) ? parsedClasses.map(String) : []);
//           setSelectedSubjectIds(Array.isArray(parsedSubjects) ? parsedSubjects.map(String) : []);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load data. Please try again.",
//           confirmButtonColor: "#d33",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [id]);

//   // Handle country change with type-safe filtering
//   useEffect(() => {
//     if (selectedCountry) {
//       const filtered = states.filter((state) => String(state.country_id) === selectedCountry);
//       setFilteredStates(filtered);
//       if (selectedState && !filtered.some((s) => String(s.id) === selectedState)) {
//         setSelectedState("");
//         setSelectedDistrict("");
//         setSelectedCity("");
//         setSchools([]);
//       }
//     } else {
//       setFilteredStates([]);
//       setSelectedState("");
//       setSelectedDistrict("");
//       setSelectedCity("");
//       setSchools([]);
//     }
//   }, [selectedCountry, states]);

//   // Handle state change with type-safe filtering
//   useEffect(() => {
//     if (selectedState) {
//       const filtered = districts.filter((district) => String(district.state_id) === selectedState);
//       setFilteredDistricts(filtered);
//       if (selectedDistrict && !filtered.some((d) => String(d.id) === selectedDistrict)) {
//         setSelectedDistrict("");
//         setSelectedCity("");
//         setSchools([]);
//       }
//     } else {
//       setFilteredDistricts([]);
//       setSelectedDistrict("");
//       setSelectedCity("");
//       setSchools([]);
//     }
//   }, [selectedState, districts]);

//   // Handle district change with type-safe filtering
//   useEffect(() => {
//     if (selectedDistrict) {
//       const filtered = cities.filter((city) => String(city.district_id) === selectedDistrict);
//       setFilteredCities(filtered);
//       if (selectedCity && !filtered.some((c) => String(c.id) === selectedCity)) {
//         setSelectedCity("");
//         setSchools([]);
//       }
//     } else {
//       setFilteredCities([]);
//       setSelectedCity("");
//       setSchools([]);
//     }
//   }, [selectedDistrict, cities]);

//   // Fetch schools based on location
//   useEffect(() => {
//     const fetchSchoolsByLocation = async () => {
//       if (selectedCountry && selectedState && selectedDistrict && selectedCity) {
//         try {
//           setIsLoading(true);
//           const response = await axios.get(`${API_BASE_URL}/api/get/school-filter`, {
//             params: {
//               country: selectedCountry,
//               state: selectedState,
//               district: selectedDistrict,
//               city: selectedCity,
//             },
//           });
//           if (response.data.success) {
//             const schoolList = response.data.data.flatMap((location) =>
//               location.schools.map((school) => ({
//                 id: String(school.id),
//                 name: school.name,
//                 country_name: location.country,
//                 state_name: location.state,
//                 district_name: location.district,
//                 city_name: location.city,
//               }))
//             );
//             setSchools(schoolList);
//             if (selectedSchoolId && !schoolList.some((school) => school.id === selectedSchoolId)) {
//               setSelectedSchoolId("");
//             }
//           } else {
//             setSchools([]);
//             setSelectedSchoolId("");
//             Swal.fire({
//               icon: "warning",
//               title: "No Schools Found",
//               text: "No schools found for the selected location.",
//               confirmButtonColor: "#d33",
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching schools:", error);
//           setSchools([]);
//           setSelectedSchoolId("");
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "Failed to fetch schools. Please try again.",
//             confirmButtonColor: "#d33",
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         setSchools([]);
//         setSelectedSchoolId("");
//       }
//     };

//     fetchSchoolsByLocation();
//   }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

//   // Handlers
//   const handleSchoolChange = (e) => {
//     setSelectedSchoolId(e.target.value);
//   };

//   const handleClassesChange = (event) => {
//     setSelectedClassIds(event.target.value);
//   };

//   const handleSubjectsChange = (event) => {
//     setSelectedSubjectIds(event.target.value);
//   };

//   const handleExamDateChange = (event) => {
//     setExamDate(event.target.value);
//   };

//   // Prepare dropdown options with string values
//   const countryOptions = countries.map((country) => ({
//     value: String(country.id),
//     label: country.name,
//   }));

//   const stateOptions = filteredStates.map((state) => ({
//     value: String(state.id),
//     label: state.name,
//   }));

//   const districtOptions = filteredDistricts.map((district) => ({
//     value: String(district.id),
//     label: district.name,
//   }));

//   const cityOptions = filteredCities.map((city) => ({
//     value: String(city.id),
//     label: city.name,
//   }));

//   // Handle update
//   const handleUpdate = async () => {
//     if (!selectedSchoolId || !examDate || selectedClassIds.length === 0 || selectedSubjectIds.length === 0) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Unauthorized",
//         text: "Please log in to update the exam.",
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//       return;
//     }

//     const examData = {
//       school_id: selectedSchoolId,
//       level: selectedLevel,
//       exam_date: examDate,
//       classes_id: JSON.stringify(selectedClassIds),
//       subjects_id: JSON.stringify(selectedSubjectIds),
//       country: selectedCountry,
//       state: selectedState,
//       district: selectedDistrict,
//       city: selectedCity,
//     };

//     try {
//       setIsLoading(true);
//       setError(null);
//       await axios.put(`${API_BASE_URL}/api/e1/update-exam/${id}`, examData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: "Exam updated successfully!",
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//       navigate("/examList");
//     } catch (error) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.error || "Failed to update exam. Please try again.",
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: { popup: "small-swal" },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <Mainlayout>
//         <Box
//           className="d-flex justify-content-center align-items-center"
//           style={{ height: "80vh" }}
//         >
//           <Typography variant="h6">Loading exam data...</Typography>
//         </Box>
//       </Mainlayout>
//     );
//   }

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[
//             { name: "Exam", link: "/examList" },
//             { name: "Update Exam Schedule" },
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
//             Update Exam Schedule
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
//                     label: `${school.name} ${school.city_name ? `(${school.city_name})` : ""}`,
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
//                         {Array.isArray(selected) && selected.length > 0 ? (
//                           selected.map((value) => {
//                             const selectedClass = classes.find((c) => c.value === value) || {
//                               label: value,
//                             };
//                             return (
//                               <Chip
//                                 key={value}
//                                 label={selectedClass.label}
//                                 size="small"
//                               />
//                             );
//                           })
//                         ) : (
//                           <Chip label="No classes selected" size="small" />
//                         )}
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
//                         {Array.isArray(selected) && selected.length > 0 ? (
//                           selected.map((value) => {
//                             const selectedSubject = subjects.find((s) => s.value === value) || {
//                               label: value,
//                             };
//                             return (
//                               <Chip
//                                 key={value}
//                                 label={selectedSubject.label}
//                                 size="small"
//                               />
//                             );
//                           })
//                         ) : (
//                           <Chip label="No subjects selected" size="small" />
//                         )}
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
//           {/* Update and Cancel Buttons */}
//           <Box
//             className={styles.buttonContainer}
//             sx={{ display: "flex", gap: 2, mt: 4 }}
//           >
//             <ButtonComp
//               variant="contained"
//               color="primary"
//               style={{ marginTop: "20px" }}
//               onClick={handleUpdate}
//               disabled={
//                 !selectedSchoolId ||
//                 !examDate ||
//                 selectedClassIds.length === 0 ||
//                 selectedSubjectIds.length === 0 ||
//                 isLoading
//               }
//               text={isLoading ? "Processing..." : "Update"}
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

// export default ExamUpdateForm;



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

// Reusable Dropdown Component
const Dropdown = ({ label, value, options, onChange, disabled }) => (
  <TextField
    select
    label={label}
    variant="outlined"
    fullWidth
    margin="normal"
    size="small"
    value={value || ""}
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

const ExamUpdateForm = () => {
  // State variables
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Location data states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Classes and Subjects states
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    // Handle common date formats
    let date;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      // DD-MM-YYYY
      const [day, month, year] = dateString.split("-");
      date = new Date(`${year}-${month}-${day}`);
    } else {
      // Assume YYYY-MM-DD or timestamp
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateString);
      return "";
    }
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  // Fetch all data (locations, classes, subjects, and exam data)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // Fetch location data
        const [countriesRes, statesRes, districtsRes, citiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);

        setCountries(Array.isArray(countriesRes.data) ? countriesRes.data : []);
        setStates(Array.isArray(statesRes.data) ? statesRes.data : []);
        setDistricts(Array.isArray(districtsRes.data) ? districtsRes.data : []);
        setCities(Array.isArray(citiesRes.data) ? citiesRes.data : []);

        // Fetch classes and subjects
        const [classesRes, subjectsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/class`),
          axios.get(`${API_BASE_URL}/api/subject`),
        ]);

        const classesData = Array.isArray(classesRes.data)
          ? classesRes.data.map((cls) => ({
              value: String(cls.id),
              label: cls.name || String(cls.id), // Fallback to ID if name is missing
            }))
          : [];
        const subjectsData = Array.isArray(subjectsRes.data)
          ? subjectsRes.data.map((sub) => ({
              value: String(sub.id),
              label: sub.name || String(sub.id), // Fallback to ID if name is missing (e.g., "gimo", "giso")
            }))
          : [];

        setClasses(classesData);
        setSubjects(subjectsData);

        // Log available options for debugging
        console.log("Classes options:", classesData);
        console.log("Subjects options:", subjectsData);

        // Fetch exam data
        if (id) {
          const token = localStorage.getItem("token");
          const examRes = await axios.get(`${API_BASE_URL}/api/e1/get/exam/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const examData = examRes.data.data;

          // Log raw exam data for debugging
          console.log("Raw examData:", examData);

          // Safely parse classes_id and subjects_id
          let parsedClasses = [];
          let parsedSubjects = [];
          try {
            parsedClasses = examData.classes_id
              ? typeof examData.classes_id === "string"
                ? JSON.parse(examData.classes_id)
                : Array.isArray(examData.classes_id)
                ? examData.classes_id
                : []
              : [];
            parsedSubjects = examData.subjects_id
              ? typeof examData.subjects_id === "string"
                ? JSON.parse(examData.subjects_id)
                : Array.isArray(examData.subjects_id)
                ? examData.subjects_id
                : []
              : [];
          } catch (parseError) {
            console.error("Error parsing classes_id or subjects_id:", parseError);
            setError("Invalid class or subject data format. Please check the data.");
          }

          // Log parsed data for debugging
          console.log("Parsed classes_id:", parsedClasses);
          console.log("Parsed subjects_id:", parsedSubjects);
          console.log("exam_date:", examData.exam_date);

          // Filter valid IDs
          const validClassIds = Array.isArray(parsedClasses)
            ? parsedClasses.map(String).filter((id) =>
                classesData.some((cls) => cls.value === id)
              )
            : [];
          const validSubjectIds = Array.isArray(parsedSubjects)
            ? parsedSubjects.map(String).filter((id) =>
                subjectsData.some((sub) => sub.value === id)
              )
            : [];

          if (parsedClasses.length > 0 && validClassIds.length === 0) {
            console.warn("No valid class IDs found in parsedClasses:", parsedClasses);
            setError("Some class IDs are invalid or not available.");
          }
          if (parsedSubjects.length > 0 && validSubjectIds.length === 0) {
            console.warn("No valid subject IDs found in parsedSubjects:", parsedSubjects);
            setError("Some subject IDs are invalid or not available.");
          }

          // Set form values with type normalization
          setSelectedSchoolId(String(examData.school_id || ""));
          setSelectedLevel(examData.level || "");
          setExamDate(formatDate(examData.exam_date));
          setSelectedCountry(String(examData.country || ""));
          setSelectedState(String(examData.state || ""));
          setSelectedDistrict(String(examData.district || ""));
          setSelectedCity(String(examData.city || ""));
          setSelectedClassIds(validClassIds);
          setSelectedSubjectIds(validSubjectIds);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load exam data. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  // Handle country change with type-safe filtering
  useEffect(() => {
    if (selectedCountry) {
      const filtered = states.filter((state) => String(state.country_id) === selectedCountry);
      setFilteredStates(filtered);
      if (selectedState && !filtered.some((s) => String(s.id) === selectedState)) {
        setSelectedState("");
        setSelectedDistrict("");
        setSelectedCity("");
        setSchools([]);
      }
    } else {
      setFilteredStates([]);
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedCity("");
      setSchools([]);
    }
  }, [selectedCountry, states]);

  // Handle state change with type-safe filtering
  useEffect(() => {
    if (selectedState) {
      const filtered = districts.filter((district) => String(district.state_id) === selectedState);
      setFilteredDistricts(filtered);
      if (selectedDistrict && !filtered.some((d) => String(d.id) === selectedDistrict)) {
        setSelectedDistrict("");
        setSelectedCity("");
        setSchools([]);
      }
    } else {
      setFilteredDistricts([]);
      setSelectedDistrict("");
      setSelectedCity("");
      setSchools([]);
    }
  }, [selectedState, districts]);

  // Handle district change with type-safe filtering
  useEffect(() => {
    if (selectedDistrict) {
      const filtered = cities.filter((city) => String(city.district_id) === selectedDistrict);
      setFilteredCities(filtered);
      if (selectedCity && !filtered.some((c) => String(c.id) === selectedCity)) {
        setSelectedCity("");
        setSchools([]);
      }
    } else {
      setFilteredCities([]);
      setSelectedCity("");
      setSchools([]);
    }
  }, [selectedDistrict, cities]);

  // Fetch schools based on location after exam data is loaded
  useEffect(() => {
    const fetchSchoolsByLocation = async () => {
      if (selectedCountry && selectedState && selectedDistrict && selectedCity) {
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
                id: String(school.id),
                name: school.name,
                country_name: location.country,
                state_name: location.state,
                district_name: location.district,
                city_name: location.city,
              }))
            );
            setSchools(schoolList);
            if (selectedSchoolId && !schoolList.some((school) => school.id === selectedSchoolId)) {
              console.log("Selected school_id not found in filtered schools:", selectedSchoolId);
              setSelectedSchoolId("");
            }
          } else {
            setSchools([]);
            setSelectedSchoolId("");
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
          setSelectedSchoolId("");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch schools. Please try again.",
            confirmButtonColor: "#d33",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setSchools([]);
        setSelectedSchoolId("");
      }
    };

    fetchSchoolsByLocation();
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity, selectedSchoolId]);

  // Handlers
  const handleSchoolChange = (e) => {
    setSelectedSchoolId(e.target.value);
  };

  const handleClassesChange = (event) => {
    setSelectedClassIds(event.target.value);
  };

  const handleSubjectsChange = (event) => {
    setSelectedSubjectIds(event.target.value);
  };

  const handleExamDateChange = (event) => {
    setExamDate(event.target.value);
  };

  // Prepare dropdown options with string values
  const countryOptions = countries.map((country) => ({
    value: String(country.id),
    label: country.name,
  }));

  const stateOptions = filteredStates.map((state) => ({
    value: String(state.id),
    label: state.name,
  }));

  const districtOptions = filteredDistricts.map((district) => ({
    value: String(district.id),
    label: district.name,
  }));

  const cityOptions = filteredCities.map((city) => ({
    value: String(city.id),
    label: city.name,
  }));

  // Handle update
  const handleUpdate = async () => {
    if (!selectedSchoolId || !examDate || selectedClassIds.length === 0 || selectedSubjectIds.length === 0) {
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
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
      return;
    }

    const examData = {
      school_id: selectedSchoolId,
      level: selectedLevel,
      exam_date: examDate,
      classes_id: JSON.stringify(selectedClassIds),
      subjects_id: JSON.stringify(selectedSubjectIds),
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
        timerProgressBar: true,
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
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Mainlayout>
        <Box
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Typography variant="h6">Loading exam data...</Typography>
        </Box>
      </Mainlayout>
    );
  }

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
                    renderValue={(selected) => {
                      console.log("Selected classes:", selected);
                      return (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {Array.isArray(selected) && selected.length > 0 ? (
                            selected.map((value) => {
                              const selectedClass = classes.find((c) => c.value === value) || {
                                label: value,
                              };
                              return (
                                <Chip
                                  key={value}
                                  label={selectedClass.label}
                                  size="small"
                                />
                              );
                            })
                          ) : (
                            <Chip label="No classes selected" size="small" />
                          )}
                        </Box>
                      );
                    }}
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
                    renderValue={(selected) => {
                      console.log("Selected subjects:", selected);
                      return (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {Array.isArray(selected) && selected.length > 0 ? (
                            selected.map((value) => {
                              const selectedSubject = subjects.find((s) => s.value === value) || {
                                label: value,
                              };
                              return (
                                <Chip
                                  key={value}
                                  label={selectedSubject.label}
                                  size="small"
                                />
                              );
                            })
                          ) : (
                            <Chip label="No subjects selected" size="small" />
                          )}
                        </Box>
                      );
                    }}
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

export default ExamUpdateForm;