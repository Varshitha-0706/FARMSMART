"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sprout, UserPlus } from "lucide-react";
import type { Farmer } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^\d+$/, "Phone number must contain only digits."),
  state: z.string().min(2, "State is required."),
  district: z.string().min(2, "District is required."),
  village: z.string().min(2, "Village is required."),
  cropType: z.string().min(2, "Crop type is required."),
});

type RegistrationFormProps = {
  onRegister: (data: Farmer) => void;
};

export function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      state: "",
      district: "",
      village: "",
      cropType: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onRegister(values);
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary p-3">
          <Sprout className="h-10 w-10 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-headline text-primary">
          Farmsmart
        </CardTitle>
        <CardDescription>
          Register to get started with AI-powered crop monitoring and market
          advisory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ram Singh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Andhra Pradesh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Guntur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Village</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tadikonda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Crop Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cotton, Chilli" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              <UserPlus />
              Register Now
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
