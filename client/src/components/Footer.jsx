import React from "react";
import { Home } from "lucide-react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Home size={18} /> HomeKey.
      </div>
      <span>Thoughtful homes. Clear guidance.</span>
      <span>© {new Date().getFullYear()} HomeKey Rentals</span>
    </footer>
  );
}
