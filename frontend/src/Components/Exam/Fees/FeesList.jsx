// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   Box,
//   Chip,
//   Card,
//   CardContent,
//   CircularProgress,
//   MenuItem,
//   Button,
//   InputAdornment,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CardHeader,
//   IconButton,
// } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./fees.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import * as XLSX from "xlsx";
// import "../../Common-Css/Swallfire.css";

// // Reusable Dropdown Component
// const Dropdown = ({ label, value, options, onChange, disabled, multiple }) => (
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
//     SelectProps={{
//       multiple,
//       renderValue: (selected) =>
//         multiple && Array.isArray(selected) ? (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//             {selected.map((value) => (
//               <Chip
//                 key={value}
//                 label={
//                   options.find((option) => option.value === value)?.label ||
//                   value
//                 }
//                 size="small"
//                 sx={{ backgroundColor: "#1230AE", color: "#fff" }}
//               />
//             ))}
//           </Box>
//         ) : (
//           options.find((option) => option.value === selected)?.label || selected
//         ),
//     }}
//   >
//     {options.map((option) => (
//       <MenuItem key={option.value} value={option.value}>
//         {option.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// const FeesList = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [schoolData, setSchoolData] = useState(null);
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
//   const [expandedSchools, setExpandedSchools] = useState({});
//   const [formData, setFormData] = useState({});
//   // Pagination states
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const pageSizes = [5, 10, 25];
//   const totalRecords = Array.isArray(schoolData) ? schoolData.length : 0;
//   const totalPages = Math.ceil(totalRecords / pageSize);
//   const navigate = useNavigate();

//   // Fixed subject order sequence (GIMO, GISO, GIEO, GICO, GIKO, GIDO)
//   const fixedSubjectOrder = ["GIMO", "GISO", "GIEO", "GICO", "GIKO", "GIDO"];

//   // Reusable function to get sorted unique subjects (fixed order first, then alphabetical)
//   const getSortedSubjects = (subjectSummary) => {
//     if (!subjectSummary?.classes) return [];
//     const allSubjects = new Set();
//     Object.values(subjectSummary.classes).forEach((classData) => {
//       Object.keys(classData).forEach((subj) => allSubjects.add(subj));
//     });
//     const subjects = Array.from(allSubjects);
//     return subjects.sort((a, b) => {
//       const indexA = fixedSubjectOrder.indexOf(a);
//       const indexB = fixedSubjectOrder.indexOf(b);
//       if (indexA !== -1 && indexB !== -1) {
//         return indexA - indexB;
//       } else if (indexA !== -1) {
//         return -1;
//       } else if (indexB !== -1) {
//         return 1;
//       } else {
//         return a.localeCompare(b);
//       }
//     });
//   };

//   // Fetch initial dropdown data
//   useEffect(() => {
//     let isMounted = true;

//     const fetchInitialData = async () => {
//       try {
//         setIsLoading(true);
//         const [countriesRes, statesRes, districtsRes, citiesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//           ]);

//         if (isMounted) {
//           setCountries(countriesRes.data || []);
//           setStates(statesRes.data || []);
//           setDistricts(districtsRes.data || []);
//           setCities(citiesRes.data || []);
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

//   // Set default country to India
//   useEffect(() => {
//     if (countries.length > 0 && !selectedCountry) {
//       const india = countries.find((c) => c.name.toLowerCase() === "india");
//       if (india) {
//         setSelectedCountry(india.id);
//       }
//     }
//   }, [countries, selectedCountry]);

//   // Filter states, districts, cities based on selections
//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSchoolData(null);
//     setFormData({});
//     setExpandedSchools({});
//     setPage(1); // Reset page on filter change
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSchoolData(null);
//     setFormData({});
//     setExpandedSchools({});
//     setPage(1); // Reset page on filter change
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSchoolData(null);
//     setFormData({});
//     setExpandedSchools({});
//     setPage(1); // Reset page on filter change
//   }, [selectedDistrict, cities]);

//   // Fetch schools by location
//   const fetchSchoolsByLocation = useCallback(async () => {
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
//       setFetchError(null);
//       const response = await axios.get(
//         `${API_BASE_URL}/api/get/school-filter`,
//         {
//           params: {
//             country: selectedCountry,
//             state: selectedState,
//             district: selectedDistrict,
//             city: selectedCity,
//           },
//         }
//       );

//       if (response.data.success) {
//         const schoolList = response.data.data.flatMap((location) =>
//           location.schools.map((school) => ({
//             id: school.id,
//             school_name: school.name,
//             country_name: location.country,
//             state_name: location.state,
//             district_name: location.district,
//             city_name: location.city,
//           }))
//         );
//         setSchools(schoolList);
//       } else {
//         setSchools([]);
//         Swal.fire({
//           icon: "warning",
//           title: "No Schools Found",
//           text: "No schools found for the selected location.",
//           confirmButtonColor: "#1230AE",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setFetchError("Failed to fetch schools");
//       setSchools([]);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch schools. Please try again.",
//         confirmButtonColor: "#1230AE",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

//   useEffect(() => {
//     if (selectedCountry && selectedState && selectedDistrict && selectedCity) {
//       fetchSchoolsByLocation();
//     }
//   }, [
//     selectedCountry,
//     selectedState,
//     selectedDistrict,
//     selectedCity,
//     fetchSchoolsByLocation,
//   ]);

//   // Fetch school details when city or school is selected
//   useEffect(() => {
//     const fetchSchoolDetails = async () => {
//       const idToFetch = selectedSchool || selectedCity;
//       if (!idToFetch) {
//         setSchoolData(null);
//         setFormData({});
//         setExpandedSchools({});
//         setPage(1); // Reset page on data change
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setFetchError(null);
//         const response = await axios.get(
//           `${API_BASE_URL}/api/get/fees-report/${idToFetch}`
//         );
//         if (response.data.success) {
//           let data = response.data.data;
//           if (!Array.isArray(data)) {
//             data = [data];
//           }
//           data = data.map((school) => {
//             const schoolInfo = schools.find((s) => s.id === school.id);
//             return {
//               ...school,
//               school_name:
//                 school.name || schoolInfo?.school_name || "Unknown School",
//               country_name:
//                 schoolInfo?.country_name || school.country_name || "N/A",
//               state_name: schoolInfo?.state_name || "N/A",
//               district_name: schoolInfo?.district_name || "N/A",
//               city_name: schoolInfo?.city_name || school.city_name || "N/A",
//             };
//           });
//           setSchoolData(data);

//           // Initialize form data per school
//           const newFormData = {};
//           data.forEach((school) => {
//             const feePerStudent = school.fee_per_student || "150";
//             const enrollmentCount = school.subject_summary?.total_subject || 0;
//             const totalFeeDue = feePerStudent
//               ? (enrollmentCount * parseFloat(feePerStudent)).toString()
//               : "";
//             const feeCollected = school.fee_collected || "";
//             const balance =
//               totalFeeDue && feeCollected
//                 ? (
//                     parseFloat(totalFeeDue) - parseFloat(feeCollected)
//                   ).toString()
//                 : "";
//             newFormData[school.id] = {
//               fee_per_student: feePerStudent,
//               total_fee_due: totalFeeDue,
//               fee_collected: feeCollected,
//               balance: balance,
//             };
//           });
//           setFormData(newFormData);
//         } else {
//           setSchoolData(null);
//           setFormData({});
//           setExpandedSchools({});
//           setPage(1); // Reset page on data change
//           Swal.fire({
//             icon: "warning",
//             title: "No Data Found",
//             text: "No data found for the selection.",
//             confirmButtonColor: "#1230AE",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching details:", error);
//         setFetchError("Failed to fetch details");
//         setSchoolData(null);
//         setFormData({});
//         setExpandedSchools({});
//         setPage(1); // Reset page on data change
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to fetch details. Please try again.",
//           confirmButtonColor: "#1230AE",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSchoolDetails();
//   }, [selectedCity, selectedSchool, schools]);

//   // Handle input changes and calculations per school
//   const handleInputChange = (schoolId, e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const schoolForm = { ...prev[schoolId], [name]: value };
//       const enrollmentCount = getEnrollmentCount(schoolId);
//       const feePerStudent =
//         name === "fee_per_student" ? value : schoolForm.fee_per_student;
//       const feeCollected =
//         name === "fee_collected" ? value : schoolForm.fee_collected;
//       schoolForm.total_fee_due = feePerStudent
//         ? (enrollmentCount * parseFloat(feePerStudent)).toString()
//         : "";
//       schoolForm.balance =
//         schoolForm.total_fee_due && feeCollected
//           ? (
//               parseFloat(schoolForm.total_fee_due) - parseFloat(feeCollected)
//             ).toString()
//           : "";
//       return { ...prev, [schoolId]: schoolForm };
//     });
//   };

//   const getEnrollmentCount = (schoolId) => {
//     const school = Array.isArray(schoolData)
//       ? schoolData.find((s) => s.id === schoolId)
//       : schoolData;
//     return school?.subject_summary?.total_subject || 0;
//   };

//   // Toggle expansion for a school
//   const toggleBreakdown = (schoolId) => {
//     setExpandedSchools((prev) => ({ ...prev, [schoolId]: !prev[schoolId] }));
//   };

//   // Calculate aggregate summary
//   const getAggregateSummary = () => {
//     let totalDue = 0;
//     let totalCollected = 0;
//     let totalBalance = 0;
//     Object.values(formData).forEach((fd) => {
//       totalDue += parseFloat(fd.total_fee_due) || 0;
//       totalCollected += parseFloat(fd.fee_collected) || 0;
//       totalBalance += parseFloat(fd.balance) || 0;
//     });
//     return { totalDue, totalCollected, totalBalance };
//   };

//   // Download Excel for multiple schools
//   const handleDownloadExcel = () => {
//     if (!schoolData || !Array.isArray(schoolData)) return;

//     const feeData = schoolData.map((school) => ({
//       "School Name": school.school_name || "N/A",
//       Country: school.country_name || "N/A",
//       State: school.state_name || "N/A",
//       District: school.district_name || "N/A",
//       City: school.city_name || "N/A",
//       "Registered Enrollments": school.subject_summary?.total_subject || "N/A",
//       "Fee per Student (₹)": formData[school.id]?.fee_per_student || "N/A",
//       "Total Fee Due (₹)": formData[school.id]?.total_fee_due || "N/A",
//       "Fee Collected (₹)": formData[school.id]?.fee_collected || "N/A",
//       "Balance (₹)": formData[school.id]?.balance || "N/A",
//     }));

//     // Add total row
//     const { totalDue, totalCollected, totalBalance } = getAggregateSummary();
//     feeData.push({
//       "School Name": "Total",
//       Country: "",
//       State: "",
//       District: "",
//       City: "",
//       "Registered Enrollments": "",
//       "Fee per Student (₹)": "",
//       "Total Fee Due (₹)": totalDue,
//       "Fee Collected (₹)": totalCollected,
//       "Balance (₹)": totalBalance,
//     });

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(feeData);
//     XLSX.utils.book_append_sheet(wb, ws, "Fee Report");

//     // Add subject summary per school
//     schoolData.forEach((school, index) => {
//       if (school.subject_summary) {
//         const classes = Object.keys(school.subject_summary.classes).sort(
//           (a, b) => a.localeCompare(b, undefined, { numeric: true })
//         );
//         // Updated: Use getSortedSubjects for fixed sequence order
//         const subjects = getSortedSubjects(school.subject_summary);

//         const summaryData = classes.map((className) => {
//           const rowData = school.subject_summary.classes[className];
//           const row = { CLASS: className };
//           let grandTotal = 0;
//           subjects.forEach((subj) => {
//             const count = rowData[subj] || 0;
//             row[subj.toUpperCase()] = count;
//             grandTotal += count;
//           });
//           row["Grand Total"] = grandTotal;
//           return row;
//         });

//         // Grand total row
//         const grandTotalRow = { CLASS: "Grand Total" };
//         let overallTotal = 0;
//         subjects.forEach((subj) => {
//           let colTotal = 0;
//           classes.forEach((className) => {
//             colTotal += school.subject_summary.classes[className][subj] || 0;
//           });
//           grandTotalRow[subj.toUpperCase()] = colTotal;
//           overallTotal += colTotal;
//         });
//         grandTotalRow["Grand Total"] = overallTotal;
//         summaryData.push(grandTotalRow);

//         const ws2 = XLSX.utils.json_to_sheet(summaryData);
//         XLSX.utils.book_append_sheet(wb, ws2, `Subject Summary ${index + 1}`);
//       }
//     });

//     const fileName = selectedSchool
//       ? `${schoolData[0].school_name}_Fee_Report.xlsx`
//       : `${
//           cities.find((c) => c.id === selectedCity)?.name || "City"
//         }_Fee_Report.xlsx`;
//     XLSX.writeFile(wb, fileName);
//   };

//   // Get unique subjects for a school (updated to use fixed order)
//   const getUniqueSubjects = getSortedSubjects;

//   // Pagination handlers
//   const handlePreviousPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) {
//       setPage(page + 1);
//     }
//   };

//   const dropdownOptions = {
//     countries: countries.map((c) => ({ value: c.id, label: c.name })),
//     states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
//     districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
//     cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
//     schools: schools.map((s) => ({
//       value: s.id,
//       label: `${s.school_name}`,
//     })),
//   };

//   const renderSchoolRow = (school) => {
//     const uniqueSubjects = getUniqueSubjects(school.subject_summary);
//     const isExpanded = expandedSchools[school.id];
//     const fd = formData[school.id] || {};

//     return (
//       <React.Fragment key={school.id}>
//         <TableRow>
//           <TableCell>
//             <IconButton size="small" onClick={() => toggleBreakdown(school.id)}>
//               {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//             </IconButton>
//           </TableCell>
//           <TableCell className={styles.tablecell}>
//             {school.school_name || "N/A"}
//           </TableCell>
//           <TableCell className={styles.tablecell}>
//             {school.subject_summary?.total_subject || "N/A"}
//           </TableCell>
//           <TableCell className={styles.tablecell}>
//             <TextField
//               name="fee_per_student"
//               value={fd.fee_per_student}
//               onChange={(e) => handleInputChange(school.id, e)}
//               variant="outlined"
//               size="small"
//               type="number"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">₹</InputAdornment>
//                 ),
//               }}
//               sx={{ minWidth: 100 }}
//             />
//           </TableCell>
//           <TableCell className={styles.tablecell}>
//             <TextField
//               name="total_fee_due"
//               value={fd.total_fee_due}
//               variant="outlined"
//               size="small"
//               type="number"
//               InputProps={{
//                 readOnly: true,
//                 startAdornment: (
//                   <InputAdornment position="start">₹</InputAdornment>
//                 ),
//               }}
//               sx={{ minWidth: 100 }}
//             />
//           </TableCell>
//           <TableCell className={styles.tablecell}>
//             <TextField
//               name="fee_collected"
//               value={fd.fee_collected}
//               onChange={(e) => handleInputChange(school.id, e)}
//               variant="outlined"
//               size="small"
//               type="number"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">₹</InputAdornment>
//                 ),
//               }}
//               sx={{ minWidth: 100 }}
//             />
//           </TableCell>
//           <TableCell
//             className={styles.tablecell}
//             sx={{ minWidth: 120, whiteSpace: "nowrap" }}
//           >
//             <TextField
//               name="balance"
//               value={fd.balance}
//               variant="outlined"
//               size="small"
//               type="number"
//               InputProps={{
//                 readOnly: true,
//                 startAdornment: (
//                   <InputAdornment position="start">₹</InputAdornment>
//                 ),
//               }}
//               sx={{ minWidth: 100 }}
//             />
//           </TableCell>
//         </TableRow>
//         {isExpanded && school?.subject_summary && (
//           <TableRow>
//             <TableCell colSpan={7}>
//               <Typography variant="h7" align="left" sx={{ mt: 2 }}>
//                 SUBJECTS WISE BREAKDOWN
//               </Typography>
//               <TableContainer className={styles.tableNowContainer}>
//                 <Table
//                   className={styles.tableNowrapone}
//                   sx={{ border: "none" }}
//                 >
//                   <TableHead>
//                     <TableRow
//                       className={styles.tableNowrap}
//                       sx={{ backgroundColor: "#1230AE" }}
//                     >
//                       <TableCell
//                         className={styles.tablecell}
//                         sx={{ color: "#fff" }}
//                       >
//                         CLASS
//                       </TableCell>
//                       {uniqueSubjects.map((subj) => (
//                         <TableCell
//                           className={styles.tablecell}
//                           key={subj}
//                           sx={{ color: "#fff" }}
//                         >
//                           {subj.toUpperCase()}
//                         </TableCell>
//                       ))}
//                       <TableCell
//                         className={styles.tablecell}
//                         sx={{ color: "#fff" }}
//                       >
//                         Grand Total
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {Object.keys(school.subject_summary.classes)
//                       .sort((a, b) =>
//                         a.localeCompare(b, undefined, { numeric: true })
//                       )
//                       .map((className) => {
//                         const classData =
//                           school.subject_summary.classes[className];
//                         let rowTotal = 0;
//                         return (
//                           <TableRow key={className}>
//                             <TableCell className={styles.tablecell}>
//                               {className}
//                             </TableCell>
//                             {uniqueSubjects.map((subj) => {
//                               const count = classData[subj] || 0;
//                               rowTotal += count;
//                               return (
//                                 <TableCell
//                                   className={styles.tablecell}
//                                   key={subj}
//                                 >
//                                   {count}
//                                 </TableCell>
//                               );
//                             })}
//                             <TableCell className={styles.tablecell}>
//                               {rowTotal}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     <TableRow sx={{ backgroundColor: "#1230AE" }}>
//                       <TableCell
//                         className={styles.tablecell}
//                         sx={{ fontWeight: "bold", color: "#ffff" }}
//                       >
//                         Grand Total
//                       </TableCell>
//                       {uniqueSubjects.map((subj) => {
//                         let colTotal = 0;
//                         Object.keys(school.subject_summary.classes).forEach(
//                           (className) => {
//                             colTotal +=
//                               school.subject_summary.classes[className][subj] ||
//                               0;
//                           }
//                         );
//                         return (
//                           <TableCell
//                             className={styles.tablecell}
//                             key={subj}
//                             sx={{ fontWeight: "bold", color: "#ffff" }}
//                           >
//                             {colTotal}
//                           </TableCell>
//                         );
//                       })}
//                       <TableCell
//                         className={styles.tablecell}
//                         sx={{ fontWeight: "bold", color: "#ffff" }}
//                       >
//                         {school.subject_summary.total_subject || 0}
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </TableCell>
//           </TableRow>
//         )}
//       </React.Fragment>
//     );
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "Fees" }]} />
//       </div>
//       <Container component="main" maxWidth="xl">
//         <Paper
//           className={styles.main}
//           elevation={3}
//           sx={{ padding: 3, marginTop: 2, borderRadius: 2 }}
//         >
//           <Typography variant="h5" className={styles.formTitle} sx={{ mb: 2 }}>
//             School Wise Fee Status
//           </Typography>
//           {fetchError && (
//             <Typography color="error" gutterBottom>
//               {fetchError}
//             </Typography>
//           )}
//           <form noValidate autoComplete="off">
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={1.7}>
//                 <Dropdown
//                   label="Country"
//                   value={selectedCountry}
//                   options={dropdownOptions.countries}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                   disabled={isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={1.7}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={dropdownOptions.states}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry || isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={1.7}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={dropdownOptions.districts}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState || isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={2.1}>
//                 <Dropdown
//                   label="City"
//                   value={selectedCity}
//                   options={dropdownOptions.cities}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   disabled={!selectedDistrict || isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="School (Optional)"
//                   value={selectedSchool}
//                   options={dropdownOptions.schools}
//                   onChange={(e) => setSelectedSchool(e.target.value)}
//                   disabled={isLoading || !selectedCity}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={1.8}>
//                 <Button
//                   variant="contained"
//                   sx={{ backgroundColor: "#8fd14f", mt: 2, ml: 4 }}
//                   onClick={handleDownloadExcel}
//                   disabled={!schoolData || schoolData.length === 0}
//                 >
//                   Download Excel
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>

//           {isLoading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//               <CircularProgress sx={{ color: "#1230AE" }} />
//             </Box>
//           ) : (
//             <Box id="report-content" mt={4}>
//               <Grid container spacing={3}>
//                 {/* Main Table: School Details */}
//                 <Grid item xs={12} md={9}>
//                   <TableContainer className={styles.tableNowContainer}>
//                     <Table
//                       className={styles.tableNowrapone}
//                       sx={{ border: "none" }}
//                     >
//                       <TableHead>
//                         <TableRow
//                           className={styles.tableNowrap}
//                           sx={{ backgroundColor: "#1230AE" }}
//                         >
//                           <TableCell sx={{ width: "40px" }} />
//                           <TableCell sx={{ color: "#fff" }}>
//                             School Name
//                           </TableCell>
//                           <TableCell sx={{ color: "#fff" }}>
//                             Registered Subjects
//                           </TableCell>
//                           <TableCell sx={{ color: "#fff" }}>
//                             Fee of subject
//                           </TableCell>
//                           <TableCell sx={{ color: "#fff" }}>
//                             Total Fee Due
//                           </TableCell>
//                           <TableCell sx={{ color: "#fff" }}>
//                             Fee Collected
//                           </TableCell>
//                           <TableCell sx={{ color: "#fff" }}>Balance</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {schoolData &&
//                         Array.isArray(schoolData) &&
//                         schoolData.length > 0 ? (
//                           schoolData
//                             .slice((page - 1) * pageSize, page * pageSize)
//                             .map(renderSchoolRow)
//                         ) : (
//                           <TableRow>
//                             <TableCell colSpan={7} align="center">
//                               <Typography variant="body2" color="textSecondary">
//                                 Select a city or school to display details
//                               </Typography>
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   {schoolData &&
//                     Array.isArray(schoolData) &&
//                     schoolData.length > 0 && (
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           flexWrap: "wrap",
//                           marginTop: "8px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             alignItems: "center",
//                             gap: "10px",
//                           }}
//                         >
//                           <select
//                             value={pageSize}
//                             onChange={(e) => {
//                               const selectedSize = parseInt(e.target.value, 10);
//                               setPageSize(selectedSize);
//                               setPage(1);
//                             }}
//                             style={{
//                               width: "55px",
//                               padding: "0px 5px",
//                               height: "30px",
//                               fontSize: "14px",
//                               border: "1px solid rgb(225, 220, 220)",
//                               borderRadius: "2px",
//                               color: "#564545",
//                               fontWeight: "bold",
//                               outline: "none",
//                               transition: "all 0.3s ease",
//                               fontFamily: '"Poppins", sans-serif',
//                             }}
//                           >
//                             {pageSizes.map((size) => (
//                               <option key={size} value={size}>
//                                 {size}
//                               </option>
//                             ))}
//                           </select>
//                           <p
//                             style={{
//                               margin: "auto",
//                               color: "#6C757D",
//                               fontFamily: '"Poppins", sans-serif',
//                               fontSize: "14px",
//                             }}
//                           >
//                             data per Page
//                           </p>
//                         </div>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             margin: "auto",
//                           }}
//                         >
//                           <label style={{ fontFamily: "Nunito, sans-serif" }}>
//                             <p
//                               style={{
//                                 margin: "auto",
//                                 color: "#6C757D",
//                                 fontFamily: '"Poppins", sans-serif',
//                                 fontSize: "14px",
//                               }}
//                             >
//                               {totalRecords} of {page}-{totalPages}
//                             </p>
//                           </label>
//                         </div>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <button
//                             onClick={handlePreviousPage}
//                             disabled={page === 1}
//                             style={{
//                               backgroundColor:
//                                 page === 1 ? "#E0E0E0" : "#F5F5F5",
//                               color: page === 1 ? "#aaa" : "#333",
//                               border: "1px solid #ccc",
//                               borderRadius: "7px",
//                               padding: "3px 3.5px",
//                               width: "33px",
//                               height: "30px",
//                               cursor: page === 1 ? "not-allowed" : "pointer",
//                               transition: "all 0.3s ease",
//                               margin: "0 4px",
//                               fontFamily: '"Poppins", sans-serif',
//                             }}
//                           >
//                             <UilAngleLeftB />
//                           </button>
//                           {Array.from({ length: totalPages }, (_, i) => i + 1)
//                             .filter(
//                               (pg) =>
//                                 pg === 1 ||
//                                 pg === totalPages ||
//                                 Math.abs(pg - page) <= 2
//                             )
//                             .map((pg, index, array) => (
//                               <React.Fragment key={pg}>
//                                 {index > 0 && pg > array[index - 1] + 1 && (
//                                   <span
//                                     style={{
//                                       color: "#aaa",
//                                       fontSize: "14px",
//                                       fontFamily: '"Poppins", sans-serif',
//                                     }}
//                                   >
//                                     ...
//                                   </span>
//                                 )}
//                                 <button
//                                   onClick={() => {
//                                     setPage(pg);
//                                   }}
//                                   style={{
//                                     backgroundColor:
//                                       page === pg ? "#007BFF" : "#F5F5F5",
//                                     color: page === pg ? "#fff" : "#333",
//                                     border:
//                                       page === pg
//                                         ? "1px solid #0056B3"
//                                         : "1px solid #ccc",
//                                     borderRadius: "7px",
//                                     padding: "4px 13.5px",
//                                     height: "30px",
//                                     cursor: "pointer",
//                                     transition: "all 0.3s ease",
//                                     margin: "0 4px",
//                                     fontWeight: page === pg ? "bold" : "normal",
//                                     fontFamily: '"Poppins", sans-serif',
//                                     fontSize: "14px",
//                                   }}
//                                 >
//                                   {pg}
//                                 </button>
//                               </React.Fragment>
//                             ))}
//                           <button
//                             onClick={handleNextPage}
//                             disabled={page === totalPages}
//                             style={{
//                               backgroundColor:
//                                 page === totalPages ? "#E0E0E0" : "#F5F5F5",
//                               color: page === totalPages ? "#aaa" : "#333",
//                               border: "1px solid #ccc",
//                               borderRadius: "7px",
//                               padding: "3px 3.5px",
//                               width: "33px",
//                               height: "30px",
//                               cursor:
//                                 page === totalPages ? "not-allowed" : "pointer",
//                               transition: "all 0.3s ease",
//                               margin: "0 4px",
//                               fontFamily: '"Poppins", sans-serif',
//                             }}
//                           >
//                             <UilAngleRightB />
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                 </Grid>

//                 {/* Fee Summary Card */}
//                 <Grid item xs={12} md={3}>
//                   <Card elevation={3}>
//                     <CardHeader
//                       title="Fee Summary"
//                       className={styles.tableNowrapheader}
//                       sx={{
//                         "& .MuiCardHeader-title": {
//                           fontSize: "inherit",
//                         },
//                       }}
//                     />
//                     <CardContent className={styles.tableNowraptwo}>
//                       {schoolData && schoolData.length > 0 ? (
//                         (() => {
//                           const { totalDue, totalCollected, totalBalance } =
//                             getAggregateSummary();
//                           return (
//                             <>
//                               <TextField
//                                 label="Total Due"
//                                 value={totalDue || "N/A"}
//                                 fullWidth
//                                 variant="outlined"
//                                 size="small"
//                                 InputProps={{
//                                   readOnly: true,
//                                   startAdornment: (
//                                     <InputAdornment position="start">
//                                       ₹
//                                     </InputAdornment>
//                                   ),
//                                 }}
//                                 sx={{ mb: 2 }}
//                               />
//                               <TextField
//                                 label="Total Collected"
//                                 value={totalCollected || "N/A"}
//                                 fullWidth
//                                 variant="outlined"
//                                 size="small"
//                                 InputProps={{
//                                   readOnly: true,
//                                   startAdornment: (
//                                     <InputAdornment position="start">
//                                       ₹
//                                     </InputAdornment>
//                                   ),
//                                 }}
//                                 sx={{ mb: 2 }}
//                               />
//                               <TextField
//                                 label="Total Balance"
//                                 value={totalBalance || "N/A"}
//                                 fullWidth
//                                 variant="outlined"
//                                 size="small"
//                                 InputProps={{
//                                   readOnly: true,
//                                   startAdornment: (
//                                     <InputAdornment position="start">
//                                       ₹
//                                     </InputAdornment>
//                                   ),
//                                 }}
//                                 sx={{ mb: 2 }}
//                               />
//                             </>
//                           );
//                         })()
//                       ) : (
//                         <Typography
//                           variant="body2"
//                           color="textSecondary"
//                           align="center"
//                         >
//                           Select a city or school to view fee summary
//                         </Typography>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Grid>
//             </Box>
//           )}
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default FeesList;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Box,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Button,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardHeader,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./fees.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../../Common-Css/Swallfire.css";

// Reusable Dropdown Component
const Dropdown = ({ label, value, options, onChange, disabled, multiple }) => (
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
    SelectProps={{
      multiple,
      renderValue: (selected) =>
        multiple && Array.isArray(selected) ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={
                  options.find((option) => option.value === value)?.label ||
                  value
                }
                size="small"
                sx={{ backgroundColor: "#1230AE", color: "#fff" }}
              />
            ))}
          </Box>
        ) : (
          options.find((option) => option.value === selected)?.label || selected
        ),
    }}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

const FeesList = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schoolData, setSchoolData] = useState(null);
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
  const [expandedSchools, setExpandedSchools] = useState({});
  const [formData, setFormData] = useState({});
  const [defaultFee, setDefaultFee] = useState("150"); // Initial fallback value
  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 25];
  const totalRecords = Array.isArray(schoolData) ? schoolData.length : 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const navigate = useNavigate();

  // Fixed subject order sequence (GIMO, GISO, GIEO, GICO, GIKO, GIDO)
  const fixedSubjectOrder = ["GIMO", "GISO", "GIEO", "GICO", "GIKO", "GIDO"];

  // Reusable function to get sorted unique subjects (fixed order first, then alphabetical)
  const getSortedSubjects = (subjectSummary) => {
    if (!subjectSummary?.classes) return [];
    const allSubjects = new Set();
    Object.values(subjectSummary.classes).forEach((classData) => {
      Object.keys(classData).forEach((subj) => allSubjects.add(subj));
    });
    const subjects = Array.from(allSubjects);
    return subjects.sort((a, b) => {
      const indexA = fixedSubjectOrder.indexOf(a);
      const indexB = fixedSubjectOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      } else if (indexA !== -1) {
        return -1;
      } else if (indexB !== -1) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });
  };

  // Fetch default subject fee from API
  useEffect(() => {
    const fetchDefaultFee = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/fee/get-all`);
        console.log("API Response for subject fee:", response.data); // Debug log
        // Handle case where response is an array directly
        if (Array.isArray(response.data) && response.data.length > 0) {
          const feeData = response.data[0];
          const subjectFee = feeData.subject_fee?.toString();
          if (subjectFee) {
            setDefaultFee(subjectFee);
            console.log("Subject fee set to:", subjectFee);
          } else {
            console.warn("No subject_fee found in API response");
            Swal.fire({
              icon: "warning",
              title: "No Fee Data",
              text: "No subject fee data found, using default value of 150.",
              confirmButtonColor: "#1230AE",
            });
          }
        } else {
          console.warn("API response is empty or invalid:", response.data);
          Swal.fire({
            icon: "warning",
            title: "No Fee Data",
            text: "No subject fee data found, using default value of 150.",
            confirmButtonColor: "#1230AE",
          });
        }
      } catch (error) {
        console.error("Error fetching default subject fee:", error.message);
        setFetchError("Failed to fetch default subject fee");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to fetch subject fee: ${error.message}. Using default value of 150.`,
          confirmButtonColor: "#1230AE",
        });
      }
    };

    fetchDefaultFee();
  }, []);

  // Fetch initial dropdown data
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [countriesRes, statesRes, districtsRes, citiesRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/countries`),
            axios.get(`${API_BASE_URL}/api/states`),
            axios.get(`${API_BASE_URL}/api/districts`),
            axios.get(`${API_BASE_URL}/api/cities/all/c1`),
          ]);

        if (isMounted) {
          setCountries(countriesRes.data || []);
          setStates(statesRes.data || []);
          setDistricts(districtsRes.data || []);
          setCities(citiesRes.data || []);
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

  // Set default country to India
  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const india = countries.find((c) => c.name.toLowerCase() === "india");
      if (india) {
        setSelectedCountry(india.id);
      }
    }
  }, [countries, selectedCountry]);

  // Filter states, districts, cities based on selections
  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSchoolData(null);
    setFormData({});
    setExpandedSchools({});
    setPage(1); // Reset page on filter change
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSchoolData(null);
    setFormData({});
    setExpandedSchools({});
    setPage(1); // Reset page on filter change
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchool("");
    setSchoolData(null);
    setFormData({});
    setExpandedSchools({});
    setPage(1); // Reset page on filter change
  }, [selectedDistrict, cities]);

  // Fetch schools by location
  const fetchSchoolsByLocation = useCallback(async () => {
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
      setFetchError(null);
      const response = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        {
          params: {
            country: selectedCountry,
            state: selectedState,
            district: selectedDistrict,
            city: selectedCity,
          },
        }
      );

      if (response.data.success) {
        const schoolList = response.data.data.flatMap((location) =>
          location.schools.map((school) => ({
            id: school.id,
            school_name: school.name,
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
          confirmButtonColor: "#1230AE",
        });
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setFetchError("Failed to fetch schools");
      setSchools([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch schools. Please try again.",
        confirmButtonColor: "#1230AE",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  useEffect(() => {
    if (selectedCountry && selectedState && selectedDistrict && selectedCity) {
      fetchSchoolsByLocation();
    }
  }, [
    selectedCountry,
    selectedState,
    selectedDistrict,
    selectedCity,
    fetchSchoolsByLocation,
  ]);

  // Fetch school details when city or school is selected
  // useEffect(() => {
  //   const fetchSchoolDetails = async () => {
  //     const idToFetch = selectedSchool || selectedCity;
  //     if (!idToFetch) {
  //       setSchoolData(null);
  //       setFormData({});
  //       setExpandedSchools({});
  //       setPage(1); // Reset page on data change
  //       return;
  //     }

  //     try {
  //       setIsLoading(true);
  //       setFetchError(null);
  //       const response = await axios.get(
  //         `${API_BASE_URL}/api/get/fees-report/${idToFetch}`
  //       );
  //       if (response.data.success) {
  //         let data = response.data.data;
  //         if (!Array.isArray(data)) {
  //           data = [data];
  //         }
  //         data = data.map((school) => {
  //           const schoolInfo = schools.find((s) => s.id === school.id);
  //           return {
  //             ...school,
  //             school_name:
  //               school.name || schoolInfo?.school_name || "Unknown School",
  //             country_name:
  //               schoolInfo?.country_name || school.country_name || "N/A",
  //             state_name: schoolInfo?.state_name || "N/A",
  //             district_name: schoolInfo?.district_name || "N/A",
  //             city_name: schoolInfo?.city_name || school.city_name || "N/A",
  //           };
  //         });
  //         setSchoolData(data);

  //         // Initialize form data per school with dynamic defaultFee
  //         const newFormData = {};
  //         data.forEach((school) => {
  //           const feePerStudent = school.fee_per_student || defaultFee; // Use defaultFee from API
  //           const enrollmentCount = school.subject_summary?.total_subject || 0;
  //           const totalFeeDue = feePerStudent
  //             ? (enrollmentCount * parseFloat(feePerStudent)).toString()
  //             : "";
  //           const feeCollected = school.fee_collected || "";
  //           const balance =
  //             totalFeeDue && feeCollected
  //               ? (
  //                   parseFloat(totalFeeDue) - parseFloat(feeCollected)
  //                 ).toString()
  //               : "";
  //           newFormData[school.id] = {
  //             fee_per_student: feePerStudent,
  //             total_fee_due: totalFeeDue,
  //             fee_collected: feeCollected,
  //             balance: balance,
  //           };
  //         });
  //         setFormData(newFormData);
  //       } else {
  //         setSchoolData(null);
  //         setFormData({});
  //         setExpandedSchools({});
  //         setPage(1); // Reset page on data change
  //         Swal.fire({
  //           icon: "warning",
  //           title: "No Data Found",
  //           text: "No data found for the selection.",
  //           confirmButtonColor: "#1230AE",
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching details:", error);
  //       setFetchError("Failed to fetch details");
  //       setSchoolData(null);
  //       setFormData({});
  //       setExpandedSchools({});
  //       setPage(1); // Reset page on data change
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Failed to fetch details. Please try again.",
  //         confirmButtonColor: "#1230AE",
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchSchoolDetails();
  // }, [selectedCity, selectedSchool, schools, defaultFee]);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      const idToFetch = selectedSchool || selectedCity;
      const sessionId = localStorage.getItem("currentSessionId") || null;

      if (!idToFetch) {
        setSchoolData(null);
        setFormData({});
        setExpandedSchools({});
        setPage(1);
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);

        const response = await axios.get(
          `${API_BASE_URL}/api/get/fees-report/${idToFetch}`,
          {
            params: { session_id: sessionId }, // ✅ Pass session ID
          }
        );

        if (response.data.success) {
          let data = response.data.data;
          if (!Array.isArray(data)) {
            data = [data];
          }

          data = data.map((school) => {
            const schoolInfo = schools.find((s) => s.id === school.id);
            return {
              ...school,
              school_name:
                school.name || schoolInfo?.school_name || "Unknown School",
              country_name:
                schoolInfo?.country_name || school.country_name || "N/A",
              state_name: schoolInfo?.state_name || "N/A",
              district_name: schoolInfo?.district_name || "N/A",
              city_name: schoolInfo?.city_name || school.city_name || "N/A",
            };
          });

          setSchoolData(data);

          // Initialize form data per school with dynamic defaultFee
          const newFormData = {};
          data.forEach((school) => {
            const feePerStudent = school.fee_per_student || defaultFee;
            const enrollmentCount = school.subject_summary?.total_subject || 0;
            const totalFeeDue = feePerStudent
              ? (enrollmentCount * parseFloat(feePerStudent)).toString()
              : "";
            const feeCollected = school.fee_collected || "";
            const balance =
              totalFeeDue && feeCollected
                ? (
                    parseFloat(totalFeeDue) - parseFloat(feeCollected)
                  ).toString()
                : "";
            newFormData[school.id] = {
              fee_per_student: feePerStudent,
              total_fee_due: totalFeeDue,
              fee_collected: feeCollected,
              balance: balance,
            };
          });
          setFormData(newFormData);
        } else {
          setSchoolData(null);
          setFormData({});
          setExpandedSchools({});
          setPage(1);
          Swal.fire({
            icon: "warning",
            title: "No Data Found",
            text: "No data found for the selection.",
            confirmButtonColor: "#1230AE",
          });
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        setFetchError("Failed to fetch details");
        setSchoolData(null);
        setFormData({});
        setExpandedSchools({});
        setPage(1);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch details. Please try again.",
          confirmButtonColor: "#1230AE",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [selectedCity, selectedSchool, schools, defaultFee]);



  // Handle input changes and calculations per school
  const handleInputChange = (schoolId, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const schoolForm = { ...prev[schoolId], [name]: value };
      const enrollmentCount = getEnrollmentCount(schoolId);
      const feePerStudent =
        name === "fee_per_student" ? value : schoolForm.fee_per_student;
      const feeCollected =
        name === "fee_collected" ? value : schoolForm.fee_collected;
      schoolForm.total_fee_due = feePerStudent
        ? (enrollmentCount * parseFloat(feePerStudent)).toString()
        : "";
      schoolForm.balance =
        schoolForm.total_fee_due && feeCollected
          ? (
              parseFloat(schoolForm.total_fee_due) - parseFloat(feeCollected)
            ).toString()
          : "";
      return { ...prev, [schoolId]: schoolForm };
    });
  };

  const getEnrollmentCount = (schoolId) => {
    const school = Array.isArray(schoolData)
      ? schoolData.find((s) => s.id === schoolId)
      : schoolData;
    return school?.subject_summary?.total_subject || 0;
  };

  // Toggle expansion for a school
  const toggleBreakdown = (schoolId) => {
    setExpandedSchools((prev) => ({ ...prev, [schoolId]: !prev[schoolId] }));
  };

  // Calculate aggregate summary
  const getAggregateSummary = () => {
    let totalDue = 0;
    let totalCollected = 0;
    let totalBalance = 0;
    Object.values(formData).forEach((fd) => {
      totalDue += parseFloat(fd.total_fee_due) || 0;
      totalCollected += parseFloat(fd.fee_collected) || 0;
      totalBalance += parseFloat(fd.balance) || 0;
    });
    return { totalDue, totalCollected, totalBalance };
  };

  // Download Excel for multiple schools
  const handleDownloadExcel = () => {
    if (!schoolData || !Array.isArray(schoolData)) return;

    const feeData = schoolData.map((school) => ({
      "School Name": school.school_name || "N/A",
      Country: school.country_name || "N/A",
      State: school.state_name || "N/A",
      District: school.district_name || "N/A",
      City: school.city_name || "N/A",
      "Registered Enrollments": school.subject_summary?.total_subject || "N/A",
      "Fee per Student (₹)": formData[school.id]?.fee_per_student || "N/A",
      "Total Fee Due (₹)": formData[school.id]?.total_fee_due || "N/A",
      "Fee Collected (₹)": formData[school.id]?.fee_collected || "N/A",
      "Balance (₹)": formData[school.id]?.balance || "N/A",
    }));

    // Add total row
    const { totalDue, totalCollected, totalBalance } = getAggregateSummary();
    feeData.push({
      "School Name": "Total",
      Country: "",
      State: "",
      District: "",
      City: "",
      "Registered Enrollments": "",
      "Fee per Student (₹)": "",
      "Total Fee Due (₹)": totalDue,
      "Fee Collected (₹)": totalCollected,
      "Balance (₹)": totalBalance,
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(feeData);
    XLSX.utils.book_append_sheet(wb, ws, "Fee Report");

    // Add subject summary per school
    schoolData.forEach((school, index) => {
      if (school.subject_summary) {
        const classes = Object.keys(school.subject_summary.classes).sort(
          (a, b) => a.localeCompare(b, undefined, { numeric: true })
        );
        const subjects = getSortedSubjects(school.subject_summary);

        const summaryData = classes.map((className) => {
          const rowData = school.subject_summary.classes[className];
          const row = { CLASS: className };
          let grandTotal = 0;
          subjects.forEach((subj) => {
            const count = rowData[subj] || 0;
            row[subj.toUpperCase()] = count;
            grandTotal += count;
          });
          row["Grand Total"] = grandTotal;
          return row;
        });

        // Grand total row
        const grandTotalRow = { CLASS: "Grand Total" };
        let overallTotal = 0;
        subjects.forEach((subj) => {
          let colTotal = 0;
          classes.forEach((className) => {
            colTotal += school.subject_summary.classes[className][subj] || 0;
          });
          grandTotalRow[subj.toUpperCase()] = colTotal;
          overallTotal += colTotal;
        });
        grandTotalRow["Grand Total"] = overallTotal;
        summaryData.push(grandTotalRow);

        const ws2 = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws2, `Subject Summary ${index + 1}`);
      }
    });

    const fileName = selectedSchool
      ? `${schoolData[0].school_name}_Fee_Report.xlsx`
      : `${
          cities.find((c) => c.id === selectedCity)?.name || "City"
        }_Fee_Report.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Get unique subjects for a school
  const getUniqueSubjects = getSortedSubjects;

  // Pagination handlers
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const dropdownOptions = {
    countries: countries.map((c) => ({ value: c.id, label: c.name })),
    states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
    districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
    cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
    schools: schools.map((s) => ({
      value: s.id,
      label: `${s.school_name}`,
    })),
  };

  const renderSchoolRow = (school) => {
    const uniqueSubjects = getUniqueSubjects(school.subject_summary);
    const isExpanded = expandedSchools[school.id];
    const fd = formData[school.id] || {};

    return (
      <React.Fragment key={school.id}>
        <TableRow>
          <TableCell>
            <IconButton size="small" onClick={() => toggleBreakdown(school.id)}>
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell className={styles.tablecell}>
            {school.school_name || "N/A"}
          </TableCell>
          <TableCell className={styles.tablecell}>
            {school.subject_summary?.total_subject || "N/A"}
          </TableCell>
          <TableCell className={styles.tablecell}>
            <TextField
              name="fee_per_student"
              value={fd.fee_per_student || defaultFee} // Use defaultFee dynamically
              onChange={(e) => handleInputChange(school.id, e)}
              variant="outlined"
              size="small"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              sx={{ minWidth: 100 }}
            />
          </TableCell>
          <TableCell className={styles.tablecell}>
            <TextField
              name="total_fee_due"
              value={fd.total_fee_due}
              variant="outlined"
              size="small"
              type="number"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              sx={{ minWidth: 100 }}
            />
          </TableCell>
          <TableCell className={styles.tablecell}>
            <TextField
              name="fee_collected"
              value={fd.fee_collected}
              onChange={(e) => handleInputChange(school.id, e)}
              variant="outlined"
              size="small"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              sx={{ minWidth: 100 }}
            />
          </TableCell>
          <TableCell
            className={styles.tablecell}
            sx={{ minWidth: 120, whiteSpace: "nowrap" }}
          >
            <TextField
              name="balance"
              value={fd.balance}
              variant="outlined"
              size="small"
              type="number"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              sx={{ minWidth: 100 }}
            />
          </TableCell>
        </TableRow>
        {isExpanded && school?.subject_summary && (
          <TableRow>
            <TableCell colSpan={7}>
              <Typography variant="h7" align="left" sx={{ mt: 2 }}>
                SUBJECTS WISE BREAKDOWN
              </Typography>
              <TableContainer className={styles.tableNowContainer}>
                <Table
                  className={styles.tableNowrapone}
                  sx={{ border: "none" }}
                >
                  <TableHead>
                    <TableRow
                      className={styles.tableNowrap}
                      sx={{ backgroundColor: "#1230AE" }}
                    >
                      <TableCell
                        className={styles.tablecell}
                        sx={{ color: "#fff" }}
                      >
                        CLASS
                      </TableCell>
                      {uniqueSubjects.map((subj) => (
                        <TableCell
                          className={styles.tablecell}
                          key={subj}
                          sx={{ color: "#fff" }}
                        >
                          {subj.toUpperCase()}
                        </TableCell>
                      ))}
                      <TableCell
                        className={styles.tablecell}
                        sx={{ color: "#fff" }}
                      >
                        Grand Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(school.subject_summary.classes)
                      .sort((a, b) =>
                        a.localeCompare(b, undefined, { numeric: true })
                      )
                      .map((className) => {
                        const classData =
                          school.subject_summary.classes[className];
                        let rowTotal = 0;
                        return (
                          <TableRow key={className}>
                            <TableCell className={styles.tablecell}>
                              {className}
                            </TableCell>
                            {uniqueSubjects.map((subj) => {
                              const count = classData[subj] || 0;
                              rowTotal += count;
                              return (
                                <TableCell
                                  className={styles.tablecell}
                                  key={subj}
                                >
                                  {count}
                                </TableCell>
                              );
                            })}
                            <TableCell className={styles.tablecell}>
                              {rowTotal}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    <TableRow sx={{ backgroundColor: "#1230AE" }}>
                      <TableCell
                        className={styles.tablecell}
                        sx={{ fontWeight: "bold", color: "#ffff" }}
                      >
                        Grand Total
                      </TableCell>
                      {uniqueSubjects.map((subj) => {
                        let colTotal = 0;
                        Object.keys(school.subject_summary.classes).forEach(
                          (className) => {
                            colTotal +=
                              school.subject_summary.classes[className][subj] ||
                              0;
                          }
                        );
                        return (
                          <TableCell
                            className={styles.tablecell}
                            key={subj}
                            sx={{ fontWeight: "bold", color: "#ffff" }}
                          >
                            {colTotal}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        className={styles.tablecell}
                        sx={{ fontWeight: "bold", color: "#ffff" }}
                      >
                        {school.subject_summary.total_subject || 0}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Fees" }]} />
      </div>
      <Container component="main" maxWidth="xl">
        <Paper
          className={styles.main}
          elevation={3}
          sx={{ padding: 3, marginTop: 2, borderRadius: 2 }}
        >
          <Typography variant="h5" className={styles.formTitle} sx={{ mb: 2 }}>
            School Wise Fee Status
          </Typography>
          {fetchError && (
            <Typography color="error" gutterBottom>
              {fetchError}
            </Typography>
          )}
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={1.7}>
                <Dropdown
                  label="Country"
                  value={selectedCountry}
                  options={dropdownOptions.countries}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1.7}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={dropdownOptions.states}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry || isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1.7}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={dropdownOptions.districts}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState || isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.1}>
                <Dropdown
                  label="City"
                  value={selectedCity}
                  options={dropdownOptions.cities}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDistrict || isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="School (Optional)"
                  value={selectedSchool}
                  options={dropdownOptions.schools}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  disabled={isLoading || !selectedCity}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1.8}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#8fd14f", mt: 2, ml: 4 }}
                  onClick={handleDownloadExcel}
                  disabled={!schoolData || schoolData.length === 0}
                >
                  Download Excel
                </Button>
              </Grid>
            </Grid>
          </form>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress sx={{ color: "#1230AE" }} />
            </Box>
          ) : (
            <Box id="report-content" mt={4}>
              <Grid container spacing={3}>
                {/* Main Table: School Details */}
                <Grid item xs={12} md={9}>
                  <TableContainer className={styles.tableNowContainer}>
                    <Table
                      className={styles.tableNowrapone}
                      sx={{ border: "none" }}
                    >
                      <TableHead>
                        <TableRow
                          className={styles.tableNowrap}
                          sx={{ backgroundColor: "#1230AE" }}
                        >
                          <TableCell sx={{ width: "40px" }} />
                          <TableCell sx={{ color: "#fff" }}>
                            School Name
                          </TableCell>
                          <TableCell sx={{ color: "#fff" }}>
                            Registered Subjects
                          </TableCell>
                          <TableCell sx={{ color: "#fff" }}>
                            Fee of subject
                          </TableCell>
                          <TableCell sx={{ color: "#fff" }}>
                            Total Fee Due
                          </TableCell>
                          <TableCell sx={{ color: "#fff" }}>
                            Fee Collected
                          </TableCell>
                          <TableCell sx={{ color: "#fff" }}>Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {schoolData &&
                        Array.isArray(schoolData) &&
                        schoolData.length > 0 ? (
                          schoolData
                            .slice((page - 1) * pageSize, page * pageSize)
                            .map(renderSchoolRow)
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <Typography variant="body2" color="textSecondary">
                                Select a city or school to display details
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {schoolData &&
                    Array.isArray(schoolData) &&
                    schoolData.length > 0 && (
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
                              fontFamily: '"Poppins", sans-serif',
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
                              fontFamily: '"Poppins", sans-serif',
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
                          <label style={{ fontFamily: "Nunito, sans-serif" }}>
                            <p
                              style={{
                                margin: "auto",
                                color: "#6C757D",
                                fontFamily: '"Poppins", sans-serif',
                                fontSize: "14px",
                              }}
                            >
                              {totalRecords} of {page}-{totalPages}
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
                              backgroundColor:
                                page === 1 ? "#E0E0E0" : "#F5F5F5",
                              color: page === 1 ? "#aaa" : "#333",
                              border: "1px solid #ccc",
                              borderRadius: "7px",
                              padding: "3px 3.5px",
                              width: "33px",
                              height: "30px",
                              cursor: page === 1 ? "not-allowed" : "pointer",
                              transition: "all 0.3s ease",
                              margin: "0 4px",
                              fontFamily: '"Poppins", sans-serif',
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
                                      fontFamily: '"Poppins", sans-serif',
                                    }}
                                  >
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    setPage(pg);
                                  }}
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
                                    fontFamily: '"Poppins", sans-serif',
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
                              cursor:
                                page === totalPages ? "not-allowed" : "pointer",
                              transition: "all 0.3s ease",
                              margin: "0 4px",
                              fontFamily: '"Poppins", sans-serif',
                            }}
                          >
                            <UilAngleRightB />
                          </button>
                        </div>
                      </div>
                    )}
                </Grid>

                {/* Fee Summary Card */}
                <Grid item xs={12} md={3}>
                  <Card elevation={3}>
                    <CardHeader
                      title="Fee Summary"
                      className={styles.tableNowrapheader}
                      sx={{
                        "& .MuiCardHeader-title": {
                          fontSize: "inherit",
                        },
                      }}
                    />
                    <CardContent className={styles.tableNowraptwo}>
                      {schoolData && schoolData.length > 0 ? (
                        (() => {
                          const { totalDue, totalCollected, totalBalance } =
                            getAggregateSummary();
                          return (
                            <>
                              <TextField
                                label="Total Due"
                                value={totalDue || "N/A"}
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      ₹
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{ mb: 2 }}
                              />
                              <TextField
                                label="Total Collected"
                                value={totalCollected || "N/A"}
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      ₹
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{ mb: 2 }}
                              />
                              <TextField
                                label="Total Balance"
                                value={totalBalance || "N/A"}
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      ₹
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{ mb: 2 }}
                              />
                            </>
                          );
                        })()
                      ) : (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          align="center"
                        >
                          Select a city or school to view fee summary
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default FeesList;
