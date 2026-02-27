'use client'

import Homepage from "@/app/homepage/homepage";

export default function Diagnostics({keyVals}) {
  for (const [key,val] of Object.entries(keyVals)) {
    console.log(key+":"+val)
  }
  return null;
}
