import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CampaignTier } from "@prisma/client";


interface CampaignTierEditorProps {
  tier: CampaignTier;
  onChange: (field: string, value: string | number | undefined) => void;
}

export default function CampaignTierEditor({ tier, onChange }: CampaignTierEditorProps) {
  return (
    <div className="mb-4 p-4 border rounded-lg">
      <h3 className="text-lg mb-2">Campaign Tier</h3>
      <div className="space-y-4">
        <Input 
          type="text" 
          value={tier.name}
          placeholder="Tier name"
          onChange={(e) => onChange('name', e.target.value)} 
        />
        <Textarea 
          value={tier.description || ''} 
          placeholder="Tier description"
          onChange={(e) => onChange('description', e.target.value)} 
        />
        <Input 
          type="number" 
          value={tier.quantity ?? ''}
          placeholder="Available quantity"
          onChange={(e) => onChange('quantity', e.target.valueAsNumber)} 
        />
        <Input 
          type="number" 
          value={tier.price}
          placeholder="Price (ETH)"
          onChange={(e) => onChange('price', e.target.valueAsNumber)} 
        />
      </div>
    </div>
  );
}
