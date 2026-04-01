import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Box,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  OutlinedInput,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { UilAngleLeftB, UilAngleRightB } from "@iconscout/react-unicons";
import Mainlayout from "../../Layouts/Mainlayout";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import styles from "./OmrForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import Swal from "sweetalert2";
import "../../Common-Css/Swallfire.css";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import jsPDF from "jspdf";
import "jspdf-autotable";
import OMRSheet50 from "./OMRSheet50";
import OMRSheet60 from "./OMRSheet60";
import ReactDOM from "react-dom";
import html2canvas from "html2canvas";

/* ─────────────────────── Re-usable Dropdown (single) ─────────────────────── */
const Dropdown = ({ label, value, options, onChange, disabled, loading }) => (
  <TextField
    select
    label={label}
    variant="outlined"
    fullWidth
    margin="normal"
    size="small"
    value={value}
    onChange={onChange}
    disabled={disabled || loading}
    SelectProps={{
      MenuProps: { PaperProps: { style: { maxHeight: 250 } } },
    }}
  >
    {loading ? (
      <MenuItem disabled>
        <CircularProgress size={20} />
      </MenuItem>
    ) : options.length === 0 ? (
      <MenuItem disabled>No options</MenuItem>
    ) : (
      options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))
    )}
  </TextField>
);

/* ─────────────────────── Main Component ─────────────────────── */
const ExaminationForm = () => {
  /* ────── Core state ────── */
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [centers, setCenters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  /* ────── SCHOOLS (multi-select) ────── */
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState("level_1");
  const [selectedModel, setSelectedModel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [omrSet, setOmrSet] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");

  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [classWiseCounts, setClassWiseCounts] = useState({});
  const [students, setStudents] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  /* ────── Pagination ────── */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 25, 50];
  const totalRecords = students.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedStudents = students.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handlePreviousPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  /* ────── Helper: Hide City for Level 2,3,4 ────── */
  const hideCity = ["level_2", "level_3", "level_4"].includes(selectedLevel);

  /* ────── 1. Load static master data ────── */
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const [
          countriesRes,
          statesRes,
          districtsRes,
          citiesRes,
          centersRes,
          classesRes,
          subjectsRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/states`),
          axios.get(`${API_BASE_URL}/api/districts`),
          axios.get(`${API_BASE_URL}/api/cities/all/c1`),
          axios.get(`${API_BASE_URL}/api/center/get-all`),
          axios.get(`${API_BASE_URL}/api/class`),
          axios.get(`${API_BASE_URL}/api/subject`),
        ]);

        if (!mounted) return;

        setCountries(countriesRes.data ?? []);
        setStates(statesRes.data ?? []);
        setDistricts(districtsRes.data ?? []);
        setCities(citiesRes.data ?? []);
        setCenters(
          (centersRes.data ?? [])
            .filter((c) => c.id && c.center_name)
            .map((c) => ({ id: c.id, center_name: c.center_name })),
        );
        // setClasses(
        //   (classesRes.data ?? []).map((c) => ({ id: c.id, name: c.name })),
        // );
        const hiddenClasses = ["lkg", "ukg", "nursery", "play"];

        setClasses(
          (classesRes.data ?? [])
            .filter(
              (c) => !hiddenClasses.includes(c.name?.toLowerCase().trim()),
            )
            .map((c) => ({ id: c.id, name: c.name })),
        );
        // setSubjects(
        //   (subjectsRes.data ?? []).map((s) => ({ id: s.id, name: s.name })),
        // );

        const hiddenSubjects = ["gido", "jydo", "cywo"];

        setSubjects(
          (subjectsRes.data ?? [])
            .filter(
              (s) => !hiddenSubjects.includes(s.name?.toLowerCase().trim()),
            )
            .map((s) => ({ id: s.id, name: s.name })),
        );

        const india = (countriesRes.data ?? []).find(
          (c) => c.name?.toLowerCase().trim() === "india",
        );
        if (india) setSelectedCountry(india.id);
      } catch (e) {
        console.error(e);
        setFetchError("Failed to load master data");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  /* ────── 2. Cascade location filters ────── */
  useEffect(() => {
    setFilteredStates(states.filter((s) => s.country_id === selectedCountry));
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSelectedCenter("");
  }, [selectedCountry, states]);

  useEffect(() => {
    setFilteredDistricts(districts.filter((d) => d.state_id === selectedState));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSelectedCenter("");
  }, [selectedState, districts]);

  useEffect(() => {
    setFilteredCities(cities.filter((c) => c.district_id === selectedDistrict));
    setSelectedCity("");
    setSelectedSchoolIds([]);
    setSelectedCenter("");
  }, [selectedDistrict, cities]);

  /* ────── 3. FETCH SCHOOLS ────── */
  const fetchSchools = useCallback(async () => {
    if (!selectedCountry) {
      setSchoolOptions([]);
      return;
    }
    try {
      setIsLoading(true);
      const params = {
        country: selectedCountry || null,
        state: selectedState || null,
        district: selectedDistrict || null,
        city: selectedCity || null,
      };
      const { data } = await axios.get(
        `${API_BASE_URL}/api/get/school-filter`,
        { params },
      );

      if (data.success) {
        const list = data.data
          .flatMap((loc) => loc.schools)
          .map((s) => ({ id: s.id, name: s.name }));
        setSchoolOptions(list);
      } else {
        setSchoolOptions([]);
        setFetchError("No schools found");
      }
    } catch (e) {
      console.error(e);
      setSchoolOptions([]);
      setFetchError("Failed to fetch schools");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  /* ────── 4. FETCH STUDENT COUNT & LIST ────── */
  const fetchStudentCount = useCallback(async () => {
    if (
      selectedSchoolIds.length === 0 ||
      selectedClassIds.length === 0 ||
      selectedSubjectIds.length === 0
    ) {
      setTotalCount(0);
      setClassWiseCounts({});
      setStudents([]);
      setExamDate(null);
      setSelectedCenter("");
      return;
    }

    try {
      setIsLoading(true);

      const allResults = await Promise.all(
        selectedSchoolIds.map(async (sid) => {
          const { data } = await axios.post(
            `${API_BASE_URL}/api/get/student/filter`,
            {
              school_id: sid,
              classList: selectedClassIds,
              subjectList: selectedSubjectIds,
              level: selectedLevel,
            },
          );
          return data;
        }),
      );

      const allStudents = allResults.flatMap((r) => r.students ?? []);
      const totalCount = allResults.reduce(
        (sum, r) => sum + (r.totalCount ?? 0),
        0,
      );
      const exam_date = allResults[0]?.exam_date ?? null;
      const center_name = allResults[0]?.center_name ?? null;

      const classCounts = {};
      selectedClassIds.forEach((cid) => {
        const cls = classes.find((c) => c.id === cid);
        const name = cls?.name ?? `Class ${cid}`;
        classCounts[name] = allStudents.filter(
          (s) => s.class_name === name,
        ).length;
      });

      setTotalCount(totalCount);
      setClassWiseCounts(classCounts);
      setStudents(allStudents);
      setExamDate(exam_date);

      if (selectedLevel === "level_2" && center_name) {
        const centre = centers.find((c) => c.center_name === center_name);
        setSelectedCenter(centre?.id ?? "");
      } else {
        setSelectedCenter("");
      }
    } catch (e) {
      console.error(e);
      setFetchError("Failed to fetch students");
      setTotalCount(0);
      setClassWiseCounts({});
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedSchoolIds,
    selectedClassIds,
    selectedSubjectIds,
    selectedLevel,
    classes,
    centers,
  ]);

  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchStudentCount, 400);
    return () => clearTimeout(debounceRef.current);
  }, [fetchStudentCount]);

  /* ────── 5. PDF Generation ────── */
  const getOMRSheetComponent = (className) => {
    const lower = ["01", "02", "03", "1", "2", "3"];
    const num = className?.replace(/\D/g, "") ?? "";
    return lower.includes(num) ? OMRSheet50 : OMRSheet60;
  };

  const generatePDF = async (students, recordId) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let validSheets = 0;
    const batchSize = 10;
    const parallelLimit = 3;
    let currentSheetIdx = 0;

    const studentsById = students.reduce((acc, s) => {
      if (
        !s.id ||
        !s.student_name ||
        !s.roll_no ||
        !s.class_name ||
        !s.subject_name
      )
        return acc;
      if (!acc[s.id]) {
        acc[s.id] = {
          id: s.id,
          student_name: s.student_name,
          roll_no: s.roll_no,
          class_name: s.class_name,
          school_id: s.school_id,
          subjects: [],
        };
      }
      acc[s.id].subjects.push(s.subject_name);
      return acc;
    }, {});

    const studentList = Object.values(studentsById);
    const studentSubjects = [];
    for (const stu of studentList) {
      for (const sub of stu.subjects) {
        studentSubjects.push({ ...stu, subject: sub });
      }
    }

    const totalSheets = studentSubjects.length;
    const totalBatches = Math.ceil(totalSheets / batchSize);
    const chunkArray = (arr, size) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size)
        chunks.push(arr.slice(i, i + size));
      return chunks;
    };

    const chunks = chunkArray(studentSubjects, batchSize);

    for (let batchIndex = 0; batchIndex < chunks.length; batchIndex++) {
      const batch = chunks[batchIndex];
      currentSheetIdx += batch.length;

      const progress = Math.min((currentSheetIdx / totalSheets) * 80 + 10, 90);
      localStorage.setItem("pdfProgress", JSON.stringify({ progress }));
      window.dispatchEvent(new Event("storage"));

      const parallelChunks = chunkArray(batch, parallelLimit);

      for (const smallGroup of parallelChunks) {
        const renderedPages = await Promise.all(
          smallGroup.map(async (stuSub) => {
            const OMRComp = getOMRSheetComponent(stuSub.class_name);
            const div = document.createElement("div");
            div.style.width = "210mm";
            div.style.height = "297mm";
            div.style.backgroundColor = "white";
            document.body.appendChild(div);

            const subjectId =
              subjects.find((s) => s.name === stuSub.subject)?.id ??
              stuSub.subject;
            const getLevelNum = (lvl) => {
              const map = { level_1: 1, level_2: 2, level_3: 3, level_4: 4 };
              return map[lvl] ?? null;
            };

            const schoolNames = selectedSchoolIds
              .map(
                (sid) => schoolOptions.find((so) => so.id === sid)?.name ?? "",
              )
              .filter(Boolean)
              .join(", ");

            ReactDOM.render(
              <OMRComp
                schoolName={schoolNames}
                student={stuSub.student_name}
                studentId={stuSub.id}
                level={getLevelNum(selectedLevel)}
                subject={stuSub.subject}
                subjectIds={subjectId}
                className={stuSub.class_name}
                classId={
                  classes.find((c) => c.name === stuSub.class_name)?.id ??
                  stuSub.class_name
                }
                rollNumber={stuSub.roll_no}
                omrSet={omrSet}
                examDate={examDate || "Not Available"}
                centerName={
                  centers.find((c) => c.id === selectedCenter)?.center_name ??
                  "Not Available"
                }
              />,
              div,
            );

            const canvas = await html2canvas(div, {
              scale: 2.5,
              useCORS: true,
            });
            const imgData = canvas.toDataURL("image/jpeg", 0.9);
            document.body.removeChild(div);
            return imgData;
          }),
        );

        for (const imgData of renderedPages) {
          validSheets++;
          if (validSheets > 1) doc.addPage();
          const imgW = doc.internal.pageSize.getWidth() - 10;
          const imgH = (297 * imgW) / 210;
          doc.addImage(imgData, "JPEG", 5, 5, imgW, imgH);
        }

        await new Promise((r) => setTimeout(r, 50));
      }
    }

    if (!validSheets) throw new Error("No valid sheets");

    const filename = `OMR_Sheets_${new Date().toISOString().slice(0, 10)}.pdf`;
    const blob = doc.output("blob");

    const dataUrl = await new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(blob);
    });

    localStorage.setItem("pdfProgress", JSON.stringify({ progress: 100 }));
    window.dispatchEvent(new Event("storage"));

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();

    return { validStudents: validSheets, filename, pdfBlob: blob, recordId };
  };

  /* ────── 6. SAVE + PDF flow ────── */
  const handleSave = async () => {
    if (!totalCount) {
      Swal.fire({
        icon: "warning",
        title: "No Students",
        text: "Select valid criteria",
      });
      return;
    }

    const missing = [];
    if (!selectedCountry) missing.push("Country");
    if (!selectedState) missing.push("State");
    if (!selectedDistrict) missing.push("District");
    if (!hideCity && !selectedCity) missing.push("City"); // Only if not hidden
    if (selectedSchoolIds.length === 0) missing.push("School");
    if (!selectedLevel) missing.push("Level");
    if (!selectedModel) missing.push("Mode");
    if (!omrSet) missing.push("OMR Set");
    if (selectedLevel === "level_2" && !selectedCenter) missing.push("Center");
    if (missing.length) {
      Swal.fire({ icon: "error", title: "Missing", text: missing.join(", ") });
      return;
    }

    try {
      setIsGenerating(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Auth missing");

      localStorage.setItem("pdfProgress", JSON.stringify({ progress: 10 }));
      window.dispatchEvent(new Event("storage"));

      const { data } = await axios.post(
        `${API_BASE_URL}/api/get/student/filter`,
        {
          school_id: selectedSchoolIds,
          classList: selectedClassIds,
          subjectList: selectedSubjectIds,
          level: selectedLevel,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!data.students?.length) throw new Error("No students");

      const studentIds = data.students
        .filter((s) => s.id && !isNaN(s.id))
        .map((s) => Number(s.id));

      const payload = {
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
        city: hideCity ? null : selectedCity, // Don't send if hidden
        school: selectedSchoolIds,
        center_id: selectedCenter ? Number(selectedCenter) : null,
        classes: selectedClassIds.map(
          (id) => classes.find((c) => c.id === id)?.name ?? `Class ${id}`,
        ),
        subjects: selectedSubjectIds.map(
          (id) => subjects.find((s) => s.id === id)?.name ?? `Subject ${id}`,
        ),
        student_count: studentIds.length,
        level: selectedLevel,
        mode: selectedModel,
        exam_date: examDate,
        omr_set: omrSet,
        generation_date: new Date().toISOString(),
        students: JSON.stringify(studentIds),
        class_count: JSON.stringify(classWiseCounts),
      };

      const form = new FormData();
      form.append("data", JSON.stringify([payload]));

      const saveRes = await axios.post(
        `${API_BASE_URL}/api/omr/generator`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const recordId = saveRes.data.insertedIds?.[0];
      if (!recordId) throw new Error("Save failed");

      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "PDF is being generated…",
      }).then(() => navigate("/omr-create"));

      const { validStudents, filename, pdfBlob } = await generatePDF(
        data.students,
        recordId,
      );

      const upd = new FormData();
      upd.append("pdf", pdfBlob, filename);
      await axios.put(`${API_BASE_URL}/api/omr/omr/filename/${recordId}`, upd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Done!",
        text: `${validStudents} sheets generated`,
      }).then(() => window.location.reload());
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message || "Something went wrong",
      });
    } finally {
      setIsGenerating(false);
      localStorage.setItem("pdfProgress", JSON.stringify({ progress: 0 }));
      window.dispatchEvent(new Event("storage"));
    }
  };

  /* ────── 7. Dropdown options (memoised) ────── */
  const dropdownOptions = useMemo(
    () => ({
      countries: countries.map((c) => ({ value: c.id, label: c.name })),
      states: filteredStates.map((s) => ({ value: s.id, label: s.name })),
      districts: filteredDistricts.map((d) => ({ value: d.id, label: d.name })),
      cities: filteredCities.map((c) => ({ value: c.id, label: c.name })),
      centers: centers.map((c) => ({ value: c.id, label: c.center_name })),
      classes: classes.map((c) => ({ value: c.id, label: c.name })),
      subjects: subjects.map((s) => ({ value: s.id, label: s.name })),
      levels: [
        { value: "level_1", label: "Level 1" },
        { value: "level_2", label: "Level 2" },
        { value: "level_3", label: "Level 3" },
        { value: "level_4", label: "Level 4" },
      ],
      modes: [
        { value: "Online", label: "Online" },
        { value: "Offline", label: "Offline" },
      ],
      omrSets: [
        { value: "A", label: "Set A" },
        { value: "B", label: "Set B" },
        { value: "C", label: "Set C" },
        { value: "D", label: "Set D" },
        { value: "E", label: "Set E" },
        { value: "F", label: "Set F" },
        { value: "G", label: "Set G" },
        { value: "H", label: "Set H" },
      ],
    }),
    [
      countries,
      filteredStates,
      filteredDistricts,
      filteredCities,
      centers,
      classes,
      subjects,
    ],
  );

  /* ────── 8. UI ────── */
  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[{ name: "OMR", link: "/omr-list" }, { name: "Create OMR" }]}
        />
      </div>

      <Container component="main" maxWidth="">
        <Paper
          className={styles.main}
          elevation={3}
          style={{ padding: "20px", marginTop: "16px" }}
        >
          <Typography className={`${styles.formTitle} mb-4`}>
            Create OMR Schedule
          </Typography>

          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* ---------- LEVEL (with city clear) ---------- */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Level"
                  value={selectedLevel}
                  options={dropdownOptions.levels}
                  onChange={(e) => {
                    const newLevel = e.target.value;
                    setSelectedLevel(newLevel);
                    if (["level_2", "level_3", "level_4"].includes(newLevel)) {
                      setSelectedCity(""); // Clear city
                    }
                    if (newLevel !== "level_2") setSelectedCenter("");
                  }}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {/* ---------- LOCATION ---------- */}
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Country"
                  value={selectedCountry}
                  options={dropdownOptions.countries}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={dropdownOptions.states}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry || isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="District"
                  value={selectedDistrict}
                  options={dropdownOptions.districts}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState || isLoading}
                />
              </Grid>

              {/* CITY - HIDDEN FOR LEVEL 2,3,4 */}
              {!hideCity && (
                <Grid item xs={12} sm={6} md={3}>
                  <Dropdown
                    label="City"
                    value={selectedCity}
                    options={dropdownOptions.cities}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedDistrict || isLoading}
                  />
                </Grid>
              )}

              {/* ---------- MULTI SCHOOL ---------- */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Schools (multi)</InputLabel>
                  <Select
                    multiple
                    value={selectedSchoolIds}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes(0)) {
                        setSelectedSchoolIds(
                          selectedSchoolIds.length === schoolOptions.length
                            ? []
                            : schoolOptions.map((s) => s.id),
                        );
                      } else {
                        setSelectedSchoolIds(val.filter((v) => v !== 0));
                      }
                    }}
                    input={<OutlinedInput label="Schools (multi)" />}
                    renderValue={(selected) => {
                      const total = schoolOptions.length;
                      if (selected.length === total && total > 0) {
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            <Chip
                              label={`All Schools (${total})`}
                              size="small"
                              sx={{
                                backgroundColor: "#1230ae",
                                color: "#fff",
                                "& .MuiChip-label": { color: "#fff" },
                              }}
                            />
                          </Box>
                        );
                      }
                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((id) => {
                            const sch = schoolOptions.find((s) => s.id === id);
                            return (
                              <Chip
                                key={id}
                                label={sch?.name ?? id}
                                size="small"
                                sx={{
                                  backgroundColor: "#1230ae",
                                  color: "#fff",
                                  "& .MuiChip-label": { color: "#fff" },
                                }}
                              />
                            );
                          })}
                        </Box>
                      );
                    }}
                  >
                    <MenuItem value={0}>
                      <em>
                        {selectedSchoolIds.length === schoolOptions.length
                          ? "Deselect All"
                          : "Select All"}
                      </em>
                    </MenuItem>
                    {schoolOptions.map((sch) => (
                      <MenuItem key={sch.id} value={sch.id}>
                        {sch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* ---------- CLASSES & SUBJECTS ---------- */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Classes</InputLabel>
                  <Select
                    label="Classes"
                    multiple
                    value={selectedClassIds}
                    onChange={(e) => setSelectedClassIds(e.target.value)}
                    renderValue={(sel) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {sel.map((id) => {
                          const cls = classes.find((c) => c.id === id);
                          return (
                            <Chip
                              key={id}
                              label={cls?.name ?? id}
                              size="small"
                              sx={{
                                backgroundColor: "#1230ae",
                                color: "#fff",
                                "& .MuiChip-label": { color: "#fff" },
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {classes.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={isLoading}
                >
                  <InputLabel>Subjects</InputLabel>
                  <Select
                    label="Subjects"
                    multiple
                    value={selectedSubjectIds}
                    onChange={(e) => setSelectedSubjectIds(e.target.value)}
                    renderValue={(sel) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {sel.map((id) => {
                          const sub = subjects.find((s) => s.id === id);
                          return (
                            <Chip
                              key={id}
                              label={sub?.name ?? id}
                              size="small"
                              sx={{
                                backgroundColor: "#1230ae",
                                color: "#fff",
                                "& .MuiChip-label": { color: "#fff" },
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {subjects.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Mode"
                  value={selectedModel}
                  options={dropdownOptions.modes}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Dropdown
                  label="Question Set"
                  value={omrSet}
                  options={dropdownOptions.omrSets}
                  onChange={(e) => setOmrSet(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>

              {/* ---------- CENTER (only level 2) ---------- */}
              {selectedLevel === "level_2" && (
                <Grid item xs={12} sm={6} md={3}>
                  <Dropdown
                    label="Center"
                    value={selectedCenter}
                    options={dropdownOptions.centers}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    disabled={isLoading || !centers.length}
                  />
                </Grid>
              )}
            </Grid>

            {/* ---------- STUDENT SUMMARY ---------- */}
            <Box mt={3} mb={3}>
              {totalCount > 0 ? (
                <Typography variant="h6" color="primary">
                  Total Students: {totalCount}
                </Typography>
              ) : (
                selectedSchoolIds.length > 0 &&
                selectedClassIds.length > 0 &&
                selectedSubjectIds.length > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    No students found for the selected criteria
                  </Typography>
                )
              )}
            </Box>

            {/* ---------- STUDENT TABLE ---------- */}
            {students.length > 0 && (
              <Box mt={3} mb={3}>
                {/* <TableContainer>
                  <Table sx={{ borderCollapse: "collapse" }}>
                    <TableHead>
                      <TableRow>
                        {[
                          "Student Name",
                          "Roll Number",
                          "Class",
                          "Subject",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              border: "1px solid #ccc",
                              backgroundColor: "#1976d2",
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedStudents.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {s.student_name || "N/A"}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {s.roll_no || "N/A"}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {s.class_name || "N/A"}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {s.subject_name || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> */}

                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: 450,
                    overflowX: "auto",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    borderRadius: "10px",
                  }}
                >
                  <Table stickyHeader sx={{ minWidth: 1200, border: "none" }}>
                    {/* HEADER */}
                    <TableHead>
                      <TableRow>
                        {/* CHECKBOX HEADER */}
                        <TableCell
                          padding="checkbox"
                          sx={{ bgcolor: "rgb(17 61 236)", color: "#fff" }}
                        >
                          <Checkbox size="small" sx={{ color: "#fff" }} />
                        </TableCell>

                        {[
                          "Student Name",
                          "Roll Number",
                          "Class",
                          "Subject",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              bgcolor: "rgb(17 61 236)",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "13.5px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    {/* BODY */}
                    <TableBody>
                      {paginatedStudents.length > 0 ? (
                        paginatedStudents.map((s, i) => {
                          const studentId = s.id ?? i;

                          return (
                            <TableRow
                              key={i}
                              hover
                              sx={{
                                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                                borderBottom: "1px solid rgba(0,0,0,0.08)",
                              }}
                            >
                              {/* CHECKBOX */}
                              <TableCell padding="checkbox">
                                {/* <Checkbox
                  size="small"
                  checked={selectedStudents.includes(studentId)}
                  onChange={() => {
                    setSelectedStudents((prev) =>
                      prev.includes(studentId)
                        ? prev.filter((id) => id !== studentId)
                        : [...prev, studentId]
                    );
                  }}
                  sx={{
                    color: "#1230AE",
                    "&.Mui-checked": { color: "#1230AE" },
                  }}
                /> */}
                              </TableCell>

                              <TableCell>{s.student_name || "-"}</TableCell>
                              <TableCell>{s.roll_no || "-"}</TableCell>
                              <TableCell>{s.class_name || "-"}</TableCell>
                              <TableCell>{s.subject_name || "-"}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                            No students found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                  }}
                >
                  <ButtonComp
                    text={<UilAngleLeftB />}
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                  />
                  <Typography variant="body2">
                    Page {page} of {totalPages} ({totalRecords} records)
                  </Typography>
                  <ButtonComp
                    text={<UilAngleRightB />}
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                  />
                </div>
              </Box>
            )}

            {/* ---------- ACTION BUTTONS ---------- */}
            <Box
              className={`${styles.buttonContainer} mt-4`}
              sx={{ display: "flex", gap: 2 }}
            >
              <ButtonComp
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={
                  !selectedSchoolIds.length ||
                  !selectedClassIds.length ||
                  !selectedSubjectIds.length ||
                  !selectedLevel ||
                  !selectedModel ||
                  !omrSet ||
                  (selectedLevel === "level_2" && !selectedCenter) ||
                  (!hideCity && !selectedCity) ||
                  isLoading ||
                  isGenerating ||
                  !totalCount
                }
                text={isGenerating ? "Generating…" : "Generate PDF"}
                sx={{ flexGrow: 1 }}
              />
              <ButtonComp
                text="Cancel"
                onClick={() => navigate("/omr-list")}
                disabled={isLoading || isGenerating}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </form>
        </Paper>
      </Container>
    </Mainlayout>
  );
};

export default ExaminationForm;
