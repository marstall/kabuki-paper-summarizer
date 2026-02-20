import styles from './nav-panel.module.css'

export default function NavTabs({tab, setTab}) {
    return <p className="panel-tabs">
      <a onClick={()=>setTab(0)} className={tab===0 ? "is-active": ""}>plain english</a>
      <a onClick={()=>setTab(1)} className={tab===1 ? "is-active": ""}>claims</a>
      <a onClick={()=>setTab(2)} className={tab===2 ? "is-active": ""}>original</a>
    </p>
}

