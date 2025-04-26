"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import QuickRoomManagement from "./QuickRoomManagement";
import { Property, PropertyFormData, Room } from "@/types";
import { getUserProperties } from "@/actions/property.action";
import { toast } from "sonner";

const PropertiesTab = () => {
  const [properties, setProperties] = useState<PropertyFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const result = await getUserProperties();
      if (result.success && result.properties) {
        // Map database properties to PropertyFormData type
        const mappedProperties = result.properties.map((dbProperty: Property) => ({
          id: dbProperty.id,
          title: dbProperty.name,
          type: dbProperty.type,
          description: "",
          location: {
            city: dbProperty.location,
            area: "",
          },
          price: dbProperty.rooms[0]?.price || 0,
          images: [],
          amenities: dbProperty.features,
          isActive: true,
          ownerId: dbProperty.ownerId,
          createdAt: new Date(),
          updatedAt: new Date(),
          gender: dbProperty.TenantType,
          totalBeds: dbProperty.rooms.reduce((acc: number, room: Room) => acc + room.capacity, 0),
          rooms: dbProperty.rooms.map((room: Room) => ({
            id: room.id,
            type: room.type,
            capacity: room.capacity,
            availableBeds: room.capacity,
            isActive: true
          }))
        }));
        setProperties(mappedProperties);
      } else {
        toast.error(result.error || "Failed to fetch properties");
      }
    } catch (error) {
      toast.error("An error occurred while fetching properties");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomUpdate = async (propertyId: string, updatedRooms: any) => {
    // Implementation for room update
    // This will be handled by the QuickRoomManagement component
  };

  if (loading) {
    return <div>Loading properties...</div>;
  }

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
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
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
                    Rooms
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
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={property.images[0]?.url || "/placeholder.png"}
                            alt={property.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.location.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}>
                        {property.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{property.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.type === "FLAT"
                        ? `${property.bedrooms} BHK`
                        : `${property.totalBeds} Beds`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
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
                        <QuickRoomManagement
                          propertyId={property.id}
                          propertyTitle={property.title}
                          roomAvailability={property.rooms?.map(room => ({
                            roomType: room.type,
                            totalBeds: room.capacity,
                            availableBeds: room.capacity,
                            isActive: true
                          })) || []}
                          onUpdate={handleRoomUpdate}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
