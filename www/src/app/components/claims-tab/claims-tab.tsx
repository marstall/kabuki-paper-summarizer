import styles from './claims-tab.module.css'
import {
  TranslationContext,
  TranslationDispatchContext
} from "@/app/components/translation-view-client/translation-context";
import {useContext} from 'react';



export default function ClaimsTab({article,translation}) {
  const state = useContext(TranslationContext);
  const dispatch = useContext(TranslationDispatchContext);

  return <pre>{JSON.stringify(state.selectedClaims,null,2)}</pre>
}
