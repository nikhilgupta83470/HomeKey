import React from "react";
import {
  Users,
  KeyRound,
  Building2,
  Home,
  Plus,
  ArrowUpRight,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  RefreshCw,
  Settings,
} from "lucide-react";

export default function OverviewPage({ app }) {
  const {
    user,
    overview,
    properties = [],
    clients = [],
    landlords = [],
    go,
    loadAdmin,
  } = app;

  const stats = [
    {
      label: "Total Clients",
      value: overview?.clients ?? 0,
      description: "Registered customers",
      icon: Users,
      color: "#3977df",
      background: "#edf4ff",
      action: "clients",
    },
    {
      label: "Total Landlords",
      value: overview?.landlords ?? 0,
      description: "Property owners",
      icon: KeyRound,
      color: "#9b68ce",
      background: "#f5edff",
      action: "landlords",
    },
    {
      label: "Total Properties",
      value: overview?.properties ?? 0,
      description: "Properties in your system",
      icon: Building2,
      color: "#168c75",
      background: "#e8f8f3",
      action: "properties",
    },
    {
      label: "Available Properties",
      value: overview?.available ?? 0,
      description: "Currently available",
      icon: Home,
      color: "#d58a27",
      background: "#fff5e5",
      action: "properties",
    },
    {
      label: "Client Requirements",
      value: overview?.requests ?? 0,
      description: "Submitted requirements",
      icon: ClipboardList,
      color: "#d35f72",
      background: "#fff0f2",
      action: "clients",
    },
  ];

  const totalProperties = Number(overview?.properties || 0);
  const availableProperties = Number(overview?.available || 0);
  const unavailableProperties = Math.max(
    totalProperties - availableProperties,
    0,
  );

  const availabilityPercentage =
    totalProperties > 0
      ? Math.min(Math.round((availableProperties / totalProperties) * 100), 100)
      : 0;

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Admin";

  const quickActions = [
    {
      title: "Manage Properties",
      description:
        "Add properties, update rent, upload photos and manage availability.",
      icon: Building2,
      color: "#3977df",
      background: "#edf4ff",
      action: "properties",
      button: "Manage properties",
    },
    {
      title: "Manage Landlords",
      description: "Maintain property owner contact details and notes.",
      icon: KeyRound,
      color: "#9b68ce",
      background: "#f5edff",
      action: "landlords",
      button: "View landlords",
    },
    {
      title: "Manage Clients",
      description: "View registered clients and their property requirements.",
      icon: Users,
      color: "#168c75",
      background: "#e8f8f3",
      action: "clients",
      button: "View clients",
    },
  ];

  return (
    <div style={{ display: "grid", gap: "25px", paddingBottom: "30px" }}>
      {/* WELCOME HEADER */}
      <section
        style={{
          background: "linear-gradient(120deg, #17242b, #263a43)",
          color: "#fff",
          borderRadius: "20px",
          padding: "clamp(24px, 4vw, 38px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#d7c29e",
              fontSize: "12px",
              letterSpacing: "2px",
              fontWeight: 700,
            }}
          >
            <LayoutDashboard size={16} />
            ADMIN DASHBOARD
          </div>

          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 36px)",
              margin: "15px 0 8px",
              lineHeight: 1.2,
            }}
          >
            Welcome back, {firstName}!
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d2dade",
              lineHeight: 1.7,
              maxWidth: "540px",
            }}
          >
            Manage your rental business, monitor property availability and keep
            track of client requirements from one place.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            className="btn btn-light"
            onClick={() => loadAdmin?.()}
            style={{ justifyContent: "center" }}
          >
            <RefreshCw size={16} />
            Refresh overview
          </button>

          <button
            className="btn btn-dark"
            onClick={() => go("properties")}
            style={{
              background: "#d8c29e",
              color: "#202b30",
              justifyContent: "center",
            }}
          >
            <Plus size={17} />
            Add / manage property
          </button>
        </div>
      </section>

      {/* STATISTICS */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <div>
            <span className="eyebrow">BUSINESS AT A GLANCE</span>
            <h2 style={{ margin: "7px 0 0", fontSize: "24px" }}>Overview</h2>
          </div>

          <span style={{ color: "#7a8388", fontSize: "13px" }}>
            Live totals from your dashboard data
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 195px), 1fr))",
            gap: "16px",
          }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <button
                key={stat.label}
                onClick={() => go(stat.action)}
                style={{
                  textAlign: "left",
                  border: "1px solid #e8eaed",
                  borderRadius: "16px",
                  background: "#fff",
                  padding: "21px",
                  cursor: "pointer",
                  color: "#20272c",
                  minWidth: 0,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.025)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "13px",
                      background: stat.background,
                      color: stat.color,
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight size={18} color="#a0a7ac" />
                </div>

                <div
                  style={{
                    color: "#6f797f",
                    fontSize: "13px",
                    marginTop: "19px",
                  }}
                >
                  {stat.label}
                </div>

                <div
                  style={{
                    fontSize: "clamp(27px, 3vw, 34px)",
                    fontWeight: 750,
                    margin: "5px 0",
                    letterSpacing: "-1px",
                  }}
                >
                  {Number(stat.value).toLocaleString("en-IN")}
                </div>

                <div style={{ fontSize: "12px", color: "#8a9399" }}>
                  {stat.description}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* PROPERTY AVAILABILITY AND SUMMARY */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "20px",
        }}
      >
        <div
          className="content-card"
          style={{
            padding: "25px",
            borderRadius: "17px",
            border: "1px solid #e8eaed",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: "13px", alignItems: "center" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                display: "grid",
                placeItems: "center",
                borderRadius: "12px",
                background: "#e8f8f3",
                color: "#168c75",
              }}
            >
              <Building2 size={22} />
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: "19px" }}>
                Property availability
              </h2>
              <p
                style={{
                  margin: "5px 0 0",
                  color: "#7a8388",
                  fontSize: "13px",
                }}
              >
                Current listing status
              </p>
            </div>
          </div>

          <div style={{ marginTop: "28px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "10px",
              }}
            >
              <span style={{ color: "#69747a", fontSize: "14px" }}>
                Available properties
              </span>
              <strong style={{ fontSize: "25px" }}>
                {availabilityPercentage}%
              </strong>
            </div>

            <div
              style={{
                height: "10px",
                background: "#edf0f2",
                borderRadius: "20px",
                overflow: "hidden",
                margin: "12px 0 20px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${availabilityPercentage}%`,
                  background: "#168c75",
                  borderRadius: "20px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#69747a", fontSize: "14px" }}>
                  <CheckCircle2
                    size={15}
                    color="#168c75"
                    style={{ verticalAlign: "middle", marginRight: "7px" }}
                  />
                  Available
                </span>
                <strong>{availableProperties}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#69747a", fontSize: "14px" }}>
                  <Clock3
                    size={15}
                    color="#d58a27"
                    style={{ verticalAlign: "middle", marginRight: "7px" }}
                  />
                  Not available
                </span>
                <strong>{unavailableProperties}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #edf0f2",
                  paddingTop: "14px",
                }}
              >
                <span style={{ color: "#69747a", fontSize: "14px" }}>
                  Total listings
                </span>
                <strong>{totalProperties}</strong>
              </div>
            </div>
          </div>

          <button
            className="btn btn-light"
            onClick={() => go("properties")}
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "22px",
            }}
          >
            Manage inventory <ArrowRight size={16} />
          </button>
        </div>

        <div
          className="content-card"
          style={{
            padding: "25px",
            borderRadius: "17px",
            border: "1px solid #e8eaed",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: "13px", alignItems: "center" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                display: "grid",
                placeItems: "center",
                borderRadius: "12px",
                background: "#edf4ff",
                color: "#3977df",
              }}
            >
              <ArrowRight size={22} />
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: "19px" }}>
                Business shortcuts
              </h2>
              <p
                style={{
                  margin: "5px 0 0",
                  color: "#7a8388",
                  fontSize: "13px",
                }}
              >
                Jump directly to a section
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px", marginTop: "24px" }}>
            {[
              {
                title: "Review client requirements",
                subtitle: `${Number(overview?.requests || 0)} submitted requests`,
                icon: ClipboardList,
                action: "clients",
              },
              {
                title: "View registered clients",
                subtitle: `${Number(overview?.clients || 0)} clients in your system`,
                icon: Users,
                action: "clients",
              },
              {
                title: "Manage landlords",
                subtitle: `${Number(overview?.landlords || 0)} registered landlords`,
                icon: KeyRound,
                action: "landlords",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  onClick={() => go(item.action)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "13px",
                    padding: "13px",
                    border: "1px solid #edf0f2",
                    borderRadius: "12px",
                    background: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#273239",
                  }}
                >
                  <Icon size={20} color="#64747c" />

                  <span style={{ flex: 1 }}>
                    <strong style={{ display: "block", fontSize: "13px" }}>
                      {item.title}
                    </strong>
                    <small
                      style={{
                        color: "#879198",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      {item.subtitle}
                    </small>
                  </span>

                  <ArrowRight size={16} color="#879198" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section
        className="content-card"
        style={{
          padding: "25px",
          borderRadius: "17px",
          border: "1px solid #e8eaed",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "22px",
          }}
        >
          <div>
            <span className="eyebrow">QUICK ACTIONS</span>
            <h2 style={{ fontSize: "24px", margin: "7px 0 0" }}>
              Manage your business
            </h2>
          </div>

          <Settings size={22} color="#8a9399" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: "16px",
          }}
        >
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                style={{
                  border: "1px solid #edf0f2",
                  padding: "22px",
                  borderRadius: "15px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "13px",
                    background: item.background,
                    color: item.color,
                  }}
                >
                  <Icon size={23} />
                </div>

                <h3 style={{ margin: "18px 0 8px", fontSize: "17px" }}>
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "#7a8388",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    minHeight: "44px",
                    margin: "0 0 18px",
                  }}
                >
                  {item.description}
                </p>

                <button
                  className="btn btn-light"
                  onClick={() => go(item.action)}
                  style={{ justifyContent: "center", width: "100%" }}
                >
                  {item.button} <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
