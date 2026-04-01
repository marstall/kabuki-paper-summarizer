export function shortDateTime(dt) {
  const d = dt instanceof Date ? dt : new Date(dt)
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })

  const parts = formatter.formatToParts(d)
  const month = parts.find(p => p.type === 'month')?.value
  const day = parts.find(p => p.type === 'day')?.value
  const year = parts.find(p => p.type === 'year')?.value
  const hour = parts.find(p => p.type === 'hour')?.value
  const minute = parts.find(p => p.type === 'minute')?.value
  const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value

  return `${month} ${day}, ${year}, ${hour}:${minute} ${dayPeriod}`
}

export function shortDate(dt) {
  const d = dt instanceof Date ? dt : new Date(dt)
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return formatter.format(d)
}
