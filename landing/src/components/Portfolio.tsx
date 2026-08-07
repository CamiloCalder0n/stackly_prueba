import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

/**
 * Portafolio: galería de capturas reales, sin enlaces a despliegues.
 *
 * Los tres botones "Ver el sitio en vivo" apuntaban a URLs de Netlify que
 * devolvían 404 (despliegues en borrador que nunca se promovieron), así que
 * el portafolio pasa a ser una galería de capturas: nada que se pueda romper.
 *
 * Reglas de copy: cada afirmación de `resultado` tiene que ser defendible.
 * Por eso cada caso lleva `resultadoEtiqueta` (un dato medido no es lo mismo
 * que un dato del sector ni que un proyecto en curso) y `resultadoFuente`,
 * que dice de dónde sale el número. Nada de métricas de negocio inventadas.
 */

type Captura = {
  src: string;
  /** Describe lo que SE VE en la captura, no el nombre del negocio. */
  alt: string;
  /** Etiqueta corta para el contador del lightbox. */
  titulo: string;
  /** Dimensiones intrínsecas reales del archivo: sin esto hay CLS. */
  width: number;
  height: number;
};

type Caso = {
  id: string;
  negocio: string;
  sector: string;
  problema: string;
  solucion: string;
  resultado: string;
  /** El encabezado del bloque cambia según qué TIPO de afirmación es. */
  resultadoEtiqueta: string;
  /** De dónde sale el dato. Si no se puede citar, no se publica. */
  resultadoFuente: string;
  capturas: Captura[];
};

/* Las capturas de escritorio son 1400x875; las que terminan en `-m` son la
   versión móvil, 240x520. Se declaran los tamaños reales para que el
   navegador reserve el hueco antes de descargar la imagen. */
const ESCRITORIO = { width: 1400, height: 875 };
const MOVIL = { width: 240, height: 520 };

const casos: Caso[] = [
  {
    id: 'joyeria',
    negocio: 'Celesse Jewel',
    sector: 'Joyería',
    problema:
      'Sin vitrina propia: el catálogo vivía en fotos sueltas de WhatsApp, imposibles de filtrar y invisibles para Google.',
    solucion:
      'Catálogo filtrable con ficha por pieza —precio, disponibilidad real, garantía y certificado de materiales por escrito— y un cotizador de encargos a medida de seis pasos.',
    resultado:
      'Lighthouse móvil de 95 a 98 en rendimiento y de 97 a 100 en accesibilidad, con LCP entre 2,0 y 2,6 s. Sin cuota mensual de plataforma.',
    resultadoEtiqueta: 'Medido en producción',
    resultadoFuente: 'Lighthouse móvil sobre el build de producción de la plantilla.',
    capturas: [
      {
        src: '/portfolio/joyeria-catalogo.jpg',
        alt: 'Catálogo de Celesse Jewel: panel de filtros por categoría, precio y disponibilidad a la izquierda, contador de 12 productos, selector de orden alfabético y una grilla de anillos y aretes sobre fondo blanco.',
        titulo: 'Catálogo con filtros',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/joyeria-pieza.jpg',
        alt: 'Ficha del Anillo Alba: foto grande del anillo en su estuche de madera, precio de $1.950.000, marca verde de disponible con dos piezas restantes, y tres bloques de confianza — garantía escrita de un año, primer ajuste de talla sin costo y certificado de materiales — sobre una fila de medios de pago.',
        titulo: 'Ficha de pieza',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/joyeria-encargos.jpg',
        alt: 'Cotizador de encargos en el paso 1 de 6: la pregunta "¿Qué quieres encargar?" con seis opciones de tipo de pieza —anillo, collar, aretes, pulsera, argollas de matrimonio y otro— y un botón dorado de Continuar.',
        titulo: 'Encargos a medida',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/joyeria-catalogo-m.jpg',
        alt: 'El mismo catálogo en pantalla de móvil: los filtros se pliegan sobre la grilla de piezas, que pasa a una sola columna.',
        titulo: 'Catálogo en móvil',
        ...MOVIL,
      },
    ],
  },
  {
    id: 'barberia',
    negocio: 'Barbería El Patrón',
    sector: 'Barbería',
    problema:
      'Agendaba por teléfono y por mensaje directo: cada cita costaba una conversación y los precios había que preguntarlos.',
    solucion:
      'Wizard de reserva en tres pasos —servicio, barbero, fecha y hora— que arma solo el mensaje de WhatsApp con la cita completa. Precios siempre visibles, sin registro y sin pago por adelantado.',
    resultado:
      'El sitio es del negocio, sin cuota mensual. Booksy cobra US$29,99 al mes más US$20 por cada barbero adicional; AgendaPro, entre €49 y €129 al mes según el plan.',
    resultadoEtiqueta: 'Comparación de costos',
    resultadoFuente:
      'Precios públicos de Booksy y AgendaPro recogidos en nuestra investigación del sector.',
    capturas: [
      {
        src: '/portfolio/barberia-reserva.jpg',
        alt: 'Wizard de reserva de Barbería El Patrón sobre fondo negro: título "Tu cita en 3 pasos", una barra de progreso con servicio, barbero y fecha y hora, y en el paso 1 las tarjetas de servicio con precio y duración — corte clásico $35.000 en 45 minutos, corte más barba $55.000 en 75 minutos.',
        titulo: 'Wizard de reserva',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/barberia-servicios.jpg',
        alt: 'Lista de precios titulada "Precios claros, sin sorpresas": corte clásico $35.000, corte más barba $55.000 y arreglo de barba $25.000, cada uno con su duración y un botón Reservar al lado.',
        titulo: 'Precios',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/barberia-reserva-m.jpg',
        alt: 'El wizard de reserva en pantalla de móvil: los tres pasos se reducen a círculos numerados y las tarjetas de servicio quedan una debajo de otra.',
        titulo: 'Reserva en móvil',
        ...MOVIL,
      },
    ],
  },
  {
    id: 'restaurante',
    negocio: 'La Terraza Cocina Local',
    sector: 'Restaurante',
    problema:
      'El menú solo existía en PDF —invisible para Google— y los pedidos se iban a las apps de domicilio.',
    solucion:
      'Menú digital indexable, nunca un PDF: platos por categoría con foto y precio al día, y canal de pedidos propio por WhatsApp, a domicilio o para recoger.',
    resultado:
      'Las apps de domicilio se quedan con un 25-30% de comisión por pedido. Cada pedido que entra por el canal propio no paga esa comisión.',
    resultadoEtiqueta: 'Dato del sector',
    resultadoFuente:
      'Rango de comisión habitual en el sector según nuestra investigación de mercado, no una cifra medida en este cliente.',
    capturas: [
      {
        src: '/portfolio/restaurante-menu.jpg',
        alt: 'Menú digital de La Terraza: encabezado "El menú" con el aviso de abierto ahora y hora de cierre, pestañas de entradas, platos fuertes, parrilla, bebidas y postres, y las entradas listadas con foto y precio — chorizo santandereano con arepa $15.000, empanadas santandereanas $12.000.',
        titulo: 'Menú digital',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/restaurante-portada.jpg',
        alt: 'Portada del restaurante: foto a pantalla completa de un plato de carne a la parrilla, el titular "El sabor de Santander, servido en la terraza", el indicador verde de abierto ahora y los botones Ver el menú y Reservar mesa.',
        titulo: 'Portada',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/restaurante-portada-m.jpg',
        alt: 'La misma portada en pantalla de móvil: el titular se parte en tres líneas y los botones de menú y reserva quedan apilados sobre la foto del plato.',
        titulo: 'Portada en móvil',
        ...MOVIL,
      },
    ],
  },
  {
    id: 'cafe',
    negocio: 'Café Nativo',
    sector: 'Tostaduría de especialidad',
    problema:
      'Tostaduría nueva: la historia de cada finca y lo que hay hoy en barra solo existían en la conversación con el barista.',
    solucion:
      'Portada, página de origen con las tres fincas y sus productores, menú de barra que cambia con la temporada y bloque de cómo llegar.',
    resultado:
      'Proyecto en curso, en fase de concepto. Lo que se ve son las pantallas del diseño aprobado: todavía no hay sitio en producción, así que no hay resultados que reportar.',
    resultadoEtiqueta: 'Estado del proyecto',
    resultadoFuente: 'Cliente nuevo, en diseño. Actualizaremos este caso cuando salga a producción.',
    capturas: [
      {
        src: '/portfolio/cafe-origen.jpg',
        alt: 'Página de origen de Café Nativo sobre fondo beige: titular "Tres fincas, tres maneras de saber a café" y tres tarjetas con el saco de cada lote — La Esperanza de la familia Restrepo en ladera del volcán, El Zapote de doña Amparo Ruiz en valle alto y Monte Nativo de una cooperativa de mujeres en bosque de niebla.',
        titulo: 'Trazabilidad de fincas',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/cafe-menu.jpg',
        alt: 'Menú de barra "Lo que hay hoy en barra" en tres columnas con precios: espresso y con leche, filtrados y barra fría, y panadería, más una nota de que todo se hornea cada mañana.',
        titulo: 'Menú de barra',
        ...ESCRITORIO,
      },
      {
        src: '/portfolio/cafe-portada.jpg',
        alt: 'Portada de Café Nativo: titular tipográfico "De la planta a tu taza sin atajos" con la última línea en contorno, granos de café flotando a la derecha y los botones Cómo llegar y Ver el menú junto al horario de apertura.',
        titulo: 'Portada',
        ...ESCRITORIO,
      },
    ],
  },
];

type Visor = {
  capturas: Captura[];
  indice: number;
  negocio: string;
};

export default function Portfolio() {
  const dialogoRef = useRef<HTMLDialogElement>(null);
  /* Elemento que abrió el lightbox: hay que devolverle el foco al cerrar. */
  const invocadorRef = useRef<HTMLElement | null>(null);
  const [visor, setVisor] = useState<Visor | null>(null);

  const abrir = useCallback(
    (capturas: Captura[], indice: number, negocio: string, invocador: HTMLElement) => {
      invocadorRef.current = invocador;
      setVisor({ capturas, indice, negocio });
    },
    [],
  );

  const mover = useCallback((paso: number) => {
    setVisor((v) =>
      v ? { ...v, indice: (v.indice + paso + v.capturas.length) % v.capturas.length } : v,
    );
  }, []);

  /* Apertura y cierre siempre por showModal()/close(), nunca pintando el
     diálogo a mano: showModal() vuelve inert todo lo que está fuera, así que
     el foco queda encerrado dentro sin reimplementar un focus trap. */
  useEffect(() => {
    const d = dialogoRef.current;
    if (!d) return;
    if (visor && !d.open) d.showModal();
    if (!visor && d.open) d.close();
  }, [visor]);

  /* 'close' dispara tanto al pulsar el botón cerrar como con Escape (que el
     propio <dialog> ya entiende sin código nuestro): un solo sitio donde
     limpiar el estado y devolver el foco a quien abrió. */
  useEffect(() => {
    const d = dialogoRef.current;
    if (!d) return;
    const alCerrar = () => {
      setVisor(null);
      invocadorRef.current?.focus();
      invocadorRef.current = null;
    };
    d.addEventListener('close', alCerrar);
    return () => d.removeEventListener('close', alCerrar);
  }, []);

  const alPulsarTecla = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);

    /* showModal() ya deja inert el resto de la página, pero Chromium tiene un
       caso raro: al tabular más allá del último elemento enfocable el foco
       pasa un instante por <body>. Se cierra el ciclo a mano. */
    if (e.key === 'Tab') {
      const d = dialogoRef.current;
      if (!d) return;
      const focosables = Array.from(
        d.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focosables.length === 0) return;
      const primero = focosables[0];
      const ultimo = focosables[focosables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  };

  const capturaActual = visor ? visor.capturas[visor.indice] : null;

  return (
    <section id="portafolio" className="py-20 md:py-32 bg-white">
      <div className="section-wrapper">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="badge justify-center mb-4">
            <span className="text-xs uppercase font-bold tracking-wide">Nuestro trabajo</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl mb-6">
            Cuatro negocios, cuatro sitios propios
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Capturas reales de lo que hemos construido. Haz clic en cualquiera para verla en grande.
          </p>
        </div>

        <div className="space-y-6">
          {casos.map((caso) => {
            const principal = caso.capturas[0];
            const secundarias = caso.capturas.slice(1);

            return (
              <div
                key={caso.id}
                className="card rounded-2xl overflow-hidden hover:border-brand-primary/40 transition-all duration-300"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Galería */}
                  <div className="bg-bg-main p-5 md:p-6 flex flex-col justify-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => abrir(caso.capturas, 0, caso.negocio, e.currentTarget)}
                      aria-label={`Ampliar captura: ${principal.alt}`}
                      className="group relative block w-full overflow-hidden rounded-xl border border-border-color bg-white cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                    >
                      <img
                        src={principal.src}
                        alt={principal.alt}
                        width={principal.width}
                        height={principal.height}
                        loading="lazy"
                        decoding="async"
                        className="w-full aspect-[16/10] object-contain object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-text-primary/80 px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        <Maximize2 size={12} aria-hidden="true" />
                        Ampliar
                      </span>
                    </button>

                    {secundarias.length > 0 && (
                      <ul className="grid grid-cols-3 gap-3 list-none p-0 m-0">
                        {secundarias.map((captura, i) => (
                          <li key={captura.src}>
                            <button
                              type="button"
                              onClick={(e) =>
                                abrir(caso.capturas, i + 1, caso.negocio, e.currentTarget)
                              }
                              aria-label={`Ampliar captura: ${captura.alt}`}
                              className="block w-full overflow-hidden rounded-lg border border-border-color bg-white cursor-zoom-in transition-colors hover:border-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            >
                              <img
                                src={captura.src}
                                alt={captura.alt}
                                width={captura.width}
                                height={captura.height}
                                loading="lazy"
                                decoding="async"
                                className="w-full aspect-[16/10] object-contain object-top"
                              />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold text-brand-primary bg-brand-light px-3 py-1 rounded-full">
                          {caso.sector}
                        </span>
                      </div>

                      <h3 className="text-3xl font-black text-text-primary mb-8">{caso.negocio}</h3>

                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                            El desafío
                          </p>
                          <p className="text-lg text-text-primary">{caso.problema}</p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                            Nuestra solución
                          </p>
                          <p className="text-lg text-text-primary">{caso.solucion}</p>
                        </div>

                        <div className="pt-2 border-t border-border-color">
                          <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                            {caso.resultadoEtiqueta}
                          </p>
                          <p className="text-lg font-bold text-text-primary">{caso.resultado}</p>
                          <p className="mt-2 text-sm text-text-secondary">{caso.resultadoFuente}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border-color">
                      {/* Sin el manejador, este enlace dejaba la sección de
                          contacto tapada por el header fijo, escribía en el
                          historial y se saltaba `prefers-reduced-motion`.
                          `scrollToSection` resuelve las tres cosas. */}
                      <a
                        href="#contacto"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection('#contacto');
                        }}
                        className="inline-flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all text-sm group/link"
                      >
                        Quiero un caso similar
                        <ArrowRight
                          size={16}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 p-12 rounded-2xl bg-brand-light text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            ¿Tu negocio podría verse así?
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Cada negocio es único. Nos encantaría conocer tu historia y ayudarte a escribir el
            siguiente capítulo.
          </p>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#contacto');
            }}
            className="btn-primary"
          >
            Hablemos de tu proyecto
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* ── Lightbox: <dialog> nativo ──
          El `display: flex` va condicionado a [open] (variante `open:` de
          Tailwind). La hoja del navegador trae `dialog:not([open]) { display:
          none }`, pero un `flex` de autor sin condición le gana y dejaría el
          diálogo CERRADO ocupando la pantalla entera, tapando los clics. */}
      <dialog
        ref={dialogoRef}
        aria-label={visor ? `Capturas de ${visor.negocio}` : 'Capturas del portafolio'}
        onKeyDown={alPulsarTecla}
        onClick={(e) => {
          // Clic en el fondo (no en el contenido) cierra, como cualquier lightbox.
          if (e.target === dialogoRef.current) dialogoRef.current?.close();
        }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4 open:flex backdrop:bg-text-primary/95"
      >
        {capturaActual && visor && (
          <>
            <button
              type="button"
              onClick={() => dialogoRef.current?.close()}
              aria-label="Cerrar la galería"
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {visor.capturas.length > 1 && (
              <button
                type="button"
                onClick={() => mover(-1)}
                aria-label="Captura anterior"
                className="absolute left-3 md:left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
            )}

            <img
              src={capturaActual.src}
              alt={capturaActual.alt}
              width={capturaActual.width}
              height={capturaActual.height}
              loading="lazy"
              decoding="async"
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-lg"
            />

            {visor.capturas.length > 1 && (
              <button
                type="button"
                onClick={() => mover(1)}
                aria-label="Captura siguiente"
                className="absolute right-3 md:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            )}

            <p
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80 text-center px-6"
              aria-live="polite"
            >
              {capturaActual.titulo} · {visor.indice + 1} de {visor.capturas.length}
            </p>
          </>
        )}
      </dialog>
    </section>
  );
}
