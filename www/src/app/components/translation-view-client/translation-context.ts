import {createContext} from 'react'

export const TranslationContext = createContext(null)
export const TranslationDispatchContext = createContext(null);

export function translationReducer(state,action) {
  switch (action.type) {
    case 'incrementX': {
      return {...state,x:state.x+2}
    }
    case 'selectTab': {
      return {...state,selectedTab:action.value}
    }
    case 'selectClaims': {
      return {...state,selectedClaims: action.value}
    }
  }
}

export const initialState= {
  x:1,
  selectedClaims: [],
  selectedTab: 0
}

