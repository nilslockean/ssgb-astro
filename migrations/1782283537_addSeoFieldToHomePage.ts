import { Client } from 'datocms/lib/cma-client-node';

export default async function(client: Client): Promise<void> {
  const itemTypes = await client.itemTypes.list();
  const homePage = itemTypes.find((it) => it.api_key === 'home_page');

  if (!homePage) {
    throw new Error('home_page model not found');
  }

  await client.fields.create(homePage.id, {
    label: 'SEO Settings & Social',
    api_key: 'seo_settings_social',
    field_type: 'seo',
    localized: true,
  });
}
