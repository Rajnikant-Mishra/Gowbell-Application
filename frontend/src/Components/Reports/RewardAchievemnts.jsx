
import React from "react";
import styles from "./rewardWinner.module.css";
import logoimg from "../../assets/logo gowbell.jpg"; // Gowbell Foundation logo
import gimoLogo from "../../assets/gimo image.png"; // GIMO logo
import gidoLogo from "../../assets/gido image.png"; // GIDO logo
import gisoLogo from "../../assets/giso image.png"; // GISO logo
import gikoLogo from "../../assets/giko  image.png";
import jtdoLogo from "../../assets/jtdo image.png";
import cywoLogo from "../../assets/cywo image.png";
import gicoLogo from "../../assets/gico image.png";
import gieoLogo from "../../assets/gieo image.png";

const MedalsWinnersList = ({
  winnersList,
  classCutoff,
  schoolName,
  schoolAddress,
  subjectIds,
  subjectNames,
  classId,
  country,
  state,
  district,
  city,
  className,
  singleSubject, // Prop to render a single subject's data
}) => {
  // Define class headers based on the current class
  const classHeaders = [className];

  // Filter data for the single subject if provided, else use all subjects
  const subjectToRender = singleSubject ? [singleSubject] : subjectNames;

  // Prepare cutoff data for the subject
  const cutoffData = subjectToRender
    .map((subjectName) => {
      const subjectCutoff = classCutoff.filter(
        (cutoff) => cutoff.subjects === subjectName
      );

      // Initialize cutoff arrays for each medal
      const goldData = Array(classHeaders.length).fill("");
      const silverData = Array(classHeaders.length).fill("");
      const bronzeData = Array(classHeaders.length).fill("");

      // Map cutoff values to the correct class index
      subjectCutoff.forEach((cutoff) => {
        const classIndex = classHeaders.indexOf(cutoff.class);
        if (classIndex !== -1) {
          goldData[classIndex] = cutoff.gold || "N/A";
          silverData[classIndex] = cutoff.silver || "N/A";
          bronzeData[classIndex] = cutoff.bronze || "N/A";
        }
      });

      return [
        { medal: "Gold", data: goldData },
        { medal: "Silver", data: silverData },
        { medal: "Bronze", data: bronzeData },
      ];
    })
    .flat();

  // Filter winners list for the subject (assuming winnersList is already filtered in parent)
  const studentData = subjectToRender
    .map((subjectName) =>
      winnersList
        .filter((winner) => winner.subject.includes(subjectName))
        .map((winner, index) => ({
          sl: index + 1,
          name: winner.name || "N/A",
          roll: winner.rollNo || "N/A",
          gold: winner.medal === "Gold" ? "1" : "",
          silver: winner.medal === "Silver" ? "1" : "",
          bronze: winner.medal === "Bronze" ? "1" : "",
          total: winner.medal && winner.medal !== "N/A" ? "1" : "",
        }))
    )
    .flat();

  // Calculate totals
  let totalGold = 0;
  let totalSilver = 0;
  let totalBronze = 0;
  let grandTotal = 0;

  studentData.forEach((s) => {
    if (s.gold) totalGold += 1;
    if (s.silver) totalSilver += 1;
    if (s.bronze) totalBronze += 1;
    if (s.total) grandTotal += 1;
  });

  // Construct full address
  const fullAddress = `${schoolAddress || "N/A"}`;

  // Dynamic logo selection based on subject
  const getDynamicLogo = () => {
    const subject = singleSubject || subjectNames[0];
    if (subject?.toUpperCase().includes("GIMO")) {
      return { src: gimoLogo, alt: "GIMO Logo" };
    } else if (subject?.toUpperCase().includes("GISO")) {
      return { src: gisoLogo, alt: "GISO Logo" };
    } else if (subject?.toUpperCase().includes("GIEO")) {
      return { src: gieoLogo, alt: "GIEO Logo" };
    } else if (subject?.toUpperCase().includes("GIDO")) {
      return { src: gidoLogo, alt: "GIDO Logo" };
    } else if (subject?.toUpperCase().includes("GICO")) {
      return { src: gicoLogo, alt: "GICO Logo" };
    } else if (subject?.toUpperCase().includes("GIKO")) {
      return { src: gikoLogo, alt: "GIKO Logo" };
    } else if (subject?.toUpperCase().includes("JTDO")) {
      return { src: jtdoLogo, alt: "JTDO Logo" };
    } else if (subject?.toUpperCase().includes("CYWO")) {
      return { src: cywoLogo, alt: "CYWO Logo" };
    } else {
      return { src: gidoLogo, alt: "Default Logo" };
    }
  };

  const dynamicLogo = getDynamicLogo();

  // Map subject codes to full names
  const subjectCodeMap = {
    GIMO: "MATHEMATICS",
    GISO: "SCIENCE",
    GIEO: "ENGLISH",
    GICO: "CYBER",
    GIKO: "KNOWLEDGE",
    GIDO: "DRAWING",
    JTDO: "DRAWING",
    CYWO: "YOGA",
  };

  const getSubjectName = (subject) => {
    if (!subject) return "";
    if (typeof subject === "string") {
      return subjectCodeMap[subject] || subject;
    }
    return subject.map((code) => subjectCodeMap[code] || code).join(", ");
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={`${styles.headerSection} gap-4`}>
        <div className={styles.leftLogo}>
          <img src={logoimg} alt="Gowbell Logo" />
        </div>
        <div className={styles.centerInfo}>
          <h2 style={{ textTransform: "uppercase" }}>{schoolName}</h2>
          <h2>CERTIFICATE OF ACHIEVEMENTS AND MEDALS (2024-25)</h2>
        </div>

        <div className={`${styles.rightLogo}`}>
          <img src={dynamicLogo.src} alt={dynamicLogo.alt} />
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className={`${styles.resultsBox} mx-auto`}>
          Class - {className}
        </div>
      </div>

      {/* Student Result Table */}
      <div className={styles.secondcont}>
        <div className={styles.tableWrapper}>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Student’s Name</th>
                <th>Roll No</th>
                <th>Gold</th>
                <th>Silver</th>
                <th>Bronze</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length > 0 ? (
                studentData.map((s) => (
                  <tr key={s.sl}>
                    <td>{s.sl}</td>
                    <td>{s.name}</td>
                    <td>{s.roll}</td>
                    <td>{s.gold}</td>
                    <td>{s.silver}</td>
                    <td>{s.bronze}</td>
                    <td>{s.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No students found for this subject.</td>
                </tr>
              )}
              {studentData.length > 0 && (
                <tr>
                  <td colSpan={3}>Total</td>
                  <td>{totalGold}</td>
                  <td>{totalSilver}</td>
                  <td>{totalBronze}</td>
                  <td>{grandTotal}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedalsWinnersList;