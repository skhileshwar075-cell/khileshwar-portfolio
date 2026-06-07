export * from "./generated/api";
export * from "./generated/api.schemas";
export { setBaseUrl, setAuthTokenGetter } from "./custom-fetch";
export type { AuthTokenGetter } from "./custom-fetch";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { customFetch, type ErrorType } from "./custom-fetch";

export type PublicSummary = {
  totalProjects: number;
  totalSkills: number;
  totalCertificates: number;
  totalExperience: number;
};

export function useGetPublicSummary<
  TData = PublicSummary,
  TError = ErrorType<unknown>,
>(
  options?: UseQueryOptions<PublicSummary, TError, TData>,
) {
  return useQuery<PublicSummary, TError, TData>({
    queryKey: ["publicSummary"],
    queryFn: () => customFetch<PublicSummary>("/api/public/summary", { responseType: "json" }),
    ...options,
  });
}
