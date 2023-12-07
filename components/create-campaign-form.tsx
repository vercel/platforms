"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateCampaignSchema } from '@/lib/schema';
import { Campaign, Organization } from "@prisma/client";
import { updateCampaign } from '@/lib/actions';
import { useParams } from "next/navigation";


interface Data {
  name: string,
  threshold: number,
  content: string
}


export default function CampaignEditorForm(
  campaign: Campaign,
  organization: Organization
) {
  const [name, setName] = useState(campaign.name);
  const [threshold, setThreshold] = useState(campaign.threshold);
  const [content, setContent] = useState(campaign.content);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(UpdateCampaignSchema),
  });

  const { subdomain } = useParams() as { subdomain: string };

  return (
    <form onSubmit={handleSubmit}>
      <Input {...register('name')} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
      <Input {...register('threshold')} value={threshold} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThreshold(e.target.value)} />
      <Input {...register('content')} value={content} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)} />
      <button type="submit">Update Campaign</button>
    </form>
  );
}