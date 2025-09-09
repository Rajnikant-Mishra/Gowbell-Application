// import React, { useEffect, useState, useRef } from "react";
// import { RxHamburgerMenu } from "react-icons/rx";
// import styles from "./Header.module.css";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import { UilImport } from "@iconscout/react-unicons";
// import Swal from "sweetalert2";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell } from "@fortawesome/free-solid-svg-icons";
// import { CircularProgress, Typography, Box } from "@mui/material";

// const Header = ({ toggleSidebar }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [profileData, setProfileData] = useState({});
//   const [open, setOpen] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const popupRef = useRef(null);

//   // Load profile data
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setProfileData(JSON.parse(storedUser));
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   // Load download history and progress from localStorage
//   useEffect(() => {
//     const progressData = JSON.parse(
//       localStorage.getItem("pdfProgress") || '{"progress":0}'
//     );
//     setProgress(progressData.progress);
//   }, []);

//   // Update download history and progress on storage change
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const progressData = JSON.parse(
//         localStorage.getItem("pdfProgress") || '{"progress":0}'
//       );
//       setProgress(progressData.progress);
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/u1/users/logout`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.ok) {
//         logout();
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: "You have logged out successfully!",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//           willClose: () => {
//             navigate("/");
//           },
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Logout failed. Please try again.",
//           confirmButtonText: "Retry",
//         });
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "An error occurred during logout. Please try again.",
//         confirmButtonText: "Retry",
//       });
//     }
//   };

//   return (
//     <header className="py-3 px-3 border-bottom bg-light">
//       <div className="container-fluid px-0">
//         <div className="d-flex flex-wrap align-items-center justify-content-between">
//           <p onClick={toggleSidebar} className="my-auto">
//             <RxHamburgerMenu className={styles.hamburgerIcon} />
//           </p>
//           <div className="d-flex align-items-center gap-3">
//             {/* OMR download history with progress bar */}
//             <div
//               style={{
//                 position: "relative",
//                 display: "inline-flex",
//                 alignItems: "center",
//               }}
//               ref={popupRef}
//             >
//               <div
//                 onClick={() => setOpen(!open)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 <UilImport size="25" color="#000" />
//                 {progress > 0 && progress < 100 && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "-10px",
//                       right: "-40px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       background: "linear-gradient(135deg, #3085d6, #90caf9)",
//                       borderRadius: "12px",
//                       padding: "2px 8px",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//                     }}
//                   >
//                     <CircularProgress
//                       variant="determinate"
//                       value={progress}
//                       size={20}
//                       thickness={5}
//                       sx={{ color: "#fff" }}
//                     />
//                     <Typography
//                       variant="caption"
//                       sx={{ color: "#fff", fontWeight: "bold" }}
//                     >
//                       {`${Math.round(progress)}%`}
//                     </Typography>
//                   </Box>
//                 )}
//               </div>
//             </div>

//             <div className={styles.notificationIcon}>
//               <FontAwesomeIcon icon={faBell} />
//             </div>
//             <div className={`${styles.dropdowndiv} dropdown text-end`}>
//               <a
//                 href="#"
//                 className={`${styles.dropdowna} d-flex align-items-center link-dark text-decoration-none dropdown-toggle gap-2`}
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <img
//                   src="https://github.com/mdo.png"
//                   alt="Profile"
//                   width="32"
//                   height="32"
//                   className="rounded-2"
//                 />
//                 <p className={`${styles.para} mb-0`}>
//                   Welcome {profileData.username || "User"}
//                 </p>
//               </a>
//               <ul className={`${styles.dropdown} dropdown-menu text-small`}>
//                 <li>
//                   <Link className="dropdown-item" to="/profile">
//                     Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#" onClick={handleLogout}>
//                     Sign out
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
// export default Header;

// import React, { useEffect, useState, useRef } from "react";
// import { RxHamburgerMenu } from "react-icons/rx";
// import styles from "./Header.module.css";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import { UilImport } from "@iconscout/react-unicons";
// import Swal from "sweetalert2";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell } from "@fortawesome/free-solid-svg-icons";
// import { CircularProgress, Typography, Box } from "@mui/material";

// const Header = ({ toggleSidebar }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [profileData, setProfileData] = useState({});
//   const [open, setOpen] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const popupRef = useRef(null);

//   // States for session handling
//   const [sessions, setSessions] = useState([]); // [{ id, session, status }, ...]
//   const [currentSession, setCurrentSession] = useState("");

//   // Load profile data
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setProfileData(JSON.parse(storedUser));
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   // Fetch session list dynamically from API
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/session/get-all`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch sessions");
//         }
//         const data = await response.json();

//         // Expecting API response: [{ id, session, status }, ...]
//         setSessions(data);

//         // Set current session from localStorage or default to the latest active session
//         const savedSession = localStorage.getItem("currentSession");
//         const activeSession = data.find((item) => item.status === "active");
//         if (
//           savedSession &&
//           data.some((item) => item.session === savedSession)
//         ) {
//           setCurrentSession(savedSession);
//         } else if (activeSession) {
//           setCurrentSession(activeSession.session);
//           localStorage.setItem("currentSession", activeSession.session);
//         } else if (data.length > 0) {
//           setCurrentSession(data[data.length - 1].session);
//           localStorage.setItem("currentSession", data[data.length - 1].session);
//         }
//       } catch (error) {
//         console.error("Error fetching sessions:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load sessions. Please try again.",
//           confirmButtonText: "OK",
//         });
//         setSessions([]);
//       }
//     };

//     fetchSessions();
//   }, []);

//   // Function to update session status
//   const handleSessionUpdate = async (sessionId, sessionName) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ session: sessionName }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         // Update sessions state with new status
//         setSessions((prevSessions) =>
//           prevSessions.map((s) =>
//             s.id === sessionId
//               ? { ...s, status: s.status === "active" ? "inactive" : "active" }
//               : s
//           )
//         );

//         // Update current session if needed
//         setCurrentSession(sessionName);
//         localStorage.setItem("currentSession", sessionName);

//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: result.message,
//           showConfirmButton: false,
//           timer: 4000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//               customClass: {
//           popup: "small-swal",
//         },
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: result.message || "Failed to update session.",
//           confirmButtonText: "OK",
//         });
//       }
//     } catch (error) {
//       console.error("Error updating session:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "An error occurred while updating the session.",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   // Handle session selection
//   const handleSessionChange = (e) => {
//     const newSession = e.target.value;
//     const selectedSession = sessions.find((s) => s.session === newSession);
//     if (selectedSession) {
//       // Optionally update session status if needed
//       handleSessionUpdate(selectedSession.id, newSession);
//     }
//   };

//   // Load download history and progress from localStorage
//   useEffect(() => {
//     const progressData = JSON.parse(
//       localStorage.getItem("pdfProgress") || '{"progress":0}'
//     );
//     setProgress(progressData.progress);
//   }, []);

//   // Update download history and progress on storage change
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const progressData = JSON.parse(
//         localStorage.getItem("pdfProgress") || '{"progress":0}'
//       );
//       setProgress(progressData.progress);
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/u1/users/logout`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.ok) {
//         logout();
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: "You have logged out successfully!",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: {
//             popup: "small-swal",
//           },
//           willClose: () => {
//             navigate("/");
//           },
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Logout failed. Please try again.",
//           confirmButtonText: "Retry",
//         });
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "An error occurred during logout. Please try again.",
//         confirmButtonText: "Retry",
//       });
//     }
//   };

//   return (
//     <header className="py-3 px-3 border-bottom bg-light">
//       <div className="container-fluid px-0">
//         <div className="d-flex flex-wrap align-items-center justify-content-between">
//           {/* Left: Sidebar toggle */}
//           <p onClick={toggleSidebar} className="my-auto">
//             <RxHamburgerMenu className={styles.hamburgerIcon} />
//           </p>

//           {/* Center: Current Session Display */}
//           <div
//             className="flex-grow-1"
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             <h5 style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
//               Current Session: {currentSession}
//             </h5>

//             <select
//               value={currentSession}
//               onChange={handleSessionChange}
//               style={{
//                 padding: "6px 10px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 fontWeight: "500",
//               }}
//             >
//               {sessions.map((session, idx) => (
//                 <option key={idx} value={session.session}>
//                   {session.session} ({session.status})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Right: Dropdown + Profile */}
//           <div className="d-flex align-items-center gap-3">
//             <div
//               style={{
//                 position: "relative",
//                 display: "inline-flex",
//                 alignItems: "center",
//               }}
//               ref={popupRef}
//             >
//               <div
//                 onClick={() => setOpen(!open)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 <UilImport size="25" color="#000" />
//                 {progress > 0 && progress < 100 && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "-10px",
//                       right: "-40px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       background: "linear-gradient(135deg, #3085d6, #90caf9)",
//                       borderRadius: "12px",
//                       padding: "2px 8px",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//                     }}
//                   >
//                     <CircularProgress
//                       variant="determinate"
//                       value={progress}
//                       size={20}
//                       thickness={5}
//                       sx={{ color: "#fff" }}
//                     />
//                     <Typography
//                       variant="caption"
//                       sx={{ color: "#fff", fontWeight: "bold" }}
//                     >
//                       {`${Math.round(progress)}%`}
//                     </Typography>
//                   </Box>
//                 )}
//               </div>
//             </div>

//             <div className={styles.notificationIcon}>
//               <FontAwesomeIcon icon={faBell} />
//             </div>
//             <div className={`${styles.dropdowndiv} dropdown text-end`}>
//               <a
//                 href="#"
//                 className={`${styles.dropdowna} d-flex align-items-center link-dark text-decoration-none dropdown-toggle gap-2`}
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <img
//                   src="https://github.com/mdo.png"
//                   alt="Profile"
//                   width="32"
//                   height="32"
//                   className="rounded-2"
//                 />
//                 <p className={`${styles.para} mb-0`}>
//                   Welcome {profileData.username || "User"}
//                 </p>
//               </a>
//               <ul className={`${styles.dropdown} dropdown-menu text-small`}>
//                 <li>
//                   <Link className="dropdown-item" to="/profile">
//                     Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#" onClick={handleLogout}>
//                     Sign out
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
// export default Header;

//---------------

// import React, { useEffect, useState, useRef } from "react";
// import { RxHamburgerMenu } from "react-icons/rx";
// import styles from "./Header.module.css";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import { UilImport } from "@iconscout/react-unicons";
// import Swal from "sweetalert2";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell } from "@fortawesome/free-solid-svg-icons";
// import { CircularProgress, Typography, Box } from "@mui/material";

// const Header = ({ toggleSidebar }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [profileData, setProfileData] = useState({});
//   const [open, setOpen] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const popupRef = useRef(null);

//   const [sessions, setSessions] = useState([]);
//   const [currentSession, setCurrentSession] = useState("");
//   const [currentSessionStatus, setCurrentSessionStatus] = useState("");

//   // Load profile data
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setProfileData(JSON.parse(storedUser));
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   // Fetch session list dynamically from API
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/session/get-all`);
//         if (!response.ok) throw new Error("Failed to fetch sessions");

//         const data = await response.json();
//         setSessions(data);

//         // Restore or pick latest session
//         const savedSession = localStorage.getItem("currentSession");
//         const activeSession = data.find((s) => s.status === "active");

//         if (savedSession && data.some((s) => s.session === savedSession)) {
//           const selected = data.find((s) => s.session === savedSession);
//           setCurrentSession(savedSession);
//           setCurrentSessionStatus(selected?.status || "");
//         } else if (activeSession) {
//           setCurrentSession(activeSession.session);
//           setCurrentSessionStatus(activeSession.status);
//           localStorage.setItem("currentSession", activeSession.session);
//         } else if (data.length > 0) {
//           const latest = data[data.length - 1];
//           setCurrentSession(latest.session);
//           setCurrentSessionStatus(latest.status);
//           localStorage.setItem("currentSession", latest.session);
//         }
//       } catch {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load sessions. Please try again.",
//           confirmButtonText: "OK",
//         });
//         setSessions([]);
//       }
//     };
//     fetchSessions();
//   }, []);

//   // Handle session selection
//   const handleSessionChange = (e) => {
//     const newSession = e.target.value;
//     const selected = sessions.find((s) => s.session === newSession);
//     if (selected) {
//       setCurrentSession(newSession);
//       setCurrentSessionStatus(selected.status);
//       localStorage.setItem("currentSession", newSession);
//     }
//   };

//   // Load download progress
//   useEffect(() => {
//     const progressData = JSON.parse(
//       localStorage.getItem("pdfProgress") || '{"progress":0}'
//     );
//     setProgress(progressData.progress);
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const progressData = JSON.parse(
//         localStorage.getItem("pdfProgress") || '{"progress":0}'
//       );
//       setProgress(progressData.progress);
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Logout function
//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/u1/users/logout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (response.ok) {
//         logout();
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: "You have logged out successfully!",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//           willClose: () => navigate("/"),
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Logout failed. Please try again.",
//           confirmButtonText: "Retry",
//         });
//       }
//     } catch {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "An error occurred during logout. Please try again.",
//         confirmButtonText: "Retry",
//       });
//     }
//   };

//   return (
//     <header className="py-3 px-3 border-bottom bg-light">
//       <div className="container-fluid px-0">
//         <div className="d-flex flex-wrap align-items-center justify-content-between">
//           {/* Left: Sidebar toggle */}
//           <p onClick={toggleSidebar} className="my-auto">
//             <RxHamburgerMenu className={styles.hamburgerIcon} />
//           </p>

//           {/* Center: Current Session */}
//           <div
//             className="flex-grow-1"
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             <h5 style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
//               Current Session: {currentSession}
//             </h5>

//             <select
//               value={currentSession}
//               onChange={handleSessionChange}
//               style={{
//                 padding: "6px 10px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 fontWeight: "500",
//                 color: currentSessionStatus === "active" ? "green" : "red",
//               }}
//             >
//               {sessions.map((session) => (
//                 <option
//                   key={session.id}
//                   value={session.session}
//                   style={{
//                     color: session.status === "active" ? "green" : "red",
//                   }}
//                 >
//                   {session.session} ({session.status})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Right: Download progress + Profile */}
//           <div className="d-flex align-items-center gap-3">
//             <div style={{ position: "relative" }} ref={popupRef}>
//               <div
//                 onClick={() => setOpen(!open)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                 }}
//               >
//                 <UilImport size="25" color="#000" />
//                 {progress > 0 && progress < 100 && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "-10px",
//                       right: "-40px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       background: "linear-gradient(135deg, #3085d6, #90caf9)",
//                       borderRadius: "12px",
//                       padding: "2px 8px",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//                     }}
//                   >
//                     <CircularProgress
//                       variant="determinate"
//                       value={progress}
//                       size={20}
//                       thickness={5}
//                       sx={{ color: "#fff" }}
//                     />
//                     <Typography
//                       variant="caption"
//                       sx={{ color: "#fff", fontWeight: "bold" }}
//                     >
//                       {`${Math.round(progress)}%`}
//                     </Typography>
//                   </Box>
//                 )}
//               </div>
//             </div>

//             <div className={styles.notificationIcon}>
//               <FontAwesomeIcon icon={faBell} />
//             </div>
//             <div className={`${styles.dropdowndiv} dropdown text-end`}>
//               <a
//                 href="#"
//                 className={`${styles.dropdowna} d-flex align-items-center link-dark text-decoration-none dropdown-toggle gap-2`}
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <img
//                   src="https://github.com/mdo.png"
//                   alt="Profile"
//                   width="32"
//                   height="32"
//                   className="rounded-2"
//                 />
//                 <p className={`${styles.para} mb-0`}>
//                   Welcome {profileData.username || "User"}
//                 </p>
//               </a>
//               <ul className={`${styles.dropdown} dropdown-menu text-small`}>
//                 <li>
//                   <Link className="dropdown-item" to="/profile">
//                     Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#" onClick={handleLogout}>
//                     Sign out
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
// export default Header;

// import React, { useEffect, useState, useRef } from "react";
// import { RxHamburgerMenu } from "react-icons/rx";
// import styles from "./Header.module.css";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import { UilImport } from "@iconscout/react-unicons";
// import Swal from "sweetalert2";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell } from "@fortawesome/free-solid-svg-icons";
// import { CircularProgress, Typography, Box } from "@mui/material";

// const Header = ({ toggleSidebar }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [profileData, setProfileData] = useState({});
//   const [open, setOpen] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const popupRef = useRef(null);

//   const [sessions, setSessions] = useState([]);
//   const [currentSession, setCurrentSession] = useState("");
//   const [currentSessionStatus, setCurrentSessionStatus] = useState("");

//   // Load profile data
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setProfileData(JSON.parse(storedUser));
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   // Fetch session list dynamically from API
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/session/get-all`);
//         if (!response.ok) throw new Error("Failed to fetch sessions");

//         const data = await response.json();
//         setSessions(data);

//         // Restore or pick latest session
//         const savedSession = localStorage.getItem("currentSession");
//         const savedSessionId = localStorage.getItem("currentSessionId");
//         const activeSession = data.find((s) => s.status === "active");

//         if (
//           savedSession &&
//           savedSessionId &&
//           data.some(
//             (s) =>
//               s.session === savedSession && s.id === parseInt(savedSessionId)
//           )
//         ) {
//           const selected = data.find((s) => s.session === savedSession);
//           setCurrentSession(savedSession);
//           setCurrentSessionStatus(selected?.status || "");
//         } else if (activeSession) {
//           setCurrentSession(activeSession.session);
//           setCurrentSessionStatus(activeSession.status);
//           localStorage.setItem("currentSession", activeSession.session);
//           localStorage.setItem("currentSessionId", activeSession.id);
//         } else if (data.length > 0) {
//           const latest = data[data.length - 1];
//           setCurrentSession(latest.session);
//           setCurrentSessionStatus(latest.status);
//           localStorage.setItem("currentSession", latest.session);
//           localStorage.setItem("currentSessionId", latest.id);
//         }
//       } catch {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load sessions. Please try again.",
//           confirmButtonText: "OK",
//         });
//         setSessions([]);
//       }
//     };
//     fetchSessions();
//   }, []);

//   // Handle session selection
//   const handleSessionChange = (e) => {
//     const newSession = e.target.value;
//     const selected = sessions.find((s) => s.session === newSession);
//     if (selected) {
//       setCurrentSession(newSession);
//       setCurrentSessionStatus(selected.status);
//       localStorage.setItem("currentSession", newSession);
//       localStorage.setItem("currentSessionId", selected.id);

//       window.location.reload();
//     }
//   };

//   // Load download progress
//   useEffect(() => {
//     const progressData = JSON.parse(
//       localStorage.getItem("pdfProgress") || '{"progress":0}'
//     );
//     setProgress(progressData.progress);
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const progressData = JSON.parse(
//         localStorage.getItem("pdfProgress") || '{"progress":0}'
//       );
//       setProgress(progressData.progress);
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Logout function
//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/u1/users/logout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (response.ok) {
//         logout();
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: "You have logged out successfully!",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//           willClose: () => navigate("/"),
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Logout failed. Please try again.",
//           confirmButtonText: "Retry",
//         });
//       }
//     } catch {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "An error occurred during logout. Please try again.",
//         confirmButtonText: "Retry",
//       });
//     }
//   };

//   return (
//     <header className="py-3 px-3 border-bottom bg-light">
//       <div className="container-fluid px-0">
//         <div className="d-flex flex-wrap align-items-center justify-content-between">
//           {/* Left: Sidebar toggle */}
//           <p onClick={toggleSidebar} className="my-auto">
//             <RxHamburgerMenu className={styles.hamburgerIcon} />
//           </p>

//           {/* Center: Current Session */}
//           <div
//             className="flex-grow-1"
//             style={{
//               display: "flex",
//               gap: "10px",
//             }}
//           >
//             <h6
//               style={{
//                 margin: 0,
//                 padding: 6,
//                 fontWeight: "500",
//                 color: "#fff",
//                 backgroundColor: "#365cf3ff",
//                 borderRadius: 6,
//                 textAlign: "right", // <-- forces text to align left
//                 marginLeft: 15,
//               }}
//             >
//               CURRENT SESSION
//             </h6>

//             <select
//               value={currentSession}
//               onChange={handleSessionChange}
//               style={{
//                 padding: "6px 10px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 fontWeight: "500",
//                 color: currentSessionStatus === "active" ? "green" : "",
//               }}
//             >
//               {sessions.map((session) => (
//                 <option
//                   key={session.id}
//                   value={session.session}
//                   style={{
//                     color: session.status === "active" ? "green" : "",
//                   }}
//                 >
//                   {session.session}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Right: Download progress + Profile */}
//           <div className="d-flex align-items-center gap-3">
//             <div style={{ position: "relative" }} ref={popupRef}>
//               <div
//                 onClick={() => setOpen(!open)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                 }}
//               >
//                 <UilImport size="25" color="#000" />
//                 {progress > 0 && progress < 100 && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "-10px",
//                       right: "-40px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       background: "linear-gradient(135deg, #3085d6, #90caf9)",
//                       borderRadius: "12px",
//                       padding: "2px 8px",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//                     }}
//                   >
//                     <CircularProgress
//                       variant="determinate"
//                       value={progress}
//                       size={20}
//                       thickness={5}
//                       sx={{ color: "#fff" }}
//                     />
//                     <Typography
//                       variant="caption"
//                       sx={{ color: "#fff", fontWeight: "bold" }}
//                     >
//                       {`${Math.round(progress)}%`}
//                     </Typography>
//                   </Box>
//                 )}
//               </div>
//             </div>

//             <div className={styles.notificationIcon}>
//               <FontAwesomeIcon icon={faBell} />
//             </div>
//             <div className={`${styles.dropdowndiv} dropdown text-end`}>
//               <a
//                 href="#"
//                 className={`${styles.dropdowna} d-flex align-items-center link-dark text-decoration-none dropdown-toggle gap-2`}
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <img
//                   src="https://github.com/mdo.png"
//                   alt="Profile"
//                   width="32"
//                   height="32"
//                   className="rounded-2"
//                 />
//                 <p className={`${styles.para} mb-0`}>
//                   Welcome {profileData.username || "User"}
//                 </p>
//               </a>
//               <ul className={`${styles.dropdown} dropdown-menu text-small`}>
//                 <li>
//                   <Link className="dropdown-item" to="/profile">
//                     Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#" onClick={handleLogout}>
//                     Sign out
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

//================================

// import React, { useEffect, useState, useRef } from "react";
// import { RxHamburgerMenu } from "react-icons/rx";
// import styles from "./Header.module.css";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import { UilImport } from "@iconscout/react-unicons";
// import Swal from "sweetalert2";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell } from "@fortawesome/free-solid-svg-icons";
// import { CircularProgress, Typography, Box } from "@mui/material";

// const Header = ({ toggleSidebar }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [profileData, setProfileData] = useState({});
//   const [open, setOpen] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [sessions, setSessions] = useState([]);
//   const [currentSession, setCurrentSession] = useState("");
//   const [currentSessionStatus, setCurrentSessionStatus] = useState("");
//   const popupRef = useRef(null);

//   // Load profile data from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setProfileData(JSON.parse(storedUser));
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   // Fetch sessions and set current session
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/session/get-all`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch sessions");
//         }

//         const data = await response.json();
//         setSessions(data);

//         // Set current session: prioritize saved session, then active session, then latest
//         const savedSession = localStorage.getItem("currentSession");
//         const savedSessionId = localStorage.getItem("currentSessionId");
//         const activeSession = data.find((s) => s.status === "active");

//         if (
//           savedSession &&
//           savedSessionId &&
//           data.some(
//             (s) =>
//               s.session === savedSession && s.id === parseInt(savedSessionId)
//           )
//         ) {
//           const selected = data.find((s) => s.session === savedSession);
//           setCurrentSession(savedSession);
//           setCurrentSessionStatus(selected?.status || "");
//         } else if (activeSession) {
//           setCurrentSession(activeSession.session);
//           setCurrentSessionStatus(activeSession.status);
//           localStorage.setItem("currentSession", activeSession.session);
//           localStorage.setItem("currentSessionId", activeSession.id);
//         } else if (data.length > 0) {
//           const latest = data[data.length - 1];
//           setCurrentSession(latest.session);
//           setCurrentSessionStatus(latest.status);
//           localStorage.setItem("currentSession", latest.session);
//           localStorage.setItem("currentSessionId", latest.id);
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load sessions. Please try again.",
//           confirmButtonText: "OK",
//           toast: true,
//           position: "top-end",
//           timer: 2000,
//           timerProgressBar: true,
//         });
//         setSessions([]);
//       }
//     };
//     fetchSessions();
//   }, []);

//   // Handle session selection
//   const handleSessionChange = (e) => {
//     const newSession = e.target.value;
//     const selected = sessions.find((s) => s.session === newSession);
//     if (selected) {
//       setCurrentSession(newSession);
//       setCurrentSessionStatus(selected.status);
//       localStorage.setItem("currentSession", newSession);
//       localStorage.setItem("currentSessionId", selected.id);
//       window.location.reload(); // Reload to apply session change
//     }
//   };

//   // Monitor PDF download progress
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const progressData = JSON.parse(
//         localStorage.getItem("pdfProgress") || '{"progress":0}'
//       );
//       setProgress(progressData.progress);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/u1/users/logout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.ok) {
//         logout();
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Success!",
//           text: "You have logged out successfully!",
//           showConfirmButton: false,
//           timer: 2000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//           willClose: () => navigate("/"),
//         });
//       } else {
//         throw new Error("Logout failed");
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "An error occurred during logout. Please try again.",
//         confirmButtonText: "Retry",
//         toast: true,
//         position: "top-end",
//         timer: 2000,
//         timerProgressBar: true,
//       });
//     }
//   };

//   return (
//     <header className="py-3 px-3 border-bottom bg-light">
//       <div className="container-fluid px-0">
//         <div className="d-flex flex-wrap align-items-center justify-content-between">
//           {/* Sidebar toggle */}
//           <div onClick={toggleSidebar} className="my-auto">
//             <RxHamburgerMenu className={styles.hamburgerIcon} />
//           </div>

//           {/* Session selector */}
//           <div className="">
//             <select
//               value={currentSession}
//               onChange={handleSessionChange}
//               style={{
//                 padding: "6px 10px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 fontWeight: 500,
//                 color: currentSessionStatus === "active" ? "green" : "inherit",
//                 marginLeft: 940,
//               }}
//             >
//               {sessions.map((session) => (
//                 <option
//                   key={session.id}
//                   value={session.session}
//                   style={{
//                     color: session.status === "active" ? "green" : "inherit",
//                   }}
//                 >
//                   {session.session}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Download progress and profile */}
//           <div className="d-flex align-items-center gap-3">
//             <div style={{ position: "relative" }} ref={popupRef}>
//               <div
//                 onClick={() => setOpen(!open)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                 }}
//               >
//                 <UilImport size="25" color="#000" />
//                 {progress > 0 && progress < 100 && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "-10px",
//                       right: "-40px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       background: "linear-gradient(135deg, #3085d6, #90caf9)",
//                       borderRadius: "12px",
//                       padding: "2px 8px",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//                     }}
//                   >
//                     <CircularProgress
//                       variant="determinate"
//                       value={progress}
//                       size={20}
//                       thickness={5}
//                       sx={{ color: "#fff" }}
//                     />
//                     <Typography
//                       variant="caption"
//                       sx={{ color: "#fff", fontWeight: "bold" }}
//                     >
//                       {`${Math.round(progress)}%`}
//                     </Typography>
//                   </Box>
//                 )}
//               </div>
//             </div>

//             <div className={styles.notificationIcon}>
//               <FontAwesomeIcon icon={faBell} />
//             </div>

//             <div className={`${styles.dropdowndiv} dropdown text-end`}>
//               <a
//                 href="#"
//                 className={`${styles.dropdowna} d-flex align-items-center link-dark text-decoration-none dropdown-toggle gap-2`}
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <img
//                   src="https://github.com/mdo.png"
//                   alt="Profile"
//                   width="32"
//                   height="32"
//                   className="rounded-2"
//                 />
//                 <p className={`${styles.para} mb-0`}>
//                   Welcome {profileData.username || "User"}
//                 </p>
//               </a>
//               <ul className={`${styles.dropdown} dropdown-menu text-small`}>
//                 <li>
//                   <Link className="dropdown-item" to="/profile">
//                     Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#" onClick={handleLogout}>
//                     Sign out
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

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

  // Load profile data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setProfileData(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Decide admin (by id or name), tolerant to API shapes and type mismatches
  useEffect(() => {
    const decideAdmin = async () => {
      try {
        const userRoleId =
          profileData?.role ?? profileData?.role_id ?? profileData?.roleId;
        const userRoleName =
          profileData?.role_name ?? profileData?.roleName ?? "";

        // If profile already carries role_name === 'admin', that's enough.
        if (toLower(userRoleName) === "admin") {
          setIsAdmin(true);
          return;
        }

        // Otherwise fetch roles and compare ids
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
          // If the endpoint is protected and fails, still fall back to role_name check above.
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

    // Run only when profile is loaded
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

  // Fetch sessions ONLY if admin
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
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load sessions. Please try again.",
          confirmButtonText: "OK",
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

  // Handle session selection
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

  // Monitor PDF download progress
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

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/u1/users/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          background: "#fff",
          customClass: { popup: "small-swal" },
          willClose: () => navigate("/"),
        });
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred during logout. Please try again.",
        confirmButtonText: "Retry",
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
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          {/* Sidebar toggle */}
          <div onClick={toggleSidebar} className="my-auto">
            <RxHamburgerMenu className={styles.hamburgerIcon} />
          </div>

          {/* Session selector - admin only */}
          {/* {isAdmin && (
            <div className="">
              <select
                value={currentSession}
                onChange={handleSessionChange}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontWeight: 500,
                  color:
                    currentSessionStatus === "active" ? "green" : "inherit",
                  marginLeft: 940, // consider replacing with a CSS class for responsiveness
                }}
                disabled={sessions.length === 0}
              >
                {sessions.map((session) => (
                  <option
                    key={session.id}
                    value={session.session}
                    style={{
                      color: session.status === "active" ? "green" : "inherit",
                    }}
                  >
                    {session.session}
                  </option>
                ))}
              </select>
            </div>
          )} */}

          {/* Session selector / Current session */}
          <div>
            {isAdmin ? (
              // Admins see full dropdown
              <select
                value={currentSession}
                onChange={handleSessionChange}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontWeight: 500,
                  color:
                    currentSessionStatus === "active" ? "green" : "inherit",
                  marginLeft: 940, // consider replacing with a CSS class for responsiveness
                }}
                disabled={sessions.length === 0}
              >
                {sessions.map((session) => (
                  <option
                    key={session.id}
                    value={session.session}
                    style={{
                      color: session.status === "active" ? "green" : "inherit",
                    }}
                  >
                    {session.session}
                  </option>
                ))}
              </select>
            ) : (
              // Non-admins see current session as text only
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontWeight: 500,
                  background: "#f8f9fa",
                  color:
                    currentSessionStatus === "active" ? "green" : "inherit",
                  marginLeft: 940, // consider replacing with a CSS class for responsiveness
                }}
              >
                {currentSession || "2025-26"}
              </div>
            )}
          </div>

          {/* Download progress and profile */}
          <div className="d-flex align-items-center gap-3">
            <div style={{ position: "relative" }} ref={popupRef}>
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
            </div>

            <div className={styles.notificationIcon}>
              <FontAwesomeIcon icon={faBell} />
            </div>

            <div className={`${styles.dropdowndiv} dropdown text-end`}>
              <a
                href="#"
                className={`${styles.dropdowna} d-flex align-items-center link-dark text-decoration-none dropdown-toggle gap-2`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://github.com/mdo.png"
                  alt="Profile"
                  width="32"
                  height="32"
                  className="rounded-2"
                />
                <p className={`${styles.para} mb-0`}>
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
