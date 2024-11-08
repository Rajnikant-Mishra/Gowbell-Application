import React, { useState } from "react";
import styles from "./AdminLogin.module.css";
import TextField from "@mui/material/TextField";
import { Button, InputAdornment } from "@mui/material";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("Password");
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setPasswordType(showPassword ? "password" : "text");
  };
  return (
    <div className={styles.background}>
      <div>
        <div className={styles.formContainer}>
          <h3 className={styles.subtitle}>Admin Login</h3>

          <div className={`${styles.inputContainer} mb-3`}>
            <TextField
              id="username-input"
              type="text"
              required
              label="Username"
              variant="standard"
              fullWidth
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
              className={styles.input}
              aria-label="email input"
              autoComplete="off"
              required
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
              className={styles.input}
              aria-label="password input"
              autoComplete="off"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
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
              type="button"
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
        </div>
      </div>
    </div>
  );
}
