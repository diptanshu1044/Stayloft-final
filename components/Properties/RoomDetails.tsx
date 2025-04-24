"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const occupancyTypes = [
  { id: "single", label: "Single" },
  { id: "double", label: "Double" },
  { id: "triple", label: "Triple" },
];

const genderTypes = [
  { id: "boys", label: "Boys Only" },
  { id: "girls", label: "Girls Only" },
  { id: "coed", label: "Co-ed" },
];

interface RoomDetailsProps {
  form: UseFormReturn<any>;
}

const RoomDetails = ({ form }: RoomDetailsProps) => {
  const selectedOccupancies = form.watch("occupancyTypes") || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="totalRooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Rooms/Beds</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={1} />
              </FormControl>
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
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    {[1, 2, 3, 4, "other"].map((bhk) => (
                      <FormItem key={bhk} className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value={bhk.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {bhk === "other" ? "Other" : `${bhk} BHK`}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  {genderTypes.map(({ id, label }) => (
                    <FormItem key={id} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={id} />
                      </FormControl>
                      <FormLabel className="font-normal">{label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="occupancyTypes"
        render={() => (
          <FormItem>
            <FormLabel>Room Types</FormLabel>
            <div className="flex flex-col gap-4">
              {occupancyTypes.map(({ id, label }) => (
                <FormField
                  key={id}
                  control={form.control}
                  name="occupancyTypes"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              const updated = checked
                                ? [...current, id]
                                : current.filter((value: string) => value !== id);
                              field.onChange(updated);
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

      {selectedOccupancies.map((type: string) => (
        <FormField
          key={type}
          control={form.control}
          name={`prices.${type}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Price for ${type} occupancy (₹)`}</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      <FormField
        control={form.control}
        name="securityDeposit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Security Deposit</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              <FormControl>
                <Input type="number" placeholder="Amount/Percentage" {...field} min={0} />
              </FormControl>
              <RadioGroup
                onValueChange={(value) => form.setValue("depositType", value)}
                defaultValue={form.watch("depositType") || "amount"}
                className="flex gap-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="amount" />
                  </FormControl>
                  <FormLabel className="font-normal">Amount</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="percentage" />
                  </FormControl>
                  <FormLabel className="font-normal">Percentage</FormLabel>
                </FormItem>
              </RadioGroup>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="hasBalcony"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Balcony</FormLabel>
                <FormDescription>
                  Does the room include a balcony?
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasAC"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Air Conditioning</FormLabel>
                <FormDescription>
                  Is AC available in the room?
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="foodIncluded"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Food Option</FormLabel>
                <FormDescription>
                  Include food in room price?
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
            {field.value && (
              <FormField
                control={form.control}
                name="foodPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Food Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default RoomDetails;
