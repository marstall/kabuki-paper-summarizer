import Generate from "./generate";

export default async function Page(params) {
    return <Generate {...await params}/>
}
