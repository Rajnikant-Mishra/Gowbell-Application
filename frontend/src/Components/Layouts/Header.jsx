import React from "react";
import { ImParagraphJustify } from "react-icons/im";
import styles from "./Header.module.css";

const Header = ({ toggleSidebar }) => {
  return (
    <header className={`${styles.text} pb-3 mb-3 border-bottom bg-light`}>
      <div className="container-fluid ps-0 pe-0">
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <button onClick={toggleSidebar} className="btn btn-outline-secondary">
            <ImParagraphJustify />
          </button>
          <ul className="nav col-lg-auto mb-2 justify-content-center mx-auto mb-md-0">
            <li>
              <a href="#" className="nav-link px-2 text-secondary">
                Overview
              </a>
            </li>
            <li>
              <a href="#" className="nav-link px-2 text-dark">
                Inventory
              </a>
            </li>
            <li>
              <a href="#" className="nav-link px-2 text-dark">
                Customers
              </a>
            </li>
            <li>
              <a href="#" className="nav-link px-2 text-dark">
                Products
              </a>
            </li>
          </ul>
          <form className="col-lg-auto me-lg-3" role="search">
            <input
              type="search"
              className="form-control"
              placeholder="Search..."
              aria-label="Search"
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
                <a className="dropdown-item" href="#">
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
