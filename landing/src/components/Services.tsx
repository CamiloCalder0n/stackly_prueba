import { AlertCircle, TrendingDown, Clock, Zap, Gauge, Users } from 'lucide-react';

export default function Services() {
  return (
    <>
      {/* PROBLEM SECTION */}
      <section id="problema" className="py-20 md:py-32 bg-bg-main">
        <div className="section-wrapper">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="badge justify-center mb-4">
              <span className="text-xs uppercase font-bold tracking-wide">El Problema</span>
            </div>
            <h2 className="section-title text-5xl md:text-5xl mb-6">
              Webs sin conversiones
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              La mayoría de agencias entregan webs bonitas pero inefectivas.
              Diseño sin estrategia, tecnología anticuada y sin resultados medibles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingDown,
                title: 'Conversiones nulas',
                desc: 'Webs lindas que no venden nada. Diseño sin propósito de negocio.',
              },
              {
                icon: Clock,
                title: 'Lentitud extrema',
                desc: 'Sitios que cargan en 5+ segundos. Usuarios que se van a la competencia.',
              },
              {
                icon: AlertCircle,
                title: 'Sin automatización',
                desc: 'Procesos manuales, leads perdidos, oportunidades olvidadas.',
              },
            ].map((item, i) => (
              <div key={i} className="card p-8">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-6">
                  <item.icon size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{item.title}</h3>
                <p className="text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="solucion" className="py-20 md:py-32 bg-white">
        <div className="section-wrapper">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="badge justify-center mb-4">
              <span className="text-xs uppercase font-bold tracking-wide">La Solución</span>
            </div>
            <h2 className="section-title text-5xl md:text-5xl mb-6">
              Tecnología que vende
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Webs automatizadas, veloces y optimizadas para convertir.
              Cada elemento diseñado con propósito de negocio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, label: 'Ultra rápido', desc: '< 1.2s de carga' },
              { icon: Gauge, label: 'Automatizado', desc: 'Procesos sin intervención' },
              { icon: Users, label: 'SEO nativo', desc: 'Top 3 en Google' },
              { icon: Zap, label: 'High conversion', desc: '50%+ más leads' },
            ].map((item, i) => (
              <div key={i} className="card-hover p-6">
                <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-brand-primary" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">{item.label}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
