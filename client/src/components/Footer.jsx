import React from "react";
import { Building2 } from "lucide-react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Building2 size={18} /> ASCEND PRO REALTY
      </div>
      <span>Flats · Shops · Plots · Sale · Purchase · Rent</span>
      <span>© {new Date().getFullYear()} Ascend Pro Realty</span>
    </footer>
  );
}
