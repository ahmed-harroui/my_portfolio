"use client";

import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

export interface BlobCursorProps {
    blobType?: "circle" | "square";
    fillColor?: string;
    trailCount?: number;
    sizes?: number[];
    innerSizes?: number[];
    innerColor?: string;
    opacities?: number[];
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    filterId?: string;
    filterStdDeviation?: number;
    filterColorMatrixValues?: string;
    useFilter?: boolean;
    fastDuration?: number;
    slowDuration?: number;
    fastEase?: string;
    slowEase?: string;
    zIndex?: number;
}

export default function BlobCursor({
                                       blobType = "circle",
                                       fillColor = "#5227FF",
                                       trailCount = 3,
                                       sizes = [60, 125, 75],
                                       innerSizes = [20, 35, 25],
                                       innerColor = "rgba(255,255,255,0.8)",
                                       opacities = [0.6, 0.6, 0.6],
                                       shadowColor = "rgba(0,0,0,0.75)",
                                       shadowBlur = 5,
                                       shadowOffsetX = 10,
                                       shadowOffsetY = 10,
                                       filterId = "blob",
                                       filterStdDeviation = 30,
                                       filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10",
                                       useFilter = true,
                                       fastDuration = 0.1,
                                       slowDuration = 0.5,
                                       fastEase = "power3.out",
                                       slowEase = "power1.out",
                                       zIndex = 5,
                                   }: BlobCursorProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

    // compute offset of the fixed container (should be 0,0) but keep function for safety
    const updateOffset = useCallback(() => {
        if (!containerRef.current) return { left: 0, top: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return { left: rect.left, top: rect.top };
    }, []);

    const handleMove = useCallback(
        (e: MouseEvent | TouchEvent) => {
            const { left, top } = updateOffset();
            let x = 0;
            let y = 0;
            if ("clientX" in e) {
                x = e.clientX;
                y = e.clientY;
            } else if (e.touches && e.touches[0]) {
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            }

            blobsRef.current.forEach((el, i) => {
                if (!el) return;
                const isLead = i === 0;
                gsap.to(el, {
                    x: x - left,
                    y: y - top,
                    duration: isLead ? fastDuration : slowDuration,
                    ease: isLead ? fastEase : slowEase,
                });
            });
        },
        [updateOffset, fastDuration, slowDuration, fastEase, slowEase]
    );

    useEffect(() => {
        // initial placement so blobs are centered off-screen or at center — avoids stacking at 0,0
        const initialX = window.innerWidth / 2;
        const initialY = window.innerHeight / 2;
        blobsRef.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, { x: initialX, y: initialY });
        });

        // attach global listeners to capture pointer anywhere (fixed container)
        const el = containerRef.current!;
        if (!el) return;

        const pointerMove = (ev: PointerEvent) => handleMove(ev as unknown as MouseEvent);
        const touchMove = (ev: TouchEvent) => handleMove(ev);

        // Use pointer events if available (better), fallback to mouse/touch
        window.addEventListener("pointermove", pointerMove, { passive: true });
        window.addEventListener("touchmove", touchMove, { passive: true });

        const onResize = () => updateOffset();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("pointermove", pointerMove);
            window.removeEventListener("touchmove", touchMove);
            window.removeEventListener("resize", onResize);
        };
    }, [handleMove, updateOffset]);

    return (
        <>
            {/* CSS: fixed full-screen container + hide native cursor on non-touch devices (desktop) */}
            <div
                ref={containerRef}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex,
                    pointerEvents: "none" /* container itself doesn't block clicks */,
                }}
                aria-hidden
                className="blob-cursor-container"
            >
                {/* inline style block to hide native cursor on desktop only and ensure overlay is full */}
                <style jsx>{`
          /* hide native cursor on devices that typically have a pointer (desktop) */
          @media (hover: hover) and (pointer: fine) {
            .blob-cursor-container {
              cursor: none;
            }
          }
        `}</style>

                {useFilter && (
                    <svg className="absolute w-0 h-0" aria-hidden>
                        <filter id={filterId}>
                            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
                            <feColorMatrix in="blur" values={filterColorMatrixValues} />
                        </filter>
                    </svg>
                )}

                {/* inner overlay renders the blob elements. It must be pointer-events: none so page interactions still work */}
                <div
                    className="pointer-events-none absolute inset-0 overflow-hidden select-none"
                    style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
                >
                    {Array.from({ length: trailCount }).map((_, i) => {
                        const size = sizes[i] ?? sizes[sizes.length - 1] ?? 60;
                        const inner = innerSizes[i] ?? innerSizes[innerSizes.length - 1] ?? Math.floor(size / 3);
                        return (
                            <div
                                key={i}
                                ref={(el) => {
                                    blobsRef.current[i] = el;
                                }}
                                className="absolute will-change-transform transform -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    width: typeof size === "number" ? size : size,
                                    height: typeof size === "number" ? size : size,
                                    borderRadius: blobType === "circle" ? "50%" : "0",
                                    backgroundColor: fillColor,
                                    opacity: opacities[i] ?? opacities[opacities.length - 1] ?? 0.6,
                                    boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
                                }}
                                aria-hidden
                            >
                                <div
                                    style={{
                                        width: inner,
                                        height: inner,
                                        position: "absolute",
                                        top: (Number(size) - Number(inner)) / 2,
                                        left: (Number(size) - Number(inner)) / 2,
                                        backgroundColor: innerColor,
                                        borderRadius: blobType === "circle" ? "50%" : "0",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
