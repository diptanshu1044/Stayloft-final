"use client";

import React, { useState, useEffect } from "react";
import { RoomAvailability } from "@/types";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Check, X } from "lucide-react";

interface RoomManagementProps {
  roomAvailability: RoomAvailability[];
  onRoomUpdate: (updatedRooms: RoomAvailability[]) => void;
}

const RoomManagement = ({ roomAvailability, onRoomUpdate }: RoomManagementProps) => {
  const [rooms, setRooms] = useState<RoomAvailability[]>([]);

  useEffect(() => {
    if (roomAvailability && roomAvailability.length > 0) {
      setRooms(roomAvailability);
    }
  }, [roomAvailability]);

  const handleBedsChange = (index: number, value: number) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].availableBeds = value;
    setRooms(updatedRooms);
    onRoomUpdate(updatedRooms);
  };

  const handleTotalBedsChange = (index: number, value: number) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].totalBeds = value;
    // Ensure available beds don't exceed total beds
    if (updatedRooms[index].availableBeds > value) {
      updatedRooms[index].availableBeds = value;
    }
    setRooms(updatedRooms);
    onRoomUpdate(updatedRooms);
  };

  const handleToggleActive = (index: number) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].isActive = !updatedRooms[index].isActive;
    setRooms(updatedRooms);
    onRoomUpdate(updatedRooms);
  };

  const formatRoomType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + " Occupancy";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Bed className="h-5 w-5" />
          Room Availability Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Total Beds</TableHead>
              <TableHead>Available Beds</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {formatRoomType(room.roomType)}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={room.totalBeds}
                    onChange={(e) => handleTotalBedsChange(index, parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={room.availableBeds}
                    onChange={(e) => handleBedsChange(index, parseInt(e.target.value) || 0)}
                    min={0}
                    max={room.totalBeds}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  {room.isActive ? (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-200">
                      <X className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={room.isActive}
                      onCheckedChange={() => handleToggleActive(index)}
                    />
                    <FormLabel className="cursor-pointer text-sm">
                      {room.isActive ? "Active" : "Inactive"}
                    </FormLabel>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {rooms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No room types available. Please add room types in the Room Details section.
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p>* Set available beds to 0 if all rooms of this type are occupied.</p>
          <p>* Toggle the switch to make a room type active or inactive in listings.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomManagement;
