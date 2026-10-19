import React, { useEffect, useState } from "react";
import { api, token } from "./api";
import emptyRequirement from "./constants/emptyRequirement";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import OverviewPage from "./pages/OverviewPage";
import PropertiesPage from "./pages/PropertiesPage";
import LandlordsPage from "./pages/LandlordsPage";
import ClientsPage from "./pages/ClientsPage";
import AboutUsPage from "./pages/AboutUsPage";
import AboutBrokerPage from "./pages/AboutBrokerPage";
import RequirementsPage from "./pages/RequirementsPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import PaymentPage from "./pages/PaymentPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NoticeBanner from "./components/NoticeBanner";
import {
  Home,
  KeyRound,
  Users,
  Building2,
  LogOut,
  Plus,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  Wallet,
} from "lucide-react";

function App() {
  const [user, setUser] = useState(null),
    [view, setView] = useState("home"),
    [mobileMenu, setMobileMenu] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [editPropertyId, setEditPropertyId] = useState(null);

  const [authMode, setAuthMode] = useState("login"),
    [authForm, setAuthForm] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
    });
  const [properties, setProperties] = useState([]),
    [overview, setOverview] = useState(null),
    [clients, setClients] = useState({ clients: [], requests: [] }),
    [landlords, setLandlords] = useState([]);

  const [propertyFilters, setPropertyFilters] = useState({
    purpose: "Any purpose",
    location: "",
    budget: "Any budget",
    minBudget: "",
    maxBudget: "",
    bhk: "Any BHK",
    furnished: "Any",
    kind: "Any type",
    rentalCategory: "Any category",
    bathrooms: "Any",
    sortBy: "newest",
  });
  const [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  const [requirement, setRequirement] = useState(emptyRequirement);
  const [landlordForm, setLandlordForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [propertyForm, setPropertyForm] = useState({
    title: "",
    kind: "Flat",

    rentalCategory: "Family",
    status: "Available",
    purpose: "Rent",
    bhk: "",
    rent: "",
    furnished: "Unfurnished",
    description: "",

    // Location
    area: "",
    sector: "",
    location: "",
    latitude: "",
    longitude: "",
    mapUrl: "",
    flatNumber: "",
    addressPrivate: "",
    landlord: "",

    // Property layout
    areaSqFt: "",
    bathrooms: "1",
    balconies: "0",
    floorNumber: "",
    totalFloors: "",
    propertyAgeYears: "",
    facing: "",

    // Price and availability
    securityDeposit: "0",
    monthlyMaintenance: "0",
    negotiable: false,
    availableFrom: "",

    // Amenities
    amenities: [],
    petFriendly: false,
    bachelorFriendly: false,

    // Nearby places and floor plan
    nearbySchool: "",
    nearbyHospital: "",
    nearbyMarket: "",
    floorPlanUrl: "",
  });

  const [photos, setPhotos] = useState([]);
  const [propertyVideo, setPropertyVideo] = useState(null);
  const [payAmount, setPayAmount] = useState("1000");
  const resetMessages = () => {
    setNotice("");
    setError("");
  };
  async function loadPublic() {
    try {
      setProperties(await api("/properties"));
    } catch (e) {
      setError(e.message);
    }
  }
  async function loadAdmin() {
    try {
      const [o, c, l, p] = await Promise.all([
        api("/admin/overview"),
        api("/admin/clients"),
        api("/admin/landlords"),
        api("/admin/properties"),
      ]);
      setOverview(o);
      setClients(c);
      setLandlords(l);
      setProperties(p);
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    loadPublic();
    const saved = localStorage.getItem("house_user");
    if (saved && token()) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);
  useEffect(() => {
    if (user?.role === "ADMIN") loadAdmin();
    else if (user) loadPublic();
  }, [user]);
  function logout() {
    localStorage.removeItem("house_token");
    localStorage.removeItem("house_user");
    setUser(null);
    setView("home");
    setNotice("You have logged out.");
  }
  async function submitAuth(e) {
    e.preventDefault();
    resetMessages();
    try {
      const path = authMode === "register" ? "/auth/register" : "/auth/login";
      const data = await api(path, {
        method: "POST",
        body: JSON.stringify(authForm),
      });
      localStorage.setItem("house_token", data.token);
      localStorage.setItem("house_user", JSON.stringify(data.user));
      setUser(data.user);
      setView(data.user.role === "ADMIN" ? "overview" : "properties");
      setNotice("Welcome, " + data.user.name + "!");
    } catch (e) {
      setError(e.message);
    }
  }

  async function submitGoogleAuth(credential) {
    resetMessages();

    try {
      const data = await api("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });

      localStorage.setItem("house_token", data.token);
      localStorage.setItem("house_user", JSON.stringify(data.user));

      setUser(data.user);
      setView(data.user.role === "ADMIN" ? "overview" : "properties");
      setNotice("Welcome, " + data.user.name + "!");
    } catch (e) {
      setError(e.message || "Google login failed.");
    }
  }

  async function submitRequirement(e) {
    e.preventDefault();
    resetMessages();
    try {
      await api("/clients/requirements", {
        method: "POST",
        body: JSON.stringify(requirement),
      });
      setNotice(
        "Requirements submitted successfully. The broker will contact you.",
      );
      setRequirement(emptyRequirement);
    } catch (e) {
      setError(e.message);
    }
  }
  async function addLandlord(e) {
    e.preventDefault();
    resetMessages();
    try {
      await api("/admin/landlords", {
        method: "POST",
        body: JSON.stringify(landlordForm),
      });
      setLandlordForm({ fullName: "", phone: "", email: "", notes: "" });
      await loadAdmin();
      setNotice("Landlord saved.");
    } catch (e) {
      setError(e.message);
    }
  }
  async function addProperty(e) {
    e.preventDefault();
    resetMessages();
    try {
      const fd = new FormData();

      Object.entries(propertyForm).forEach(([k, v]) => {
        if (k === "amenities") {
          fd.append(k, JSON.stringify(v));
        } else if (typeof v === "boolean") {
          fd.append(k, String(v));
        } else {
          fd.append(k, v ?? "");
        }
      });

      photos.forEach((p) => fd.append("photos", p));
      if (propertyVideo) {
        fd.append("video", propertyVideo);
      }

      await api("/admin/properties", { method: "POST", body: fd });

      setPropertyForm({
        title: "",
        kind: "Flat",
        rentalCategory: "Family",
        status: "Available",
        purpose: "Rent",
        bhk: "",
        rent: "",
        furnished: "Unfurnished",
        description: "",

        // Location
        area: "",
        sector: "",
        location: "",
        latitude: "",
        longitude: "",
        mapUrl: "",
        flatNumber: "",
        addressPrivate: "",
        landlord: "",

        // Property size and layout
        areaSqFt: "",
        bathrooms: "1",
        balconies: "0",
        floorNumber: "",
        totalFloors: "",
        propertyAgeYears: "",
        facing: "",

        // Rent and availability
        securityDeposit: "0",
        monthlyMaintenance: "0",
        negotiable: false,
        availableFrom: "",

        // Amenities
        amenities: [],
        petFriendly: false,
        bachelorFriendly: false,

        // Nearby places
        nearbySchool: "",
        nearbyHospital: "",
        nearbyMarket: "",
        floorPlanUrl: "",
      });

      setPhotos([]);
      setPropertyVideo(null);

      await loadAdmin();
      setNotice("Property saved.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function markUnavailable(id, available = false) {
    try {
      await api(`/admin/properties/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ available }),
      });
      await loadAdmin();
    } catch (e) {
      setError(e.message);
    }
  }
  async function deletePropertyFromDetails(id) {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this property?",
      );

      if (!confirmed) return;

      await api(`/admin/properties/${id}`, {
        method: "DELETE",
      });

      await loadAdmin();
      setNotice("Property deleted successfully.");
      go("properties");
    } catch (e) {
      setError(e.message || "Could not delete property.");
    }
  }
  async function createPayment(e) {
    e.preventDefault();
    resetMessages();
    try {
      const order = await api("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: payAmount }),
      });
      if (!window.Razorpay) {
        setError(
          "Razorpay checkout script not loaded. Add its script to index.html.",
        );
        return;
      }
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "HomeKey Broker",
        description: "Brokerage / booking payment",
        order_id: order.orderId,
        handler: () =>
          setNotice(
            "Payment response received. Final confirmation requires server-side signature verification.",
          ),
        prefill: { name: user?.name || "", email: user?.email || "" },
        theme: { color: "#173f35" },
      });
      checkout.open();
    } catch (e) {
      setError(e.message);
    }
  }
  const admin = user?.role === "ADMIN";
  const nav = admin
    ? [
        ["profile", "My Profile", Users],
        ["overview", "Overview", Home],
        ["properties", "Properties", Building2],
        ["landlords", "Landlords", KeyRound],
        ["clients", "Clients", Users],
      ]
    : user
      ? [
          ["profile", "My Profile", Users],
          ["properties", "Available homes", Building2],
          ["requirements", "My requirements", Users],
          ["payment", "Payment", Wallet],
        ]
      : [
          ["home", "Home", Home],
          ["properties", "Available homes", Building2],
          ["contact", "Contact", Phone],
        ];
  function go(v, property = null) {
    if (v === "property-details") {
      if (!property) return;

      setSelectedProperty(property);

      const propertyId = property._id || property.id;

      if (propertyId) {
        window.history.pushState(
          { view: "property-details", propertyId },
          "",
          `/property/${propertyId}`,
        );
      }
    } else {
      window.history.pushState({ view: v }, "", v === "home" ? "/" : `/${v}`);
    }

    setView(v);
    setMobileMenu(false);
    resetMessages();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editPropertyFromDetails(property) {
    setEditPropertyId(property._id || property.id);
    go("properties");
  }

  async function deletePropertyFromDetails(property) {
    const confirmed = window.confirm(`Delete "${property.title}" permanently?`);

    if (!confirmed) return;

    try {
      await api(`/admin/properties/${property._id || property.id}`, {
        method: "DELETE",
      });

      setSelectedProperty(null);
      await loadAdmin();
      setNotice("Property deleted successfully.");
      go("properties");
    } catch (e) {
      setError(e.message || "Could not delete property.");
    }
  }

  const pageProps = {
    user,
    api,
    view,
    setView,
    mobileMenu,
    setMobileMenu,
    authMode,
    setAuthMode,
    authForm,
    selectedProperty,
    setSelectedProperty,
    setAuthForm,
    properties,
    setProperties,

    propertyFilters,
    setPropertyFilters,

    overview,
    setOverview,
    clients,
    setClients,
    landlords,
    setLandlords,
    notice,
    setNotice,
    error,
    setError,
    requirement,
    setRequirement,
    landlordForm,
    setLandlordForm,
    propertyForm,
    setPropertyForm,
    photos,
    setPhotos,
    propertyVideo,
    setPropertyVideo,
    payAmount,
    setPayAmount,
    resetMessages,
    loadPublic,
    loadAdmin,
    logout,
    submitAuth,
    submitGoogleAuth,
    submitRequirement,
    addLandlord,
    addProperty,
    markUnavailable,
    deletePropertyFromDetails,
    createPayment,
    admin,
    nav,
    go,
    editPropertyId,
    setEditPropertyId,
    editPropertyFromDetails,
  };
  return (
    <div className="app-shell">
      <Navbar app={pageProps} />
      <main className="main">
        <NoticeBanner app={pageProps} />
        {view === "home" && <HomePage app={pageProps} />}
        {view === "auth" && <AuthPage app={pageProps} />}
        {view === "overview" && admin && <OverviewPage app={pageProps} />}
        {view === "properties" && <PropertiesPage app={pageProps} />}
        {view === "property-details" && <PropertyDetailsPage app={pageProps} />}
        {view === "landlords" && admin && <LandlordsPage app={pageProps} />}
        {view === "about-us" && <AboutUsPage />}
        {view === "about-broker" && <AboutBrokerPage />}
        {view === "clients" && admin && <ClientsPage app={pageProps} />}
        {view === "requirements" && user && (
          <RequirementsPage app={pageProps} />
        )}
        {view === "payment" && user && <PaymentPage app={pageProps} />}
        {view === "contact" && <ContactPage app={pageProps} />}
        {view === "profile" && user && <ProfilePage app={pageProps} />}
      </main>
      <Footer />
      <script></script>
    </div>
  );
}
export default App;
