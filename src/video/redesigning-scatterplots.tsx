/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import { useCurrentFrame, useVideoConfig } from 'remotion'

import { CustomSequence, customInterpolate } from './custom-remotion-utils'
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
} from './components/plots'
import {
  dataInkTitle,
  dataInkText,
  scatterPlotTitle,
  scatterPlotText,
} from './data/text'
import { dataset1, dataset2, dataset3 } from './data/plot-data'

export default function RedesigningScatterPlots() {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  const fadeOutStart = durationInFrames - 60

  return (
    <article
      css={[
        tw`flex flex-col items-center w-full h-full bg-gray-yellow-200`,
        // fade out all the children at the end
        frame >= fadeOutStart
          ? css`
              * {
                opacity: ${customInterpolate(
                  frame,
                  [fadeOutStart, durationInFrames],
                  [1, 0]
                )};
              }
            `
          : null,
      ]}
    >
      <DataInkTextSequence />
      <RedesigningScatterplotsSequence />
      <Citation />
    </article>
  )
}

// give some breathing room before beginning to show everything
const startDelay = 30
function DataInkTextSequence() {
  return (
    <CustomSequence
      from={startDelay}
      durationInFrames={dataInkText.duration}
      name="data-ink title and text"
    >
      <Container>
        <Title tw="my-24 text-center">{dataInkTitle}</Title>
        <CustomSequence
          from={40}
          durationInFrames={dataInkText.duration - 40}
          name="data-ink text"
        >
          <Paragraph css={paragraphCss}>
            {dataInkText.text}
            <CustomSequence from={250} name="data ink ratio formula">
              <DataInkRatioFormula />
            </CustomSequence>
          </Paragraph>
        </CustomSequence>
      </Container>
    </CustomSequence>
  )
}

// calculate when the paragraphs start and how long they will be
const titleDuration = 150
const textOverlap = 20
let previousEnd = 40
const scatterplotTextSequenceProps = scatterPlotText.map(
  ({ text, duration }, idx) => {
    const durationInFrames = duration
    const from = previousEnd - textOverlap
    previousEnd = from + durationInFrames
    return {
      text,
      from,
      durationInFrames,
      name: `redesigning scatterplots text ${idx + 1}`,
    }
  }
)

function RedesigningScatterplotsSequence() {
  return (
    <>
      {/* title sequence */}
      <CustomSequence
        from={startDelay + dataInkText.duration}
        durationInFrames={titleDuration}
        name="redesigning scatterplots title"
      >
        <Container>
          <Title tw="my-24">{scatterPlotTitle}</Title>
        </Container>
      </CustomSequence>
      <CustomSequence
        from={startDelay + dataInkText.duration + titleDuration - 30}
        name="scatterplot and text"
      >
        <Container>
          {/* <PlotPlaceholder /> */}
          {/* <Plot /> */}

          {/* plot - only fade in on the first paragraph */}
          <PlotContainer>
            {/* initial plot */}
            <CustomSequence
              from={0}
              durationInFrames={scatterplotTextSequenceProps[0].from}
            >
              <AxesFull />
              <ScatterplotPoints data1={dataset1} />
            </CustomSequence>

            {scatterplotTextSequenceProps.map(
              ({ from, durationInFrames }, idx) => {
                const name = `plot ${idx}`
                return (
                  <CustomSequence
                    key={name}
                    from={from}
                    // remove the overlap so the plot doesn't overlay itself
                    durationInFrames={durationInFrames - textOverlap}
                    name={name}
                  >
                    {(() => {
                      switch (idx) {
                        case 0: {
                          return (
                            <>
                              <AxesFull />
                              <ScatterplotPoints data1={dataset1} />
                            </>
                          )
                        }
                        case 1: {
                          return (
                            <>
                              <AxesFullToRange data={dataset1} />
                              <ScatterplotPoints data1={dataset1} />
                            </>
                          )
                        }
                        case 2: {
                          return (
                            <>
                              <AxesRange data={dataset1} />
                              <ScatterplotPoints data1={dataset1} />
                              <MinMaxLabels data={dataset1} />
                            </>
                          )
                        }
                        case 3: {
                          return (
                            <>
                              {/* use dataset 1 here for the axes so the transition is right */}
                              <AxesRangeToFull data={dataset1} />
                              <ScatterplotPoints
                                data1={dataset1}
                                data2={dataset2}
                              />
                              <TicksFadeIn />
                              <PlotLabel>Conventional Scatterplot</PlotLabel>
                            </>
                          )
                        }
                        case 4: {
                          return (
                            <>
                              <AxesFullToRange data={dataset2} />
                              <ScatterplotPoints data1={dataset2} />
                              <TicksToRange data={dataset2} />
                              <PlotLabel>Range-Frame</PlotLabel>
                            </>
                          )
                        }
                        case 5: {
                          return (
                            <>
                              {/* TODO: add transition for axes range */}
                              <AxesRangeToQuartile
                                data1={dataset2}
                                data2={dataset3}
                              />
                              <ScatterplotPoints
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
                              <AxesQuartile data={dataset3} />
                              <ScatterplotPoints data1={dataset3} />
                            </>
                          )
                        }
                        default: {
                          return null
                        }
                      }
                    })()}
                  </CustomSequence>
                )
              }
            )}
          </PlotContainer>

          {/* text */}
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
  startDelay +
  dataInkText.duration +
  scatterplotTextSequenceProps.reduce(
    (totalDuration, { from, durationInFrames }) =>
      Math.max(totalDuration, from + durationInFrames),
    0
  )

const paragraphCss = css`
  width: 750px;
`
