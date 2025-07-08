// import React, { useState, useEffect, useCallback ,useRef } from "react";

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
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
//   const [selectedRollClassSubject, setSelectedRollClassSubject] =
//     useState(null);
//   const [students, setStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const pageSizes = [5, 10, 25, 50];
//   const [totalCount, setTotalCount] = useState(0);
//   const [fetchError, setFetchError] = useState(null);

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
//   const rollNoRef = useRef(null);

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
//           response.data.map((cls) => ({ value: cls.id, label: cls.name }))
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
//           response.data.map((sub) => ({ value: sub.id, label: sub.name }))
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
//   }, [
//     selectedSchool,
//     selectedClassIds,
//     selectedSubjectIds,
//     selectedRollClassSubject,
//   ]);

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
//     setSelectedRollClassSubject(null);
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
//     setSelectedRollClassSubject(null);
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
//     setSelectedRollClassSubject(null);
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
//     setSelectedRollClassSubject(null);
//     setStudents([]);
//   }, [selectedCity]);

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
//   const saveStudentData = async (studentData, rollNo, classId, subjectId) => {
//     try {
//       const studentsToSave = Array.isArray(studentData)
//         ? studentData
//         : [studentData];
//       const promises = studentsToSave.map(async (student) => {
//         // Verify the student matches the roll-class-subject criteria
//         const className = classes.find(
//           (cls) => cls.value === Number(classId)
//         )?.label;
//         const subjectName = subjects.find(
//           (sub) => sub.value === Number(subjectId)
//         )?.label;
//         const subjectsMatch = Array.isArray(student.student_subject)
//           ? student.student_subject.includes(subjectName)
//           : student.subject_names?.split(", ").includes(subjectName);

//         if (
//           student.roll_no !== rollNo ||
//           student.class_name !== className ||
//           !subjectsMatch
//         ) {
//           return null; // Skip non-matching students
//         }

//         const payload = {
//           school_name: student.school_name || selectedSchool || "",
//           student_name: student.student_name || "",
//           roll_no: student.roll_no || "",
//           class_name: student.class_name || "",
//           student_section: student.student_section || "",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject.join(",")
//             : student.subject_names || "",
//           mobile_number: student.mobile_number || "",
//           status: "success",
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
//       const successfulStudents = [];
//       responses.forEach((response, index) => {
//         if (response?.data.success) {
//           console.log(
//             `Student ${index + 1} saved successfully:`,
//             response.data
//           );
//           successfulStudents.push(studentsToSave[index]);
//         }
//       });
//       return successfulStudents;
//     } catch (error) {
//       console.error(
//         "Error saving data:",
//         error.response?.data || error.message
//       );
//       return [];
//     }
//   };

//   // Fetch students
//   const fetchStudents = useCallback(async () => {
//     if (
//       !selectedSchool ||
//       !selectedClassIds.length ||
//       !selectedSubjectIds.length
//     ) {
//       setStudents([]);
//       setTotalCount(0);
//       setFetchError(null);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const rollnoclasssubject = selectedRollClassSubject;

//       // Validate rollnoclasssubject format
//       let rollNo, classId, subjectId;
//       if (rollnoclasssubject) {
//         const parts = rollnoclasssubject.split("-");
//         if (parts.length !== 3) {
//           setFetchError(
//             "Invalid Roll-Class-Subject format. Use: rollno-classId-subjectId"
//           );
//           setStudents([]);
//           setTotalCount(0);
//           setIsLoading(false);
//           return;
//         }
//         [rollNo, classId, subjectId] = parts;
//         if (
//           !classes.some((cls) => cls.value === Number(classId)) ||
//           !subjects.some((sub) => sub.value === Number(subjectId))
//         ) {
//           setFetchError("Invalid class or subject ID in Roll-Class-Subject.");
//           setStudents([]);
//           setTotalCount(0);
//           setIsLoading(false);
//           return;
//         }
//       }

//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/filter/omr-receipt`,
//         {
//           schoolName: selectedSchool,
//           classList: rollnoclasssubject ? [Number(classId)] : selectedClassIds,
//           subjectList: rollnoclasssubject
//             ? [Number(subjectId)]
//             : selectedSubjectIds,
//           ...(rollnoclasssubject && { rollnoclasssubject }),
//         }
//       );

//       const fetchedStudents = response.data.students || [];
//       let updatedStudents = fetchedStudents.map((student) => ({
//         ...student,
//         status: "pending",
//         student_subject: Array.isArray(student.student_subject)
//           ? student.student_subject
//           : student.subject_names
//           ? student.subject_names.split(", ")
//           : [],
//       }));

//       if (rollnoclasssubject) {
//         // Filter students to match rollnoclasssubject exactly
//         const className = classes.find(
//           (cls) => cls.value === Number(classId)
//         )?.label;
//         const subjectName = subjects.find(
//           (sub) => sub.value === Number(subjectId)
//         )?.label;

//         updatedStudents = updatedStudents.filter((student) => {
//           const subjectsMatch = Array.isArray(student.student_subject)
//             ? student.student_subject.includes(subjectName)
//             : student.subject_names?.split(", ").includes(subjectName);
//           return (
//             student.roll_no === rollNo &&
//             student.class_name === className &&
//             subjectsMatch
//           );
//         });

//         if (updatedStudents.length === 0) {
//           setFetchError(
//             "No students found for the specified Roll-Class-Subject."
//           );
//         } else {
//           setFetchError(null);
//           // Save matching students and update status
//           const successfulStudents = await saveStudentData(
//             updatedStudents,
//             rollNo,
//             classId,
//             subjectId
//           );
//           updatedStudents = updatedStudents.map((student) => ({
//             ...student,
//             status: successfulStudents.some(
//               (s) => s.roll_no === student.roll_no
//             )
//               ? "success"
//               : "success",
//           }));
//         }
//       }

//       setStudents(updatedStudents);
//       setTotalCount(updatedStudents.length);
//     } catch (error) {
//       console.error(
//         "Error fetching students:",
//         error.response?.data || error.message
//       );
//       setFetchError("Failed to fetch students. Please check your selections.");
//       setStudents([]);
//       setTotalCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     selectedSchool,
//     selectedClassIds,
//     selectedSubjectIds,
//     selectedRollClassSubject,
//     classes,
//     subjects,
//   ]);

//   // Event handlers
//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleRollClassSubjectChange = (e) =>
//     setSelectedRollClassSubject(e.target.value || null);
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
//                     label:
//                       classes.find((cls) => cls.value === classId)?.label ||
//                       classId,
//                   }))}
//                   onChange={(e, newValue) =>
//                     setSelectedClassIds(newValue.map((item) => item.value))
//                   }
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
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
//                     label:
//                       subjects.find((sub) => sub.value === subjectId)?.label ||
//                       subjectId,
//                   }))}
//                   onChange={(e, newValue) =>
//                     setSelectedSubjectIds(newValue.map((item) => item.value))
//                   }
//                   disableCloseOnSelect
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
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
//                 inputRef={rollNoRef}
//                   label="Roll-Class-Subject (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   value={selectedRollClassSubject || ""}
//                   onChange={handleRollClassSubjectChange}
//                   disabled={isLoading || !selectedSchool}
//                   placeholder="e.g., 761011502-15-5"
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
//                       selectedClassIds.length > 0 &&
//                       selectedSubjectIds.length > 0
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
//                   Total Issue: [ {totalCount} ] | Total Received: [
//                   {totalSuccess}] | Pending: [{totalPending}]
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


//=========================================================================================================

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [selectedRollClassSubject, setSelectedRollClassSubject] =
    useState(null);
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

  const navigate = useNavigate();
  const rollNoRef = useRef(null);

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
  }, [
    selectedSchool,
    selectedClassIds,
    selectedSubjectIds,
    selectedRollClassSubject,
  ]);

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
    setSelectedRollClassSubject(null);
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
    setSelectedRollClassSubject(null);
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
    setSelectedRollClassSubject(null);
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
    setSelectedRollClassSubject(null);
    setStudents([]);
  }, [selectedCity]);

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
  const saveStudentData = async (studentData, rollNo, classId, subjectId) => {
    try {
      const studentsToSave = Array.isArray(studentData)
        ? studentData
        : [studentData];
      const promises = studentsToSave.map(async (student) => {
        // Verify the student matches the roll-class-subject criteria
        const className = classes.find(
          (cls) => cls.value === Number(classId)
        )?.label;
        const subjectName = subjects.find(
          (sub) => sub.value === Number(subjectId)
        )?.label;
        const subjectsMatch = Array.isArray(student.student_subject)
          ? student.student_subject.includes(subjectName)
          : student.subject_names?.split(", ").includes(subjectName);

        if (
          student.roll_no !== rollNo ||
          student.class_name !== className ||
          !subjectsMatch
        ) {
          return null; // Skip non-matching students
        }

        const payload = {
          school_name: student.school_name || selectedSchool || "",
          student_name: student.student_name || "",
          roll_no: student.roll_no || "",
          class_name: student.class_name || "",
          student_section: student.student_section || "",
          student_subject: Array.isArray(student.student_subject)
            ? student.student_subject.join(",")
            : student.subject_names || "",
          mobile_number: student.mobile_number || "",
          status: "success",
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
      const successfulStudents = [];
      responses.forEach((response, index) => {
        if (response?.data.success) {
          console.log(
            `Student ${index + 1} saved successfully:`,
            response.data
          );
          successfulStudents.push(studentsToSave[index]);
        }
      });
      return successfulStudents;
    } catch (error) {
      console.error(
        "Error saving data:",
        error.response?.data || error.message
      );
      return [];
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
      const rollnoclasssubject = selectedRollClassSubject;

      // Validate rollnoclasssubject format
      let rollNo, classId, subjectId;
      if (rollnoclasssubject) {
        const parts = rollnoclasssubject.split("-");
        if (parts.length !== 3) {
          setFetchError(
            "Invalid Roll-Class-Subject format. Use: rollno-classId-subjectId"
          );
          setStudents([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }
        [rollNo, classId, subjectId] = parts;
        if (
          !classes.some((cls) => cls.value === Number(classId)) ||
          !subjects.some((sub) => sub.value === Number(subjectId))
        ) {
          setFetchError("Invalid class or subject ID in Roll-Class-Subject.");
          setStudents([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/get/filter/omr-receipt`,
        {
          schoolName: selectedSchool,
          classList: rollnoclasssubject ? [Number(classId)] : selectedClassIds,
          subjectList: rollnoclasssubject
            ? [Number(subjectId)]
            : selectedSubjectIds,
          ...(rollnoclasssubject && { rollnoclasssubject }),
        }
      );

      const fetchedStudents = response.data.students || [];
      let updatedStudents = fetchedStudents.map((student) => ({
        ...student,
        status: rollnoclasssubject ? "success" : "pending", // Set status to success if rollnoclasssubject is provided
        student_subject: Array.isArray(student.student_subject)
          ? student.student_subject
          : student.subject_names
          ? student.subject_names.split(", ")
          : [],
      }));

      if (rollnoclasssubject) {
        // Filter students to match rollnoclasssubject exactly
        const className = classes.find(
          (cls) => cls.value === Number(classId)
        )?.label;
        const subjectName = subjects.find(
          (sub) => sub.value === Number(subjectId)
        )?.label;

        updatedStudents = updatedStudents.filter((student) => {
          const subjectsMatch = Array.isArray(student.student_subject)
            ? student.student_subject.includes(subjectName)
            : student.subject_names?.split(", ").includes(subjectName);
          return (
            student.roll_no === rollNo &&
            student.class_name === className &&
            subjectsMatch
          );
        });

        if (updatedStudents.length === 0) {
          setFetchError(
            "No students found for the specified Roll-Class-Subject."
          );
          setStudents([]);
          setTotalCount(0);
        } else {
          setFetchError(null);
          // Save matching students
          const successfulStudents = await saveStudentData(
            updatedStudents,
            rollNo,
            classId,
            subjectId
          );
          // Update student list with success status
          updatedStudents = updatedStudents.map((student) => ({
            ...student,
            status: successfulStudents.some(
              (s) => s.roll_no === student.roll_no
            )
              ? "success"
              : "success", // Ensure all matching students are marked as success
          }));
          setStudents(updatedStudents);
          setTotalCount(updatedStudents.length);
        }
      } else {
        setStudents(updatedStudents);
        setTotalCount(updatedStudents.length);
        setFetchError(null);
      }
    } catch (error) {
      console.error(
        "Error fetching students:",
        error.response?.data || error.message
      );
      setFetchError("Failed to fetch students. Please check your selections.");
      setStudents([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedSchool,
    selectedClassIds,
    selectedSubjectIds,
    selectedRollClassSubject,
    classes,
    subjects,
  ]);

  // Event handlers
  const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
  const handleRollClassSubjectChange = (e) =>
    setSelectedRollClassSubject(e.target.value || null);

  
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
                  label="Roll-Class-Subject (Optional)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={selectedRollClassSubject || ""}
                  onChange={handleRollClassSubjectChange}
                  disabled={isLoading || !selectedSchool}
                  placeholder="e.g., 761011502-15-5"
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
                  Total Issue: [ {totalCount} ] | Total Received: [
                  {totalSuccess}] | Pending: [{totalPending}]
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
