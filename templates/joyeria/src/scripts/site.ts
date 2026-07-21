import negocio from '../data/negocio.json';

export const NEGOCIO = negocio;

/** Años de oficio del taller, calculados solos (no hay que actualizarlos a mano). */
export const ANOS_OFICIO = new Date().getFullYear() - NEGOCIO.anoFundacion;

/** Genera un enlace de WhatsApp con mensaje pre-armado. */
export function waLink(mensaje: string): string {
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Formatea un precio en pesos colombianos: 45000 → "$45.000" */
export function precioCOP(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

/**
 * Arma el mensaje de WhatsApp de una consulta con los datos que el vendedor
 * necesita para responder de una sola vez.
 *
 * El benchmark colombiano es claro: la venta se cierra conversando, así que
 * el mensaje debe llegar con referencia, talla y grabado ya puestos, en vez
 * de un "hola, información" que obliga a preguntar tres veces.
 */
export function mensajeConsulta(datos: {
  pieza: string;
  referencia: string;
  url: string;
  talla?: string;
  grabado?: string;
}): string {
  const lineas = [
    `Hola, vengo de la página de ${NEGOCIO.nombre}.`,
    `Me interesa: ${datos.pieza} (Ref. ${datos.referencia})`,
  ];
  if (datos.talla) lineas.push(`Talla: ${datos.talla}`);
  if (datos.grabado) lineas.push(`Grabado: ${datos.grabado}`);
  lineas.push(datos.url);
  return lineas.join('\n');
}

/**
 * Etiqueta legible de la ley del metal.
 * En Colombia el contraste (quilataje) es obligatorio y es lo primero que
 * mira el comprador, así que se muestra siempre con su milésima equivalente.
 */
export function leyLegible(ley: string): string {
  const equivalencias: Record<string, string> = {
    '18k': 'Oro 18k · 750',
    '14k': 'Oro 14k · 585',
    '950': 'Plata 950',
    '925': 'Plata 925',
  };
  return equivalencias[ley] ?? ley;
}
