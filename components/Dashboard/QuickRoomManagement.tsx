"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Bed, Check } from "lucide-react";
import { toast } from "sonner";
import { RoomAvailability } from "@/types";

interface QuickRoomManagementProps {
    propertyId: string;
    propertyTitle: string;
    roomAvailability: RoomAvailability[];
    onUpdate: (propertyId: string, updatedRooms: RoomAvailability[]) => void;
}

const QuickRoomManagement = ({
    propertyId,
    propertyTitle,
    roomAvailability,
    onUpdate
}: QuickRoomManagementProps) => {
    const [rooms, setRooms] = useState<RoomAvailability[]>(roomAvailability);
    const [open, setOpen] = useState(false);

    const handleBedsChange = (index: number, value: number) => {
        const updatedRooms = [...rooms];
        updatedRooms[index].availableBeds = value;
        setRooms(updatedRooms);
    };

    const handleToggleActive = (index: number) => {
        const updatedRooms = [...rooms];
        updatedRooms[index].isActive = !updatedRooms[index].isActive;
        setRooms(updatedRooms);
    };

    const handleSave = () => {
        onUpdate(propertyId, rooms);
        setOpen(false);
        toast.success("Room availability updated successfully");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    Manage Rooms
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Quick Room Management</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <h3 className="text-xl font-semibold mb-6">{propertyTitle}</h3>

                    <div className="space-y-6">
                        {rooms.map((room, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 border">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xl font-semibold">{room.roomType} Occupancy</h4>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={room.isActive}
                                            onCheckedChange={() => handleToggleActive(index)}
                                        />
                                        {room.isActive && (
                                            <span className="text-green-600 flex items-center text-sm font-medium">
                                                <Check className="h-4 w-4 mr-1" />
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-gray-500 text-sm block mb-1">Total Beds</label>
                                        <div className="text-2xl font-bold">{room.totalBeds}</div>
                                    </div>

                                    <div>
                                        <label className="text-gray-500 text-sm block mb-1">Available Beds</label>
                                        <Input
                                            type="number"
                                            value={room.availableBeds}
                                            onChange={(e) => handleBedsChange(index, parseInt(e.target.value) || 0)}
                                            min={0}
                                            max={room.totalBeds}
                                            className="text-lg font-medium h-12 w-24"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {rooms.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No room types available for this property.
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" size="lg" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QuickRoomManagement; 