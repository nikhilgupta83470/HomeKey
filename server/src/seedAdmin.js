import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models.js";

await mongoose.connect(process.env.MONGO_URI);
const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD || "";
if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
const passwordHash = await bcrypt.hash(password, 12);
await User.findOneAndUpdate({ email }, {
  name: process.env.ADMIN_NAME || "Broker Admin", email, passwordHash, role: "ADMIN"
}, { upsert: true, new: true, setDefaultsOnInsert: true });
console.log(`Admin account ready: ${email}`);
await mongoose.disconnect();
