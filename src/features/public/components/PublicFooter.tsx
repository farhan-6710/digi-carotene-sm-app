import { Link } from "react-router";
import { agencyMeta } from "@/features/public/constants/public";
import { ArrowUpRight } from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      ),
      href: "https://youtube.com",
      label: "YouTube",
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 sm:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">
                D
              </span>
              {agencyMeta.name}
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              {agencyMeta.description}
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-8 items-center justify-center rounded-full border border-border/40 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="/#services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Portals
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/auth" className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  Client Portal
                  <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/auth" className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  Team Login
                  <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-border/40" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <p>&copy; {currentYear} {agencyMeta.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
