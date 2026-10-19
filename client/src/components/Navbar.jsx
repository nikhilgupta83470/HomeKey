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
    authMode,
    setAuthMode,
    nav,
    logout,
    go,
  } = app;

  // Add About Us and About Broker to the existing navbar
  const aboutLinks = [
    ["about-us", "About Us", Info],
    ["about-broker", "About Broker", UserRound],
  ];

  const allNavLinks = [...nav, ...aboutLinks];

  return (
    <header className="topbar">
      <button className="brand" onClick={() => go("home")}>
        <img src="/assets/ascend-logo.jpg" alt="Ascend Pro Realty" className="brand-logo" />
        <span className="brand-name">
          ASCEND PRO REALTY
          <small>REAL ESTATE CONSULTANTS</small>
        </span>
      </button>

      <button
        className="mobile-toggle"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? <X /> : <Menu />}
      </button>

      <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
        {allNavLinks.map(([id, label, Icon]) => (
          <button
            key={id}
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
          <button className="nav-item" onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
        ) : (
          <button
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
