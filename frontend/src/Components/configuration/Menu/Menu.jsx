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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import axios from "axios";
import {
  UilCreateDashboard,
  UilCompass,
  UilFileInfoAlt,
  UilArchiveAlt,
  UilUniversity,
  UilBookReader,
  UilTruck,
  UilSignalAlt3,
  UilUsersAlt,
  UilTrophy,
  UilBookOpen,
  UilBars,
} from "@iconscout/react-unicons";

const Menu = () => {
  const [menu, setMenu] = useState({
    title: "",
    link: "",
    enable: true,
    visible: true,
    image: "",
    sequence: 0,
    parent_id: "", // Add parent_id to track selected parent menu
    updated_by: null,
  });

  const [parentMenus, setParentMenus] = useState([]); // State to store parent menu options
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch parent menu options
  useEffect(() => {
    const fetchParentMenus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/m1/menu`);
        setParentMenus(response.data); // Assuming API returns an array of menus
      } catch (error) {
        console.error("Error fetching parent menus:", error);
      }
    };

    fetchParentMenus();
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
      const response = await fetch(`${API_BASE_URL}/api/m1/menu`, {
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
                <FormControl fullWidth size="small">
                  <InputLabel style={{ fontSize: "14px" }}>Image</InputLabel>
                  <Select
                    name="image"
                    value={menu.image}
                    onChange={handleChange}
                    style={{ fontSize: "14px" }} // Adjust dropdown text size
                    label="Image"
                  >
                    {/* Replace these with your actual options */}
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="UilCompass">
                      <UilCompass />
                    </MenuItem>
                  
                    <MenuItem value="UilFileInfoAlt"><UilFileInfoAlt/></MenuItem>
                    <MenuItem value="UilArchiveAlt"><UilArchiveAlt/></MenuItem>
                    <MenuItem value="UilUniversity"><UilUniversity/></MenuItem>
                    <MenuItem value="UilBookReader"><UilBookReader/></MenuItem>
                    <MenuItem value="UilTruck"><UilTruck/></MenuItem>
                    <MenuItem value="UilSignalAlt3"><UilSignalAlt3/></MenuItem>
                    <MenuItem value="UilUsersAlt"><UilUsersAlt/></MenuItem>
                    <MenuItem value="UilTrophy"><UilTrophy/></MenuItem>
                    <MenuItem value="UilBookOpen"><UilBookOpen/></MenuItem>
                    <MenuItem value="UilBars"><UilBars/></MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Parent Menu"
                  name="parent_id"
                  value={menu.parent_id}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputProps={{
                    style: { fontSize: "14px" }, // Adjust input text size
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" }, // Adjust label size
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {parentMenus.map((parent) => (
                    <MenuItem key={parent.id} value={parent.id}>
                      <ul>
                      <li key={parent.id}>{parent.title}</li>
                      </ul>
                       
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
