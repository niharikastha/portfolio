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
import { BackToTop } from "@/components/BackToTop";
import { Ask } from "@/components/Ask";
import { Gallery } from "@/components/Gallery";
import { getGalleryPhotos } from "@/lib/gallery";
import { runEvals } from "@/lib/evals";

export default function Home() {
  const photos = getGalleryPhotos();
  // The page is static, so this is read at build time: redeploy after adding the key.
  const llmEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <>
      <Nav hide={photos.length ? [] : ["#gallery"]} />
      <main id="main">
        <Hero />
        <Ask llmEnabled={llmEnabled} evals={runEvals()} />
        <Work />
        <Experience />
        <About />
        <Skills />
        <Github />
        <Writing />
        {photos.length ? <Gallery photos={photos} /> : null}
        <Education />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
