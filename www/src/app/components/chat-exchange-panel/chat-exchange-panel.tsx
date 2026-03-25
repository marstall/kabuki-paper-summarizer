import styles from './chat-exchange-panel.module.css'
import {prisma} from "@/app/lib/prisma";
import {ImageResponse} from "next/og";

export default function ChatExchangePanel(attachment) {
  const panel = attachment.params;
  if (!panel) {
    return <div>panel not found</div>
  }
  return new ImageResponse(
    <div style={{
      width: '100%',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffc',
      borderRadius: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 42px 24px 42px',
        fontSize: '32px',
        fontWeight: '600',
        color: 'black'
      }}>
        <div style={{ display: 'flex' }}>9:41</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            <svg width="38" height="25" viewBox="0 0 18 12" fill="none">
              <rect x="0" y="3" width="4" height="6" rx="1" fill="black"/>
              <rect x="5" y="2" width="4" height="8" rx="1" fill="black"/>
              <rect x="10" y="1" width="4" height="10" rx="1" fill="black"/>
              <rect x="15" y="0" width="3" height="12" rx="1" fill="black"/>
            </svg>
          </div>
          <div style={{ display: 'flex' }}>
            <svg width="36" height="25" viewBox="0 0 17 12" fill="none">
              <path d="M1 6C1 6 3.5 1 8.5 1C13.5 1 16 6 16 6C16 6 13.5 11 8.5 11C3.5 11 1 6 1 6Z" stroke="black" stroke-width="1.5" fill="none"/>
              <circle cx="8.5" cy="6" r="2" fill="black"/>
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="56" height="27" viewBox="0 0 27 13" fill="none">
              <rect x="0" y="0" width="22" height="13" rx="2.5" stroke="black" stroke-width="1.5" fill="none"/>
              <rect x="23" y="4" width="3" height="5" rx="1" fill="black"/>
              <rect x="2" y="2" width="18" height="9" rx="1" fill="black"/>
            </svg>
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        padding: '0 42px 62px 42px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%'
        }}>
          <div style={{
            backgroundColor: '#E5E5EA',
            color: 'black',
            padding: '25px 34px',
            borderRadius: '38px',
            maxWidth: '70%',
            fontSize: '34px',
            lineHeight: '1.4'
          }}>
            {panel.question}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%'
        }}>
          <div style={{
            backgroundColor: '#007AFF',
            color: 'white',
            padding: '25px 34px',
            borderRadius: '38px',
            maxWidth: '70%',
            fontSize: '34px',
            lineHeight: '1.4'
          }}>
            {panel.answer}
          </div>
        </div>
      </div>
    </div>
  )
}
