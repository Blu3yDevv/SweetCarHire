import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, FileText, Lock, Car } from "lucide-react"

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Policies & Terms</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Everything you need to know about renting with Sweet Car Hire
            </p>
          </div>

          <Tabs defaultValue="rental" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="rental" className="gap-2">
                <Car className="h-4 w-4" />
                <span className="hidden sm:inline">Rental Policy</span>
                <span className="sm:hidden">Rental</span>
              </TabsTrigger>
              <TabsTrigger value="terms" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Terms of Service</span>
                <span className="sm:hidden">Terms</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy Policy</span>
                <span className="sm:hidden">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="insurance" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Insurance</span>
                <span className="sm:hidden">Insurance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rental">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Rental Policy
                  </CardTitle>
                  <CardDescription>Our rental terms and conditions for a smooth experience</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <h3>Driver Requirements</h3>
                  <ul>
                    <li>Minimum age: 21 years old</li>
                    <li>Valid driver's license held for at least 2 years</li>
                    <li>International driving permit (if license not in English or French)</li>
                    <li>Valid passport or national ID</li>
                  </ul>

                  <h3>Rental Duration & Booking</h3>
                  <ul>
                    <li>Minimum rental period: 1 day (24 hours)</li>
                    <li>Booking confirmation required via email or phone</li>
                    <li>Full payment or deposit required at time of booking</li>
                    <li>Late returns subject to additional charges</li>
                  </ul>

                  <h3>Vehicle Usage</h3>
                  <ul>
                    <li>Vehicles must be driven on paved roads only</li>
                    <li>No off-road driving permitted</li>
                    <li>Smoking prohibited in all vehicles</li>
                    <li>Pets allowed with prior approval and additional cleaning fee</li>
                    <li>Maximum passengers as per vehicle capacity</li>
                  </ul>

                  <h3>Fuel Policy</h3>
                  <ul>
                    <li>Vehicles provided with full tank</li>
                    <li>Return with full tank or pay refueling charge</li>
                    <li>Refueling charge: SCR 50 per liter + service fee</li>
                  </ul>

                  <h3>Cancellation Policy</h3>
                  <ul>
                    <li>Free cancellation up to 48 hours before pickup</li>
                    <li>24-48 hours before: 50% refund</li>
                    <li>Less than 24 hours: No refund</li>
                    <li>No-show: Full charge applies</li>
                  </ul>

                  <h3>Delivery & Collection</h3>
                  <ul>
                    <li>Free delivery and collection within Mahé Island</li>
                    <li>Airport pickup/drop-off available</li>
                    <li>Hotel delivery service included</li>
                    <li>After-hours service available with prior arrangement</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Terms of Service
                  </CardTitle>
                  <CardDescription>Legal terms governing your rental agreement</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <h3>Agreement</h3>
                  <p>
                    By renting a vehicle from Sweet Car Hire, you agree to comply with all terms and conditions outlined
                    in this agreement. This constitutes a legally binding contract between you (the renter) and Sweet
                    Car Hire.
                  </p>

                  <h3>Liability & Responsibility</h3>
                  <ul>
                    <li>Renter is responsible for all traffic violations and fines</li>
                    <li>Renter liable for damage to vehicle during rental period</li>
                    <li>Report all accidents to police and Sweet Car Hire immediately</li>
                    <li>Unauthorized drivers not covered by insurance</li>
                    <li>Renter responsible for theft if keys left in vehicle</li>
                  </ul>

                  <h3>Prohibited Activities</h3>
                  <ul>
                    <li>Subletting or lending vehicle to third parties</li>
                    <li>Using vehicle for commercial purposes without authorization</li>
                    <li>Driving under influence of alcohol or drugs</li>
                    <li>Participating in races or competitions</li>
                    <li>Transporting illegal goods or substances</li>
                    <li>Leaving Seychelles with the vehicle</li>
                  </ul>

                  <h3>Vehicle Condition</h3>
                  <ul>
                    <li>Inspect vehicle thoroughly before departure</li>
                    <li>Report any pre-existing damage immediately</li>
                    <li>Return vehicle in same condition as received</li>
                    <li>Cleaning fee applies for excessively dirty vehicles</li>
                  </ul>

                  <h3>Payment Terms</h3>
                  <ul>
                    <li>Payment accepted in SCR, EUR, or USD</li>
                    <li>Credit card required for security deposit</li>
                    <li>Deposit refunded within 7 days after return</li>
                    <li>Additional charges for damages, fines, or violations</li>
                  </ul>

                  <h3>Termination</h3>
                  <p>
                    Sweet Car Hire reserves the right to terminate the rental agreement and repossess the vehicle if
                    terms are violated, without refund.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Privacy Policy
                  </CardTitle>
                  <CardDescription>How we collect, use, and protect your personal information</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <h3>Information We Collect</h3>
                  <p>We collect the following information when you rent from us:</p>
                  <ul>
                    <li>Personal details (name, date of birth, contact information)</li>
                    <li>Driver's license and identification documents</li>
                    <li>Payment and billing information</li>
                    <li>Rental history and preferences</li>
                    <li>Communication records</li>
                  </ul>

                  <h3>How We Use Your Information</h3>
                  <ul>
                    <li>Processing rental bookings and payments</li>
                    <li>Verifying driver eligibility and insurance coverage</li>
                    <li>Communicating about your reservation</li>
                    <li>Improving our services and customer experience</li>
                    <li>Complying with legal and regulatory requirements</li>
                    <li>Sending promotional offers (with your consent)</li>
                  </ul>

                  <h3>Data Protection</h3>
                  <ul>
                    <li>All personal data stored securely and encrypted</li>
                    <li>Access restricted to authorized personnel only</li>
                    <li>Regular security audits and updates</li>
                    <li>Compliance with international data protection standards</li>
                  </ul>

                  <h3>Data Sharing</h3>
                  <p>We do not sell your personal information. We may share data with:</p>
                  <ul>
                    <li>Insurance providers for coverage purposes</li>
                    <li>Payment processors for transaction handling</li>
                    <li>Law enforcement when legally required</li>
                    <li>Service providers who assist our operations</li>
                  </ul>

                  <h3>Your Rights</h3>
                  <ul>
                    <li>Access your personal data</li>
                    <li>Request corrections to inaccurate information</li>
                    <li>Request deletion of your data (subject to legal requirements)</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Lodge complaints with data protection authorities</li>
                  </ul>

                  <h3>Data Retention</h3>
                  <p>
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in
                    this policy, typically 7 years for financial records and 3 years for rental history.
                  </p>

                  <h3>Contact Us</h3>
                  <p>For privacy-related inquiries, contact us at privacy@sweetcarhire.com or call +248 252 8888.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insurance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Insurance & Coverage
                  </CardTitle>
                  <CardDescription>Understanding your insurance options and coverage</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <h3>Standard Coverage (Included)</h3>
                  <ul>
                    <li>Third-party liability insurance</li>
                    <li>Collision Damage Waiver (CDW) with excess</li>
                    <li>Theft Protection (TP) with excess</li>
                    <li>24/7 roadside assistance</li>
                  </ul>

                  <h3>Excess Amounts</h3>
                  <ul>
                    <li>Economy cars: SCR 10,000 excess</li>
                    <li>Standard cars: SCR 15,000 excess</li>
                    <li>SUVs: SCR 20,000 excess</li>
                  </ul>

                  <h3>Full Coverage Option</h3>
                  <p>Upgrade to full coverage to reduce excess to zero:</p>
                  <ul>
                    <li>SCR 500 per day for economy cars</li>
                    <li>SCR 750 per day for standard cars</li>
                    <li>SCR 1,000 per day for SUVs</li>
                  </ul>

                  <h3>What's Not Covered</h3>
                  <ul>
                    <li>Damage to tires, wheels, or undercarriage</li>
                    <li>Interior damage or stains</li>
                    <li>Lost keys or key fob</li>
                    <li>Damage from prohibited activities</li>
                    <li>Damage when unauthorized driver operating vehicle</li>
                    <li>Damage from driving under influence</li>
                  </ul>

                  <h3>In Case of Accident</h3>
                  <ol>
                    <li>Ensure safety of all parties involved</li>
                    <li>Call emergency services if needed (999)</li>
                    <li>Contact Sweet Car Hire immediately (+248 252 8888)</li>
                    <li>File police report within 24 hours</li>
                    <li>Do not admit fault or liability</li>
                    <li>Take photos of damage and exchange information</li>
                    <li>Complete accident report form</li>
                  </ol>

                  <h3>Breakdown Assistance</h3>
                  <p>24/7 roadside assistance included. Call +248 252 8888 for:</p>
                  <ul>
                    <li>Mechanical breakdowns</li>
                    <li>Flat tire changes</li>
                    <li>Battery jump-starts</li>
                    <li>Lockout service</li>
                    <li>Fuel delivery (fuel cost extra)</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-8 bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                Last updated: January 2025. Sweet Car Hire reserves the right to modify these policies at any time. For
                questions or clarifications, contact us at{" "}
                <a href="mailto:info@sweetcarhire.com" className="text-primary hover:underline">
                  info@sweetcarhire.com
                </a>{" "}
                or call{" "}
                <a href="tel:+2482528888" className="text-primary hover:underline">
                  +248 252 8888
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
