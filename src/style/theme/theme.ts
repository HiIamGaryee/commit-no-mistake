import { css, DefaultTheme, RuleSet } from "styled-components";

export const theme = {
  colors: {
    spaceCadet1: "#0A0F0D",
    spaceCadet2: "#0E1614",
    oxfordBlue: "#081210",
    delftBlue: "#133D32",
    white: "C2FFB3",
    black: "#000000",
    majorelleBlue: "00FF00",
    pictonBlue: "#39FF14",
    paleAzure: "#6AFF00",
    powderBlue: "#A3FFC0",
    success: "#01B574",
    danger: "#EE5D50",
    warning: "#FFCE20",
    frenchGray: "#8FD499",
    hover: "#00CC66",
    active: "#00994D",
  },
  typography: {
    fontFamily: `"DM Sans", sans-serif`,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  breakpoints: {
    xs: "480px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1440px",
    xxxl: "1600px",
  },
  transitions: {
    easeInOut: "all 0.9s ease-in-out",
  },
};

export const media: Record<
  keyof typeof theme.breakpoints,
  (styles: TemplateStringsArray) => RuleSet<object>
> = {
  xxxl: (styles) => css`
    @media (max-width: ${theme.breakpoints.xxxl}) {
      ${styles}
    }
  `,
  xxl: (styles) => css`
    @media (max-width: ${theme.breakpoints.xxl}) {
      ${styles}
    }
  `,
  xl: (styles) => css`
    @media (max-width: ${theme.breakpoints.xl}) {
      ${styles}
    }
  `,
  lg: (styles) => css`
    @media (max-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,
  md: (styles) => css`
    @media (max-width: ${theme.breakpoints.md}) {
      ${styles}
    }
  `,
  sm: (styles) => css`
    @media (max-width: ${theme.breakpoints.sm}) {
      ${styles}
    }
  `,
  xs: (styles) => css`
    @media (max-width: ${theme.breakpoints.xs}) {
      ${styles}
    }
  `,
};
