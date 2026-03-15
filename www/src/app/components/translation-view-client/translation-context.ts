import {createContext} from 'react'

export const TranslationContext = createContext(null)
export const TranslationDispatchContext = createContext(null);

export function translationReducer(state,action) {
  switch (action.type) {
    case 'selectTab': {
      return {...state,selectedTab:action.value}
    }
    case 'setTranslationViewTarget': {
      return {...state,
        translationViewTarget:action.value
      }
    }
    case 'setTranslationViewState': {
      return {...state,
        translationViewState:action.value
      }
    }
    case 'selectClaims': {
      return {...state,selectedClaims: action.claims,originalPassages:action.originalPassages}
    }
    case 'showOriginalOverlay': {
      return {...state,originalOverlayShown:true}
    }
    case 'hideOriginalOverlay': {
      return {...state,originalOverlayShown:false}
    }
    default: {
      return state;
    }

  }
}

export const initialState= {
  selectedClaims: [],
  selectedTab: 0,
  originalOverlayShown: false,
  translationViewState: 'translation',
  translationViewTarget: 'translation',
}

