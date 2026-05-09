'use client'

import LlmPickerClient from "@/app/components/llm-picker/llm-picker-client";
import {useState} from "react";

export default function GenerateClient(params) {
  const [activeLlm,setActiveLlm] = useState("deepseek")
    return <div>
        <div>activeLlm: {activeLlm}</div>
        <LlmPickerClient activeLlm={activeLlm} setActiveLlm={setActiveLlm}/>
  </div>
}
