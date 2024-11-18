import React, { useState, useEffect } from "react";
import Mainlayout from "../../Layouts/Mainlayout";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete, MdBrowserUpdated, MdSearch } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";





function CountryList() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    status: "",
    created_at: ""
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/states/")
      .then((response) => {
        setCountries(response.data);
        setFilteredCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const handleDelete = (id) => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the delete request
        axios
          .delete(`http://localhost:5000/api/states/${id}`)
          .then((response) => {
            // Update the state after successful deletion
            setCountries((prevCountries) => prevCountries.filter((country) => country.id !== id));
            setFilteredCountries((prevFiltered) => prevFiltered.filter((country) => country.id !== id));
  
            // Show a success alert
            Swal.fire("Deleted!", "The country has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting country:", error);
            // Show an error alert if deletion fails
            Swal.fire("Error!", "There was an issue deleting the state.", "error");
          });
      }
    });
  };

  const handleFilterChange = (e, field) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }));
    applyFilters({ ...filters, [field]: value });
  };

  const applyFilters = (updatedFilters) => {
    const filteredData = countries.filter((country) => {
      return (
        (!updatedFilters.id || country.id.toString().includes(updatedFilters.id)) &&
        (!updatedFilters.name || country.name.toLowerCase().includes(updatedFilters.name.toLowerCase())) &&
        (!updatedFilters.status || country.status.toLowerCase().includes(updatedFilters.status.toLowerCase())) &&
        (!updatedFilters.created_at || country.created_at.toLowerCase().includes(updatedFilters.created_at.toLowerCase()))
      );
    });
    setFilteredCountries(filteredData);
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "State  Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Created_at",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="actionButtons d-flex gap-2">
          
          <Link to={`/state/update/${row.id}`} type="button" className="">
            <FaRegEdit />
          </Link>
          <button
          type="button"
          onClick={() => handleDelete(row.id)}
          className="btn btn-danger btn-sm"
          
        >
          <AiOutlineDelete/>
        </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Mainlayout>
      <div className="container">
        <div className="d-flex justify-content-end align-items-center mb-3">
        
          <Link to={"/state/create"} className="btn btn-primary">
            <FaPlus/>
          </Link>
        </div>

        {/* Search Row */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>
                  <div className="d-flex align-items-center">
                    <MdSearch />
                    <input
                      type="text"
                      placeholder="Search by Id"
                      value={filters.id}
                      onChange={(e) => handleFilterChange(e, "id")}
                      className="form-control"
                      style={{ marginLeft: "5px" }}
                    />
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center">
                    <MdSearch />
                    <input
                      type="text"
                      placeholder="Search by State  Name"
                      value={filters.name}
                      onChange={(e) => handleFilterChange(e, "name")}
                      className="form-control"
                      style={{ marginLeft: "5px" }}
                    />
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center">
                    <MdSearch />
                    <input
                      type="text"
                      placeholder="Search by Status"
                      value={filters.status}
                      onChange={(e) => handleFilterChange(e, "status")}
                      className="form-control"
                      style={{ marginLeft: "5px" }}
                    />
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center">
                    <MdSearch />
                    <input
                      type="text"
                      placeholder="Search by Created_at"
                      value={filters.created_at}
                      onChange={(e) => handleFilterChange(e, "created_at")}
                      className="form-control"
                      style={{ marginLeft: "5px" }}
                    />
                  </div>
                </th>
                <th>Action</th>
              </tr>
            </thead>
          </table>
        </div>

        <DataTable
          columns={columns}
          data={filteredCountries}
          pagination
          fixedHeader
          selectableRows
        />
      </div>
    </Mainlayout>
  );
}

export default CountryList;
