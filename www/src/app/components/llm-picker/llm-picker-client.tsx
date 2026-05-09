'use client'
import styles from 'llm-picker.module.css'
import {useEffect, useState} from "react";
import getLlms from "@/app/components/llm-picker/llm-picker-server";

export default function LlmPickerClient({activeLlm,setActiveLlm}) {
const [llms, setLlms] = useState([]);
useEffect(()=>{
    getLlms().then(setLlms)
},[])
return <div><h1>llmpicker</h1>
    <select className='select'
            value={activeLlm}
            onChange={(e)=>setActiveLlm(e.target.value)}
            name={'llm'}>
        {llms.map(llm => {
                return <option value={llm.name} key={llm.id}>{llm.name}</option>
            }
        )}
    </select>
</div>
}
