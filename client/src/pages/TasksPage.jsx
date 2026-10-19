import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  Phone,
  MapPin,
  CreditCard,
  RefreshCw,
  MoreHorizontal,
  Grid2X2,
  List,
  Trash2,
  CheckCircle2,
  X,
  ClipboardList,
} from "lucide-react";
import { api } from "../api";

const taskTypes = [
  "Call",
  "Site Visit",
  "Payment",
  "Renewal / Vacant",
  "Other",
];
const statuses = ["Scheduled", "Completed", "Cancelled"];

const emptyTask = {
  title: "",
  taskType: "Call",
  date: new Date().toISOString().slice(0, 10),
  time: "10:00",
  status: "Scheduled",
  property: "",
  inquiry: "",
  project: "",
  assignedTo: "",
  notes: "",
};

export default function TasksPage({ app }) {
  const {
    properties = [],
    clients = {},
    landlords = [],
    setNotice,
    setError,
  } = app;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Scheduled");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [layout, setLayout] = useState("grid");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTask);
  const [saving, setSaving] = useState(false);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await api("/admin/tasks");
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (e) {
      setTasks([]);
      setError?.(
        e.message || "Tasks load nahi hue. Backend tasks API check karein.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function clearFilters() {
    setSearch("");
    setDateFilter("All Dates");
    setTypeFilter("All");
    setStatusFilter("All");
    setPropertyFilter("");
    setInquiryFilter("");
    setProjectFilter("");
    setAssignedFilter("");
    setShowDeleted(false);
  }

  async function saveTask(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        property: form.property || null,
        inquiry: form.inquiry || null,
        assignedTo: form.assignedTo || null,
        project: form.project.trim(),
        title: form.title.trim(),
        notes: form.notes.trim(),
      };

      await api("/admin/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setShowForm(false);
      setForm({
        ...emptyTask,
        date: new Date().toISOString().slice(0, 10),
      });
      setNotice?.("Task created successfully.");
      await loadTasks();
    } catch (e) {
      setError?.(
        e.message ||
          "Task save nahi hua. Backend POST /admin/tasks check karein.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(task, status) {
    try {
      await api(`/admin/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setTasks((old) =>
        old.map((t) => (t._id === task._id ? { ...t, status } : t)),
      );
      setNotice?.("Task status updated.");
    } catch (e) {
      setError?.(e.message || "Status update nahi hua.");
    }
  }

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const monthStart = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-01`;

    let result = tasks.filter((task) => {
      const taskDate = String(task.date || task.dueDate || "").slice(0, 10);
      const text = [
        task.title,
        task.taskType,
        task.type,
        task.notes,
        task.customer,
        task.customerName,
        task.societyName,
        task.colonyName,
        task.propertyName,
        task.inquiryName,
        task.projectName,
        task.assignedTo,
      ]
        .join(" ")
        .toLowerCase();

      if (search && !text.includes(search.toLowerCase())) return false;
      if (!showDeleted && (task.deleted || task.isDeleted)) return false;

      if (dateFilter === "Today" && taskDate !== today) return false;
      if (
        dateFilter === "This Week" &&
        (!taskDate || new Date(taskDate) < weekStart || taskDate > today)
      )
        return false;
      if (
        dateFilter === "This Month" &&
        (!taskDate || taskDate < monthStart || taskDate > today)
      )
        return false;

      if (typeFilter !== "All" && (task.taskType || task.type) !== typeFilter)
        return false;
      if (statusFilter !== "All" && task.status !== statusFilter) return false;
      if (propertyFilter && task.property !== propertyFilter) return false;
      if (inquiryFilter && task.inquiry !== inquiryFilter) return false;
      if (projectFilter && task.project !== projectFilter) return false;
      if (assignedFilter && task.assignedTo !== assignedFilter) return false;

      return true;
    });

    if (sortBy === "Date: earliest") {
      result = [...result].sort((a, b) =>
        String(a.date || a.dueDate || "").localeCompare(
          String(b.date || b.dueDate || ""),
        ),
      );
    } else if (sortBy === "Date: latest") {
      result = [...result].sort((a, b) =>
        String(b.date || b.dueDate || "").localeCompare(
          String(a.date || a.dueDate || ""),
        ),
      );
    } else if (sortBy === "Name") {
      result = [...result].sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || "")),
      );
    }

    return result;
  }, [
    tasks,
    search,
    dateFilter,
    typeFilter,
    statusFilter,
    propertyFilter,
    inquiryFilter,
    projectFilter,
    assignedFilter,
    showDeleted,
    sortBy,
  ]);

  const clientList = Array.isArray(clients) ? clients : clients?.clients || [];

  const buttonClass = (active) =>
    `rounded-md border px-2 py-2 text-xs transition ${
      active
        ? "border-emerald-600 bg-gradient-to-r from-emerald-400 to-cyan-400 font-semibold text-white"
        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    }`;

  const fieldClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="min-h-[75vh] bg-[#f3f4f6] px-4 py-5 text-gray-800 md:px-6">
      <div className="mx-auto max-w-[1500px]">
        <h1 className="mb-6 text-center text-2xl font-bold">Tasks</h1>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${fieldClass} pl-9`}
              placeholder="Search links by Points To Remember, Feedback, Project Name, Society / Colony Name, Customer..."
            />
          </div>

          <button
            onClick={() => {
              setForm(emptyTask);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          >
            <Plus size={17} /> Add Task
          </button>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Clear All
              </button>
            </div>

            <FilterGroup title="Date time">
              <div className="grid grid-cols-2 gap-1.5">
                {["Today", "This Week", "This Month", "All Dates"].map((d) => (
                  <button
                    key={d}
                    className={buttonClass(dateFilter === d)}
                    onClick={() => setDateFilter(d)}
                  >
                    {d}
                  </button>
                ))}
                <button
                  className={buttonClass(dateFilter === "Select Date")}
                  onClick={() => setDateFilter("Select Date")}
                >
                  Select Date
                </button>
              </div>
              {dateFilter === "Select Date" && (
                <input
                  type="date"
                  className={`${fieldClass} mt-2`}
                  onChange={(e) => {
                    setDateFilter("Exact Date");
                    setSearch((s) => s);
                    setForm((f) => ({ ...f, date: e.target.value }));
                  }}
                />
              )}
            </FilterGroup>

            <FilterGroup title="Task Type">
              <div className="grid grid-cols-2 gap-1.5">
                {["All", ...taskTypes].map((type) => (
                  <button
                    key={type}
                    className={buttonClass(typeFilter === type)}
                    onClick={() => setTypeFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Status">
              <div className="grid grid-cols-2 gap-1.5">
                {["All", ...statuses].map((status) => (
                  <button
                    key={status}
                    className={buttonClass(statusFilter === status)}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Property">
              <select
                className={fieldClass}
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
              >
                <option value="">Select property</option>
                {properties.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title || p.propertyId || p._id}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup title="Inquiry">
              <select
                className={fieldClass}
                value={inquiryFilter}
                onChange={(e) => setInquiryFilter(e.target.value)}
              >
                <option value="">Select inquiry</option>
                {clientList.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name || c.fullName || c.email || c._id}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup title="Project">
              <select
                className={fieldClass}
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="">Select project</option>
              </select>
            </FilterGroup>

            <FilterGroup title="Assigned to">
              <select
                className={fieldClass}
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
              >
                <option value="">Select executive</option>
                {landlords.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.fullName}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <label className="flex cursor-pointer items-center justify-between gap-3 text-xs">
              <span>Show Only Deleted Tasks</span>
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
            </label>
          </aside>

          <section className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span>
                {loading
                  ? "Loading tasks..."
                  : `${filteredTasks.length} tasks found`}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="task-sort">Sort By:</label>
                <select
                  id="task-sort"
                  className="rounded border border-gray-300 bg-white px-2 py-1.5"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Featured</option>
                  <option>Date: earliest</option>
                  <option>Date: latest</option>
                  <option>Name</option>
                </select>

                <button
                  aria-label="Grid view"
                  onClick={() => setLayout("grid")}
                  className={`rounded border p-1.5 ${layout === "grid" ? "bg-sky-500 text-white" : "bg-white"}`}
                >
                  <Grid2X2 size={17} />
                </button>
                <button
                  aria-label="List view"
                  onClick={() => setLayout("list")}
                  className={`rounded border p-1.5 ${layout === "list" ? "bg-sky-500 text-white" : "bg-white"}`}
                >
                  <List size={17} />
                </button>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
                <ClipboardList
                  className="mx-auto mb-3 text-slate-400"
                  size={30}
                />
                <h3 className="font-semibold">No Tasks Found</h3>
                <p className="mt-2 text-xs text-slate-500">
                  Create a task to remind your team about properties, inquiries,
                  projects, and follow-ups.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  <Plus className="mr-1 inline" size={16} /> Create Task
                </button>
              </div>
            ) : (
              <div
                className={
                  layout === "grid"
                    ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-3"
                }
              >
                {filteredTasks.map((task) => (
                  <article
                    key={task._id}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">
                          {task.title || "Untitled task"}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {task.taskType || task.type || "Other"}
                        </p>
                      </div>
                      <MoreHorizontal size={19} className="text-slate-400" />
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {task.date || task.dueDate || "No date"}{" "}
                        {task.time || ""}
                      </p>
                      <p className="flex items-center gap-2">
                        {task.taskType === "Site Visit" ? (
                          <MapPin size={15} />
                        ) : task.taskType === "Payment" ? (
                          <CreditCard size={15} />
                        ) : (
                          <Phone size={15} />
                        )}
                        {task.propertyName ||
                          task.customerName ||
                          task.notes ||
                          "No additional details"}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">
                        {task.status || "Scheduled"}
                      </span>
                      <select
                        aria-label="Update task status"
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                        value={task.status || "Scheduled"}
                        onChange={(e) => updateStatus(task, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-6 w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Task</h2>
              <button onClick={() => setShowForm(false)} aria-label="Close">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={saveTask} className="grid gap-4 sm:grid-cols-2">
              <FormField label="Task title" required>
                <input
                  required
                  className={fieldClass}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </FormField>

              <FormField label="Task type">
                <select
                  className={fieldClass}
                  value={form.taskType}
                  onChange={(e) =>
                    setForm({ ...form, taskType: e.target.value })
                  }
                >
                  {taskTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Date" required>
                <input
                  type="date"
                  required
                  className={fieldClass}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </FormField>

              <FormField label="Time" required>
                <input
                  type="time"
                  required
                  className={fieldClass}
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </FormField>

              <FormField label="Status">
                <select
                  className={fieldClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Property">
                <select
                  className={fieldClass}
                  value={form.property}
                  onChange={(e) =>
                    setForm({ ...form, property: e.target.value })
                  }
                >
                  <option value="">Select property</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title || p.propertyId || p._id}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Inquiry / Client">
                <select
                  className={fieldClass}
                  value={form.inquiry}
                  onChange={(e) =>
                    setForm({ ...form, inquiry: e.target.value })
                  }
                >
                  <option value="">Select inquiry</option>
                  {clientList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name || c.fullName || c.email || c._id}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Project">
                <input
                  className={fieldClass}
                  value={form.project}
                  onChange={(e) =>
                    setForm({ ...form, project: e.target.value })
                  }
                  placeholder="Project name"
                />
              </FormField>

              <FormField label="Assigned to">
                <select
                  className={fieldClass}
                  value={form.assignedTo}
                  onChange={(e) =>
                    setForm({ ...form, assignedTo: e.target.value })
                  }
                >
                  <option value="">Select executive</option>
                  {landlords.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.fullName}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Notes">
                  <textarea
                    rows={3}
                    className={fieldClass}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="Add task details or points to remember"
                  />
                </FormField>
              </div>

              <div className="flex justify-end gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xs font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
