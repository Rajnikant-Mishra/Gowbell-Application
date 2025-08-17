// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Grid,
//   CircularProgress,
// } from "@mui/material";
// import styles from "./inventory.module.css";
// import Swal from "sweetalert2";
// import Mainlayout from "../Layouts/Mainlayout";
// import { useNavigate, useParams } from "react-router-dom";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import ButtonComp from "../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import "../Common-Css/Swallfire.css";

// // Helper text style for error messages
// const helperTextStyle = {
//   fontSize: "0.7rem",
//   color: "red",
// };

// export default function InventoryForm() {
//   const navigate = useNavigate();
//   const { id } = useParams(); // id must exist for update mode
//   const todayDate = new Date().toISOString().split("T")[0];

//   const [items, setItems] = useState([]);
//   const [subItems, setSubItems] = useState([]);
//   const [subItemNames, setSubItemNames] = useState([]);
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const [selectedSubItemId, setSelectedSubItemId] = useState(null);
//   const [isLoadingSubItems, setIsLoadingSubItems] = useState(false);
//   const [isLoadingNames, setIsLoadingNames] = useState(false);
//   const [initialValues, setInitialValues] = useState({
//     date: todayDate,
//     invoice_no: "",
//     item: "",
//     quantity: "",
//     unit: "",
//     price: "",
//     remarks: "",
//     manufacturer_details: "",
//     sub_item: "",
//     sub_item_name: "",
//   });

//   const units = [
//     { value: "", name: "-- Select Unit --" },
//     { value: "numbers", name: "Numbers" },
//     { value: "kg", name: "Kg" },
//     { value: "packs", name: "Packs" },
//   ];

//   const validationSchema = Yup.object({
//     invoice_no: Yup.string().required("Invoice No is required"),
//     date: Yup.date().required("Date is required"),
//     item: Yup.string().required("Item Name is required"),
//     quantity: Yup.number()
//       .positive("Quantity must be positive")
//       .integer("Quantity must be an integer")
//       .required("Quantity is required"),
//     unit: Yup.string().required("Unit is required"),
//     price: Yup.number()
//       .positive("Price must be positive")
//       .required("Price is required"),
//     remarks: Yup.string().optional(),
//     manufacturer_details: Yup.string().optional(),
//     sub_item: Yup.string().when("item", {
//       is: (item) => item && subItems.length > 0,
//       then: (schema) => schema.required("Sub-item is required"),
//       otherwise: (schema) => schema.optional(),
//     }),
//     sub_item_name: Yup.string().when("sub_item", {
//       is: (sub_item) => sub_item && subItemNames.length > 0,
//       then: (schema) => schema.required("Sub-item name is required"),
//       otherwise: (schema) => schema.optional(),
//     }),
//   });

//   // Fetch items
//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/api/t1/items`)
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           setItems(res.data.map((i) => ({ id: i.id, name: i.name })));
//         } else setItems([]);
//       })
//       .catch(() => setItems([]));
//   }, []);

//   // Fetch inventory data for update mode
//   useEffect(() => {
//     if (id) {
//       const token = localStorage.getItem("token");
//       axios
//         .get(`${API_BASE_URL}/api/v1/inventory/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           const data = res.data;
//           // Format the date field
//           const formattedDate = data.date
//             ? new Date(data.date).toISOString().split("T")[0]
//             : todayDate;
//           setInitialValues({
//             ...data,
//             date: formattedDate, // Set the formatted date here
//             invoice_no: data.invoice_no || "",
//             item: data.item || "",
//             quantity: data.quantity || "",
//             unit: data.unit || "",
//             price: data.price || "",
//             remarks: data.remarks || "",
//             manufacturer_details: data.manufacturer_details || "",
//             sub_item: data.sub_item || "",
//             sub_item_name: data.sub_item_name || "",
//           });
//           setSelectedItemId(data.item_id || null);
//           setSelectedSubItemId(data.sub_item_id || null);
//         })
//         .catch(() => {
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "Failed to load inventory details.",
//             timer: 1200,
//             toast: true,
//             position: "top-end",
//             showConfirmButton: false,
//           });
//           navigate("/list-inventory");
//         });
//     } else {
//       // If no id is provided, redirect to inventory list
//       Swal.fire({
//         icon: "error",
//         title: "Invalid Request",
//         text: "No inventory ID provided for update.",
//         timer: 1200,
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//       });
//       navigate("/list-inventory");
//     }
//   }, [id, navigate, todayDate]);

//   // Fetch sub-items
//   useEffect(() => {
//     if (selectedItemId) {
//       setIsLoadingSubItems(true);
//       axios
//         .get(`${API_BASE_URL}/api/s1/subitems/names?item_id=${selectedItemId}`)
//         .then((res) => {
//           const data = Array.isArray(res.data?.parentNames)
//             ? res.data.parentNames.map((s) => ({
//                 id: s.parent_id,
//                 name: s.parent_name,
//               }))
//             : [];
//           setSubItems(data);
//         })
//         .catch(() => setSubItems([]))
//         .finally(() => setIsLoadingSubItems(false));
//     } else {
//       setSubItems([]);
//       setSubItemNames([]);
//       setSelectedSubItemId(null);
//     }
//   }, [selectedItemId]);

//   // Fetch sub-item names
//   useEffect(() => {
//     if (selectedSubItemId) {
//       setIsLoadingNames(true);
//       axios
//         .get(`${API_BASE_URL}/api/s1/subitems/names?parent_id=${selectedSubItemId}`)
//         .then((res) => {
//           const data = Array.isArray(res.data.names)
//             ? res.data.names.map((n, idx) => ({ id: `${selectedSubItemId}-${idx}`, name: n }))
//             : [];
//           setSubItemNames(data);
//         })
//         .catch(() => setSubItemNames([]))
//         .finally(() => setIsLoadingNames(false));
//     } else {
//       setSubItemNames([]);
//     }
//   }, [selectedSubItemId]);

//   const handleSubmit = async (values) => {
//     try {
//       const token = localStorage.getItem("token");
//       const payload = {
//         ...values,
//         item_id: selectedItemId,
//         sub_item_id: selectedSubItemId,
//       };

//       // Update
//       await axios.put(`${API_BASE_URL}/api/v1/inventory/${id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       Swal.fire({
//         icon: "success",
//         title: "Updated!",
//         text: "Inventory updated successfully!",
//         timer: 1000,
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//       });
//       navigate("/list-inventory");
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.response?.data?.message || "Failed to update inventory.",
//         timer: 1200,
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
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
//               { name: "Update Inventory" },
//             ]}
//           />
//         </div>
//       </div>
//       <Box className={`${styles.formContainer} container-fluid pt-5`}>
//         <div className={`${styles.formBox}`}>
//           <Typography className={`${styles.formTitle} mb-4`}>
//             Update Inventory
//           </Typography>
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ values, handleChange, errors, touched, setFieldValue }) => (
//               <Form className={styles.formContent}>
//                 <Grid container spacing={3}>
//                   {/* Date */}
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Date"
//                       name="date"
//                       type="date"
//                       value={values.date}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{ className: styles.inputField }}
//                       InputLabelProps={{ className: styles.inputLabel }}
//                       error={touched.date && Boolean(errors.date)}
//                       helperText={touched.date && errors.date}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     />
//                   </Grid>
//                   {/* Invoice No */}
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Invoice No"
//                       name="invoice_no"
//                       value={values.invoice_no}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{ className: styles.inputField }}
//                       InputLabelProps={{ className: styles.inputLabel }}
//                       error={touched.invoice_no && Boolean(errors.invoice_no)}
//                       helperText={touched.invoice_no && errors.invoice_no}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     />
//                   </Grid>
//                   {/* Quantity */}
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Quantity"
//                       name="quantity"
//                       type="number"
//                       value={values.quantity}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{ className: styles.inputField }}
//                       InputLabelProps={{ className: styles.inputLabel }}
//                       error={touched.quantity && Boolean(errors.quantity)}
//                       helperText={touched.quantity && errors.quantity}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     />
//                   </Grid>
//                   {/* Unit */}
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       select
//                       name="unit"
//                       value={values.unit}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{ className: styles.inputField }}
//                       InputLabelProps={{ className: styles.inputLabel }}
//                       SelectProps={{ native: true }}
//                       error={touched.unit && Boolean(errors.unit)}
//                       helperText={touched.unit && errors.unit}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     >
//                       {units.map((u) => (
//                         <option key={u.value} value={u.value}>
//                           {u.name}
//                         </option>
//                       ))}
//                     </TextField>
//                   </Grid>
//                   {/* Price */}
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Price"
//                       name="price"
//                       type="number"
//                       value={values.price}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{ className: styles.inputField }}
//                       InputLabelProps={{ className: styles.inputLabel }}
//                       error={touched.price && Boolean(errors.price)}
//                       helperText={touched.price && errors.price}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     />
//                   </Grid>
//                   {/* Remarks */}
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
//                       InputProps={{ className: styles.inputField }}
//                       InputLabelProps={{ className: styles.inputLabel }}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     />
//                   </Grid>
//                   {/* Manufacturer */}
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Manufacturer"
//                       name="manufacturer_details"
//                       value={values.manufacturer_details}
//                       onChange={handleChange}
//                       fullWidth
//                       size="small"
//                       InputProps={{ className: styles.inputField }}
//                       InputLabelProps={{ className: styles.inputLabel }}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     />
//                   </Grid>
//                   {/* Main Item */}
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       select
//                       name="item"
//                       value={values.item}
//                       onChange={(e) => {
//                         handleChange(e);
//                         const selected = items.find((i) => i.name === e.target.value);
//                         setSelectedItemId(selected ? selected.id : null);
//                         setFieldValue("sub_item", "");
//                         setFieldValue("sub_item_name", "");
//                         setSelectedSubItemId(null);
//                         setSubItemNames([]);
//                       }}
//                       fullWidth
//                       size="small"
//                       InputProps={{ className: styles.inputField }}
//                       InputLabelProps={{ className: styles.inputLabel }}
//                       SelectProps={{ native: true }}
//                       error={touched.item && Boolean(errors.item)}
//                       helperText={touched.item && errors.item}
//                       FormHelperTextProps={{ style: helperTextStyle }}
//                     >
//                       <option value="">Select an item</option>
//                       {items.map((i) => (
//                         <option key={i.id} value={i.name}>
//                           {i.name}
//                         </option>
//                       ))}
//                     </TextField>
//                   </Grid>
//                   {/* Sub Item */}
//                   {selectedItemId && (
//                     <Grid item xs={12} sm={6} md={3}>
//                       <TextField
//                         select
//                         name="sub_item"
//                         value={values.sub_item}
//                         onChange={(e) => {
//                           handleChange(e);
//                           const selected = subItems.find((s) => s.name === e.target.value);
//                           setSelectedSubItemId(selected ? selected.id : null);
//                           setFieldValue("sub_item_name", "");
//                           setSubItemNames([]);
//                         }}
//                         fullWidth
//                         size="small"
//                         disabled={isLoadingSubItems}
//                         InputProps={{
//                           className: styles.inputField,
//                           startAdornment: isLoadingSubItems && (
//                             <CircularProgress size={20} sx={{ mr: 1 }} />
//                           ),
//                         }}
//                         InputLabelProps={{ className: styles.inputLabel }}
//                         SelectProps={{ native: true }}
//                         error={touched.sub_item && Boolean(errors.sub_item)}
//                         helperText={touched.sub_item && errors.sub_item}
//                         FormHelperTextProps={{ style: helperTextStyle }}
//                       >
//                         <option value="">Select Sub-item</option>
//                         {subItems.length > 0 ? (
//                           subItems.map((s) => (
//                             <option key={s.id} value={s.name}>
//                               {s.name}
//                             </option>
//                           ))
//                         ) : (
//                           <option disabled>No sub-items available</option>
//                         )}
//                       </TextField>
//                     </Grid>
//                   )}
//                   {/* Sub Item Name */}
//                   {selectedSubItemId && (
//                     <Grid item xs={12} sm={6} md={3}>
//                       <TextField
//                         select
//                         name="sub_item_name"
//                         value={values.sub_item_name}
//                         onChange={handleChange}
//                         fullWidth
//                         size="small"
//                         disabled={isLoadingNames}
//                         InputProps={{
//                           className: styles.inputField,
//                           startAdornment: isLoadingNames && (
//                             <CircularProgress size={20} sx={{ mr: 1 }} />
//                           ),
//                         }}
//                         InputLabelProps={{ className: styles.inputLabel }}
//                         SelectProps={{ native: true }}
//                         error={touched.sub_item_name && Boolean(errors.sub_item_name)}
//                         helperText={touched.sub_item_name && errors.sub_item_name}
//                         FormHelperTextProps={{ style: helperTextStyle }}
//                       >
//                         <option value="">Select a name</option>
//                         {subItemNames.length > 0 ? (
//                           subItemNames.map((n) => (
//                             <option key={n.id} value={n.name}>
//                               {n.name}
//                             </option>
//                           ))
//                         ) : (
//                           <option disabled>No names available</option>
//                         )}
//                       </TextField>
//                     </Grid>
//                   )}
//                 </Grid>
//                 {/* Submit / Cancel */}
//                 <Box className={`${styles.buttonContainer} mt-4`} sx={{ display: "flex", gap: 2 }}>
//                   <ButtonComp text="Update" type="submit" sx={{ flexGrow: 1 }} />
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
import {
  Box,
  Typography,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import styles from "./inventory.module.css";
import Swal from "sweetalert2";
import Mainlayout from "../Layouts/Mainlayout";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../Common-Css/Swallfire.css";

// Helper text style for error messages
const helperTextStyle = {
  fontSize: "0.7rem",
  color: "red",
};

export default function InventoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const todayDate = new Date().toISOString().split("T")[0];

  const [items, setItems] = useState([]);
  const [subItems, setSubItems] = useState([]);
  const [subItemNames, setSubItemNames] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedSubItemId, setSelectedSubItemId] = useState(null);
  const [isLoadingSubItems, setIsLoadingSubItems] = useState(false);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    date: todayDate,
    invoice_no: "",
    item: "",
    quantity: "",
    unit: "",
    price: "",
    remarks: "",
    manufacturer_details: "",
    sub_item: "",
    sub_item_name: "",
  });

  const units = [
    { value: "", name: "-- Select Unit --" },
    { value: "numbers", name: "Numbers" },
    { value: "kg", name: "Kg" },
    { value: "packs", name: "Packs" },
  ];

  const validationSchema = Yup.object({
    invoice_no: Yup.string().required("Invoice No is required"),
    date: Yup.date().required("Date is required"),
    item: Yup.string().required("Item Name is required"),
    quantity: Yup.number()
      .positive("Quantity must be positive")
      .integer("Quantity must be an integer")
      .required("Quantity is required"),
    unit: Yup.string().required("Unit is required"),
    price: Yup.number()
      .positive("Price must be positive")
      .required("Price is required"),
    remarks: Yup.string().optional(),
    manufacturer_details: Yup.string().optional(),
    sub_item: Yup.string().when("item", {
      is: (item) => item && (subItems.length > 0 || initialValues.sub_item),
      then: (schema) => schema.required("Sub-item is required"),
      otherwise: (schema) => schema.optional(),
    }),
    sub_item_name: Yup.string().when("sub_item", {
      is: (sub_item) => sub_item && (subItemNames.length > 0 || initialValues.sub_item_name),
      then: (schema) => schema.required("Sub-item name is required"),
      otherwise: (schema) => schema.optional(),
    }),
  });

  // Fetch items
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/t1/items`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const filteredData = response.data.map((item) => ({
            id: item.id,
            name: item.name,
          }));
          setItems(filteredData);
        } else {
          setItems([]);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error",
            text: "No items found.",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setItems([]);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error",
          text: "Failed to load items.",
          showConfirmButton: false,
          timer: 1000,
          toast: true,
        });
      });
  }, []);

  // Fetch inventory data for update mode
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Unauthorized",
          text: "Please log in to continue.",
          showConfirmButton: false,
          timer: 1000,
          toast: true,
        });
        navigate("/login");
        return;
      }
      axios
        .get(`${API_BASE_URL}/api/v1/inventory/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data;
          console.log("Fetched inventory data:", data);
          const formattedDate = data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : todayDate;
          setInitialValues({
            date: formattedDate,
            invoice_no: data.invoice_no || "",
            item: data.item || "",
            quantity: data.quantity || "",
            unit: data.unit || "",
            price: data.price || "",
            remarks: data.remarks || "",
            manufacturer_details: data.manufacturer_details || "",
            sub_item: data.sub_item || "",
            sub_item_name: data.sub_item_name || "",
          });
          if (data.item_id && items.some((i) => i.id === data.item_id)) {
            setSelectedItemId(data.item_id);
            if (data.sub_item_id) {
              setSelectedSubItemId(data.sub_item_id);
              setSubItems([{ id: data.sub_item_id, name: data.sub_item }]);
            }
          } else {
            console.warn("Invalid item_id in fetched data:", data.item_id);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error",
              text: "Invalid item ID in inventory data. Please select a valid item.",
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
          }
        })
        .catch((err) => {
          console.error("Inventory fetch error:", err.response || err);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error",
            text: err.response?.data?.message || "Failed to load inventory details.",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          });
          navigate("/list-inventory");
        });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Invalid Request",
        text: "No inventory ID provided for update.",
        showConfirmButton: false,
        timer: 1000,
        toast: true,
      });
      navigate("/list-inventory");
    }
  }, [id, navigate, todayDate, items]);

  // Fetch sub-items
  useEffect(() => {
    if (selectedItemId) {
      setIsLoadingSubItems(true);
      axios
        .get(`${API_BASE_URL}/api/s1/subitems/names?item_id=${selectedItemId}`)
        .then((response) => {
          let data = Array.isArray(response.data?.parentNames)
            ? response.data.parentNames.map((item) => ({
                id: item.parent_id,
                name: item.parent_name,
              }))
            : [];
          if (
            initialValues.sub_item &&
            !data.some((s) => s.name === initialValues.sub_item)
          ) {
            data = [
              { id: selectedSubItemId || `temp-${initialValues.sub_item}`, name: initialValues.sub_item },
              ...data,
            ];
          }
          setSubItems(data);
          if (data.length === 0 && initialValues.sub_item) {
            Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "No Sub-items",
              text: "No sub-items available for this item, but showing existing data.",
              showConfirmButton: false,
              timer: 1000,
              toast: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching subitems:", error);
          setSubItems(
            initialValues.sub_item
              ? [{ id: selectedSubItemId || `temp-${initialValues.sub_item}`, name: initialValues.sub_item }]
              : []
          );
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error",
            text: "Failed to load sub-items.",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          });
        })
        .finally(() => setIsLoadingSubItems(false));
    } else {
      setSubItems(
        initialValues.sub_item
          ? [{ id: selectedSubItemId || `temp-${initialValues.sub_item}`, name: initialValues.sub_item }]
          : []
      );
      setSubItemNames([]);
      setSelectedSubItemId(null);
    }
  }, [selectedItemId, initialValues.sub_item, selectedSubItemId]);

  // Fetch sub-item names
  useEffect(() => {
    if (selectedSubItemId) {
      setIsLoadingNames(true);
      axios
        .get(`${API_BASE_URL}/api/s1/subitems/names?parent_id=${selectedSubItemId}`)
        .then((response) => {
          let data = Array.isArray(response.data.names)
            ? response.data.names.map((name, index) => ({
                id: `${selectedSubItemId}-${index}`,
                name,
              }))
            : [];
          if (
            initialValues.sub_item_name &&
            !data.some((n) => n.name === initialValues.sub_item_name)
          ) {
            data = [{ id: `${selectedSubItemId}-0`, name: initialValues.sub_item_name }, ...data];
          }
          setSubItemNames(data);
          if (data.length === 0 && initialValues.sub_item_name) {
            Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "No Names",
              text: "No names available for this sub-item, but showing existing data.",
              showConfirmButton: false,
              timer: 1000,
              toast: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching sub-item names:", error);
          setSubItemNames(
            initialValues.sub_item_name
              ? [{ id: `${selectedSubItemId}-0`, name: initialValues.sub_item_name }]
              : []
          );
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error",
            text: "Failed to load sub-item names.",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          });
        })
        .finally(() => setIsLoadingNames(false));
    } else {
      setSubItemNames(
        initialValues.sub_item_name
          ? [{ id: `temp-${initialValues.sub_item_name}`, name: initialValues.sub_item_name }]
          : []
      );
    }
  }, [selectedSubItemId, initialValues.sub_item_name]);

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      // Validate item_id
      if (!selectedItemId || !items.some((i) => i.id === selectedItemId)) {
        throw new Error("Invalid or missing item_id. Please select a valid item.");
      }
      const payload = {
        date: values.date,
        invoice_no: values.invoice_no,
        item: values.item,
        item_id: selectedItemId,
        quantity: parseInt(values.quantity, 10),
        unit: values.unit,
        price: parseFloat(values.price),
        remarks: values.remarks || "",
        manufacturer_details: values.manufacturer_details || "",
        sub_item: values.sub_item || "",
        sub_item_id: selectedSubItemId && !selectedSubItemId.startsWith("temp-") ? selectedSubItemId : null,
        sub_item_name: values.sub_item_name || "",
      };
      console.log("Submitting payload:", payload);
      const response = await axios.put(`${API_BASE_URL}/api/v1/inventory/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Update response:", response.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Updated!",
        text: "Inventory updated successfully!",
        showConfirmButton: false,
        timer: 1000,
        toast: true,
      });
      resetForm();
      setSelectedItemId(null);
      setSelectedSubItemId(null);
      setSubItems([]);
      setSubItemNames([]);
      navigate("/list-inventory");
    } catch (err) {
      console.error("Update error:", err.response || err);
      let errorMessage = "Failed to update inventory.";
      if (err.message.includes("item_id")) {
        errorMessage = err.message;
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          "Invalid or missing fields in the request.";
        if (err.response.data?.missingFields) {
          errorMessage += ` Missing fields: ${err.response.data.missingFields.join(", ")}`;
        }
      } else if (err.response?.status === 401) {
        errorMessage = "Unauthorized: Please log in again.";
      } else if (err.response?.status === 404) {
        errorMessage = "Inventory item not found.";
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Inventory", link: "/list-inventory" },
              { name: "Update Inventory" },
            ]}
          />
        </div>
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <Typography className={`${styles.formTitle} mb-4`}>
            Update Inventory
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form className={styles.formContent}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Date"
                      name="date"
                      type="date"
                      value={values.date}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      InputProps={{ className: styles.inputField }}
                      InputLabelProps={{ className: styles.inputLabel }}
                      error={touched.date && Boolean(errors.date)}
                      helperText={touched.date && errors.date}
                      FormHelperTextProps={{ style: helperTextStyle }}
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
                      InputProps={{ className: styles.inputField }}
                      InputLabelProps={{ className: styles.inputLabel }}
                      error={touched.invoice_no && Boolean(errors.invoice_no)}
                      helperText={touched.invoice_no && errors.invoice_no}
                      FormHelperTextProps={{ style: helperTextStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={values.quantity}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      InputProps={{ className: styles.inputField }}
                      InputLabelProps={{ className: styles.inputLabel }}
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                      FormHelperTextProps={{ style: helperTextStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      label="Unit"
                      name="unit"
                      value={values.unit}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      InputProps={{ className: styles.inputField }}
                      InputLabelProps={{ className: styles.inputLabel }}
                      SelectProps={{ native: true }}
                      error={touched.unit && Boolean(errors.unit)}
                      helperText={touched.unit && errors.unit}
                      FormHelperTextProps={{ style: helperTextStyle }}
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
                      type="number"
                      value={values.price}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      InputProps={{ className: styles.inputField }}
                      InputLabelProps={{ className: styles.inputLabel }}
                      error={touched.price && Boolean(errors.price)}
                      helperText={touched.price && errors.price}
                      FormHelperTextProps={{ style: helperTextStyle }}
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
                      InputProps={{ className: styles.inputField }}
                      InputLabelProps={{ className: styles.inputLabel }}
                      FormHelperTextProps={{ style: helperTextStyle }}
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
                      InputProps={{ className: styles.inputField }}
                      InputLabelProps={{ className: styles.inputLabel }}
                      FormHelperTextProps={{ style: helperTextStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      label="Item"
                      name="item"
                      value={values.item}
                      onChange={(e) => {
                        handleChange(e);
                        const selected = items.find((i) => i.name === e.target.value);
                        setSelectedItemId(selected ? selected.id : null);
                        setFieldValue("sub_item", "");
                        setFieldValue("sub_item_name", "");
                        setSelectedSubItemId(null);
                        setSubItemNames([]);
                      }}
                      fullWidth
                      size="small"
                      InputProps={{ className: styles.inputField }}
                      InputLabelProps={{ className: styles.inputLabel }}
                      SelectProps={{ native: true }}
                      error={touched.item && Boolean(errors.item)}
                      helperText={touched.item && errors.item}
                      FormHelperTextProps={{ style: helperTextStyle }}
                    >
                      <option value="">Select an item</option>
                      {items.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  {(selectedItemId || initialValues.sub_item) && (
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        label="Sub Item"
                        name="sub_item"
                        value={values.sub_item}
                        onChange={(e) => {
                          handleChange(e);
                          const selected = subItems.find((s) => s.name === e.target.value);
                          setSelectedSubItemId(selected ? selected.id : null);
                          setFieldValue("sub_item_name", "");
                          setSubItemNames([]);
                        }}
                        fullWidth
                        size="small"
                        disabled={isLoadingSubItems}
                        InputProps={{
                          className: styles.inputField,
                          startAdornment: isLoadingSubItems && (
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                          ),
                        }}
                        InputLabelProps={{ className: styles.inputLabel }}
                        SelectProps={{ native: true }}
                        error={touched.sub_item && Boolean(errors.sub_item)}
                        helperText={touched.sub_item && errors.sub_item}
                        FormHelperTextProps={{ style: helperTextStyle }}
                      >
                        <option value="">Select Sub-item</option>
                        {subItems.length > 0 ? (
                          subItems.map((subItem) => (
                            <option key={subItem.id} value={subItem.name}>
                              {subItem.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No sub-items available</option>
                        )}
                      </TextField>
                    </Grid>
                  )}
                  {(selectedSubItemId || initialValues.sub_item_name) && (
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        label="Sub Item Name"
                        name="sub_item_name"
                        value={values.sub_item_name}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        disabled={isLoadingNames}
                        InputProps={{
                          className: styles.inputField,
                          startAdornment: isLoadingNames && (
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                          ),
                        }}
                        InputLabelProps={{ className: styles.inputLabel }}
                        SelectProps={{ native: true }}
                        error={touched.sub_item_name && Boolean(errors.sub_item_name)}
                        helperText={touched.sub_item_name && errors.sub_item_name}
                        FormHelperTextProps={{ style: helperTextStyle }}
                      >
                        <option value="">Select a name</option>
                        {subItemNames.length > 0 ? (
                          subItemNames.map((name) => (
                            <option key={name.id} value={name.name}>
                              {name.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No names available</option>
                        )}
                      </TextField>
                    </Grid>
                  )}
                </Grid>
                <Box
                  className={`${styles.buttonContainer} mt-4`}
                  sx={{ display: "flex", gap: 2 }}
                >
                  <ButtonComp
                    text="Update"
                    type="submit"
                    sx={{ flexGrow: 1 }}
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress size={20} />}
                  />
                  <ButtonComp
                    text="Cancel"
                    type="button"
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/list-inventory")}
                    disabled={isSubmitting}
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