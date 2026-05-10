import styles from 'stateful-picker.module.css'

export default function StatefulPicker({values,value,setter}) {
    return <select className="select"
        value={value||""}
        onChange={(e)=>setter(e.target.value)}>
        {values.map((value)=>{
            return <option key={value} value={value}>{value}</option>
        })}
    </select>
}