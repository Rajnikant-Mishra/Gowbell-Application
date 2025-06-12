// import React, { useState, useEffect, useCallback } from "react";
// import Mainlayout from "../../Layouts/Mainlayout";
// import { UilPlus, UilMinus } from "@iconscout/react-unicons";
// import ButtonComp from "../../CommonButton/ButtonComp";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import axios from "axios";
// import "../../Common-Css/Swallfire.css";
// import { Grid, TextField, Paper, Typography, MenuItem } from "@mui/material";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JsBarcode from "jsbarcode";

// const Extra = () => {
//   const [formData, setFormData] = useState({
//     school: "",
//     school_code: "",
//     subject: "",
//     exam_date: "",
//     exam_set: "",
//     print_date: new Date().toISOString().split("T")[0], // Default to today's date
//     packing_no: "",
//     rows: [
//       {
//         product_code: "S242500000849",
//         product_name: "IHO EXAM GUIDELINES 2024-25",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//       {
//         product_code: "S242500000850",
//         product_name: "IHO EXAM DETAILS 2024-25",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//       {
//         product_code: "S242500000851",
//         product_name: "IHO OMR RETURN ENVELOPES",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//       {
//         product_code: "S242500000852",
//         product_name: "IHO SET A SCHOOL LIBRARY PACK (SLP)",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//       {
//         product_code: "S242500000853",
//         product_name: "IHO SET A ATTENDANCE SHEET",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//     ],
//   });

//   const [schools, setSchools] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [submittedData, setSubmittedData] = useState(null);

//   const navigate = useNavigate();

//   // Fetch initial data (countries, states, districts, cities, subjects)
//   useEffect(() => {
//     let isMounted = true;

//     const fetchInitialData = async () => {
//       try {
//         setIsLoading(true);
//         const [countriesRes, statesRes, districtsRes, citiesRes, subjectsRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//             axios.get(`${API_BASE_URL}/api/subject`),
//           ]);

//         if (isMounted) {
//           setCountries(countriesRes.data || []);
//           setStates(statesRes.data || []);
//           setDistricts(districtsRes.data || []);
//           setCities(citiesRes.data || []);
//           setSubjects(
//             (subjectsRes.data || []).map((sub) => ({
//               id: sub.id,
//               name: sub.name,
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setError("Failed to load initial data");
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
//     setFormData({ ...formData, school: "" });
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setFormData({ ...formData, school: "" });
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setFormData({ ...formData, school: "" });
//   }, [selectedDistrict, cities]);

//   // Fetch schools based on location filters
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
//         setError(null);
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setError("Failed to fetch schools");
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

//   // Fetch exam date when school or subject changes
//   useEffect(() => {
//     const fetchExamDate = async () => {
//       if (formData.school && formData.subject) {
//         setIsLoading(true);
//         try {
//           const response = await axios.get(`${API_BASE_URL}/api/exams/dates`, {
//             params: {
//               school: formData.school,
//               subject: formData.subject,
//             },
//           });
//           if (response.data.data.length > 0) {
//             const isoDate = response.data.data[0].exam_date;
//             const formattedDate = isoDate.split("T")[0]; // Extract "yyyy-MM-dd"
//             setFormData((prevData) => ({
//               ...prevData,
//               exam_date: formattedDate,
//             }));
//           }
//         } catch (error) {
//           console.error("Error fetching exam date:", error);
//           setError("Failed to fetch exam date. Please try again.");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };
//     fetchExamDate();
//   }, [formData.school, formData.subject]);

//   // Function to add a new row to `rows`
//   const addRow = () => {
//     setFormData({
//       ...formData,
//       rows: [
//         ...formData.rows,
//         {
//           product_code: "",
//           product_name: "",
//           registered_quantity: "",
//           extra_quantity: "",
//           total_quantity: "",
//         },
//       ],
//     });
//   };

//   // Function to remove a row from `rows`
//   const removeRow = (index) => {
//     if (formData.rows.length > 1) {
//       const updatedRows = formData.rows.filter((_, i) => i !== index);
//       setFormData({ ...formData, rows: updatedRows });
//     }
//   };

//   // Function to handle changes to row inputs
//   const handleRowChange = (index, field, value) => {
//     const updatedRows = formData.rows.map((row, i) =>
//       i === index ? { ...row, [field]: value } : row
//     );
//     setFormData({ ...formData, rows: updatedRows });
//   };

//   // Function to handle form field changes
//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const generatePDF = (data) => {
//     const doc = new jsPDF(); // Create new PDF document

//     // Add Header
//     doc.setFontSize(14);
//     doc.text("Gowbell", 105, 15, { align: "center" });
//     doc.setFontSize(10);
//     doc.text("8/4, BMC Panchdeep Complex, Unit 4,", 105, 20, {
//       align: "center",
//     });
//     doc.text("Bhouma Nagar, Bhubaneswar, Odisha 751001", 105, 25, {
//       align: "center",
//     });

//     // Packing List Title
//     doc.setFontSize(16);
//     doc.text("PACKING LIST", 105, 35, { align: "center" });
//     doc.setFontSize(14);
//     doc.text(`SOF2425063980`, 105, 42, { align: "center" });

//     // Generate Barcode using school_code
//     const barcodeCanvas = document.createElement("canvas");
//     JsBarcode(barcodeCanvas, data.school_code, {
//       format: "CODE128",
//       displayValue: true,
//     });

//     // Convert barcode to image and add it to PDF
//     const barcodeImage = barcodeCanvas.toDataURL("image/png");
//     doc.addImage(barcodeImage, "PNG", 10, 50, 40, 20);

//     // School Details on the Right Side
//     doc.setFontSize(10);
//     const xRight = 140;
//     doc.text(`School Code: ${data.school_code}`, xRight, 50);
//     doc.text(`Exam Set: ${data.exam_set}`, xRight, 55);
//     doc.text(`Exam Name: ${data.exam_name}`, xRight, 60);
//     doc.text(`Exam Date: ${data.exam_date}`, xRight, 65);
//     doc.text(`Print Date: ${data.print_date}`, xRight, 70);
//     doc.text(`Packet No: ${data.packing_no}`, xRight, 75);

//     // Table Positioning
//     let startX = 10;
//     let startY = 85;
//     let rowHeight = 8;
//     let colWidths = [10, 30, 50, 40, 30, 30]; // Column widths

//     // Table Headers
//     const headers = [
//       "S.No",
//       "Product Code",
//       "Product Name",
//       "Registered Quantity",
//       "Extra Quantity",
//       "Total Quantity",
//     ];

//     // Draw Header Background
//     doc.setFillColor(200, 200, 200); // Light gray background
//     doc.rect(
//       startX,
//       startY,
//       colWidths.reduce((a, b) => a + b, 0),
//       rowHeight,
//       "F"
//     );

//     // Draw Table Headers
//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);
//     let xPos = startX;
//     headers.forEach((header, index) => {
//       doc.text(header, xPos + 2, startY + 5);
//       xPos += colWidths[index];
//     });

//     // Draw Table Rows
//     startY += rowHeight;
//     data.rows.forEach((row, rowIndex) => {
//       let xPos = startX;
//       doc.rect(
//         startX,
//         startY,
//         colWidths.reduce((a, b) => a + b, 0),
//         rowHeight
//       ); // Row boundary

//       const rowData = [
//         rowIndex + 1,
//         row.product_code,
//         row.product_name,
//         row.registered_quantity,
//         row.extra_quantity,
//         row.total_quantity,
//       ];

//       rowData.forEach((cell, index) => {
//         doc.text(String(cell), xPos + 2, startY + 5);
//         xPos += colWidths[index];
//       });

//       startY += rowHeight; // Move to next row
//     });

//     doc.save("packing_list.pdf");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Fetch school_code based on school_name
//     try {
//       const schoolCodeResponse = await axios.get(
//         `${API_BASE_URL}/api/school-code/${formData.school}`
//       );
//       const school_code = schoolCodeResponse.data.school_code;

//       // Auto-generate exam_name
//       const exam_name = `GW-${formData.subject}`;

//       // Prepare payload
//       const payload = {
//         ...formData,
//         school_code,
//         exam_name,
//         rows: formData.rows.map((row) => ({
//           ...row,
//           total_quantity: row.total_quantity,
//         })),
//       };

//       // Submit the form
//       const response = await axios.post(`${API_BASE_URL}/api/packing`, payload);
//       if (response.status === 200) {
//         setSubmittedData(payload); // Store submitted data
//         generatePDF(payload); // Generate PDF
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           text: "Packing added successfully!",
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         }).then(() => {
//           navigate("/packing-list"); // Refresh the current page
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error!",
//         text: "An error occurred while submitting the form.",
//       });
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[
//             { name: "Packing list", link: "/packing-list" },
//             { name: "Create", link: "/packing-create" },
//           ]}
//         />
//       </div>
//       <Paper elevation={3} className="w-100 bg-white p-4 mx-auto rounded">
//         <Typography variant="h6" gutterBottom>
//           Packing List Details
//         </Typography>
//         <form onSubmit={handleSubmit} style={{ fontFamily: "Poppins" }}>
//           <Grid container spacing={3}>
//             {/* Country Dropdown */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Country"
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//                 size="small"
//                 variant="outlined"
//               >
//                 <MenuItem value="">Select Country</MenuItem>
//                 {countries.map((country) => (
//                   <MenuItem key={country.id} value={country.id}>
//                     {country.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* State Dropdown */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="State"
//                 value={selectedState}
//                 onChange={(e) => setSelectedState(e.target.value)}
//                 size="small"
//                 variant="outlined"
//                 disabled={!selectedCountry}
//               >
//                 <MenuItem value="">Select State</MenuItem>
//                 {filteredStates.map((state) => (
//                   <MenuItem key={state.id} value={state.id}>
//                     {state.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* District Dropdown */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="District"
//                 value={selectedDistrict}
//                 onChange={(e) => setSelectedDistrict(e.target.value)}
//                 size="small"
//                 variant="outlined"
//                 disabled={!selectedState}
//               >
//                 <MenuItem value="">Select District</MenuItem>
//                 {filteredDistricts.map((district) => (
//                   <MenuItem key={district.id} value={district.id}>
//                     {district.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* City Dropdown */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="City"
//                 value={selectedCity}
//                 onChange={(e) => setSelectedCity(e.target.value)}
//                 size="small"
//                 variant="outlined"
//                 disabled={!selectedDistrict}
//               >
//                 <MenuItem value="">Select City</MenuItem>
//                 {filteredCities.map((city) => (
//                   <MenuItem key={city.id} value={city.id}>
//                     {city.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* School Dropdown */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="School"
//                 value={formData.school}
//                 onChange={(e) => handleChange("school", e.target.value)}
//                 size="small"
//                 variant="outlined"
//                 disabled={!selectedCity}
//               >
//                 <MenuItem value="">Select School</MenuItem>
//                 {schools.map((school) => (
//                   <MenuItem key={school.school_name} value={school.school_name}>
//                     {school.school_name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* Subject Dropdown */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Subject"
//                 value={formData.subject}
//                 onChange={(e) => handleChange("subject", e.target.value)}
//                 size="small"
//                 variant="outlined"
//               >
//                 {subjects.map((subject) => (
//                   <MenuItem key={subject.id} value={subject.name}>
//                     {subject.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* Exam Set */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Exam Set"
//                 value={formData.exam_set}
//                 onChange={(e) => handleChange("exam_set", e.target.value)}
//                 size="small"
//                 variant="outlined"
//               >
//                 <MenuItem value="A">A</MenuItem>
//                 <MenuItem value="B">B</MenuItem>
//                 <MenuItem value="C">C</MenuItem>
//                 <MenuItem value="D">D</MenuItem>
//                 <MenuItem value="E">E</MenuItem>
//                 <MenuItem value="F">F</MenuItem>
//               </TextField>
//             </Grid>

//             {/* Packet No */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 label="Packet No"
//                 value={formData.packing_no}
//                 onChange={(e) => handleChange("packing_no", e.target.value)}
//                 size="small"
//                 variant="outlined"
//               />
//             </Grid>
//           </Grid>

//           {/* Table for Rows */}
//           <table className="table mt-4">
//             <thead className="my-2">
//               <tr>
//                 <th scope="col" className="py-1">
//                   Product Code
//                 </th>
//                 <th scope="col" className="py-1">
//                   Product Name
//                 </th>
//                 <th scope="col" className="py-1">
//                   Registered Quantity
//                 </th>
//                 <th scope="col" className="py-1">
//                   Extra Quantity
//                 </th>
//                 <th scope="col" className="py-1">
//                   Total Quantity
//                 </th>
//                 <th scope="col" className="py-1">
//                   <UilPlus style={{ cursor: "pointer" }} onClick={addRow} />
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {formData.rows.map((row, index) => (
//                 <tr key={index}>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.product_code}
//                       onChange={(e) =>
//                         handleRowChange(index, "product_code", e.target.value)
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.product_name}
//                       onChange={(e) =>
//                         handleRowChange(index, "product_name", e.target.value)
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.registered_quantity}
//                       onChange={(e) =>
//                         handleRowChange(
//                           index,
//                           "registered_quantity",
//                           e.target.value
//                         )
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.extra_quantity}
//                       onChange={(e) =>
//                         handleRowChange(index, "extra_quantity", e.target.value)
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.total_quantity}
//                       onChange={(e) =>
//                         handleRowChange(index, "total_quantity", e.target.value)
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     {formData.rows.length > 1 ? (
//                       <UilMinus
//                         className="my-2"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => removeRow(index)}
//                       />
//                     ) : (
//                       <UilMinus
//                         className="my-2"
//                         style={{ cursor: "not-allowed" }}
//                       />
//                     )}
//                   </td>
//                 </tr>
//               ))}
//               {/* Summary Row */}
//               <tr>
//                 <td colSpan="4" className="text-end fw-bold">
//                   Total:
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     className="rounded m-0 my-1 w-100"
//                     value={formData.rows.reduce(
//                       (sum, row) => sum + parseFloat(row.total_quantity || 0),
//                       0
//                     )}
//                     readOnly
//                   />
//                 </td>
//                 <td></td>
//               </tr>
//             </tbody>
//           </table>

//           <div className="d-flex gap-2">
//             <ButtonComp
//               text="Generate Packing"
//               type="submit"
//               disabled={false}
//               sx={{ flexGrow: 1 }}
//             />
//             <ButtonComp
//               text="Cancel"
//               type="button"
//               sx={{ flexGrow: 1 }}
//               onClick={() => navigate("/packing-list")}
//             />
//           </div>
//         </form>
//       </Paper>
//     </Mainlayout>
//   );
// };

// export default Extra;

//==============================================================

// import React, { useState, useEffect, useCallback } from "react";
// import Mainlayout from "../../Layouts/Mainlayout";
// import { UilPlus, UilMinus } from "@iconscout/react-unicons";
// import ButtonComp from "../../CommonButton/ButtonComp";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import Swal from "sweetalert2";
// import axios from "axios";
// import "../../Common-Css/Swallfire.css";
// import { Grid, TextField, Paper, Typography, MenuItem } from "@mui/material";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JsBarcode from "jsbarcode";

// const Extra = () => {
//   const [formData, setFormData] = useState({
//     school: "",
//     school_code: "",
//     subject: "",
//     exam_date: "",
//     exam_set: "",
//     print_date: new Date().toISOString().split("T")[0],
//     packing_no: "",
//     rows: [
//       {
//         product_code: "S242500000849",
//         product_name: "GB EXAM GUIDELINES 2024-25",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//       {
//         product_code: "S242500000850",
//         product_name: "GB EXAM DETAILS 2024-25",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//       {
//         product_code: "S242500000851",
//         product_name: "GB OMR RETURN ENVELOPES",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//       {
//         product_code: "S242500000852",
//         product_name: "GB SET A SCHOOL LIBRARY PACK (SLP)",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//       {
//         product_code: "S242500000853",
//         product_name: "IHO SET A ATTENDANCE SHEET",
//         registered_quantity: "1",
//         extra_quantity: "0",
//         total_quantity: "1",
//       },
//     ],
//   });

//   const [schools, setSchools] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredDistricts, setFilteredDistricts] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [submittedData, setSubmittedData] = useState(null);
//   const navigate = useNavigate();

//   // Fetch initial data
//   useEffect(() => {
//     let isMounted = true;

//     const fetchInitialData = async () => {
//       try {
//         setIsLoading(true);
//         const [countriesRes, statesRes, districtsRes, citiesRes, subjectsRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/countries`),
//             axios.get(`${API_BASE_URL}/api/states`),
//             axios.get(`${API_BASE_URL}/api/districts`),
//             axios.get(`${API_BASE_URL}/api/cities/all/c1`),
//             axios.get(`${API_BASE_URL}/api/subject`),
//           ]);

//         if (isMounted) {
//           setCountries(countriesRes.data || []);
//           setStates(statesRes.data || []);
//           setDistricts(districtsRes.data || []);
//           setCities(citiesRes.data || []);
//           setSubjects(
//             (subjectsRes.data || []).map((sub) => ({
//               id: sub.id,
//               name: sub.name,
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setError("Failed to load initial data");
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
//     setFormData({ ...formData, school: "" });
//   }, [selectedCountry, states]);

//   useEffect(() => {
//     setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
//     setSelectedDistrict("");
//     setSelectedCity("");
//     setFormData({ ...formData, school: "" });
//   }, [selectedState, districts]);

//   useEffect(() => {
//     setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
//     setSelectedCity("");
//     setFormData({ ...formData, school: "" });
//   }, [selectedDistrict, cities]);

//   // Fetch schools based on location
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
//         setError(null);
//       } else {
//         setSchools([]);
//       }
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setError("Failed to fetch schools");
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

//   // Fetch classes and update rows when school and subject are selected
//   useEffect(() => {
//     const fetchClasses = async () => {
//       if (formData.school && formData.subject) {
//         setIsLoading(true);
//         try {
//           const response = await axios.get(
//             `${API_BASE_URL}/api/omr/omr-data/classes`,
//             {
//               params: {
//                 school: formData.school,
//                 subject: formData.subject,
//               },
//             }
//           );

//           const classesData = response.data || [];

//           // Preserve static rows
//           const staticRows = formData.rows.filter((row) =>
//             [
//               "GB EXAM GUIDELINES 2024-25",
//               "GB EXAM DETAILS 2024-25",
//               "GB OMR RETURN ENVELOPES",
//               "GB SET A SCHOOL LIBRARY PACK (SLP)",
//               "GB SET A ATTENDANCE SHEET",
//             ].includes(row.product_name)
//           );

//           // Create new rows for each class
//           const newClassRows = classesData.flatMap((data) => {
//             // Extract count from class_count (assuming { count: N } structure)
//             const registeredQuantity =
//               data.class_count?.count?.toString() || "0";

//             return data.classes.map((className) => ({
//               product_code: `CLS-${className}-${formData.subject}-${data.omr_set}`,
//               product_name: `IHO CLASS ${className} SET ${data.omr_set} QUESTION PAPER`,
//               registered_quantity: registeredQuantity,
//               extra_quantity: "0",
//               total_quantity: registeredQuantity, // Use same as registered_quantity or adjust based on logic
//             }));
//           });

//           setFormData((prevData) => ({
//             ...prevData,
//             rows: [...staticRows, ...newClassRows],
//             exam_set: classesData[0]?.omr_set || prevData.exam_set,
//           }));
//         } catch (error) {
//           console.error("Error fetching classes:", error);
//           setError("Failed to fetch classes");
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         // Reset to static rows if school or subject is deselected
//         setFormData((prevData) => ({
//           ...prevData,
//           rows: prevData.rows.filter((row) =>
//             [
//               "GB EXAM GUIDELINES 2024-25",
//               "GB EXAM DETAILS 2024-25",
//               "GB OMR RETURN ENVELOPES",
//               "GB SET A SCHOOL LIBRARY PACK (SLP)",
//               "GB SET A ATTENDANCE SHEET",
//             ].includes(row.product_name)
//           ),
//           exam_set: "",
//         }));
//       }
//     };

//     fetchClasses();
//   }, [formData.school, formData.subject]);

//   // Fetch exam date
//   useEffect(() => {
//     const fetchExamDate = async () => {
//       if (formData.school && formData.subject) {
//         setIsLoading(true);
//         try {
//           const response = await axios.get(`${API_BASE_URL}/api/exams/dates`, {
//             params: {
//               school: formData.school,
//               subject: formData.subject,
//             },
//           });
//           if (response.data.data.length > 0) {
//             const isoDate = response.data.data[0].exam_date;
//             const formattedDate = isoDate.split("T")[0];
//             setFormData((prevData) => ({
//               ...prevData,
//               exam_date: formattedDate,
//             }));
//           } else {
//             setFormData((prevData) => ({
//               ...prevData,
//               exam_date: "",
//             }));
//           }
//         } catch (error) {
//           console.error("Error fetching exam date:", error);
//           setError("Failed to fetch exam date");
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         setFormData((prevData) => ({
//           ...prevData,
//           exam_date: "",
//         }));
//       }
//     };
//     fetchExamDate();
//   }, [formData.school, formData.subject]);

//   // Add a new row
//   const addRow = () => {
//     setFormData({
//       ...formData,
//       rows: [
//         ...formData.rows,
//         {
//           product_code: "",
//           product_name: "",
//           registered_quantity: "",
//           extra_quantity: "",
//           total_quantity: "",
//         },
//       ],
//     });
//   };

//   // Remove a row
//   const removeRow = (index) => {
//     if (formData.rows.length > 1) {
//       const updatedRows = formData.rows.filter((_, i) => i !== index);
//       setFormData({ ...formData, rows: updatedRows });
//     }
//   };

//   // Handle row input changes
//   const handleRowChange = (index, field, value) => {
//     const updatedRows = formData.rows.map((row, i) => {
//       if (i === index) {
//         const updatedRow = { ...row, [field]: value };
//         if (field === "registered_quantity" || field === "extra_quantity") {
//           const registered = parseFloat(updatedRow.registered_quantity) || 0;
//           const extra = parseFloat(updatedRow.extra_quantity) || 0;
//           updatedRow.total_quantity = (registered + extra).toString();
//         }
//         return updatedRow;
//       }
//       return row;
//     });
//     setFormData({ ...formData, rows: updatedRows });
//   };

//   // Handle form field changes
//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   // Generate PDF
//   const generatePDF = (data) => {
//     const doc = new jsPDF();

//     // Header section
//     doc.setFontSize(14);
//     doc.text("Gowbell Foundation", 105, 15, { align: "center" });
//     doc.setFontSize(10);
//     doc.text("8/4, BMC Panchdeep Complex, Unit 4,", 105, 20, {
//       align: "center",
//     });
//     doc.text("Bhouma Nagar, Bhubaneswar, Odisha 751001", 105, 25, {
//       align: "center",
//     });

//     doc.setFontSize(16);
//     doc.text("PACKING LIST", 105, 35, { align: "center" });
//     doc.setFontSize(14);
//     doc.text(`SOF2425063980`, 105, 42, { align: "center" });

//     // Barcode
//     const barcodeCanvas = document.createElement("canvas");
//     JsBarcode(barcodeCanvas, data.school_code, {
//       format: "CODE128",
//       displayValue: true,
//     });
//     const barcodeImage = barcodeCanvas.toDataURL("image/png");
//     doc.addImage(barcodeImage, "PNG", 10, 50, 40, 20);

//     // School details
//     doc.setFontSize(10);
//     const xRight = 140;
//     doc.text(`School Code: ${data.school_code}`, xRight, 50);
//     doc.text(`Exam Set: ${data.exam_set}`, xRight, 55);
//     doc.text(`Exam Name: ${data.exam_name}`, xRight, 60);
//     doc.text(`Exam Date: ${data.exam_date}`, xRight, 65);
//     doc.text(`Print Date: ${data.print_date}`, xRight, 70);
//     doc.text(`Packet No: ${data.packing_no}`, xRight, 75);

//     // Table setup
//     let startX = 10;
//     let startY = 85;
//     let rowHeight = 8;

//     const headers = [
//       "S.No",
//       "Product Code",
//       "Product Name",
//       "Registered Quantity",
//       "Extra Quantity",
//       "Total Quantity",
//     ];

//     // Calculate column widths based on content
//     doc.setFontSize(9); // Set smaller font size for table
//     const colWidths = headers.map((header, index) => {
//       let maxWidth = doc.getTextWidth(header) + 4; // Add padding
//       data.rows.forEach((row) => {
//         const cell = [
//           String(index + 1),
//           row.product_code,
//           row.product_name,
//           row.registered_quantity,
//           row.extra_quantity,
//           row.total_quantity,
//         ][index];
//         const cellWidth = doc.getTextWidth(String(cell)) + 4; // Add padding
//         maxWidth = Math.max(maxWidth, cellWidth);
//       });
//       return maxWidth;
//     });

//     // Draw table header
//     doc.setFillColor(200, 200, 200);
//     doc.rect(
//       startX,
//       startY,
//       colWidths.reduce((a, b) => a + b, 0),
//       rowHeight,
//       "F"
//     );

//     doc.setFontSize(8); // Ensure font size for headers
//     doc.setTextColor(0, 0, 0);
//     let xPos = startX;
//     headers.forEach((header, index) => {
//       doc.text(header, xPos + 2, startY + 5);
//       xPos += colWidths[index];
//     });

//     // Draw table rows
//     startY += rowHeight;
//     data.rows.forEach((row, rowIndex) => {
//       let xPos = startX;
//       doc.rect(
//         startX,
//         startY,
//         colWidths.reduce((a, b) => a + b, 0),
//         rowHeight
//       );

//       const rowData = [
//         rowIndex + 1,
//         row.product_code,
//         row.product_name,
//         row.registered_quantity,
//         row.extra_quantity,
//         row.total_quantity,
//       ];

//       rowData.forEach((cell, index) => {
//         doc.text(String(cell), xPos + 2, startY + 5);
//         xPos += colWidths[index];
//       });

//       startY += rowHeight;
//     });

//     doc.save("packing_list.pdf");
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const schoolCodeResponse = await axios.get(
//         `${API_BASE_URL}/api/school-code/${formData.school}`
//       );
//       const school_code = schoolCodeResponse.data.school_code;

//       const exam_name = `GW-${formData.subject}`;

//       const payload = {
//         ...formData,
//         school_code,
//         exam_name,
//         rows: formData.rows.map((row) => ({
//           ...row,
//           total_quantity: row.total_quantity,
//         })),
//       };

//       const response = await axios.post(`${API_BASE_URL}/api/packing`, payload);
//       if (response.status === 200) {
//         setSubmittedData(payload);
//         generatePDF(payload);
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           text: "Packing added successfully!",
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         }).then(() => {
//           navigate("/packing-list");
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error!",
//         text: "An error occurred while submitting the form.",
//       });
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[
//             { name: "Packing list", link: "/packing-list" },
//             { name: "Create", link: "/packing-create" },
//           ]}
//         />
//       </div>
//       <Paper elevation={3} className="w-100 bg-white p-4 mx-auto rounded">
//         <Typography variant="h6" gutterBottom>
//           Packing List Details
//         </Typography>
//         <form onSubmit={handleSubmit} style={{ fontFamily: "Poppins" }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Country"
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//                 size="small"
//                 variant="outlined"
//               >
//                 <MenuItem value="">Select Country</MenuItem>
//                 {countries.map((country) => (
//                   <MenuItem key={country.id} value={country.id}>
//                     {country.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="State"
//                 value={selectedState}
//                 onChange={(e) => setSelectedState(e.target.value)}
//                 size="small"
//                 variant="outlined"
//                 disabled={!selectedCountry}
//               >
//                 <MenuItem value="">Select State</MenuItem>
//                 {filteredStates.map((state) => (
//                   <MenuItem key={state.id} value={state.id}>
//                     {state.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="District"
//                 value={selectedDistrict}
//                 onChange={(e) => setSelectedDistrict(e.target.value)}
//                 size="small"
//                 variant="outlined"
//                 disabled={!selectedState}
//               >
//                 <MenuItem value="">Select District</MenuItem>
//                 {filteredDistricts.map((district) => (
//                   <MenuItem key={district.id} value={district.id}>
//                     {district.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="City"
//                 value={selectedCity}
//                 onChange={(e) => setSelectedCity(e.target.value)}
//                 size="small"
//                 variant="outlined"
//                 disabled={!selectedDistrict}
//               >
//                 <MenuItem value="">Select City</MenuItem>
//                 {filteredCities.map((city) => (
//                   <MenuItem key={city.id} value={city.id}>
//                     {city.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="School"
//                 value={formData.school}
//                 onChange={(e) => handleChange("school", e.target.value)}
//                 size="small"
//                 variant="outlined"
//                 disabled={!selectedCity}
//               >
//                 <MenuItem value="">Select School</MenuItem>
//                 {schools.map((school) => (
//                   <MenuItem key={school.school_name} value={school.school_name}>
//                     {school.school_name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Subject"
//                 value={formData.subject}
//                 onChange={(e) => handleChange("subject", e.target.value)}
//                 size="small"
//                 variant="outlined"
//               >
//                 {subjects.map((subject) => (
//                   <MenuItem key={subject.id} value={subject.name}>
//                     {subject.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Exam Set"
//                 value={formData.exam_set}
//                 onChange={(e) => handleChange("exam_set", e.target.value)}
//                 size="small"
//                 variant="outlined"
//               >
//                 <MenuItem value="A">A</MenuItem>
//                 <MenuItem value="B">B</MenuItem>
//                 <MenuItem value="C">C</MenuItem>
//                 <MenuItem value="D">D</MenuItem>
//                 <MenuItem value="E">E</MenuItem>
//                 <MenuItem value="F">F</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 label="Packet No"
//                 value={formData.packing_no}
//                 onChange={(e) => handleChange("packing_no", e.target.value)}
//                 size="small"
//                 variant="outlined"
//               />
//             </Grid>
//           </Grid>
//           <table className="table mt-4">
//             <thead className="my-2">
//               <tr>
//                 <th scope="col" className="py-1">
//                   Product Code
//                 </th>
//                 <th scope="col" className="py-1">
//                   Product Name
//                 </th>
//                 <th scope="col" className="py-1">
//                   Registered Quantity
//                 </th>
//                 <th scope="col" className="py-1">
//                   Extra Quantity
//                 </th>
//                 <th scope="col" className="py-1">
//                   Total Quantity
//                 </th>
//                 <th scope="col" className="py-1">
//                   <UilPlus style={{ cursor: "pointer" }} onClick={addRow} />
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {formData.rows.map((row, index) => (
//                 <tr key={index}>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.product_code}
//                       onChange={(e) =>
//                         handleRowChange(index, "product_code", e.target.value)
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.product_name}
//                       onChange={(e) =>
//                         handleRowChange(index, "product_name", e.target.value)
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.registered_quantity}
//                       onChange={(e) =>
//                         handleRowChange(
//                           index,
//                           "registered_quantity",
//                           e.target.value
//                         )
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.extra_quantity}
//                       onChange={(e) =>
//                         handleRowChange(index, "extra_quantity", e.target.value)
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="rounded m-0 my-1 w-100"
//                       value={row.total_quantity}
//                       onChange={(e) =>
//                         handleRowChange(index, "total_quantity", e.target.value)
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     {formData.rows.length > 1 ? (
//                       <UilMinus
//                         className="my-2"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => removeRow(index)}
//                       />
//                     ) : (
//                       <UilMinus
//                         className="my-2"
//                         style={{ cursor: "not-allowed" }}
//                       />
//                     )}
//                   </td>
//                 </tr>
//               ))}
//               <tr>
//                 <td colSpan="4" className="text-end fw-bold">
//                   Total:
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     className="rounded m-0 my-1 w-100"
//                     value={formData.rows.reduce(
//                       (sum, row) => sum + parseFloat(row.total_quantity || 0),
//                       0
//                     )}
//                     readOnly
//                   />
//                 </td>
//                 <td></td>
//               </tr>
//             </tbody>
//           </table>
//           <div className="d-flex gap-2">
//             <ButtonComp
//               text="Generate Packing"
//               type="submit"
//               disabled={false}
//               sxLyX
//               sx={{ flexGrow: 1 }}
//             />
//             <ButtonComp
//               text="Cancel"
//               type="button"
//               sx={{ flexGrow: 1 }}
//               onClick={() => navigate("/packing-list")}
//             />
//           </div>
//         </form>
//       </Paper>
//     </Mainlayout>
//   );
// };
// export default Extra;

import React, { useState, useEffect, useCallback } from "react";
import Mainlayout from "../../Layouts/Mainlayout";
import { UilPlus, UilMinus } from "@iconscout/react-unicons";
import ButtonComp from "../../CommonButton/ButtonComp";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import axios from "axios";
import "../../Common-Css/Swallfire.css";
import { Grid, TextField, Paper, Typography, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JsBarcode from "jsbarcode";

const Extra = () => {
  const [formData, setFormData] = useState({
    school: "",
    school_code: "",
    subject: "",
    exam_date: "",
    exam_set: "",
    print_date: new Date().toISOString().split("T")[0],
    packing_no: "",
    rows: [
      {
        product_code: "S242500000849",
        product_name: "GB EXAM GUIDELINES 2024-25",
        registered_quantity: "1",
        extra_quantity: "0",
        total_quantity: "1",
      },
      {
        product_code: "S242500000850",
        product_name: "GB EXAM DETAILS 2024-25",
        registered_quantity: "1",
        extra_quantity: "0",
        total_quantity: "1",
      },
      {
        product_code: "S242500000851",
        product_name: "GB OMR RETURN ENVELOPES",
        registered_quantity: "1",
        extra_quantity: "0",
        total_quantity: "1",
      },
      {
        product_code: "S242500000852",
        product_name: "GB SET A SCHOOL LIBRARY PACK (SLP)",
        registered_quantity: "1",
        extra_quantity: "0",
        total_quantity: "1",
      },
      {
        product_code: "S242500000853",
        product_name: "IHO SET A ATTENDANCE SHEET",
        registered_quantity: "1",
        extra_quantity: "0",
        total_quantity: "1",
      },
    ],
  });

  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [countriesRes, statesRes, districtsRes, citiesRes, subjectsRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/countries`),
            axios.get(`${API_BASE_URL}/api/states`),
            axios.get(`${API_BASE_URL}/api/districts`),
            axios.get(`${API_BASE_URL}/api/cities/all/c1`),
            axios.get(`${API_BASE_URL}/api/subject`),
          ]);

        if (isMounted) {
          setCountries(countriesRes.data || []);
          setStates(statesRes.data || []);
          setDistricts(districtsRes.data || []);
          setCities(citiesRes.data || []);
          setSubjects(
            (subjectsRes.data || []).map((sub) => ({
              id: sub.id,
              name: sub.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data");
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
    setFormData({ ...formData, school: "" });
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setFormData({ ...formData, school: "" });
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setFormData({ ...formData, school: "" });
  }, [selectedDistrict, cities]);

  // Fetch schools based on location
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
        setError(null);
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setError("Failed to fetch schools");
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

  // Fetch classes and update rows when school and subject are selected
  useEffect(() => {
    const fetchClasses = async () => {
      if (formData.school && formData.subject) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/omr/omr-data/classes`,
            {
              params: {
                school: formData.school,
                subject: formData.subject,
              },
            }
          );

          const classesData = response.data || [];

          // Preserve static rows
          const staticRows = formData.rows.filter((row) =>
            [
              "GB EXAM GUIDELINES 2024-25",
              "GB EXAM DETAILS 2024-25",
              "GB OMR RETURN ENVELOPES",
              "GB SET A SCHOOL LIBRARY PACK (SLP)",
              "GB SET A ATTENDANCE SHEET",
            ].includes(row.product_name)
          );

          // Create new rows for each class
          const newClassRows = classesData.flatMap((data) => {
            return data.classes.map((className) => ({
              product_code: `CLS-${className}-${formData.subject}-${data.omr_set}`,
              product_name: ` GB CLASS ${className} SET ${data.omr_set} QUESTION PAPER`,
              registered_quantity:
                data.class_count[className]?.toString() || "0",
              extra_quantity: "0",
              total_quantity: data.class_count[className]?.toString() || "0",
            }));
          });

          setFormData((prevData) => ({
            ...prevData,
            rows: [...staticRows, ...newClassRows],
            exam_set: classesData[0]?.omr_set || prevData.exam_set,
          }));
        } catch (error) {
          console.error("Error fetching classes:", error);
          setError("Failed to fetch classes");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset to static rows if school or subject is deselected
        setFormData((prevData) => ({
          ...prevData,
          rows: prevData.rows.filter((row) =>
            [
              "GB EXAM GUIDELINES 2024-25",
              "GB EXAM DETAILS 2024-25",
              "GB OMR RETURN ENVELOPES",
              "GB SET A SCHOOL LIBRARY PACK (SLP)",
              "GB SET A ATTENDANCE SHEET",
            ].includes(row.product_name)
          ),
          exam_set: "",
        }));
      }
    };

    fetchClasses();
  }, [formData.school, formData.subject]);

  // Fetch exam date
  useEffect(() => {
    const fetchExamDate = async () => {
      if (formData.school && formData.subject) {
        setIsLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/api/exams/dates`, {
            params: {
              school: formData.school,
              subject: formData.subject,
            },
          });
          if (response.data.data.length > 0) {
            const isoDate = response.data.data[0].exam_date;
            const formattedDate = isoDate.split("T")[0];
            setFormData((prevData) => ({
              ...prevData,
              exam_date: formattedDate,
            }));
          } else {
            setFormData((prevData) => ({
              ...prevData,
              exam_date: "",
            }));
          }
        } catch (error) {
          console.error("Error fetching exam date:", error);
          setError("Failed to fetch exam date");
        } finally {
          setIsLoading(false);
        }
      } else {
        setFormData((prevData) => ({
          ...prevData,
          exam_date: "",
        }));
      }
    };
    fetchExamDate();
  }, [formData.school, formData.subject]);

  // Add a new row
  const addRow = () => {
    setFormData({
      ...formData,
      rows: [
        ...formData.rows,
        {
          product_code: "",
          product_name: "",
          registered_quantity: "",
          extra_quantity: "",
          total_quantity: "",
        },
      ],
    });
  };

  // Remove a row
  const removeRow = (index) => {
    if (formData.rows.length > 1) {
      const updatedRows = formData.rows.filter((_, i) => i !== index);
      setFormData({ ...formData, rows: updatedRows });
    }
  };

  // Handle row input changes
  const handleRowChange = (index, field, value) => {
    const updatedRows = formData.rows.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [field]: value };
        if (field === "registered_quantity" || field === "extra_quantity") {
          const registered = parseFloat(updatedRow.registered_quantity) || 0;
          const extra = parseFloat(updatedRow.extra_quantity) || 0;
          updatedRow.total_quantity = (registered + extra).toString();
        }
        return updatedRow;
      }
      return row;
    });
    setFormData({ ...formData, rows: updatedRows });
  };

  // Generate PDF
  const generatePDF = (data) => {
    const doc = new jsPDF();

    // Header section
    doc.setFontSize(14);
    doc.text("Gowbell Foundation", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("8/4, BMC Panchdeep Complex, Unit 4,", 105, 20, {
      align: "center",
    });
    doc.text("Bhouma Nagar, Bhubaneswar, Odisha 751001", 105, 25, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.text("PACKING LIST", 105, 35, { align: "center" });
    doc.setFontSize(14);
    doc.text(`SOF2425063980`, 105, 42, { align: "center" });

    // Barcode
    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, data.school_code, {
      format: "CODE128",
      displayValue: true,
    });
    const barcodeImage = barcodeCanvas.toDataURL("image/png");
    doc.addImage(barcodeImage, "PNG", 10, 50, 40, 20);

    // School details
    doc.setFontSize(10);
    const xRight = 140;
    doc.text(`School Code: ${data.school_code}`, xRight, 50);
    doc.text(`Exam Set: ${data.exam_set}`, xRight, 55);
    doc.text(`Exam Name: ${data.exam_name}`, xRight, 60);
    doc.text(`Exam Date: ${data.exam_date}`, xRight, 65);
    doc.text(`Print Date: ${data.print_date}`, xRight, 70);
    doc.text(`Packet No: ${data.packing_no}`, xRight, 75);

    // Table setup
    let startX = 10;
    let startY = 85;
    let rowHeight = 8;

    const headers = [
      "S.No",
      "Product Code",
      "Product Name",
      "Registered Quantity",
      "Extra Quantity",
      "Total Quantity",
    ];

    // Calculate column widths based on content
    doc.setFontSize(9); // Set smaller font size for table
    const colWidths = headers.map((header, index) => {
      let maxWidth = doc.getTextWidth(header) + 4; // Add padding
      data.rows.forEach((row) => {
        const cell = [
          String(index + 1),
          row.product_code,
          row.product_name,
          row.registered_quantity,
          row.extra_quantity,
          row.total_quantity,
        ][index];
        const cellWidth = doc.getTextWidth(String(cell)) + 4; // Add padding
        maxWidth = Math.max(maxWidth, cellWidth);
      });
      return maxWidth;
    });

    // Draw table header
    doc.setFillColor(200, 200, 200);
    doc.rect(
      startX,
      startY,
      colWidths.reduce((a, b) => a + b, 0),
      rowHeight,
      "F"
    );

    doc.setFontSize(8); // Ensure font size for headers
    doc.setTextColor(0, 0, 0);
    let xPos = startX;
    headers.forEach((header, index) => {
      doc.text(header, xPos + 2, startY + 5);
      xPos += colWidths[index];
    });

    // Draw table rows
    startY += rowHeight;
    data.rows.forEach((row, rowIndex) => {
      let xPos = startX;
      doc.rect(
        startX,
        startY,
        colWidths.reduce((a, b) => a + b, 0),
        rowHeight
      );

      const rowData = [
        rowIndex + 1,
        row.product_code,
        row.product_name,
        row.registered_quantity,
        row.extra_quantity,
        row.total_quantity,
      ];

      rowData.forEach((cell, index) => {
        doc.text(String(cell), xPos + 2, startY + 5);
        xPos += colWidths[index];
      });

      startY += rowHeight;
    });

    doc.save("packing_list.pdf");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const schoolCodeResponse = await axios.get(
        `${API_BASE_URL}/api/school-code/${formData.school}`
      );
      const school_code = schoolCodeResponse.data.school_code;

      const exam_name = `GW-${formData.subject}`;

      const payload = {
        ...formData,
        school_code,
        exam_name,
        rows: formData.rows.map((row) => ({
          ...row,
          total_quantity: row.total_quantity,
        })),
      };

      const response = await axios.post(`${API_BASE_URL}/api/packing`, payload);
      if (response.status === 200) {
        setSubmittedData(payload);
        generatePDF(payload);
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "Packing added successfully!",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/packing-list");
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while submitting the form.",
      });
    }
  };

  //auto generate packet code
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Simulate getting last packing number from localStorage or initialize
  const getLastPackingNo = () => {
    const last = localStorage.getItem("lastPackingNo") || "GB-0000";
    return last;
  };

  // Generate next packing number
  const generateNextPackingNo = (lastNo) => {
    const num = parseInt(lastNo.replace("GB-", ""), 10);
    const nextNum = (num + 1).toString().padStart(4, "0");
    return `GB-${nextNum}`;
  };

  useEffect(() => {
    const lastNo = getLastPackingNo();
    const nextNo = generateNextPackingNo(lastNo);
    setFormData((prev) => ({ ...prev, packing_no: nextNo }));

    // Optionally store new last no for next form load
    localStorage.setItem("lastPackingNo", nextNo);
  }, []);

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Packing list", link: "/packing-list" },
            { name: "Create", link: "/packing-create" },
          ]}
        />
      </div>
      <Paper elevation={3} className="w-100 bg-white p-4 mx-auto rounded">
        <Typography variant="h6" gutterBottom>
          Packing List Details
        </Typography>
        <form onSubmit={handleSubmit} style={{ fontFamily: "Poppins" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                size="small"
                variant="outlined"
              >
                <MenuItem value="">Select Country</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="State"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                size="small"
                variant="outlined"
                disabled={!selectedCountry}
              >
                <MenuItem value="">Select State</MenuItem>
                {filteredStates.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="District"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                size="small"
                variant="outlined"
                disabled={!selectedState}
              >
                <MenuItem value="">Select District</MenuItem>
                {filteredDistricts.map((district) => (
                  <MenuItem key={district.id} value={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="City"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                size="small"
                variant="outlined"
                disabled={!selectedDistrict}
              >
                <MenuItem value="">Select City</MenuItem>
                {filteredCities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="School"
                value={formData.school}
                onChange={(e) => handleChange("school", e.target.value)}
                size="small"
                variant="outlined"
                disabled={!selectedCity}
              >
                <MenuItem value="">Select School</MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.school_name} value={school.school_name}>
                    {school.school_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                size="small"
                variant="outlined"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Exam Set"
                value={formData.exam_set}
                onChange={(e) => handleChange("exam_set", e.target.value)}
                size="small"
                variant="outlined"
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
                <MenuItem value="E">E</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Packet No"
                value={formData.packing_no}
                onChange={(e) => handleChange("packing_no", e.target.value)}
                size="small"
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <table className="table mt-4">
            <thead className="my-2">
              <tr>
                <th scope="col" className="py-1">
                  Product Code
                </th>
                <th scope="col" className="py-1">
                  Product Name
                </th>
                <th scope="col" className="py-1">
                  Registered Quantity
                </th>
                <th scope="col" className="py-1">
                  Extra Quantity
                </th>
                <th scope="col" className="py-1">
                  Total Quantity
                </th>
                <th scope="col" className="py-1">
                  <UilPlus style={{ cursor: "pointer" }} onClick={addRow} />
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="rounded m-0 my-1 w-100"
                      value={row.product_code}
                      onChange={(e) =>
                        handleRowChange(index, "product_code", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="rounded m-0 my-1 w-100"
                      value={row.product_name}
                      onChange={(e) =>
                        handleRowChange(index, "product_name", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="rounded m-0 my-1 w-100"
                      value={row.registered_quantity}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "registered_quantity",
                          e.target.value
                        )
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="rounded m-0 my-1 w-100"
                      value={row.extra_quantity}
                      onChange={(e) =>
                        handleRowChange(index, "extra_quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="rounded m-0 my-1 w-100"
                      value={row.total_quantity}
                      onChange={(e) =>
                        handleRowChange(index, "total_quantity", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    {formData.rows.length > 1 ? (
                      <UilMinus
                        className="my-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => removeRow(index)}
                      />
                    ) : (
                      <UilMinus
                        className="my-2"
                        style={{ cursor: "not-allowed" }}
                      />
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="text-end fw-bold">
                  Total:
                </td>
                <td>
                  <input
                    type="text"
                    className="rounded m-0 my-1 w-100"
                    value={formData.rows.reduce(
                      (sum, row) => sum + parseFloat(row.total_quantity || 0),
                      0
                    )}
                    readOnly
                  />
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex gap-2">
            <ButtonComp
              text="Generate Packing"
              type="submit"
              disabled={false}
              sxLyX
              sx={{ flexGrow: 1 }}
            />
            <ButtonComp
              text="Cancel"
              type="button"
              sx={{ flexGrow: 1 }}
              onClick={() => navigate("/packing-list")}
            />
          </div>
        </form>
      </Paper>
    </Mainlayout>
  );
};

export default Extra;
