import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building, Users, Shield, CheckCircle, Home, Star } from "lucide-react";

const AboutPage = () => {
  return (
    <>
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">About StayLoft</h1>
              <p className="text-xl text-gray-600 mb-8">
                StayLoft is India's premier accommodation listing platform,
                connecting property owners with potential tenants for flats,
                PGs, and hostels across the country.
              </p>
              <p className="text-gray-600 mb-6">
                Our mission is to revolutionize the way people find and rent
                accommodation by providing a transparent, efficient, and
                user-friendly platform that meets the diverse needs of both
                property owners and tenants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/flats">Find Accommodation</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">List Your Property</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                alt="StayLoft Office"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="font-medium">Trusted Platform by Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-primary/5 p-8 rounded-lg border border-primary/10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Building className="h-6 w-6 text-primary" />
                Our Vision
              </h2>
              <p className="text-gray-700">
                To become the most trusted accommodation platform in India,
                transforming the way people find and secure their ideal living
                spaces. We envision a future where finding and renting
                accommodation is as simple, transparent, and stress-free as
                possible.
              </p>
            </div>
            <div className="bg-primary/5 p-8 rounded-lg border border-primary/10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Our Mission
              </h2>
              <p className="text-gray-700">
                To build a comprehensive and user-centric platform that
                simplifies the accommodation search process while providing
                property owners with effective tools to showcase and manage
                their listings. We're committed to fostering trust,
                transparency, and satisfaction for all our users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600">
              The journey behind StayLoft's mission to transform India's
              accommodation market
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-32 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="h-full w-0.5 bg-gray-300 mt-2 hidden md:block"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">The Beginning</h3>
                  <p className="text-gray-700 mb-4">
                    StayLoft was founded in 2025 by a team of young
                    entrepreneurs who experienced firsthand the challenges of
                    finding suitable accommodation in India's major cities. The
                    fragmented market, lack of transparency, and limited options
                    inspired them to create a solution that would address these
                    pain points.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-32 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="h-full w-0.5 bg-gray-300 mt-2 hidden md:block"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">The Growth</h3>
                  <p className="text-gray-700 mb-4">
                    Starting with just a handful of listings in Dehradun,
                    StayLoft will quickly expand to cover major cities across
                    India. Our user-centric approach and focus on verified
                    listings helped us gain the trust of thousands of property
                    owners and tenants alike.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-32 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="h-full w-0.5 bg-gray-300 mt-2 hidden md:block"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">The Innovation</h3>
                  <p className="text-gray-700 mb-4">
                    We continuously innovate to provide the best experience for
                    our users. From implementing advanced search filters to
                    introducing a secure messaging system and virtual property
                    tours, we're committed to leveraging technology to make the
                    accommodation search process seamless.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-32 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600">
              The principles that guide us in our mission to transform the
              accommodation market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-xs text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Trust & Transparency
              </h3>
              <p className="text-gray-600">
                We believe in building trust through transparency. All our
                listings are verified, and we provide accurate information to
                help users make informed decisions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xs text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                User-Centric Approach
              </h3>
              <p className="text-gray-600">
                We put our users first in everything we do. Our platform is
                designed to provide a seamless and intuitive experience for both
                property owners and tenants.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xs text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Quality & Reliability
              </h3>
              <p className="text-gray-600">
                We maintain high standards for the properties listed on our
                platform, ensuring that users have access to quality options and
                reliable information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600">
              The passionate individuals behind StayLoft's success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt="Team Member"
                className="w-full h-60 object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-lg">Vansh Bhatia</h3>
                <p className="text-primary">Frontend and Backend Developer</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Team Member"
                className="w-full h-60 object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-lg">Diptanshu Banerjee</h3>
                <p className="text-primary">Frontend and Backend Developer</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Team Member"
                className="w-full h-60 object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-lg">Mansi Naidu</h3>
                <p className="text-primary">UI/UX and database</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80"
                alt="Team Member"
                className="w-full h-60 object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-lg">Yash Parmar</h3>
                <p className="text-primary">Database Manager</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80"
                alt="Team Member"
                className="w-full h-60 object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-lg">Mihika</h3>
                <p className="text-primary">Project Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join the StayLoft Community
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Whether you're looking for your next home or want to list your
            property, StayLoft is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/flats">Find Accommodation</Link>
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white hover:bg-white/10"
              size="lg"
              asChild
            >
              <Link href="/dashboard">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
