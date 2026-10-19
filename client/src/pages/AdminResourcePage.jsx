import React, { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, Search, X } from "lucide-react";

const configs = {
  inquiries: {
    title: "Inquiries",
    description: "Manage property enquiries and client follow-ups.",
    fields: [
      { name: "name", label: "Client Name", required: true },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email", type: "email" },
      { name: "message", label: "Message", type: "textarea" },
      {
        name: "source",
        label: "Source",
        options: ["Website", "Phone", "WhatsApp", "Referral", "Other"],
      },
      {
        name: "status",
        label: "Status",
        options: ["New", "Contacted", "Follow-up", "Converted", "Closed"],
      },
      { name: "followUpDate", label: "Follow-up Date", type: "date" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    columns: ["name", "phone", "source", "status"],
  },
  tasks: {
    title: "Tasks",
    description: "Organize reminders and daily work.",
    fields: [
      { name: "title", label: "Task Title", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "dueDate", label: "Due Date", type: "date" },
      {
        name: "priority",
        label: "Priority",
        options: ["Low", "Medium", "High"],
      },
      {
        name: "status",
        label: "Status",
        options: ["Pending", "In Progress", "Completed"],
      },
    ],
    columns: ["title", "priority", "status", "dueDate"],
  },
  projects: {
    title: "Projects",
    description: "Manage property projects and development work.",
    fields: [
      { name: "name", label: "Project Name", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "location", label: "Location" },
      {
        name: "status",
        label: "Status",
        options: ["Planning", "Active", "Completed", "On Hold"],
      },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
    ],
    columns: ["name", "location", "status", "startDate"],
  },
  deals: {
    title: "Deals",
    description: "Track property rental, sale and booking deals.",
    fields: [
      { name: "title", label: "Deal Title", required: true },
      { name: "amount", label: "Amount (₹)", type: "number" },
      {
        name: "dealType",
        label: "Deal Type",
        options: ["Rent", "Sale", "Booking", "Other"],
      },
      {
        name: "status",
        label: "Stage",
        options: ["Lead", "Negotiation", "Agreement", "Completed", "Cancelled"],
      },
      { name: "expectedCloseDate", label: "Expected Close Date", type: "date" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    columns: ["title", "amount", "dealType", "status"],
  },
  contacts: {
    title: "Contacts",
    description: "Maintain your business and client contacts.",
    fields: [
      { name: "name", label: "Contact Name", required: true },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email", type: "email" },
      { name: "company", label: "Company" },
      {
        name: "contactType",
        label: "Contact Type",
        options: ["Client", "Landlord", "Agent", "Vendor", "Other"],
      },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    columns: ["name", "phone", "email", "contactType"],
  },
  notes: {
    title: "Notes",
    description: "Keep important notes and reminders.",
    fields: [
      { name: "title", label: "Note Title", required: true },
      { name: "content", label: "Content", type: "textarea", required: true },
      { name: "pinned", label: "Pin this note", type: "checkbox" },
    ],
    columns: ["title", "content", "pinned"],
  },
};

const emptyForm = (config) =>
  Object.fromEntries(
    config.fields.map((field) => [
      field.name,
      field.type === "checkbox" ? false : "",
    ]),
  );

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object")
    return value.name || value.fullName || value._id || "—";
  return String(value);
}

export default function AdminResourcePage({ app, resource }) {
  const config = configs[resource];
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  const loadRows = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const data = await app.api(`/admin/${resource}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(error.message || "Could not load records.");
    } finally {
      setLoading(false);
    }
  }, [app.api, resource]);

  useEffect(() => {
    setRows([]);
    setForm({});
    setEditingId(null);
    setFormOpen(false);
    setSearch("");
    loadRows();
  }, [loadRows]);

  if (!config) return null;

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm(config));
    setPageError("");
    setFormOpen(true);
  }

  function startEdit(row) {
    setEditingId(row._id);
    const next = emptyForm(config);
    for (const field of config.fields) {
      const value = row[field.name];
      next[field.name] =
        value == null
          ? field.type === "checkbox"
            ? false
            : ""
          : field.type === "date"
            ? String(value).slice(0, 10)
            : value;
    }
    setForm(next);
    setPageError("");
    setFormOpen(true);
  }

  async function saveRecord(event) {
    event.preventDefault();
    setSaving(true);
    setPageError("");

    try {
      const payload = {};
      for (const field of config.fields) {
        const value = form[field.name];
        if (field.type === "checkbox") {
          payload[field.name] = Boolean(value);
        } else if (field.type === "number") {
          payload[field.name] = value === "" ? 0 : Number(value);
        } else {
          payload[field.name] = value;
        }
      }

      await app.api(
        editingId ? `/admin/${resource}/${editingId}` : `/admin/${resource}`,
        {
          method: editingId ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      );

      setFormOpen(false);
      setEditingId(null);
      await loadRows();
      app.setNotice(`${config.title} saved successfully.`);
    } catch (error) {
      setPageError(error.message || "Could not save record.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(row) {
    if (
      !window.confirm(
        `Delete "${row.title || row.name || row.fullName || row._id}"?`,
      )
    )
      return;

    setPageError("");
    try {
      await app.api(`/admin/${resource}/${row._id}`, {
        method: "DELETE",
      });
      await loadRows();
      app.setNotice("Record deleted successfully.");
    } catch (error) {
      setPageError(error.message || "Could not delete record.");
    }
  }

  const filteredRows = rows.filter((row) =>
    config.columns.some((key) =>
      displayValue(row[key]).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{config.description}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadRows}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#173f35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#245748]"
          >
            <Plus size={17} /> Add {config.title.slice(0, -1)}
          </button>
        </div>
      </div>

      {pageError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {pageError}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={saveRecord}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit" : "Add"} {config.title}
            </h2>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {config.fields.map((field) => (
              <label
                key={field.name}
                className={`block text-sm font-medium text-gray-700 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
              >
                {field.label}
                {field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.checked })
                    }
                    className="ml-3 h-4 w-4 accent-[#173f35]"
                  />
                ) : field.options ? (
                  <select
                    required={field.required}
                    value={form[field.name] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    rows={3}
                    value={form[field.name] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
                  />
                ) : (
                  <input
                    required={field.required}
                    type={field.type || "text"}
                    min={field.type === "number" ? 0 : undefined}
                    value={form[field.name] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              disabled={saving}
              className="rounded-lg bg-[#173f35] px-5 py-2 font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border border-gray-300 px-5 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3">
        <Search size={17} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}...`}
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
        <span className="whitespace-nowrap text-xs text-gray-500">
          {filteredRows.length} records
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              {config.columns.map((key) => (
                <th key={key} className="px-4 py-3 font-semibold">
                  {config.fields.find((f) => f.name === key)?.label || key}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  {config.columns.map((key) => (
                    <td key={key} className="max-w-xs px-4 py-3 text-gray-700">
                      <span className="block truncate">
                        {displayValue(row[key])}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        aria-label="Edit"
                        className="rounded-md border p-2 hover:bg-gray-100"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecord(row)}
                        aria-label="Delete"
                        className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
