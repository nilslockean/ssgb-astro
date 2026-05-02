export type Locale = "sv" | "da" | "en";

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

export enum NavArea {
  MOBILE = "mobile",
  SIDEBAR_ASIDE = "aside",
  SIDEBAR_COURSE = "courses",
  FOOTER = "footer",
}

export enum Slug {
  HOME = "home",
  COURSES = "courses",
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

export const Paths: {
  sv: Record<Slug, string>;
  da: Partial<Record<Slug, string>>;
  en: Partial<Record<Slug, string>>;
} = {
  sv: {
    [Slug.HOME]: "/",
    [Slug.COURSES]: "/kurser",
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
  },
  da: {
    [Slug.HOME]: "/",
    [Slug.COURSES]: "/kurser",
  },
  en: {
    [Slug.HOME]: "/",
    [Slug.COURSES]: "/courses",
  },
};

// Returns the path segment and the locale that actually has it (falls back to "sv").
export function resolveSlug(
  slug: Slug,
  locale: Locale = "sv",
): { path: string; locale: Locale } {
  const localePath = locale !== "sv" ? Paths[locale]?.[slug] : undefined;
  if (localePath !== undefined) return { path: localePath, locale };
  return { path: Paths.sv[slug], locale: "sv" };
}

// Returns just the path segment. Use resolveSlug when you also need the effective locale.
export function getPath(slug: Slug, locale: Locale = "sv"): string {
  return resolveSlug(slug, locale).path;
}
