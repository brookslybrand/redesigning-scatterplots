/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'

import CustomSequence from '../custom-sequence'
import DataInkRatioFormula from './data-ink-ratio-formula'
import { useParagraphAttributes } from './hooks'
import paragraphs from '../../data/paragraphs'

// calculate when the paragraphs start and how long they will be
const overlap = 30
const paragraphSequenceProps = paragraphs.map((text, idx) => {
  const durationInFrames = 400
  const from = durationInFrames * idx - overlap * idx
  return {
    text,
    from,
    durationInFrames,
    name: `paragraph ${idx + 1}`,
  }
})

export const totalDuration = paragraphSequenceProps.reduce(
  (totalDuration, { from, durationInFrames }) =>
    Math.max(totalDuration, from + durationInFrames),
  0
)

export default function Paragraphs() {
  return (
    <div tw="relative">
      {paragraphSequenceProps.map(({ text, ...props }, idx) => {
        return (
          <CustomSequence key={props.name} {...props}>
            <Text>
              {text}
              {idx === 0 ? (
                <CustomSequence from={120} name="data ink ratio formula">
                  <DataInkRatioFormula />
                </CustomSequence>
              ) : null}
            </Text>
          </CustomSequence>
        )
      })}
    </div>
  )
}

// Components

type TextProps = {
  transformDuration?: number
  fadeDuration?: number
  children: React.ReactNode
}
function Text({
  transformDuration = 50,
  fadeDuration = transformDuration + 10,
  children,
}: TextProps) {
  const { y, opacity } = useParagraphAttributes(transformDuration, fadeDuration)

  return (
    <p
      css={[
        tw`absolute text-2xl font-light text-gray-900 font-body`,
        css`
          transform: translateY(${y}px);
          opacity: ${opacity};
        `,
      ]}
    >
      {children}
    </p>
  )
}
