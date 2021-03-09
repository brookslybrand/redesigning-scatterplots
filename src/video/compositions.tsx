import { Composition } from 'remotion'
/** @jsxImportSource @emotion/react */
import { GlobalStyles } from 'twin.macro'

export default function Compositions() {
  return (
    <>
      <GlobalStyles />
      <Composition
        id="into-my-own"
        component={() => (
          <div tw="w-full h-full bg-white text-center">
            <h1 tw="mt-16 text-6xl">Hi</h1>
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
