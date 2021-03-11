/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import { useTextTransitionAttributes } from './hooks'

export default function Citation() {
  const { opacity } = useTextTransitionAttributes(0, 60)
  return (
    <footer
      css={[
        tw`absolute bottom-0 left-0 m-2 text-xl font-light text-gray-900 font-body`,
        css`
          opacity: ${opacity};
        `,
      ]}
    >
      Edward R. Tufte,{' '}
      <em tw="italic">The Visual Display of Quantitative Information</em> (2nd
      ed.). Graphics Press. 93, 130-132
    </footer>
  )
}
