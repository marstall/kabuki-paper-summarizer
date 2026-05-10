'use client'
import styles from 'llm-picker.module.css'
import {useEffect, useState} from "react";
import getLlms from "@/app/components/llm-picker/llm-picker-server";

export default function LlmPickerClient({llmName, setLlmName}) {
    const [llms, setLlms] = useState([]);
    useEffect(() => {
        getLlms().then(setLlms)
    }, [])
    return <select className='select'
                value={llmName}
                onChange={(e) => setLlmName(e.target.value)}
                name={'llm'}>
            {llms.map(llm => {
                    return <option value={llm.name} key={llm.id}>{llm.name}</option>
                }
            )}
        </select>

}
