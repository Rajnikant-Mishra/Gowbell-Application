// ResultTemplate.jsx
import React from "react";
import styles from "./Percentage.module.css";

// Import Real SVGs
import GoldMedal from "../../../assets/goldmedal.png";
import SilverMedal from "../../../assets/silvermedal.png";
import BronzeMedal from "../../../assets/bronzemedal.png";
import TrophyIcon from "../../../assets/Trophy.png";

const ResultTemplate = ({ data }) => {
  const {
    schoolName = "ST. XAVIER'S SCHOOL",
    school_code = "WB1234",
    address = "ALIPURDUAR, WEST BENGAL",
    level = "LEVEL-2",
    subject = "GIMO",
    year = "2025",
    students = [],
    cutoffData,
  } = data;

  // CLASS LIST
  const classList = [
    "NUR",
    "LKG",
    "UKG",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  // MEDALS WITH REAL SVGs
  const medalTypes = [
    { name: "Gold", icon: GoldMedal },
    { name: "Silver", icon: SilverMedal },
    { name: "Bronze", icon: BronzeMedal },
  ];

  // DYNAMIC CUTOFF
  const dynamicCutoff = {
    medals: medalTypes,
    classes: classList,
    data: {},
  };

  const formatLevelTitle = (level) => {
    if (!level) return "LEVEL RESULT";

    let formatted = level.toUpperCase().trim();
    formatted = formatted.replace(/\s+/g, "-");

    return `${formatted} RESULT`;
  };

  // Medal-wise Class-wise Cutoff
  medalTypes.forEach((medal) => {
    dynamicCutoff.data[medal.name] = classList.map((cls) => {
      const medalStudents = students.filter((student) => {
        const studentClass = String(student.class_name || "").trim();

        const studentMedal = String(student.medals || "")
          .trim()
          .toLowerCase();

        return (
          studentClass === cls && studentMedal === medal.name.toLowerCase()
        );
      });

      // No winner for this medal in this class
      if (medalStudents.length === 0) {
        return "";
      }

      const highestPercentage = Math.max(
        ...medalStudents.map((student) => Number(student.percentage) || 0),
      );

      const totalStudents = medalStudents.length;

      return `${highestPercentage}% (${totalStudents})`;
    });
  });
  const cutoff = cutoffData || dynamicCutoff;

  // TABLE DATA
  const formattedTableData = students.map((student, index) => ({
    sl: index + 1,
    name: student.student_name?.toUpperCase() || "",
    roll: student.roll_no || "",
    className: student.class_name || "",
    full: student.full_mark || "",
    secured: student.mark_secured || "N/A",
    percentage: student.percentage || "N/A",
    ranking: student.ranking || "",
    medal: student.medals || "—",
    certificate: student.certificate || "N/A",
    remarks: student.remarks || "—",
  }));

  // PAGINATION
  const rowsPerPage = 8;
  const chunkedData = [];
  for (let i = 0; i < formattedTableData.length; i += rowsPerPage) {
    chunkedData.push(formattedTableData.slice(i, i + rowsPerPage));
  }

  const levelNotes = {
    "LEVEL 1": [
      "All participating students who do not qualify for the next level will receive a Certificate of Participation.",
      "Level-1 qualifiers will receive a Certificate of Achievement and a Gold, Silver, or Bronze Medal based on their performance and ranking.",
      "Qualified students will be eligible to appear for the Level-2 Examination.",
      "To download results and scorecards, visit www.gowbell.org.",
      "Requests for rechecking must be submitted by the School Principal/Coordinator via email to results@gowbell.org.",
      "Rechecking requests will be accepted within 7 days from the date of result declaration.",
      "The rechecking fee is ₹150/- per subject.",
      "The decision of the Gowbell Foundation-India Examination Committee shall be final and binding.",
    ],

    "LEVEL 2": [
      "Level-2 qualifiers will receive a Certificate of Achievement and a Gold, Silver, or Bronze Medal based on their performance and ranking.",
      "Qualified students will be eligible to appear for the Level-3 Examination.",
      "No Certificate of Participation shall be issued to students who do not qualify in Level-2.",
      "To download results and scorecards, visit www.gowbell.org.",
      "Requests for rechecking must be submitted by the School Principal/Coordinator via email to results@gowbell.org.",
      "Rechecking requests will be accepted within 7 days from the date of result declaration.",
      "The rechecking fee is ₹150/- per student.",
      "The decision of the Gowbell Foundation-India Examination Committee shall be final and binding.",
    ],

    "LEVEL 3": [
      "Level-3 qualifiers will receive a Certificate of Achievement and a Gold, Silver, or Bronze Medal based on their performance and ranking.",
      "Gold Medalists will receive a Cash Award of ₹1,000/-.",
      "Silver Medalists will receive a Cash Award of ₹750/-.",
      "Bronze Medalists will receive a Cash Award of ₹500/-.",
      "Qualified students will be eligible to appear for the Level-4 Examination.",
      "No Certificate of Participation shall be issued to students who do not qualify in Level-3.",
      "To download results and scorecards, visit www.gowbell.org.",
      "Requests for rechecking must be submitted by the School Principal/Coordinator via email to results@gowbell.org.",
      "Rechecking requests will be accepted within 7 days from the date of result declaration.",
      "The rechecking fee is ₹150/- per student.",
      "The decision of the Gowbell Foundation-India Examination Committee shall be final and binding.",
    ],

    "LEVEL 4": [
      "Level-4 qualifiers will receive a Certificate of Achievement, Trophy, and a Cash Award of ₹10,000/-.",
      "Level-4 is the Final Round of the Gowbell Olympiad Examination.",
      "No Certificate of Participation shall be issued to students who do not qualify in Level-4.",
      "To download results and scorecards, visit www.gowbell.org.",
      "Requests for rechecking must be submitted by the School Principal/Coordinator via email to results@gowbell.org.",
      "Rechecking requests will be accepted within 7 days from the date of result declaration.",
      "The rechecking fee is ₹150/- per student.",
      "The decision of the Gowbell Foundation-India Examination Committee shall be final and binding.",
    ],
  };

  const currentNotes = levelNotes[level?.toUpperCase()] || [];

  return (
    <div className={styles.pdfWrapper}>
      {/* ========================= COVER PAGE ========================= */}
      <div className={styles.pageContainer}>
        <h2>
          {subject}-{year}
        </h2>
        <h1>{level}</h1>
        <h3>{year}</h3>
        <h3>{schoolName}</h3>
        <h3>{address}</h3>
        <h3>{school_code}</h3>
      </div>

      {/* ========================= RESULT PAGES ========================= */}
      {chunkedData.map((pageRows, pageIndex) => (
        <div className={styles.secondPageContentSection} key={pageIndex}>
          <div className={styles.tableOuterContainer}>
            {/* CUTOFF TITLE */}
            <div className={styles.cutoffTitle}>
              <span>★</span> CLASS AND SUBJECT WISE CUTOFF PERCENTAGE{" "}
              <span>★</span>
            </div>

            {/* CUTOFF TABLE with Real Medal SVGs */}
            <table className={styles.cutoffTable}>
              <thead>
                <tr>
                  <th>Medals</th>
                  {cutoff.classes.map((cls, i) => (
                    <th key={i}>{cls}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cutoff.medals.map((medal, mIndex) => (
                  <tr key={mIndex}>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={medal.icon}
                        alt={medal.name}
                        style={{ width: "32px", height: "32px" }}
                      />
                      <span>{medal.name}</span>
                    </td>
                    {cutoff.data[medal.name].map((value, cIndex) => (
                      <td key={cIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* RESULT TITLE with Real Trophy */}
            <div className={styles.resultLevelTitle}>
              <div className={styles.middleIcon}>
                <img
                  src={TrophyIcon}
                  alt="trophy"
                  className={styles.footerSvg}
                />
              </div>
              {formatLevelTitle(level)}
            </div>

            {/* RESULT TABLE */}
            <div className={styles.tableWrapper}>
              <table className={styles.resultTable}>
                <thead>
                  <tr>
                    <th>Sl.No</th>
                    <th>Student’s Name</th>
                    <th>Roll No</th>
                    <th>Class</th>
                    <th>Full Marks</th>
                    <th>Secured Marks</th>
                    <th>Percentage</th>
                    <th>Ranking</th>
                    <th>Medal Awarded</th>
                    <th>Certificate Awarded</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((student, index) => (
                    <tr key={index}>
                      <td>{student.sl}</td>
                      <td>{student.name}</td>
                      <td>{student.roll}</td>
                      <td>{student.className}</td>
                      <td>{student.full}</td>
                      <td>{student.secured}</td>
                      <td>{student.percentage}</td>
                      <td>{student.ranking}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{student.medal}</td>
                      <td>{student.certificate}</td>
                      <td>{student.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.notesPage}>
        <div className={styles.notesPageContent}>
          <div className={styles.notesTitle}>
            IMPORTANT INSTRUCTIONS ({level})
          </div>

          {currentNotes.map((note, index) => (
            <div key={index} className={styles.noteRow}>
              <span>{index + 1}.</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultTemplate;
