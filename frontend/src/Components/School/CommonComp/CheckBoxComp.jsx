import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

export default function CheckBoxComp({
  label,
  value,
  checked,
  onChange,
  name,
}) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          value={value}
          size="small"
          name={name}
          color="primary"
          sx={{
            "&.Mui-checked": {
              color: "#3b3e86",
            },
          }}
        />
      }
      label={label}
      labelPlacement="end"
      sx={{
        "& .MuiFormControlLabel-label": {
          fontFamily: "Nunito, sans-serif",
          fontSize: "0.8rem",
        },
      }}
    />
  );
}
