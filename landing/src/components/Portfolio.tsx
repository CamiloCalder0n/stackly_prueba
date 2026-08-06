import { ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    id: '1',
    company: 'Celesse Jewel',
    industry: 'Joyería',
    problem: 'Sin vitrina propia: el catálogo vivía solo en fotos sueltas de WhatsApp',
    solution: 'Catálogo filtrable con ficha por pieza, certificado de materiales y pedido directo por WhatsApp',
    result: 'Sitio en producción, Lighthouse 95-98, sin cuota mensual de plataforma',
    imageUrl: '/portfolio/celesse-jewel.jpg',
    liveUrl: 'https://stackly-joyeria-539.netlify.app',
  },
  {
    id: '2',
    company: 'Barbería El Patrón',
    industry: 'Barbería',
    problem: 'Agendaba por teléfono y perdía turnos en el camino',
    solution: 'Wizard de reserva en 3 pasos — servicio, barbero y hora — que arma el mensaje de WhatsApp solo',
    result: 'Cero llamadas, cero cuota mensual (Booksy cobra US$30/mes por lo mismo)',
    imageUrl: '/portfolio/barberia-el-patron.jpg',
    liveUrl: 'https://stackly-barberia-185.netlify.app',
  },
  {
    id: '3',
    company: 'La Terraza Cocina Local',
    industry: 'Restaurante',
    problem: 'Menú solo en PDF, invisible para Google, pedidos que se iban a apps con comisión',
    solution: 'Menú digital indexable (nunca PDF) + canal de pedidos propio por WhatsApp',
    result: 'Recupera el 25-30% de margen que se queda en las apps de domicilio',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    liveUrl: 'https://stackly-restaurante-183.netlify.app',
  },
];

export default function Portfolio() {
  return (
    <section id="portafolio" className="py-20 md:py-32 bg-white">
      <div className="section-wrapper">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="badge justify-center mb-4">
            <span className="text-xs uppercase font-bold tracking-wide">Casos Reales</span>
          </div>
          <h2 className="section-title text-5xl md:text-5xl mb-6">
            Negocios como el tuyo, ya creciendo
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Historias reales de emprendedores que transformaron su presencia digital.
          </p>
        </div>

        <div className="space-y-6">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className="card rounded-2xl overflow-hidden group hover:border-brand-primary/40 transition-all duration-300"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="h-64 md:h-auto min-h-[280px] overflow-hidden bg-bg-main">
                  <img
                    src={study.imageUrl}
                    alt={study.company}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content Side */}
                <div className="p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold text-brand-primary bg-brand-light px-3 py-1 rounded-full">
                        {study.industry}
                      </span>
                    </div>

                    <h3 className="text-3xl font-black text-text-primary mb-8">
                      {study.company}
                    </h3>

                    <div className="space-y-6">
                      {/* Problem */}
                      <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                          El desafío
                        </p>
                        <p className="text-lg text-text-primary">
                          {study.problem}
                        </p>
                      </div>

                      {/* Solution */}
                      <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                          Nuestra solución
                        </p>
                        <p className="text-lg text-text-primary">
                          {study.solution}
                        </p>
                      </div>

                      {/* Result */}
                      <div className="pt-2 border-t border-border-color">
                        <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                          El resultado
                        </p>
                        <p className="text-xl font-bold text-text-primary">
                          {study.result}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border-color flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a
                      href="#contacto"
                      className="inline-flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all text-sm group/link"
                    >
                      Quiero un caso similar
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href={study.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary font-medium text-sm hover:text-text-primary transition-colors underline underline-offset-4"
                    >
                      Ver el sitio en vivo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-12 rounded-2xl bg-brand-light text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            ¿Tu negocio podría crecer así?
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Cada negocio es único. Nos encantaría conocer tu historia y ayudarte a escribir el siguiente capítulo.
          </p>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector('#contacto');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary"
          >
            Hablemos de tu proyecto
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
