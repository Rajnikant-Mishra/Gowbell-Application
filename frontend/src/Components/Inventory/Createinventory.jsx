
//this code is items 

// import React, { useState, useEffect } from "react";
// import { Box, Typography, TextField, Grid } from "@mui/material";
// import styles from "./inventory.module.css";
// import Swal from "sweetalert2";
// import Mainlayout from "../Layouts/Mainlayout";
// import { useNavigate } from "react-router-dom";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import "../Common-Css/Swallfire.css";

// export default function InventoryForm() {
//   const validationSchema = Yup.object({
//     invoice_no: Yup.string().required("Invoice No is required"),
//     date: Yup.date().required("Date is required"),
//     item: Yup.string().required("Item Name is required"),
//     quantity: Yup.number()
//       .positive()
//       .integer()
//       .required("Item Quantity is required"),
//     unit: Yup.string().required("Unit is required"),
//     price: Yup.number().positive().required("Price is required"),
//     remarks: Yup.string().optional(),
//     sub_item: Yup.string().when("item", {
//       is: (item) => item && subItems.length > 0,
//       then: Yup.string().required("Sub-item is required"),
//       otherwise: Yup.string().optional(),
//     }),
//   });

//   const helperTextStyle = {
//     fontSize: "0.7rem",
//     color: "red",
//   };

//   const [items, setItems] = useState([]);
//   const [subItems, setSubItems] = useState([]);
//   const navigate = useNavigate();
//   const todayDate = new Date().toISOString().split("T")[0];

//   const [formData, setFormData] = useState({
//     date: todayDate,
//     invoice_no: "",
//     item: "",
//     quantity: "",
//     unit: "",
//     price: "",
//     remarks: "",
//     manufacturer_details: "",
//     sub_item: "",
//   });

//   const units = [
//     { value: "", name: "--Unit--" },
//     { value: "numbers", name: "Numbers" },
//     { value: "kg", name: "Kg" },
//     { value: "packs", name: "Packs" },
//   ];

//   // Fetch items on component mount
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/t1/items`)
//       .then((response) => {
//         setItems(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching items:", error);
//       });
//   }, []);

//   // Fetch sub-items when item changes
//   useEffect(() => {
//     if (formData.item) {
//       axios
//         .get(`${API_BASE_URL}/api/s1/item/${formData.item}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })
//         .then((response) => {
//           const subItemsData = response.data || [];
//           setSubItems(subItemsData);
//           // Reset sub_item when new sub-items are fetched
//           setFormData((prev) => ({ ...prev, sub_item: "" }));
//           if (subItemsData.length === 0) {
//             Swal.fire({
//               position: "top-end",
//               icon: "info",
//               title: "No Subitems",
//               text: "No subitems available for this item.",
//               showConfirmButton: false,
//               timer: 1000,
//               toast: true,
//             });
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching subitems:", error);
//           setSubItems([]);
//           setFormData((prev) => ({ ...prev, sub_item: "" }));
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Error",
//             text: "Failed to load subitems.",
//             showConfirmButton: false,
//             timer: 1000,
//             toast: true,
//           });
//         });
//     } else {
//       setSubItems([]);
//       setFormData((prev) => ({ ...prev, sub_item: "" }));
//     }
//   }, [formData.item]);

//   const handleSubmit = async (values) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(`${API_BASE_URL}/api/v1/inventory`, values, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: `Inventory item created successfully!`,
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       });

//       navigate("/list-inventory");
//     } catch (error) {
//       let errorMessage = "There was an error creating the inventory item.";
//       if (error.response && error.response.data && error.response.data.message) {
//         errorMessage = error.response.data.message;
//       }
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error",
//         text: errorMessage,
//         showConfirmButton: false,
//         timer: 1000,
//         timerProgressBar: true,
//         toast: true,
//         background: "#fff",
//         customClass: {
//           popup: "small-swal",
//         },
//       });
//     }
//   };

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div role="presentation">
//           <Breadcrumb
//             data={[
//               { name: "Inventory", link: "/list-inventory" },
//               { name: "CreateInventory" },
//             ]}
//           />
//         </div>
//       </div>
//       <Box className={`${styles.formContainer} container-fluid pt-5`}>
//         <div className={`${styles.formBox}`}>
//           <Typography className={`${styles.formTitle} mb-4`}>
//             Create Inventory
//           </Typography>
//           <Formik
//             initialValues={formData}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ values, handleChange, errors, touched }) => (
//               <Form className={styles.formContent}>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       name="date"
//                       value={values.date}
//                       onChange={handleChange}
//                       type="date"
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         className: styles.inputField,
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.8rem",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                       error={touched.date && errors.date}
//                       helperText={touched.date && errors.date}
//                       FormHelperTextProps={{
//                         style: helperTextStyle,
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Invoice No"
//                       name="invoice_no"
//                       value={values.invoice_no}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         className: styles.inputField,
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.8rem",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                       error={touched.invoice_no && errors.invoice_no}
//                       helperText={touched.invoice_no && errors.invoice_no}
//                       FormHelperTextProps={{
//                         style: helperTextStyle,
//                       }}
//                     />
//                   </Grid>
                 
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Quantity"
//                       name="quantity"
//                       value={values.quantity}
//                       onChange={handleChange}
//                       type="number"
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         className: styles.inputField,
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.8rem",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                       error={touched.quantity && errors.quantity}
//                       helperText={touched.quantity && errors.quantity}
//                       FormHelperTextProps={{
//                         style: helperTextStyle,
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       select
//                       name="unit"
//                       size="small"
//                       value={values.unit}
//                       onChange={handleChange}
//                       fullWidth
//                       InputProps={{
//                         className: styles.inputField,
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.8rem",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                       SelectProps={{ native: true }}
//                       error={touched.unit && errors.unit}
//                       helperText={touched.unit && errors.unit}
//                       FormHelperTextProps={{
//                         style: helperTextStyle,
//                       }}
//                     >
//                       {units.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </TextField>
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Price"
//                       name="price"
//                       value={values.price}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         className: styles.inputField,
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.8rem",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                       error={touched.price && errors.price}
//                       helperText={touched.price && errors.price}
//                       FormHelperTextProps={{
//                         style: helperTextStyle,
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Remarks"
//                       name="remarks"
//                       value={values.remarks}
//                       onChange={handleChange}
//                       fullWidth
//                       multiline
//                       rows={1}
//                       size="small"
//                       InputProps={{
//                         className: styles.inputField,
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.8rem",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Manufacturer"
//                       name="manufacturer_details"
//                       value={values.manufacturer_details}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{
//                         className: styles.inputField,
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.8rem",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       select
//                       name="item"
//                       size="small"
//                       value={values.item}
//                       onChange={(e) => {
//                         handleChange(e);
//                         setFormData({ ...formData, item: e.target.value });
//                       }}
//                       fullWidth
//                       InputProps={{
//                         className: styles.inputField,
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.8rem",
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           fontFamily: "Nunito, sans-serif",
//                           fontSize: "0.85rem",
//                           fontWeight: "bolder",
//                         },
//                       }}
//                       SelectProps={{ native: true }}
//                       error={touched.item && Boolean(errors.item)}
//                       helperText={touched.item && errors.item}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     >
//                       <option value="">Select an item</option>
//                       {items.map((option) => (
//                         <option key={option.id} value={option.id}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </TextField>
//                   </Grid>
//                   {/* Dynamic sub-item dropdown */}
//                   {subItems.length > 0 && (
//                     <Grid item xs={12} sm={6} md={3}>
//                       <TextField
//                         select
//                         // label="Sub-item"
//                         name="sub_item"
//                         value={values.sub_item}
//                         onChange={handleChange}
//                         fullWidth
//                         size="small"
//                         InputProps={{
//                           className: styles.inputField,
//                           style: {
//                             fontFamily: "Nunito, sans-serif",
//                             fontSize: "0.8rem",
//                           },
//                         }}
//                         InputLabelProps={{
//                           style: {
//                             fontFamily: "Nunito, sans-serif",
//                             fontSize: "0.85rem",
//                             fontWeight: "bolder",
//                           },
//                         }}
//                         SelectProps={{ native: true }}
//                         error={touched.sub_item && errors.sub_item}
//                         helperText={touched.sub_item && errors.sub_item}
//                         FormHelperTextProps={{
//                           style: helperTextStyle,
//                         }}
//                       >
//                         <option value="">Select Sub-item</option>
//                         {subItems.map((subItem) => (
//                           <option key={subItem.id} value={subItem.id}>
//                             {subItem.name || subItem.cvalue}
//                           </option>
//                         ))}
//                       </TextField>
//                     </Grid>
//                   )}
//                 </Grid>
//                 <Box
//                   className={`${styles.buttonContainer} gap-2 mt-4`}
//                   sx={{ display: "flex", gap: 2 }}
//                 >
//                   <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
//                   <ButtonComp
//                     text="Cancel"
//                     type="button"
//                     sx={{ flexGrow: 1 }}
//                     onClick={() => navigate("/list-inventory")}
//                   />
//                 </Box>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </Box>
//     </Mainlayout>
//   );
// }


import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Grid } from "@mui/material";
import styles from "./inventory.module.css";
import Swal from "sweetalert2";
import Mainlayout from "../Layouts/Mainlayout";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../Common-Css/Swallfire.css";

export default function InventoryForm() {
  // Validation schema with subItems as context
  const validationSchema = (subItems) =>
    Yup.object({
      invoice_no: Yup.string().required("Invoice No is required"),
      date: Yup.date().required("Date is required"),
      item: Yup.string().required("Item Name is required"),
      quantity: Yup.number()
        .positive()
        .integer()
        .required("Item Quantity is required"),
      unit: Yup.string().required("Unit is required"),
      price: Yup.number().positive().required("Price is required"),
      remarks: Yup.string().optional(),
      sub_item: Yup.string().when("item", {
        is: (item) => item && subItems.length > 0, // Simplified condition
        then: (schema) => schema.required("Sub-item is required"), // Use schema for Yup >= 0.32
        otherwise: (schema) => schema.optional(),
      }),
    });

  const helperTextStyle = {
    fontSize: "0.7rem",
    color: "red",
  };

  const [items, setItems] = useState([]);
  const [subItems, setSubItems] = useState([]);
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: todayDate,
    invoice_no: "",
    item: "",
    quantity: "",
    unit: "",
    price: "",
    remarks: "",
    manufacturer_details: "",
    sub_item: "",
  });

  const units = [
    { value: "", name: "--Unit--" },
    { value: "numbers", name: "Numbers" },
    { value: "kg", name: "Kg" },
    { value: "packs", name: "Packs" },
  ];

  // Fetch items on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/t1/items`)
      .then((response) => {
        setItems(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  // Fetch sub-items when item changes
  useEffect(() => {
    if (formData.item) {
      axios
        .get(`${API_BASE_URL}/api/s1/item/${formData.item}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const subItemsData = Array.isArray(response.data) ? response.data : [];
          console.log("Sub-items fetched:", subItemsData); // Debug
          setSubItems(subItemsData);
          setFormData((prev) => ({ ...prev, sub_item: "" }));
          if (subItemsData.length === 0) {
            Swal.fire({
              position: "top-end",
              icon: "info",
              title: "No Subitems",
              text: "No subitems available for this item.",
              showConfirmButton: false,
              timer: 1000,
              toast: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching subitems:", error);
          setSubItems([]);
          setFormData((prev) => ({ ...prev, sub_item: "" }));
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error",
            text: "Failed to load subitems.",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          });
        });
    } else {
      setSubItems([]);
      setFormData((prev) => ({ ...prev, sub_item: "" }));
    }
  }, [formData.item]);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/v1/inventory`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Inventory item created successfully!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });

      navigate("/list-inventory");
    } catch (error) {
      let errorMessage = "There was an error creating the inventory item.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Inventory", link: "/list-inventory" },
              { name: "CreateInventory" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <Typography className={`${styles.formTitle} mb-4`}>
            Create Inventory
          </Typography>
          <Formik
            initialValues={formData}
            validationSchema={validationSchema(subItems)}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, handleChange, errors, touched }) => (
              <Form className={styles.formContent}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      type="date"
                      fullWidth
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
                      error={touched.date && errors.date}
                      helperText={touched.date && errors.date}
                      FormHelperTextProps={{
                        style: helperTextStyle,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Invoice No"
                      name="invoice_no"
                      value={values.invoice_no}
                      onChange={handleChange}
                      fullWidth
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
                      error={touched.invoice_no && errors.invoice_no}
                      helperText={touched.invoice_no && errors.invoice_no}
                      FormHelperTextProps={{
                        style: helperTextStyle,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Quantity"
                      name="quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      type="number"
                      fullWidth
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
                      error={touched.quantity && errors.quantity}
                      helperText={touched.quantity && errors.quantity}
                      FormHelperTextProps={{
                        style: helperTextStyle,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      name="unit"
                      size="small"
                      value={values.unit}
                      onChange={handleChange}
                      fullWidth
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
                      SelectProps={{ native: true }}
                      error={touched.unit && errors.unit}
                      helperText={touched.unit && errors.unit}
                      FormHelperTextProps={{
                        style: helperTextStyle,
                      }}
                    >
                      {units.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Price"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      fullWidth
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
                      error={touched.price && errors.price}
                      helperText={touched.price && errors.price}
                      FormHelperTextProps={{
                        style: helperTextStyle,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Remarks"
                      name="remarks"
                      value={values.remarks}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={1}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Manufacturer"
                      name="manufacturer_details"
                      value={values.manufacturer_details}
                      onChange={handleChange}
                      fullWidth
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      name="item"
                      size="small"
                      value={values.item}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData({ ...formData, item: e.target.value });
                      }}
                      fullWidth
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
                      SelectProps={{ native: true }}
                      error={touched.item && Boolean(errors.item)}
                      helperText={touched.item && errors.item}
                      FormHelperTextProps={{ style: helperTextStyle }}
                    >
                      <option value="">Select an item</option>
                      {items.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  {subItems.length > 0 && (
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        name="sub_item"
                        value={values.sub_item}
                        onChange={handleChange}
                        fullWidth
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
                        SelectProps={{ native: true }}
                        error={touched.sub_item && errors.sub_item}
                        helperText={touched.sub_item && errors.sub_item}
                        FormHelperTextProps={{
                          style: helperTextStyle,
                        }}
                      >
                        <option value="">Select Sub-item</option>
                        {subItems.map((subItem) => (
                          <option key={subItem.id} value={subItem.id}>
                            {subItem.name || subItem.cvalue}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                </Grid>
                <Box
                  className={`${styles.buttonContainer} gap-2 mt-4`}
                  sx={{ display: "flex", gap: 2 }}
                >
                  <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
                  <ButtonComp
                    text="Cancel"
                    type="button"
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/list-inventory")}
                  />
                </Box>
              </Form>
            )}
          </Formik>
        </div>
      </Box>
    </Mainlayout>
  );
}