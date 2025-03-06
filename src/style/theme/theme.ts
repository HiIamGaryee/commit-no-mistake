import { css, DefaultTheme, RuleSet } from "styled-components";

export const theme = {
  colors: {
    spaceCadet1: "#111C44",
    spaceCadet2: "#1B254B",
    oxfordBlue: "#0B1437",
    delftBlue: "#293357",
    white: "#ffffff",
    black: "#000000",
    majorelleBlue: "#7551FF",
    pictonBlue: "#39B8FF",
    paleAzure: "#6AD2FF",
    powderBlue: "#A3AED0",
    success: "#01B574",
    danger: "#EE5D50",
    warning: "#FFCE20",
    frenchGray: "#C2CBDD",
    hover: "",
    active: "",
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
    easeInOut: "all 0.3s ease-in-out",
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
