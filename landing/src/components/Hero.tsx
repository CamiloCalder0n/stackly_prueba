import { ArrowRight, BarChart3, Users, Zap } from 'lucide-react';

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="pt-32 pb-20 md:pt-40 md:pb-24 bg-bg-main relative overflow-hidden">
      <div className="section-wrapper">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column - Copy */}
          <div className="space-y-10 max-w-xl">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-7xl font-black leading-[1.1] text-text-primary">
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
              Trabajamos con empresas que quieren crecer de verdad.
              <span className="text-brand-primary font-semibold"> Desde startups hasta marcas establecidas.</span>
            </p>
          </div>

          {/* Right Column - Dashboard Mockup */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-sm relative">
              {/* Main Dashboard Card */}
              <div className="card rounded-2xl p-6 space-y-5 shadow-lg">
                {/* Browser Header */}
                <div className="flex items-center gap-2 pb-4 border-b border-border-color">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-brand-primary" />
                  </div>
                  <span className="text-xs text-text-muted ml-3 font-mono">stackly.dashboard</span>
                </div>

                {/* Dashboard Content */}
                <div className="space-y-4">
                  {/* Top Metrics Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Users, label: 'Clientes', color: 'bg-blue-50 text-blue-600' },
                      { icon: BarChart3, label: 'Conversión', color: 'bg-green-50 text-brand-primary' },
                      { icon: Zap, label: 'Velocidad', color: 'bg-purple-50 text-purple-600' },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-bg-main">
                        <div className={`w-6 h-6 rounded-md ${item.color} flex items-center justify-center mb-2`}>
                          <item.icon size={14} />
                        </div>
                        <span className="text-xs text-text-muted">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chart/Graph Area */}
                  <div className="p-4 bg-bg-main rounded-lg">
                    <div className="flex items-end justify-between gap-2 h-24">
                      {[40, 55, 48, 72, 65, 80, 70].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-brand-primary rounded-t-sm transition-all"
                          style={{ height: `${height}%`, opacity: 0.6 + (i * 0.05) }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-muted mt-3 text-center">Últimas 7 semanas</p>
                  </div>

                  {/* Status Pill */}
                  <div className="p-3 rounded-lg bg-green-50 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                    <span className="text-xs text-green-700 font-semibold">Todos los sistemas activos</span>
                  </div>
                </div>
              </div>

              {/* Floating Feature Card 1 */}
              <div className="absolute -bottom-6 -right-6 card rounded-xl p-4 shadow-md w-44 bg-white border border-brand-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center">
                    <Zap size={16} className="text-brand-primary" />
                  </div>
                  <span className="text-sm font-bold text-text-primary">Performance</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Optimizado para velocidad y SEO
                </p>
              </div>

              {/* Floating Feature Card 2 */}
              <div className="absolute -top-4 -left-8 card rounded-xl p-4 shadow-md w-44 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-bold text-text-primary">Analytics</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Seguimiento completo de conversiones
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only simplified dashboard */}
        <div className="lg:hidden mt-12">
          <div className="card rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-border-color">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
              </div>
              <span className="text-xs text-text-muted ml-2 font-mono">dashboard</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Clientes', value: '↑ 42%' },
                { label: 'Conversión', value: '8.2%' },
                { label: 'Velocidad', value: '0.9s' },
              ].map((item, i) => (
                <div key={i} className="p-2 bg-bg-main rounded">
                  <p className="text-xs text-text-muted">{item.label}</p>
                  <p className="text-sm font-bold text-brand-primary">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-green-50 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span className="text-xs text-green-700 font-semibold">Sistema activo</span>
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
