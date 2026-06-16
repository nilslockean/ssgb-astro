const NAV_MENU_ITEMS = `
  items(locale: $locale) {
    ... on MenuItemRecord {
      label
      url
      subMenu {
        items(locale: $locale) {
          ... on MenuItemRecord {
            label
            url
          }
        }
      }
    }
  }
`;

export const SITE_CONFIG_QUERY = `
  query SiteConfig($locale: SiteLocale!) {
    siteConfig {
      title
      tagline(locale: $locale)
      email
      phone
      pricesSingle
      pricesDouble
      pricesMany
      pricesOpenBooking
      navPrimary { ${NAV_MENU_ITEMS} }
      navSecondary { ${NAV_MENU_ITEMS} }
      navFooter { ${NAV_MENU_ITEMS} }
      authorizedInstructorTitle(locale: $locale)
      authorizedInstructorContent(locale: $locale)
      authorizedInstructorImage(locale: $locale) { url width height alt }
    }
  }
`;

export const PAGES_QUERY = `
  query AllPages($locale: SiteLocale!) {
    allPages(locale: $locale) {
      id
      title(locale: $locale)
      excerpt(locale: $locale)
      slug(locale: $locale)
      structuredText(locale: $locale) {
        value
        blocks {
          ... on ButtonRecord {
            id
            __typename
            variant
            label
            url
          }
        }
        links {
          ... on CourseRecord {
            id
            __typename
            slug
          }
          ... on PageRecord {
            id
            __typename
            slug(locale: $locale)
          }
          ... on TripRecord {
            id
            __typename
            slug
          }
        }
      }
    }
  }
`;

export const COURSES_QUERY = `
  query AllCourses($locale: SiteLocale!) {
    allCourses(locale: $locale, orderBy: position_ASC) {
      id
      title
      slug
      excerpt
      content { value blocks links }
      featuredImage { url width height alt }
      numDaysMin
      numDaysMax
      featured
      prerequisites
      maxParticipants
      minAge
      norm { title url }
    }
  }
`;

export const TEAMS_QUERY = `
  query AllTeams($locale: SiteLocale!) {
    allTeams(locale: $locale, orderBy: position_ASC) {
      id
      name
      title(locale: $locale)
      bio(locale: $locale)
      image { url width height alt }
      position
    }
  }
`;
