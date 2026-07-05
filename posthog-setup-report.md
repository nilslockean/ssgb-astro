# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the SSGB Astro project. Seven client-side tracking events were added across six components and two page templates. The existing PostHog snippet initialization in `src/features/third-party/posthog.astro` and its wiring in `src/layouts/Layout.astro` were left untouched — only tracking calls were added. Environment variables were confirmed in `.env`. No npm packages were required since the project already uses the CDN snippet approach.

| Event | Description | File |
|---|---|---|
| `course_viewed` | User views a course detail page, representing the top of the booking conversion funnel. | `src/templates/Course.astro` |
| `trip_viewed` | User views a trip detail page, representing the top of the trip inquiry funnel. | `src/templates/Trip.astro` |
| `booking_cta_clicked` | User clicks the primary booking call-to-action button in the hero section of a course or trip page. | `src/components/Hero.astro` |
| `booking_form_submitted` | User submits the course or trip booking inquiry form, representing the primary conversion event. | `src/features/forms/FormSection.astro` |
| `language_changed` | User switches the site language using the language picker. | `src/features/locale/LanguagePicker.astro` |
| `course_card_clicked` | User clicks on a course card in the course grid to navigate to a course detail page. | `src/features/courses/CourseGridItem.astro` |
| `accordion_opened` | User expands an accordion section such as pricing, prerequisites, or course standards. | `src/components/Accordion.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://eu.posthog.com/project/216735/dashboard/795700)
- **Insight:** [Course booking funnel](https://eu.posthog.com/project/216735/insights/dvfyZDAD) — `course_viewed` → `booking_cta_clicked` → `booking_form_submitted`
- **Insight:** [Booking form submissions over time](https://eu.posthog.com/project/216735/insights/D9g5m98y) — daily count of the primary conversion event
- **Insight:** [Course card to detail page funnel](https://eu.posthog.com/project/216735/insights/eYleir6E) — browse-to-interest conversion
- **Insight:** [Site engagement overview](https://eu.posthog.com/project/216735/insights/eWfpqtmi) — course views, trip views, and bookings on one chart
- **Insight:** [Booking conversion rate](https://eu.posthog.com/project/216735/insights/FgZAwAZt) — weekly bookings ÷ course views (%)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite (`npm run test`) — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `ENABLE_POSTHOG` and `POSTHOG_PROJECT_API_KEY` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
