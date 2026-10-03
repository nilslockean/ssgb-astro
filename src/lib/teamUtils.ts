export interface DatoJobTitle {
  id: string;
  title: string | null;
  description: string | null;
}

export function mapTeamTitles(titles: DatoJobTitle[]) {
  return titles.flatMap(({ id, title, description }) =>
    title ? [{ id, title, description: description || undefined }] : [],
  );
}
