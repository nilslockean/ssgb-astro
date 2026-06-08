export const COURSES_QUERY = `
  query AllCourses($locale: SiteLocale!) {
    allCourses(locale: $locale, orderBy: position_ASC) {
      id
      title
      slug
      excerpt
      content { value }
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
