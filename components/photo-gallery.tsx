"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const moments = [
  {
    src: "/images/7d05ffbd-0519-49a9-94c0-832eebe858db.jpg",
    alt: "A Sweet Car Hire team member helping a customer with the vehicle handover",
  },
  {
    src: "/images/4ffa1b8c-c011-4f32-a723-5fe575eaa75f.jpg",
    alt: "Visitors beside their white Suzuki with luggage at the airport",
  },
  {
    src: "/images/b6d5cbc0-c34a-4f03-9816-bdfb0e730402.jpg",
    alt: "Visitors meeting a Sweet Car Hire team member beside a white Suzuki",
  },
  {
    src: "/images/59f0a7c6-f7b7-40e9-9c3f-d844faa9f9ff.jpg",
    alt: "Visitors and a Sweet Car Hire team member beside a dark SUV",
  },
  {
    src: "/images/1c278f8b-47c5-4f00-aeb8-2e835b027f67.jpg",
    alt: "A group of visitors posing beside a white Suzuki",
  },
]

export function PhotoGallery() {
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return

    let frame = 0
    const curveCards = () => {
      const stageBounds = stage.getBoundingClientRect()
      const center = stageBounds.left + stageBounds.width / 2
      const reach = stageBounds.width / 2

      track.querySelectorAll<HTMLElement>(".photo-gallery-card").forEach((card) => {
        const bounds = card.getBoundingClientRect()
        const normalized = Math.max(-1, Math.min(1, (bounds.left + bounds.width / 2 - center) / reach))
        const edge = Math.abs(normalized)
        card.style.transform = `translateZ(${-edge * 150}px) rotateY(${-normalized * 48}deg) rotateZ(${normalized * 2.5}deg) scale(${1 - edge * 0.09})`
      })
      frame = window.requestAnimationFrame(curveCards)
    }

    frame = window.requestAnimationFrame(curveCards)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <section className="photo-gallery" aria-label="Sweet Car Hire photo gallery">
      <div className="photo-gallery-stage" ref={stageRef} role="region" aria-label="Sweet Car Hire photo gallery">
        <div className="photo-gallery-track" ref={trackRef}>
          {[0, 1].map((set) => (
            <div className="photo-gallery-set" key={set} aria-hidden={set === 1}>
              {moments.map((moment, index) => (
                <div className="photo-gallery-card" key={moment.src}>
                  <Image
                    src={moment.src}
                    alt={set === 0 ? moment.alt : ""}
                    fill
                    sizes="(max-width: 639px) 72vw, (max-width: 1100px) 30vw, 320px"
                    priority={set === 0 && index === 0}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
