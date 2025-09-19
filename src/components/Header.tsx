'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWorksOpen, setIsWorksOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsWorksOpen(false);
    setIsProjectsOpen(false);
    setIsAboutOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex justify-center items-center top-3 z-50">
        <nav className="flex justify-center gap-8 xl:gap-32 lg:gap-16 px-4 xl:px-8 py-6 bg-black backdrop-blur w-full">
          <Link 
            href="/" 
            className={`nav-item ${isActive("/") ? "text-[#D3CEAD]" : ""}`}
          >
            Home
          </Link>
          
          {/* About dropdown */}
          <div className="relative group">
            <button 
              className={`nav-item flex items-center ${
                pathname.startsWith("/about") ? "text-[#D3CEAD]" : ""
              }`}
            >
              About
              <svg
                className="ml-2 w-3 h-3 transition-transform group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute top-full mt-6 left-0 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="border border-white/15 p-1 shadow-lg" style={{ backgroundColor: '#D3CEAD' }}>
                <Link href="/about/bio" className="menu-style">Bio</Link>
                <Link href="/about/photos" className="menu-style">Photos</Link>
              </div>
            </div>
          </div>
          
          {/* Works dropdown */}
          <div className="relative group">
            <button 
              className={`nav-item flex items-center ${
                pathname.startsWith("/works") ? "text-[#D3CEAD]" : ""
              }`}
            >
              Works
              <svg
                className="ml-2 w-3 h-3 transition-transform group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute top-full mt-6 left-0 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="border border-white/15 p-1 shadow-lg" style={{ backgroundColor: '#D3CEAD' }}>
                <Link href="/works" className="menu-style">Full Catalog</Link>
                <Link href="/works/solo" className="menu-style">Solo</Link>
                <Link href="/works/duos-trios" className="menu-style">Duos & Trios</Link>
                <Link href="/works/chamber-ensembles" className="menu-style">Chamber Ensembles</Link>
                <Link href="/works/large-ensembles" className="menu-style">Large Ensembles</Link>
                <Link href="/works/multimedia-installations" className="menu-style">Multimedia & Installations</Link>
              </div>
            </div>
          </div>
          
          {/* Projects dropdown */}
          <div className="relative group">
            <button 
              className={`nav-item flex items-center ${
                pathname.startsWith("/projects") ? "text-[#D3CEAD]" : ""
              }`}
            >
              Projects
              <svg
                className="ml-2 w-3 h-3 transition-transform group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute top-full mt-6 left-0 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="border border-white/15 p-1 shadow-lg" style={{ backgroundColor: '#D3CEAD' }}>
                <Link href="/projects/kaphca-trio" className="menu-style">Kaphca Trio</Link>
                <Link href="/projects/circulo-invencao-musical" className="menu-style">Círculo de Invenção Musical</Link>
                <Link href="/projects/poetry-visual-arts" className="menu-style">Poetry and Visual Arts</Link>
              </div>
            </div>
          </div>

          <Link 
            href="/events" 
            className={`nav-item ${isActive("/events") ? "text-[#D3CEAD]" : ""}`}
          >
            Events
          </Link>

          <Link 
            href="/contact" 
            className={`nav-item ${isActive("/contact") ? "text-[#D3CEAD]" : ""}`}
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Tablet Navigation (medium screens) */}
      <div className="hidden md:flex lg:hidden justify-center items-center top-3 z-50">
        <nav className="flex justify-center gap-4 px-4 py-6 bg-black backdrop-blur w-full flex-wrap">
          <Link 
            href="/" 
            className={`nav-item ${isActive("/") ? "text-[#D3CEAD]" : ""}`}
          >
            Home
          </Link>
          
          {/* About dropdown */}
          <div className="relative group">
            <button 
              className={`nav-item flex items-center ${
                pathname.startsWith("/about") ? "text-[#D3CEAD]" : ""
              }`}
            >
              About
              <svg
                className="ml-1 w-3 h-3 transition-transform group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute top-full mt-6 left-0 min-w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="border border-white/15 p-1 shadow-lg" style={{ backgroundColor: '#D3CEAD' }}>
                <Link href="/about/bio" className="menu-style text-sm">Bio</Link>
                <Link href="/about/photos" className="menu-style text-sm">Photos</Link>
              </div>
            </div>
          </div>
          
          {/* Works dropdown */}
          <div className="relative group">
            <button 
              className={`nav-item flex items-center ${
                pathname.startsWith("/works") ? "text-[#D3CEAD]" : ""
              }`}
            >
              Works
              <svg
                className="ml-1 w-3 h-3 transition-transform group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute top-full mt-6 left-0 min-w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="border border-white/15 p-1 shadow-lg" style={{ backgroundColor: '#D3CEAD' }}>
                <Link href="/works" className="menu-style text-sm">Full Catalog</Link>
                <Link href="/works/solo" className="menu-style text-sm">Solo</Link>
                <Link href="/works/duos-trios" className="menu-style text-sm">Duos & Trios</Link>
                <Link href="/works/chamber-ensembles" className="menu-style text-sm">Chamber Ensembles</Link>
                <Link href="/works/large-ensembles" className="menu-style text-sm">Large Ensembles</Link>
                <Link href="/works/multimedia-installations" className="menu-style text-sm">Multimedia & Installations</Link>
              </div>
            </div>
          </div>
          
          {/* Projects dropdown */}
          <div className="relative group">
            <button 
              className={`nav-item flex items-center ${
                pathname.startsWith("/projects") ? "text-[#D3CEAD]" : ""
              }`}
            >
              Projects
              <svg
                className="ml-1 w-3 h-3 transition-transform group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute top-full mt-6 left-0 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="border border-white/15 p-1 shadow-lg" style={{ backgroundColor: '#D3CEAD' }}>
                <Link href="/projects/kaphca-trio" className="menu-style text-sm">Kaphca Trio</Link>
                <Link href="/projects/circulo-invencao-musical" className="menu-style text-sm">Círculo de Invenção Musical</Link>
                <Link href="/projects/poetry-visual-arts" className="menu-style text-sm">Poetry and Visual Arts</Link>
              </div>
            </div>
          </div>

          <Link 
            href="/events" 
            className={`nav-item ${isActive("/events") ? "text-[#D3CEAD]" : ""}`}
          >
            Events
          </Link>

          <Link 
            href="/contact" 
            className={`nav-item ${isActive("/contact") ? "text-[#D3CEAD]" : ""}`}
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden relative top-3 z-40">
        {/* Mobile Menu Button */}
        <div className="flex justify-between items-center px-4 sm:px-8">
          <button
            onClick={toggleMobileMenu}
            className="p-4 backdrop-blur mt-6 border-2 border-white/20 hover:border-white/40 transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg
              className={`w-8 h-8 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu */}
        <div className={`absolute top-full mt-2 left-2 right-2 sm:left-4 sm:right-4 transition-all duration-300 z-40 ${
          isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}>
          <nav className="p-4 sm:p-6 shadow-lg bg-[#C3BE9D]/30 text-black backdrop-blur max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-3 sm:gap-4">
              <Link 
                href="/" 
                onClick={closeMobileMenu} 
                className={`mobile-nav-item ${isActive("/") ? "text-[#D3CEAD]" : ""}`}
              >
                Home
              </Link>
              
              {/* Mobile About Section */}
              <div>
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className={`mobile-nav-item w-full flex items-center justify-between ${
                    pathname.startsWith("/about") ? "text-[#D3CEAD]" : ""
                  }`}
                >
                  About
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isAboutOpen && (
                  <div className="ml-3 sm:ml-4 mt-2 sm:mt-3 flex flex-col gap-2 sm:gap-3">
                    <Link href="/about/bio" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/about/bio") ? "text-[#D3CEAD]" : ""}`}>
                      Bio
                    </Link>
                    <Link href="/about/photos" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/about/photos") ? "text-[#D3CEAD]" : ""}`}>
                      Photos
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Works Section */}
              <div>
                <button
                  onClick={() => setIsWorksOpen(!isWorksOpen)}
                  className={`mobile-nav-item w-full flex items-center justify-between ${
                    pathname.startsWith("/works") ? "text-[#D3CEAD]" : ""
                  }`}
                >
                  Works
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isWorksOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isWorksOpen && (
                  <div className="ml-3 sm:ml-4 mt-2 sm:mt-3 flex flex-col gap-2 sm:gap-3">
                    <Link href="/works" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/works") ? "text-[#D3CEAD]" : ""}`}>
                      Full Catalog
                    </Link>
                    <Link href="/works/solo" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/works/solo") ? "text-[#D3CEAD]" : ""}`}>
                      Solo
                    </Link>
                    <Link href="/works/duos-trios" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/works/duos-trios") ? "text-[#D3CEAD]" : ""}`}>
                      Duos & Trios
                    </Link>
                    <Link href="/works/chamber-ensembles" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/works/chamber-ensembles") ? "text-[#D3CEAD]" : ""}`}>
                      Chamber Ensembles
                    </Link>
                    <Link href="/works/large-ensembles" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/works/large-ensembles") ? "text-[#D3CEAD]" : ""}`}>
                      Large Ensembles
                    </Link>
                    <Link href="/works/multimedia-installations" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/works/multimedia-installations") ? "text-[#D3CEAD]" : ""}`}>
                      Multimedia & Installations
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Projects Section */}
              <div>
                <button
                  onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                  className={`mobile-nav-item w-full flex items-center justify-between ${
                    pathname.startsWith("/projects") ? "text-[#D3CEAD]" : ""
                  }`}
                >
                  Projects
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isProjectsOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isProjectsOpen && (
                  <div className="ml-3 sm:ml-4 mt-2 sm:mt-3 flex flex-col gap-2 sm:gap-3">
                    <Link href="/projects/kaphca-trio" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/projects/kaphca-trio") ? "text-[#D3CEAD]" : ""}`}>
                      Kaphca Trio
                    </Link>
                    <Link href="/projects/circulo-invencao-musical" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/projects/circulo-invencao-musical") ? "text-[#D3CEAD]" : ""}`}>
                      Círculo de Invenção Musical
                    </Link>
                    <Link href="/projects/poetry-visual-arts" onClick={closeMobileMenu} className={`mobile-submenu-item ${isActive("/projects/poetry-visual-arts") ? "text-[#D3CEAD]" : ""}`}>
                      Poetry and Visual Arts
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/events" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive("/events") ? "text-[#D3CEAD]" : ""}`}>
                Events
              </Link>
              <Link href="/contact" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive("/contact") ? "text-[#D3CEAD]" : ""}`}>
                Contact
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <style jsx>{`
        .mobile-nav-item {
          @apply block py-2 sm:py-3 px-3 sm:px-4 hover:bg-black/10 transition-colors text-left text-black text-sm sm:text-base;
        }
        .mobile-submenu-item {
          @apply block py-1.5 sm:py-2 px-3 sm:px-4 hover:bg-black/10 transition-colors text-xs sm:text-sm opacity-80 hover:opacity-100 text-black;
        }
      `}</style>
    </>
  );
};