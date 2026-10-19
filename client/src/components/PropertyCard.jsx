import React from "react";
import { Heart, GitCompareArrows } from "lucide-react";

export default function PropertyCard({
  property,
  onViewDetails,
  isSaved = false,
  onToggleWishlist,
  isCompared = false,
  onToggleCompare,
}) {
  const title =
    property.title ||
    property.name ||
    `${property.bhk || property.bedrooms || ""} BHK Property`;

  const image =
    property.image || property.images?.[0] || property.photos?.[0] || "";

  const price = property.price ?? property.rent ?? property.amount;

  const location =
    property.location ||
    property.city ||
    property.address ||
    "Location not specified";

  const propertyId = property._id || property.id;

  const isAvailable =
    property.available !== false && property.status !== "unavailable";

  return (
    <article className="property-card">
      <div className="property-card-image">
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className="property-image-placeholder">Property Image</div>
        )}

        <span className="property-status">
          {isAvailable ? "Available" : "Unavailable"}
        </span>

        <div className="property-card-actions">
          <button
            type="button"
            className={`property-icon-btn ${isSaved ? "selected" : ""}`}
            aria-label={isSaved ? "Remove from wishlist" : "Save property"}
            aria-pressed={isSaved}
            title={isSaved ? "Remove from wishlist" : "Save property"}
            onClick={() => onToggleWishlist?.(property)}
          >
            <Heart size={19} fill={isSaved ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            className={`property-icon-btn ${isCompared ? "selected" : ""}`}
            aria-label={
              isCompared ? "Remove from comparison" : "Compare property"
            }
            aria-pressed={isCompared}
            title={isCompared ? "Remove from comparison" : "Compare property"}
            onClick={() => onToggleCompare?.(property)}
          >
            <GitCompareArrows size={19} />
          </button>
        </div>
      </div>

      <div className="property-card-content">
        <h3>{title}</h3>

        <p className="property-location">{location}</p>

        <p className="property-price">
          {price != null
            ? `₹${Number(price).toLocaleString("en-IN")}`
            : "Price on request"}
          {String(
            property.purpose || property.listingType || "",
          ).toLowerCase() === "rent"
            ? " / month"
            : ""}
        </p>

        <div className="property-features">
          {(property.bhk || property.bedrooms) && (
            <span>{property.bhk || property.bedrooms} BHK</span>
          )}

          {(property.areaSqFt || property.area) && (
            <span>{property.areaSqFt || property.area} sq.ft.</span>
          )}

          {property.furnished && <span>{property.furnished}</span>}
        </div>

        <button
          type="button"
          className="btn btn-dark"
          onClick={() => onViewDetails?.(property)}
        >
          View Details
        </button>
      </div>
    </article>
  );
}
