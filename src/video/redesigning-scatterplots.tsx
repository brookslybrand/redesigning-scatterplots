/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'

import Paragraphs, {
  totalDuration as paragraphsTotalDuration,
} from './components/paragraphs'

const widthHeightRatio = 36 / 51 // ratio of the width to the height as measured in the book
const plotWidth = 700

export const totalDuration = paragraphsTotalDuration

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
        <Paragraphs />
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
