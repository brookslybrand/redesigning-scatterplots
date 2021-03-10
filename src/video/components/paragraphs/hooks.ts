import { useCurrentFrame, interpolate, Easing, useVideoConfig } from 'remotion'

export { useParagraphAttributes }

const ease = Easing.bezier(0.25, 0.1, 0.25, 1.0)

function useParagraphAttributes(
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

  const interpolateConfig = {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  } as const

  const y = interpolate(
    frame,
    [0, transformDuration],
    [200, 0], // pixels
    interpolateConfig
  )

  const opacity =
    frame < fadeOutStart
      ? interpolate(frame, [0, fadeDuration], [0, 1], interpolateConfig)
      : interpolate(
          frame,
          [fadeOutStart, fadeOutStart + fadeDuration],
          [1, 0],
          interpolateConfig
        )

  return { y, opacity }
}
