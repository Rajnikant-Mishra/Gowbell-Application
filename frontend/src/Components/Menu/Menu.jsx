import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Grid,
  MenuItem, // Add this import
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import axios from "axios";

const Menu = () => {
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

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu({
      ...menu,
      [name]: value, // Store the selected value for each input field
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/m1/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menu), // Sending the menu data as JSON
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Menu created successfully!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
        navigate("/menu-list");
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
          data={[{ name: "Menu", link: "/menu-list" }, { name: "Create Menu" }]}
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
            Create Menu
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
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
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
                    style: { fontSize: "14px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
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
                  label="Enable"
                  name="enable"
                  value={menu.enable}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
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
                text="Submit"
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

export default Menu;
