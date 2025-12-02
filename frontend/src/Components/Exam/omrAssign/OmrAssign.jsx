// /* src/Components/Exam/omrReceipt/OMRreceipt.jsx */
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useTransition,
// } from "react";
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
//   CircularProgress,
//   Select,
//   InputLabel,
//   FormControl,
//   Button,
// } from "@mui/material";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import { RxCross2 } from "react-icons/rx";
// import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
// import Swal from "sweetalert2";

// // ====================== LOCAL STORAGE HELPERS ======================
// const STORAGE_KEY = "omr_assign_filters";

// const loadFilters = () => {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     return raw ? JSON.parse(raw) : {};
//   } catch {
//     return {};
//   }
// };

// const saveFilters = (filters) => {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
//   } catch (e) {
//     console.warn("Failed to save filters", e);
//   }
// };

// // ====================== DROPDOWN COMPONENT ======================
// const Dropdown = ({ label, value, options, onChange, disabled }) => (
//   <TextField
//     select
//     label={label}
//     variant="outlined"
//     fullWidth
//     margin="normal"
//     size="small"
//     value={value || ""}
//     onChange={onChange}
//     disabled={disabled}
//     sx={{ backgroundColor: "#fff" }}
//   >
//     {options.map((opt) => (
//       <MenuItem key={opt.value} value={opt.value}>
//         {opt.label}
//       </MenuItem>
//     ))}
//   </TextField>
// );

// // ====================== SWAL TOAST HELPER ======================
// const showSwal = (type, title, timer = 2000) => {
//   Swal.fire({
//     position: "top-end",
//     icon: type,
//     title: title,
//     showConfirmButton: false,
//     timer: timer,
//     toast: true,
//     timerProgressBar: true,
//     background:
//       type === "error" ? "#ffebee" : type === "warning" ? "#fff8e1" : "#e8f5e9",
//     color: "#333",
//     customClass: {
//       popup: "animate__animated animate__fadeInDown animate__faster",
//     },
//   });
// };

// // ====================== MAIN COMPONENT ======================
// const OMRreceipt = () => {
//   /* ====================== STATE ====================== */
//   const [schools, setSchools] = useState([]);
//   const [staffList, setStaffList] = useState([]);
//   const [selectedSchoolId, setSelectedSchoolId] = useState("");
//   const [selectedStaffId, setSelectedStaffId] = useState("");

//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClassIds, setSelectedClassIds] = useState([]);
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

//   const [students, setStudents] = useState([]);
//   const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
//   const [isLoading, setIsLoading] = useState(false);
//   const [fetchError, setFetchError] = useState(null);
//   const [assigning, setAssigning] = useState(false);

//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const pageSizes = [5, 10, 25, 50];
//   const [totalCount, setTotalCount] = useState(0);
//   const [successCount, setSuccessCount] = useState(0);
//   const [pendingCount, setPendingCount] = useState(0);

//   // Location filters
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

//   const [, startTransition] = useTransition();

//   // ====================== LOAD PERSISTED FILTERS ======================
//   useEffect(() => {
//     const saved = loadFilters();

//     if (saved.selectedCountry) setSelectedCountry(saved.selectedCountry);
//     if (saved.selectedState) setSelectedState(saved.selectedState);
//     if (saved.selectedDistrict) setSelectedDistrict(saved.selectedDistrict);
//     if (saved.selectedCity) setSelectedCity(saved.selectedCity);
//     if (saved.selectedSchoolId) setSelectedSchoolId(saved.selectedSchoolId);
//     if (Array.isArray(saved.selectedClassIds))
//       setSelectedClassIds(saved.selectedClassIds);
//     if (Array.isArray(saved.selectedSubjectIds))
//       setSelectedSubjectIds(saved.selectedSubjectIds);

//     if (
//       saved.selectedStaffId &&
//       saved.selectedStaffId !== "0" &&
//       !isNaN(saved.selectedStaffId)
//     ) {
//       setSelectedStaffId(String(saved.selectedStaffId));
//     }

//     if (Object.keys(saved).length) {
//       showSwal("info", "Filters restored from last session.");
//     }
//   }, []);

//   // ====================== SAVE FILTERS ON CHANGE ======================
//   useEffect(() => {
//     const toSave = {
//       selectedCountry,
//       selectedState,
//       selectedDistrict,
//       selectedCity,
//       selectedSchoolId,
//       selectedClassIds,
//       selectedSubjectIds,
//       selectedStaffId: selectedStaffId || null,
//     };
//     saveFilters(toSave);
//   }, [
//     selectedCountry,
//     selectedState,
//     selectedDistrict,
//     selectedCity,
//     selectedSchoolId,
//     selectedClassIds,
//     selectedSubjectIds,
//     selectedStaffId,
//   ]);

//   // ====================== INITIAL DATA ======================
//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const [c, s, d, ci] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//         ]);

//         const countryData = Array.isArray(c?.data) ? c.data : [];
//         const india = countryData.find((c) => c.name.toLowerCase() === "india");
//         if (india && !selectedCountry) setSelectedCountry(india.id);

//         setCountries(countryData);
//         setStates(Array.isArray(s?.data) ? s.data : []);
//         setDistricts(Array.isArray(d?.data) ? d.data : []);
//         setCities(Array.isArray(ci?.data) ? ci.data : []);
//       } catch (e) {
//         showSwal("error", "Failed to load location data.");
//         console.error(e);
//       }
//     };
//     fetchLocation();
//   }, []);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE_URL}/api/class`);
//         setClasses(data.map((c) => ({ value: c.id, label: c.name })));
//       } catch (e) {
//         showSwal("error", "Failed to load classes.");
//         setClasses([]);
//       }
//     };
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE_URL}/api/subject`);
//         setSubjects(data.map((s) => ({ value: s.id, label: s.name })));
//       } catch (e) {
//         showSwal("error", "Failed to load subjects.");
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     const fetchStaff = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE_URL}/api/u1/users`);
//         setStaffList(Array.isArray(data) ? data : []);
//       } catch (e) {
//         showSwal("error", "Failed to load staff.");
//         setStaffList([]);
//       }
//     };
//     fetchStaff();
//   }, []);

//   // ====================== SCHOOLS BY LOCATION ======================
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
//       const { data } = await axios.get(
//         `${API_BASE_URL}/api/get/school-filter`,
//         { params: filters }
//       );
//       if (data.success) {
//         const list = data.data.flatMap((loc) =>
//           loc.schools.map((sch) => ({
//             school_id: sch.id,
//             school_name: sch.name,
//             city_name: loc.city,
//           }))
//         );
//         setSchools(list);
//       } else {
//         setSchools([]);
//         showSwal("warning", "No schools found for selected location.");
//       }
//     } catch (e) {
//       setSchools([]);
//       showSwal("error", "Failed to load schools.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ====================== LOCATION EFFECTS ======================
//   useEffect(() => {
//     if (selectedCountry) {
//       const filtered = states.filter((s) => s.country_id === selectedCountry);
//       setFilteredStates(filtered);
//       fetchSchoolsByLocation({ country: selectedCountry });
//     } else {
//       setFilteredStates([]);
//     }
//     resetFiltersBelow("country");
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       const filtered = districts.filter((d) => d.state_id === selectedState);
//       setFilteredDistricts(filtered);
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//       });
//     } else {
//       setFilteredDistricts([]);
//     }
//     resetFiltersBelow("state");
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       const filtered = cities.filter((c) => c.district_id === selectedDistrict);
//       setFilteredCities(filtered);
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     } else {
//       setFilteredCities([]);
//     }
//     resetFiltersBelow("district");
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
//     resetFiltersBelow("city");
//   }, [selectedCity]);

//   const resetFiltersBelow = (level) => {
//     if (level === "country") {
//       setSelectedState("");
//       setSelectedDistrict("");
//       setSelectedCity("");
//     }
//     if (level === "state") {
//       setSelectedDistrict("");
//       setSelectedCity("");
//     }
//     if (level === "district") setSelectedCity("");
//     setSelectedSchoolId("");
//     setStudents([]);
//     setSelectedStudentIds(new Set());
//     setPage(1);
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

//   // ====================== FETCH STUDENTS ======================
//   const fetchStudents = useCallback(async () => {
//     if (
//       !selectedSchoolId ||
//       !selectedClassIds.length ||
//       !selectedSubjectIds.length
//     ) {
//       setStudents([]);
//       setTotalCount(0);
//       setSuccessCount(0);
//       setPendingCount(0);
//       setSelectedStudentIds(new Set());
//       return;
//     }

//     setIsLoading(true);
//     setFetchError(null);

//     try {
//       const payload = {
//         schoolId: Number(selectedSchoolId),
//         classList: selectedClassIds.map(Number),
//         subjectList: selectedSubjectIds.map(Number),
//         staffId: selectedStaffId ? Number(selectedStaffId) : undefined,
//       };

//       const { data } = await axios.post(
//         `${API_BASE_URL}/api/get/filter/omr-assign`,
//         payload
//       );

//       if (data.success) {
//         const studentsWithKey = (data.students ?? []).map((s) => ({
//           ...s,
//           _key: `${s.student_id}-${s.roll_no}-${s.subject_id || ""}-${
//             s.class_id
//           }`,
//         }));
//         setStudents(studentsWithKey);
//         setTotalCount(data.totalCount ?? 0);
//         setSuccessCount(data.successCount ?? 0);
//         setPendingCount(data.pendingCount ?? 0);
//       } else {
//         throw new Error(data.message || "Unknown error");
//       }
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || err.message || "Failed to load students";
//       setFetchError(msg);
//       showSwal("error", msg);
//       setStudents([]);
//       setTotalCount(0);
//       setSuccessCount(0);
//       setPendingCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedSchoolId, selectedClassIds, selectedSubjectIds, selectedStaffId]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       startTransition(() => {
//         fetchStudents();
//         setPage(1);
//       });
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [fetchStudents]);

//   // ====================== CHECKBOX LOGIC ======================
//   const toggleStudent = (student) => {
//     const newSet = new Set(selectedStudentIds);
//     if (newSet.has(student._key)) {
//       newSet.delete(student._key);
//     } else {
//       newSet.add(student._key);
//     }
//     setSelectedStudentIds(newSet);
//   };

//   const toggleAll = () => {
//     if (selectedStudentIds.size === paginatedStudents.length) {
//       setSelectedStudentIds(new Set());
//     } else {
//       setSelectedStudentIds(new Set(paginatedStudents.map((s) => s._key)));
//     }
//   };

//   // ====================== ASSIGN STAFF ======================
//   const handleAssignStaff = async () => {
//     if (!selectedStaffId) {
//       showSwal("warning", "Please select a staff member first.");
//       return;
//     }
//     if (selectedStudentIds.size === 0) {
//       showSwal("warning", "Please select at least one student.");
//       return;
//     }

//     setAssigning(true);
//     const selected = students.filter((s) => selectedStudentIds.has(s._key));

//     try {
//       const promises = selected.map((s) =>
//         axios.post(`${API_BASE_URL}/api/omr-assign`, {
//           country_id: selectedCountry ? Number(selectedCountry) : null,
//           state_id: selectedState ? Number(selectedState) : null,
//           district_id: selectedDistrict ? Number(selectedDistrict) : null,
//           city_id: selectedCity ? Number(selectedCity) : null,
//           school_id: Number(selectedSchoolId),
//           class_id: Number(s.class_id),
//           subject_id: Number(s.subject_id),
//           roll_no: s.roll_no || null,
//           student_id: Number(s.student_id),
//           student_section: s.student_section || null,
//           staff_id: Number(selectedStaffId),
//         })
//       );

//       const results = await Promise.allSettled(promises);
//       const succeeded = results.filter((r) => r.status === "fulfilled").length;
//       const failed = results.filter((r) => r.status === "rejected").length;

//       const successKeys = new Set();
//       results.forEach((res, i) => {
//         if (res.status === "fulfilled") successKeys.add(selected[i]._key);
//       });

//       setStudents((prev) =>
//         prev.map((s) =>
//           successKeys.has(s._key) ? { ...s, status: "Success" } : s
//         )
//       );

//       setSuccessCount((prev) => prev + succeeded);
//       setPendingCount((prev) => Math.max(0, prev - succeeded));
//       setSelectedStudentIds(new Set());

//       if (failed === 0) {
//         showSwal("success", `Assigned to ${succeeded} student(s).`);
//       } else {
//         showSwal("warning", `Assigned: ${succeeded} | Failed: ${failed}`);
//       }
//     } catch (err) {
//       showSwal("error", "Assignment failed. Please try again.");
//       console.error(err);
//     } finally {
//       setAssigning(false);
//     }
//   };

//   // ====================== CLEAR ALL FILTERS ======================
//   const handleClearAll = () => {
//     setSelectedCountry("");
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolId("");
//     setSelectedClassIds([]);
//     setSelectedSubjectIds([]);
//     setSelectedStaffId("");
//     setStudents([]);
//     setSelectedStudentIds(new Set());
//     setPage(1);
//     localStorage.removeItem(STORAGE_KEY);
//     showSwal("info", "All filters cleared.");
//   };

//   // ====================== PAGINATION ======================
//   const totalPages = Math.ceil(totalCount / pageSize);
//   const paginatedStudents = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return students.slice(start, start + pageSize);
//   }, [students, page, pageSize]);

//   const handlePrev = () => page > 1 && setPage(page - 1);
//   const handleNext = () => page < totalPages && setPage(page + 1);
//   const isAllSelected =
//     paginatedStudents.length > 0 &&
//     selectedStudentIds.size === paginatedStudents.length;

//   const isAssignEnabled = selectedStaffId && selectedStudentIds.size > 0;

//   // ====================== RENDER ======================
//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Assign", link: "" }]} />
//       </div>

//       <Container component="main" maxWidth="">
//         <Paper className={`${styles.main}`} elevation={3}>
//           <Typography className={`${styles.formTitle} mb-4`}>
//             OMR Assign
//           </Typography>

//           {fetchError && (
//             <Typography color="error" sx={{ mb: 2 }}>
//               {fetchError}
//             </Typography>
//           )}

//           <form noValidate autoComplete="off">
//             {/* LOCATION */}
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

//             {/* FILTER ROW */}
//             <Box
//               sx={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 2,
//                 mt: 1,
//                 alignItems: "center",
//               }}
//             >
//               <Box sx={{ flex: "1 1 22%", minWidth: 250 }}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchoolId}
//                   options={schools.map((s) => ({
//                     value: s.school_id,
//                     label: s.school_name,
//                   }))}
//                   onChange={(e) => setSelectedSchoolId(e.target.value)}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Box>

//               <Box sx={{ flex: "1 1 22%", minWidth: 250 }}>
//                 <Autocomplete
//                   multiple
//                   options={classes}
//                   value={selectedClassIds.map((id) => ({
//                     value: id,
//                     label: classes.find((c) => c.value === id)?.label ?? id,
//                   }))}
//                   onChange={(_, nv) =>
//                     setSelectedClassIds(nv.map((i) => i.value))
//                   }
//                   disableCloseOnSelect
//                   getOptionLabel={(o) => o.label}
//                   isOptionEqualToValue={(o, v) => o.value === v.value}
//                   renderOption={(props, opt) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedClassIds.includes(opt.value)}
//                         color="primary"
//                       />
//                       {opt.label}
//                     </li>
//                   )}
//                   renderTags={(tags) =>
//                     tags.map((opt, idx) => (
//                       <span
//                         key={idx}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "#fff",
//                           borderRadius: "4px",
//                           padding: "2px 6px",
//                           fontSize: "11px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                         }}
//                       >
//                         {opt.label}
//                         <RxCross2
//                           size={10}
//                           style={{ marginLeft: 4, cursor: "pointer" }}
//                           onClick={() =>
//                             setSelectedClassIds((prev) =>
//                               prev.filter((i) => i !== opt.value)
//                             )
//                           }
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
//                         style: { fontSize: "0.8rem" },
//                       }}
//                     />
//                   )}
//                 />
//               </Box>

//               <Box sx={{ flex: "1 1 22%", minWidth: 250 }}>
//                 <Autocomplete
//                   multiple
//                   options={subjects}
//                   value={selectedSubjectIds.map((id) => ({
//                     value: id,
//                     label: subjects.find((s) => s.value === id)?.label ?? id,
//                   }))}
//                   onChange={(_, nv) =>
//                     setSelectedSubjectIds(nv.map((i) => i.value))
//                   }
//                   disableCloseOnSelect
//                   getOptionLabel={(o) => o.label}
//                   isOptionEqualToValue={(o, v) => o.value === v.value}
//                   renderOption={(props, opt) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedSubjectIds.includes(opt.value)}
//                         color="primary"
//                       />
//                       {opt.label}
//                     </li>
//                   )}
//                   renderTags={(tags) =>
//                     tags.map((opt, idx) => (
//                       <span
//                         key={idx}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "#fff",
//                           borderRadius: "4px",
//                           padding: "2px 6px",
//                           fontSize: "11px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                         }}
//                       >
//                         {opt.label}
//                         <RxCross2
//                           size={10}
//                           style={{ marginLeft: 4, cursor: "pointer" }}
//                           onClick={() =>
//                             setSelectedSubjectIds((prev) =>
//                               prev.filter((i) => i !== opt.value)
//                             )
//                           }
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
//                         style: { fontSize: "0.8rem" },
//                       }}
//                     />
//                   )}
//                 />
//               </Box>

//               <Box sx={{ flex: "1 1 22%", minWidth: 250 }}>
//                 <FormControl fullWidth size="small" margin="normal">
//                   <InputLabel>Assign Staff</InputLabel>
//                   <Select
//                     value={selectedStaffId || ""}
//                     label="Assign Staff"
//                     onChange={(e) => setSelectedStaffId(e.target.value)}
//                   >
//                     <MenuItem value="">
//                       <em>None</em>
//                     </MenuItem>
//                     {staffList.map((st) => (
//                       <MenuItem key={st.id} value={String(st.id)}>
//                         {st.username}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Box>
//           </form>

//           {/* TABLE SECTION */}
//           <Box
//             mt={4}
//             sx={{
//               background: "#fff",
//               boxShadow: "0 4px 25px rgba(0,0,0,0.06)",
//               borderRadius: "16px",
//               p: 2.5,
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//                 flexWrap: "wrap",
//                 gap: 1,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontFamily: "Poppins, sans-serif",
//                   fontWeight: 700,
//                   color: "#1230ae",
//                 }}
//               >
//                 Students
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleAssignStaff}
//                   disabled={!isAssignEnabled || assigning}
//                   startIcon={assigning ? <CircularProgress size={20} /> : null}
//                   sx={{
//                     textTransform: "none",
//                     fontWeight: 600,
//                     minWidth: "180px",
//                   }}
//                 >
//                   {assigning
//                     ? "Assigning..."
//                     : `Assign Staff (${selectedStudentIds.size})`}
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   color="error"
//                   size="small"
//                   onClick={handleClearAll}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Clear All
//                 </Button>
//               </Box>
//             </Box>

//             {isLoading && (
//               <Box display="flex" justifyContent="center" my={3}>
//                 <CircularProgress />
//               </Box>
//             )}

//             <Table
//               sx={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 background: "#fff",
//                 "& th": {
//                   background: "linear-gradient(90deg, #1230ae, #4169e1)",
//                   color: "#fff",
//                   fontWeight: 700,
//                   fontFamily: "Poppins, sans-serif",
//                   textAlign: "center",
//                   fontSize: "0.9rem",
//                   py: 1.4,
//                   borderRight: "1px solid rgba(255,255,255,0.2)",
//                   "&:last-child": { borderRight: "none" },
//                 },
//                 "& td": {
//                   textAlign: "center",
//                   borderRight: "1px solid #f0f0f0",
//                   borderBottom: "1px solid #f5f5f5",
//                   fontFamily: "'Nunito', sans-serif",
//                   fontSize: "0.9rem",
//                   color: "#333",
//                   py: 1.2,
//                   "&:last-child": { borderRight: "none" },
//                 },
//                 "& tr:hover": {
//                   background:
//                     "linear-gradient(90deg, #f9faff 0%, #edf2ff 100%)",
//                 },
//                 border: "none",
//               }}
//             >
//               <TableHead>
//                 <TableRow>
//                   <TableCell padding="checkbox">
//                     <Checkbox
//                       color="primary"
//                       indeterminate={
//                         selectedStudentIds.size > 0 && !isAllSelected
//                       }
//                       checked={isAllSelected}
//                       onChange={toggleAll}
//                     />
//                   </TableCell>
//                   <TableCell>Student</TableCell>
//                   <TableCell>Roll No</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Section</TableCell>
//                   <TableCell>Subject</TableCell>
//                   <TableCell>Mobile</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {!isLoading && paginatedStudents.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                       {selectedSchoolId &&
//                       selectedClassIds.length &&
//                       selectedSubjectIds.length
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   paginatedStudents.map((s) => {
//                     const isSelected = selectedStudentIds.has(s._key);
//                     return (
//                       <TableRow
//                         key={s._key}
//                         sx={{
//                           backgroundColor: isSelected
//                             ? "rgba(144, 209, 79, 0.1)"
//                             : "inherit",
//                         }}
//                       >
//                         <TableCell padding="checkbox">
//                           <Checkbox
//                             color="primary"
//                             checked={isSelected}
//                             onChange={() => toggleStudent(s)}
//                           />
//                         </TableCell>
//                         <TableCell>{s.student_name || "N/A"}</TableCell>
//                         <TableCell>{s.roll_no || "N/A"}</TableCell>
//                         <TableCell>{s.class_name || "N/A"}</TableCell>
//                         <TableCell>{s.student_section || "N/A"}</TableCell>
//                         <TableCell>{s.subject_names || "N/A"}</TableCell>
//                         <TableCell>{s.mobile_number || "N/A"}</TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>

//             {students.length > 0 && (
//               <>
//                 <Box
//                   mt={3}
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     flexWrap: "wrap",
//                     gap: 2,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <select
//                       value={pageSize}
//                       onChange={(e) => {
//                         setPageSize(Number(e.target.value));
//                         setPage(1);
//                       }}
//                       style={{
//                         padding: "6px 8px",
//                         borderRadius: "8px",
//                         border: "1px solid #ccc",
//                         fontSize: "14px",
//                       }}
//                     >
//                       {pageSizes.map((sz) => (
//                         <option key={sz} value={sz}>
//                           {sz}
//                         </option>
//                       ))}
//                     </select>
//                     <Typography variant="body2" color="text.secondary">
//                       per page
//                     </Typography>
//                   </Box>

//                   <Typography variant="body2" color="text.secondary">
//                     Page {page} of {totalPages} • {totalCount} records
//                   </Typography>

//                   <Box sx={{ display: "flex", gap: 0.5 }}>
//                     <button
//                       onClick={handlePrev}
//                       disabled={page === 1}
//                       style={{
//                         backgroundColor: page === 1 ? "#e0e0e0" : "#1230ae",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "8px",
//                         width: "36px",
//                         height: "36px",
//                         cursor: page === 1 ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       <UilAngleLeftB />
//                     </button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1)
//                       .filter(
//                         (pg) =>
//                           pg === 1 ||
//                           pg === totalPages ||
//                           Math.abs(pg - page) <= 1
//                       )
//                       .map((pg, idx, arr) => (
//                         <React.Fragment key={pg}>
//                           {idx > 0 && pg > arr[idx - 1] + 1 && (
//                             <span style={{ color: "#aaa", mx: 1 }}>...</span>
//                           )}
//                           <button
//                             onClick={() => setPage(pg)}
//                             style={{
//                               backgroundColor:
//                                 page === pg ? "#4169e1" : "#f0f0f0",
//                               color: page === pg ? "#fff" : "#333",
//                               border: "none",
//                               borderRadius: "8px",
//                               width: "36px",
//                               height: "36px",
//                               fontWeight: page === pg ? "bold" : 500,
//                             }}
//                           >
//                             {pg}
//                           </button>
//                         </React.Fragment>
//                       ))}

//                     <button
//                       onClick={handleNext}
//                       disabled={page === totalPages}
//                       style={{
//                         backgroundColor:
//                           page === totalPages ? "#e0e0e0" : "#1230ae",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "8px",
//                         width: "36px",
//                         height: "36px",
//                         cursor: page === totalPages ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       <UilAngleRightB />
//                     </button>
//                   </Box>
//                 </Box>

//                 <Typography
//                   variant="body2"
//                   sx={{ fontWeight: "bold", mt: 2, color: "#333" }}
//                 >
//                   Total Issue: [{totalCount}] | Received: [{successCount}] |
//                   Pending: [{pendingCount}]
//                 </Typography>
//               </>
//             )}
//           </Box>
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default OMRreceipt;

/* src/Components/Exam/omrReceipt/OMRreceipt.jsx */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useTransition,
} from "react";
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
  CircularProgress,
  Select,
  InputLabel,
  FormControl,
  Button,
  TableContainer
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import { RxCross2 } from "react-icons/rx";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
import Swal from "sweetalert2";

// ====================== LOCAL STORAGE HELPERS ======================
const STORAGE_KEY = "omr_assign_filters";

const loadFilters = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveFilters = (filters) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (e) {
    console.warn("Failed to save filters", e);
  }
};

// ====================== DROPDOWN COMPONENT ======================
const Dropdown = ({ label, value, options, onChange, disabled }) => (
  <TextField
    select
    label={label}
    variant="outlined"
    fullWidth
    margin="normal"
    size="small"
    value={value || ""}
    onChange={onChange}
    disabled={disabled}
    sx={{ backgroundColor: "#fff" }}
  >
    {options.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </TextField>
);

// ====================== SWAL TOAST HELPER ======================
const showSwal = (type, title, timer = 2000) => {
  Swal.fire({
    position: "top-end",
    icon: type,
    title: title,
    showConfirmButton: false,
    timer: timer,
    toast: true,
    timerProgressBar: true,
    background:
      type === "error" ? "#ffebee" : type === "warning" ? "#fff8e1" : "#e8f5e9",
    color: "#333",
    customClass: {
      popup: "animate__animated animate__fadeInDown animate__faster",
    },
  });
};

// ====================== MAIN COMPONENT ======================
const OMRreceipt = () => {
  /* ====================== STATE ====================== */
  const [schools, setSchools] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 25, 50];
  const [totalCount, setTotalCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Location filters
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

  const [, startTransition] = useTransition();

  // ====================== LOAD PERSISTED FILTERS ======================
  useEffect(() => {
    const saved = loadFilters();

    if (saved.selectedCountry) setSelectedCountry(saved.selectedCountry);
    if (saved.selectedState) setSelectedState(saved.selectedState);
    if (saved.selectedDistrict) setSelectedDistrict(saved.selectedDistrict);
    if (saved.selectedCity) setSelectedCity(saved.selectedCity);
    if (saved.selectedSchoolId) setSelectedSchoolId(saved.selectedSchoolId);
    if (Array.isArray(saved.selectedClassIds))
      setSelectedClassIds(saved.selectedClassIds);
    if (Array.isArray(saved.selectedSubjectIds))
      setSelectedSubjectIds(saved.selectedSubjectIds);
    if (saved.selectedStaffId)
      setSelectedStaffId(String(saved.selectedStaffId));

    if (Object.keys(saved).length) {
      showSwal("info", "Filters restored from last session.");
    }
  }, []);

  // ====================== SAVE FILTERS ON CHANGE ======================
  useEffect(() => {
    const toSave = {
      selectedCountry,
      selectedState,
      selectedDistrict,
      selectedCity,
      selectedSchoolId,
      selectedClassIds,
      selectedSubjectIds,
      selectedStaffId: selectedStaffId || null,
    };
    saveFilters(toSave);
  }, [
    selectedCountry,
    selectedState,
    selectedDistrict,
    selectedCity,
    selectedSchoolId,
    selectedClassIds,
    selectedSubjectIds,
    selectedStaffId,
  ]);

  // ====================== INITIAL DATA ======================
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const [c, s, d, ci] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);

        const countryData = Array.isArray(c?.data) ? c.data : [];
        const india = countryData.find((c) => c.name.toLowerCase() === "india");
        if (india && !selectedCountry) setSelectedCountry(india.id);

        setCountries(countryData);
        setStates(Array.isArray(s?.data) ? s.data : []);
        setDistricts(Array.isArray(d?.data) ? d.data : []);
        setCities(Array.isArray(ci?.data) ? ci.data : []);
      } catch (e) {
        showSwal("error", "Failed to load location data.");
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/class`);
        setClasses(data.map((c) => ({ value: c.id, label: c.name })));
      } catch (e) {
        showSwal("error", "Failed to load classes.");
        setClasses([]);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/subject`);
        setSubjects(data.map((s) => ({ value: s.id, label: s.name })));
      } catch (e) {
        showSwal("error", "Failed to load subjects.");
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/u1/users`);
        setStaffList(Array.isArray(data) ? data : []);
      } catch (e) {
        showSwal("error", "Failed to load staff.");
        setStaffList([]);
      }
    };
    fetchStaff();
  }, []);

  // ====================== SCHOOLS BY LOCATION ======================
  const fetchSchoolsByLocation = async (filters) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        { params: filters }
      );
      if (data.success) {
        const list = data.data.flatMap((loc) =>
          loc.schools.map((sch) => ({
            school_id: sch.id,
            school_name: sch.name,
            city_name: loc.city,
          }))
        );
        setSchools(list);
      } else {
        setSchools([]);
      }
    } catch (e) {
      setSchools([]);
      showSwal("error", "Failed to load schools.");
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== LOCATION EFFECTS ======================
  useEffect(() => {
    if (selectedCountry) {
      const filtered = states.filter((s) => s.country_id === selectedCountry);
      setFilteredStates(filtered);
      fetchSchoolsByLocation({ country: selectedCountry });
    } else {
      setFilteredStates([]);
    }
    resetFiltersBelow("country");
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState) {
      const filtered = districts.filter((d) => d.state_id === selectedState);
      setFilteredDistricts(filtered);
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
      });
    } else {
      setFilteredDistricts([]);
    }
    resetFiltersBelow("state");
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      const filtered = cities.filter((c) => c.district_id === selectedDistrict);
      setFilteredCities(filtered);
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
      });
    } else {
      setFilteredCities([]);
    }
    resetFiltersBelow("district");
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
    resetFiltersBelow("city");
  }, [selectedCity]);

  const resetFiltersBelow = (level) => {
    if (level === "country") {
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedCity("");
    }
    if (level === "state") {
      setSelectedDistrict("");
      setSelectedCity("");
    }
    if (level === "district") setSelectedCity("");
    setSelectedSchoolId("");
    setStudents([]);
    setSelectedStudentIds(new Set());
    setPage(1);
  };

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

  // ====================== FETCH STUDENTS (UPDATED!) ======================
  const fetchStudents = useCallback(async () => {
    if (
      !selectedSchoolId ||
      !selectedClassIds.length ||
      !selectedSubjectIds.length
    ) {
      setStudents([]);
      setTotalCount(0);
      setSuccessCount(0);
      setPendingCount(0);
      setSelectedStudentIds(new Set());
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      const payload = {
        schoolId: Number(selectedSchoolId),
        classList: selectedClassIds.map(Number),
        subjectList: selectedSubjectIds.map(Number),
        staffId: selectedStaffId ? Number(selectedStaffId) : undefined,
      };

      const { data } = await axios.post(
        `${API_BASE_URL}/api/get/filter/omr-assign`,
        payload
      );

      if (data.success) {
        const studentsWithKey = (data.students ?? []).map((s) => ({
          ...s,
          // Unique key per student + class + subject
          _key: `${s.student_id}-${s.class_id}-${s.subject_id}`,
        }));

        setStudents(studentsWithKey);
        setTotalCount(data.totalCount ?? 0);
        setSuccessCount(data.successCount ?? 0);
        setPendingCount(data.pendingCount ?? 0);

        // AUTO CHECK all rows where exists_assign === 1
        const preSelectedKeys = new Set(
          studentsWithKey
            .filter((s) => s.exists_assign === 1)
            .map((s) => s._key)
        );

        setSelectedStudentIds(preSelectedKeys);

        if (preSelectedKeys.size > 0) {
          showSwal(
            "info",
            `${preSelectedKeys.size} already assigned records auto-selected.`
          );
        }
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to load students";
      setFetchError(msg);
      showSwal("error", msg);
      setStudents([]);
      setTotalCount(0);
      setSuccessCount(0);
      setPendingCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSchoolId, selectedClassIds, selectedSubjectIds, selectedStaffId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        fetchStudents();
        setPage(1);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // ====================== CHECKBOX LOGIC ======================
  const toggleStudent = (student) => {
    const newSet = new Set(selectedStudentIds);
    if (newSet.has(student._key)) {
      newSet.delete(student._key);
    } else {
      newSet.add(student._key);
    }
    setSelectedStudentIds(newSet);
  };

  const toggleAll = () => {
    if (selectedStudentIds.size === paginatedStudents.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(paginatedStudents.map((s) => s._key)));
    }
  };

  // ====================== ASSIGN STAFF ======================
  const handleAssignStaff = async () => {
    if (!selectedStaffId) {
      showSwal("warning", "Please select a staff member first.");
      return;
    }
    if (selectedStudentIds.size === 0) {
      showSwal("warning", "Please select at least one student.");
      return;
    }

    setAssigning(true);
    const selected = students.filter((s) => selectedStudentIds.has(s._key));

    try {
      const promises = selected.map((s) =>
        axios.post(`${API_BASE_URL}/api/omr-assign`, {
          country_id: selectedCountry ? Number(selectedCountry) : null,
          state_id: selectedState ? Number(selectedState) : null,
          district_id: selectedDistrict ? Number(selectedDistrict) : null,
          city_id: selectedCity ? Number(selectedCity) : null,
          school_id: Number(selectedSchoolId),
          class_id: Number(s.class_id),
          subject_id: Number(s.subject_id),
          roll_no: s.roll_no || null,
          student_id: Number(s.student_id),
          student_section: s.student_section || null,
          staff_id: Number(selectedStaffId),
        })
      );

      const results = await Promise.allSettled(promises);
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      const successKeys = new Set();
      results.forEach((res, i) => {
        if (res.status === "fulfilled") successKeys.add(selected[i]._key);
      });

      setStudents((prev) =>
        prev.map((s) =>
          successKeys.has(s._key)
            ? { ...s, exists_assign: 1, status: "Success" }
            : s
        )
      );

      setSuccessCount((prev) => prev + succeeded);
      setPendingCount((prev) => Math.max(0, prev - succeeded));

      // Keep only failed ones selected (optional - or clear all)
      const failedKeys = selected
        .filter((_, i) => results[i].status === "rejected")
        .map((s) => s._key);
      setSelectedStudentIds(new Set(failedKeys));

      if (failed === 0) {
        showSwal("success", `Successfully assigned to ${succeeded} record(s).`);
      } else {
        showSwal("warning", `Assigned: ${succeeded} | Failed: ${failed}`);
      }
    } catch (err) {
      showSwal("error", "Assignment failed. Please try again.");
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  // ====================== CLEAR ALL FILTERS ======================
  const handleClearAll = () => {
    setSelectedCountry("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolId("");
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setSelectedStaffId("");
    setStudents([]);
    setSelectedStudentIds(new Set());
    setPage(1);
    localStorage.removeItem(STORAGE_KEY);
    showSwal("info", "All filters cleared.");
  };

  // ====================== PAGINATION ======================
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return students.slice(start, start + pageSize);
  }, [students, page, pageSize]);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);
  const isAllSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every((s) => selectedStudentIds.has(s._key));

  const isAssignEnabled = selectedStaffId && selectedStudentIds.size > 0;

  // ====================== RENDER ======================
  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "OMR Assign", link: "" }]} />
      </div>

      <Container component="main" maxWidth="">
        <Paper className={`${styles.main}`} elevation={3}>
          <Typography className={`${styles.formTitle} mb-4`}>
            OMR Assign
          </Typography>

          {fetchError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {fetchError}
            </Typography>
          )}

          <form noValidate autoComplete="off">
            {/* LOCATION */}
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

            {/* FILTER ROW */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 1,
                alignItems: "center",
              }}
            >
              <Box sx={{ flex: "1 1 22%", minWidth: 250 }}>
                <Dropdown
                  label="School"
                  value={selectedSchoolId}
                  options={schools.map((s) => ({
                    value: s.school_id,
                    label: s.school_name,
                  }))}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  disabled={isLoading || !selectedCity}
                />
              </Box>

              <Box sx={{ flex: "1 1 22%", minWidth: 250 }}>
                <Autocomplete
                  multiple
                  options={classes}
                  value={selectedClassIds.map(
                    (id) =>
                      classes.find((c) => c.value === id) || {
                        value: id,
                        label: id,
                      }
                  )}
                  onChange={(_, nv) =>
                    setSelectedClassIds(nv.map((i) => i.value))
                  }
                  disableCloseOnSelect
                  getOptionLabel={(o) => o.label}
                  renderOption={(props, opt) => (
                    <li {...props}>
                      <Checkbox
                        checked={selectedClassIds.includes(opt.value)}
                        color="primary"
                      />
                      {opt.label}
                    </li>
                  )}
                  renderTags={(tags) =>
                    tags.map((opt, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: "#90D14F",
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          fontSize: "11px",
                          margin: "2px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {opt.label}
                        <RxCross2
                          size={10}
                          style={{ marginLeft: 4, cursor: "pointer" }}
                          onClick={() =>
                            setSelectedClassIds((prev) =>
                              prev.filter((i) => i !== opt.value)
                            )
                          }
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
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: "1 1 22%", minWidth: 250 }}>
                <Autocomplete
                  multiple
                  options={subjects}
                  value={selectedSubjectIds.map(
                    (id) =>
                      subjects.find((s) => s.value === id) || {
                        value: id,
                        label: id,
                      }
                  )}
                  onChange={(_, nv) =>
                    setSelectedSubjectIds(nv.map((i) => i.value))
                  }
                  disableCloseOnSelect
                  getOptionLabel={(o) => o.label}
                  renderOption={(props, opt) => (
                    <li {...props}>
                      <Checkbox
                        checked={selectedSubjectIds.includes(opt.value)}
                        color="primary"
                      />
                      {opt.label}
                    </li>
                  )}
                  renderTags={(tags) =>
                    tags.map((opt, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: "#90D14F",
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          fontSize: "11px",
                          margin: "2px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {opt.label}
                        <RxCross2
                          size={10}
                          style={{ marginLeft: 4, cursor: "pointer" }}
                          onClick={() =>
                            setSelectedSubjectIds((prev) =>
                              prev.filter((i) => i !== opt.value)
                            )
                          }
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
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: "1 1 22%", minWidth: 250 }}>
                <FormControl fullWidth size="small" margin="normal">
                  <InputLabel>Assign Staff</InputLabel>
                  <Select
                    value={selectedStaffId || ""}
                    label="Assign Staff"
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {staffList.map((st) => (
                      <MenuItem key={st.id} value={String(st.id)}>
                        {st.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </form>

          {/* TABLE SECTION */}
          {/* <Box
            mt={4}
            sx={{
              
             
              borderRadius: "16px",
              p: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  color: "#1230ae",
                }}
              >
                Students
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAssignStaff}
                  disabled={!isAssignEnabled || assigning}
                  startIcon={assigning ? <CircularProgress size={20} /> : null}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    minWidth: "180px",
                  }}
                >
                  {assigning
                    ? "Assigning..."
                    : `Assign Staff (${selectedStudentIds.size})`}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleClearAll}
                  sx={{ textTransform: "none" }}
                >
                  Clear All
                </Button>
              </Box>
            </Box>

            {isLoading && (
              <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress />
              </Box>
            )}

            <Table
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                  borderRadius:"4px",
                "& th": {
                  background: "linear-gradient(90deg, #1230ae)",
                
                  color: "#fff",
                  fontWeight: 700,
                  fontFamily: "Poppins, sans-serif",
                  textAlign: "center",
                  fontSize: "0.9rem",
                  py: 1.4,
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                  "&:last-child": { borderRight: "none" },
                },
                "& td": {
                  textAlign: "center",
                  borderRight: "1px solid #f0f0f0",
                  borderBottom: "1px solid #f5f5f5",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.9rem",
                  color: "#333",
                  py: 1.2,
                  "&:last-child": { borderRight: "none" },
                },
                "& tr:hover": {
                  background:
                    "linear-gradient(90deg, #f9faff 0%, #edf2ff 100%)",
                },
                border: "none",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selectedStudentIds.size > 0 && !isAllSelected
                      }
                      checked={isAllSelected}
                      onChange={toggleAll}
                    />
                  </TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading && paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      {selectedSchoolId &&
                      selectedClassIds.length &&
                      selectedSubjectIds.length
                        ? "No students found for the selected criteria"
                        : "Please select school, class and subject to view students"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((s) => {
                    const isSelected = selectedStudentIds.has(s._key);
                    return (
                      <TableRow
                        key={s._key}
                        sx={{
                          backgroundColor: isSelected
                            ? "rgba(144, 209, 79, 0.15)"
                            : s.exists_assign === 1
                            ? "rgba(255, 193, 7, 0.08)"
                            : "inherit",
                          opacity: s.exists_assign === 1 ? 0.9 : 1,
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isSelected}
                            onChange={() => toggleStudent(s)}
                          />
                        </TableCell>
                        <TableCell>{s.student_name || "N/A"}</TableCell>
                        <TableCell>{s.roll_no || "N/A"}</TableCell>
                        <TableCell>{s.class_name || "N/A"}</TableCell>
                        <TableCell>{s.student_section || "N/A"}</TableCell>
                        <TableCell>{s.subject_names || "N/A"}</TableCell>
                        <TableCell>{s.mobile_number || "N/A"}</TableCell>
                        <TableCell>
                          {s.exists_assign === 1 ? (
                            <span
                              style={{
                                color: "#ff9800",
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                              }}
                            >
                              Assigned
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "#e91e63",
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {students.length > 0 && (
              <>
                <Box
                  mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    >
                      {pageSizes.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                    <Typography variant="body2" color="text.secondary">
                      per page
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Page {page} of {totalPages} • {totalCount} records
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <button
                      onClick={handlePrev}
                      disabled={page === 1}
                      style={{
                        backgroundColor: page === 1 ? "#e0e0e0" : "#1230ae",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        width: "36px",
                        height: "36px",
                        cursor: page === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      <UilAngleLeftB />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (pg) =>
                          pg === 1 ||
                          pg === totalPages ||
                          Math.abs(pg - page) <= 1
                      )
                      .map((pg, idx, arr) => (
                        <React.Fragment key={pg}>
                          {idx > 0 && pg > arr[idx - 1] + 1 && (
                            <span style={{ color: "#aaa" }}>...</span>
                          )}
                          <button
                            onClick={() => setPage(pg)}
                            style={{
                              backgroundColor:
                                page === pg ? "#4169e1" : "#f0f0f0",
                              color: page === pg ? "#fff" : "#333",
                              border: "none",
                              borderRadius: "8px",
                              width: "36px",
                              height: "36px",
                              fontWeight: page === pg ? "bold" : 500,
                            }}
                          >
                            {pg}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      onClick={handleNext}
                      disabled={page === totalPages}
                      style={{
                        backgroundColor:
                          page === totalPages ? "#e0e0e0" : "#1230ae",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        width: "36px",
                        height: "36px",
                        cursor: page === totalPages ? "not-allowed" : "pointer",
                      }}
                    >
                      <UilAngleRightB />
                    </button>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", mt: 2, color: "#333" }}
                >
                  Total: [{totalCount}] | Assigned: [{successCount}] | Pending:
                  [{pendingCount}]
                </Typography>
              </>
            )}
          </Box> */}

          <Box
  mt={4}
  sx={{
    borderRadius: "20px",        // Increased border radius
    p: 2.5,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden",
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
      flexWrap: "wrap",
      gap: 1,
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        color: "#1230ae",
      }}
    >
      Students
    </Typography>

    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAssignStaff}
        disabled={!isAssignEnabled || assigning}
        startIcon={assigning ? <CircularProgress size={20} /> : null}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          minWidth: "180px",
        }}
      >
        {assigning
          ? "Assigning..."
          : `Assign Staff (${selectedStudentIds.size})`}
      </Button>

      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={handleClearAll}
        sx={{ textTransform: "none" }}
      >
        Clear All
      </Button>
    </Box>
  </Box>

  {isLoading && (
    <Box display="flex" justifyContent="center" my={3}>
      <CircularProgress />
    </Box>
  )}

  <Table
    sx={{
      minWidth: "100%",                    // Responsive width
      width: "auto",                       // Allows natural expansion
      borderCollapse: "separate",
      borderSpacing: 0,
      background: "#fff",
      borderRadius: "10px",
      overflow: "hidden",
      "& th": {
        background: "linear-gradient(90deg, #1230ae)",
        color: "#fff",
        fontWeight: 700,
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        fontSize: "0.9rem",
        py: 1,                             // Reduced header height
        borderRight: "1px solid rgba(238, 236, 236, 0.2)",
        "&:last-child": { borderRight: "none" },
      },
      "& td": {
        textAlign: "center",
        borderRight: "1px solid #f0f0f0",
        borderBottom: "1px solid #f5f5f5",
        fontFamily: "'Nunito', sans-serif",
        fontSize: "0.9rem",
        color: "#333",
        py: 1.2,
        "&:last-child": { borderRight: "none" },
      },
      "& tr:hover": {
        background: "linear-gradient(90deg, #f9faff 0%, #edf2ff 100%)",
      },
      border: "none",
    }}
  >
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={
              selectedStudentIds.size > 0 && !isAllSelected
            }
            checked={isAllSelected}
            onChange={toggleAll}
          />
        </TableCell>
        <TableCell>Student</TableCell>
        <TableCell>Roll No</TableCell>
        <TableCell>Class</TableCell>
        <TableCell>Section</TableCell>
        <TableCell>Subject</TableCell>
        <TableCell>Mobile</TableCell>
        <TableCell>Status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {!isLoading && paginatedStudents.length === 0 ? (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
            {selectedSchoolId &&
            selectedClassIds.length &&
            selectedSubjectIds.length
              ? "No students found for the selected criteria"
              : "Please select school, class and subject to view students"}
          </TableCell>
        </TableRow>
      ) : (
        paginatedStudents.map((s) => {
          const isSelected = selectedStudentIds.has(s._key);
          return (
            <TableRow
              key={s._key}
              sx={{
                backgroundColor: isSelected
                  ? "rgba(144, 209, 79, 0.15)"
                  : s.exists_assign === 1
                  ? "rgba(255, 193, 7, 0.08)"
                  : "inherit",
                opacity: s.exists_assign === 1 ? 0.9 : 1,
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isSelected}
                  onChange={() => toggleStudent(s)}
                />
              </TableCell>
              <TableCell>{s.student_name || "N/A"}</TableCell>
              <TableCell>{s.roll_no || "N/A"}</TableCell>
              <TableCell>{s.class_name || "N/A"}</TableCell>
              <TableCell>{s.student_section || "N/A"}</TableCell>
              <TableCell>{s.subject_names || "N/A"}</TableCell>
              <TableCell>{s.mobile_number || "N/A"}</TableCell>
              <TableCell>
                {s.exists_assign === 1 ? (
                  <span
                    style={{
                      color: "#ff9800",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                    }}
                  >
                    Assigned
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#e91e63",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                    }}
                  >
                    Pending
                  </span>
                )}
              </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody>
  </Table>

  {/* Pagination & Footer remain unchanged */}
  {students.length > 0 && (
    <>
      <Box
        mt={3}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{
              padding: "6px 8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          >
            {pageSizes.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
          <Typography variant="body2" color="text.secondary">
            per page
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Page {page} of {totalPages} • {totalCount} records
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <button
            onClick={handlePrev}
            disabled={page === 1}
            style={{
              backgroundColor: page === 1 ? "#e0e0e0" : "#1230ae",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            <UilAngleLeftB />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (pg) =>
                pg === 1 ||
                pg === totalPages ||
                Math.abs(pg - page) <= 1
            )
            .map((pg, idx, arr) => (
              <React.Fragment key={pg}>
                {idx > 0 && pg > arr[idx - 1] + 1 && (
                  <span style={{ color: "#aaa" }}>...</span>
                )}
                <button
                  onClick={() => setPage(pg)}
                  style={{
                    backgroundColor:
                      page === pg ? "#4169e1" : "#f0f0f0",
                    color: page === pg ? "#fff" : "#333",
                    border: "none",
                    borderRadius: "8px",
                    width: "36px",
                    height: "36px",
                    fontWeight: page === pg ? "bold" : 500,
                  }}
                >
                  {pg}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            style={{
              backgroundColor:
                page === totalPages ? "#e0e0e0" : "#1230ae",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            <UilAngleRightB />
          </button>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ fontWeight: "bold", mt: 2, color: "#333" }}
      >
        Total: [{totalCount}] | Assigned: [{successCount}] | Pending:
        [{pendingCount}]
      </Typography>
    </>
  )}
</Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default OMRreceipt;
