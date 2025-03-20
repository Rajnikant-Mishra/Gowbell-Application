import React, { useState, useEffect } from "react";
import Mainlayout from "../../Layouts/Mainlayout";
import { UilPlus, UilMinus } from "@iconscout/react-unicons";
import ButtonComp from "../../CommonButton/ButtonComp";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import axios from "axios";
import "../../Common-Css/Swallfire.css";
import { Grid, TextField, Paper, Typography, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JsBarcode from "jsbarcode";

const PackingUpdateForm = () => {
  const { id } = useParams(); // Get the packingId from the URL
  const [formData, setFormData] = useState({
    school: "",
    school_code: "",
    subject: "",
    exam_date: "",
    exam_set: "",
    print_date: new Date().toISOString().split("T")[0],
    packing_no: "",
    rows: [], // Initialize as an empty array
  });

  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const navigate = useNavigate();

  // Fetch existing packing list data
  useEffect(() => {
    const fetchPackingData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/packing/${id}`);
        console.log("API Response:", response.data); // Debugging

        // Ensure data exists and rows is an array
        if (response.data.success && response.data.data) {
          const packingData = response.data.data;
          //console.log('packing list ',packingData.products_json);
          setFormData({
            school: packingData.school || "",
            school_code: packingData.school_code || "",
            subject: packingData.subject || "",
            exam_date: packingData.exam_date
              ? packingData.exam_date.split("T")[0]
              : "",
            exam_set: packingData.exam_set || "",
            print_date:
              packingData.print_date || new Date().toISOString().split("T")[0],
            packing_no: packingData.packing_no || "",
            rows: Array.isArray(packingData.products_json)
              ? packingData.products_json
              : [],
          });

          console.log("Updated FormData:", packingData); // Debugging
        } else {
          setError("No data found.");
        }
      } catch (error) {
        console.error("Error fetching packing data:", error);
        setError("Failed to fetch packing data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackingData();
  }, [id]);

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/get/schools`);
        setSchools(response.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setError("Failed to fetch schools. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  // Fetch subjects when the component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/subject`);
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setError("Failed to fetch subjects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch exam date when school or subject changes
  useEffect(() => {
    const fetchExamDate = async () => {
      if (formData.school && formData.subject) {
        setIsLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/api/exams/dates`, {
            params: {
              school: formData.school,
              subject: formData.subject,
              exam_date: formData.exam_date,
            },
          });
          if (response.data.data.length > 0) {
            const isoDate = response.data.data[0].exam_date;
            const formattedDate = isoDate.split("T")[0]; // Extract "yyyy-MM-dd"
            setFormData((prevData) => ({
              ...prevData,
              exam_date: formattedDate, // Use `exam_date` consistently
            }));
          }
        } catch (error) {
          console.error("Error fetching exam date:", error);
          setError("Failed to fetch exam date. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchExamDate();
  }, [formData.school, formData.subject]);

  // Function to add a new row to `rows`
  const addRow = () => {
    setFormData({
      ...formData,
      rows: [
        ...formData.rows,
        {
          product_code: "",
          product_name: "",
          registered_quantity: "",
          extra_quantity: "",
          total_quantity: "",
        },
      ],
    });
  };

  // Function to remove a row from `rows`
  const removeRow = (index) => {
    if (formData.rows.length > 1) {
      const updatedRows = formData.rows.filter((_, i) => i !== index);
      setFormData({ ...formData, rows: updatedRows });
    }
  };

  // Function to handle changes to row inputs
  const handleRowChange = (index, field, value) => {
    const updatedRows = formData.rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setFormData({ ...formData, rows: updatedRows });
  };

  // Function to handle form field changes
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

    // Function to generate PDF
  const generatePDF = (data) => {
    const doc = new jsPDF();

    // Ensure rows is an array
    const rows = Array.isArray(data.rows) ? data.rows : [];

    // Add Header
    doc.setFontSize(14);
    doc.text("Gowbell", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("8/4, BMC Panchdeep Complex, Unit 4,", 105, 20, {
      align: "center",
    });
    doc.text("Bhouma Nagar, Bhubaneswar, Odisha 751001", 105, 25, {
      align: "center",
    });

    // Packing List Title
    doc.setFontSize(16);
    doc.text("PACKING LIST", 105, 35, { align: "center" });
    doc.setFontSize(14);
    doc.text(`SOF2425063980`, 105, 42, { align: "center" });

    // Generate Barcode using school_code
    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, data.school_code, {
      format: "CODE128",
      displayValue: true,
    });

    // Convert barcode to image and add it to PDF
    const barcodeImage = barcodeCanvas.toDataURL("image/png");
    doc.addImage(barcodeImage, "PNG", 10, 50, 40, 20);

    // School Details on the Right Side
    doc.setFontSize(10);
    const xRight = 140;
    doc.text(`School Code: ${data.school_code}`, xRight, 50);
    doc.text(`Exam Set: ${data.exam_set}`, xRight, 55);
    doc.text(`Exam Name: ${data.exam_name}`, xRight, 60);
    doc.text(`Exam Date: ${data.exam_date}`, xRight, 65);
    doc.text(`Print Date: ${data.print_date}`, xRight, 70);
    doc.text(`Packet No: ${data.packing_no}`, xRight, 75);

    // Table Positioning
    let startX = 10;
    let startY = 85;
    let rowHeight = 8;
    let colWidths = [10, 30, 50, 40, 30, 30]; // Column widths

    // Table Headers
    const headers = [
      "S.No",
      "Product Code",
      "Product Name",
      "Registered Quantity",
      "Extra Quantity",
      "Total Quantity",
    ];

    // Draw Header Background
    doc.setFillColor(200, 200, 200); // Light gray background
    doc.rect(
      startX,
      startY,
      colWidths.reduce((a, b) => a + b, 0),
      rowHeight,
      "F"
    );

    // Draw Table Headers
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let xPos = startX;
    headers.forEach((header, index) => {
      doc.text(header, xPos + 2, startY + 5);
      xPos += colWidths[index];
    });

    // Draw Table Rows
    startY += rowHeight;
    rows.forEach((row, rowIndex) => {
      let xPos = startX;
      doc.rect(
        startX,
        startY,
        colWidths.reduce((a, b) => a + b, 0),
        rowHeight
      ); // Row boundary

      const rowData = [
        rowIndex + 1,
        row.product_code,
        row.product_name,
        row.registered_quantity,
        row.extra_quantity,
        row.total_quantity,
      ];

      rowData.forEach((cell, index) => {
        doc.text(String(cell), xPos + 2, startY + 5);
        xPos += colWidths[index];
      });

      startY += rowHeight; // Move to next row
    });

    doc.save("packing_list.pdf");
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rows.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please add at least one row to the packing list.",
      });
      return;
    }

    try {
      // Fetch school_code based on school_name
      const schoolCodeResponse = await axios.get(
        `${API_BASE_URL}/api/school-code/${formData.school}`
      );
      const school_code = schoolCodeResponse.data.school_code;

      // Auto-generate exam_name
      const exam_name = `GW${formData.subject}`;

      // Prepare payload
      const payload = {
        ...formData,
        school_code,
        exam_name,
        rows: formData.rows.map((row) => ({
          ...row,
          total_quantity: row.total_quantity,
        })),
      };

      // Update the packing list
      const response = await axios.put(
        `${API_BASE_URL}/api/update/${id}`,
        payload
      );
      if (response.status === 200) {
        setSubmittedData(payload); // Store submitted data
        generatePDF(payload); // Generate PDF
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "Packing updated successfully!",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        }).then(() => {
          navigate("/packing-list"); // Redirect to packing list
        });
      }
    } catch (error) {
      console.error("Error updating form:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred while updating the form.",
      });
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Packing list", link: "/packing-list" },
            { name: "Update", link: `/packing-update/${id}` },
          ]}
        />
      </div>
      <Paper elevation={3} className="w-100 bg-white p-4 mx-auto rounded">
        <Typography variant="h6" gutterBottom>
          Update Packing List
        </Typography>
        <form onSubmit={handleSubmit} style={{ fontFamily: "Poppins" }}>
          <Grid container spacing={3}>
            {/* School Dropdown */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label="School"
                value={formData.school || ""} // Ensure a fallback value
                onChange={(e) => handleChange("school", e.target.value)}
                size="small"
                variant="outlined"
              >
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.school_name}>
                    {school.school_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Subject Dropdown */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label="Subject"
                value={formData.subject || ""} // Ensure a fallback value
                onChange={(e) => handleChange("subject", e.target.value)}
                size="small"
                variant="outlined"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Exam Set */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label="Exam Set"
                value={formData.exam_set || ""} // Ensure a fallback value
                onChange={(e) => handleChange("exam_set", e.target.value)}
                size="small"
                variant="outlined"
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
                <MenuItem value="E">E</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </TextField>
            </Grid>

            {/* Packet No */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Packet No"
                value={formData.packing_no || ""} // Ensure a fallback value
                onChange={(e) => handleChange("packing_no", e.target.value)}
                size="small"
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Table for Rows */}
          <table className="table mt-4">
            <thead className="my-2">
              <tr>
                <th scope="col" className="py-1">
                  product code
                </th>
                <th scope="col" className="py-1">
                  product name
                </th>
                <th scope="col" className="py-1">
                  Registered quantity
                </th>
                <th scope="col" className="py-1">
                  extra quantity
                </th>
                <th scope="col" className="py-1">
                  total quantity
                </th>
                <th scope="col" className="py-1">
                  <UilPlus style={{ cursor: "pointer" }} onClick={addRow} />
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {console.log(formData.rows)} */}
              {/* {Array.isArray(formData.rows) ? (
                formData.rows.map((row, index) => ( */}
              {Array.isArray(formData.rows) && formData.rows.length > 0 ? (
                formData.rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="rounded m-0 my-1 w-100"
                        value={row.product_code || ""}
                        onChange={(e) =>
                          handleRowChange(index, "product_code", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="rounded m-0 my-1 w-100"
                        value={row.product_name || ""}
                        onChange={(e) =>
                          handleRowChange(index, "product_name", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="rounded m-0 my-1 w-100"
                        value={row.registered_quantity || ""}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "registered_quantity",
                            e.target.value
                          )
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="rounded m-0 my-1 w-100"
                        value={row.extra_quantity || ""}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "extra_quantity",
                            e.target.value
                          )
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="rounded m-0 my-1 w-100"
                        value={row.total_quantity || ""}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "total_quantity",
                            e.target.value
                          )
                        }
                        required
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No packing data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex gap-2">
            <ButtonComp
              text="Update"
              type="submit"
              disabled={isLoading}
              sx={{ flexGrow: 1 }}
            />
            <ButtonComp
              text="Cancel"
              type="button"
              sx={{ flexGrow: 1 }}
              onClick={() => navigate("/packing-list")}
            />
          </div>
        </form>
      </Paper>
    </Mainlayout>
  );
};

export default PackingUpdateForm;
