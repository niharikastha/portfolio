import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Experience } from "@/components/Experience";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Github } from "@/components/Github";
import { Writing } from "@/components/Writing";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <About />
        <Skills />
        <Github />
        <Writing />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
