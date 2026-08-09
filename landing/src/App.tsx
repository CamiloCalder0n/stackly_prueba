import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Process from './components/Process';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-bg-main text-text-primary font-sans antialiased">
      {/* Enlace de salto: obligatorio para navegación por teclado. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-brand-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Process />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
