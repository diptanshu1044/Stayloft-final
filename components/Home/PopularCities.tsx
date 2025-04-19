import Link from "next/link"
import { ArrowRight } from "lucide-react";

interface CityCardProps {
  name: string;
  image: string;
  count: number;
  href: string;
}

const CityCard = ({ name, image, count, href }: CityCardProps) => (
  <Link href={href} className="group relative overflow-hidden rounded-lg">
    <img 
      src={image} 
      alt={name}
      className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
    <div className="absolute bottom-0 left-0 p-4 w-full">
      <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
      <div className="flex items-center justify-between">
        <p className="text-gray-200 text-sm">{count} properties</p>
        <ArrowRight className="h-5 w-5 text-white opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
      </div>
    </div>
  </Link>
);

const PopularCities = () => {
  const cities = [
    {
      name: "Bangalore",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      count: 120,
      href: "/flats?city=bangalore"
    },
    {
      name: "Mumbai",
      image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      count: 98,
      href: "/flats?city=mumbai"
    },
    {
      name: "Delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      count: 85,
      href: "/flats?city=delhi"
    },
    {
      name: "Hyderabad",
      image: "https://images.unsplash.com/photo-1621817417761-4403bd11b8a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      count: 72,
      href: "/flats?city=hyderabad"
    }
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Popular Cities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore accommodation options in these popular cities across India
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <CityCard key={city.name} {...city} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
