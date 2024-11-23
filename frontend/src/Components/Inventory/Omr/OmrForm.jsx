import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
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
        title: 'Error!',
        text: 'Title is required.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Quantity must be a positive numeric value.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    setIsSubmitting(true);

    axios.post('http://localhost:5000/api/get/orm', { title, quantity: parseInt(quantity) })
      .then(() => {
        Swal.fire({
          title: 'Success!',
          text: `OMR "${title}" created successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          setTitle('');
          setQuantity('');
          navigate('/omr');
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue creating the OMR. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error creating OMR:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
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
              inputProps={{ maxLength: 100 }} // Optional: Limit input length
            />
            <TextField
              fullWidth
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              required
              variant="outlined"
              margin="normal"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }} // Optional: Mobile-friendly numeric input with max length
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 3 }}
              disabled={isSubmitting} // Disable button when submitting
            >
              {isSubmitting ? 'Submitting...' : 'Create'}
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default BookForm;
