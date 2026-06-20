
import { db } from "../../config/db.js";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { ResultDocumentModel } from "../ResultSendMail/resultDocument.model.js";

export const createResultDocument = async (req, res) => {
  try {
    console.log("FILES:", req.files);

    const { school_id, session_id, level, email } = req.body;

    // VALIDATION
    if (!school_id || !session_id || !level || !email) {
      return res.status(400).json({
        success: false,
        message: "school_id, session_id, level, email required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one PDF required",
      });
    }

    // STORE FILE PATHS
    const pdf_urls = req.files.map((file) => ({
      name: file.originalname,
      url: `/result/${file.filename}`,
    }));

    // SAVE DB FIRST
    const [result] = await ResultDocumentModel.create({
      school_id,
      session_id,
      level,
      email,
      pdf_urls,
      status: "pending",
    });

    const insertId = result.insertId;

    // =========================
    // EMAIL SETUP
    // =========================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      path: path.resolve(file.path),
    }));

    try {
      await transporter.sendMail({
        from: `"Result System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Student Result - ${level}`,
        html: `
          <h3>Dear School,</h3>
          <p>Please find attached subject-wise result PDFs.</p>
          <p>Level: ${level}</p>
          <br/>
          <b>Gowbell Olympiads System</b>
        `,
        attachments,
      });

      // SUCCESS UPDATE
      await ResultDocumentModel.updateStatus(insertId, "sent");

      return res.json({
        success: true,
        message: "PDF uploaded & email sent successfully",
        data: pdf_urls,
      });
    } catch (mailError) {
      console.error("EMAIL ERROR:", mailError);

      await ResultDocumentModel.updateStatus(
        insertId,
        "failed",
        mailError.message,
      );

      return res.status(500).json({
        success: false,
        message: "File uploaded but email failed",
        error: mailError.message,
      });
    }
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
