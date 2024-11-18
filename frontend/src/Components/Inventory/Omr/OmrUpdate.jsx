import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';

const UpdateOMRForm = () => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // The OMR ID passed in the route URL for updating
  
  useEffect(() => {
    // Fetch existing OMR entry data for editing
    axios.get(`http://localhost:5000/api/omr/${id}`)
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
    axios.put(`http://localhost:5000/api/omr/${id}`, omrData)
      .then((response) => {
        Swal.fire({
          title: 'Success!',
          text: `OMR "${title}" updated successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
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
            />
            <TextField
              fullWidth
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              variant="outlined"
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 3 }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateOMRForm;
