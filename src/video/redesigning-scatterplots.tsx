/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import {
  useCurrentFrame,
  interpolate,
  Sequence,
  Easing,
  useVideoConfig,
} from 'remotion'

const widthHeightRatio = 36 / 51 // ratio of the width to the height as measured in the book
const plotWidth = 550

export default function RedesigningScatterPlots() {
  return (
    <div tw="w-full h-full bg-gray-yellow-200 flex flex-col items-center">
      <PlotPlaceholder />

      <div
        css={[
          css`
            width: ${plotWidth}px;
          `,
        ]}
      >
        <Sequence
          from={0}
          durationInFrames={200}
          name="paragraph 1"
          layout="none"
        >
          <Paragraph>{text}</Paragraph>
        </Sequence>
      </div>
      {/* <MyVideo /> */}
    </div>
  )
}

function PlotPlaceholder() {
  return (
    <div
      css={[
        tw`mt-16 mb-12 bg-transparent border-2 border-gray-red-400`,
        css`
          width: ${plotWidth}px;
          height: ${plotWidth * widthHeightRatio}px;
        `,
      ]}
    />
  )
}

const text =
  'A large share of ink on a graphic should present data-information, the ink changing as the data change. *Data-ink* is the non-erasable core of a graphic, the non-redundant ink arranged in response to variation in the numbers represented. Then,'

const ease = Easing.bezier(0.25, 0.1, 0.25, 1.0)

type ParagraphProps = {
  transformDuration?: number
  fadeDuration?: number
  children: React.ReactNode
}
function Paragraph({
  transformDuration = 40,
  fadeDuration = transformDuration + 10,
  children,
}: ParagraphProps) {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig() // paragraph exists as long as the duration
  const transformOutStart = durationInFrames - transformDuration
  const fadeOutStart = durationInFrames - fadeDuration
  if (transformOutStart < transformDuration || fadeOutStart < fadeDuration) {
    throw new Error(`
    Not enough time allotted to transform or fade out.
    transform out start: ${transformOutStart}, fade out start: ${fadeOutStart}
    `)
  }

  const y =
    frame < transformOutStart
      ? interpolate(frame, [0, transformDuration], [25, 0], {
          easing: ease,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : interpolate(
          frame,
          [transformOutStart, transformOutStart + transformDuration],
          [0, 25],
          {
            easing: ease,
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        )

  const opacity =
    frame < fadeOutStart
      ? interpolate(frame, [0, fadeDuration], [0, 1], {
          easing: ease,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : interpolate(
          frame,
          [fadeOutStart, fadeOutStart + fadeDuration],
          [1, 0],
          {
            easing: ease,
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        )

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
