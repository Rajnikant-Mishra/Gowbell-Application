import React from "react";

export const OMRGenerator = ({ fill, line }) => {
  return (
    <div className="d-flex justify-content-center gap-2 mb-1">
      <svg height="18" width="18">
        <circle
          cx="9"
          cy="9"
          r="7"
          stroke="black"
          strokeWidth="1"
          fill={fill}
        />
        <text
          x="9"
          y="12"
          textAnchor="middle"
          fontSize="10"
          fill="black"
          fontWeight="bold"
        >
          A
        </text>
      </svg>
      <svg height="18" width="18">
        <circle
          cx="9"
          cy="9"
          r="7"
          stroke="black"
          strokeWidth="1"
          fill={
            line === "lightgray"
              ? "#313A46"
              : fill === "black"
              ? "black"
              : "none"
          }
        />
        {line !== "none" && line}
        <text x="9" y="12" textAnchor="middle" fontSize="10" fontWeight="bold">
          B
        </text>
      </svg>

      <svg height="18" width="18">
        <circle
          cx="9"
          cy="9"
          r="7"
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
        <text
          x="9"
          y="12"
          textAnchor="middle"
          fontSize="10"
          fill="black"
          fontWeight="bold"
        >
          C
        </text>
      </svg>

      <svg height="18" width="18">
        <circle
          cx="9"
          cy="9"
          r="7"
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
        <text
          x="9"
          y="12"
          textAnchor="middle"
          fontSize="10"
          fill="black"
          fontWeight="bold"
        >
          D
        </text>
      </svg>
    </div>
  );
};

export default OMRGenerator;
