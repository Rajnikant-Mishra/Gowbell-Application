import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";
import Mainlayout from "../../Layouts/Mainlayout";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import Breadcrumb from "../../CommonButton/Breadcrumb";

function App() {
  const [formData, setFormData] = useState({
    center_name: "",
    center_code: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🧩 Step 1: Frontend validation
    const name = formData.center_name.trim();

    if (!name) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Center name is required!",
      });
      return;
    }

    try {
      // 🧠 Step 2: Send request to backend
      const response = await fetch(`${API_BASE_URL}/api/center/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ center_name: name }),
      });

      // 🧩 Step 3: Parse JSON safely
      const data = await response.json().catch(() => ({}));

      // 🧠 Step 4: Handle backend response
      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Center "${name}" created successfully.`,
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });

        // Reset form
        setFormData({ center_name: "", center_code: "" });
      } else {
        // Backend error message
        const message =
          data?.message ||
          (response.status === 400
            ? "Invalid data provided."
            : "Something went wrong!");

        Swal.fire({
          icon: "error",
          text: message,
        });
      }
    } catch (error) {
      // 🧩 Step 5: Network / unexpected error
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server!",
      });
    }
  };

  return (
    <Mainlayout>
      <div role="presentation">
        <Breadcrumb
          data={[{ name: "Center", link: "/center-list" }, { name: "Create Center" }]}
        />
      </div>
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create New Center
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
                InputProps={{
                  style: { fontSize: "14px" },
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
                required
              />
              <Box className="gap-2 mt-4" sx={{ display: "flex", gap: 2 }}>
                <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
                <ButtonComp
                  text="Cancel"
                  type="button"
                  sx={{ flexGrow: 1 }}
                  onClick={() => navigate("/center-list")}
                />
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
}

export default App;
