/**
 * Estado global del carrito (nanostores) con persistencia en localStorage.
 * Sin backend: el checkout genera un mensaje de WhatsApp con el pedido.
 *
 * Solo se importa desde <script> de componentes (corre en el navegador).
 */
import { atom, computed } from 'nanostores';

export interface ItemCarrito {
  /** Slug del plato (id de la colección `platos`). */
  id: string;
  nombre: string;
  /** Precio unitario en COP. */
  precio: number;
  cantidad: number;
  /** Nota opcional del cliente ("sin cebolla", "término medio"...). */
  nota: string;
  /** Miniatura del plato para el carrito (opcional: los pedidos guardados
   *  por versiones anteriores no la traen y siguen funcionando). */
  foto?: string;
}

const STORAGE_KEY = 'stackly-restaurante-carrito';

function cargarGuardado(): ItemCarrito[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const crudo = localStorage.getItem(STORAGE_KEY);
    if (!crudo) return [];
    const datos = JSON.parse(crudo);
    if (!Array.isArray(datos)) return [];
    return datos
      .filter(
        (it) =>
          it &&
          typeof it.id === 'string' &&
          typeof it.precio === 'number' &&
          typeof it.cantidad === 'number' &&
          it.cantidad > 0,
      )
      // Normaliza los campos de texto: un pedido guardado por una versión
      // anterior puede no traer `nota` (o traerla nula) y el render la usa.
      .map((it) => ({
        ...it,
        nombre: typeof it.nombre === 'string' ? it.nombre : '',
        nota: typeof it.nota === 'string' ? it.nota : '',
        foto: typeof it.foto === 'string' ? it.foto : undefined,
      }));
  } catch {
    return [];
  }
}

/** Líneas del pedido actual. */
export const $carrito = atom<ItemCarrito[]>(cargarGuardado());

// Persistencia: cada cambio se guarda en localStorage.
$carrito.subscribe((items) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* almacenamiento lleno o bloqueado: el carrito sigue en memoria */
  }
});

/** Total de unidades (para el contador del botón "Pedir"). */
export const $numItems = computed($carrito, (items) =>
  items.reduce((acc, it) => acc + it.cantidad, 0),
);

/** Subtotal en COP (sin domicilio). */
export const $subtotal = computed($carrito, (items) =>
  items.reduce((acc, it) => acc + it.precio * it.cantidad, 0),
);

/** Agrega una unidad del plato (o incrementa si ya está en el pedido). */
export function agregarItem(item: {
  id: string;
  nombre: string;
  precio: number;
  foto?: string;
}): void {
  const items = $carrito.get();
  const existente = items.find((it) => it.id === item.id);
  if (existente) {
    $carrito.set(
      items.map((it) => (it.id === item.id ? { ...it, cantidad: it.cantidad + 1 } : it)),
    );
  } else {
    $carrito.set([...items, { ...item, cantidad: 1, nota: '' }]);
  }
}

/** Suma `delta` (±1) a la cantidad. Si llega a 0, elimina la línea. */
export function cambiarCantidad(id: string, delta: number): void {
  const items = $carrito
    .get()
    .map((it) => (it.id === id ? { ...it, cantidad: it.cantidad + delta } : it))
    .filter((it) => it.cantidad > 0);
  $carrito.set(items);
}

export function quitarItem(id: string): void {
  $carrito.set($carrito.get().filter((it) => it.id !== id));
}

export function setNota(id: string, nota: string): void {
  $carrito.set($carrito.get().map((it) => (it.id === id ? { ...it, nota } : it)));
}

export function vaciarCarrito(): void {
  $carrito.set([]);
}
