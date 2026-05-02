// A simple type for static nav links
export type NavLink = {
  label: string;
  path: string;
  className?: string;
};

export type Navigation = Array<{
  link: NavLink;
  subMenu?: {
    nav: Navigation;
    more?: NavLink;
  };
}>;

// Useful if you ever want to render footer-specific or header-specific menus
export enum NavArea {
  MOBILE = "mobile",
  SIDEBAR_ASIDE = "aside",
  SIDEBAR_COURSE = "courses",
  FOOTER = "footer",
  // HEADER = "header_buttons",
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
  COURSE_REFRESHER = "course_refresher",

  TRIPS = "trips",
  TRIP_ITALY = "trip_italy",
  TRIP_SPAIN = "trip_spain",

  INSTRUCTOR_TRAINING = "instructor_training",

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
  [Slug.COURSE_REFRESHER]: "/kurser/avrostning",

  [Slug.TRIPS]: "/resor",
  [Slug.TRIP_ITALY]: "/resor/italien",
  [Slug.TRIP_SPAIN]: "/resor/spanien",

  [Slug.INSTRUCTOR_TRAINING]: "/utbildning",

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
export const courseNav: Record<Locale, Navigation> = {
  sv: [
    { link: link(Slug.COURSE_CRAG_BASIC, "Grundkurs klippa") },
    { link: link(Slug.COURSE_CRAG_ADV, "Fortsättningskurs klippa") },
    { link: link(Slug.COURSE_RESCUE_BASIC, "Räddning 1") },
    { link: link(Slug.COURSE_RESCUE_ADV, "Räddning 2") },
    { link: link(Slug.COURSE_SPORT, "Sportklätterkurs") },
    { link: link(Slug.COURSE_ASSISTANT, "Hjälpinstruktörskurs") },
  ],
  da: [],
  en: [],
};

export const mobileNav: Record<Locale, Navigation> = {
  sv: [
    { link: link(Slug.HOME, "Hem") },
    {
      link: link(Slug.COURSES, "Kurser"),
      subMenu: {
        nav: courseNav.sv,
        more: link(Slug.COURSES, "Fler kurser →"),
      },
    },
    {
      link: link(Slug.TRIPS, "Resor"),
      subMenu: {
        nav: [
          { link: link(Slug.TRIP_ITALY, "Klättring i Dolomiterna") },
          { link: link(Slug.TRIP_SPAIN, "Sportklättring i Spanien") },
        ],
      },
    },
    { link: link(Slug.INSTRUCTOR_TRAINING, "Utbildning") },
    { link: link(Slug.PRICES, "Priser") },
    { link: link(Slug.ABOUT, "Om") },
    { link: link(Slug.CONTACT, "Kontakt") },
  ],
  da: [],
  en: [],
};

export const mainNav: Record<Locale, Navigation> = {
  sv: [
    { link: link(Slug.COURSES, "Kurser") },
    { link: link(Slug.TRIPS, "Resor") },
    { link: link(Slug.INSTRUCTOR_TRAINING, "Utbildning") },
    { link: link(Slug.PRICES, "Priser") },
    { link: link(Slug.ABOUT, "Om") },
    { link: link(Slug.CONTACT, "Kontakt") },
  ],
  da: [],
  en: [],
};

export const footerNav: Record<Locale, Navigation> = {
  sv: [
    { link: link(Slug.TERMS_BOOKING, "Bokningsvillkor") },
    { link: link(Slug.TERMS_PRIVACY, "Integritetspolicy") },
  ],
  da: [],
  en: [],
};

type Locale = "sv" | "da" | "en";
