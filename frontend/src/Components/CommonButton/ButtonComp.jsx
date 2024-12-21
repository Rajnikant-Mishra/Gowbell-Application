// import React from "react";
// import Button from "@mui/material/Button";
// import styles from "./ButtonComp.module.css";
// export default function ButtonComp({ link,text, type, onClick, disabled }) {
//   return (
//     <Button
//       type={type}
//       variant="contained"
//       className={`${styles.button} rounded-0`}
//       onClick={onClick}
//       disabled={disabled}
//       sx={{
//         backgroundColor: text === "Cancel" ? "red" : "#8fd14f",
//         color: "ffffff",
//       }}
//     >
//       {text}
//     </Button>
//   );
// }
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import styles from "./ButtonComp.module.css";
export default function ButtonComp({ link, text, type, onClick, disabled }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (link) {
      navigate(link);
    }
  };
  return (
    <Button
      type={type}
      variant="contained"
      className={`${styles.button} rounded-0`}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        backgroundColor: text === "Cancel" ? "red" : "#8FD14F",
        color: "ffffff",
      }}
    >
      {text}
    </Button>
  );
}
