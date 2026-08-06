import { Leaf, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { scrollToSection } from '../hooks/useScrollSpy';

const quickLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#solucion' },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Sobre Nosotros', href: '#nosotros' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-text-primary text-white py-16 relative">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 pb-12 border-b border-white/10">
          <div className="space-y-5">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#inicio');
              }}
              className="flex items-center gap-2 group w-fit"
            >
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Leaf size={18} className="text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-lg">Stackly</span>
            </a>
            <p className="text-white/60 text-sm leading-relaxed">
              Automatización inteligente y desarrollo web que genera resultados reales.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Navegación</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-white/60 hover:text-brand-on-dark transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contacto</h4>
            <div className="space-y-3 mb-6">
              <a
                href="mailto:hola@stackly.dev"
                className="flex items-center gap-2 text-brand-on-dark hover:text-brand-light transition-colors"
              >
                <Mail size={16} aria-hidden="true" />
                <span className="text-sm">hola@stackly.dev</span>
              </a>
              <p className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin size={16} aria-hidden="true" />
                Bucaramanga, Colombia
              </p>
            </div>
            <a
              href="#contacto"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contacto');
              }}
              className="inline-flex items-center gap-2 text-brand-on-dark font-semibold hover:gap-3 transition-all text-sm"
            >
              Solicitar presupuesto
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© {year} Stackly. Todos los derechos reservados.</p>
          <a href="/privacidad.html" className="hover:text-white transition-colors">
            Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}
