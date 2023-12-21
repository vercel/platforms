"use client";
import { Card } from "@/components/ui/card";
import PrimaryButton from "@/components/buttons/primary-button";
import {
  AccommodationUnit,
  Place,
  Room,
  Bed,
  AccommodationAvailability,
} from "@prisma/client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Uploader from "./form/uploader";
import OpenModalButton from "./open-modal-button";
import { useModal } from "./modal/provider";
import CreateAccomodationUnitForm from "./form/create-accommodation-unit-form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { calcAccommodationUnitCapacity } from "@/lib/utils";

export default function PropertiesCards({
  properties,
}: {
  properties: (Place & {
    accommodationUnit: (AccommodationUnit & {
      rooms: (Room & { beds: Bed[] })[];
      availability: AccommodationAvailability[];
    } & {
    })[];
  })[];
}) {
  return (
    <div className="flex flex-col space-y-6">
      {properties.map((property) => {
        return (
          <div key={property.id}>
            <div className="flex justify-between">
              <h4 className="mb-4 text-2xl font-medium">{property.name}</h4>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Unit
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-scroll">
                  <SheetHeader>
                    <SheetTitle>Add Accommodation Units</SheetTitle>
                    <SheetDescription>
                      A rentable unit of a property, i.e., a room in a hotel.
                    </SheetDescription>
                  </SheetHeader>
                  <CreateAccomodationUnitForm place={property} />
                </SheetContent>
              </Sheet>
            </div>
            <Card>
              <div>
                {property.accommodationUnit.map((unit) => {
                  const totalBeds = unit.rooms.reduce(
                    (acc, room) => acc + room.beds.length,
                    0,
                  );

                  const capacity = calcAccommodationUnitCapacity(unit.rooms);

                  return (
                    <div className="flex p-4" key={unit.id}>
                      <div>
                        <h6 className="text-xl font-medium">{unit.name}</h6>
                        <div className="flex space-x-3">
                          <div>{unit.rooms.length} Rooms</div>
                          <div>{totalBeds} Beds</div>
                          <div>{capacity} Capacity</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
