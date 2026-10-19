import React, { useMemo, useState } from "react";
import {
  Home,
  KeyRound,
  Users,
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Wallet,
  Search,
  SlidersHorizontal,
  BedDouble,
  Heart,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import { money, serverUrl } from "../api";

export default function HomePage({ app }) {
  const {
    user,
    properties = [],
    go,
    propertyFilters,
    setPropertyFilters,
  } = app;

  const filters = propertyFilters || {
    purpose: "Rent",
    location: "",
    budget: "Any budget",
    bhk: "Any BHK",
    furnished: "Any",
  };

  const updateFilter = (key, value) => {
    setPropertyFilters?.((prev) => ({ ...prev, [key]: value }));
  };

  const [favorites, setFavorites] = useState([]);

  const availableProperties = useMemo(
    () => properties.filter((p) => p.available !== false),
    [properties],
  );

  const filteredProperties = useMemo(() => {
    return availableProperties.filter((p) => {
      const searchText = `${p.location || ""} ${p.area || ""} ${
        p.sector || ""
      } ${p.title || ""}`.toLowerCase();

      const matchesLocation =
        !filters.location.trim() ||
        searchText.includes(filters.location.trim().toLowerCase());

      const matchesBudget =
        filters.budget === "Any budget" ||
        Number(p.rent) <= Number(filters.budget);

      const matchesBhk =
        filters.bhk === "Any BHK" ||
        String(p.bhk || "")
          .toLowerCase()
          .includes(filters.bhk.replace(" BHK", "").toLowerCase());

      const matchesFurnished =
        filters.furnished === "Any" ||
        String(p.furnished || "").toLowerCase() ===
          filters.furnished.toLowerCase();

      const matchesPurpose =
        String(p.purpose || "Rent").toLowerCase() ===
        filters.purpose.toLowerCase();

      return (
        matchesLocation &&
        matchesBudget &&
        matchesBhk &&
        matchesFurnished &&
        matchesPurpose
      );
    });
  }, [availableProperties, filters]);

  const imageUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }
    return `${serverUrl}${photo.startsWith("/") ? "" : "/"}${photo}`;
  };

  const formatPrice = (value) =>
    typeof money === "function"
      ? money(value)
      : `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const selectStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fff",
    color: "#252525",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const sectionStyle = {
    maxWidth: "1200px",
    margin: "65px auto",
    padding: "0 20px",
  };

  const eyebrowStyle = {
    color: "#8b7554",
    letterSpacing: "1.5px",
    fontSize: "12px",
    fontWeight: 700,
  };

  const linkStyle = {
    display: "block",
    background: "none",
    border: 0,
    padding: "8px 0",
    color: "#c5cbcf",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> YOUR NEXT CHAPTER STARTS HERE
          </div>

          <h1>
            A place to call
            <br />
            <em>your own.</em>
          </h1>

          <p>
            Thoughtfully selected homes, transparent guidance, and a smoother
            way to find your next address.
          </p>

          <div className="hero-actions">
            <button className="btn btn-dark" onClick={() => go("properties")}>
              Explore homes <ArrowRight size={17} />
            </button>
            <button className="btn btn-light" onClick={() => go("contact")}>
              Talk to a broker
            </button>
          </div>

          <div className="trust-line">
            <ShieldCheck size={17} />
            Personal guidance from search to move-in
          </div>
        </div>

        <div className="hero-art">
          <div className="art-circle" />
          <div className="art-card">
            <div className="art-window" />
            <div className="art-sofa" />
            <div className="art-plant">✳</div>
            <div className="art-caption">
              <span>SPACE TO GROW</span>
              <b>Your new beginning.</b>
            </div>
          </div>
          <div className="floating-note">
            <span>⌂</span>
            <div>
              <b>Find your fit</b>
              <small>Homes picked for you</small>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="intro-row">
        <div>
          <span className="eyebrow">A BETTER WAY HOME</span>
          <h2>
            Less searching.
            <br />
            More settling in.
          </h2>
        </div>
        <p>
          Explore available homes, share what you need, and let us help match
          you with a place that feels right.
        </p>
      </section>

      {/* PROPERTY SEARCH */}
      <section style={sectionStyle}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e9e7e2",
            borderRadius: "20px",
            padding: "clamp(18px, 4vw, 32px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
          }}
        >
          <span style={eyebrowStyle}>FIND YOUR PERFECT PLACE</span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{ margin: "8px 0", fontSize: "clamp(23px, 3vw, 32px)" }}
              >
                Search homes that fit your life
              </h2>
              <p style={{ color: "#777", margin: 0 }}>
                Choose your preferences to explore available homes.
              </p>
            </div>
            <SlidersHorizontal size={26} color="#8b7554" />
          </div>

          <div style={{ display: "flex", gap: "10px", margin: "25px 0 18px" }}>
            {["Rent", "Buy"].map((item) => (
              <button
                key={item}
                onClick={() => updateFilter("purpose", item)}
                style={{
                  padding: "11px 25px",
                  borderRadius: "30px",
                  border: "1px solid",
                  borderColor: filters.purpose === item ? "#252525" : "#e5e7eb",
                  background: filters.purpose === item ? "#252525" : "#fff",
                  color: filters.purpose === item ? "#fff" : "#333",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {item === "Rent" ? <KeyRound size={15} /> : <Home size={15} />}{" "}
                {item}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
              gap: "14px",
              alignItems: "end",
            }}
          >
            <label style={{ color: "#555", fontSize: "13px" }}>
              <span
                style={{ display: "flex", gap: "6px", marginBottom: "8px" }}
              >
                <MapPin size={15} /> Location
              </span>
              <input
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                placeholder="City, area or sector"
                style={selectStyle}
              />
            </label>

            <label style={{ color: "#555", fontSize: "13px" }}>
              <span
                style={{ display: "flex", gap: "6px", marginBottom: "8px" }}
              >
                <Wallet size={15} /> Maximum budget
              </span>
              <select
                value={filters.budget}
                onChange={(e) => updateFilter("budget", e.target.value)}
                style={selectStyle}
              >
                <option>Any budget</option>
                <option value="5000">₹5,000</option>
                <option value="10000">₹10,000</option>
                <option value="15000">₹15,000</option>
                <option value="25000">₹25,000</option>
                <option value="50000">₹50,000</option>
                <option value="100000">₹1,00,000</option>
              </select>
            </label>

            <label style={{ color: "#555", fontSize: "13px" }}>
              <span
                style={{ display: "flex", gap: "6px", marginBottom: "8px" }}
              >
                <BedDouble size={15} /> Bedrooms
              </span>
              <select
                value={filters.bhk}
                onChange={(e) => updateFilter("bhk", e.target.value)}
                style={selectStyle}
              >
                <option>Any BHK</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>4 BHK</option>
              </select>
            </label>

            <label style={{ color: "#555", fontSize: "13px" }}>
              <span
                style={{ display: "flex", gap: "6px", marginBottom: "8px" }}
              >
                <Home size={15} /> Furnishing
              </span>
              <select
                value={filters.furnished}
                onChange={(e) => updateFilter("furnished", e.target.value)}
                style={selectStyle}
              >
                <option>Any</option>
                <option>Furnished</option>
                <option>Semi-furnished</option>
                <option>Unfurnished</option>
              </select>
            </label>

            <button
              className="btn btn-dark"
              onClick={() => go("properties")}
              style={{
                minHeight: "45px",
                justifyContent: "center",
                borderRadius: "10px",
              }}
            >
              <Search size={17} /> Search homes
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "25px",
          }}
        >
          <div>
            <span style={eyebrowStyle}>HANDPICKED FOR YOU</span>
            <h2 style={{ fontSize: "clamp(25px, 3vw, 34px)", margin: "8px 0" }}>
              Featured properties
            </h2>
            <p style={{ color: "#777", margin: 0 }}>
              Discover available homes for your next move.
            </p>
          </div>
          <button className="btn btn-light" onClick={() => go("properties")}>
            View all properties <ChevronRight size={17} />
          </button>
        </div>

        {filteredProperties.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
              gap: "22px",
            }}
          >
            {filteredProperties.map((property) => {
              const photo = property.photos?.[0];
              const saved = favorites.includes(property._id);

              return (
                <article
                  key={property._id}
                  style={{
                    background: "#fff",
                    border: "1px solid #eceae6",
                    borderRadius: "17px",
                    overflow: "hidden",
                    boxShadow: "0 5px 22px rgba(0,0,0,0.035)",
                  }}
                >
                  <div
                    style={{
                      height: "205px",
                      background: "#f1eee8",
                      position: "relative",
                    }}
                  >
                    {photo ? (
                      <img
                        src={imageUrl(photo)}
                        alt={property.title || "Property"}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#8b7554",
                          gap: "8px",
                        }}
                      >
                        <Building2 size={42} />
                        <span>No property image</span>
                      </div>
                    )}

                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        padding: "6px 10px",
                        background: "#fff",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {property.kind || "Property"}
                    </span>

                    <button
                      aria-label={saved ? "Remove favourite" : "Add favourite"}
                      onClick={() => toggleFavorite(property._id)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "36px",
                        height: "36px",
                        border: 0,
                        borderRadius: "50%",
                        background: "#fff",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Heart
                        size={18}
                        fill={saved ? "#d94848" : "none"}
                        color={saved ? "#d94848" : "#333"}
                      />
                    </button>
                  </div>

                  <div style={{ padding: "18px" }}>
                    <div style={{ fontSize: "23px", fontWeight: 700 }}>
                      {formatPrice(property.rent)}
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#777",
                          fontWeight: 400,
                        }}
                      >
                        {filters.purpose === "Rent" ? " / month" : ""}
                      </span>
                    </div>

                    <h3 style={{ margin: "10px 0", fontSize: "17px" }}>
                      {property.title || `${property.bhk || ""} Home`}
                    </h3>

                    <p
                      style={{
                        color: "#777",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        margin: "0 0 15px",
                      }}
                    >
                      <MapPin size={15} />
                      {[property.area, property.sector, property.location]
                        .filter(Boolean)
                        .join(", ") || "Location not specified"}
                    </p>

                    <div
                      style={{
                        borderTop: "1px solid #eee",
                        paddingTop: "13px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                        color: "#555",
                        fontSize: "13px",
                      }}
                    >
                      <span>
                        <BedDouble
                          size={15}
                          style={{ verticalAlign: "middle" }}
                        />{" "}
                        {property.bhk || "—"} BHK
                      </span>
                      <span>{property.furnished || "Furnishing N/A"}</span>
                    </div>

                    <button
                      className="btn btn-dark"
                      onClick={() => go("properties")}
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        marginTop: "17px",
                        borderRadius: "9px",
                      }}
                    >
                      View property <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "35px 20px",
              textAlign: "center",
              border: "1px dashed #ddd",
              borderRadius: "16px",
              color: "#777",
            }}
          >
            <Building2 size={35} />
            <h3 style={{ color: "#333" }}>No matching properties found</h3>
            <p>Try changing your location or budget filters.</p>
            <button
              className="btn btn-light"
              onClick={() =>
                setPropertyFilters?.({
                  purpose: "Rent",
                  location: "",
                  budget: "Any budget",
                  bhk: "Any BHK",
                  furnished: "Any",
                })
              }
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* WHY HOUSE BROKER */}
      <section
        style={{
          background: "#f7f5f0",
          padding: "50px 20px",
          marginTop: "55px",
        }}
      >
        <div
          style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}
        >
          <span style={eyebrowStyle}>WHY HOUSE BROKER</span>
          <h2 style={{ fontSize: "clamp(25px, 3vw, 34px)", margin: "10px 0" }}>
            Your home search, made simpler.
          </h2>
          <p
            style={{ color: "#777", maxWidth: "600px", margin: "0 auto 30px" }}
          >
            Find a home, tell us what you need, and get personal help along the
            way.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "25px",
              textAlign: "left",
            }}
          >
            {[
              {
                icon: <Search size={27} />,
                title: "Easy property search",
                text: "Browse available homes and narrow your choices by location and budget.",
              },
              {
                icon: <ShieldCheck size={27} />,
                title: "Personal guidance",
                text: "Get help with your property requirements and the next steps.",
              },
              {
                icon: <Users size={27} />,
                title: "Human support",
                text: "Talk to a broker when you need assistance finding a suitable home.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#fff",
                  padding: "24px",
                  borderRadius: "15px",
                }}
              >
                <div style={{ color: "#8b7554" }}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p style={{ color: "#777", lineHeight: 1.7 }}>{item.text}</p>
                {item.title === "Human support" && (
                  <button
                    className="btn btn-light"
                    onClick={() => go("contact")}
                  >
                    Contact us <ArrowRight size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR LOCATIONS */}
      <section style={sectionStyle}>
        <span style={eyebrowStyle}>EXPLORE YOUR CITY</span>
        <h2 style={{ fontSize: "32px", margin: "10px 0" }}>
          Explore popular locations
        </h2>
        <p style={{ color: "#777", marginBottom: "28px" }}>
          Find a home in a location that works for your lifestyle.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              name: "Lucknow",
              subtitle: "Explore homes in Lucknow",
              icon: "🏙️",
            },
            {
              name: "Gomti Nagar",
              subtitle: "Homes in Gomti Nagar",
              icon: "🏡",
            },
            {
              name: "Indira Nagar",
              subtitle: "Explore Indira Nagar",
              icon: "🌳",
            },
            { name: "Aliganj", subtitle: "Homes in Aliganj", icon: "🏢" },
          ].map((place) => (
            <button
              key={place.name}
              onClick={() => {
                updateFilter("location", place.name);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                textAlign: "left",
                padding: "25px",
                border: "1px solid #e9e7e2",
                background: "#fff",
                borderRadius: "16px",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "32px" }}>{place.icon}</div>
              <h3 style={{ margin: "12px 0 5px" }}>{place.name}</h3>
              <p style={{ color: "#777", margin: 0 }}>{place.subtitle}</p>
              <div style={{ marginTop: "16px", color: "#8b7554" }}>
                Explore homes{" "}
                <ArrowRight size={15} style={{ verticalAlign: "middle" }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#f7f5f0", padding: "60px 20px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "35px" }}>
            <span style={eyebrowStyle}>SIMPLE AND CONVENIENT</span>
            <h2 style={{ fontSize: "32px", margin: "10px 0" }}>
              Your next home in 3 steps
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "22px",
            }}
          >
            {[
              {
                icon: <Search size={28} />,
                title: "1. Search homes",
                text: "Explore available properties and shortlist homes that suit your needs.",
              },
              {
                icon: <Users size={28} />,
                title: "2. Share requirements",
                text: "Tell us your preferred location, budget and property requirements.",
              },
              {
                icon: <Phone size={28} />,
                title: "3. Connect with us",
                text: "Contact our broker for assistance with your property search.",
              },
            ].map((step) => (
              <div
                key={step.title}
                style={{
                  background: "#fff",
                  padding: "26px",
                  borderRadius: "16px",
                }}
              >
                <div style={{ color: "#8b7554" }}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p style={{ color: "#777", lineHeight: 1.7 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={sectionStyle}>
        <div
          style={{
            background: "#182126",
            color: "#fff",
            borderRadius: "22px",
            padding: "clamp(28px, 5vw, 55px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "620px" }}>
            <span
              style={{
                color: "#d5c3a3",
                letterSpacing: "2px",
                fontSize: "12px",
              }}
            >
              LET'S FIND YOUR NEXT ADDRESS
            </span>
            <h2
              style={{ fontSize: "clamp(27px, 4vw, 38px)", margin: "12px 0" }}
            >
              Haven't found the right home yet?
            </h2>
            <p style={{ color: "#d0d5d8", lineHeight: 1.7 }}>
              Share your requirements with us and get help exploring suitable
              properties.
            </p>
          </div>
          <button
            className="btn btn-light"
            onClick={() => go(user ? "properties" : "contact")}
          >
            Get started <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section
        style={{ ...sectionStyle, marginBottom: "0", paddingBottom: "55px" }}
      >
        <span style={eyebrowStyle}>DISCOVER MORE</span>
        <h2 style={{ fontSize: "30px", margin: "10px 0 25px" }}>
          Curated Quick Links
        </h2>

        <div
          style={{
            display: "flex",
            gap: "28px",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: "30px",
          }}
        >
          {["Buy", "Rent / Lease"].map((tab) => {
            const selected =
              (tab === "Buy" && filters.purpose === "Buy") ||
              (tab === "Rent / Lease" && filters.purpose === "Rent");
            return (
              <button
                key={tab}
                onClick={() =>
                  updateFilter("purpose", tab === "Buy" ? "Buy" : "Rent")
                }
                style={{
                  padding: "12px 5px",
                  background: "transparent",
                  border: 0,
                  borderBottom: `2px solid ${selected ? "#0878df" : "transparent"}`,
                  color: "#18324b",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              city: "Lucknow",
              links: [
                "Flats",
                "Apartments",
                "Residential properties",
                "Homes for families",
                "Affordable homes",
              ],
            },
            {
              city: "Gomti Nagar",
              links: [
                "Flats",
                "Family homes",
                "Ready-to-move homes",
                "Furnished homes",
                "Residential apartments",
              ],
            },
            {
              city: "Indira Nagar",
              links: [
                "Flats",
                "Apartments for families",
                "Budget-friendly homes",
                "Furnished apartments",
                "Available homes",
              ],
            },
          ].map((group) => (
            <div key={group.city}>
              <h3 style={{ fontSize: "17px", marginBottom: "18px" }}>
                Properties in {group.city}
              </h3>
              {group.links.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    updateFilter("location", group.city);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    display: "block",
                    background: "none",
                    border: 0,
                    padding: "7px 0",
                    color: "#526579",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                  }}
                >
                  {filters.purpose === "Buy"
                    ? `${link} for sale`
                    : `${link} for rent`}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FULL-WIDTH FOOTER */}
      <footer
        style={{
          background: "#151d22",
          color: "#fff",
          padding: "55px 22px 20px",
          width: "100%",
          boxSizing: "border-box",
          margin: "0",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "35px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "26px", margin: "0 0 16px" }}>
              House Broker<span style={{ color: "#d5c3a3" }}>.</span>
            </h2>
            <p style={{ color: "#b9c0c4", lineHeight: 1.8 }}>
              Find a place to call your own. Explore homes and get personal
              guidance throughout your property journey.
            </p>
            <button className="btn btn-light" onClick={() => go("properties")}>
              Explore properties <ArrowRight size={15} />
            </button>
          </div>

          <div>
            <h3 style={{ marginTop: 0 }}>Company</h3>
            {["About Us", "Contact Us", "Our Services"].map((item) => (
              <button
                key={item}
                onClick={() => go("contact")}
                style={linkStyle}
              >
                {item}
              </button>
            ))}
          </div>

          <div>
            <h3 style={{ marginTop: 0 }}>Explore Homes</h3>
            {[
              "Available Properties",
              "Homes for Rent",
              "Homes for Sale",
              "Find a Property",
            ].map((item) => (
              <button
                key={item}
                onClick={() => go("properties")}
                style={linkStyle}
              >
                {item}
              </button>
            ))}
          </div>

          <div>
            <h3 style={{ marginTop: 0 }}>Contact Us</h3>
            <p style={{ color: "#b9c0c4", lineHeight: 1.8 }}>
              Have questions about a property? Connect with us for assistance.
            </p>
            <button
              onClick={() => go("contact")}
              style={{
                ...linkStyle,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Phone size={17} color="#d5c3a3" /> Talk to a broker
            </button>
            <button
              onClick={() => go("contact")}
              style={{
                ...linkStyle,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Mail size={17} color="#d5c3a3" /> Send an enquiry
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "12px",
                color: "#d5c3a3",
                fontSize: "13px",
              }}
            >
              <ShieldCheck size={17} /> Personal property assistance
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "40px auto 0",
            paddingTop: "20px",
            borderTop: "1px solid #354047",
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            alignItems: "center",
            flexWrap: "wrap",
            color: "#b9c0c4",
            fontSize: "13px",
          }}
        >
          <span>
            © {new Date().getFullYear()} House Broker. All rights reserved.
          </span>
          <span>Find your place. Start your next chapter.</span>
          <button
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "1px solid #52616a",
              background: "#d8efff",
              color: "#075eaa",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </footer>
    </>
  );
}
