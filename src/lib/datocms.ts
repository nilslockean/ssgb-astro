import { executeQuery as libExecuteQuery } from "@datocms/cda-client";
import { DATOCMS_CDA_TOKEN } from "astro:env/server";
import { z } from "astro/zod";

export async function executeQuery<S extends z.ZodTypeAny>(
  query: string,
  schema: S,
  variables?: Record<string, unknown>,
  log?: boolean,
): Promise<z.infer<S>> {
  const raw: unknown = await libExecuteQuery(query, {
    variables,
    token: DATOCMS_CDA_TOKEN,
  });
  if (log) {
    console.log(JSON.stringify(raw, null, 2));
  }
  return schema.parse(raw);
}
