
import React from "react";
import styles from "./attendance.module.css";
import sheetlogo from "../../../../public/logo GOWBELL.png";

const AttendanceSheet = ({
  studentData = [],
  subject = "HINDI",
  className = "06",
  schoolName = "GAYATRI SMART SCHOOL",
  schoolAddress = "SUDHASADANGI, PO-BRAHMANSUANLO PS-BALIANTA, BHUBANESWAR, ODISHA",
  schoolCode = "OR0829",
  examDate = "28th November, 2024",
  srsSection = "A",
  allottedSec = "A",
  totalStudents = 0,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <img src={sheetlogo} alt="Logo" className={styles.logo} />
        </div>
        <div className={styles.headerCenter}>
          <h2>GOWBELL FOUNDATION</h2>
          <h2 className="d-flex gap-1" style={{ marginBottom: "-1px" }}>
           
            <h2 id="subject" style={{ color: "black" }}>
              {subject}  ATTENDANCE-SHEET (2025-26)
            </h2>
            
          </h2>
        </div>
        <div className={styles.logo}></div>
      </div>


      <div className={`${styles.qrmainSection} gap-3`}>
        <div className="text-black p-2">
          <span className="font-bolder text-black">
            PLEASE CONDUCT EXAM ON CHOSEN DATE ONLY,
          </span>
          <br />
          <span className="font-bolder text-black">
            Chosen Date of Exam: {examDate}
          </span>
        </div>
      </div>

      <div className={styles.schoolInfo}>
        <span className="d-flex mb-2">
          SCHOOL CODE: <span className="schoolCode">{schoolCode}</span>
        </span>

        <div className="d-flex flex-column">
          <span className="d-flex">
            SCHOOL NAME: <br /> & ADDRESS:
            <div className="d-flex flex-column" style={{ width: "50%" }}>
              <span className="schoolName">{schoolName}</span>
              <span className="schoolAddress">{schoolAddress}</span>
            </div>
          </span>
        </div>
      </div>
      <hr style={{ borderBottom: "2px solid black", borderColor: "black" }} />
      <div
        className="mb-1 text-center mx-auto"
        style={{
          border: "1px solid black",
          borderColor: "black",
          width: "20%",
        }}
      >
        <h2 className="my-auto">
          CLASS: <span id="className">{className}</span>
        </h2>
      </div>
      <table className={styles.table}>
        <thead>
          <tr >
            <th className="pt-2">S.NO.</th>
            <th className="pt-2">ROLL NO</th>
            <th className="pt-2">SECTION</th>
            <th className="pt-2">NAME OF THE STUDENTS</th>
            <th className="pt-2">SIGNATURE</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((student) => (
            <tr key={student.id}>
              <td className="py-2">{student.id}</td>
              <td className="py-2">{student.rollNo}</td>
              <td className="py-2">{student.section}</td>
              <td className="text-start py-2">{student.name}</td>
              <td className="py-2">{student.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.instructions}>
        <h3>
          1. Students registered from Class {className}; section wise breakup is
          as follows:
        </h3>
        <div className={styles.sectionBreakup} style={{ width: "50%" }}>
          <div className="text-center">
            <b style={{ borderBottom: "2px solid black", borderColor: "black" }}>
              SRS SECTION
            </b>
            <br />
            <b id="SRSsection">{srsSection}</b>
          </div>
          <div className="text-center">
            <b style={{ borderBottom: "2px solid black", borderColor: "black" }}>
              Allotted Section
            </b>
            <br />
            <b id="allottedSec">{allottedSec}</b>
          </div>
          <div className="text-center">
            <b style={{ borderBottom: "2px solid black", borderColor: "black" }}>
              No. of Students
            </b>
            <br />
            <b className="totalStudent">{totalStudents}</b>
          </div>
        </div>
        <h3>
          <ol start="2">
            <li>
              Please make Student’s Name correction, if any, in attendance sheet.
              (IN BLOCK LETTERS)
            </li>
            <li>
              Please ensure that all the corrections are incorporated & attendance
              sheet despatched with Answer-Sheets.
            </li>
            <li>
              If a student is absent, please mark clearly (ABSENT) in signature
              column.
            </li>
            <li>Please do not replace an absent student with a new student.</li>
          </ol>
        </h3>
      </div>
    </div>
  );
};

export default AttendanceSheet;