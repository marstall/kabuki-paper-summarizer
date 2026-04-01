import {isLocal} from "@/app/lib/misc";
import styles from "./admin-section.module.css"

export default function AdminSection({span=null,children}) {
  if (!isLocal()) return null;
  return span? <span className={styles.container}>{children}</span> : <div className={styles.container}>
    {children}
  </div>
}
