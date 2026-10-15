import React from "react";

import {
  ArrowLeft,
  MapPin,
  Home,
  ExternalLink,
  Ruler,
  Bath,
  Building2,
  Compass,
  Wallet,
  CalendarDays,
  GraduationCap,
  Hospital,
  ShoppingBag,
  PawPrint,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import { money, serverUrl } from "../api";

export default function PropertyDetailsPage({ app }) {
  const {
    selectedProperty: p,
    go,
    admin,
    markUnavailable,
    loadAdmin,
    api,
    setNotice,
    setError,
  } = app;

  if (!p) {
    return (
      <section className="content-card">
        <h2>Property not found</h2>

        <button
          type="button"
          className="btn btn-dark"
          onClick={() => go("properties")}
        >
          Back to properties
        </button>
      </section>
    );
  }

  const photos = (p.photos || []).map((photo) =>
    photo.startsWith("http") ? photo : `${serverUrl}${photo}`,
  );

  const location = [p.area, p.sector, p.location].filter(Boolean).join(", ");

  const mapQuery =
    p.latitude != null && p.longitude != null
      ? `${p.latitude},${p.longitude}`
      : location;

  const googleMapsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        mapQuery,
      )}`
    : "";

  const mapUrl = p.mapUrl || googleMapsUrl;

  const priceLabel =
    p.purpose === "Rent"
      ? "Monthly rent"
      : p.purpose === "Buy"
        ? "Sale price"
        : "Rent / Sale price";

  const availableFrom = p.availableFrom
    ? new Date(p.availableFrom).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const amenities = Array.isArray(p.amenities) ? p.amenities : [];

  const Detail = ({ label, value }) => {
    if (value === undefined || value === null || value === "") return null;
    console.log("Property video URL:", p.videoUrl);

    return (
      <div
        style={{
          padding: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          minWidth: 0,
        }}
      >
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
          {label}
        </div>
        <div style={{ fontWeight: 600, overflowWrap: "anywhere" }}>{value}</div>
      </div>
    );
  };

  return (
    <div className="property-details-page">
      <button
        type="button"
        className="btn btn-light"
        onClick={() => go("properties")}
      >
        <ArrowLeft size={17} /> Back to properties
      </button>
      {admin && (
        <button
          type="button"
          className="btn"
          onClick={async () => {
            try {
              await markUnavailable(p._id || p.id, p.available === false);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          {p.available === false ? "Mark Available" : "Mark Unavailable"}
        </button>
      )}
      <div className="property-video" style={{ marginTop: "20px" }}>
        <h3>Property Video</h3>

        {p.videoUrl ? (
          <video
            controls
            preload="metadata"
            style={{
              width: "100%",
              maxWidth: "800px",
              borderRadius: "12px",
            }}
            src={
              p.videoUrl.startsWith("http")
                ? p.videoUrl
                : `${serverUrl}${p.videoUrl}`
            }
          >
            Your browser does not support video playback.
          </video>
        ) : (
          <p>No video is saved for this property.</p>
        )}
      </div>
      {admin && (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            className="btn"
            onClick={() => app.editPropertyFromDetails(p)}
          >
            Edit Property
          </button>

          <button
            type="button"
            className="btn"
            style={{ background: "#dc2626", color: "#fff" }}
            onClick={() => app.deletePropertyFromDetails(p)}
          >
            Delete Property
          </button>
        </div>
      )}
      {/* Header */}
      <div
        className="page-heading"
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="eyebrow">
            {(p.kind || "Property").toUpperCase()} DETAILS
          </span>

          <h1>{p.title || "Property details"}</h1>

          <p>
            <MapPin size={16} style={{ verticalAlign: "middle" }} />{" "}
            {location || "Location not provided"}
          </p>

          <div
            className="property-tags"
            style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}
          >
            {p.purpose && <span>{p.purpose}</span>}
            {p.bhk && <span>{p.bhk}</span>}
            {p.furnished && <span>{p.furnished}</span>}
            <span>{p.available === false ? "Unavailable" : "Available"}</span>
            {p.negotiable && <span>Price negotiable</span>}
          </div>
        </div>

        <div style={{ minWidth: 150 }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{priceLabel}</div>
          <h2 style={{ marginTop: 6 }}>{money(p.rent)}</h2>
          {p.purpose === "Rent" && (
            <span style={{ color: "#6b7280", fontSize: 13 }}>/ month</span>
          )}
        </div>
      </div>
      {/* Photos */}
      <div className="content-card" style={{ marginTop: 20 }}>
        <h2>
          <ImageIcon size={20} style={{ verticalAlign: "middle" }} /> Property
          photos
        </h2>

        {photos.length > 0 ? (
          <div
            className="property-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {photos.map((src, index) => (
              <a
                key={`${src}-${index}`}
                href={src}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={src}
                  alt={`${p.title || "Property"} ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: 230,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="image-placeholder">
            <Home size={42} />
            <p>No photos available</p>
          </div>
        )}
      </div>
      {/* Basic information */}
      <div className="content-card" style={{ marginTop: 20 }}>
        <h2>Property information</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          <Detail label="Property type" value={p.kind} />
          <Detail label="Configuration" value={p.bhk} />
          <Detail
            label="Carpet / Built-up area"
            value={p.areaSqFt ? `${p.areaSqFt} sq. ft.` : ""}
          />
          <Detail label="Bathrooms" value={p.bathrooms} />
          <Detail label="Balconies" value={p.balconies} />
          <Detail label="Furnishing" value={p.furnished} />
          <Detail
            label="Floor"
            value={
              p.floorNumber != null
                ? `${p.floorNumber}${
                    p.totalFloors != null ? ` of ${p.totalFloors} floors` : ""
                  }`
                : ""
            }
          />
          <Detail
            label="Property age"
            value={
              p.propertyAgeYears != null ? `${p.propertyAgeYears} years` : ""
            }
          />
          <Detail label="Facing" value={p.facing} />
          <Detail label="Locality" value={p.area} />
          <Detail label="Sector" value={p.sector} />
          <Detail label="City / Location" value={p.location} />
        </div>

        <div style={{ marginTop: 22 }}>
          <h3>Description</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {p.description || "No description provided."}
          </p>
        </div>
      </div>
      {/* Pricing */}
      <div className="content-card" style={{ marginTop: 20 }}>
        <h2>
          <Wallet size={20} style={{ verticalAlign: "middle" }} /> Pricing and
          charges
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          <Detail label={priceLabel} value={money(p.rent)} />
          <Detail
            label="Security deposit"
            value={money(p.securityDeposit ?? 0)}
          />
          <Detail
            label="Monthly maintenance"
            value={money(p.monthlyMaintenance ?? 0)}
          />
          <Detail label="Negotiable" value={p.negotiable ? "Yes" : "No"} />
          <Detail label="Available from" value={availableFrom} />
        </div>
      </div>
      {/* Amenities */}
      <div className="content-card" style={{ marginTop: 20 }}>
        <h2>
          <Building2 size={20} style={{ verticalAlign: "middle" }} /> Amenities
        </h2>

        {amenities.length > 0 ? (
          <div
            className="property-tags"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 14,
            }}
          >
            {amenities.map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        ) : (
          <p>No amenities listed.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 18,
          }}
        >
          <Detail
            label="Pet friendly"
            value={p.petFriendly ? "Yes" : "Not specified"}
          />
          <Detail
            label="Bachelor friendly"
            value={p.bachelorFriendly ? "Yes" : "Not specified"}
          />
        </div>
      </div>
      {/* Nearby places */}
      <div className="content-card" style={{ marginTop: 20 }}>
        <h2>Nearby places</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          <Detail
            label="Nearby school"
            value={p.nearbySchool || "Not provided"}
          />
          <Detail
            label="Nearby hospital"
            value={p.nearbyHospital || "Not provided"}
          />
          <Detail
            label="Nearby market"
            value={p.nearbyMarket || "Not provided"}
          />
        </div>
      </div>
      {/* Map */}
      <div className="content-card" style={{ marginTop: 20 }}>
        <h2>
          <MapPin size={20} style={{ verticalAlign: "middle" }} /> Property
          location
        </h2>

        <p>{location || "Exact location has not been provided."}</p>

        {/* {mapUrl && (
          <a
            className="btn btn-dark"
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
            }}
          >
            Open in Maps <ExternalLink size={15} />
          </a>
        )} */}
      </div>
      {/* Floor plan */}
      {p.floorPlanUrl && (
        <div className="content-card" style={{ marginTop: 20 }}>
          <h2>Floor plan</h2>
          <a
            className="btn btn-dark"
            href={
              p.floorPlanUrl.startsWith("http")
                ? p.floorPlanUrl
                : `${serverUrl}${p.floorPlanUrl}`
            }
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            View floor plan <ExternalLink size={15} />
          </a>
        </div>
      )}
    </div>
  );
}
