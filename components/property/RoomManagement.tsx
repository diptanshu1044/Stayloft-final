"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RoomAvailability } from "@/types";

interface RoomManagementProps {
    roomAvailability: RoomAvailability[];
    onRoomUpdate: (rooms: RoomAvailability[]) => void;
}

const RoomManagement = ({ roomAvailability, onRoomUpdate }: RoomManagementProps) => {
    const handleTotalBedsChange = (index: number, value: number) => {
        const updatedRooms = [...roomAvailability];
        updatedRooms[index] = {
            ...updatedRooms[index],
            totalBeds: value,
            availableBeds: Math.min(updatedRooms[index].availableBeds, value)
        };
        onRoomUpdate(updatedRooms);
    };

    const handleAvailableBedsChange = (index: number, value: number) => {
        const updatedRooms = [...roomAvailability];
        updatedRooms[index] = {
            ...updatedRooms[index],
            availableBeds: Math.min(value, updatedRooms[index].totalBeds)
        };
        onRoomUpdate(updatedRooms);
    };

    const handleActiveChange = (index: number, value: boolean) => {
        const updatedRooms = [...roomAvailability];
        updatedRooms[index] = {
            ...updatedRooms[index],
            isActive: value
        };
        onRoomUpdate(updatedRooms);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Room Management</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomAvailability.map((room, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="text-lg">{room.roomType}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Total Beds</label>
                                <Input
                                    type="number"
                                    value={room.totalBeds}
                                    onChange={(e) => handleTotalBedsChange(index, Number(e.target.value))}
                                    min={1}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Available Beds</label>
                                <Input
                                    type="number"
                                    value={room.availableBeds}
                                    onChange={(e) => handleAvailableBedsChange(index, Number(e.target.value))}
                                    min={0}
                                    max={room.totalBeds}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Active</label>
                                <Switch
                                    checked={room.isActive}
                                    onCheckedChange={(value) => handleActiveChange(index, value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RoomManagement; 