import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

const policySections = [
  {
    title: "Documents",
    items: ["Valid passport or national ID"],
  },
  {
    title: "Rental duration",
    items: ["Minimum rental period: 1 day (24 hours)", "Late returns are subject to additional charges"],
  },
  {
    title: "Vehicle use",
    items: [
      "Vehicles must be driven on paved roads only",
      "No off-road driving permitted",
      "Smoking prohibited in all vehicles",
      "Pets allowed with prior approval and an additional cleaning fee",
      "Maximum passengers are limited to the vehicle's capacity",
    ],
  },
  {
    title: "Fuel",
    items: [
      "Vehicles are provided with a full tank",
      "Return the vehicle with a full tank or pay a refuelling charge",
      "Refuelling charge: SCR 50 per litre plus a service fee",
    ],
  },
  {
    title: "Delivery and collection",
    items: [
      "Free delivery and collection within Mahé Island",
      "Airport pickup and drop-off available",
      "Hotel delivery service included",
      "After-hours service available by prior arrangement",
    ],
  },
]

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="container mx-auto px-5 py-24 md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-4 text-magenta">Before you rent</p>
          <h1 className="display-heading text-4xl text-navy md:text-5xl">Rental information</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Please contact us if you have questions about any of the information below.
          </p>

          <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-white px-6 md:px-9">
            {policySections.map((section) => (
              <section key={section.title} className="py-6">
                <h2 className="font-display text-xl font-bold text-navy">{section.title}</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-white p-6 text-muted-foreground md:p-8">
            <p>
              For questions or clarification, email{" "}
              <a className="font-semibold text-magenta hover:underline" href="mailto:sweetcarhirebooking@gmail.com">
                sweetcarhirebooking@gmail.com
              </a>{" "}
              or call{" "}
              <a className="font-semibold text-magenta hover:underline" href="tel:+2482821182">
                +248 282 1182
              </a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
