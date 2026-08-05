import { Leaf, Mail, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Sobre Nosotros', href: '#nosotros' },
  { label: 'Proceso', href: '#proceso' },
];

const services = ['Web Design', 'Desarrollo', 'Automatización', 'SEO', 'Mantenimiento'];
const socials = [
  { label: 'Twitter', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
];

export default function Footer() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-text-primary text-white py-16 relative">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-12 border-b border-white/10">
          <div className="space-y-5">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                handleScroll('#inicio');
              }}
              className="flex items-center gap-2 group w-fit"
            >
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">Stackly</span>
            </a>
            <p className="text-white/60 text-sm leading-relaxed">
              Automatización inteligente y desarrollo web que genera resultados reales.
            </p>
            <a
              href="mailto:hola@stackly.dev"
              className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-light transition-colors"
            >
              <Mail size={16} />
              <span className="text-sm">hola@stackly.dev</span>
            </a>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-brand-primary transition-colors"
                >
                  {social.label[0]}
                </a>
              ))}
            </div>
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
                      handleScroll(link.href);
                    }}
                    className="text-white/60 hover:text-brand-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Servicios</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-white/60 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Conecta</h4>
            <div className="space-y-2 mb-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="block text-white/60 hover:text-brand-primary transition-colors text-sm"
                >
                  {social.label}
                </a>
              ))}
            </div>
            <a
              href="mailto:hola@stackly.dev"
              className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:gap-3 transition-all text-sm"
            >
              Presupuesto
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© 2025 Stackly. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
