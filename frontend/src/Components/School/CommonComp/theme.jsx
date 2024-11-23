import { createTheme } from "@mui/material/styles";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5733", // Custom primary color
    },
    secondary: {
      main: "#E0C2FF", // Secondary color
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: 0, // Ensure top margin is 0
          "& .MuiFormControl-root": {
            marginTop: 0, // Remove margin from form control if applied
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "lightgray",
            },
            "&:hover fieldset": {
              borderColor: "#FF5733",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF5733",
            },
          },
          "& .MuiInputLabel-root": {
            color: "gray",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5733",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: 0, // Set the margin top for FormControl elements to align them properly
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "lightgray",
            },
            "&:hover fieldset": {
              borderColor: "#FF5733",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF5733",
            },
          },
          "& .MuiInputLabel-root": {
            color: "gray",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5733",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#f3f3f3",
          border: "1px solid #E0C2FF",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "auto",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: "#FF5733",
          color: "#fff",
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "#fff", // Icon color when not expanded
          },
          "&.Mui-expanded .MuiAccordionSummary-expandIconWrapper": {
            color: "#E0C2FF", // Icon color when expanded
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          color: "#333",
        },
      },
    },
  },
});

export default theme;
