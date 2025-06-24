
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   Box,
//   Button,
//   TextField,
//   Paper,
//   Grid,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Container ,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";
// import Breadcrumb from "../../CommonButton/Breadcrumb";

// const ResultForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     school_name: "",
//     student_name: "",
//     class_id: "",
//     roll_no: "",
//     full_mark: "",
//     mark_secured: "",
//     level: "",
//     subject_id: "",
//   });
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch classes
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         // Log response for debugging
//         console.log("Class API Response:", response.data);
//         // Check if response.data is an array
//         if (Array.isArray(response.data)) {
//           setClasses(
//             response.data.map((cls) => ({ value: cls.id, label: cls.name }))
//           );
//         } else {
//           console.warn("Class API response is not an array:", response.data);
//           setClasses([]);
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "Invalid class data received from server.",
//             confirmButtonColor: "#d33",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text:
//             error.response?.data?.error ||
//             "Failed to fetch classes. Please try again.",
//           confirmButtonColor: "#d33",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch subjects
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         // Log response for debugging
//         console.log("Subject API Response:", response.data);
//         // Check if response.data is an array
//         if (Array.isArray(response.data)) {
//           setSubjects(
//             response.data.map((sub) => ({ value: sub.id, label: sub.name }))
//           );
//         } else {
//           console.warn("Subject API response is not an array:", response.data);
//           setSubjects([]);
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "Invalid subject data received from server.",
//             confirmButtonColor: "#d33",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text:
//             error.response?.data?.error ||
//             "Failed to fetch subjects. Please try again.",
//           confirmButtonColor: "#d33",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const response = await axios.post(`${API_BASE_URL}/api/result/create`, formData);
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: `Result created successfully!`,
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       }).then(() => {
//         navigate("/result-list");
//       });
//       setFormData({
//         school_name: "",
//         student_name: "",
//         class_id: "",
//         roll_no: "",
//         full_mark: "",
//         mark_secured: "",
//         level: "",
//         subject_id: "",
//       });
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.response?.data?.error || "An error occurred",
//         confirmButtonColor: "#d33",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[
//               { name: "Result list", link: "/result-list" },
//               { name: "Result Create" },
//             ]}
//           />
//         </div>
//       </div>
//       <Container 
//         component="main" 
//         sx={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           width: '100%' 
//         }}
//       >
//         <Paper 
//           elevation={3} 
//           sx={{ 
//             p: 4, 
//             borderRadius: 2, 
//             width: '1050px' 
//           }}
//         >
//           <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Enter Result Details
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   fullWidth
//                   label="School Name"
//                   name="school_name"
//                   size="small"
//                   value={formData.school_name}
//                   onChange={handleChange}
//                   required
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   fullWidth
//                   label="Student Name"
//                   name="student_name"
//                   size="small"
//                   value={formData.student_name}
//                   onChange={handleChange}
//                   required
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <FormControl fullWidth size="small" required>
//                   <InputLabel id="class-label">Class</InputLabel>
//                   <Select
//                     labelId="class-label"
//                     name="class_id"
//                     value={formData.class_id}
//                     onChange={handleChange}
//                     label="Class"
//                     disabled={loading}
//                   >
//                     <MenuItem value="">
//                       <em>Select Class</em>
//                     </MenuItem>
//                     {classes.map((cls) => (
//                       <MenuItem key={cls.value} value={cls.value}>
//                         {cls.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   fullWidth
//                   label="Roll Number"
//                   name="roll_no"
//                   size="small"
//                   value={formData.roll_no}
//                   onChange={handleChange}
//                   required
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <FormControl fullWidth size="small" required>
//                   <InputLabel id="subject-label">Subject</InputLabel>
//                   <Select
//                     labelId="subject-label"
//                     name="subject_id"
//                     value={formData.subject_id}
//                     onChange={handleChange}
//                     label="Subject"
//                     disabled={loading}
//                   >
//                     <MenuItem value="">
//                       <em>Select Subject</em>
//                     </MenuItem>
//                     {subjects.map((subject) => (
//                       <MenuItem key={subject.value} value={subject.value}>
//                         {subject.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   fullWidth
//                   label="Full Mark"
//                   name="full_mark"
//                   type="number"
//                   size="small"
//                   value={formData.full_mark}
//                   onChange={handleChange}
//                   required
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   fullWidth
//                   label="Mark Secured"
//                   name="mark_secured"
//                   type="number"
//                   size="small"
//                   value={formData.mark_secured}
//                   onChange={handleChange}
//                   required
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   fullWidth
//                   label="Level"
//                   name="level"
//                   size="small"
//                   value={formData.level}
//                   onChange={handleChange}
//                   required
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Box className="gap-2 mt-4" sx={{ display: "flex", gap: 2 }}>
//                   <ButtonComp
//                     text="Submit"
//                     type="submit"
//                     sx={{ flexGrow: 1 }}
//                     disabled={loading}
//                   />
//                   <ButtonComp
//                     text="Cancel"
//                     type="button"
//                     sx={{ flexGrow: 1 }}
//                     onClick={() => navigate("/result-list")}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ResultForm;


import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import Breadcrumb from "../../CommonButton/Breadcrumb";

const ResultForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school_name: "",
    student_name: "",
    class_id: "",
    roll_no: "",
    full_mark: "",
    mark_secured: "",
    level: "",
    subject_id: "",
  });
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");

  // Fetch initial location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        const [countriesRes, statesRes, districtsRes, citiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);
        setCountries(Array.isArray(countriesRes?.data) ? countriesRes.data : []);
        setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
        setDistricts(Array.isArray(districtsRes?.data) ? districtsRes.data : []);
        setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
      } catch (error) {
        console.error("Error fetching location data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch location data. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLocationData();
  }, []);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/class`);
        console.log("Class API Response:", response.data);
        if (Array.isArray(response.data)) {
          setClasses(
            response.data.map((cls) => ({ value: cls.id, label: cls.name }))
          );
        } else {
          console.warn("Class API response is not an array:", response.data);
          setClasses([]);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid class data received from server.",
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.error || "Failed to fetch classes. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/subject`);
        console.log("Subject API Response:", response.data);
        if (Array.isArray(response.data)) {
          setSubjects(
            response.data.map((sub) => ({ value: sub.id, label: sub.name }))
          );
        } else {
          console.warn("Subject API response is not an array:", response.data);
          setSubjects([]);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid subject data received from server.",
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.error || "Failed to fetch subjects. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch schools based on location filters
  const fetchSchoolsByLocation = async () => {
    if (!selectedCountry || !selectedState || !selectedDistrict || !selectedCity) {
      setSchools([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/get/filter`, {
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch schools. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  // Location filter effects
  useEffect(() => {
    if (selectedCountry) {
      setFilteredStates(states.filter((state) => state.country_id === selectedCountry));
    } else {
      setFilteredStates([]);
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSchools([]);
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState) {
      setFilteredDistricts(districts.filter((district) => district.state_id === selectedState));
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSchools([]);
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      setFilteredCities(cities.filter((city) => city.district_id === selectedDistrict));
    } else {
      setFilteredCities([]);
    }
    setSelectedCity("");
    setSelectedSchool("");
    setSchools([]);
  }, [selectedDistrict, cities]);

  useEffect(() => {
    if (selectedCity) {
      fetchSchoolsByLocation();
    } else {
      setSelectedSchool("");
      setSchools([]);
    }
  }, [selectedCity]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/result/create`, formData);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Result created successfully!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      }).then(() => {
        navigate("/result-list");
      });
      setFormData({
        school_name: "",
        student_name: "",
        class_id: "",
        roll_no: "",
        full_mark: "",
        mark_secured: "",
        level: "",
        subject_id: "",
      });
      setSelectedCountry("");
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedCity("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "An error occurred",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

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
  const schoolOptions = schools.map((school) => ({
    value: school.school_name,
    label: `${school.school_name} ${school.city_name ? `(${school.city_name})` : ""}`,
  }));

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Result list", link: "/result-list" },
              { name: "Result Create" },
            ]}
          />
        </div>
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
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            width: "1050px",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Enter Result Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    name="country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    label="Country"
                    disabled={loading}
                  >
                    <MenuItem value="">
                      <em>Select Country</em>
                    </MenuItem>
                    {countryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required disabled={!selectedCountry}>
                  <InputLabel id="state-label">State</InputLabel>
                  <Select
                    labelId="state-label"
                    name="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    label="State"
                    disabled={loading || !selectedCountry}
                  >
                    <MenuItem value="">
                      <em>Select State</em>
                    </MenuItem>
                    {stateOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required disabled={!selectedState}>
                  <InputLabel id="district-label">District</InputLabel>
                  <Select
                    labelId="district-label"
                    name="district"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    label="District"
                    disabled={loading || !selectedState}
                  >
                    <MenuItem value="">
                      <em>Select District</em>
                    </MenuItem>
                    {districtOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required disabled={!selectedDistrict}>
                  <InputLabel id="city-label">City</InputLabel>
                  <Select
                    labelId="city-label"
                    name="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    label="City"
                    disabled={loading || !selectedDistrict}
                  >
                    <MenuItem value="">
                      <em>Select City</em>
                    </MenuItem>
                    {cityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required disabled={!selectedCity}>
                  <InputLabel id="school-label">School</InputLabel>
                  <Select
                    labelId="school-label"
                    name="school_name"
                    value={formData.school_name}
                    onChange={handleChange}
                    label="School"
                    disabled={loading || !selectedCity}
                  >
                    <MenuItem value="">
                      <em>Select School</em>
                    </MenuItem>
                    {schoolOptions.map((school) => (
                      <MenuItem key={school.value} value={school.value}>
                        {school.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Student Name"
                  name="student_name"
                  size="small"
                  value={formData.student_name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="class-label">Class</InputLabel>
                  <Select
                    labelId="class-label"
                    name="class_id"
                    value={formData.class_id}
                    onChange={handleChange}
                    label="Class"
                    disabled={loading}
                  >
                    <MenuItem value="">
                      <em>Select Class</em>
                    </MenuItem>
                    {classes.map((cls) => (
                      <MenuItem key={cls.value} value={cls.value}>
                        {cls.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Roll Number"
                  name="roll_no"
                  size="small"
                  value={formData.roll_no}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="subject-label">Subject</InputLabel>
                  <Select
                    labelId="subject-label"
                    name="subject_id"
                    value={formData.subject_id}
                    onChange={handleChange}
                    label="Subject"
                    disabled={loading}
                  >
                    <MenuItem value="">
                      <em>Select Subject</em>
                    </MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Full Mark"
                  name="full_mark"
                  type="number"
                  size="small"
                  value={formData.full_mark}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Mark Secured"
                  name="mark_secured"
                  type="number"
                  size="small"
                  value={formData.mark_secured}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Level"
                  name="level"
                  size="small"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Box className="gap-2 mt-4" sx={{ display: "flex", gap: 2 }}>
                  <ButtonComp
                    text="Submit"
                    type="submit"
                    sx={{ flexGrow: 1 }}
                    disabled={loading}
                  />
                  <ButtonComp
                    text="Cancel"
                    type="button"
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/result-list")}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ResultForm;