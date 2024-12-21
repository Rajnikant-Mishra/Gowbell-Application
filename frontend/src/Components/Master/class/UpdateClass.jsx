import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const UpdateClass = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch class details on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/class/${id}`)
      .then((response) => {
        const { name, status } = response.data;
        setName(name);
        setStatus(status);
      })
      .catch((error) => {
        console.error("Error fetching class:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load class details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  }, [id]);

  // Handle form submission with duplicate check
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate class names
    axios
      .get(`${API_BASE_URL}/api/class?name=${name}`)
      .then((response) => {
        const isDuplicate = response.data.some(
          (item) => item.name === name && item.id !== id
        );

        if (isDuplicate) {
          Swal.fire({
            // title: "Duplicate Entry",
            // text: `A class with the name "${name}" already exists. Please choose another name.`,
            // icon: "error",
            // confirmButtonText: "OK",
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: `Class name "${name}" already exists.`,
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          });
          return;
        }

        // Proceed with update
        axios
          .put(`${API_BASE_URL}/api/class/${id}`, { name, status })
          .then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Success!",
              text: `Class "${name}" updated successfully!`,
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
            }).then(() => {
              navigate("/class");
            });
          })
          .catch((error) => {
            console.error("Error updating class:", error);
            Swal.fire({
              title: "Error",
              text: "There was an issue updating the class. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      })
      .catch((error) => {
        console.error("Error checking for duplicates:", error);
        Swal.fire({
          title: "Error",
          text: "Could not validate the class name. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[{ name: "Class", link: "/class" }, { name: "Update Class" }]}
        />
      </div>
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: 3,
            padding: 3,
            marginTop: 7,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Update Class
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Class Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Status"
                      size="small"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                    <ButtonComp
                      text="Submit"
                      type="submit"
                      disabled={false}
                      sx={{ flexGrow: 1 }}
                    />
                    <ButtonComp
                      text="Cancel"
                      type="button"
                      onClick={() => navigate("/class")}
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Mainlayout>
  );
};

export default UpdateClass;
