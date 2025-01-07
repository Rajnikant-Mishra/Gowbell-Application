import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import {
  TextField,
  Box,
  Container,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../CommonButton/Breadcrumb";
import ButtonComp from "../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/Swallfire.css";

const CreateRoleForm = () => {
  const [formData, setFormData] = useState({
    role_name: "",
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field being changed is 'role_name'
    if (name === "role_name") {
      // Only allow alphabetic characters and spaces in 'role_name'
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setError("Only letters and spaces are allowed in the Role field.");
        return; // Do not update the state if the value is invalid
      } else {
        setError(""); // Clear error if the input is valid
      }
    }

    // Update the state for the valid input
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/r1/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Role created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/role-list");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          position: "top-end",
              icon: "error",
              title: "Error!",
              text: errorData.message || "Failed to create role.",
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
          data={[{ name: "Role", link: "/role-list" }, { name: "Create Role" }]}
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
            Create Role
          </Typography>
          <form onSubmit={handleSubmit}>
          <TextField
        label="Role"
        name="role_name"
        value={formData.role_name}
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
        error={!!error} // Set the error state to true if there's an error
        helperText={error} // Display the error message
      />
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <ButtonComp
                text="Submit"
                type="submit"
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/role-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateRoleForm;
