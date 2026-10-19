import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import fs from "fs";
import Razorpay from "razorpay";

import {
  User,
  Landlord,
  Property,
  ClientRequest,
  Inquiry,
  Task,
  Project,
  Deal,
  Contact,
  AdminNote,
} from "./models.js";

import { auth, adminOnly } from "./middleware.js";
import { notifyAdmin } from "./notify.js";

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "1mb" }));

// Email notification failure should not crash the API.
async function safeNotifyAdmin(subject, message) {
  try {
    await notifyAdmin(subject, message);
  } catch (error) {
    console.error("Admin email notification failed:", error.message);
  }
}

// Upload configuration
const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });

app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${Math.random().toString(36).slice(2)}${path
        .extname(file.originalname)
        .toLowerCase()}`,
    ),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) =>
    cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)),
});

// Public property response: keep private details hidden.
const publicProperty = (p) => ({
  _id: p._id,
  title: p.title,
  purpose: p.purpose || "Rent",
  kind: p.kind,
  bhk: p.bhk,
  rent: p.rent,
  furnished: p.furnished,
  description: p.description,
  photos: p.photos,
  area: p.area,
  sector: p.sector,
  location: p.location,
  latitude: p.latitude,
  longitude: p.longitude,
  mapUrl: p.mapUrl,
  areaSqFt: p.areaSqFt,
  bathrooms: p.bathrooms,
  balconies: p.balconies,
  floorNumber: p.floorNumber,
  totalFloors: p.totalFloors,
  propertyAgeYears: p.propertyAgeYears,
  facing: p.facing,
  securityDeposit: p.securityDeposit,
  monthlyMaintenance: p.monthlyMaintenance,
  negotiable: p.negotiable,
  availableFrom: p.availableFrom,
  amenities: p.amenities || [],
  petFriendly: p.petFriendly,
  bachelorFriendly: p.bachelorFriendly,
  nearbySchool: p.nearbySchool,
  nearbyHospital: p.nearbyHospital,
  nearbyMarket: p.nearbyMarket,
  floorPlanUrl: p.floorPlanUrl,
  available: p.available,
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Register client
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name?.trim() || !email || !password || password.length < 8) {
      return res.status(400).json({
        message: "Name, email and password (8+ characters) are required.",
      });
    }

    const normalized = email.toLowerCase().trim();

    if (await User.findOne({ email: normalized })) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalized,
      passwordHash: await bcrypt.hash(password, 12),
      phone,
      role: "CLIENT",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration failed:", error);

    return res.status(500).json({
      message: "Registration failed.",
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .toLowerCase()
      .trim();

    const user = await User.findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(req.body.password || "", user.passwordHash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      message: "Login failed.",
    });
  }
});

app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({
        message: "Google email is not verified",
      });
    }

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        // Existing account ka role preserve hoga.
        user.googleId = googleId;

        if (!user.name && payload.name) {
          user.name = payload.name;
        }

        await user.save();
      } else {
        user = await User.create({
          name: payload.name || email.split("@")[0],
          email,
          googleId,
          passwordHash: "",
          role: "CLIENT",
        });
      }
    }

    // IMPORTANT:
    // Yahan apne existing email-login route wali
    // exact JWT signing line use karna.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(401).json({
      message: "Google login failed. Please try again.",
    });
  }
});

// Current logged-in user
app.get("/api/auth/me", auth, (req, res) => {
  res.json({ user: req.user });
});

// =====================================================
// WISHLIST APIs
// Requires savedProperties field in the User schema.
// =====================================================

// Get logged-in client's saved properties
app.get("/api/wishlist", auth, async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Client account required.",
      });
    }

    const user = await User.findById(req.user._id)
      .select("savedProperties")
      .populate({
        path: "savedProperties",
        match: { available: true },
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json((user.savedProperties || []).map(publicProperty));
  } catch (error) {
    console.error("Wishlist fetch failed:", error);

    res.status(500).json({
      message: "Could not load wishlist.",
    });
  }
});

// Save a property to wishlist
app.post("/api/wishlist/:propertyId", auth, async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Client account required.",
      });
    }

    const property = await Property.findOne({
      _id: req.params.propertyId,
      available: true,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found or unavailable.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { savedProperties: property._id },
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "Property added to wishlist.",
      propertyId: property._id,
      saved: true,
    });
  } catch (error) {
    console.error("Wishlist save failed:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid property ID.",
      });
    }

    res.status(500).json({
      message: "Could not save property.",
    });
  }
});

// Remove a property from wishlist
app.delete("/api/wishlist/:propertyId", auth, async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Client account required.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { savedProperties: req.params.propertyId },
      },
      { new: true },
    ).select("savedProperties");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "Property removed from wishlist.",
      propertyId: req.params.propertyId,
      saved: false,
    });
  } catch (error) {
    console.error("Wishlist removal failed:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid property ID.",
      });
    }

    res.status(500).json({
      message: "Could not remove property.",
    });
  }
});

// Public available properties
app.get("/api/properties", async (_req, res) => {
  try {
    const rows = await Property.find({ available: true }).sort({
      createdAt: -1,
    });

    res.json(rows.map(publicProperty));
  } catch (error) {
    console.error("Properties fetch failed:", error);

    res.status(500).json({
      message: "Could not load properties.",
    });
  }
});

// Admin overview
app.get("/api/admin/overview", auth, adminOnly, async (_req, res) => {
  try {
    const [clients, landlords, properties, available, requests] =
      await Promise.all([
        User.countDocuments({ role: "CLIENT" }),
        Landlord.countDocuments(),
        Property.countDocuments(),
        Property.countDocuments({ available: true }),
        ClientRequest.countDocuments(),
      ]);

    res.json({ clients, landlords, properties, available, requests });
  } catch (error) {
    console.error("Admin overview failed:", error);

    res.status(500).json({
      message: "Could not load admin overview.",
    });
  }
});

// Admin clients and their requirements
app.get("/api/admin/clients", auth, adminOnly, async (_req, res) => {
  try {
    const [clients, requests] = await Promise.all([
      User.find({ role: "CLIENT" })
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .lean(),
      ClientRequest.find().sort({ createdAt: -1 }).lean(),
    ]);

    res.json({ clients, requests });
  } catch (error) {
    console.error("Admin clients fetch failed:", error);

    res.status(500).json({
      message: "Could not load clients.",
    });
  }
});

// Admin landlords

app.get("/api/admin/landlords", auth, adminOnly, async (_req, res) => {
  try {
    const landlords = await Landlord.find().sort({ createdAt: -1 }).lean();

    const counts = await Property.aggregate([
      {
        $match: {
          landlord: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$landlord",
          totalProperties: { $sum: 1 },
          availableProperties: {
            $sum: {
              $cond: [{ $eq: ["$status", "Available"] }, 1, 0],
            },
          },
          occupiedProperties: {
            $sum: {
              $cond: [{ $eq: ["$status", "Rented"] }, 1, 0],
            },
          },
          reservedProperties: {
            $sum: {
              $cond: [{ $eq: ["$status", "Reserved"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const countMap = new Map(counts.map((item) => [String(item._id), item]));

    const result = landlords.map((landlord) => {
      const stats = countMap.get(String(landlord._id));

      return {
        ...landlord,
        totalProperties: stats?.totalProperties || 0,
        availableProperties: stats?.availableProperties || 0,
        occupiedProperties: stats?.occupiedProperties || 0,
        reservedProperties: stats?.reservedProperties || 0,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Landlords fetch failed:", error);

    res.status(500).json({
      message: "Could not load landlords.",
    });
  }
});


// Update landlord
app.patch("/api/admin/landlords/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid landlord ID.",
      });
    }

    const allowedFields = [
      "fullName",
      "phone",
      "email",
      "alternatePhone",
      "address",
      "verificationStatus",
      "notes",
    ];

    const update = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided.",
      });
    }

    if (
      update.fullName !== undefined &&
      !String(update.fullName).trim()
    ) {
      return res.status(400).json({
        message: "Landlord name is required.",
      });
    }

    if (update.phone !== undefined && !String(update.phone).trim()) {
      return res.status(400).json({
        message: "Landlord phone is required.",
      });
    }

    if (update.fullName !== undefined) {
      update.fullName = String(update.fullName).trim();
    }

    if (update.phone !== undefined) {
      update.phone = String(update.phone).trim();
    }

    if (update.email !== undefined) {
      update.email = String(update.email).trim();
    }

    const landlord = await Landlord.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!landlord) {
      return res.status(404).json({
        message: "Landlord not found.",
      });
    }

    return res.json({
      message: "Landlord updated successfully.",
      landlord,
    });
  } catch (error) {
    console.error("Landlord update failed:", error);

    return res.status(500).json({
      message: "Could not update landlord.",
    });
  }
});
// Get one landlord with all their properties
app.get("/api/admin/landlords/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid landlord ID.",
      });
    }

    const landlord = await Landlord.findById(id).lean();

    if (!landlord) {
      return res.status(404).json({
        message: "Landlord not found.",
      });
    }

    const properties = await Property.find({
      landlord: landlord._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      landlord,
      properties,
    });
  } catch (error) {
    console.error("Landlord details error:", error);

    return res.status(500).json({
      message: error.message || "Could not load landlord details.",
    });
  }
});
// Admin properties
app.get("/api/admin/properties", auth, adminOnly, async (_req, res) => {
  try {
    res.json(
      await Property.find().populate("landlord").sort({ createdAt: -1 }),
    );
  } catch (error) {
    console.error("Admin properties fetch failed:", error);

    res.status(500).json({
      message: "Could not load admin properties.",
    });
  }
});

app.post(
  "/api/admin/properties",
  auth,
  adminOnly,
  upload.fields([
    { name: "photos", maxCount: 8 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;
      const propertyId = `HK-${Date.now().toString().slice(-8)}`;
      const photos = (req.files?.photos || []).map(
        (file) => `/uploads/${file.filename}`,
      );

      const videoFile = req.files?.video?.[0];
      const videoUrl = videoFile ? `/uploads/${videoFile.filename}` : "";
      console.log("Uploaded video:", videoFile?.filename);
      console.log("Saved video URL:", videoUrl);
      const row = await Property.create({
        title: body.title,
        propertyId,
        rentalCategory: body.rentalCategory || "Family",
        status: body.status || "Available",
        kind: body.kind,
        purpose: body.purpose || "Rent",
        bhk: body.bhk,
        rent: Number(body.rent),
        furnished: body.furnished,
        description: body.description,
        photos,
        videoUrl,
        area: body.area,
        sector: body.sector,
        location: body.location,

        areaSqFt: body.areaSqFt ? Number(body.areaSqFt) : null,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : 1,
        balconies: body.balconies ? Number(body.balconies) : 0,
        floorNumber:
          body.floorNumber !== "" && body.floorNumber != null
            ? Number(body.floorNumber)
            : null,
        totalFloors:
          body.totalFloors !== "" && body.totalFloors != null
            ? Number(body.totalFloors)
            : null,
        propertyAgeYears:
          body.propertyAgeYears !== "" && body.propertyAgeYears != null
            ? Number(body.propertyAgeYears)
            : null,
        facing: body.facing || "",

        securityDeposit: body.securityDeposit
          ? Number(body.securityDeposit)
          : 0,
        monthlyMaintenance: body.monthlyMaintenance
          ? Number(body.monthlyMaintenance)
          : 0,
        negotiable: body.negotiable === true || body.negotiable === "true",
        availableFrom: body.availableFrom || null,

        amenities: (() => {
          try {
            const value = body.amenities;
            if (Array.isArray(value)) return value;
            if (typeof value === "string") {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed) ? parsed : [];
            }
            return [];
          } catch {
            return [];
          }
        })(),

        petFriendly: body.petFriendly === true || body.petFriendly === "true",
        bachelorFriendly:
          body.bachelorFriendly === true || body.bachelorFriendly === "true",

        nearbySchool: body.nearbySchool || "",
        nearbyHospital: body.nearbyHospital || "",
        nearbyMarket: body.nearbyMarket || "",
        floorPlanUrl: body.floorPlanUrl || "",

        latitude: body.latitude ? Number(body.latitude) : null,
        longitude: body.longitude ? Number(body.longitude) : null,
        mapUrl: body.mapUrl || "",

        flatNumber: body.flatNumber,
        addressPrivate: body.addressPrivate,
        landlord: body.landlord || null,
        available: (body.status || "Available") === "Available",
      });

      res.status(201).json(row);
    } catch (error) {
      console.error("Property creation failed:", error);

      res.status(500).json({
        message: "Could not create property.",
      });
    }
  },
);

app.patch(
  "/api/admin/properties/:id",
  auth,
  adminOnly,
  upload.fields([
    { name: "photos", maxCount: 8 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;
      const update = {};

      const textFields = [
        "title",
        "kind",
        "purpose",
        "rentalCategory",
        "status",
        "bhk",
        "furnished",
        "description",
        "area",
        "sector",
        "location",
        "facing",
        "nearbySchool",
        "nearbyHospital",
        "nearbyMarket",
        "floorPlanUrl",
        "mapUrl",
        "flatNumber",
        "addressPrivate",
      ];

      for (const key of textFields) {
        if (body[key] !== undefined) update[key] = body[key];
      }

      const numberFields = [
        "rent",
        "areaSqFt",
        "bathrooms",
        "balconies",
        "floorNumber",
        "totalFloors",
        "propertyAgeYears",
        "securityDeposit",
        "monthlyMaintenance",
        "latitude",
        "longitude",
      ];

      for (const key of numberFields) {
        if (body[key] !== undefined) {
          if (body[key] === "") {
            update[key] = [
              "areaSqFt",
              "floorNumber",
              "totalFloors",
              "propertyAgeYears",
              "latitude",
              "longitude",
            ].includes(key)
              ? null
              : 0;
          } else {
            const value = Number(body[key]);

            if (!Number.isFinite(value)) {
              return res.status(400).json({
                message: `Invalid value for ${key}.`,
              });
            }

            update[key] = value;
          }
        }
      }

      for (const key of [
        "available",
        "negotiable",
        "petFriendly",
        "bachelorFriendly",
      ]) {
        if (body[key] !== undefined) {
          if (!["true", "false", true, false].includes(body[key])) {
            return res.status(400).json({
              message: `Invalid value for ${key}.`,
            });
          }

          update[key] = body[key] === true || body[key] === "true";
        }
      }

      if (body.status !== undefined) {
        if (!["Available", "Rented", "Reserved"].includes(body.status)) {
          return res.status(400).json({
            message: "Invalid property status.",
          });
        }

        update.status = body.status;
        update.available = body.status === "Available";
      }

      if (body.availableFrom !== undefined) {
        update.availableFrom = body.availableFrom || null;
      }

      if (body.landlord !== undefined) {
        update.landlord = body.landlord || null;
      }

      if (body.amenities !== undefined) {
        try {
          const value = Array.isArray(body.amenities)
            ? body.amenities
            : JSON.parse(body.amenities);

          if (!Array.isArray(value)) throw new Error();

          update.amenities = value;
        } catch {
          return res.status(400).json({
            message: "Invalid amenities data.",
          });
        }
      }

      const newPhotos = (req.files?.photos || []).map(
        (file) => `/uploads/${file.filename}`,
      );

      if (newPhotos.length > 0) {
        const existing = await Property.findById(req.params.id);

        if (!existing) {
          return res.status(404).json({
            message: "Property not found.",
          });
        }

        update.photos = [...(existing.photos || []), ...newPhotos];
      }

      const videoFile = req.files?.video?.[0];

      if (videoFile) {
        update.videoUrl = `/uploads/${videoFile.filename}`;
      }
      if (newPhotos.length > 0) {
        const existing = await Property.findById(req.params.id);

        if (!existing) {
          return res.status(404).json({
            message: "Property not found.",
          });
        }

        update.photos = [...existing.photos, ...newPhotos];
      }

      const property = await Property.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      }).populate("landlord");

      if (!property) {
        return res.status(404).json({
          message: "Property not found.",
        });
      }

      return res.json(property);
    } catch (error) {
      console.error("Property update failed:", error);

      return res.status(500).json({
        message: "Could not update property.",
      });
    }
  },
);
app.delete("/api/admin/properties/:id", auth, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    return res.json({
      message: "Property deleted successfully.",
    });
  } catch (error) {
    console.error("Property delete failed:", error);

    return res.status(500).json({
      message: "Could not delete property.",
    });
  }
});
app.delete("/api/admin/properties/:id", auth, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    res.json({ message: "Property deleted." });
  } catch (error) {
    console.error("Property deletion failed:", error);

    res.status(500).json({
      message: "Could not delete property.",
    });
  }
});

/* =====================================================
   ADMIN DASHBOARD: INQUIRIES, TASKS, PROJECTS,
   DEALS, CONTACTS AND NOTES
===================================================== */

const adminResources = {
  inquiries: {
    Model: Inquiry,
    fields: [
      "client", "property", "name", "phone", "email",
      "message", "source", "status", "followUpDate", "notes",
    ],
    required: ["name"],
  },
  tasks: {
    Model: Task,
    fields: [
      "title", "description", "dueDate", "priority", "status",
      "assignedTo", "relatedProperty", "relatedClient",
    ],
    required: ["title"],
  },
  projects: {
    Model: Project,
    fields: [
      "name", "description", "location", "status",
      "startDate", "endDate", "properties",
    ],
    required: ["name"],
  },
  deals: {
    Model: Deal,
    fields: [
      "title", "client", "property", "landlord", "amount",
      "dealType", "status", "expectedCloseDate", "notes",
    ],
    required: ["title"],
  },
  contacts: {
    Model: Contact,
    fields: [
      "name", "phone", "email", "company", "contactType", "notes",
    ],
    required: ["name"],
  },
  notes: {
    Model: AdminNote,
    fields: ["title", "content", "pinned"],
    required: ["title"],
  },
};

function pickAllowedFields(body, fields) {
  const result = {};

  for (const field of fields) {
    if (body[field] !== undefined) {
      result[field] = body[field];
    }
  }

  return result;
}

for (const [resource, config] of Object.entries(adminResources)) {
  const { Model, fields, required } = config;
  const route = `/api/admin/${resource}`;

  // GET: all records
  app.get(route, auth, adminOnly, async (_req, res) => {
    try {
      const rows = await Model.find()
        .sort({ createdAt: -1 })
        .lean();

      return res.json(rows);
    } catch (error) {
      console.error(`Fetch ${resource} failed:`, error);

      return res.status(500).json({
        message: `Could not load ${resource}.`,
      });
    }
  });

  // POST: create record
  app.post(route, auth, adminOnly, async (req, res) => {
    try {
      const data = pickAllowedFields(req.body, fields);

      for (const field of required) {
        if (
          data[field] === undefined ||
          data[field] === null ||
          String(data[field]).trim() === ""
        ) {
          return res.status(400).json({
            message: `${field} is required.`,
          });
        }
      }

      const row = await Model.create(data);

      return res.status(201).json(row);
    } catch (error) {
      console.error(`Create ${resource} failed:`, error);

      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: `Could not create ${resource}.`,
      });
    }
  });

  // PATCH: update record
  app.patch(`${route}/:id`, auth, adminOnly, async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid record ID.",
        });
      }

      const data = pickAllowedFields(req.body, fields);

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          message: "No valid fields provided.",
        });
      }

      for (const field of required) {
        if (
          data[field] !== undefined &&
          (data[field] === null || String(data[field]).trim() === "")
        ) {
          return res.status(400).json({
            message: `${field} cannot be empty.`,
          });
        }
      }

      const row = await Model.findByIdAndUpdate(
        req.params.id,
        { $set: data },
        { new: true, runValidators: true },
      );

      if (!row) {
        return res.status(404).json({
          message: "Record not found.",
        });
      }

      return res.json(row);
    } catch (error) {
      console.error(`Update ${resource} failed:`, error);

      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: `Could not update ${resource}.`,
      });
    }
  });

  // DELETE: remove record
  app.delete(`${route}/:id`, auth, adminOnly, async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid record ID.",
        });
      }

      const row = await Model.findByIdAndDelete(req.params.id);

      if (!row) {
        return res.status(404).json({
          message: "Record not found.",
        });
      }

      return res.json({
        message: "Record deleted successfully.",
        id: row._id,
      });
    } catch (error) {
      console.error(`Delete ${resource} failed:`, error);

      return res.status(500).json({
        message: `Could not delete ${resource}.`,
      });
    }
  });
}


// Client submits flat requirements
app.post("/api/clients/requirements", auth, async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Client account required.",
      });
    }

    if (req.body.consent !== true) {
      return res.status(400).json({
        message: "Please confirm consent to store your details.",
      });
    }

    // Save property requirements in MongoDB
    const row = await ClientRequest.create({
      ...req.body,
      user: req.user._id,
    });

    // Get client's registration details
    const client = await User.findById(req.user._id)
      .select("name email phone createdAt")
      .lean();

    // Format details for email
    const formatDetails = (data, excludedFields = []) =>
      Object.entries(data || {})
        .filter(
          ([key, value]) =>
            !excludedFields.includes(key) &&
            value !== undefined &&
            value !== null &&
            value !== "",
        )
        .map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (char) => char.toUpperCase());

          let formattedValue;

          if (Array.isArray(value)) {
            formattedValue = value
              .map((item) =>
                typeof item === "object" && item !== null
                  ? JSON.stringify(item, null, 2)
                  : String(item),
              )
              .join(", ");
          } else if (typeof value === "object") {
            formattedValue = JSON.stringify(value, null, 2);
          } else {
            formattedValue = String(value);
          }

          return `${label}: ${formattedValue}`;
        })
        .join("\n");

    const registrationDetails = formatDetails(client, [
      "_id",
      "__v",
      "createdAt",
      "updatedAt",
    ]);

    const requirementDetails = formatDetails(row.toObject(), [
      "_id",
      "__v",
      "user",
      "consent",
      "createdAt",
      "updatedAt",
    ]);

    // Send complete saved details to admin email
    void safeNotifyAdmin(
      "New Client & Property Requirement - House Broker",
      `NEW CLIENT REGISTRATION DETAILS

${registrationDetails || "No registration details found."}

----------------------------------------

PROPERTY REQUIREMENT DETAILS

${requirementDetails || "No property requirement details found."}

----------------------------------------

Submitted At: ${new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })}

Please log in to the House Broker admin dashboard for more details.`,
    );

    return res.status(201).json({
      message: "Your requirements were submitted successfully.",
    });
  } catch (error) {
    console.error("Client requirement submission failed:", error);

    return res.status(500).json({
      message: "Could not submit requirements. Please try again.",
    });
  }
});

// Client views own requirements
app.get("/api/clients/requirements/mine", auth, async (req, res) => {
  try {
    const rows = await ClientRequest.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(rows);
  } catch (error) {
    console.error("Client requirements fetch failed:", error);

    res.status(500).json({
      message: "Could not load your requirements.",
    });
  }
});

// Payment order creation
app.post("/api/payments/create-order", auth, async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        message: "Payment is not configured yet. Please contact the broker.",
      });
    }

    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount < 1 || amount > 500000) {
      return res.status(400).json({
        message: "Invalid amount.",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rent-${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment order creation failed:", error);

    res.status(500).json({
      message: "Could not create payment order.",
    });
  }
});

// Multer and other request errors
app.use((error, _req, res, _next) => {
  console.error("API error:", error);

  res.status(400).json({
    message: error.message || "Request failed.",
  });
});

const port = process.env.PORT || 5000;

await mongoose.connect(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`House broker API running on ${port}`);
});
