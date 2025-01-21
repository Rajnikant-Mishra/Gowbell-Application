import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
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
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import axios from "axios";

const Menu = () => {
  const { id } = useParams(); // Get the menu ID from the URL
  const [menu, setMenu] = useState({
    title: "",
    link: "",
    enable: true,
    visible: true,
    image: "",
    sequence: 0,
    parent_id: "",
    updated_by: null,
  });

  const [parentMenus, setParentMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch parent menu options and current menu data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch parent menus
        const parentResponse = await axios.get(`${API_BASE_URL}/api/m1/menu`);
        setParentMenus(parentResponse.data);

        // Fetch current menu details
        if (id) {
          const menuResponse = await axios.get(
            `${API_BASE_URL}/api/m1/menu/${id}`
          );
          setMenu(menuResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios({
        method: id ? "PUT" : "POST", // Use PUT for update and POST for create
        url: `${API_BASE_URL}/api/m1/menu${id ? `/${id}` : ""}`,
        data: menu,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: id
            ? "Menu updated successfully!"
            : "Menu created successfully!",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/menu-list");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
            { name: "Menu", link: "/menu-list" },
            { name: id ? "Edit Menu" : "Create Menu" },
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
          <Typography variant="h4" align="center" gutterBottom>
            {id ? "Edit Menu" : "Create Menu"}
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
                <FormControl fullWidth size="small">
                  <InputLabel>Image</InputLabel>
                  <Select
                    name="image"
                    value={menu.image}
                    onChange={handleChange}
                  >
                    <MenuItem value="UilFileInfoAlt">
                      <UilFileInfoAlt />
                    </MenuItem>
                    <MenuItem value="UilArchiveAlt">
                      <UilArchiveAlt />
                    </MenuItem>
                    <MenuItem value="UilUniversity">
                      <UilUniversity />
                    </MenuItem>
                    <MenuItem value="UilBookReader">
                      <UilBookReader />
                    </MenuItem>
                    <MenuItem value="UilTruck">
                      <UilTruck />
                    </MenuItem>
                    <MenuItem value="UilSignalAlt3">
                      <UilSignalAlt3 />
                    </MenuItem>
                    <MenuItem value="UilUsersAlt">
                      <UilUsersAlt />
                    </MenuItem>
                    <MenuItem value="UilTrophy">
                      <UilTrophy />
                    </MenuItem>
                    <MenuItem value="UilBookOpen">
                      <UilBookOpen />
                    </MenuItem>
                    <MenuItem value="UilBars">
                      <UilBars />
                    </MenuItem>
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
                >
                  <MenuItem value="">None</MenuItem>
                  {parentMenus.map((parent) => (
                    <MenuItem key={parent.id} value={parent.id}>
                      {parent.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <ButtonComp text="Submit" type="submit" disabled={isLoading} />
              <ButtonComp
                text="Cancel"
                type="button"
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
