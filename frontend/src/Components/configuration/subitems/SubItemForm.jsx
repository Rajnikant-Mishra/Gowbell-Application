import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";

const CreateRoleForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    item_id: "",
  });
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch items from API on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/t1/items`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add Authorization header if needed, e.g., "Authorization": `Bearer ${token}`
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data); // Log API response
          // Adjust based on actual API response structure
          const itemsArray = data.data || data.items || data || [];
          setItems(itemsArray);
          console.log("Items State:", itemsArray); // Log items state
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: "Failed to fetch items.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: {
              popup: "small-swal",
            },
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error); // Log fetch error
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred while fetching items.",
          icon: "error",
        });
      }
    };

    fetchItems();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setError("Only letters and spaces are allowed in the Sub Item field.");
        return;
      } else {
        setError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.item_id) {
      setError("Please select an item.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/s1/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          item_id: formData.item_id,
        }),
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: `Sub Item created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/subitem-list");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: errorData.message || "Failed to create sub item.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "SubItem", link: "/subitem-list" }, // Fixed typo
            { name: "Create SubItem" },
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
            Create Sub Item
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Item Dropdown */}
            <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
              <InputLabel id="item-select-label" style={{ fontSize: "14px" }}>
                Item
              </InputLabel>
              <Select
                labelId="item-select-label"
                name="item_id"
                value={formData.item_id}
                onChange={handleChange}
                label="Item"
                style={{ fontSize: "14px" }}
              >
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sub Item Name Input */}
            <TextField
              label="Sub Item"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              InputProps={{ style: { fontSize: "14px" } }}
              InputLabelProps={{ style: { fontSize: "14px" } }}
              error={!!error}
              helperText={error}
            />

            {/* Submit & Cancel Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/subitem-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateRoleForm;