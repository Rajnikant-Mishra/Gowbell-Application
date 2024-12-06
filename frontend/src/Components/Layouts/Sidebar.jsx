import React from "react";
import {
  FaChevronRight,
  FaSignOutAlt,
  FaCompass,
  FaBoxOpen,
  FaUserCircle,
  FaTachometerAlt,
  FaSchool,
  FaUsers,
} from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineAssignment } from "react-icons/md";
import styles from "./Sidebar.module.css";
import { PiStudentFill } from "react-icons/pi";
import { BsBookHalf } from "react-icons/bs";
import { GrCertificate } from "react-icons/gr";
import { SiGoogleanalytics } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
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
      // Navigate directly if there's no submenu and a link is provided
      navigate(menuItem.link);
    } else {
      toggleSubMenu(menuItem.id, e); // Otherwise, toggle the submenu
    }
  };
  const closeSubMenu = () => {
    setExpandedMenus({});
  };
  const menuItems = [
    {
      id: "Region",
      icon: FaCompass,
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
      icon: FaCompass,
      label: "Master",
      subMenu: [
        { label: "Class", link: "/class" },
        { label: "Affiliated", link: "/affiliated" },
        { label: "Subject", link: "/subject" },
      ],
    },
    {
      id: "Inventory",
      icon: FaBoxOpen,
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
      icon: FaSchool,
      label: "School",
      subMenu: [
        { label: "SchoolCreate", link: "/schoolList" },
        { label: "Assign Incharge", link: "/inchargeList" },
      ],
      title: "School",
    },
    {
      id: "Student",
      icon: PiStudentFill,
      label: "Student",
      link: "/studentList",
      subMenu: [], // No submenu
      title: "Student",
    },
    {
      id: "Exam",
      icon: BsBookHalf,
      label: "Consignment",
      subMenu: [
        { label: "Omr", link: "/omr-list" },
        { label: "Processed", link: "/exam/processed" },
      ],
      title: "Exam",
    },
  ];
  return (
    <div className={styles.parentDiv}>
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
              <FaTachometerAlt className={styles.icon} />
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
                  {menuItem.subMenu.map((item, index) => (
                    <li key={index} className={styles.submenuItem}>
                      <Link to={item.link} className={styles.submenuLink}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
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
