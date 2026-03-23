export function isLocal() {
return process.env.APP_ENV === "development" || process.env.NODE_ENV === "development";
}

