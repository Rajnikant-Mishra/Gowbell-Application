import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Card, CardContent, Typography, Box, MenuItem } from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const UpdateOmrcoForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Retrieve the ID from the route parameters
    const [formData, setFormData] = useState({
        school_name: "",
        class_from: "",
        class_to: "",
        omr: "",
    });

    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [omrOptions, setOmrOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dropdown data (schools, classes, omr options) and existing OMR entry
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [schoolsRes, classesRes, omrOptionsRes] = await Promise.all([
                    fetch("http://localhost:5000/api/get/schools"),
                    fetch("http://localhost:5000/api/master"),
                    fetch("http://localhost:5000/api/get/omr"),
                ]);

                const [schoolsData, classesData, omrOptionsData] = await Promise.all([
                    schoolsRes.json(),
                    classesRes.json(),
                    omrOptionsRes.json(),
                ]);

                setSchools(schoolsData);
                setClasses(classesData);
                setOmrOptions(omrOptionsData);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };

        const fetchOmrEntry = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/co/omr/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data); // Prefill form data with existing OMR entry
                } else {
                    throw new Error("Failed to fetch OMR entry data");
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load OMR data. Please try again.",
                });
                console.error("Error fetching OMR entry:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDropdownData();
        fetchOmrEntry();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/co/omr/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "OMR entry updated successfully!",
                    timer: 2000,
                });

                navigate("/omr-list"); // Redirect to the OMR list
            } else {
                throw new Error("Failed to update OMR entry");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to update OMR entry. Please try again.",
                timer: 2000,
            });
            console.error("Error updating OMR entry:", error);
        }
    };

    if (loading) {
        return (
            <Mainlayout>
                <Container maxWidth="sm" style={{ marginTop: "20px" }}>
                    <Typography align="center" variant="h6">
                        Loading...
                    </Typography>
                </Container>
            </Mainlayout>
        );
    }

    return (
        <Mainlayout>
            <Container maxWidth="sm" style={{ marginTop: "20px" }}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" component="div" align="center" gutterBottom>
                            Update OMR Entry
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    select
                                    fullWidth
                                    label="School Name"
                                    name="school_name"
                                    value={formData.school_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                >
                                    {schools.map((school) => (
                                        <MenuItem key={school.id} value={school.school_name}>
                                            {school.school_name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    fullWidth
                                    label="Class From"
                                    name="class_from"
                                    value={formData.class_from}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                >
                                    {classes.map((cls) => (
                                        <MenuItem key={cls.id} value={cls.name}>
                                            {cls.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    fullWidth
                                    label="Class To"
                                    name="class_to"
                                    value={formData.class_to}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                >
                                    {classes.map((cls) => (
                                        <MenuItem key={cls.id} value={cls.name}>
                                            {cls.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    fullWidth
                                    label="OMR Details"
                                    name="omr"
                                    value={formData.omr}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                >
                                    {omrOptions.map((omr) => (
                                        <MenuItem key={omr.id} value={omr.title}>
                                            {omr.title}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ backgroundColor: 'green', color: 'white' }}
                                    fullWidth
                                >
                                    Update
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Mainlayout>
    );
};

export default UpdateOmrcoForm;
