import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import styles from "./Mainlayout.module.css";

const Mainlayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="d-flex flex-row">
      <div className={`${styles.sidbardiv}`}>
        <Sidebar isCollapsed={isCollapsed} />
      </div>
      <div className={`${styles.mainContent}`}>
        <div className={`${styles.header}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className={`${styles.scrolldiv}`}>{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Mainlayout;
