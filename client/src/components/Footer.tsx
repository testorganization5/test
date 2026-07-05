import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
        </div>
        <nav className="footer__nav">
          <Link to="/cookbooks">Cookbooks</Link>
          <Link to="/recipes">Recipes</Link>
          <a href="#about">About Us</a>
        </nav>
        <a className="footer__email" href="mailto:pizfeedme@itechart.com">
          pizfeedme@itechart.com
        </a>
        <div className="footer__meta">
          <span>Study Project v2, 2021</span>
          <span className="footer__logo">iTechArt</span>
        </div>
      </div>
    </footer>
  );
}
