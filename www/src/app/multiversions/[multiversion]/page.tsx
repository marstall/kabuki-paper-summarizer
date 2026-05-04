import MultiversionView from './multiversion-view'

export default async function Page({params}) {
  const _params = await params;
  const {generation} = _params;
  return <MultiversionView generation={generation}/>
}
