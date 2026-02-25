
export function firstParagraph(body) {
  const paragraphs = extractParagraphs(body)
  if (paragraphs.length>0) return paragraphs[0]
  else return ""
}

export function extractParagraphs(body) {
  const paragraphs = body.split(/[\r\n]/)
  return paragraphs.filter(p => p.length > 0)
}
