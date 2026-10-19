
import React from "react";
import {
  Home,
  KeyRound,
  Users,
  Building2,
  LogOut,
  Phone,
  Menu,
  X,
  Wallet,
  Info,
  UserRound,
} from "lucide-react";

export default function Navbar({ app }) {
  const {
    user,
    view,
    mobileMenu,
    setMobileMenu,
    setAuthMode,
    nav,
    logout,
    go,
  } = app;

  const aboutLinks = [
    ["about-us", "About Us", Info],
    ["about-broker", "About Broker", UserRound],
  ];

  const allNavLinks = [...nav, ...aboutLinks].filter(
    ([id, label]) => id !== "profile" && label.toLowerCase() !== "my profile",
  );

  return (
    <header className="topbar">
      <button
        className="brand"
        onClick={() => go("home")}
        type="button"
      >
        <img
          src="/assets/ascend-logo.jpg"
          alt="Ascend Pro Realty"
          className="brand-logo"
        />

        <span className="brand-name">
          ASCEND PRO REALTY
          <small>REAL ESTATE CONSULTANTS</small>
        </span>
      </button>

      <button
        className="mobile-toggle"
        onClick={() => setMobileMenu(!mobileMenu)}
        type="button"
        aria-label="Toggle navigation"
      >
        {mobileMenu ? <X /> : <Menu />}
      </button>

      <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
        {allNavLinks.map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            className={view === id ? "nav-item active" : "nav-item"}
            onClick={() => {
              go(id);
              setMobileMenu(false);
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}

        {user ? (
          <>
            <button
              type="button"
              className="nav-item"
              onClick={() => {
                logout();
                setMobileMenu(false);
              }}
            >
              <LogOut size={17} />
              Logout
            </button>

            <button
              type="button"
              className={
                view === "profile"
                  ? "profile-icon-btn active"
                  : "profile-icon-btn"
              }
              onClick={() => {
                go("profile");
                setMobileMenu(false);
              }}
              title="My Profile"
              aria-label="My Profile"
            >
              <UserRound size={21} />
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-dark nav-login"
            onClick={() => {
              setAuthMode("login");
              go("auth");
              setMobileMenu(false);
            }}
          >
            Login / Sign up
          </button>
        )}
      </nav>
    </header>
  );
}
