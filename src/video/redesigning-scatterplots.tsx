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
const plotWidth = 700

export default function RedesigningScatterPlots() {
  return (
    <article tw="w-full h-full bg-gray-yellow-200 flex flex-col items-center">
      <PlotPlaceholder />

      <section
        css={[
          css`
            width: ${plotWidth}px;
          `,
        ]}
      >
        <div tw="relative">
          <CustomSequence from={0} durationInFrames={400} name="paragraph 1">
            <Paragraph>
              {text}

              <CustomSequence from={120} name="formula 1">
                <DataInkRatio />
              </CustomSequence>
            </Paragraph>
          </CustomSequence>
        </div>
      </section>
    </article>
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

function DataInkRatio() {
  return (
    <DataInkRatioFormulaGrid>
      <DataInkRatioExplanation tw="flex flex-col items-center" fadeDuration={0}>
        <span>data-ink</span>
        <hr tw="border-t-2 border-gray-red-400 w-full" />
        <span>total ink used to print the graphic</span>
      </DataInkRatioExplanation>
      <CustomSequence from={60} name="formula 2">
        <DataInkRatioExplanation tw="flex flex-col items-center">
          proportion of graphic's ink devoted to the non-redundant display of
          data-information
        </DataInkRatioExplanation>
      </CustomSequence>
      <CustomSequence from={120} name="formula 3">
        <DataInkRatioExplanation tw="flex flex-col items-center">
          1.0 - proportion of a graphic that can be erased without loss of
          data-information.
        </DataInkRatioExplanation>
      </CustomSequence>
    </DataInkRatioFormulaGrid>
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

type DataInkRatioFormulaGridProps = {
  fadeDuration?: number
  children?: React.ReactNode
}
function DataInkRatioFormulaGrid({
  fadeDuration = 60,
  children,
}: DataInkRatioFormulaGridProps) {
  const { opacity } = useParagraphAttributes(0, fadeDuration)

  return (
    <span
      css={[
        tw`grid items-center gap-x-4 gap-y-4`,
        css`
          opacity: ${opacity};
          grid-template-columns: min-content min-content auto;
        `,
      ]}
    >
      <span tw="whitespace-nowrap">Data-ink ratio</span>
      {children}
    </span>
  )
}

type DataInkRatioExplanationProps = {
  fadeDuration?: number
} & React.ComponentPropsWithoutRef<'span'>
function DataInkRatioExplanation({
  fadeDuration = 60,
  ...props
}: DataInkRatioExplanationProps) {
  const { opacity } = useParagraphAttributes(0, fadeDuration)

  return (
    <>
      <span
        css={[
          tw`col-start-2`,
          css`
            opacity: ${opacity};
          `,
        ]}
      >
        =
      </span>
      <span
        css={[
          tw`col-start-3`,
          css`
            opacity: ${opacity};
          `,
        ]}
        {...props}
      />
    </>
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

type CustomSequenceProps = {
  children: React.ReactNode
  from: number
  durationInFrames?: number
  name?: string | undefined
  layout?: 'absolute-fill' | 'none' | undefined
}
function CustomSequence({
  from,
  durationInFrames = Infinity,
  name,
  layout = 'none',
  children,
}: CustomSequenceProps) {
  return (
    <Sequence
      from={from}
      durationInFrames={durationInFrames}
      name={name}
      layout={layout}
    >
      {children}
    </Sequence>
  )
}
