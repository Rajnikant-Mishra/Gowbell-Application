import React from "react";
import {
  FaHome,
  FaTachometerAlt,
  FaBoxOpen,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isCollapsed }) => {
  const [expandedMenus, setExpandedMenus] = React.useState({});

  const toggleSubMenu = (menu) => {
    setExpandedMenus((prevMenus) => ({
      ...prevMenus,
      [menu]: !prevMenus[menu],
    }));
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.sidebarHeader}>
        <a href="/" className={styles.sidebarLogo}>
          {!isCollapsed ? (
            <img
              src="./src/assets/logo GOWBELL.png"
              alt="Logo"
              width="150"
              height="32"
            />
          ) : (
            <span className={styles.sidebarTitle}>Gowbell</span>
          )}
        </a>
      </div>
      <ul className={styles.nav}>
        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <FaHome className={styles.icon} />
            {!isCollapsed && <span>Home</span>}
          </a>
        </li>
        <li className={styles.navItem}>
          <p
            className={styles.navLink}
            onClick={() => toggleSubMenu("dashboard")}
          >
            <FaTachometerAlt className={styles.icon} />
            {!isCollapsed && <span>Dashboard</span>}
          </p>
          {!isCollapsed && expandedMenus.dashboard && (
            <ul className={styles.submenu}>
              <li>
                <a href="#">Overview</a>
              </li>
              <li>
                <a href="#">Weekly</a>
              </li>
              <li>
                <a href="#">Monthly</a>
              </li>
              <li>
                <a href="#">Annually</a>
              </li>
            </ul>
          )}
          {isCollapsed && (
            <div className={styles.submenuHover}>
              <ul>
                <li>
                  <a href="#">Overview</a>
                </li>
                <li>
                  <a href="#">Weekly</a>
                </li>
                <li>
                  <a href="#">Monthly</a>
                </li>
                <li>
                  <a href="#">Annually</a>
                </li>
              </ul>
            </div>
          )}
        </li>
        <li className={styles.navItem}>
          <p className={styles.navLink} onClick={() => toggleSubMenu("orders")}>
            <FaBoxOpen className={styles.icon} />
            {!isCollapsed && <span>Orders</span>}
          </p>
          {!isCollapsed && expandedMenus.orders && (
            <ul className={styles.submenu}>
              <li>
                <a href="#">New</a>
              </li>
              <li>
                <a href="#">Processed</a>
              </li>
              <li>
                <a href="#">Shipped</a>
              </li>
              <li>
                <a href="#">Returned</a>
              </li>
            </ul>
          )}
          {isCollapsed && (
            <div className={styles.submenuHover}>
              <ul>
                <li>
                  <a href="#">New</a>
                </li>
                <li>
                  <a href="#">Processed</a>
                </li>
                <li>
                  <a href="#">Shipped</a>
                </li>
                <li>
                  <a href="#">Returned</a>
                </li>
              </ul>
            </div>
          )}
        </li>
        <li className={styles.navItem}>
          <p
            className={styles.navLink}
            onClick={() => toggleSubMenu("account")}
          >
            <FaUserCircle className={styles.icon} />
            {!isCollapsed && <span>Account</span>}
          </p>
          {!isCollapsed && expandedMenus.account && (
            <ul className={styles.submenu}>
              <li>
                <a href="#">Profile</a>
              </li>
              <li>
                <a href="#">Settings</a>
              </li>
              <li>
                <a href="#">
                  Sign Out <FaSignOutAlt />
                </a>
              </li>
            </ul>
          )}
          {isCollapsed && (
            <div className={styles.submenuHover}>
              <ul>
                <li>
                  <a href="#">Profile</a>
                </li>
                <li>
                  <a href="#">Settings</a>
                </li>
                <li>
                  <a href="#">Sign Out</a>
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
