/** @jsxImportSource @emotion/react */
import tw, { css } from 'twin.macro'

import { CustomSequence } from '../../custom-remotion-utils'
import { useTextTransitionAttributes } from './hooks'

export default function DataInkRatioFormula() {
  return (
    <DataInkRatioFormulaGrid>
      <DataInkRatioExplanation tw="flex flex-col items-center" fadeDuration={0}>
        <span>data-ink</span>
        <span tw="border-t-2 border-gray-red-400 w-full" />
        <span>total ink used to print the graphic</span>
      </DataInkRatioExplanation>
      <CustomSequence from={90} name="formula 2">
        <DataInkRatioExplanation tw="flex flex-col items-center">
          proportion of graphic's ink devoted to the non-redundant display of
          data-information
        </DataInkRatioExplanation>
      </CustomSequence>
      <CustomSequence from={180} name="formula 3">
        <DataInkRatioExplanation tw="flex flex-col items-center">
          1.0 - proportion of a graphic that can be erased without loss of
          data-information.
        </DataInkRatioExplanation>
      </CustomSequence>
    </DataInkRatioFormulaGrid>
  )
}

type DataInkRatioFormulaGridProps = {
  fadeDuration?: number
  children?: React.ReactNode
}
function DataInkRatioFormulaGrid({
  fadeDuration = 60,
  children,
}: DataInkRatioFormulaGridProps) {
  const { opacity } = useTextTransitionAttributes(fadeDuration)

  return (
    <span
      css={[
        tw`grid items-center mt-8 gap-x-4 gap-y-12`,
        css`
          opacity: ${opacity};
          grid-template-columns: min-content min-content auto;
        `,
      ]}
    >
      <span tw="whitespace-nowrap">Data-ink ratio</span>
      {children}
    </span>
  )
}

type DataInkRatioExplanationProps = {
  fadeDuration?: number
} & React.ComponentPropsWithoutRef<'span'>
function DataInkRatioExplanation({
  fadeDuration = 60,
  ...props
}: DataInkRatioExplanationProps) {
  const { opacity } = useTextTransitionAttributes(fadeDuration)

  return (
    <>
      <span
        css={[
          tw`col-start-2`,
          css`
            opacity: ${opacity};
          `,
        ]}
      >
        =
      </span>
      <span
        css={[
          tw`col-start-3`,
          css`
            opacity: ${opacity};
          `,
        ]}
        {...props}
      />
    </>
  )
}
