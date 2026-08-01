import negocio from '../data/negocio.json';

export const NEGOCIO = negocio;

/** Años de oficio del local, calculados solos (no hay que actualizarlos a mano). */
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
