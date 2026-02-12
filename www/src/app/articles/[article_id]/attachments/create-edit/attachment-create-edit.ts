'use server'

export default async function createEditAttachment(initialState: any, formData: FormData) {
  if (!formData) return initialState;
  const rawFormData = Object.fromEntries(formData)

  const errors = []
  if (!rawFormData.attachment?.type?.startsWith("image")) {
    errors.push("only images are allowed as uploads.")
  }
  if (errors.length===0) {
    const file = rawFormData.attachment as File
    const bytes = new Uint8Array(await file.arrayBuffer())
    return {bytes}
  } else {
    return {errors}
  }
}
