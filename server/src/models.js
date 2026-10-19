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
    propertyId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    rentalCategory: {
      type: String,
      enum: ["Family", "Student"],
      default: "Family",
    },

    status: {
      type: String,
      enum: ["Available", "Rented", "Reserved"],
      default: "Available",
    },
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
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "VISIT_SCHEDULED", "CLOSED"],
      default: "NEW",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      maxlength: 1000,
    },
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

// =====================================================
// ADMIN DASHBOARD MODELS
// =====================================================

// Inquiry: client/property enquiry and follow-up tracking
const inquirySchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    message: { type: String, default: "" },
    source: {
      type: String,
      enum: ["Website", "Phone", "WhatsApp", "Referral", "Other"],
      default: "Website",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Converted", "Closed"],
      default: "New",
    },
    followUpDate: { type: Date, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);


/* Task: admin daily work and reminders */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    taskType: {
      type: String,
      enum: [
        "Call",
        "Site Visit",
        "Payment",
        "Renewal / Vacant",
        "Other",
      ],
      default: "Call",
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    inquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inquiry",
      default: null,
    },

    // The current TasksPage uses a text input for project.
    project: {
      type: String,
      default: "",
      trim: true,
    },

    // The current TasksPage selects an entry from the landlords list.
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Project: a group of properties or a property development
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Planning", "Active", "Completed", "On Hold"],
      default: "Planning",
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  { timestamps: true },
);

// Deal: rental, sale or booking progress
const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      default: null,
    },
    amount: { type: Number, min: 0, default: 0 },
    dealType: {
      type: String,
      enum: ["Rent", "Sale", "Booking", "Other"],
      default: "Rent",
    },
    status: {
      type: String,
      enum: ["Lead", "Negotiation", "Agreement", "Completed", "Cancelled"],
      default: "Lead",
    },
    expectedCloseDate: { type: Date, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

// Contact: additional people and business contacts
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    company: { type: String, default: "" },
    contactType: {
      type: String,
      enum: ["Client", "Landlord", "Agent", "Vendor", "Other"],
      default: "Other",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

// Notes: admin's saved notes and reminders
const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Export all new models
export const Inquiry = mongoose.model("Inquiry", inquirySchema);
export const Task = mongoose.model("Task", taskSchema);
export const Project = mongoose.model("Project", projectSchema);
export const Deal = mongoose.model("Deal", dealSchema);
export const Contact = mongoose.model("Contact", contactSchema);
export const AdminNote = mongoose.model("AdminNote", noteSchema);
