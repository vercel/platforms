import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function SettingsPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace settings</CardTitle>
          <CardDescription>
            Update profile details, integrations, and preferences for the {subdomain}
            workspace.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Control the business identity shared with users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company name</Label>
              <Input id="company-name" placeholder="Acme Industries" defaultValue={subdomain} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-email">Contact email</Label>
              <Input id="company-email" type="email" placeholder="operations@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-domain">Primary domain</Label>
              <Input
                id="company-domain"
                type="url"
                placeholder={`https://${subdomain}.example.com`}
              />
            </div>
            <Button size="sm" className="mt-2 w-fit">
              Save profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Manage API keys and connected services powering your workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="integration-select">Add integration</Label>
              <select
                id="integration-select"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a provider
                </option>
                <option value="slack">Slack</option>
                <option value="notion">Notion</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key">API key</Label>
              <Input id="api-key" type="password" placeholder="***********" />
            </div>
            <Button size="sm" className="w-fit">
              Connect integration
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme preferences</CardTitle>
          <CardDescription>
            Toggle between light, dark, or the Northern Lights OKLCH preset.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm">
              Light
            </Button>
            <Button variant="ghost" size="sm">
              Dark
            </Button>
            <Button variant="ghost" size="sm">
              Northern Lights
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Theme tokens are defined in <code>app/globals.css</code>. Update the OKLCH
            variables or add new presets to expand the palette for business users.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
