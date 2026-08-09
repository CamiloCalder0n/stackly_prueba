import { ArrowRight, MessageCircle, Zap } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

/* Lo que sí podemos sostener del stack, sin métricas inventadas. */
const highlights = [
  {
    icon: Zap,
    title: 'Sitio estático',
    desc: 'HTML servido desde CDN: sin servidor ni base de datos que mantener.',
  },
  {
    icon: MessageCircle,
    title: 'Cero cuotas',
    desc: 'Contacto y pedidos por WhatsApp, sin mensualidad ni comisión por venta.',
  },
];

export default function Hero() {
  const handleScroll = (href: string) => {
    scrollToSection(href);
  };

  return (
    <section id="inicio" className="pt-32 pb-20 md:pt-40 md:pb-24 bg-bg-main relative overflow-hidden">
      <div className="section-wrapper">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column - Copy */}
          <div className="space-y-10 max-w-xl">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] text-text-primary">
                Diseño que vende. Tecnología que crece.
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-light">
                Webs modernas, automatizadas y orientadas a resultados.
                Construimos soluciones que convierten visitantes en clientes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => handleScroll('#contacto')}
                className="btn-primary text-base font-bold"
              >
                Empezar proyecto
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => handleScroll('#portafolio')}
                className="btn-secondary text-base font-bold"
              >
                Ver portafolio
              </button>
            </div>

            <p className="text-sm text-text-muted pt-6">
              Plantillas propias para joyerías, barberías y restaurantes.
              <span className="text-brand-primary font-semibold"> El dominio, el código y los datos quedan a tu nombre.</span>
            </p>
          </div>

          {/* Columna derecha: una plantilla real que ya entregamos.
              Una sola fuente de verdad, responsive — sin variante móvil aparte
              y sin métricas de mentira. */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md lg:max-w-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((item) => (
                  <div key={item.title} className="card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                        <item.icon size={16} className="text-brand-primary" />
                      </div>
                      <span className="text-sm font-bold text-text-primary">{item.title}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce">
        <p className="text-xs text-text-muted font-semibold">Desplazar</p>
        <div className="w-px h-6 bg-gradient-to-b from-brand-primary to-transparent" />
      </div>
    </section>
  );
}
