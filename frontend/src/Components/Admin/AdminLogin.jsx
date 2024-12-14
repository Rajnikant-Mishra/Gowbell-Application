// // src/Components/Admin/AdminLogin.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import styles from "./AdminLogin.module.css";
// import TextField from "@mui/material/TextField";
// import { Button, InputAdornment } from "@mui/material";
// import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
// import { MdVisibility, MdVisibilityOff } from "react-icons/md";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "animate.css";


// export default function AdminLogin() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordType, setPasswordType] = useState("password");
//   // const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handlePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//     setPasswordType(showPassword ? "password" : "text");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         {  email, password }
//       );

//       login(response.data.token); // Store token via context

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: "You have logged in successfully!",
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//         toast: true,
//         customClass: {
//           popup: "animate__animated animate__fadeInDown",
//           title: "text-success fw-bold",
//           text: "text-dark",
//         },
//         background: "#fff",
//       }).then(() => {
//         navigate("/dashboard");
//       });
//     } catch (err) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error!",
//         text: err.response?.data?.message || "Invalid email or password",
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//         toast: true,
//         customClass: {
//           popup: "animate__animated animate__shakeX",
//           title: "text-danger fw-bold",
//           text: "text-dark",
//         },
//         background: "#fff",
//       });
//     }
//   };

//   return (
//     <div className={styles.background}>
//       <div className={styles.formContainer}>
//         <h3 className={styles.subtitle}>Admin Login</h3>

//         <form onSubmit={handleSubmit}>
         
//           {/* Email Input */}
//           <div className={`${styles.inputContainer} mb-3`}>
//             <TextField
//               id="email-input"
//               type="email"
//               label="Email"
//               variant="standard"
//               fullWidth
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className={styles.input}
//               aria-label="email input"
//               autoComplete="off"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FaEnvelope />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </div>

//           {/* Password Input */}
//           <div className={`${styles.inputContainer} mb-3`}>
//             <TextField
//               id="password-input"
//               type={passwordType}
//               label="Password"
//               variant="standard"
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className={styles.input}
//               aria-label="password input"
//               autoComplete="off"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FaLock />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     {showPassword ? (
//                       <MdVisibilityOff onClick={handlePasswordVisibility} />
//                     ) : (
//                       <MdVisibility onClick={handlePasswordVisibility} />
//                     )}
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </div>

//           <div className={styles.actions}>
//             <Button
//               type="submit"
//               className={styles.loginBtn}
//               variant="contained"
//               fullWidth
//             >
//               Log In
//             </Button>
//             <a href="#" className={styles.forgotPassword}>
//               Forgot Password?
//             </a>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextsAuthsecurity/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import "animate.css";
import styles from "./AdminLogin.module.css";
import image from "../../../public/login-img.jpg";
const AdminLogin = () => {
  // const [showPassword, setShowPassword] = useState(false);
  // const [passwordType, setPasswordType] = useState("password");
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  // const handlePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  //   setPasswordType(showPassword ? "password" : "text");
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      login(response.data.token); // Store token via context
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: "You have logged in successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        customClass: {
          popup: "animate__animated animate__fadeInDown",
          title: "text-success fw-bold",
          text: "text-dark",
        },
        background: "#fff",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Invalid email or password",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        customClass: {
          popup: "animate__animated animate__shakeX",
          title: "text-danger fw-bold",
          text: "text-dark",
        },
        background: "#fff",
      });
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <h3>
            Login to <strong>Gowbell</strong>
          </h3>
          <p className={styles.description}>
            Welcome to GowBell Admin Portal – Securely manage exams and
            streamline administration with ease.
          </p>
          <form onSubmit={handleSubmit}>
            <div className={`${styles.formGroup} ${styles.first}`}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                className={styles.formControl}
                placeholder="your-email@gmail.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="email input"
                autoComplete="off"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.last} ${styles.mb3}`}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={styles.formControl}
                placeholder="Your Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="password input"
                autoComplete="off"
              />
            </div>
            <div className="d-flex mb-5 justify-content-between">
              <label
                className={`${styles.control} ${styles.controlCheckbox} mb-0`}
              >
                <span className={styles.caption}>Remember me</span>
                <input
                  type="checkbox"
                  // checked={rememberMe}
                  // onChange={() => setRememberMe(!rememberMe)}
                />
                <div className={styles.control__indicator}></div>
              </label>
              <span className="ml-auto">
                <a href="#" className={styles.forgotPass}>
                  Forgot Password
                </a>
              </span>
            </div>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${image})` }}
      >
        <p> Copyright © 2024 Gowbell Foundation | Powered by EvoqueSys</p>
      </div>
    </div>
  );
};
export default AdminLogin;