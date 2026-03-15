import styles from './translation-view-switcher.module.css'
import {useContext} from "react";
import {
  TranslationContext,
  TranslationDispatchContext
} from "@/app/components/translation-view-client/translation-context";

function setTranslationViewTarget(dispatch,target) {
  dispatch({
    type:'setTranslationViewTarget',
    value: target
  })
}
export default function TranslationViewSwitcher() {
  const state = useContext(TranslationContext);
  const dispatch = useContext(TranslationDispatchContext);

  return <p className="panel-tabs">
    :{state.translationViewState}:
    <a
      className={state.translationViewState==='translation'
        ? "is-active"
        : ""
    }
      onClick={()=>
        setTranslationViewTarget(dispatch,'translation')
    }
>translation</a>
    <a
      className={state.translationViewState==='claims'
        ? "is-active"
        : ""
      }
      onClick={()=>
        setTranslationViewTarget(dispatch,'claims')
      }
    >claims</a>
    <a
      className={state.translationViewState==='original'
        ? "is-active"
        : ""
      }
      onClick={()=>
        setTranslationViewTarget(dispatch,'original')
      }
    >original</a>
  </p>
}

