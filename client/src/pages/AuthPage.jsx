import React from "react";
import Field from "../components/Field";
import emptyRequirement from "../constants/emptyRequirement";
import { GoogleLogin } from "@react-oauth/google";
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

export default function AuthPage({ app }) {
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
    submitGoogleAuth,
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
    <section className="auth-wrap">
      <div className="auth-panel">
        <span className="eyebrow">WELCOME TO HOMEKEY</span>
        <h1>
          {authMode === "login" ? "Good to see you." : "Find your place."}
        </h1>
        <p className="muted">
          {authMode === "login"
            ? "Sign in to continue your home search."
            : "Create an account to save your home requirements."}
        </p>
        <form onSubmit={submitAuth} className="form-grid">
          {authMode === "register" && (
            <Field
              label="Full name"
              name="name"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
              required
            />
          )}
          <Field
            label="Email address"
            name="email"
            type="email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
            required
          />
          <Field
            label="Password (minimum 8 characters)"
            name="password"
            type="password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            required
          />
          {authMode === "register" && (
            <Field
              label="Phone number"
              name="phone"
              value={authForm.phone}
              onChange={(e) =>
                setAuthForm({ ...authForm, phone: e.target.value })
              }
            />
          )}
          <button className="btn btn-dark full">
            {authMode === "login" ? "Sign in" : "Create account"}{" "}
            <ArrowRight size={17} />
          </button>
        </form>
        {authMode === "login" && (
          <div style={{ marginTop: "18px" }}>
            <div
              className="muted"
              style={{ textAlign: "center", marginBottom: "14px" }}
            >
              Or continue with Google
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={(response) => {
                  if (response.credential) {
                    submitGoogleAuth(response.credential);
                  } else {
                    setError("Google credential was not received.");
                  }
                }}
                onError={() =>
                  setError("Google login failed. Please try again.")
                }
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="300"
              />
            </div>
          </div>
        )}
        <p className="switch-auth">
          {authMode === "login" ? "New here?" : "Already registered?"}{" "}
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          >
            {authMode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </section>
  );
}
