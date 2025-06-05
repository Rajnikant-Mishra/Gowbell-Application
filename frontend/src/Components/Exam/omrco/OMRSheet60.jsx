import React from "react";
import OMRGenerator from "./OMRGenerate60";
import styles from "./OMRSheet.module.css";
import sheetlogo from "../../../../public/logo GOWBELL.png";
import Barcode from "react-barcode";

export default function OMRSheet({
  schoolName,
  student,
  level,
  subject,
  className,
  date,
  rollNumber,
  subjectIds,
  classId,
}) {
  return (
    <div
      id="omrSheetContent"
      className={`${styles.omrSheetContent} d-flex gap-3`}
    >
      <div className={`${styles.bars}`}>
        {Array.from({ length: 158 }).map((_, index) =>
          index % 2 === 0 ? (
            <div
              key={index}
              style={{
                height: "8px",
                width: "20px",
                borderRadius: "2px",
                backgroundColor: "black",
              }}
            />
          ) : (
            <div
              key={index}
              style={{
                height: "5px",
                width: "20px",
                backgroundColor: "white",
              }}
            />
          )
        )}
      </div>

      <div className="mt-0">
        <div className={`mx-auto text-center ${styles.header}`}>
          <h5 className={styles.title}>ANSWER SHEET</h5>
          <p className={styles.subtitle}>
            Fill out all sections completely and accurately.
          </p>
        </div>

        <img src={sheetlogo} alt="Logo" className={styles.logo} />

        <div style={{ fontSize: "0.8rem" }}>
          <div className={styles.formContainer}>
            <div className={styles.inputGroup}>
              <div className={styles.labelContainer}>
                <label
                  htmlFor="student-name"
                  className={`${styles.label} fw-bold`}
                >
                  CANDIDATE NAME:{" "}
                  <span className={`${styles.studentName}`}>{student}</span>
                </label>
              </div>
              <div className={styles.inputContainer}>
                <input
                  id="student-name"
                  className={styles.inputField}
                  type="text"
                  style={{fontFamily:"Arial", fontSize:"14px", paddingBottom:"15px" }}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelContainer}>
                <label
                  htmlFor="school-name"
                  className={`${styles.label} fw-bold text-start`}
                >
                  SCHOOL NAME: {" "}
                   <span className={`${styles.schoolName}`}>{schoolName}</span>
                </label>
              </div>
              <div className={styles.inputContainer}>
                <input
                  id="school-name"
                  className={`${styles.inputField} `}
                  type="text"
                   style={{fontFamily:"Arial", fontSize:"12px", paddingBottom:"15px" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.examDetails} mb-2`}>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.detailBox}>
                <div
                  id="exam-date"
                  className={`${styles.textBox} textBox d-flex flex-column`}
                >
                  <label htmlFor="exam-date" className="text-center fw-bold">
                    EXAM DATE
                  </label>
                  <p style={{ fontWeight: "bold", color: "black",fontFamily:"Arial", fontSize:"12px", }}>{date}</p>
                </div>
              </div>
            </div>
            <div className={styles.column} style={{flex:"0.7"}}>
              <div className={styles.detailBox}>
                <div
                  id="level"
                  className={`${styles.textBox} textBox d-flex flex-column`}
                >
                  <label htmlFor="level" className="text-center fw-bold">
                    LEVEL
                  </label>
                  <p style={{ fontWeight: "bold", color: "black",fontFamily:"Arial", fontSize:"12px", }}>{level}</p>
                </div>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.detailBox}>
                <div
                  id="standard"
                  className={`${styles.textBox} textBox d-flex flex-column`}
                >
                  <label htmlFor="standard" className="text-center fw-bold">
                    STANDARD
                  </label>
                  <p style={{ fontWeight: "bold", color: "black",fontFamily:"Arial", fontSize:"12px", }}>
                    {className}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styles.instructionDetails}>
          <div className={styles.row}>
           
            <div className={styles.column}>
              <div className={` ${styles.rolldiv}`}>
                <div
                  id="rollNum"
                  className={`${styles.textBox1} textBox d-flex flex-column P-0`}
                >
                  <label
                    htmlFor="rollNum"
                    className={`${styles.rollno} text-center`}
                  >
                    ROLL NO.
                  </label>
                  
                  <div className={`${styles.barcodeContainer} my-auto`}>
                    {rollNumber && className && subject && (
                      <div
                        className={`${styles.barcodeWrapper}  
                                `}
                      >
                        <Barcode
                          value={`${rollNumber}-${classId}-${subjectIds}`}
                          width={0.6}
                          height={30}
                          fontSize={12}
                          margin={0}
                          displayValue={true}
                          className="mt-4"
                        />
                        <div className={styles.rollNumberText}>
                          {`${rollNumber}-${classId}-${subjectIds}`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
               <div className={` ${styles.middleColumn}`}>
                        <div className={styles.detailBox}>
                          <div
                            id="level"
                            className={`${styles.textBox1} textBox d-flex flex-column`}
                          >
                            <ol className={`${styles.ruleBox} my-2`}>
                              <li>
                                Write Your <b>Roll Number</b> on the left side of the OMR
                                sheet in the box specified and darken the appropriate
                                circles given by using{" "}
                                <b>HB Pencil/ball point pen (blue/black)</b> only.
                              </li>
                              <li>
                                Put your{" "}
                                <b>
                                  Full Name, School Name, Standard, Subject, Exam Date &
                                  Level
                                </b>{" "}
                                in the space provided.
                              </li>
                              <li>
                                Darken the circle(s) completely that you think
                                appropriate.
                              </li>
                              <li>Do not fold or crumple the OMR Sheet.</li>
                              <li>
                                Before submitting the OMR Sheet, the candidate should
                                verify that all the entries are made correctly and
                                duly/signed by the invigilator.
                              </li>
                              <li>
                                Do <b>Not</b> do any rough work on this OMR Sheet.
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
            <div className={styles.column}>
              <div className={styles.detailBox}>
                <div
                  id="standard"
                  className={`${styles.textBox1} textBox d-flex flex-column p-0 my-2`}
                >
                  <div
                    className={`${styles.instructionBox} d-flex justify-content-center  `}
                  >
                    <label
                      htmlFor="standard"
                      className={`${styles.instructionBoxLabel} fw-bold`}
                    >
                      HOW TO DARKEN
                    </label>
                  </div>
                  <div className={styles.instructionBox1}>
                    <label
                      htmlFor="standard"
                      className={`${styles.instructionBoxLabel}`}
                    >
                      CORRECT
                    </label>
                    <OMRGenerator fill="Black" line="none" />
                  </div>
                  <div
                    className={`${styles.instructionBox2} d-flex justify-content-center fw-bold`}
                  >
                    <label
                      htmlFor="standard"
                      className={`${styles.instructionBoxLabel}`}
                    >
                      WRONG
                    </label>
                  </div>
                  <OMRGenerator
                    fill="none"
                    line={
                      <line
                        x1="5"
                        y1="5"
                        x2="13"
                        y2="13"
                        stroke="black"
                        strokeWidth="1.5"
                      />
                    }
                  />
                  <OMRGenerator
                    fill="none"
                    line={<circle cx="9" cy="9" r="3" fill="black" />}
                  />
                  <OMRGenerator
                    fill="none"
                    line={
                      <svg
                        height="18"
                        width="18"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 16.2l-4.6-4.6L3 13l6 6 12-12-1.4-1.4L9 16.2z"
                          fill="none"
                          stroke="black"
                          strokeWidth="2"
                        />
                      </svg>
                    }
                  />
                  <OMRGenerator fill="none" line={"lightgray"} />
                </div>
              </div>
            </div>
          </div>
        </div> */}
        
                <div className={`${styles.instructionDetails}`}>
                  <div className={styles.row}>
                    <div className={styles.column} style={{flex:"1.9"}}>
                      <div className={` ${styles.rolldiv}`}>
                        <div
                          id="rollNum"
                          className={`${styles.textBox1} textBox d-flex flex-column P-0`}
                        >
                          <label
                            htmlFor="rollNum"
                            className={`${styles.rollno} text-center`}
                          >
                            ROLL NO.
                          </label>
                          <div className={`${styles.barcodeContainer} my-auto`}>
                            {rollNumber && className && subject && (
                              <div className={`${styles.barcodeWrapper} my-auto`}>
                                <Barcode
                          value={`${rollNumber}-${classId}-${subjectIds}`}
                          width={0.6}
                          height={40}
                          fontSize={12}
                          margin={0}
                          displayValue={true}
                         
                        />
                        {/* <div className={styles.rollNumberText}>
                          {`${rollNumber}-${classId}-${subjectIds}`}
                        </div> */}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
        
                    <div className={` ${styles.middleColumn}`}>
                      <div className={styles.detailBox}>
                        <div
                          id="level"
                          className={`${styles.textBox1} textBox d-flex flex-column`}
                        >
                          <ol className={`${styles.ruleBox} my-2`}>
                            <li>
                              Write Your <b>Roll Number</b> on the left side of the OMR
                              sheet in the box specified and darken the appropriate
                              circles given by using{" "}
                              <b>HB Pencil/ball point pen (blue/black)</b> only.
                            </li>
                            <li>
                              Put your{" "}
                              <b>
                                Full Name, School Name, Standard, Subject, Exam Date &
                                Level
                              </b>{" "}
                              in the space provided.
                            </li>
                            <li>
                              Darken the circle(s) completely that you think
                              appropriate.
                            </li>
                            <li>Do not fold or crumple the OMR Sheet.</li>
                            <li>
                              Before submitting the OMR Sheet, the candidate should
                              verify that all the entries are made correctly and
                              duly/signed by the invigilator.
                            </li>
                            <li>
                              Do <b>Not</b> do any rough work on this OMR Sheet.
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    <div className={styles.column}>
                      <div className={styles.detailBox}>
                        <div
                          id="standard"
                          className={`${styles.textBox1} textBox d-flex flex-column p-0`}
                        >
                          <div
                            className={`${styles.instructionBox} d-flex justify-content-center my-1`}
                          >
                            <label
                              htmlFor="standard"
                              className={`${styles.instructionBoxLabel} fw-bold`}
                            >
                              HOW TO DARKEN
                            </label>
                          </div>
                          <div className={`${styles.instructionBox1} py-3`}>
                            <label
                              htmlFor="standard"
                              className={`${styles.instructionBoxLabel} `}
                            >
                              CORRECT
                            </label>
                            <OMRGenerator fill="Black" line="none" />
                          </div>
                          <div
                            className={`${styles.instructionBox2} d-flex justify-content-center fw-bold`}
                          >
                            <label
                              htmlFor="standard"
                              className={`${styles.instructionBoxLabel}`}
                            >
                              WRONG
                            </label>
                          </div>
                          <OMRGenerator
                            fill="none"
                            line={
                              <line
                                x1="5"
                                y1="5"
                                x2="13"
                                y2="13"
                                stroke="black"
                                strokeWidth="1.5"
                              />
                            }
                          />
                          <OMRGenerator
                            fill="none"
                            line={<circle cx="9" cy="9" r="3" fill="black" />}
                          />
                          <OMRGenerator
                            fill="none"
                            line={
                              <svg
                                height="18"
                                width="18"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 16.2l-4.6-4.6L3 13l6 6 12-12-1.4-1.4L9 16.2z"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="2"
                                />
                              </svg>
                            }
                          />
                          <OMRGenerator fill="none" line="blackStripes"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        <div
          className={`${styles.answerSectionTitle} my-2 d-flex justify-content-center`}
        >
          <p className="m-auto fw-bold text-white">
            MARK YOUR ANSWERS WITH HB PENCIL/BALL POINT PEN (BLUE/BLACK)
          </p>
        </div>
        <div className="row mb-2">
          <div className="col-3">
            <div className={`${styles.detailBox} ${styles.rolldiv}`}>
              <div
                className={`${styles.textBox3} textBox d-flex flex-column P-0`}
              >
                <label
                  htmlFor="rollNum"
                  className={`${styles.rollno} text-center`}
                >
                  SUBJECTS
                </label>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    textAlign: "center",
                  }}
                 className={`${styles.subjects} my-auto`}
                >
                  {subject}
                </p>
              </div>
            </div>
            <div className={`${styles.detailBox} ${styles.rolldiv}`}>
              <div
                className={`${styles.textBox4} textBox text-center d-flex flex-column P-0`}
              >
                <div className="my-auto">
                  <h5 className="fw-bold">Gowbell Olympiads</h5>
                  <p style={{ fontSize: "12px" }} className="fw-bold text-black">
                    Plot No-18,Matalia Dwaraka, Sector-3,New Delhi, India -
                    110059
                  </p>
                </div>
                <h5 className="mx-auto my-auto fw-bold">
                  Your Real Competition
                </h5>
              </div>
            </div>
          </div>
          <div className="col-3">
            <table className={`${styles.tablediv}`}>
              <thead className={`${styles.questiondiv}`}>
                <tr>
                  <th className="text-center">Q.No.</th>
                  <th className="text-center" style={{ width: "100%" }}>
                    ANSWER
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array(20)
                  .fill()
                  .map((item, index) => (
                    <tr key={index}>
                      <td className={`${styles.questionnumberdiv} text-center`}>
                        {index + 1}
                      </td>
                      <td className="text-center">
                        <OMRGenerator fill="none" line="none" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="col-3">
            <table>
              <thead className={`${styles.questiondiv}`}>
                <tr>
                  <th className="text-center">Q.No.</th>
                  <th className="text-center" style={{ width: "100%" }}>
                    ANSWER
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array(20)
                  .fill()
                  .map((item, index) => (
                    <tr key={index}>
                      <td className={`${styles.questionnumberdiv} text-center`}>
                        {index + 21}
                      </td>
                      <td className="text-center">
                        <OMRGenerator fill="none" line="none" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="col-3">
            <table>
              <thead className={`${styles.questiondiv}`}>
                <tr>
                  <th className="text-center">Q.No.</th>
                  <th className="text-center" style={{ width: "100%" }}>
                    ANSWER
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array(20)
                  .fill()
                  .map((item, index) => (
                    <tr key={index}>
                      <td className={`${styles.questionnumberdiv} text-center`}>
                        {index + 41}
                      </td>
                      <td className="text-center">
                        <OMRGenerator fill="none" line="none" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div
              className={`${styles.footerdiv} text-center d-flex flex-column align-items-center`}
            >
              <input
                type="text"
                className={`${styles.inputUnderline} mt-5`}
                id="student-name"
              />
              <label htmlFor="student-name" className="fw-bold">
                Signature Of Candidate
              </label>
            </div>
          </div>
          <div className="col-6">
            <div
              className={`${styles.footerdiv} text-center d-flex flex-column align-items-center`}
            >
              <input
                type="text"
                className={`${styles.inputUnderline} mt-5`}
                id="invigilator-signature"
              />
              <label htmlFor="invigilator-signature" className="fw-bold">
                Signature of Invigilator
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.bars1}`}>
        {Array.from({ length: 135 }).map((_, index) =>
          index === 0 || index === 134 ? (
            <div
              key={index}
              style={{
                height: "15px",
                width: "20px",
                backgroundColor: "black",
                borderRadius: "5px",
              }}
            />
          ) : (
            <div
              key={index}
              style={{
                height: "7.4px",
                width: "20px",
                backgroundColor: "#FFF",
              }}
            />
          )
        )}
      </div>
    </div>
  );
}
