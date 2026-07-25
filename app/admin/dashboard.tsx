'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { deleteSubdomainAction } from '@/app/actions';
import { rootDomain, protocol } from '@/lib/utils';

type Tenant = {
  subdomain: string;
  emoji: string;
  createdAt: number;
};

type DeleteState = {
  error?: string;
  success?: string;
};

function DashboardHeader() {
  // TODO: You can add authentication here with your preferred auth provider

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Subdomain Management</h1>
      <div className="flex items-center gap-4">
        <Link
          href={`${protocol}://${rootDomain}`}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {rootDomain}
        </Link>
      </div>
    </div>
  );
}

function TenantCard({
  tenant,
  onDelete
}: {
  tenant: Tenant;
  onDelete: (result: DeleteState) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('subdomain', tenant.subdomain);
      const result = await deleteSubdomainAction({}, formData);
      onDelete(result);
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{tenant.subdomain}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-4xl">{tenant.emoji}</div>
          <div className="text-sm text-gray-500">
            Created: {new Date(tenant.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="mt-4">
          <a
            href={`${protocol}://${tenant.subdomain}.${rootDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            Visit subdomain →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function TenantGrid({
  tenants,
  onDelete
}: {
  tenants: Tenant[];
  onDelete: (result: DeleteState) => void;
}) {
  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No subdomains have been created yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => (
        <TenantCard key={tenant.subdomain} tenant={tenant} onDelete={onDelete} />
      ))}
    </div>
  );
}

export function AdminDashboard({ tenants }: { tenants: Tenant[] }) {
  const [message, setMessage] = useState<DeleteState>({});

  const handleDelete = (result: DeleteState) => {
    setMessage(result);
    setTimeout(() => setMessage({}), 3000);
  };

  return (
    <div className="space-y-6 relative p-4 md:p-8">
      <DashboardHeader />
      <TenantGrid tenants={tenants} onDelete={handleDelete} />

      {message.error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
          {message.error}
        </div>
      )}

      {message.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          {message.success}
        </div>
      )}
    </div>
  );
}
