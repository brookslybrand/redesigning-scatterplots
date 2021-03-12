import { useCurrentFrame, useVideoConfig } from 'remotion'
import { customInterpolate } from '../../custom-remotion-utils'

export { useTextTransitionAttributes }

function useTextTransitionAttributes(
  transformDuration: number,
  fadeDuration: number
) {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig() // paragraph exists as long as the duration
  const transformOutStart = durationInFrames - transformDuration
  const fadeOutStart = durationInFrames - fadeDuration
  if (transformOutStart < transformDuration || fadeOutStart < fadeDuration) {
    throw new Error(`
    Not enough time allotted to transform or fade out.
    transform out start: ${transformOutStart}, fade out start: ${fadeOutStart}
    `)
  }

  const y = customInterpolate(
    frame,
    [0, transformDuration],
    [200, 0] // pixels
  )

  const opacity =
    frame < fadeOutStart
      ? customInterpolate(frame, [0, fadeDuration], [0, 1])
      : customInterpolate(
          frame,
          [fadeOutStart, fadeOutStart + fadeDuration],
          [1, 0]
        )

  return { y, opacity }
}
