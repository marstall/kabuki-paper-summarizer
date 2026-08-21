'use client'
import {useState} from "react";
import Link from "next/link";

export function Signin() {
    const [showOtherWays,setShowOtherWays] = useState(false)
    return <div className={'content'}>
        <form>
            <h1>Sign in</h1>
            <div className={"field"}>
                <label className="label">Username</label>
                <div className="control">
                    <input name='username' type={'text'}/>
                </div>
            </div>
            <div className={"field"}>
                <label className="label">Password</label>
                <div className="control">
                    <input name='password' type={'password'}/>
                </div>
            </div>
            <hr/>
            <div className={'field'}>
                <div onClick={()=>setShowOtherWays(true)} className={'button'}>Sign in Another way</div>
            </div>
            {showOtherWays && <div className={'field'}>
                <Link href='/oauth' className={'button'}>Login with TechniColorAuth</Link>
            </div>}
        </form>
    </div>
}