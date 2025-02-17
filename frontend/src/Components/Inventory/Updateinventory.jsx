import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Grid } from "@mui/material";
import styles from "./inventory.module.css";
import Swal from "sweetalert2";
import TextInput from "../School/CommonComp/TextInput";
import Mainlayout from "../Layouts/Mainlayout";
import { useNavigate, useParams } from "react-router-dom";
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

const helperTextStyle = {
  fontSize: "0.7rem",
  color: "red",
};

export default function InventoryUpdateForm() {
  const [initialValues, setInitialValues] = useState({
    date: "",
    created_by: "",
    invoice_no: "",
    item: "",
    quantity: "",
    unit: "",
    price: "",
    remarks: "",
    manufacturer_details: "",
  });
  const [selectedItem, setSelectedItem] = useState("");
  const [items, setItems] = useState([]);
  const { id } = useParams(); // Get the inventory ID from the route
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the data for the given ID
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/inventory/${id}`
        );
        const data = response.data;

        // Format the date field
        const formattedDate = data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "";

        setInitialValues({
          ...data,
          date: formattedDate, // Set the formatted date here
        });
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        Swal.fire("Error", "Unable to fetch inventory data.", "error");
      }
    };

    fetchInventoryData();
  }, [id]);

  useEffect(() => {
    // Fetch data from API
    axios
      .get(`${API_BASE_URL}/api/attributes/item/cvalues`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (values) => {
    try {
      await axios.put(`${API_BASE_URL}/api/v1/inventory/${id}`, values);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: `Inventory item updated successfully!`,
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
      console.error("Error updating inventory data:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Update failed!",
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

  const units = [
    { value: "", name: "--Unit--" },
    { value: "numbers", name: "Numbers" },
    { value: "kg", name: "Kg" },
    { value: "packs", name: "Packs" },
  ];

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Inventory", link: "/list-inventory" },
            { name: "Update Inventory" },
          ]}
        />
      </div>
      <Box className={`${styles.formContainer} container-fluid pt-5`}>
        <div className={`${styles.formBox}`}>
          <Typography className={`${styles.formTitle} mb-4`}>
            Update Inventory
          </Typography>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                      error={touched.date && Boolean(errors.date)}
                      helperText={touched.date && errors.date}
                      FormHelperTextProps={{ style: helperTextStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Created By"
                      name="created_by"
                      value={values.created_by}
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
                      error={touched.created_by && Boolean(errors.created_by)}
                      helperText={touched.created_by && errors.created_by}
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
                      select
                      name="item"
                      size="small"
                      value={selectedItem}
                      onChange={(e) => {
                        setSelectedItem(e.target.value);
                        handleChange(e);
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
                        <option
                          key={option.value || option.id}
                          value={option.value || option.id}
                        >
                          {option.cvalue || option.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Quantity"
                      name="quantity"
                      value={values.quantity}
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
                      type="number"
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                      FormHelperTextProps={{ style: helperTextStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      name="unit"
                      value={values.unit}
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
                </Grid>
                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  <ButtonComp text="Update" type="submit" />
                  <ButtonComp
                    text="Cancel"
                    type="button"
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
