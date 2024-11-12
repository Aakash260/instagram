import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    req.id = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
};

export default isAuthenticated;