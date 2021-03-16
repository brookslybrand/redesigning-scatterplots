import { useCurrentFrame, useVideoConfig } from 'remotion'
import { customInterpolate } from '../../custom-remotion-utils'

export { useTextTransitionAttributes }

function useTextTransitionAttributes(fadeDuration: number) {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig() // paragraph exists as long as the duration
  const fadeOutStart = durationInFrames - fadeDuration
  if (fadeOutStart < fadeDuration) {
    throw new Error(`
    Not enough time allotted to transform or fade out.
    Fade out start: ${fadeOutStart}
    `)
  }

  const opacity =
    frame < fadeOutStart
      ? customInterpolate(frame, [0, fadeDuration], [0, 1])
      : customInterpolate(
          frame,
          [fadeOutStart, fadeOutStart + fadeDuration],
          [1, 0]
        )

  return { opacity }
}
