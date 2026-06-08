import { executeQuery as libExecuteQuery } from "@datocms/cda-client";
import { DATOCMS_CDA_TOKEN } from "astro:env/server";

export async function executeQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  console.log({ DATOCMS_CDA_TOKEN });
  return libExecuteQuery(query, {
    variables,
    token: DATOCMS_CDA_TOKEN,
  }) as Promise<T>;
}
