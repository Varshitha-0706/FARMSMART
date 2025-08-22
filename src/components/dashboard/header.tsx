"use client";

import { Sprout } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type HeaderProps = {
  farmerName: string;
};

export function Header({ farmerName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Sprout className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            Krishi Sahayak
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden text-sm text-foreground md:block">
            Welcome, <span className="font-bold">{farmerName}</span>
          </p>
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://api.dicebear.com/8.x/initials/svg?seed=${farmerName}`}
              alt={farmerName}
            />
            <AvatarFallback>{farmerName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
