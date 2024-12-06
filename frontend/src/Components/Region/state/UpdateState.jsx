import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Container, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';

const UpdateState = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const { id } = useParams(); // Retrieve state ID from route parameters
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all countries for the dropdown
    axios.get('http://localhost:5000/api/countries/')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });

    // Fetch existing state data to pre-fill the form
    axios.get(`http://localhost:5000/api/states/${id}`)
      .then((response) => {
        const { name, status, country_id } = response.data;
        setName(name);
        setStatus(status);
        setSelectedCountry(country_id);
      })
      .catch((error) => {
        console.error('Error fetching state data:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const stateData = {
      name,
      status,
      country_id: selectedCountry,
    };

    axios.put(`http://localhost:5000/api/states/${id}`, stateData)
      .then((response) => {
        Swal.fire({
          title: 'Success!',
          text: `State "${name}" updated successfully.`,
          icon: 'success',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate('/state');
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue updating the State. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error updating State:', error);
      });
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Update State
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Country</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                label="Select Country"
                variant="outlined"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="State Name"
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
              sx={{
                backgroundColor: "#8fd14f",
                marginTop: 3,
              }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateState;
