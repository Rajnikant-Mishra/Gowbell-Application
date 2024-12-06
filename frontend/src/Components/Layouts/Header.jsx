import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextsAuthsecurity/AuthContext";
import Swal from "sweetalert2";

const Header = ({ toggleSidebar }) => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        logout(); // Clear local authentication state
  
        // SweetAlert for successful logout
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success!",
          text: "You have logged out successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            popup: "animate__animated animate__fadeInDown",
            title: "text-success fw-bold",
            text: "text-dark",
          },
          background: "#fff",
          willClose: () => {
            // Navigate to admin page after SweetAlert closes
            navigate("/admin");
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
          <form className="col-lg-auto me-lg-3" role="search">
            <input
              type="search"
              className="form-control"
              placeholder="Search..."
              aria-label="Search"
              style={{ borderRadius: "0" }}
            />
          </form>
          <div className="dropdown text-end">
            <a
              href="#"
              className="d-block link-dark text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://github.com/mdo.png"
                alt="Profile"
                width="32"
                height="32"
                className="rounded-circle"
              />
            </a>
            <ul className="dropdown-menu text-small">
              <li>
                <a className="dropdown-item" href="#">
                  New project...
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
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
    </header>
  );
};

export default Header;
