import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={`${styles.footer} px-3`}>
      <div className="container-fluid">
        <div className="d-flex flex-column flex-sm-row justify-content-between">
          {/* <p className="m-0 p-0">© 2024 Company, Inc. All rights reserved.</p> */}
          <p className={styles.footerp}>
            Copyright © 2024 Gowbell Foundation | Powered by{" "}
            <a
              href="https://evoquesys.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              EvoqueSys.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
