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
import { Easing, interpolate, useCurrentFrame } from 'remotion'
import React from 'react'

// Constants
const plotMargin = { top: 0, right: 292, bottom: 30, left: 180 }
const heightToWidthRatio = 36 / 51 // ratio of the width to the height as measured in the book

const svgWidth = 1300
const plotWidth = svgWidth - plotMargin.right - plotMargin.left // 700
const plotHeight = plotWidth * heightToWidthRatio
const svgHeight = plotHeight + plotMargin.top + plotMargin.bottom

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
          <Paragraph css={paragraphCss}>
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

const ease = Easing.bezier(0.25, 0.1, 0.25, 1.0)
const interpolateConfig = {
  easing: ease,
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const

const xScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([plotMargin.left, plotWidth + plotMargin.left])
const yScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([plotHeight + plotMargin.top, plotMargin.top])
const line = d3
  .line()
  .x(([x]) => xScale(x))
  .y(([, y]) => yScale(y))

const plotLabelX = xScale(105)

function Plot() {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, plotFadeIn], [0, 1], interpolateConfig)

  const [minX, maxX] = d3.extent(dataset1.map(([x]) => x))
  const [minY, maxY] = d3.extent(dataset1.map(([, y]) => y))
  if (
    minX === undefined ||
    maxX === undefined ||
    minY === undefined ||
    maxY === undefined
  ) {
    throw new Error('Failed to find extent(s) of dataset')
  }

  const interpolateAxisValue = (range: [number, number]) => {
    return interpolate(frame, [460, 500], range, interpolateConfig)
  }
  const xAxisStart = interpolateAxisValue([0, minX])
  const xAxisEnd = interpolateAxisValue([100, maxX])
  const yAxisStart = interpolateAxisValue([0, minY])
  const yAxisEnd = interpolateAxisValue([100, maxY])

  const xAxis = line([
    [xAxisStart, 0],
    [xAxisEnd, 0],
  ])
  const yAxis = line([
    [0, yAxisStart],
    [0, yAxisEnd],
  ])

  if (xAxis === null || yAxis === null) {
    throw new Error(`xAxis ${xAxis} or yAxis ${yAxis} is null`)
  }

  return (
    <svg
      css={[
        tw`mt-12 mb-12 `,
        css`
          opacity: ${opacity};
        `,
      ]}
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <path tw="stroke-gray-900" strokeWidth={1} d={xAxis} />
      <path tw="stroke-gray-900" strokeWidth={1} d={yAxis} />

      {dataset1.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          tw="fill-gray-900 "
          cx={xScale(x)}
          cy={yScale(y)}
          r={4}
        />
      ))}

      {/* x label */}
      <text
        tw="text-xl text-gray-900 font-body"
        x={xScale(minX)}
        y={yScale(-2)}
        textAnchor="middle"
        alignmentBaseline="hanging"
      >
        min Xi
      </text>

      {/* y label */}
      <text
        tw="text-xl text-gray-900 font-body"
        x={xScale(-2)}
        y={yScale(minY)}
        alignmentBaseline="middle"
        textAnchor="end"
      >
        min Yi
      </text>

      {/* plot label */}
      <text
        tw="text-xl text-gray-900 font-body"
        x={plotLabelX}
        y={yScale(0)}
        alignmentBaseline="middle"
      >
        Conventional Scatterplot
      </text>
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

console.log(scatterplotTextSequenceProps)

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
                <Paragraph css={paragraphCss}>{text}</Paragraph>
              </CustomSequence>
            )
          })}
        </Container>
      </CustomSequence>
    </>
  )
}

function Container(props: React.ComponentPropsWithoutRef<'section'>) {
  return <section css={[tw`absolute`]} {...props} />
}

export const totalDuration =
  dataInkDuration +
  scatterplotTextSequenceProps.reduce(
    (totalDuration, { from, durationInFrames }) =>
      Math.max(totalDuration, from + durationInFrames),
    0
  )

const paragraphCss = [
  tw`transform -translate-x-1/2 left-1/2`,
  css`
    width: 750px;
  `,
]
