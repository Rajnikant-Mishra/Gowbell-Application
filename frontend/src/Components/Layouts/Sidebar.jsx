import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UilCreateDashboard } from "@iconscout/react-unicons";
import * as Unicons from "@iconscout/react-unicons";
import pathlogo from "../../assets/sidelogo.png";
import gowbell from "../../assets/sidebar-logo.png";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [expandedMenuId, setExpandedMenuId] = useState(null);
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const storedMenus = JSON.parse(localStorage.getItem("menus")) || [];
      console.log("Stored menus:", storedMenus);
      setMenus(storedMenus);
    } catch (error) {
      console.error("Error parsing menus from localStorage:", error);
      setMenus([]);
    }
  }, []);
  useEffect(() => {
    if (isCollapsed) {
      setExpandedMenuId(null);
    }
  }, [isCollapsed]);
  const organizeMenuItems = () => {
    const mainMenus = [];
    const subMenus = {};
    menus.forEach((item) => {
      if (item.sequence === 0) {
        mainMenus.push(item);
      } else if (item.sequence > 0 && item.parent_id) {
        if (!subMenus[item.parent_id]) {
          subMenus[item.parent_id] = [];
        }
        subMenus[item.parent_id].push(item);
      }
    });
    mainMenus.forEach((menu) => {
      if (subMenus[menu.id]) {
        menu.subMenu = subMenus[menu.id];
      }
    });
    console.log("Organized menu items:", mainMenus);
    return mainMenus;
  };
  const toggleSubMenu = (menuId) => {
    setExpandedMenuId((prevMenuId) => (prevMenuId === menuId ? null : menuId));
  };
  const navigateTo = (menuItem, isSubMenu = false) => {
    console.log(
      "NavigateTo called with:",
      menuItem,
      "isCollapsed:",
      isCollapsed,
      "isSubMenu:",
      isSubMenu,
    );
    if (!menuItem) return;
    // Expand sidebar if collapsed
    if (isCollapsed) {
      console.log("Expanding sidebar");
      setIsCollapsed(false);
    }
    if (!isSubMenu && menuItem.subMenu && menuItem.subMenu.length > 0) {
      console.log("Toggling submenu for menu ID:", menuItem.id);
      toggleSubMenu(menuItem.id);
    } else if (menuItem.link) {
      console.log("Navigating to:", menuItem.link);
      navigate(menuItem.link);
    }
  };
  const renderIcon = (iconData) => {
    if (!iconData) return null;
    const IconComponent = Unicons[iconData];
    if (IconComponent) {
      return <IconComponent className={styles.icon} />;
    }
    if (
      iconData.startsWith("http") ||
      /\.(png|jpg|jpeg|svg|gif)$/i.test(iconData)
    ) {
      return <img src={iconData} alt="icon" className={styles.icon} />;
    }
    return <UilCreateDashboard className={styles.icon} />;
  };
  const organizedMenuItems = organizeMenuItems();
  return (
    <div
      className={`${styles.parentDiv} ${isCollapsed ? styles.collapsed : ""}`}
    >
      {/* <div className={styles.sidebarHeader}>
        <Link to="/dashboard" className={styles.sidebarLogo}>
          {!isCollapsed ? (
            <>
              <img src={pathlogo} alt="Logo" className={styles.sqichedicon} />
              
              <h1 className={`${styles.headtitle} my-auto text-white mt-3`}>
                Gowbell
              </h1>
            </>
          ) : (
            <img src={pathlogo} alt="Logo" className={styles.sqichedicon} />
          )}
        </Link>
      </div> */}

      <div className={styles.sidebarHeader}>
        <Link to="/dashboard" className={styles.sidebarLogo}>
          {isCollapsed ? (
            // Collapsed Sidebar
            <img src={pathlogo} alt="Logo" className={styles.sqichedicon} />
          ) : (
            // Expanded Sidebar
            <img src={gowbell} alt="Gowbell Logo" className={styles.fullLogo} />
          )}
        </Link>
      </div>

      <div
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
      >
        <ul className={styles.nav}>
          <li className={styles.navItem}>
            <Link
              to="/dashboard"
              className={styles.navLink}
              onClick={() => navigateTo({ link: "/dashboard" })}
            >
              <UilCreateDashboard className={styles.icon} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          {organizedMenuItems.length > 0 ? (
            organizedMenuItems.map((menuItem) => (
              <li key={menuItem.id} className={styles.navItem}>
                <div
                  className={styles.navLink}
                  onClick={() => navigateTo(menuItem)}
                >
                  {renderIcon(menuItem.image)}
                  {!isCollapsed && <span>{menuItem.title}</span>}
                  {!isCollapsed &&
                    menuItem.subMenu &&
                    menuItem.subMenu.length > 0 && (
                      <FaChevronRight
                        className={`${styles.submenuArrow} ${
                          expandedMenuId === menuItem.id ? styles.rotate : ""
                        }`}
                      />
                    )}
                </div>
                {menuItem.subMenu && menuItem.subMenu.length > 0 && (
                  <ul
                    className={`${styles.submenu} ${
                      expandedMenuId === menuItem.id ? styles.expanded : ""
                    }`}
                  >
                    {menuItem.subMenu.map((subItem, index) => (
                      <li key={index} className={styles.submenuItem}>
                        <Link
                          to={subItem.link}
                          className={styles.submenuLink}
                          onClick={() => navigateTo(subItem, true)}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <li className={styles.navItem}>
              <span className={styles.navLink}>No menu items available</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
