// Listed vehicle details and base EUR rates shared by the homepage and booking flow.
// Luggage capacity and availability are not confirmed by the repository.
export const VEHICLES = [
  { id: "suzuki-dzire", name: "Suzuki Dzire", dailyRate: 45, passengers: 5, transmission: "Automatic", bodyStyle: "Sedan", image: "/images/dzire2.png" },
  { id: "hyundai-grandi10", name: "Hyundai Grand i10", dailyRate: 45, passengers: 5, transmission: "Automatic", bodyStyle: "Hatchback", image: "/images/grandi10.png" },
  { id: "suzuki-fronx", name: "Suzuki Fronx", dailyRate: 60, passengers: 5, transmission: "Automatic", bodyStyle: "Compact SUV", image: "/images/fronx2.png" },
] as const

export const PICKUP_LOCATIONS = [
  "SEZ Airport", "Victoria", "Cat Cocos (Victoria)", "Beau Vallon", "Eden Island", "Anse Royale",
  "Baie Lazare", "Anse Intendance", "Port Launay", "Custom Location",
]
