import { Sequence } from 'remotion'

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
export default function CustomSequence({
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
