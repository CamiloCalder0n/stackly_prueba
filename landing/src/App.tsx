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
      <Header />
      <main>
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
