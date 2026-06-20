import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { FORMS_QUERY } from "@lib/datoQueries";
import { LOCALE_CODES } from "@lib/routeUtils";
import { localeSchema } from "src/schemas/locale";

const formInputTextSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormInputTextRecord"),
  fieldType: z.enum(["text", "email", "tel"]),
  label: z.string(),
  name: z.string(),
  required: z.boolean().nullable(),
});

const formInputTextareaSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormInputTextareaRecord"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().nullable(),
  placeholder: z.string().nullable(),
});

const formInputDateSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormInputDateRecord"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().nullable(),
});

const formInputNumberSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormInputNumberRecord"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().nullable(),
  min: z.number().nullable(),
  max: z.number().nullable(),
});

const formInputOptionValueSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormInputOptionValueRecord"),
  label: z.string(),
  name: z.string(),
});

const formInputOptionSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormInputOptionRecord"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().nullable(),
  options: z.array(formInputOptionValueSchema).default([]),
  defaultValue: z.string().nullable(),
  readonly: z.boolean().nullable(),
});

export const formBlockSchema = z.discriminatedUnion("__typename", [
  formInputTextSchema,
  formInputTextareaSchema,
  formInputDateSchema,
  formInputNumberSchema,
  formInputOptionSchema,
]);

export type FormBlock = z.infer<typeof formBlockSchema>;

export const formSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  content: z.array(formBlockSchema).default([]),
  cta: z.string(),
  language: localeSchema.default("sv"),
  action: z.string(),
});

const datoFormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.array(formBlockSchema).default([]),
  cta: z.string(),
  action: z.string(),
});

export function datoFormsLoader(): Loader {
  return {
    name: "dato-forms-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      for (const locale of LOCALE_CODES) {
        const { allForms } = await executeQuery(
          FORMS_QUERY,
          z.object({ allForms: z.array(datoFormSchema) }),
          { locale },
          true,
        );

        logger.info(`Loaded ${allForms.length} ${locale} forms from DatoCMS`);

        for (const form of allForms) {
          const data = await parseData({
            id: `${locale}-${form.id}`,
            data: {
              title: form.title,
              description: form.description ?? null,
              content: form.content,
              cta: form.cta,
              language: locale,
              action: form.action,
            },
          });

          store.set({ id: `${locale}-${form.id}`, data });
        }
      }
    },
  };
}
