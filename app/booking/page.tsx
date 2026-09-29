import BookingFlow from "@/components/booking-flow"

export default function BookingPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return <BookingFlow searchParams={searchParams} />
}
