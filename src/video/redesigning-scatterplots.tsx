/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import { useCurrentFrame, interpolate, Sequence, Easing } from 'remotion'

export default function RedesigningScatterPlots() {
  return (
    <div tw="w-full h-full bg-white flex flex-col items-center">
      <h1 tw="mt-16 bl-text-6xl mb-8">Hi, this is Poppins</h1>
      <div
        css={[
          css`
            width: 36rem;
          `,
        ]}
      >
        <Paragraph>{text}</Paragraph>
      </div>
      {/* <MyVideo /> */}
    </div>
  )
}

const text =
  'A large share of ink on a graphic should present data-information, the ink changing as the data change. *Data-ink* is the non--erasable core of a graphic, the non-redundant ink arranged in response to variation in the numbers represented. Then,'

const ease = Easing.bezier(0.25, 0.1, 0.25, 1.0)

type ParagraphProps = {
  inDuration?: number
  children: React.ReactNode
}
function Paragraph({ inDuration = 40, children }: ParagraphProps) {
  const frame = useCurrentFrame()
  const y = interpolate(frame, [0, inDuration], [25, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const opacity = interpolate(frame, [0, inDuration + 10], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <p
      css={[
        tw`text-2xl font-light text-gray-900 font-body`,
        css`
          transform: translateY(${y}vh);
          opacity: ${opacity};
        `,
      ]}
    >
      {children}
    </p>
  )
}

const SubComponent = () => {
  const frame = useCurrentFrame() // 15

  return (
    <Sequence
      from={10}
      durationInFrames={Infinity}
      name="MySubSequence"
      layout="none"
    >
      <div>sequence frame: {frame}</div>
    </Sequence>
  )
}

const MyVideo = () => {
  const frame = useCurrentFrame() // 25

  return (
    <div>
      <Sequence
        from={10}
        durationInFrames={100}
        name="MySequence"
        layout="none"
      >
        <div>global frame: {frame}</div>
        <SubComponent />
      </Sequence>
    </div>
  )
}
