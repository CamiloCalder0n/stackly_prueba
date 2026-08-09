import { Award, Lightbulb, Users, Zap } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

const values = [
  {
    icon: Lightbulb,
    title: 'Estrategia Clara',
    description: 'No vendemos por vender. Cada proyecto comienza con propósito definido.',
  },
  {
    icon: Zap,
    title: 'Ejecución Veloz',
    description: 'Desarrollo ágil y eficiente. Resultados sin burocracias ni demoras.',
  },
  {
    icon: Users,
    title: 'Verdadero Partner',
    description: 'Te entregamos el sitio funcionando y te explicamos cómo mantenerlo.',
  },
  {
    icon: Award,
    title: 'Calidad Obsesiva',
    description: 'Código limpio, diseño pulido, detalles cuidados. Estándares altos siempre.',
  },
];

const stats = [
  { number: '$0/mes', label: 'Sin cuotas ni comisiones' },
  { number: '100%', label: 'Dominio, código y datos tuyos' },
  { number: 'Sin candados', label: 'Las plantillas que entregamos no dependen de ningún SaaS' },
];

export default function About() {
  return (
    <section id="nosotros" className="py-20 md:py-32 bg-white">
      <div className="section-wrapper">
        {/* Main About */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-20">
          <div className="space-y-8">
            <div>
              <div className="badge mb-4">
                <span className="text-xs uppercase font-bold tracking-wide">Sobre nosotros</span>
              </div>
              <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
                Somos desarrolladores que entienden negocio.
              </h2>
            </div>

            {/* Decía "resultados medibles: más conversiones", que contradecía
                de frente a la sección de servicios ("nadie puede prometerte un
                puesto en Google ni un porcentaje de ventas"). Se queda la
                versión honesta. Tampoco se promete automatización: no aparece
                en ningún servicio ni en ninguno de los cuatro casos. */}
            <p className="text-lg text-text-secondary leading-relaxed">
              No creemos en webs bonitas pero inútiles. Cada sitio que entregamos tiene un
              canal de venta claro —catálogo, menú o reserva— que termina en una conversación
              por WhatsApp, y queda a nombre del cliente.
            </p>

            <div className="space-y-4">
              {[
                'Un canal de venta claro, no solo una web bonita',
                'Código moderno, limpio y mantenible',
                'Contenido indexable: catálogo y menú en HTML, nunca en PDF',
                'Transparencia total en cada etapa',
                'Te entregamos el código y te explicamos cómo editarlo',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  </div>
                  <span className="text-text-primary font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card rounded-2xl p-8 text-center hover:border-brand-primary/20 transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-black text-brand-primary mb-3">
                  {stat.number}
                </div>
                <p className="text-text-secondary font-medium text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
            <div className="col-span-full card rounded-2xl p-8 text-center bg-brand-light border-brand-primary/20 hover:border-brand-primary/40 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-black text-text-primary mb-2">
                Sin comisión por venta
              </div>
              <p className="text-text-secondary text-sm">
                Rappi retiene entre 25% y 30% de cada pedido; los SaaS de reservas cobran
                US$19-30 al mes de por vida. Un pedido o una reserva que entra por tu propio
                sitio no le paga nada a nadie.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-text-primary mb-2">Nuestros Principios</h3>
            <p className="text-text-secondary">Lo que guía cada proyecto.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="card rounded-2xl p-8 hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-brand-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-2">
                    {value.title}
                  </h4>
                  <p className="text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-lg text-text-secondary leading-relaxed mb-6">
            Cuéntanos qué vende tu negocio y cómo cierra hoy sus ventas. Te decimos qué
            plantilla aplica, qué contenido tendrías que reunir y qué costaría —
            y si no somos la opción adecuada, también te lo decimos.
          </p>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#contacto');
            }}
            className="btn-primary inline-flex"
          >
            Empecemos a hablar
          </a>
        </div>
      </div>
    </section>
  );
}
