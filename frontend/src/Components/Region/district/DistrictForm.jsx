import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Container, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';

const CreateDistrict = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/countries/')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios.get(`http://localhost:5000/api/states?countryId=${selectedCountry}`)
        .then((response) => {
          setStates(response.data);
        })
        .catch((error) => {
          console.error('Error fetching states:', error);
        });
    }
  }, [selectedCountry]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const districtData = {
      name,
      status,
      country_id: selectedCountry,  // Store selected country ID as country_id
      state_id: selectedState       // Store selected state ID as state_id
    };

    axios.post('http://localhost:5000/api/districts/', districtData)
      .then((response) => {
        Swal.fire({
          title: 'Success!',
          text: `District "${name}" created successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/district');
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue creating the District. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error creating District:', error);
      });
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create New District
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Country</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                label="Select Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required disabled={!selectedCountry}>
              <InputLabel>Select State</InputLabel>
              <Select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                label="Select State"
              >
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="District Name"
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

export default CreateDistrict;
