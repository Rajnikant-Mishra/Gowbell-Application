import React from "react";
import styles from "./Medal.module.css";
import logoimg from "../../../assets/logo gowbell.jpg"; // Gowbell Foundation logo
import gimoLogo from "../../../assets/gimo image.png"; // GIMO logo
import gidoLogo from "../../../assets/gido image.png"; // GIDO logo
import gisoLogo from "../../../assets/giso image.png"; // GISO logo
import gikoLogo from "../../../assets/giko  image.png";
import jtdoLogo from "../../../assets/jtdo image.png";
import cywoLogo from "../../../assets/cywo image.png";
import gicoLogo from "../../../assets/gico image.png";
import gieoLogo from "../../../assets/gieo image.png";

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
  singleSubject, // Prop to render a single subject's data
}) => {
  // Define class headers as in Pdfa
  const classHeaders = [
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

  // Filter winners list for the subject
  const studentData = subjectToRender
    .map((subjectName) =>
      winnersList
        .filter((winner) => winner.subject === subjectName)
        .map((winner, index) => ({
          sl: index + 1,
          name: winner.name || "N/A",
          roll: winner.rollNo || "N/A",
          className: winner.class || "N/A",
          fullMarks: winner.fullMarks || "N/A",
          secured: winner.securedMarks || "N/A",
          percent: winner.percentage || "N/A",
          rank: winner.ranking || "N/A",
          medal: winner.medal || "N/A",
          certificate: winner.certificate || "N/A",
          remarks: winner.remarks || "",
        }))
    )
    .flat();

  // Construct full address
  const fullAddress = `
  ${schoolAddress || "N/A"}, 
  `;

  // Dynamic logo selection based on subject
  const getDynamicLogo = () => {
    const subject = singleSubject || subjectNames[0]; // Use singleSubject or first subjectName
    if (subject?.toUpperCase().includes("GIMO")) {
      return { src: gimoLogo, alt: "SIMO Logo" };
    } else if (subject?.toUpperCase().includes("GISO")) {
      return { src: gisoLogo, alt: "GIMO Logo" };
    } else if (subject?.toUpperCase().includes("GIEO")) {
      return { src: gieoLogo, alt: "GISO Logo" };
    } else if (subject?.toUpperCase().includes("GIDO")) {
      return { src: gidoLogo, alt: "GIMO Logo" };
    } else if (subject?.toUpperCase().includes("GICO")) {
      return { src: gicoLogo, alt: "GIMO Logo" };
    } else if (subject?.toUpperCase().includes("GIKO")) {
      return { src: gikoLogo, alt: "GIMO Logo" };
    } else if (subject?.toUpperCase().includes("JTDO")) {
      return { src: jtdoLogo, alt: "GIMO Logo" };
    } else if (subject?.toUpperCase().includes("CYWO")) {
      return { src: cywoLogo, alt: "GIMO Logo" };
    } else {
      return { src: gidoLogo, alt: "GIDO Logo" }; // Default logo
    }
  };

  const dynamicLogo = getDynamicLogo();

  //FOR DYNAMIC SIBJECT NAME SHOW
  const subjectCodeMap = {
    GIMO: "MATHEMATICS",
    GISO: "SCIENCE",
    GIEO: "ENGLISH",
    GICO: "CYBER",
    GIKO: "KNOWLEDGE",
    JIDO: "DRAWING",
  };

  // Handles both singleSubject (string) and subjectNames (array)
  const getSubjectName = (subject) => {
    if (!subject) return "";

    if (typeof subject === "string") {
      return subjectCodeMap[subject] || subject;
    }

    // If it's an array, map each code to full name
    return subject.map((code) => subjectCodeMap[code] || code).join(", ");
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={`${styles.headerSection} gap-4`}>
        <div className={styles.leftLogo}>
          <img src={logoimg} alt="Gowbell Logo" />
        </div>
        {/* <div className={styles.centerInfo}>
          <h2>GOWBELL FOUNDATION-INDIA</h2>
          <h2>
            GOWBELL INTERNATIONAL {singleSubject || subjectNames.join(", ")}{" "}
            OLYMPIAD (2024-25)
          </h2>
        </div> */}
        <div className={styles.centerInfo}>
          <h2>GOWBELL FOUNDATION-INDIA</h2>
          <h2>
            GOWBELL INTERNATIONAL{" "}
            {getSubjectName(singleSubject || subjectNames)} OLYMPIAD (2024-25)
          </h2>
        </div>
        <div className={`${styles.rightLogo} `}>
          {/* <img src="" alt="Shared Logo" /> */}
          <img src={dynamicLogo.src} alt={dynamicLogo.alt} />
        </div>
      </div>

      {/* School Address */}
      <div className={`${styles.address} uppercase`}>
        <p>
          {schoolName || "ABHIPSHA INTERNATIONAL SCHOOL"}
          <br />
          {fullAddress.split(", ").map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className={styles.secondcont}>
        <div className="d-flex justify-content-center ">
          {" "}
          <div className={`${styles.resultsBox} mx-auto`}>LEVEL-1-PRIZES</div>
        </div>

        {/* Cutoff Table */}
        {/* <div className={styles.tableWrapper}>
          <table className={styles.cutoffTable}>
            <thead>
              <tr>
                <th colSpan={classHeaders.length + 1}>
                  CLASS AND SUBJECT WISE CUTOFF PERCENTAGE
                </th>
              </tr>
              <tr>
                <th>Medals</th>
                {classHeaders.map((ch, idx) => (
                  <th key={idx}>{ch}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cutoffData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.medal}</td>
                  {row.data.map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* Student Result Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Student’s Name</th>
                <th>Roll No</th>
                <th>Class</th>
                {/* <th>Full Marks</th> */}
                {/* <th>Secured Marks</th> */}
                {/* <th>Percentage</th> */}
                {/* <th>Ranking</th> */}
                <th>Medal Awarded</th>
                <th>Certificate Awarded</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length > 0 ? (
                studentData.map((s) => (
                  <tr key={s.sl}>
                    <td>{s.sl}</td>
                    <td>{s.name}</td>
                    <td>{s.roll}</td>
                    <td>{s.className}</td>
                    {/* <td>{s.fullMarks}</td>
                    <td>{s.secured}</td>
                    <td>{s.percent}</td>
                    <td>{s.rank}</td> */}
                    <td>{s.medal}</td>
                    <td>{s.certificate}</td>
                    <td>{s.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11}>No students found for this subject.</td>
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
