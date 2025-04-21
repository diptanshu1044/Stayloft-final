import { LucideIcon } from "lucide-react";

interface ComingSoonTabProps {
  title: string;
  Icon: LucideIcon;
}

const ComingSoonTab = ({ title, Icon }: ComingSoonTabProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      <div className="bg-white rounded-lg shadow-xs p-6 text-center">
        <Icon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
        <p className="text-gray-600">
          The {title.toLowerCase()} feature will be available in the next update. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default ComingSoonTab;
