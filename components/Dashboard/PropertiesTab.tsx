"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Property } from "@/types";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface PropertiesTabProps {
  properties: Property[];
}

const PropertiesTab = ({ properties: initialProperties }: PropertiesTabProps) => {
  const [properties, setProperties] = useState(initialProperties);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const handleStatusToggle = (propertyId: string, currentStatus: boolean) => {
    setToggleLoading(propertyId);

    // Simulate API call to update property status
    setTimeout(() => {
      setProperties(prev => 
        prev.map(property => 
          property.id === propertyId 
            ? { ...property, isActive: !currentStatus } 
            : property
        )
      );
      
      setToggleLoading(null);
      toast.success(`Property ${currentStatus ? 'deactivated' : 'activated'} successfully`, {
        description: `The property is now ${currentStatus ? 'hidden from' : 'visible to'} potential tenants.`,
      });
    }, 800); // Simulate network delay
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Properties</h2>
        <Button asChild>
          <Link href="/dashboard/add-property">
            <Plus className="h-5 w-5 mr-2" />
            Add New Property
          </Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-xs overflow-hidden border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0 rounded overflow-hidden">
                      <img className="h-10 w-10 object-cover" src={property.images[0]?.url} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                      <div className="text-sm text-gray-500">{property.location.city}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    property.type === "FLAT" 
                      ? "bg-blue-100 text-blue-800" 
                      : property.type === "PG" 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {property.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={property.isActive}
                      disabled={toggleLoading === property.id}
                      onCheckedChange={() => handleStatusToggle(property.id, property.isActive)}
                    />
                    <span className={`inline-flex items-center text-xs leading-5 font-medium ${
                      property.isActive 
                        ? "text-green-700" 
                        : "text-gray-500"
                    }`}>
                      {toggleLoading === property.id ? (
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-1 animate-pulse" />
                      ) : property.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                      )}
                      {property.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{property.price.toLocaleString("en-IN")}/mo
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link href={`/property/${property.id}`} className="text-indigo-600 hover:text-indigo-900">
                      View
                    </Link>
                    <Link 
                      href={`/dashboard/edit-property/${property.id}`} 
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertiesTab;
