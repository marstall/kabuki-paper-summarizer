import Generate from "@/app/generate/generate";
export default async function Page(params) {
  return <Generate {...await params}/>
}
