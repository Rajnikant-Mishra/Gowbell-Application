import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authorizeRole = (req, res, allowedRoles) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the user data to the request object

    // Check if the user's role is in the list of allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Unauthorized role." });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
