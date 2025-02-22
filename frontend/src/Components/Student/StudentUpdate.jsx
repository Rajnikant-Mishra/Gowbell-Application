// import React, { useState, useEffect } from "react";
// import { Box, Typography, Grid } from "@mui/material";
// import styles from "./Student.module.css";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import TextInput from "../School/CommonComp/TextInput";
// import SelectDrop from "../School/CommonComp/SelectDrop";
// import Mainlayout from "../Layouts/Mainlayout";
// import Swal from "sweetalert2";
// import { useNavigate, useParams } from "react-router-dom";
// import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";

// export default function StudentUpdateForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     school_name: "",
//     student_name: "",
//     class_name: "",
//     student_section: "",
//     mobile_number: "",
//     whatsapp_number: "",
//     student_subject: "",
//     roll_no:"",
//   });

//   const [schoolOptions, setSchoolOptions] = useState([]);
//   const [classOptions, setClassOptions] = useState([]);
//   const [subjectOptions, setSubjectOptions] = useState([]);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch school options
//         const schoolResponse = await fetch(`${API_BASE_URL}/api/get/schools`);
//         const schoolData = await schoolResponse.json();
//         setSchoolOptions(
//           schoolData.map((school) => ({
//             value: school.school_name,
//             label: school.school_name,
//           }))
//         );

//         // Fetch class options
//         const classResponse = await fetch(`${API_BASE_URL}/api/class`);
//         const classData = await classResponse.json();
//         setClassOptions(
//           classData.map((item) => ({
//             value: item.name,
//             label: item.name,
//           }))
//         );

//         // Fetch subject options
//         const subjectResponse = await fetch(`${API_BASE_URL}/api/subject`);
//         const subjectData = await subjectResponse.json();
//         setSubjectOptions(
//           subjectData.map((subject) => ({
//             value: subject.name,
//             label: subject.name,
//           }))
//         );

//         // Fetch student data
//         const studentResponse = await fetch(
//           `${API_BASE_URL}/api/get/student/${id}`
//         );
//         if (!studentResponse.ok) throw new Error("Student data not found");
//         const studentData = await studentResponse.json();
//         setFormData({
//           school_name: studentData.school_name || "",
//           student_name: studentData.student_name || "",
//           class_name: studentData.class_name || "",
//           student_section: studentData.student_section || "",
//           mobile_number: studentData.mobile_number || "",
//           whatsapp_number: studentData.whatsapp_number || "",
//           student_subject: studentData.student_subject || "",
//         });
//       } catch (error) {
//         console.error("Error loading data", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load data. Please try again.",
//           timer: 2000,
//         });
//       }
//     };

//     fetchData();
//   }, [id]);

//   // Section options
//   const sectionOptions = [
//     { value: "A", label: "A" },
//     { value: "B", label: "B" },
//     { value: "C", label: "C" },
//     { value: "D", label: "D" },
//     { value: "E", label: "E" },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Define validation rules for each field dynamically
//     const validationRules = [
//       {
//         field: "school_name",
//         label: "School Name",
//         validate: (value) => !!value || "School Name is required.",
//       },
//       {
//         field: "student_name",
//         label: "Student Name",
//         validate: (value) => !!value || "Student Name is required.",
//       },
//       {
//         field: "class_name",
//         label: "Class Name",
//         validate: (value) => !!value || "Class Name is required.",
//       },
//       {
//         field: "mobile_number",
//         label: "Mobile Number",
//         validate: (value) =>
//           /^\d{10}$/.test(value) || "Mobile Number must be exactly 10 digits.",
//       },
//       {
//         field: "whatsapp_number",
//         label: "WhatsApp Number",
//         validate: (value) =>
//           /^\d{10}$/.test(value) ||
//           "WhatsApp Number must be exactly 10 digits.",
//       },
//       {
//         field: "student_subject",
//         label: "Student subject",
//         validate: (value) => !!value || "Student subject is required.",
//       },
     
//       {
//         field: "roll_no",
//         label: "roll number",
//         validate: (value) => !!value || "roll number is required.",
//       },
//     ];

//     // Iterate through validation rules and check for errors
//     for (const { field, validate } of validationRules) {
//       const value = formData[field]; // Get field value
//       const validationResult = validate(value); // Run validation

//       if (validationResult !== true) {
//         // Show validation error dynamically
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           text: validationResult, // Show the validation error message
//           showConfirmButton: true,
//           timer: 3000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         });
//         return; // Stop further execution on first validation error
//       }
//     }

//     // Proceed with API call after validation
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/get/student/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         // Success - Show success message
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: `student  updated successfully!`,
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//         }).then(() => {
//           navigate("/studentList");
//         });

//         // Reset form data after successful submission
//         setFormData({
//           school_name: "",
//           student_name: "",
//           class_name: "",
//           student_section: "",
//           mobile_number: "",
//           whatsapp_number: "",
//           student_subject: "",
//           roll_no: "",
//         });
//       } else {
//         throw new Error("Failed to submit form");
//       }
//     } catch (error) {
//       // Error - Show error message
//       console.error("Error details:", error.response?.data || error.message);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error!",
//         text: error.response?.data?.error || "An unexpected error occurred.",
//         showConfirmButton: false,
//         timer: 4000,
//         timerProgressBar: true,
//         toast: true,
//         customClass: {
//           popup: "animate__animated animate__shakeX",
//           title: "text-danger fw-bold",
//           text: "text-dark",
//         },
//         background: "#fff",
//       });
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[
//               { name: "Student", link: "/studentList" },
//               { name: "Update Student" },
//             ]}
//           />
//         </div>
//       </div>
//       <Box className={`${styles.formContainer} container-fluid pt-5`}>
//         <div className={`${styles.formBox}`}>
//           <Typography className={`${styles.formTitle} mb-4`}>
//             Update Student Details
//           </Typography>
//           <form className={styles.formContent} onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={6}>
//                 <SelectDrop
//                   label="School Name"
//                   name="school_name"
//                   options={schoolOptions}
//                   value={formData.school_name}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={6}>
//                 <TextInput
//                   className={styles.textInput}
//                   label="Student Name"
//                   name="student_name"
//                   value={formData.student_name}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <SelectDrop
//                   label="Class"
//                   name="class_name"
//                   options={classOptions}
//                   value={formData.class_name}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <SelectDrop
//                   label="Section"
//                   name="student_section"
//                   options={sectionOptions}
//                   value={formData.student_section}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextInput
//                   label="Mobile Number"
//                   name="mobile_number"
//                   value={formData.mobile_number}
//                   onChange={handleChange}
//                   type="tel"
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextInput
//                   label="Whatsapp Number"
//                   name="whatsapp_number"
//                   value={formData.whatsapp_number}
//                   onChange={handleChange}
//                   type="tel"
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <SelectDrop
//                   label="Subject"
//                   name="student_subject"
//                   options={subjectOptions}
//                   value={formData.student_subject}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextInput
//                   label="Roll Number"
//                   name="roll_no"
//                   value={formData.roll_no}
//                   onChange={handleChange}
//                   type="tel"
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>

//             <Box
//               className={`${styles.buttonContainer} gap-2 mt-4`}
//               sx={{ display: "flex", gap: 2 }}
//             >
//               <ButtonComp
//                 text="Submit"
//                 type="submit"
//                 disabled={false}
//                 sx={{ flexGrow: 1 }}
//               />
//               <ButtonComp
//                 text="Cancel"
//                 type="button"
//                 sx={{ flexGrow: 1 }}
//                 onClick={() => navigate("/studentList")}
//               />
//             </Box>
//           </form>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// }

import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, TextField } from "@mui/material";
import styles from "./Student.module.css";
import ButtonComp from "../School/CommonComp/ButtonComp";
import Mainlayout from "../Layouts/Mainlayout";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../Components/CommonButton/Breadcrumb";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectDrop from "../School/createschool/SelectDrop";

export default function UpdateStudentForm() {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [initialValues, setInitialValues] = useState({
    school_name: "",
    student_name: "",
    class_name: "",
    student_section: "",
    mobile_number: "",
    whatsapp_number: "",
    student_subject: "",
    // roll_no: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/get/student/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInitialValues(data);
        } else {
          throw new Error("Failed to fetch student data");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load student data.",
          timer: 2000,
        });
      }
    };

    const fetchSchools = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/get/schools`);
        if (response.ok) {
          const data = await response.json();
          const options = data.map((school) => ({
            value: school.school_name,
            label: school.school_name,
          }));
          setSchoolOptions(options);
        } else {
          throw new Error("Failed to fetch school data");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load school data.",
          timer: 2000,
        });
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/class`);
        if (response.ok) {
          const data = await response.json();
          const options = data.map((item) => ({
            value: item.name,
            label: item.name,
          }));
          setClassOptions(options);
        } else {
          throw new Error("Failed to fetch class data");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load class data.",
          timer: 2000,
        });
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/subject`);
        if (response.ok) {
          const data = await response.json();
          const options = data.map((subject) => ({
            value: subject.name,
            label: subject.name,
          }));
          setSubjectOptions(options);
        } else {
          throw new Error("Failed to fetch subject data");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load subject data.",
          timer: 2000,
        });
      }
    };

    fetchStudentData();
    fetchSchools();
    fetchClasses();
    fetchSubjects();
  }, [id]);

  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];

  const validationSchema = Yup.object({
    school_name: Yup.string().required("School Name is required"),
    student_name: Yup.string().required("Student Name is required"),
    class_name: Yup.string().required("Class Name is required"),
    student_section: Yup.string().required("Section is required"),
    mobile_number: Yup.string()
      .required("Mobile Number is required")
      .matches(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
    whatsapp_number: Yup.string()
      .required("WhatsApp Number is required")
      .matches(/^\d{10}$/, "WhatsApp Number must be exactly 10 digits"),
    student_subject: Yup.string().required("Subject is required"),
    // roll_no: Yup.string().required("Roll Number is required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true, // This allows the form to reinitialize when initialValues change
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/get/student/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Success!",
            text: `Student updated successfully!`,
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          }).then(() => {
            navigate("/studentList");
          });

          formik.resetForm();
        } else {
          throw new Error("Failed to update student");
        }
      } catch (error) {
        console.error("Error details:", error.response?.data || error.message);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "An unexpected error occurred.",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            popup: "small-swal",
          },
          background: "#fff",
        });
      }
    },
  });

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Student", link: "/studentList" },
              { name: "Update Student" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <div>
            <Typography className={`${styles.formTitle} mb-4`}>
              Update Student Registration Form
            </Typography>
          </div>
          <form className={styles.formContent} onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <SelectDrop
                  label="School Name"
                  name="school_name"
                  options={schoolOptions}
                  value={formik.values.school_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.school_name &&
                    Boolean(formik.errors.school_name)
                  }
                  helperText={
                    formik.touched.school_name && formik.errors.school_name
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  className={styles.textInput}
                  label="Student Name"
                  name="student_name"
                  value={formik.values.student_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.student_name &&
                    Boolean(formik.errors.student_name)
                  }
                  helperText={
                    formik.touched.student_name && formik.errors.student_name
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Class"
                  name="class_name"
                  options={classOptions}
                  value={formik.values.class_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.class_name &&
                    Boolean(formik.errors.class_name)
                  }
                  helperText={
                    formik.touched.class_name && formik.errors.class_name
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Section"
                  name="student_section"
                  options={sectionOptions}
                  value={formik.values.student_section}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.student_section &&
                    Boolean(formik.errors.student_section)
                  }
                  helperText={
                    formik.touched.student_section &&
                    formik.errors.student_section
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Mobile Number"
                  name="mobile_number"
                  value={formik.values.mobile_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.mobile_number &&
                    Boolean(formik.errors.mobile_number)
                  }
                  helperText={
                    formik.touched.mobile_number && formik.errors.mobile_number
                  }
                  type="tel"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Whatsapp Number"
                  name="whatsapp_number"
                  value={formik.values.whatsapp_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.whatsapp_number &&
                    Boolean(formik.errors.whatsapp_number)
                  }
                  helperText={
                    formik.touched.whatsapp_number &&
                    formik.errors.whatsapp_number
                  }
                  type="tel"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SelectDrop
                  label="Subject"
                  name="student_subject"
                  options={subjectOptions}
                  value={formik.values.student_subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.student_subject &&
                    Boolean(formik.errors.student_subject)
                  }
                  helperText={
                    formik.touched.student_subject &&
                    formik.errors.student_subject
                  }
                  fullWidth
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Roll Number"
                  name="roll_no"
                  value={formik.values.roll_no}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  InputProps={{
                    className: styles.inputField,
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.8rem",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: "bolder",
                    },
                  }}
                  error={
                    formik.touched.roll_no && Boolean(formik.errors.roll_no)
                  }
                  helperText={formik.touched.roll_no && formik.errors.roll_no}
                  type="tel"
                  fullWidth
                />
              </Grid> */}
            </Grid>

            <Box
              className={`${styles.buttonContainer} gap-2 mt-4`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp
                text="Update"
                type="submit"
                disabled={false}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/studentList")}
              />
            </Box>
          </form>
        </div>
      </Box>
    </Mainlayout>
  );
}