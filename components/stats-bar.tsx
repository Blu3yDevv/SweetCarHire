import { VEHICLES } from "@/lib/fleet"

export function StatsBar() {
  return (
    <div className="bg-white border-b border-border">
      <div className="container max-w-7xl mx-auto px-5 py-6 grid grid-cols-3 gap-3 text-center text-navy">
        <div><p className="font-display font-bold text-xl md:text-2xl">{VEHICLES.length} models</p><p className="text-xs md:text-sm text-muted-foreground mt-1">Compare the fleet</p></div>
        <div><p className="font-display font-bold text-xl md:text-2xl">Automatic</p><p className="text-xs md:text-sm text-muted-foreground mt-1">All listed models</p></div>
        <div><p className="font-display font-bold text-xl md:text-2xl">Mahé</p><p className="text-xs md:text-sm text-muted-foreground mt-1">Airport & local pickup</p></div>
      </div>
    </div>
  )
}
