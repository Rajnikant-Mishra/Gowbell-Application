import React from "react";
import styles from "./OMRSheet.module.css";

const OMRSheet = ({
  student = { studentName: "John Doe", schoolName: "XYZ High School" },
}) => {
  return (
    <div className={styles.omrSheet}>
      {/* Header Section */}

      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <div className={`${styles.logoContainer} col-4`}>
            <img
              src="./src/assets/logo GOWBELL.png"
              alt="Logo"
              className={styles.logo}
            />
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className={`${styles.headingContainer} col-8`}>
            <h3 className={styles.heading}>ANSWER SHEET</h3>
            <p>Fill out all sections completely and accurately.</p>
          </div>
        </div>
      </nav>

      {/* Candidate Information */}
      <div className={styles.candidateInfo}>
        <div className={styles.infoBox}>
          <label>CANDIDATE NAME:</label>
          <input type="text" value={student.studentName} readOnly />
        </div>
        <div className={styles.infoBox}>
          <label>SCHOOL NAME:</label>
          <input type="text" value={student.schoolName} readOnly />
        </div>
      </div>

      {/* Exam Details */}
      <div className={styles.examDetails}>
        <div className={styles.detailBox}>
          <label>EXAM DATE:</label>
          <input type="text" value="2024-04-27" readOnly />
        </div>
        <div className={styles.detailBox}>
          <label>LEVEL:</label>
          <input type="text" value="Intermediate" readOnly />
        </div>
        <div className={styles.detailBox}>
          <label>STANDARD:</label>
          <input type="text" value="10th Grade" readOnly />
        </div>
      </div>

      {/* Roll Number and Instructions */}
      <div className={styles.rollInstructions}>
        <div className={styles.rollBox}>
          <label>ROLL NO.:</label>
          <input type="text" value="12345" readOnly />
        </div>
        <div className={styles.instructions}>
          <p>1. Write your Roll Number on the left side of the answer sheet.</p>
          <p>
            2. Ensure Full Name, School Name, Standard, Level, and Exam Date are
            accurate.
          </p>
          <p>3. Use HB Pencil or Black/Blue Ball Pen only.</p>
        </div>
      </div>

      {/* How to Darken Section */}
      <div className={styles.darkening}>
        <p>HOW TO DARKEN:</p>
        <div className={styles.darkeningOptions}>
          <div className={styles.option}>
            <svg height="20" width="20">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="black"
                strokeWidth="1"
                fill="black"
              />
            </svg>
            <span>CORRECT</span>
          </div>
          <div className={styles.option}>
            <svg height="20" width="20">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="black"
                strokeWidth="1"
                fill="white"
              />
            </svg>
            <span>WRONG</span>
          </div>
        </div>
      </div>

      {/* Answer Section */}
      <div className={styles.answerSection}>
        <p>MARK YOUR ANSWERS WITH HB PENCIL/BALL POINT PEN (BLUE/BLACK)</p>
        <table>
          <thead>
            <tr>
              <th>Q.No.</th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 40 }, (_, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <div className={styles.circle}>A</div>
                </td>
                <td>
                  <div className={styles.circle}>B</div>
                </td>
                <td>
                  <div className={styles.circle}>C</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className={styles.footer}>
        <div className={styles.signature}>
          <label>Signature of Candidate:</label>
          <div className={styles.line}></div>
        </div>
        <div className={styles.signature}>
          <label>Signature of Invigilator:</label>
          <div className={styles.line}></div>
        </div>
      </div>
    </div>
  );
};

export default OMRSheet;
