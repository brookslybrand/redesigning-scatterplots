/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'

import CustomSequence from './components/custom-sequence'
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
  TicksFadeIn,
  TicksToRange,
  TicksFadeOut,
} from './components/plots'
import {
  dataInkTitle,
  dataInkText,
  scatterPlotTitle,
  scatterPlotText,
} from './data/text'
import { dataset1, dataset2 } from './data/plot-data'

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

// calculate when the paragraphs start and how long they will be
const titleDuration = 150
const textOverlap = 20
const scatterplotTextSequenceProps = scatterPlotText.map((text, idx) => {
  const durationInFrames = 200 // 400
  const from = plotFadeIn + (durationInFrames - textOverlap) * idx
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
      {/* title sequence */}
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
                            </>
                          )
                        }
                        case 4: {
                          return (
                            <>
                              <AxesFullToRange data={dataset2} />
                              <ScatterplotPoints data1={dataset2} />
                              <TicksToRange data={dataset2} />
                            </>
                          )
                        }
                        case 5: {
                          return (
                            <>
                              <AxesRange data={dataset2} />
                              <ScatterplotPoints data1={dataset2} />
                              <TicksFadeOut data={dataset2} />
                            </>
                          )
                        }
                        case 6: {
                          return (
                            <>
                              {/* TODO: change to AxesQuartile */}
                              <AxesRange data={dataset2} />
                              <ScatterplotPoints data1={dataset2} />
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
  dataInkDuration +
  scatterplotTextSequenceProps.reduce(
    (totalDuration, { from, durationInFrames }) =>
      Math.max(totalDuration, from + durationInFrames),
    0
  )

const paragraphCss = css`
  width: 750px;
`
