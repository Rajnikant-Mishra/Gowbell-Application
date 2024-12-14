import React from "react";
import { FaChevronRight } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import {
  UilCreateDashboard,
  UilCompass,
  UilFileInfoAlt,
  UilArchiveAlt,
  UilUniversity,
  UilBookReader,
  UilTruck,
  UilSignalAlt3,
  UilUsersAlt,
  UilTrophy,
} from "@iconscout/react-unicons";
import { Link, useNavigate } from "react-router-dom";
import MainLogo from "../../assets/logo GOWBELL.png";
import pathlogo from "../../assets/sidelogo.png";
import { MenuItem } from "@mui/material";
const Sidebar = ({ isCollapsed }) => {
  const [expandedMenus, setExpandedMenus] = React.useState({});
  const [submenuPosition, setSubmenuPosition] = React.useState({
    top: 0,
    left: 0,
  });
  const navigate = useNavigate(); // React Router navigation hook
  const toggleSubMenu = (menu, e) => {
    const iconRect = e.currentTarget
      .querySelector(`.${styles.icon}`)
      .getBoundingClientRect();
    const newPosition =
      menu === "Account"
        ? { top: iconRect.top, left: iconRect.left + iconRect.width + 10 }
        : {
            top: iconRect.top,
            left: isCollapsed
              ? iconRect.right + 10
              : iconRect.left + iconRect.width + 10,
          };
    setSubmenuPosition(newPosition);
    setExpandedMenus((prevMenus) => {
      const newExpandedMenus = { ...prevMenus };
      for (let key in newExpandedMenus) {
        if (key !== menu) {
          newExpandedMenus[key] = false;
        }
      }
      newExpandedMenus[menu] = !newExpandedMenus[menu];
      return newExpandedMenus;
    });
  };
  const navigateTo = (menuItem, e) => {
    if (menuItem.subMenu.length === 0 && menuItem.link) {
      navigate(menuItem.link);
    } else {
      toggleSubMenu(menuItem.id, e);
    }
  };
  const closeSubMenu = () => {
    setExpandedMenus({});
  };
  const menuItems = [
    {
      id: "Region",
      icon: UilCompass,
      label: "Region",
      subMenu: [
        { label: "Country", link: "/country" },
        { label: "State", link: "/state" },
        { label: "District", link: "/district" },
        { label: "City", link: "/city" },
        { label: "Area", link: "/area" },
      ],
    },
    {
      id: "Master",
      icon: UilFileInfoAlt,
      label: "Master",
      subMenu: [
        { label: "Class", link: "/class" },
        { label: "Affiliated", link: "/affiliated" },
        { label: "Subject", link: "/subject" },
      ],
    },
    {
      id: "Inventory",
      icon: UilArchiveAlt,
      label: "Inventory",
      subMenu: [
        { label: "Book", link: "/book" },
        { label: "Question", link: "/question" },
        { label: "Omr", link: "/omr" },
      ],
      title: "Inventory",
    },
    {
      id: "School",
      icon: UilUniversity,
      label: "School",
      subMenu: [
        { label: "SchoolCreate", link: "/schoolList" },
        { label: "Assign Incharge", link: "/inchargeList" },
      ],
      title: "School",
    },
    {
      id: "Student",
      icon: UilBookReader,
      label: "Student",
      link: "/studentList",
      subMenu: [], // No submenu
      title: "Student",
    },
    {
      id: "Exam",
      icon: UilTruck,
      label: "Consignment",
      subMenu: [
        { label: "Omr", link: "/omr-list" },
        { label: "Question", link: "/question-list" },
        { label: "Books", link: "#" },
      ],
      title: "Exam",
    },
    {
      id: "Reports",
      icon: UilSignalAlt3,
      label: "Reports",
      subMenu: [
          { label: "School", link: "/schools-report" }, 
          { label: "Student", link: "/students-report" },
      ],
      title: "Reports",
    },
    {
      id: "User&Roles",
      icon: UilUsersAlt,
      label: "User & Roles",
      subMenu: [
        // { label: "Omr", link: "/omr-list" },
        // { label: "Processed", link: "/exam/processed" },
      ],
      title: "User&Roles",
    },
    {
      id: "Prize",
      icon: UilTrophy,
      label: "Prize&Certificates",
      subMenu: [
        // { label: "Omr", link: "/omr-list" },
        // { label: "Processed", link: "/exam/processed" },
      ],
      title: "Prize",
    },
  ];
  return (
    <div className={styles.parentDiv}>
      <div className={styles.sidebarHeader}>
        <Link to="/dashboard" className={styles.sidebarLogo}>
          {!isCollapsed ? (
            <img src={MainLogo} alt="Logo" width="160" height="32" />
          ) : (
            <img src={pathlogo} alt="Logo" className={styles.sqichedicon} />
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
              title={!isCollapsed ? "Dashboard" : ""}
            >
              <UilCreateDashboard className={styles.icon} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          {menuItems.map((menuItem) => (
            <li key={menuItem.id} className={styles.navItem}>
              <div
                className={styles.navLink}
                onClick={(e) => navigateTo(menuItem, e)}
                title={isCollapsed ? menuItem.label : ""}
              >
                <menuItem.icon className={styles.icon} />
                {!isCollapsed && <span>{menuItem.label}</span>}
                {!isCollapsed && menuItem.subMenu.length > 0 && (
                  <FaChevronRight
                    className={`${styles.submenuArrow} ${
                      expandedMenus[menuItem.id] ? styles.rotate : ""
                    }`}
                  />
                )}
              </div>
              {menuItem.subMenu.length > 0 && (
                <ul
                  className={`${styles.submenu} ${
                    expandedMenus[menuItem.id] ? styles.expanded : ""
                  }`}
                  style={{
                    top: submenuPosition.top,
                    left: submenuPosition.left,
                  }}
                >
                  {isCollapsed && (
                    <p className={`${styles.collapsedheading}  mb-0  fw-bold`}>
                      {menuItem.label}
                    </p>
                  )}
                  <>
                    {menuItem.subMenu.map((item, index) => (
                      <li key={index} className={styles.submenuItem}>
                        <Link to={item.link} className={styles.submenuLink}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;