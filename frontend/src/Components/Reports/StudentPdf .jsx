// import React from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import gowbellLogo from "../../assets/logo gowbell.jpg"; // replace with actual path
// import sunLogo from "../../assets/celebrate.png"; // replace with actual path

// export default function SchoolRegistrationTable() {
//   // Define widths for each column (must add up close to 100%)
//   const columnWidths = [
//     "2%", // sl.no
//     "8%", // board
//     "3%", // school_name
//     "5%", // school_id
//     "5%", // principal_name
//     "5%", // principal_contact_number
//     "8%", // first_incharge_whatsapp
//     "5%", // city
//     "5%", // district
//     "5%", // state
//     "5%", // country
//   ];

//   const headings = [
//     "sl.no",
//     "student name",
//     "class name",
//     "student section",
//     "mobile number",
//     "whatsApp number",
//     "student subject",
//     "city",
//     "district",
//     "state",
//     "country",
//   ];

//   const rowData = [
//     "", // sl.no
//     "", // board
//     "", // school_name
//     "", // school_id
//     "", // principal_name
//     "7991048546", // principal_contact_number
//     "9898789078", // first_incharge_whatsapp
//     "", // city
//     "", // district
//     "", // state
//     "", // country
//   ];

//   return (
//     <Box
//       sx={{
//         p: 1,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         width: "100%",
//         overflowX: "auto",
//       }}
//     >
//       <Table
//         sx={{
//           border: "1px solid black",
//           borderCollapse: "collapse",
//           width: "100%",
//           tableLayout: "fixed", // required for column widths to stick
//         }}
//       >
//         {/* Column widths */}
//         <colgroup>
//           {columnWidths.map((w, i) => (
//             <col key={i} style={{ width: w }} />
//           ))}
//         </colgroup>

//         <TableHead>
//           {/* Top Row with Logos and Title */}
//           <TableRow>
//             {/* Gowbell Logo same width as school_name column */}
//             <TableCell
//               sx={{
//                 borderBottom: "1px solid black",
//                 textAlign: "center",
//                 p: 0.5,
//               }}
//             >
//               <img
//                 src={gowbellLogo}
//                 alt="Gowbell Logo"
//                 style={{ height: 60, marginLeft: 45, width: 200 }}
//               />
//             </TableCell>
//             {/* Empty cells to fill until title */}
//             <TableCell
//               colSpan={1}
//               sx={{ borderBottom: "1px solid black" }}
//             ></TableCell>

//             {/* Center Title */}
//             <TableCell colSpan={6} sx={{ border: "1px solid black", p: 1 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontWeight: "bold",
//                     fontSize: "1rem",
//                     color: "#000",
//                     lineHeight: 1.4,
//                   }}
//                 >
//                   GOWBELL FOUNDATION-INDIA
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontWeight: "bold",
//                     fontSize: "1rem",
//                     color: "#000",
//                     lineHeight: 1.4,
//                   }}
//                 >
//                   STUDENTS REGISTRATION DETAILS(SRD)-2025-26
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontWeight: "bold",
//                     fontSize: "1rem",
//                     color: "#2640ebff",
//                     lineHeight: 1.4,
//                   }}
//                 >
//                   school name
//                 </Typography>
//               </Box>
//             </TableCell>

//             {/* Empty cells before Sun Logo */}
//             <TableCell
//               colSpan={2}
//               sx={{ borderBottom: "1px solid black" }}
//             ></TableCell>

//             {/* Sun Logo same width as first_incharge_whatsapp column */}
//             <TableCell
//               sx={{
//                 borderBottom: "1px solid black",
//                 // textAlign: "center",
//                 p: 0.5,
//               }}
//             >
//               <img
//                 src={sunLogo}
//                 alt="Sun Logo"
//                 style={{ height: 55, marginLeft: -140, width: 90 }}
//               />
//             </TableCell>
//           </TableRow>

//           {/* Headings Row */}
//           <TableRow>
//             {headings.map((heading, index) => (
//               <TableCell
//                 key={index}
//                 sx={{
//                   border: "1px solid black",
//                   fontWeight: "bold",
//                   fontSize: "0.75rem",
//                   textAlign: "center",
//                   padding: "4px 6px",
//                   lineHeight: 1.2,
//                   wordWrap: "break-word",
//                 }}
//               >
//                 {heading.toUpperCase()}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           <TableRow>
//             {rowData.map((value, index) => (
//               <TableCell
//                 key={index}
//                 sx={{
//                   border: "1px solid black",
//                   textAlign: "center",
//                   padding: "4px 6px",
//                   wordWrap: "break-word",
//                 }}
//               >
//                 {value}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableBody>
//       </Table>
//     </Box>
//   );
// }


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

export default function StudentPdf({
  schoolName,
  students,
  cityName,
  districtName,
  stateName,
  countryName,
}) {
  // Define widths for each column (must add up close to 100%)
  const columnWidths = [
    "2%", // sl.no
    "8%", // student name
    "3%", // class name
    "5%", // student section
    "5%", // mobile number
    "5%", // whatsApp number
    "8%", // student subject
    "5%", // city
    "5%", // district
    "5%", // state
    "5%", // country
  ];

  const headings = [
    "sl.no",
    "student name",
    "class name",
    "student section",
    "mobile number",
    "whatsApp number",
    "student subject",
    "city",
    "district",
    "state",
    "country",
  ];

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        overflowX: "auto",
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
              <img
                src={gowbellLogo}
                alt="Gowbell Logo"
                style={{ height: 60, width: 140 }}
              />
            </TableCell>
            {/* Empty cells to fill until title */}
            <TableCell
              colSpan={1}
              sx={{ borderBottom: "1px solid black" }}
            ></TableCell>

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
                  STUDENTS REGISTRATION DETAILS(SRD)-2025-26
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#2640ebff",
                    lineHeight: 1.4,
                  }}
                >
                  {schoolName}
                </Typography>
              </Box>
            </TableCell>

            {/* Empty cells before Sun Logo */}
            <TableCell
              colSpan={2}
              sx={{ borderBottom: "1px solid black" }}
            ></TableCell>

            {/* Sun Logo same width as first_incharge_whatsapp column */}
            <TableCell
              sx={{
                borderBottom: "1px solid black",
                // textAlign: "center",
                p: 0.5,
              }}
            >
              <img
                src={sunLogo}
                alt="Sun Logo"
                style={{ height: 55, marginLeft: -140, width: 90 }}
              />
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
          {students.map((student, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {index + 1}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {student.name}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {student.className}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {student.section}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {student.mobileNumber}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {student.mobileNumber} {/* Assuming same as mobile; adjust if separate field available */}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {student.subjectNames}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {cityName}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {districtName}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {stateName}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "4px 6px",
                  wordWrap: "break-word",
                }}
              >
                {countryName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}