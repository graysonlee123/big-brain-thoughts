import dayjs from 'dayjs'

export function displayDate(date: string | number | Date | dayjs.Dayjs | null | undefined) {
  return dayjs(date).format('MMMM D, YYYY')
}
