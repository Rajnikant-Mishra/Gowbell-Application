// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { debounce } from "lodash";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Container,
//   Paper,
//   Typography,
//   Grid,
//   MenuItem,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Select,
//   InputLabel,
//   FormControl,
//   CircularProgress,
//   Checkbox,
//   Modal,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import html2canvas from "html2canvas";
// import MedalsWinnersList from "../../Exam/Result/MedalwinnerList";
// import { createRoot } from "react-dom/client";

// // Reusable Dropdown Component
// const Dropdown = ({ label, value, options, onChange, disabled, multiple }) => (
//   <FormControl fullWidth margin="normal" size="small" disabled={disabled}>
//     <InputLabel>{label}</InputLabel>
//     <Select
//       label={label}
//       value={value}
//       onChange={onChange}
//       multiple={multiple}
//       aria-label={label}
//       renderValue={(selected) =>
//         multiple
//           ? options
//               .filter((opt) => selected.includes(opt.value))
//               .map((opt) => opt.label)
//               .join(", ")
//           : options.find((opt) => opt.value === selected)?.label || ""
//       }
//     >
//       {options.map((option) => (
//         <MenuItem key={option.value} value={option.value}>
//           {option.label}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// );

// const OmrForm = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [schoolAddress, setSchoolAddress] = useState("");
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
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [medal, setMedal] = useState("");
//   const navigate = useNavigate();

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

//   // Fetch classes
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(
//           Array.isArray(response.data)
//             ? response.data.map((cls) => ({ value: cls.id, label: cls.name }))
//             : []
//         );
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//         setClasses([]);
//         toast.error("Failed to fetch classes.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch subjects
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(
//           Array.isArray(response.data)
//             ? response.data.map((sub) => ({ value: sub.id, label: sub.name }))
//             : []
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setSubjects([]);
//         toast.error("Failed to fetch subjects.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch schools by location
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/get/school-filter`,
//         { params: filters }
//       );
//       if (response.data.success) {
//         const schoolList =
//           response.data.data?.flatMap((location) =>
//             location.schools?.map((school) => ({
//               id: school.id,
//               school_name: school.name,
//               country_name: location.country,
//               state_name: location.state,
//               district_name: location.district,
//               city_name: location.city,
//             }))
//           ) || [];
//         setSchools(schoolList);
//         if (schoolList.length === 0) {
//           toast.warn("No schools found for the selected location.");
//         }
//       } else {
//         setSchools([]);
//         toast.error(response.data.message || "No schools found.");
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setSchools([]);
//       toast.error(error.response?.data?.message || "Failed to fetch schools.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch students
//   const fetchStudents = useCallback(
//     async (updatePending = false) => {
//       const session_id = localStorage.getItem("currentSessionId");

//       if (!session_id) {
//         toast.error("No session selected.");
//         setStudents([]);
//         setTotalCount(0);
//         return;
//       }

//       if (
//         !selectedSchool ||
//         !selectedClassIds.length ||
//         !selectedSubjectIds.length
//       ) {
//         setStudents([]);
//         setTotalCount(0);
//         return;
//       }

//       try {
//         setIsLoading(true);

//         const classIds = selectedClassIds.map(Number);
//         const subjectIds = selectedSubjectIds.map(Number);

//         const studentResponse = await axios.post(
//           `${API_BASE_URL}/api/getFilteredStudentreceipt`,
//           {
//             schoolId: selectedSchool,
//             classIds,
//             subjectIds,
//             session_id,
//             updatePending,
//           }
//         );

//         const fetchedStudents = Array.isArray(studentResponse.data.students)
//           ? studentResponse.data.students
//           : [];

//         const updatedStudents = fetchedStudents.map((student) => ({
//           ...student,
//           id: student.id || "N/A",
//           student_subject: Array.isArray(student.student_subject)
//             ? student.student_subject
//             : [student.subject_name] || ["N/A"],
//           percentage: parseFloat(student.percentage) || 0,
//           ranking: student.ranking || "N/A",
//           medals: student.medals || "N/A",
//           certificate: student.certificate || "N/A",
//           remarks: student.remarks || "",
//           level_1: student.level_1 || "N/A",
//           level_2: student.level_2 || "N/A",
//           status: student.status || "N/A",
//         }));

//         setStudents(updatedStudents);
//         setTotalCount(
//           studentResponse.data.totalCount || updatedStudents.length
//         );
//         toast.success(
//           updatePending
//             ? "Results evaluated & levels updated"
//             : "Students fetched successfully"
//         );
//       } catch (err) {
//         const msg =
//           err.response?.data?.error ||
//           err.message ||
//           "Failed to fetch students";
//         toast.error(msg);
//         setStudents([]);
//         setTotalCount(0);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [selectedSchool, selectedClassIds, selectedSubjectIds]
//   );

//   // Do NOT auto-check any student
//   useEffect(() => {
//     // Selection starts empty — user must manually check
//     setSelectedStudents([]);
//   }, [students]);

//   // Reset selection when filters change
//   useEffect(() => {
//     setSelectedStudents([]);
//   }, [selectedSchool, selectedClassIds, selectedSubjectIds]);

//   // Debounced fetch
//   const debouncedFetchStudents = useCallback(debounce(fetchStudents, 500), [
//     fetchStudents,
//   ]);

//   useEffect(() => {
//     debouncedFetchStudents();
//     return () => debouncedFetchStudents.cancel();
//   }, [debouncedFetchStudents]);

//   // Location cascading
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
//     setStudents([]);
//   }, [selectedCity]);

//   const countryOptions = countries.map((c) => ({
//     value: c.id,
//     label: c.name,
//   }));
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

//   const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
//   const handleClassChange = (e) => setSelectedClassIds(e.target.value);
//   const handleSubjectChange = (e) => setSelectedSubjectIds(e.target.value);

//   const handleGenerateRank = async () => {
//     if (
//       !selectedSchool ||
//       !selectedClassIds.length ||
//       !selectedSubjectIds.length
//     ) {
//       toast.error("Select school, classes, and subjects.");
//       return;
//     }
//     await fetchStudents(true);
//   };

//   const handleAssign = async () => {
//     if (!medal) {
//       toast.error("Please select a medal.");
//       return;
//     }
//     if (selectedStudents.length === 0) {
//       toast.error("No students selected.");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const medalValue = medal === "N/A" ? "" : medal;

//       const updatePromises = selectedStudents.map((studentId) =>
//         axios.put(`${API_BASE_URL}/api/update-medal-wildcard`, {
//           id: studentId,
//           medals: medalValue,
//         })
//       );

//       const responses = await Promise.all(updatePromises);
//       const allSuccessful = responses.every(
//         (res) => res.status === 200 && res.data.message
//       );

//       if (allSuccessful) {
//         setStudents((prev) =>
//           prev.map((student) => {
//             if (selectedStudents.includes(student.id)) {
//               const updated = { ...student, medals: medal };
//               if (["Gold", "Silver", "Bronze"].includes(medal)) {
//                 updated.level_1 = "continue";
//                 updated.level_2 = "ongoing";
//               } else if (medal === "N/A" && student.percentage < 60) {
//                 updated.level_1 = "completed";
//                 updated.level_2 = "N/A";
//               }
//               return updated;
//             }
//             return student;
//           })
//         );
//         toast.success("Medals updated successfully!");
//       } else {
//         throw new Error("Some updates failed.");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update medals.");
//     } finally {
//       setIsLoading(false);
//       setOpen(false);
//       setSelectedStudents([]);
//       setMedal("");
//     }
//   };

//   const handleDownloadPDF = async () => {
//     const session_id = localStorage.getItem("currentSessionId");
//     if (!session_id) {
//       toast.error("No session selected.");
//       return;
//     }
//     if (
//       !selectedSchool ||
//       !selectedClassIds.length ||
//       !selectedSubjectIds.length ||
//       students.length === 0
//     ) {
//       toast.error("Select school, classes, subjects, and have data.");
//       return;
//     }

//     const classSubjectPercentages = selectedClassIds.reduce((acc, classId) => {
//       const className =
//         classes.find((cls) => cls.value === classId)?.label || classId;
//       acc[className] = selectedSubjectIds.reduce((subAcc, subjectId) => {
//         const subjectName =
//           subjects.find((sub) => sub.value === subjectId)?.label || "N/A";
//         subAcc[subjectName] = students
//           .filter(
//             (s) =>
//               s.class_name === className &&
//               s.student_subject.includes(subjectName)
//           )
//           .map((s) => {
//             const p = parseFloat(s.percentage);
//             return !isNaN(p) && p >= 60 ? p : 0;
//           })
//           .filter((p) => p !== 0);
//         return subAcc;
//       }, {});
//       return acc;
//     }, {});

//     const classCutoff = selectedClassIds.flatMap((classId) => {
//       const className =
//         classes.find((cls) => cls.value === classId)?.label || classId;
//       return selectedSubjectIds.map((subjectId) => {
//         const subjectName =
//           subjects.find((sub) => sub.value === subjectId)?.label || "N/A";
//         const percentages =
//           classSubjectPercentages[className][subjectName] || [];
//         const sorted = [...new Set(percentages)].sort((a, b) => b - a);
//         return {
//           class: className,
//           subjects: subjectName,
//           gold: sorted[0] !== undefined ? sorted[0].toFixed(2) + "%" : "N/A",
//           silver: sorted[1] !== undefined ? sorted[1].toFixed(2) + "%" : "N/A",
//           bronze: sorted[2] !== undefined ? sorted[2].toFixed(2) + "%" : "N/A",
//         };
//       });
//     });

//     const winnersList = students
//       .filter((s) =>
//         selectedClassIds.includes(
//           classes.find((cls) => cls.label === s.class_name)?.value
//         )
//       )
//       .map((s, i) => ({
//         slNo: i + 1,
//         school: s.school_id,
//         name: s.student_name || "N/A",
//         rollNo: s.roll_no || "N/A",
//         class: s.class_name || "N/A",
//         subject: s.student_subject?.join(", ") || "N/A",
//         fullMarks: s.full_mark || "N/A",
//         securedMarks: s.mark_secured || "N/A",
//         percentage: s.percentage || "N/A",
//         ranking: s.ranking || "N/A",
//         medal: s.medals || "N/A",
//         certificate: s.certificate || "N/A",
//         remarks: s.remarks || "",
//       }));

//     const getLocationName = (id, arr) =>
//       arr.find((item) => item.id === id)?.name || "N/A";

//     const countryName = getLocationName(selectedCountry, countries);
//     const stateName = getLocationName(selectedState, states);
//     const districtName = getLocationName(selectedDistrict, districts);
//     const cityName = getLocationName(selectedCity, cities);
//     const subjectNames = selectedSubjectIds.map(
//       (id) => subjects.find((s) => s.value === id)?.label || "N/A"
//     );

//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const imgWidth = pageWidth - 20;

//     for (let i = 0; i < subjectNames.length; i++) {
//       const subjectName = subjectNames[i];
//       const container = document.createElement("div");
//       container.style.position = "absolute";
//       container.style.left = "-9999px";
//       document.body.appendChild(container);

//       const root = createRoot(container);
//       root.render(
//         <MedalsWinnersList
//           winnersList={winnersList}
//           classCutoff={classCutoff.filter((c) => c.subjects === subjectName)}
//           schoolName={
//             schools.find((s) => s.id === selectedSchool)?.school_name || "N/A"
//           }
//           schoolAddress={schoolAddress}
//           classId={selectedClassIds.join(",")}
//           subjectIds={selectedSubjectIds}
//           subjectNames={[subjectName]}
//           country={countryName}
//           state={stateName}
//           district={districtName}
//           city={cityName}
//           singleSubject={subjectName}
//         />
//       );

//       await new Promise((r) => setTimeout(r, 500));
//       const canvas = await html2canvas(container, { scale: 2 });
//       const imgData = canvas.toDataURL("image/jpeg", 0.98);
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       if (i > 0) doc.addPage();
//       let heightLeft = imgHeight;
//       let position = 10;
//       doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//       heightLeft -= doc.internal.pageSize.getHeight() - 20;
//       while (heightLeft > 0) {
//         doc.addPage();
//         position = heightLeft - imgHeight;
//         doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//         heightLeft -= doc.internal.pageSize.getHeight();
//       }

//       doc.setFontSize(10);
//       doc.text(
//         `Generated on: ${new Date().toLocaleDateString()}`,
//         14,
//         doc.internal.pageSize.getHeight() - 10
//       );

//       document.body.removeChild(container);
//       root.unmount();
//     }

//     doc.save(
//       `Result_${
//         schools.find((s) => s.id === selectedSchool)?.school_name || "School"
//       }_Classes${selectedClassIds.join("_")}_Subjects${subjectNames.join(
//         "_"
//       )}.pdf`
//     );
//   };

//   const handlePreviousPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () =>
//     page < Math.ceil(totalCount / pageSize) && setPage(page + 1);

//   const getStatusStyle = (status) => ({
//     color: status?.toLowerCase() === "success" ? "green" : "red",
//     fontWeight: "bold",
//   });

//   const filteredStudents = students.filter((s) =>
//     selectedClassIds.includes(
//       classes.find((c) => c.label === s.class_name)?.value
//     )
//   );

//   const paginatedStudents = filteredStudents.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   return (
//     <Mainlayout>
//       <ToastContainer />
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "Process Result", link: "" }]} />
//       </div>
//       <Container component="main" maxWidth="xl">
//         <Paper
//           className={`${styles.main}`}
//           elevation={3}
//           sx={{ padding: 3, marginTop: 2, borderRadius: 2 }}
//         >
//           <Typography
//             className={`${styles.formTitle}`}
//             variant="h5"
//             sx={{ mb: 4 }}
//           >
//             Process Result
//           </Typography>
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={countryOptions}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={stateOptions}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry || isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={districtOptions}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState || isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={cityOptions}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict || isLoading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchool}
//                   options={schools.map((s) => ({
//                     value: s.id,
//                     label: s.school_name,
//                   }))}
//                   onChange={handleSchoolChange}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Classes"
//                   value={selectedClassIds}
//                   options={classes}
//                   onChange={handleClassChange}
//                   disabled={isLoading || !selectedSchool}
//                   multiple
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Subjects"
//                   value={selectedSubjectIds}
//                   options={subjects}
//                   onChange={handleSubjectChange}
//                   disabled={isLoading || !selectedSchool}
//                   multiple
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           <Box mt={4}>
//             <Box
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               mb={3}
//             >
//               <Typography variant="h6">Student Results</Typography>
//               <Box>
//                 <Button
//                   variant="contained"
//                   onClick={() => setOpen(true)}
//                   disabled={selectedStudents.length === 0 || isLoading}
//                   sx={{
//                     backgroundColor:
//                       selectedStudents.length === 0 || isLoading
//                         ? "#b0bec5"
//                         : "#1230AE",
//                     color: "#fff",
//                     "&:hover": {
//                       backgroundColor:
//                         selectedStudents.length === 0 || isLoading
//                           ? "#b0bec5"
//                           : "#0e2587",
//                     },
//                     mr: 2,
//                   }}
//                 >
//                   {isLoading
//                     ? "Processing..."
//                     : `Assign Medal (${selectedStudents.length})`}
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleGenerateRank}
//                   disabled={isLoading}
//                   sx={{
//                     backgroundColor: isLoading ? "#b0bec5" : "#1230AE",
//                     color: "#fff",
//                     "&:hover": {
//                       backgroundColor: isLoading ? "#b0bec5" : "#0e2587",
//                     },
//                     mr: 2,
//                   }}
//                 >
//                   {isLoading ? "Evaluating..." : "Evaluate Result"}
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleDownloadPDF}
//                   disabled={isLoading || filteredStudents.length === 0}
//                   sx={{
//                     backgroundColor:
//                       isLoading || filteredStudents.length === 0
//                         ? "#b0bec5"
//                         : "#1230AE",
//                     color: "#fff",
//                     "&:hover": {
//                       backgroundColor:
//                         isLoading || filteredStudents.length === 0
//                           ? "#b0bec5"
//                           : "#0e2587",
//                     },
//                   }}
//                 >
//                   {isLoading ? "Generating..." : "Download PDF"}
//                 </Button>
//               </Box>
//             </Box>

//             <Table
//               sx={{
//                 border: "none",
//                 "& .MuiTableCell-root": {
//                   borderBottom: "1px solid rgba(224, 224, 224, 1)",
//                   borderRight: "1px solid rgba(224, 224, 224, 1)",
//                 },
//                 "& .MuiTableCell-root:last-child": { borderRight: "none" },
//                 "& .MuiTableRow-root:last-child .MuiTableCell-root": {
//                   borderBottom: "none",
//                 },
//               }}
//             >
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#75bbeeff" }}>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Select
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Student
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Class
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Subject
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Roll No
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Full Mark
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Mark Secured
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Percentage
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Ranking
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Medal
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Certificate
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Level
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Remark
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ color: "#000", fontWeight: "bold" }}
//                   >
//                     Status
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={14} align="center">
//                       <CircularProgress sx={{ color: "#1230AE" }} />
//                     </TableCell>
//                   </TableRow>
//                 ) : paginatedStudents.length > 0 ? (
//                   paginatedStudents.map((student) => {
//                     const hasMedal =
//                       student.medals &&
//                       student.medals !== "N/A" &&
//                       student.medals !== "";
//                     return (
//                       <TableRow key={student.id}>
//                         <TableCell align="center">
//                           <Checkbox
//                             color="primary"
//                             checked={selectedStudents.includes(student.id)}
//                             disabled={hasMedal}
//                             onChange={() => {
//                               if (hasMedal) return;
//                               setSelectedStudents((prev) =>
//                                 prev.includes(student.id)
//                                   ? prev.filter((id) => id !== student.id)
//                                   : [...prev, student.id]
//                               );
//                             }}
//                             sx={{
//                               color: "#1230AE",
//                               "&.Mui-checked": { color: "#1230AE" },
//                               "&.Mui-disabled": { opacity: 0.5 },
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.student_name || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.class_name || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {Array.isArray(student.student_subject)
//                             ? student.student_subject
//                                 .map(
//                                   (s) => s.charAt(0).toUpperCase() + s.slice(1)
//                                 )
//                                 .join(", ")
//                             : "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.roll_no || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.full_mark || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.mark_secured || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.percentage || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.ranking || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {hasMedal ? (
//                             <Box
//                               sx={{
//                                 bgcolor:
//                                   student.medals === "Gold"
//                                     ? "#FFD700"
//                                     : student.medals === "Silver"
//                                     ? "#C0C0C0"
//                                     : "#CD7F32",
//                                 color: "black", // ✅ text color changed to black
//                                 borderRadius: 1,
//                                 px: 1,
//                                 py: 0.5,
//                                 fontSize: "0.75rem",
//                                 display: "inline-block",
//                                 fontWeight: "bold",
//                               }}
//                             >
//                               {student.medals}
//                             </Box>
//                           ) : (
//                             "N/A"
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.certificate || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.level || "N/A"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {student.remarks || "N/A"}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           style={getStatusStyle(student.status)}
//                         >
//                           {student.status || "N/A"}
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={14} align="center">
//                       <Typography variant="body2" color="textSecondary">
//                         {selectedSchool &&
//                         selectedClassIds.length &&
//                         selectedSubjectIds.length
//                           ? "No students found"
//                           : "Please select school, classes, and subjects"}
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>

//             {filteredStudents.length > 0 && (
//               <Box mt={2}>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   flexWrap="wrap"
//                 >
//                   <Box display="flex" alignItems="center">
//                     <select
//                       value={pageSize}
//                       onChange={(e) => {
//                         setPageSize(parseInt(e.target.value));
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
//                     <Typography
//                       sx={{ ml: 1 }}
//                       variant="body2"
//                       color="textSecondary"
//                     >
//                       Records per page
//                     </Typography>
//                   </Box>

//                   <Typography variant="body2" color="textSecondary">
//                     Showing {filteredStudents.length} of {totalCount} records
//                     (Page {page} of {Math.ceil(totalCount / pageSize)})
//                   </Typography>

//                   <Box display="flex" alignItems="center">
//                     <Button
//                       onClick={handlePreviousPage}
//                       disabled={page === 1}
//                       className={styles.paginationButton}
//                     >
//                       <UilAngleLeftB />
//                     </Button>
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
//                       .map((pg, idx, arr) => (
//                         <React.Fragment key={pg}>
//                           {idx > 0 && pg > arr[idx - 1] + 1 && (
//                             <span className={styles.ellipsis}>...</span>
//                           )}
//                           <Button
//                             onClick={() => setPage(pg)}
//                             className={`${styles.paginationButton} ${
//                               page === pg ? styles.activePage : ""
//                             }`}
//                           >
//                             {pg}
//                           </Button>
//                         </React.Fragment>
//                       ))}
//                     <Button
//                       onClick={handleNextPage}
//                       disabled={page === Math.ceil(totalCount / pageSize)}
//                       className={styles.paginationButton}
//                     >
//                       <UilAngleRightB />
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>
//             )}
//           </Box>
//         </Paper>
//       </Container>

//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="h6" component="h2" gutterBottom>
//             Assign Medal to Selected Students
//           </Typography>
//           <Dropdown
//             label="Medal"
//             value={medal}
//             options={[
//               { value: "Silver", label: "Silver" },
//               { value: "Gold", label: "Gold" },
//               { value: "Bronze", label: "Bronze" },
//               { value: "N/A", label: "None" },
//             ]}
//             onChange={(e) => setMedal(e.target.value)}
//           />
//           <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button
//               variant="contained"
//               onClick={handleAssign}
//               disabled={!medal || isLoading}
//               sx={{
//                 backgroundColor: "#1230AE",
//                 "&:hover": { backgroundColor: "#0e2587" },
//               }}
//             >
//               {isLoading ? "Assigning..." : "Assign"}
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Mainlayout>
//   );
// };

// export default OmrForm;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Paper,
  Typography,
  Grid,
  MenuItem,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Checkbox,
  Modal,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import MedalsWinnersList from "../../Exam/Result/MedalwinnerList";
import { createRoot } from "react-dom/client";

// Reusable Dropdown
const Dropdown = ({
  label,
  value,
  options,
  onChange,
  disabled,
  multiple,
  isSelected,
}) => (
  <FormControl fullWidth margin="normal" size="small" disabled={disabled}>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      value={value}
      onChange={onChange}
      multiple={multiple}
      sx={{
        "& .MuiSelect-select": {
          backgroundColor: isSelected ? "#e3f2fd" : "inherit",
          fontWeight: isSelected ? 600 : 400,
        },
      }}
      renderValue={(selected) =>
        multiple
          ? options
              .filter((opt) => selected.includes(opt.value))
              .map((opt) => opt.label)
              .join(", ")
          : options.find((opt) => opt.value === selected)?.label || ""
      }
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const OmrForm = () => {
  // === State ===
  const [schools, setSchools] = useState([]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const pageSizes = [5, 10, 25, 50];
  const [totalCount, setTotalCount] = useState(0);

  // Location
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Medal
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [medal, setMedal] = useState("");

  const navigate = useNavigate();

  // Level Options
  const levelOptions = [
    { value: "Level 1", label: "Level 1" },
    { value: "Level 2", label: "Level 2" },
    { value: "Level 3", label: "Level 3" },
    { value: "Level 4", label: "Level 4" },
  ];

  // === Fetch Location ===
  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, s, d, ci] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);
        setCountries(c.data || []);
        setStates(s.data || []);
        setDistricts(d.data || []);
        setCities(ci.data || []);

        const india = c.data.find((x) => x.name?.toLowerCase() === "india");
        if (india) setSelectedCountry(india.id);
      } catch (err) {
        toast.error("Failed to load locations.");
      }
    };
    fetch();
  }, []);

  // === Fetch Classes & Subjects ===
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/class`);
        setClasses((data || []).map((c) => ({ value: c.id, label: c.name })));
      } catch {
        toast.error("Failed to load classes.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/subject`);
        setSubjects((data || []).map((s) => ({ value: s.id, label: s.name })));
      } catch {
        toast.error("Failed to load subjects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
    fetchSubjects();
  }, []);

  // === Fetch Schools ===
  const fetchSchools = useCallback(async (filters) => {
    setSchoolLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        { params: filters }
      );
      if (data.success) {
        const flat = data.data.flatMap((loc) =>
          (loc.schools || []).map((s) => ({
            id: s.id,
            name: s.name,
            school_code: s.school_code ?? "",
            school_name: s.name,
          }))
        );
        setSchoolOptions(flat);
        setSchools(flat);
      } else {
        setSchoolOptions([]);
        toast.warn(data.message || "No schools");
      }
    } catch (err) {
      setSchoolOptions([]);
      toast.error("Failed to load schools.");
    } finally {
      setSchoolLoading(false);
    }
  }, []);

  // === Location Cascade ===
  useEffect(() => {
    const filters = {
      country: selectedCountry || null,
      state: selectedState || null,
      district: selectedDistrict || null,
      city: selectedCity || null,
    };
    const hasFilter = Object.values(filters).some((v) => v !== null);
    if (hasFilter) fetchSchools(filters);
    else setSchoolOptions([]);

    setSelectedSchoolIds([]);
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setSelectedLevel("");
    setStudents([]);
    setTotalCount(0);
  }, [
    selectedCountry,
    selectedState,
    selectedDistrict,
    selectedCity,
    fetchSchools,
  ]);

  useEffect(() => {
    if (selectedCountry) {
      setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
      setSelectedState("");
    }
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState) {
      setFilteredDistricts(
        districts.filter((d) => d.state_id === selectedState)
      );
      setSelectedDistrict("");
    }
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      setFilteredCities(
        cities.filter((c) => c.district_id === selectedDistrict)
      );
      setSelectedCity("");
    }
  }, [selectedDistrict, cities]);

  // === YOUR REQUESTED handleGenerateRank ===
  const handleGenerateRank = async () => {
    try {
      // 🔍 Validate basic selections
      if (!selectedSchoolIds?.length) {
        toast.error("Please select at least one school.");
        return;
      }

      if (!selectedLevel) {
        toast.error("Please select a level before generating ranks.");
        return;
      }

      // Trigger update + fetch
      await fetchStudents(true);
    } catch (err) {
      console.error("❌ Error generating rank:", err);
      toast.error("Failed to generate ranks. Please try again.");
    }
  };

  // === Fetch Students ===
  // const fetchStudents = useCallback(
  //   async (updatePending = false) => {
  //     const session_id = localStorage.getItem("currentSessionId");
  //     if (!session_id && !updatePending) {
  //       toast.error("No session selected.");
  //       return;
  //     }

  //     if (!selectedSchoolIds.length || !selectedLevel) {
  //       setStudents([]);
  //       setTotalCount(0);
  //       return;
  //     }

  //     try {
  //       setIsLoading(true);
  //       const body = {
  //         schoolIds: selectedSchoolIds,
  //         classIds: selectedClassIds,
  //         subjectIds: selectedSubjectIds,
  //         level: selectedLevel,
  //         session_id,
  //         updatePending,
  //       };

  //       const { data } = await axios.post(
  //         `${API_BASE_URL}/api/getFilteredStudentreceipt`,
  //         body
  //       );

  //       if (!data.success) throw new Error(data.error || "Failed");

  //       const normalized = (data.students || []).map((s) => ({
  //         ...s,
  //         id: s.id ?? `temp-${s.roll_no}`,
  //         student_subject: Array.isArray(s.student_subject)
  //           ? s.student_subject
  //           : [s.subject_name || "N/A"],
  //         percentage: parseFloat(s.percentage) || 0,
  //         ranking: s.ranking || "N/A",
  //         medals: s.medals || "N/A",
  //         certificate: s.certificate || "N/A",
  //         remarks: s.remarks || "",
  //         level: s.level || "N/A",
  //         status: s.status || "N/A",
  //       }));

  //       setStudents(normalized);
  //       setTotalCount(data.totalCount || normalized.length);
  //       toast.success(updatePending ? "Results updated!" : "Students loaded please check.");
  //     } catch (err) {
  //       toast.error(err.response?.data?.error || err.message || "Failed");
  //       setStudents([]);
  //       setTotalCount(0);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [selectedSchoolIds, selectedClassIds, selectedSubjectIds, selectedLevel]
  // );

  const fetchStudents = useCallback(
    async (updatePending = false) => {
      try {
        const session_id = localStorage.getItem("currentSessionId");

        // 🔍 Validation before API call
        if (!selectedSchoolIds?.length) {
          toast.warning("Please select at least one school.");
          setStudents([]);
          setTotalCount(0);
          return;
        }

        if (!selectedLevel) {
          toast.error("Please select a level before continuing.");
          setStudents([]);
          setTotalCount(0);
          return;
        }

        if (!session_id && !updatePending) {
          toast.error("No active session found. Please select a session.");
          return;
        }

        // ✅ Prepare request body
        const requestBody = {
          schoolIds: selectedSchoolIds,
          classIds: selectedClassIds?.length ? selectedClassIds : [],
          subjectIds: selectedSubjectIds?.length ? selectedSubjectIds : [],
          level: selectedLevel,
          session_id,
          updatePending,
        };

        setIsLoading(true);

        // 🔗 API endpoint
        const { data } = await axios.post(
          `${API_BASE_URL}/api/getFilteredStudentreceipt`,
          requestBody
        );

        // 🚨 Handle unsuccessful response
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch student data.");
        }

        // ✅ Normalize data for UI
        const normalizedStudents = (data.students || []).map((student) => ({
          ...student,
          id: student.id ?? `temp-${student.roll_no}`,
          student_subject: Array.isArray(student.student_subject)
            ? student.student_subject
            : [student.subject_name || "N/A"],
          percentage: parseFloat(student.percentage) || 0,
          ranking: student.ranking || "N/A",
          medals: student.medals || "N/A",
          certificate: student.certificate || "N/A",
          remarks: student.remarks || "",
          level: student.level || "N/A",
          status: student.status || "N/A",
        }));

        // ✅ Update UI state
        setStudents(normalizedStudents);
        setTotalCount(data.totalCount || normalizedStudents.length);

        // 🧾 Toast notifications
        if (updatePending) {
          toast.success(
            "Ranks generated and student results updated successfully!"
          );
        } else {
          toast.success(
            `Loaded ${normalizedStudents.length} student${
              normalizedStudents.length === 1 ? "" : "s"
            } for "${selectedLevel}".`
          );
        }
      } catch (error) {
        console.error("❌ Error fetching students:", error);
        toast.error(
          error.response?.data?.error ||
            error.message ||
            "Failed to load students."
        );
        setStudents([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [
      selectedSchoolIds,
      selectedClassIds,
      selectedSubjectIds,
      selectedLevel,
      API_BASE_URL,
    ]
  );

  const debouncedFetch = useCallback(debounce(fetchStudents, 600), [
    fetchStudents,
  ]);

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  useEffect(() => {
    setSelectedStudents([]);
  }, [selectedSchoolIds, selectedClassIds, selectedSubjectIds, selectedLevel]);

  // === Handlers ===
  const handleSchoolChange = (e, newValue) => {
    if (newValue.some((v) => v.id === "ALL_SCHOOLS")) {
      setSelectedSchoolIds(schoolOptions.map((s) => s.id));
    } else {
      setSelectedSchoolIds(
        newValue.map((v) => v.id).filter((id) => id !== "ALL_SCHOOLS")
      );
    }
  };

  const handleClassChange = (e) => setSelectedClassIds(e.target.value);
  const handleSubjectChange = (e) => setSelectedSubjectIds(e.target.value);
  const handleLevelChange = (e) => setSelectedLevel(e.target.value);

  // === YOUR REQUESTED handleAssign ===
  const handleAssign = async () => {
    if (!medal) {
      toast.error("Please select a medal.");
      return;
    }
    if (selectedStudents.length === 0) {
      toast.error("No students selected.");
      return;
    }

    try {
      setIsLoading(true);
      const medalValue = medal === "N/A" ? "" : medal;

      const updatePromises = selectedStudents.map((studentId) =>
        axios.put(`${API_BASE_URL}/api/update-medal-wildcard`, {
          id: studentId,
          medals: medalValue,
        })
      );

      const responses = await Promise.all(updatePromises);
      const allSuccessful = responses.every(
        (res) => res.status === 200 && res.data.message
      );

      if (allSuccessful) {
        setStudents((prev) =>
          prev.map((student) => {
            if (selectedStudents.includes(student.id)) {
              const updated = { ...student, medals: medal };
              if (["Gold", "Silver", "Bronze"].includes(medal)) {
                updated.level_1 = "continue";
                updated.level_2 = "ongoing";
              } else if (medal === "N/A" && student.percentage < 60) {
                updated.level_1 = "completed";
                updated.level_2 = "N/A";
              }
              return updated;
            }
            return student;
          })
        );
        toast.success("Medals updated successfully!");
      } else {
        throw new Error("Some updates failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update medals.");
    } finally {
      setIsLoading(false);
      setOpen(false);
      setSelectedStudents([]);
      setMedal("");
    }
  };

  // === YOUR REQUESTED handleDownloadPDF ===
  const handleDownloadPDF = async () => {
    const session_id = localStorage.getItem("currentSessionId");
    if (!session_id) {
      toast.error("No session selected.");
      return;
    }
    if (
      !selectedSchoolIds.length ||
      !selectedClassIds.length ||
      !selectedSubjectIds.length ||
      students.length === 0
    ) {
      toast.error("Select school, classes, subjects, and have data.");
      return;
    }

    const classSubjectPercentages = selectedClassIds.reduce((acc, classId) => {
      const className =
        classes.find((cls) => cls.value === classId)?.label || classId;
      acc[className] = selectedSubjectIds.reduce((subAcc, subjectId) => {
        const subjectName =
          subjects.find((sub) => sub.value === subjectId)?.label || "N/A";
        subAcc[subjectName] = students
          .filter(
            (s) =>
              s.class_name === className &&
              s.student_subject.includes(subjectName)
          )
          .map((s) => {
            const p = parseFloat(s.percentage);
            return !isNaN(p) && p >= 60 ? p : 0;
          })
          .filter((p) => p !== 0);
        return subAcc;
      }, {});
      return acc;
    }, {});

    const classCutoff = selectedClassIds.flatMap((classId) => {
      const className =
        classes.find((cls) => cls.value === classId)?.label || classId;
      return selectedSubjectIds.map((subjectId) => {
        const subjectName =
          subjects.find((sub) => sub.value === subjectId)?.label || "N/A";
        const percentages =
          classSubjectPercentages[className][subjectName] || [];
        const sorted = [...new Set(percentages)].sort((a, b) => b - a);
        return {
          class: className,
          subjects: subjectName,
          gold: sorted[0] !== undefined ? sorted[0].toFixed(2) + "%" : "N/A",
          silver: sorted[1] !== undefined ? sorted[1].toFixed(2) + "%" : "N/A",
          bronze: sorted[2] !== undefined ? sorted[2].toFixed(2) + "%" : "N/A",
        };
      });
    });

    const winnersList = students
      .filter((s) =>
        selectedClassIds.includes(
          classes.find((cls) => cls.label === s.class_name)?.value
        )
      )
      .map((s, i) => ({
        slNo: i + 1,
        school: s.school_id,
        name: s.student_name || "N/A",
        rollNo: s.roll_no || "N/A",
        class: s.class_name || "N/A",
        subject: s.student_subject?.join(", ") || "N/A",
        fullMarks: s.full_mark || "N/A",
        securedMarks: s.mark_secured || "N/A",
        percentage: s.percentage || "N/A",
        ranking: s.ranking || "N/A",
        medal: s.medals || "N/A",
        certificate: s.certificate || "N/A",
        remarks: s.remarks || "",
      }));

    const getLocationName = (id, arr) =>
      arr.find((item) => item.id === id)?.name || "N/A";

    const countryName = getLocationName(selectedCountry, countries);
    const stateName = getLocationName(selectedState, states);
    const districtName = getLocationName(selectedDistrict, districts);
    const cityName = getLocationName(selectedCity, cities);
    const subjectNames = selectedSubjectIds.map(
      (id) => subjects.find((s) => s.value === id)?.label || "N/A"
    );

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;

    for (let i = 0; i < subjectNames.length; i++) {
      const subjectName = subjectNames[i];
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(
        <MedalsWinnersList
          winnersList={winnersList}
          classCutoff={classCutoff.filter((c) => c.subjects === subjectName)}
          schoolName={
            schools.find((s) => selectedSchoolIds.includes(s.id))
              ?.school_name || "N/A"
          }
          schoolAddress="" // You can pass if available
          classId={selectedClassIds.join(",")}
          subjectIds={selectedSubjectIds}
          subjectNames={[subjectName]}
          country={countryName}
          state={stateName}
          district={districtName}
          city={cityName}
          singleSubject={subjectName}
        />
      );

      await new Promise((r) => setTimeout(r, 500));
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) doc.addPage();
      let heightLeft = imgHeight;
      let position = 10;
      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= doc.internal.pageSize.getHeight() - 20;
      while (heightLeft > 0) {
        doc.addPage();
        position = heightLeft - imgHeight;
        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= doc.internal.pageSize.getHeight();
      }

      doc.setFontSize(10);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.getHeight() - 10
      );

      document.body.removeChild(container);
      root.unmount();
    }

    const schoolName =
      schools.find((s) => selectedSchoolIds.includes(s.id))?.school_name ||
      "School";
    doc.save(
      `Result_${schoolName}_Classes${selectedClassIds.join(
        "_"
      )}_Subjects${subjectNames.join("_")}.pdf`
    );
  };

  // === Pagination Logic ===
  const filteredStudents = students.filter(
    (s) =>
      selectedSchoolIds.includes(s.school_id) &&
      (!selectedClassIds.length ||
        selectedClassIds.includes(
          classes.find((c) => c.label === s.class_name)?.value
        ))
  );
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePreviousPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  const getStatusStyle = (status) => ({
    color: status?.toLowerCase() === "success" ? "green" : "red",
    fontWeight: "bold",
  });

  return (
    <Mainlayout>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Process Result", link: "" }]} />
      </div>

      <Container component="main" maxWidth="xl">
        <Paper
          className={styles.main}
          elevation={3}
          sx={{ p: 3, mt: 2, borderRadius: 2 }}
        >
          <Typography className={styles.formTitle} variant="h5" sx={{ mb: 4 }}>
            Process Result
          </Typography>

          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* Location Filters */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Country"
                  value={selectedCountry}
                  options={countries.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={filteredStates.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={filteredDistricts.map((d) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="City"
                  value={selectedCity}
                  options={filteredCities.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDistrict}
                />
              </Grid>

              {/* School */}
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  multiple
                  options={[
                    { id: "ALL_SCHOOLS", name: "All Schools" },
                    ...schoolOptions,
                  ]}
                  getOptionLabel={(opt) =>
                    opt.id === "ALL_SCHOOLS"
                      ? "All Schools"
                      : `${opt.name} ${
                          opt.school_code ? `(${opt.school_code})` : ""
                        }`
                  }
                  loading={schoolLoading}
                  value={
                    selectedSchoolIds.length === schoolOptions.length &&
                    schoolOptions.length > 0
                      ? [{ id: "ALL_SCHOOLS", name: "All Schools" }]
                      : schoolOptions.filter((s) =>
                          selectedSchoolIds.includes(s.id)
                        )
                  }
                  onChange={handleSchoolChange}
                  disabled={!selectedState}
                  renderTags={(value, getTagProps) =>
                    value.some((v) => v.id === "ALL_SCHOOLS") ? (
                      <Chip
                        key="all"
                        label={`All Schools (${schoolOptions.length})`}
                        size="small"
                        sx={{ bgcolor: "#1230ae", color: "white" }}
                        {...getTagProps({ index: 0 })}
                      />
                    ) : (
                      value.map((opt, i) => (
                        <Chip
                          key={opt.id}
                          label={`${opt.name} ${
                            opt.school_code ? `(${opt.school_code})` : ""
                          }`}
                          size="small"
                          sx={{ bgcolor: "#1230ae", color: "white" }}
                          {...getTagProps({ index: i })}
                        />
                      ))
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Schools"
                      size="small"
                      margin="normal"
                      fullWidth
                      placeholder={
                        selectedState
                          ? "Search or select 'All Schools'"
                          : "Select State"
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {schoolLoading && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Level, Class, Subject */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Level"
                  value={selectedLevel}
                  options={levelOptions}
                  onChange={handleLevelChange}
                  disabled={!selectedSchoolIds.length}
                  isSelected={!!selectedLevel}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Classes"
                  value={selectedClassIds}
                  options={classes}
                  onChange={handleClassChange}
                  disabled={!selectedSchoolIds.length}
                  multiple
                  isSelected={selectedClassIds.length > 0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Subjects"
                  value={selectedSubjectIds}
                  options={subjects}
                  onChange={handleSubjectChange}
                  disabled={!selectedSchoolIds.length}
                  multiple
                  isSelected={selectedSubjectIds.length > 0}
                />
              </Grid>
            </Grid>
          </form>

          {/* Action Buttons */}
          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Student Results</Typography>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => setOpen(true)}
                  disabled={selectedStudents.length === 0 || isLoading}
                  sx={{
                    bgcolor:
                      selectedStudents.length === 0 ? "#b0bec5" : "#1230AE",
                    mr: 2,
                  }}
                >
                  WildCard Medal ({selectedStudents.length})
                </Button>
                <Button
                  variant="contained"
                  onClick={handleGenerateRank}
                  disabled={!selectedSchoolIds.length || !selectedLevel}
                  sx={{ bgcolor: "#1230AE", mr: 2 }}
                >
                  Evaluate Result
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDownloadPDF}
                  disabled={isLoading || !students.length}
                  sx={{ bgcolor: "#1230AE" }}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>

            {/* TABLE WITH BORDER */}
            <Table
              sx={{
                border: "1px solid #e0e0e0",
                borderCollapse: "separate",
                borderSpacing: 0,
                "& .MuiTableCell-root": {
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                  padding: "8px",
                  fontSize: "14px",
                },
                "& .MuiTableCell-root:last-child": { borderRight: "none" },
                "& .MuiTableRow-root:last-child .MuiTableCell-root": {
                  borderBottom: "none",
                },
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#75bbeeff" }}>
                  {[
                    "Select",
                    "Student",
                    "Class",
                    "Subject",
                    "Roll No",
                    "Full Mark",
                    "Mark Secured",
                    "Percentage",
                    "Ranking",
                    "Medal",
                    "Certificate",
                    "Level",
                    "Remark",
                    "Status",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      align="center"
                      sx={{ fontWeight: "bold" }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={14} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, idx) => {
                    const studentId = student.id ?? `temp-${idx}`;
                    const hasMedal =
                      student.medals &&
                      student.medals !== "N/A" &&
                      student.medals !== "";

                    return (
                      <TableRow key={studentId}>
                        {/* <TableCell align="center">
                          <Checkbox
                            checked={selectedStudents.includes(studentId)}
                            disabled={hasMedal}
                            onChange={() => {
                              setSelectedStudents((prev) =>
                                prev.includes(studentId)
                                  ? prev.filter((id) => id !== studentId)
                                  : [...prev, studentId]
                              );
                            }}
                            sx={{
                              color: "#1230AE",
                              "&.Mui-checked": { color: "#1230AE" },
                              "&.Mui-disabled": { opacity: 0.5 },
                            }}
                          />
                        </TableCell> */}
                        <TableCell align="center">
                          {selectedLevel === "Level 1" && ( // ✅ Only show if Level 1
                            <Checkbox
                              checked={selectedStudents.includes(studentId)}
                              disabled={hasMedal}
                              onChange={() => {
                                setSelectedStudents((prev) =>
                                  prev.includes(studentId)
                                    ? prev.filter((id) => id !== studentId)
                                    : [...prev, studentId]
                                );
                              }}
                              sx={{
                                color: "#1230AE",
                                "&.Mui-checked": { color: "#1230AE" },
                                "&.Mui-disabled": { opacity: 0.5 },
                              }}
                            />
                          )}
                        </TableCell>

                        <TableCell>{student.student_name || "N/A"}</TableCell>
                        <TableCell>{student.class_name || "N/A"}</TableCell>
                        <TableCell>
                          {Array.isArray(student.student_subject)
                            ? student.student_subject
                                .map(
                                  (s) => s.charAt(0).toUpperCase() + s.slice(1)
                                )
                                .join(", ")
                            : "N/A"}
                        </TableCell>
                        <TableCell>{student.roll_no || "N/A"}</TableCell>
                        <TableCell>{student.full_mark || "N/A"}</TableCell>
                        <TableCell>{student.mark_secured || "N/A"}</TableCell>
                        <TableCell>{student.percentage || "N/A"}</TableCell>
                        <TableCell>{student.ranking || "N/A"}</TableCell>
                        <TableCell>
                          {hasMedal ? (
                            <Box
                              sx={{
                                bgcolor:
                                  student.medals === "Gold"
                                    ? "#FFD700"
                                    : student.medals === "Silver"
                                    ? "#C0C0C0"
                                    : "#CD7F32",
                                color: "black",
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                                fontSize: "0.75rem",
                                display: "inline-block",
                                fontWeight: "bold",
                              }}
                            >
                              {student.medals}
                            </Box>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>{student.certificate || "N/A"}</TableCell>
                        <TableCell>{student.level || "N/A"}</TableCell>
                        <TableCell>{student.remarks || "N/A"}</TableCell>
                        <TableCell style={getStatusStyle(student.status)}>
                          {student.status || "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={14} align="center">
                      <Typography color="textSecondary">
                        {selectedSchoolIds.length && selectedLevel
                          ? "No students found"
                          : "Select school and level"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* YOUR CUSTOM PAGINATION */}
            {filteredStudents.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const selectedSize = parseInt(e.target.value, 10);
                      setPageSize(selectedSize);
                      setPage(1);
                    }}
                    style={{
                      width: "55px",
                      padding: "0px 5px",
                      height: "30px",
                      fontSize: "14px",
                      border: "1px solid rgb(225, 220, 220)",
                      borderRadius: "2px",
                      color: "#564545",
                      fontWeight: "bold",
                      outline: "none",
                      transition: "all 0.3s ease",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {pageSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <p
                    style={{
                      margin: "auto",
                      color: "#6C757D",
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    data per Page
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "auto",
                  }}
                >
                  <label style={{ fontFamily: "'Nunito', sans-serif" }}>
                    <p
                      style={{
                        margin: "auto",
                        color: "#6C757D",
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {totalCount} records, Page {page} of {totalPages}
                    </p>
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    style={{
                      backgroundColor: page === 1 ? "#E0E0E0" : "#F5F5F5",
                      color: page === 1 ? "#aaa" : "#333",
                      border: "1px solid #ccc",
                      borderRadius: "7px",
                      padding: "3px 3.5px",
                      width: "33px",
                      height: "30px",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      margin: "0 4px",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    <UilAngleLeftB />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (pg) =>
                        pg === 1 ||
                        pg === totalPages ||
                        Math.abs(pg - page) <= 2
                    )
                    .map((pg, index, array) => (
                      <React.Fragment key={pg}>
                        {index > 0 && pg > array[index - 1] + 1 && (
                          <span
                            style={{
                              color: "#aaa",
                              fontSize: "14px",
                              fontFamily: "'Nunito', sans-serif",
                            }}
                          >
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setPage(pg)}
                          style={{
                            backgroundColor:
                              page === pg ? "#007BFF" : "#F5F5F5",
                            color: page === pg ? "#fff" : "#333",
                            border:
                              page === pg
                                ? "1px solid #0056B3"
                                : "1px solid #ccc",
                            borderRadius: "7px",
                            padding: "4px 13.5px",
                            height: "30px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            margin: "0 4px",
                            fontWeight: page === pg ? "bold" : "normal",
                            fontFamily: "'Nunito', sans-serif",
                            fontSize: "14px",
                          }}
                        >
                          {pg}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    style={{
                      backgroundColor:
                        page === totalPages ? "#E0E0E0" : "#F5F5F5",
                      color: page === totalPages ? "#aaa" : "#333",
                      border: "1px solid #ccc",
                      borderRadius: "7px",
                      padding: "3px 3.5px",
                      width: "33px",
                      height: "30px",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      margin: "0 4px",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    <UilAngleRightB />
                  </button>
                </div>
              </div>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Medal Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Assign Medal
          </Typography>
          <Dropdown
            label="Medal"
            value={medal}
            options={[
              { value: "Gold", label: "Gold" },
              { value: "Silver", label: "Silver" },
              { value: "Bronze", label: "Bronze" },
              { value: "N/A", label: "None" },
            ]}
            onChange={(e) => setMedal(e.target.value)}
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAssign}
              disabled={!medal || isLoading}
              sx={{ bgcolor: "#1230AE" }}
            >
              Assign
            </Button>
          </Box>
        </Box>
      </Modal>
    </Mainlayout>
  );
};

export default OmrForm;
