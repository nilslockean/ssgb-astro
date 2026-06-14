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
