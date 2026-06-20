// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// export const sendResultEmail = async (
//   toEmail,
//   pdfBuffer,
//   schoolName,
//   level,
//   totalStudents,
// ) => {
//   const mailOptions = {
//     from: `"Gowvell Results" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: `Student Results Report - Level ${level} | ${schoolName}`,
//     html: `
//       <h2>Dear School Administrator,</h2>
//       <p>Please find attached the detailed result report for <strong>Level ${level}</strong>.</p>
//       <p><strong>Total Students:</strong> ${totalStudents}</p>
//       <p><strong>Generated on:</strong> ${new Date().toLocaleString("en-IN")}</p>
//       <br>
//       <p>Best Regards,<br><strong>Gowvell System</strong></p>
//     `,
//     attachments: [
//       {
//         filename: `Result_Level_${level}_${new Date().toISOString().slice(0, 10)}.pdf`,
//         content: pdfBuffer,
//         contentType: "application/pdf",
//       },
//     ],
//   };

//   return transporter.sendMail(mailOptions);
// };









import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendResultEmail = async ({
  toEmail,
  pdfBuffer,
  schoolName,
  level,
  totalStudents,
}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Gowvell Results" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Student Results Report - Level ${level} | ${schoolName}`,
      html: `
        <h2>Dear School Administrator,</h2>
        <p>Please find attached the detailed result report for <strong>Level ${level}</strong>.</p>
        <p><strong>Total Students:</strong> ${totalStudents}</p>
        <p><strong>Generated on:</strong> ${new Date().toLocaleString("en-IN")}</p>
        <br/>
        <p>Best Regards,<br/><strong>Gowvell System</strong></p>
      `,
      attachments: [
        {
          filename: `Result_Level_${level}_${new Date().toISOString().slice(0, 10)}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };

  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error: error.message };
  }
};