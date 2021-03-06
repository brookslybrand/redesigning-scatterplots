/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'

import { CustomSequence } from './custom-remotion-utils'
import {
  Citation,
  DataInkRatioFormula,
  Paragraph,
  Title,
} from './components/text'
import {
  PlotContainer,
  ScatterplotPoints,
  AxesFull,
  AxesFullToRange,
  AxesRange,
  AxesRangeToFull,
  AxesRangeToQuartile,
  AxesQuartile,
  TicksFadeIn,
  TicksToRange,
  TicksFadeOut,
  PlotLabel,
  MinMaxLabels,
} from './components/plot'
import {
  dataInkTitle,
  dataInkText,
  scatterPlotTitle,
  scatterPlotText,
} from './data/text'
import { dataset1, dataset2, dataset3 } from './data/plot-data'

// give some breathing room before beginning to show everything

export default function RedesigningScatterPlots() {
  return (
    <article tw="flex flex-col items-center w-full h-full bg-gray-yellow-200">
      <DataInkTextSequence />
      <RedesigningScatterplotsSequence />
      <Citation />
    </article>
  )
}

function DataInkTextSequence() {
  return (
    <CustomSequence
      from={0}
      durationInFrames={dataInkText.duration}
      name="data-ink title and text"
    >
      <Container>
        <Title tw="my-24 text-center" fadeInDuration={-1}>
          {dataInkTitle}
        </Title>
        <CustomSequence
          from={dataInkText.startTransition}
          durationInFrames={dataInkText.duration - dataInkText.startTransition}
          name="data-ink text"
        >
          <ParagraphContainer>
            <Paragraph>
              {dataInkText.text}
              <CustomSequence from={200} name="data ink ratio formula">
                <DataInkRatioFormula />
              </CustomSequence>
            </Paragraph>
          </ParagraphContainer>
        </CustomSequence>
      </Container>
    </CustomSequence>
  )
}

// calculate when the paragraphs start and how long they will be
const titleDuration = 90
const textOverlap = 20
let previousEnd = 21
const scatterplotTextSequenceProps = scatterPlotText.map(
  ({ text, startTransition, duration }, idx) => {
    const from = previousEnd - textOverlap
    previousEnd = from + duration
    return {
      text,
      from,
      startTransition,
      durationInFrames: duration,
      name: `redesigning scatterplots text ${idx + 1}`,
    }
  }
)

function RedesigningScatterplotsSequence() {
  const firstTextSequenceProps = scatterplotTextSequenceProps[0]
  return (
    <>
      {/* title sequence */}
      <CustomSequence
        from={dataInkText.duration}
        durationInFrames={
          titleDuration + firstTextSequenceProps.durationInFrames
        }
        name="redesigning scatterplots title"
      >
        <Container>
          <Title tw="my-24">{scatterPlotTitle}</Title>
        </Container>
      </CustomSequence>
      <CustomSequence
        from={dataInkText.duration + titleDuration}
        name="scatterplot and text"
      >
        <Container>
          {/* text */}
          <ParagraphContainer tw="flex items-end">
            {scatterplotTextSequenceProps.map(({ text, ...props }) => {
              return (
                <CustomSequence key={props.name} {...props}>
                  <Paragraph>{text}</Paragraph>
                </CustomSequence>
              )
            })}
          </ParagraphContainer>

          {/* <PlotPlaceholder /> */}
          {/* <Plot /> */}

          {/* plot - only fade in on the first paragraph */}
          <PlotContainer>
            {/* initial plot */}
            <CustomSequence
              from={0}
              durationInFrames={firstTextSequenceProps.from}
            >
              <AxesFull />
              <ScatterplotPoints
                startTransition={firstTextSequenceProps.startTransition}
                data1={dataset1}
              />
            </CustomSequence>

            {scatterplotTextSequenceProps.map(
              ({ from, startTransition, durationInFrames }, idx) => {
                const name = `plot ${idx}`
                return (
                  <CustomSequence
                    key={name}
                    from={from}
                    // remove the overlap so the plot doesn't overlay itself
                    durationInFrames={durationInFrames - textOverlap}
                    name={name}
                  >
                    <ScatterPlotElements
                      startTransition={startTransition}
                      paragraphNumber={idx}
                    />
                  </CustomSequence>
                )
              }
            )}
          </PlotContainer>
        </Container>
      </CustomSequence>
    </>
  )
}

type ScatterPlotElementsProps = {
  startTransition: number
  paragraphNumber: number
}
function ScatterPlotElements({
  startTransition,
  paragraphNumber,
}: ScatterPlotElementsProps) {
  switch (paragraphNumber) {
    case 0: {
      return (
        <>
          <AxesFull />
          <ScatterplotPoints
            startTransition={startTransition}
            data1={dataset1}
          />
        </>
      )
    }
    case 1: {
      return (
        <>
          <AxesFullToRange startTransition={startTransition} data={dataset1} />
          <ScatterplotPoints
            startTransition={startTransition}
            data1={dataset1}
          />
        </>
      )
    }
    case 2: {
      return (
        <>
          <AxesRange startTransition={startTransition} data={dataset1} />
          <ScatterplotPoints
            startTransition={startTransition}
            data1={dataset1}
          />
          <MinMaxLabels startTransition={startTransition} data={dataset1} />
        </>
      )
    }
    case 3: {
      return (
        <>
          {/* use dataset 1 here for the axes so the transition is right */}
          <AxesRangeToFull startTransition={startTransition} data={dataset1} />
          <ScatterplotPoints
            startTransition={startTransition}
            data1={dataset1}
            data2={dataset2}
          />
          <TicksFadeIn startTransition={startTransition} />
          <PlotLabel startTransition={startTransition}>
            Conventional Scatterplot
          </PlotLabel>
        </>
      )
    }
    case 4: {
      return (
        <>
          <AxesFullToRange startTransition={startTransition} data={dataset2} />
          <ScatterplotPoints
            startTransition={startTransition}
            data1={dataset2}
          />
          <TicksToRange startTransition={startTransition} data={dataset2} />
          <PlotLabel startTransition={startTransition}>Range-Frame</PlotLabel>
        </>
      )
    }
    case 5: {
      return (
        <>
          {/* TODO: add transition for axes range */}
          <AxesRangeToQuartile
            startTransition={startTransition}
            data1={dataset2}
            data2={dataset3}
          />
          <ScatterplotPoints
            startTransition={startTransition}
            data1={dataset2}
            data2={dataset3}
          />
          {/* this is still dataset 2 since that's what it was in the previous sequence */}
          <TicksFadeOut data={dataset2} />
        </>
      )
    }
    case 6: {
      return (
        <>
          <AxesQuartile startTransition={startTransition} data={dataset3} />
          <ScatterplotPoints
            startTransition={startTransition}
            data1={dataset3}
          />
        </>
      )
    }
    default: {
      return null
    }
  }
}

function Container(props: React.ComponentPropsWithoutRef<'section'>) {
  return <section css={[tw`absolute`]} {...props} />
}

export const totalDuration =
  dataInkText.duration +
  scatterplotTextSequenceProps.reduce(
    (totalDuration, { from, durationInFrames }) =>
      Math.max(totalDuration, from + durationInFrames),
    0
  )

function ParagraphContainer(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      css={[
        tw`relative mt-16 left-1/2`,
        css`
          transform: translateX(-50%);
          width: 850px;
          height: 250px; /* hardcoded after inspecting */
        `,
      ]}
      {...props}
    />
  )
}
