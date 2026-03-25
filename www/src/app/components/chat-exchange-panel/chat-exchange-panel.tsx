import styles from './chat-exchange-panel.module.css'
import {ImageResponse} from "next/og";

export default function ChatExchangePanel(attachment) {

  const panel = attachment.params;
  if (!panel) {
    return <div>panel not found</div>
  }

  // Calculate height based on content
  const fontSize = 52
  const lineHeight = 1.4
  const pixelsPerLine = fontSize * lineHeight
  const maxWidth = 0.7 // 70% of container
  const containerWidth = 1000
  const bubbleMaxWidth = (containerWidth - 120) * maxWidth // subtract padding
  const charsPerLine = Math.floor(bubbleMaxWidth / (fontSize * 0.6)) // rough estimate

  const questionLines = Math.max(1, Math.ceil(panel.question.length / charsPerLine))
  const answerLines = Math.max(1, Math.ceil(panel.answer.length / charsPerLine))

  const avatarHeight = 240
  const padding = 16 // 1rem top/bottom
  const innerPadding = 90 // bottom padding
  const gap = 36
  const bubblePadding = 72 // 36px top + 36px bottom
  const extraBuffer = 100 // additional buffer for margins/rounding

  const estimatedHeight =
    padding * 2 +
    innerPadding +
    Math.max(avatarHeight, questionLines * pixelsPerLine + bubblePadding) +
    gap +
    Math.max(avatarHeight, answerLines * pixelsPerLine + bubblePadding) +
    extraBuffer

  return new ImageResponse(
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f4f4f4',
      padding: '1rem',
      borderRadius: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '36px',
        padding: '0 60px 90px 60px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            <div style={{display: 'flex'}}>
              <img src={'http://localhost:3000/redhead.png'} style={{width: '240px'}}/>
            </div>
            <div style={{
              backgroundColor: '#E5E5EA',
              color: 'black',
              padding: '36px 48px',
              borderRadius: '52px',
              maxWidth: '70%',
              fontSize: '52px',
              lineHeight: '1.4',
            }}>
              {panel.question}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
        <div style={{
          backgroundColor: '#007AFF',
          color: 'white',
          padding: '36px 48px',
          borderRadius: '52px',
          maxWidth: '70%',
          fontSize: '52px',
          lineHeight: '1.4'
        }}>
          {panel.answer}
        </div>
          <div style={{display: 'flex'}}>
            <img src={'http://localhost:3000/redhead.png'} style={{width: '240px'}}/>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1000,
      height: Math.ceil(estimatedHeight)
    })
}
