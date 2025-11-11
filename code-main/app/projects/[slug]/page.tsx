// /pages/projects/[slug].tsx
"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type Project = {
  title: string;
  slug: { current: string };
  shortDescription: string;
  body: any[];
  mainImage: any;
  tech: string[];
  date: string;
  github?: string;
  external?: string;
};

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    title,
    slug,
    shortDescription,
    body,
    mainImage,
    tech,
    date,
    github,
    external
  }`;

  const project: Project | null = await client.fetch(query, { slug: params.slug });

  if (!project) notFound();

  return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-20 py-20 sm:py-32">
          <Link
              href="/"
              className="group inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 mb-16"
          >
            <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to home</span>
          </Link>

          <div className="space-y-20">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono tracking-wider">{new Date(project.date).getFullYear()}</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extralight tracking-tight leading-none">
                  {project.title}
                </h1>

                <p className="text-xl sm:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl">
                  {project.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                    <span key={tech} className="px-4 py-2 text-sm bg-accent text-foreground rounded-lg">
                  {tech}
                </span>
                ))}
              </div>
            </div>

            {project.mainImage && (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted ring-1 ring-accent/50">
                  <Image
                      src={urlFor(project.mainImage).width(1200).url()}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                  />
                </div>
            )}

            <div className="space-y-16 max-w-3xl">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight">Overview</h2>
                <div className="space-y-4">
                  {project.body.map((block, idx) => (
                      <p key={idx} className="text-lg text-muted-foreground leading-relaxed">
                        {block.children?.map((c: any) => c.text).join("")}
                      </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              {project.github && (
                  <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                  >
                    GitHub
                  </a>
              )}
              {project.external && (
                  <a
                      href={project.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-accent text-foreground rounded-lg hover:bg-accent/80 transition"
                  >
                    Visit Site
                  </a>
              )}
            </div>
          </div>
        </main>
      </div>
  );
}
