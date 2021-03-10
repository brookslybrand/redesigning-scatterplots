/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'

import CustomSequence from '../custom-sequence'
import DataInkRatioFormula from './data-ink-ratio-formula'
import { useParagraphAttributes } from './hooks'

export default function Paragraphs() {
  return (
    <div tw="relative">
      <CustomSequence from={0} durationInFrames={400} name="paragraph 1">
        <Text>
          {text}
          <CustomSequence from={120} name="formula 1">
            <DataInkRatioFormula />
          </CustomSequence>
        </Text>
      </CustomSequence>
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
          transform: translateY(${y}%);
          opacity: ${opacity};
        `,
      ]}
    >
      {children}
    </p>
  )
}

const text =
  'A large share of ink on a graphic should present data-information, the ink changing as the data change. *Data-ink* is the non-erasable core of a graphic, the non-redundant ink arranged in response to variation in the numbers represented. Then,'
