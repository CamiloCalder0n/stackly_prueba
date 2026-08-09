/**
 * Datos de contacto de Stackly — fuente única.
 *
 * Antes el correo estaba escrito a mano en 14 puntos repartidos por cuatro
 * archivos, y era `hola@stackly.dev`: un dominio **de otra empresa** y sin
 * registros MX, así que todo lo que se enviara ahí rebotaba. El sitio mandaba
 * a los visitantes a una dirección muerta, incluidos los cuatro mensajes de
 * error del formulario.
 *
 * Mismo patrón que usan las plantillas de nicho de este repo
 * (`templates/joyeria/src/data/negocio.json` + `templates/_base/src/scripts/site.ts`).
 *
 * ── LA REGLA ──
 * Un campo vacío significa «todavía no lo tenemos», y la interfaz **no debe
 * renderizar** el elemento que lo mostraría. Nunca publicar un enlace a
 * ninguna parte ni una dirección que rebote: es peor que no ofrecer el canal.
 * Es el mismo criterio con el que `src/lib/supabase.ts` devuelve `null` cuando
 * faltan sus variables de entorno.
 *
 * Para activar un canal, basta con rellenar su campo aquí.
 */

export const NEGOCIO = {
  nombre: 'Stackly',

  /** Correo de contacto. Vacío hasta que haya un dominio propio. */
  correo: '',

  /**
   * WhatsApp en formato internacional sin `+` ni espacios (ej. '573001112233'),
   * que es lo que espera `wa.me`. Vacío = el botón flotante no se monta.
   */
  whatsapp: '',

  ciudad: 'Bucaramanga',
  pais: 'Colombia',
} as const;

/** ¿Hay algún canal de contacto directo publicable? */
export const HAY_CONTACTO_DIRECTO = Boolean(NEGOCIO.correo || NEGOCIO.whatsapp);

/**
 * Enlace de WhatsApp con el mensaje ya escrito, para que la conversación no
 * empiece con un «hola, información» que obliga a preguntar tres veces.
 * Devuelve `null` si todavía no hay número, para que quien llame no tenga que
 * acordarse de comprobarlo.
 */
export function waLink(mensaje: string): string | null {
  if (!NEGOCIO.whatsapp) return null;
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** `mailto:` del correo de contacto, o `null` si aún no hay. */
export function mailtoLink(asunto?: string): string | null {
  if (!NEGOCIO.correo) return null;
  const cola = asunto ? `?subject=${encodeURIComponent(asunto)}` : '';
  return `mailto:${NEGOCIO.correo}${cola}`;
}
