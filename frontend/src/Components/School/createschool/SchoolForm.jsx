import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import { FaPhoneAlt, FaTrash, FaWhatsapp } from "react-icons/fa";
import Swal from "sweetalert2";
import "animate.css";
import { RxCross2 } from "react-icons/rx";
import styles from "./School.module.css";
import TextInput from "../CommonComp/TextInput";
import SelectDrop from "../CommonComp/SelectDrop";
import Mainlayout from "../../Layouts/Mainlayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SchoolForm() {
  const [formData, setFormData] = useState({
    board: "",
    school_name: "",
    school_email: "",
    school_contact_number: "",
    // school_code: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    principal_name: "",
    principal_email: "",
    principal_contact_number: "",
    principal_whatsapp: "",
    vice_principal_name: "",
    vice_principal_email: "",
    vice_principal_contact_number: "",
    vice_principal_whatsapp: "",
    student_strength: "",
    classes: [],
  });

  // States for managing dropdown
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [temporarySelection, setTemporarySelection] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const inputRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate hook
  const options = [
    { value: "0", label: "Class 1" },
    { value: "1", label: "Class 2" },
    { value: "2", label: "Class 3" },
    { value: "3", label: "Class 4" },
    { value: "4", label: "Class 5" },
    { value: "5", label: "Class 6" },
    { value: "6", label: "Class 7" },
    { value: "7", label: "Class 8" },
    { value: "8", label: "Class 9" },
    { value: "9", label: "Class 10" },
  ];

  // Handle checkbox selection
  const handleCheckboxChange = (value) => {
    setTemporarySelection((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handle adding selected options
  const handleOkClick = () => {
    setSelectedOptions([...selectedOptions, ...temporarySelection]);
    setTemporarySelection([]);
    setIsOpen(false); // Close dropdown
  };

  // Handle deleting chips
  const handleChipDelete = (value) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.filter((item) => item !== value)
    );
  };

  // Open dropdown and calculate its position
  const toggleDropdown = () => {
    setIsOpen(true);
  };

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const { bottom, left, width } = inputRef.current.getBoundingClientRect();
      setDropdownPosition({ top: bottom + window.scrollY, left, width });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition);
      window.addEventListener("resize", updateDropdownPosition);
    } else {
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen]);

  // Filtered options for search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const boardOptions = [
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    { value: "State", label: "State Board" },
  ];
  const pincodeOptions = [
    { value: "100015", label: "100015" },
    { value: "100025", label: "100025" },
    { value: "100035", label: "100035" },
  ];

  //------------------------fetch api codes------------------------------------------//

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch states dynamically
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/states/");
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  // Fetch districts based on selected state
  useEffect(() => {
    if (formData.state) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/districts/?state_id=${formData.state}`
          );
          setDistricts(response.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  // Fetch cities based on selected district
  useEffect(() => {
    if (formData.district) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/cities/?district_id=${formData.district}`
          );
          setCities(response.data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }
  }, [formData.district]);

  //-------------------------end code of api-------------------------------------------//

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting formData:", JSON.stringify(formData, null, 2)); // Debug formData

    // Show processing alert
    const loadingSwal = Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the school.",
      icon: "info",
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/get/schools",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setTimeout(() => {
        loadingSwal.close();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: 'School created successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            popup: "animate__animated animate__fadeInDown",
            title: "text-success fw-bold",
            text: "text-dark",
          },
          background: "#fff",
        }).then(() => {
          navigate("/schoolList");
        });
      }, 1000);
    } catch (error) {
      loadingSwal.close();
      console.error("Error details:", error.response?.data || error.message);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: error.response?.data?.error || "An unexpected error occurred.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        customClass: {
          popup: "animate__animated animate__shakeX",
          title: "text-danger fw-bold",
          text: "text-dark",
        },
        background: "#fff",
      });
    }
  };

  return (
    <Mainlayout>
      <Box className={styles.formContainer}>
        <Typography variant="h4" className={`${styles.formTitle} mb-3`}>
          School Registration Form
        </Typography>
        <form onSubmit={handleSubmit} className={styles.formContent}>
          <div className={`${styles.formRow} mb-3 `}>
            <div>
              <SelectDrop
                className={styles.selectInput}
                label="Board Name"
                name="board"
                options={boardOptions}
                value={formData.board}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, board: e.target.value }))
                }
                fullWidth
              />
            </div>
            <div>
              <TextInput
                className={styles.textInput}
                label="School Name"
                name="school_name"
                value={formData.school_name}
                onChange={handleInputChange}
                // onChange={handleChange}
                fullWidth
              />
            </div>
            <div>
              <TextInput
                className={styles.textInput}
                label="School Email"
                name="school_email"
                value={formData.school_email}
                onChange={handleInputChange}
                type="email"
                fullWidth
              />
            </div>
          </div>

          <div className={`${styles.formRow} mb-3 `}>
            <div className="col-12 col-sm-6 col-md-4">
              <TextInput
                label="School Contact Number"
                name="school_contact_number"
                value={formData.school_contact_number}
                onChange={handleInputChange}
                type="tel"
                fullWidth
              />
            </div>
            <div
              className="d-flex flex-row justify-content-between"
              style={{ paddingRight: "0px", paddingLeft: "0px" }}
            >
              <div className="col-md-6" style={{ width: "48%" }}>
                <SelectDrop
                  label="State"
                  name="state"
                  options={states.map((state) => ({
                    value: String(state.id), // Convert `state.id` to a string
                    label: state.name,
                  }))}
                  value={formData.state}
                  onChange={
                    (e) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      })) // This now stores a string value
                  }
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <SelectDrop
                  label="District"
                  name="district"
                  options={districts.map((district) => ({
                    value: String(district.id),
                    label: district.name,
                  }))}
                  value={formData.district}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      district: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </div>
            </div>

            <div className="d-flex flex-row gap-2" style={{ width: "47%" }}>
              <div className="col-md-6">
                <SelectDrop
                  label="City"
                  name="city"
                  options={cities.map((city) => ({
                    value: String(city.id),
                    label: city.name,
                  }))}
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  fullWidth
                />
              </div>
              <div className="col-md-6" style={{ paddingRight: "9px" }}>
                <SelectDrop
                  label="Pincode"
                  name="pincode"
                  options={pincodeOptions}
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div className={`${styles.formRow} mb-3 `}>
            <div>
              <TextInput
                label="Principal Name"
                name="principal_name"
                value={formData.principal_name}
                placeholder
                onChange={handleInputChange}
                type="tel"
                fullWidth
              />
            </div>
            <div>
              <TextInput
                label="Principal Email-ID"
                name="principal_email"
                value={formData.principal_email}
                onChange={handleInputChange}
                type="email"
                fullWidth
              />
            </div>
            <div className="d-flex flex-row gap-2">
              <TextInput
                label="Contact Number"
                name="principal_contact_number"
                // options={cityOptions}
                value={formData.principal_contact_number}
                onChange={handleInputChange}
                fullWidth
              />
              <TextInput
                label=" Whatsapp Number"
                name="principal_whatsapp"
                // options={pincodeOptions}
                value={formData.principal_whatsapp}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
          </div>
          <div className={`${styles.formRow} mb-2`}>
            <div className="row gx-3">
              <div className="col-12 col-sm-6 col-md-4 d-flex gap-1 mb-2 py-0 pe-1 ps-2">
                <TextInput
                  label="Vice Principal Name"
                  name="vice_principal_name"
                  value={formData.vice_principal_name}
                  onChange={handleInputChange}
                  type="text"
                  fullWidth
                />
              </div>

              <div className="col-12 col-sm-6 col-md-4 d-flex gap-1 mb-2 py-0 pe-1 ps-1">
                <TextInput
                  label="Vice Principal Email-ID"
                  name="vice_principal_email"
                  value={formData.vice_principal_email}
                  onChange={handleInputChange}
                  type="email"
                  fullWidth
                />
              </div>

              <div className="col-12 col-sm-6 col-md-4 d-flex gap-1 mb-2 py-0 pe-1 ps-1">
                <div
                  className="col-6"
                  style={{ paddingRight: "0.4rem", paddingLeft: "0.1rem" }}
                >
                  <TextInput
                    label="Contact Number"
                    name="vice_principal_contact_number"
                    // options={cityOptions}
                    value={formData.vice_principal_contact_number}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </div>
                <div className="col-6 " style={{ paddingRight: "0.50rem" }}>
                  <TextInput
                    label="Whatsapp Number"
                    name="vice_principal_whatsapp"
                    // options={pincodeOptions}
                    value={formData.vice_principal_whatsapp}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.formRow} mb-3`}>
            <div className="row gx-3">
              <div className="col-12 col-sm-6 col-md-4  mb-2">
                <div className="mb-3">
                  <div className={styles.selectContainer}>
                    <div className={styles.selectedTags}>
                      {selectedOptions.map((value) => {
                        const option = options.find(
                          (option) => option.value === value
                        );
                        return (
                          <span key={value} className={styles.badge}>
                            {option?.label}
                            <p
                              className={styles.btnClose}
                              onClick={() => handleChipDelete(value)}
                            >
                              <RxCross2 className={styles.crossicon} />
                            </p>
                          </span>
                        );
                      })}
                    </div>

                    <TextField
                      name="classes"
                      type="text"
                      size="small"
                      placeholder="Select Your Classes"
                      className="form-control mb-2 selectinput"
                      value={formData.classes}
                      onChange={(e) => handleInputChange(e, "classes")}
                      onClick={toggleDropdown}
                      ref={inputRef}
                    />
                  </div>

                  {isOpen && (
                    <div
                      className={`${styles.dropdownMenu} ${
                        isOpen ? styles.slideIn : ""
                      }`}
                      style={{
                        top: dropdownPosition.top,
                        width: dropdownPosition.width,
                      }}
                    >
                      {filteredOptions.map((option) => (
                        <div key={option.value} className={styles.dropdownitem}>
                          <label className={`${styles.checkboxLabel} d-flex`}>
                            <input
                              type="checkbox"
                              checked={temporarySelection.includes(
                                option.value
                              )}
                              onChange={() =>
                                handleCheckboxChange(option.value)
                              }
                              className="col-2"
                            />
                            <p className="col-10 my-auto">{option.label}</p>
                          </label>
                        </div>
                      ))}
                      <div className={styles.dropdownFooter}>
                        <button
                          className={styles.okButton}
                          onClick={handleOkClick}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4  mb-2">
                <TextInput
                  label="Student Strength"
                  name="student_strength"
                  value={formData.student_strength}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
            </div>
          </div>
          <Box className={styles.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              className={styles.submitbutton}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Mainlayout>
  );
}
