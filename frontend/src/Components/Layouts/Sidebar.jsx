
// import React, { useEffect, useState } from "react";
// import { FaChevronRight } from "react-icons/fa";
// import styles from "./Sidebar.module.css";
// import { Link, useNavigate } from "react-router-dom";
// import { UilCreateDashboard } from "@iconscout/react-unicons";
// import MainLogo from "../../assets/logo GOWBELL.png";
// import pathlogo from "../../assets/sidelogo.png";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";

// const Sidebar = ({ isCollapsed }) => {
//   const [expandedMenus, setExpandedMenus] = useState({});
//   const [menuItems, setMenuItems] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch menu items from API
//     const fetchMenuItems = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/m1/menu`);
//         const data = await response.json();
//         setMenuItems(data); // Store the fetched menu items in state
//       } catch (error) {
//         console.error("Error fetching menu items:", error);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   // Organize menu items by sequence and parent-child relationship
//   const organizeMenuItems = () => {
//     const mainMenus = [];
//     const subMenus = {};
  
//     menuItems.forEach((item) => {
//       if (item.sequence === 0) {
//         mainMenus.push(item); // Parent menu
//       } else if (item.sequence > 0 && item.parent_id) {
//         // Submenu logic: Associate with parent regardless of sequence number
//         if (!subMenus[item.parent_id]) {
//           subMenus[item.parent_id] = [];
//         }
//         subMenus[item.parent_id].push(item); // Add submenu item
//       }
//     });
  
//     // Attach submenus to their respective parent menus
//     mainMenus.forEach((menu) => {
//       if (subMenus[menu.id]) {
//         menu.subMenu = subMenus[menu.id]; // Assign submenus to the parent menu
//       }
//     });
  
//     return mainMenus;
//   };
  

//   // Handle submenu toggle
//   const toggleSubMenu = (menuId) => {
//     setExpandedMenus((prevMenus) => ({
//       ...prevMenus,
//       [menuId]: !prevMenus[menuId], // Toggle the expanded state for the clicked menu
//     }));
//   };

//   // Navigate to the selected menu or submenu
//   const navigateTo = (menuItem) => {
//     if (menuItem.subMenu && menuItem.subMenu.length === 0 && menuItem.link) {
//       navigate(menuItem.link); // Direct link if no submenu
//     } else {
//       toggleSubMenu(menuItem.id); // Open submenu if present
//     }
//   };

//   const organizedMenuItems = organizeMenuItems();

//   return (
//     <div className={styles.parentDiv}>
//       <div className={styles.sidebarHeader}>
//         <Link to="/dashboard" className={styles.sidebarLogo}>
//           {!isCollapsed ? (
//             <img src={MainLogo} alt="Logo" width="160" height="32" />
//           ) : (
//             <img src={pathlogo} alt="Logo" className={styles.sqichedicon} />
//           )}
//         </Link>
//       </div>

//       <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
//         <ul className={styles.nav}>
//           <li className={styles.navItem}>
//             <Link to="/dashboard" className={styles.navLink}>
//               <UilCreateDashboard className={styles.icon} />
//               {!isCollapsed && <span>Dashboard</span>}
//             </Link>
//           </li>
//           {organizedMenuItems.map((menuItem) => (
//             <li key={menuItem.id} className={styles.navItem}>
//               <div
//                 className={styles.navLink}
//                 onClick={() => navigateTo(menuItem)}
//               >
//                 {menuItem.icon && React.createElement(menuItem.icon, { className: styles.icon })}
//                 {!isCollapsed && <span>{menuItem.title}</span>}
//                 {!isCollapsed && menuItem.subMenu && menuItem.subMenu.length > 0 && (
//                   <FaChevronRight
//                     className={`${styles.submenuArrow} ${expandedMenus[menuItem.id] ? styles.rotate : ""}`}
//                   />
//                 )}
//               </div>
//               {menuItem.subMenu && menuItem.subMenu.length > 0 && (
//                 <ul className={`${styles.submenu} ${expandedMenus[menuItem.id] ? styles.expanded : ""}`}>
//                   {menuItem.subMenu.map((subItem, index) => (
//                     <li key={index} className={styles.submenuItem}>
//                       <Link to={subItem.link} className={styles.submenuLink}>
//                         {subItem.title}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UilCreateDashboard  } from "@iconscout/react-unicons";
import * as Unicons from "@iconscout/react-unicons";

import MainLogo from "../../assets/logo GOWBELL.png";
import pathlogo from "../../assets/sidelogo.png";
import { API_BASE_URL } from "../ApiConfig/APIConfig";

const Sidebar = ({ isCollapsed }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch menu items from API
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/m1/menu`);
        const data = await response.json();
        setMenuItems(data); // Store the fetched menu items in state
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  // Organize menu items by sequence and parent-child relationship
  const organizeMenuItems = () => {
    const mainMenus = [];
    const subMenus = {};

    menuItems.forEach((item) => {
      if (item.sequence === 0) {
        mainMenus.push(item); // Parent menu
      } else if (item.sequence > 0 && item.parent_id) {
        // Submenu logic: Associate with parent regardless of sequence number
        if (!subMenus[item.parent_id]) {
          subMenus[item.parent_id] = [];
        }
        subMenus[item.parent_id].push(item); // Add submenu item
      }
    });

    // Attach submenus to their respective parent menus
    mainMenus.forEach((menu) => {
      if (subMenus[menu.id]) {
        menu.subMenu = subMenus[menu.id]; // Assign submenus to the parent menu
      }
    });

    return mainMenus;
  };

  // Handle submenu toggle
  const toggleSubMenu = (menuId) => {
    setExpandedMenus((prevMenus) => ({
      ...prevMenus,
      [menuId]: !prevMenus[menuId], // Toggle the expanded state for the clicked menu
    }));
  };

  // Navigate to the selected menu or submenu
  const navigateTo = (menuItem) => {
    if (menuItem.subMenu && menuItem.subMenu.length === 0 && menuItem.link) {
      navigate(menuItem.link); // Direct link if no submenu
    } else {
      toggleSubMenu(menuItem.id); // Open submenu if present
    }
  };

  
  const renderIcon = (iconData) => {
    if (!iconData) return null; // No icon data
  
    // Check if the icon is a valid Unicons component
    const IconComponent = Unicons[iconData];
    if (IconComponent) {
      return <IconComponent className={styles.icon} />;
    }
  
    // Check if the icon is an image URL
    if (iconData.startsWith("http") || /\.(png|jpg|jpeg|svg|gif)$/i.test(iconData)) {
      return <img src={iconData} alt="icon" className={styles.icon} />;
    }
  
    // Fallback for invalid icon data
    return <UilCreateDashboard className={styles.icon} />; // Default icon
  };
  const organizedMenuItems = organizeMenuItems();

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

      <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
        <ul className={styles.nav}>
          <li className={styles.navItem}>
            <Link to="/dashboard" className={styles.navLink}>
              <UilCreateDashboard className={styles.icon} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          {organizedMenuItems.map((menuItem) => (
            <li key={menuItem.id} className={styles.navItem}>
              <div
                className={styles.navLink}
                onClick={() => navigateTo(menuItem)}
              >
                {renderIcon(menuItem.image)}
                {!isCollapsed && <span>{menuItem.title}</span>}
                {!isCollapsed && menuItem.subMenu && menuItem.subMenu.length > 0 && (
                  <FaChevronRight
                    className={`${styles.submenuArrow} ${expandedMenus[menuItem.id] ? styles.rotate : ""}`}
                  />
                )}
              </div>
              {menuItem.subMenu && menuItem.subMenu.length > 0 && (
                <ul className={`${styles.submenu} ${expandedMenus[menuItem.id] ? styles.expanded : ""}`}>
                  {menuItem.subMenu.map((subItem, index) => (
                    <li key={index} className={styles.submenuItem}>
                      <Link to={subItem.link} className={styles.submenuLink}>
                        {subItem.title}
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




