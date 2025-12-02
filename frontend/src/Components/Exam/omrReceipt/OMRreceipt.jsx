// /*  src/Components/Exam/omrReceipt/OMRreceipt.jsx  */
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
//   useMemo,
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
//   Menu,
// } from "@mui/material";
// import {
//   UilTrashAlt,
//   UilEditAlt,
//   UilAngleRightB,
//   UilAngleLeftB,
//   UilDownloadAlt,
//   UilInfoCircle,
// } from "@iconscout/react-unicons";
// import Mainlayout from "../../Layouts/Mainlayout";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import styles from "./OmrForm.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import { RxCross2 } from "react-icons/rx";
// // import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
// import excelImg from "../../../../public/excell-img.png";
// import CreateButton from "../../../Components/CommonButton/CreateButton";

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

// const OMRreceipt = () => {
//   /* ======================  STATE  ====================== */
//   const [schools, setSchools] = useState([]); // {school_id, school_name, city_name}
//   const [selectedSchoolId, setSelectedSchoolId] = useState(""); // numeric id for API
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
//   const [successCount, setSuccessCount] = useState(0);
//   const [pendingCount, setPendingCount] = useState(0);
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

//   const rollNoRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   /* ======================  INITIAL DATA  ====================== */
//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const [c, s, d, ci] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/countries`),
//           axios.get(`${API_BASE_URL}/api/states`),
//           axios.get(`${API_BASE_URL}/api/districts`),
//           axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//         ]);
//         setCountries(Array.isArray(c?.data) ? c.data : []);
//         setStates(Array.isArray(s?.data) ? s.data : []);
//         setDistricts(Array.isArray(d?.data) ? d.data : []);
//         setCities(Array.isArray(ci?.data) ? ci.data : []);
//       } catch (e) {
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
//         console.error(e);
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
//         console.error(e);
//         setSubjects([]);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   /* ======================  SCHOOLS BY LOCATION  ====================== */
//   const fetchSchoolsByLocation = async (filters) => {
//     setIsLoading(true);
//     try {
//       const { data } = await axios.get(
//         `${API_BASE_URL}/api/get/school-filter`,
//         {
//           params: filters,
//         }
//       );
//       if (data.success) {
//         const list = data.data.flatMap((loc) =>
//           loc.schools.map((sch) => ({
//             school_id: sch.id, // <-- must be returned by backend
//             school_name: sch.name,
//             city_name: loc.city,
//           }))
//         );
//         setSchools(list);
//       } else setSchools([]);
//     } catch (e) {
//       console.error(e);
//       setSchools([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ======================  LOCATION FILTER EFFECTS  ====================== */
//   useEffect(() => {
//     if (selectedCountry) {
//       setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//       fetchSchoolsByLocation({ country: selectedCountry });
//     }
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolId("");
//     setStudents([]);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     if (selectedState) {
//       setFilteredDistricts(
//         districts.filter((d) => d.state_id === selectedState)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//       });
//     }
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchoolId("");
//     setStudents([]);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       setFilteredCities(
//         cities.filter((c) => c.district_id === selectedDistrict)
//       );
//       fetchSchoolsByLocation({
//         country: selectedCountry,
//         state: selectedState,
//         district: selectedDistrict,
//       });
//     }
//     setSelectedCity("");
//     setSelectedSchoolId("");
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
//     setSelectedSchoolId("");
//     setStudents([]);
//   }, [selectedCity]);

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

//   /* ======================  FETCH STUDENTS  ====================== */
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
//       setFetchError(null);
//       return;
//     }

//     setIsLoading(true);
//     setFetchError(null);

//     try {
//       const rollnoclasssubject = selectedRollClassSubject;

//       const payload = {
//         schoolId: Number(selectedSchoolId), // <-- numeric id
//         classList: rollnoclasssubject
//           ? [Number(rollnoclasssubject.split("-")[1])]
//           : selectedClassIds,
//         subjectList: rollnoclasssubject
//           ? [Number(rollnoclasssubject.split("-")[2])]
//           : selectedSubjectIds,
//       };

//       if (rollnoclasssubject) payload.rollnoclasssubject = rollnoclasssubject;

//       const { data } = await axios.post(
//         `${API_BASE_URL}/api/get/filter/omr-receipt`,
//         payload
//       );

//       const raw = data.students || [];
//       const total = data.totalCount ?? raw.length;
//       const success = data.successCount ?? 0;
//       const pending = data.pendingCount ?? 0;

//       const normalised = raw.map((s) => ({
//         ...s,
//         status: (s.status ?? "Pending").toLowerCase(),
//         student_subject: Array.isArray(s.student_subject)
//           ? s.student_subject
//           : s.subject_names
//           ? s.subject_names.split(", ")
//           : [],
//       }));

//       setStudents(normalised);
//       setTotalCount(total);
//       setSuccessCount(success);
//       setPendingCount(pending);
//     } catch (e) {
//       console.error(e);
//       setFetchError(
//         e.response?.data?.message ||
//           "Failed to fetch students. Please check your selections."
//       );
//       setStudents([]);
//       setTotalCount(0);
//       setSuccessCount(0);
//       setPendingCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     selectedSchoolId,
//     selectedClassIds,
//     selectedSubjectIds,
//     selectedRollClassSubject,
//   ]);

//   // trigger on any filter change & reset page
//   useEffect(() => {
//     fetchStudents();
//     setPage(1);
//   }, [
//     selectedSchoolId,
//     selectedClassIds,
//     selectedSubjectIds,
//     selectedRollClassSubject,
//   ]);

//   /* ======================  PAGINATION  ====================== */
//   const totalPages = Math.ceil(totalCount / pageSize);
//   const paginatedStudents = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return students.slice(start, start + pageSize);
//   }, [students, page, pageSize]);

//   const handlePrev = () => page > 1 && setPage(page - 1);
//   const handleNext = () => page < totalPages && setPage(page + 1);

//   /* ======================  bulk receipt  ====================== */
//   // Bulk upload and CSV download
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUploadClick = () => {
//     document.getElementById("fileInput").click();
//     handleClose();
//   };

//   const handleDownloadClick = () => {
//     const csvContent = `school,class,subject,name,roll_no
// "Gowell School","10","Mathematics","Amit Kumar","GWL10A01"
// "Sunrise Academy","XII","Physics","Priya Sharma","SRA12P05"
// "Delhi Public School","11","Chemistry","Rahul Verma","DPS11C12"`;

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "omr_receipt_bulk_template.csv";
//     link.click();
//     handleClose();
//   };

//   const parseCSVData = (csvText) => {
//     const lines = csvText.split(/\r\n|\n/).filter((line) => line.trim() !== "");
//     if (lines.length <= 1) {
//       Swal.fire("Empty File", "CSV has no data rows", "warning");
//       return;
//     }

//     const headers = lines[0]
//       .toLowerCase()
//       .split(",")
//       .map((h) => h.trim().replace(/"/g, ""));
//     const required = ["school", "class", "subject", "name", "roll_no"];
//     const missing = required.filter((col) => !headers.includes(col));

//     if (missing.length > 0) {
//       Swal.fire(
//         "Invalid Template",
//         `Missing columns: ${missing.join(", ")}`,
//         "error"
//       );
//       return;
//     }

//     const rows = [];
//     for (let i = 1; i < lines.length; i++) {
//       const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
//       if (values.length < 5 || values.join("") === "") continue;

//       rows.push({
//         school: values[headers.indexOf("school")],
//         class: values[headers.indexOf("class")],
//         subject: values[headers.indexOf("subject")],
//         name: values[headers.indexOf("name")],
//         roll_no: values[headers.indexOf("roll_no")],
//       });
//     }

//     if (rows.length === 0) {
//       Swal.fire("No Valid Data", "No readable rows found in CSV", "warning");
//       return;
//     }

//     // Send to backend
//     axios
//       .post(`${API_BASE_URL}/api/omr-receipt/bulk-upload`, { rows })
//       .then((res) => {
//         if (res.data.success) {
//           const { inserted, errors } = res.data;
//           let message = `<strong>${inserted} records uploaded successfully!</strong>`;

//           if (errors && errors.length > 0) {
//             message += `<br><br><strong>${errors.length} rows failed:</strong><br>`;
//             errors.slice(0, 12).forEach((e) => {
//               message += `• Row ${e.row}: ${e.message}<br>`;
//             });
//             if (errors.length > 12)
//               message += `...and ${errors.length - 12} more`;
//           }

//           Swal.fire({
//             icon: "success",
//             title: "Bulk Upload Complete",
//             html: message,
//             width: 700,
//             confirmButtonColor: "#1230AE",
//           });

//           // Refresh the student list
//           fetchStudents();
//         }
//       })
//       .catch((err) => {
//         const msg =
//           err.response?.data?.message || "Upload failed. Please try again.";
//         Swal.fire("Upload Failed", msg, "error");
//       });
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.name.toLowerCase().endsWith(".csv")) {
//       Swal.fire("Invalid File", "Please upload a CSV file only", "warning");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => parseCSVData(e.target.result);
//     reader.readAsText(file);
//     event.target.value = ""; // reset input
//   };

//   return (
//     <Mainlayout>
//       {/* <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "OMR Receipt", link: "" }]} />
//       </div> */}

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "16px",
//         }}
//       >
//         <div role="presentation">
//           <Breadcrumb data={[{ name: "OMR Receipt" }]} />
//         </div>
//         <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "10px",
//               flexDirection: "column",
//               borderRadius: "15px",
//             }}
//           >
//             <div
//               onClick={handleClick}
//               style={{
//                 cursor: "pointer",
//                 padding: "14px 12px",
//                 display: "flex",
//                 alignItems: "center",
//                 height: "27px",
//                 fontSize: "14px",
//                 borderRadius: "5px",
//                 color: "#1230AE",
//                 textDecoration: "none",
//                 fontFamily: '"Poppins", sans-serif',
//               }}
//             >
//               <img
//                 src={excelImg}
//                 alt="Upload"
//                 style={{ width: "20px", height: "20px", marginRight: "8px" }}
//               />
//               Bulk Action
//             </div>
//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//               anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//               transformOrigin={{ vertical: "top", horizontal: "left" }}
//               style={{ padding: "0px", margin: "0px" }}
//             >
//               <div
//                 style={{
//                   fontFamily: "Poppins, sans-serif",
//                   gap: "15px",
//                   borderRadius: "10px",
//                   padding: "0px 10px",
//                 }}
//               >
//                 <div style={{ display: "flex", gap: "6px" }}>
//                   <button
//                     type="button"
//                     style={{
//                       fontSize: "13px",
//                       backgroundColor: "#4A4545",
//                       color: "white",
//                       fontWeight: "500",
//                       border: "none",
//                       padding: "6px 12px",
//                       borderRadius: "4px",
//                     }}
//                     onClick={handleUploadClick}
//                   >
//                     <img
//                       src={excelImg}
//                       alt="Upload"
//                       style={{
//                         width: "30px",
//                         height: "30px",
//                         marginRight: "8px",
//                       }}
//                     />
//                     Upload Excel
//                   </button>
//                   <button
//                     type="button"
//                     style={{
//                       fontSize: "13px",
//                       backgroundColor: "#28A745",
//                       color: "white",
//                       fontWeight: "500",
//                       border: "none",
//                       padding: "6px 12px",
//                       borderRadius: "4px",
//                     }}
//                     onClick={handleDownloadClick}
//                   >
//                     <UilDownloadAlt /> Download Sample File
//                   </button>
//                 </div>
//                 <div style={{ marginTop: "8px" }}>
//                   <p
//                     style={{
//                       color: "#4A4545",
//                       fontWeight: "bold",
//                       marginBottom: "0",
//                     }}
//                   >
//                     Note:
//                     <UilInfoCircle
//                       style={{ height: "20px", width: "20px", color: "blue" }}
//                     />
//                   </p>
//                   <ol
//                     style={{
//                       fontSize: "10px",
//                       paddingLeft: "10px",
//                       color: "gray",
//                     }}
//                   >
//                     <li>Click Download Sample File to get the template.</li>
//                     <li>Fill in the data as per the given columns.</li>
//                     <li>Save the file in Excel format (XLSX or CSV).</li>
//                     <li>Use Upload Excel to bulk upload your data.</li>
//                     <li>
//                       Ensure all required fields are filled correctly and
//                       <br /> Aadhaar numbers are either empty or exactly 12
//                       digits to avoid errors.
//                     </li>
//                   </ol>
//                 </div>
//               </div>
//             </Menu>
//             <input
//               id="fileInput"
//               type="file"
//               accept=".csv"
//               style={{ display: "none" }}
//               onChange={handleFileChange}
//             />
//           </div>
//         </div>
//       </div>

//       <Container component="main" maxWidth="">
//         <Paper className={`${styles.main}`} elevation={3}>
//           <Typography className={`${styles.formTitle} mb-4`}>
//             OMR Receipt
//           </Typography>

//           {fetchError && (
//             <Typography color="error" sx={{ mb: 2 }}>
//               {fetchError}
//             </Typography>
//           )}

//           <form noValidate autoComplete="off">
//             {/* ---- LOCATION ---- */}
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

//             {/* ---- SCHOOL / CLASSES / SUBJECTS / OPTIONAL ROLL ---- */}
//             <Box
//               sx={{
//                 display: "flex",
//                 flexWrap: "nowrap",
//                 gap: 2,
//                 mt: 1,
//                 alignItems: "center",
//                 overflowX: "auto",
//               }}
//             >
//               {/* School Dropdown */}
//               <Box sx={{ flex: "1 1 25%", minWidth: 250 }}>
//                 <Dropdown
//                   label="School"
//                   value={selectedSchoolId}
//                   options={schools.map((s) => ({
//                     value: s.school_id,
//                     label: `${s.school_name} ${
//                       s.city_name ? `(${s.city_name})` : ""
//                     }`,
//                   }))}
//                   onChange={(e) => setSelectedSchoolId(e.target.value)}
//                   disabled={isLoading || !selectedCity}
//                 />
//               </Box>

//               {/* Classes */}
//               <Box sx={{ flex: "1 1 25%", minWidth: 250 }}>
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
//                   renderOption={(props, opt, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedClassIds.includes(opt.value)}
//                         color="primary"
//                       />
//                       {opt.label}
//                     </li>
//                   )}
//                   renderTags={(tags, getTagProps) =>
//                     tags.map((opt, idx) => (
//                       <span
//                         {...getTagProps({ index: idx })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "#fff",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {opt.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "#fff",
//                           }}
//                           onClick={() => {
//                             setSelectedClassIds((prev) =>
//                               prev.filter((i) => i !== opt.value)
//                             );
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
//                         style: { fontSize: "0.8rem", padding: "6px 12px" },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Box>

//               {/* Subjects */}
//               <Box sx={{ flex: "1 1 25%", minWidth: 250 }}>
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
//                   renderOption={(props, opt, { selected }) => (
//                     <li {...props}>
//                       <Checkbox
//                         checked={selectedSubjectIds.includes(opt.value)}
//                         color="primary"
//                       />
//                       {opt.label}
//                     </li>
//                   )}
//                   renderTags={(tags, getTagProps) =>
//                     tags.map((opt, idx) => (
//                       <span
//                         {...getTagProps({ index: idx })}
//                         style={{
//                           backgroundColor: "#90D14F",
//                           color: "#fff",
//                           borderRadius: "2px",
//                           padding: "4px 6px",
//                           fontSize: "12px",
//                           margin: "2px",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           fontFamily: "Poppins",
//                         }}
//                       >
//                         {opt.label}
//                         <RxCross2
//                           size={12}
//                           style={{
//                             marginLeft: "6px",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             color: "#fff",
//                           }}
//                           onClick={() => {
//                             setSelectedSubjectIds((prev) =>
//                               prev.filter((i) => i !== opt.value)
//                             );
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
//                         style: { fontSize: "0.8rem", padding: "6px 12px" },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                           fontFamily: "Poppins",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Box>

//               {/* Roll-Class-Subject */}
//               <Box sx={{ flex: "1 1 25%", minWidth: 250 }}>
//                 <TextField
//                   inputRef={rollNoRef}
//                   label="Roll-Class-Subject (Optional)"
//                   variant="outlined"
//                   fullWidth
//                   size="small"
//                   value={selectedRollClassSubject || ""}
//                   onChange={(e) =>
//                     setSelectedRollClassSubject(e.target.value || null)
//                   }
//                   disabled={isLoading || !selectedSchoolId}
//                   placeholder="e.g., 7610336101-36-10"
//                   InputLabelProps={{
//                     style: {
//                       fontSize: "0.85rem",
//                       fontWeight: "bolder",
//                       fontFamily: "Poppins",
//                     },
//                   }}
//                 />
//               </Box>
//             </Box>
//           </form>

//           {/* ---- TABLE ---- */}
//           <Box
//             mt={4}
//             sx={{
//               background: "#fff",
//               boxShadow: "0 4px 25px rgba(0,0,0,0.06)",
//               borderRadius: "16px",
//               p: 2.5,
//             }}
//           >
//             <Typography
//               variant="h6"
//               gutterBottom
//               sx={{
//                 fontFamily: "Poppins, sans-serif",
//                 fontWeight: 700,
//                 color: "#1230ae",
//                 letterSpacing: "0.5px",
//                 mb: 2,
//               }}
//             >
//               🎓 Students
//             </Typography>

//             {/* ---- TABLE ---- */}
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
//                 "& tr": {
//                   transition: "all 0.2s ease",
//                   "&:hover": {
//                     background:
//                       "linear-gradient(90deg, #f9faff 0%, #edf2ff 100%)",
//                     transform: "scale(1.01)",
//                   },
//                 },
//                 "& tbody tr:last-child td": {
//                   borderBottom: "none",
//                 },
//                 border: "none",
//               }}
//             >
//               <TableHead>
//                 <TableRow>
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
//                 ) : paginatedStudents.length ? (
//                   paginatedStudents.map((s, i) => (
//                     <TableRow key={`${s.roll_no}-${i}`}>
//                       <TableCell>{s.student_name || "N/A"}</TableCell>
//                       <TableCell>{s.roll_no || "N/A"}</TableCell>
//                       <TableCell>{s.class_name || "N/A"}</TableCell>
//                       <TableCell>{s.student_section || "N/A"}</TableCell>
//                       <TableCell>
//                         {Array.isArray(s.student_subject) &&
//                         s.student_subject.length
//                           ? s.student_subject
//                               .map(
//                                 (sub) =>
//                                   sub.charAt(0).toUpperCase() + sub.slice(1)
//                               )
//                               .join(", ")
//                           : "N/A"}
//                       </TableCell>
//                       <TableCell>{s.mobile_number || "N/A"}</TableCell>
//                       <TableCell
//                         sx={{
//                           fontWeight: 700,
//                           color:
//                             s.status?.toLowerCase() === "success"
//                               ? "#36e926" // bright green
//                               : s.status === "pending"
//                               ? "#E74C3C" // bold red
//                               : "#555",
//                           backgroundColor:
//                             s.status?.toLowerCase() === "success"
//                               ? "rgba(54, 233, 38, 0.08)"
//                               : s.status?.toLowerCase() === "pending"
//                               ? "rgba(230, 60, 41, 0.08)"
//                               : "rgba(215, 32, 32, 0.04)",
//                           borderRadius: "20px",
//                           px: 2,
//                           py: 0.7,
//                           display: "inline-block",
//                           textAlign: "center",
//                           fontSize: "0.85rem",
//                           letterSpacing: "0.3px",
//                           textTransform: "uppercase",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "scale(1.05)",
//                             boxShadow:
//                               s.status?.toLowerCase() === "success"
//                                 ? "0 0 10px rgba(54,233,38,0.3)"
//                                 : s.status?.toLowerCase() === "pending"
//                                 ? "0 0 10px rgba(231,76,60,0.3)"
//                                 : "none",
//                           },
//                         }}
//                       >
//                         {s.status?.toUpperCase() || "N/A"}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       {selectedSchoolId &&
//                       selectedClassIds.length &&
//                       selectedSubjectIds.length
//                         ? "No students found for the selected criteria"
//                         : "Please select school, class and subject to view students"}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>

//             {/* ---- PAGINATION + COUNTS ---- */}
//             {students.length > 0 && (
//               <Box
//                 mt={3}
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   flexWrap: "wrap",
//                   gap: 2,
//                   fontFamily: "'Nunito', sans-serif",
//                 }}
//               >
//                 {/* Data per page */}
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <select
//                     value={pageSize}
//                     onChange={(e) => {
//                       const sz = Number(e.target.value);
//                       setPageSize(sz);
//                       setPage(1);
//                     }}
//                     style={{
//                       width: "60px",
//                       padding: "4px 6px",
//                       height: "32px",
//                       fontSize: "14px",
//                       border: "1px solid #ccc",
//                       borderRadius: "8px",
//                       color: "#333",
//                       fontWeight: "bold",
//                       fontFamily: "'Nunito', sans-serif",
//                       outline: "none",
//                     }}
//                   >
//                     {pageSizes.map((sz) => (
//                       <option key={sz} value={sz}>
//                         {sz}
//                       </option>
//                     ))}
//                   </select>
//                   <Typography
//                     variant="body2"
//                     sx={{ color: "#6C757D", fontWeight: 500 }}
//                   >
//                     data / page
//                   </Typography>
//                 </Box>

//                 {/* Total Records */}
//                 <Typography
//                   variant="body2"
//                   sx={{ color: "#6C757D", fontWeight: 500 }}
//                 >
//                   {totalCount} records • Page {page} of {totalPages}
//                 </Typography>

//                 {/* Pagination Buttons */}
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <button
//                     onClick={handlePrev}
//                     disabled={page === 1}
//                     style={{
//                       backgroundColor: page === 1 ? "#E0E0E0" : "#1230ae",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "8px",
//                       padding: "4px 6px",
//                       width: "34px",
//                       height: "32px",
//                       cursor: page === 1 ? "not-allowed" : "pointer",
//                       margin: "0 3px",
//                       transition: "0.2s",
//                     }}
//                   >
//                     <UilAngleLeftB />
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (pg) =>
//                         pg === 1 ||
//                         pg === totalPages ||
//                         Math.abs(pg - page) <= 2
//                     )
//                     .map((pg, idx, arr) => (
//                       <React.Fragment key={pg}>
//                         {idx > 0 && pg > arr[idx - 1] + 1 && (
//                           <span
//                             style={{
//                               color: "#aaa",
//                               fontSize: "14px",
//                               fontFamily: "'Nunito', sans-serif",
//                               margin: "0 5px",
//                             }}
//                           >
//                             ...
//                           </span>
//                         )}
//                         <button
//                           onClick={() => setPage(pg)}
//                           style={{
//                             backgroundColor:
//                               page === pg ? "#4169e1" : "#f0f0f0",
//                             color: page === pg ? "#fff" : "#333",
//                             border: "none",
//                             borderRadius: "8px",
//                             padding: "5px 11px",
//                             height: "32px",
//                             margin: "0 3px",
//                             cursor: "pointer",
//                             fontWeight: page === pg ? "bold" : 500,
//                             transition: "0.2s",
//                           }}
//                         >
//                           {pg}
//                         </button>
//                       </React.Fragment>
//                     ))}

//                   <button
//                     onClick={handleNext}
//                     disabled={page === totalPages}
//                     style={{
//                       backgroundColor:
//                         page === totalPages ? "#E0E0E0" : "#1230ae",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "8px",
//                       padding: "4px 6px",
//                       width: "34px",
//                       height: "32px",
//                       cursor: page === totalPages ? "not-allowed" : "pointer",
//                       margin: "0 3px",
//                       transition: "0.2s",
//                     }}
//                   >
//                     <UilAngleRightB />
//                   </button>
//                 </Box>
//               </Box>
//             )}

//             {/* ---- COUNTS FOOTER ---- */}
//             {students.length > 0 && (
//               <Typography
//                 variant="body2"
//                 sx={{
//                   fontWeight: "bold",
//                   mt: 2,
//                   fontFamily: "'Nunito', sans-serif",
//                   color: "#333",
//                 }}
//               >
//                 Total Issue: [{totalCount}] | Total Received: [{successCount}] |
//                 Pending: [{pendingCount}]
//               </Typography>
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
  useRef,
  useMemo,
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
  Menu,
  TableContainer,
} from "@mui/material";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilDownloadAlt,
  UilInfoCircle,
} from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import { RxCross2 } from "react-icons/rx";
import excelImg from "../../../../public/excell-img.png";
import Swal from "sweetalert2"; // ← added
import CreateButton from "../../../Components/CommonButton/CreateButton";

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
    {options.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </TextField>
);

const OMRreceipt = () => {
  /* ======================  STATE  ====================== */
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
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
  const [successCount, setSuccessCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [fetchError, setFetchError] = useState(null);

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

  const rollNoRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl); // ← fixed

  /* ======================  INITIAL DATA  ====================== */
  // useEffect(() => {
  //   const fetchLocation = async () => {
  //     try {
  //       const [c, s, d, ci] = await Promise.all([
  //         axios.get(`${API_BASE_URL}/api/countries`),
  //         axios.get(`${API_BASE_URL}/api/states`),
  //         axios.get(`${API_BASE_URL}/api/districts`),
  //         axios.get(`${API_BASE_URL}/api/cities/all/c1`),
  //       ]);
  //       setCountries(Array.isArray(c?.data) ? c.data : []);
  //       setStates(Array.isArray(s?.data) ? s.data : []);
  //       setDistricts(Array.isArray(d?.data) ? d.data : []);
  //       setCities(Array.isArray(ci?.data) ? ci.data : []);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   fetchLocation();
  // }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const [c, s, d, ci] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);
        setCountries(Array.isArray(c?.data) ? c.data : []);
        setStates(Array.isArray(s?.data) ? s.data : []);
        setDistricts(Array.isArray(d?.data) ? d.data : []);
        setCities(Array.isArray(ci?.data) ? ci.data : []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLocation();
  }, []);

  /* ==== AUTO SELECT INDIA BY DEFAULT ==== */
  useEffect(() => {
    if (countries.length === 0) return;

    const india = countries.find(
      (c) =>
        c.name?.toLowerCase() === "india" ||
        c.country_name?.toLowerCase() === "india"
    );

    if (india && !selectedCountry) {
      setSelectedCountry(india.id);
    }
  }, [countries, selectedCountry]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/class`);
        setClasses(data.map((c) => ({ value: c.id, label: c.name })));
      } catch (e) {
        console.error(e);
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
        console.error(e);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  /* ======================  SCHOOLS BY LOCATION  ====================== */
  const fetchSchoolsByLocation = async (filters) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        {
          params: filters,
        }
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
      } else setSchools([]);
    } catch (e) {
      console.error(e);
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ======================  LOCATION FILTER EFFECTS  ====================== */
  useEffect(() => {
    if (selectedCountry) {
      setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
      fetchSchoolsByLocation({ country: selectedCountry });
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolId("");
    setStudents([]);
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState) {
      setFilteredDistricts(
        districts.filter((d) => d.state_id === selectedState)
      );
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
      });
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolId("");
    setStudents([]);
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      setFilteredCities(
        cities.filter((c) => c.district_id === selectedDistrict)
      );
      fetchSchoolsByLocation({
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
      });
    }
    setSelectedCity("");
    setSelectedSchoolId("");
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
    setSelectedSchoolId("");
    setStudents([]);
  }, [selectedCity]);

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

  /* ======================  FETCH STUDENTS  ====================== */
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
      setFetchError(null);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      const rollnoclasssubject = selectedRollClassSubject;

      const payload = {
        schoolId: Number(selectedSchoolId),
        classList: rollnoclasssubject
          ? [Number(rollnoclasssubject.split("-")[1])]
          : selectedClassIds,
        subjectList: rollnoclasssubject
          ? [Number(rollnoclasssubject.split("-")[2])]
          : selectedSubjectIds,
      };

      if (rollnoclasssubject) payload.rollnoclasssubject = rollnoclasssubject;

      const { data } = await axios.post(
        `${API_BASE_URL}/api/get/filter/omr-receipt`,
        payload
      );

      const raw = data.students || [];
      const normalised = raw.map((s) => ({
        ...s,
        status: (s.status ?? "Pending").toLowerCase(),
        student_subject: Array.isArray(s.student_subject)
          ? s.student_subject
          : s.subject_names
          ? s.subject_names.split(", ")
          : [],
      }));

      setStudents(normalised);
      setTotalCount(data.totalCount ?? raw.length);
      setSuccessCount(data.successCount ?? 0);
      setPendingCount(data.pendingCount ?? 0);
    } catch (e) {
      console.error(e);
      setFetchError(
        e.response?.data?.message ||
          "Failed to fetch students. Please check your selections."
      );
      setStudents([]);
      setTotalCount(0);
      setSuccessCount(0);
      setPendingCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedSchoolId,
    selectedClassIds,
    selectedSubjectIds,
    selectedRollClassSubject,
  ]);

  useEffect(() => {
    fetchStudents();
    setPage(1);
  }, [
    selectedSchoolId,
    selectedClassIds,
    selectedSubjectIds,
    selectedRollClassSubject,
    fetchStudents,
  ]);

  /* ======================  PAGINATION  ====================== */
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return students.slice(start, start + pageSize);
  }, [students, page, pageSize]);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  /* ======================  BULK ACTIONS  ====================== */
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
    handleClose();
  };

  const handleDownloadClick = () => {
    const csvContent = `school,class,subject,name,roll_no
"Gowell School","10","Mathematics","Amit Kumar","GWL10A01"
"Sunrise Academy","XII","Physics","Priya Sharma","SRA12P05"
"Delhi Public School","11","Chemistry","Rahul Verma","DPS11C12"`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "omr_receipt_bulk_template.csv";
    link.click();
    handleClose();
  };

  // const parseCSVData = (csvText) => {
  //   const lines = csvText.split(/\r\n|\n/).filter((l) => l.trim());
  //   if (lines.length <= 1) {
  //     Swal.fire("Empty File", "CSV has no data rows", "warning");
  //     return;
  //   }

  //   const headers = lines[0]
  //     .toLowerCase()
  //     .split(",")
  //     .map((h) => h.trim().replace(/"/g, ""));
  //   const required = ["school", "class", "subject", "name", "roll_no"];
  //   const missing = required.filter((c) => !headers.includes(c));

  //   if (missing.length) {
  //     Swal.fire(
  //       "Invalid Template",
  //       `Missing columns: ${missing.join(", ")}`,
  //       "error"
  //     );
  //     return;
  //   }

  //   const rows = lines
  //     .slice(1)
  //     .map((line, idx) => {
  //       const vals = line.split(",").map((v) => v.trim().replace(/"/g, ""));
  //       if (vals.length < 5) return null;
  //       return {
  //         school: vals[headers.indexOf("school")],
  //         class: vals[headers.indexOf("class")],
  //         subject: vals[headers.indexOf("subject")],
  //         name: vals[headers.indexOf("name")],
  //         roll_no: vals[headers.indexOf("roll_no")],
  //       };
  //     })
  //     .filter(Boolean);

  //   if (!rows.length) {
  //     Swal.fire("No Valid Data", "No readable rows found in CSV", "warning");
  //     return;
  //   }

  //   axios
  //     .post(`${API_BASE_URL}/api/omr-receipt/bulk-upload`, { rows })
  //     .then((res) => {
  //       if (res.data.success) {
  //         const { inserted, errors = [] } = res.data;
  //         let html = `<strong>${inserted} records uploaded successfully!</strong>`;
  //         if (errors.length) {
  //           html += `<br><br><strong>${errors.length} rows failed:</strong><br>`;
  //           errors
  //             .slice(0, 12)
  //             .forEach((e) => (html += `• Row ${e.row}: ${e.message}<br>`));
  //           if (errors.length > 12) html += `...and ${errors.length - 12} more`;
  //         }
  //         Swal.fire({
  //           icon: "success",
  //           title: "Bulk Upload Complete",
  //           html,
  //           width: 700,
  //           confirmButtonColor: "#1230AE",
  //         });
  //         fetchStudents();
  //       }
  //     })
  //     .catch((err) => {
  //       const msg = err.response?.data?.message || "Upload failed.";
  //       Swal.fire("Upload Failed", msg, "error");
  //     });
  // };

  // 👉 Add this function at top
  const formatClassName = (className) => {
    if (/^\d$/.test(className)) {
      return `0${className}`;
    }
    return className;
  };

  const parseCSVData = (csvText) => {
    const lines = csvText.split(/\r\n|\n/).filter((l) => l.trim());
    if (lines.length <= 1) {
      Swal.fire("Empty File", "CSV has no data rows", "warning");
      return;
    }

    const headers = lines[0]
      .toLowerCase()
      .split(",")
      .map((h) => h.trim().replace(/"/g, ""));
    const required = ["school", "class", "subject", "name", "roll_no"];
    const missing = required.filter((c) => !headers.includes(c));

    if (missing.length) {
      Swal.fire(
        "Invalid Template",
        `Missing columns: ${missing.join(", ")}`,
        "error"
      );
      return;
    }

    const rows = lines
      .slice(1)
      .map((line, idx) => {
        const vals = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        if (vals.length < 5) return null;

        return {
          school: vals[headers.indexOf("school")],

          // 👉 Apply formatClassName here
          class: formatClassName(vals[headers.indexOf("class")]),

          subject: vals[headers.indexOf("subject")],
          name: vals[headers.indexOf("name")],
          roll_no: vals[headers.indexOf("roll_no")],
        };
      })
      .filter(Boolean);

    if (!rows.length) {
      Swal.fire("No Valid Data", "No readable rows found in CSV", "warning");
      return;
    }

    axios
      .post(`${API_BASE_URL}/api/omr-receipt/bulk-upload`, { rows })
      .then((res) => {
        if (res.data.success) {
          const { inserted, errors = [] } = res.data;
          let html = `<strong>${inserted} records uploaded successfully!</strong>`;
          if (errors.length) {
            html += `<br><br><strong>${errors.length} rows failed:</strong><br>`;
            errors
              .slice(0, 12)
              .forEach((e) => (html += `• Row ${e.row}: ${e.message}<br>`));
            if (errors.length > 12) html += `...and ${errors.length - 12} more`;
          }
          Swal.fire({
            icon: "success",
            title: "Bulk Upload Complete",
            html,
            width: 700,
            confirmButtonColor: "#1230AE",
          });
          fetchStudents();
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Upload failed.";
        Swal.fire("Upload Failed", msg, "error");
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      Swal.fire("Invalid File", "Only CSV files are allowed", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => parseCSVData(ev.target.result);
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <Mainlayout>
      {/* Header + Bulk Action */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Breadcrumb data={[{ name: "OMR Receipt" }]} />

        <div style={{ position: "relative" }}>
          <div
            onClick={handleClick}
            style={{
              cursor: "pointer",
              padding: "14px 12px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#1230AE",
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            <img
              src={excelImg}
              alt="Bulk"
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            Bulk Action
          </div>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Box sx={{ p: 2, minWidth: 360 }}>
              <div style={{ display: "flex", gap: 8, mb: 2 }}>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  style={{
                    backgroundColor: "#4A4545",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <img
                    src={excelImg}
                    alt=""
                    style={{ width: 24, height: 24 }}
                  />
                  Upload Excel
                </button>
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  style={{
                    backgroundColor: "#28A745",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <UilDownloadAlt size={20} />
                  Download Sample
                </button>
              </div>

              <Typography variant="subtitle2" gutterBottom>
                Note{" "}
                <UilInfoCircle
                  style={{ verticalAlign: "middle", color: "#1230AE" }}
                />
              </Typography>
              <ol
                style={{
                  fontSize: "12px",
                  color: "#666",
                  margin: "4px 0 0 16px",
                }}
              >
                <li>Download the sample file first.</li>
                <li>Fill the columns exactly as shown.</li>
                <li>Save as CSV (or Excel → Save As CSV).</li>
                <li>Upload using the button above.</li>
              </ol>
            </Box>
          </Menu>

          <input
            id="fileInput"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <Container maxWidth={false}>
        <Paper className={styles.main} elevation={3}>
          <Typography className={`${styles.formTitle} mb-4`}>
            OMR Receipt
          </Typography>

          {fetchError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {fetchError}
            </Typography>
          )}

          <form noValidate autoComplete="off">
            {/* Location */}
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

            {/* School / Class / Subject / Optional Roll */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 4 }}>
              <Box sx={{ flex: "1 1 300px", mt: -2 }}>
                <Dropdown
                  label="School"
                  value={selectedSchoolId}
                  options={schools.map((s) => ({
                    value: s.school_id,
                    label: `${s.school_name} ${
                      s.city_name ? `(${s.city_name})` : ""
                    }`,
                  }))}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  disabled={isLoading || schools.length === 0}
                />
              </Box>

              <Box sx={{ flex: "1 1 300px" }}>
                <Autocomplete
                  multiple
                  options={classes}
                  value={classes.filter((c) =>
                    selectedClassIds.includes(c.value)
                  )}
                  onChange={(_, newVal) =>
                    setSelectedClassIds(newVal.map((i) => i.value))
                  }
                  disableCloseOnSelect
                  getOptionLabel={(o) => o.label}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderTags={(tags) =>
                    tags.map((tag) => (
                      <span
                        key={tag.value}
                        style={{
                          background: "#90D14F",
                          color: "#fff",
                          borderRadius: 4,
                          padding: "2px 6px",
                          margin: "2px",
                          fontSize: 12,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {tag.label}
                        <RxCross2
                          size={12}
                          style={{ marginLeft: 4, cursor: "pointer" }}
                          onClick={() =>
                            setSelectedClassIds((prev) =>
                              prev.filter((i) => i !== tag.value)
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
                      size="small"
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: "1 1 300px" }}>
                <Autocomplete
                  multiple
                  options={subjects}
                  value={subjects.filter((s) =>
                    selectedSubjectIds.includes(s.value)
                  )}
                  onChange={(_, newVal) =>
                    setSelectedSubjectIds(newVal.map((i) => i.value))
                  }
                  disableCloseOnSelect
                  getOptionLabel={(o) => o.label}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderTags={(tags) =>
                    tags.map((tag) => (
                      <span
                        key={tag.value}
                        style={{
                          background: "#90D14F",
                          color: "#fff",
                          borderRadius: 4,
                          padding: "2px 6px",
                          margin: "2px",
                          fontSize: 12,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {tag.label}
                        <RxCross2
                          size={12}
                          style={{ marginLeft: 4, cursor: "pointer" }}
                          onClick={() =>
                            setSelectedSubjectIds((prev) =>
                              prev.filter((i) => i !== tag.value)
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
                      size="small"
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: "1 1 300px" }}>
                <TextField
                  inputRef={rollNoRef}
                  label="Roll-Class-Subject (Optional)"
                  placeholder="e.g., 7610336101-36-10"
                  size="small"
                  fullWidth
                  value={selectedRollClassSubject || ""}
                  onChange={(e) =>
                    setSelectedRollClassSubject(e.target.value || null)
                  }
                />
              </Box>
            </Box>
          </form>

          {/* Table */}
          {/* Table Wrapper */}
          <Box mt={4} p={3} borderRadius={3}>
            <Typography
              variant="h6"
              gutterBottom
              color="#1230ae"
              fontWeight={700}
            >
              Students
            </Typography>

            <TableContainer
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              }}
            >
             
              <Table
                sx={{
                  minWidth: 1100,
                  border: "none",
                  "& th, & td": {
                    borderRight: "1px solid #e5e5e5",
                  },
                  "& th:last-child, & td:last-child": {
                    borderRight: "none",
                  },
                  "& .MuiTableRow-root": {
                    borderBottom: "1px solid #e5e5e5",
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      background: "linear-gradient(90deg, #1230ae, #4169e1)",
                    }}
                  >
                    {[
                      "Student",
                      "Roll No",
                      "Class",
                      "Section",
                      "Subject",
                      "Mobile Number",
                      "Status",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          py: 1.5,
                          fontSize: "0.9rem",
                          borderRight: "1px solid rgba(255,255,255,0.3)",
                          "&:last-child": {
                            borderRight: "none",
                          },
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : paginatedStudents.length ? (
                    paginatedStudents.map((s, idx) => (
                      <TableRow
                        key={`${s.roll_no}-${idx}`}
                        hover
                        sx={{
                          "&:hover": { background: "#f4f7ff" },
                          transition: "0.2s ease",
                        }}
                      >
                        <TableCell>{s.student_name || "N/A"}</TableCell>
                        <TableCell>{s.roll_no || "N/A"}</TableCell>
                        <TableCell>{s.class_name || "N/A"}</TableCell>
                        <TableCell>{s.student_section || "N/A"}</TableCell>

                        <TableCell>
                          {Array.isArray(s.student_subject) &&
                          s.student_subject.length
                            ? s.student_subject
                                .map(
                                  (sub) =>
                                    sub.charAt(0).toUpperCase() + sub.slice(1)
                                )
                                .join(", ")
                            : "N/A"}
                        </TableCell>

                        <TableCell>{s.mobile_number || "N/A"}</TableCell>

                        <TableCell
                          sx={{
                            fontWeight: 700,
                            color:
                              s.status === "success"
                                ? "#28a745"
                                : s.status === "pending"
                                ? "#dc3545"
                                : "#6c757d",
                          }}
                        >
                          {s.status?.toUpperCase() || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        {selectedSchoolId &&
                        selectedClassIds.length &&
                        selectedSubjectIds.length
                          ? "No students found"
                          : "Please select school, class and subject"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalCount > 0 && (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={3}
                  flexWrap="wrap"
                  gap={2}
                >
                  {/* Page Size */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    >
                      {pageSizes.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                    <Typography variant="body2">per page</Typography>
                  </Box>

                  {/* Page Counter */}
                  <Typography variant="body2" fontWeight={600}>
                    {totalCount} records • Page {page} of {totalPages}
                  </Typography>

                  {/* Navigation */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <button
                      onClick={handlePrev}
                      disabled={page === 1}
                      style={{ padding: "4px 8px" }}
                    >
                      <UilAngleLeftB />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 || p === totalPages || Math.abs(p - page) <= 2
                      )
                      .map((p, idx, arr) => (
                        <React.Fragment key={p}>
                          {idx > 0 && p > arr[idx - 1] + 1 && "... "}
                          <button
                            onClick={() => setPage(p)}
                            style={{
                              background: page === p ? "#1230ae" : "#f0f0f0",
                              color: page === p ? "#fff" : "#333",
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontWeight: 600,
                            }}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      onClick={handleNext}
                      disabled={page === totalPages}
                      style={{ padding: "4px 8px" }}
                    >
                      <UilAngleRightB />
                    </button>
                  </Box>
                </Box>

                <Typography mt={2} fontWeight="bold">
                  Total Issue: [{totalCount}] | Received: [{successCount}] |
                  Pending: [{pendingCount}]
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
