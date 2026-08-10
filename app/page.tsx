import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedProject from "@/components/FeaturedProject";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Accomplishments from "@/components/Accomplishments";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <FeaturedProject />
      <Education />
      <Experience />
      <Projects />
      <Skills />
      <Accomplishments />
      <Contact />
    </main>
  );
}
