import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  Stack,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import Breadcrumb from "../../CommonButton/Breadcrumb";

function UpdateCenter() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get center ID from route params

  const [formData, setFormData] = useState({
    center_name: "",
    center_code: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // 🧠 Fetch center data by ID
  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/center/${id}`);
        if (!response.ok) throw new Error("Failed to fetch center data");

        const data = await response.json();
        setFormData({
          center_name: data.center_name || "",
          center_code: data.center_code || "",
          address: data.address || "",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to fetch center details!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCenterData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { center_name, center_code, address } = formData;

    if (!center_name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Center name is required!",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/center/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          center_name: center_name.trim(),
          center_code: center_code.trim(),
          address: address.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Updated!",
          text: `Center "${center_name}" updated successfully.`,
          showConfirmButton: false,
          timer: 1200,
          toast: true,
        });

        setTimeout(() => navigate("/center-list"), 1200);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data?.message || "Failed to update center!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server!",
      });
    }
  };

  if (loading) {
    return (
      <Mainlayout>
        <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
          <Typography variant="h6">Loading center data...</Typography>
        </Container>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      {/* Breadcrumb */}
      <div role="presentation">
        <Breadcrumb
          data={[
            { name: "Center", link: "/center-list" },
            { name: "Update Center" },
          ]}
        />
      </div>

      {/* Form */}
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Update Center
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Center Name"
                name="center_name"
                value={formData.center_name}
                onChange={handleChange}
                fullWidth
                size="small"
                InputProps={{ style: { fontSize: "14px" } }}
                InputLabelProps={{ style: { fontSize: "14px" } }}
                required
              />

              <TextField
                label="Center Code"
                name="center_code"
                value={formData.center_code}
                onChange={handleChange}
                fullWidth
                size="small"
                InputProps={{ style: { fontSize: "14px" } }}
                InputLabelProps={{ style: { fontSize: "14px" } }}
              />

              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                size="small"
                multiline
                minRows={2}
                InputProps={{ style: { fontSize: "14px" } }}
                InputLabelProps={{ style: { fontSize: "14px" } }}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <ButtonComp text="Update" type="submit" sx={{ flexGrow: 1 }} />
                <ButtonComp
                  text="Cancel"
                  type="button"
                  onClick={() => navigate("/center-list")}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
}

export default UpdateCenter;
