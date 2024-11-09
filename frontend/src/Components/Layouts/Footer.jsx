// Footer.jsx
import React from "react";
import styles from "./Footer.module.css"; // Assuming you have this CSS module

const Footer = () => {
  return (
    <div className="container-fluid bg-light ps-0 pe-0">
      <footer>
        <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
          <p>© 2024 Company, Inc. All rights reserved.</p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3">
              <a className="text-muted" href="#">
                <i className="bi bi-twitter"></i>
              </a>
            </li>
            <li className="ms-3">
              <a className="text-muted" href="#">
                <i className="bi bi-instagram"></i>
              </a>
            </li>
            <li className="ms-3">
              <a className="text-muted" href="#">
                <i className="bi bi-facebook"></i>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Footer; // Make sure to use `export default` here.
