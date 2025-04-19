import { Building, Home, MessageSquare, Star, Users } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function WhyChooseStayloft() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose StayLoft</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide a complete accommodation solution designed with your
            comfort in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-xs">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-primary" />
            </div> <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
            <p className="text-gray-600">
              All our listings are thoroughly verified to ensure quality and
              accuracy of information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xs">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
            <p className="text-gray-600">
              Join our community of verified owners and tenants for a safe and
              reliable experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xs">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Diverse Options</h3>
            <p className="text-gray-600">
              From luxury apartments to affordable hostels, find accommodations
              to match every budget.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xs">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
            <p className="text-gray-600">
              Connect directly with property owners without intermediaries for
              better negotiations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xs">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Honest Reviews</h3>
            <p className="text-gray-600">
              Read authentic reviews from previous tenants to make informed
              decisions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xs border border-primary">
            <div className="text-center p-4">
              <h3 className="text-xl font-semibold mb-4">
                Are you a property owner?
              </h3>
              <p className="text-gray-600 mb-6">
                List your property on StayLoft and connect with thousands of
                potential tenants.
              </p>
              <Button asChild>
                <Link href="/dashboard">List Your Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
