import React, { useState } from "react";
import { Box, Typography, TextField, Grid } from "@mui/material";
import styles from "./inventory.module.css";
import Swal from "sweetalert2";
import TextInput from "../School/CommonComp/TextInput";
import Mainlayout from "../Layouts/Mainlayout";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../Common-Css/Swallfire.css";

// Validation schema using Yup
const validationSchema = Yup.object({
  item_id: Yup.string().required("Item ID is required"),
  date: Yup.date().required("Date is required"),
  created_by: Yup.string().required("Created By is required"),
  item: Yup.string().required("Item Name is required"),
  quantity: Yup.number()
    .positive()
    .integer()
    .required("Item Quantity is required"),
  unit: Yup.string().required("Unit is required"),
  remarks: Yup.string().optional(),
});

//message css
const helperTextStyle = {
  fontSize: "0.7rem", // Custom font size
  color: "red", // Custom color for error messages
};


export default function BookForm() {
  const [formData, setFormData] = useState({
    item_id: "",
    date: "",
    created_by: "",
    item: "",
    quantity: "",
    remarks: "",
    unit: "",
  });

  const itemOptions = [
    { value: "", name: "--Item Name--" },
    { value: "rubber", name: "rubber" },
    { value: "pencil", name: "pencil" },
    { value: "pencil box", name: "pencil box" },
    { value: "pen", name: "pen" },
    { value: "water bottle", name: "water bottle" },
    { value: "tiffin box", name: "tiffin box" },
  ];

  const units = [
    { value: "", name: "--Unit--" },
    { value: "numbers", name: "Numbers" },
    { value: "kg", name: "Kg" },
    { value: "packs", name: "Packs" },
  ];



  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/inventory`,
        values
      );
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
      navigate("/list-inventory"); // Redirect to the list inventory page after successful submission
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: `There was an error creating the inventory item.`,
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
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form className={styles.formContent}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      label="Item Id"
                      name="item_id"
                      value={values.item_id}
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
                      error={touched.item_id && errors.item_id}
                      helperText={touched.item_id && errors.item_id}

                      FormHelperTextProps={{
                        style: helperTextStyle, // Apply centralized style
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
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
                        style: helperTextStyle, // Apply centralized style
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Created By"
                      name="created_by"
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
                      value={values.created_by}
                      onChange={handleChange}
                      type="text"
                      fullWidth
                      error={touched.created_by && errors.created_by}
                      helperText={touched.created_by && errors.created_by}
                      FormHelperTextProps={{
                        style: helperTextStyle, // Apply centralized style
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      select
                      name="item"
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
                      value={values.item}
                      onChange={handleChange}
                      fullWidth
                      SelectProps={{ native: true }}
                      error={touched.item && errors.item}
                      helperText={touched.item && errors.item}
                      FormHelperTextProps={{
                        style: helperTextStyle, 
                      }}
                    >
                      {itemOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
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
                        style: helperTextStyle, // Apply centralized style
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      select
                      name="unit"
                      size="small"
                      value={values.unit}
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
                      onChange={handleChange}
                      fullWidth
                      SelectProps={{ native: true }}
                      error={touched.unit && errors.unit}
                      helperText={touched.unit && errors.unit}
                      FormHelperTextProps={{
                        style: helperTextStyle, // Apply centralized style
                      }}
                    >
                      {units.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextInput
                      label="Remarks"
                      name="remarks"
                      value={values.remarks}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={1}
                    />
                  </Grid>
                </Grid>
                <Box
                  className={`${styles.buttonContainer} gap-2 mt-4`}
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
