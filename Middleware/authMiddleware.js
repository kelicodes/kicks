import jwt from "jsonwebtoken";

// Middleware to authenticate user
const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRETWORD);

    // Attach userId to request
    req.userId = decoded.id;

    next(); // pass control to next middleware/route
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
