// import React from "react";

// export const OMRGenerator = ({ fill, line, smaller = false, selected }) => {
//   const size = smaller ? 14 : 18;
//   const radius = smaller ? 5 : 7;
//   const textY = smaller ? 10 : 12;
//   const cxCy = smaller ? 7 : 9;

//   // UNIQUE IDs (VERY IMPORTANT)
//   const uid = Math.random().toString(36).substring(2, 9);

//   return (
//     <div
//       className="d-flex justify-content-center gap-2"
//       style={{ marginBottom: "2px", marginTop: "2px" }}
//     >
//       {/* A */}
//       <svg height={size} width={size}>
//         <circle
//           cx={cxCy}
//           cy={cxCy}
//           r={radius}
//           stroke="#000"
//           strokeWidth="0.5"
//           fill={"none"}
//         />
//         <text
//           x={cxCy}
//           y={textY}
//           textAnchor="middle"
//           fontSize="9"
//           // fontWeight="bold"
//         >
//           A
//         </text>
//       </svg>

//       {/* B */}
//       <svg height={size} width={size}>
//         <defs>
//           <pattern
//             id={`stripes-${uid}`}
//             width="4"
//             height="4"
//             patternTransform="rotate(45)"
//           >
//             <line x1="0" y1="0" x2="0" y2="4" stroke="#000" strokeWidth="1" />
//           </pattern>
//           <pattern
//             id={`blackStripes-${uid}`}
//             patternUnits="userSpaceOnUse"
//             width="1.5"
//             height="1.5"
//             patternTransform="rotate(70)"
//           >
//             <line
//               x1="0"
//               y1="0"
//               x2="0"
//               y2="1.5"
//               stroke="#000"
//               strokeWidth="0.5"
//             />
//           </pattern>
//         </defs>

//         <circle
//           cx={cxCy}
//           cy={cxCy}
//           r={radius}
//           stroke="#000"
//           strokeWidth="0.5"
//           fill={
//             fill === "correctB"
//               ? "#000"
//               : line === "lightgray"
//                 ? `url(#stripes-${uid})`
//                 : line === "blackStripes"
//                   ? `url(#blackStripes-${uid})`
//                   : "none"
//           }
//         />

//         {line !== "none" &&
//           line !== "lightgray" &&
//           line !== "blackStripes" &&
//           line}

//         <text
//           x={cxCy}
//           y={textY}
//           textAnchor="middle"
//           fontSize="9"
//           // fontWeight="bold"
//         >
//           B
//         </text>
//       </svg>

//       {/* C */}
//       <svg height={size} width={size}>
//         <circle
//           cx={cxCy}
//           cy={cxCy}
//           r={radius}
//           stroke="#000"
//           strokeWidth="0.5"
//           fill="none"
//         />
//         <text
//           x={cxCy}
//           y={textY}
//           textAnchor="middle"
//           fontSize="9"
//           // fontWeight="bold"
//         >
//           C
//         </text>
//       </svg>

//       {/* D */}
//       <svg height={size} width={size}>
//         <circle
//           cx={cxCy}
//           cy={cxCy}
//           r={radius}
//           stroke="#000"
//           strokeWidth="0.5"
//           fill="none"
//         />
//         <text
//           x={cxCy}
//           y={textY}
//           textAnchor="middle"
//           fontSize="9"
//           // fontWeight="bold"
//         >
//           D
//         </text>
//       </svg>
//     </div>
//   );
// };

// export default OMRGenerator;

import React from "react";

export const OMRGenerator = ({
  fill,
  line,
  smaller = false,
  selected,
  showText = true,
}) => {
  const size = smaller ? 14 : 18;
  const radius = smaller ? 5 : 7;
  const textY = smaller ? 10 : 12;
  const cxCy = smaller ? 7 : 9;

  // UNIQUE IDs (VERY IMPORTANT)
  const uid = Math.random().toString(36).substring(2, 9);

  return (
    <div
      className="d-flex justify-content-center "
      style={{ marginBottom: "4px", marginTop: "0px", gap: "1em" }}
    >
      {/* A */}
      <svg height={size} width={size}>
        <circle
          cx={cxCy}
          cy={cxCy}
          r={radius}
          stroke="#000"
          strokeWidth="1.35"
          fill={"none"}
        />
        <text
          x={cxCy}
          y={textY}
          textAnchor="middle"
          fontSize="9"
          fontWeight="400"
        >
          A
        </text>
      </svg>

      {/* B */}
      <svg height={size} width={size}>
        <defs>
          <pattern
            id={`stripes-${uid}`}
            width="4"
            height="4"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="4" stroke="#000" strokeWidth="1" />
          </pattern>
          <pattern
            id={`blackStripes-${uid}`}
            patternUnits="userSpaceOnUse"
            width="1.2"
            height="1.2"
            patternTransform="rotate(70)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="1.2"
              stroke="#000"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <circle
          cx={cxCy}
          cy={cxCy}
          r={radius}
          stroke="#000"
          strokeWidth="1.35"
          fill={
            fill === "correctB"
              ? "#000"
              : line === "lightgray"
                ? `url(#stripes-${uid})`
                : line === "blackStripes"
                  ? `url(#blackStripes-${uid})`
                  : "none"
          }
        />

        {line !== "none" &&
          line !== "lightgray" &&
          line !== "blackStripes" &&
          line}

        {showText && (
          <text
            x={cxCy}
            y={textY}
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill={fill === "correctB" ? "#fff" : "#000"}
            style={{ pointerEvents: "none" }}
          >
            B
          </text>
        )}
      </svg>

      {/* C */}
      <svg height={size} width={size}>
        <circle
          cx={cxCy}
          cy={cxCy}
          r={radius}
          stroke="#000"
          strokeWidth="1.35"
          fill="none"
        />
        <text
          x={cxCy}
          y={textY}
          textAnchor="middle"
          fontSize="9"
          fontWeight="400"
        >
          C
        </text>
      </svg>

      {/* D */}
      <svg height={size} width={size}>
        <circle
          cx={cxCy}
          cy={cxCy}
          r={radius}
          stroke="#000"
          strokeWidth="1.35"
          fill="none"
        />
        <text
          x={cxCy}
          y={textY}
          textAnchor="middle"
          fontSize="9"
          fontWeight="400"
        >
          D
        </text>
      </svg>
    </div>
  );
};

export default OMRGenerator;
