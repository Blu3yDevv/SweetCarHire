"use client"

import { useState, type PointerEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { PICKUP_LOCATIONS } from "@/lib/fleet"

export function RentalSearch() {
  const router = useRouter()
  const [pickupDate, setPickupDate] = useState("")
  const [dropoffDate, setDropoffDate] = useState("")
  const [location, setLocation] = useState("SEZ Airport")
  const [error, setError] = useState("")

  const tiltPlanner = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    const rotateX = (0.5 - y) * 7
    const rotateY = (x - 0.5) * 8
    event.currentTarget.style.setProperty("--planner-rotate-x", `${rotateX.toFixed(2)}deg`)
    event.currentTarget.style.setProperty("--planner-rotate-y", `${rotateY.toFixed(2)}deg`)
  }

  const resetPlannerTilt = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--planner-rotate-x", "0deg")
    event.currentTarget.style.setProperty("--planner-rotate-y", "0deg")
  }

  const today = new Date()
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  return (
    <form
      className="reservation-form text-left text-navy"
      aria-label="Plan your car rental"
      aria-describedby="reservation-note"
      onSubmit={(event) => {
        event.preventDefault()
        if (pickupDate < minDate || dropoffDate <= pickupDate) {
          setError("Choose a pickup date from today onward and a return date after pickup.")
          return
        }
        const query = new URLSearchParams({ pickupDate, dropoffDate, location })
        router.push(`/booking?${query}`)
      }}
    >
      <div className="reservation-panel" onPointerMove={tiltPlanner} onPointerLeave={resetPlannerTilt}>
        <div className="reservation-intro">
          <div>
            <p className="reservation-eyebrow">A little trip planning</p>
            <p className="reservation-title">Where should we meet you?</p>
          </div>
          <span className="reservation-next">Next: choose a car <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
        </div>
        <div className="reservation-row">
        <div className="reservation-field">
          <label htmlFor="search-pickup">Pickup date</label>
          <input id="search-pickup" type="date" required min={minDate} value={pickupDate} aria-describedby={error ? "reservation-error" : undefined} onChange={(e) => { setPickupDate(e.target.value); setError("") }} className="search-input" />
        </div>
        <div className="reservation-field">
          <label htmlFor="search-return">Return date</label>
          <input id="search-return" type="date" required min={pickupDate || minDate} value={dropoffDate} aria-describedby={error ? "reservation-error" : undefined} onChange={(e) => { setDropoffDate(e.target.value); setError("") }} className="search-input" />
        </div>
        <div className="reservation-field reservation-location">
          <label htmlFor="search-location">Pickup location</label>
          <select id="search-location" value={location} onChange={(e) => setLocation(e.target.value)} className="search-input">
            {PICKUP_LOCATIONS.map((place) => <option key={place}>{place}</option>)}
          </select>
        </div>
        <div className="reservation-action">
          <button type="submit" className="reservation-submit">
            Choose a car <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        </div>
      </div>
      <div className="reservation-note">
        {error && <p id="reservation-error" role="alert" className="reservation-error">{error}</p>}
        <p id="reservation-note">Availability is confirmed by the team after your request.</p>
      </div>
    </form>
  )
}
