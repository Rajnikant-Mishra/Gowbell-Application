// //=======================================================
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
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
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
//   const [selectedLevel, setSelectedLevel] = useState("level_1");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [examDate, setExamDate] = useState("");
//   const [omrSet, setOmrSet] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [fetchError, setFetchError] = useState(null);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedCenter, setSelectedCenter] = useState("");
//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [classWiseCounts, setClassWiseCounts] = useState({});
//   const [students, setStudents] = useState([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const navigate = useNavigate();

//   // Pagination States
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const pageSizes = [5, 10, 25, 50];
//   const totalRecords = students.length;
//   const totalPages = Math.ceil(totalRecords / pageSize);
//   const paginatedStudents = students.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const handlePreviousPage = () => setPage((p) => Math.max(1, p - 1));
//   const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

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
//           centersRes,
//           classesRes,
//           subjectsRes,
//         ] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           axios.get(`${API_BASE_URL}/api/center/get-all`),
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
//           setCenters(
//             Array.isArray(centersRes.data)
//               ? centersRes.data
//                   .filter((center) => center.id && center.center_name)
//                   .map((center) => ({
//                     id: center.id,
//                     center_name: center.center_name,
//                   }))
//               : []
//           );
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

//           const india = countriesData.find(
//             (c) => c.name?.toLowerCase().trim() === "india"
//           );
//           if (india) {
//             setSelectedCountry(india.id);
//           }

//           if (!centersRes.data || centersRes.data.length === 0) {
//             setFetchError("No centers available. Please contact support.");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setFetchError("Failed to load initial data. Please try again.");
//         setCountries([]);
//         setStates([]);
//         setDistricts([]);
//         setCities([]);
//         setCenters([]);
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
//     setSelectedCenter("");
//     setExamDate(null);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedCenter("");
//     setExamDate(null);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedCenter("");
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
//         const schoolList = response.data.data
//           .flatMap((location) =>
//             location.schools
//               .filter((school) => school && typeof school === "string")
//               .map((school) => ({
//                 school_name: school,
//                 country_id: location.country,
//                 state_id: location.state,
//                 district_id: location.district,
//                 city_id: location.city,
//               }))
//           )
//           .filter((school) => school.school_name);
//         setSchools(schoolList);
//         setFetchError(null);
//       } else {
//         setSchools([]);
//         setFetchError("No schools found for the selected location.");
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

//   // Fetch student count and list
//   const fetchStudentCount = useCallback(async () => {
//     if (
//       !selectedSchool ||
//       !selectedClassIds.length ||
//       !selectedSubjectIds.length
//     ) {
//       setTotalCount(0);
//       setClassWiseCounts({});
//       setStudents([]);
//       setFetchError(null);
//       setExamDate(null);
//       setSelectedCenter("");
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

//       const studentsData = response.data.students || [];
//       const classCounts = {};

//       selectedClassIds.forEach((classId) => {
//         const className =
//           classes.find((c) => c.id === classId)?.name || `Class ${classId}`;
//         const count = studentsData.filter(
//           (student) => student.class_name === className
//         ).length;
//         classCounts[className] = count;
//       });

//       setTotalCount(response.data.totalCount || 0);
//       setClassWiseCounts(classCounts);
//       setStudents(studentsData);
//       setExamDate(response.data.exam_date || null);

//       // Auto-fill center for Level 2
//       if (selectedLevel === "level_2" && response.data.center_name) {
//         const centerObj = centers.find(
//           (c) => c.center_name === response.data.center_name
//         );
//         setSelectedCenter(centerObj ? centerObj.id : "");
//       } else {
//         setSelectedCenter("");
//       }

//       setFetchError(null);
//     } catch (error) {
//       console.error("Error fetching student count:", error);
//       setFetchError("Failed to fetch student count");
//       setTotalCount(0);
//       setClassWiseCounts({});
//       setStudents([]);
//       setExamDate(null);
//       setSelectedCenter("");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     selectedSchool,
//     selectedClassIds,
//     selectedSubjectIds,
//     selectedLevel,
//     classes,
//     centers,
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
//                   return null;
//               }
//             };

//             ReactDOM.render(
//               <OMRComponent
//                 schoolName={selectedSchool}
//                 student={student.student_name}
//                 studentId={student.id}
//                 level={getLevelNumber(selectedLevel)}
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
//                 centerName={
//                   centers.find((c) => c.id === selectedCenter)?.center_name ||
//                   "Not Available"
//                 }
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

//   // Handle Save
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

//     const isLevel2 = selectedLevel === "level_2";
//     if (
//       !selectedCountry ||
//       !selectedState ||
//       !selectedDistrict ||
//       !selectedCity ||
//       !selectedSchool ||
//       !selectedLevel ||
//       !selectedModel ||
//       !omrSet ||
//       (isLevel2 && !selectedCenter)
//     ) {
//       const missingFields = [];
//       if (!selectedCountry) missingFields.push("Country");
//       if (!selectedState) missingFields.push("State");
//       if (!selectedDistrict) missingFields.push("District");
//       if (!selectedCity) missingFields.push("City");
//       if (!selectedSchool) missingFields.push("School");
//       if (!selectedLevel) missingFields.push("Level");
//       if (!selectedModel) missingFields.push("Mode");
//       if (!omrSet) missingFields.push("OMR Set");
//       if (isLevel2 && !selectedCenter) missingFields.push("Center");

//       Swal.fire({
//         icon: "error",
//         title: "Missing Fields",
//         text: `Please select the following: ${missingFields.join(", ")}`,
//         confirmButtonColor: "#d33",
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

//       const payload = {
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//         school: selectedSchool,
//         center_id: selectedCenter ? Number(selectedCenter) : null,
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
//         text: "OMR data saved successfully. Please wait for PDF download!",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "OK",
//         timer: 5000,
//         timerProgressBar: false,
//       }).then(() => navigate("/omr-create"));

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
//         text:
//           error.response?.data?.error ||
//           error.message ||
//           "Failed to save OMR data",
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
//       centers: centers.map((c) => ({ value: c.id, label: c.center_name })),
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
//       centers,
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
//           {/* {fetchError && (
//             <Typography color="error" className="mb-3">
//               {fetchError}
//             </Typography>
//           )} */}
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
//                   onChange={(e) => {
//                     setSelectedLevel(e.target.value);
//                     if (e.target.value !== "level_2") {
//                       setSelectedCenter("");
//                     }
//                   }}
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
//                   label="Question Set"
//                   value={omrSet}
//                   options={dropdownOptions.omrSets}
//                   onChange={(e) => setOmrSet(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>

//               {/* CENTER - ONLY SHOW WHEN LEVEL 2 */}
//               {selectedLevel === "level_2" && (
//                 <Grid item xs={12} sm={6} md={3}>
//                   <TextField
//                     select
//                     label="Center"
//                     variant="outlined"
//                     fullWidth
//                     margin="normal"
//                     size="small"
//                     value={selectedCenter}
//                     onChange={(e) => setSelectedCenter(e.target.value)}
//                     disabled={isLoading || !centers.length}
//                     SelectProps={{
//                       displayEmpty: true,
//                       renderValue: (selected) => {
//                         if (!selected) return <em>Select Center</em>;
//                         const center = centers.find((c) => c.id === selected);
//                         return center ? center.center_name : selected;
//                       },
//                     }}
//                   >
//                     {centers.map((center) => (
//                       <MenuItem key={center.id} value={center.id}>
//                         {center.center_name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//               )}
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

//             {/* Student Table */}
//             {students.length > 0 && (
//               <Box mt={3} mb={3}>
//                 <TableContainer>
//                   <Table sx={{ borderCollapse: "collapse" }}>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell
//                           sx={{
//                             border: "1px solid #ccc",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Student Name
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             border: "1px solid #ccc",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Roll Number
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             border: "1px solid #ccc",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Class
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             border: "1px solid #ccc",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Subject
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {paginatedStudents.map((student, index) => (
//                         <TableRow key={index}>
//                           <TableCell sx={{ border: "1px solid #ccc" }}>
//                             {student.student_name || "N/A"}
//                           </TableCell>
//                           <TableCell sx={{ border: "1px solid #ccc" }}>
//                             {student.roll_no || "N/A"}
//                           </TableCell>
//                           <TableCell sx={{ border: "1px solid #ccc" }}>
//                             {student.class_name || "N/A"}
//                           </TableCell>
//                           <TableCell sx={{ border: "1px solid #ccc" }}>
//                             {student.subject_name || "N/A"}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>

//                 {/* CUSTOM PAGINATION */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     flexWrap: "wrap",
//                     marginTop: "8px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       alignItems: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <select
//                       value={pageSize}
//                       onChange={(e) => {
//                         const selectedSize = parseInt(e.target.value, 10);
//                         setPageSize(selectedSize);
//                         setPage(1);
//                       }}
//                       style={{
//                         width: "55px",
//                         padding: "0px 5px",
//                         height: "30px",
//                         fontSize: "14px",
//                         border: "1px solid rgb(225, 220, 220)",
//                         borderRadius: "2px",
//                         color: "#564545",
//                         fontWeight: "bold",
//                         outline: "none",
//                         transition: "all 0.3s ease",
//                         fontFamily: "'Nunito', sans-serif",
//                       }}
//                     >
//                       {pageSizes.map((size) => (
//                         <option key={size} value={size}>
//                           {size}
//                         </option>
//                       ))}
//                     </select>
//                     <p
//                       style={{
//                         margin: "auto",
//                         color: "#6C757D",
//                         fontFamily: "'Nunito', sans-serif",
//                         fontSize: "14px",
//                       }}
//                     >
//                       data per Page
//                     </p>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       margin: "auto",
//                     }}
//                   >
//                     <label style={{ fontFamily: "'Nunito', sans-serif" }}>
//                       <p
//                         style={{
//                           margin: "auto",
//                           color: "#6C757D",
//                           fontFamily: "'Nunito', sans-serif",
//                           fontSize: "14px",
//                         }}
//                       >
//                         {totalRecords} records, Page {page} of {totalPages}
//                       </p>
//                     </label>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <button
//                       onClick={handlePreviousPage}
//                       disabled={page === 1}
//                       style={{
//                         backgroundColor: page === 1 ? "#E0E0E0" : "#F5F5F5",
//                         color: page === 1 ? "#aaa" : "#333",
//                         border: "1px solid #ccc",
//                         borderRadius: "7px",
//                         padding: "3px 3.5px",
//                         width: "33px",
//                         height: "30px",
//                         cursor: page === 1 ? "not-allowed" : "pointer",
//                         transition: "all 0.3s ease",
//                         margin: "0 4px",
//                         fontFamily: "'Nunito', sans-serif",
//                       }}
//                     >
//                       <UilAngleLeftB />
//                     </button>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1)
//                       .filter(
//                         (pg) =>
//                           pg === 1 ||
//                           pg === totalPages ||
//                           Math.abs(pg - page) <= 2
//                       )
//                       .map((pg, index, array) => (
//                         <React.Fragment key={pg}>
//                           {index > 0 && pg > array[index - 1] + 1 && (
//                             <span
//                               style={{
//                                 color: "#aaa",
//                                 fontSize: "14px",
//                                 fontFamily: "'Nunito', sans-serif",
//                               }}
//                             >
//                               ...
//                             </span>
//                           )}
//                           <button
//                             onClick={() => setPage(pg)}
//                             style={{
//                               backgroundColor:
//                                 page === pg ? "#007BFF" : "#F5F5F5",
//                               color: page === pg ? "#fff" : "#333",
//                               border:
//                                 page === pg
//                                   ? "1px solid #0056B3"
//                                   : "1px solid #ccc",
//                               borderRadius: "7px",
//                               padding: "4px 13.5px",
//                               height: "30px",
//                               cursor: "pointer",
//                               transition: "all 0.3s ease",
//                               margin: "0 4px",
//                               fontWeight: page === pg ? "bold" : "normal",
//                               fontFamily: "'Nunito', sans-serif",
//                               fontSize: "14px",
//                             }}
//                           >
//                             {pg}
//                           </button>
//                         </React.Fragment>
//                       ))}
//                     <button
//                       onClick={handleNextPage}
//                       disabled={page === totalPages}
//                       style={{
//                         backgroundColor:
//                           page === totalPages ? "#E0E0E0" : "#F5F5F5",
//                         color: page === totalPages ? "#aaa" : "#333",
//                         border: "1px solid #ccc",
//                         borderRadius: "7px",
//                         padding: "3px 3.5px",
//                         width: "33px",
//                         height: "30px",
//                         cursor: page === totalPages ? "not-allowed" : "pointer",
//                         transition: "all 0.3s ease",
//                         margin: "0 4px",
//                         fontFamily: "'Nunito', sans-serif",
//                       }}
//                     >
//                       <UilAngleRightB />
//                     </button>
//                   </div>
//                 </div>
//               </Box>
//             )}

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
//                     (selectedLevel === "level_2" && !selectedCenter) ||
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

//======================================
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";
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
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   OutlinedInput,
// } from "@mui/material";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
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

// /* ─────────────────────── Re-usable Dropdown (single) ─────────────────────── */
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
//     {options.map((opt) => (
//       <MenuItem key={opt.value} value={opt.value}>
//         {opt.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// /* ─────────────────────── Main Component ─────────────────────── */
// const ExaminationForm = () => {
//   /* ────── Core state ────── */
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);

//   /* ────── SCHOOLS (multi-select) ────── */
//   const [schoolOptions, setSchoolOptions] = useState([]); // [{id, name}]
//   const [selectedSchoolIds, setSelectedSchoolIds] = useState([]); // number[]

//   const [selectedLevel, setSelectedLevel] = useState("level_1");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [examDate, setExamDate] = useState("");
//   const [omrSet, setOmrSet] = useState("");
//   const [selectedCenter, setSelectedCenter] = useState("");

//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

//   const [totalCount, setTotalCount] = useState(0);
//   const [classWiseCounts, setClassWiseCounts] = useState({});
//   const [students, setStudents] = useState([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [fetchError, setFetchError] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const navigate = useNavigate();

//   /* ────── Pagination ────── */
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const pageSizes = [5, 10, 25, 50];
//   const totalRecords = students.length;
//   const totalPages = Math.ceil(totalRecords / pageSize);
//   const paginatedStudents = students.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const handlePreviousPage = () => setPage((p) => Math.max(1, p - 1));
//   const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

//   /* ────── 1. Load static master data ────── */
//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       try {
//         setIsLoading(true);
//         const [
//           countriesRes,
//           statesRes,
//           districtsRes,
//           citiesRes,
//           centersRes,
//           classesRes,
//           subjectsRes,
//         ] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           axios.get(`${API_BASE_URL}/api/center/get-all`),
//           axios.get(`${API_BASE_URL}/api/class`),
//           axios.get(`${API_BASE_URL}/api/subject`),
//         ]);

//         if (!mounted) return;

//         setCountries(countriesRes.data ?? []);
//         setStates(statesRes.data ?? []);
//         setDistricts(districtsRes.data ?? []);
//         setCities(citiesRes.data ?? []);
//         setCenters(
//           (centersRes.data ?? [])
//             .filter((c) => c.id && c.center_name)
//             .map((c) => ({ id: c.id, center_name: c.center_name }))
//         );
//         setClasses(
//           (classesRes.data ?? []).map((c) => ({ id: c.id, name: c.name }))
//         );
//         setSubjects(
//           (subjectsRes.data ?? []).map((s) => ({ id: s.id, name: s.name }))
//         );

//         // default India
//         const india = (countriesRes.data ?? []).find(
//           (c) => c.name?.toLowerCase().trim() === "india"
//         );
//         if (india) setSelectedCountry(india.id);
//       } catch (e) {
//         console.error(e);
//         setFetchError("Failed to load master data");
//       } finally {
//         if (mounted) setIsLoading(false);
//       }
//     };
//     load();
//     return () => (mounted = false);
//   }, []);

//   /* ────── 2. Cascade location filters ────── */
//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolIds([]);
//     setSelectedCenter("");
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolIds([]);
//     setSelectedCenter("");
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchoolIds([]);
//     setSelectedCenter("");
//   }, [selectedDistrict, cities]);

//   /* ────── 3. FETCH SCHOOLS (new endpoint) ────── */
//   const fetchSchools = useCallback(async () => {
//     if (!selectedCountry) {
//       setSchoolOptions([]);
//       return;
//     }
//     try {
//       setIsLoading(true);
//       const params = {
//         country: selectedCountry || null,
//         state: selectedState || null,
//         district: selectedDistrict || null,
//         city: selectedCity || null,
//       };
//       const { data } = await axios.get(
//         `${API_BASE_URL}/api/get/school-filter`,
//         { params }
//       );

//       if (data.success) {
//         const list = data.data
//           .flatMap((loc) => loc.schools)
//           .map((s) => ({ id: s.id, name: s.name }));
//         setSchoolOptions(list);
//       } else {
//         setSchoolOptions([]);
//         setFetchError("No schools found");
//       }
//     } catch (e) {
//       console.error(e);
//       setSchoolOptions([]);
//       setFetchError("Failed to fetch schools");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

//   useEffect(() => {
//     fetchSchools();
//   }, [fetchSchools]);

//   /* ────── 4. FETCH STUDENT COUNT & LIST ────── */
//   const fetchStudentCount = useCallback(async () => {
//     if (
//       selectedSchoolIds.length === 0 ||
//       selectedClassIds.length === 0 ||
//       selectedSubjectIds.length === 0
//     ) {
//       setTotalCount(0);
//       setClassWiseCounts({});
//       setStudents([]);
//       setExamDate(null);
//       setSelectedCenter("");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const allResults = await Promise.all(
//         selectedSchoolIds.map(async (sid) => {
//           const { data } = await axios.post(
//             `${API_BASE_URL}/api/get/student/filter`,
//             {
//               school_id: sid, // ✅ single school per request
//               classList: selectedClassIds,
//               subjectList: selectedSubjectIds,
//               level: selectedLevel,
//             }
//           );
//           return data;
//         })
//       );

//       // Combine all responses
//       const allStudents = allResults.flatMap((r) => r.students ?? []);
//       const totalCount = allResults.reduce(
//         (sum, r) => sum + (r.totalCount ?? 0),
//         0
//       );
//       const exam_date = allResults[0]?.exam_date ?? null;
//       const center_name = allResults[0]?.center_name ?? null;

//       // Build class-wise counts
//       const classCounts = {};
//       selectedClassIds.forEach((cid) => {
//         const cls = classes.find((c) => c.id === cid);
//         const name = cls?.name ?? `Class ${cid}`;
//         classCounts[name] = allStudents.filter(
//           (s) => s.class_name === name
//         ).length;
//       });

//       setTotalCount(totalCount);
//       setClassWiseCounts(classCounts);
//       setStudents(allStudents);
//       setExamDate(exam_date);

//       // Auto-select center if level_2
//       if (selectedLevel === "level_2" && center_name) {
//         const centre = centers.find((c) => c.center_name === center_name);
//         setSelectedCenter(centre?.id ?? "");
//       } else {
//         setSelectedCenter("");
//       }
//     } catch (e) {
//       console.error(e);
//       setFetchError("Failed to fetch students");
//       setTotalCount(0);
//       setClassWiseCounts({});
//       setStudents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     selectedSchoolIds,
//     selectedClassIds,
//     selectedSubjectIds,
//     selectedLevel,
//     classes,
//     centers,
//   ]);

//   // debounce
//   const debounceRef = useRef(null);
//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(fetchStudentCount, 400);
//     return () => clearTimeout(debounceRef.current);
//   }, [fetchStudentCount]);

//   /* ────── 5. PDF Generation (unchanged except school name handling) ────── */
//   const getOMRSheetComponent = (className) => {
//     const lower = ["01", "02", "03", "1", "2", "3"];
//     const num = className?.replace(/\D/g, "") ?? "";
//     return lower.includes(num) ? OMRSheet50 : OMRSheet60;
//   };

//   // const generatePDF = async (students, recordId) => {
//   const generatePDF = async (students, recordId) => {
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     let validSheets = 0;
//     const batchSize = 10; // how many pages per chunk
//     const parallelLimit = 3; // render 3 pages at a time
//     let currentSheetIdx = 0;

//     // ✅ STEP 1: Group students & subjects
//     const studentsById = students.reduce((acc, s) => {
//       if (
//         !s.id ||
//         !s.student_name ||
//         !s.roll_no ||
//         !s.class_name ||
//         !s.subject_name
//       )
//         return acc;

//       if (!acc[s.id]) {
//         acc[s.id] = {
//           id: s.id,
//           student_name: s.student_name,
//           roll_no: s.roll_no,
//           class_name: s.class_name,
//           school_id: s.school_id,
//           subjects: [],
//         };
//       }

//       acc[s.id].subjects.push(s.subject_name);
//       return acc;
//     }, {});

//     const studentList = Object.values(studentsById);

//     // ✅ STEP 2: Flatten subjects for chunking
//     const studentSubjects = [];
//     for (const stu of studentList) {
//       for (const sub of stu.subjects) {
//         studentSubjects.push({ ...stu, subject: sub });
//       }
//     }

//     const totalSheets = studentSubjects.length;
//     const totalBatches = Math.ceil(totalSheets / batchSize);

//     // ✅ Helper: chunk array
//     const chunkArray = (arr, size) => {
//       const chunks = [];
//       for (let i = 0; i < arr.length; i += size)
//         chunks.push(arr.slice(i, i + size));
//       return chunks;
//     };

//     const chunks = chunkArray(studentSubjects, batchSize);

//     // ✅ STEP 3: Process batches
//     for (let batchIndex = 0; batchIndex < chunks.length; batchIndex++) {
//       const batch = chunks[batchIndex];
//       currentSheetIdx += batch.length;

//       const progress = Math.min((currentSheetIdx / totalSheets) * 80 + 10, 90);
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
//       window.dispatchEvent(new Event("storage"));

//       // ---- Process batch in parallel (3 renders at a time) ----
//       const parallelChunks = chunkArray(batch, parallelLimit);

//       for (const smallGroup of parallelChunks) {
//         // run up to 3 html2canvas calls at once
//         const renderedPages = await Promise.all(
//           smallGroup.map(async (stuSub, idx) => {
//             const OMRComp = getOMRSheetComponent(stuSub.class_name);
//             const div = document.createElement("div");
//             div.style.width = "210mm";
//             div.style.height = "297mm";
//             div.style.backgroundColor = "white";
//             document.body.appendChild(div);

//             const subjectId =
//               subjects.find((s) => s.name === stuSub.subject)?.id ??
//               stuSub.subject;
//             const getLevelNum = (lvl) => {
//               const map = { level_1: 1, level_2: 2, level_3: 3, level_4: 4 };
//               return map[lvl] ?? null;
//             };

//             const schoolNames = selectedSchoolIds
//               .map(
//                 (sid) => schoolOptions.find((so) => so.id === sid)?.name ?? ""
//               )
//               .filter(Boolean)
//               .join(", ");

//             ReactDOM.render(
//               <OMRComp
//                 schoolName={schoolNames}
//                 student={stuSub.student_name}
//                 studentId={stuSub.id}
//                 level={getLevelNum(selectedLevel)}
//                 subject={stuSub.subject}
//                 subjectIds={subjectId}
//                 className={stuSub.class_name}
//                 classId={
//                   classes.find((c) => c.name === stuSub.class_name)?.id ??
//                   stuSub.class_name
//                 }
//                 rollNumber={stuSub.roll_no}
//                 omrSet={omrSet}
//                 examDate={examDate || "Not Available"}
//                 centerName={
//                   centers.find((c) => c.id === selectedCenter)?.center_name ??
//                   "Not Available"
//                 }
//               />,
//               div
//             );

//             const canvas = await html2canvas(div, {
//               scale: 2.5,
//               useCORS: true,
//             }); // ⚡ reduced scale for faster rendering
//             const imgData = canvas.toDataURL("image/jpeg", 0.9);
//             document.body.removeChild(div);

//             return imgData;
//           })
//         );

//         // ---- Add all rendered pages (in order) to PDF ----
//         for (const imgData of renderedPages) {
//           validSheets++;
//           if (validSheets > 1) doc.addPage();
//           const imgW = doc.internal.pageSize.getWidth() - 10;
//           const imgH = (297 * imgW) / 210; // maintain A4 aspect ratio
//           doc.addImage(imgData, "JPEG", 5, 5, imgW, imgH);
//         }

//         // Small pause for UI thread relief
//         await new Promise((r) => setTimeout(r, 50));
//       }
//     }

//     // ✅ STEP 4: Save PDF
//     if (!validSheets) throw new Error("No valid sheets");

//     const filename = `OMR_Sheets_${new Date().toISOString().slice(0, 10)}.pdf`;
//     const blob = doc.output("blob");

//     const dataUrl = await new Promise((res) => {
//       const r = new FileReader();
//       r.onload = () => res(r.result);
//       r.readAsDataURL(blob);
//     });

//     localStorage.setItem("pdfProgress", JSON.stringify({ progress: 100 }));
//     window.dispatchEvent(new Event("storage"));

//     const a = document.createElement("a");
//     a.href = dataUrl;
//     a.download = filename;
//     a.click();

//     return { validStudents: validSheets, filename, pdfBlob: blob, recordId };
//   };

//   /* ────── 6. SAVE + PDF flow ────── */
//   const handleSave = async () => {
//     if (!totalCount) {
//       Swal.fire({
//         icon: "warning",
//         title: "No Students",
//         text: "Select valid criteria",
//       });
//       return;
//     }

//     const missing = [];
//     if (!selectedCountry) missing.push("Country");
//     if (!selectedState) missing.push("State");
//     if (!selectedDistrict) missing.push("District");
//     if (!selectedCity) missing.push("City");
//     if (selectedSchoolIds.length === 0) missing.push("School");
//     if (!selectedLevel) missing.push("Level");
//     if (!selectedModel) missing.push("Mode");
//     if (!omrSet) missing.push("OMR Set");
//     if (selectedLevel === "level_2" && !selectedCenter) missing.push("Center");
//     if (missing.length) {
//       Swal.fire({ icon: "error", title: "Missing", text: missing.join(", ") });
//       return;
//     }

//     try {
//       setIsGenerating(true);
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Auth missing");

//       localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
//       window.dispatchEvent(new Event("storage"));

//       // re-fetch latest student list
//       const { data } = await axios.post(
//         `${API_BASE_URL}/api/get/student/filter`,
//         {
//           school_id: selectedSchoolIds, // ✅ matches backend
//           classList: selectedClassIds,
//           subjectList: selectedSubjectIds,
//           level: selectedLevel,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!data.students?.length) throw new Error("No students");

//       const studentIds = data.students
//         .filter((s) => s.id && !isNaN(s.id))
//         .map((s) => Number(s.id));

//       // ✅ UPGRADED: school is now stored as an ARRAY, not CSV
//       const payload = {
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//         city: selectedCity,
//         school: selectedSchoolIds, // 👈 ARRAY now (was CSV before)
//         center_id: selectedCenter ? Number(selectedCenter) : null,
//         classes: selectedClassIds.map(
//           (id) => classes.find((c) => c.id === id)?.name ?? `Class ${id}`
//         ),
//         subjects: selectedSubjectIds.map(
//           (id) => subjects.find((s) => s.id === id)?.name ?? `Subject ${id}`
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

//       const form = new FormData();
//       form.append("data", JSON.stringify([payload]));

//       const saveRes = await axios.post(
//         `${API_BASE_URL}/api/omr/generator`,
//         form,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const recordId = saveRes.data.insertedIds?.[0];
//       if (!recordId) throw new Error("Save failed");

//       Swal.fire({
//         icon: "success",
//         title: "Saved",
//         text: "PDF is being generated…",
//       }).then(() => navigate("/omr-create"));

//       const { validStudents, filename, pdfBlob } = await generatePDF(
//         data.students,
//         recordId
//       );

//       const upd = new FormData();
//       upd.append("pdf", pdfBlob, filename);
//       await axios.put(`${API_BASE_URL}/api/omr/omr/filename/${recordId}`, upd, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Done!",
//         text: `${validStudents} sheets generated`,
//       }).then(() => window.location.reload());
//     } catch (e) {
//       console.error(e);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: e.message || "Something went wrong",
//       });
//     } finally {
//       setIsGenerating(false);
//       localStorage.setItem("pdfProgress", JSON.stringify({ progress: 0 }));
//       window.dispatchEvent(new Event("storage"));
//     }
//   };

//   /* ────── 7. Dropdown options (memoised) ────── */
//   const dropdownOptions = useMemo(
//     () => ({
//       countries: countries.map((c) => ({ value: c.id, label: c.name })),
//       states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
//       districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
//       cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
//       centers: centers.map((c) => ({ value: c.id, label: c.center_name })),
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
//       centers,
//       classes,
//       subjects,
//     ]
//   );

//   /* ────── 8. UI ────── */
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

//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               {/* ---------- LOCATION ---------- */}
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

//               {/* ---------- MULTI SCHOOL (with custom chip color) ---------- */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Schools (multi)</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedSchoolIds}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       if (val.includes(0)) {
//                         setSelectedSchoolIds(
//                           selectedSchoolIds.length === schoolOptions.length
//                             ? []
//                             : schoolOptions.map((s) => s.id)
//                         );
//                       } else {
//                         setSelectedSchoolIds(val.filter((v) => v !== 0));
//                       }
//                     }}
//                     input={<OutlinedInput label="Schools (multi)" />}
//                     renderValue={(selected) => {
//                       const total = schoolOptions.length;

//                       if (selected.length === total && total > 0) {
//                         return (
//                           <Box
//                             sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
//                           >
//                             <Chip
//                               label={`All Schools (${total})`}
//                               size="small"
//                               sx={{
//                                 backgroundColor: "#1230ae",
//                                 color: "#fff",
//                                 "& .MuiChip-label": { color: "#fff" },
//                               }}
//                             />
//                           </Box>
//                         );
//                       }

//                       return (
//                         <Box
//                           sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
//                         >
//                           {selected.map((id) => {
//                             const sch = schoolOptions.find((s) => s.id === id);
//                             return (
//                               <Chip
//                                 key={id}
//                                 label={sch?.name ?? id}
//                                 size="small"
//                                 sx={{
//                                   backgroundColor: "#1230ae",
//                                   color: "#fff",
//                                   "& .MuiChip-label": { color: "#fff" },
//                                 }}
//                               />
//                             );
//                           })}
//                         </Box>
//                       );
//                     }}
//                   >
//                     <MenuItem value={0}>
//                       <em>
//                         {selectedSchoolIds.length === schoolOptions.length
//                           ? "Deselect All"
//                           : "Select All"}
//                       </em>
//                     </MenuItem>
//                     {schoolOptions.map((sch) => (
//                       <MenuItem key={sch.id} value={sch.id}>
//                         {sch.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* ---------- CLASSES (multi) – with #1230ae chips ---------- */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Classes</InputLabel>
//                   <Select
//                     label="Classes"
//                     multiple
//                     value={selectedClassIds}
//                     onChange={(e) => setSelectedClassIds(e.target.value)}
//                     renderValue={(sel) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {sel.map((id) => {
//                           const cls = classes.find((c) => c.id === id);
//                           return (
//                             <Chip
//                               key={id}
//                               label={cls?.name ?? id}
//                               size="small"
//                               sx={{
//                                 backgroundColor: "#1230ae",
//                                 color: "#fff",
//                                 "& .MuiChip-label": { color: "#fff" },
//                               }}
//                             />
//                           );
//                         })}
//                       </Box>
//                     )}
//                   >
//                     {classes.map((c) => (
//                       <MenuItem key={c.id} value={c.id}>
//                         {c.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* ---------- SUBJECTS (multi) – with #1230ae chips ---------- */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl
//                   fullWidth
//                   margin="normal"
//                   size="small"
//                   disabled={isLoading}
//                 >
//                   <InputLabel>Subjects</InputLabel>
//                   <Select
//                     label="Subjects"
//                     multiple
//                     value={selectedSubjectIds}
//                     onChange={(e) => setSelectedSubjectIds(e.target.value)}
//                     renderValue={(sel) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {sel.map((id) => {
//                           const sub = subjects.find((s) => s.id === id);
//                           return (
//                             <Chip
//                               key={id}
//                               label={sub?.name ?? id}
//                               size="small"
//                               sx={{
//                                 backgroundColor: "#1230ae",
//                                 color: "#fff",
//                                 "& .MuiChip-label": { color: "#fff" },
//                               }}
//                             />
//                           );
//                         })}
//                       </Box>
//                     )}
//                   >
//                     {subjects.map((s) => (
//                       <MenuItem key={s.id} value={s.id}>
//                         {s.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* ---------- OTHER SINGLE SELECTS ---------- */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Level"
//                   value={selectedLevel}
//                   options={dropdownOptions.levels}
//                   onChange={(e) => {
//                     setSelectedLevel(e.target.value);
//                     if (e.target.value !== "level_2") setSelectedCenter("");
//                   }}
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
//                   label="Question Set"
//                   value={omrSet}
//                   options={dropdownOptions.omrSets}
//                   onChange={(e) => setOmrSet(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </Grid>
//               {/* ---------- CENTER (only level 2) ---------- */}
//               {selectedLevel === "level_2" && (
//                 <Grid item xs={12} sm={6} md={3}>
//                   <Dropdown
//                     label="Center"
//                     value={selectedCenter}
//                     options={dropdownOptions.centers}
//                     onChange={(e) => setSelectedCenter(e.target.value)}
//                     disabled={isLoading || !centers.length}
//                   />
//                 </Grid>
//               )}
//             </Grid>

//             {/* ---------- STUDENT SUMMARY ---------- */}
//             <Box mt={3} mb={3}>
//               {totalCount > 0 ? (
//                 <Typography variant="h6" color="primary">
//                   Total Students: {totalCount}
//                 </Typography>
//               ) : (
//                 selectedSchoolIds.length > 0 &&
//                 selectedClassIds.length > 0 &&
//                 selectedSubjectIds.length > 0 && (
//                   <Typography variant="body2" color="textSecondary">
//                     No students found for the selected criteria
//                   </Typography>
//                 )
//               )}
//             </Box>

//             {/* ---------- STUDENT TABLE (unchanged) ---------- */}
//             {students.length > 0 && (
//               <Box mt={3} mb={3}>
//                 <TableContainer>
//                   <Table sx={{ borderCollapse: "collapse" }}>
//                     <TableHead>
//                       <TableRow>
//                         {[
//                           "Student Name",
//                           "Roll Number",
//                           "Class",
//                           "Subject",
//                         ].map((h) => (
//                           <TableCell
//                             key={h}
//                             sx={{
//                               border: "1px solid #ccc",
//                               backgroundColor: "#1976d2",
//                               color: "#fff",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {h}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {paginatedStudents.map((s, i) => (
//                         <TableRow key={i}>
//                           <TableCell sx={{ border: "1px solid #ccc" }}>
//                             {s.student_name || "N/A"}
//                           </TableCell>
//                           <TableCell sx={{ border: "1px solid #ccc" }}>
//                             {s.roll_no || "N/A"}
//                           </TableCell>
//                           <TableCell sx={{ border: "1px solid #ccc" }}>
//                             {s.class_name || "N/A"}
//                           </TableCell>
//                           <TableCell sx={{ border: "1px solid #ccc" }}>
//                             {s.subject_name || "N/A"}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>

//                 {/* ---- pagination UI (unchanged) ---- */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     flexWrap: "wrap",
//                     marginTop: "8px",
//                   }}
//                 >
//                   {/* ... same pagination code you already have ... */}
//                   {/* (omitted for brevity – copy-paste from your original file) */}
//                 </div>
//               </Box>
//             )}

//             {/* ---------- ACTION BUTTONS ---------- */}
//             <Box
//               className={`${styles.buttonContainer} mt-4`}
//               sx={{ display: "flex", gap: 2 }}
//             >
//               <ButtonComp
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSave}
//                 disabled={
//                   !selectedSchoolIds.length ||
//                   !selectedClassIds.length ||
//                   !selectedSubjectIds.length ||
//                   !selectedLevel ||
//                   !selectedModel ||
//                   !omrSet ||
//                   (selectedLevel === "level_2" && !selectedCenter) ||
//                   isLoading ||
//                   isGenerating ||
//                   !totalCount
//                 }
//                 text={isGenerating ? "Generating…" : "Generate PDF"}
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

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
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

/* ─────────────────────── Re-usable Dropdown (single) ─────────────────────── */
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
      options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))
    )}
  </TextField>
);

/* ─────────────────────── Main Component ─────────────────────── */
const ExaminationForm = () => {
  /* ────── Core state ────── */
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [centers, setCenters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  /* ────── SCHOOLS (multi-select) ────── */
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState("level_1");
  const [selectedModel, setSelectedModel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [omrSet, setOmrSet] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");

  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [classWiseCounts, setClassWiseCounts] = useState({});
  const [students, setStudents] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  /* ────── Pagination ────── */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 25, 50];
  const totalRecords = students.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedStudents = students.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handlePreviousPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  /* ────── Helper: Hide City for Level 2,3,4 ────── */
  const hideCity = ["level_2", "level_3", "level_4"].includes(selectedLevel);

  /* ────── 1. Load static master data ────── */
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
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

        if (!mounted) return;

        setCountries(countriesRes.data ?? []);
        setStates(statesRes.data ?? []);
        setDistricts(districtsRes.data ?? []);
        setCities(citiesRes.data ?? []);
        setCenters(
          (centersRes.data ?? [])
            .filter((c) => c.id && c.center_name)
            .map((c) => ({ id: c.id, center_name: c.center_name }))
        );
        setClasses(
          (classesRes.data ?? []).map((c) => ({ id: c.id, name: c.name }))
        );
        setSubjects(
          (subjectsRes.data ?? []).map((s) => ({ id: s.id, name: s.name }))
        );

        const india = (countriesRes.data ?? []).find(
          (c) => c.name?.toLowerCase().trim() === "india"
        );
        if (india) setSelectedCountry(india.id);
      } catch (e) {
        console.error(e);
        setFetchError("Failed to load master data");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  /* ────── 2. Cascade location filters ────── */
  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSelectedCenter("");
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSelectedCenter("");
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSelectedCenter("");
  }, [selectedDistrict, cities]);

  /* ────── 3. FETCH SCHOOLS ────── */
  const fetchSchools = useCallback(async () => {
    if (!selectedCountry) {
      setSchoolOptions([]);
      return;
    }
    try {
      setIsLoading(true);
      const params = {
        country: selectedCountry || null,
        state: selectedState || null,
        district: selectedDistrict || null,
        city: selectedCity || null,
      };
      const { data } = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        { params }
      );

      if (data.success) {
        const list = data.data
          .flatMap((loc) => loc.schools)
          .map((s) => ({ id: s.id, name: s.name }));
        setSchoolOptions(list);
      } else {
        setSchoolOptions([]);
        setFetchError("No schools found");
      }
    } catch (e) {
      console.error(e);
      setSchoolOptions([]);
      setFetchError("Failed to fetch schools");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  /* ────── 4. FETCH STUDENT COUNT & LIST ────── */
  const fetchStudentCount = useCallback(async () => {
    if (
      selectedSchoolIds.length === 0 ||
      selectedClassIds.length === 0 ||
      selectedSubjectIds.length === 0
    ) {
      setTotalCount(0);
      setClassWiseCounts({});
      setStudents([]);
      setExamDate(null);
      setSelectedCenter("");
      return;
    }

    try {
      setIsLoading(true);

      const allResults = await Promise.all(
        selectedSchoolIds.map(async (sid) => {
          const { data } = await axios.post(
            `${API_BASE_URL}/api/get/student/filter`,
            {
              school_id: sid,
              classList: selectedClassIds,
              subjectList: selectedSubjectIds,
              level: selectedLevel,
            }
          );
          return data;
        })
      );

      const allStudents = allResults.flatMap((r) => r.students ?? []);
      const totalCount = allResults.reduce(
        (sum, r) => sum + (r.totalCount ?? 0),
        0
      );
      const exam_date = allResults[0]?.exam_date ?? null;
      const center_name = allResults[0]?.center_name ?? null;

      const classCounts = {};
      selectedClassIds.forEach((cid) => {
        const cls = classes.find((c) => c.id === cid);
        const name = cls?.name ?? `Class ${cid}`;
        classCounts[name] = allStudents.filter(
          (s) => s.class_name === name
        ).length;
      });

      setTotalCount(totalCount);
      setClassWiseCounts(classCounts);
      setStudents(allStudents);
      setExamDate(exam_date);

      if (selectedLevel === "level_2" && center_name) {
        const centre = centers.find((c) => c.center_name === center_name);
        setSelectedCenter(centre?.id ?? "");
      } else {
        setSelectedCenter("");
      }
    } catch (e) {
      console.error(e);
      setFetchError("Failed to fetch students");
      setTotalCount(0);
      setClassWiseCounts({});
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedSchoolIds,
    selectedClassIds,
    selectedSubjectIds,
    selectedLevel,
    classes,
    centers,
  ]);

  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchStudentCount, 400);
    return () => clearTimeout(debounceRef.current);
  }, [fetchStudentCount]);

  /* ────── 5. PDF Generation ────── */
  const getOMRSheetComponent = (className) => {
    const lower = ["01", "02", "03", "1", "2", "3"];
    const num = className?.replace(/\D/g, "") ?? "";
    return lower.includes(num) ? OMRSheet50 : OMRSheet60;
  };

  const generatePDF = async (students, recordId) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let validSheets = 0;
    const batchSize = 10;
    const parallelLimit = 3;
    let currentSheetIdx = 0;

    const studentsById = students.reduce((acc, s) => {
      if (
        !s.id ||
        !s.student_name ||
        !s.roll_no ||
        !s.class_name ||
        !s.subject_name
      )
        return acc;
      if (!acc[s.id]) {
        acc[s.id] = {
          id: s.id,
          student_name: s.student_name,
          roll_no: s.roll_no,
          class_name: s.class_name,
          school_id: s.school_id,
          subjects: [],
        };
      }
      acc[s.id].subjects.push(s.subject_name);
      return acc;
    }, {});

    const studentList = Object.values(studentsById);
    const studentSubjects = [];
    for (const stu of studentList) {
      for (const sub of stu.subjects) {
        studentSubjects.push({ ...stu, subject: sub });
      }
    }

    const totalSheets = studentSubjects.length;
    const totalBatches = Math.ceil(totalSheets / batchSize);
    const chunkArray = (arr, size) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size)
        chunks.push(arr.slice(i, i + size));
      return chunks;
    };

    const chunks = chunkArray(studentSubjects, batchSize);

    for (let batchIndex = 0; batchIndex < chunks.length; batchIndex++) {
      const batch = chunks[batchIndex];
      currentSheetIdx += batch.length;

      const progress = Math.min((currentSheetIdx / totalSheets) * 80 + 10, 90);
      localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
      window.dispatchEvent(new Event("storage"));

      const parallelChunks = chunkArray(batch, parallelLimit);

      for (const smallGroup of parallelChunks) {
        const renderedPages = await Promise.all(
          smallGroup.map(async (stuSub) => {
            const OMRComp = getOMRSheetComponent(stuSub.class_name);
            const div = document.createElement("div");
            div.style.width = "210mm";
            div.style.height = "297mm";
            div.style.backgroundColor = "white";
            document.body.appendChild(div);

            const subjectId =
              subjects.find((s) => s.name === stuSub.subject)?.id ??
              stuSub.subject;
            const getLevelNum = (lvl) => {
              const map = { level_1: 1, level_2: 2, level_3: 3, level_4: 4 };
              return map[lvl] ?? null;
            };

            const schoolNames = selectedSchoolIds
              .map(
                (sid) => schoolOptions.find((so) => so.id === sid)?.name ?? ""
              )
              .filter(Boolean)
              .join(", ");

            ReactDOM.render(
              <OMRComp
                schoolName={schoolNames}
                student={stuSub.student_name}
                studentId={stuSub.id}
                level={getLevelNum(selectedLevel)}
                subject={stuSub.subject}
                subjectIds={subjectId}
                className={stuSub.class_name}
                classId={
                  classes.find((c) => c.name === stuSub.class_name)?.id ??
                  stuSub.class_name
                }
                rollNumber={stuSub.roll_no}
                omrSet={omrSet}
                examDate={examDate || "Not Available"}
                centerName={
                  centers.find((c) => c.id === selectedCenter)?.center_name ??
                  "Not Available"
                }
              />,
              div
            );

            const canvas = await html2canvas(div, {
              scale: 2.5,
              useCORS: true,
            });
            const imgData = canvas.toDataURL("image/jpeg", 0.9);
            document.body.removeChild(div);
            return imgData;
          })
        );

        for (const imgData of renderedPages) {
          validSheets++;
          if (validSheets > 1) doc.addPage();
          const imgW = doc.internal.pageSize.getWidth() - 10;
          const imgH = (297 * imgW) / 210;
          doc.addImage(imgData, "JPEG", 5, 5, imgW, imgH);
        }

        await new Promise((r) => setTimeout(r, 50));
      }
    }

    if (!validSheets) throw new Error("No valid sheets");

    const filename = `OMR_Sheets_${new Date().toISOString().slice(0, 10)}.pdf`;
    const blob = doc.output("blob");

    const dataUrl = await new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(blob);
    });

    localStorage.setItem("pdfProgress", JSON.stringify({ progress: 100 }));
    window.dispatchEvent(new Event("storage"));

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();

    return { validStudents: validSheets, filename, pdfBlob: blob, recordId };
  };

  /* ────── 6. SAVE + PDF flow ────── */
  const handleSave = async () => {
    if (!totalCount) {
      Swal.fire({
        icon: "warning",
        title: "No Students",
        text: "Select valid criteria",
      });
      return;
    }

    const missing = [];
    if (!selectedCountry) missing.push("Country");
    if (!selectedState) missing.push("State");
    if (!selectedDistrict) missing.push("District");
    if (!hideCity && !selectedCity) missing.push("City"); // Only if not hidden
    if (selectedSchoolIds.length === 0) missing.push("School");
    if (!selectedLevel) missing.push("Level");
    if (!selectedModel) missing.push("Mode");
    if (!omrSet) missing.push("OMR Set");
    if (selectedLevel === "level_2" && !selectedCenter) missing.push("Center");
    if (missing.length) {
      Swal.fire({ icon: "error", title: "Missing", text: missing.join(", ") });
      return;
    }

    try {
      setIsGenerating(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Auth missing");

      localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
      window.dispatchEvent(new Event("storage"));

      const { data } = await axios.post(
        `${API_BASE_URL}/api/get/student/filter`,
        {
          school_id: selectedSchoolIds,
          classList: selectedClassIds,
          subjectList: selectedSubjectIds,
          level: selectedLevel,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.students?.length) throw new Error("No students");

      const studentIds = data.students
        .filter((s) => s.id && !isNaN(s.id))
        .map((s) => Number(s.id));

      const payload = {
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
        city: hideCity ? null : selectedCity, // Don't send if hidden
        school: selectedSchoolIds,
        center_id: selectedCenter ? Number(selectedCenter) : null,
        classes: selectedClassIds.map(
          (id) => classes.find((c) => c.id === id)?.name ?? `Class ${id}`
        ),
        subjects: selectedSubjectIds.map(
          (id) => subjects.find((s) => s.id === id)?.name ?? `Subject ${id}`
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

      const form = new FormData();
      form.append("data", JSON.stringify([payload]));

      const saveRes = await axios.post(
        `${API_BASE_URL}/api/omr/generator`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recordId = saveRes.data.insertedIds?.[0];
      if (!recordId) throw new Error("Save failed");

      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "PDF is being generated…",
      }).then(() => navigate("/omr-create"));

      const { validStudents, filename, pdfBlob } = await generatePDF(
        data.students,
        recordId
      );

      const upd = new FormData();
      upd.append("pdf", pdfBlob, filename);
      await axios.put(`${API_BASE_URL}/api/omr/omr/filename/${recordId}`, upd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Done!",
        text: `${validStudents} sheets generated`,
      }).then(() => window.location.reload());
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message || "Something went wrong",
      });
    } finally {
      setIsGenerating(false);
      localStorage.setItem("pdfProgress", JSON.stringify({ progress: 0 }));
      window.dispatchEvent(new Event("storage"));
    }
  };

  /* ────── 7. Dropdown options (memoised) ────── */
  const dropdownOptions = useMemo(
    () => ({
      countries: countries.map((c) => ({ value: c.id, label: c.name })),
      states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
      districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
      cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
      centers: centers.map((c) => ({ value: c.id, label: c.center_name })),
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
      classes,
      subjects,
    ]
  );

  /* ────── 8. UI ────── */
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

          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* ---------- LEVEL (with city clear) ---------- */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Level"
                  value={selectedLevel}
                  options={dropdownOptions.levels}
                  onChange={(e) => {
                    const newLevel = e.target.value;
                    setSelectedLevel(newLevel);
                    if (["level_2", "level_3", "level_4"].includes(newLevel)) {
                      setSelectedCity(""); // Clear city
                    }
                    if (newLevel !== "level_2") setSelectedCenter("");
                  }}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {/* ---------- LOCATION ---------- */}
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

              {/* CITY - HIDDEN FOR LEVEL 2,3,4 */}
              {!hideCity && (
                <Grid item xs={12} sm={6} md={3}>
                  <Dropdown
                    label="City"
                    value={selectedCity}
                    options={dropdownOptions.cities}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedDistrict || isLoading}
                  />
                </Grid>
              )}

              {/* ---------- MULTI SCHOOL ---------- */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Schools (multi)</InputLabel>
                  <Select
                    multiple
                    value={selectedSchoolIds}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes(0)) {
                        setSelectedSchoolIds(
                          selectedSchoolIds.length === schoolOptions.length
                            ? []
                            : schoolOptions.map((s) => s.id)
                        );
                      } else {
                        setSelectedSchoolIds(val.filter((v) => v !== 0));
                      }
                    }}
                    input={<OutlinedInput label="Schools (multi)" />}
                    renderValue={(selected) => {
                      const total = schoolOptions.length;
                      if (selected.length === total && total > 0) {
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            <Chip
                              label={`All Schools (${total})`}
                              size="small"
                              sx={{
                                backgroundColor: "#1230ae",
                                color: "#fff",
                                "& .MuiChip-label": { color: "#fff" },
                              }}
                            />
                          </Box>
                        );
                      }
                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((id) => {
                            const sch = schoolOptions.find((s) => s.id === id);
                            return (
                              <Chip
                                key={id}
                                label={sch?.name ?? id}
                                size="small"
                                sx={{
                                  backgroundColor: "#1230ae",
                                  color: "#fff",
                                  "& .MuiChip-label": { color: "#fff" },
                                }}
                              />
                            );
                          })}
                        </Box>
                      );
                    }}
                  >
                    <MenuItem value={0}>
                      <em>
                        {selectedSchoolIds.length === schoolOptions.length
                          ? "Deselect All"
                          : "Select All"}
                      </em>
                    </MenuItem>
                    {schoolOptions.map((sch) => (
                      <MenuItem key={sch.id} value={sch.id}>
                        {sch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* ---------- CLASSES & SUBJECTS ---------- */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Classes</InputLabel>
                  <Select
                    label="Classes"
                    multiple
                    value={selectedClassIds}
                    onChange={(e) => setSelectedClassIds(e.target.value)}
                    renderValue={(sel) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {sel.map((id) => {
                          const cls = classes.find((c) => c.id === id);
                          return (
                            <Chip
                              key={id}
                              label={cls?.name ?? id}
                              size="small"
                              sx={{
                                backgroundColor: "#1230ae",
                                color: "#fff",
                                "& .MuiChip-label": { color: "#fff" },
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {classes.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
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
                    label="Subjects"
                    multiple
                    value={selectedSubjectIds}
                    onChange={(e) => setSelectedSubjectIds(e.target.value)}
                    renderValue={(sel) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {sel.map((id) => {
                          const sub = subjects.find((s) => s.id === id);
                          return (
                            <Chip
                              key={id}
                              label={sub?.name ?? id}
                              size="small"
                              sx={{
                                backgroundColor: "#1230ae",
                                color: "#fff",
                                "& .MuiChip-label": { color: "#fff" },
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {subjects.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  label="Question Set"
                  value={omrSet}
                  options={dropdownOptions.omrSets}
                  onChange={(e) => setOmrSet(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>

              {/* ---------- CENTER (only level 2) ---------- */}
              {selectedLevel === "level_2" && (
                <Grid item xs={12} sm={6} md={3}>
                  <Dropdown
                    label="Center"
                    value={selectedCenter}
                    options={dropdownOptions.centers}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    disabled={isLoading || !centers.length}
                  />
                </Grid>
              )}
            </Grid>

            {/* ---------- STUDENT SUMMARY ---------- */}
            <Box mt={3} mb={3}>
              {totalCount > 0 ? (
                <Typography variant="h6" color="primary">
                  Total Students: {totalCount}
                </Typography>
              ) : (
                selectedSchoolIds.length > 0 &&
                selectedClassIds.length > 0 &&
                selectedSubjectIds.length > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    No students found for the selected criteria
                  </Typography>
                )
              )}
            </Box>

            {/* ---------- STUDENT TABLE ---------- */}
            {students.length > 0 && (
              <Box mt={3} mb={3}>
                <TableContainer>
                  <Table sx={{ borderCollapse: "collapse" }}>
                    <TableHead>
                      <TableRow>
                        {[
                          "Student Name",
                          "Roll Number",
                          "Class",
                          "Subject",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              border: "1px solid #ccc",
                              backgroundColor: "#1976d2",
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedStudents.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {s.student_name || "N/A"}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {s.roll_no || "N/A"}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {s.class_name || "N/A"}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {s.subject_name || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                  }}
                >
                  <ButtonComp
                    text={<UilAngleLeftB />}
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                  />
                  <Typography variant="body2">
                    Page {page} of {totalPages} ({totalRecords} records)
                  </Typography>
                  <ButtonComp
                    text={<UilAngleRightB />}
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                  />
                </div>
              </Box>
            )}

            {/* ---------- ACTION BUTTONS ---------- */}
            <Box
              className={`${styles.buttonContainer} mt-4`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={
                  !selectedSchoolIds.length ||
                  !selectedClassIds.length ||
                  !selectedSubjectIds.length ||
                  !selectedLevel ||
                  !selectedModel ||
                  !omrSet ||
                  (selectedLevel === "level_2" && !selectedCenter) ||
                  (!hideCity && !selectedCity) ||
                  isLoading ||
                  isGenerating ||
                  !totalCount
                }
                text={isGenerating ? "Generating…" : "Generate PDF"}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                onClick={() => navigate("/omr-list")}
                disabled={isLoading || isGenerating}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </form>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
