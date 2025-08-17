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
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../Common-Css/Swallfire.css";

export default function InventoryForm() {
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().split("T")[0];

  const [items, setItems] = useState([]);
  const [subItems, setSubItems] = useState([]);
  const [subItemNames, setSubItemNames] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedSubItemId, setSelectedSubItemId] = useState(null);
  const [isLoadingSubItems, setIsLoadingSubItems] = useState(false);
  const [isLoadingNames, setIsLoadingNames] = useState(false);

  const units = [
    { value: "", name: "-- Select Unit --" },
    { value: "numbers", name: "Numbers" },
    { value: "kg", name: "Kg" },
    { value: "packs", name: "Packs" },
  ];

  // Validation schema
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
      is: (item) => item && subItems.length > 0,
      then: (schema) => schema.required("Sub-item is required"),
      otherwise: (schema) => schema.optional(),
    }),
    sub_item_name: Yup.string().when("sub_item", {
      is: (sub_item) => sub_item && subItemNames.length > 0,
      then: (schema) => schema.required("Sub-item name is required"),
      otherwise: (schema) => schema.optional(),
    }),
  });

  // Fetch main items on component mount
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

  // Fetch sub-items when a main item is selected
  useEffect(() => {
    if (selectedItemId) {
      setIsLoadingSubItems(true);
      axios
        .get(`${API_BASE_URL}/api/s1/subitems/names?item_id=${selectedItemId}`)
        .then((response) => {
          const subItemsData = Array.isArray(response.data?.parentNames)
            ? response.data.parentNames.map((item) => ({
                id: item.parent_id,
                name: item.parent_name,
              }))
            : [];
          setSubItems(subItemsData);

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
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error",
            text: "Failed to load subitems.",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          });
        })
        .finally(() => setIsLoadingSubItems(false));
    } else {
      setSubItems([]);
      setSubItemNames([]);
      setSelectedSubItemId(null);
    }
  }, [selectedItemId]);

  // Fetch third-tier names when a sub-item is selected
  useEffect(() => {
    if (selectedSubItemId) {
      setIsLoadingNames(true);
      axios
        .get(
          `${API_BASE_URL}/api/s1/subitems/names?parent_id=${selectedSubItemId}`
        )
        .then((response) => {
          const namesData = Array.isArray(response.data.names)
            ? response.data.names.map((name, index) => ({
                id: `${selectedSubItemId}-${index}`,
                name,
              }))
            : [];
          setSubItemNames(namesData);

          if (namesData.length === 0) {
            Swal.fire({
              position: "top-end",
              icon: "info",
              title: "No Names",
              text: "No names available for this sub-item.",
              showConfirmButton: false,
              timer: 1000,
              toast: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching sub-item names:", error);
          setSubItemNames([]);
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
      setSubItemNames([]);
    }
  }, [selectedSubItemId]);

  // Form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        item_id: selectedItemId,
        sub_item_id: selectedSubItemId,
      };
      await axios.post(`${API_BASE_URL}/api/v1/inventory`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: "Inventory item created successfully!",
        showConfirmButton: false,
        timer: 1000,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
      });

      resetForm();
      setSelectedItemId(null);
      setSelectedSubItemId(null);
      setSubItems([]);
      setSubItemNames([]);
      navigate("/list-inventory");
    } catch (error) {
      let errorMessage = "There was an error creating the inventory item.";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Unauthorized: Please log in again.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: false,
        timer: 1000,
        toast: true,
        background: "#fff",
        customClass: { popup: "small-swal" },
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
              { name: "Create Inventory" },
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
            initialValues={{
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
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form className={styles.formContent}>
                <Grid container spacing={3}>
                  {/* Date */}
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
                      FormHelperTextProps={{ className: styles.helperText }}
                    />
                  </Grid>

                  {/* Invoice No */}
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
                      FormHelperTextProps={{ className: styles.helperText }}
                    />
                  </Grid>

                  {/* Quantity */}
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
                      FormHelperTextProps={{ className: styles.helperText }}
                    />
                  </Grid>

                  {/* Unit */}
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                     
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
                      FormHelperTextProps={{ className: styles.helperText }}
                    >
                      {units.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Price */}
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
                      FormHelperTextProps={{ className: styles.helperText }}
                    />
                  </Grid>

                  {/* Remarks */}
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
                    />
                  </Grid>

                  {/* Manufacturer */}
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
                    />
                  </Grid>

                  {/* Main Item */}
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      name="item"
                      value={values.item}
                      onChange={(e) => {
                        handleChange(e);
                        const selectedItem = items.find(
                          (item) => item.name === e.target.value
                        );
                        setSelectedItemId(
                          selectedItem ? selectedItem.id : null
                        );
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
                      FormHelperTextProps={{ className: styles.helperText }}
                    >
                      <option value="">Select an item</option>
                      {items.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Sub Item */}
                  {selectedItemId && (
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                      
                        name="sub_item"
                        value={values.sub_item}
                        onChange={(e) => {
                          handleChange(e);
                          const selectedSubItem = subItems.find(
                            (subItem) => subItem.name === e.target.value
                          );
                          setSelectedSubItemId(
                            selectedSubItem ? selectedSubItem.id : null
                          );
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
                        FormHelperTextProps={{ className: styles.helperText }}
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

                  {/* Sub Item Name */}
                  {selectedSubItemId && (
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                       
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
                        error={
                          touched.sub_item_name && Boolean(errors.sub_item_name)
                        }
                        helperText={
                          touched.sub_item_name && errors.sub_item_name
                        }
                        FormHelperTextProps={{ className: styles.helperText }}
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

                {/* Submit / Cancel Buttons */}
                <Box
                  className={`${styles.buttonContainer} mt-4`}
                  sx={{ display: "flex", gap: 2 }}
                >
                  <ButtonComp
                    text="Submit"
                    type="submit"
                    sx={{ flexGrow: 1 }}
                  />
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
