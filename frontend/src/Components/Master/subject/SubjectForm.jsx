import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Container, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';  // Import SweetAlert2

const CreateCountry = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending the POST request to the server
    axios.post('http://localhost:5000/api/subject', { name, status })
      .then((response) => {
        // Success: Show success alert and redirect
        Swal.fire({
          title: 'Success!',
          text: `subject"${name}" created successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/subject'); // Redirect after the user clicks OK
        });
      })
      .catch((error) => {
        // Error: Show error alert
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue creating the subject . Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error creating subject:', error);
      });
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create New Subject
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="subject Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
              margin="normal"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
                variant="outlined"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 3 }}
            >
              Create
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateCountry;
