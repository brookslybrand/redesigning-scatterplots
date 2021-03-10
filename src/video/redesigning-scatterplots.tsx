/** @jsxImportSource @emotion/react */
import tw, { css, theme } from 'twin.macro'
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
        <div tw="relative">
          <Sequence
            from={0}
            durationInFrames={200}
            name="paragraph 1"
            layout="none"
          >
            <Paragraph>{text}</Paragraph>
            {/* <Paragraph2 fadeInDuration={300}>{text}</Paragraph2> */}
          </Sequence>
          <Sequence
            from={180}
            durationInFrames={Infinity}
            name="paragraph 2"
            layout="none"
          >
            <Paragraph>{text}</Paragraph>
          </Sequence>
        </div>
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
  transformDuration = 50,
  fadeDuration = transformDuration + 10,
  children,
}: ParagraphProps) {
  const { y, opacity } = useParagraphAttributes(transformDuration, fadeDuration)

  return (
    <p
      css={[
        tw`absolute text-2xl font-light text-gray-900 font-body`,
        css`
          transform: translateY(${y}%);
          opacity: ${opacity};
        `,
      ]}
    >
      {children}
    </p>
  )
}

function useParagraphAttributes(
  transformDuration: number,
  fadeDuration: number
) {
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

  const interpolateConfig = {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  } as const

  const y = interpolate(
    frame,
    [0, transformDuration],
    [100, 0],
    interpolateConfig
  )

  const opacity =
    frame < fadeOutStart
      ? interpolate(frame, [0, fadeDuration], [0, 1], interpolateConfig)
      : interpolate(
          frame,
          [fadeOutStart, fadeOutStart + fadeDuration],
          [1, 0],
          interpolateConfig
        )

  return { y, opacity }
}
