import Link from 'next/link';

export const Header = () => {
  return (
    <div className="flex justify-center items-center relative top-3">
      <nav className="flex gap-1 p-0.5 border border-white/15 rounded-full bg-white/10 backdrop-blur">
        <Link href="/" className="nav-item">Home</Link>
        <Link href="/about" className="nav-item">About</Link>
        
        {/* Works dropdown */}
        <div className="relative group">
          <Link href="/works" className="nav-item flex items-center">
            Works
            <svg 
              className="ml-1 w-3 h-3 transition-transform group-hover:rotate-180" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          {/* Dropdown menu */}
          <div className="absolute top-full mt-2 left-0 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-lg p-1 shadow-lg">
              <Link href="/works/solo" className="menu-style">
                Solo
              </Link>
              <Link href="/works/duos-trios" className="menu-style">
                Duos & Trios
              </Link>
              <Link href="/works/chamber-ensembles" className="menu-style">
                Chamber Ensembles
              </Link>
              <Link href="/works/large-ensembles" className="menu-style">
                Large Ensembles
              </Link>
              <Link href="/works/multimedia-installations" className="menu-style">
                Multimedia & Installations
              </Link>
            </div>
          </div>
        </div>
        
        {/* Projects dropdown */}
        <div className="relative group">
          <Link href="/projects" className="nav-item flex items-center">
            Projects
            <svg 
              className="ml-1 w-3 h-3 transition-transform group-hover:rotate-180" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          {/* Dropdown menu */}
          <div className="absolute top-full mt-2 left-0 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-lg p-1 shadow-lg">
              <Link href="/projects/kaphca-trio" className="menu-style">
                Kaphca Trio
              </Link>
              <Link href="/projects/circulo-invencao-musical" className="menu-style">
                Círculo de Invenção Musical
              </Link>
              <Link href="/projects/poetry-visual-arts" className="menu-style">
                Poetry and Visual Arts
              </Link>
            </div>
          </div>
        </div>
        <Link href="/writings" className="nav-item">Writings</Link>
        <Link href="/contact" className="nav-item">Contact</Link>
      </nav>
    </div>
  );
};