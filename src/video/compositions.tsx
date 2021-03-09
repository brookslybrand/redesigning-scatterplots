import { Composition } from 'remotion'
import { GlobalStyles } from 'twin.macro'

export default function Compositions() {
  return (
    <>
      <GlobalStyles />
      <Composition
        id="into-my-own"
        component={() => (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              textAlign: 'center',
            }}
          >
            <h1 style={{ margin: '2rem', fontSize: '4rem' }}>Hi</h1>
          </div>
        )}
        durationInFrames={17 * (30 + 45)} // This could probably be more data driven, but whatever
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
