import { ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    id: '1',
    company: 'EcoStore',
    industry: 'eCommerce',
    problem: 'Vendían solo en Instagram, sin tienda propia',
    solution: 'Sitio web rápido y optimizado para compras',
    result: 'Ahora venden directamente desde su web',
    imageUrl: 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '2',
    company: 'FinanceApp',
    industry: 'SaaS',
    problem: 'Perdían leads en el proceso de signup',
    solution: 'Rediseñamos el flujo y dashboard',
    result: 'El proceso ahora es claro y retienen usuarios',
    imageUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '3',
    company: 'Restaurant Pro',
    industry: 'Gastronomía',
    problem: 'Reservas solo por teléfono, mucho trabajo manual',
    solution: 'Sistema de reservas online automatizado',
    result: 'Reciben reservas 24/7 sin intervención',
    imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600',
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

                  <div className="mt-8 pt-6 border-t border-border-color">
                    <a
                      href="#contacto"
                      className="inline-flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all text-sm group/link"
                    >
                      Quiero un caso similar
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
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
