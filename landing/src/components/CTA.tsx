import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function CTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!supabase) {
      setStatus('error');
      setErrorMessage(
        'El formulario aún no está configurado. Escríbenos directo a hola@stackly.dev.'
      );
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const { error } = await supabase
      .from('contact_submissions')
      .insert({ name, email, message });

    if (error) {
      setStatus('error');
      setErrorMessage(
        'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos a hola@stackly.dev.'
      );
      return;
    }

    setStatus('success');
    setName('');
    setEmail('');
    setMessage('');
  };

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
                {['✓ Respuesta en 24h', '✓ Consulta gratuita', '✓ Sin obligación'].map((item) => (
                  <span key={item}>{item}</span>
                ))}
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
                <div className="flex flex-col items-center text-center py-10 gap-3">
                  <CheckCircle2 size={40} className="text-brand-primary" />
                  <p className="font-bold text-text-primary text-lg">¡Mensaje enviado!</p>
                  <p className="text-text-secondary text-sm">
                    Te responderemos en menos de 24 horas.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-1.5">
                      Nombre
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border-color text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-1.5">
                      Correo
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border-color text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      placeholder="tu@correo.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-text-primary mb-1.5">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border-color text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 resize-none"
                      placeholder="Cuéntanos sobre tu proyecto"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  )}

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
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
