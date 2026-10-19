import React, { useEffect, useState } from "react";
import { Building2, UserRound, Pencil, Save, X, Phone, Mail, MapPin, BriefcaseBusiness, ShieldCheck } from "lucide-react";

const blankCompany = {
  companyName: "ASCEND PRO REALTY",
  designation: "Proprietor",
  address: "",
  city: "Ayodhya",
  state: "Uttar Pradesh",
  pincode: "",
  country: "India",
  notificationEmail: "",
  website: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

export default function ProfilePage({ app }) {
  const { user, setNotice } = app;
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [personal, setPersonal] = useState(() => {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("ascend_personal_profile") || "{}"); } catch {}
    return {
      name: user?.name || saved.name || "",
      username: saved.username || (user?.name || "").toLowerCase().replace(/\s+/g, ""),
      phone: user?.phone || saved.phone || "",
      email: user?.email || saved.email || "",
      userType: user?.role === "ADMIN" ? "Administrator" : (saved.userType || "Owner"),
      userId: user?._id || user?.id || saved.userId || "—",
      accountId: user?.accountId || saved.accountId || "—",
    };
  });
  const [company, setCompany] = useState(() => {
    try { return { ...blankCompany, ...JSON.parse(localStorage.getItem("ascend_company_profile") || "{}") }; }
    catch { return blankCompany; }
  });

  useEffect(() => {
    setPersonal((old) => ({ ...old, name: user?.name || old.name, email: user?.email || old.email, phone: user?.phone || old.phone, userType: user?.role === "ADMIN" ? "Administrator" : "Owner" }));
  }, [user]);

  const update = (setter, key, value) => setter((old) => ({ ...old, [key]: value }));
  const saveCompany = () => {
    localStorage.setItem("ascend_company_profile", JSON.stringify(company));
    setEditingCompany(false);
    setNotice?.("Company profile saved in this browser.");
  };
  const savePersonal = () => {
    // Profile fields are editable in the UI; authentication identity remains server-controlled.
    localStorage.setItem("ascend_personal_profile", JSON.stringify(personal));
    setEditingPersonal(false);
    setNotice?.("Profile changes saved in this browser. Account identity is still managed by the server.");
  };
  const field = (label, key, value, setter, editing, type = "text") => (
    <label className="profile-field" key={key}>
      <span>{label}</span>
      {editing ? <input type={type} value={value || ""} onChange={(e) => update(setter, key, e.target.value)} placeholder={`Enter ${label.toLowerCase()}`} /> : <strong>{value || "Not added"}</strong>}
    </label>
  );

  return <section className="profile-page">
    <div className="profile-page-heading">
      <div><span className="eyebrow">ACCOUNT SETTINGS</span><h1>My Profile</h1><p>Manage your personal information and company presence.</p></div>
      <img src="/assets/ascend-logo.jpg" alt="Ascend Pro Realty logo" className="profile-brand-logo" />
    </div>
    <div className="profile-grid">
      <section className="profile-card personal-card">
        <div className="profile-card-heading"><h2>Personal Details</h2>{editingPersonal ? <div className="profile-actions"><button className="profile-icon-btn" aria-label="Cancel edit" onClick={() => setEditingPersonal(false)}><X size={19}/></button><button className="profile-icon-btn" aria-label="Save personal details" onClick={savePersonal}><Save size={19}/></button></div> : <button className="profile-icon-btn" aria-label="Edit personal details" onClick={() => setEditingPersonal(true)}><Pencil size={19}/></button>}</div>
        <div className="profile-person-summary"><div className="profile-avatar"><UserRound size={42}/></div><div><h3>{personal.name || "Your Name"}</h3><p><b>Username:</b> {personal.username || "Add username"}</p></div></div>
        <div className="profile-detail-panel">
          {field("Mobile", "phone", personal.phone, setPersonal, editingPersonal, "tel")}
          {field("Email", "email", personal.email, setPersonal, editingPersonal, "email")}
          {field("User Type", "userType", personal.userType, setPersonal, false)}
          {field("User ID", "userId", personal.userId, setPersonal, false)}
          {field("Account ID", "accountId", personal.accountId, setPersonal, false)}
        </div>
        <div className="profile-security-note"><ShieldCheck size={17}/><span>Login credentials and account identity are securely managed by the server.</span></div>
      </section>
      <section className="profile-card company-card">
        <div className="profile-card-heading"><h2>Company Details</h2>{editingCompany ? <div className="profile-actions"><button className="profile-icon-btn" aria-label="Cancel company edit" onClick={() => setEditingCompany(false)}><X size={19}/></button><button className="profile-icon-btn" aria-label="Save company details" onClick={saveCompany}><Save size={19}/></button></div> : <button className="profile-icon-btn" aria-label="Edit company details" onClick={() => setEditingCompany(true)}><Pencil size={19}/></button>}</div>
        <div className="profile-person-summary"><div className="profile-avatar company-avatar"><Building2 size={39}/></div><div><h3>{company.companyName || "Your Company"}</h3><p>{company.designation || "Company role"}</p></div></div>
        <div className="profile-detail-panel company-detail-panel">
          {field("Company Name", "companyName", company.companyName, setCompany, editingCompany)}
          {field("Designation", "designation", company.designation, setCompany, editingCompany)}
          {field("Address", "address", company.address, setCompany, editingCompany)}
          {field("Pincode", "pincode", company.pincode, setCompany, editingCompany)}
          {field("Country", "country", company.country, setCompany, editingCompany)}
          {field("City", "city", company.city, setCompany, editingCompany)}
          {field("State", "state", company.state, setCompany, editingCompany)}
          {field("Notification Email", "notificationEmail", company.notificationEmail, setCompany, editingCompany, "email")}
          {field("Website", "website", company.website, setCompany, editingCompany, "url")}
          {field("Instagram", "instagram", company.instagram, setCompany, editingCompany, "url")}
          {field("Facebook", "facebook", company.facebook, setCompany, editingCompany, "url")}
          {field("YouTube", "youtube", company.youtube, setCompany, editingCompany, "url")}
        </div>
        {editingCompany && <button className="btn btn-dark profile-save-button" onClick={saveCompany}><Save size={16}/> Save Company Details</button>}
      </section>
    </div>
  </section>;
}
