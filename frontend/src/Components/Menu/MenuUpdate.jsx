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

const UpdateMenuForm = () => {
  const { id } = useParams(); // Get the menu item ID from URL
  const [menu, setMenu] = useState({
    title: "",
    link: "",
    enable: true,
    visible: true,
    image: "",
    sequence: 0,
    updated_by: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch the existing menu data when the component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/m1/menu/${id}`);
        if (response.data) {
          // Ensure boolean values for enable and visible
          setMenu({
            ...response.data,
            enable:
              response.data.enable === true || response.data.enable === "true",
            visible:
              response.data.visible === true ||
              response.data.visible === "true",
          });
        }
      } catch (error) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to fetch menu data",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    fetchMenuData();
  }, [id]);

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setMenu({
      ...menu,
      [name]:
        name === "enable" || name === "visible" ? value === "true" : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/m1/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menu), // Sending the updated menu data as JSON
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Menu updated successfully!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
        navigate("/menu-list"); // Navigate to the menu list after successful update
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: data.message || "Something went wrong!",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "small-swal",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "An error occurred!",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "small-swal",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[{ name: "Menu", link: "/menu-list" }, { name: "Update Menu" }]}
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
            Update Menu
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Title"
                  name="title"
                  value={menu.title}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Link"
                  name="link"
                  value={menu.link}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Sequence"
                  name="sequence"
                  value={menu.sequence}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  type="number"
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Enable"
                  name="enable"
                  value={menu.enable}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                >
                  <MenuItem value={true}>Enabled</MenuItem>
                  <MenuItem value={false}>Disabled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Visible"
                  name="visible"
                  value={menu.visible}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                >
                  <MenuItem value={true}>Visible</MenuItem>
                  <MenuItem value={false}>Hidden</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Image"
                  name="image"
                  value={menu.image}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
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
                onClick={() => navigate("/menu-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateMenuForm;
