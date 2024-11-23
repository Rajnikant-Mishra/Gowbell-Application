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
          fontSize: "0.8rem",
        },
      }}
      InputLabelProps={{
        style: {
          fontFamily: "Nunito, sans-serif",
          fontSize: "0.85rem",
        },
      }}
      sx={{
        "& .MuiInputBase-input::placeholder": {
          fontSize: "0.9rem",
          transition: "font-size 0.3s",
        },
        "&.Mui-focused .MuiInputBase-input::placeholder": {
          fontSize: "10px",
        },
      }}
    />
  );
};
export default TextInput;