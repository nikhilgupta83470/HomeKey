import jwt from "jsonwebtoken";
import { User } from "./models.js";

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Please log in." });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "Account not found." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}
export function adminOnly(req, res, next) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Admin access only." });
  next();
}
