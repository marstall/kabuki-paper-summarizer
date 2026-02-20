import styles from './nav-panel.module.css'
import {useContext} from "react";
import {
  TranslationContext,
  TranslationDispatchContext
} from "@/app/components/translation-view-client/translation-context";

function selectTab(dispatch,tab) {
  dispatch({
    type:'selectTab',
    value: tab
  })
}
export default function NavTabs() {
  const state = useContext(TranslationContext);
  const dispatch = useContext(TranslationDispatchContext);

  return <p className="panel-tabs">
      <a onClick={()=>selectTab(dispatch,0)} className={state.selectedTab===0 ? "is-active": ""}>plain english</a>
      <a onClick={()=>selectTab(dispatch,1)} className={state.selectedTab===1 ? "is-active": ""}>claims</a>
      <a onClick={()=>selectTab(dispatch,2)} className={state.selectedTab===2 ? "is-active": ""}>original</a>
    </p>
}

