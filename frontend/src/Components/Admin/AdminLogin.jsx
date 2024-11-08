import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import TextField from "@mui/material/TextField";
import { Button, InputAdornment } from "@mui/material";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setPasswordType(showPassword ? "password" : "text");
  };


  // Initialize navigate function
  const navigate = useNavigate();


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, email, password }
      );

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // SweetAlert success message
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Successfully Login!.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        position: "top-end",
        icon: "error",
        text: "Invalid email or password",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.formContainer}>
        <h3 className={styles.subtitle}>Admin Login</h3>

        <form onSubmit={handleSubmit}>
          <div className={`${styles.inputContainer} mb-3`}>
            <TextField
              id="username-input"
              type="text"
              label="Username"
              variant="standard"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
              aria-label="username input"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUserCircle />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={`${styles.inputContainer} mb-3`}>
            <TextField
              id="email-input"
              type="email"
              label="Email"
              variant="standard"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              aria-label="email input"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaEnvelope />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={`${styles.inputContainer} mb-3`}>
            <TextField
              id="password-input"
              type={passwordType}
              label="Password"
              variant="standard"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              aria-label="password input"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {showPassword ? (
                      <MdVisibilityOff onClick={handlePasswordVisibility} />
                    ) : (
                      <MdVisibility onClick={handlePasswordVisibility} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              className={styles.loginBtn}
              variant="contained"
              fullWidth
            >
              Log In
            </Button>
            <a href="#" className={styles.forgotPassword}>
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
