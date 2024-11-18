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
import { Link } from 'react-router-dom';

const Sidebar = ({ isCollapsed }) => {
  const [expandedMenus, setExpandedMenus] = React.useState({});
  const [submenuPosition, setSubmenuPosition] = React.useState({
    top: 0,
    left: 0,
  });

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
    },   {
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
        { label: "Question", link:"/question" },
        { label: "Omr", link:"/omr" },
        
      ],
      title: "Inventory",
    },

    {
      id: "School",
      icon: FaSchool,
      label: "School",
      subMenu: [
        { label: "Create", link: "/school-create" },
        { label: "Assign Incharge", link:"/incharge" },
     
      ],
      title: "School",
    },
    {
      id: "Student",
      icon: PiStudentFill,
      label: "Student",
      subMenu: [
        { label: "New", href: "#" },
        { label: "Processed", href: "#" },
        { label: "Shipped", href: "#" },
        { label: "Returned", href: "#" },
      ],
      title: "Student",
    },
    {
      id: "Exam",
      icon: BsBookHalf,
      label: "Exam",
      subMenu: [
        { label: "New", href: "#" },
        { label: "Processed", href: "#" },
        { label: "Shipped", href: "#" },
        { label: "Returned", href: "#" },
      ],
      title: "Exam",
    },
    {
      id: "Consignment",
      icon: MdOutlineAssignment,
      label: "Consignment",
      subMenu: [
        { label: "New", href: "#" },
        { label: "Processed", href: "#" },
        { label: "Shipped", href: "#" },
        { label: "Returned", href: "#" },
      ],
      title: "Consignment",
    },
    {
      id: "Certificate & Prize",
      icon: GrCertificate,
      label: "Certificate & Prize",
      subMenu: [
        { label: "New", href: "#" },
        { label: "Processed", href: "#" },
        { label: "Shipped", href: "#" },
        { label: "Returned", href: "#" },
      ],
      title: "Certificate & Prize",
    },
    {
      id: "Reporting and Analytics",
      icon: SiGoogleanalytics,
      label: "Reporting and Analytics",
      subMenu: [
        { label: "New", href: "#" },
        { label: "Processed", href: "#" },
        { label: "Shipped", href: "#" },
        { label: "Returned", href: "#" },
      ],
      title: "Reporting and Analytics",
    },
    {
      id: "User & Role Management",
      icon: FaUsers,
      label: "User & Role Management",
      subMenu: [
        { label: "New", href: "#" },
        { label: "Processed", href: "#" },
        { label: "Shipped", href: "#" },
        { label: "Returned", href: "#" },
      ],
      title: "User & Role Management",
    },
    {
      id: "Notifications System",
      icon: IoNotificationsSharp,
      label: "Notifications System",
      subMenu: [
        { label: "New", href: "#" },
        { label: "Processed", href: "#" },
        { label: "Shipped", href: "#" },
        { label: "Returned", href: "#" },
      ],
      title: "Notifications System",
    },
    {
      id: "Account",
      icon: FaUserCircle,
      label: "Account",
      subMenu: [
        { label: "Profile", href: "#" },
        { label: "Settings", href: "#" },
        { label: "Sign Out", href: "#", icon: FaSignOutAlt },
      ],
      title: "Account",
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
            <a
              href="#"
              className={styles.navLink}
              title={!isCollapsed ? "Dashboard" : ""}
            >
              <FaTachometerAlt className={styles.icon} />
              {!isCollapsed && <span>Dashboard</span>}
            </a>
          </li>

          {menuItems.map(({ id, icon: Icon, label, subMenu }) => (
          <li key={id} className={styles.navItem}>
            <div
              className={styles.navLink}
              onClick={(e) => toggleSubMenu(id, e)}
              title={isCollapsed ? label : ""}
            >
              <Icon className={styles.icon} />
              {!isCollapsed && <span>{label}</span>}
              {!isCollapsed && subMenu.length > 0 && (
                <FaChevronRight
                  className={`${styles.submenuArrow} ${expandedMenus[id] ? styles.rotate : ""}`}
                />
              )}
            </div>
            {subMenu.length > 0 && (
              <ul
                className={`${styles.submenu} ${expandedMenus[id] ? styles.expanded : ""}`}
                style={{ top: submenuPosition.top, left: submenuPosition.left }}
              >
                {subMenu.map((item, index) => (
                  <li key={index} className={styles.submenuItem}>
                    <Link to={item.link} className={styles.submenuLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {isCollapsed && expandedMenus[id] && subMenu.length !== 0 && (
              <div
                className={`${styles.collapsedSubmenu} ${expandedMenus[id] ? styles.expanded : ""}`}
              >
                <span className={styles.closeBtn} onClick={closeSubMenu}>
                  ×
                </span>
                <h3 className={styles.submenuHeading}>{label}</h3>
                <ul>
                  {subMenu.map((item, index) => (
                    <li key={index} className={styles.submenuItem}>
                      <Link to={item.link} className={styles.submenuLink}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
