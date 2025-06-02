import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Box,
  Container,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";

const UpdateRoleForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    // permissions: [], // Uncomment if permissions are needed
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get item ID from URL

  // Fetch item data when component mounts
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/t1/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || "",
            // permissions: data.permissions ? JSON.parse(data.permissions) : [], // Uncomment if permissions are needed
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: "Failed to fetch item data.",
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
          text: "An unexpected error occurred while fetching item data.",
          icon: "error",
        });
      }
    };

    fetchItem();
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setError("Only letters and spaces are allowed in the Item field.");
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/t1/${id}`, {
        method: "PUT", // Use PUT or PATCH based on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          // permissions: JSON.stringify(formData.permissions), // Uncomment if permissions are needed
        }),
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Item updated successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/item-list");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: errorData.message || "Failed to update item.",
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
            { name: "Item", link: "/item-list" },
            { name: "Update Item" },
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
            Update Item
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Item Name Input */}
            <TextField
              label="Item"
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
              <ButtonComp text="Update" type="submit" sx={{ flexGrow: 1 }} />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/item-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateRoleForm;