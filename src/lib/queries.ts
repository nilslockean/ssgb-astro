export const COURSES_QUERY = `*[_type == "course"] | order(language asc, order asc) {
  _id,
  language,
  title,
  shortName,
  "slug": slug.current,
  excerpt,
  body,
  "heroImage": heroImage {
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
  },
  cta,
  numDays,
  order,
  featured,
  openBookingPrice,
  maxParticipants,
  minAge,
  prerequisites,
  aka,
  "norm": norm-> { title, "url": versions[-1].file.asset->url },
}`;

export const PAGES_QUERY = `*[_type == "page"] {
  _id,
  language,
  title,
  excerpt,
  "slug": slug.current,
  body
}`;

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug && language == $language][0] {
  _id,
  language,
  title,
  excerpt,
  "slug": slug.current,
  body
}`;

export const CONFIG_QUERY = `*[_type == "config"][0]{
  siteTitle,
  siteUrl,
  siteTagline,
  contact,
  defaultPrices,
  navigation
}`;
