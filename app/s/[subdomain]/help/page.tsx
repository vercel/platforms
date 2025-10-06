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

export default async function HelpPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const faqs = [
    {
      question: 'How do I invite teammates?',
      answer:
        'Navigate to Settings > Profile to invite users. Everyone gets an onboarding checklist tailored to their role.'
    },
    {
      question: 'Where can I see failed workflows?',
      answer:
        'Open the Workflows page and filter by status. Use the audit dialog to inspect each execution step.'
    },
    {
      question: 'How do I export data for compliance reviews?',
      answer:
        'Visit the Audit Logs page and select Export CSV to generate a time-bounded report for auditors.'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Help and support</CardTitle>
          <CardDescription>
            Resources, documentation, and contact options for the {subdomain} team.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
          <CardDescription>Quick answers to the most common workspace questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-lg border border-border/60 bg-card/40 p-4">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact support</CardTitle>
          <CardDescription>Send a note to our support team or escalate an incident.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Example: Need help with billing" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              rows={4}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              placeholder="Share the context, relevant workflow IDs, and desired outcome."
            />
          </div>
          <Button size="sm" className="w-fit">
            Submit request
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation highlights</CardTitle>
          <CardDescription>
            Explore detailed guides to adopt platform features with confidence.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-dashed border-primary/40 p-4">
            <h3 className="text-sm font-medium text-foreground">Workflow design patterns</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Learn how to structure multi-step automations, handle branching, and ship resilient processes.
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-secondary/40 p-4">
            <h3 className="text-sm font-medium text-foreground">Tenant security checklist</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Review access controls, audit log policies, and integration hardening steps for regulated teams.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
