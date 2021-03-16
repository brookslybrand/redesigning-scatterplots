/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'
import { useTextTransitionAttributes } from './hooks'

export default function Citation() {
  const { opacity } = useTextTransitionAttributes(-1)
  return (
    <footer
      css={[
        tw`absolute text-2xl font-light text-gray-900 bottom-4 left-4 font-body`,
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
