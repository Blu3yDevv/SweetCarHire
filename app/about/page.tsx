import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <div className="relative h-[250px] mb-16">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kGn9yYNKNqsEu40zdKT6c8pGKQ9Br6.png"
            alt="Seychelles Beach"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white text-center">About Sweet Car Hire</h1>
          <p className="text-xl text-white max-w-3xl mx-auto text-center">
            Your trusted car rental partner in Seychelles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 mb-6">
            Sweet Car Hire was founded in 2015 with a simple mission: to provide visitors to Seychelles with reliable,
            affordable, and convenient car rental services. What started as a small family business with just 5 vehicles
            has now grown into one of the most trusted car rental companies on Mahe Island.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Our team consists of local Seychellois who know the islands inside and out. We take pride in not just
            renting cars, but in helping our customers discover the hidden gems of our beautiful paradise.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#e94d97]">Customer First</h3>
              <p className="text-gray-600">
                We prioritize your needs and go the extra mile to ensure your satisfaction.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#e94d97]">Quality & Reliability</h3>
              <p className="text-gray-600">Our well-maintained vehicles ensure a safe and comfortable journey.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#e94d97]">Local Expertise</h3>
              <p className="text-gray-600">
                Benefit from our local knowledge to make the most of your Seychelles visit.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6">Meet Our Team</h2>
          <p className="text-lg text-gray-600 mb-6">
            Our dedicated team is committed to making your car rental experience in Seychelles smooth and enjoyable.
            From our friendly customer service representatives to our skilled mechanics, everyone at Sweet Car Hire
            works together to provide you with exceptional service.
          </p>
          <p className="text-lg text-gray-600">
            We look forward to welcoming you to Seychelles and helping you explore our beautiful islands at your own
            pace.
          </p>
        </div>
      </div>
    </div>
  )
}
