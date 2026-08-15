import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { FORMS_QUERY } from "@lib/datoQueries";
import { LOCALE_CODES } from "@lib/routeUtils";
import { localeSchema } from "src/schemas/locale";
import type { CdaStructuredTextValue } from "@datocms/astro/StructuredText";

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
  placeholder: z.string().nullable(),
});

const formInputCoursesOptionSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormInputCoursesOptionRecord"),
  label: z.string(),
  required: z.boolean().nullable(),
  placeholder: z.string().nullable(),
});

const formInputCheckboxSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormInputCheckboxRecord"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().nullable(),
});

const formOrderTotalSchema = z.object({
  id: z.string(),
  __typename: z.literal("FormOrderTotalRecord"),
});

export const formBlockSchema = z.discriminatedUnion("__typename", [
  formInputTextSchema,
  formInputTextareaSchema,
  formInputDateSchema,
  formInputNumberSchema,
  formInputOptionSchema,
  formInputCoursesOptionSchema,
  formInputCheckboxSchema,
  formOrderTotalSchema,
]);

export type FormBlock = z.infer<typeof formBlockSchema>;

export const formSchema = z.object({
  title: z.string(),
  id: z.string(),
  description: z.string().nullable(),
  content: z.array(formBlockSchema).default([]),
  subtext: z.custom<CdaStructuredTextValue>().nullable(),
  cta: z.string(),
  language: localeSchema.default("sv"),
  redirect: z.string(),
});

const datoFormSchema = z.object({
  id: z.string(),
  formId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.array(formBlockSchema).default([]),
  subtext: z
    .object({
      structuredText: z.custom<CdaStructuredTextValue>(),
    })
    .nullable(),
  cta: z.string(),
  redirect: z.object({ slug: z.string() }),
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
        );

        logger.info(`Loaded ${allForms.length} ${locale} forms from DatoCMS`);

        for (const form of allForms) {
          const data = await parseData({
            id: `${locale}-${form.id}`,
            data: {
              title: form.title,
              description: form.description ?? null,
              content: form.content,
              id: form.formId,
              subtext: form.subtext?.structuredText ?? null,
              cta: form.cta,
              language: locale,
              redirect: form.redirect.slug,
            },
          });

          store.set({ id: `${locale}-${form.id}`, data });
        }
      }
    },
  };
}
