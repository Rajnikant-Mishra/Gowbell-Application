
import React, { useEffect, useState, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import styles from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contextsAuthsecurity/AuthContext";
import { UilImport } from "@iconscout/react-unicons";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress, Typography, Box } from "@mui/material";

const Header = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const [currentSessionStatus, setCurrentSessionStatus] = useState("");
  const popupRef = useRef(null);

  // Helpers
  const toLower = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");
  const str = (v) => (v === null || v === undefined ? "" : String(v));
  const extractArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setProfileData(JSON.parse(storedUser));
    else navigate("/");
  }, [navigate]);

  useEffect(() => {
    const decideAdmin = async () => {
      try {
        const userRoleId =
          profileData?.role ?? profileData?.role_id ?? profileData?.roleId;
        const userRoleName =
          profileData?.role_name ?? profileData?.roleName ?? "";

        if (toLower(userRoleName) === "admin") {
          setIsAdmin(true);
          return;
        }

        if (!userRoleId) {
          setIsAdmin(false);
          return;
        }

        const token =
          localStorage.getItem("token") || localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE_URL}/api/r1/role`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            : { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const payload = await res.json();
        const roles = extractArray(payload);

        const adminRole =
          roles.find(
            (r) => toLower(r?.role_name ?? r?.name ?? r?.title) === "admin"
          ) || null;

        const adminRoleId = adminRole
          ? adminRole.id ?? adminRole._id ?? adminRole.role_id
          : "";

        const isAdminById =
          str(adminRoleId) !== "" &&
          str(userRoleId) !== "" &&
          str(adminRoleId) === str(userRoleId);

        setIsAdmin(Boolean(isAdminById));
      } catch (err) {
        console.error("Role check failed:", err);
        setIsAdmin(false);
      }
    };

    if (
      profileData &&
      (profileData.role ||
        profileData.role_id ||
        profileData.roleName ||
        profileData.role_name)
    ) {
      decideAdmin();
    }
  }, [profileData]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchSessions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/session/get-all`);
        if (!response.ok) throw new Error("Failed to fetch sessions");

        const data = await response.json();
        setSessions(Array.isArray(data) ? data : []);

        const savedSession = localStorage.getItem("currentSession");
        const savedSessionId = localStorage.getItem("currentSessionId");
        const activeSession = data.find((s) => s.status === "active");

        if (
          savedSession &&
          savedSessionId &&
          data.some(
            (s) =>
              s.session === savedSession &&
              s.id === parseInt(savedSessionId, 10)
          )
        ) {
          const selected = data.find((s) => s.session === savedSession);
          setCurrentSession(savedSession);
          setCurrentSessionStatus(selected?.status || "");
        } else if (activeSession) {
          setCurrentSession(activeSession.session);
          setCurrentSessionStatus(activeSession.status);
          localStorage.setItem("currentSession", activeSession.session);
          localStorage.setItem("currentSessionId", activeSession.id);
        } else if (data.length > 0) {
          const latest = data[data.length - 1];
          setCurrentSession(latest.session);
          setCurrentSessionStatus(latest.status);
          localStorage.setItem("currentSession", latest.session);
          localStorage.setItem("currentSessionId", latest.id);
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load sessions. Please try again.",
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
        });
        setSessions([]);
      }
    };

    fetchSessions();
  }, [isAdmin]);

  const handleSessionChange = (e) => {
    const newSession = e.target.value;
    const selected = sessions.find((s) => s.session === newSession);
    if (selected) {
      setCurrentSession(newSession);
      setCurrentSessionStatus(selected.status);
      localStorage.setItem("currentSession", newSession);
      localStorage.setItem("currentSessionId", selected.id);
      window.location.reload();
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const progressData = JSON.parse(
        localStorage.getItem("pdfProgress") || '{"progress":0}'
      );
      setProgress(progressData.progress);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/u1/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        logout();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: "You have logged out successfully!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          willClose: () => navigate("/"),
        });
      } else throw new Error("Logout failed");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred during logout. Please try again.",
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <header className="py-3 px-3 border-bottom bg-light">
      <div className="container-fluid px-0">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* Sidebar toggle */}
          <div onClick={toggleSidebar} className="my-auto">
            <RxHamburgerMenu className={styles.hamburgerIcon} />
          </div>

          {/* Right side */}
          <div className="d-flex align-items-center gap-4">
            {/* Session selector */}
            <div className="flex-grow-1 d-flex justify-content-center">
              {isAdmin ? (
                <select
                  value={currentSession}
                  onChange={handleSessionChange}
                  className="form-select"
                  style={{
                    maxWidth: "250px",
                    fontWeight: 500,
                    color:
                      currentSessionStatus === "active" ? "green" : "inherit",
                  }}
                  disabled={sessions.length === 0}
                >
                  {sessions.map((session) => (
                    <option
                      key={session.id}
                      value={session.session}
                      style={{
                        color:
                          session.status === "active" ? "green" : "inherit",
                      }}
                    >
                      {session.session}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  className="text-center px-3 py-1 border rounded"
                  style={{
                    background: "#f8f9fa",
                    fontWeight: 500,
                    color:
                      currentSessionStatus === "active" ? "green" : "inherit",
                    maxWidth: "250px",
                  }}
                >
                  {currentSession || "2025-26"}
                </div>
              )}
            </div>

            {/* Download progress */}
            {/* <div style={{ position: "relative" }} ref={popupRef}>
              <div
                onClick={() => setOpen(!open)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <UilImport size="25" color="#000" />
                {progress > 0 && progress < 100 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-10px",
                      right: "-40px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      background: "linear-gradient(135deg, #3085d6, #90caf9)",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={progress}
                      size={20}
                      thickness={5}
                      sx={{ color: "#fff" }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {`${Math.round(progress)}%`}
                    </Typography>
                  </Box>
                )}
              </div>
            </div> */}

            <div style={{ position: "relative" }} ref={popupRef}>
              <div
                onClick={() => {
                  if (progress === 0 || progress === 100) setOpen(!open); // disable click during download
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    progress > 0 && progress < 100 ? "not-allowed" : "pointer",
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  // background: "#454545ff",
                  // boxShadow: "0 4px 10px rgba(252, 252, 252, 0.3)",
                  transition: "transform 0.25s ease, box-shadow 0.3s ease",
                }}
                // onMouseEnter={(e) => {
                //   if (progress === 0 || progress === 100)
                //     e.currentTarget.style.transform = "scale(1.08)";
                // }}
                // onMouseLeave={(e) =>
                //   (e.currentTarget.style.transform = "scale(1)")
                // }
              >
                {/* Show Icon only when not downloading */}
                {!(progress > 0 && progress < 100) && (
                  <UilImport size="28" color="#242424ff" />
                )}

                {/* Show Circle + % during download */}
                {progress > 0 && progress < 100 && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Animated Blue Circular Progress */}
                    <CircularProgress
                      variant="determinate"
                      value={progress}
                      size={40}
                      thickness={4.3}
                      sx={{
                        color: "#1230ae",
                        animation: "spin 1.5s linear infinite",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    />

                    {/* Percentage text */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#1230ae",
                        fontWeight: "bold",
                        position: "absolute",
                        fontSize: "0.8rem",
                      }}
                    >
                      {`${Math.round(progress)}%`}
                    </Typography>
                  </Box>
                )}
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className={`${styles.dropdowndiv} dropdown text-end`}>
              <a
                href="#"
                className={`${styles.dropdowna} d-flex align-items-center link-dark text-decoration-none dropdown-toggle gap-2`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    profileData.user_profile
                      ? `${API_BASE_URL}/profiles/${profileData.user_profile}`
                      : "https://via.placeholder.com/32" // fallback image
                  }
                  alt="Profile"
                  width="32"
                  height="32"
                  className="rounded-2"
                />

                <p className={`${styles.para} mb-0 d-none d-sm-inline`}>
                  Welcome {profileData.username || "User"}
                </p>
              </a>
              <ul className={`${styles.dropdown} dropdown-menu text-small`}>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
