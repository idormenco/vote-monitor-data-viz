"use client";

import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import type { CountryElections } from "./utils";

interface CountryElectionsViewSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  countryElections: CountryElections | null;
}

export function CountryElectionsViewSheet({
  countryElections,
  ...props
}: CountryElectionsViewSheetProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Sheet {...props}>
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>
              Elections missions in {countryElections?.countryCode ?? ""}
            </SheetTitle>
            <SheetDescription>
              Navigate to each election for a better overview
            </SheetDescription>
          </SheetHeader>
          {/* Ensure ScrollArea takes up remaining height */}
          <ScrollArea className="flex-1 w-full flex flex-col gap-5 overflow-auto  pb-4">
            {countryElections?.monitoredElections.map((election) => (
              <Card key={election.id} className="border shadow-sm m-4">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    {election.startDate} : {election.title}
                  </CardTitle>
                  <CardDescription>{election.englishTitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>{election.shortDescription}</div>
                  <Button type="button" variant={"link"}>
                    <Link to="/elections/$id" params={{ id: election.id }}>
                      More details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
