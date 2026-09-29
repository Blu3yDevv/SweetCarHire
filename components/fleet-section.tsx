"use client"

import { Users, Cog, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { VEHICLES } from "@/lib/fleet"
import { useCurrency } from "@/lib/currency"

export function FleetSection() {
  const { format: formatPrice } = useCurrency()
  return (
    <section id="fleet" className="island-paper pt-8 pb-16 md:pt-12 md:pb-24 bg-cream">
      <div className="container mx-auto px-5 md:px-8 max-w-7xl">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow text-magenta mb-4">Our sweet fleet</p>
          <h2 className="display-heading text-navy text-4xl md:text-5xl text-balance">Find your island ride.</h2>
          <p className="mt-5 text-lg text-muted-foreground">Compare our three listed models. Displayed rates are base vehicle prices; our team will confirm availability and any insurance price and terms with your quote.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VEHICLES.map((vehicle) => (
            <article key={vehicle.id} className="bg-white rounded-3xl border border-border overflow-hidden flex flex-col">
              <div className="bg-warm-gray/40 px-6 pt-6">
                <Image src={vehicle.image} alt={vehicle.name} width={560} height={340} className="w-full h-52 object-contain" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="eyebrow text-muted-foreground mb-2">{vehicle.bodyStyle}</p>
                <h3 className="font-display font-bold text-navy text-2xl">{vehicle.name}</h3>
                <dl className="grid grid-cols-2 gap-3 my-6 text-sm text-navy">
                  <div className="rounded-xl bg-cream p-3"><dt className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" />Seats</dt><dd className="font-semibold mt-1">{vehicle.passengers}</dd></div>
                  <div className="rounded-xl bg-cream p-3"><dt className="text-muted-foreground flex items-center gap-2"><Cog className="w-4 h-4" />Transmission</dt><dd className="font-semibold mt-1">{vehicle.transmission}</dd></div>
                </dl>
                <p className="text-sm text-muted-foreground mb-6">Travelling with luggage or a child seat? Ask us to confirm the fit.</p>
                <div className="mt-auto pt-5 border-t border-border flex items-center justify-between gap-3">
                  <div><span className="text-3xl font-display font-bold text-navy">{formatPrice(vehicle.dailyRate)}</span><span className="block text-sm text-muted-foreground">base rate per rental day</span></div>
                  <Link href={`/booking?car=${encodeURIComponent(vehicle.name)}`} aria-label={`Choose ${vehicle.name}`} className="inline-flex items-center gap-2 bg-navy hover:bg-magenta text-white font-semibold px-5 py-3 rounded-xl transition-colors">Choose <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6">Rates are based in EUR. Currency selections show converted estimates. Review rental terms before submitting a request.</p>
      </div>
    </section>
  )
}
