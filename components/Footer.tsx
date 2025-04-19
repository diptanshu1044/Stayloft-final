import Link from "next/link";
import { Building, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">StayLoft</span>
            </div>
            <p className="text-gray-400 max-w-xs">
              Find your perfect stay with StayLoft - the ultimate platform for flats, PGs, and hostels.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/flats" className="text-gray-400 hover:text-primary transition-colors">
                  Flats & Apartments
                </Link>
              </li>
              <li>
                <Link href="/pgs" className="text-gray-400 hover:text-primary transition-colors">
                  PG Accommodations
                </Link>
              </li>
              <li>
                <Link href="/hostels" className="text-gray-400 hover:text-primary transition-colors">
                  Hostels
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/flats?city=bangalore" className="text-gray-400 hover:text-primary transition-colors">
                  Bangalore
                </Link>
              </li>
              <li>
                <Link href="/flats?city=delhi" className="text-gray-400 hover:text-primary transition-colors">
                  Delhi
                </Link>
              </li>
              <li>
                <Link href="/flats?city=mumbai" className="text-gray-400 hover:text-primary transition-colors">
                  Mumbai
                </Link>
              </li>
              <li>
                <Link href="/flats?city=hyderabad" className="text-gray-400 hover:text-primary transition-colors">
                  Hyderabad
                </Link>
              </li>
              <li>
                <Link href="/flats?city=pune" className="text-gray-400 hover:text-primary transition-colors">
                  Pune
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} StayLoft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
