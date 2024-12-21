import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Mainlayout from "../../Layouts/Mainlayout";
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Container, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";

const UpdateBookForm = () => {
  const [name, setName] = useState('');
  const [publishedyear, setPublishedYear] = useState('');
  const [quantity, setQuantity] = useState('');
  const [class_name, setClassName] = useState('');
  const [masterData, setMasterData] = useState([]); // State for master data
  const navigate = useNavigate();
  const { id } = useParams(); // Get the book ID from the URL params for updating

  useEffect(() => {
    // Fetching master data for the "Choose Class" select input
    axios.get(`${ API_BASE_URL }/api/class`)
      .then((response) => {
        setMasterData(response.data); // Set the master data from the API response
      })
      .catch((error) => {
        console.error('Error fetching master data:', error);
      });

    // Fetching the existing book data for updating
    axios.get(`${ API_BASE_URL }/api/${id}`)
      .then((response) => {
        const book = response.data;
        setName(book.name);
        setPublishedYear(book.publishedyear);
        setQuantity(book.quantity);
        setClassName(book.class_name);
      })
      .catch((error) => {
        console.error('Error fetching book data:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookData = { name, publishedyear, quantity, class_name };

    // Sending the PUT request to update the book data
    axios.put(`${ API_BASE_URL }/api/${id}`, bookData)
      .then((response) => {
        // Success: Show success alert and redirect
        Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Success!",
                  text: `book "${name}" updated successfully!`,
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  toast: true,
                  background: "#fff",
                  customClass: {
                    popup: "small-swal",
                  },
                }).then(() => {
          navigate('/book'); // Redirect after the user clicks OK
        });
      })
      .catch((error) => {
        // Error: Show error alert
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue updating the book. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error updating book:', error);
      });
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div role="presentation">
          <Breadcrumb
            data={[{ name: "Book", link: "/book" }, { name: "Update Book" }]}
          />
        </div>
      </div>
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
            Update Book
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name of the Book"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              label="Published Year"
              value={publishedyear}
              onChange={(e) => setPublishedYear(e.target.value)}
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Choose Class</InputLabel>
              <Select
                value={class_name}
                onChange={(e) => setClassName(e.target.value)}
                label="Select Class"
                required
                size="small"
                InputProps={{
                  style: { fontSize: "14px" }, // Adjust input text size
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" }, // Adjust label size
                }}
              >
                {masterData.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                onClick={() => navigate("/book")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default UpdateBookForm;
