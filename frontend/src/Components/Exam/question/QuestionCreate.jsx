// import React, { useState, useEffect, useCallback } from "react";
// import Mainlayout from "../../Layouts/Mainlayout";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import axios from "axios";
// import "../../Common-Css/Swallfire.css";
// import { Grid, TextField, Paper, Typography, MenuItem } from "@mui/material";
// import ButtonComp from "../../CommonButton/ButtonComp";
// import Breadcrumb from "../../CommonButton/Breadcrumb";

// const CreateQuestion = () => {
//   const [formData, setFormData] = useState({
//     school: "",
//     exam_set: "",
//   });

//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [schools, setSchools] = useState([]);

//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);

//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const navigate = useNavigate();

//   // Fetch all location data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [countriesRes, statesRes, districtsRes, citiesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           ]);

//         setCountries(countriesRes.data || []);
//         setStates(statesRes.data || []);
//         setDistricts(districtsRes.data || []);
//         setCities(citiesRes.data || []);
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Filter based on selection
//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setFormData({ ...formData, school: "" });
//   }, [selectedCountry]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setFormData({ ...formData, school: "" });
//   }, [selectedState]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setFormData({ ...formData, school: "" });
//   }, [selectedDistrict]);

//   // Fetch schools for selected location
//   const fetchSchoolsByLocation = useCallback(async (filters) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/get/filter`, {
//         params: filters,
//       });
//       if (response.data.success) {
//         const schoolList = response.data.data.flatMap((location) =>
//           location.schools.map((school) => ({
//             school_name: school,
//           }))
//         );
//         setSchools(schoolList);
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
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

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !selectedCountry ||
//       !selectedState ||
//       !selectedDistrict ||
//       !selectedCity ||
//       !formData.school ||
//       !formData.exam_set
//     ) {
//       Swal.fire("Please fill in all required fields", "", "warning");
//       return;
//     }

//     const payload = {
//       country_id: selectedCountry,
//       state_id: selectedState,
//       district_id: selectedDistrict,
//       city_id: selectedCity,
//       school_name: formData.school,
//       set_name: formData.exam_set,
//     };

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/q1/question`,
//         payload
//       );
//       if (response.status === 200 || response.status === 201) {
//         Swal.fire({
//           icon: "success",
//           text: "Question created successfully!",
//           timer: 1500,
//           showConfirmButton: false,
//           toast: true,
//           position: "top-end",
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         });
//         navigate("/question-list");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       Swal.fire("Error", "Failed to submit question", "error");
//     }
//   };

//   return (
//     <Mainlayout>
//       <Breadcrumb
//         data={[
//           { name: "Question List", link: "/question-list" },
//           { name: "Create Question", link: "/question-create" },
//         ]}
//       />
//       <Paper elevation={3} className="w-100 bg-white p-4 mx-auto rounded mt-3">
//         <Typography variant="h6" gutterBottom>
//           Create Question
//         </Typography>
//         <form onSubmit={handleSubmit} style={{ fontFamily: "Poppins" }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Country"
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//                 size="small"
//               >
//                 <MenuItem value="">Select Country</MenuItem>
//                 {countries.map((country) => (
//                   <MenuItem key={country.id} value={country.id}>
//                     {country.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 select
//                 fullWidth
//                 label="State"
//                 value={selectedState}
//                 onChange={(e) => setSelectedState(e.target.value)}
//                 size="small"
//                 disabled={!selectedCountry}
//               >
//                 <MenuItem value="">Select State</MenuItem>
//                 {filteredStates.map((state) => (
//                   <MenuItem key={state.id} value={state.id}>
//                     {state.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 select
//                 fullWidth
//                 label="District"
//                 value={selectedDistrict}
//                 onChange={(e) => setSelectedDistrict(e.target.value)}
//                 size="small"
//                 disabled={!selectedState}
//               >
//                 <MenuItem value="">Select District</MenuItem>
//                 {filteredDistricts.map((district) => (
//                   <MenuItem key={district.id} value={district.id}>
//                     {district.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 select
//                 fullWidth
//                 label="City"
//                 value={selectedCity}
//                 onChange={(e) => setSelectedCity(e.target.value)}
//                 size="small"
//                 disabled={!selectedDistrict}
//               >
//                 <MenuItem value="">Select City</MenuItem>
//                 {filteredCities.map((city) => (
//                   <MenuItem key={city.id} value={city.id}>
//                     {city.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 select
//                 fullWidth
//                 label="School"
//                 value={formData.school}
//                 onChange={(e) => handleChange("school", e.target.value)}
//                 size="small"
//                 disabled={!selectedCity}
//               >
//                 <MenuItem value="">Select School</MenuItem>
//                 {schools.map((school, index) => (
//                   <MenuItem key={index} value={school.school_name}>
//                     {school.school_name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 label="Exam Set"
//                 value={formData.exam_set}
//                 onChange={(e) => handleChange("exam_set", e.target.value)}
//                 size="small"
//                 placeholder="Enter Exam Set (e.g., A1, B2)"
//               />
//             </Grid>
//           </Grid>

//           <div className="d-flex gap-2 mt-5">
//             <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
//             <ButtonComp
//               text="Cancel"
//               type="button"
//               sx={{ flexGrow: 1 }}
//               onClick={() => navigate("/question-list")}
//             />
//           </div>
//         </form>
//       </Paper>
//     </Mainlayout>
//   );
// };

// export default CreateQuestion;



import React, { useState, useEffect, useCallback } from "react";
import Mainlayout from "../../Layouts/Mainlayout";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import axios from "axios";
import "../../Common-Css/Swallfire.css";
import { Grid, TextField, Paper, Typography, MenuItem, Container } from "@mui/material";
import ButtonComp from "../../CommonButton/ButtonComp";
import Breadcrumb from "../../CommonButton/Breadcrumb";

const CreateQuestion = () => {
  const [formData, setFormData] = useState({
    school: "",
    exam_set: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);

  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();

  // Fetch all location data
  useEffect(() => {
    const fetchInitialData = async () => {
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
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Filter based on selection
  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setFormData({ ...formData, school: "" });
  }, [selectedCountry]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setFormData({ ...formData, school: "" });
  }, [selectedState]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setFormData({ ...formData, school: "" });
  }, [selectedDistrict]);

  // Fetch schools for selected location
  const fetchSchoolsByLocation = useCallback(async (filters) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get/filter`, {
        params: filters,
      });
      if (response.data.success) {
        const schoolList = response.data.data.flatMap((location) =>
          location.schools.map((school) => ({
            school_name: school,
          }))
        );
        setSchools(schoolList);
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setSchools([]);
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

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedCountry ||
      !selectedState ||
      !selectedDistrict ||
      !selectedCity ||
      !formData.school ||
      !formData.exam_set
    ) {
      Swal.fire("Please fill in all required fields", "", "warning");
      return;
    }

    const payload = {
      country_id: selectedCountry,
      state_id: selectedState,
      district_id: selectedDistrict,
      city_id: selectedCity,
      school_name: formData.school,
      set_name: formData.exam_set,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/q1/question`,
        payload
      );
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          text: "Question created successfully!",
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
        navigate("/question-list");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Failed to submit question", "error");
    }
  };

  return (
    <Mainlayout>
      <Breadcrumb
        data={[
          { name: "Question List", link: "/question-list" },
          { name: "Create Question", link: "/question-create" },
        ]}
      />
      <Container 
        component="main" 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '100%' ,
          marginTop:2,
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            width: '1050px' 
          }}
          className="bg-white"
        >
          <Typography variant="h6" gutterBottom>
            Create Question
          </Typography>
          <form onSubmit={handleSubmit} style={{ fontFamily: "Poppins" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Select Country</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="State"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  size="small"
                  disabled={!selectedCountry}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {filteredStates.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="District"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  size="small"
                  disabled={!selectedState}
                >
                  <MenuItem value="">Select District</MenuItem>
                  {filteredDistricts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  size="small"
                  disabled={!selectedDistrict}
                >
                  <MenuItem value="">Select City</MenuItem>
                  {filteredCities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="School"
                  value={formData.school}
                  onChange={(e) => handleChange("school", e.target.value)}
                  size="small"
                  disabled={!selectedCity}
                >
                  <MenuItem value="">Select School</MenuItem>
                  {schools.map((school, index) => (
                    <MenuItem key={index} value={school.school_name}>
                      {school.school_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Exam Set"
                  value={formData.exam_set}
                  onChange={(e) => handleChange("exam_set", e.target.value)}
                  size="small"
                  placeholder="Enter Exam Set (e.g., A1, B2)"
                />
              </Grid>
            </Grid>

            <div className="d-flex gap-2 mt-5">
              <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/question-list")}
              />
            </div>
          </form>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default CreateQuestion;