

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
//   const [selectedSchool, setSelectedSchool] = useState("");
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
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);

//   // Fetch location data on component mount
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
//         setCountries([]);
//         setStates([]);
//         setDistricts([]);
//         setCities([]);
//       }
//     };

//     fetchLocationData();
//   }, []);

//   // Fetch classes data
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         if (response.data && Array.isArray(response.data)) {
//           setClasses(response.data.map(cls => ({
//             value: cls.name,
//             label: cls.name
//           })));
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
//           setSubjects(response.data.map(sub => ({
//             value: sub.name,
//             label: sub.name
//           })));
//         }
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//       }
//     };

//     fetchSubjects();
//   }, []);

//   // Function to fetch schools based on location filters
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
//       console.error("Error fetching schools by location:", error);
//       setError("Failed to fetch schools. Please try again.");
//       setSchools([]);
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
//     setSelectedSchool("");

//     // Fetch schools when country changes
//     const filters = {
//       country: selectedCountry,
//       state: null,
//       district: null,
//       city: null,
//     };
//     fetchSchoolsByLocation(filters);
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
//     setSelectedSchool("");

//     // Fetch schools when state changes
//     const filters = {
//       country: selectedCountry,
//       state: selectedState,
//       district: null,
//       city: null,
//     };
//     fetchSchoolsByLocation(filters);
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
//     setSelectedSchool("");

//     // Fetch schools when district changes
//     const filters = {
//       country: selectedCountry,
//       state: selectedState,
//       district: selectedDistrict,
//       city: null,
//     };
//     fetchSchoolsByLocation(filters);
//   }, [selectedDistrict, cities]);

//   // Handle city change
//   useEffect(() => {
//     if (selectedCity) {
//       // Fetch schools when city changes
//       const filters = {
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//       };
//       fetchSchoolsByLocation(filters);
//     }
//   }, [selectedCity]);

//   // Handle school change
//   const handleSchoolChange = (e) => {
//     setSelectedSchool(e.target.value);
//   };

//   // Handle classes change
//   const handleClassesChange = (event) => {
//     setSelectedClasses(event.target.value);
//   };

//   // Handle subjects change
//   const handleSubjectsChange = (event) => {
//     setSelectedSubjects(event.target.value);
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
//     if (!selectedSchool || !examDate || selectedClasses.length === 0 || selectedSubjects.length === 0) {
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

//     const examData = {
//       school: selectedSchool,
//       level: selectedLevel,
//       exam_date: examDate,
//       classes: selectedClasses,
//       subjects: selectedSubjects,
//       country: selectedCountry,
//       state: selectedState,
//       district: selectedDistrict,
//       city: selectedCity
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
//       setSelectedSchool("");
//       setSelectedLevel("");
//       setExamDate("");
//       setSelectedClasses([]);
//       setSelectedSubjects([]);
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
//       <Container component="main" maxWidth="">
//         <Paper
//           className={`${styles.main}`}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
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
              
//               {/* Classes Multi-Select Dropdown */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth margin="normal" size="small">
//                   <InputLabel id="classes-label">Classes</InputLabel>
//                   <Select
//                     labelId="classes-label"
//                     id="classes-select"
//                     multiple
//                     value={selectedClasses}
//                     onChange={handleClassesChange}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {selected.map((value) => {
//                           const selectedClass = classes.find(c => c.value === value);
//                           return (
//                             <Chip 
//                               key={value} 
//                               label={selectedClass ? selectedClass.label : value} 
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
//                     value={selectedSubjects}
//                     onChange={handleSubjectsChange}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {selected.map((value) => {
//                           const selectedSubject = subjects.find(s => s.value === value);
//                           return (
//                             <Chip 
//                               key={value} 
//                               label={selectedSubject ? selectedSubject.label : value} 
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
//             className={`${styles.buttonContainer} gap-2 mt-4`}
//             sx={{ display: "flex", gap: 2 }}
//           >
//             <ButtonComp
//               variant="contained"
//               color="primary"
//               style={{ marginTop: "20px" }}
//               onClick={handleSave}
//               disabled={
//                 !selectedSchool ||
//                 !examDate ||
//                 selectedClasses.length === 0 ||
//                 selectedSubjects.length === 0 ||
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


import React, { useState, useEffect } from "react";
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
  // State variables
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Location data states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  // Selected location values
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Filtered location options
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Classes and Subjects states
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Fetch location data on component mount
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
        setCountries([]);
        setStates([]);
        setDistricts([]);
        setCities([]);
      }
    };

    fetchLocationData();
  }, []);

  // Fetch classes data
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/class`);
        if (response.data && Array.isArray(response.data)) {
          setClasses(response.data.map(cls => ({
            value: cls.name,
            label: cls.name
          })));
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

  // Fetch subjects data
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/subject`);
        if (response.data && Array.isArray(response.data)) {
          setSubjects(response.data.map(sub => ({
            value: sub.name,
            label: sub.name
          })));
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, []);

  // Function to fetch schools based on location filters
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
      console.error("Error fetching schools by location:", error);
      setError("Failed to fetch schools. Please try again.");
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle country change
  useEffect(() => {
    if (selectedCountry && Array.isArray(states)) {
      const filtered = states.filter(
        (state) => state.country_id === selectedCountry
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");

    // Fetch schools when country changes
    const filters = {
      country: selectedCountry,
      state: null,
      district: null,
      city: null,
    };
    fetchSchoolsByLocation(filters);
  }, [selectedCountry, states]);

  // Handle state change
  useEffect(() => {
    if (selectedState && Array.isArray(districts)) {
      const filtered = districts.filter(
        (district) => district.state_id === selectedState
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");

    // Fetch schools when state changes
    const filters = {
      country: selectedCountry,
      state: selectedState,
      district: null,
      city: null,
    };
    fetchSchoolsByLocation(filters);
  }, [selectedState, districts]);

  // Handle district change
  useEffect(() => {
    if (selectedDistrict && Array.isArray(cities)) {
      const filtered = cities.filter(
        (city) => city.district_id === selectedDistrict
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
    setSelectedCity("");
    setSelectedSchool("");

    // Fetch schools when district changes
    const filters = {
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
      city: null,
    };
    fetchSchoolsByLocation(filters);
  }, [selectedDistrict, cities]);

  // Handle city change
  useEffect(() => {
    if (selectedCity) {
      // Fetch schools when city changes
      const filters = {
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
        city: selectedCity,
      };
      fetchSchoolsByLocation(filters);
    }
  }, [selectedCity]);

  // Handle school change
  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  // Handle classes change
  const handleClassesChange = (event) => {
    setSelectedClasses(event.target.value);
  };

  // Handle subjects change
  const handleSubjectsChange = (event) => {
    setSelectedSubjects(event.target.value);
  };

  // Prepare options for dropdowns with null checks
  const countryOptions = Array.isArray(countries)
    ? countries.map((country) => ({
        value: country.id,
        label: country.name,
      }))
    : [];

  const stateOptions = Array.isArray(filteredStates)
    ? filteredStates.map((state) => ({
        value: state.id,
        label: state.name,
      }))
    : [];

  const districtOptions = Array.isArray(filteredDistricts)
    ? filteredDistricts.map((district) => ({
        value: district.id,
        label: district.name,
      }))
    : [];

  const cityOptions = Array.isArray(filteredCities)
    ? filteredCities.map((city) => ({
        value: city.id,
        label: city.name,
      }))
    : [];

  // Handle exam date change
  const handleExamDateChange = (event) => {
    setExamDate(event.target.value);
  };

  // Handle save button click
  const handleSave = async () => {
    if (!selectedSchool || !examDate || selectedClasses.length === 0 || selectedSubjects.length === 0) {
      setError("Please fill all required fields.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to create an exam.",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
      return;
    }

    const examData = {
      school: selectedSchool,
      level: selectedLevel,
      exam_date: examDate,
      classes: selectedClasses,
      subjects: selectedSubjects,
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
      city: selectedCity
    };

    try {
      setIsLoading(true);
      setError(null);

      await axios.post(`${API_BASE_URL}/api/e1/create-exam`, examData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: "Exam created successfully!",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });

      navigate("/examList");

      // Reset form
      setSelectedSchool("");
      setSelectedLevel("");
      setExamDate("");
      setSelectedClasses([]);
      setSelectedSubjects([]);
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "Failed to create exam. Please try again.",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <Container 
        component="main" 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '100%' 
        }}
      >
        <Paper
          className={`${styles.main}`}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={`${styles.formTitle} mb-4`}>
            Create Exam Schedule
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
              
              {/* Classes Multi-Select Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="classes-label">Classes</InputLabel>
                  <Select
                    labelId="classes-label"
                    id="classes-select"
                    multiple
                    value={selectedClasses}
                    onChange={handleClassesChange}
                    label="Classes"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const selectedClass = classes.find(c => c.value === value);
                          return (
                            <Chip 
                              key={value} 
                              label={selectedClass ? selectedClass.label : value} 
                              size="small" 
                            />
                          );
                        })}
                      </Box>
                    )}
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
                    value={selectedSubjects}
                    onChange={handleSubjectsChange}
                    label="Subjects"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const selectedSubject = subjects.find(s => s.value === value);
                          return (
                            <Chip 
                              key={value} 
                              label={selectedSubject ? selectedSubject.label : value} 
                              size="small" 
                            />
                          );
                        })}
                      </Box>
                    )}
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

          {/* Save Button */}
          <Box
            className={`${styles.buttonContainer} gap-2 mt-4`}
            sx={{ display: "flex", gap: 2 }}
          >
            <ButtonComp
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              onClick={handleSave}
              disabled={
                !selectedSchool ||
                !examDate ||
                selectedClasses.length === 0 ||
                selectedSubjects.length === 0 ||
                isLoading
              }
              text={isLoading ? "Processing..." : "Submit"}
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

export default ExaminationForm;