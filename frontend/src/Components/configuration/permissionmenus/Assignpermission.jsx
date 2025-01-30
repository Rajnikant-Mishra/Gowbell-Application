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
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
const Menu = () => {
  const [menu, setMenu] = useState({
    menu_id: "",
    role_ids: [],
  });

  const [menuOptions, setMenuOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch menu options
  useEffect(() => {
    const fetchMenuOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/m1/menu`);
        const data = await response.json();
        setMenuOptions(data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch menu options", "error");
      }
    };

    fetchMenuOptions();
  }, []);

  // Fetch role options
  useEffect(() => {
    const fetchRoleOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/r1/role`);
        const data = await response.json();
        setRoleOptions(data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch role options", "error");
      }
    };

    fetchRoleOptions();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prev) => ({
      ...prev,
      [name]: name === "role_ids" ? value : value,
    }));
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
                title: "Success!",
                text: `Menu permission granted!`,
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                toast: true,
                background: "#fff",
                customClass: {
                  popup: "small-swal",
                },
              });
        navigate("/permissions-list");
      } else {
        Swal.fire("Error", data.error || "Failed to assign menu", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Mainlayout>
      <Breadcrumb
        data={[
          { name: "Manage Menu Permission", link: "/permissions-list" },
          { name: "Create Menu Permission" },
        ]}
      />
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
              <Grid item xs={12}>
                <TextField
                  select
                  label="Menu"
                  name="menu_id"
                  value={menu.menu_id}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                >
                  {menuOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                     {option.parent_id === null ? (
                        option.title
                      ) : (
                        <ul >
                          <li>{option.title}</li>
                        </ul>
                      )}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Roles</InputLabel>
                  <Select
                    name="role_ids"
                    value={menu.role_ids}
                    onChange={handleChange}
                    multiple
                    input={<OutlinedInput label="Roles" />}
                    size="small"
                    renderValue={(selected) =>
                      selected.map((id) => (
                        <Chip
                          key={id}
                          label={
                            roleOptions.find((role) => role.id === id)?.role_name
                          }
                        />
                      ))
                    }
                  >
                    {roleOptions.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.role_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <ButtonComp text="Submit" type="submit" disabled={isLoading} />
              <ButtonComp
                text="Cancel"
                onClick={() => navigate("/permissions-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default Menu;
