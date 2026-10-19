import React from "react";
import Field from "../components/Field";
import emptyRequirement from "../constants/emptyRequirement";
import { Home, KeyRound, Users, Building2, Plus, MapPin, Phone, Mail, ShieldCheck, ArrowRight, Wallet } from "lucide-react";
import { money, serverUrl } from "../api";

export default function LandlordsPage({ app }) {
  const { user, view, setView, mobileMenu, setMobileMenu, authMode, setAuthMode, authForm, setAuthForm, properties, setProperties, overview, setOverview, clients, setClients, landlords, setLandlords, notice, setNotice, error, setError, requirement, setRequirement, landlordForm, setLandlordForm, propertyForm, setPropertyForm, photos, setPhotos, payAmount, setPayAmount, resetMessages, loadPublic, loadAdmin, logout, submitAuth, submitRequirement, addLandlord, addProperty, markUnavailable, createPayment, admin, nav, go } = app;
  return (
    <><div className="page-heading"><div><span className="eyebrow">OWNER DIRECTORY</span><h1>Landlords</h1><p>Private records visible to admin only.</p></div></div><div className="content-card form-card"><h2>Add landlord</h2><form className="form-grid three" onSubmit={addLandlord}><Field label="Full name" name="fullName" value={landlordForm.fullName} onChange={e=>setLandlordForm({...landlordForm,fullName:e.target.value})} required/><Field label="Phone" name="phone" value={landlordForm.phone} onChange={e=>setLandlordForm({...landlordForm,phone:e.target.value})} required/><Field label="Email" name="email" type="email" value={landlordForm.email} onChange={e=>setLandlordForm({...landlordForm,email:e.target.value})}/><label className="field span-all"><span>Private notes</span><textarea value={landlordForm.notes} onChange={e=>setLandlordForm({...landlordForm,notes:e.target.value})}/></label><button className="btn btn-dark"><Plus size={17}/> Save landlord</button></form></div><div className="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Private notes</th></tr></thead><tbody>{landlords.map(l=><tr key={l._id}><td>{l.fullName}</td><td>{l.phone}</td><td>{l.email||"—"}</td><td>{l.notes||"—"}</td></tr>)}</tbody></table></div></>
  );
}
