/**
 * Wizard de reserva en 3 pasos — sin backend.
 *
 * Paso 1: servicio (de la colección `servicios`)
 * Paso 2: barbero o "cualquiera" (de la colección `barberos`, solo activos)
 * Paso 3: fecha (próximos 14 días, excluyendo días cerrados según
 *         src/data/horarios.json) + franja horaria (generada desde
 *         apertura/cierre y la duración del servicio) + nombre.
 *
 * El botón final abre WhatsApp con un mensaje estructurado:
 * "Hola, quiero reservar: [servicio] ([duración], [precio]), con [barbero],
 *  el [día fecha] a las [hora]. Mi nombre es [nombre]."
 *
 * Los datos de servicios/barberos llegan serializados en el
 * <script type="application/json" id="reserva-data"> que renderiza
 * ReservaWizard.astro. Los horarios se importan directamente del JSON.
 */
import { gsap } from 'gsap';
import horariosJson from '../data/horarios.json';
import { waLink, precioCOP } from './site';

interface Servicio {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
}
interface Barbero {
  id: string;
  nombre: string;
}
interface Horario {
  abierto: boolean;
  apertura: string;
  cierre: string;
}

const HORARIOS: Record<string, Horario> = horariosJson;
/** getDay() → clave del JSON de horarios (0 = domingo). */
const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const;

const VENTANA_DIAS = 14; // días hacia adelante que ofrece el calendario
const GRANULARIDAD_MIN = 30; // cada cuánto inicia una franja
const MARGEN_HOY_MIN = 30; // margen mínimo para reservar "hoy"

const root = document.getElementById('reserva-wizard');
const dataEl = document.getElementById('reserva-data');

if (root && dataEl) {
  const { servicios, barberos } = JSON.parse(dataEl.textContent || '{}') as {
    servicios: Servicio[];
    barberos: Barbero[];
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = {
    paso: 1,
    servicio: null as Servicio | null,
    /** 'cualquiera' o el barbero elegido. */
    barbero: null as Barbero | 'cualquiera' | null,
    fecha: null as Date | null,
    /** Etiqueta 12h de la franja, ej. "3:30 PM". */
    hora: null as string | null,
  };

  const paneles: Record<number, HTMLElement> = {
    1: root.querySelector('[data-paso="1"]')!,
    2: root.querySelector('[data-paso="2"]')!,
    3: root.querySelector('[data-paso="3"]')!,
  };
  const indicadores = Array.from(root.querySelectorAll<HTMLElement>('[data-indicador]'));
  const fechasEl = root.querySelector<HTMLElement>('#reserva-fechas')!;
  const franjasEl = root.querySelector<HTMLElement>('#reserva-franjas')!;
  const resumenEl = root.querySelector<HTMLElement>('#reserva-resumen')!;
  const nombreEl = root.querySelector<HTMLInputElement>('#reserva-nombre')!;
  const confirmarEl = root.querySelector<HTMLButtonElement>('#reserva-confirmar')!;

  /** Duración con la que se generó el calendario (para no re-renderizar de más). */
  let duracionRenderizada: number | null = null;
  let animando = false;

  // ── Utilidades de tiempo ─────────────────────────────────────────

  const aMinutos = (hhmm: string): number => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const etiqueta12h = (min: number): string => {
    const h24 = Math.floor(min / 60);
    const m = min % 60;
    const sufijo = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
  };

  const horarioDe = (fecha: Date): Horario | undefined => HORARIOS[DIAS[fecha.getDay()]];

  const fmtLargo = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtDiaCorto = new Intl.DateTimeFormat('es-CO', { weekday: 'short' });
  const fmtMesCorto = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' });

  /** Franjas de inicio válidas para una fecha y duración de servicio. */
  function franjasPara(fecha: Date, duracion: number): string[] {
    const h = horarioDe(fecha);
    if (!h?.abierto) return [];
    const ahora = new Date();
    const esHoy = fecha.toDateString() === ahora.toDateString();
    const limiteHoy = ahora.getHours() * 60 + ahora.getMinutes() + MARGEN_HOY_MIN;
    const franjas: string[] = [];
    for (let t = aMinutos(h.apertura); t + duracion <= aMinutos(h.cierre); t += GRANULARIDAD_MIN) {
      if (esHoy && t < limiteHoy) continue;
      franjas.push(etiqueta12h(t));
    }
    return franjas;
  }

  /** Próximos 14 días, sin días cerrados ni días sin franjas restantes. */
  function fechasDisponibles(duracion: number): Date[] {
    const hoy = new Date();
    const res: Date[] = [];
    for (let i = 0; i < VENTANA_DIAS; i++) {
      const f = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
      if (!horarioDe(f)?.abierto) continue;
      if (franjasPara(f, duracion).length === 0) continue;
      res.push(f);
    }
    return res;
  }

  function etiquetaFecha(f: Date): { arriba: string; abajo: string } {
    const hoy = new Date();
    const dias = Math.round(
      (new Date(f.getFullYear(), f.getMonth(), f.getDate()).getTime() -
        new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).getTime()) /
        86400000,
    );
    const arriba =
      dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : fmtDiaCorto.format(f).replace('.', '');
    return { arriba, abajo: fmtMesCorto.format(f).replace('.', '') };
  }

  // ── Navegación entre pasos ───────────────────────────────────────

  function actualizarIndicador() {
    indicadores.forEach((el) => {
      const n = Number(el.dataset.indicador);
      el.classList.toggle('activo', n === state.paso);
      el.classList.toggle('hecho', n < state.paso);
    });
  }

  function puedeIrA(n: number): boolean {
    if (n <= state.paso) return true;
    if (n === 2) return !!state.servicio;
    if (n === 3) return !!state.servicio && !!state.barbero;
    return false;
  }

  function irAPaso(n: number) {
    if (n === state.paso || animando || !puedeIrA(n)) return;
    const actual = paneles[state.paso];
    const siguiente = paneles[n];
    const dir = n > state.paso ? 1 : -1;
    state.paso = n;
    actualizarIndicador();
    if (n === 3) prepararPaso3();

    if (reduceMotion) {
      actual.classList.add('hidden');
      siguiente.classList.remove('hidden');
      return;
    }
    animando = true;
    gsap.to(actual, {
      opacity: 0,
      x: -28 * dir,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        actual.classList.add('hidden');
        gsap.set(actual, { clearProps: 'all' });
        siguiente.classList.remove('hidden');
        gsap.fromTo(
          siguiente,
          { opacity: 0, x: 28 * dir },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: 'power2.out',
            clearProps: 'all',
            onComplete: () => {
              animando = false;
            },
          },
        );
      },
    });
  }

  // ── Selecciones ──────────────────────────────────────────────────

  function marcar(cont: HTMLElement, selector: string, activo: (el: HTMLElement) => boolean) {
    cont.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      const es = activo(el);
      el.classList.toggle('activo', es);
      el.setAttribute('aria-pressed', String(es));
    });
  }

  function seleccionarServicio(id: string, avanzar = true) {
    const s = servicios.find((x) => x.id === id);
    if (!s) return;
    if (state.servicio?.id !== id) {
      // cambió el servicio → la duración cambia → fecha y hora dejan de valer
      state.fecha = null;
      state.hora = null;
    }
    state.servicio = s;
    marcar(paneles[1], '[data-servicio-opcion]', (el) => el.dataset.servicioOpcion === id);
    actualizarConfirmar();
    if (avanzar) irAPaso(2);
  }

  function seleccionarBarbero(id: string, avanzar = true) {
    state.barbero = id === 'cualquiera' ? 'cualquiera' : (barberos.find((b) => b.id === id) ?? null);
    if (!state.barbero) return;
    marcar(paneles[2], '[data-barbero-opcion]', (el) => el.dataset.barberoOpcion === id);
    renderResumen();
    actualizarConfirmar();
    if (avanzar) irAPaso(3);
  }

  function seleccionarFecha(f: Date) {
    state.fecha = f;
    state.hora = null;
    marcar(fechasEl, '[data-fecha]', (el) => el.dataset.fecha === String(f.getTime()));
    renderFranjas();
    renderResumen();
    actualizarConfirmar();
  }

  function seleccionarHora(hora: string) {
    state.hora = hora;
    marcar(franjasEl, '[data-hora]', (el) => el.dataset.hora === hora);
    renderResumen();
    actualizarConfirmar();
  }

  // ── Render del paso 3 ────────────────────────────────────────────

  function prepararPaso3() {
    const duracion = state.servicio!.duracion;
    if (duracionRenderizada !== duracion) {
      duracionRenderizada = duracion;
      renderFechas();
    }
    renderResumen();
    actualizarConfirmar();
  }

  function renderFechas() {
    const fechas = fechasDisponibles(state.servicio!.duracion);
    fechasEl.innerHTML = '';
    if (fechas.length === 0) {
      fechasEl.innerHTML =
        '<p class="text-sm text-brand-500">No hay fechas disponibles en los próximos 14 días. Escríbenos por WhatsApp.</p>';
      return;
    }
    fechas.forEach((f, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'reserva-chip shrink-0 flex-col !px-4';
      btn.dataset.fecha = String(f.getTime());
      const { arriba, abajo } = etiquetaFecha(f);
      btn.innerHTML = `<span class="block text-[11px] uppercase tracking-wider opacity-70">${arriba}</span><span class="block font-semibold whitespace-nowrap">${abajo}</span>`;
      btn.addEventListener('click', () => seleccionarFecha(f));
      fechasEl.appendChild(btn);
      // Preselecciona la primera fecha para mostrar franjas de inmediato
      if (i === 0) seleccionarFecha(f);
    });
  }

  function renderFranjas() {
    const franjas = state.fecha ? franjasPara(state.fecha, state.servicio!.duracion) : [];
    franjasEl.innerHTML = '';
    franjas.forEach((hora) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'reserva-chip justify-center';
      btn.dataset.hora = hora;
      btn.textContent = hora;
      btn.addEventListener('click', () => seleccionarHora(hora));
      franjasEl.appendChild(btn);
    });
  }

  function renderResumen() {
    const s = state.servicio;
    if (!s) return;
    const conQuien =
      state.barbero === 'cualquiera'
        ? 'el primer barbero disponible'
        : state.barbero
          ? state.barbero.nombre
          : '—';
    const cuando =
      state.fecha && state.hora
        ? ` · ${fmtLargo.format(state.fecha).replace(/,/g, '')}, ${state.hora}`
        : '';
    resumenEl.textContent = `${s.nombre} · ${s.duracion} min · ${precioCOP(s.precio)} · con ${conQuien}${cuando}`;
  }

  // ── Confirmación → WhatsApp ──────────────────────────────────────

  function actualizarConfirmar() {
    const listo =
      !!state.servicio &&
      !!state.barbero &&
      !!state.fecha &&
      !!state.hora &&
      nombreEl.value.trim().length >= 2;
    confirmarEl.disabled = !listo;
  }

  function confirmar() {
    const s = state.servicio;
    if (!s || !state.barbero || !state.fecha || !state.hora) return;
    const conQuien =
      state.barbero === 'cualquiera' ? 'el primer barbero disponible' : state.barbero.nombre;
    const fechaLarga = fmtLargo.format(state.fecha).replace(/,/g, '');
    const mensaje = `Hola, quiero reservar: ${s.nombre} (${s.duracion} min, ${precioCOP(s.precio)}), con ${conQuien}, el ${fechaLarga} a las ${state.hora}. Mi nombre es ${nombreEl.value.trim()}.`;
    window.open(waLink(mensaje), '_blank', 'noopener');
  }

  // ── Wire-up ──────────────────────────────────────────────────────

  paneles[1].querySelectorAll<HTMLElement>('[data-servicio-opcion]').forEach((btn) => {
    btn.addEventListener('click', () => seleccionarServicio(btn.dataset.servicioOpcion!));
  });
  paneles[2].querySelectorAll<HTMLElement>('[data-barbero-opcion]').forEach((btn) => {
    btn.addEventListener('click', () => seleccionarBarbero(btn.dataset.barberoOpcion!));
  });
  root.querySelectorAll<HTMLElement>('[data-ir-paso]').forEach((btn) => {
    btn.addEventListener('click', () => irAPaso(Number(btn.dataset.irPaso)));
  });
  indicadores.forEach((el) => {
    el.addEventListener('click', () => irAPaso(Number(el.dataset.indicador)));
  });
  nombreEl.addEventListener('input', actualizarConfirmar);
  confirmarEl.addEventListener('click', confirmar);

  // Botones "Reservar" fuera del wizard (cards de servicios, hero, sticky):
  // preseleccionan el servicio y saltan al paso 2.
  document.querySelectorAll<HTMLElement>('[data-reserva-servicio]').forEach((el) => {
    el.addEventListener('click', () => {
      seleccionarServicio(el.dataset.reservaServicio!);
    });
  });

  actualizarIndicador();
  actualizarConfirmar();
}
