/**
 * Estado "Abierto ahora / Cerrado" calculado desde src/data/horarios.json.
 * Se usa client-side (badge del hero) para que refleje la hora del visitante.
 */
import horarios from '../data/horarios.json';

export interface DiaHorario {
  abierto: boolean;
  apertura: string; // "11:30"
  cierre: string; // "21:00"
}

export const DIAS = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
] as const;

const NOMBRES: Record<string, string> = {
  lunes: 'lunes',
  martes: 'martes',
  miercoles: 'miércoles',
  jueves: 'jueves',
  viernes: 'viernes',
  sabado: 'sábado',
  domingo: 'domingo',
};

export const HORARIOS = horarios as Record<(typeof DIAS)[number], DiaHorario>;

function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
}

/** "21:00" → "9:00 p. m." */
export function formatoHora(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h >= 12 ? 'p. m.' : 'a. m.';
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${String(m || 0).padStart(2, '0')} ${sufijo}`;
}

export interface EstadoLocal {
  abierto: boolean;
  mensaje: string;
}

/** Calcula si el local está abierto en este momento y un mensaje amigable. */
export function estadoLocal(ahora: Date = new Date()): EstadoLocal {
  const hoyIdx = ahora.getDay();
  const minutos = ahora.getHours() * 60 + ahora.getMinutes();

  // ¿Sigue abierto desde ayer? (cierres pasada la medianoche)
  const ayer = HORARIOS[DIAS[(hoyIdx + 6) % 7]];
  if (ayer?.abierto && aMinutos(ayer.cierre) <= aMinutos(ayer.apertura)) {
    if (minutos < aMinutos(ayer.cierre)) {
      return { abierto: true, mensaje: `Abierto ahora · cierra a las ${formatoHora(ayer.cierre)}` };
    }
  }

  const hoy = HORARIOS[DIAS[hoyIdx]];
  if (hoy?.abierto) {
    const apertura = aMinutos(hoy.apertura);
    let cierre = aMinutos(hoy.cierre);
    if (cierre <= apertura) cierre += 24 * 60; // cruza medianoche
    if (minutos >= apertura && minutos < cierre) {
      return { abierto: true, mensaje: `Abierto ahora · cierra a las ${formatoHora(hoy.cierre)}` };
    }
    if (minutos < apertura) {
      return { abierto: false, mensaje: `Cerrado · abre hoy a las ${formatoHora(hoy.apertura)}` };
    }
  }

  // Próximo día abierto
  for (let i = 1; i <= 7; i++) {
    const dia = DIAS[(hoyIdx + i) % 7];
    const config = HORARIOS[dia];
    if (config?.abierto) {
      const cuando = i === 1 ? 'mañana' : `el ${NOMBRES[dia]}`;
      return { abierto: false, mensaje: `Cerrado · abre ${cuando} a las ${formatoHora(config.apertura)}` };
    }
  }
  return { abierto: false, mensaje: 'Cerrado temporalmente' };
}
