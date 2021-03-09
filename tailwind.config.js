const sm = '360px'
const md = '720px'
const lg = '1440px'

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: [
        'Poppins',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      // Note, Work Sans must be quoted per the docs: https://tailwindcss.com/docs/font-family/#font-families
      body: [
        '"Work Sans"',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      icon: ['"Anicons Regular"', 'sans-serif'],
    },
    screens: { sm, md, lg },
    // we often work svgs, so these are useful
    fill: (theme) => ({
      ...theme('colors'),
    }),
    stroke: (theme) => ({
      ...theme('colors'),
    }),
    // look up all default values here: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
    extend: {
      minWidth: (theme) => ({
        auto: 'auto',
        ...theme('spacing'),
      }),
      colors: {
        'matisse-red': {
          100: '#FF6356',
          200: '#E84234',
          300: '#C72A27',
          400: '#7B1F22',
        },
        copper: {
          100: '#FBD7B7',
          200: '#EABF9A',
          300: '#C9A17E',
          400: '#AB855E',
        },
        'scout-green': {
          100: '#A4A16E',
          200: '#788D5E',
          300: '#58623F',
          400: '#34483C',
        },
        'lichen-green': {
          100: '#BFF5DC',
          200: '#B1E9CF',
          300: '#88B6B3',
          400: '#478F8B',
        },
        'matisse-blue': {
          100: '#7697FF',
          200: '#5D77C7',
          300: '#435691',
          400: '#131C25',
        },
        'calico-orange': {
          100: '#FFC29F',
          200: '#E79669',
          300: '#DE7539',
          400: '#D85C16',
        },
        'gray-pink': {
          100: '#FFF4F3',
          200: '#CAB4B2',
          300: '#998381',
          400: '#302928',
        },
        'gray-yellow': {
          100: '#FFFEFD',
          200: '#FFF9F0',
          300: '#D2C6B4',
          400: '#A49989',
          500: '#7C7469',
          600: '#2C2925',
        },
        'gray-red': {
          100: '#FFFEFE',
          200: '#FFF5F3',
          300: '#DCBEBA',
          400: '#AE9390',
          500: '#846F6C',
          600: '#221D1D',
        },
        greenlight: '#82FFC3',
        black: '#000000',
        white: '#FFFFFF',
      },
    },
  },
  variants: {},
  plugins: [blTextUtilities],
}

function blTextUtilities({ addUtilities, theme, variants }) {
  const newUtilities = {
    '.bl-text-6xl': {
      fontSize: '4rem',
      fontWeight: '700',
      fontFamily: theme('fontFamily.display'),
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
    },
    '.bl-text-5xl': {
      fontSize: '3rem',
      fontWeight: '600',
      fontFamily: theme('fontFamily.display'),
      lineHeight: '1.1',
      letterSpacing: '-0.01em',
    },
    '.bl-text-4xl': {
      fontSize: '2.25rem',
      fontWeight: '500',
      fontFamily: theme('fontFamily.display'),
      lineHeight: '1.1',
      letterSpacing: '0em',
    },
    '.bl-text-3xl': {
      fontSize: '1.875rem',
      fontWeight: '400',
      fontFamily: theme('fontFamily.display'),
      lineHeight: '1.5',
      letterSpacing: '0em',
    },
    '.bl-text-2xl': {
      fontSize: '1.5rem',
      fontWeight: '300',
      fontFamily: theme('fontFamily.display'),
      lineHeight: '1.5',
      letterSpacing: '0em',
    },
    '.bl-text-xl': {
      fontSize: '1.25rem',
      fontWeight: '200',
      fontFamily: theme('fontFamily.display'),
      lineHeight: '1.5',
      letterSpacing: '0.02em',
    },
    '.bl-text-lg': {
      fontSize: '1.125rem',
      fontWeight: '500',
      fontFamily: theme('fontFamily.body'),
      lineHeight: '1.5',
      letterSpacing: '0.04em',
    },
    '.bl-text-base': {
      fontSize: '1rem',
      fontWeight: '400',
      fontFamily: theme('fontFamily.body'),
      lineHeight: '1.5',
      letterSpacing: '0.02em',
    },
    '.bl-text-sm': {
      fontSize: '.875rem',
      fontWeight: '300',
      fontFamily: theme('fontFamily.body'),
      lineHeight: '1.5',
      letterSpacing: '0.02em',
    },
    '.bl-text-xs': {
      fontSize: '.75rem',
      fontWeight: '400',
      fontFamily: theme('fontFamily.body'),
      lineHeight: '1.5',
      letterSpacing: '0.01em',
    },
  }
  addUtilities(newUtilities, {
    variants: variants('fontSize'), // use the default variants applied to fontSize
  })
}
