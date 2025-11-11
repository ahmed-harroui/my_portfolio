"use client";

import { useEffect, useRef, useState } from "react";
import BlobCursor from "@/components/BlobCursor";
import { gsap } from "gsap";

export default function HeroSection() {
    const [isDark, setIsDark] = useState(true);
    const heroRef = useRef<HTMLDivElement | null>(null);
    const nameRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (!heroRef.current || !nameRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                heroRef.current!.querySelectorAll(".hero-element"),
                { autoAlpha: 0, y: 28 },
                { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" }
            );

            gsap.fromTo(
                nameRef.current,
                { autoAlpha: 0, y: 20, scale: 0.95 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", delay: 0.4 }
            );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <header
            ref={heroRef}
            className="min-h-screen flex items-center relative overflow-hidden bg-background dark:bg-black text-foreground dark:text-white"
        >
            <BlobCursor
                blobType="circle"
                fillColor="#5227FF"
                trailCount={3}
                sizes={[60, 125, 75]}
                innerSizes={[20, 35, 25]}
                innerColor="rgba(255,255,255,0.8)"
                opacities={[0.6, 0.45, 0.32]}
                shadowColor="rgba(0,0,0,0.6)"
                shadowBlur={18}
                shadowOffsetX={0}
                shadowOffsetY={6}
                filterStdDeviation={30}
                useFilter={true}
                fastDuration={0.06}
                slowDuration={0.35}
                zIndex={5}
            />

            <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-20 space-y-24 hero-content">
                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="text-xs text-muted-foreground font-mono tracking-widest uppercase hero-element">
                            Developer Portfolio
                        </div>

                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tighter leading-none hero-element">
                            <span ref={nameRef} className="name-gradient">Ahmed Harroui</span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl hero-element">
                            Crafting exceptional digital experiences through clean code and thoughtful design.
                        </p>

                        <p className="text-md sm:text-lg text-muted-foreground font-light max-w-xl hero-element">
                            Based in Bordeaux, I enjoy collaborating with ambitious teams and visionary clients to bring ideas to life. Let’s build something remarkable together.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
