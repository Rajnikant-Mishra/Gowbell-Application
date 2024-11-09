import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import styles from "./Mainlayout.module.css";

const Mainlayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  return (
    <>
      <div className="d-flex">
        <div className={`${styles.sidbardiv}`}>
          <Sidebar isCollapsed={isCollapsed} />
        </div>
        <div className={`${styles.mainContent}`}>
          <Header toggleSidebar={toggleSidebar} />
          {children}
          <div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Mainlayout;
