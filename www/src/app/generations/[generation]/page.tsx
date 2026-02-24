import GenerationView from './generation-view'

export default async function Page({params}) {
  const _params = await params;
  const {generation} = _params;
  return <GenerationView generation={generation}/>
}
