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
          slug
          title
        }
        ... on TripRecord {
          __typename
          slug(locale: $locale)
          title(locale: $locale)
        }
      }
      label
      url
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
                slug
                title
              }
              ... on TripRecord {
                __typename
                slug(locale: $locale)
                title(locale: $locale)
              }
            }
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
      eyebrow(locale: $locale)
      title(locale: $locale)
      excerpt(locale: $locale)
      slug(locale: $locale)
      form { id }
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
          ... on ButtonGroupRecord {
            id
            __typename
            buttons {
              variant
              label
              url
            }
          }
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
          ... on AccordionRecord {
            id
            __typename
            details {
              summary
              structuredText {
                value
                blocks {
                  ... on ButtonGroupRecord {
                    id
                    __typename
                    buttons {
                      variant
                      label
                      url
                    }
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
      content { value blocks links }
      featuredImage { url width height alt }
      numDaysMin
      numDaysMax
      featured
      prerequisites
      maxParticipants
      minAge
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
      featuredImage { url width height alt }
      content(locale: $locale) {
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
        links
      }
      cta(locale: $locale)
      price
      prerequisites(locale: $locale)
      norm { title url }
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
