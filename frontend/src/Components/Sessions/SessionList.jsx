import React, { useEffect, useState } from "react";
import {
  UilTrashAlt,
  UilEditAlt,
  UilAngleRightB,
  UilAngleLeftB,
  UilSearch,
  UilTimes,
} from "@iconscout/react-unicons";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  Modal,
  Box,
  Button,
  MenuItem,
} from "@mui/material";

import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import Breadcrumb from "../CommonButton/Breadcrumb";
import "../Common-Css/DeleteSwal.css";
import "../Common-Css/Swallfire.css";

// Style configuration for the Pop-up Modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

export default function SessionDataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);

  // Modal Pop-up state controls
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ session: "", status: "Active" });

  const pageSizes = [10, 20, 50, 100];

  // Fetch all records
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/session/get-all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const sessionList = Array.isArray(response.data)
        ? response.data
        : response.data.sessions || [];

      // Front-end execution for search term processing matching Class UI behavior
      const formatted = sessionList.map((item, index) => ({
        ...item,
        sl_no: index + 1,
      }));

      const filtered = formatted.filter(
        (item) =>
          item.session?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      setTotalRecords(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize));

      // Page parsing logic layout
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

      setSessions(paginatedData);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to load sessions",
        showConfirmButton: false,
        timer: 2200,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [page, pageSize, searchTerm]);

  // Handle open modal configuration for Create or Edit
  //   const handleOpenModal = (row = null) => {
  //     if (row) {
  //       setEditingId(row.id);
  //       setFormData({ session: row.session, status: row.status || "Active" });
  //     } else {
  //       setEditingId(null);
  //       setFormData({ session: "", status: "Active" });
  //     }
  //     setOpenModal(true);
  //   };

  // Handle open modal configuration for Create or Edit
  const handleOpenModal = (row = null) => {
    if (row) {
      // Safely format the status string to match "Active" or "Inactive"
      let standardizedStatus = "Active";
      if (row.status && row.status.toLowerCase() === "inactive") {
        standardizedStatus = "Inactive";
      }

      setEditingId(row.id);
      setFormData({
        session: row.session || "",
        status: standardizedStatus,
      });
    } else {
      setEditingId(null);
      setFormData({ session: "", status: "Active" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ session: "", status: "Active" });
    setEditingId(null);
  };

  // Create or Update form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      if (editingId) {
        // Edit Endpoint execution (PUT)
        await axios.put(`${API_BASE_URL}/api/session/${editingId}`, formData, {
          headers,
        });
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Session updated successfully",
          showConfirmButton: false,
          timer: 1800,
        });
      } else {
        // Create Endpoint execution (POST)
        await axios.post(`${API_BASE_URL}/api/session`, formData, { headers });
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Session created successfully",
          showConfirmButton: false,
          timer: 1800,
        });
      }
      handleCloseModal();
      fetchSessions();
    } catch (err) {
      console.error("Operation failed:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Operation failed",
        showConfirmButton: false,
        timer: 2200,
      });
    }
  };

  const handleRowCheck = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedRows({});
    } else {
      const all = {};
      sessions.forEach((row) => (all[row.id] = true));
      setCheckedRows(all);
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This session will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        axios
          .delete(`${API_BASE_URL}/api/session/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
          .then(() => {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Session deleted",
              showConfirmButton: false,
              timer: 1800,
            });
            fetchSessions();
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: "Delete failed",
              showConfirmButton: false,
              timer: 2200,
            });
          });
      }
    });
  };

  return (
    <Mainlayout>
      {/* Top Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Breadcrumb data={[{ name: "Sessions" }]} />
        {/* Trigger Pop-up Form instead of navigation route */}
        <div onClick={() => handleOpenModal(null)}>
          <button
            style={{
              background: "rgb(17 61 236)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 4px 10px rgba(17,61,236,0.2)",
            }}
          >
            + Create Session
          </button>
        </div>
      </div>

      {/* Main Table Interface */}
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by session name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={{ mb: 3, maxWidth: 520 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <UilSearch color="#666" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <UilTimes size="18" color="#888" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <CircularProgress size={50} />
            <p style={{ marginTop: 20, color: "#555" }}>Loading sessions...</p>
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 520,
                overflowX: "auto",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Table stickyHeader sx={{ minWidth: 900, border: "none" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{ bgcolor: "rgb(17 61 236)", color: "white" }}
                    >
                      <Checkbox
                        sx={{ color: "white" }}
                        checked={isAllChecked}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    {["SL No", "Session Name", "Status", "Action"].map(
                      (title) => (
                        <TableCell
                          key={title}
                          sx={{
                            bgcolor: "rgb(17 61 236)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "13.5px",
                            whiteSpace: "nowrap",
                            textAlign: title === "Action" ? "center" : "left",
                          }}
                        >
                          {title}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        No sessions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                          borderBottom: "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={!!checkedRows[row.id]}
                            onChange={() => handleRowCheck(row.id)}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>{row.sl_no}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {row.session || "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "50px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background:
                                row.status?.toLowerCase() === "active"
                                  ? "#E8F5E9"
                                  : "#FFEBEE",
                              color:
                                row.status?.toLowerCase() === "active"
                                  ? "#2E7D32"
                                  : "#C62828",
                              border: `1px solid ${row.status?.toLowerCase() === "active" ? "#C8E6C9" : "#FFCDD2"}`,
                            }}
                          >
                            {row.status || "Inactive"}
                          </span>
                        </TableCell>

                        <TableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {/* Fixed Edit button to open popup instead of linking out */}
                            <IconButton
                              size="small"
                              onClick={() => handleOpenModal(row)}
                            >
                              <UilEditAlt
                                style={{ color: "#1230AE", fontSize: 22 }}
                              />
                            </IconButton>
                            {/* <IconButton
                              size="small"
                              onClick={() => handleDelete(row.id)}
                            >
                              <UilTrashAlt
                                style={{ color: "#e74c3c", fontSize: 22 }}
                              />
                            </IconButton> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Design Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: "16px",
                gap: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span style={{ color: "#555", fontSize: "14px" }}>
                  rows per page
                </span>
              </div>

              <div style={{ color: "#555", fontSize: "14px" }}>
                {totalRecords} records • Page {page} of {totalPages || 1}
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: page === 1 ? "#f0f0f0" : "#fff",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <UilAngleLeftB />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 2,
                  )
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && p > arr[idx - 1] + 1 && <span>...</span>}
                      <button
                        onClick={() => setPage(p)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid",
                          borderColor: page === p ? "#1976d2" : "#ccc",
                          background: page === p ? "#1976d2" : "#fff",
                          color: page === p ? "white" : "#333",
                          fontWeight: page === p ? "bold" : "normal",
                        }}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: page === totalPages ? "#f0f0f0" : "#fff",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  <UilAngleRightB />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pop-up Action Modal for Create and Edit Functions */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <h3
            style={{
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            {editingId ? "Update Session" : "Create Session"}
          </h3>
          <form
            onSubmit={handleSubmitForm}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <TextField
              label="Session Title"
              fullWidth
              size="small"
              required
              value={formData.session}
              onChange={(e) =>
                setFormData({ ...formData, session: e.target.value })
              }
              placeholder="e.g. 2025-2026"
            />

            <TextField
              select
              label="Status"
              fullWidth
              size="small"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                color="inherit"
                size="small"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: "rgb(17 61 236)" }}
                size="small"
              >
                {editingId ? "Save Changes" : "Save Session"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </Mainlayout>
  );
}
