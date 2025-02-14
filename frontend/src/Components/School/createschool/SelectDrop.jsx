import React from "react";
import { TextField, MenuItem } from "@mui/material";

const SelectDrop = ({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  fullWidth,
}) => {
  return (
    <TextField
      select
      label={label}
      name={name}
      value={value}
      onChange={onChange} // Pass the event to Formik
      onBlur={onBlur} // Mark the field as touched
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
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
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectDrop;