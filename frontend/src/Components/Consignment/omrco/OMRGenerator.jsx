import React from "react";
import { jsPDF } from "jspdf";



const OMRGenerator = () => {
  // Sample student data (replace with dynamic data as needed)
  const studentData = Array.from({ length: 50 }, (_, i) => ({
    studentName: `Student ${i + 1}`,
    classroom: `Classroom ${Math.floor(i / 25) + 1}`,
    schoolName: "XYZ High School",
  }));

  // Function to generate OMR PDF
  const generateOMR = () => {
    const doc = new jsPDF();
    const totalSheets = studentData.length;
    const sheetsPerPage = 2; // Two OMR sheets per page
    const rowsPerSheet = 25; // Number of rows per sheet (OMR forms)
    const columnsPerSheet = 2; // Number of columns (2 OMR sheets per page)

    const margin = 10;
    const columnWidth =
      (doc.internal.pageSize.width - 2 * margin) / columnsPerSheet;
    const rowHeight = 40; // Height for each row of OMR input

    // Iterate over all the student data to populate the OMR sheets
    for (let i = 0; i < totalSheets; i++) {
      if (i % sheetsPerPage === 0 && i !== 0) {
        doc.addPage(); // Add new page after every 2 sheets
      }

      const student = studentData[i];
      const xPosition = i % sheetsPerPage === 0 ? 0 : columnWidth; // Left or Right column
      const yPosition =
        margin + Math.floor(i / columnsPerSheet) * rowHeight * rowsPerSheet; // Position on the page

      // Add student information dynamically for each OMR sheet
      doc.setFontSize(10);
      doc.text(`School: ${student.schoolName}`, xPosition + 5, yPosition + 10);
      doc.text(`Class: ${student.classroom}`, xPosition + 5, yPosition + 15);
      doc.text(
        `Student Name: ${student.studentName}`,
        xPosition + 5,
        yPosition + 20
      );

      // Draw OMR circles (you can modify the number of circles as needed)
      const firstCircleX = xPosition + 10;
      const firstCircleY = yPosition + 30;

      for (let j = 0; j < rowsPerSheet; j++) {
        doc.circle(firstCircleX, firstCircleY + j * 10, 4); // Circle for OMR input
        doc.circle(firstCircleX + 30, firstCircleY + j * 10, 4); // Another option for OMR input
        doc.circle(firstCircleX + 60, firstCircleY + j * 10, 4);
      }
    }

    doc.save("OMR_Sheets.pdf");
  };

  return (
    <Mainlayout>
      <div>
        <h1>OMR Sheet Generator</h1>
        <button onClick={generateOMR}>Generate OMR Sheets</button>
        <OMRSheet />
      </div>
    </Mainlayout>
  );
};

export default OMRGenerator;
