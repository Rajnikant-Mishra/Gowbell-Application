//--------------------------------------------------------------------

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
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import OMRSheet50 from "./OMRSheet50";
// import OMRSheet60 from "./OMRSheet60";
// import ReactDOM from "react-dom";
// import html2canvas from "html2canvas";

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
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [examDate, setExamDate] = useState("");
//   const [omrSet, setOmrSet] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
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
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [downloadHistory, setDownloadHistory] = useState(() => {
//     const saved = localStorage.getItem("downloadHistory");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const navigate = useNavigate();

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

//   // Location filtering
//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedDistrict, cities]);

//   // Fetch schools
//   const fetchSchoolsByLocation = useCallback(async (filters) => {
//     try {
//       setIsLoading(true);
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
//         setFetchError(null);
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setFetchError("Failed to fetch schools");
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
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

//   // Fetch student count
//   const fetchStudentCount = useCallback(async () => {
//     if (
//       !selectedSchool ||
//       !selectedClassIds.length ||
//       !selectedSubjectIds.length
//     ) {
//       setTotalCount(0);
//       setFetchError(null);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/student/filter`,
//         {
//           schoolName: selectedSchool,
//           classList: selectedClassIds,
//           subjectList: selectedSubjectIds,
//         }
//       );

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

//   useEffect(() => {
//     const timeoutId = setTimeout(fetchStudentCount, 500);
//     return () => clearTimeout(timeoutId);
//   }, [fetchStudentCount]);

//   // Generate PDF
//   const generatePDF = async (students, recordId) => {
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     let validStudents = 0;
//     const totalStudents = students.length;
//     const progressPerStudent = 80 / totalStudents;

//     for (let i = 0; i < students.length; i++) {
//       if (
//         !students[i].id ||
//         !students[i].student_name ||
//         !students[i].roll_no ||
//         !students[i].class_name
//       ) {
//         console.warn(
//           `Skipping invalid student data at index ${i}:`,
//           students[i]
//         );
//         continue;
//       }

//       validStudents++;
//       if (validStudents > 1) doc.addPage();
//       const OMRComponent = getOMRSheetComponent(students[i].class_name);
//       const tempDiv = document.createElement("div");
//       tempDiv.style.width = "210mm";
//       tempDiv.style.height = "298mm";
//       document.body.appendChild(tempDiv);

//       const subjectIds = students[i].subject_names
//         ? students[i].subject_names
//             .split(",")
//             .map((name) => {
//               const subject = subjects.find((s) => s.name === name.trim());
//               return subject ? subject.id : name;
//             })
//             .filter(Boolean)
//             .join(", ")
//         : selectedSubjectIds.join(", ");

//       const classId = students[i].class_name
//         ? classes.find((c) => c.name === students[i].class_name)?.id ||
//           students[i].class_name
//         : selectedClassIds[0];

//       ReactDOM.render(
//         <OMRComponent
//           schoolName={selectedSchool}
//           student={students[i].student_name}
//           studentId={students[i].id}
//           level={selectedLevel}
//           subject={students[i].subject_names || ""}
//           subjectIds={subjectIds}
//           className={students[i].class_name}
//           classId={classId}
//           date={examDate || new Date().toLocaleDateString()}
//           rollNumber={students[i].roll_no}
//           omrSet={omrSet}
//         />,
//         tempDiv
//       );

//       await html2canvas(tempDiv, { scale: 2 }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/jpeg", 0.1);
//         const imgWidth = doc.internal.pageSize.getWidth() - 20;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
//         doc.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
//         document.body.removeChild(tempDiv);
//       });

//       const progress = Math.min((i + 1) * progressPerStudent + 10, 90);
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
//       window.dispatchEvent(new Event("storage"));
//     }

//     if (validStudents === 0) {
//       throw new Error("No valid student data to generate PDF");
//     }

//     const filename = `OMR_Sheets_${selectedSchool.replace(
//       / /g,
//       "_"
//     )}_${new Date().toISOString().slice(0, 10)}.pdf`;
//     const pdfBlob = doc.output("blob");

//     const pdfDataUrl = await new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.readAsDataURL(pdfBlob);
//     });

//     localStorage.setItem("pdfProgress", JSON.stringify({ progress: 100 }));
//     window.dispatchEvent(new Event("storage"));

//     const link = document.createElement("a");
//     link.href = pdfDataUrl;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     return { validStudents, filename, pdfBlob, recordId };
//   };

//   // Handle save
//   const handleSave = async () => {
//     if (!totalCount) {
//       Swal.fire({
//         icon: "warning",
//         title: "No Students",
//         text: "Please select valid criteria with available students",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     try {
//       setIsGenerating(true);
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
//       window.dispatchEvent(new Event("storage"));

//       // Step 1: Fetch student data
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/student/filter`,
//         {
//           schoolName: selectedSchool,
//           classList: selectedClassIds,
//           subjectList: selectedSubjectIds,
//         }
//       );

//       if (!response.data.students?.length) {
//         throw new Error("No student data received");
//       }

//       const studentIds = response.data.students
//         .filter((student) => {
//           if (!student.id || isNaN(student.id)) {
//             console.warn(
//               `Student ${
//                 student.student_name || "unknown"
//               } missing or invalid ID, skipping`
//             );
//             return false;
//           }
//           return true;
//         })
//         .map((student) => Number(student.id));

//       if (!studentIds.length) {
//         throw new Error("No valid student IDs found");
//       }

//       const countryName = countries.find((c) => c.id === selectedCountry)?.name;
//       const stateName = filteredStates.find(
//         (s) => s.id === selectedState
//       )?.name;
//       const districtName = filteredDistricts.find(
//         (d) => d.id === selectedDistrict
//       )?.name;
//       const cityName = filteredCities.find((c) => c.id === selectedCity)?.name;

//       if (!countryName || !stateName || !districtName || !cityName) {
//         throw new Error(
//           "Missing location data (country, state, district, or city)"
//         );
//       }

//       if (!selectedLevel || !selectedModel || !omrSet) {
//         throw new Error("Level, Mode, Exam Date, or OMR Set is not selected");
//       }

//       // Step 2: Prepare payload for saving data
//       const payload = {
//         country: countryName,
//         state: stateName,
//         district: districtName,
//         city: cityName,
//         school: selectedSchool,
//         classes: selectedClassIds.map(
//           (id) =>
//             classes.find((c) => c.id === id)?.name || `Unknown Class ${id}`
//         ),
//         subjects: selectedSubjectIds.map(
//           (id) =>
//             subjects.find((s) => s.id === id)?.name || `Unknown Subject ${id}`
//         ),
//         student_count: studentIds.length,
//         level: selectedLevel,
//         mode: selectedModel,
//         exam_date: examDate,
//         omr_set: omrSet,
//         generation_date: new Date().toISOString(),
//         students: JSON.stringify(studentIds),
//       };

//       // Step 3: Save data to server
//       const formData = new FormData();
//       formData.append("data", JSON.stringify([payload]));
//       const saveResponse = await axios.post(
//         `${API_BASE_URL}/api/omr/generator`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (!saveResponse.data.insertedIds?.length) {
//         throw new Error("Failed to save OMR data to server");
//       }

//       const recordId = saveResponse.data.insertedIds[0]; // Get the ID of the inserted record

//       // Step 4: Redirect to OMR list page immediately after saving
//       Swal.fire({
//         icon: "success",
//         title: "Data Saved!",
//         text: "OMR data saved successfully. Redirecting to OMR list...",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "OK",
//         timer: 2000,
//         timerProgressBar: true,
//         showClass: {
//           popup: "animate__animated animate__fadeInDown",
//         },
//         hideClass: {
//           popup: "animate__animated animate__fadeOutUp",
//         },
//       }).then(() => {
//         navigate("/omr-list");
//       });

//       // Step 5: Generate PDF in the background
//       try {
//         const { validStudents, filename, pdfBlob } = await generatePDF(
//           response.data.students,
//           recordId
//         );

//         // Step 6: Update the same record with the PDF
//         const updateFormData = new FormData();
//         updateFormData.append("pdf", pdfBlob, filename);

//         const updateResponse = await axios.put(
//           `${API_BASE_URL}/api/omr/omr/filename/${recordId}`,
//           updateFormData,
//           {
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );

//         // Check for successful update based on server response
//         if (updateResponse.status !== 200 || !updateResponse.data.message) {
//           throw new Error(
//             updateResponse.data.error ||
//               "Failed to update OMR data with PDF on server"
//           );
//         }

//         // Notify user of successful PDF generation
//         Swal.fire({
//           icon: "success",
//           title: "PDF Generated!",
//           text: `${validStudents} OMR sheets generated successfully.`,
//           confirmButtonColor: "#3085d6",
//           confirmButtonText: "OK",
//           timer: 4000,
//           timerProgressBar: true,
//           showClass: {
//             popup: "animate__animated animate__fadeInDown",
//           },
//           hideClass: {
//             popup: "animate__animated animate__fadeOutUp",
//           },
//         });
//       } catch (pdfError) {
//         console.error("Error generating or updating PDF:", pdfError);
//         Swal.fire({
//           icon: "error",
//           title: "PDF Generation Failed",
//           text: pdfError.message || "Failed to generate or save OMR PDF",
//           confirmButtonColor: "#d33",
//           confirmButtonText: "OK",
//         });
//       }
//     } catch (error) {
//       console.error("Error in handleSave:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to save OMR data",
//         confirmButtonColor: "#d33",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setIsGenerating(false);
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress: 0 }));
//       window.dispatchEvent(new Event("storage"));
//     }
//   };

//   const getOMRSheetComponent = (className) => {
//     const lowerClasses = ["01", "02", "03", "1", "2", "3"];
//     const classNumber = className ? className.replace(/\D/g, "") : "";
//     return lowerClasses.includes(classNumber) ? OMRSheet50 : OMRSheet60;
//   };

//   // Dropdown options
//   const dropdownOptions = {
//     countries: countries.map((c) => ({ value: c.id, label: c.name })),
//     states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
//     districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
//     cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
//     schools: schools.map((s) => ({
//       value: s.school_name,
//       label: `${s.school_name} (${s.city_name || ""})`,
//     })),
//     classes: classes.map((c) => ({ value: c.id, label: c.name })),
//     subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
//     levels: [
//       { value: "1", label: "Level 1" },
//       { value: "2", label: "Level 2" },
//       { value: "3", label: "Level 3" },
//       { value: "4", label: "Level 4" },
//     ],
//     modes: [
//       { value: "Online", label: "Online" },
//       { value: "Offline", label: "Offline" },
//     ],
//     omrSets: [
//       { value: "A", label: "Set A" },
//       { value: "B", label: "Set B" },
//       { value: "C", label: "Set C" },
//       { value: "D", label: "Set D" },
//       { value: "E", label: "Set E" },
//       { value: "F", label: "Set F" },
//       { value: "G", label: "Set G" },
//       { value: "H", label: "Set H" },
//     ],
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[{ name: "OMR", link: "/omr-list" }, { name: "Create OMR" }]}
//         />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={styles.main}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             Create OMR Schedule
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
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Classes</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedClassIds}
//                     onChange={(e) => setSelectedClassIds(e.target.value)}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => (
//                           <Chip
//                             key={id}
//                             label={classes.find((c) => c.id === id)?.name || id}
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {classes.map((cls) => (
//                       <MenuItem key={cls.id} value={cls.id}>
//                         {cls.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Subjects</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedSubjectIds}
//                     onChange={(e) => setSelectedSubjectIds(e.target.value)}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => (
//                           <Chip
//                             key={id}
//                             label={
//                               subjects.find((s) => s.id === id)?.name || id
//                             }
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {subjects.map((sub) => (
//                       <MenuItem key={sub.id} value={sub.id}>
//                         {sub.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Level"
//                   value={selectedLevel}
//                   options={dropdownOptions.levels}
//                   onChange={(e) => setSelectedLevel(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Mode"
//                   value={selectedModel}
//                   options={dropdownOptions.modes}
//                   onChange={(e) => setSelectedModel(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="OMR Set"
//                   value={omrSet}
//                   options={dropdownOptions.omrSets}
//                   onChange={(e) => setOmrSet(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="Exam Date"
//                   type="date"
//                   value={examDate}
//                   onChange={(e) => setExamDate(e.target.value)}
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   disabled={isLoading}
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
//               sx={{ display: "flex", gap: 2, alignItems: "center" }}
//             >
//               <ButtonComp
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSave}
//                 disabled={
//                   !selectedSchool ||
//                   !selectedClassIds.length ||
//                   !selectedSubjectIds.length ||
//                   !selectedLevel ||
//                   !selectedModel ||
//                   !omrSet ||
//                   isLoading ||
//                   isGenerating ||
//                   !totalCount
//                 }
//                 text={isGenerating ? "Generating..." : "Generate PDF"}
//                 sx={{ flexGrow: 1 }}
//               />
//               <ButtonComp
//                 text="Cancel"
//                 onClick={() => navigate("/omr-list")}
//                 disabled={isLoading || isGenerating}
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

//---------------------------------------------------------------------------------------------

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
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../../Common-Css/Swallfire.css";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import OMRSheet50 from "./OMRSheet50";
// import OMRSheet60 from "./OMRSheet60";
// import ReactDOM from "react-dom";
// import html2canvas from "html2canvas";

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
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [examDate, setExamDate] = useState("");
//   const [omrSet, setOmrSet] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
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
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [classWiseCounts, setClassWiseCounts] = useState({});
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [downloadHistory, setDownloadHistory] = useState(() => {
//     const saved = localStorage.getItem("downloadHistory");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const navigate = useNavigate();

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

//   // Location filtering
//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//   }, [selectedDistrict, cities]);

//   // Fetch schools
//   const fetchSchoolsByLocation = useCallback(async (filters) => {
//     try {
//       setIsLoading(true);
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
//         setFetchError(null);
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setFetchError("Failed to fetch schools");
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
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

//   // Fetch student count and class-wise counts
//   const fetchStudentCount = useCallback(async () => {
//     if (
//       !selectedSchool ||
//       !selectedClassIds.length ||
//       !selectedSubjectIds.length
//     ) {
//       setTotalCount(0);
//       setClassWiseCounts({});
//       setFetchError(null);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/student/filter`,
//         {
//           schoolName: selectedSchool,
//           classList: selectedClassIds,
//           subjectList: selectedSubjectIds,
//         }
//       );

//       const students = response.data.students || [];
//       const classCounts = {};

//       // Calculate class-wise counts
//       selectedClassIds.forEach((classId) => {
//         const className =
//           classes.find((c) => c.id === classId)?.name || `Class ${classId}`;
//         const count = students.filter(
//           (student) => student.class_name === className
//         ).length;
//         classCounts[className] = count;
//       });

//       setTotalCount(response.data.totalCount || 0);
//       setClassWiseCounts(classCounts);
//       setFetchError(null);
//     } catch (error) {
//       console.error("Error fetching student count:", error);
//       setFetchError("Failed to fetch student count");
//       setTotalCount(0);
//       setClassWiseCounts({});
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedSchool, selectedClassIds, selectedSubjectIds, classes]);

//   useEffect(() => {
//     const timeoutId = setTimeout(fetchStudentCount, 500);
//     return () => clearTimeout(timeoutId);
//   }, [fetchStudentCount]);

//   //pdf genearte code
//   const generatePDF = async (students, recordId) => {
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     let validStudents = 0;
//     const totalStudents = students.length;
//     const progressPerStudent = 80 / totalStudents;

//     for (let i = 0; i < students.length; i++) {
//       if (
//         !students[i].id ||
//         !students[i].student_name ||
//         !students[i].roll_no ||
//         !students[i].class_name
//       ) {
//         console.warn(
//           `Skipping invalid student data at index ${i}:`,
//           students[i]
//         );
//         continue;
//       }

//       validStudents++;
//       if (validStudents > 1) doc.addPage();
//       const OMRComponent = getOMRSheetComponent(students[i].class_name);
//       const tempDiv = document.createElement("div");
//       tempDiv.style.width = "210mm";
//       tempDiv.style.height = "297mm";
//       tempDiv.style.backgroundColor = "white";
//       document.body.appendChild(tempDiv);

//       const subjectIds = students[i].subject_names
//         ? students[i].subject_names
//             .split(",")
//             .map((name) => {
//               const subject = subjects.find((s) => s.name === name.trim());
//               return subject ? subject.id : name;
//             })
//             .filter(Boolean)
//             .join(", ")
//         : selectedSubjectIds.join(", ");

//       const classId = students[i].class_name
//         ? classes.find((c) => c.name === students[i].class_name)?.id ||
//           students[i].class_name
//         : selectedClassIds[0];

//       ReactDOM.render(
//         <OMRComponent
//           schoolName={selectedSchool}
//           student={students[i].student_name}
//           studentId={students[i].id}
//           level={selectedLevel}
//           subject={students[i].subject_names || ""}
//           subjectIds={subjectIds}
//           className={students[i].class_name}
//           classId={classId}
//           date={examDate || new Date().toLocaleDateString()}
//           rollNumber={students[i].roll_no}
//           omrSet={omrSet}
//         />,
//         tempDiv
//       );

//       await html2canvas(tempDiv, { scale: 4, useCORS: true }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/jpeg", 0.98);
//         const imgWidth = doc.internal.pageSize.getWidth() - 10;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
//         doc.addImage(imgData, "JPEG", 5, 5, imgWidth, imgHeight);
//         document.body.removeChild(tempDiv);
//       });

//       const progress = Math.min((i + 1) * progressPerStudent + 10, 90);
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
//       window.dispatchEvent(new Event("storage"));
//     }

//     if (validStudents === 0) {
//       throw new Error("No valid student data to generate PDF");
//     }

//     const filename = `OMR_Sheets_${selectedSchool.replace(
//       / /g,
//       "_"
//     )}_${new Date().toISOString().slice(0, 10)}.pdf`;
//     const pdfBlob = doc.output("blob");

//     const pdfDataUrl = await new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.readAsDataURL(pdfBlob);
//     });

//     localStorage.setItem("pdfProgress", JSON.stringify({ progress: 100 }));
//     window.dispatchEvent(new Event("storage"));

//     const link = document.createElement("a");
//     link.href = pdfDataUrl;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     return { validStudents, filename, pdfBlob, recordId };
//   };

//   // Handle save
//   const handleSave = async () => {
//     if (!totalCount) {
//       Swal.fire({
//         icon: "warning",
//         title: "No Students",
//         text: "Please select valid criteria with available students",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     try {
//       setIsGenerating(true);
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
//       window.dispatchEvent(new Event("storage"));

//       // Step 1: Fetch student data
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/student/filter`,
//         {
//           schoolName: selectedSchool,
//           classList: selectedClassIds,
//           subjectList: selectedSubjectIds,
//         }
//       );

//       if (!response.data.students?.length) {
//         throw new Error("No student data received");
//       }

//       const studentIds = response.data.students
//         .filter((student) => {
//           if (!student.id || isNaN(student.id)) {
//             console.warn(
//               `Student ${
//                 student.student_name || "unknown"
//               } missing or invalid ID, skipping`
//             );
//             return false;
//           }
//           return true;
//         })
//         .map((student) => Number(student.id));

//       if (!studentIds.length) {
//         throw new Error("No valid student IDs found");
//       }

//       const countryName = countries.find((c) => c.id === selectedCountry)?.name;
//       const stateName = filteredStates.find(
//         (s) => s.id === selectedState
//       )?.name;
//       const districtName = filteredDistricts.find(
//         (d) => d.id === selectedDistrict
//       )?.name;
//       const cityName = filteredCities.find((c) => c.id === selectedCity)?.name;

//       if (!countryName || !stateName || !districtName || !cityName) {
//         throw new Error(
//           "Missing location data (country, state, district, or city)"
//         );
//       }

//       if (!selectedLevel || !selectedModel || !omrSet) {
//         throw new Error("Level, Mode, Exam Date, or OMR Set is not selected");
//       }

//       // Step 2: Prepare payload for saving data
//       const payload = {
//         country: countryName,
//         state: stateName,
//         district: districtName,
//         city: cityName,
//         school: selectedSchool,
//         classes: selectedClassIds.map(
//           (id) =>
//             classes.find((c) => c.id === id)?.name || `Unknown Class ${id}`
//         ),
//         subjects: selectedSubjectIds.map(
//           (id) =>
//             subjects.find((s) => s.id === id)?.name || `Unknown Subject ${id}`
//         ),
//         student_count: studentIds.length,
//         level: selectedLevel,
//         mode: selectedModel,
//         exam_date: examDate,
//         omr_set: omrSet,
//         generation_date: new Date().toISOString(),
//         students: JSON.stringify(studentIds),
//         class_count: JSON.stringify(classWiseCounts), // Save class-wise counts as JSON
//       };

//       // Step 3: Save data to server
//       const formData = new FormData();
//       formData.append("data", JSON.stringify([payload]));
//       const saveResponse = await axios.post(
//         `${API_BASE_URL}/api/omr/generator`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (!saveResponse.data.insertedIds?.length) {
//         throw new Error("Failed to save OMR data to server");
//       }

//       const recordId = saveResponse.data.insertedIds[0]; // Get the ID of the inserted record

//       // Step 4: Redirect to OMR list page immediately after saving
//       Swal.fire({
//         icon: "success",
//         title: "Data Saved!",
//         text: "OMR data saved successfully. Redirecting to OMR list...",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "OK",
//         timer: 2000,
//         timerProgressBar: true,
//         showClass: {
//           popup: "animate__animated animate__fadeInDown",
//         },
//         hideClass: {
//           popup: "animate__animated animate__fadeOutUp",
//         },
//       }).then(() => {
//         navigate("/omr-list");
//       });

//       // Step 5: Generate PDF in the background
//       try {
//         const { validStudents, filename, pdfBlob } = await generatePDF(
//           response.data.students,
//           recordId
//         );

//         // Step 6: Update the same record with the PDF
//         const updateFormData = new FormData();
//         updateFormData.append("pdf", pdfBlob, filename);

//         const updateResponse = await axios.put(
//           `${API_BASE_URL}/api/omr/omr/filename/${recordId}`,
//           updateFormData,
//           {
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );

//         // Check for successful update based on server response
//         if (updateResponse.status !== 200 || !updateResponse.data.message) {
//           throw new Error(
//             updateResponse.data.error ||
//               "Failed to update OMR data with PDF on server"
//           );
//         }

//         // Notify user of successful PDF generation
//         Swal.fire({
//           icon: "success",
//           title: "PDF Generated!",
//           text: `${validStudents} OMR sheets generated successfully.`,
//           confirmButtonColor: "#3085d6",
//           confirmButtonText: "OK",
//           timer: 4000,
//           timerProgressBar: true,
//           showClass: {
//             popup: "animate__animated animate__fadeInDown",
//           },
//           hideClass: {
//             popup: "animate__animated animate__fadeOutUp",
//           },
//         });
//       } catch (pdfError) {
//         console.error("Error generating or updating PDF:", pdfError);
//         Swal.fire({
//           icon: "error",
//           title: "PDF Generation Failed",
//           text: pdfError.message || "Failed to generate or save OMR PDF",
//           confirmButtonColor: "#d33",
//           confirmButtonText: "OK",
//         });
//       }
//     } catch (error) {
//       console.error("Error in handleSave:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to save OMR data",
//         confirmButtonColor: "#d33",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setIsGenerating(false);
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress: 0 }));
//       window.dispatchEvent(new Event("storage"));
//     }
//   };

//   const getOMRSheetComponent = (className) => {
//     const lowerClasses = ["01", "02", "03", "1", "2", "3"];
//     const classNumber = className ? className.replace(/\D/g, "") : "";
//     return lowerClasses.includes(classNumber) ? OMRSheet50 : OMRSheet60;
//   };

//   // Dropdown options
//   const dropdownOptions = {
//     countries: countries.map((c) => ({ value: c.id, label: c.name })),
//     states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
//     districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
//     cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
//     schools: schools.map((s) => ({
//       value: s.school_name,
//       label: `${s.school_name} (${s.city_name || ""})`,
//     })),
//     classes: classes.map((c) => ({ value: c.id, label: c.name })),
//     subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
//     levels: [
//       { value: "1", label: "Level 1" },
//       { value: "2", label: "Level 2" },
//       { value: "3", label: "Level 3" },
//       { value: "4", label: "Level 4" },
//     ],
//     modes: [
//       { value: "Online", label: "Online" },
//       { value: "Offline", label: "Offline" },
//     ],
//     omrSets: [
//       { value: "A", label: "Set A" },
//       { value: "B", label: "Set B" },
//       { value: "C", label: "Set C" },
//       { value: "D", label: "Set D" },
//       { value: "E", label: "Set E" },
//       { value: "F", label: "Set F" },
//       { value: "G", label: "Set G" },
//       { value: "H", label: "Set H" },
//     ],
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[{ name: "OMR", link: "/omr-list" }, { name: "Create OMR" }]}
//         />
//       </div>
//       <Container component="main" maxWidth="">
//         <Paper
//           className={styles.main}
//           elevation={3}
//           style={{ padding: "20px", marginTop: "16px" }}
//         >
//           <Typography className={`${styles.formTitle} mb-4`}>
//             Create OMR Schedule
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
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Classes</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedClassIds}
//                     onChange={(e) => setSelectedClassIds(e.target.value)}
//                     label="Classes"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => (
//                           <Chip
//                             key={id}
//                             label={classes.find((c) => c.id === id)?.name || id}
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {classes.map((cls) => (
//                       <MenuItem key={cls.id} value={cls.id}>
//                         {cls.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Subjects</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedSubjectIds}
//                     onChange={(e) => setSelectedSubjectIds(e.target.value)}
//                     label="Subjects"
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => (
//                           <Chip
//                             key={id}
//                             label={
//                               subjects.find((s) => s.id === id)?.name || id
//                             }
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {subjects.map((sub) => (
//                       <MenuItem key={sub.id} value={sub.id}>
//                         {sub.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Level"
//                   value={selectedLevel}
//                   options={dropdownOptions.levels}
//                   onChange={(e) => setSelectedLevel(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Mode"
//                   value={selectedModel}
//                   options={dropdownOptions.modes}
//                   onChange={(e) => setSelectedModel(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="OMR Set"
//                   value={omrSet}
//                   options={dropdownOptions.omrSets}
//                   onChange={(e) => setOmrSet(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="Exam Date"
//                   type="date"
//                   value={examDate}
//                   onChange={(e) => setExamDate(e.target.value)}
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   disabled={isLoading}
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
//               className={`${styles.buttonContainer} mt-4`}
//               sx={{ display: "flex", alignItems: "center", gap: 2 }}
//             >
//               <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
//                 <ButtonComp
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSave}
//                   disabled={
//                     !selectedSchool ||
//                     !selectedClassIds.length ||
//                     !selectedSubjectIds.length ||
//                     !selectedLevel ||
//                     !selectedModel ||
//                     !omrSet ||
//                     isLoading ||
//                     isGenerating ||
//                     !totalCount
//                   }
//                   text={isGenerating ? "Generating..." : "Generate PDF"}
//                   sx={{ flexGrow: 1 }}
//                 />
//                 <ButtonComp
//                   text="Cancel"
//                   onClick={() => navigate("/omr-list")}
//                   disabled={isLoading || isGenerating}
//                   sx={{ flexGrow: 1 }}
//                 />
//               </Box>
//               {/* {Object.keys(classWiseCounts).length > 0 && (
//                 <Box sx={{ maxWidth: "300px" }}>
//                   <Typography variant="subtitle1" color="textPrimary">
//                     Class-wise Student Count:
//                   </Typography>
//                   {Object.entries(classWiseCounts).map(([className, count]) => (
//                     <Typography key={className} variant="body2" color="textSecondary">
//                       {className}: {count}
//                     </Typography>
//                   ))}
//                 </Box>
//               )} */}
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
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import jsPDF from "jspdf";
import "jspdf-autotable";
import OMRSheet50 from "./OMRSheet50";
import OMRSheet60 from "./OMRSheet60";
import ReactDOM from "react-dom";
import html2canvas from "html2canvas";

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
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

const ExaminationForm = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [omrSet, setOmrSet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [classWiseCounts, setClassWiseCounts] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState(() => {
    const saved = localStorage.getItem("downloadHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

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

  // Location filtering
  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchool("");
  }, [selectedDistrict, cities]);

  // Fetch schools
  const fetchSchoolsByLocation = useCallback(async (filters) => {
    try {
      setIsLoading(true);
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
        setFetchError(null);
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setFetchError("Failed to fetch schools");
      setSchools([]);
    } finally {
      setIsLoading(false);
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

  // Fetch student count and class-wise counts
  const fetchStudentCount = useCallback(async () => {
    if (
      !selectedSchool ||
      !selectedClassIds.length ||
      !selectedSubjectIds.length
    ) {
      setTotalCount(0);
      setClassWiseCounts({});
      setFetchError(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/get/student/filter`,
        {
          schoolName: selectedSchool,
          classList: selectedClassIds,
          subjectList: selectedSubjectIds,
        }
      );

      const students = response.data.students || [];
      const classCounts = {};

      // Calculate class-wise counts
      selectedClassIds.forEach((classId) => {
        const className =
          classes.find((c) => c.id === classId)?.name || `Class ${classId}`;
        const count = students.filter(
          (student) => student.class_name === className
        ).length;
        classCounts[className] = count;
      });

      setTotalCount(response.data.totalCount || 0);
      setClassWiseCounts(classCounts);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching student count:", error);
      setFetchError("Failed to fetch student count");
      setTotalCount(0);
      setClassWiseCounts({});
    } finally {
      setIsLoading(false);
    }
  }, [selectedSchool, selectedClassIds, selectedSubjectIds, classes]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchStudentCount, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchStudentCount]);

  // PDF generation function updated to process in batches
  const generatePDF = async (students, recordId) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let validStudents = 0;
    const totalStudents = students.length;
    const batchSize = 10;
    const totalBatches = Math.ceil(totalStudents / batchSize);
    let currentBatch = 0;

    // Process students in batches
    for (
      let batchStart = 0;
      batchStart < totalStudents;
      batchStart += batchSize
    ) {
      const batchStudents = students.slice(batchStart, batchStart + batchSize);
      currentBatch++;

      const progress = Math.min((currentBatch / totalBatches) * 80 + 10, 90);
      localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
      window.dispatchEvent(new Event("storage"));

      for (const student of batchStudents) {
        if (
          !student.id ||
          !student.student_name ||
          !student.roll_no ||
          !student.class_name
        ) {
          console.warn(`Skipping invalid student data:`, student);
          continue;
        }

        validStudents++;
        if (validStudents > 1) doc.addPage();

        const OMRComponent = getOMRSheetComponent(student.class_name);
        const tempDiv = document.createElement("div");
        tempDiv.style.width = "210mm";
        tempDiv.style.height = "297mm";
        tempDiv.style.backgroundColor = "white";
        document.body.appendChild(tempDiv);

        const subjectIds = student.subject_names
          ? student.subject_names
              .split(",")
              .map((name) => {
                const subject = subjects.find((s) => s.name === name.trim());
                return subject ? subject.id : name;
              })
              .filter(Boolean)
              .join(", ")
          : selectedSubjectIds.join(", ");

        const classId = student.class_name
          ? classes.find((c) => c.name === student.class_name)?.id ||
            student.class_name
          : selectedClassIds[0];

        ReactDOM.render(
          <OMRComponent
            schoolName={selectedSchool}
            student={student.student_name}
            studentId={student.id}
            level={selectedLevel}
            subject={student.subject_names || ""}
            subjectIds={subjectIds}
            className={student.class_name}
            classId={classId}
            // date={examDate || new Date().toLocaleDateString()}
            rollNumber={student.roll_no}
            omrSet={omrSet}
          />,
          tempDiv
        );

        const canvas = await html2canvas(tempDiv, { scale: 4, useCORS: true });
        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        const imgWidth = doc.internal.pageSize.getWidth() - 10;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, "JPEG", 5, 5, imgWidth, imgHeight);
        document.body.removeChild(tempDiv);
      }
    }

    if (validStudents === 0) {
      throw new Error("No valid student data to generate PDF");
    }

    const filename = `OMR_Sheets_${selectedSchool.replace(
      / /g,
      "_"
    )}_${new Date().toISOString().slice(0, 10)}.pdf`;
    const pdfBlob = doc.output("blob");

    const pdfDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(pdfBlob);
    });

    localStorage.setItem("pdfProgress", JSON.stringify({ progress: 100 }));
    window.dispatchEvent(new Event("storage"));

    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { validStudents, filename, pdfBlob, recordId };
  };

  // Handle save
  const handleSave = async () => {
    if (!totalCount) {
      Swal.fire({
        icon: "warning",
        title: "No Students",
        text: "Please select valid criteria with available students",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setIsGenerating(true);
      localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
      window.dispatchEvent(new Event("storage"));

      // Step 1: Fetch student data
      const response = await axios.post(
        `${API_BASE_URL}/api/get/student/filter`,
        {
          schoolName: selectedSchool,
          classList: selectedClassIds,
          subjectList: selectedSubjectIds,
        }
      );

      if (!response.data.students?.length) {
        throw new Error("No student data received");
      }

      const studentIds = response.data.students
        .filter((student) => {
          if (!student.id || isNaN(student.id)) {
            console.warn(
              `Student ${
                student.student_name || "unknown"
              } missing or invalid ID, skipping`
            );
            return false;
          }
          return true;
        })
        .map((student) => Number(student.id));

      if (!studentIds.length) {
        throw new Error("No valid student IDs found");
      }

      const countryName = countries.find((c) => c.id === selectedCountry)?.name;
      const stateName = filteredStates.find(
        (s) => s.id === selectedState
      )?.name;
      const districtName = filteredDistricts.find(
        (d) => d.id === selectedDistrict
      )?.name;
      const cityName = filteredCities.find((c) => c.id === selectedCity)?.name;

      if (!countryName || !stateName || !districtName || !cityName) {
        throw new Error(
          "Missing location data (country, state, district, or city)"
        );
      }

      if (!selectedLevel || !selectedModel || !omrSet) {
        throw new Error("Level, Mode, Exam Date, or OMR Set is not selected");
      }

      // Step 2: Prepare payload for saving data
      const payload = {
        country: countryName,
        state: stateName,
        district: districtName,
        city: cityName,
        school: selectedSchool,
        classes: selectedClassIds.map(
          (id) =>
            classes.find((c) => c.id === id)?.name || `Unknown Class ${id}`
        ),
        subjects: selectedSubjectIds.map(
          (id) =>
            subjects.find((s) => s.id === id)?.name || `Unknown Subject ${id}`
        ),
        student_count: studentIds.length,
        level: selectedLevel,
        mode: selectedModel,
        exam_date: examDate,
        omr_set: omrSet,
        generation_date: new Date().toISOString(),
        students: JSON.stringify(studentIds),
        class_count: JSON.stringify(classWiseCounts),
      };

      // Step 3: Save data to server
      const formData = new FormData();
      formData.append("data", JSON.stringify([payload]));
      const saveResponse = await axios.post(
        `${API_BASE_URL}/api/omr/generator`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!saveResponse.data.insertedIds?.length) {
        throw new Error("Failed to save OMR data to server");
      }

      const recordId = saveResponse.data.insertedIds[0];

      // Step 4: Redirect to OMR list page immediately after saving
      Swal.fire({
        icon: "success",
        title: "Data Saved!",
        text: "OMR data saved successfully. Redirecting to OMR list...",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      }).then(() => {
        navigate("/omr-list");
      });

      // Step 5: Generate PDF in the background
      try {
        const { validStudents, filename, pdfBlob } = await generatePDF(
          response.data.students,
          recordId
        );

        // Step 6: Update the same record with the PDF
        const updateFormData = new FormData();
        updateFormData.append("pdf", pdfBlob, filename);

        const updateResponse = await axios.put(
          `${API_BASE_URL}/api/omr/omr/filename/${recordId}`,
          updateFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (updateResponse.status !== 200 || !updateResponse.data.message) {
          throw new Error(
            updateResponse.data.error ||
              "Failed to update OMR data with PDF on server"
          );
        }

        Swal.fire({
          icon: "success",
          title: "PDF Generated!",
          text: `${validStudents} OMR sheets generated successfully.`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          timer: 4000,
          timerProgressBar: true,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      } catch (pdfError) {
        console.error("Error generating or updating PDF:", pdfError);
        Swal.fire({
          icon: "error",
          title: "PDF Generation Failed",
          text: pdfError.message || "Failed to generate or save OMR PDF",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save OMR data",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } finally {
      setIsGenerating(false);
      localStorage.setItem("pdfProgress", JSON.stringify({ progress: 0 }));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const getOMRSheetComponent = (className) => {
    const lowerClasses = ["01", "02", "03", "1", "2", "3"];
    const classNumber = className ? className.replace(/\D/g, "") : "";
    return lowerClasses.includes(classNumber) ? OMRSheet50 : OMRSheet60;
  };

  // Dropdown options
  const dropdownOptions = {
    countries: countries.map((c) => ({ value: c.id, label: c.name })),
    states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
    districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
    cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
    schools: schools.map((s) => ({
      value: s.school_name,
      label: `${s.school_name} (${s.city_name || ""})`,
    })),
    classes: classes.map((c) => ({ value: c.id, label: c.name })),
    subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
    levels: [
      { value: "1", label: "Level 1" },
      { value: "2", label: "Level 2" },
      { value: "3", label: "Level 3" },
      { value: "4", label: "Level 4" },
    ],
    modes: [
      { value: "Online", label: "Online" },
      { value: "Offline", label: "Offline" },
    ],
    omrSets: [
      { value: "A", label: "Set A" },
      { value: "B", label: "Set B" },
      { value: "C", label: "Set C" },
      { value: "D", label: "Set D" },
      { value: "E", label: "Set E" },
      { value: "F", label: "Set F" },
      { value: "G", label: "Set G" },
      { value: "H", label: "Set H" },
    ],
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[{ name: "OMR", link: "/omr-list" }, { name: "Create OMR" }]}
        />
      </div>
      <Container component="main" maxWidth="">
        <Paper
          className={styles.main}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={`${styles.formTitle} mb-4`}>
            Create OMR Schedule
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
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={dropdownOptions.states}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry || isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={dropdownOptions.districts}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState || isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="City"
                  value={selectedCity}
                  options={dropdownOptions.cities}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDistrict || isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="School"
                  value={selectedSchool}
                  options={dropdownOptions.schools}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  disabled={isLoading || !selectedCity}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Classes</InputLabel>
                  <Select
                    multiple
                    value={selectedClassIds}
                    onChange={(e) => setSelectedClassIds(e.target.value)}
                    label="Classes"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => (
                          <Chip
                            key={id}
                            label={classes.find((c) => c.id === id)?.name || id}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Subjects</InputLabel>
                  <Select
                    multiple
                    value={selectedSubjectIds}
                    onChange={(e) => setSelectedSubjectIds(e.target.value)}
                    label="Subjects"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => (
                          <Chip
                            key={id}
                            label={
                              subjects.find((s) => s.id === id)?.name || id
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {subjects.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Level"
                  value={selectedLevel}
                  options={dropdownOptions.levels}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Mode"
                  value={selectedModel}
                  options={dropdownOptions.modes}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="OMR Set"
                  value={omrSet}
                  options={dropdownOptions.omrSets}
                  onChange={(e) => setOmrSet(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Exam Date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  fullWidth
                  margin="normal"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Box mt={3} mb={3}>
              {totalCount > 0 ? (
                <Typography variant="h6" color="primary">
                  Total Students: {totalCount}
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
              className={`${styles.buttonContainer} mt-4`}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
                <ButtonComp
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={
                    !selectedSchool ||
                    !selectedClassIds.length ||
                    !selectedSubjectIds.length ||
                    !selectedLevel ||
                    !selectedModel ||
                    !omrSet ||
                    isLoading ||
                    isGenerating ||
                    !totalCount
                  }
                  text={isGenerating ? "Generating..." : "Generate PDF"}
                  sx={{ flexGrow: 1 }}
                />
                <ButtonComp
                  text="Cancel"
                  onClick={() => navigate("/omr-list")}
                  disabled={isLoading || isGenerating}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
