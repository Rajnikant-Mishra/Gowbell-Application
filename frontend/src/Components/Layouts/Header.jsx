
import React, { useEffect, useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import styles from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import { UilSearch , UilBell} from "@iconscout/react-unicons";
import {UilSearch , UilBell } from '@iconscout/react-unicons';
import Swal from "sweetalert2";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
import "../Common-Css/Swallfire.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons"; // Example icon


const Header = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
      // Fetch user data from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setProfileData(JSON.parse(storedUser));
      } else {
        // Redirect to login if no user data is found
        navigate("/");
      }
    }, [navigate]);
  
    if (!profileData) {
      return <p>Loading...</p>;
    }
  

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
            // Navigate to admin page after SweetAlert closes
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
          {/* <form className={styles.searchForm} role="search">
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search..."
              aria-label="Search"
            />
            <UilSearch className={styles.searchIcon} />
          </form> */}
          <div className="d-flex align-items-center gap-3">
            {/* Notification Icon */}
            <div className={styles.notificationIcon}>
              {/* <UilBell size="24" className={styles.bellIcon} /> */}
              {/* <FontAwesomeIcon icon="fa-solid fa-bell" /> */}
              <FontAwesomeIcon icon={faBell } />

            </div>
          

          <div className={`${styles.dropdowndiv} dropdown text-end `}>
            <a
              href="#"
              className={`${styles.dropdowna} d-flex flex-direction-row link-dark text-decoration-none dropdown-toggle gap-1`}
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
              
              <p className={`${styles.para} my-auto`}>Welcome {profileData.username}</p>
            </a>

            <ul className={`${styles.dropdown} dropdown-menu text-small`}>
              <li>
                {/* <a className="dropdown-item" href="/profile">
                  Profile
                </a> */}
               
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
