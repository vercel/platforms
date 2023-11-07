"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersUniqueOrgsWithRolesRecord } from "./drawer";
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";

const groups = [
  {
    label: "Personal Account",
    teams: [
      {
        label: "Alicia Koch",
        value: "personal",
      },
    ],
  },
  {
    label: "Teams",
    teams: [
      {
        label: "Acme Inc.",
        value: "acme-inc",
      },
      {
        label: "Monsters Inc.",
        value: "monsters",
      },
    ],
  },
];

type Team = (typeof groups)[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface CitySwitcherProps extends PopoverTriggerProps {
  usersOrgs: UsersUniqueOrgsWithRolesRecord;
}

export default function CitySwitcher({
  className,
  usersOrgs,
}: CitySwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    React.useState<Organization | null>(Object.values(usersOrgs)?.[0]?.organization ?? null);

  const router = useRouter();

  // React.useEffect(() => {
  //   router.replace("/city/" + selectedOrganization?.subdomain);
  // }, [selectedOrganization, router]);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a city"
            className={cn(
              "w-full justify-between px-2 dark:text-gray-300 focus-visible:ring-gray-500",
              className,
            )}
          >
            <Avatar className="h-[18px] w-[18px]">
              {selectedOrganization?.logo && (
                <AvatarImage
                  className="h-[18px] w-[18px]"
                  src={selectedOrganization?.logo}
                  alt={`${selectedOrganization?.name} logo`}
                />
              )}
              <AvatarFallback className="h-[18px] w-[18px]">
                {selectedOrganization?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="ml-3">{selectedOrganization?.name}</span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 stroke-gray-300 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup key={"Selected City"} heading={"Selected City"}>
                {Object.values(usersOrgs).map((orgAndRoles) => (
                  <CommandItem
                    key={orgAndRoles.organization.id}
                    onSelect={() => {
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`${orgAndRoles.organization.logo}`}
                        alt={`${orgAndRoles.organization.name} logo`}
                        className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {orgAndRoles.organization.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedOrganization?.id === orgAndRoles.organization.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            {/* <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create City
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList> */}
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
