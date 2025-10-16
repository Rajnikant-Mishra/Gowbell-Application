// import React, { useState, useEffect } from "react";
// import {
//   UilEdit,
//   UilTrashAlt,
//   UilEye,
//   UilEyeSlash,
// } from "@iconscout/react-unicons";
// import admin from "../../assets/administrator.jpg";
// import Mainlayout from "../Layouts/Mainlayout";
// import styles from "./admin.module.css";
// import ButtonComp from "../CommonButton/ButtonComp";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";

// const User = () => {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [profileData, setProfileData] = useState({
//     id: "",
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm_password: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const user = JSON.parse(storedUser);
//       setProfileData({ ...user, confirm_password: "" });
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   const [isHovered, setIsHovered] = useState(false);
//   const [status, setStatus] = useState("online");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({ ...profileData, [name]: value });
//     setError("");
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setProfileData({ ...profileData, image: URL.createObjectURL(file) });
//     } else {
//       alert("Please upload a valid image file.");
//     }
//   };

//   const handleImageDelete = () => {
//     setProfileData({ ...profileData, image: "" });
//   };

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault();

//     if (!profileData.password) {
//       setError("Password cannot be empty");
//       return;
//     }

//     if (profileData.password !== profileData.confirm_password) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/u1/${profileData.id}/password`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ password: profileData.password }),
//         }
//       );

//       if (response.ok) {
//         const updatedUser = {
//           ...profileData,
//           password: "",
//           confirm_password: "",
//         };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setProfileData(updatedUser);
//         toast.success("Password change  successfully! 🌸");
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to update password");
//       }
//     } catch (err) {
//       setError("An error occurred while updating the password");
//     }
//   };

//   const getStatusClass = () => {
//     switch (status) {
//       case "online":
//         return "";
//       case "offline":
//         return "offline";
//       case "idle":
//         return "idle";
//       default:
//         return "";
//     }
//   };

//   return (
//     <Mainlayout>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "Profile" }]} />
//       </div>
//       <div className={`${styles.container} container`}>
//         <div className={`${styles.formcont} row rounded`}>
//           {/* Profile Info */}
//           <div
//             className={`${styles.div1} col-12 text-center pt-3 px-4 d-flex`}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <div className={`${styles["c-avatar"]}`}>
//               <img
//                 className={styles["c-avatar__image"]}
//                 // src={profileData.image || admin}
//                   src={`${API_BASE_URL}/profiles/${profileData.user_profile}` || admin}
//                 alt="Profile"
//               />
//               <span
//                 className={`${styles["c-avatar__status"]} ${
//                   styles[getStatusClass()]
//                 }`}
//               ></span>

//               {isHovered && (
//                 <div className={styles["hover-overlay"]}>
//                   <label className={styles["icon-container"]}>
//                     <UilEdit size={30} className={styles.icon} />
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className={styles.hidden}
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                   <UilTrashAlt
//                     size={30}
//                     className={styles.icon}
//                     onClick={handleImageDelete}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="text-start my-auto">
//               <h3>{profileData.username}</h3>
//               <p className={styles.title}>
//                 {profileData.email} -{" "}
//                 <span className={styles.title1}>{profileData.username}</span>
//               </p>
//             </div>
//           </div>

//           {/* Password Update Form */}
//           <div className={`${styles.div2} col-12 pb-3 px-4`}>
//             <h2 className="pt-3 mb-0 pb-0">Accounts</h2>
//             <hr className={`${styles.hr} mb-4`} />
//             <form onSubmit={handlePasswordUpdate}>
//               {/* Username */}
//               <div className={`${styles.inputdiv} mb-3 d-flex`}>
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Username <span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`${styles.control} form-control`}
//                   name="username"
//                   value={profileData.username}
//                   readOnly
//                 />
//               </div>

//               {/* Email */}
//               <div className={`${styles.inputdiv} mb-3 d-flex`}>
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Email <span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="email"
//                   className={`${styles.control} form-control`}
//                   name="email"
//                   value={profileData.email}
//                   readOnly
//                 />
//               </div>

//               {/* Phone */}
//               <div className={`${styles.inputdiv} mb-3 d-flex`}>
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Phone <span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="phone"
//                   className={`${styles.control} form-control`}
//                   name="phone"
//                   value={profileData.phone}
//                   readOnly
//                 />
//               </div>

//               {/* Password */}
//               <div
//                 className={`${styles.inputdiv} mb-3 d-flex align-items-center`}
//               >
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Password
//                 </label>
//                 <div
//                   style={{
//                     position: "relative",
//                     width: "50%",
//                     marginLeft: "-23px",
//                   }}
//                 >
//                   <input
//                     type={passwordVisible ? "text" : "password"}
//                     className={`${styles.control1} form-control`}
//                     name="password"
//                     value={profileData.password}
//                     onChange={handleInputChange}
//                     placeholder="Enter your password"
//                     style={{ paddingRight: "40px" }}
//                   />
//                   <span
//                     onClick={() => setPasswordVisible(!passwordVisible)}
//                     style={{
//                       position: "absolute",
//                       right: "-14px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       cursor: "pointer",
//                       color: "#555",
//                     }}
//                   >
//                     {passwordVisible ? (
//                       <UilEyeSlash size={20} />
//                     ) : (
//                       <UilEye size={20} />
//                     )}
//                   </span>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div
//                 className={`${styles.inputdiv} mb-3 d-flex align-items-center`}
//               >
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Confirm Password
//                 </label>
//                 <div
//                   style={{
//                     position: "relative",
//                     width: "50%",
//                     marginLeft: "-23px",
//                   }}
//                 >
//                   <input
//                     type={passwordVisible ? "text" : "password"}
//                     className={`${styles.control1} form-control`}
//                     name="confirm_password"
//                     value={profileData.confirm_password}
//                     onChange={handleInputChange}
//                     placeholder="Confirm your password"
//                     style={{ paddingRight: "40px" }}
//                   />
//                   <span
//                     onClick={() => setPasswordVisible(!passwordVisible)}
//                     style={{
//                       position: "absolute",
//                       right: "-14px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       cursor: "pointer",
//                       color: "#555",
//                     }}
//                   >
//                     {passwordVisible ? (
//                       <UilEyeSlash size={20} />
//                     ) : (
//                       <UilEye size={20} />
//                     )}
//                   </span>
//                 </div>
//               </div>

//               {error && <div className="text-danger mb-3">{error}</div>}

//               <div className="text-end">
//                 <ButtonComp
//                   type="submit"
//                   className="btn btn-primary"
//                   text="Change Password"
//                 />
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </Mainlayout>
//   );
// };

// export default User;

// import React, { useState, useEffect } from "react";
// import { UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
// import admin from "../../assets/administrator.jpg";
// import Mainlayout from "../Layouts/Mainlayout";
// import styles from "./admin.module.css";
// import ButtonComp from "../CommonButton/ButtonComp";
// import Breadcrumb from "../CommonButton/Breadcrumb";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { API_BASE_URL } from "../ApiConfig/APIConfig";

// const User = () => {
//   const [profileData, setProfileData] = useState({
//     id: "",
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm_password: "",
//     user_profile: "",
//   });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [error, setError] = useState("");
//   const [isHovered, setIsHovered] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const user = JSON.parse(storedUser);
//       setProfileData({ ...user, password: "", confirm_password: "" });
//       if (user.user_profile)
//         setPreviewImage(`${API_BASE_URL}/profiles/${user.user_profile}`);
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   // ✅ Handle input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({ ...profileData, [name]: value });
//     setError("");
//   };

//   // ✅ Image upload + preview
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const allowed = /jpeg|jpg|png|gif/;
//     if (!allowed.test(file.type)) {
//       alert("Only image files are allowed!");
//       return;
//     }

//     setPreviewImage(URL.createObjectURL(file));
//     setProfileData({ ...profileData, user_profile: file });
//   };

//   // ✅ Remove image preview
//   const handleImageDelete = () => {
//     setPreviewImage(null);
//     setProfileData({ ...profileData, user_profile: "" });
//   };

//   // ✅ Update password or image
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setError("");

//     // If password provided, check validation
//     if (profileData.password) {
//       if (!profileData.confirm_password) {
//         setError("Confirm Password is required");
//         return;
//       }
//       if (profileData.password !== profileData.confirm_password) {
//         setError("Passwords do not match");
//         return;
//       }
//     }

//     try {
//       const formData = new FormData();
//       if (profileData.password)
//         formData.append("password", profileData.password);
//       if (profileData.confirm_password)
//         formData.append("confirm_password", profileData.confirm_password);
//       if (profileData.user_profile instanceof File)
//         formData.append("user_profile", profileData.user_profile);

//       const response = await fetch(
//         `${API_BASE_URL}/api/u1/${profileData.id}/password`,
//         {
//           method: "PUT",
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Profile updated successfully! 🎉");

//         // ✅ Update local storage only image field if updated
//         const updatedUser = { ...profileData };
//         if (data.user_profile) updatedUser.user_profile = data.user_profile;
//         updatedUser.password = "";
//         updatedUser.confirm_password = "";
//         localStorage.setItem("user", JSON.stringify(updatedUser));

//         setProfileData(updatedUser);
//       } else {
//         setError(data.message || "Update failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred while updating profile");
//     }
//   };

//   return (
//     <Mainlayout>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb data={[{ name: "Profile" }]} />
//       </div>
//       <div className={`${styles.container} container`}>
//         <div className={`${styles.formcont} row rounded`}>
//           {/* Profile Info */}
//           <div
//             className={`${styles.div1} col-12 text-center pt-3 px-4 d-flex`}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <div className={styles["c-avatar"]}>
//               <img
//                 className={styles["c-avatar__image"]}
//                 src={
//                   previewImage ||
//                   `${API_BASE_URL}/profiles/${profileData.user_profile}` ||
//                   admin
//                 }
//                 alt="Profile"
//               />
//               {isHovered && (
//                 <div className={styles["hover-overlay"]}>
//                   <label className={styles["icon-container"]}>
//                     <UilEdit size={30} className={styles.icon} />
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className={styles.hidden}
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                   <UilTrashAlt
//                     size={30}
//                     className={styles.icon}
//                     onClick={handleImageDelete}
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="text-start my-auto">
//               <h3>{profileData.username}</h3>
//               <p className={styles.title}>
//                 {profileData.email} -{" "}
//                 <span className={styles.title1}>{profileData.username}</span>
//               </p>
//             </div>
//           </div>

//           {/* Password Update Form */}
//           <div className={`${styles.div2} col-12 pb-3 px-4`}>
//             <h2 className="pt-3 mb-0 pb-0">Account Settings</h2>
//             <hr className={`${styles.hr} mb-4`} />
//             <form onSubmit={handleUpdate}>
//               {/* Username */}
//               <div className={`${styles.inputdiv} mb-3 d-flex`}>
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   className={`${styles.control} form-control`}
//                   name="username"
//                   value={profileData.username}
//                   readOnly
//                 />
//               </div>

//               {/* Email */}
//               <div className={`${styles.inputdiv} mb-3 d-flex`}>
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   className={`${styles.control} form-control`}
//                   name="email"
//                   value={profileData.email}
//                   readOnly
//                 />
//               </div>

//               {/* Phone */}
//               <div className={`${styles.inputdiv} mb-3 d-flex`}>
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   className={`${styles.control} form-control`}
//                   name="phone"
//                   value={profileData.phone}
//                   readOnly
//                 />
//               </div>

//               {/* Password */}
//               <div className={`${styles.inputdiv} mb-3 d-flex`}>
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   className={`${styles.control1} form-control`}
//                   name="password"
//                   value={profileData.password}
//                   onChange={handleInputChange}
//                   placeholder="Enter new password (optional)"
//                 />
//               </div>

//               {/* Confirm Password */}
//               <div className={`${styles.inputdiv} mb-3 d-flex`}>
//                 <label className={`${styles.lables} form-label my-auto`}>
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   className={`${styles.control1} form-control`}
//                   name="confirm_password"
//                   value={profileData.confirm_password}
//                   onChange={handleInputChange}
//                   placeholder="Confirm new password (optional)"
//                 />
//               </div>

//               {error && <div className="text-danger mb-3">{error}</div>}

//               <div className="text-end">
//                 <ButtonComp
//                   type="submit"
//                   className="btn btn-primary"
//                   text="Update Profile"
//                 />
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </Mainlayout>
//   );
// };

// export default User;

import React, { useState, useEffect } from "react";
import {
  UilEdit,
  UilTrashAlt,
  UilEye,
  UilEyeSlash,
} from "@iconscout/react-unicons";
import admin from "../../assets/administrator.jpg";
import Mainlayout from "../Layouts/Mainlayout";
import styles from "./admin.module.css";
import ButtonComp from "../CommonButton/ButtonComp";
import Breadcrumb from "../CommonButton/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../ApiConfig/APIConfig";

const User = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    user_profile: "", // stores current image name or file
    imageFile: null, // stores newly uploaded file
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [status, setStatus] = useState("online");
  const navigate = useNavigate();

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProfileData({
        ...user,
        password: "",
        confirm_password: "",
        imageFile: null,
      });
      if (user.user_profile)
        setPreviewImage(`${API_BASE_URL}/profiles/${user.user_profile}`);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setError("");
  };

  // ✅ Image upload + preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
    setProfileData({ ...profileData, imageFile: file });
  };

  // ✅ Remove image preview
  // const handleImageDelete = () => {
  //   setPreviewImage(null);
  //   setProfileData({ ...profileData, user_profile: "", imageFile: null });
  // };

  // ✅ Update password and/or profile image
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    // Password validation
    if (profileData.password) {
      if (!profileData.confirm_password) {
        setError("Confirm Password is required");
        return;
      }
      if (profileData.password !== profileData.confirm_password) {
        setError("Passwords do not match");
        return;
      }
    }

    try {
      const formData = new FormData();
      if (profileData.password)
        formData.append("password", profileData.password);
      if (profileData.imageFile)
        formData.append("user_profile", profileData.imageFile);

      const response = await fetch(
        `${API_BASE_URL}/api/u1/${profileData.id}/password`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully! 🎉");

        // Update localStorage
        const updatedUser = {
          ...profileData,
          password: "",
          confirm_password: "",
        };
        if (data.user_profile) {
          updatedUser.user_profile = data.user_profile;
          setPreviewImage(`${API_BASE_URL}/profiles/${data.user_profile}`);
        }
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfileData({ ...updatedUser, imageFile: null });
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating profile");
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case "online":
        return "";
      case "offline":
        return "offline";
      case "idle":
        return "idle";
      default:
        return "";
    }
  };

  return (
    <Mainlayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Profile" }]} />
      </div>
      <div className={`${styles.container} container`}>
        <div className={`${styles.formcont} row rounded`}>
          {/* Profile Info */}
          <div
            className={`${styles.div1} col-12 text-center pt-3 px-4 d-flex`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={styles["c-avatar"]}>
              <img
                className={styles["c-avatar__image"]}
                src={previewImage || admin}
                alt="Profile"
              />
              <span
                className={`${styles["c-avatar__status"]} ${
                  styles[getStatusClass()]
                }`}
              ></span>
              {isHovered && (
                <div className={styles["hover-overlay"]}>
                  <label className={styles["icon-container"]}>
                    <UilEdit size={30} className={styles.icon} />
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.hidden}
                      onChange={handleImageUpload}
                    />
                  </label>
                  {/* <UilTrashAlt
                    size={30}
                    className={styles.icon}
                    onClick=""
                  /> */}
                </div>
              )}
            </div>
            <div className="text-start my-auto">
              <h3>{profileData.username}</h3>
              <p className={styles.title}>
                {profileData.email} -{" "}
                <span className={styles.title1}>{profileData.username}</span>
              </p>
            </div>
          </div>

          {/* Password Update Form */}
          <div className={`${styles.div2} col-12 pb-3 px-4`}>
            <h2 className="pt-3 mb-0 pb-0">Account Settings</h2>
            <hr className={`${styles.hr} mb-4`} />
            <form onSubmit={handleUpdate}>
              {/* Username */}
              <div className={`${styles.inputdiv} mb-3 d-flex`}>
                <label className={`${styles.lables} form-label my-auto`}>
                  Username
                </label>
                <input
                  type="text"
                  className={`${styles.control} form-control`}
                  name="username"
                  value={profileData.username}
                  readOnly
                />
              </div>

              {/* Email */}
              <div className={`${styles.inputdiv} mb-3 d-flex`}>
                <label className={`${styles.lables} form-label my-auto`}>
                  Email
                </label>
                <input
                  type="email"
                  className={`${styles.control} form-control`}
                  name="email"
                  value={profileData.email}
                  readOnly
                />
              </div>

              {/* Phone */}
              <div className={`${styles.inputdiv} mb-3 d-flex`}>
                <label className={`${styles.lables} form-label my-auto`}>
                  Phone
                </label>
                <input
                  type="text"
                  className={`${styles.control} form-control`}
                  name="phone"
                  value={profileData.phone}
                  readOnly
                />
              </div>

              {/* Password */}
              <div
                className={`${styles.inputdiv} mb-3 d-flex align-items-center`}
              >
                <label className={`${styles.lables} form-label my-auto`}>
                  Password
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "50%",
                    marginLeft: "-23px",
                  }}
                >
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className={`${styles.control1} form-control`}
                    name="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password (optional)"
                    style={{ paddingRight: "40px" }}
                  />
                  <span
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{
                      position: "absolute",
                      right: "-14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#555",
                    }}
                  >
                    {passwordVisible ? (
                      <UilEyeSlash size={20} />
                    ) : (
                      <UilEye size={20} />
                    )}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div
                className={`${styles.inputdiv} mb-3 d-flex align-items-center`}
              >
                <label className={`${styles.lables} form-label my-auto`}>
                  Confirm Password
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "50%",
                    marginLeft: "-23px",
                  }}
                >
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className={`${styles.control1} form-control`}
                    name="confirm_password"
                    value={profileData.confirm_password}
                    onChange={handleInputChange}
                    placeholder="Confirm new password (optional)"
                    style={{ paddingRight: "40px" }}
                  />
                  <span
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{
                      position: "absolute",
                      right: "-14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#555",
                    }}
                  >
                    {passwordVisible ? (
                      <UilEyeSlash size={20} />
                    ) : (
                      <UilEye size={20} />
                    )}
                  </span>
                </div>
              </div>

              {error && <div className="text-danger mb-3">{error}</div>}

              <div className="text-end">
                <ButtonComp
                  type="submit"
                  className="btn btn-primary"
                  text="Update Profile"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
};

export default User;
