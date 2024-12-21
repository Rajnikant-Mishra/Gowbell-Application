import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const UpdateOMRForm = () => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // The OMR ID passed in the route URL for updating
  
  useEffect(() => {
    // Fetch existing OMR entry data for editing
    axios.get(`${ API_BASE_URL }/api/get/omr/${id}`)
      .then((response) => {
        const { title, quantity } = response.data;
        setTitle(title);
        setQuantity(quantity);
      })
      .catch((error) => {
        console.error('Error fetching OMR data:', error);
      });
  }, [id]);


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const omrData = { title, quantity };

    // Send PUT request to update the OMR entry
    axios.put(`${ API_BASE_URL }/api/get/omr/${id}`, omrData)
      .then((response) => {
        Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Success!",
                  text: `omr "${name}" updated successfully!`,
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  toast: true,
                  background: "#fff",
                  customClass: {
                    popup: "small-swal",
                  },
                }).then(() => {
          navigate('/omr'); // Redirect after successful update
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue updating the OMR. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error updating OMR:', error);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "OMR", link: "/omr" }, { name: "Update OMR" }]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Update OMR
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
              }}
            />
            <TextField
              fullWidth
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              variant="outlined"
              margin="normal"
              size="small"
              InputProps={{
                style: { fontSize: "14px" }, // Adjust input text size
              }}
              InputLabelProps={{
                style: { fontSize: "14px" }, // Adjust label size
              }}
            />
            <Box className={` gap-2 mt-4`} sx={{ display: "flex", gap: 2 }}>
              <ButtonComp
                text="Submit"
                type="submit"
                disabled={false}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/omr")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateOMRForm;
