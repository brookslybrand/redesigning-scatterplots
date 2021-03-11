/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'

import { useTextTransitionAttributes } from './hooks'

type ParagraphProps = {
  transformDuration?: number
  fadeDuration?: number
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<'p'>
export default function Paragraph({
  transformDuration = 50,
  fadeDuration = transformDuration + 10,
  children,
  ...props
}: ParagraphProps) {
  const { y, opacity } = useTextTransitionAttributes(
    transformDuration,
    fadeDuration
  )

  return (
    <p
      css={[
        tw`absolute text-2xl font-light text-gray-900 font-body`,
        css`
          transform: translateY(${y}px);
          opacity: ${opacity};
        `,
      ]}
      {...props}
    >
      {children}
    </p>
  )
}
