import useSWR from "swr";

import { DomainResponse, DomainVerificationStatusProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";

export function useDomainStatus({ domain }: { domain: string }) {
  const { data, isValidating } = useSWR<{
    domainJson: DomainResponse & { error: { code: string; message: string } };
    status: DomainVerificationStatusProps;
  }>(`/api/domain/${domain}/verify`, fetcher, {
    keepPreviousData: true,
    refreshInterval: 5000,
    revalidateOnMount: true,
  });

  return {
    domainJson: data?.domainJson,
    loading: isValidating,
    status: data?.status,
  };
}
