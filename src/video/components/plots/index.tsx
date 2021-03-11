/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import * as d3 from 'd3'

import { dataset1 } from '../../data/plot-data'
import { Easing, interpolate, useCurrentFrame } from 'remotion'

type Coordinates = [number, number]

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

  const interpolateAxisValue = (range: Coordinates) => {
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

function useMergeScatterplotPoints(
  data1: Coordinates[],
  data2?: Coordinates[]
) {
  const frame = useCurrentFrame()

  // if there is no data2, only use data1
  if (data2 === undefined) {
    return data1.map(([x, y]) => ({ cx: x, cy: y, opacity: 1 }))
  }

  const opacityIn = interpolateAttribute(frame, [0, 1])
  const opacityOut = interpolateAttribute(frame, [1, 0])

  return (
    data1
      .map(([x1, y1], idx) => {
        const coordinates2 = data2[idx]
        // if the index is out of range fade the point out
        if (coordinates2 === undefined) {
          return { cx: x1, cy: y1, opacity: opacityOut }
        }
        const [x2, y2] = coordinates2
        // reposition points with the same index
        return {
          cx: interpolateAttribute(frame, [x1, x2]),
          cy: interpolateAttribute(frame, [y1, y2]),
          opacity: 1,
        }
      })
      // add all the coordinates remaining in the second dataset
      .concat(
        data2.slice(data1.length).map(([x, y]) => {
          return { cx: x, cy: y, opacity: opacityIn }
        })
      )
  )
}

type ScatterplotPointsProps = {
  data1: Coordinates[]
  data2?: Coordinates[]
}
/**
 * Create the scatterplot points
 * If a second dataset is provided, the points will automatically be transitioned
 */
function ScatterplotPoints({ data1, data2 }: ScatterplotPointsProps) {
  const data = useMergeScatterplotPoints(data1, data2)

  return (
    <>
      {data.map(({ cx, cy, opacity }) => (
        <circle
          key={`${cx}-${cy}`}
          css={[
            tw`fill-gray-900`,
            css`
              opacity: ${opacity};
            `,
          ]}
          cx={xScale(cx)}
          cy={yScale(cy)}
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

  if (
    minX === undefined ||
    maxX === undefined ||
    minY === undefined ||
    maxY === undefined
  ) {
    throw new Error('Failed to find extent(s) of dataset')
  }

  const xAxisStart = interpolateAttribute(frame, [0, minX])
  const xAxisEnd = interpolateAttribute(frame, [100, maxX])
  const yAxisStart = interpolateAttribute(frame, [0, minY])
  const yAxisEnd = interpolateAttribute(frame, [100, maxY])

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

/**
 * Simple interpolate function that has a default frame range and config
 * @param frame
 * @param range
 * @returns
 */
function interpolateAttribute(frame: number, range: Coordinates) {
  return interpolate(frame, [40, 80], range, interpolateConfig)
}
