import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

/** Límites de longitud. Deben coincidir con los CHECK de supabase/schema.sql. */
const LIMITES = {
  name: { min: 2, max: 80 },
  email: { min: 5, max: 120 },
  message: { min: 10, max: 1200 },
} as const;

/** Exige TLD real: `a@b` no pasa (el type="email" nativo sí lo acepta). */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** Un humano no llena tres campos en menos de esto. */
const TIEMPO_MINIMO_MS = 3000;

/** Si Supabase no responde en este tiempo, abortamos en vez de girar para siempre. */
const TIMEOUT_MS = 15000;

const MENSAJES = {
  sinConfigurar:
    'El formulario aún no está configurado. Escríbenos directo a hola@stackly.dev.',
  demasiadoRapido:
    'Tómate un momento para revisar tus datos y vuelve a enviar el mensaje.',
  validacion: 'Revisa los campos marcados antes de enviar.',
  servidor:
    'El servidor rechazó el mensaje. Revisa los datos e intenta de nuevo, o escríbenos a hola@stackly.dev.',
  red:
    'No pudimos conectarnos. Revisa tu conexión a internet e intenta de nuevo, o escríbenos a hola@stackly.dev.',
  timeout:
    'El envío tardó demasiado y se canceló. Intenta de nuevo o escríbenos a hola@stackly.dev.',
} as const;

function validar(name: string, email: string, message: string): FieldErrors {
  const errores: FieldErrors = {};

  if (name.length < LIMITES.name.min) {
    errores.name = 'Escribe tu nombre (mínimo 2 caracteres).';
  } else if (name.length > LIMITES.name.max) {
    errores.name = `El nombre no puede pasar de ${LIMITES.name.max} caracteres.`;
  }

  if (!EMAIL_REGEX.test(email)) {
    errores.email = 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
  } else if (email.length > LIMITES.email.max) {
    errores.email = `El correo no puede pasar de ${LIMITES.email.max} caracteres.`;
  }

  if (message.length < LIMITES.message.min) {
    errores.message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
  } else if (message.length > LIMITES.message.max) {
    errores.message = `El mensaje no puede pasar de ${LIMITES.message.max} caracteres.`;
  }

  return errores;
}

export default function CTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Honeypot: campo oculto que un humano nunca ve ni llena, y un bot sí.
  const [honeypot, setHoneypot] = useState('');
  // Time-trap: momento en que el formulario quedó disponible para escribir.
  const abiertoEn = useRef(Date.now());

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  // Se enciende al volver del estado de éxito: el form aún no está montado ahí.
  const enfocarAlVolver = useRef(false);

  useEffect(() => {
    if (status === 'idle' && enfocarAlVolver.current) {
      enfocarAlVolver.current = false;
      nameRef.current?.focus();
    }
  }, [status]);

  /** Lleva el foco al primer campo con error, para no dejar al teclado perdido. */
  const enfocarPrimerError = (errores: FieldErrors) => {
    if (errores.name) nameRef.current?.focus();
    else if (errores.email) emailRef.current?.focus();
    else if (errores.message) messageRef.current?.focus();
  };

  const limpiarCampos = () => {
    setName('');
    setEmail('');
    setMessage('');
    setHoneypot('');
    setFieldErrors({});
    setErrorMessage('');
  };

  const escribirOtroMensaje = () => {
    limpiarCampos();
    abiertoEn.current = Date.now();
    enfocarAlVolver.current = true;
    setStatus('idle');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const nombreLimpio = name.trim();
    const correoLimpio = email.trim();
    const mensajeLimpio = message.trim();

    // 1. Honeypot: si vino lleno es un bot. Fingimos éxito y no insertamos nada.
    if (honeypot.trim() !== '') {
      console.warn('[CTA] Envío descartado: honeypot lleno (probable bot).');
      limpiarCampos();
      setStatus('success');
      return;
    }

    // 2. Time-trap: nadie escribe nombre, correo y mensaje en menos de 3 segundos.
    if (Date.now() - abiertoEn.current < TIEMPO_MINIMO_MS) {
      console.warn('[CTA] Envío descartado: llegó demasiado rápido (probable bot).');
      setFieldErrors({});
      setErrorMessage(MENSAJES.demasiadoRapido);
      setStatus('error');
      return;
    }

    if (!supabase) {
      setFieldErrors({});
      setErrorMessage(MENSAJES.sinConfigurar);
      setStatus('error');
      return;
    }

    // 3. Validación real sobre los valores ya recortados.
    const errores = validar(nombreLimpio, correoLimpio, mensajeLimpio);
    if (Object.keys(errores).length > 0) {
      setFieldErrors(errores);
      setErrorMessage(MENSAJES.validacion);
      setStatus('error');
      enfocarPrimerError(errores);
      return;
    }

    setFieldErrors({});
    setErrorMessage('');
    setStatus('submitting');

    const controlador = new AbortController();
    const temporizador = window.setTimeout(() => controlador.abort(), TIMEOUT_MS);

    // `fallo` acumula el resultado para que el estado SIEMPRE salga de 'submitting',
    // pase lo que pase dentro del try (incluida una promesa rechazada).
    let fallo: string | null = null;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({ name: nombreLimpio, email: correoLimpio, message: mensajeLimpio })
        .abortSignal(controlador.signal);

      if (error) {
        console.error('[CTA] Supabase rechazó el insert en contact_submissions', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        // supabase-js a veces devuelve el abort/fallo de red como `error` en vez de lanzarlo.
        if (controlador.signal.aborted) {
          fallo = MENSAJES.timeout;
        } else if (error.message?.toLowerCase().includes('fetch')) {
          fallo = MENSAJES.red;
        } else {
          // El servidor respondió y rechazó: RLS, esquema, CHECK, validación...
          fallo = MENSAJES.servidor;
        }
      }
    } catch (err) {
      // La promesa rechazó: red caída, CORS, DNS o el AbortController.
      const nombreError = (err as { name?: string } | null)?.name;
      const abortado =
        controlador.signal.aborted ||
        nombreError === 'AbortError' ||
        nombreError === 'TimeoutError';
      console.error(
        `[CTA] Falló el envío del formulario (${abortado ? 'abortado por timeout' : 'error de red'})`,
        err
      );
      fallo = abortado ? MENSAJES.timeout : MENSAJES.red;
    } finally {
      window.clearTimeout(temporizador);
    }

    if (fallo) {
      setErrorMessage(fallo);
      setStatus('error');
      return;
    }

    limpiarCampos();
    setStatus('success');
  };

  const describedBy = (campo: keyof FieldErrors) =>
    fieldErrors[campo] ? `${campo}-error` : undefined;

  return (
    <section id="contacto" className="py-20 md:py-32 bg-white">
      <div className="section-wrapper">
        <div className="card rounded-2xl overflow-hidden p-10 md:p-16 bg-gradient-to-br from-brand-primary to-brand-dark">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold text-white mb-6">
                <div className="w-2 h-2 rounded-full bg-white" />
                Próximo Paso
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-white">
                ¿Listo para escalar?
              </h2>
              <p className="text-lg leading-relaxed mb-8 text-white/90">
                Cuéntanos qué necesitas. Sin compromiso, una conversación puede cambiar el rumbo
                de tu negocio.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-8">
                {['✓ Te escribimos por correo', '✓ Consulta gratuita', '✓ Sin obligación'].map(
                  (item) => (
                    <span key={item}>{item}</span>
                  )
                )}
              </div>
              <a
                href="mailto:hola@stackly.dev"
                className="inline-flex items-center gap-2 text-white font-semibold hover:text-white/80 transition-colors"
              >
                <Mail size={18} />
                o escríbenos directo a hola@stackly.dev
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8">
              {status === 'success' ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center text-center py-10 gap-3"
                >
                  <CheckCircle2 size={40} className="text-brand-primary" />
                  <p className="font-bold text-text-primary text-lg">¡Mensaje enviado!</p>
                  <p className="text-text-secondary text-sm">
                    Ya tenemos tu mensaje. Te escribiremos al correo que nos dejaste.
                  </p>
                  <button
                    type="button"
                    onClick={escribirOtroMensaje}
                    className="btn-secondary mt-2"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Honeypot: oculto para personas, visible para bots que llenan todo. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="empresa-web">No llenar este campo</label>
                    <input
                      id="empresa-web"
                      name="empresa-web"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-1.5">
                      Nombre
                    </label>
                    <input
                      id="name"
                      ref={nameRef}
                      type="text"
                      required
                      autoComplete="name"
                      maxLength={LIMITES.name.max}
                      aria-invalid={fieldErrors.name ? true : undefined}
                      aria-describedby={describedBy('name')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border-color text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      placeholder="Tu nombre"
                    />
                    {fieldErrors.name && (
                      <p id="name-error" className="mt-1.5 text-sm text-red-600">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-1.5">
                      Correo
                    </label>
                    <input
                      id="email"
                      ref={emailRef}
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={LIMITES.email.max}
                      aria-invalid={fieldErrors.email ? true : undefined}
                      aria-describedby={describedBy('email')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border-color text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      placeholder="tu@correo.com"
                    />
                    {fieldErrors.email && (
                      <p id="email-error" className="mt-1.5 text-sm text-red-600">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-text-primary mb-1.5">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      ref={messageRef}
                      required
                      rows={4}
                      maxLength={LIMITES.message.max}
                      aria-invalid={fieldErrors.message ? true : undefined}
                      aria-describedby={describedBy('message')}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border-color text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 resize-none"
                      placeholder="Cuéntanos sobre tu proyecto"
                    />
                    <div className="mt-1.5 flex items-start justify-between gap-3">
                      {fieldErrors.message ? (
                        <p id="message-error" className="text-sm text-red-600">
                          {fieldErrors.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-text-muted shrink-0">
                        {message.length}/{LIMITES.message.max}
                      </span>
                    </div>
                  </div>

                  {/* Región viva siempre presente: el lector de pantalla anuncia el error
                      en cuanto aparece. Cuando está vacía no ocupa alto ni margen. */}
                  <div role="alert" aria-live="assertive" className="empty:!mt-0">
                    {status === 'error' && errorMessage && (
                      <p className="text-sm text-red-600">{errorMessage}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar mensaje'
                    )}
                  </button>

                  <p className="text-xs text-text-muted text-center">
                    Al enviar, tus datos quedan guardados para responderte. Consulta la{' '}
                    <a
                      href="/privacidad.html"
                      className="underline hover:text-text-secondary"
                    >
                      política de privacidad
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
