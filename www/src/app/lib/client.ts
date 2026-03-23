'use client'

import {useEffect, useState} from "react";

export function useIsMobile() {
  const [isMobile,setIsMobile] = useState(false);

  useEffect(()=>{
    setIsMobile(window.innerWidth<600)
  },[])

  return isMobile
}
