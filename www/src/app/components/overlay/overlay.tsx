import styles from './overlay.module.css'

export default function Overlay({children,dismiss}) {
  return <>
    <div onClick={dismiss} className={styles.container}>
      <div className={styles.content}>
        {children}
      </div>
  </div>

    </>
}
