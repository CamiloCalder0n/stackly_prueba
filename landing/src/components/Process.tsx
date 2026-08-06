import { Search, Palette, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: 1,
    title: 'Descubrimiento',
    description: 'Entendemos tu visión, audiencia y objetivos. Realizamos research y definimos la estrategia juntos.',
    icon: Search,
  },
  {
    step: 2,
    title: 'Diseño & Desarrollo',
    description: 'Creamos tu solución: diseño limpio, código rápido y automatización integrada desde el inicio.',
    icon: Palette,
  },
  {
    step: 3,
    title: 'Lanzamiento',
    description: 'Deploying, testing, optimización y soporte post-lanzamiento. Tu proyecto está en buenas manos.',
    icon: CheckCircle2,
  },
];

export default function Process() {
  return (
    <section id="proceso" className="py-20 md:py-32 bg-gradient-to-b from-white via-brand-light/20 to-white">
      <div className="section-wrapper">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="badge justify-center mb-4">
            <span className="text-xs uppercase font-bold tracking-wide">Proceso</span>
          </div>
          <h2 className="section-title text-5xl md:text-5xl mb-6">
            3 pasos. Cero fricción.
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Un proceso simple, transparente y enfocado en resultados.
            Sin complicaciones ni sorpresas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="group">
                <div className="card rounded-2xl p-8 h-full flex flex-col hover:shadow-lg hover:border-brand-primary/20 transition-all duration-300">
                  {/* Icon with step number badge */}
                  <div className="relative mb-6 w-fit">
                    <div className="w-14 h-14 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon size={28} className="text-brand-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
                      <span className="text-xs font-black text-white">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed flex-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Info */}
        <div className="card rounded-2xl p-10 md:p-12 bg-brand-light border-brand-primary/20 text-center max-w-2xl mx-auto">
          <p className="text-text-primary mb-2">
            Un proyecto típico suele tomar
            {' '}
            <span className="font-black text-xl text-brand-primary">3 a 4 semanas</span>
          </p>
          <p className="text-text-secondary text-sm">
            El plazo depende del alcance y de qué tan rápido llegue tu contenido —
            fotos, textos y precios. Te reportamos avances cada semana y ajustamos en cada fase.
          </p>
        </div>
      </div>
    </section>
  );
}
