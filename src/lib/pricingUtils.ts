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
