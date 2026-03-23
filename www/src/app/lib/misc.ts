export function isLocal() {
return process.env.APP_ENV === "development" || process.env.NODE_ENV === "development";
}

export function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 600
}
