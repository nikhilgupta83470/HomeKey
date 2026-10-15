import React from "react";
import Field from "../components/Field";
import emptyRequirement from "../constants/emptyRequirement";
import { Home, KeyRound, Users, Building2, Plus, MapPin, Phone, Mail, ShieldCheck, ArrowRight, Wallet } from "lucide-react";
import { money, serverUrl } from "../api";

export default function PaymentPage({ app }) {
  const { user, view, setView, mobileMenu, setMobileMenu, authMode, setAuthMode, authForm, setAuthForm, properties, setProperties, overview, setOverview, clients, setClients, landlords, setLandlords, notice, setNotice, error, setError, requirement, setRequirement, landlordForm, setLandlordForm, propertyForm, setPropertyForm, photos, setPhotos, payAmount, setPayAmount, resetMessages, loadPublic, loadAdmin, logout, submitAuth, submitRequirement, addLandlord, addProperty, markUnavailable, createPayment, admin, nav, go } = app;
  return (
    <section className="auth-wrap"><div className="auth-panel"><span className="eyebrow">SECURE PAYMENT</span><h1>Make a payment.</h1><p className="muted">Use the payment amount confirmed with your broker. Payment activation requires Razorpay keys and server-side verification.</p><form onSubmit={createPayment} className="form-grid"><Field label="Amount (₹)" name="amount" type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)} required/><button className="btn btn-dark full"><Wallet size={17}/> Continue to payment</button></form><p className="tiny-note">Do not pay a deposit or brokerage until the property, terms and recipient have been independently verified.</p></div></section>
  );
}
