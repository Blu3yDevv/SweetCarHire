import { Plane, Gauge, Shield } from "lucide-react"

export function Benefits() {
  const benefits = [
    {
      icon: Plane,
      title: "Airport delivery",
      description: "Free delivery to SEZ Airport",
    },
    {
      icon: Gauge,
      title: "Unlimited mileage",
      description: "Drive as much as you want",
    },
    {
      icon: Shield,
      title: "No hidden fees",
      description: "Transparent pricing always",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {benefits.map((benefit, index) => (
        <div key={index} className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--sunshine)] rounded-full mb-4">
            <benefit.icon className="h-8 w-8 text-[var(--navy)]" />
          </div>
          <h3 className="font-poppins font-semibold text-lg text-[var(--navy)] mb-2">{benefit.title}</h3>
          <p className="text-[var(--charcoal)] font-medium">{benefit.description}</p>
        </div>
      ))}
    </div>
  )
}
