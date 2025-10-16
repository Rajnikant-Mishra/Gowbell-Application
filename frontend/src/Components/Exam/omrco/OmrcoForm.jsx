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

//   // Fetch initial data and set India as default country
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
//           const countriesData = countriesRes.data || [];
//           setCountries(countriesData);
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

//           // Set India as default country
//           const india = countriesData.find(
//             (c) => c.name.toLowerCase() === "india"
//           );
//           if (india) {
//             setSelectedCountry(india.id);
//           }
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
//     setExamDate(null);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setExamDate(null);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setExamDate(null);
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
//             country_id: location.country,
//             state_id: location.state,
//             district_id: location.district,
//             city_id: location.city,
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
//       setExamDate(null);
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
//           level: selectedLevel,
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
//       setExamDate(response.data.exam_date || null);
//       setFetchError(null);
//     } catch (error) {
//       console.error("Error fetching student count:", error);
//       setFetchError("Failed to fetch student count");
//       setTotalCount(0);
//       setClassWiseCounts({});
//       setExamDate(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedSchool, selectedClassIds, selectedSubjectIds, classes]);

//   useEffect(() => {
//     const timeoutId = setTimeout(fetchStudentCount, 500);
//     return () => clearTimeout(timeoutId);
//   }, [fetchStudentCount]);

//   // PDF generation function (unchanged)
//   const generatePDF = async (students, recordId) => {
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     let validSheets = 0;
//     const batchSize = 10;
//     let currentSheetIndex = 0;

//     // Group students by student ID to handle multiple subjects per student
//     const studentsById = students.reduce((acc, student) => {
//       if (
//         !student.id ||
//         !student.student_name ||
//         !student.roll_no ||
//         !student.class_name ||
//         !student.subject_name
//       ) {
//         console.warn(`Skipping invalid student data:`, student);
//         return acc;
//       }

//       if (!acc[student.id]) {
//         acc[student.id] = {
//           id: student.id,
//           student_name: student.student_name,
//           roll_no: student.roll_no,
//           class_name: student.class_name,
//           school_id: student.school_id,
//           subjects: [],
//         };
//       }
//       acc[student.id].subjects.push(student.subject_name);
//       return acc;
//     }, {});

//     const studentList = Object.values(studentsById);
//     const totalSheets = studentList.reduce(
//       (sum, student) => sum + student.subjects.length,
//       0
//     );
//     const totalBatches = Math.ceil(totalSheets / batchSize);

//     // Process each student and their subjects in batches
//     for (
//       let batchStart = 0;
//       batchStart < totalSheets;
//       batchStart += batchSize
//     ) {
//       const batchEnd = Math.min(batchStart + batchSize, totalSheets);
//       currentSheetIndex += batchSize;

//       const progress = Math.min(
//         (currentSheetIndex / totalBatches) * 80 + 10,
//         90
//       );
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
//       window.dispatchEvent(new Event("storage"));

//       // Iterate over students and their subjects to create OMR sheets
//       let currentIndex = 0;
//       for (const student of studentList) {
//         for (const subjectName of student.subjects) {
//           if (currentIndex >= batchStart && currentIndex < batchEnd) {
//             validSheets++;
//             if (validSheets > 1) doc.addPage();

//             const OMRComponent = getOMRSheetComponent(student.class_name);
//             const tempDiv = document.createElement("div");
//             tempDiv.style.width = "210mm";
//             tempDiv.style.height = "297mm";
//             tempDiv.style.backgroundColor = "white";
//             document.body.appendChild(tempDiv);

//             const subjectId =
//               subjects.find((s) => s.name === subjectName)?.id || subjectName;

//             ReactDOM.render(
//               <OMRComponent
//                 schoolName={selectedSchool}
//                 student={student.student_name}
//                 studentId={student.id}
//                 level={selectedLevel}
//                 subject={subjectName}
//                 subjectIds={subjectId}
//                 className={student.class_name}
//                 classId={
//                   classes.find((c) => c.name === student.class_name)?.id ||
//                   student.class_name
//                 }
//                 rollNumber={student.roll_no}
//                 omrSet={omrSet}
//                 examDate={examDate || "Not Available"}
//               />,
//               tempDiv
//             );

//             const canvas = await html2canvas(tempDiv, {
//               scale: 4,
//               useCORS: true,
//             });
//             const imgData = canvas.toDataURL("image/jpeg", 0.98);
//             const imgWidth = doc.internal.pageSize.getWidth() - 10;
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
//             doc.addImage(imgData, "JPEG", 5, 5, imgWidth, imgHeight);
//             document.body.removeChild(tempDiv);
//           }
//           currentIndex++;
//         }
//       }
//     }

//     if (validSheets === 0) {
//       throw new Error("No valid student or subject data to generate PDF");
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

//     return { validStudents: validSheets, filename, pdfBlob, recordId };
//   };

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
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Authentication token is missing");

//       localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
//       window.dispatchEvent(new Event("storage"));

//       // Step 1: Fetch student data
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/student/filter`,
//         {
//           schoolName: selectedSchool,
//           classList: selectedClassIds,
//           subjectList: selectedSubjectIds,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!response.data.students?.length) {
//         throw new Error("No student data received");
//       }

//       const studentIds = response.data.students
//         .filter((student) => student.id && !isNaN(student.id))
//         .map((student) => Number(student.id));

//       if (!studentIds.length) {
//         throw new Error("No valid student IDs found");
//       }

//       // Step 2: Prepare payload with IDs instead of names
//       const payload = {
//         country: selectedCountry, // Store country ID
//         state: selectedState, // Store state ID
//         district: selectedDistrict, // Store district ID
//         city: selectedCity, // Store city ID
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
//         class_count: JSON.stringify(classWiseCounts),
//       };

//       // Step 3: Validate required fields
//       if (
//         !selectedCountry ||
//         !selectedState ||
//         !selectedDistrict ||
//         !selectedCity ||
//         !selectedLevel ||
//         !selectedModel ||
//         !omrSet
//       ) {
//         throw new Error(
//           "Missing required fields (location, level, mode, or OMR set)"
//         );
//       }

//       // Step 4: Save OMR data
//       const formData = new FormData();
//       formData.append("data", JSON.stringify([payload]));

//       const saveResponse = await axios.post(
//         `${API_BASE_URL}/api/omr/generator`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!saveResponse.data.insertedIds?.length) {
//         throw new Error("Failed to save OMR data to server");
//       }

//       const recordId = saveResponse.data.insertedIds[0];

//       // Step 5: Show success Swal and redirect
//       Swal.fire({
//         icon: "success",
//         title: "Data Saved!",
//         text: "OMR data saved successfully. Redirecting to OMR list...",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "OK",
//         timer: 2000,
//         timerProgressBar: true,
//         showClass: { popup: "animate__animated animate__fadeInDown" },
//         hideClass: { popup: "animate__animated animate__fadeOutUp" },
//       }).then(() => {
//         navigate("/omr-list");
//       });

//       // Step 6: Generate PDF in background
//       try {
//         const { validStudents, filename, pdfBlob } = await generatePDF(
//           response.data.students,
//           recordId
//         );

//         const updateFormData = new FormData();
//         updateFormData.append("pdf", pdfBlob, filename);

//         const updateResponse = await axios.put(
//           `${API_BASE_URL}/api/omr/omr/filename/${recordId}`,
//           updateFormData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (updateResponse.status !== 200 || !updateResponse.data.message) {
//           throw new Error(
//             updateResponse.data.error ||
//               "Failed to update OMR data with PDF on server"
//           );
//         }

//         Swal.fire({
//           icon: "success",
//           title: "PDF Generated!",
//           text: `${validStudents} OMR sheets generated successfully.`,
//           confirmButtonColor: "#3085d6",
//           confirmButtonText: "OK",
//           timer: 4000,
//           timerProgressBar: true,
//           showClass: { popup: "animate__animated animate__fadeInDown" },
//           hideClass: { popup: "animate__animated animate__fadeOutUp" },
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
//       label: `${s.school_name}`,
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
//             </Box>
//           </form>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;





// import React, { useState, useEffect, useCallback, useMemo } from "react";
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
//   const [selectedLevel, setSelectedLevel] = useState("level_1"); // default
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
//   const navigate = useNavigate();

//   // Fetch initial data and set India as default country
//   useEffect(() => {
//     let isMounted = true;

//     const fetchInitialData = async () => {
//       try {
//         setIsLoading(true);

//         // Fetch all required data in parallel
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
//           const countriesData = Array.isArray(countriesRes.data)
//             ? countriesRes.data
//             : [];
//           setCountries(countriesData);
//           setStates(Array.isArray(statesRes.data) ? statesRes.data : []);
//           setDistricts(
//             Array.isArray(districtsRes.data) ? districtsRes.data : []
//           );
//           setCities(Array.isArray(citiesRes.data) ? citiesRes.data : []);
//           setClasses(
//             Array.isArray(classesRes.data)
//               ? classesRes.data.map((cls) => ({ id: cls.id, name: cls.name }))
//               : []
//           );
//           setSubjects(
//             Array.isArray(subjectsRes.data)
//               ? subjectsRes.data.map((sub) => ({ id: sub.id, name: sub.name }))
//               : []
//           );

//           // ✅ Set India as default country
//           const india = countriesData.find(
//             (c) => c.name?.toLowerCase().trim() === "india"
//           );
//           if (india) {
//             setSelectedCountry(india.id);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setFetchError("Failed to load initial data");
//         setCountries([]);
//         setStates([]);
//         setDistricts([]);
//         setCities([]);
//         setClasses([]);
//         setSubjects([]);
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
//     setExamDate(null);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setExamDate(null);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setExamDate(null);
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
//             country_id: location.country,
//             state_id: location.state,
//             district_id: location.district,
//             city_id: location.city,
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
//       setExamDate(null);
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
//           level: selectedLevel,
//         }
//       );

//       const students = response.data.students || [];
//       const classCounts = {};

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
//       setExamDate(response.data.exam_date || null);
//       setFetchError(null);
//     } catch (error) {
//       console.error("Error fetching student count:", error);
//       setFetchError("Failed to fetch student count");
//       setTotalCount(0);
//       setClassWiseCounts({});
//       setExamDate(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     selectedSchool,
//     selectedClassIds,
//     selectedSubjectIds,
//     selectedLevel,
//     classes,
//   ]);

//   useEffect(() => {
//     const timeoutId = setTimeout(fetchStudentCount, 500);
//     return () => clearTimeout(timeoutId);
//   }, [fetchStudentCount]);

//   // PDF generation
//   const getOMRSheetComponent = (className) => {
//     const lowerClasses = ["01", "02", "03", "1", "2", "3"];
//     const classNumber = className ? className.replace(/\D/g, "") : "";
//     return lowerClasses.includes(classNumber) ? OMRSheet50 : OMRSheet60;
//   };

//   const generatePDF = async (students, recordId) => {
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });
//     let validSheets = 0;
//     const batchSize = 10;
//     let currentSheetIndex = 0;

//     const studentsById = students.reduce((acc, student) => {
//       if (
//         !student.id ||
//         !student.student_name ||
//         !student.roll_no ||
//         !student.class_name ||
//         !student.subject_name
//       )
//         return acc;

//       if (!acc[student.id]) {
//         acc[student.id] = {
//           id: student.id,
//           student_name: student.student_name,
//           roll_no: student.roll_no,
//           class_name: student.class_name,
//           school_id: student.school_id,
//           subjects: [],
//         };
//       }
//       acc[student.id].subjects.push(student.subject_name);
//       return acc;
//     }, {});

//     const studentList = Object.values(studentsById);
//     const totalSheets = studentList.reduce(
//       (sum, student) => sum + student.subjects.length,
//       0
//     );
//     const totalBatches = Math.ceil(totalSheets / batchSize);

//     for (
//       let batchStart = 0;
//       batchStart < totalSheets;
//       batchStart += batchSize
//     ) {
//       const batchEnd = Math.min(batchStart + batchSize, totalSheets);
//       currentSheetIndex += batchSize;

//       const progress = Math.min(
//         (currentSheetIndex / totalBatches) * 80 + 10,
//         90
//       );
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
//       window.dispatchEvent(new Event("storage"));

//       let currentIndex = 0;
//       for (const student of studentList) {
//         for (const subjectName of student.subjects) {
//           if (currentIndex >= batchStart && currentIndex < batchEnd) {
//             validSheets++;
//             if (validSheets > 1) doc.addPage();

//             const OMRComponent = getOMRSheetComponent(student.class_name);
//             const tempDiv = document.createElement("div");
//             tempDiv.style.width = "210mm";
//             tempDiv.style.height = "297mm";
//             tempDiv.style.backgroundColor = "white";
//             document.body.appendChild(tempDiv);

//             const subjectId =
//               subjects.find((s) => s.name === subjectName)?.id || subjectName;

//             //Create a helper function:
//             const getLevelNumber = (levelString) => {
//               switch (levelString) {
//                 case "level_1":
//                   return 1;
//                 case "level_2":
//                   return 2;
//                 case "level_3":
//                   return 3;
//                 case "level_4":
//                   return 4;
//                 default:
//                   return null; // or 0 if you want
//               }
//             };

//             ReactDOM.render(
//               <OMRComponent
//                 schoolName={selectedSchool}
//                 student={student.student_name}
//                 studentId={student.id}
//                 level={getLevelNumber(selectedLevel)} // <-- numeric level here
//                 subject={subjectName}
//                 subjectIds={subjectId}
//                 className={student.class_name}
//                 classId={
//                   classes.find((c) => c.name === student.class_name)?.id ||
//                   student.class_name
//                 }
//                 rollNumber={student.roll_no}
//                 omrSet={omrSet}
//                 examDate={examDate || "Not Available"}
//               />,
//               tempDiv
//             );

//             const canvas = await html2canvas(tempDiv, {
//               scale: 4,
//               useCORS: true,
//             });
//             const imgData = canvas.toDataURL("image/jpeg", 0.98);
//             const imgWidth = doc.internal.pageSize.getWidth() - 10;
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
//             doc.addImage(imgData, "JPEG", 5, 5, imgWidth, imgHeight);
//             document.body.removeChild(tempDiv);
//           }
//           currentIndex++;
//         }
//       }
//     }

//     if (validSheets === 0)
//       throw new Error("No valid student or subject data to generate PDF");

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

//     return { validStudents: validSheets, filename, pdfBlob, recordId };
//   };

//   // Handle Save & PDF Generation
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
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Authentication token is missing");

//       localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
//       window.dispatchEvent(new Event("storage"));

//       // Fetch student data
//       const response = await axios.post(
//         `${API_BASE_URL}/api/get/student/filter`,
//         {
//           schoolName: selectedSchool,
//           classList: selectedClassIds,
//           subjectList: selectedSubjectIds,
//           level: selectedLevel,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!response.data.students?.length)
//         throw new Error("No student data received");

//       const studentIds = response.data.students
//         .filter((student) => student.id && !isNaN(student.id))
//         .map((student) => Number(student.id));

//       if (!studentIds.length) throw new Error("No valid student IDs found");

//       // Prepare payload
//       const payload = {
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
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
//         class_count: JSON.stringify(classWiseCounts),
//       };

//       if (
//         !selectedCountry ||
//         !selectedState ||
//         !selectedDistrict ||
//         !selectedCity ||
//         !selectedLevel ||
//         !selectedModel ||
//         !omrSet
//       ) {
//         throw new Error(
//           "Missing required fields (location, level, mode, or OMR set)"
//         );
//       }

//       // Save OMR data
//       const formData = new FormData();
//       formData.append("data", JSON.stringify([payload]));
//       const saveResponse = await axios.post(
//         `${API_BASE_URL}/api/omr/generator`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!saveResponse.data.insertedIds?.length)
//         throw new Error("Failed to save OMR data to server");
//       const recordId = saveResponse.data.insertedIds[0];

//       Swal.fire({
//         icon: "success",
//         title: "Data Saved!",
//         text: "OMR data saved successfully. please wait for download pdf!",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "OK",
//         timer: 5000,
//         timerProgressBar: false,
//       }).then(() => navigate("/omr-create"));

//       // Generate PDF in background
//       try {
//         const { validStudents, filename, pdfBlob } = await generatePDF(
//           response.data.students,
//           recordId
//         );
//         const updateFormData = new FormData();
//         updateFormData.append("pdf", pdfBlob, filename);

//         const updateResponse = await axios.put(
//           `${API_BASE_URL}/api/omr/omr/filename/${recordId}`,
//           updateFormData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (updateResponse.status !== 200 || !updateResponse.data.message)
//           throw new Error(
//             updateResponse.data.error ||
//               "Failed to update OMR data with PDF on server"
//           );

//         Swal.fire({
//           icon: "success",
//           title: "PDF Generated!",
//           text: `${validStudents} OMR sheets generated successfully.`,
//           confirmButtonColor: "#3085d6",
//           confirmButtonText: "OK",
//           timer: 4000,
//           timerProgressBar: true,
//         }).then(() => {
//           window.location.reload();
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

//   // Dropdown options
//   const dropdownOptions = useMemo(
//     () => ({
//       countries: countries.map((c) => ({ value: c.id, label: c.name })),
//       states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
//       districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
//       cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
//       schools: schools.map((s) => ({
//         value: s.school_name,
//         label: s.school_name,
//       })),
//       classes: classes.map((c) => ({ value: c.id, label: c.name })),
//       subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
//       levels: [
//         { value: "level_1", label: "Level 1" },
//         { value: "level_2", label: "Level 2" },
//         { value: "level_3", label: "Level 3" },
//         { value: "level_4", label: "Level 4" },
//       ],
//       modes: [
//         { value: "Online", label: "Online" },
//         { value: "Offline", label: "Offline" },
//       ],
//       omrSets: [
//         { value: "A", label: "Set A" },
//         { value: "B", label: "Set B" },
//         { value: "C", label: "Set C" },
//         { value: "D", label: "Set D" },
//         { value: "E", label: "Set E" },
//         { value: "F", label: "Set F" },
//         { value: "G", label: "Set G" },
//         { value: "H", label: "Set H" },
//       ],
//     }),
//     [
//       countries,
//       filteredStates,
//       filteredDistricts,
//       filteredCities,
//       schools,
//       classes,
//       subjects,
//     ]
//   );

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
//             </Box>
//           </form>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default ExaminationForm;


import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const [selectedLevel, setSelectedLevel] = useState("level_1"); // default
  const [selectedModel, setSelectedModel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [omrSet, setOmrSet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
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
  const navigate = useNavigate();

  // Fetch initial data and set India as default country
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // Fetch all required data in parallel
        const [
          countriesRes,
          statesRes,
          districtsRes,
          citiesRes,
          centersRes,
          classesRes,
          subjectsRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
          axios.get(`${API_BASE_URL}/api/center/get-all`),
          axios.get(`${API_BASE_URL}/api/class`),
          axios.get(`${API_BASE_URL}/api/subject`),
        ]);

        if (isMounted) {
          const countriesData = Array.isArray(countriesRes.data)
            ? countriesRes.data
            : [];
          setCountries(countriesData);
          setStates(Array.isArray(statesRes.data) ? statesRes.data : []);
          setDistricts(
            Array.isArray(districtsRes.data) ? districtsRes.data : []
          );
          setCities(Array.isArray(citiesRes.data) ? citiesRes.data : []);
          // Log centers response for debugging
          console.log("Centers API Response:", centersRes.data);
          setCenters(
            Array.isArray(centersRes.data)
              ? centersRes.data
                  .filter((center) => center.id && center.center_name)
                  .map((center) => ({
                    id: center.id,
                    center_name: center.center_name,
                  }))
              : []
          );
          setClasses(
            Array.isArray(classesRes.data)
              ? classesRes.data.map((cls) => ({ id: cls.id, name: cls.name }))
              : []
          );
          setSubjects(
            Array.isArray(subjectsRes.data)
              ? subjectsRes.data.map((sub) => ({ id: sub.id, name: sub.name }))
              : []
          );

          // Set India as default country
          const india = countriesData.find(
            (c) => c.name?.toLowerCase().trim() === "india"
          );
          if (india) {
            setSelectedCountry(india.id);
          }

          // Check if centers are empty and set error
          if (!centersRes.data || centersRes.data.length === 0) {
            setFetchError("No centers available. Please contact support.");
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setFetchError("Failed to load initial data. Please try again.");
        setCountries([]);
        setStates([]);
        setDistricts([]);
        setCities([]);
        setCenters([]);
        setClasses([]);
        setSubjects([]);
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
    setSelectedCenter("");
    setExamDate(null);
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedCenter("");
    setExamDate(null);
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedCenter("");
    setExamDate(null);
  }, [selectedDistrict, cities]);

  // Fetch schools
  const fetchSchoolsByLocation = useCallback(async (filters) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/get/filter`, {
        params: filters,
      });
      if (response.data.success) {
        const schoolList = response.data.data
          .flatMap((location) =>
            location.schools
              .filter((school) => school && typeof school === "string")
              .map((school) => ({
                school_name: school,
                country_id: location.country,
                state_id: location.state,
                district_id: location.district,
                city_id: location.city,
              }))
          )
          .filter((school) => school.school_name);
        setSchools(schoolList);
        setFetchError(null);
      } else {
        setSchools([]);
        setFetchError("No schools found for the selected location.");
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
      setExamDate(null);
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
          level: selectedLevel,
        }
      );

      const students = response.data.students || [];
      const classCounts = {};

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
      setExamDate(response.data.exam_date || null);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching student count:", error);
      setFetchError("Failed to fetch student count");
      setTotalCount(0);
      setClassWiseCounts({});
      setExamDate(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedSchool,
    selectedClassIds,
    selectedSubjectIds,
    selectedLevel,
    classes,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchStudentCount, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchStudentCount]);

  // PDF generation
  const getOMRSheetComponent = (className) => {
    const lowerClasses = ["01", "02", "03", "1", "2", "3"];
    const classNumber = className ? className.replace(/\D/g, "") : "";
    return lowerClasses.includes(classNumber) ? OMRSheet50 : OMRSheet60;
  };

  const generatePDF = async (students, recordId) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    let validSheets = 0;
    const batchSize = 10;
    let currentSheetIndex = 0;

    const studentsById = students.reduce((acc, student) => {
      if (
        !student.id ||
        !student.student_name ||
        !student.roll_no ||
        !student.class_name ||
        !student.subject_name
      )
        return acc;

      if (!acc[student.id]) {
        acc[student.id] = {
          id: student.id,
          student_name: student.student_name,
          roll_no: student.roll_no,
          class_name: student.class_name,
          school_id: student.school_id,
          subjects: [],
        };
      }
      acc[student.id].subjects.push(student.subject_name);
      return acc;
    }, {});

    const studentList = Object.values(studentsById);
    const totalSheets = studentList.reduce(
      (sum, student) => sum + student.subjects.length,
      0
    );
    const totalBatches = Math.ceil(totalSheets / batchSize);

    for (
      let batchStart = 0;
      batchStart < totalSheets;
      batchStart += batchSize
    ) {
      const batchEnd = Math.min(batchStart + batchSize, totalSheets);
      currentSheetIndex += batchSize;

      const progress = Math.min(
        (currentSheetIndex / totalBatches) * 80 + 10,
        90
      );
      localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
      window.dispatchEvent(new Event("storage"));

      let currentIndex = 0;
      for (const student of studentList) {
        for (const subjectName of student.subjects) {
          if (currentIndex >= batchStart && currentIndex < batchEnd) {
            validSheets++;
            if (validSheets > 1) doc.addPage();

            const OMRComponent = getOMRSheetComponent(student.class_name);
            const tempDiv = document.createElement("div");
            tempDiv.style.width = "210mm";
            tempDiv.style.height = "297mm";
            tempDiv.style.backgroundColor = "white";
            document.body.appendChild(tempDiv);

            const subjectId =
              subjects.find((s) => s.name === subjectName)?.id || subjectName;

            const getLevelNumber = (levelString) => {
              switch (levelString) {
                case "level_1":
                  return 1;
                case "level_2":
                  return 2;
                case "level_3":
                  return 3;
                case "level_4":
                  return 4;
                default:
                  return null;
              }
            };

            ReactDOM.render(
              <OMRComponent
                schoolName={selectedSchool}
                student={student.student_name}
                studentId={student.id}
                level={getLevelNumber(selectedLevel)}
                subject={subjectName}
                subjectIds={subjectId}
                className={student.class_name}
                classId={
                  classes.find((c) => c.name === student.class_name)?.id ||
                  student.class_name
                }
                rollNumber={student.roll_no}
                omrSet={omrSet}
                examDate={examDate || "Not Available"}
                centerName={
                  centers.find((c) => c.id === selectedCenter)?.center_name ||
                  "Not Available"
                }
              />,
              tempDiv
            );

            const canvas = await html2canvas(tempDiv, {
              scale: 4,
              useCORS: true,
            });
            const imgData = canvas.toDataURL("image/jpeg", 0.98);
            const imgWidth = doc.internal.pageSize.getWidth() - 10;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            doc.addImage(imgData, "JPEG", 5, 5, imgWidth, imgHeight);
            document.body.removeChild(tempDiv);
          }
          currentIndex++;
        }
      }
    }

    if (validSheets === 0)
      throw new Error("No valid student or subject data to generate PDF");

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

    return { validStudents: validSheets, filename, pdfBlob, recordId };
  };

  // Handle Save & PDF Generation
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

    // Validate all required fields
    if (
      !selectedCountry ||
      !selectedState ||
      !selectedDistrict ||
      !selectedCity ||
      !selectedSchool ||
      !selectedLevel ||
      !selectedModel ||
      !omrSet ||
      !selectedCenter
    ) {
      const missingFields = [];
      if (!selectedCountry) missingFields.push("Country");
      if (!selectedState) missingFields.push("State");
      if (!selectedDistrict) missingFields.push("District");
      if (!selectedCity) missingFields.push("City");
      if (!selectedSchool) missingFields.push("School");
      if (!selectedLevel) missingFields.push("Level");
      if (!selectedModel) missingFields.push("Mode");
      if (!omrSet) missingFields.push("OMR Set");
      if (!selectedCenter) missingFields.push("Center");

      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: `Please select the following: ${missingFields.join(", ")}`,
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
      window.dispatchEvent(new Event("storage"));

      // Fetch student data
      const response = await axios.post(
        `${API_BASE_URL}/api/get/student/filter`,
        {
          schoolName: selectedSchool,
          classList: selectedClassIds,
          subjectList: selectedSubjectIds,
          level: selectedLevel,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.students?.length)
        throw new Error("No student data received");

      const studentIds = response.data.students
        .filter((student) => student.id && !isNaN(student.id))
        .map((student) => Number(student.id));

      if (!studentIds.length) throw new Error("No valid student IDs found");

      // Prepare payload
      const payload = {
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
        city: selectedCity,
        school: selectedSchool,
        center_id: selectedCenter, // Ensure center_id is included
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

      // Log payload for debugging
      console.log("Payload sent to /api/omr/generator:", payload);

      // Save OMR data
      const formData = new FormData();
      formData.append("data", JSON.stringify([payload]));
      const saveResponse = await axios.post(
        `${API_BASE_URL}/api/omr/generator`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!saveResponse.data.insertedIds?.length)
        throw new Error("Failed to save OMR data to server");
      const recordId = saveResponse.data.insertedIds[0];

      Swal.fire({
        icon: "success",
        title: "Data Saved!",
        text: "OMR data saved successfully. Please wait for PDF download!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        timer: 5000,
        timerProgressBar: false,
      }).then(() => navigate("/omr-create"));

      // Generate PDF in background
      try {
        const { validStudents, filename, pdfBlob } = await generatePDF(
          response.data.students,
          recordId
        );
        const updateFormData = new FormData();
        updateFormData.append("pdf", pdfBlob, filename);

        const updateResponse = await axios.put(
          `${API_BASE_URL}/api/omr/omr/filename/${recordId}`,
          updateFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateResponse.status !== 200 || !updateResponse.data.message)
          throw new Error(
            updateResponse.data.error ||
              "Failed to update OMR data with PDF on server"
          );

        Swal.fire({
          icon: "success",
          title: "PDF Generated!",
          text: `${validStudents} OMR sheets generated successfully.`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          timer: 4000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
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
        text:
          error.response?.data?.error ||
          error.message ||
          "Failed to save OMR data",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } finally {
      setIsGenerating(false);
      localStorage.setItem("pdfProgress", JSON.stringify({ progress: 0 }));
      window.dispatchEvent(new Event("storage"));
    }
  };

  // Dropdown options
  const dropdownOptions = useMemo(
    () => ({
      countries: countries.map((c) => ({ value: c.id, label: c.name })),
      states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
      districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
      cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
      centers: centers.map((c) => ({ value: c.id, label: c.center_name })),
      schools: schools.map((s) => ({
        value: s.school_name,
        label: s.school_name,
      })),
      classes: classes.map((c) => ({ value: c.id, label: c.name })),
      subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
      levels: [
        { value: "level_1", label: "Level 1" },
        { value: "level_2", label: "Level 2" },
        { value: "level_3", label: "Level 3" },
        { value: "level_4", label: "Level 4" },
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
    }),
    [
      countries,
      filteredStates,
      filteredDistricts,
      filteredCities,
      centers,
      schools,
      classes,
      subjects,
    ]
  );

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
                  label="Center"
                  value={selectedCenter}
                  options={dropdownOptions.centers}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  disabled={isLoading || !centers.length}
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
                    !selectedCenter ||
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
