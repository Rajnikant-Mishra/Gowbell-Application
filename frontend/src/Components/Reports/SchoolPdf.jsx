import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import gowbellLogo from "../../assets/logo gowbell.jpg"; // replace with actual path
import sunLogo from "../../assets/celebrate.png"; // replace with actual path

export default function SchoolPdf({ schoolData }) {
  // Define widths for each column (must add up close to 100%)
  const columnWidths = [
    "3%",   // sl.no
    "6%",   // board
    "8%",  // school_name
    "6%",   // school_id
    "8%",  // principal_name
    "13%",  // principal_contact_number
    "10%",  // principal_whatsapp
    "12%",  // first_incharge_name
    "12%",  // first_incharge_number
    "13%",  // first_incharge_whatsapp
    "5%",   // city
    "5%",   // district
    "5%",   // state
    "5%",   // country
  ];

  const headings = [
    "sl.no",
    "board",
    "school_name",
    "school_id",
    "principal_name",
    "principal_contact_number",
    "principal_whatsapp",
    "first_incharge_name",
    "first_incharge_number",
    "first_incharge_whatsapp",
    "city",
    "district",
    "state",
    "country",
  ];

  // Dynamically populate rowData from schoolData prop
  const rowData = [
    schoolData?.sl_no || "1", // sl.no (default to 1 if not provided)
    schoolData?.board || "",
    schoolData?.school_name || "",
    schoolData?.school_id || schoolData?.school_code || "",
    schoolData?.principal_name || "",
    schoolData?.principal_contact_number || "",
    schoolData?.principal_whatsapp || "",
    schoolData?.first_incharge_name || "",
    schoolData?.first_incharge_number || "",
    schoolData?.first_incharge_whatsapp || "",
    schoolData?.city_name || schoolData?.city || "",
    schoolData?.district_name || schoolData?.district || "",
    schoolData?.state_name || schoolData?.state || "",
    schoolData?.country_name || schoolData?.country || "",
  ];

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        // overflowX: "auto",
      }}
    >
      <Table
        sx={{
          border: "1px solid black",
          borderCollapse: "collapse",
          width: "100%",
          tableLayout: "fixed", // required for column widths to stick
        }}
      >
        {/* Column widths */}
        <colgroup>
          {columnWidths.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>

        <TableHead>
          {/* Top Row with Logos and Title */}
          <TableRow>
            {/* Gowbell Logo same width as school_name column */}
            <TableCell
              sx={{
                borderBottom: "1px solid black",
                textAlign: "center",
                p: 0.5,
              }}
            >
              <img src={gowbellLogo} alt="Gowbell Logo" style={{ height: 45,  width:150}} />
            </TableCell>
            {/* Empty cells to fill until title */}
            <TableCell colSpan={2} sx={{ borderBottom: "1px solid black" }}></TableCell>

            {/* Center Title */}
            <TableCell colSpan={6} sx={{ border: "1px solid black", p: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#000",
                    lineHeight: 1.4,
                  }}
                >
                  GOWBELL FOUNDATION-INDIA
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#000",
                    lineHeight: 1.4,
                  }}
                >
                  SCHOOL REGISTRATION DETAILS-2025-26
                </Typography>
              </Box>
            </TableCell>

            {/* Empty cells before Sun Logo */}
            <TableCell colSpan={4} sx={{ borderBottom: "1px solid black" }}></TableCell>

            {/* Sun Logo same width as first_incharge_whatsapp column */}
            <TableCell
              sx={{
                borderBottom: "1px solid black",
                // textAlign: "center",
                p: 0.5,
              }}
            >
              <img src={sunLogo} alt="Sun Logo" style={{ height: 45, marginLeft: -200, width: 90 }} />
            </TableCell>
          </TableRow>

          {/* Headings Row */}
          <TableRow>
            {headings.map((heading, index) => (
              <TableCell
                key={index}
                sx={{
                  border: "1px solid black",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  textAlign: "center",
                  padding: "4px 6px",
                  lineHeight: 1.2,
                  wordWrap: "break-word",
                }}
              >
                {heading.toUpperCase()}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            {rowData.map((value, index) => (
              <TableCell
                key={index}
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {value}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}