import { DecimalsType } from '../utils/constants'

type Props = {
  value: number
  decimals?: DecimalsType
}

export default function truncate({
  value = 0,
  decimals = DecimalsType.six,
}: Props) {
  // let truncate: number
  // switch (decimals) {
  //   case DecimalsType.two:
  //     truncate = Math.trunc(value * 100) / 100
  //     break
  //   case DecimalsType.six:
  //     truncate = Math.trunc(value * 1_000_000) / 1_000_000
  //     break
  // }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals.valueOf(),
    maximumFractionDigits: decimals.valueOf(),
  })
}
