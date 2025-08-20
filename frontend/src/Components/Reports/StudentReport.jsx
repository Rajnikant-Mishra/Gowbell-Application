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
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   CircularProgress,
//   Button,
//   Menu,
// } from "@mui/material";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import TableChartIcon from "@mui/icons-material/TableChart";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import * as XLSX from "xlsx";
// import Mainlayout from "../Layouts/Mainlayout";
// import Breadcrumb from "../CommonButton/Breadcrumb";0.
// import styles from "./studentReport.module.css";
// import axios from "axios";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../Common-Css/Swallfire.css";
// // import studentPdf from "../Reports/StudentPdf";

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

// const StudentReport = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
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
//   const [studentDataByClassSubject, setStudentDataByClassSubject] = useState(
//     []
//   );
//   const [canGenerateReport, setCanGenerateReport] = useState(false);
//   const [pageByGroup, setPageByGroup] = useState({});
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

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

//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassIds([]);
//     setSelectedSubjectIds([]);
//     setStudentDataByClassSubject([]);
//     setCanGenerateReport(false);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassIds([]);
//     setSelectedSubjectIds([]);
//     setStudentDataByClassSubject([]);
//     setCanGenerateReport(false);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSelectedClassIds([]);
//     setSelectedSubjectIds([]);
//     setStudentDataByClassSubject([]);
//     setCanGenerateReport(false);
//   }, [selectedDistrict, cities]);

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

//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (selectedSchool) {
//         try {
//           setIsLoading(true);
//           setFetchError(null);
//           const response = await axios.post(
//             `${API_BASE_URL}/api/get/student-report`,
//             {
//               schoolId: selectedSchool,
//               classList: selectedClassIds,
//               subjectList: selectedSubjectIds,
//             }
//           );

//           const { students, totalCount, classNames, subjectNames } =
//             response.data;

//           const studentData = students.map((student, index) => ({
//             id: index + 1,
//             rollNo:
//               student.roll_no ||
//               `OR0829-06-${student.section || "A"}-${index + 1}`,
//             className: student.class_name || "Unknown Class",
//             subjectNames: student.subject_names || "Unknown Subject",
//             section: student.section || "A",
//             name: student.student_name || "Unknown",
//             mobileNumber: student.mobile_number || "N/A",
//           }));

//           const groupKey = selectedSchool; // Use schoolId as groupKey when no class/subject filters
//           setStudentDataByClassSubject([
//             {
//               classIds: selectedClassIds,
//               subjectIds: selectedSubjectIds,
//               students: studentData,
//               totalCount: totalCount || 0,
//             },
//           ]);
//           setPageByGroup({ [groupKey]: 0 });
//           setCanGenerateReport(studentData.length > 0);

//           if (!studentData.length) {
//             Swal.fire({
//               icon: "warning",
//               title: "No Students Found",
//               text: "No students found for the selected criteria.",
//               confirmButtonColor: "#1230AE",
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching students:", error);
//           setFetchError("Failed to fetch students");
//           setStudentDataByClassSubject([]);
//           setCanGenerateReport(false);
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "Failed to fetch students. Please try again.",
//             confirmButtonColor: "#1230AE",
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         setStudentDataByClassSubject([]);
//         setCanGenerateReport(false);
//       }
//     };

//     fetchStudents();
//   }, [selectedSchool, selectedClassIds, selectedSubjectIds]);

//   const handleChangePage = (groupKey, newPage) => {
//     setPageByGroup((prev) => ({ ...prev, [groupKey]: newPage }));
//   };

//   const handleGenerateProfessionalPDF = async () => {
//     const schoolName =
//       schools.find((s) => s.id === selectedSchool)?.school_name ||
//       "School Name";
//     const pdf = new jsPDF("p", "mm", "a4");

//     // Professional header: Logo placeholder on top left, school name aligned next to it
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(16);
//     pdf.text(schoolName, 40, 15);

//     // Report title centered
//     pdf.setFontSize(14);
//     const title = "Student Report";
//     const titleWidth = pdf.getTextWidth(title);
//     pdf.text(title, (pdf.internal.pageSize.width - titleWidth) / 2, 30);

//     // Capture the table content (excluding buttons and pagination for clean report)
//     const content = document.getElementById("table-content");
//     if (content) {
//       const canvas = await html2canvas(content, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       const imgWidth = 190;
//       const pageHeight = pdf.internal.pageSize.height;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 40; // Start below header

//       pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight - position;

//       while (heightLeft > 0) {
//         pdf.addPage();

//         // Add header on every page for professional look
//         pdf.setFontSize(12);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("[Logo]", 10, 15);
//         pdf.setFontSize(16);
//         pdf.text(schoolName, 40, 15);
//         pdf.setFontSize(14);
//         pdf.text(title, (pdf.internal.pageSize.width - titleWidth) / 2, 30);

//         position = -(imgHeight - heightLeft) + 40; // Adjust shift to account for header on new pages
//         pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight - 40;
//       }

//       // Add footer on every page (professional touch: page number and date)
//       const pageCount = pdf.internal.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         pdf.setPage(i);
//         pdf.setFontSize(10);
//         pdf.setTextColor(150);
//         pdf.text(
//           `Page ${i} of ${pageCount}`,
//           10,
//           pdf.internal.pageSize.height - 10
//         );
//         pdf.text(
//           `Generated on: ${new Date().toLocaleDateString()}`,
//           pdf.internal.pageSize.width - 70,
//           pdf.internal.pageSize.height - 10
//         );
//       }

//       pdf.save("professional-student-report.pdf");
//     }
//     setAnchorEl(null);
//   };

//   const handleGenerateExcel = () => {
//     const wb = XLSX.utils.book_new();
//     studentDataByClassSubject.forEach((group) => {
//       const wsData = [
//         ["Student", "Roll No", "Class", "Subject", "Section", "Mobile Number"],
//         ...group.students.map((student) => [
//           student.name,
//           student.rollNo,
//           student.className,
//           student.subjectNames,
//           student.section,
//           student.mobileNumber,
//         ]),
//       ];
//       const ws = XLSX.utils.aoa_to_sheet(wsData);
//       XLSX.utils.book_append_sheet(wb, ws, "Student-Report");
//     });
//     XLSX.writeFile(wb, "student-report.xlsx");
//     setAnchorEl(null);
//   };

//   const handleDownloadClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleDownloadClose = () => {
//     setAnchorEl(null);
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
//     classes: classes.map((c) => ({ value: c.id, label: c.name })),
//     subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "Student-Report" }]} />
//       </div>
//       <Container component="main" maxWidth="xl">
//         <Paper
//           className={styles.main}
//           elevation={3}
//           sx={{ padding: 3, marginTop: 2, borderRadius: 2 }}
//         >
//           <Typography variant="h5" className={styles.formTitle} sx={{ mb: 2 }}>
//             Student Report
//           </Typography>
//           {fetchError && (
//             <Typography color="error" gutterBottom>
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
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="State"
//                   value={selectedState}
//                   options={dropdownOptions.states}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   disabled={!selectedCountry || isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="District"
//                   value={selectedDistrict}
//                   options={dropdownOptions.districts}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   disabled={!selectedState || isLoading}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
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
//                   label="School"
//                   value={selectedSchool}
//                   options={dropdownOptions.schools}
//                   onChange={(e) => setSelectedSchool(e.target.value)}
//                   disabled={isLoading || !selectedCity}
//                   multiple={false}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Classes"
//                   value={selectedClassIds}
//                   options={dropdownOptions.classes}
//                   onChange={(e) => setSelectedClassIds(e.target.value)}
//                   disabled={isLoading || !selectedSchool}
//                   multiple={true}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Dropdown
//                   label="Subjects"
//                   value={selectedSubjectIds}
//                   options={dropdownOptions.subjects}
//                   onChange={(e) => setSelectedSubjectIds(e.target.value)}
//                   disabled={isLoading || !selectedSchool}
//                   multiple={true}
//                 />
//               </Grid>
//             </Grid>
//           </form>

//           {isLoading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//               <CircularProgress sx={{ color: "#1230AE" }} />
//             </Box>
//           ) : (
//             <Box id="report-content" mt={4}>
//               <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//                 <Button
//                   variant="contained"
//                   sx={{
//                     backgroundColor: canGenerateReport ? "#1230AE" : "#b0bec5",
//                     color: "#fff",
//                     textTransform: "none",
//                     fontWeight: "bold",
//                     padding: "8px 16px",
//                     borderRadius: "8px",
//                     "&:hover": {
//                       backgroundColor: canGenerateReport
//                         ? "#0e2587"
//                         : "#b0bec5",
//                     },
//                   }}
//                   endIcon={<ArrowDropDownIcon />}
//                   onClick={handleDownloadClick}
//                   disabled={!canGenerateReport}
//                 >
//                   Download Report
//                 </Button>
//                 <Menu
//                   anchorEl={anchorEl}
//                   open={open}
//                   onClose={handleDownloadClose}
//                   PaperProps={{
//                     sx: {
//                       borderRadius: "8px",
//                       boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                     },
//                   }}
//                 >
//                   <MenuItem
//                     onClick={handleGenerateProfessionalPDF}
//                     sx={{ color: "#4568f1ff", fontWeight: "medium" }}
//                   >
//                     <PictureAsPdfIcon sx={{ mr: 1 }} />
//                     Download as PDF
//                   </MenuItem>
//                   <MenuItem
//                     onClick={handleGenerateExcel}
//                     sx={{ color: "#3a5eefff", fontWeight: "medium" }}
//                   >
//                     <TableChartIcon sx={{ mr: 1 }} />
//                     Download as Excel
//                   </MenuItem>
//                 </Menu>
//               </Box>
//               <TableContainer
//                 component={Paper}
//                 elevation={1}
//                 id="table-content"
//               >
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#3959d9ff" }}>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         Student
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         Roll No
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         Class
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         Subject
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         Section
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         Mobile Number
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {studentDataByClassSubject.length > 0 ? (
//                       studentDataByClassSubject.flatMap((group) => {
//                         const groupKey = selectedSchool; // Use schoolId as groupKey
//                         const page = pageByGroup[groupKey] || 0;
//                         const rowsPerPage = 10;
//                         const paginatedStudents = group.students.slice(
//                           page * rowsPerPage,
//                           page * rowsPerPage + rowsPerPage
//                         );

//                         return paginatedStudents.map((student) => (
//                           <TableRow
//                             key={`${groupKey}-${student.id}`}
//                             sx={{ "&:hover": { backgroundColor: "#f0f4ff" } }}
//                           >
//                             <TableCell>{student.name}</TableCell>
//                             <TableCell>{student.rollNo}</TableCell>
//                             <TableCell>{student.className}</TableCell>
//                             <TableCell>{student.subjectNames}</TableCell>
//                             <TableCell>{student.section}</TableCell>
//                             <TableCell>{student.mobileNumber}</TableCell>
//                           </TableRow>
//                         ));
//                       })
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={6} align="center">
//                           <Typography variant="body2" color="textSecondary">
//                             {selectedSchool
//                               ? "No students found for the selected criteria"
//                               : "Select a school to display students"}
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               {studentDataByClassSubject.length > 0 && (
//                 <TablePagination
//                   component="div"
//                   count={studentDataByClassSubject.reduce(
//                     (sum, group) => sum + group.students.length,
//                     0
//                   )}
//                   page={Object.values(pageByGroup)[0] || 0}
//                   onPageChange={(_, newPage) => {
//                     const newPageByGroup = {};
//                     studentDataByClassSubject.forEach((group) => {
//                       const groupKey = selectedSchool;
//                       newPageByGroup[groupKey] = newPage;
//                     });
//                     setPageByGroup(newPageByGroup);
//                   }}
//                   rowsPerPage={10}
//                   rowsPerPageOptions={[10]}
//                   sx={{
//                     ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
//                       {
//                         color: "#1230AE",
//                       },
//                     ".MuiTablePagination-actions button": {
//                       color: "#1230AE",
//                       "&:hover": {
//                         backgroundColor: "#f0f4ff",
//                       },
//                     },
//                   }}
//                 />
//               )}
//             </Box>
//           )}
//         </Paper>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default StudentReport;


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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Button,
  Menu,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import Mainlayout from "../Layouts/Mainlayout";
import Breadcrumb from "../CommonButton/Breadcrumb";
import styles from "./studentReport.module.css";
import axios from "axios";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../Common-Css/Swallfire.css";
import StudentPdf from "./StudentPdf ";

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

const StudentReport = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
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
  const [studentDataByClassSubject, setStudentDataByClassSubject] = useState(
    []
  );
  const [canGenerateReport, setCanGenerateReport] = useState(false);
  const [pageByGroup, setPageByGroup] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const pdfRef = useRef();

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

  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setStudentDataByClassSubject([]);
    setCanGenerateReport(false);
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setStudentDataByClassSubject([]);
    setCanGenerateReport(false);
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setStudentDataByClassSubject([]);
    setCanGenerateReport(false);
  }, [selectedDistrict, cities]);

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

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedSchool) {
        try {
          setIsLoading(true);
          setFetchError(null);
          const response = await axios.post(
            `${API_BASE_URL}/api/get/student-report`,
            {
              schoolId: selectedSchool,
              classList: selectedClassIds,
              subjectList: selectedSubjectIds,
            }
          );

          const { students, totalCount, classNames, subjectNames } =
            response.data;

          const studentData = students.map((student, index) => ({
            id: index + 1,
            rollNo:
              student.roll_no ||
              `OR0829-06-${student.section || "A"}-${index + 1}`,
            className: student.class_name || "Unknown Class",
            subjectNames: student.subject_names || "Unknown Subject",
            section: student.section || "A",
            name: student.student_name || "Unknown",
            mobileNumber: student.mobile_number || "N/A",
          }));

          const groupKey = selectedSchool; // Use schoolId as groupKey when no class/subject filters
          setStudentDataByClassSubject([
            {
              classIds: selectedClassIds,
              subjectIds: selectedSubjectIds,
              students: studentData,
              totalCount: totalCount || 0,
            },
          ]);
          setPageByGroup({ [groupKey]: 0 });
          setCanGenerateReport(studentData.length > 0);

          if (!studentData.length) {
            Swal.fire({
              icon: "warning",
              title: "No Students Found",
              text: "No students found for the selected criteria.",
              confirmButtonColor: "#1230AE",
            });
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setFetchError("Failed to fetch students");
          setStudentDataByClassSubject([]);
          setCanGenerateReport(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch students. Please try again.",
            confirmButtonColor: "#1230AE",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setStudentDataByClassSubject([]);
        setCanGenerateReport(false);
      }
    };

    fetchStudents();
  }, [selectedSchool, selectedClassIds, selectedSubjectIds]);

  const handleChangePage = (groupKey, newPage) => {
    setPageByGroup((prev) => ({ ...prev, [groupKey]: newPage }));
  };

  const handleGenerateProfessionalPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    // Capture the custom PDF component
    const content = pdfRef.current;
    if (content) {
      const canvas = await html2canvas(content, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0; // No additional header space

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = -(imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add footer on every page (professional touch: page number and date)
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(
          `Page ${i} of ${pageCount}`,
          10,
          pdf.internal.pageSize.height - 10
        );
        pdf.text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          pdf.internal.pageSize.width - 70,
          pdf.internal.pageSize.height - 10
        );
      }

      pdf.save("professional-student-report.pdf");
    }
    setAnchorEl(null);
  };

  const handleGenerateExcel = () => {
    const wb = XLSX.utils.book_new();
    studentDataByClassSubject.forEach((group) => {
      const wsData = [
        ["Student", "Roll No", "Class", "Subject", "Section", "Mobile Number"],
        ...group.students.map((student) => [
          student.name,
          student.rollNo,
          student.className,
          student.subjectNames,
          student.section,
          student.mobileNumber,
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "Student-Report");
    });
    XLSX.writeFile(wb, "student-report.xlsx");
    setAnchorEl(null);
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setAnchorEl(null);
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
    classes: classes.map((c) => ({ value: c.id, label: c.name })),
    subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Student-Report" }]} />
      </div>
      <Container component="main" maxWidth="xl">
        <Paper
          className={styles.main}
          elevation={3}
          sx={{ padding: 3, marginTop: 2, borderRadius: 2 }}
        >
          <Typography variant="h5" className={styles.formTitle} sx={{ mb: 2 }}>
            Student Report
          </Typography>
          {fetchError && (
            <Typography color="error" gutterBottom>
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
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={dropdownOptions.states}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry || isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={dropdownOptions.districts}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState || isLoading}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
                  label="School"
                  value={selectedSchool}
                  options={dropdownOptions.schools}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  disabled={isLoading || !selectedCity}
                  multiple={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Classes"
                  value={selectedClassIds}
                  options={dropdownOptions.classes}
                  onChange={(e) => setSelectedClassIds(e.target.value)}
                  disabled={isLoading || !selectedSchool}
                  multiple={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Subjects"
                  value={selectedSubjectIds}
                  options={dropdownOptions.subjects}
                  onChange={(e) => setSelectedSubjectIds(e.target.value)}
                  disabled={isLoading || !selectedSchool}
                  multiple={true}
                />
              </Grid>
            </Grid>
          </form>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress sx={{ color: "#1230AE" }} />
            </Box>
          ) : (
            <Box id="report-content" mt={4}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: canGenerateReport ? "#1230AE" : "#b0bec5",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: "bold",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: canGenerateReport
                        ? "#0e2587"
                        : "#b0bec5",
                    },
                  }}
                  endIcon={<ArrowDropDownIcon />}
                  onClick={handleDownloadClick}
                  disabled={!canGenerateReport}
                >
                  Download Report
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleDownloadClose}
                  PaperProps={{
                    sx: {
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleGenerateProfessionalPDF}
                    sx={{ color: "#4568f1ff", fontWeight: "medium" }}
                  >
                    <PictureAsPdfIcon sx={{ mr: 1 }} />
                    Download as PDF
                  </MenuItem>
                  <MenuItem
                    onClick={handleGenerateExcel}
                    sx={{ color: "#3a5eefff", fontWeight: "medium" }}
                  >
                    <TableChartIcon sx={{ mr: 1 }} />
                    Download as Excel
                  </MenuItem>
                </Menu>
              </Box>
              <TableContainer
                component={Paper}
                elevation={1}
                id="table-content"
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#3959d9ff" }}>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Student
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Roll No
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Class
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Subject
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Section
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Mobile Number
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentDataByClassSubject.length > 0 ? (
                      studentDataByClassSubject.flatMap((group) => {
                        const groupKey = selectedSchool; // Use schoolId as groupKey
                        const page = pageByGroup[groupKey] || 0;
                        const rowsPerPage = 10;
                        const paginatedStudents = group.students.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        );

                        return paginatedStudents.map((student) => (
                          <TableRow
                            key={`${groupKey}-${student.id}`}
                            sx={{ "&:hover": { backgroundColor: "#f0f4ff" } }}
                          >
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.rollNo}</TableCell>
                            <TableCell>{student.className}</TableCell>
                            <TableCell>{student.subjectNames}</TableCell>
                            <TableCell>{student.section}</TableCell>
                            <TableCell>{student.mobileNumber}</TableCell>
                          </TableRow>
                        ));
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="textSecondary">
                            {selectedSchool
                              ? "No students found for the selected criteria"
                              : "Select a school to display students"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {studentDataByClassSubject.length > 0 && (
                <TablePagination
                  component="div"
                  count={studentDataByClassSubject.reduce(
                    (sum, group) => sum + group.students.length,
                    0
                  )}
                  page={Object.values(pageByGroup)[0] || 0}
                  onPageChange={(_, newPage) => {
                    const newPageByGroup = {};
                    studentDataByClassSubject.forEach((group) => {
                      const groupKey = selectedSchool;
                      newPageByGroup[groupKey] = newPage;
                    });
                    setPageByGroup(newPageByGroup);
                  }}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                  sx={{
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                      {
                        color: "#1230AE",
                      },
                    ".MuiTablePagination-actions button": {
                      color: "#1230AE",
                      "&:hover": {
                        backgroundColor: "#f0f4ff",
                      },
                    },
                  }}
                />
              )}
            </Box>
          )}
        </Paper>
      </Container>
      <Box
        ref={pdfRef}
        sx={{
          position: "absolute",
          left: "-9999px",
          width: "1000px", // Adjust width for better capture
          p: 2,
        }}
      >
        <StudentPdf
          schoolName={
            schools.find((s) => s.id === selectedSchool)?.school_name ||
            "School Name"
          }
          students={studentDataByClassSubject.flatMap(
            (group) => group.students
          )}
          cityName={
            cities.find((c) => c.id === selectedCity)?.name || "Unknown City"
          }
          districtName={
            districts.find((d) => d.id === selectedDistrict)?.name ||
            "Unknown District"
          }
          stateName={
            states.find((s) => s.id === selectedState)?.name || "Unknown State"
          }
          countryName={
            countries.find((c) => c.id === selectedCountry)?.name ||
            "Unknown Country"
          }
        />
      </Box>
    </Mainlayout>
  );
};

export default StudentReport;