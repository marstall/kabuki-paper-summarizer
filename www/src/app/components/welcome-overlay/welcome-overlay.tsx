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
  const [overlayState, setOverlayState] = useState("unknown")
  useEffect(() => {
    const overlayState = cookies.hideWelcomeMessage ? "hidden" : "shown"
    setOverlayState(overlayState)
  }, [cookies.hideWelcomeMessage])
//
// //  console.log("cookies.hideWelcomeMessage",cookies.hideWelcomeMessage)
//
  function dismiss() {
    setCookie('hideWelcomeMessage', 'true')
    setOverlayState("hidden")
  }

//   const showOverlay = true;
  //return <div className={styles.blockerContainer}/>
  if (overlayState === 'undefined') return <div className={styles.blockerContainer}/>
  else if (overlayState === 'shown') return <div className={styles.container}>
    <div className={styles.content}>
      <div className={styles.innerContent}>
        <div className={'content'}>
          <p>
            Hi, I'm Chris, <a
            href={'https://www.kabukibrain.org/t/when-we-received-our-kabuki-diagnosis-i-felt-overwhelmed-by-the-challenge-of-supporting-our-son-i-thought-i-could-never-understand-the-science-of-what-was-going-on-in-his-mind-and-body/9'}>dad
            of a Kabuki teenager</a>.
          </p>
          <p>
            Welcome to <span style={{color:'green'}}><b>The Kabuki Papers</b></span>, a blog/newsletter focused on making the science behind Kabuki Syndrome
            more accessible to families.
          </p>
          <p>
            I'll be regularly posting cool Kabuki-related scientific papers, translated into plain English by AI.
          </p>
          {/*<p>I've "woven" the original paper into the translated versions: you can <b>click on individual*/}
          {/*  sentences</b> to*/}
          {/*  see the original passages they're based on,*/}
          {/*  and go deeper to see those passages in context of the whole paper.*/}
          {/*</p>*/}
          {/*<p>I'd like this newsletter to be a way not just to understand the ideas*/}
          {/*  expressed in the papers, but to gradually develop an ability to read the science in its original form.*/}
          {/*</p>*/}
          <p>
            Hope you'll join me!
          </p>
          {/*  <p>*/}
          {/*  I've made many attempts at reading Kabuki-related scientific papers. Don't think I've made it through to the end of one of them.*/}
          {/*</p>*/}
          {/*<p>*/}
          {/*  AI has really changed that for me. It can translate even the densest papers into terms I can understand.*/}
          {/*</p>*/}
          {/*<p>*/}
          {/*  Here I'll be posting readable AI versions of Kabuki papers that sparked my curiosity, taught me something, blew my mind, or all of the above.*/}
          {/*</p>*/}
          {/*<p>*/}
          {/*  Let's break through the jargon together!*/}
          {/*</p>*/}
        </div>
      </div>
      <div className={styles.formContainer}>
        <form
          action="https://buttondown.com/api/emails/embed-subscribe/marstall"
          method="post"
          onSubmit={() => {
            setTimeout(() => dismiss?.(), 0)
          }}
          className="embeddable-buttondown-form"
        >
          <input className={styles.emailInput}
                 placeholder={"email address"}
                 type="email" name="email" id="bd-email"/>
          <div style={{marginTop:'0.55rem'}}>
            <input className={styles.subscribeButton} type="submit" value="Subscribe"/>
          </div>
          <div style={{marginTop:'0.55rem'}}>
            <button className={styles.notRightNowButton} onClick={dismiss}>Not right now</button>
          </div>
        </form>
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
