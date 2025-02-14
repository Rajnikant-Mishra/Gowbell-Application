import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[2];

  if (!token) {
      return res.status(401).json({ status: false, message: "Access denied. No token provided." });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store user info for later use
      next();
  } catch (error) {
      res.status(400).json({ status: false, message: "Invalid token." });
  }
};

export default verifyToken;
