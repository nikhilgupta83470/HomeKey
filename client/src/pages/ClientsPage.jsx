import React, { useMemo, useState } from "react";
import {
  Search,
  Users,
  ClipboardList,
  ChevronDown,
  Save,
  RefreshCw,
  CalendarDays,
  MessageSquareText,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "VISIT_SCHEDULED", label: "Visit Scheduled" },
  { value: "CLOSED", label: "Closed" },
];

const statusStyle = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  VISIT_SCHEDULED: "bg-purple-100 text-purple-700",
  CLOSED: "bg-green-100 text-green-700",
};

const getStatus = (request) => request.status || "NEW";

const getDateValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function ClientsPage({ app }) {
  const { clients, api, setNotice, setError } = app;

  const [clientSearch, setClientSearch] = useState("");
  const [requirementSearch, setRequirementSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState("all");
  const [statusChanges, setStatusChanges] = useState({});
  const [followUpChanges, setFollowUpChanges] = useState({});
  const [savingIds, setSavingIds] = useState([]);

  const clientList = clients?.clients || [];
  const requirementList = clients?.requests || [];

  const filteredClients = useMemo(() => {
    const query = clientSearch.trim().toLowerCase();
    if (!query) return clientList;

    return clientList.filter((client) =>
      [client.name, client.email, client.phone].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [clientList, clientSearch]);

  const filteredRequirements = useMemo(() => {
    const query = requirementSearch.trim().toLowerCase();

    return requirementList.filter((request) => {
      const userId =
        typeof request.user === "object" ? request.user?._id : request.user;

      const matchesClient =
        selectedClient === "all" || String(userId) === selectedClient;

      const matchesSearch = [
        request.fullName,
        request.preferredArea,
        request.maxBudget,
        request.bhkRequired,
        request.profession,
        request.householdType,
        request.companyCollege,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );

      return matchesClient && (!query || matchesSearch);
    });
  }, [requirementList, requirementSearch, selectedClient]);

  const isSaving = (id) => savingIds.includes(id);

  const startSaving = (id) => {
    setSavingIds((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
  };

  const stopSaving = (id) => {
    setSavingIds((previous) => previous.filter((item) => item !== id));
  };

  const changeStatus = (id, status) => {
    setStatusChanges((previous) => ({ ...previous, [id]: status }));
  };

  const changeFollowUp = (request, field, value) => {
    const id = request._id;

    setFollowUpChanges((previous) => ({
      ...previous,
      [id]: {
        followUpDate:
          previous[id]?.followUpDate ?? getDateValue(request.followUpDate),
        notes: previous[id]?.notes ?? request.notes ?? "",
        [field]: value,
      },
    }));
  };

  const saveStatus = async (request) => {
    const id = request._id;
    const status = statusChanges[id] || getStatus(request);

    if (status === getStatus(request)) {
      setNotice?.("No status changes to save.");
      return;
    }

    if (typeof api !== "function") {
      setError?.("API function is not available.");
      return;
    }

    startSaving(id);

    try {
      await api(`/admin/clients/requirements/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      request.status = status;

      setStatusChanges((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });

      setNotice?.("Requirement status updated successfully.");
    } catch (error) {
      setError?.(error.message || "Could not update requirement status.");
    } finally {
      stopSaving(id);
    }
  };

  const saveFollowUp = async (request) => {
    const id = request._id;
    const changes = followUpChanges[id] || {
      followUpDate: getDateValue(request.followUpDate),
      notes: request.notes || "",
    };

    if (typeof api !== "function") {
      setError?.("API function is not available.");
      return;
    }

    startSaving(id);

    try {
      const result = await api(`/admin/clients/requirements/${id}/follow-up`, {
        method: "PATCH",
        body: JSON.stringify({
          followUpDate: changes.followUpDate || null,
          notes: changes.notes,
        }),
      });

      // Reflect the saved values in the current screen.
      request.followUpDate =
        result?.requirement?.followUpDate || changes.followUpDate || null;
      request.notes = result?.requirement?.notes ?? changes.notes;

      setFollowUpChanges((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });

      setNotice?.("Follow-up date and notes saved successfully.");
    } catch (error) {
      setError?.(error.message || "Could not save follow-up.");
    } finally {
      stopSaving(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CLIENT CRM</span>
          <h1>Clients & Requirements</h1>
          <p>Manage registered clients, property preferences and follow-ups.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="content-card">
          <div className="flex items-center gap-3">
            <Users size={22} />
            <div>
              <p className="muted">Registered clients</p>
              <h2>{clientList.length}</h2>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="flex items-center gap-3">
            <ClipboardList size={22} />
            <div>
              <p className="muted">Property requirements</p>
              <h2>{requirementList.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <section className="content-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>Registered Clients</h2>
            <p className="muted">Search by name, email or phone.</p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              className="w-full rounded-lg border py-2 pl-10 pr-3"
              placeholder="Search clients..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name || "—"}</td>
                  <td>{client.email || "—"}</td>
                  <td>{client.phone || "—"}</td>
                  <td>
                    {client.createdAt
                      ? new Date(client.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}

              {!filteredClients.length && (
                <tr>
                  <td colSpan="4">No matching clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-card">
        <div className="mb-4">
          <h2>Property Requirements</h2>
          <p className="muted">
            Search, filter, track status and manage client follow-ups.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              className="w-full rounded-lg border py-2 pl-10 pr-3"
              placeholder="Search area, budget, BHK..."
              value={requirementSearch}
              onChange={(e) => setRequirementSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
            <select
              className="w-full appearance-none rounded-lg border px-3 py-2"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="all">All clients</option>
              {clientList.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name || client.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredRequirements.map((request) => {
            const id = request._id;
            const currentStatus = getStatus(request);
            const selectedStatus = statusChanges[id] || currentStatus;
            const saving = isSaving(id);

            const followUp = followUpChanges[id] || {
              followUpDate: getDateValue(request.followUpDate),
              notes: request.notes || "",
            };

            return (
              <details className="request-detail" key={id}>
                <summary>
                  <span>
                    <strong>{request.fullName || "Client requirement"}</strong>
                    {" · "}
                    {request.preferredArea || "Area not specified"}
                  </span>
                  <span>{request.maxBudget || "Budget not specified"}</span>
                </summary>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyle[currentStatus] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_OPTIONS.find(
                      (option) => option.value === currentStatus,
                    )?.label || "New"}
                  </span>

                  <select
                    className="rounded-lg border px-3 py-2"
                    value={selectedStatus}
                    onChange={(e) => changeStatus(id, e.target.value)}
                    aria-label={`Change status for ${request.fullName}`}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    onClick={() => saveStatus(request)}
                    disabled={saving || selectedStatus === currentStatus}
                  >
                    {saving ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Status
                  </button>
                </div>

                <div className="detail-grid">
                  {Object.entries(request)
                    .filter(
                      ([key, value]) =>
                        ![
                          "_id",
                          "__v",
                          "user",
                          "createdAt",
                          "updatedAt",
                          "consent",
                          "status",
                          "followUpDate",
                          "notes",
                        ].includes(key) &&
                        value !== "" &&
                        value !== null &&
                        value !== undefined,
                    )
                    .map(([key, value]) => (
                      <div key={key}>
                        <small>
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (char) => char.toUpperCase())}
                        </small>
                        <b>{String(value)}</b>
                      </div>
                    ))}
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarDays size={20} />
                    <h3 className="font-semibold">Client Follow-up</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        Follow-up date
                      </span>
                      <input
                        type="date"
                        className="w-full rounded-lg border px-3 py-2"
                        value={followUp.followUpDate}
                        onChange={(e) =>
                          changeFollowUp(
                            request,
                            "followUpDate",
                            e.target.value,
                          )
                        }
                      />
                    </label>

                    <div>
                      <span className="mb-2 block text-sm font-medium">
                        Saved follow-up
                      </span>
                      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        {request.followUpDate
                          ? new Date(request.followUpDate).toLocaleDateString()
                          : "No follow-up date saved"}
                      </p>
                    </div>
                  </div>

                  <label className="mt-4 block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <MessageSquareText size={16} />
                      Follow-up notes
                    </span>
                    <textarea
                      className="w-full rounded-lg border px-3 py-2"
                      rows={3}
                      maxLength={1000}
                      placeholder="Call client, discuss budget, arrange property visit..."
                      value={followUp.notes}
                      onChange={(e) =>
                        changeFollowUp(request, "notes", e.target.value)
                      }
                    />
                    <span className="muted mt-1 block text-xs">
                      {followUp.notes.length}/1000 characters
                    </span>
                  </label>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="muted text-sm">
                      Notes: {request.notes ? "Saved" : "Not saved yet"}
                    </p>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => saveFollowUp(request)}
                      disabled={saving}
                    >
                      {saving ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {saving ? "Saving..." : "Save Follow-up"}
                    </button>
                  </div>
                </div>
              </details>
            );
          })}

          {!filteredRequirements.length && (
            <p className="muted">No matching requirements found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
