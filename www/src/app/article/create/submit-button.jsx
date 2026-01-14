'use client'

import {useFormStatus} from "react-dom";

export default function Submit() {
  const {pending} = useFormStatus();
  console.log({pending})
  return (
    <button className="button is-primary" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  )
  return true;
}
