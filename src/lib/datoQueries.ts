const NAV_MENU_ITEMS = `
  items(locale: $locale) {
    ... on MenuItemRecord {
      link {
        ... on PageRecord {
          __typename
          slug(locale: $locale)
          title(locale: $locale)
        }
        ... on CourseRecord {
          __typename
          slug(locale: $locale)
          title(locale: $locale)
        }
        ... on TripRecord {
          __typename
          slug(locale: $locale)
          title(locale: $locale)
        }
      }
      label
      newTab
      subMenu {
        items(locale: $locale) {
          ... on MenuItemRecord {
            link {
              ... on PageRecord {
                __typename
                slug(locale: $locale)
                title(locale: $locale)
              }
              ... on CourseRecord {
                __typename
                slug(locale: $locale)
                title(locale: $locale)
              }
              ... on TripRecord {
                __typename
                slug(locale: $locale)
                title(locale: $locale)
              }
            }
            label
          }
        }
      }
    }
  }
`;

const BUTTON_LINK = `
  link {
    __typename
    ... on PageRecord {
      slug(locale: $locale)
    }
    ... on CourseRecord {
      slug
    }
    ... on TripRecord {
      slug
    }
  }
`;

const BUTTON_RECORD = `
  ... on ButtonRecord {
    id
    __typename
    variant
    label
    url
    ${BUTTON_LINK}
  }
`;

const BUTTON_GROUP_RECORD_BLOCK = `
  ... on ButtonGroupRecord {
    id
    __typename
    buttons {
      variant
      label
      url
      ${BUTTON_LINK}
    }
  }
`;

const ACCORDION_RECORD_BLOCK = `
  ... on AccordionRecord {
    id
    __typename
    details {
      summary
      structuredText {
        value
        blocks {
          ${BUTTON_GROUP_RECORD_BLOCK}
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

export const SITE_CONFIG_QUERY = `
  query SiteConfig($locale: SiteLocale!) {
    _site {
      faviconMetaTags(variants: [icon, appleTouchIcon, msApplication]) {
        attributes
        content
        tag
      }
      globalSeo {
        siteName
        titleSuffix
        twitterAccount
        facebookPageUrl
      }
    }
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
      logo { url width height alt format }
    }
  }
`;

export const PAGES_QUERY = `
  query AllPages($locale: SiteLocale!) {
    allPages(locale: $locale) {
      id
      eyebrow(locale: $locale)
      title(locale: $locale)
      excerpt(locale: $locale)
      slug(locale: $locale)
      seo: _seoMetaTags { attributes content tag }
      form { id }
      structuredText(locale: $locale) {
        value
        blocks {
          ${BUTTON_RECORD}
          ${BUTTON_GROUP_RECORD_BLOCK}
          ... on CourseCollectionRecord {
            id
            __typename
            filter
            eyebrow
          }
          ... on TripCollectionRecord {
            id
            __typename
            eyebrow
          }
          ... on TeamCollectionRecord {
            id
            __typename
          }
          ${ACCORDION_RECORD_BLOCK}
        }
        inlineBlocks {
          ... on ContactDetailRecord {
            id
            __typename
            value
          }
          ... on PriceDetailRecord {
            id
            __typename
            value
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
      seo: _seoMetaTags { attributes content tag }
      content { value blocks links }
      featuredImage { url width height alt }
      numDaysMin
      numDaysMax
      featured
      prerequisites
      maxParticipants
      norm { title url }
      form { id }
      preselectedFields(locale: $locale)
      hasPage(locale: $locale)
    }
  }
`;

export const TRIPS_QUERY = `
  query AllTrips($locale: SiteLocale!) {
    allTrips(locale: $locale, orderBy: position_ASC) {
      id
      title(locale: $locale)
      slug(locale: $locale)
      excerpt(locale: $locale)
      seo: _seoMetaTags { attributes content tag }
      featuredImage { url width height alt }
      content(locale: $locale) {
        value
        blocks {
          ${BUTTON_RECORD}
          ${BUTTON_GROUP_RECORD_BLOCK}
          ${ACCORDION_RECORD_BLOCK}
        }
        links
      }
      cta(locale: $locale)
      position
    }
  }
`;

export const FORMS_QUERY = `
  query AllForms($locale: SiteLocale!) {
    allForms(locale: $locale) {
      id
      title(locale: $locale)
      description(locale: $locale)
      content(locale: $locale) {
        ... on FormInputTextRecord {
          id
          __typename
          fieldType
          label
          name
          required
        }
        ... on FormInputTextareaRecord {
          id
          __typename
          label
          name
          required
          placeholder
        }
        ... on FormInputDateRecord {
          id
          __typename
          label
          name
          required
        }
        ... on FormInputNumberRecord {
          id
          __typename
          label
          name
          required
          min
          max
        }
        ... on FormInputOptionRecord {
          id
          __typename
          label
          name
          required
          options {
            ... on FormInputOptionValueRecord {
              id
              __typename
              label
              name
            }
          }
          defaultValue
          readonly
          placeholder
        }
        ... on FormInputCoursesOptionRecord {
          id
          __typename
          label
          required
          placeholder
        }
      }
      cta(locale: $locale)
      redirect {
        ... on PageRecord {
          slug(locale: $locale)
        }
      }
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

export const HOME_PAGE_QUERY = `
  query HomePage($locale: SiteLocale!) {
    homePage {
      seo: _seoMetaTags { attributes content tag }
      eyebrow(locale: $locale)
      tagline(locale: $locale)
      title(locale: $locale)
      heroDescription(locale: $locale)
      heroButtons(locale: $locale) {
        ${BUTTON_RECORD}
      }
      structuredText(locale: $locale) {
        value
        blocks {
          ${BUTTON_GROUP_RECORD_BLOCK}
          ... on CourseCollectionRecord {
            id
            __typename
            filter
            eyebrow
          }
          ... on TripCollectionRecord {
            id
            __typename
            eyebrow
          }
          ... on TeamCollectionRecord {
            id
            __typename
          }
          ${ACCORDION_RECORD_BLOCK}
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
      heroVideo {
        video {
          muxPlaybackId
          streamingUrl
          mp4High: mp4Url(res: high)
          mp4Med: mp4Url(res: medium)
          thumbnailUrl(format: jpg)
        }
      }
    }
  }
`;
