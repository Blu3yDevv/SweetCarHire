import BookingFlow from "@/components/booking-flow"

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <BookingFlow searchParams={await searchParams} />
}
