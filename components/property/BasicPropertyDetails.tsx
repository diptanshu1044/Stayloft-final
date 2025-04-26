"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PropertyType, TenantType } from "@prisma/client";

interface BasicPropertyDetailsProps {
    form: UseFormReturn<any>;
}

const BasicPropertyDetails = ({ form }: BasicPropertyDetailsProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Details</h3>

            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter property name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="FLAT">Flat</SelectItem>
                                <SelectItem value="PG">PG</SelectItem>
                                <SelectItem value="HOSTEL">Hostel</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter property description"
                                className="min-h-[100px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="TenantType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tenant Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select tenant type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="BOYS">Boys Only</SelectItem>
                                <SelectItem value="GIRLS">Girls Only</SelectItem>
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
                        <FormLabel>Security Deposit (₹)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="Enter security deposit amount"
                                {...field}
                                onChange={(e) => {
                                    const value = e.target.value === "" ? 0 : Number(e.target.value);
                                    field.onChange(value);
                                }}
                                value={field.value || ""}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default BasicPropertyDetails; 