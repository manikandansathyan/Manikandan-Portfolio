import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Miko from "../components/miko/Miko";

function Home() {
  return (
    <main className="page">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />

      <Miko />
    </main>
  );
}

export default Home;