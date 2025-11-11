"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete()
        },
      })

      // Fade in container
      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.3,
      })

      // Animate name with split letters
      tl.from(".letter", {
        opacity: 0,
        y: 50,
        rotationX: -90,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
      })

      // Hold for a moment
      tl.to({}, { duration: 0.8 })

      // Fade out everything
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      })
    })

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-background flex items-center justify-center opacity-0">
      <div ref={textRef} className="text-center space-y-4">
        <h1 className="text-6xl sm:text-7xl lg:text-9xl font-extralight tracking-tighter">
          {"Ahmed Harroui".split("").map((char, index) => (
            <span key={index} className="letter inline-block" style={{ display: "inline-block" }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  )
}
