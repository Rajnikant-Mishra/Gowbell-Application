import React, { useState, useRef, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import Mainlayout from "../Layouts/Mainlayout";
import axios from "axios";
import styles from "./Dashboard.module.css";
import cardimg1 from "../../../public/Path 195.svg";
import cardimg2 from "../../../public/Path 196.svg";
import cardimg3 from "../../../public/Path 197.svg";
import cardimg4 from "../../../public/Path 198.svg";
import {
  UilCalendarAlt,
  UilUser,
  UilAngleDown,
  UilAngleLeft,
  UilAngleRight,
  UilHouseUser,
  UilHistory,
  UilBookReader,
  UilBook,
  UilDatabase,
  UilEditAlt,
  UilEye,
  UilLocationPinAlt,
} from "@iconscout/react-unicons";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
} from "ag-grid-community";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Select,
  Avatar,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// Register AG Grid modules
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
]);

const Dashboard = () => {
  const scrollWrapperRef = useRef(null);
  const notificationRefs = useRef([]);
  const gridRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState("year");
  const [notifications, setNotifications] = useState([]);
  const [participationData, setParticipationData] = useState([]);
  const [counts, setCounts] = useState({
    totalSchools: 0,
    totalStudents: 0,
    medals: { gold: 0, silver: 0, bronze: 0 },
  });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [omrData, setOmrData] = useState([]);
  const [average, setAverage] = useState(null);
  const [subjectCounts, setSubjectCounts] = useState([]); // New state for subject counts
  const [totalSubjectCount, setTotalSubjectCount] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  // State for dynamic location data
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
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  // Fetch location data on component mount
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [countriesRes, statesRes, districtsRes, citiesRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/countries`),
            axios.get(`${API_BASE_URL}/api/states`),
            axios.get(`${API_BASE_URL}/api/districts`),
            axios.get(`${API_BASE_URL}/api/cities/all/c1`),
          ]);
        const countriesData = Array.isArray(countriesRes?.data)
          ? countriesRes.data
          : [];
        setCountries(countriesData);
        setStates(Array.isArray(statesRes?.data) ? statesRes.data : []);
        setDistricts(
          Array.isArray(districtsRes?.data) ? districtsRes.data : []
        );
        setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);

        // Set default country to India after fetching countries
        const india = countriesData.find(
          (country) => country.name.toLowerCase() === "india"
        );
        if (india) {
          setSelectedCountry(india.id);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        setCountries([]);
        setStates([]);
        setDistricts([]);
        setCities([]);
      }
    };
    fetchLocationData();
  }, []);

  // Handle country change
  useEffect(() => {
    if (selectedCountry && Array.isArray(states)) {
      const filtered = states.filter(
        (state) => state.country_id === selectedCountry
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolId("");
    setSchools([]);
  }, [selectedCountry, states]);

  // Handle state change
  useEffect(() => {
    if (selectedState && Array.isArray(districts)) {
      const filtered = districts.filter(
        (district) => district.state_id === selectedState
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolId("");
    setSchools([]);
  }, [selectedState, districts]);

  // Handle district change
  useEffect(() => {
    if (selectedDistrict && Array.isArray(cities)) {
      const filtered = cities.filter(
        (city) => city.district_id === selectedDistrict
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
    setSelectedCity("");
    setSelectedSchoolId("");
    setSchools([]);
  }, [selectedDistrict, cities]);

  // Fetch schools by city
  const fetchSchoolsByLocation = async () => {
    if (selectedCity) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/schools?city_id=${selectedCity}`
        );
        setSchools(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([]);
      }
    } else {
      setSchools([]);
    }
  };

  // Handle city change
  useEffect(() => {
    fetchSchoolsByLocation();
  }, [selectedCity]);

  // Fetch counts with filters
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      setError(null);

      try {
        const sessionId = localStorage.getItem("currentSessionId") || null;

        const filters = {
          session_id: sessionId || undefined,
          country: selectedCountry || undefined,
          state: selectedState || undefined,
          district: selectedDistrict || undefined,
          city: selectedCity || undefined,
        };

        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const response = await axios.get(
          `${API_BASE_URL}/api/dashboard/counts?${queryParams.toString()}`
        );

        setCounts(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        setCounts({
          totalSchools: 0,
          totalStudents: 0,
          medals: { gold: 0, silver: 0, bronze: 0 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  // Fetch participation data
  useEffect(() => {
    const fetchParticipation = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/dashboard/participation-per-year`
        );
        setParticipationData(response.data.participation || []);
      } catch (err) {
        console.error("Error fetching participation data:", err);
        setParticipationData([]);
      }
    };
    fetchParticipation();
  }, []);

  // Fetch exams
  // useEffect(() => {
  //   const fetchExams = async () => {
  //     try {
  //       const sessionId = localStorage.getItem("currentSessionId") || null;

  //       const response = await axios.get(
  //         `${API_BASE_URL}/api/dashboard/exams`,
  //         { params: { session_id: sessionId } }
  //       );

  //       setExams(response.data.exams || []);
  //     } catch (error) {
  //       console.error("Error fetching exams:", error);
  //       setExams([]);
  //     }
  //   };

  //   fetchExams();
  // }, []);

  // Fetch exams with dynamic location filters
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const sessionId = localStorage.getItem("currentSessionId") || null;

        const filters = {
          session_id: sessionId || undefined,
          country: selectedCountry || undefined,
          state: selectedState || undefined,
          district: selectedDistrict || undefined,
          city: selectedCity || undefined,
        };

        // Build query params dynamically
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const response = await axios.get(
          `${API_BASE_URL}/api/dashboard/exams?${queryParams.toString()}`
        );

        setExams(response.data.exams || []);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setExams([]);
      }
    };

    fetchExams();
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  // Fetch subject counts with filters
  useEffect(() => {
    const fetchSubjectCounts = async () => {
      try {
        const sessionId = localStorage.getItem("currentSessionId") || null;

        const filters = {
          session_id: sessionId || undefined,
          country: selectedCountry || undefined,
          state: selectedState || undefined,
          district: selectedDistrict || undefined,
          city: selectedCity || undefined,
        };

        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const response = await axios.get(
          `${API_BASE_URL}/api/dashboard/students-per-subject?${queryParams.toString()}`
        );

        if (response.data.success) {
          setSubjectCounts(response.data.subjects || []);
          setTotalSubjectCount(response.data.total_count || 0);
        } else {
          setSubjectCounts([]);
        }
      } catch (error) {
        console.error("Error fetching subject counts:", error);
        setSubjectCounts([]);
      }
    };

    fetchSubjectCounts();
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  // Fetch OMR data with filters
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const fetchOmrData = async () => {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem("currentSessionId") || null;

        // Build filters
        const filters = {
          session_id: sessionId ?? undefined,
          country: selectedCountry ?? undefined,
          state: selectedState ?? undefined,
          district: selectedDistrict ?? undefined,
          city: selectedCity ?? undefined,
        };

        // Remove null/undefined/empty string
        const params = Object.fromEntries(
          Object.entries(filters).filter(
            ([, v]) => v !== undefined && v !== null && v !== ""
          )
        );

        const response = await axios.get(
          `${API_BASE_URL}/api/dashboard/omr-data`,
          { params, signal: controller.signal }
        );

        if (mounted && response.data.success) {
          setOmrData(response.data.data);
        }
      } catch (err) {
        const isAbort =
          err?.name === "CanceledError" ||
          axios.isCancel?.(err) ||
          err?.message === "canceled";
        if (!isAbort) {
          console.error("Error fetching OMR data:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOmrData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [
    selectedCountry,
    selectedState,
    selectedDistrict,
    selectedCity,
    API_BASE_URL,
  ]);

  //percentage avaerage
  // useEffect(() => {
  //   const fetchAverage = async () => {
  //     try {
  //       const sessionId = localStorage.getItem("currentSessionId") || null;

  //       // Build filters object
  //       const filters = {
  //         session_id: sessionId || undefined,
  //         country: selectedCountry || undefined,
  //         state: selectedState || undefined,
  //         district: selectedDistrict || undefined,
  //         city: selectedCity || undefined,
  //       };

  //       // Remove undefined values from filters
  //       const params = {};
  //       Object.entries(filters).forEach(([key, value]) => {
  //         if (value) params[key] = value;
  //       });

  //       const response = await axios.get(
  //         `${API_BASE_URL}/api/dashboard/average-percentage`,
  //         { params }
  //       );

  //       setAverage(response.data.data.average_percentage || 0);
  //     } catch (error) {
  //       console.error("Error fetching average percentage:", error);
  //       setAverage(0);
  //     }
  //   };

  //   fetchAverage();
  // }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const sessionId = localStorage.getItem("currentSessionId");

        // Build filters object
        const filters = {
          session_id: sessionId || undefined,
          country: selectedCountry || undefined,
          state: selectedState || undefined,
          district: selectedDistrict || undefined,
          city: selectedCity || undefined,
        };

        // Remove undefined values
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value)
        );

        const { data } = await axios.get(
          `${API_BASE_URL}/api/dashboard/average-percentage`,
          { params }
        );

        // Safely access values
        setAverage(data?.data?.average_percentage ?? 0);
        setPercentageChange(data?.data?.percentageChange ?? 0);
      } catch (error) {
        console.error("Error fetching average percentage:", error);
        setAverage(0);
        setPercentageChange(0);
      }
    };

    fetchAverage();
  }, [selectedCountry, selectedState, selectedDistrict, selectedCity]);

  // Process chart data for participation
  const processedChartData = useMemo(() => {
    if (participationData.length === 0) {
      return {
        series: [],
        options: {
          xaxis: { categories: [] },
        },
      };
    }

    const yearMap = {};
    participationData.forEach((item) => {
      const year = item.session;
      if (!yearMap[year]) {
        yearMap[year] = 0;
      }
      yearMap[year] += parseInt(item.total_students || 0);
    });

    const years = Object.keys(yearMap).sort((a, b) => b - a);
    const data = years.map((year) => yearMap[year]);

    return {
      series: [{ name: "Total Students", data }],
      options: {
        chart: { id: "student-participation", toolbar: { show: false } },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 4,
            borderRadiusApplication: "end",
            columnWidth: "10%",
          },
        },
        stroke: { show: false },
        dataLabels: { enabled: false },
        xaxis: {
          categories: years,
        },
        fill: {
          type: "gradient",
          gradient: {
            type: "vertical",
            shadeIntensity: 1,
            gradientToColors: ["#508FF4"],
            stops: [0, 100],
            colorStops: [
              { offset: 0, color: "#83C9FC", opacity: 1 },
              { offset: 70, color: "#508FF4", opacity: 1 },
            ],
          },
        },
        grid: { borderColor: "#F1F1F1" },
        yaxis: {
          labels: {
            formatter: function (val) {
              return "" + val;
            },
          },
        },
        colors: ["#508FF4"],
      },
    };
  }, [participationData]);

  // Prepare chart data for subjects
  const subjectChartData = useMemo(() => {
    return subjectCounts.map((subject) => ({
      name: subject.name,
      count: subject.count,
    }));
  }, [subjectCounts]);

  // Compute top and lowest subjects
  const { topSubject, lowestSubject } = useMemo(() => {
    if (subjectCounts.length === 0) {
      return { topSubject: null, lowestSubject: null };
    }

    const sortedSubjects = [...subjectCounts].sort((a, b) => b.count - a.count);
    return {
      topSubject: sortedSubjects[0],
      lowestSubject: sortedSubjects[sortedSubjects.length - 1],
    };
  }, [subjectCounts]);

  // Prepare options for dropdowns
  const countryOptions = Array.isArray(countries)
    ? countries.map((country) => ({
        value: country.id,
        label: country.name,
      }))
    : [];
  const stateOptions = Array.isArray(filteredStates)
    ? filteredStates.map((state) => ({
        value: state.id,
        label: state.name,
      }))
    : [];
  const districtOptions = Array.isArray(filteredDistricts)
    ? filteredDistricts.map((district) => ({
        value: district.id,
        label: district.name,
      }))
    : [];
  const cityOptions = Array.isArray(filteredCities)
    ? filteredCities.map((city) => ({
        value: city.id,
        label: city.name,
      }))
    : [];

  // Handle dropdown changes
  const handleChange = (field, value) => {
    if (field === "country") setSelectedCountry(value);
    if (field === "state") setSelectedState(value);
    if (field === "district") setSelectedDistrict(value);
    if (field === "city") setSelectedCity(value);
  };

  // Reset all selections
  const handleReset = () => {
    const india = countries.find(
      (country) => country.name.toLowerCase() === "india"
    );
    setSelectedCountry(india ? india.id : "");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedSchoolId("");
    setSchools([]);
    setSubjectCounts([]);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const chartOptions = processedChartData.options;
  const chartSeries = processedChartData.series;

  const registrationData = [
    { month: "Aug", registrations: 5000 },
    { month: "Sep", registrations: 6000 },
    { month: "Oct", registrations: 7500 },
    { month: "Nov", registrations: 8500 },
    { month: "Dec", registrations: 12000 },
    { month: "Jan", registrations: 10500 },
    { month: "Feb", registrations: 9500 },
    { month: "Mar", registrations: 8200 },
    { month: "Apr", registrations: 7200 },
    { month: "May", registrations: 6500 },
    { month: "Jun", registrations: 5800 },
    { month: "Jul", registrations: 6200 },
  ];

  return (
    <Mainlayout>
      <div className={styles.dashboardContainer}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Card className={styles.topcard} sx={{ width: "100%" }}>
              <CardContent sx={{ p: 1.5 }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6} md={1.2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Country</InputLabel>
                      <Select
                        label="country"
                        value={selectedCountry}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                      >
                        {countryOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>State</InputLabel>
                      <Select
                        label="state"
                        value={selectedState}
                        onChange={(e) => handleChange("state", e.target.value)}
                        disabled={!selectedCountry}
                      >
                        {stateOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>District</InputLabel>
                      <Select
                        label="district"
                        value={selectedDistrict}
                        onChange={(e) =>
                          handleChange("district", e.target.value)
                        }
                        disabled={!selectedState}
                      >
                        {districtOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>City</InputLabel>
                      <Select
                        label="city"
                        value={selectedCity}
                        onChange={(e) => handleChange("city", e.target.value)}
                        disabled={!selectedDistrict}
                      >
                        {cityOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="medium"
                      onClick={handleReset}
                      className={styles.resetBtn}
                      startIcon={<RestartAltIcon />}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div className={styles.cardsContainer}>
          <div className={`${styles.card} ${styles.totalExams}`}>
            <div className={styles.cardHeader}>
              <UilHouseUser className={styles.icon} />
              <h3 className={styles.title}>Total Schools</h3>
            </div>
            <div className={styles.value}>
              <h1 className="my-auto">+ {counts.totalSchools}</h1>
            </div>
            <div className={styles.subtitle}>
              {counts.schoolChangePercentage} vs last session
            </div>
          </div>
          <div className={`${styles.card} ${styles.totalStudents}`}>
            <div className={styles.cardHeader}>
              <UilBookReader className={styles.icon} />
              <h3 className={styles.title}>Total Students</h3>
            </div>
            <div className={styles.value}>
              <h1 className="my-auto">+ {counts.totalStudents}</h1>
            </div>
            <div className={styles.subtitle}>
              {counts.studentChangePercentage} vs last session
            </div>
          </div>
          <div className={`${styles.card} ${styles.averageScores}`}>
            <div className={styles.cardHeader}>
              <UilDatabase className={styles.icon} />
              <h3 className={styles.title}>Average Scores</h3>
            </div>
            <div className={styles.value}>
              <h1 className="my-auto">
                {average !== null && !isNaN(Number(average))
                  ? Number(average).toFixed(2) + " %"
                  : "N/A"}
              </h1>
            </div>
            <div className={styles.subtitle}>
              {percentageChange >= 0
                ? `+${percentageChange}%`
                : `${percentageChange}%`}{" "}
              vs previous session
            </div>
          </div>
          <div className={`${styles.card} ${styles.activeUsers}`}>
            <div className={styles.cardHeader}>
              <UilBook className={styles.icon} />
              <h3 className={styles.title}>Exam Status</h3>
            </div>
            <div className={styles.value}>
              <h1 className="my-auto">4 Level</h1>
            </div>
            <div className={styles.subtitle}>2 Ongoing</div>
          </div>
        </div>
        {/* 
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <div className={styles.chartContainer}>
            <h3 className={styles.fontSize}>Student Participation</h3>
            <div className={styles.filterButtons}></div>
            {participationData.length === 0 ? (
              <p>No data available</p>
            ) : (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height="180"
              />
            )}
          </div>

          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography
                  className={styles.fontSize}
                  variant="h6"
                  fontWeight={600}
                >
                  Total Number of Students by Subject
                </Typography>
                <Typography variant="body2" sx={{ color: "#ef8915" }}>
                 
                  Total Subjects: {totalSubjectCount}
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count">
                    {subjectChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#274ce1", // Blue
                            "#ff6384", // Pink
                            "#36a2eb", // Light Blue
                            "#ffce56", // Yellow
                            "#4caf50", // Green
                            "#9c27b0", // Purple
                            "#ff9800", // Orange
                          ][index % 7] // rotate colors if more subjects
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.85rem", color: "#ef8915" }}
                >
                  {topSubject
                    ? `Top Subject: ${topSubject.name} (${topSubject.count} students)`
                    : "Top Subject: N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.85rem", color: "#ef8915" }}
                >
                  {lowestSubject
                    ? `Lowest Subject: ${lowestSubject.name} (${lowestSubject.count} students)`
                    : "Lowest Subject: N/A"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box> */}

        <Box sx={{}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      className={styles.fontSize}
                      variant="h6"
                      fontWeight={600}
                    >
                      Student Participation
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    {participationData.length === 0 ? (
                      <p>No data available</p>
                    ) : (
                      <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="bar"
                        height="180"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      className={styles.fontSize}
                      variant="h6"
                      fontWeight={600}
                    >
                      Total Number of Students by Subject
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#ef8915", cursor: "pointer" }}
                    >
                      Total Subjects: {totalSubjectCount}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      border: "1px solid #e8f8f9ff",
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      maxHeight: 255,
                    }}
                  >
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={subjectChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count">
                          {subjectChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                [
                                  "#274ce1", // Blue
                                  "#ff6384", // Pink
                                  "#36a2eb", // Light Blue
                                  "#ffce56", // Yellow
                                  "#4caf50", // Green
                                  "#9c27b0", // Purple
                                  "#ff9800", // Orange
                                ][index % 7] // rotate colors if more subjects
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.85rem", color: "#ef8915" }}
                    >
                      {topSubject
                        ? `Top Subject: ${topSubject.name} (${topSubject.count} students)`
                        : "Top Subject: N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.85rem", color: "#ef8915" }}
                    >
                      {lowestSubject
                        ? `Lowest Subject: ${lowestSubject.name} (${lowestSubject.count} students)`
                        : "Lowest Subject: N/A"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      className={styles.fontSize}
                      variant="h6"
                      fontWeight={600}
                    >
                      Upcoming / Recent Exams
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <Table
                      size="small"
                      sx={{
                        border: "1px solid #5374f8ff",
                        "& .MuiTableCell-root": {
                          borderBottom: "1px solid #5374f8ff",
                          borderRight: "none",
                          borderLeft: "none",
                          height: "35px",
                        },
                      }}
                    >
                      <TableHead sx={{ backgroundColor: "#5374f8ff" }}>
                        <TableRow>
                          <TableCell
                            sx={{ color: "#f4f9ff", fontWeight: "bold" }}
                          >
                            Exam
                          </TableCell>
                          <TableCell
                            sx={{ color: "#f4f9ff", fontWeight: "bold" }}
                          >
                            Level
                          </TableCell>
                          <TableCell
                            sx={{ color: "#f4f9ff", fontWeight: "bold" }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            sx={{ color: "#f4f9ff", fontWeight: "bold" }}
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {exams.map((exam, index) => (
                          <TableRow key={index}>
                            <TableCell>{exam.school_name}</TableCell>
                            <TableCell>{exam.level}</TableCell>
                            <TableCell>{exam.exam_date}</TableCell>
                            <TableCell sx={{ color: "green" }}>
                              Scheduled
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      className={styles.fontSize}
                      variant="h6"
                      fontWeight={600}
                    >
                      OMR Batches
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#ef8915", cursor: "pointer" }}
                    >
                      Scan status • Shipments
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid #e8f8f9ff",
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      maxHeight: 255,
                      overflowY: "auto",
                    }}
                  >
                    {omrData.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          border: "1px solid #1230ae",
                          borderRadius: "8px",
                          p: 2,
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography fontWeight={600} color="black">
                            Batch: OMR-{item.exam_date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Exam: {item.subjects} • {item.student_count} sheets
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "green", fontWeight: 500 }}
                        >
                          Scanned: 10 / {item.student_count}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Mainlayout>
  );
};

export default Dashboard;
