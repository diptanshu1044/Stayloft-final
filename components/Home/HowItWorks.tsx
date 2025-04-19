import { Building, Search, Calendar, MessageSquare } from "lucide-react";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

const Step = ({ icon, title, description, step }: StepProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative mb-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
        {step}
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-7 w-7" />,
      title: "Search Properties",
      description: "Browse our extensive collection of flats, PGs, and hostels based on your preferences.",
      step: 1
    },
    {
      icon: <Building className="h-7 w-7" />,
      title: "Visit Properties",
      description: "Schedule visits to your shortlisted properties at your convenience.",
      step: 2
    },
    {
      icon: <MessageSquare className="h-7 w-7" />,
      title: "Connect with Owner",
      description: "Directly communicate with property owners to discuss details and ask questions.",
      step: 3
    },
    {
      icon: <Calendar className="h-7 w-7" />,
      title: "Book Your Stay",
      description: "Secure your accommodation with our simple and secure booking process.",
      step: 4
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How StayLoft Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Finding your ideal accommodation is easy with our simple 4-step process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
