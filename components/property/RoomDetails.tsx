"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Room {
    type: string;
    name: string;
    isActive: boolean;
    price: number;
    capacity: number;
    availableBeds: number;
    roomNumber?: string;
}

interface RoomDetailsProps {
    form: UseFormReturn<any>;
}

const ROOM_TYPES = [
    { value: "SINGLE", label: "Single" },
    { value: "DOUBLE", label: "Double" },
    { value: "TRIPLE", label: "Triple" },
    { value: "1BHK", label: "1 BHK" },
    { value: "2BHK", label: "2 BHK" },
    { value: "3BHK", label: "3 BHK" },
    { value: "CUSTOM", label: "Custom" }
] as const;

const DEFAULT_CAPACITIES = {
    SINGLE: 1,
    DOUBLE: 2,
    TRIPLE: 3,
    "1BHK": 2,
    "2BHK": 4,
    "3BHK": 6,
    CUSTOM: 1
};

const RoomDetails = ({ form }: RoomDetailsProps) => {
    const [rooms, setRooms] = useState<Room[]>(form.watch("rooms") || []);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [prices, setPrices] = useState<Record<string, number>>({});

    const handleTypeSelect = (type: string, checked: boolean) => {
        const newSelectedTypes = checked
            ? [...selectedTypes, type]
            : selectedTypes.filter(t => t !== type);

        setSelectedTypes(newSelectedTypes);
        form.setValue("roomTypes", newSelectedTypes);
    };

    const handlePriceChange = (type: string, price: string) => {
        const numericPrice = price === "" ? 0 : Number(price);
        const newPrices = { ...prices, [type]: numericPrice };
        setPrices(newPrices);
        form.setValue("prices", newPrices);
    };

    const addRoom = (type: string) => {
        const newRoom: Room = {
            type,
            name: `${type} Room ${rooms.filter(r => r.type === type).length + 1}`,
            isActive: true,
            price: prices[type] || 0,
            capacity: DEFAULT_CAPACITIES[type as keyof typeof DEFAULT_CAPACITIES],
            availableBeds: DEFAULT_CAPACITIES[type as keyof typeof DEFAULT_CAPACITIES],
            roomNumber: `${type}-${rooms.filter(r => r.type === type).length + 1}`
        };
        const updatedRooms = [...rooms, newRoom];
        setRooms(updatedRooms);
        form.setValue("rooms", updatedRooms);
    };

    const updateRoom = (index: number, field: keyof Room, value: any) => {
        const updatedRooms = [...rooms];
        updatedRooms[index] = {
            ...updatedRooms[index],
            [field]: value
        };
        setRooms(updatedRooms);
        form.setValue("rooms", updatedRooms);
    };

    return (
        <div className="space-y-6">
            <FormField
                control={form.control}
                name="bathroomType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bathroom Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select bathroom type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="ATTACHED">Attached</SelectItem>
                                <SelectItem value="COMMON">Common</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {form.watch("type") === "FLAT" && (
                <FormField
                    control={form.control}
                    name="bhkType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>BHK Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select BHK type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="1">1 BHK</SelectItem>
                                    <SelectItem value="2">2 BHK</SelectItem>
                                    <SelectItem value="3">3 BHK</SelectItem>
                                    <SelectItem value="4">4 BHK</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={form.control}
                name="furnishingType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Furnishing Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select furnishing type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="FULLY_FURNISHED">Fully Furnished</SelectItem>
                                <SelectItem value="SEMI_FURNISHED">Semi Furnished</SelectItem>
                                <SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div>
                <h3 className="text-lg font-semibold mb-4">Room Types</h3>
                <p className="text-sm text-gray-500 mb-4">Select the types of rooms available in your property</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ROOM_TYPES.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                            <Checkbox
                                checked={selectedTypes.includes(type.value)}
                                onCheckedChange={(checked) => handleTypeSelect(type.value, checked as boolean)}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {type.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {selectedTypes.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Room Pricing</h3>
                    <div className="grid gap-4">
                        {selectedTypes.map((type) => (
                            <Card key={type} className="p-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">{ROOM_TYPES.find(t => t.value === type)?.label}</label>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            type="number"
                                            value={prices[type] || ""}
                                            onChange={(e) => handlePriceChange(type, e.target.value)}
                                            placeholder="Enter price"
                                            className="w-32"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addRoom(type)}
                                        >
                                            Add Room
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {rooms.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Room Management</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room Number</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Available Beds</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.map((room, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            value={room.roomNumber}
                                            onChange={(e) => updateRoom(index, "roomNumber", e.target.value)}
                                            className="w-full"
                                        />
                                    </TableCell>
                                    <TableCell>{ROOM_TYPES.find(t => t.value === room.type)?.label}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={room.price}
                                            onChange={(e) => updateRoom(index, "price", Number(e.target.value))}
                                            className="w-24"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={room.capacity}
                                            onChange={(e) => updateRoom(index, "capacity", Number(e.target.value))}
                                            className="w-24"
                                            min={1}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={room.availableBeds}
                                            onChange={(e) => updateRoom(index, "availableBeds", Number(e.target.value))}
                                            className="w-24"
                                            min={0}
                                            max={room.capacity}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={room.isActive}
                                            onCheckedChange={(checked) => updateRoom(index, "isActive", checked)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default RoomDetails; 