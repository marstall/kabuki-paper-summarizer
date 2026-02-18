
export const formatter = new Intl.DateTimeFormat('en-us', {
  dateStyle: 'medium',
  timeStyle: 'short'
});
export function shortDateTime(dt) {
  return formatter.format(dt)
}
