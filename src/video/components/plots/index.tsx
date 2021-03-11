/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import * as d3 from 'd3'

import { dataset1 } from '../../data/plot-data'
import { Easing, interpolate, useCurrentFrame } from 'remotion'

// Constants
const plotMargin = { top: 0, right: 292, bottom: 30, left: 180 }
const heightToWidthRatio = 36 / 51 // ratio of the width to the height as measured in the book

const svgWidth = 1300
const plotWidth = svgWidth - plotMargin.right - plotMargin.left // 700
const plotHeight = plotWidth * heightToWidthRatio
const svgHeight = plotHeight + plotMargin.top + plotMargin.bottom

export { PlotContainer, ScatterplotPoints, AxesFull, AxesFullToRange }

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

const plotFadeIn = 40
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

      {/* <text
        tw="text-xl text-gray-900 font-body"
        x={xScale(minX)}
        y={yScale(-2)}
        textAnchor="middle"
        alignmentBaseline="hanging"
      >
        min Xi
      </text>

      <text
        tw="text-xl text-gray-900 font-body"
        x={xScale(-2)}
        y={yScale(minY)}
        alignmentBaseline="middle"
        textAnchor="end"
      >
        min Yi
      </text>

      <text
        tw="text-xl text-gray-900 font-body"
        x={plotLabelX}
        y={yScale(0)}
        alignmentBaseline="middle"
      >
        Conventional Scatterplot
      </text> */}
    </svg>
  )
}

function PlotContainer({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, plotFadeIn], [0, 1], interpolateConfig)

  return (
    <svg
      css={[
        tw`mt-12 mb-12`,
        css`
          opacity: ${opacity};
        `,
      ]}
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      {children}
    </svg>
  )
}

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

type ScatterplotPointsProps = {
  data1: [number, number][]
  data2?: [number, number][]
}
/**
 * Create the scatterplot points
 * If a second dataset is provided, the points will automatically be transitioned
 */
function ScatterplotPoints({ data1 }: ScatterplotPointsProps) {
  return (
    <>
      {data1.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          tw="fill-gray-900 "
          cx={xScale(x)}
          cy={yScale(y)}
          r={4}
        />
      ))}
    </>
  )
}

function AxesFull() {
  const xAxis = line([
    [0, 0],
    [100, 0],
  ])
  const yAxis = line([
    [0, 0],
    [0, 100],
  ])

  if (xAxis === null || yAxis === null) {
    throw new Error(`xAxis ${xAxis} or yAxis ${yAxis} is null`)
  }

  return (
    <>
      <path tw="stroke-gray-900" strokeWidth={1} d={xAxis} />
      <path tw="stroke-gray-900" strokeWidth={1} d={yAxis} />
    </>
  )
}
function AxesFullToRange() {
  const frame = useCurrentFrame()

  const interpolateAxisValue = (range: [number, number]) => {
    return interpolate(frame, [40, 80], range, interpolateConfig)
  }

  if (
    minX === undefined ||
    maxX === undefined ||
    minY === undefined ||
    maxY === undefined
  ) {
    throw new Error('Failed to find extent(s) of dataset')
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
    <>
      <path tw="stroke-gray-900" strokeWidth={1} d={xAxis} />
      <path tw="stroke-gray-900" strokeWidth={1} d={yAxis} />
    </>
  )
}
