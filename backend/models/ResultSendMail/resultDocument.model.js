import { db } from "../../config/db.js";

export const ResultDocumentModel = {
  create: async (data) => {
    const {
      school_id,
      session_id,
      level,
      email,
      pdf_urls,
      status = "pending",
    } = data;

    return db.promise().query(
      `
      INSERT INTO result_documents 
      (school_id, session_id, level, email, pdf_urls, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [school_id, session_id, level, email, JSON.stringify(pdf_urls), status],
    );
  },

  updateStatus: async (id, status, error_message = null) => {
    return db.promise().query(
      `
      UPDATE result_documents 
      SET status = ?, error_message = ?, updated_at = NOW()
      WHERE id = ?
      `,
      [status, error_message, id],
    );
  },
};
