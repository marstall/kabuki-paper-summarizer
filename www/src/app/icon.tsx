import {ImageResponse} from 'next/og'

export const size = {
  width: 32,
  height: 32
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "serif",
          fontSize: 20,
          border: '1px solid green',
          borderRadius: 4,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'green'
        }}
      >
        kp
      </div>
    ), {
      ...size
    }
  )

}
