import moment from 'moment'

export function lastApr() {
  const history = aprHistory()
  const current = history[history.length - 1]
  const apy = current.value * current.deduct
  return apy
}

export function aprHistory(): {
  timestamp: number
  date: string
  value: number
  deduct: number
}[] {
  return [
    {
      timestamp: moment('2022-06-07T00:00:00').utc().unix(),
      date: moment('2022-06-07T00:00:00').utc().format('DD/MM'),
      value: 19.2,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-08T00:00:00').utc().unix(),
      date: moment('2022-06-08T00:00:00').utc().format('DD/MM'),
      value: 19.2,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-09T00:00:00').utc().unix(),
      date: moment('2022-06-09T00:00:00').utc().format('DD/MM'),
      value: 19.2,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-10T00:00:00').utc().unix(),
      date: moment('2022-06-10T00:00:00').utc().format('DD/MM'),
      value: 14.2,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-11T00:00:00').utc().unix(),
      date: moment('2022-06-11T00:00:00').utc().format('DD/MM'),
      value: 8.2,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-12T00:00:00').utc().unix(),
      date: moment('2022-06-12T00:00:00').utc().format('DD/MM'),
      value: 146,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-13T00:00:00').utc().unix(),
      date: moment('2022-06-13T00:00:00').utc().format('DD/MM'),
      value: 56,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-14T00:00:00').utc().unix(),
      date: moment('2022-06-14T00:00:00').utc().format('DD/MM'),
      value: 102,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-15T00:00:00').utc().unix(),
      date: moment('2022-06-15T00:00:00').utc().format('DD/MM'),
      value: 50,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-16T00:00:00').utc().unix(),
      date: moment('2022-06-16T00:00:00').utc().format('DD/MM'),
      value: 28,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-17T00:00:00').utc().unix(),
      date: moment('2022-06-17T00:00:00').utc().format('DD/MM'),
      value: 31.25,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-18T00:00:00').utc().unix(),
      date: moment('2022-06-18T00:00:00').utc().format('DD/MM'),
      value: 31.25,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-19T00:00:00').utc().unix(),
      date: moment('2022-06-19T00:00:00').utc().format('DD/MM'),
      value: 34.2,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-20T00:00:00').utc().unix(),
      date: moment('2022-06-20T00:00:00').utc().format('DD/MM'),
      value: 37.8,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-21T00:00:00').utc().unix(),
      date: moment('2022-06-21T00:00:00').utc().format('DD/MM'),
      value: 41.76,
      deduct: 0.8,
    },
    {
      timestamp: moment('2022-06-22T00:00:00').utc().unix(),
      date: moment('2022-06-22T00:00:00').utc().format('DD/MM'),
      value: 26.86,
      deduct: 0.8,
    },
  ]
}

export function mintHistory(): {
  timestamp: number
  date: string
  value: number
}[] {
  return [
    {
      timestamp: moment('2022-06-07T00:00:00').utc().unix(),
      date: moment('2022-06-07T00:00:00').utc().format('DD/MM'),
      value: 50000,
    },
    {
      timestamp: moment('2022-06-11T00:00:00').utc().unix(),
      date: moment('2022-06-11T00:00:00').utc().format('DD/MM'),
      value: 56112.23,
    },
    {
      timestamp: moment('2022-06-12T00:00:00').utc().unix(),
      date: moment('2022-06-12T00:00:00').utc().format('DD/MM'),
      value: 56112.23,
    },
    {
      timestamp: moment('2022-06-13T00:00:00').utc().unix(),
      date: moment('2022-06-13T00:00:00').utc().format('DD/MM'),
      value: 56112.23,
    },
    {
      timestamp: moment('2022-06-14T00:00:00').utc().unix(),
      date: moment('2022-06-14T00:00:00').utc().format('DD/MM'),
      value: 56112.23,
    },
    {
      timestamp: moment('2022-06-15T00:00:00').utc().unix(),
      date: moment('2022-06-15T00:00:00').utc().format('DD/MM'),
      value: 56112.23,
    },
    {
      timestamp: moment('2022-06-16T00:00:00').utc().unix(),
      date: moment('2022-06-16T00:00:00').utc().format('DD/MM'),
      value: 56112.23,
    },
    {
      timestamp: moment('2022-06-17T00:00:00').utc().unix(),
      date: moment('2022-06-17T00:00:00').utc().format('DD/MM'),
      value: 56112.23,
    },
    {
      timestamp: moment('2022-06-18T00:00:00').utc().unix(),
      date: moment('2022-06-18T00:00:00').utc().format('DD/MM'),
      value: 73612.23,
    },
    {
      timestamp: moment('2022-06-19T00:00:00').utc().unix(),
      date: moment('2022-06-19T00:00:00').utc().format('DD/MM'),
      value: 84165.77,
    },
    {
      timestamp: moment('2022-06-20T00:00:00').utc().unix(),
      date: moment('2022-06-20T00:00:00').utc().format('DD/MM'),
      value: 88577.76,
    },
    {
      timestamp: moment('2022-06-21T00:00:00').utc().unix(),
      date: moment('2022-06-21T00:00:00').utc().format('DD/MM'),
      value: 114520.4,
    },
  ]
}

export function protocolRevenueHistory(): {
  timestamp: number
  value: number
}[] {
  return [
    {
      timestamp: moment('2022-06-09T00:00:00').utc().unix(),
      value: 4.36,
    },
    {
      timestamp: moment('2022-06-11T00:00:00').utc().unix(),
      value: 1.348,
    },
    {
      timestamp: moment('2022-06-12T00:00:00').utc().unix(),
      value: 2.842,
    },
    {
      timestamp: moment('2022-06-13T00:00:00').utc().unix(),
      value: 1.828,
    },
    {
      timestamp: moment('2022-06-14T00:00:00').utc().unix(),
      value: 3.16,
    },
    {
      timestamp: moment('2022-06-16T00:00:00').utc().unix(),
      value: 2.3,
    },
    {
      timestamp: moment('2022-06-17T00:00:00').utc().unix(),
      value: 2.9,
    },
    {
      timestamp: moment('2022-06-19T00:00:00').utc().unix(),
      value: 6.4,
    },
    {
      timestamp: moment('2022-06-20T00:00:00').utc().unix(),
      value: 3.2,
    },
    {
      timestamp: moment('2022-06-20T00:00:00').utc().unix(),
      value: 4.2,
    },
    {
      timestamp: moment('2022-06-22T00:00:00').utc().unix(),
      value: 6,
    },
  ]
}

export function generatedYieldHistory(): {
  timestamp: number
  value: number
}[] {
  return [
    {
      timestamp: moment('2022-06-09T00:00:00').utc().unix(),
      value: 16.26,
    },
    {
      timestamp: moment('2022-06-11T00:00:00').utc().unix(),
      value: 5.392,
    },
    {
      timestamp: moment('2022-06-12T00:00:00').utc().unix(),
      value: 11.368,
    },
    {
      timestamp: moment('2022-06-13T00:00:00').utc().unix(),
      value: 7.312,
    },
    {
      timestamp: moment('2022-06-14T00:00:00').utc().unix(),
      value: 12.8,
    },
    {
      timestamp: moment('2022-06-16T00:00:00').utc().unix(),
      value: 9.06,
    },
    {
      timestamp: moment('2022-06-17T00:00:00').utc().unix(),
      value: 11.23,
    },
    {
      timestamp: moment('2022-06-19T00:00:00').utc().unix(),
      value: 25.94,
    },
    {
      timestamp: moment('2022-06-20T00:00:00').utc().unix(),
      value: 12.8,
    },
    {
      timestamp: moment('2022-06-20T00:00:00').utc().unix(),
      value: 15.1,
    },
    {
      timestamp: moment('2022-06-22T00:00:00').utc().unix(),
      value: 24,
    },
  ]
}
