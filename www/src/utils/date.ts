
export function shortDateTime(dt) {
  const formatter = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return formatter.format(dt)
}

export function shortDate(dt) {
  const formatter = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'medium'
  });

  return formatter.format(dt)
}

