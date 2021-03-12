/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import * as d3 from 'd3'

import { dataset1, dataset2 } from '../../data/plot-data'
import { Easing, interpolate, useCurrentFrame } from 'remotion'

type Coordinates = [number, number]
type Dataset = Coordinates[]

export {
  PlotContainer,
  ScatterplotPoints,
  AxesFull,
  AxesFullToRange,
  AxesRangeToFull,
  AxesRange,
  Ticks,
  TicksFadeIn,
  TicksFadeOut,
}

// constants

const plotMargin = { top: 0, right: 292, bottom: 30, left: 180 }
const heightToWidthRatio = 36 / 51 // ratio of the width to the height as measured in the book

const svgWidth = 1300
const plotWidth = svgWidth - plotMargin.right - plotMargin.left // 700
const plotHeight = plotWidth * heightToWidthRatio
const svgHeight = plotHeight + plotMargin.top + plotMargin.bottom
const numberOfXTicks = 6
const numberOfYTicks = 7

const ease = Easing.bezier(0.25, 0.1, 0.25, 1.0)
const interpolateConfig = {
  easing: ease,
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const

// assume that the data points are in a range from 0-100
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

// components

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

type ScatterplotPointsProps = {
  data1: Dataset
  data2?: Dataset
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

function AxesFullToRange({ data }: { data: Dataset }) {
  const frame = useCurrentFrame()
  const extents = getExtents(data)

  const minX = interpolateAttribute(frame, [0, extents.minX])
  const maxX = interpolateAttribute(frame, [100, extents.maxX])
  const minY = interpolateAttribute(frame, [0, extents.minY])
  const maxY = interpolateAttribute(frame, [100, extents.maxY])

  const { xAxis, yAxis } = createAxesLines({ minX, minY, maxX, maxY })

  return (
    <>
      <path tw="stroke-gray-900" strokeWidth={1} d={xAxis} />
      <path tw="stroke-gray-900" strokeWidth={1} d={yAxis} />
    </>
  )
}

function AxesRangeToFull({ data }: { data: Dataset }) {
  const frame = useCurrentFrame()
  const extents = getExtents(data)

  const minX = interpolateAttribute(frame, [extents.minX, 0])
  const maxX = interpolateAttribute(frame, [extents.maxX, 100])
  const minY = interpolateAttribute(frame, [extents.minY, 0])
  const maxY = interpolateAttribute(frame, [extents.maxY, 100])

  const { xAxis, yAxis } = createAxesLines({ minX, minY, maxX, maxY })

  return (
    <>
      <path tw="stroke-gray-900" strokeWidth={1} d={xAxis} />
      <path tw="stroke-gray-900" strokeWidth={1} d={yAxis} />
    </>
  )
}

function AxesRange({ data }: { data: Dataset }) {
  const { xAxis, yAxis } = createAxesLines(getExtents(data))
  return (
    <>
      <path tw="stroke-gray-900" strokeWidth={1} d={xAxis} />
      <path tw="stroke-gray-900" strokeWidth={1} d={yAxis} />
    </>
  )
}

function Ticks({ data }: { data: Dataset }) {
  const { minX, minY } = getExtents(data)
  const xTicks = useMergeTicks(createXTickPaths(), createXTickPaths({ minX }))
  const yTicks = useMergeTicks(createYTickPaths(), createYTickPaths({ minY }))

  return (
    <g css={[tw`stroke-gray-900`]}>
      {xTicks.map(({ d, opacity }) => (
        <path
          key={d}
          css={css`
            opacity: ${opacity};
          `}
          strokeWidth={1}
          d={d}
        />
      ))}
      {yTicks.map(({ d, opacity }) => (
        <path
          key={d}
          css={css`
            opacity: ${opacity};
          `}
          strokeWidth={1}
          d={d}
        />
      ))}
    </g>
  )
}

function TicksFadeIn() {
  const frame = useCurrentFrame()
  const opacity = interpolateAttribute(frame, [0, 1])

  const xTickPaths = createXTickPaths()
  const yTickPaths = createYTickPaths()

  return (
    <g
      css={[
        tw`stroke-gray-900`,
        css`
          opacity: ${opacity};
        `,
      ]}
    >
      {xTickPaths.map((d) => (
        <path key={d} strokeWidth={1} d={d} />
      ))}
      {yTickPaths.map((d) => (
        <path key={d} strokeWidth={1} d={d} />
      ))}
    </g>
  )
}

function TicksFadeOut({ data }: { data: Dataset }) {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 40], [1, 0], interpolateConfig)
  const { minX, minY } = getExtents(data)
  const xTickPaths = createXTickPaths({ minX })
  const yTickPaths = createYTickPaths({ minY })

  return (
    <g
      css={[
        tw`stroke-gray-900`,
        css`
          opacity: ${opacity};
        `,
      ]}
    >
      {xTickPaths.map((d) => (
        <path key={d} strokeWidth={1} d={d} />
      ))}
      {yTickPaths.map((d) => (
        <path key={d} strokeWidth={1} d={d} />
      ))}
    </g>
  )
}

// logic/hooks

function useMergeTicks(ticks1: string[], ticks2: string[]) {
  const frame = useCurrentFrame()

  const opacityIn = interpolateAttribute(frame, [0, 1])
  const opacityOut = interpolateAttribute(frame, [1, 0])

  return (
    ticks1
      .map((d, idx) => {
        // if the index is out of range fade the line out
        return { d, opacity: ticks2[idx] === undefined ? opacityOut : 1 }
      })
      // add all the coordinates remaining in the second dataset
      .concat(
        ticks2.slice(ticks1.length).map((d) => {
          return { d, opacity: opacityIn }
        })
      )
  )
}

function useMergeScatterplotPoints(data1: Dataset, data2?: Dataset) {
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

/**
 * Simple interpolate function that has a default frame range and config
 * @param frame
 * @param range
 * @returns
 */
function interpolateAttribute(frame: number, range: Coordinates) {
  return interpolate(frame, [40, 80], range, interpolateConfig)
}

function getExtents(data: Dataset) {
  const [minX, maxX] = d3.extent(data.map(([x]) => x))
  const [minY, maxY] = d3.extent(data.map(([, y]) => y))
  if (
    minX === undefined ||
    maxX === undefined ||
    minY === undefined ||
    maxY === undefined
  ) {
    throw new Error('Failed to find extent(s) of dataset')
  }

  return { minX, minY, maxX, maxY }
}

function createAxesLines({
  minX,
  minY,
  maxX,
  maxY,
}: ReturnType<typeof getExtents>) {
  const xAxis = line([
    [minX, 0],
    [maxX, 0],
  ])
  const yAxis = line([
    [0, minY],
    [0, maxY],
  ])

  if (xAxis === null || yAxis === null) {
    throw new Error(`xAxis ${xAxis} or yAxis ${yAxis} is null`)
  }

  return { xAxis, yAxis }
}

/**
 * Creates d paths for the x axis ticks, cutting off any before min x or after max x
 * @param minX the minimum x value to cutoff any ticks
 * @param maxX the minimum x value to cutoff any ticks
 * @returns string[] of path strings for a <path> element's d attribute
 */
function createXTickPaths(
  { minX = xScale.domain()[0], maxX = xScale.domain()[1] } = {
    minX: xScale.domain()[0],
    maxX: xScale.domain()[1],
  }
) {
  if (minX === undefined) {
    minX = 0
  }
  let [xTicksStart, xTicksEnd] = xScale.range()
  let yStart = yScale.range()[0]
  const yEnd = yScale.invert(yStart + 10)
  yStart = yScale.invert(yStart)
  xTicksStart += (xTicksEnd - xTicksStart) * 0.05 // start 5% in like Tufte does
  const xTickSpace = (xTicksEnd - xTicksStart) / (numberOfXTicks - 1)
  let xTickPaths: string[] = []
  for (let i = 0; i < numberOfXTicks; i++) {
    const xStart = xScale.invert(xTicksStart + xTickSpace * i)
    if (xStart < minX || xStart > maxX) continue
    const tickPath = line([
      [xStart, yStart],
      [xStart, yEnd],
    ])
    if (tickPath === null) {
      throw new Error('Something went wrong, tick path cannot be null')
    }
    xTickPaths[i] = tickPath
  }

  return xTickPaths
}

/**
 * Creates d paths for the y axis ticks, cutting off any before min y or after max y
 * @param minY the minimum y value to cutoff any ticks
 * @param mxyY the minimum y value to cutoff any ticks
 * @returns string[] of path strings for a <path> element's d attribute
 */
function createYTickPaths(
  { minY = yScale.domain()[0], maxY = yScale.domain()[1] } = {
    minY: yScale.domain()[0],
    maxY: yScale.domain()[1],
  }
) {
  let [yTicksStart, yTicksEnd] = yScale.range()
  let xStart = xScale.range()[0]
  const xEnd = xScale.invert(xStart - 10)
  xStart = xScale.invert(xStart)
  yTicksStart += (yTicksEnd - yTicksStart) * 0.05 // start 5% in like Tufte does
  const yTickSpace = (yTicksEnd - yTicksStart) / (numberOfYTicks - 1)
  let yTickPaths: string[] = []
  for (let i = 0; i < numberOfYTicks; i++) {
    const yStart = yScale.invert(yTicksStart + yTickSpace * i)
    const tickPath = line([
      [xStart, yStart],
      [xEnd, yStart],
    ])
    if (yStart < minY || yStart > maxY) continue
    if (tickPath === null) {
      throw new Error('Something went wrong, tick path cannot be null')
    }
    yTickPaths[i] = tickPath
  }

  return yTickPaths
}
