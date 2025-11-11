// app/page.tsx
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity.client";

// Server Component: fetch data from Sanity
export default async function HomePage() {
  const projects = await client.fetch(`*[_type == "project"]{
    title,
    slug,
    shortDescription,
    body,
    mainImage,
    tech,
    date,
    github,
    external,
    company
  }`);

  return (
      <div>
        <HeroSection />
        <ProjectsSection projects={projects} />
        <ConnectSection />
        <Footer />
      </div>
  );
}
