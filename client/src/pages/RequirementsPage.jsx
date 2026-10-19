import React from "react";
import Field from "../components/Field";
import { MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { money, serverUrl } from "../api";

export default function RequirementsPage({ app }) {
  const { properties, requirement, setRequirement, submitRequirement } = app;

  // Filter available properties according to user preferences
  const matchingProperties = (properties || []).filter((p) => {
    if (p.available === false) return false;

    if (p.status && String(p.status).toLowerCase() !== "available") {
      return false;
    }

    const budget = Number(requirement.maxBudget || 0);
    const price = Number(p.rent ?? p.price ?? 0);

    if (budget > 0 && price > budget) return false;

    const wantedBhk = String(requirement.bhkRequired || "Any").toLowerCase();

    const actualBhk = String(p.bhk || "").toLowerCase();

    if (wantedBhk !== "any") {
      if (wantedBhk === "studio") {
        if (!actualBhk.includes("studio")) return false;
      } else if (wantedBhk === "4+ bhk") {
        if (parseInt(actualBhk, 10) < 4) return false;
      } else {
        const number = wantedBhk.match(/\d+/)?.[0];

        if (number && !actualBhk.includes(number)) {
          return false;
        }
      }
    }

    const wantedFurnishing = String(
      requirement.furnished || "No preference",
    ).toLowerCase();

    const actualFurnishing = String(p.furnished || "").toLowerCase();

    if (
      wantedFurnishing !== "no preference" &&
      actualFurnishing !== wantedFurnishing
    ) {
      return false;
    }

    const area = String(requirement.preferredArea || "")
      .trim()
      .toLowerCase();

    const propertyLocation = [p.area, p.sector, p.location, p.title]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (area && !propertyLocation.includes(area)) {
      return false;
    }

    const household = String(requirement.householdType || "").toLowerCase();

    const category = String(
      p.rentalCategory || p.propertyType || "",
    ).toLowerCase();

    if (
      ["family", "student"].includes(household) &&
      category &&
      !category.includes(household)
    ) {
      return false;
    }

    return true;
  });

  const getPhotoUrl = (photo) => {
    if (!photo) return "";

    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }

    return `${serverUrl}${photo.startsWith("/") ? "" : "/"}${photo}`;
  };

  return (
    <div className="requirements-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR HOME PROFILE</span>
          <h1>Tell us what you need.</h1>
          <p>
            These details help the broker find a suitable home. Fields marked
            optional can be left blank.
          </p>
        </div>
      </div>

      <div
        className="requirements-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
          gap: "24px",
          alignItems: "start",
          width: "100%",
        }}
      >
        {/* LEFT SIDE: REQUIREMENTS FORM */}
        <section className="requirements-form-column">
          <div className="privacy-note">
            <ShieldCheck />
            <div>
              <b>Your details are private</b>
              <p>
                Your information is stored for the broker to review and is not
                displayed to other clients. Sensitive questions are optional.
                Only share information you are comfortable providing.
              </p>
            </div>
          </div>

          <form className="content-card form-card" onSubmit={submitRequirement}>
            <div className="form-section">
              <h2>Personal details</h2>

              <div className="form-grid three">
                <Field
                  label="Full name"
                  name="fullName"
                  value={requirement.fullName}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      fullName: e.target.value,
                    })
                  }
                  required
                />

                <Field
                  label="Your native place"
                  name="nativePlace"
                  value={requirement.nativePlace}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      nativePlace: e.target.value,
                    })
                  }
                />

                <Field
                  label="Currently staying"
                  name="currentlyStaying"
                  value={requirement.currentlyStaying}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      currentlyStaying: e.target.value,
                    })
                  }
                />

                <Field
                  label="Nationality"
                  name="nationality"
                  value={requirement.nationality}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      nationality: e.target.value,
                    })
                  }
                />

                <Field
                  label="Date of visiting flat"
                  name="dateOfVisiting"
                  type="date"
                  value={requirement.dateOfVisiting}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      dateOfVisiting: e.target.value,
                    })
                  }
                />

                <Field
                  label="Contact number"
                  name="contact"
                  value={requirement.contact}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      contact: e.target.value,
                    })
                  }
                  required
                />

                <Field
                  label="Age group"
                  name="ageGroup"
                  value={requirement.ageGroup}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      ageGroup: e.target.value,
                    })
                  }
                  options={["18–24", "25–34", "35–44", "45–54", "55+"]}
                />

                <Field
                  label="LinkedIn profile URL"
                  name="linkedinProfile"
                  value={requirement.linkedinProfile}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      linkedinProfile: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Home preferences</h2>

              <div className="form-grid three">
                <Field
                  label="Maximum budget / month (₹)"
                  name="maxBudget"
                  value={requirement.maxBudget}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      maxBudget: e.target.value,
                    })
                  }
                  required
                />

                <Field
                  label="BHK required"
                  name="bhkRequired"
                  value={requirement.bhkRequired}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      bhkRequired: e.target.value,
                    })
                  }
                  options={[
                    "1 BHK",
                    "2 BHK",
                    "3 BHK",
                    "4+ BHK",
                    "Studio",
                    "Any",
                  ]}
                />

                <Field
                  label="Furnishing needed"
                  name="furnished"
                  value={requirement.furnished}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      furnished: e.target.value,
                    })
                  }
                  options={[
                    "Furnished",
                    "Semi-furnished",
                    "Unfurnished",
                    "No preference",
                  ]}
                />

                <Field
                  label="Floor preference"
                  name="floorPreference"
                  value={requirement.floorPreference}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      floorPreference: e.target.value,
                    })
                  }
                  placeholder="e.g. Ground to 5th"
                />

                <Field
                  label="Preferred area"
                  name="preferredArea"
                  value={requirement.preferredArea}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      preferredArea: e.target.value,
                    })
                  }
                />

                <Field
                  label="Shifting date"
                  name="shiftingDate"
                  type="date"
                  value={requirement.shiftingDate}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      shiftingDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Work & household</h2>

              <div className="form-grid three">
                <Field
                  label="Profession"
                  name="profession"
                  value={requirement.profession}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      profession: e.target.value,
                    })
                  }
                />

                <Field
                  label="Company / college"
                  name="companyCollege"
                  value={requirement.companyCollege}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      companyCollege: e.target.value,
                    })
                  }
                />

                <Field
                  label="Work location"
                  name="workLocation"
                  value={requirement.workLocation}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      workLocation: e.target.value,
                    })
                  }
                />

                <Field
                  label="Who will rent / stay in the flat?"
                  name="householdType"
                  value={requirement.householdType}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      householdType: e.target.value,
                    })
                  }
                  options={[
                    "Family",
                    "Student",
                    "Working professional",
                    "Bachelor's",
                    "Couple",
                    "Other",
                    "Prefer not to say",
                  ]}
                  required
                />

                <Field
                  label="Number of people staying"
                  name="peopleCount"
                  value={requirement.peopleCount}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      peopleCount: e.target.value,
                    })
                  }
                  type="number"
                />

                <Field
                  label="Own a car / bike?"
                  name="vehicle"
                  value={requirement.vehicle}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      vehicle: e.target.value,
                    })
                  }
                  options={["Car", "Bike", "Both", "No", "Prefer not to say"]}
                />

                <Field
                  label="Any pets?"
                  name="pets"
                  value={requirement.pets}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      pets: e.target.value,
                    })
                  }
                  options={["Yes", "No", "Prefer not to say"]}
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Optional additional questions</h2>

              <p className="muted">
                These are optional. Please skip anything you do not want to
                disclose.
              </p>

              <div className="form-grid three">
                <Field
                  label="Any legal case? (optional)"
                  name="legalCase"
                  value={requirement.legalCase}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      legalCase: e.target.value,
                    })
                  }
                  options={["Yes", "No", "Prefer not to say"]}
                />

                <Field
                  label="Smoking / drinking (optional)"
                  name="smokingDrinking"
                  value={requirement.smokingDrinking}
                  onChange={(e) =>
                    setRequirement({
                      ...requirement,
                      smokingDrinking: e.target.value,
                    })
                  }
                  options={[
                    "Neither",
                    "Smoking",
                    "Drinking",
                    "Both",
                    "Prefer not to say",
                  ]}
                />
              </div>
            </div>

            <label className="consent">
              <input
                type="checkbox"
                checked={requirement.consent}
                onChange={(e) =>
                  setRequirement({
                    ...requirement,
                    consent: e.target.checked,
                  })
                }
                required
              />

              <span>
                I agree to share these details with the broker for rental
                matching and understand that the information will be stored
                securely for this purpose.
              </span>
            </label>

            <button type="submit" className="btn btn-dark">
              Submit my requirements
              <ArrowRight size={17} />
            </button>
          </form>
        </section>

        {/* RIGHT SIDE: MATCHING PROPERTIES */}
        <aside className="requirements-properties">
          <div className="content-card">
            <span className="eyebrow">PROPERTY MATCHES</span>
            <h2>Homes for you</h2>

            <p className="muted">
              Properties matching your budget and preferences.
            </p>

            <div className="requirements-property-list">
              {matchingProperties.length === 0 ? (
                <div className="requirements-empty">
                  <MapPin size={28} />
                  <h3>No matching properties yet</h3>
                  <p className="muted">
                    Try changing your budget, BHK, furnishing or preferred area
                    to see more properties.
                  </p>
                </div>
              ) : (
                matchingProperties.map((p) => {
                  const photo = Array.isArray(p.photos)
                    ? p.photos[0]
                    : p.photos;

                  return (
                    <article
                      key={p._id || p.id || p.title}
                      className="requirements-property-card"
                    >
                      {photo && (
                        <img
                          className="requirements-property-image"
                          src={getPhotoUrl(photo)}
                          alt={p.title || "Rental property"}
                        />
                      )}

                      <div className="requirements-property-details">
                        <h3>{p.title || `${p.bhk || "Rental"} Property`}</h3>

                        <p className="requirements-location">
                          <MapPin size={15} />
                          <span>
                            {[p.area, p.sector, p.location]
                              .filter(Boolean)
                              .join(", ") || "Location available on request"}
                          </span>
                        </p>

                        <div className="requirements-property-price">
                          {money(p.rent ?? p.price ?? 0)}
                          <span>/ month</span>
                        </div>

                        <div className="requirements-property-tags">
                          {p.bhk && <span>{p.bhk}</span>}
                          {p.furnished && <span>{p.furnished}</span>}
                          {p.kind && <span>{p.kind}</span>}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
