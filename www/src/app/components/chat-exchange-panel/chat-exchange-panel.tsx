import styles from './chat-exchange.module.css'
import {prisma} from "@/app/lib/prisma";
import {ImageResponse} from "next/og";

export default function ChatExchangePanel(attachment) {
  const panel = attachment.params;
  if (!panel) {
    return <div>panel not found</div>
  }
  return new ImageResponse(<div style={{margin:"5rem",fontSize: 16, display: 'flex',flexDirection:'column'}}>
    <h1>CHAT</h1>
    <div style={{display: 'flex',marginBottom:'2rem',flexDirection: 'column'}}>
        <div style={{ display: 'flex'}}>q: {panel.question}</div>
        <div style={{ display: 'flex'}}>a: {panel.answer}</div>
      </div>

  </div>)
}
