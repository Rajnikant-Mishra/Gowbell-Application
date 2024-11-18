import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Card,
  CardContent,
} from '@mui/material';

const UpdateCountry = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/areas/${id}`)
      .then((response) => {
        setName(response.data.name);
        setStatus(response.data.status);
      })
      .catch((error) => {
        console.error("Error fetching Area :", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/api/areas/${id}`, { name, status })
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: "Area   updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/area"); // Redirect after SweetAlert
        });
      })
      .catch((error) => {
        console.error("Error updating Area  :", error);
      });
  };

  return (
    <Mainlayout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom align="center">
          Update Area
        </Typography>
        
        <Card sx={{ boxShadow: 3, padding: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Area  Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                    <FormHelperText>Select the State  status</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    Update Area
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Mainlayout>
  );
};

export default UpdateCountry;
