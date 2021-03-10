import { Composition } from 'remotion'
import { GlobalStyles } from 'twin.macro'
import RedesigningScatterPlots, {
  totalDuration,
} from './redesigning-scatterplots'

// add the font-faces
import './styles/globals.css'

export default function Compositions() {
  return (
    <>
      <GlobalStyles />
      <Composition
        id="redesigning-scatterplots"
        component={RedesigningScatterPlots}
        durationInFrames={totalDuration}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
