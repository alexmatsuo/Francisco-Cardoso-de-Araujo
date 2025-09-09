"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const AdminHeader = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWorksOpen, setIsWorksOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsWorksOpen(false);
    setIsProjectsOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center items-center top-3 z-[10000]">
        <nav className="flex justify-center gap-8 px-8 py-6 border border-white/15 bg-black backdrop-blur w-full">
          {/* Back Button */}
          <Link
            href="/"
            className={`nav-item flex items-center ${
              isActive("/") ? "text-[#D3CEAD]" : ""
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Site
          </Link>

          <Link
            href="/admin"
            className={`nav-item ${
              isActive("/admin") ? "text-[#D3CEAD]" : ""
            }`}
          >
            Dashboard
          </Link>

          {/* Works dropdown */}
          <div className="relative group">
            <Link
              href="/admin/"
              className={`nav-item flex items-center ${
                pathname.startsWith("/admin/works") ? "text-[#D3CEAD]" : ""
              }`}
            >
              Works
              <svg
                className="ml-2 w-3 h-3 transition-transform group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <div className="absolute top-full mt-6 left-0 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[50]">
              <div className="border border-white/15 p-1 shadow-lg" style={{ backgroundColor: '#D3CEAD' }}>
                <Link href="/admin/works/solo" className="menu-style">
                  Solo
                </Link>
                <Link href="/admin/works/duos-trios" className="menu-style">
                  Duos & Trios
                </Link>
                <Link href="/admin/works/chamber-ensembles" className="menu-style">
                  Chamber Ensembles
                </Link>
                <Link href="/admin/works/large-ensembles" className="menu-style">
                  Large Ensembles
                </Link>
                <Link href="/admin/works/multimedia-installations" className="menu-style">
                  Multimedia & Installations
                </Link>
              </div>
            </div>
          </div>

          {/* Projects dropdown */}
          <div className="relative group">
            <Link
              href="/admin"
              className={`nav-item flex items-center ${
                pathname.startsWith("/admin/projects") ? "text-[#D3CEAD]" : ""
              }`}
            >
              Projects
              <svg
                className="ml-2 w-3 h-3 transition-transform group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <div className="absolute top-full mt-6 left-0 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[50]">
              <div className="border border-white/15 p-1 shadow-lg" style={{ backgroundColor: '#D3CEAD' }}>
                <Link href="/admin/projects/kaphca-trio" className="menu-style">
                  Kaphca Trio
                </Link>
                <Link href="/admin/projects/circulo-invencao-musical" className="menu-style">
                  Círculo de Invenção Musical
                </Link>
                <Link href="/admin/projects/poetry-visual-arts" className="menu-style">
                  Poetry and Visual Arts
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/admin/writings"
            className={`nav-item ${
              isActive("/admin/writings") ? "text-[#D3CEAD]" : ""
            }`}
          >
            Writings
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden relative top-3 z-[10000]">
        {/* Mobile Menu Button */}
        <div className="flex justify-left ml-6">
          <button
            onClick={toggleMobileMenu}
            className="p-3 border border-white/15 rounded-full bg-white/10 backdrop-blur"
            aria-label="Toggle mobile menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`absolute top-full mt-2 left-4 right-4 transition-all duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          }`}
        >
          <nav className="border border-white/15 rounded-lg p-6 shadow-lg bg-white/10 backdrop-blur">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="mobile-nav-item flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Site
              </Link>

              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="mobile-nav-item"
              >
                Dashboard
              </Link>

              {/* Mobile Works Section */}
              <div>
                <button
                  onClick={() => setIsWorksOpen(!isWorksOpen)}
                  className="mobile-nav-item w-full flex items-center justify-between"
                >
                  Works
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isWorksOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isWorksOpen && (
                  <div className="ml-4 mt-3 flex flex-col gap-3">
                    <Link
                      href="/admin/works/solo"
                      onClick={closeMobileMenu}
                      className="mobile-submenu-item"
                    >
                      Solo
                    </Link>
                    <Link
                      href="/admin/works/duos-trios"
                      onClick={closeMobileMenu}
                      className="mobile-submenu-item"
                    >
                      Duos & Trios
                    </Link>
                    <Link
                      href="/admin/works/chamber-ensembles"
                      onClick={closeMobileMenu}
                      className="mobile-submenu-item"
                    >
                      Chamber Ensembles
                    </Link>
                    <Link
                      href="/admin/works/large-ensembles"
                      onClick={closeMobileMenu}
                      className="mobile-submenu-item"
                    >
                      Large Ensembles
                    </Link>
                    <Link
                      href="/admin/works/multimedia-installations"
                      onClick={closeMobileMenu}
                      className="mobile-submenu-item"
                    >
                      Multimedia & Installations
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Projects Section */}
              <div>
                <button
                  onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                  className="mobile-nav-item w-full flex items-center justify-between"
                >
                  Projects
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProjectsOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isProjectsOpen && (
                  <div className="ml-4 mt-3 flex flex-col gap-3">
                    <Link
                      href="/admin/projects/kaphca-trio"
                      onClick={closeMobileMenu}
                      className="mobile-submenu-item"
                    >
                      Kaphca Trio
                    </Link>
                    <Link
                      href="/admin/projects/circulo-invencao-musical"
                      onClick={closeMobileMenu}
                      className="mobile-submenu-item"
                    >
                      Círculo de Invenção Musical
                    </Link>
                    <Link
                      href="/admin/projects/poetry-visual-arts"
                      onClick={closeMobileMenu}
                      className="mobile-submenu-item"
                    >
                      Poetry and Visual Arts
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/admin/writings"
                onClick={closeMobileMenu}
                className="mobile-nav-item"
              >
                Writings
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <style jsx>{`
        .mobile-nav-item {
          @apply block py-3 px-4 rounded-md hover:bg-black/10 transition-colors text-left text-black;
        }
        .mobile-submenu-item {
          @apply block py-2 px-4 rounded-md hover:bg-black/10 transition-colors text-sm opacity-80 hover:opacity-100 text-black;
        }
      `}</style>
    </>
  );
};