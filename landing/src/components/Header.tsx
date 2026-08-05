import { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

const sectionIds = ['inicio', 'servicios', 'portafolio', 'nosotros', 'proceso', 'contacto'];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-brand-primary/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="section-wrapper">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#inicio');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">
              Stackly
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-brand-primary bg-brand-light'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contacto"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contacto');
              }}
              className="btn-primary text-sm"
            >
              Solicitar presupuesto
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="md:hidden card mb-2 py-4">
            <div className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-brand-light rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 px-3">
                <a
                  href="#contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contacto');
                  }}
                  className="btn-primary text-sm w-full justify-center"
                >
                  Solicitar presupuesto
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
