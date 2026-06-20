import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Paper,
  Typography,
  Grid,
  MenuItem,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Checkbox,
  Modal,
  TableContainer,
  Divider,
} from "@mui/material";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
import html2pdf from "html2pdf.js";
import { createRoot } from "react-dom/client";
import ResultTemplate from "./PercentageResult";

// ─── Constants ────────────────────────────────────────────────────────────────
const LEVEL_OPTIONS = [
  { value: "Level 1", label: "Level 1" },
  { value: "Level 2", label: "Level 2" },
  { value: "Level 3", label: "Level 3" },
  { value: "Level 4", label: "Level 4" },
];

const MEDAL_OPTIONS = [
  { value: "Gold", label: "🥇 Gold" },
  { value: "Silver", label: "🥈 Silver" },
  { value: "Bronze", label: "🥉 Bronze" },
  { value: "N/A", label: "None" },
];

const PAGE_SIZES = [5, 10, 25, 50];

const TABLE_HEADERS = [
  { label: "Student Name", align: "left" },
  { label: "Class", align: "center" },
  { label: "Subject", align: "center" },
  { label: "Roll No", align: "center" },
  { label: "Full Mark", align: "center" },
  { label: "Secured", align: "center" },
  { label: "%", align: "center" },
  { label: "Rank", align: "center" },
  { label: "Medal", align: "center" },
  { label: "Certificate", align: "center" },
  { label: "Level", align: "center" },
  { label: "Remark", align: "left" },
  { label: "Status", align: "center" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const Dropdown = ({
  label,
  value,
  options,
  onChange,
  disabled,
  isSelected,
}) => (
  <FormControl fullWidth size="small" disabled={disabled}>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiSelect-select": {
          backgroundColor: isSelected ? "#e8f0fe" : "inherit",
          fontWeight: isSelected ? 600 : 400,
        },
      }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const MedalBadge = ({ medal }) => {
  const map = {
    Gold: { bg: "#FFF8DC", color: "#B8860B", border: "#FFD700", icon: "🥇" },
    Silver: { bg: "#F5F5F5", color: "#696969", border: "#C0C0C0", icon: "🥈" },
    Bronze: { bg: "#FFF0E6", color: "#8B4513", border: "#CD7F32", icon: "🥉" },
  };
  const style = map[medal];
  if (!style)
    return (
      <Typography fontSize="13px" color="text.disabled">
        —
      </Typography>
    );
  return (
    <Box
      sx={{
        px: 1.2,
        py: 0.3,
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        display: "inline-block",
        bgcolor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        letterSpacing: "0.3px",
      }}
    >
      {style.icon} {medal}
    </Box>
  );
};

const StatusBadge = ({ status }) => {
  const isSuccess = status === "success";
  const isPending = status === "pending";
  return (
    <Box
      sx={{
        px: 1.2,
        py: 0.3,
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        display: "inline-block",
        letterSpacing: "0.3px",
        bgcolor: isSuccess ? "#E8F5E9" : isPending ? "#FFF3E0" : "#FAFAFA",
        color: isSuccess ? "#2E7D32" : isPending ? "#E65100" : "#555",
        border: `1px solid ${isSuccess ? "#A5D6A7" : isPending ? "#FFCC80" : "#ddd"}`,
      }}
    >
      {isSuccess ? "✓ " : isPending ? "⏳ " : "• "}
      {status || "N/A"}
    </Box>
  );
};

const PaginationButton = ({ children, active, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      backgroundColor: disabled ? "#F5F5F5" : active ? "#1139EC" : "#fff",
      color: disabled ? "#bbb" : active ? "#fff" : "#333",
      border: `1px solid ${active ? "#1139EC" : "#ddd"}`,
      borderRadius: 6,
      padding: "3px 10px",
      minWidth: 32,
      height: 30,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s ease",
      margin: "0 2px",
      fontWeight: active ? 700 : 400,
      fontFamily: "'Nunito', sans-serif",
      fontSize: 13,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const OmrForm = () => {
  // Location
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // School — single select
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [schoolLoading, setSchoolLoading] = useState(false);

  // Level
  const [selectedLevel, setSelectedLevel] = useState("");

  // Students
  const [students, setStudents] = useState([]);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Medal modal
  const [open, setOpen] = useState(false);
  const [medal, setMedal] = useState("");

  // ─── Fetch Locations ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [c, s, d, ci] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
        ]);
        setCountries(c.data || []);
        setStates(s.data || []);
        setDistricts(d.data || []);
        setCities(ci.data || []);
        const india = (c.data || []).find(
          (x) => x.name?.toLowerCase() === "india",
        );
        if (india) setSelectedCountry(india.id);
      } catch {
        toast.error("Failed to load locations.");
      }
    };
    fetchLocations();
  }, []);

  // ─── Location Cascade ───────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedCountry) {
      setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedCity("");
    }
  }, [selectedCountry, states]);

  useEffect(() => {
    if (selectedState) {
      setFilteredDistricts(
        districts.filter((d) => d.state_id === selectedState),
      );
      setSelectedDistrict("");
      setSelectedCity("");
    }
  }, [selectedState, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      setFilteredCities(
        cities.filter((c) => c.district_id === selectedDistrict),
      );
      setSelectedCity("");
    }
  }, [selectedDistrict, cities]);

  // ─── Fetch Schools ──────────────────────────────────────────────────────────
  const fetchSchools = useCallback(async (filters) => {
    setSchoolLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        { params: filters },
      );
      if (data.success) {
        const flat = (data.data || []).flatMap((loc) =>
          (loc.schools || []).map((s) => ({
            id: s.id,
            name: s.name,
            school_code: s.school_code ?? "",
          })),
        );
        setSchoolOptions(flat);
      } else {
        setSchoolOptions([]);
        toast.warn(data.message || "No schools found.");
      }
    } catch {
      setSchoolOptions([]);
      toast.error("Failed to load schools.");
    } finally {
      setSchoolLoading(false);
    }
  }, []);

  useEffect(() => {
    const filters = {
      country: selectedCountry || null,
      state: selectedState || null,
      district: selectedDistrict || null,
      city: selectedCity || null,
    };
    if (Object.values(filters).some(Boolean)) fetchSchools(filters);
    else setSchoolOptions([]);
    // Reset downstream
    setSelectedSchoolId("");
    setSelectedLevel("");
    setStudents([]);
    setSchoolInfo(null);
    setTotalCount(0);
  }, [
    selectedCountry,
    selectedState,
    selectedDistrict,
    selectedCity,
    fetchSchools,
  ]);

  // ─── Fetch Students ─────────────────────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    if (!selectedSchoolId || !selectedLevel) return;

    const session_id = localStorage.getItem("currentSessionId");
    if (!session_id) {
      toast.error("No active session found.");
      return;
    }

    setIsLoading(true);
    setStudents([]);
    setSchoolInfo(null);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/result-email`, {
        schoolIds: [Number(selectedSchoolId)],
        level: selectedLevel,
        session_id,
      });

      if (!data.success)
        throw new Error(data.error || "Failed to fetch student data.");

      // API returns: { data: { "3872": { school_name, school_email, students: [...] } } }
      const schoolData =
        data.data?.[selectedSchoolId] ?? data.data?.[Number(selectedSchoolId)];

      if (schoolData) {
        setSchoolInfo({
          school_name: schoolData.school_name || "",
          school_email: schoolData.school_email || "",
        });

        const normalized = (schoolData.students || []).map((s, i) => ({
          ...s,
          id: s.id ?? `temp-${i}`,
          subject_name: s.subject_name || "N/A",
          percentage: parseFloat(s.percentage) || 0,
          ranking: s.ranking ?? "N/A",
          medals: s.medals || "",
          certificate: s.certificate || "N/A",
          remarks: s.remarks || "",
          level: s.level || "N/A",
          status: s.status || "N/A",
        }));

        setStudents(normalized);
        setTotalCount(data.totalCount || normalized.length);
        toast.success(
          `${normalized.length} student${normalized.length !== 1 ? "s" : ""} loaded.`,
        );
      } else {
        setStudents([]);
        setTotalCount(0);
        toast.warn("No student data found for this school.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.message || "Failed to load students.",
      );
      setStudents([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSchoolId, selectedLevel]);

  useEffect(() => {
    setPage(1);
    setSelectedStudents([]);
    fetchStudents();
  }, [fetchStudents]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const toggleStudent = (id) =>
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const eligibleStudents = students.filter(
    (s) => !s.medals || s.medals === "N/A",
  );

  const handleSelectAll = (e) => {
    if (e.target.checked)
      setSelectedStudents(eligibleStudents.map((s) => s.id));
    else setSelectedStudents([]);
  };

  // wait for images (IMPORTANT)
  const waitForImages = async (container) => {
    const images = container.querySelectorAll("img");

    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) return resolve();
            img.onload = resolve;
            img.onerror = resolve;
          }),
      ),
    );
  };

  const handleSendResult = async () => {
    try {
      const session_id = localStorage.getItem("currentSessionId");

      if (!selectedSchoolId || !students.length) {
        return toast.error("Data missing");
      }

      setIsLoading(true);

      // Group students by subject
      const grouped = students.reduce((acc, student) => {
        const subject = student.subject_name || "Unknown Subject";

        if (!acc[subject]) {
          acc[subject] = [];
        }

        acc[subject].push(student);

        return acc;
      }, {});

      const formData = new FormData();

      formData.append("school_id", selectedSchoolId);
      formData.append("session_id", session_id);
      formData.append("level", selectedLevel);

      // Use email from first student if available
      formData.append(
        "email",
        students[0]?.school_email || schoolInfo?.school_email || "",
      );

      for (const subject in grouped) {
        const subjectStudents = grouped[subject];

        // Dynamic school details from student data
        const firstStudent = subjectStudents[0] || {};

        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.left = "-9999px";
        container.style.top = "0";
        document.body.appendChild(container);

        const root = createRoot(container);

        root.render(
          <ResultTemplate
            data={{
              schoolName: firstStudent.school_name || "",
              address: firstStudent.school_address || "",
              school_code: firstStudent.school_code || "",
              level: selectedLevel,
              subject: subject,
              year: new Date().getFullYear(),
              students: subjectStudents,
            }}
          />,
        );

        // Wait for React render
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Wait for images
        await waitForImages(container);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const pdfBlob = await html2pdf()
          .from(container.firstElementChild)
          .set({
            margin: 0,

            filename: `${subject}.pdf`,

            image: {
              type: "jpeg",
              quality: 1,
            },

            html2canvas: {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: null,

              scrollX: 0,
              scrollY: 0,

              windowWidth: 1123,
              windowHeight: 794,
            },

            jsPDF: {
              unit: "px",
              format: [1123, 794],
              orientation: "landscape",
            },

            pagebreak: {
              mode: ["css", "legacy"],
              avoid: ["tr", ".tableWrapper"],
            },
          })
          .output("blob");

        const file = new File(
          [pdfBlob],
          `${subject.replace(/\s+/g, "_")}.pdf`,
          {
            type: "application/pdf",
          },
        );

        formData.append("pdfs", file);

        root.unmount();

        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/results/upload-result`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success("Results sent successfully!");
      } else {
        toast.error(res.data.message || "Failed to send results");
      }
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Failed to generate or send PDF");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedStudents = students.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Mainlayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Email Student Result", link: "" }]} />
      </div>

      <Container component="main" maxWidth="xl">
        <Paper elevation={1} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
          {/* Title */}
          <Box mb={2.5}>
            <Typography variant="h5" fontWeight={700} color="#1139EC">
              Email Student Result
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Filter by location and school to view and manage student results.
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filters */}
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={2}>
              <Dropdown
                label="Country"
                value={selectedCountry}
                options={countries.map((c) => ({ value: c.id, label: c.name }))}
                onChange={(e) => setSelectedCountry(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Dropdown
                label="State"
                value={selectedState}
                options={filteredStates.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
                onChange={(e) => setSelectedState(e.target.value)}
                disabled={!selectedCountry}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Dropdown
                label="District"
                value={selectedDistrict}
                options={filteredDistricts.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Dropdown
                label="City"
                value={selectedCity}
                options={filteredCities.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedDistrict}
              />
            </Grid>

            {/* School — single select */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl
                fullWidth
                size="small"
                disabled={!selectedState || schoolLoading}
              >
                <InputLabel>School</InputLabel>
                <Select
                  label="School"
                  value={selectedSchoolId}
                  onChange={(e) => {
                    setSelectedSchoolId(e.target.value);
                    setSelectedLevel("");
                    setStudents([]);
                    setSchoolInfo(null);
                  }}
                >
                  {schoolLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={14} sx={{ mr: 1 }} /> Loading…
                    </MenuItem>
                  ) : schoolOptions.length === 0 ? (
                    <MenuItem disabled>No schools found</MenuItem>
                  ) : (
                    schoolOptions.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                        {s.school_code ? ` (${s.school_code})` : ""}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Level */}
            <Grid item xs={12} sm={6} md={2}>
              <Dropdown
                label="Level"
                value={selectedLevel}
                options={LEVEL_OPTIONS}
                onChange={(e) => setSelectedLevel(e.target.value)}
                disabled={!selectedSchoolId}
                isSelected={!!selectedLevel}
              />
            </Grid>
          </Grid>

          {/* School Info Banner */}
          {schoolInfo && (
            <Box
              mt={2.5}
              px={2.5}
              py={1.5}
              bgcolor="#F0F4FF"
              borderRadius={2}
              border="1px solid #C5D3FF"
              display="flex"
              alignItems="center"
              gap={3}
              flexWrap="wrap"
            >
              <Box>
                <Typography
                  variant="caption"
                  color="#1139EC"
                  fontWeight={700}
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                >
                  School
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {schoolInfo.school_name}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography
                  variant="caption"
                  color="#1139EC"
                  fontWeight={700}
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                >
                  Email
                </Typography>
                <Typography variant="body2">
                  {schoolInfo.school_email}
                </Typography>
              </Box>
              <Box ml="auto">
                <Typography variant="caption" color="text.secondary">
                  {totalCount} student{totalCount !== 1 ? "s" : ""} ·{" "}
                  {selectedLevel}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Actions & Table */}
          <Box mt={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              flexWrap="wrap"
              gap={1}
            >
              <Typography variant="h6" fontWeight={600}>
                Student Results
                {students.length > 0 && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    ml={1}
                  >
                    ({totalCount} total)
                  </Typography>
                )}
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  onClick={handleSendResult}
                  disabled={!selectedSchoolId || !selectedLevel}
                >
                  Send Email Result
                </Button>
              </Box>
            </Box>

            {/* Table */}
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                maxHeight: 500,
                overflowX: "auto",
                borderRadius: "10px",
                border: "1px solid #e8ecf4",
              }}
            >
              <Table
                stickyHeader
                size="small"
                sx={{ minWidth: 900, border: "none" }}
              >
                <TableHead>
                  <TableRow>
                    {TABLE_HEADERS.map((h) => (
                      <TableCell
                        key={h.label}
                        align={h.align}
                        sx={{
                          bgcolor: "#1139EC",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                          borderBottom: "none",
                          py: 1.5,
                        }}
                      >
                        {h.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={14} align="center" sx={{ py: 8 }}>
                        <CircularProgress size={32} sx={{ color: "#1139EC" }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={1}
                        >
                          Loading students…
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student, idx) => {
                      const id = student.id;
                      const hasMedal =
                        !!student.medals && student.medals !== "N/A";
                      const isSelected = selectedStudents.includes(id);
                      const pct = parseFloat(student.percentage);

                      return (
                        <TableRow
                          key={id}
                          hover
                          sx={{
                            bgcolor: isSelected
                              ? "#EEF2FF"
                              : idx % 2 === 0
                                ? "#fff"
                                : "#FAFBFF",
                            "&:hover": { bgcolor: "#F0F4FF" },
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500, fontSize: "13px" }}>
                            {student.student_name || "-"}
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: "13px" }}>
                            {student.class_name || "-"}
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: "13px" }}>
                            {student.subject_name !== "N/A"
                              ? student.subject_name.charAt(0).toUpperCase() +
                                student.subject_name.slice(1)
                              : "-"}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontSize: "13px", fontFamily: "monospace" }}
                          >
                            {student.roll_no || "-"}
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: "13px" }}>
                            {student.full_mark ?? "-"}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontSize: "13px", fontWeight: 600 }}
                          >
                            {student.mark_secured ?? "-"}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color:
                                pct >= 75
                                  ? "#2E7D32"
                                  : pct >= 50
                                    ? "#E65100"
                                    : "#C62828",
                            }}
                          >
                            {student.percentage
                              ? `${student.percentage}%`
                              : "-"}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontSize: "13px", fontWeight: 600 }}
                          >
                            {student.ranking !== "N/A"
                              ? `#${student.ranking}`
                              : "-"}
                          </TableCell>
                          <TableCell align="center">
                            {hasMedal ? (
                              <MedalBadge medal={student.medals} />
                            ) : (
                              <Typography fontSize="13px" color="text.disabled">
                                —
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: "12px" }}>
                            {student.certificate || "-"}
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: "12px" }}>
                            {student.level || "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "12px",
                              color: "text.secondary",
                              maxWidth: 140,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {student.remarks || "-"}
                          </TableCell>
                          <TableCell align="center">
                            <StatusBadge status={student.status} />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} align="center" sx={{ py: 8 }}>
                        <Box sx={{ fontSize: "36px", mb: 1, opacity: 0.35 }}>
                          📋
                        </Box>
                        <Typography color="text.secondary" fontSize="14px">
                          {selectedSchoolId && selectedLevel
                            ? "No students found for the selected filters."
                            : "Select a school and level to view results."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {students.length > 0 && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                mt={1.5}
                gap={1}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    style={{
                      width: 58,
                      padding: "0 6px",
                      height: 30,
                      fontSize: 13,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      color: "#444",
                      outline: "none",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {PAGE_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontFamily="'Nunito', sans-serif"
                  >
                    per page
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontFamily="'Nunito', sans-serif"
                >
                  {totalCount} records · Page {page} of {totalPages}
                </Typography>

                <Box display="flex" alignItems="center">
                  <PaginationButton
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <UilAngleLeftB size={16} />
                  </PaginationButton>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (pg) =>
                        pg === 1 ||
                        pg === totalPages ||
                        Math.abs(pg - page) <= 2,
                    )
                    .map((pg, i, arr) => (
                      <React.Fragment key={pg}>
                        {i > 0 && pg > arr[i - 1] + 1 && (
                          <span style={{ color: "#bbb", margin: "0 2px" }}>
                            …
                          </span>
                        )}
                        <PaginationButton
                          active={page === pg}
                          onClick={() => setPage(pg)}
                        >
                          {pg}
                        </PaginationButton>
                      </React.Fragment>
                    ))}
                  <PaginationButton
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <UilAngleRightB size={16} />
                  </PaginationButton>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default OmrForm;
