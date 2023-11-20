"use client";
import { Card } from "@/components/ui/card";
import PrimaryButton from "@/components/primary-button";
import { AccommodationUnit, Place, Room, Bed } from "@prisma/client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Uploader from "./form/uploader";
import OpenModalButton from "./open-modal-button";
import { useModal } from "./modal/provider";
import CreateAccomodationUnitForm from "./form/create-accommodation-unit-form";

export default function PropertiesCards({
  properties,
}: {
  properties: (Place & {
    accommodationUnit: (AccommodationUnit & {
      rooms: (Room & { beds: Bed[] })[];
    })[];
  })[];
}) {
  const modal = useModal();
  return (
    <div className="flex flex-col space-y-6">
      {properties.map((property) => {
        return (
          <div key={property.id}>
            <div className="flex justify-between">
              <h4 className="mb-4 text-2xl font-medium">{property.name}</h4>
              <Button
                onClick={() => {
                  modal?.show(<CreateAccomodationUnitForm place={property} />);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Unit
              </Button>
            </div>
            <Card>
              <div>
                {property.accommodationUnit.map((unit) => {
                  const totalBeds = unit.rooms.reduce(
                    (acc, room) => acc + room.beds.length,
                    0,
                  );

                  return (
                    <div className="flex" key={unit.id}>
                      <div>Rooms: {unit.rooms.length}</div>
                      <div>Beds: {totalBeds}</div>
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
