/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import * as d3 from 'd3'

import CustomSequence from './components/custom-sequence'
import {
  Citation,
  DataInkRatioFormula,
  Paragraph,
  Title,
} from './components/text'
import { useTextTransitionAttributes } from './components/text/hooks'
import {
  dataInkTitle,
  dataInkText,
  scatterPlotTitle,
  scatterPlotText,
} from './data/text'

// Constants
const widthHeightRatio = 36 / 51 // ratio of the width to the height as measured in the book
const plotWidth = 700
const plotHeight = plotWidth * widthHeightRatio

export default function RedesigningScatterPlots() {
  return (
    <article tw="w-full h-full bg-gray-yellow-200 flex flex-col items-center">
      <DataInkTextSequence />
      <RedesigningScatterplotsSequence />
      <Citation />
    </article>
  )
}

const dataInkDuration = 400
function DataInkTextSequence() {
  return (
    <CustomSequence
      from={0}
      durationInFrames={dataInkDuration}
      name="data-ink title and text"
    >
      <Container>
        <Title tw="my-24 text-center">{dataInkTitle}</Title>
        <CustomSequence
          from={30}
          durationInFrames={dataInkDuration - 30}
          name="data-ink text"
        >
          <Paragraph>
            {dataInkText}
            <CustomSequence from={120} name="data ink ratio formula">
              <DataInkRatioFormula />
            </CustomSequence>
          </Paragraph>
        </CustomSequence>
      </Container>
    </CustomSequence>
  )
}

const plotFadeIn = 40
function PlotPlaceholder() {
  const opacity = useTextTransitionAttributes(0, plotFadeIn)
  return (
    <div
      css={[
        tw`mt-16 mb-12 bg-transparent border-2 border-gray-red-400`,
        css`
          width: ${plotWidth}px;
          height: ${plotHeight}px;
          opacity: ${opacity};
        `,
      ]}
    />
  )
}

const xScale = d3.scaleLinear().domain([0, 100]).range([0, plotWidth])
const yScale = d3.scaleLinear().domain([0, 100]).range([plotHeight, 0])

const dataset1 = [
  [10, 12],
  [17, 13],
  [20, 10],
  [20, 18],
  [29, 28],
  [32, 21],
  [33, 26],
  [38, 80],
  [45, 26],
  [47, 30],
  [70, 70],
  [95, 70],
]

const line = d3
  .line()
  .x(([x]) => xScale(x))
  .y(([, y]) => yScale(y))
function Plot() {
  const opacity = useTextTransitionAttributes(0, plotFadeIn)

  const xAxis = line([
    [0, 0],
    [100, 0],
  ])
  const yAxis = line([
    [0, 100],
    [0, 0],
  ])

  if (xAxis === null || yAxis === null) {
    throw new Error(`xAxis ${xAxis} or yAxis ${yAxis} is null`)
  }

  return (
    <svg
      tw="mt-16 mb-12 "
      width={plotWidth}
      height={plotHeight}
      viewBox={`0 0 ${plotWidth} ${plotHeight}`}
    >
      <path tw="stroke-gray-900" strokeWidth={2} d={xAxis} />
      <path tw="stroke-gray-900" strokeWidth={2} d={yAxis} />

      {dataset1.map(([x, y]) => {
        console.log(xScale(x), yScale(y))
        return (
          <circle
            key={`${x}-${y}`}
            tw="fill-gray-900 "
            cx={xScale(x)}
            cy={yScale(y)}
            r={4}
          />
        )
      })}
    </svg>
  )
}

// calculate when the paragraphs start and how long they will be
const titleDuration = 150
const scatterplotTextSequenceProps = scatterPlotText.map((text, idx) => {
  const durationInFrames = 400
  const overlap = 20
  const from = plotFadeIn + (400 - overlap) * idx
  return {
    text,
    from,
    durationInFrames,
    name: `redesigning scatterplots text ${idx + 1}`,
  }
})

function RedesigningScatterplotsSequence() {
  return (
    <>
      <CustomSequence
        from={400}
        durationInFrames={titleDuration}
        name="redesigning scatterplots title"
      >
        <Container>
          <Title tw="my-24">{scatterPlotTitle}</Title>
        </Container>
      </CustomSequence>
      <CustomSequence
        from={400 + titleDuration - 20}
        name="scatterplot and text"
      >
        <Container>
          {/* <PlotPlaceholder /> */}
          <Plot />
          {scatterplotTextSequenceProps.map(({ text, ...props }) => {
            return (
              <CustomSequence key={props.name} {...props}>
                <Paragraph>{text}</Paragraph>
              </CustomSequence>
            )
          })}
        </Container>
      </CustomSequence>
    </>
  )
}

type ContainerProps = React.ComponentPropsWithoutRef<'section'>
function Container(props: ContainerProps) {
  return (
    <section
      css={[
        tw`absolute`,
        css`
          min-width: ${plotWidth}px;
        `,
      ]}
      {...props}
    />
  )
}

export const totalDuration =
  dataInkDuration +
  scatterplotTextSequenceProps.reduce(
    (totalDuration, { from, durationInFrames }) =>
      Math.max(totalDuration, from + durationInFrames),
    0
  )
