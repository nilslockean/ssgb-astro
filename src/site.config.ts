// A simple type for static nav links
export type NavLink = {
  label: string;
  path: string;
  className?: string;
};

export type Navigation = Array<{
  link: NavLink;
  subMenu?: Navigation;
}>;

// Useful if you ever want to render footer-specific or header-specific menus
export enum NavArea {
  MOBILE = "mobile",
  SIDEBAR_ASIDE = "aside",
  SIDEBAR_COURSE = "courses",
  FOOTER = "footer",
  HEADER = "header_buttons",
}

// Slugs as stable identifiers
export enum Slug {
  HOME = "home",
  COURSES = "courses",
  TRY = "try",
  PRICES = "prices",
  ABOUT = "about",
  CONTACT = "contact",

  COURSE_TOPROPE = "course_toprope",
  COURSE_CRAG_BASIC = "course_crag_basic",
  COURSE_CRAG_ADV = "course_crag_adv",
  COURSE_RESCUE_BASIC = "course_rescue_basic",
  COURSE_RESCUE_ADV = "course_rescue_adv",
  COURSE_SPORT = "course_sport",
  COURSE_ROPE_SOLO_BASIC = "course_rope_solo_basic",
  COURSE_TRAD = "course_trad",
  COURSE_ASSISTANT = "course_assisting_instructor",

  TRIPS = "trips",
  TRIP_ITALY = "trip_italy",
  TRIP_SPAIN = "trip_spain",

  TERMS_PRIVACY = "terms_privacy",
  TERMS_BOOKING = "terms_booking",

  WEB_DEVELOPMENT = "web_dev",

  FORM_SUCCESS = "thank_you",
}

// Canonical path map (single source of truth)
export const Paths: Record<Slug, string> = {
  [Slug.HOME]: "/",
  [Slug.COURSES]: "/kurser",
  [Slug.TRY]: "/prova-pa",
  [Slug.PRICES]: "/priser",
  [Slug.ABOUT]: "/om",
  [Slug.CONTACT]: "/kontakt",

  [Slug.COURSE_TOPROPE]: "/kurser/topprepskurs",
  [Slug.COURSE_CRAG_BASIC]: "/kurser/grundkurs",
  [Slug.COURSE_CRAG_ADV]: "/kurser/fortsattningskurs",
  [Slug.COURSE_RESCUE_BASIC]: "/kurser/raddning-1",
  [Slug.COURSE_RESCUE_ADV]: "/kurser/raddning-2",
  [Slug.COURSE_SPORT]: "/kurser/sportkurs",
  [Slug.COURSE_ROPE_SOLO_BASIC]: "/kurser/clogkurs",
  [Slug.COURSE_TRAD]: "/kurser/tradkurs",
  [Slug.COURSE_ASSISTANT]: "/kurser/hjalpinstruktorskurs",

  [Slug.TRIPS]: "/resor",
  [Slug.TRIP_ITALY]: "/resor/italien",
  [Slug.TRIP_SPAIN]: "/resor/spanien",

  [Slug.TERMS_BOOKING]: "/bokningsvillkor",
  [Slug.TERMS_PRIVACY]: "/integritetspolicy",

  [Slug.WEB_DEVELOPMENT]: "/webb",

  [Slug.FORM_SUCCESS]: "/tack",
};

export function getPath(slug: Slug): string {
  return Paths[slug];
}

// Helper factory: link for a slug with custom label
function link(slug: Slug, label: string, className?: string): NavLink {
  return { label, path: getPath(slug), className };
}

// Static navigation definitions
const courseNav: Navigation = [
  // { link: link(Slug.COURSE_TOPROPE, "Topprepskurs") },
  { link: link(Slug.COURSE_CRAG_BASIC, "Grundkurs klippa") },
  { link: link(Slug.COURSE_CRAG_ADV, "Fortsättningskurs klippa") },
  { link: link(Slug.COURSE_RESCUE_BASIC, "Räddning 1") },
  { link: link(Slug.COURSE_RESCUE_ADV, "Räddning 2") },
  { link: link(Slug.COURSE_SPORT, "Sportklätterkurs") },
  { link: link(Slug.COURSE_ASSISTANT, "Hjälpinstruktörskurs") },
  // { link: link(Slug.COURSE_TRAD, "Tradkurs") },
  // { link: link(Slug.COURSE_ROPE_SOLO_BASIC, "Clogkurs") },
];

const tripNav: Navigation = [
  { link: link(Slug.TRIP_ITALY, "Klättring i Dolomiterna") },
  { link: link(Slug.TRIP_SPAIN, "Sportklättring i Spanien") }
];

const mobileNav: Navigation = [
  { link: link(Slug.HOME, "Hem") },
  { link: link(Slug.COURSES, "Kurser"), subMenu: courseNav },
  { link: link(Slug.TRIPS, "Resor"), subMenu: tripNav },
  { link: link(Slug.PRICES, "Priser") },
  { link: link(Slug.ABOUT, "Om") },
  { link: link(Slug.CONTACT, "Kontakt") },
];

const mainNav: Navigation = [
  { link: link(Slug.COURSES, "Kurser") },
  { link: link(Slug.TRIPS, "Resor") },
  { link: link(Slug.PRICES, "Priser") },
  { link: link(Slug.ABOUT, "Om") },
  { link: link(Slug.CONTACT, "Kontakt") },
];

const footerNav: Navigation = [
  { link: link(Slug.TERMS_BOOKING, "Bokningsvillkor") },
  { link: link(Slug.TERMS_PRIVACY, "Integritetspolicy") },
];

const headerNav: Navigation = [
  { link: link(Slug.COURSES, "Boka kurs") },
  { link: link(Slug.CONTACT, "Ställ en fråga") },
];

export type SiteConfig = {
  siteTitle: string;
  siteUrl: string;
  siteTagline: string;
  contact: {
    email: string;
    phone: string;
  };
  defaultPrices: {
    openBooking: number;
    privateSingle: number;
    privateDouble: number;
    privateMany: number;
  };
  navigation: Record<NavArea, Navigation>;
};

// Site-level config
export const siteConfig = {
  siteTitle: "Sydsveriges Guidebyrå",
  siteUrl: "https://ssgb.se",
  siteTagline: "Klätterkurser på Kullaberg, i Spanien och Itailen",

  // Contact info if you ever want it on footer pages
  contact: {
    email: "instruktor@ssgb.se",
    phone: "+46 (0) 70-494 77 82",
  },

  defaultPrices: {
    openBooking: 3600,
    privateSingle: 4200,
    privateDouble: 2500,
    privateMany: 2200,
  },

  // Primary navigation, *excluding* dynamic course submenu
  // Courses submenu is added at runtime by your Layout.astro
  navigation: {
    [NavArea.SIDEBAR_ASIDE]: mainNav,
    [NavArea.SIDEBAR_COURSE]: courseNav,
    [NavArea.FOOTER]: footerNav,
    [NavArea.MOBILE]: mobileNav,
    [NavArea.HEADER]: headerNav,
  },
} as const satisfies SiteConfig;

export default siteConfig;
