import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
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
import Breadcrumb from "../../CommonButton/Breadcrumb";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";

const Menu = () => {
  const [menu, setMenu] = useState({
    menuId: "",
    roleId: "",
  });

  const [menuOptions, setMenuOptions] = useState([]); // State to store menu options
  const [roleOptions, setRoleOptions] = useState([]); // State to store role options
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/m1/menu`);
        if (response.ok) {
          const data = await response.json();
          setMenuOptions(data); // Update menu options with fetched data
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to load menu options",
            text: "Please try again later.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "An error occurred!",
          text: "Unable to fetch menu data.",
        });
      }
    };

    fetchMenuOptions();
  }, []);

  // Fetch role data from API
  useEffect(() => {
    const fetchRoleOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/u1/users`);
        if (response.ok) {
          const data = await response.json();
          setRoleOptions(data); // Update role options with fetched data
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to load role options",
            text: "Please try again later.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "An error occurred!",
          text: "Unable to fetch role data.",
        });
      }
    };

    fetchRoleOptions();
  }, []);

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu({
      ...menu,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/permission/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menu),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Menu created successfully!",
          showConfirmButton: false,
          timer: 1000,
          toast: true,
        });
        navigate("/client-list");
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: data.message || "Something went wrong!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
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
          data={[
            { name: "Manage-menu-permission", link: "/client-list" },
            { name: "Create-menu-permission" },
          ]}
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
          <Typography variant="h5" align="center" gutterBottom>
            Create Menu Permission
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Menu"
                  name="menuId"
                  value={menu.menuId}
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
                  {menuOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Role"
                  name="roleId"
                  value={menu.roleId}
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
                  {roleOptions.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.role}
                    </MenuItem>
                  ))}
                </TextField>
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
                onClick={() => navigate("/client-menu")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default Menu;
