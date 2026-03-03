import {isLocal} from "@/app/lib/misc";
import styles from "./admin-section.module.css"

export default function AdminSection({children}) {
  if (!isLocal()) return null;
  return <div className={styles.container}>
    {children}
  </div>
}
