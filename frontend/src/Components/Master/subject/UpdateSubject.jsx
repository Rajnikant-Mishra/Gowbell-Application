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
  FormHelperText,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const UpdateCountry = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/subject/${id}`)
      .then((response) => {
        setName(response.data.name);
        setStatus(response.data.status);
      })
      .catch((error) => {
        console.error("Error fetching class:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`${API_BASE_URL}/api/subject/${id}`, { name, status })
      .then((response) => {
        // Success: Show success alert and redirect
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Subject "${name}" updated successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/subject"); // Redirect after SweetAlert
        });
      })
      .catch((error) => {
        // Error handling for duplicate subject name
        if (
          error.response &&
          error.response.data.error === "Subject with this name already exists"
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: `Subject name "${name}" already exists.`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          });
        } else {
          // General error handling
          Swal.fire({
            title: "Error!",
            text: "There was an issue updating the subject. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        console.error("Error updating subject:", error);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Subject", link: "/subject" },
              { name: "Update Subject" },
            ]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 3, padding: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Update Subject
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label=" subject Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                    <FormHelperText>Select the country status</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    className={` gap-2 mt-4`}
                    sx={{ display: "flex", gap: 2 }}
                  >
                    <ButtonComp
                      text="Submit"
                      type="submit"
                      disabled={false}
                      sx={{ flexGrow: 1 }}
                    />
                    <ButtonComp
                      text="Cancel"
                      type="button"
                      sx={{ flexGrow: 1 }}
                      onClick={() => navigate("/subject")}
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

export default UpdateCountry;
