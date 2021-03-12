/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import parse from 'html-react-parser'
import { useTextTransitionAttributes } from './hooks'
import { Children } from 'react'

type ParagraphProps = {
  transformDuration?: number
  fadeDuration?: number
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<'p'>
export default function Paragraph({
  fadeDuration = 60,
  children,
  ...props
}: ParagraphProps) {
  const { opacity } = useTextTransitionAttributes(fadeDuration)

  return (
    <p
      css={[
        tw`absolute text-2xl font-light text-gray-900 font-body`,
        css`
          opacity: ${opacity};

          em {
            font-style: italic;
          }
        `,
      ]}
      {...props}
    >
      {Children.map(children, (child) => {
        if (typeof child === 'string') {
          return parse(child)
        } else {
          return child
        }
      })}
    </p>
  )
}
