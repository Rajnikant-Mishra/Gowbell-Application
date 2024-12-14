import React from "react";
import TextField from "@mui/material/TextField";
import styles from "./TextInput.module.css";
const TextInput = ({ label, name, value, onChange, type }) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      size="small"
      fullWidth
      variant="outlined"
      InputProps={{
        className: styles.inputField,
        style: {
          fontFamily: "Nunito, sans-serif",
          padding: "0px 0px",
          fontSize: "14px",
        },
      }}
      InputLabelProps={{
        style: {
          fontFamily: "Nunito, sans-serif",
          // fontSize: "0.85rem",
          fontSize: "14px",
        },
      }}
      sx={{
        "& .MuiInputBase-input::placeholder": {
          // fontSize: "0.9rem",
          fontSize: "14px",
          transition: "font-size 0.3s",
        },
        "&.Mui-focused .MuiInputBase-input::placeholder": {
          // fontSize: "10px",
          fontSize: "14px",
        },
      }}
    />
  );
};
export default TextInput;
