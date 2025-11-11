"use client";

import Link from "next/link";

export default function ConnectSection() {
    return (
        <section id="connect" className="py-32 max-w-5xl mx-auto px-8 sm:px-12 lg:px-20">
            <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight">Let's work together</h2>
            <Link href="mailto:test@example.com" className="text-lg text-primary mt-6 inline-block">
                test@example.com
            </Link>
        </section>
    );
}
