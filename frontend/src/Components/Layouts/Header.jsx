// import React, { useEffect, useState } from "react";
// import { RxHamburgerMenu } from "react-icons/rx";
// import styles from "./Header.module.css";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import { UilBell } from "@iconscout/react-unicons";
// import Swal from "sweetalert2";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell } from "@fortawesome/free-solid-svg-icons";
// const Header = ({ toggleSidebar }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [profileData, setProfileData] = useState({});
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setProfileData(JSON.parse(storedUser));
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);
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
//             <div className={styles.notificationIcon}>
//               <FontAwesomeIcon icon={faBell} />
//             </div>
//             <div className={`${styles.dropdowndiv} dropdown text-end`}>
//               <a
//                 href="#"
//                 className={`${styles.dropdowna} d-flex flex-direction-row link-dark text-decoration-none dropdown-toggle gap-1`}
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
//                 <p className={`${styles.para} my-auto`}>
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
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const popupRef = useRef(null);

  // Load profile data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setProfileData(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Load download history and progress from localStorage
  useEffect(() => {
    const progressData = JSON.parse(
      localStorage.getItem("pdfProgress") || '{"progress":0}'
    );
    setProgress(progressData.progress);
  }, []);

  // Update download history and progress on storage change
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
      const response = await fetch(`${API_BASE_URL}/api/u1/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          background: "#fff",
          customClass: {
            popup: "small-swal",
          },
          willClose: () => {
            navigate("/");
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Logout failed. Please try again.",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred during logout. Please try again.",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <header className="py-3 px-3 border-bottom bg-light">
      <div className="container-fluid px-0">
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <p onClick={toggleSidebar} className="my-auto">
            <RxHamburgerMenu className={styles.hamburgerIcon} />
          </p>
          <div className="d-flex align-items-center gap-3">
            {/* OMR download history with progress bar */}
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
              }}
              ref={popupRef}
            >
              <div
                onClick={() => setOpen(!open)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
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
