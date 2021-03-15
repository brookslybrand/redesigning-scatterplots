/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import { customInterpolate } from '../../custom-remotion-utils'

type TitleProps = {
  fadeInDuration?: number
  fadeOutDuration?: number
} & React.ComponentPropsWithoutRef<'h1'>

export default function Title({
  fadeInDuration = 60,
  fadeOutDuration = 60,
  children,
  ...props
}: TitleProps) {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig() // paragraph exists as long as the duration
  const fadeOutStart = durationInFrames - fadeOutDuration
  if (fadeOutStart < fadeOutDuration) {
    throw new Error(`
    Not enough time allotted to transform or fade out.
    Fade out start: ${fadeOutStart}
    `)
  }

  const opacity =
    frame < fadeOutStart
      ? customInterpolate(frame, [0, fadeInDuration], [0, 1])
      : customInterpolate(
          frame,
          [fadeOutStart, fadeOutStart + fadeOutDuration],
          [1, 0]
        )

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
