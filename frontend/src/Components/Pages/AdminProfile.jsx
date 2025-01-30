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
const User = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profileData, setProfileData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setProfileData(JSON.parse(storedUser));
    } else {
      // Redirect to login if no user data is found
      navigate("/login");
    }
  }, [navigate]);

  if (!profileData) {
    return <p>Loading...</p>;
  }

  const [isHovered, setIsHovered] = useState(false);
  const [status, setStatus] = useState("online");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileData({
        ...profileData,
        image: URL.createObjectURL(file),
      });
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleImageDelete = () => {
    setProfileData({ ...profileData, image: "" });
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb data={[{ name: "Profile" }]} />
      </div>
      <div className={`${styles.container} container`}>
        <div className={`${styles.formcont} row rounded`}>
          <div
            className={`${styles.div1} col-12 text-center pt-3 px-4 d-flex`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={`${styles["c-avatar"]}`}>
              <img
                className={styles["c-avatar__image"]}
                src={profileData.image || admin}
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
                  <UilTrashAlt
                    size={30}
                    className={styles.icon}
                    onClick={handleImageDelete}
                  />
                </div>
              )}
            </div>

            <div className="text-start my-auto">
              <h3>{profileData.username}</h3>
              <p className={`${styles.title}`}>
                {profileData.email} -{" "}
                <span className={`${styles.title1}`}>{profileData.username}</span>
              </p>
            </div>
          </div>

          <div className={`${styles.div2} col-12 pb-3 px-4`}>
            <h2 className="pt-3 mb-0 pb-0">Accounts</h2>
            <hr className={`${styles.hr} mb-4`} />
            <form>
            

              <div className={`${styles.inputdiv} mb-3 d-flex`}>
                <label className={`${styles.lables} form-label my-auto`}>
                  Username <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className={`${styles.control} form-control`}
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your Username"
                />
              </div>
              <div className={`${styles.inputdiv} mb-3 d-flex`}>
                <label className={`${styles.lables} form-label my-auto`}>
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  className={`${styles.control} form-control`}
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your Email"
                />
              </div>
              
              <div className={`${styles.inputdiv} mb-3 d-flex`}>
                <label className={`${styles.lables} form-label my-auto`}>
                  Phone <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="phone"
                  className={`${styles.control} form-control`}
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="phone"
                />
              </div>

              <div className={`${styles.inputdiv} mb-3 d-flex`}>
                <label className={`${styles.lables} form-label my-auto`}>
                  Password
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className={`${styles.control} form-control`}
                  name="password"
                  value={profileData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  style={{ position: "relative", width: "50%" }}
                />
                
              </div>
              <div className="text-end">
                <ButtonComp
                  type="submit"
                  onClick={()=>{alert("Please enter your")}}
                  className="btn btn-primary"
                  text="Change Password"
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