"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const roomTypes = [
  { id: "SINGLE", label: "Single", capacity: 1 },
  { id: "DOUBLE", label: "Double", capacity: 2 },
  { id: "TRIPLE", label: "Triple", capacity: 3 },
  { id: "BHK1", label: "1 BHK", capacity: 1 },
  { id: "BHK2", label: "2 BHK", capacity: 2 },
  { id: "BHK3", label: "3 BHK", capacity: 3 },
  { id: "CUSTOM", label: "Custom", capacity: 1 },
];

const genderTypes = [
  { id: "MALE", label: "Boys Only" },
  { id: "FEMALE", label: "Girls Only" },
  { id: "COED", label: "Co-ed" },
];

interface RoomDetailsProps {
  form: UseFormReturn<any>;
}

const RoomDetails = ({ form }: RoomDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="bhkType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BHK Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  {[1, 2, 3, 4].map((bhk) => (
                    <FormItem key={bhk} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={bhk.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {`${bhk} BHK`}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathroomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathroom Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="attached" />
                    </FormControl>
                    <FormLabel className="font-normal">Attached</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="common" />
                    </FormControl>
                    <FormLabel className="font-normal">Common</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property For</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {genderTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value={type.id} />
                      <Label>{type.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="furnishingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Furnishing Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="FULLY_FURNISHED" />
                    <Label>Fully Furnished</Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="SEMI_FURNISHED" />
                    <Label>Semi Furnished</Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="UNFURNISHED" />
                    <Label>Unfurnished</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="rooms"
        render={() => (
          <FormItem>
            <FormLabel>Room Types</FormLabel>
            <FormDescription>
              Select the types of rooms available in your property
            </FormDescription>
            <div className="flex flex-col gap-4">
              {roomTypes.map(({ id, label, capacity }) => (
                <FormField
                  key={id}
                  control={form.control}
                  name="rooms"
                  render={({ field }) => {
                    const currentRooms = field.value || [];
                    const isSelected = currentRooms.some((room: any) => room.type === id);

                    return (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Add new room type
                                const newRoom = {
                                  name: `${label} Room`,
                                  roomNumber: `${id}-1`,
                                  type: id,
                                  price: capacity * 1000, // Default price based on capacity
                                  capacity: capacity,
                                  availableBeds: capacity,
                                  isActive: true
                                };
                                field.onChange([...currentRooms, newRoom]);
                              } else {
                                // Remove room type
                                const filteredRooms = currentRooms.filter(
                                  (room: any) => room.type !== id
                                );
                                field.onChange(filteredRooms);
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{label}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RoomDetails;
