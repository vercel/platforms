"use client";
import { Card } from "@/components/ui/card";
import PrimaryButton from "@/components/primary-button";
import { AccommodationUnit, Place } from "@prisma/client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Uploader from "./form/uploader";
import OpenModalButton from "./open-modal-button";
import { useModal } from "./modal/provider";
import CreateAccomodationUnitForm from "./form/create-accommodation-unit-form";

export default function PropertiesCards({
  properties,
}: {
  properties: (Place & { accommodationUnit: AccommodationUnit[] })[];
}) {
  const modal = useModal();
  return (
    <div className="flex flex-col space-y-6">
      {properties.map((property) => {
        return (
          <div key={property.id}>
            <h4 className="mb-4 text-2xl font-medium">{property.name}</h4>
            <Card>
              <div className="mx-3 my-1">
                <div className="h-[9rem] w-[16rem] overflow-hidden rounded-xl">
                  <Uploader name="image" defaultValue={""} />
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  modal?.show(<CreateAccomodationUnitForm place={property} />);
                }}
              >
                <Plus className="h-4 w-4" onClick={() => {}} />
              </Button>
              {property.accommodationUnit.map((unit) => {
                return (
                  <div className="flex" key={unit.id}>
                    <div>{unit.beds}</div>
                    <div>{unit.rooms}</div>
                  </div>
                );
              })}
            </Card>
          </div>
        );
      })}
    </div>
  );
}
