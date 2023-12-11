"use client";

import React, { useState } from "react";
import { updateCampaign } from "@/lib/actions";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ethers } from "ethers";


interface FormState {
  name: string;
  threshold: string;
  content: string;
}

interface ModifiedFields {
  name: boolean;
  threshold: boolean;
  content: boolean;
}

interface Payload {
  id: string;
  name?: string;
  thresholdWei?: bigint;
  content?: string;
}


export default function CampaignForm({ id, subdomain }: { id: string, subdomain: string }) {
  const [formState, setFormState] = useState<FormState>({ name: "", threshold: "", content: "" });
  const [modified, setModified] = useState<ModifiedFields>({ name: false, threshold: false, content: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    setModified({ ...modified, [name]: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let payload: Payload = { id };
    if (modified.name) payload.name = formState.name;
    if (modified.threshold) payload.thresholdWei = ethers.parseEther(formState.threshold);
    if (modified.content) payload.content = formState.content;

    try {
      const response = await updateCampaign(
        payload,
        { params: { subdomain } },
        null,
      );
      console.log(response);
      toast.success(`Campaign updated`);
    } catch (error: any) {
      console.error('Error updating campaign', error);
      toast.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-6 text-gray-900">
      <input
        type="text"
        name="name"
        value={formState.name}
        onChange={handleChange}
        placeholder="Name"
        className="p-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        name="threshold"
        value={formState.threshold}
        onChange={handleChange}
        placeholder="Threshold"
        className="p-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        name="content"
        value={formState.content}
        onChange={handleChange}
        placeholder="Content"
        className="p-2 border border-gray-300 rounded-md"
      />
      <div className="pb-4 w-32">
      <Button 
        type="submit"
      >
        Submit
      </Button>
      </div>
    </form>
  );
};