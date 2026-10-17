import Link from "next/link";
import Brand from "./brand";

const footerLinks = [
  { href: "/methodologie", label: "Méthodologie" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
  { href: "/conditions-utilisation", label: "Conditions & sources" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-branding">
            <Brand className="site-footer-brand" href="/" />
            <p>Explorer les données de transparence.</p>
          </div>
          <nav className="site-footer-links" aria-label="Informations du site">
            {footerLinks.map(({ href, label }) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} TranspaTech</span>
          <span>Données issues des rapports publics des éditeurs.</span>
        </div>
      </div>
    </footer>
  );
}
