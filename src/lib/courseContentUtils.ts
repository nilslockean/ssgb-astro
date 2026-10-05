import type { CdaStructuredTextValue } from "@datocms/astro/StructuredText";

type StructuredTextData = CdaStructuredTextValue | undefined | null;

function hasContent(data: StructuredTextData): data is CdaStructuredTextValue {
  const children = data?.value?.document?.children;
  if (!children?.length) return false;

  return children.some((node) => {
    if (node.type !== "paragraph") return true;
    return node.children.some(
      (child) => child.type === "span" && child.value.trim().length > 0,
    );
  });
}

export function getCourseStructuredText(
  globalStructuredText: StructuredTextData,
  legacyContent: StructuredTextData,
): CdaStructuredTextValue | undefined {
  if (hasContent(globalStructuredText)) return globalStructuredText;
  if (hasContent(legacyContent)) return legacyContent;
  return undefined;
}
