'use client'

import {useFormStatus} from "react-dom";

export default function Submit() {
  const {pending} = useFormStatus();
  return (
    <button className="button is-primary" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  )
  return true;
}
