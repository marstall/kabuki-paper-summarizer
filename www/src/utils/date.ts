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

  return formatter.format(d)
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
