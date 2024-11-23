import React from "react";
import Button from "@mui/material/Button";
import styles from "./ButtonComp.module.css";
export default function ButtonComp({ text, type, onClick, disabled }) {
  return (
    <Button
      type={type}
      variant="contained"
      className={`${styles.button} rounded-0`}
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: text === "Cancel" ? "red" : "#8fd14f",
        color: "ffffff",
      }}
    >
      {text}
    </Button>
  );
}
