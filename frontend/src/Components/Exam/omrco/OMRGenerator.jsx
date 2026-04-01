

import React from "react";

export const OMRGenerator = ({ fill, line, smaller = false }) => {
  const size = smaller ? 14 : 18; // Smaller circles for "How to Darken" section
  const radius = smaller ? 5 : 7; // Smaller radius for smaller circles
  const textY = smaller ? 10 : 13; // Adjust text position for smaller circles
  const cxCy = smaller ? 7 : 9; // Center for smaller circles

  return (
    <div className="d-flex justify-content-center gap-2" style={{ marginBottom: "3px" , marginTop: "3px" }}>
      <svg height={size} width={size}>
        <circle cx={cxCy} cy={cxCy} r={radius} stroke="black" strokeWidth="1" fill={fill} />
        <text x={cxCy} y={textY} textAnchor="middle" fontSize="10" fill="black" fontWeight="bold">
          A
        </text>
      </svg>
      <svg height={size} width={size}>
        <defs>
          <pattern id="stripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="black" strokeWidth="1" />
          </pattern>
          <pattern id="blackStripes" patternUnits="userSpaceOnUse" width="2" height="2" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="2" stroke="black" strokeWidth="1" />
          </pattern>
        </defs>
        <circle
          cx={cxCy}
          cy={cxCy}
          r={radius}
          stroke="black"
          strokeWidth="1"
          fill={
            line === "lightgray"
              ? "url(#stripes)"
              : line === "blackStripes"
              ? "url(#blackStripes)"
              : fill === "black"
              ? "black"
              : "none"
          }
        />
        {line !== "none" && line !== "lightgray" && line !== "blackStripes" && line}
        <text x={cxCy} y={textY} textAnchor="middle" fontSize="10" fontWeight="bold">
          B
        </text>
      </svg>
      <svg height={size} width={size}>
        <circle cx={cxCy} cy={cxCy} r={radius} stroke="black" strokeWidth="1" fill="none" />
        <text x={cxCy} y={textY} textAnchor="middle" fontSize="10" fill="black" fontWeight="bold">
          C
        </text>
      </svg>
       <svg height={size} width={size}>
        <circle cx={cxCy} cy={cxCy} r={radius} stroke="black" strokeWidth="1" fill="none" />
        <text x={cxCy} y={textY} textAnchor="middle" fontSize="10" fill="black" fontWeight="bold">
          D
        </text>
      </svg>
     
    </div>
  );
};

export default OMRGenerator;