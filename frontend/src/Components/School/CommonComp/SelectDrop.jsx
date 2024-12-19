import React from "react";
import styles from "./SelectDrop.module.css";
import { TextField, MenuItem, InputAdornment } from "@mui/material";
const SelectDrop = ({ label, name, options, value, onChange }) => {
  return (
    <div className={styles.selectDropContainer}>
      <TextField
        select
        label={label}
        name={name}
        value={value}
        size="small"
        onChange={onChange}
        fullWidth
        style={{ fontFamily: "Nunito, sans-serif" }}
        InputProps={{
          style: {
            fontFamily: "Nunito, sans-serif",
            fontSize: "0.8rem",
            backgroundColor: "white",
          },
        }}
        InputLabelProps={{
          style: {
            fontFamily: "Nunito, sans-serif",
            fontSize: "0.85rem",
            fontWeight: "bolder",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.85rem" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};
export default SelectDrop;