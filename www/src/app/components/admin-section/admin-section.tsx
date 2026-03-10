import {isLocal} from "@/app/lib/misc";
import styles from "./admin-section.module.css"

export default function AdminSection({span,children}) {
  if (!isLocal()) return null;
  return span? <span>{children}</span> : <div className={styles.container}>
    {children}
  </div>
}
