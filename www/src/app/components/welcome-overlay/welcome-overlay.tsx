'use client'

import styles from './welcome-overlay.module.css'
import SubscribeForm from "@/app/components/subscribe-form/subscribe-form";
import {useEffect, useState} from "react";
import {useCookies} from 'react-cookie';
import {CookiesProvider} from "react-cookie";

interface CookieValues {
  hideWelcomeMessage?: string;
}

function Content(params) {
   const [cookies, setCookie] = useCookies<'hideWelcomeMessage', CookieValues>(['hideWelcomeMessage']);
  const [overlayState,setOverlayState] = useState("unknown")
  useEffect(()=>{
     const overlayState = cookies.hideWelcomeMessage ? "hidden" : "shown"
    setOverlayState(overlayState)
  },[cookies.hideWelcomeMessage])
//  if (cookies.hideWelcomeMessage === 'true') return null;
//
// //  console.log("cookies.hideWelcomeMessage",cookies.hideWelcomeMessage)
//
  function dismiss() {
    setCookie('hideWelcomeMessage', 'true')
    setOverlayState("hidden")
  }
//   const showOverlay = true;
  //return <div className={styles.blockerContainer}/>
  if (overlayState==='undefined') return <div className={styles.blockerContainer}/>
  else if (overlayState==='shown') return <div className={styles.container}>
    <div className={styles.content}>
      <div className={'content'}>
        <h1 className={'title'}>
          Hi, welcome to The Kabuki Papers.
        </h1>
        <p>
          I'm Chris, <a href={'https://www.kabukibrain.org/t/when-we-received-our-kabuki-diagnosis-i-felt-overwhelmed-by-the-challenge-of-supporting-our-son-i-thought-i-could-never-understand-the-science-of-what-was-going-on-in-his-mind-and-body/9'}>dad of a Kabuki teenager</a>.
          Though I've tried, I've never made it to the end of an academic paper about Kabuki (or any other subject).
        </p>
        <p>
          AI changed that. It can translate this stuff into plain English beautifully.
        </p>
        <p>
          Here I'll be posting readable AI versions of Kabuki papers that sparked my curiosity, taught me something, blew my mind, etc.
        </p>
        <p>
          Let's break through the jargon together!
        </p>
          <SubscribeForm onSubmit={dismiss} dismiss={dismiss} showNotRightNow={true}/>
      </div>
    </div>
  </div>
  else return null;
}

export default function WelcomeOverlay(params) {
  return <CookiesProvider defaultSetOptions={{path: '/'}}>
    <Content {...params}/>
  </CookiesProvider>
}
