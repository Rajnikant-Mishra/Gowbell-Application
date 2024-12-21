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
      .get(`${API_BASE_URL}/api/affiliated/${id}`)
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
      .put(`${API_BASE_URL}/api/affiliated/${id}`, { name, status })
      .then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Affiliated "${name}" updated successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/affiliated"); // Redirect after SweetAlert
        });
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          // Handle specific backend error for duplicate name
          if (error.response.data.error.includes("already exists")) {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error!",
              text: `Affiliated name "${name}" already exists.`,
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              background: "#fff",
              customClass: {
                popup: "small-swal",
              },
            });
          } else {
            // Handle general error
            Swal.fire({
              title: "Error!",
              text: "There was an issue updating the affiliated. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          // If error response is not available, show a generic error message
          Swal.fire({
            title: "Error!",
            text: "There was an issue updating the affiliated. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        console.error("Error updating affiliated:", error);
      });
  };
  

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[
              { name: "Affiliated", link: "/affiliated" },
              { name: "Update Affiliated" },
            ]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3, marginTop: 7 }}>
          <Typography variant="h4" gutterBottom align="center">
            Update Affiliated
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label=" affiliated  Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    size="small"
                    InputProps={{
                      style: { fontSize: "14px" }, // Adjust input text size
                    }}
                    InputLabelProps={{
                      style: { fontSize: "14px" }, // Adjust label size
                    }}
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
                      InputProps={{
                        style: { fontSize: "14px" }, // Adjust input text size
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" }, // Adjust label size
                      }}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                   
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    className={` gap-2 mt-3`}
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
                      onClick={() => navigate("/affiliated")}
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
