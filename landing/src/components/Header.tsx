import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { useScrollSpy, scrollToSection } from '../hooks/useScrollSpy';

/**
 * `match` lista las secciones que dejan el enlace marcado como activo:
 * "Servicios" cubre el bloque problema + solución, que van seguidos.
 */
const navLinks = [
  { label: 'Inicio', href: '#inicio', match: ['inicio'] },
  { label: 'Servicios', href: '#solucion', match: ['problema', 'solucion'] },
  { label: 'Portafolio', href: '#portafolio', match: ['portafolio'] },
  { label: 'Nosotros', href: '#nosotros', match: ['nosotros'] },
  { label: 'Proceso', href: '#proceso', match: ['proceso'] },
  { label: 'Contacto', href: '#contacto', match: ['contacto'] },
];

// Ids reales renderizados por Hero, Services, Portfolio, About, Process y CTA.
const sectionIds = [
  'inicio',
  'problema',
  'solucion',
  'portafolio',
  'nosotros',
  'proceso',
  'contacto',
];

const MOBILE_MENU_ID = 'menu-movil';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy(sectionIds);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = useCallback((returnFocus = true) => {
    setMobileOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Bloquea el scroll de fondo, lleva el foco al menú al abrirlo y lo atrapa
  // dentro mientras esté abierto (Escape y clic fuera lo cierran).
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const focusables = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (current === first || !current || !items.includes(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      closeMenu(false);
    };

    // Al pasar a escritorio el panel se oculta con `md:hidden`: hay que cerrarlo
    // o el scroll del body quedaría bloqueado sin nada visible que lo explique.
    const mq = window.matchMedia('(min-width: 768px)');
    const onBreakpoint = () => {
      if (mq.matches) closeMenu(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    mq.addEventListener('change', onBreakpoint);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      mq.removeEventListener('change', onBreakpoint);
    };
  }, [mobileOpen, closeMenu]);

  const handleNavClick = (href: string, fromMobile = false) => {
    if (fromMobile) closeMenu(false);
    scrollToSection(href);
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
        <nav className="flex items-center justify-between h-16 lg:h-20" aria-label="Principal">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#inicio');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-text-primary">
              Stackly
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection !== null && link.match.includes(activeSection);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
            ref={toggleRef}
            type="button"
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white transition-colors"
            onClick={() => (mobileOpen ? closeMenu(false) : setMobileOpen(true))}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_MENU_ID}
          >
            {mobileOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </nav>

        {mobileOpen && (
          <div
            id={MOBILE_MENU_ID}
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="md:hidden card mb-2 py-4"
          >
            <div className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => {
                const isActive = activeSection !== null && link.match.includes(activeSection);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href, true);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-brand-primary bg-brand-light'
                        : 'text-text-secondary hover:text-text-primary hover:bg-brand-light'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="pt-2 px-3">
                <a
                  href="#contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contacto', true);
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
