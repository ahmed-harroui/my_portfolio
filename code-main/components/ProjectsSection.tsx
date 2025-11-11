"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {urlFor} from "@/lib/sanity.image";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection({ projects }: { projects: any[] }) {
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                sectionRef.current!,
                { autoAlpha: 0, y: 50 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        end: "top 50%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="work" className="min-h-screen py-32">
            <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-20 space-y-16">
                <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight">Selected Work</h2>
                {projects.map((project) => (
                    <Link key={project.slug.current} href={`/projects/${project.slug.current}`} className="group block">
                        <article className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                            <div className="lg:col-span-7 order-2 lg:order-1 relative aspect-[16/10] rounded-xl overflow-hidden bg-muted shadow-lg">
                                <Image
                                    src={project.mainImage ? urlFor(project.mainImage).url() : "/placeholder.svg"}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                                />

                            </div>
                            <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
                                <h3 className="text-2xl sm:text-3xl font-light group-hover:text-primary transition-colors duration-500">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground">{project.shortDescription}</p>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
}
