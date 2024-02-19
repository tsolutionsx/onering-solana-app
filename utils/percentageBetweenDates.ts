import moment from 'moment'
import type { SDKContext } from '../helpers/sdk'

type Props = {
  startDate: number
  currentDate: number
  endDate: number
}

export default function getPercentage({
  startDate,
  currentDate,
  endDate,
}: Props) {
  let now = moment.unix(currentDate).valueOf()
  let start = moment.unix(startDate).valueOf()
  let end = moment.unix(endDate).valueOf()
  let totalTime = end - start
  let progress = now - start
  let percentage = (progress / totalTime) * 100

  return percentage
}
