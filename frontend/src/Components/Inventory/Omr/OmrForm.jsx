import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";

const BookForm = () => {
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Title is required.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      Swal.fire({
        title: "Error!",
        text: "Quantity must be a positive numeric value.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsSubmitting(true);

    axios
      .post(`${API_BASE_URL}/api/get/omr`, {
        title,
        quantity: parseInt(quantity),
      })
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: `Omr updated successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          setTitle("");
          setQuantity("");
          navigate("/omr");
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "There was an issue creating the OMR. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error creating OMR:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "OMR", link: "/omr" }, { name: "Create OMR" }]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 13,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create OMR
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="OMR Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
              margin="normal"
              size="small"
              InputProps={{
                style: { fontSize: "14px" }, // Adjust input text size
              }}
              InputLabelProps={{
                style: { fontSize: "14px" }, // Adjust label size
              }} // Optional: Limit input length
            />
            <TextField
              fullWidth
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              required
              variant="outlined"
              margin="normal"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 6,
              }} // Optional: Mobile-friendly numeric input with max length
              size="small"
              InputProps={{
                style: { fontSize: "14px" }, // Adjust input text size
              }}
              InputLabelProps={{
                style: { fontSize: "14px" }, // Adjust label size
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ backgroundColor: "#8fd14f", marginTop: 3 }}
              disabled={isSubmitting} // Disable button when submitting
            >
              {isSubmitting ? "Submitting..." : "Create"}
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default BookForm;
