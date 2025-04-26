"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Features } from "@prisma/client";

interface PropertyAvailabilityProps {
    form: UseFormReturn<any>;
}

const FEATURES = [
    { value: "WIFI", label: "WiFi" },
    { value: "AC", label: "AC" },
    { value: "TV", label: "TV" },
    { value: "MESS", label: "Mess" },
    { value: "LAUNDRY", label: "Laundry" },
    { value: "PARKING", label: "Parking" },
    { value: "SECURITY", label: "Security" },
    { value: "IN_TIME", label: "In Time" }
] as const;

const PropertyAvailability = ({ form }: PropertyAvailabilityProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Availability & Features</h3>

            <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="COED">Co-ed</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="securityDeposit"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Security Deposit</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="Enter security deposit amount"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="foodIncluded"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Food Included</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            {form.watch("foodIncluded") && (
                <FormField
                    control={form.control}
                    name="foodPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Food Price (per month)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter food price"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={form.control}
                name="features"
                render={() => (
                    <FormItem>
                        <FormLabel>Features</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {FEATURES.map((feature) => (
                                <FormField
                                    key={feature.value}
                                    control={form.control}
                                    name="features"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={feature.value}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(feature.value)}
                                                        onCheckedChange={(checked) => {
                                                            const currentValue = field.value || [];
                                                            return checked
                                                                ? field.onChange([...currentValue, feature.value])
                                                                : field.onChange(
                                                                    currentValue.filter((value) => value !== feature.value)
                                                                );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {feature.label}
                                                </FormLabel>
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

export default PropertyAvailability; 