import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import axios from "axios";

const UserUpdateForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // To get user ID from the URL

  useEffect(() => {
    // Fetching master data for the "Role" select input
    axios
      .get(`${API_BASE_URL}/api/r1/role`)
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching master data:", error);
      });

    // Fetch user data for the given ID
    if (id) {
      axios
        .get(`${API_BASE_URL}/api/u1/users/${id}`)
        .then((response) => {
          setFormData(response.data); // Set user data to formData
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Passwords do not match",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        background: "#fff",
        customClass: {
          popup: "small-swal",
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/u1/users/${id}`, {
        method: "PUT", // Change method to PUT for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User updated successfully!",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
        navigate("/user-list");
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Something went wrong!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An error occurred!",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[{ name: "User", link: "/user-list" }, { name: "Update User" }]}
        />
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 7,
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Update User
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  type="email"
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                >
                  {roles && roles.length > 0 ? (
                    roles.map((role) => (
                      <MenuItem key={role.id} value={role.role_name}>
                        {role.role_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No roles available</MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  type="password"
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Confirm Password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  fullWidth
                  type="password"
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <ButtonComp
                text="Update"
                type="submit"
                disabled={isLoading}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/user-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UserUpdateForm;
