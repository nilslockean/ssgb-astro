export function calculateCoursePrice(
  participants: number,
  dailyPricePerPerson: number,
  days: number,
) {
  return {
    perPersonDaily: dailyPricePerPerson,
    perPersonTotal: dailyPricePerPerson * days,
    total: participants * dailyPricePerPerson * days,
  };
}

export function getCoursePriceRange(dailyPrices: number[], days: number) {
  return [
    Math.min(...dailyPrices) * days,
    Math.max(...dailyPrices) * days,
  ] as const;
}
