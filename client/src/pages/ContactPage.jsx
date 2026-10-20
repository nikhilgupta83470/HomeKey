import React from "react";
import Field from "../components/Field";
import emptyRequirement from "../constants/emptyRequirement";
import {
  Home,
  KeyRound,
  Users,
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { money, serverUrl } from "../api";

export default function ContactPage({ app }) {
  const {
    user,
    view,
    setView,
    mobileMenu,
    setMobileMenu,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    properties,
    setProperties,
    overview,
    setOverview,
    clients,
    setClients,
    landlords,
    setLandlords,
    notice,
    setNotice,
    error,
    setError,
    requirement,
    setRequirement,
    landlordForm,
    setLandlordForm,
    propertyForm,
    setPropertyForm,
    photos,
    setPhotos,
    payAmount,
    setPayAmount,
    resetMessages,
    loadPublic,
    loadAdmin,
    logout,
    submitAuth,
    submitRequirement,
    addLandlord,
    addProperty,
    markUnavailable,
    createPayment,
    admin,
    nav,
    go,
  } = app;
  return (
    <section className="contact-panel">
      <span className="eyebrow">LET'S TALK</span>
      <h1>Need help finding a home?</h1>
      <p>
        Reach out to discuss your preferred area, budget and move-in timeline.
      </p>
      <div className="contact-actions">
        <a
          className="btn btn-dark"
          href="mailto:ascendprorealty@gmail.com.com?subject=Rental%20enquiry"
        >
          <Mail size={17} /> Email the broker
        </a>
        <a
          className="btn btn-light"
          href="https://wa.me/9999514787"
          target="_blank"
          rel="noreferrer"
        >
          <Phone size={17} /> WhatsApp
        </a>
      </div>
      <p className="tiny-note">
        Replace broker@example.com and add your WhatsApp number before
        publishing.
      </p>
    </section>
  );
}
