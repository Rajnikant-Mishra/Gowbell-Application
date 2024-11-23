import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { ThemeProvider } from "@mui/material/styles";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { BiCaretDown } from "react-icons/bi";
import styles from "./AccordianComponent";
import theme from "./theme";
export default function AccordionComponent({ title, children }) {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Accordion className="mb-3" sx={{ backgroundColor: "#3B3F86" }}>
          <AccordionSummary
            expandIcon={<BiCaretDown />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{ backgroundColor: "#3B3F86", color: "white" }}
          >
            <Typography>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{children}</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </ThemeProvider>
  );
}
