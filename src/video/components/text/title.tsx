/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'

import { useTextTransitionAttributes } from './hooks'

type TitleProps = {
  fadeDuration?: number
} & React.ComponentPropsWithoutRef<'h1'>

export default function Title({
  fadeDuration = 60,
  children,
  ...props
}: TitleProps) {
  const { opacity } = useTextTransitionAttributes(fadeDuration)
  return (
    <h1
      css={[
        tw`text-6xl text-gray-900 font-display`,
        css`
          opacity: ${opacity};
        `,
      ]}
      {...props}
    >
      {children}
    </h1>
  )
}
