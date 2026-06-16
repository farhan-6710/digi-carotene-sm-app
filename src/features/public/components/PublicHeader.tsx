import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, ArrowRight, UserRound, Users } from "lucide-react";
import { agencyMeta, publicNavLinks } from "@/features/public/constants/public";
import { Button } from "@/shared/ui/button";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.includes("#") && location.pathname === "/") {
      const id = to.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-background/40 backdrop-blur-xs"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            D
          </span>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {agencyMeta.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {publicNavLinks.map((link) => {
            const isHash = link.to.includes("#");
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={(e) => handleHashClick(e, link.to)}
                end={link.to === "/"}
                className={({ isActive }) =>
                  [
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    !isHash && isActive
                      ? "text-primary bg-primary/5 dark:bg-primary/10"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Portal Access Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" className="rounded-full text-sm font-medium text-muted-foreground hover:text-foreground">
            <Link to="/auth" className="flex items-center gap-1.5">
              <Users className="size-4" />
              Client Portal
            </Link>
          </Button>
          <Button asChild className="rounded-full shadow-md hover:shadow-primary/20 transition-all duration-300">
            <Link to="/auth" className="flex items-center gap-1.5">
              <UserRound className="size-4" />
              Team Login
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-10 items-center justify-center rounded-full border border-border/40 bg-muted/30 text-foreground md:hidden hover:bg-muted/60 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="border-b border-border/40 bg-background/95 backdrop-blur-lg md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="space-y-3 px-6 py-6">
            <div className="flex flex-col gap-1">
              {publicNavLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleHashClick(e, link.to)}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    [
                      "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                      isActive && !link.to.includes("#")
                        ? "bg-primary/5 text-primary dark:bg-primary/10"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <hr className="border-border/40" />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button asChild variant="outline" className="rounded-full w-full justify-center">
                <Link to="/auth" className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  Client Portal
                </Link>
              </Button>
              <Button asChild className="rounded-full w-full justify-center">
                <Link to="/auth" className="flex items-center gap-1.5">
                  <UserRound className="size-4" />
                  Team Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
