// import multer from "multer";
// import path from "path";

// // Storage settings
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, ".../../uploads/omr_pdfs"); // folder to save files
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// // Only accept PDFs
// const fileFilter = (req, file, cb) => {
//   const filetypes = /pdf/;
//   const mimetype = filetypes.test(file.mimetype);
//   if (mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files are allowed"), false);
//   }
// };

// export const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

import multer from "multer";
import path from "path";

// Storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), ".../../uploads/omr_pdfs")); // Fixed: absolute path
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Only accept PDFs
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// ✅ Added file size limit to fix 413 error
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});
