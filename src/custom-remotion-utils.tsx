import { interpolate, Easing, Sequence } from 'remotion'

export { CustomSequence, customInterpolate }

type CustomSequenceProps = {
  key?: React.Key
  children: React.ReactNode
  from: number
  durationInFrames?: number
  name?: string | undefined
  layout?: 'absolute-fill' | 'none' | undefined
}
/**
 * Remotion Sequence but with good defaults
 */
function CustomSequence({
  from,
  durationInFrames = Infinity,
  name,
  layout = 'none',
  children,
}: CustomSequenceProps) {
  return (
    <Sequence
      from={from}
      durationInFrames={durationInFrames}
      name={name}
      layout={layout}
    >
      {children}
    </Sequence>
  )
}

const ease = Easing.bezier(0.25, 0.1, 0.25, 1.0)
const interpolateConfig = {
  easing: ease,
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const

function customInterpolate(
  input: number,
  inputRange: [number, number],
  outputRange: [number, number]
) {
  return interpolate(input, inputRange, outputRange, interpolateConfig)
}
