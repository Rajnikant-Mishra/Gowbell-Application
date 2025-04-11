import React, { useState } from "react";
import Mainlayout from "../../Layouts/Mainlayout";
import { UilPlus, UilMinus } from "@iconscout/react-unicons";
import ButtonComp from "../../CommonButton/ButtonComp";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import axios from "axios";
import "../../Common-Css/Swallfire.css";

const Extra = () => {
  const [formData, setFormData] = useState({
    attribute_name: "",
    rows: [{ ckey: "", cvalue: "", display_sequence: "" }],
  });

  const navigate = useNavigate();

  // Function to update `name` in `formData`
  const handleNameChange = (e) => {
    setFormData({ ...formData, attribute_name: e.target.value });
  };

  // Function to add a new row to `rows`
  const addRow = () => {
    setFormData({
      ...formData,
      rows: [...formData.rows, { ckey: "", cvalue: "", display_sequence: "" }],
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

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/a1/attributes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "Attribute added successfully!",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
  
          navigate("/list-attribute");
       
      } else {
        const errorData = await response.json(); // Assuming the server returns JSON with error details
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorData.message || "Failed to submit attribute. Please try again!",
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while submitting the form.",
      });
    }
  };

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "Attribute", link: "/list-attribute" },
            { name: "Create Attribute" },
          ]}
        />
      </div>
      <div className="w-75 bg-white p-4 mx-auto rounded">
        <form onSubmit={handleSubmit} style={{ fontFamily: "Poppins" }}>
          {/* {/ Attribute Name /} */}
          <div className="d-flex mb-3">
            <label htmlFor="name" className="col-5 my-auto">
              Attribute Name (Without any space):
              <span style={{ color: "red" }}>*</span>
            </label>
            <div className="col-7">
              <input
                type="text"
                id="name"
                name="attribute_name"
                className="rounded m-0 w-100"
                value={formData.attribute_name}
                onChange={handleNameChange}
                required
              />
            </div>
          </div>

          {/* {/ Table for Rows /} */}
          <table className="table mt-4">
            <thead className="my-2">
              <tr>
                <th scope="col" className="py-1">
                  Key
                </th>
                <th scope="col" className="py-1">
                  Value
                </th>
                <th scope="col" className="py-1">
                  Display Seq#
                </th>
                <th scope="col" className="py-1">
                  <UilPlus style={{ cursor: "pointer" }} onClick={addRow} />
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="rounded m-0 my-1 w-100"
                      value={row.ckey}
                      onChange={(e) =>
                        handleRowChange(index, "ckey", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="rounded m-0 my-1 w-100"
                      value={row.cvalue}
                      onChange={(e) =>
                        handleRowChange(index, "cvalue", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="rounded m-0 my-1 w-100"
                      value={row.display_sequence}
                      onChange={(e) =>
                        handleRowChange(index, "display_sequence", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    {formData.rows.length > 1 ? (
                      <UilMinus
                        className=" my-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => removeRow(index)}
                      />
                    ) : (
                      <UilMinus
                        className=" my-2"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex gap-2">
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
              onClick={() => navigate("/list-attribute")}
            />
          </div>
        </form>
      </div>
    </Mainlayout>
  );
};

export default Extra;
