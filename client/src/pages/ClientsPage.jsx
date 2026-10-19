import React from "react";
import Field from "../components/Field";
import emptyRequirement from "../constants/emptyRequirement";
import { Home, KeyRound, Users, Building2, Plus, MapPin, Phone, Mail, ShieldCheck, ArrowRight, Wallet } from "lucide-react";
import { money, serverUrl } from "../api";

export default function ClientsPage({ app }) {
  const { user, view, setView, mobileMenu, setMobileMenu, authMode, setAuthMode, authForm, setAuthForm, properties, setProperties, overview, setOverview, clients, setClients, landlords, setLandlords, notice, setNotice, error, setError, requirement, setRequirement, landlordForm, setLandlordForm, propertyForm, setPropertyForm, photos, setPhotos, payAmount, setPayAmount, resetMessages, loadPublic, loadAdmin, logout, submitAuth, submitRequirement, addLandlord, addProperty, markUnavailable, createPayment, admin, nav, go } = app;
  return (
    <><div className="page-heading"><div><span className="eyebrow">CLIENT CRM</span><h1>Clients & requirements</h1><p>Private client data — only visible in the authenticated admin dashboard.</p></div></div><div className="content-card"><h2>Registered clients</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Registered</th></tr></thead><tbody>{clients.clients.map(c=><tr key={c._id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone||"—"}</td><td>{new Date(c.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></div><div className="content-card"><h2>Flat requirements (sensitive — handle privately)</h2>{clients.requests.map(r=><details className="request-detail" key={r._id}><summary>{r.fullName} · Budget: {r.maxBudget||"Not specified"} · {r.preferredArea||"Area not specified"}</summary><div className="detail-grid">{Object.entries(r).filter(([k,v])=>!["_id","__v","user","createdAt","updatedAt","consent"].includes(k)&&v).map(([k,v])=><div key={k}><small>{k.replace(/([A-Z])/g," $1")}</small><b>{String(v)}</b></div>)}</div></details>)}{!clients.requests.length&&<p className="muted">No requirements submitted yet.</p>}</div></>
  );
}
