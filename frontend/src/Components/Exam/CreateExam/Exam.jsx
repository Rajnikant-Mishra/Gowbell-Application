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

//   // === Helper: Should City be hidden? ===
//   const hideCity = ["Level 2", "Level 3", "Level 4"].includes(selectedLevel);

//   // === Fetch Classes & Subjects ===
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           Array.isArray(res.data)
//             ? res.data.map((c) => ({ value: c.id, label: c.name }))
//             : [],
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
//             : [],
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
//           (c) => c.name?.toLowerCase().trim() === "india",
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
//             })),
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
//     [],
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

//   // === Handle Level Change + Clear City if needed ===
//   const handleLevelChange = (e) => {
//     const newLevel = e.target.value;
//     setSelectedLevel(newLevel);

//     // Clear city when switching to Level 2, 3, or 4
//     if (["Level 2", "Level 3", "Level 4"].includes(newLevel)) {
//       setSelectedCity("");
//     }
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
//       city: hideCity ? null : selectedCity, // Don't send city if hidden
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
//               {/* Level */}
//               <Grid item xs={12} sm={3} md={3}>
//                 <Dropdown
//                   label="Level"
//                   value={selectedLevel}
//                   options={[
//                     { value: "Level 1", label: "Level 1" },
//                     { value: "Level 2", label: "Level 2" },
//                     { value: "Level 3", label: "Level 3" },
//                     { value: "Level 4", label: "Level 4" },
//                   ]}
//                   onChange={handleLevelChange}
//                 />
//               </Grid>
//             </Grid>

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

//               {/* City - Conditionally Rendered */}
//               {!hideCity && (
//                 <Grid item xs={12} sm={6} md={3}>
//                   <Dropdown
//                     label="City"
//                     value={selectedCity}
//                     options={cityOptions}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     disabled={!selectedDistrict}
//                     loading={locationLoading}
//                   />
//                 </Grid>
//               )}
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
  Alert,
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

  // ──────────────────────────────────────────────
  // State
  // ──────────────────────────────────────────────
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
  const [studentLoading, setStudentLoading] = useState(false);

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────
  const hideCity = ["Level 2", "Level 3", "Level 4"].includes(selectedLevel);

  const levelToDbField = {
    "Level 1": "level_1",
    "Level 2": "level_2",
    "Level 3": "level_3",
    "Level 4": "level_4",
  };

  // ──────────────────────────────────────────────
  // Fetch static data (classes, subjects, locations)
  // ──────────────────────────────────────────────
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [classRes, subjectRes, countryRes, stateRes, distRes, cityRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/class`),
          axios.get(`${API_BASE_URL}/api/subject`),
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);

        setClasses(Array.isArray(classRes.data) ? classRes.data.map(c => ({ value: c.id, label: c.name })) : []);
        setSubjects(Array.isArray(subjectRes.data) ? subjectRes.data.map(s => ({ value: s.id, label: s.name })) : []);

        setCountries(Array.isArray(countryRes.data) ? countryRes.data : []);
        setStates(Array.isArray(stateRes.data) ? stateRes.data : []);
        setDistricts(Array.isArray(distRes.data) ? distRes.data : []);
        setCities(Array.isArray(cityRes.data) ? cityRes.data : []);

        const india = countryRes.data.find(c => c.name?.toLowerCase().trim() === "india");
        if (india) setSelectedCountry(india.id);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: "error", title: "Failed to load basic data", toast: true, timer: 1800 });
      }
    };

    fetchStaticData();
  }, []);

  // ──────────────────────────────────────────────
  // Location cascading filters
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (selectedCountry && states.length) {
      setFilteredStates(states.filter(s => s.country_id === selectedCountry));
    } else {
      setFilteredStates([]);
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSchools([]);
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState && districts.length) {
      setFilteredDistricts(districts.filter(d => d.state_id === selectedState));
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSchools([]);
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict && cities.length) {
      setFilteredCities(cities.filter(c => c.district_id === selectedDistrict));
    } else {
      setFilteredCities([]);
    }
    setSelectedCity("");
  }, [selectedDistrict, cities]);

  // ──────────────────────────────────────────────
  // Fetch schools – now filtered by level + active students
  // ──────────────────────────────────────────────
  const fetchEligibleSchools = useCallback(
    debounce(async () => {
      if (!selectedLevel || !selectedState) {
        setSchools([]);
        return;
      }

      setSchoolLoading(true);
      try {
        // We fetch all students once → then filter in memory
        // For better performance → you should create backend endpoint later
        setStudentLoading(true);
        const studentRes = await axios.get(`${API_BASE_URL}/api/get/allstudents`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!Array.isArray(studentRes.data)) {
          setSchools([]);
          return;
        }

        const activeSchoolIds = new Set();

        const dbField = levelToDbField[selectedLevel];
        if (!dbField) return;

        studentRes.data.forEach(student => {
          if (
            student.school_id &&
            (student[dbField] === "ongoing" || student[dbField] === "continue" || student[dbField] === "pending" )
          ) {
            activeSchoolIds.add(student.school_id);
          }
        });

        // Now fetch schools with location filters
        const schoolRes = await axios.get(`${API_BASE_URL}/api/get/school-filter`, {
          params: {
            country: selectedCountry || null,
            state: selectedState || null,
            district: selectedDistrict || null,
            city: hideCity ? null : selectedCity || null,
          },
        });

        if (schoolRes.data.success) {
          const allSchools = schoolRes.data.data.flatMap(loc =>
            loc.schools.map(s => ({
              id: s.id,
              name: s.name,
              school_code: s.school_code || "",
            }))
          );

          // Keep only schools with active students in selected level
          const eligible = allSchools.filter(s => activeSchoolIds.has(s.id));
          setSchools(eligible);
        } else {
          setSchools([]);
        }
      } catch (err) {
        console.error(err);
        setSchools([]);
        Swal.fire({
          icon: "warning",
          title: "Could not load eligible schools",
          text: "Check student data or network",
          toast: true,
          timer: 2200,
        });
      } finally {
        setSchoolLoading(false);
        setStudentLoading(false);
      }
    }, 500),
    [
      selectedLevel,
      selectedCountry,
      selectedState,
      selectedDistrict,
      selectedCity,
      hideCity,
    ]
  );

  useEffect(() => {
    fetchEligibleSchools();
  }, [fetchEligibleSchools]);

  // ──────────────────────────────────────────────
  // Handlers
  // ──────────────────────────────────────────────
  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    setSelectedLevel(newLevel);
    setSelectedSchoolIds([]);           // reset schools when level changes
    setSchools([]);                     // will be refetched via useEffect
  };

  const handleSchoolChange = (e, values) => {
    const allOption = values.find(v => v.id === "ALL_SCHOOLS");
    if (allOption) {
      setSelectedSchoolIds(schools.map(s => s.id));
    } else {
      setSelectedSchoolIds(values.map(v => v.id));
    }
  };

  const handleSave = async () => {
    if (
      selectedSchoolIds.length === 0 ||
      !selectedLevel ||
      !examDate ||
      selectedClassIds.length === 0 ||
      selectedSubjectIds.length === 0
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const session_id = localStorage.getItem("currentSessionId");

    if (!token || !session_id) {
      Swal.fire({
        icon: "error",
        title: !token ? "Please login" : "No session selected",
        toast: true,
        timer: 1800,
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
      city: hideCity ? null : selectedCity,
      session_id,
    };

    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`${API_BASE_URL}/api/e1/create-exam`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Swal.fire({
      //   icon: "success",
      //   title: "Exam created",
      //   text: `For ${selectedSchoolIds.length} school(s)`,
      //   toast: true,
      //   timer: 1600,
      // });

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
        title: "Failed to create exam",
        text: err.response?.data?.error || "Server error",
        toast: true,
        timer: 2200,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Options
  // ──────────────────────────────────────────────
  const countryOptions = countries.map(c => ({ value: c.id, label: c.name }));
  const stateOptions   = filteredStates.map(s => ({ value: s.id, label: s.name }));
  const districtOptions = filteredDistricts.map(d => ({ value: d.id, label: d.name }));
  const cityOptions    = filteredCities.map(c => ({ value: c.id, label: c.name }));

  const schoolOptions =
    schools.length > 0
      ? [{ id: "ALL_SCHOOLS", name: "All Schools", school_code: "" }, ...schools]
      : [];

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
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
        <Paper className={styles.main} elevation={3} sx={{ p: 3, width: "100%", maxWidth: 1200 }}>
          <Typography className={styles.formTitle} sx={{ mb: 4 }}>
            Create Exam Schedule
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* Level */}
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
                  onChange={handleLevelChange}
                  loading={studentLoading || schoolLoading}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {/* Location filters */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Country"
                  value={selectedCountry}
                  options={countryOptions}
                  onChange={e => setSelectedCountry(e.target.value)}
                  loading={locationLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={stateOptions}
                  onChange={e => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                  loading={locationLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={districtOptions}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                  loading={locationLoading}
                />
              </Grid>

              {!hideCity && (
                <Grid item xs={12} sm={6} md={3}>
                  <Dropdown
                    label="City"
                    value={selectedCity}
                    options={cityOptions}
                    onChange={e => setSelectedCity(e.target.value)}
                    disabled={!selectedDistrict}
                    loading={locationLoading}
                  />
                </Grid>
              )}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Schools – now filtered by active students in selected level */}
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  multiple
                  options={schoolOptions}
                  getOptionLabel={opt =>
                    opt.id === "ALL_SCHOOLS"
                      ? "All Schools"
                      : `${opt.name} ${opt.school_code ? `(${opt.school_code})` : ""}`
                  }
                  value={
                    selectedSchoolIds.length === schools.length && schools.length > 0
                      ? [{ id: "ALL_SCHOOLS", name: "All Schools" }]
                      : schools.filter(s => selectedSchoolIds.includes(s.id))
                  }
                  onChange={handleSchoolChange}
                  disabled={!selectedLevel || !selectedState || schoolLoading || studentLoading}
                  loading={schoolLoading || studentLoading}
                  renderTags={(value, getTagProps) => {
                    if (value.some(v => v.id === "ALL_SCHOOLS")) {
                      return [
                        <Chip
                          key="all"
                          label={`All Eligible Schools (${schools.length})`}
                          size="small"
                          color="primary"
                          {...getTagProps({ index: 0 })}
                        />,
                      ];
                    }
                    return value.map((option, index) => (
                      <Chip
                        key={option.id}
                        label={`${option.name} ${option.school_code ? `(${option.school_code})` : ""}`}
                        size="small"
                        color="primary"
                        {...getTagProps({ index })}
                      />
                    ));
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Schools (only with ongoing students)"
                      variant="outlined"
                      size="small"
                      margin="normal"
                      fullWidth
                      placeholder={
                        !selectedLevel
                          ? "Select level first"
                          : !selectedState
                          ? "Select state first"
                          : schoolLoading || studentLoading
                          ? "Loading eligible schools..."
                          : schools.length === 0
                          ? "No schools with ongoing students"
                          : "Search or select 'All Eligible Schools'"
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(schoolLoading || studentLoading) && <CircularProgress size={20} />}
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
                    onChange={e => setSelectedClassIds(e.target.value)}
                    label="Classes"
                    renderValue={selected => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map(v => {
                          const cls = classes.find(c => c.value === v);
                          return <Chip key={v} label={cls?.label || v} size="small" color="primary" />;
                        })}
                      </Box>
                    )}
                  >
                    {classes.map(c => (
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
                    onChange={e => setSelectedSubjectIds(e.target.value)}
                    label="Subjects"
                    renderValue={selected => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map(v => {
                          const sub = subjects.find(s => s.value === v);
                          return <Chip key={v} label={sub?.label || v} size="small" color="primary" />;
                        })}
                      </Box>
                    )}
                  >
                    {subjects.map(s => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Exam Date */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Exam Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </form>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <ButtonComp
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={
                selectedSchoolIds.length === 0 ||
                !selectedLevel ||
                !examDate ||
                selectedClassIds.length === 0 ||
                selectedSubjectIds.length === 0 ||
                isLoading ||
                schoolLoading ||
                studentLoading
              }
              text={isLoading ? "Creating..." : "Create Exam"}
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