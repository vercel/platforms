import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CampaignTier } from "@prisma/client";
import { useState, useEffect } from 'react';


interface CampaignTierEditorProps {
  tier: CampaignTier;
  onSave: (tier: CampaignTier) => void;
}

interface EditedFields {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
}

export default function CampaignTierEditor({ tier, onSave }: CampaignTierEditorProps) {
  const [editedTier, setEditedTier] = useState<EditedFields>(
    { name: tier.name, description: tier.description, quantity: tier.quantity,
      price: tier.price });

  useEffect(() => {
    if (tier) {
      setEditedTier({
        name: tier.name,
        description: tier.description ?? undefined,
        quantity: tier.quantity ?? undefined,
        price: tier.price ?? undefined,
      });
    }
  }, [tier]);

  const handleFieldChange = (field: string, value: string | number) => {
    setEditedTier(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mb-4 p-4 border rounded-lg">
      <h3 className="text-lg mb-2">Campaign Tier</h3>
      <div className="space-y-4">
        <Input
          type="text" 
          id="tierName"
          value={editedTier.name}
          placeholder="Tier name"
          onChange={(e) => handleFieldChange('name', e.target.value)}
        />
        <Textarea 
          id="description"
          value={editedTier.description || ''}
          placeholder="Tier description"
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />
        <Input 
          type="number" 
          id="quantity"
          value={editedTier.quantity ?? ''}
          placeholder="Available quantity"
          onChange={(e) => handleFieldChange('quantity', e.target.valueAsNumber)}
        />
        <Input 
          type="number"
          id="price"
          value={editedTier.price}
          placeholder="Price (ETH)"
          onChange={(e) => handleFieldChange('price', e.target.valueAsNumber)}
        />
      </div>
      <Button
        className="mt-2"
        onClick={() => onSave(editedTier)}
      >
        Save
      </Button>
    </div>
  );
}
