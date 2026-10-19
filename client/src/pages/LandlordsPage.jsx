import React, { useState } from "react";
import Field from "../components/Field";
import { Plus, ArrowLeft, Building2, UserRound } from "lucide-react";
import { api, money, serverUrl } from "../api";

export default function LandlordsPage({ app }) {
  const {
    landlords = [],
    landlordForm,
    setLandlordForm,
    editLandlordId,
    setEditLandlordId,
    addLandlord,
    loadAdmin,
  } = app;

  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [landlordDetails, setLandlordDetails] = useState(null);
  const [landlordLoading, setLandlordLoading] = useState(false);
  const [landlordError, setLandlordError] = useState("");

  async function openLandlord(landlord) {
    setSelectedLandlord(landlord);
    setLandlordDetails(null);
    setLandlordError("");
    setLandlordLoading(true);

    try {
      const data = await api(`/admin/landlords/${landlord._id}`);
      setLandlordDetails(data);
    } catch (error) {
      setLandlordError(error.message || "Could not load landlord details.");
    } finally {
      setLandlordLoading(false);
    }
  }

  function closeDetails() {
    setSelectedLandlord(null);
    setLandlordDetails(null);
    setLandlordError("");
  }

  function cancelEdit() {
    setEditLandlordId(null);
    setLandlordForm({
      fullName: "",
      phone: "",
      email: "",
      alternatePhone: "",
      address: "",
      verificationStatus: "",
      notes: "",
    });
  }

  if (selectedLandlord) {
    const landlord = landlordDetails?.landlord;
    const properties = landlordDetails?.properties || [];

    return (
      <section>
        <button type="button" className="btn mb-5" onClick={closeDetails}>
          <ArrowLeft size={17} /> Back to landlords
        </button>

        <div className="page-heading">
          <div>
            <span className="eyebrow">LANDLORD PROFILE</span>
            <h1>{selectedLandlord.fullName}</h1>
            <p>Complete owner details and linked properties.</p>
          </div>
        </div>

        {landlordLoading && (
          <div className="content-card">Loading landlord details...</div>
        )}

        {landlordError && (
          <div className="content-card" role="alert">
            <p className="text-red-600">{landlordError}</p>
            <button
              type="button"
              className="btn mt-3"
              onClick={() => openLandlord(selectedLandlord)}
            >
              Retry
            </button>
          </div>
        )}

        {landlord && (
          <>
            <div className="content-card mb-6">
              <div className="mb-4 flex items-center gap-3">
                <UserRound size={28} />
                <h2 className="text-xl font-semibold">Landlord details</h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label="Full name" value={landlord.fullName} />
                <Detail label="Phone" value={landlord.phone} />
                <Detail label="Email" value={landlord.email} />
                <Detail
                  label="Alternate phone"
                  value={landlord.alternatePhone}
                />
                <Detail label="Address" value={landlord.address} />
                <Detail
                  label="Verification status"
                  value={landlord.verificationStatus}
                />
                <Detail label="Private notes" value={landlord.notes} />
                <Detail
                  label="Created on"
                  value={
                    landlord.createdAt
                      ? new Date(landlord.createdAt).toLocaleDateString()
                      : ""
                  }
                />
              </div>
            </div>

            <div className="page-heading">
              <div>
                <span className="eyebrow">PROPERTY PORTFOLIO</span>
                <h2>All properties ({properties.length})</h2>
                <p>Properties linked to this landlord.</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label="Total properties" value={properties.length} />
              <Stat
                label="Available"
                value={
                  properties.filter((p) => p.status === "Available").length
                }
              />
              <Stat
                label="Occupied"
                value={properties.filter((p) => p.status === "Rented").length}
              />
              <Stat
                label="Reserved"
                value={properties.filter((p) => p.status === "Reserved").length}
              />
            </div>

            {properties.length === 0 ? (
              <div className="content-card">
                <Building2 size={32} className="mb-3" />
                <h3 className="text-lg font-semibold">No properties linked</h3>
                <p className="mt-2">
                  No properties are currently linked to this landlord. Check the
                  landlord field in each property record.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((p) => (
                  <article className="content-card" key={p._id}>
                    {p.photos?.[0] ? (
                      <img
                        src={serverUrl(p.photos[0])}
                        alt={p.title || "Property"}
                        className="mb-4 h-48 w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gray-100">
                        <Building2 size={42} />
                      </div>
                    )}

                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{p.title}</h3>
                        <p className="text-sm">ID: {p.propertyId || p._id}</p>
                      </div>
                      <span className="rounded-full border px-3 py-1 text-xs">
                        {p.status || "—"}
                      </span>
                    </div>

                    <p className="mb-3 text-xl font-bold">
                      {money(p.rent)}
                      <span className="text-sm font-normal"> / month</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <Detail label="Property type" value={p.kind} />
                      <Detail label="Category" value={p.rentalCategory} />
                      <Detail label="Purpose" value={p.purpose} />
                      <Detail label="BHK" value={p.bhk} />
                      <Detail label="Furnished" value={p.furnished} />
                      <Detail label="Area" value={p.area} />
                      <Detail label="Sector" value={p.sector} />
                      <Detail label="Location" value={p.location} />
                      <Detail label="Flat number" value={p.flatNumber} />
                      <Detail
                        label="Private address"
                        value={p.addressPrivate}
                      />
                      <Detail
                        label="Floor"
                        value={
                          p.floorNumber != null
                            ? `${p.floorNumber}${
                                p.totalFloors != null
                                  ? ` / ${p.totalFloors}`
                                  : ""
                              }`
                            : ""
                        }
                      />
                      <Detail
                        label="Area size"
                        value={
                          p.areaSqFt != null ? `${p.areaSqFt} sq. ft.` : ""
                        }
                      />
                      <Detail label="Bathrooms" value={p.bathrooms} />
                      <Detail label="Balconies" value={p.balconies} />
                      <Detail
                        label="Property age"
                        value={
                          p.propertyAgeYears != null
                            ? `${p.propertyAgeYears} years`
                            : ""
                        }
                      />
                      <Detail label="Facing" value={p.facing} />
                      <Detail
                        label="Security deposit"
                        value={money(p.securityDeposit || 0)}
                      />
                      <Detail
                        label="Monthly maintenance"
                        value={money(p.monthlyMaintenance || 0)}
                      />
                      <Detail
                        label="Available from"
                        value={
                          p.availableFrom
                            ? new Date(p.availableFrom).toLocaleDateString()
                            : ""
                        }
                      />
                      <Detail
                        label="Negotiable"
                        value={p.negotiable ? "Yes" : "No"}
                      />
                      <Detail
                        label="Pet friendly"
                        value={p.petFriendly ? "Yes" : "No"}
                      />
                      <Detail
                        label="Bachelor friendly"
                        value={p.bachelorFriendly ? "Yes" : "No"}
                      />
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <Detail label="Description" value={p.description} />
                      <Detail
                        label="Amenities"
                        value={p.amenities?.join(", ")}
                      />
                      <Detail label="Nearby school" value={p.nearbySchool} />
                      <Detail
                        label="Nearby hospital"
                        value={p.nearbyHospital}
                      />
                      <Detail label="Nearby market" value={p.nearbyMarket} />

                      {p.mapUrl && (
                        <p className="mt-2">
                          <a
                            href={p.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-800 underline"
                          >
                            Open map
                          </a>
                        </p>
                      )}

                      {p.floorPlanUrl && (
                        <p className="mt-2">
                          <a
                            href={p.floorPlanUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-800 underline"
                          >
                            View floor plan
                          </a>
                        </p>
                      )}

                      {p.videoUrl && (
                        <p className="mt-2">
                          <a
                            href={p.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-800 underline"
                          >
                            Watch property video
                          </a>
                        </p>
                      )}

                      {p.photos?.length > 1 && (
                        <div className="mt-4">
                          <p className="mb-2 font-semibold">
                            More photos ({p.photos.length - 1})
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {p.photos.slice(1).map((photo, index) => (
                              <a
                                key={`${photo}-${index}`}
                                href={serverUrl(photo)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={serverUrl(photo)}
                                  alt={`${p.title} ${index + 2}`}
                                  className="h-20 w-full rounded-lg object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    );
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OWNER DIRECTORY</span>
          <h1>Landlords</h1>
          <p>Private records visible to admin only.</p>
        </div>
      </div>

      <div className="content-card form-card">
        <h2>{editLandlordId ? "Edit landlord" : "Add landlord"}</h2>

        <form className="form-grid three" onSubmit={addLandlord}>
          <Field
            label="Full name"
            name="fullName"
            value={landlordForm.fullName}
            onChange={(e) =>
              setLandlordForm({ ...landlordForm, fullName: e.target.value })
            }
            required
          />

          <Field
            label="Phone"
            name="phone"
            value={landlordForm.phone}
            onChange={(e) =>
              setLandlordForm({ ...landlordForm, phone: e.target.value })
            }
            required
          />

          <Field
            label="Email"
            name="email"
            type="email"
            value={landlordForm.email}
            onChange={(e) =>
              setLandlordForm({ ...landlordForm, email: e.target.value })
            }
          />

          <Field
            label="Alternate phone"
            name="alternatePhone"
            value={landlordForm.alternatePhone || ""}
            onChange={(e) =>
              setLandlordForm({
                ...landlordForm,
                alternatePhone: e.target.value,
              })
            }
          />

          <Field
            label="Address"
            name="address"
            value={landlordForm.address || ""}
            onChange={(e) =>
              setLandlordForm({ ...landlordForm, address: e.target.value })
            }
          />

          <Field
            label="Verification status"
            name="verificationStatus"
            value={landlordForm.verificationStatus || ""}
            onChange={(e) =>
              setLandlordForm({
                ...landlordForm,
                verificationStatus: e.target.value,
              })
            }
          />

          <label className="field span-all">
            <span>Private notes</span>
            <textarea
              value={landlordForm.notes}
              onChange={(e) =>
                setLandlordForm({ ...landlordForm, notes: e.target.value })
              }
            />
          </label>

          <button type="submit" className="btn btn-dark">
            <Plus size={17} />
            {editLandlordId ? "Save changes" : "Save landlord"}
          </button>

          {editLandlordId && (
            <button type="button" className="btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Total Properties</th>
              <th>Available</th>
              <th>Occupied</th>
              <th>Reserved</th>
              <th>Private notes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {landlords.map((l) => (
              <tr key={l._id}>
                <td>
                  <button
                    type="button"
                    onClick={() => openLandlord(l)}
                    className="font-semibold text-emerald-800 underline"
                  >
                    {l.fullName}
                  </button>
                </td>
                <td>{l.phone}</td>
                <td>{l.email || "—"}</td>
                <td>{l.totalProperties ?? 0}</td>
                <td>{l.availableProperties ?? 0}</td>
                <td>{l.occupiedProperties ?? 0}</td>
                <td>{l.reservedProperties ?? 0}</td>
                <td>{l.notes || "—"}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      setEditLandlordId(l._id);
                      setLandlordForm({
                        fullName: l.fullName || "",
                        phone: l.phone || "",
                        email: l.email || "",
                        alternatePhone: l.alternatePhone || "",
                        address: l.address || "",
                        verificationStatus: l.verificationStatus || "",
                        notes: l.notes || "",
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-lg border px-3 py-2 text-sm font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {landlords.length === 0 && (
              <tr>
                <td colSpan={9} className="p-5 text-center">
                  No landlords found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Detail({ label, value }) {
  const displayValue =
    value === null || value === undefined || value === "" ? "—" : String(value);

  return (
    <div className="mb-3 min-w-0">
      <p className="text-sm opacity-70">{label}</p>
      <p className="break-words font-medium">{displayValue}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="content-card">
      <p className="text-sm opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
