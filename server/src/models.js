import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, default: "" },
    googleId: { type: String, default: null },
    role: { type: String, enum: ["ADMIN", "CLIENT"], default: "CLIENT" },
    phone: { type: String, default: "" },
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  { timestamps: true },
);

const landlordSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    kind: {
      type: String,
      enum: ["Flat", "House", "PG", "Other"],
      default: "Flat",
    },

    purpose: {
      type: String,
      enum: ["Rent", "Buy", "Both"],
      default: "Rent",
    },

    bhk: { type: String, default: "" },
    rent: { type: Number, required: true },
    furnished: {
      type: String,
      enum: ["Furnished", "Semi-furnished", "Unfurnished"],
      default: "Unfurnished",
    },
    description: { type: String, default: "" },
    photos: [{ type: String }],
    videoUrl: { type: String, default: "" },
    area: { type: String, default: "" },

    // Property size and layout
    areaSqFt: { type: Number, default: null },
    bathrooms: { type: Number, default: 1 },
    balconies: { type: Number, default: 0 },
    floorNumber: { type: Number, default: null },
    totalFloors: { type: Number, default: null },
    propertyAgeYears: { type: Number, default: null },
    facing: {
      type: String,
      enum: [
        "North",
        "South",
        "East",
        "West",
        "North-East",
        "North-West",
        "South-East",
        "South-West",
        "",
      ],
      default: "",
    },

    // Rent and availability
    securityDeposit: { type: Number, default: 0 },
    monthlyMaintenance: { type: Number, default: 0 },
    negotiable: { type: Boolean, default: false },
    availableFrom: { type: Date, default: null },

    // Amenities
    amenities: [{ type: String }],
    petFriendly: { type: Boolean, default: false },
    bachelorFriendly: { type: Boolean, default: false },

    // Nearby places
    nearbySchool: { type: String, default: "" },
    nearbyHospital: { type: String, default: "" },
    nearbyMarket: { type: String, default: "" },
    floorPlanUrl: { type: String, default: "" },

    sector: { type: String, default: "" },
    location: { type: String, default: "" },

    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    mapUrl: { type: String, default: "" },

    flatNumber: { type: String, default: "" },
    addressPrivate: { type: String, default: "" },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      default: null,
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const clientRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    nativePlace: String,
    currentlyStaying: String,
    nationality: { type: String, default: "India" },
    dateOfVisiting: String,
    contact: String,
    ageGroup: String,
    linkedinProfile: String,
    maxBudget: String,
    bhkRequired: String,
    furnished: String,
    floorPreference: String,
    preferredArea: String,
    profession: String,
    companyCollege: String,
    workLocation: String,
    householdType: String,
    peopleCount: String,
    legalCase: String,
    smokingDrinking: String,
    vehicle: String,
    shiftingDate: String,
    pets: String,
    consent: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
export const Landlord = mongoose.model("Landlord", landlordSchema);
export const Property = mongoose.model("Property", propertySchema);
export const ClientRequest = mongoose.model(
  "ClientRequest",
  clientRequestSchema,
);
