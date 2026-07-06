import IngestView from "./ingest-view";

export default async function Page({params}: { params: Promise<any> }) {
    return <IngestView {...await params}/>
}
