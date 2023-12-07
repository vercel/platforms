"use client";

import React, { useState } from "react";
import { updateCampaign } from "@/lib/actions";


interface FormState {
  name: string;
  threshold: number;
  content: string;
}

export default function CampaignForm({ subdomain }: { subdomain: string }) {
  const [formState, setFormState] = useState<FormState>({ name: "", threshold: 0, content: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await updateCampaign(
        formState,
        { params: { subdomain } },
        null,
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error updating campaign', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-6 text-gray-800">
      <input
        type="text"
        name="name"
        value={formState.name}
        onChange={handleChange}
        placeholder="Name"
        className="p-2 border border-gray-300 rounded-md"
      />
      <input
        type="number"
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
      <button 
        type="submit"
        className="p-2 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};