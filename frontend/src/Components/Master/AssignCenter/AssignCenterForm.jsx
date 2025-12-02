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
// import styles from "./Assign.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";

// const Dropdown = ({
//   label,
//   value,
//   options,
//   onChange,
//   disabled,
//   multiple = false,
// }) => (
//   <FormControl fullWidth margin="normal" size="small">
//     <InputLabel>{label}</InputLabel>
//     <Select
//       multiple={multiple}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       renderValue={(selected) =>
//         multiple ? (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//             {selected.map((val) => {
//               const option = options.find((opt) => opt.value === val);
//               return (
//                 <Chip
//                   key={val}
//                   label={option ? option.label : val}
//                   size="small"
//                 />
//               );
//             })}
//           </Box>
//         ) : (
//           options.find((opt) => opt.value === value)?.label || ""
//         )
//       }
//     >
//       {options.map((option, index) => (
//         <MenuItem key={index} value={option.value}>
//           {option.label}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// );

// const ExaminationForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchoolIds, setSelectedSchoolIds] = useState([]); // ⬅️ multiple schools
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [examDate, setExamDate] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Location Data
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

//   // Classes and Subjects
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

//   // Fetch location data
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

//         const india = countriesRes.data.find(
//           (country) => country.name?.toLowerCase().trim() === "india"
//         );
//         if (india) setSelectedCountry(india.id);
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
//         const res = await axios.get(`${API_BASE_URL}/api/class`);
//         if (Array.isArray(res.data)) {
//           setClasses(res.data.map((c) => ({ value: c.id, label: c.name })));
//         }
//       } catch {
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch subjects
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/subject`);
//         if (Array.isArray(res.data)) {
//           setSubjects(res.data.map((s) => ({ value: s.id, label: s.name })));
//         }
//       } catch {
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch schools by location
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
//       const res = await axios.get(`${API_BASE_URL}/api/get/school-filter`, {
//         params: {
//           country: selectedCountry,
//           state: selectedState,
//           district: selectedDistrict,
//           city: selectedCity,
//         },
//       });
//       if (res.data.success) {
//         const list = res.data.data.flatMap((loc) =>
//           loc.schools.map((s) => ({
//             id: s.id,
//             name: s.name,
//             city_name: loc.city,
//           }))
//         );
//         setSchools(list);
//       } else {
//         setSchools([]);
//         Swal.fire({
//           icon: "warning",
//           title: "No Schools Found",
//           text: "No schools found for the selected location.",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch schools. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedCountry && Array.isArray(states)) {
//       setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolIds([]);
//     setSchools([]);
//   }, [selectedCountry]);

//   useEffect(() => {
//     if (selectedState && Array.isArray(districts)) {
//       setFilteredDistricts(
//         districts.filter((d) => d.state_id === selectedState)
//       );
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolIds([]);
//     setSchools([]);
//   }, [selectedState]);

//   useEffect(() => {
//     if (selectedDistrict && Array.isArray(cities)) {
//       setFilteredCities(
//         cities.filter((c) => c.district_id === selectedDistrict)
//       );
//     }
//     setSelectedCity("");
//     setSelectedSchoolIds([]);
//     setSchools([]);
//   }, [selectedDistrict]);

//   useEffect(() => {
//     if (selectedCity) fetchSchoolsByLocation();
//     else {
//       setSchools([]);
//       setSelectedSchoolIds([]);
//     }
//   }, [selectedCity]);

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

//     if (!token || !session_id) {
//       Swal.fire({
//         icon: "error",
//         title: "Session or Auth Missing",
//         text: "Please log in and select a session.",
//       });
//       return;
//     }

//     const examData = {
//       school_ids: JSON.stringify(selectedSchoolIds), // ✅ Multiple IDs
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

//     try {
//       setIsLoading(true);
//       await axios.post(`${API_BASE_URL}/api/e1/create-exam`, examData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: "Exam created successfully!",
//       });
//       navigate("/examList");
//       setSelectedSchoolIds([]);
//       setSelectedLevel("");
//       setExamDate("");
//       setSelectedClassIds([]);
//       setSelectedSubjectIds([]);
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text:
//           error.response?.data?.error ||
//           "Failed to create exam. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[
//             { name: "Exam", link: "/center-assign-list" },
//             { name: "Create Assign Center" },
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
//         <Paper className={styles.main} elevation={3} sx={{ p: 3, mt: 2 }}>
//           <Typography className={styles.formTitle} sx={{ mb: 4 }}>
//             Create Assign Center
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

//               {/* Multiple School Select */}
//               <Grid item xs={12} sm={6} md={6}>
//                 <Dropdown
//                   label="Select Schools"
//                   value={selectedSchoolIds}
//                   options={schools.map((s) => ({
//                     value: s.id,
//                     label: `${s.name}${s.city_name ? ` (${s.city_name})` : ""}`,
//                   }))}
//                   onChange={(e) => setSelectedSchoolIds(e.target.value)}
//                   multiple
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>

//               {/* Center Dropdown */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Assign Center Name"
//                   value={selectedLevel}
//                   options={[
//                     { value: "center 1", label: "Center 1" },
//                     { value: "center 2", label: "Center 2" },
//                     { value: "center 3", label: "Center 3" },
//                     { value: "center 4", label: "Center 4" },
//                   ]}
//                   onChange={(e) => setSelectedLevel(e.target.value)}
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

//           <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
//             <ButtonComp
//               onClick={handleSave}
//               disabled={selectedSchoolIds.length === 0 || isLoading}
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./Assign.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const Dropdown = ({
  label,
  value,
  options,
  onChange,
  disabled,
  multiple = false,
}) => (
  <FormControl fullWidth margin="normal" size="small">
    <InputLabel>{label}</InputLabel>
    <Select
      multiple={multiple}
      value={value}
      onChange={onChange}
      disabled={disabled}
      renderValue={(selected) =>
        multiple ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((val) => {
              const option = options.find((opt) => opt.value === val);
              return (
                <Chip
                  key={val}
                  label={option ? option.label : val}
                  size="small"
                />
              );
            })}
          </Box>
        ) : (
          options.find((opt) => opt.value === value)?.label || ""
        )
      }
    >
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const AssignCenterForm = () => {
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Location Data
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

  // 🔹 Fetch location data
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

        setCountries(countriesRes.data || []);
        setStates(statesRes.data || []);
        setDistricts(districtsRes.data || []);
        setCities(citiesRes.data || []);

        // Auto-select India if available
        const india = countriesRes.data.find(
          (c) => c.name?.toLowerCase().trim() === "india"
        );
        if (india) setSelectedCountry(india.id);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchLocationData();
  }, []);

  // 🔹 Fetch centers for dropdown
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/center/get-all`);
        if (Array.isArray(res.data)) {
          setCenters(
            res.data.map((c) => ({ value: c.id, label: c.center_name }))
          );
        }
      } catch {
        setCenters([]);
      }
    };
    fetchCenters();
  }, []);

  // 🔹 Fetch schools by location
  const fetchSchoolsByLocation = async () => {
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
      const res = await axios.get(`${API_BASE_URL}/api/get/school-filter`, {
        params: {
          country: selectedCountry,
          state: selectedState,
          district: selectedDistrict,
          city: selectedCity,
        },
      });
      if (res.data.success) {
        const list = res.data.data.flatMap((loc) =>
          loc.schools.map((s) => ({
            id: s.id,
            name: s.name,
            city_name: loc.city,
          }))
        );
        setSchools(list);
      } else {
        setSchools([]);
        Swal.fire({
          icon: "warning",
          title: "No Schools Found",
          text: "No schools found for the selected location.",
        });
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch schools. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Filters for dependent dropdowns
  useEffect(() => {
    if (selectedCountry && Array.isArray(states)) {
      setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSchools([]);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && Array.isArray(districts)) {
      setFilteredDistricts(
        districts.filter((d) => d.state_id === selectedState)
      );
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSchools([]);
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict && Array.isArray(cities)) {
      setFilteredCities(
        cities.filter((c) => c.district_id === selectedDistrict)
      );
    }
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSchools([]);
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedCity) fetchSchoolsByLocation();
    else {
      setSchools([]);
      setSelectedSchoolIds([]);
    }
  }, [selectedCity]);

  // ✅ Save handler for Assign Center
  const handleSave = async () => {
    if (!selectedCenter || selectedSchoolIds.length === 0) {
      setError("Please select a center and at least one school.");
      return;
    }

    const payload = {
      country_id: selectedCountry || null,
      state_id: selectedState || null,
      district_id: selectedDistrict || null,
      city_id: selectedCity || null,
      assign_center_name_id: selectedCenter,
      school_id: selectedSchoolIds, // backend will JSON.stringify
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/assign-center/create`,
        payload
      );

      if (response.status === 201 || response.data?.message) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: "Assign Center created successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/center-assign-list");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data?.message || "Something went wrong!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to create Assign Center. Try again!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dropdown data format
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

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Assign Center", link: "/center-assign-list" },
            { name: "Create Assign Center" },
          ]}
        />
      </div>

      <Container
        component="main"
        sx={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        <Paper className={styles.main} elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography className={styles.formTitle} sx={{ mb: 4 }}>
            Create Assign Center
          </Typography>

          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* Location Dropdowns */}
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

              {/* Schools */}
              <Grid item xs={12} sm={6} md={6}>
                <Dropdown
                  label="Select Schools"
                  value={selectedSchoolIds}
                  options={schools.map((s) => ({
                    value: s.id,
                    label: `${s.name}${s.city_name ? ` (${s.city_name})` : ""}`,
                  }))}
                  onChange={(e) => setSelectedSchoolIds(e.target.value)}
                  multiple
                  disabled={!selectedCity}
                />
              </Grid>

              {/* Centers */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Assign Center Name"
                  value={selectedCenter}
                  options={centers}
                  onChange={(e) => setSelectedCenter(e.target.value)}
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

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <ButtonComp
              onClick={handleSave}
              disabled={isLoading}
              text={isLoading ? "Processing..." : "Submit"}
              sx={{ flexGrow: 1 }}
            />
            <ButtonComp
              text="Cancel"
              onClick={() => navigate("/center-assign-list")}
              disabled={isLoading}
              sx={{ flexGrow: 1 }}
            />
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default AssignCenterForm;
