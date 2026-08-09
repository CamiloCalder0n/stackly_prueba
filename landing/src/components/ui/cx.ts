/**
 * Une clases descartando `false`, `null` y `undefined`.
 *
 * No es `clsx` ni `tailwind-merge`: el proyecto no tiene ninguna de las dos
 * y meter una dependencia para esto no se sostiene. Tampoco hace falta
 * resolver conflictos entre utilidades — los primitivos emiten un único
 * valor por eje (un solo `p-*`, un solo `rounded-*`), así que nunca se
 * pisan entre ellos. La `className` del llamante se concatena AL FINAL,
 * pero eso es orden en el atributo, no precedencia: en CSS gana la regla
 * declarada más tarde en la hoja, no la escrita más tarde en el atributo.
 * Si un llamante necesita ganarle a un primitivo, que use `!`.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
