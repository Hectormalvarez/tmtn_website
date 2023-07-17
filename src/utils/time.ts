// convert 2022-11-06T19:51:42Z to Month, YYYY format
export function convertDate(date: string) {
  const dateObj = new Date(date)
  const month = dateObj.toLocaleString('default', { month: 'long' })
  const year = dateObj.getFullYear()
  // example output: November, 2022
  return `${month}, ${year}`
}
