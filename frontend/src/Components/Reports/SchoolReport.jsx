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
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import styles from "./studentReport.module.css"; // Updated to reflect component name
// import axios from "axios";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import "../Common-Css/Swallfire.css";
// import schoolPdf from "../Reports/SchoolPdf"

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

// const SchoolReport = () => {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [schoolData, setSchoolData] = useState(null); // State for school details
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
//   const [page, setPage] = useState(0); // Single page state for school data
//   const [rowsPerPage] = useState(10); // Fixed rows per page
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

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

//   // Filter states, districts, cities based on selections
//   useEffect(() => {
//     setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
//     setSelectedState("");
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSchoolData(null);
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSchoolData(null);
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setSelectedSchool("");
//     setSchoolData(null);
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

//   // Fetch school details when a school is selected
//   useEffect(() => {
//     const fetchSchoolDetails = async () => {
//       if (!selectedSchool) {
//         setSchoolData(null);
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setFetchError(null);
//         const response = await axios.get(
//           `${API_BASE_URL}/api/get/school-report/${selectedSchool}`
//         );
//         if (response.data.success) {
//           setSchoolData(response.data.data);
//         } else {
//           setSchoolData(null);
//           Swal.fire({
//             icon: "warning",
//             title: "No School Data",
//             text: "No data found for the selected school.",
//             confirmButtonColor: "#1230AE",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching school details:", error);
//         setFetchError("Failed to fetch school details");
//         setSchoolData(null);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to fetch school details. Please try again.",
//           confirmButtonColor: "#1230AE",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSchoolDetails();
//   }, [selectedSchool]);

//   // PDF generation for school data
//   const handleGenerateProfessionalPDF = async () => {
//     if (!schoolData) return;

//     const schoolName = schoolData.name || "School Name";
//     const pdf = new jsPDF("p", "mm", "a4");

//     // Header
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(16);
//     pdf.text(schoolName, 40, 15);

//     // Title
//     pdf.setFontSize(14);
//     const title = "School Report";
//     const titleWidth = pdf.getTextWidth(title);
//     pdf.text(title, (pdf.internal.pageSize.width - titleWidth) / 2, 30);

//     // Table content
//     const content = document.getElementById("table-content");
//     if (content) {
//       const canvas = await html2canvas(content, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       const imgWidth = 190;
//       const pageHeight = pdf.internal.pageSize.height;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 40;

//       pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight - position;

//       while (heightLeft > 0) {
//         pdf.addPage();
//         pdf.setFontSize(12);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("[Logo]", 10, 15);
//         pdf.setFontSize(16);
//         pdf.text(schoolName, 40, 15);
//         pdf.setFontSize(14);
//         pdf.text(title, (pdf.internal.pageSize.width - titleWidth) / 2, 30);

//         position = -(imgHeight - heightLeft) + 40;
//         pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight - 40;
//       }

//       // Footer
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

//       pdf.save("school-report.pdf");
//     }
//     setAnchorEl(null);
//   };

//   // Excel generation for school data
//   const handleGenerateExcel = () => {
//     if (!schoolData) return;

//     const wb = XLSX.utils.book_new();
//     const wsData = [
//       ["Board", "School", "School Code", "Email", "Contact", "PinCode"],
//       [
//         schoolData.board || "N/A",
//         schoolData.school_name || "N/A",
//         schoolData.school_code || "N/A",
//         schoolData.school_email || "N/A",
//         schoolData.school_contact_number || "N/A",
//         schoolData.pincode || "N/A",
//       ],
//     ];
//     const ws = XLSX.utils.aoa_to_sheet(wsData);
//     XLSX.utils.book_append_sheet(wb, ws, "School-Report");
//     XLSX.writeFile(wb, "school-report.xlsx");
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
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "School-Report" }]} />
//       </div>
//       <Container component="main" maxWidth="xl">
//         <Paper
//           className={styles.main}
//           elevation={3}
//           sx={{ padding: 3, marginTop: 2, borderRadius: 2 }}
//         >
//           <Typography variant="h5" className={styles.formTitle} sx={{ mb: 2 }}>
//             School Report
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
//                     backgroundColor: schoolData ? "#1230AE" : "#b0bec5",
//                     color: "#fff",
//                     textTransform: "none",
//                     fontWeight: "bold",
//                     padding: "8px 16px",
//                     borderRadius: "8px",
//                     "&:hover": {
//                       backgroundColor: schoolData ? "#0e2587" : "#b0bec5",
//                     },
//                   }}
//                   endIcon={<ArrowDropDownIcon />}
//                   onClick={handleDownloadClick}
//                   disabled={!schoolData}
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
//                         Board
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         School
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         School Code
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         Email
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         Contact
//                       </TableCell>
//                       <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                         PinCode
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {schoolData ? (
//                       <TableRow
//                         sx={{ "&:hover": { backgroundColor: "#f0f4ff" } }}
//                       >
//                         <TableCell>{schoolData.board || "N/A"}</TableCell>
//                         <TableCell>{schoolData.school_name || "N/A"}</TableCell>
//                         <TableCell>{schoolData.school_code || "N/A"}</TableCell>
//                         <TableCell>
//                           {schoolData.school_email || "N/A"}
//                         </TableCell>
//                         <TableCell>
//                           {schoolData.school_contact_number || "N/A"}
//                         </TableCell>
//                         <TableCell>{schoolData.pincode || "N/A"}</TableCell>
//                       </TableRow>
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={6} align="center">
//                           <Typography variant="body2" color="textSecondary">
//                             {selectedSchool
//                               ? "No school data found"
//                               : "Select a school to display details"}
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               {schoolData && (
//                 <TablePagination
//                   component="div"
//                   count={1} // Only one school is displayed
//                   page={page}
//                   onPageChange={(_, newPage) => setPage(newPage)}
//                   rowsPerPage={rowsPerPage}
//                   rowsPerPageOptions={[rowsPerPage]}
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

// export default SchoolReport;


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
import styles from "./studentReport.module.css"; // Updated to reflect component name
import axios from "axios";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../Common-Css/Swallfire.css";
import SchoolPdf from "../Reports/SchoolPdf";

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

const SchoolReport = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schoolData, setSchoolData] = useState(null); // State for school details
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
  const [page, setPage] = useState(0); // Single page state for school data
  const [rowsPerPage] = useState(10); // Fixed rows per page
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const pdfContentRef = useRef(null);

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

  // Filter states, districts, cities based on selections
  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSchoolData(null);
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchool("");
    setSchoolData(null);
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchool("");
    setSchoolData(null);
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

  // Fetch school details when a school is selected
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      if (!selectedSchool) {
        setSchoolData(null);
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);
        const response = await axios.get(
          `${API_BASE_URL}/api/get/school-report/${selectedSchool}`
        );
        if (response.data.success) {
          const data = response.data.data;
          const schoolInfo = schools.find((s) => s.id === selectedSchool);
          if (schoolInfo) {
            data.country_name = schoolInfo.country_name;
            data.state_name = schoolInfo.state_name;
            data.district_name = schoolInfo.district_name;
            data.city_name = schoolInfo.city_name;
          }
          setSchoolData(data);
        } else {
          setSchoolData(null);
          Swal.fire({
            icon: "warning",
            title: "No School Data",
            text: "No data found for the selected school.",
            confirmButtonColor: "#1230AE",
          });
        }
      } catch (error) {
        console.error("Error fetching school details:", error);
        setFetchError("Failed to fetch school details");
        setSchoolData(null);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch school details. Please try again.",
          confirmButtonColor: "#1230AE",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [selectedSchool, schools]);

  // PDF generation for school data
  const handleGenerateProfessionalPDF = async () => {
    if (!schoolData) return;

    const pdf = new jsPDF("l", "mm", "a4");

    const content = pdfContentRef.current;
    if (content) {
      const canvas = await html2canvas(content, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - position;

      while (heightLeft > 0) {
        pdf.addPage();
        position = -(imgHeight - heightLeft) + 10;
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - position;
      }

      // Footer
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

      pdf.save("school-report.pdf");
    }
    setAnchorEl(null);
  };

  // Excel generation for school data
  const handleGenerateExcel = () => {
    if (!schoolData) return;

    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Board", "School", "School Code", "Email", "Contact", "PinCode"],
      [
        schoolData.board || "N/A",
        schoolData.school_name || "N/A",
        schoolData.school_code || "N/A",
        schoolData.school_email || "N/A",
        schoolData.school_contact_number || "N/A",
        schoolData.pincode || "N/A",
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "School-Report");
    XLSX.writeFile(wb, "school-report.xlsx");
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
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "School-Report" }]} />
      </div>
      <Container component="main" maxWidth="xl">
        <Paper
          className={styles.main}
          elevation={3}
          sx={{ padding: 3, marginTop: 2, borderRadius: 2 }}
        >
          <Typography variant="h5" className={styles.formTitle} sx={{ mb: 2 }}>
            School Report
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
                    backgroundColor: schoolData ? "#1230AE" : "#b0bec5",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: "bold",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: schoolData ? "#0e2587" : "#b0bec5",
                    },
                  }}
                  endIcon={<ArrowDropDownIcon />}
                  onClick={handleDownloadClick}
                  disabled={!schoolData}
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
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#3959d9ff" }}>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Board
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        School
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        School Code
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Contact
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        PinCode
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schoolData ? (
                      <TableRow
                        sx={{ "&:hover": { backgroundColor: "#f0f4ff" } }}
                      >
                        <TableCell>{schoolData.board || "N/A"}</TableCell>
                        <TableCell>{schoolData.school_name || "N/A"}</TableCell>
                        <TableCell>{schoolData.school_code || "N/A"}</TableCell>
                        <TableCell>
                          {schoolData.school_email || "N/A"}
                        </TableCell>
                        <TableCell>
                          {schoolData.school_contact_number || "N/A"}
                        </TableCell>
                        <TableCell>{schoolData.pincode || "N/A"}</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="textSecondary">
                            {selectedSchool
                              ? "No school data found"
                              : "Select a school to display details"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {schoolData && (
                <TablePagination
                  component="div"
                  count={1} // Only one school is displayed
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[rowsPerPage]}
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
        sx={{ position: "absolute", left: "-9999px", width: "1200px" }}
        ref={pdfContentRef}
      >
        {schoolData && <SchoolPdf schoolData={schoolData} />}
      </Box>
    </Mainlayout>
  );
};

export default SchoolReport;





// import React from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import gowbellLogo from "../../assets/logo gowbell.jpg"; // replace with actual path
// import sunLogo from "../../assets/celebrate.png"; // replace with actual path

// export default function SchoolRegistrationTable() {
//   // Define widths for each column (must add up close to 100%)
//   const columnWidths = [
//     "3%",   // sl.no
//     "6%",   // board
//     "8%",  // school_name
//     "6%",   // school_id
//     "8%",  // principal_name
//     "13%",  // principal_contact_number
//     "10%",  // principal_whatsapp
//     "12%",  // first_incharge_name
//     "12%",  // first_incharge_number
//     "13%",  // first_incharge_whatsapp
//     "5%",   // city
//     "5%",   // district
//     "5%",   // state
//     "5%",   // country
//   ];

//   const headings = [
//     "sl.no",
//     "board",
//     "school_name",
//     "school_id",
//     "principal_name",
//     "principal_contact_number",
//     "principal_whatsapp",
//     "first_incharge_name",
//     "first_incharge_number",
//     "first_incharge_whatsapp",
//     "city",
//     "district",
//     "state",
//     "country",
//   ];

//   const rowData = [
//     "", // sl.no
//     "", // board
//     "", // school_name
//     "", // school_id
//     "", // principal_name
//     "7991048546", // principal_contact_number
//     "7991048546", // principal_whatsapp
//     "prasant", // first_incharge_name
//     "9898789078", // first_incharge_number
//     "9898789078", // first_incharge_whatsapp
//     "", // city
//     "", // district
//     "", // state
//     "", // country
//   ];

//   return (
//     <Box
//       sx={{
//         p: 1,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         width: "100%",
//         overflowX: "auto",
//       }}
//     >
//       <Table
//         sx={{
//           border: "1px solid black",
//           borderCollapse: "collapse",
//           width: "100%",
//           tableLayout: "fixed", // required for column widths to stick
//         }}
//       >
//         {/* Column widths */}
//         <colgroup>
//           {columnWidths.map((w, i) => (
//             <col key={i} style={{ width: w }} />
//           ))}
//         </colgroup>

//         <TableHead>
//           {/* Top Row with Logos and Title */}
//           <TableRow>
//             {/* Gowbell Logo same width as school_name column */}
//             <TableCell
//               sx={{
//                 borderBottom: "1px solid black",
//                 textAlign: "center",
//                 p: 0.5,
//               }}
//             >
//               <img src={gowbellLogo} alt="Gowbell Logo" style={{ height: 45, width: 250 }} />
//             </TableCell>
//             {/* Empty cells to fill until title */}
//             <TableCell colSpan={2} sx={{ borderBottom: "1px solid black" }}></TableCell>

//             {/* Center Title */}
//             <TableCell colSpan={6} sx={{ border: "1px solid black", p: 1 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontWeight: "bold",
//                     fontSize: "1rem",
//                     color: "#000",
//                     lineHeight: 1.4,
//                   }}
//                 >
//                   GOWBELL FOUNDATION-INDIA
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontWeight: "bold",
//                     fontSize: "1rem",
//                     color: "#000",
//                     lineHeight: 1.4,
//                   }}
//                 >
//                   SCHOOL REGISTRATION DETAILS-2025-26
//                 </Typography>
//               </Box>
//             </TableCell>

//             {/* Empty cells before Sun Logo */}
//             <TableCell colSpan={4} sx={{ borderBottom: "1px solid black" }}></TableCell>

//             {/* Sun Logo same width as first_incharge_whatsapp column */}
//             <TableCell
//               sx={{
//                 borderBottom: "1px solid black",
//                 // textAlign: "center",
//                 p: 0.5,
//               }}
//             >
//               <img src={sunLogo} alt="Sun Logo" style={{ height: 45, marginLeft:-200, width: 90}} />
//             </TableCell>
//           </TableRow>

//           {/* Headings Row */}
//           <TableRow>
//             {headings.map((heading, index) => (
//               <TableCell
//                 key={index}
//                 sx={{
//                   border: "1px solid black",
//                   fontWeight: "bold",
//                   fontSize: "0.75rem",
//                   textAlign: "center",
//                   padding: "4px 6px",
//                   lineHeight: 1.2,
//                   wordWrap: "break-word",
//                 }}
//               >
//                 {heading.toUpperCase()}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           <TableRow>
//             {rowData.map((value, index) => (
//               <TableCell
//                 key={index}
//                 sx={{
//                   border: "1px solid black",
//                   textAlign: "center",
//                   padding: "4px 6px",
//                   wordWrap: "break-word",
//                 }}
//               >
//                 {value}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableBody>
//       </Table>
//     </Box>
//   );
// }

