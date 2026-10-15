import React, { useEffect, useState } from "react";
import Field from "../components/Field";
import {
  Home,
  Plus,
  MapPin,
  ArrowRight,
  Heart,
  GitCompareArrows,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import { money, serverUrl } from "../api";

import PropertyMapPicker from "../components/PropertyMapPicker";

export default function PropertiesPage({ app }) {
  const {
    user,
    properties = [],
    landlords = [],
    propertyForm,
    setPropertyForm,
    photos,
    setPhotos,
    propertyFilters,
    propertyVideo,
    setPropertyVideo,
    setPropertyFilters,
    addProperty,
    markUnavailable,
    admin,
    go,
  } = app;

  const [savedProperties, setSavedProperties] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [listingMode, setListingMode] = useState("all");
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [savingProperty, setSavingProperty] = useState(false);
  
useEffect(() => {
  if (!app.editPropertyId || !app.properties?.length) return;

  const property = app.properties.find(
    (item) => (item._id || item.id) === app.editPropertyId,
  );

  if (property) {
    startEditProperty(property);
    app.setEditPropertyId(null);
    setShowPropertyForm(true);
  }
}, [app.editPropertyId, app.properties]);


  function startEditProperty(property) {
    setEditingPropertyId(propertyId(property));

    setPropertyForm({
      title: property.title || "",
      kind: property.kind || "Flat",
      purpose: property.purpose || "Rent",
      bhk: property.bhk || "",
      rent: String(property.rent ?? ""),
      furnished: property.furnished || "Unfurnished",
      description: property.description || "",
      area: property.area || "",
      sector: property.sector || "",
      location: property.location || "",
      latitude: property.latitude ?? "",
      longitude: property.longitude ?? "",
      mapUrl: property.mapUrl || "",
      flatNumber: property.flatNumber || "",
      addressPrivate: property.addressPrivate || "",
      landlord: property.landlord?._id || property.landlord || "",
      areaSqFt: property.areaSqFt ?? "",
      bathrooms: String(property.bathrooms ?? 1),
      balconies: String(property.balconies ?? 0),
      floorNumber: property.floorNumber ?? "",
      totalFloors: property.totalFloors ?? "",
      propertyAgeYears: property.propertyAgeYears ?? "",
      facing: property.facing || "",
      securityDeposit: String(property.securityDeposit ?? 0),
      monthlyMaintenance: String(property.monthlyMaintenance ?? 0),
      negotiable: Boolean(property.negotiable),
      availableFrom: property.availableFrom
        ? String(property.availableFrom).slice(0, 10)
        : "",
      amenities: property.amenities || [],
      petFriendly: Boolean(property.petFriendly),
      bachelorFriendly: Boolean(property.bachelorFriendly),
      nearbySchool: property.nearbySchool || "",
      nearbyHospital: property.nearbyHospital || "",
      nearbyMarket: property.nearbyMarket || "",
      floorPlanUrl: property.floorPlanUrl || "",
    });

    setPhotos([]);
    setPropertyVideo(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
function cancelEditProperty() {
  setEditingPropertyId(null);
  setPhotos([]);
  setPropertyVideo(null);

  app.loadAdmin();
}

  async function deleteProperty(property) {
    const confirmed = window.confirm(`Delete "${property.title}" permanently?`);

    if (!confirmed) return;

    try {
      await app.api(`/admin/properties/${propertyId(property)}`, {
        method: "DELETE",
      });

      setSelectedForCompare((current) =>
        current.filter((id) => id !== propertyId(property)),
      );

      await app.loadAdmin();
      app.setNotice("Property deleted successfully.");
    } catch (error) {
      app.setError(error.message || "Could not delete property.");
    }
  }

  async function saveProperty(e) {
    e.preventDefault();

    if (!editingPropertyId) {
      addProperty(e);
      return;
    }

    setSavingProperty(true);

    try {
      const formData = new FormData();

      Object.entries(propertyForm).forEach(([key, value]) => {
        formData.append(
          key,
          key === "amenities" ? JSON.stringify(value) : String(value ?? ""),
        );
      });

      photos.forEach((photo) => formData.append("photos", photo));
      if (propertyVideo) {
        formData.append("video", propertyVideo);
      }

      await app.api(`/admin/properties/${editingPropertyId}`, {
        method: "PATCH",
        body: formData,
      });

      setEditingPropertyId(null);
      setPhotos([]);
      setPropertyVideo(null);

      await app.loadAdmin();
      app.setNotice("Property updated successfully.");
    } catch (error) {
      app.setError(error.message || "Could not update property.");
    } finally {
      setSavingProperty(false);
    }
  }

  const propertyId = (property) => String(property?._id || property?.id || "");

  const isSaved = (property) =>
    savedProperties.some((saved) => propertyId(saved) === propertyId(property));

  async function loadWishlist() {
    if (!user) {
      app.setError("Please log in to use your wishlist.");
      go("auth");
      return false;
    }

    setWishlistLoading(true);

    try {
      const result = await app.api("/wishlist");
      setSavedProperties(Array.isArray(result) ? result : []);
      return true;
    } catch (error) {
      app.setError(error.message || "Could not load wishlist.");
      return false;
    } finally {
      setWishlistLoading(false);
    }
  }

  async function toggleWishlist(property) {
    if (!user || admin) {
      app.setError("Log in with a client account to save properties.");
      if (!user) go("auth");
      return;
    }

    const id = propertyId(property);
    if (!id) return;

    const alreadySaved = isSaved(property);

    try {
      if (alreadySaved) {
        await app.api(`/wishlist/${id}`, { method: "DELETE" });

        setSavedProperties((current) =>
          current.filter((item) => propertyId(item) !== id),
        );
      } else {
        await app.api(`/wishlist/${id}`, { method: "POST" });

        setSavedProperties((current) =>
          current.some((item) => propertyId(item) === id)
            ? current
            : [...current, property],
        );
      }
    } catch (error) {
      app.setError(error.message || "Could not update wishlist.");
    }
  }

  function toggleCompare(property) {
    const id = propertyId(property);
    if (!id) return;

    setSelectedForCompare((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 3) {
        app.setError("You can compare up to 3 properties at a time.");
        return current;
      }

      return [...current, id];
    });
  }

  const filteredProperties = properties.filter((p) => {
    if (!admin && p.available === false) return false;

    const {
      purpose = "Rent",
      location = "",
      budget = "Any budget",
      bhk = "Any BHK",
      furnished = "Any",
    } = propertyFilters || {};

    const searchText = [p.location, p.area, p.sector, p.title]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesLocation =
      !location.trim() || searchText.includes(location.trim().toLowerCase());

    const price = Number(p.rent ?? p.price ?? 0);

    const matchesBudget =
      budget === "Any budget" || (price > 0 && price <= Number(budget));

    const matchesBhk =
      bhk === "Any BHK" ||
      String(p.bhk || "")
        .toLowerCase()
        .includes(bhk.replace(" BHK", "").toLowerCase());

    const matchesFurnished =
      furnished === "Any" ||
      String(p.furnished || "").toLowerCase() === furnished.toLowerCase();

    const propertyPurpose = String(p.purpose || "Rent").toLowerCase();

    const matchesPurpose =
      purpose === "Any purpose" ||
      propertyPurpose === String(purpose).toLowerCase() ||
      propertyPurpose === "both";

    return (
      matchesLocation &&
      matchesBudget &&
      matchesBhk &&
      matchesFurnished &&
      matchesPurpose
    );
  });

  const visibleProperties =
    listingMode === "wishlist"
      ? filteredProperties.filter((property) => isSaved(property))
      : listingMode === "compare"
        ? []
        : filteredProperties;

  const comparedProperties = selectedForCompare
    .map((id) => properties.find((property) => propertyId(property) === id))
    .filter(Boolean);

  function removeFromCompare(property) {
    const id = propertyId(property);
    setSelectedForCompare((current) => current.filter((item) => item !== id));
  }

  const isBuy = (p) => String(p.purpose || "Rent").toLowerCase() === "buy";

  const photoUrl = (photo) =>
    photo.startsWith("http")
      ? photo
      : `${serverUrl}${photo.startsWith("/") ? "" : "/"}${photo}`;

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {admin ? "ADMIN INVENTORY" : "FIND YOUR HOME"}
          </span>
          <h1>{admin ? "Property management" : "Find your home"}</h1>
          <p>
            {admin
              ? "Add and manage properties for rent and sale."
              : "Explore homes for rent or properties available to buy."}
          </p>
        </div>

        {!admin && user && (
          <button className="btn btn-dark" onClick={() => go("requirements")}>
            Share requirements <ArrowRight size={16} />
          </button>
        )}
      </div>

      {!admin && (
        <div className="content-card" style={{ marginBottom: 24 }}>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={
                listingMode === "all" ? "btn btn-dark" : "btn btn-light"
              }
              onClick={() => setListingMode("all")}
            >
              All Properties
            </button>

            <button
              type="button"
              className={
                listingMode === "wishlist" ? "btn btn-dark" : "btn btn-light"
              }
              disabled={wishlistLoading}
              onClick={async () => {
                const loaded = await loadWishlist();
                if (loaded) setListingMode("wishlist");
              }}
            >
              <Heart size={16} />
              {wishlistLoading
                ? "Loading..."
                : `Wishlist (${savedProperties.length})`}
            </button>

            <button
              type="button"
              className={
                listingMode === "compare" ? "btn btn-dark" : "btn btn-light"
              }
              onClick={() => setListingMode("compare")}
            >
              <GitCompareArrows size={16} />
              Compare ({selectedForCompare.length})
            </button>
          </div>
        </div>
      )}

      {admin && (
        <button
          type="button"
          className="btn"
          style={{
            background: "linear-gradient(135deg, #27c74a, #25d76d)",
            color: "#ffffff",
            padding: "13px 24px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "15px",
            border: "none",
            boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
            cursor: "pointer",
            marginTop: "12px",
            marginBottom: "20px",
          }}
          onClick={() => {
            setShowPropertyForm(!showPropertyForm);
            if (editingPropertyId) {
              setEditingPropertyId(null);
              setPhotos([]);
            }
          }}
        >
          <Plus size={18} />
          {showPropertyForm ? "Close Form" : "Add Property"}
        </button>
      )}

      {/* RENT / BUY FILTERS */}
      {!admin && (
        <div className="content-card" style={{ marginBottom: 24 }}>
          <div className="form-grid three">
            <Field
              label="Listing purpose"
              name="purposeFilter"
              value={propertyFilters.purpose}
              onChange={(e) =>
                setPropertyFilters({
                  ...propertyFilters,
                  purpose: e.target.value,
                })
              }
              options={["Any purpose", "Rent", "Buy", "Both"]}
            />

            <Field
              label="Location"
              name="locationFilter"
              value={propertyFilters.location}
              onChange={(e) =>
                setPropertyFilters({
                  ...propertyFilters,
                  location: e.target.value,
                })
              }
              placeholder="Enter city or area"
            />

            <Field
              label="Maximum budget (₹)"
              name="budgetFilter"
              value={propertyFilters.budget}
              onChange={(e) =>
                setPropertyFilters({
                  ...propertyFilters,
                  budget: e.target.value,
                })
              }
              options={[
                "Any budget",
                "5000",
                "10000",
                "15000",
                "25000",
                "50000",
                "100000",
                "2500000",
                "5000000",
                "10000000",
              ]}
            />

            <Field
              label="BHK"
              name="bhkFilter"
              value={propertyFilters.bhk}
              onChange={(e) =>
                setPropertyFilters({
                  ...propertyFilters,
                  bhk: e.target.value,
                })
              }
              options={[
                "Any BHK",
                "1 BHK",
                "2 BHK",
                "3 BHK",
                "4+ BHK",
                "Studio",
              ]}
            />

            <Field
              label="Furnishing"
              name="furnishedFilter"
              value={propertyFilters.furnished}
              onChange={(e) =>
                setPropertyFilters({
                  ...propertyFilters,
                  furnished: e.target.value,
                })
              }
              options={["Any", "Furnished", "Semi-furnished", "Unfurnished"]}
            />
          </div>
        </div>
      )}
      {/* ADD PROPERTY FORM */}
      {admin && (
        <div className="content-card form-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">NEW LISTING</span>
              <h2>
                {editingPropertyId ? "Edit property" : "Add a property"}
              </h2>{" "}
            </div>
          </div>

          <form
            onSubmit={saveProperty}
            className="form-grid three"
            style={{ display: showPropertyForm ? "grid" : "none" }}
          >
            {" "}
            <Field
              label="Listing title"
              name="title"
              value={propertyForm.title}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  title: e.target.value,
                })
              }
              required
              placeholder="e.g. Bright 2 BHK apartment"
            />
            <Field
              label="Listing purpose"
              name="purpose"
              value={propertyForm.purpose}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  purpose: e.target.value,
                })
              }
              options={["Rent", "Buy"]}
            />
            <Field
              label="Property type"
              name="kind"
              value={propertyForm.kind}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  kind: e.target.value,
                })
              }
              options={["Flat", "House", "PG", "Other"]}
            />
            <Field
              label="BHK"
              name="bhk"
              value={propertyForm.bhk}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  bhk: e.target.value,
                })
              }
              options={[
                "1 BHK",
                "2 BHK",
                "3 BHK",
                "4+ BHK",
                "Studio",
                "Not applicable",
              ]}
            />
            <Field
              label={
                propertyForm.purpose === "Buy"
                  ? "Total sale price (₹)"
                  : "Monthly rent (₹)"
              }
              name="rent"
              type="number"
              min="0"
              step="1"
              value={propertyForm.rent}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    rent: value,
                  }));
                }
              }}
              required
            />
            <Field
              label="Furnishing"
              name="furnished"
              value={propertyForm.furnished}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  furnished: e.target.value,
                })
              }
              options={["Furnished", "Semi-furnished", "Unfurnished"]}
            />
            <Field
              label="Area / neighbourhood"
              name="area"
              value={propertyForm.area}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  area: e.target.value,
                })
              }
            />
            <Field
              label="Sector"
              name="sector"
              value={propertyForm.sector}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  sector: e.target.value,
                })
              }
            />
            <Field
              label="City / public location"
              name="location"
              value={propertyForm.location}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  location: e.target.value,
                })
              }
            />
            <PropertyMapPicker
              latitude={propertyForm.latitude}
              longitude={propertyForm.longitude}
              onLocationSelect={(point) =>
                setPropertyForm((prev) => ({
                  ...prev,
                  latitude: point.latitude,
                  longitude: point.longitude,
                  mapUrl: point.mapUrl,
                }))
              }
            />
            {/* Property size and layout */}
            <Field
              label="Area (sq. ft.)"
              name="areaSqFt"
              type="number"
              min="0"
              step="1"
              value={propertyForm.areaSqFt}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    areaSqFt: value,
                  }));
                }
              }}
            />
            <Field
              label="Bathrooms"
              name="bathrooms"
              type="number"
              min="0"
              step="1"
              value={propertyForm.bathrooms}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    bathrooms: value,
                  }));
                }
              }}
            />
            <Field
              label="Balconies"
              name="balconies"
              type="number"
              min="0"
              step="1"
              value={propertyForm.balconies}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    balconies: value,
                  }));
                }
              }}
            />
            <Field
              label="Floor number"
              name="floorNumber"
              type="number"
              min="0"
              step="1"
              value={propertyForm.floorNumber}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    floorNumber: value,
                  }));
                }
              }}
            />
            <Field
              label="Total floors"
              name="totalFloors"
              type="number"
              value={propertyForm.totalFloors}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    totalFloors: value,
                  }));
                }
              }}
            />
            <Field
              label="Property age (years)"
              name="propertyAgeYears"
              type="number"
              value={propertyForm.propertyAgeYears}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    propertyAgeYears: value,
                  }));
                }
              }}
            />
            <Field
              label="Facing direction"
              name="facing"
              value={propertyForm.facing}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  facing: e.target.value,
                })
              }
              options={[
                "North",
                "South",
                "East",
                "West",
                "North-East",
                "North-West",
                "South-East",
                "South-West",
              ]}
            />
            {/* Rent and availability */}
            <Field
              label="Security deposit (₹)"
              name="securityDeposit"
              type="number"
              value={propertyForm.securityDeposit}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    securityDeposit: value,
                  }));
                }
              }}
            />
            <Field
              label="Monthly maintenance (₹)"
              name="monthlyMaintenance"
              type="number"
              value={propertyForm.monthlyMaintenance}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^\d*$/.test(value)) {
                  setPropertyForm((prev) => ({
                    ...prev,
                    monthlyMaintenance: value,
                  }));
                }
              }}
            />
            <Field
              label="Available from"
              name="availableFrom"
              type="date"
              value={propertyForm.availableFrom}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  availableFrom: e.target.value,
                })
              }
            />
            <Field
              label="Nearby school"
              name="nearbySchool"
              value={propertyForm.nearbySchool}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  nearbySchool: e.target.value,
                })
              }
            />
            <Field
              label="Nearby hospital"
              name="nearbyHospital"
              value={propertyForm.nearbyHospital}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  nearbyHospital: e.target.value,
                })
              }
            />
            <Field
              label="Nearby market"
              name="nearbyMarket"
              value={propertyForm.nearbyMarket}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  nearbyMarket: e.target.value,
                })
              }
            />
            <Field
              label="Floor plan image URL"
              name="floorPlanUrl"
              value={propertyForm.floorPlanUrl}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  floorPlanUrl: e.target.value,
                })
              }
            />
            {/* Property options */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={propertyForm.negotiable}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    negotiable: e.target.checked,
                  })
                }
              />
              Price is negotiable
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={propertyForm.petFriendly}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    petFriendly: e.target.checked,
                  })
                }
              />
              Pets allowed
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={propertyForm.bachelorFriendly}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    bachelorFriendly: e.target.checked,
                  })
                }
              />
              Bachelors allowed
            </label>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Amenities</label>

              {[
                "Parking",
                "Lift",
                "Power Backup",
                "Security",
                "Gym",
                "Swimming Pool",
                "Garden",
                "Water Supply",
                "Wi-Fi",
                "Air Conditioning",
              ].map((amenity) => (
                <label
                  key={amenity}
                  className="mr-4 inline-flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={propertyForm.amenities.includes(amenity)}
                    onChange={(e) =>
                      setPropertyForm((prev) => ({
                        ...prev,
                        amenities: e.target.checked
                          ? [...prev.amenities, amenity]
                          : prev.amenities.filter((item) => item !== amenity),
                      }))
                    }
                  />
                  {amenity}
                </label>
              ))}
            </div>
            <Field
              label="Flat / house number (private)"
              name="flatNumber"
              value={propertyForm.flatNumber}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  flatNumber: e.target.value,
                })
              }
            />
            <Field
              label="Full address / landmark (private)"
              name="addressPrivate"
              value={propertyForm.addressPrivate}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  addressPrivate: e.target.value,
                })
              }
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium">Landlord</label>
              <select
                name="landlord"
                value={propertyForm.landlord}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    landlord: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">No landlord selected</option>
                {landlords.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.fullName}
                  </option>
                ))}
              </select>
            </div>
            <label className="field">
              <span>Property photos (up to 8)</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setPhotos([...e.target.files].slice(0, 8))}
              />
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => setPropertyVideo(e.target.files[0] || null)}
              />
            </label>
            <label className="field span-all">
              <span>Property description</span>
              <textarea
                value={propertyForm.description}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    description: e.target.value,
                  })
                }
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                className="btn btn-dark"
                type="submit"
                disabled={savingProperty}
              >
                <Plus size={17} />
                {savingProperty
                  ? "Saving..."
                  : editingPropertyId
                    ? "Update property"
                    : "Save property"}
              </button>

              {editingPropertyId && (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={cancelEditProperty}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {!admin && listingMode === "compare" && (
        <section className="content-card" style={{ marginBottom: 24 }}>
          <div className="section-title">
            <div>
              <span className="eyebrow">PROPERTY COMPARISON</span>
              <h2>Compare properties</h2>
              <p>
                Select up to 3 properties using the Compare button on property
                cards.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-light"
              onClick={() => setListingMode("all")}
            >
              Back to properties
            </button>
          </div>

          {comparedProperties.length === 0 ? (
            <div className="empty-state">
              No properties selected. Go back and click Compare on the
              properties you want to compare.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 560 }}>
                <thead>
                  <tr>
                    <th className="text-left p-3">Feature</th>
                    {comparedProperties.map((property) => (
                      <th className="text-left p-3" key={propertyId(property)}>
                        <div>{property.title || "Property"}</div>
                        <button
                          type="button"
                          className="btn btn-light mt-2"
                          onClick={() => removeFromCompare(property)}
                        >
                          <X size={14} /> Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {[
                    [
                      "Price",
                      (p) =>
                        `${money(p.rent ?? p.price)}${String(p.purpose || "Rent").toLowerCase() === "buy" ? " total" : "/month"}`,
                    ],
                    ["Purpose", (p) => p.purpose || "Rent"],
                    ["Property type", (p) => p.kind || "—"],
                    ["BHK", (p) => p.bhk || "—"],
                    [
                      "Location",
                      (p) =>
                        [p.area, p.sector, p.location]
                          .filter(Boolean)
                          .join(", ") || "—",
                    ],
                    [
                      "Area",
                      (p) => (p.areaSqFt ? `${p.areaSqFt} sq. ft.` : "—"),
                    ],
                    ["Furnishing", (p) => p.furnished || "—"],
                    ["Bathrooms", (p) => p.bathrooms ?? "—"],
                    ["Balconies", (p) => p.balconies ?? "—"],
                    [
                      "Security deposit",
                      (p) =>
                        p.securityDeposit ? money(p.securityDeposit) : "—",
                    ],
                    [
                      "Monthly maintenance",
                      (p) =>
                        p.monthlyMaintenance
                          ? money(p.monthlyMaintenance)
                          : "—",
                    ],
                    [
                      "Amenities",
                      (p) =>
                        p.amenities?.length ? p.amenities.join(", ") : "—",
                    ],
                    ["Pets allowed", (p) => (p.petFriendly ? "Yes" : "No")],
                    [
                      "Bachelors allowed",
                      (p) => (p.bachelorFriendly ? "Yes" : "No"),
                    ],
                    [
                      "Available from",
                      (p) =>
                        p.availableFrom
                          ? new Date(p.availableFrom).toLocaleDateString(
                              "en-IN",
                            )
                          : "—",
                    ],
                  ].map(([label, getValue]) => (
                    <tr key={label}>
                      <th className="text-left p-3">{label}</th>
                      {comparedProperties.map((property) => (
                        <td className="p-3" key={propertyId(property)}>
                          {getValue(property)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* PROPERTY CARDS */}

      <div
        className="property-grid"
        style={{
          padding: "8px",
        }}
      >
        {visibleProperties.map((p) => (
          <article
            className="property-card"
            key={p._id}
            onClick={() => go("property-details", p)}
            style={{ cursor: "pointer" }}
          >
            <div className="property-image">
              {p.photos?.[0] ? (
                <img src={photoUrl(p.photos[0])} alt={p.title} />
              ) : (
                <div className="image-placeholder">
                  <Home size={42} />
                  <span>HOMEKEY PROPERTY</span>
                </div>
              )}

              <span className="property-type">
                {String(p.purpose || "Rent").toLowerCase() === "both"
                  ? "FOR RENT / SALE"
                  : isBuy(p)
                    ? "FOR SALE"
                    : "FOR RENT"}
              </span>
            </div>

            <div className="property-info">
              <div className="property-top">
                <span className="property-type">
                  {p.kind} {p.bhk && `· ${p.bhk}`}
                </span>

                <strong>
                  {money(p.rent ?? p.price)}
                  <small>{isBuy(p) ? " total" : "/month"}</small>
                </strong>
              </div>

              <h3>{p.title}</h3>

              <p className="location">
                <MapPin size={15} />
                {[p.area, p.sector, p.location].filter(Boolean).join(", ") ||
                  "Location on request"}
              </p>

              {p.areaSqFt > 0 && <p>{p.areaSqFt} sq. ft.</p>}

              <button
                type="button"
                className="btn btn-dark full"
                onClick={(e) => {
                  e.stopPropagation();
                  go("property-details", p);
                }}
              >
                View Details <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {!admin &&
        listingMode === "wishlist" &&
        visibleProperties.length === 0 && (
          <div className="empty-state">
            Your wishlist is empty or no saved properties match the current
            filters.
          </div>
        )}

      {!admin && listingMode === "all" && visibleProperties.length === 0 && (
        <div className="empty-state">
          No matching properties found. Try changing your filters.
        </div>
      )}

      {admin && visibleProperties.length === 0 && (
        <div className="empty-state">No matching properties found.</div>
      )}
    </>
  );
}
