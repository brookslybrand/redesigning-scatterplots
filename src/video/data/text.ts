export const dataInkTitle = 'Data-Ink'
export const dataInkText = {
  text:
    'A large share of ink on a graphic should present data-information, the ink changing as the data change. <em>Data-ink</em> is the non-erasable core of a graphic, the non-redundant ink arranged in response to variation in the numbers represented. Then,',
  duration: 600,
}

export const scatterPlotTitle = 'Redesign of the Scatterplot'
export const scatterPlotText = [
  { text: 'Consider the standard bivariate scatterplot', duration: 150 },
  {
    text:
      'A useful fact, brought to notice by the maximization and erasing principles, is that the frame of a graphic can become an effective data-communicating element simply by erasing part of it. The frame lines should extend only to the measured limits of the data rather than, as is customary, to some arbitrary point like the next round number marking off the grid and grid ticks of the plot. That part of the frame exceeding the limits of the observed data is trimmed off:',
    duration: 600,
  },
  {
    text:
      'The result, a <em>range-frame</em>, explicitly shows the maximum and minimum of both variables plotted (along with the range), information available only by extrapolation and visual estimation in the conventional design. The data-ink ratio has increased: some non-data-ink has been erased, and the remainder of the frame, now carrying information, has gone over to the side of data-ink.',
    duration: 500,
  },
  {
    text: 'Nothing but the tails of the frame need change:',
    duration: 200,
  },
  {
    text:
      'A range-frame does not require any viewing or decoding instructions; it is not a graphical puzzle and most viewers can easily tell what is going on. Since it is more informative about the data in a clear and precise manner, the range-frame should replace the non-data-bearing frame in many graphical applications.',
    duration: 400,
  },
  {
    text:
      'A small shift in the remaining ink turns each range-frame into a quartile plot:',
    duration: 200,
  },
  {
    text:
      'Erasing and editing has led to the display of ten extra numbers (the minimum, maximum, two quartiles, and the median for both variables). The design is useful for analytical and exploratory data analysis, as well as for published graphics where summary characterizations of the marginal distributions have interest. The design is nearly always better than the conventionally framed scatterplot.',
    duration: 600,
  },
]
