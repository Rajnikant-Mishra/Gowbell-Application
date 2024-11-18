import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Container, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';

const CreateCity = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const [countries, setCountries] = useState([]);  // List of countries
  const [states, setStates] = useState([]);        // List of states based on selected country
  const [districts, setDistricts] = useState([]);  // List of districts based on selected state
  const [selectedCountry, setSelectedCountry] = useState(''); // Country ID
  const [selectedState, setSelectedState] = useState('');     // State ID
  const [selectedDistrict, setSelectedDistrict] = useState(''); // District ID
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch countries on component mount
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
      // Fetch states when a country is selected
      axios.get(`http://localhost:5000/api/states?countryId=${selectedCountry}`)
        .then((response) => {
          setStates(response.data);
          setDistricts([]);  // Reset districts when country changes
          setSelectedState('');  // Reset selected state when country changes
          setSelectedDistrict(''); // Reset district when country changes
        })
        .catch((error) => {
          console.error('Error fetching states:', error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      // Fetch districts when a state is selected
      axios.get(`http://localhost:5000/api/districts?stateId=${selectedState}`)
        .then((response) => {
          setDistricts(response.data);
          setSelectedDistrict('');  // Reset selected district when state changes
        })
        .catch((error) => {
          console.error('Error fetching districts:', error);
        });
    }
  }, [selectedState]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending the POST request to the server
    axios.post('http://localhost:5000/api/cities/', {
      name,
      status,
      country_id: selectedCountry, // Send selected country ID
      state_id: selectedState,     // Send selected state ID
      district_id: selectedDistrict // Send selected district ID
    })
      .then((response) => {
        Swal.fire({
          title: 'Success!',
          text: `City "${name}" created successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/city'); // Redirect after the user clicks OK
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue creating the city. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error creating city:', error);
      });
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Create New City
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Country selection input */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Country</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)} // Update selected country ID
                label="Select Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* State selection input */}
            <FormControl fullWidth margin="normal" required disabled={!selectedCountry}>
              <InputLabel>Select State</InputLabel>
              <Select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)} // Update selected state ID
                label="Select State"
              >
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* District selection input */}
            <FormControl fullWidth margin="normal" required disabled={!selectedState}>
              <InputLabel>Select District</InputLabel>
              <Select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)} // Update selected district ID
                label="Select District"
              >
                {districts.map((district) => (
                  <MenuItem key={district.id} value={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="City Name"
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

export default CreateCity;
